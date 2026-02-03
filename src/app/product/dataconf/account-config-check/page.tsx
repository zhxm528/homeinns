'use client';
import '@ant-design/v5-patch-for-react-19';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import { Button, DatePicker, Form, Table, Row, Col, Space, Input, message, Select, ConfigProvider } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import zhCN from 'antd/locale/zh_CN';
// @ts-ignore: xlsx types might be missing
import * as XLSX from 'xlsx';

type AccountConfigRow = {
  hotelid: string;
  hotelName: string;
  class1: string;
  descript1: string;
  dept: string;
  deptname: string;
  __type?: 'total' | 'normal';
};

type ApiResponse = {
  success: boolean;
  data: {
    message: string;
    params: Record<string, string>;
    timestamp: string;
    total: number;
    items: AccountConfigRow[];
    options?: {
      hotelCodes?: Array<{ label: string; value: string }>;
    };
  } | null;
  message: string;
  error?: string;
};

export default function AccountConfigCheckPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [generating, setGenerating] = useState<boolean>(false);
  const [exporting, setExporting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<AccountConfigRow[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [hotelCodeOptions, setHotelCodeOptions] = useState<Array<{ label: string; value: string }>>([]);
  const [hotelOptionsLoading, setHotelOptionsLoading] = useState<boolean>(true);

  const columns: ColumnsType<AccountConfigRow> = useMemo(() => [
    { title: '酒店代码', dataIndex: 'hotelid', key: 'hotelid', fixed: 'left', width: 120 },
    { title: '酒店名称', dataIndex: 'hotelName', key: 'hotelName', width: 200 },
    { title: '科目代码', dataIndex: 'class1', key: 'class1', width: 150 },
    { title: '科目名称', dataIndex: 'descript1', key: 'descript1', width: 200 },
    { title: '部门代码', dataIndex: 'dept', key: 'dept', width: 120 },
    { title: '部门名称', dataIndex: 'deptname', key: 'deptname', width: 120 },
  ], []);
  const breadcrumbItems = useMemo(
    () => [
      { label: '首页', href: '/' },
      { label: '中央预订CRS', href: '/crs' },
      { label: '酒店财务', href: '/crs/finance' },
      { label: '科目配置' },
    ],
    []
  );

  const fetchData = async (override?: Partial<{ page: number; pageSize: number }>) => {
    const values = form.getFieldsValue();
    const p = override?.page ?? page;
    const ps = override?.pageSize ?? pageSize;
    const params = new URLSearchParams();
    if (values.bDate) params.set('bDate', dayjs(values.bDate).format('YYYY-MM-DD'));
    if (values.days) params.set('days', String(values.days));
    if (values.hotelCode) params.set('hotelCode', values.hotelCode);
    params.set('page', String(p));
    params.set('pageSize', String(ps));

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/product/dataconf/account-config-check?${params.toString()}`, { method: 'GET' });
      const json: ApiResponse = await res.json();
      
      // 无论查询成功与否，都尝试获取选项列表
      if (json.data && json.data.options && json.data.options.hotelCodes && json.data.options.hotelCodes.length > 0) {
        console.log('[科目配置检查] fetchData 中获取到酒店代码选项，数量:', json.data.options.hotelCodes.length);
        setHotelCodeOptions(json.data.options.hotelCodes);
        setHotelOptionsLoading(false);
      }
      
      if (!json.success || !json.data) throw new Error(json.error || json.message || '请求失败');
      
      // 过滤掉合计行
      const filteredItems = json.data.items.filter((item) => item.__type !== 'total');
      setItems(filteredItems);
      // 总条数应该是后端返回的total减去合计行（1行）
      setTotal(Math.max(0, json.data.total - 1));
      setPage(p);
      setPageSize(ps);
    } catch (e: any) {
      setError(e?.message || '请求失败');
    } finally {
      setLoading(false);
    }
  };

  // 加载酒店选项列表
  const loadHotelOptions = async () => {
    try {
      setHotelOptionsLoading(true);
      const defaultDates = { bDate: dayjs().subtract(1, 'day').format('YYYY-MM-DD'), days: '1' };
      const params = new URLSearchParams();
      params.set('bDate', defaultDates.bDate);
      params.set('days', defaultDates.days);
      params.set('page', '1');
      params.set('pageSize', '1');
      
      const res = await fetch(`/api/product/dataconf/account-config-check?${params.toString()}`);
      const json: ApiResponse = await res.json();
      console.log('[科目配置检查] 加载酒店选项列表响应:', json);
      
      if (json.success && json.data && json.data.options) {
        console.log('[科目配置检查] 选项数据:', json.data.options);
        if (json.data.options.hotelCodes && json.data.options.hotelCodes.length > 0) {
          console.log('[科目配置检查] 设置酒店代码选项，数量:', json.data.options.hotelCodes.length);
          setHotelCodeOptions(json.data.options.hotelCodes);
        } else {
          console.warn('[科目配置检查] 酒店代码选项为空或未定义');
        }
      } else {
        console.warn('[科目配置检查] API 响应中没有选项数据:', json);
      }
    } catch (e) {
      console.error('加载酒店选项列表失败:', e);
    } finally {
      setHotelOptionsLoading(false);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      form.setFieldsValue({
        bDate: dayjs().subtract(1, 'day'),
        days: 1
      });
      // 先加载酒店选项列表，等待完成后再执行查询
      await loadHotelOptions();
      // 然后执行查询
      fetchData({ page: 1, pageSize: 10 });
    };
    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const bDateWatch = Form.useWatch('bDate', form);
  const daysWatch = Form.useWatch('days', form);
  const hotelCodeWatch = Form.useWatch('hotelCode', form);

  const handleExport = async () => {
    setExporting(true);
    setError(null);
    try {
      // 获取所有数据（不分页）
      const values = form.getFieldsValue();
      const params = new URLSearchParams();
      if (values.bDate) params.set('bDate', dayjs(values.bDate).format('YYYY-MM-DD'));
      if (values.days) params.set('days', String(values.days));
      if (values.hotelCode) params.set('hotelCode', values.hotelCode);
      params.set('page', '1');
      params.set('pageSize', '10000'); // 获取全部数据

      const res = await fetch(`/api/product/dataconf/account-config-check?${params.toString()}`, { method: 'GET' });
      const json: ApiResponse = await res.json();
      if (!json.success || !json.data) throw new Error(json.error || json.message || '获取数据失败');

      // 过滤掉合计行
      const allItems = json.data.items.filter((item) => item.__type !== 'total');

      if (allItems.length === 0) {
        message.warning('没有数据可导出');
        return;
      }

      // 准备Excel数据
      const excelData = allItems.map((item) => ({
        酒店代码: item.hotelid || '',
        酒店名称: item.hotelName || '',
        科目代码: item.class1 || '',
        科目名称: item.descript1 || '',
        部门代码: item.dept || '',
        部门名称: item.deptname || '',
      }));

      // 创建工作簿和工作表
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(excelData);

      // 设置列宽
      const colWidths = [
        { wch: 12 }, // 酒店代码
        { wch: 20 }, // 酒店名称
        { wch: 15 }, // 科目代码
        { wch: 30 }, // 科目名称
        { wch: 12 }, // 部门代码
        { wch: 15 }, // 部门名称
      ];
      ws['!cols'] = colWidths;

      // 添加工作表到工作簿
      XLSX.utils.book_append_sheet(wb, ws, '科目配置检查');

      // 生成文件名
      const fileName = `科目配置检查_${dayjs(values.bDate || new Date()).format('YYYY-MM-DD')}_${Date.now()}.xlsx`;

      // 导出文件
      XLSX.writeFile(wb, fileName);

      message.success(`导出成功！共导出 ${allItems.length} 条数据`);
    } catch (e: any) {
      console.error('导出失败:', e);
      setError(e?.message || '导出失败');
      message.error(e?.message || '导出失败');
    } finally {
      setExporting(false);
    }
  };

  const handleGenerateSQL = async () => {
    if (items.length === 0) {
      message.warning('没有数据可生成SQL');
      return;
    }

    setGenerating(true);
    setError(null);
    try {
      // 获取所有数据（不分页）
      const values = form.getFieldsValue();
      const params = new URLSearchParams();
      if (values.bDate) params.set('bDate', dayjs(values.bDate).format('YYYY-MM-DD'));
      if (values.days) params.set('days', String(values.days));
      if (values.hotelCode) params.set('hotelCode', values.hotelCode);
      params.set('page', '1');
      params.set('pageSize', '100000'); // 获取全部数据

      const res = await fetch(`/api/product/dataconf/account-config-check?${params.toString()}`, { method: 'GET' });
      const json: ApiResponse = await res.json();
      if (!json.success || !json.data) throw new Error(json.error || json.message || '获取数据失败');

      // 过滤掉合计行
      const allItems = json.data.items.filter((item) => item.__type !== 'total');

      if (allItems.length === 0) {
        message.warning('没有数据可生成SQL');
        return;
      }

      // 调用生成SQL的API
      const makeSqlRes = await fetch('/api/product/dataconf/account-config-check-makesql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: allItems }),
      });

      const makeSqlJson = await makeSqlRes.json();
      if (!makeSqlJson.success || !makeSqlJson.data) {
        throw new Error(makeSqlJson.error || makeSqlJson.message || '生成SQL失败');
      }

      // 下载SQL文件
      const blob = new Blob([makeSqlJson.data.sqlContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = makeSqlJson.data.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      message.success(`下载成功！共生成 ${makeSqlJson.data.count} 条SQL语句`);
    } catch (e: any) {
      console.error('生成SQL失败:', e);
      setError(e?.message || '生成SQL失败');
      message.error(e?.message || '生成SQL失败');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <ConfigProvider locale={zhCN}>
    <div className="min-h-screen w-full bg-gray-50 py-8">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Breadcrumb items={breadcrumbItems} />
            <Link
              href="/product"
              className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              返回
            </Link>
          </div>
        </div>

        {/* 查询条件 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
          <Form form={form} layout="vertical" onFinish={() => fetchData({ page: 1 })}>
            <Row gutter={16}>
              <Col xs={24} md={8}>
                <Form.Item label="起始日期" name="bDate">
                  <DatePicker className="w-full" allowClear format="YYYY-MM-DD" />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item label="天数窗口" name="days">
                  <Input type="number" min={1} placeholder="如 1" allowClear />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item label="酒店代码" name="hotelCode">
                  <Select
                    allowClear
                    showSearch
                    placeholder="选择或输入酒店代码（支持自查询）..."
                    className="w-full"
                    loading={hotelOptionsLoading}
                    options={hotelCodeOptions}
                    notFoundContent={hotelOptionsLoading ? '加载中...' : hotelCodeOptions.length === 0 ? '无数据' : '无匹配项'}
                    filterOption={(input, option) =>
                      ((option?.label as string) || '').toLowerCase().includes(input.toLowerCase())
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>查询</Button>
              <Button
                onClick={() => {
                  form.resetFields();
                  form.setFieldsValue({ bDate: dayjs().subtract(1, 'day'), days: 1 });
                }}
              >重置</Button>
            </Space>
          </Form>
        </div>

        {/* 已选择条件展示 */}
        <div className="mb-4 flex flex-wrap gap-2">
          {bDateWatch && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
              起始日期: {dayjs(bDateWatch).format('YYYY-MM-DD')}
            </span>
          )}
          {daysWatch && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-green-100 text-green-700">
              天数窗口: {daysWatch}
            </span>
          )}
          {hotelCodeWatch && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-purple-100 text-purple-700">
              酒店代码: {hotelCodeWatch}
            </span>
          )}
        </div>

        {error && <div className="text-red-600 mb-3">{error}</div>}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
          <div className="flex justify-between items-center">
            <div className="text-gray-700">
              总条数：<span className="font-semibold text-gray-900">{total}</span>
            </div>
            <Space>
              <Button
                type="default"
                onClick={handleExport}
                loading={exporting}
                disabled={items.length === 0}
              >
                导出Excel
              </Button>
            <Button
              type="primary"
              onClick={handleGenerateSQL}
              loading={generating}
              disabled={items.length === 0}
            >
              生成科目配置SQL
            </Button>
            </Space>
          </div>
        </div>

        <Table<AccountConfigRow>
          rowKey={(r) => `${r.hotelid}-${r.class1}`}
          loading={loading}
          columns={columns}
          dataSource={items}
          pagination={{
            current: page,
            pageSize,
            total,
            showSizeChanger: true,
            pageSizeOptions: ['10', '50', '100'],
            onChange: (p, ps) => fetchData({ page: p, pageSize: ps }),
            showTotal: (total, range) => `${range[0]}-${range[1]} 共 ${total} 条`,
          }}
          scroll={{ x: 'max-content', y: 520 }}
          sticky
          bordered
        />

        {/* 右下角返回按钮 */}
        <div className="mt-8 flex justify-end">
          <Link
            href="/product"
            className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            返回产品中心
          </Link>
        </div>
      </div>
    </div>
    </ConfigProvider>
  );
}
