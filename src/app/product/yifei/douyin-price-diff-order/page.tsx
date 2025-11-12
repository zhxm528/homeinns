'use client';
import '@ant-design/v5-patch-for-react-19';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Button, DatePicker, Form, Table, Typography, Row, Col, Space, Input } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
// @ts-ignore: xlsx types might be missing
import * as XLSX from 'xlsx';

type DouyinRow = {
  C3订单号: string;
  抖音订单号: string;
  酒店代码: string;
  酒店名称: string;
  客人姓名: string;
  房型: string;
  房价码: string;
  入住日期: string;
  离店日期: string;
  预订日期: string;
  P3金额: number;
  抖音金额: number;
  差额: number;
  __type?: 'total' | 'normal';
};

type ApiResponse = {
  success: boolean;
  data: {
    message: string;
    params: Record<string, string>;
    timestamp: string;
    total: number;
    items: DouyinRow[];
  } | null;
  message: string;
  error?: string;
};

const thousand2 = (n: number) => {
  if (n === null || n === undefined || Number.isNaN(n)) return '';
  const fixed = n.toFixed(2);
  const trimmed = fixed.replace(/\.00$/, '').replace(/(\.[1-9])0$/, '$1');
  const [intPart, decPart] = trimmed.split('.');
  const intWithSep = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return decPart ? `${intWithSep}.${decPart}` : intWithSep;
};

export default function DouyinPriceDiffOrderPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [exporting, setExporting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<DouyinRow[]>([]);
  

  const columns: ColumnsType<DouyinRow> = useMemo(() => [
    { title: 'C3订单号', dataIndex: 'C3订单号', key: 'orderNo', fixed: 'left', width: 140 },
    { title: '抖音订单号', dataIndex: '抖音订单号', key: 'douyinOrderNo', fixed: 'left', width: 160 },
    { title: '酒店代码', dataIndex: '酒店代码', key: 'hotelCd', width: 120 },
    { title: '酒店名称', dataIndex: '酒店名称', key: 'hotelName', width: 160 },
    { title: '客人姓名', dataIndex: '客人姓名', key: 'guest', width: 120 },
    { title: '房型', dataIndex: '房型', key: 'roomType', width: 120 },
    { title: '房价码', dataIndex: '房价码', key: 'rateCode', width: 120 },
    { title: '入住日期', dataIndex: '入住日期', key: 'arr', width: 140 },
    { title: '离店日期', dataIndex: '离店日期', key: 'dep', width: 140 },
    { title: '预订日期', dataIndex: '预订日期', key: 'resv', width: 140 },
    { title: 'P3金额', dataIndex: 'P3金额', key: 'p3', align: 'right', width: 120, render: (v: number) => thousand2(Number(v || 0)) },
    { title: '抖音金额', dataIndex: '抖音金额', key: 'dy', align: 'right', width: 120, render: (v: number) => thousand2(Number(v || 0)) },
    { title: '差额', dataIndex: '差额', key: 'diff', align: 'right', width: 120, render: (v: number) => thousand2(Number(v || 0)) },
  ], []);

  const fetchData = async () => {
    const values = form.getFieldsValue();
    const params = new URLSearchParams();
    if (values.depDateStart) params.set('depDateStart', dayjs(values.depDateStart).format('YYYY-MM-DD'));
    if (values.hotelCdLike) params.set('hotelCdLike', values.hotelCdLike);

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/product/yifei/douyin-price-diff-order?${params.toString()}`, { method: 'GET' });
      const json: ApiResponse = await res.json();
      if (!json.success || !json.data) throw new Error(json.error || json.message || '请求失败');
      // 过滤掉合计行
      const filteredItems = json.data.items.filter((item) => item.__type !== 'total');
      setItems(filteredItems);
    } catch (e: any) {
      setError(e?.message || '请求失败');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    try {
      setExporting(true);
      setError(null);

      if (items.length === 0) {
        setError('无数据可导出');
        return;
      }

      // 准备Excel数据，排除合计行的__type字段
      const excelData = items.map((row) => ({
        'C3订单号': row.C3订单号 || '',
        '抖音订单号': row.抖音订单号 || '',
        '酒店代码': row.酒店代码 || '',
        '酒店名称': row.酒店名称 || '',
        '客人姓名': row.客人姓名 || '',
        '房型': row.房型 || '',
        '房价码': row.房价码 || '',
        '入住日期': row.入住日期 || '',
        '离店日期': row.离店日期 || '',
        '预订日期': row.预订日期 || '',
        'P3金额': row.P3金额 || 0,
        '抖音金额': row.抖音金额 || 0,
        '差额': row.差额 || 0,
      }));

      // 创建工作簿和工作表
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(excelData);

      // 设置列宽
      ws['!cols'] = [
        { wch: 18 }, // C3订单号
        { wch: 20 }, // 抖音订单号
        { wch: 12 }, // 酒店代码
        { wch: 20 }, // 酒店名称
        { wch: 12 }, // 客人姓名
        { wch: 12 }, // 房型
        { wch: 12 }, // 房价码
        { wch: 12 }, // 入住日期
        { wch: 12 }, // 离店日期
        { wch: 12 }, // 预订日期
        { wch: 12 }, // P3金额
        { wch: 12 }, // 抖音金额
        { wch: 12 }, // 差额
      ];

      XLSX.utils.book_append_sheet(wb, ws, '抖音加价差异订单');

      // 生成文件名
      const values = form.getFieldsValue();
      const depDateStr = values.depDateStart ? dayjs(values.depDateStart).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD');
      const fileName = `抖音加价差异订单_${depDateStr}_${dayjs().format('YYYYMMDDHHmmss')}.xlsx`;

      // 下载文件
      XLSX.writeFile(wb, fileName);
    } catch (e) {
      console.error('导出Excel失败:', e);
      setError('导出Excel失败，请检查网络连接');
    } finally {
      setExporting(false);
    }
  };

  useEffect(() => {
    form.setFieldsValue({
      depDateStart: dayjs().subtract(60, 'day'),
      hotelCdLike: 'UC%'
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">抖音加价差异订单</h1>
              <p className="text-gray-600">查看抖音加价差异订单数据</p>
            </div>
            {/* 右上角返回按钮 */}
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

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
          <Form form={form} layout="vertical" onFinish={() => fetchData()}>
            <Row gutter={16}>
              <Col xs={24} md={8}>
                <Form.Item label="离店起始日期" name="depDateStart">
                  <DatePicker className="w-full" allowClear />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item label="酒店代码Like" name="hotelCdLike">
                  <Input allowClear placeholder="如 UC%" />
                </Form.Item>
              </Col>
            </Row>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>查询</Button>
              <Button
                onClick={() => {
                  form.resetFields();
                  form.setFieldsValue({ depDateStart: undefined, hotelCdLike: undefined });
                }}
              >重置</Button>
            </Space>
          </Form>
        </div>

        {error && <div className="text-red-600 mb-3">{error}</div>}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
          <div className="flex justify-between items-center">
            <div className="text-gray-700">
              总条数：<span className="font-semibold text-gray-900">{items.length}</span>
            </div>
            <Button 
              type="primary" 
              onClick={handleExport} 
              loading={exporting}
              disabled={items.length === 0}
            >
              导出Excel
            </Button>
          </div>
        </div>

        <Table<DouyinRow>
          rowKey={(r) => `${r.C3订单号}-${r.酒店代码}-${r.入住日期}`}
          loading={loading}
          columns={columns}
          dataSource={items}
          pagination={false}
          scroll={{ x: 1660 }}
          sticky
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
