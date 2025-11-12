'use client';
import '@ant-design/v5-patch-for-react-19';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Button, DatePicker, Form, Table, Typography, Row, Col, Space, Select } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

type ManualMonthlyRow = {
  酒店: string;
  大类: string;
  小类: string;
  小类名称: string;
  [key: string]: any; // 动态日期列
  __type?: 'total' | 'normal';
};

type ApiResponse = {
  success: boolean;
  data: {
    message: string;
    params: Record<string, string>;
    timestamp: string;
    total: number;
    items: ManualMonthlyRow[];
    dateColumns: string[];
  } | null;
  message: string;
  error?: string;
};

const formatNumber = (value: number) => {
  if (value === null || value === undefined || isNaN(value)) return '';
  const fixed = value.toFixed(2);
  const trimmed = fixed.replace(/\.00$/, '').replace(/(\.\d*[1-9])0+$/, '$1');
  return trimmed.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export default function ManualMonthlyReportPage() {
  const [form] = Form.useForm();
  const yearMonthWatch = Form.useWatch('yearMonth', form);
  const hotelIdsWatch = Form.useWatch('hotelIds', form);
  const deptWatch = Form.useWatch('dept', form);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<ManualMonthlyRow[]>([]);
  const [dateColumns, setDateColumns] = useState<string[]>([]);
  

  // 动态生成表格列
  const columns: ColumnsType<ManualMonthlyRow> = useMemo(() => {
    const baseColumns: ColumnsType<ManualMonthlyRow> = [
      { title: '酒店', dataIndex: '酒店', key: 'hotel', fixed: 'left', width: 120 },
      { title: '大类', dataIndex: '大类', key: 'category', fixed: 'left', width: 120 },
      { title: '小类', dataIndex: '小类', key: 'subCategory', fixed: 'left', width: 120 },
      { title: '小类名称', dataIndex: '小类名称', key: 'subCategoryName', fixed: 'left', width: 160 },
    ];

    // 动态添加日期列
    const dateCols = dateColumns.map(date => ({
      title: date.split('-')[2], // 只显示日期部分
      dataIndex: date,
      key: date,
      width: 80,
      align: 'right' as const,
      render: (value: number) => formatNumber(Number(value || 0)),
    }));

    return [...baseColumns, ...dateCols];
  }, [dateColumns]);

  const fetchData = async () => {
    const values = form.getFieldsValue();
    const params = new URLSearchParams();
    if (values.yearMonth) params.set('yearMonth', dayjs(values.yearMonth).format('YYYY-MM'));
    if (values.hotelIds && values.hotelIds.length) params.set('hotelIds', values.hotelIds.join(','));
    if (values.dept && values.dept.length) params.set('dept', values.dept.join(','));
    // 请求后端返回全部数据：设置一个很大的 pageSize
    params.set('page', '1');
    params.set('pageSize', '100000');

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/product/report-analysis/manual-monthly-report?${params.toString()}`, { method: 'GET' });
      const json: ApiResponse = await res.json();
      if (!json.success || !json.data) throw new Error(json.error || json.message || '请求失败');
      setItems(json.data.items);
      setDateColumns(json.data.dateColumns || []);
      
    } catch (e: any) {
      setError(e?.message || '请求失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    form.setFieldsValue({
      yearMonth: dayjs().startOf('month'),
      hotelIds: ['JG0110', 'KP0001', 'NI0001', 'NI0002', 'KP0002', 'NI0003']
    });
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 页面标题和返回按钮 */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">手工填报月报</h1>
              <p className="text-gray-600">查看手工填报月报数据</p>
            </div>
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
          <Form form={form} layout="vertical" onFinish={() => fetchData()}>
            <Row gutter={16}>
              <Col xs={24} md={8}>
                <Form.Item label="年月" name="yearMonth">
                  <DatePicker picker="month" className="w-full" allowClear format="YYYY-MM" />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item label="酒店(多选)" name="hotelIds">
                  <Select
                    mode="multiple"
                    allowClear
                    placeholder="选择酒店"
                    options={[
                      { label: 'JG0110', value: 'JG0110' },
                      { label: 'KP0001', value: 'KP0001' },
                      { label: 'NI0001', value: 'NI0001' },
                      { label: 'NI0002', value: 'NI0002' },
                      { label: 'KP0002', value: 'KP0002' },
                      { label: 'NI0003', value: 'NI0003' },
                    ]}
                    showSearch
                    optionFilterProp="label"
                    filterOption={(input, opt) => (opt?.label as string).toLowerCase().includes(input.toLowerCase())}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item label="部门(多选)" name="dept">
                  <Select
                    mode="multiple"
                    allowClear
                    placeholder="选择部门，如 rm, fb, ot, ri"
                    options={[
                      { label: 'rm - 客房收入', value: 'rm' },
                      { label: 'fb - 餐饮收入', value: 'fb' },
                      { label: 'ot - 其他收入', value: 'ot' },
                      { label: 'ri - 租赁', value: 'ri' },
                    ]}
                    showSearch
                    optionFilterProp="label"
                    filterOption={(input, opt) => (opt?.label as string).toLowerCase().includes(input.toLowerCase())}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>查询</Button>
              <Button
                onClick={() => {
                  form.resetFields();
                  form.setFieldsValue({ yearMonth: undefined, hotelIds: [], dept: [] });
                }}
              >重置</Button>
            </Space>
          </Form>
        </div>

        {/* 已选择条件展示 */}
        <div className="mb-4 flex flex-wrap gap-2">
          {yearMonthWatch && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
              年月: {dayjs(yearMonthWatch).format('YYYY-MM')}
            </span>
          )}
          {hotelIdsWatch?.map((id: string) => (
            <span key={id} className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-green-100 text-green-700">
              酒店: {id}
            </span>
          ))}
          {deptWatch?.map((d: string) => (
            <span key={d} className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700">
              部门: {d}
            </span>
          ))}
        </div>

        {error && <div className="text-red-600 mb-3">{error}</div>}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
          <div className="flex justify-between items-center">
            <div className="text-gray-700">
              总条数：<span className="font-semibold text-gray-900">{items.length}</span>
            </div>
          </div>
        </div>

        <Table<ManualMonthlyRow>
          rowKey={(r) => r.__type === 'total' ? 'total' : `${r.酒店}-${r.大类}-${r.小类}-${r.小类名称}`}
          loading={loading}
          columns={columns}
          dataSource={items}
          pagination={false}
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
  );
}
