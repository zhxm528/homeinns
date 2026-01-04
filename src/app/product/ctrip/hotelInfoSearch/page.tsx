'use client';
import '@ant-design/v5-patch-for-react-19';

import { useState } from 'react';
import Link from 'next/link';
// @ts-ignore: antd may not have types installed in this environment
import 'antd/dist/reset.css';
// @ts-ignore: antd types might be missing
import { Button, Input, Table, message, Form, Space, Card, Row, Col, Select, Tag, Alert } from 'antd';
// @ts-ignore: antd types might be missing
import type { ColumnsType } from 'antd/es/table';

interface HotelInfo {
  hotelId: string;
  __uniqueId?: string; // 用于确保React key唯一性
  hotelInfos: {
    hotelName: string;
    countryName: string;
    cityName: string;
    address: string;
    telephone: string;
    brandName?: string;
    hotelBelongTo: string;
  };
}

interface ApiResponse {
  languageCode?: string;
  code?: string;
  message?: string;
  hotelLists?: HotelInfo[];
  maxHotelId?: string;
}

export default function HotelInfoSearchPage() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ApiResponse | null>(null);
  const [form] = Form.useForm();

  const handleQuery = async (values: any) => {
    setLoading(true);
    try {
      // 构建请求体
      const requestBody: Record<string, any> = {};
      
      if (values.languageCode) requestBody.languageCode = values.languageCode;
      if (values.supplierId) requestBody.supplierId = values.supplierId;
      if (values.mgrgroupid) requestBody.mgrgroupid = values.mgrgroupid;
      if (values.brand) requestBody.brand = values.brand;
      if (values.hotelIds) {
        // hotelIds 可以是逗号分隔的字符串或数组
        const hotelIdsStr = Array.isArray(values.hotelIds) 
          ? values.hotelIds.join(',') 
          : values.hotelIds;
        requestBody.hotelIds = hotelIdsStr;
      }
      if (values.startHotelId) requestBody.startHotelId = values.startHotelId;
      if (values.batchSize) requestBody.batchSize = values.batchSize;
      if (values.env) requestBody.env = values.env;

      const res = await fetch('/api/product/ctrip/hotelInfoSearch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      const json = await res.json();

      if (json.success) {
        // 为每条记录添加唯一ID，避免React key重复错误，且严格保持与后端返回条数一致
        const rawList: HotelInfo[] = Array.isArray(json.data?.hotelLists)
          ? json.data.hotelLists
          : [];

        const timestamp = Date.now();
        const hotelListsWithId = rawList.map((item: HotelInfo, idx: number) => ({
          ...item,
          __uniqueId: `hotel-${timestamp}-${idx}-${item.hotelId}`,
        }));

        // 不直接修改 json.data，创建新的对象，避免潜在副作用
        const newData: ApiResponse = {
          ...json.data,
          hotelLists: hotelListsWithId,
        };

        // 简单日志，方便比对前端与后端条数
        console.log(
          '[hotelInfoSearch] 后端返回条数:',
          rawList.length,
          '前端表格条数:',
          hotelListsWithId.length
        );

        setData(newData);
        message.success('查询成功');
      } else {
        message.error(json.message || '查询失败');
        setData(null);
      }
    } catch (e: any) {
      message.error(e?.message || '请求失败');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    form.resetFields();
    setData(null);
  };

  // 表格列定义
  const tableColumns: ColumnsType<HotelInfo> = [
    {
      title: '携程子酒店ID',
      dataIndex: ['hotelId'],
      key: 'hotelId',
      width: 150,
    },
    {
      title: '酒店名称',
      dataIndex: ['hotelInfos', 'hotelName'],
      key: 'hotelName',
      width: 200,
    },
    {
      title: '国家',
      dataIndex: ['hotelInfos', 'countryName'],
      key: 'countryName',
      width: 120,
    },
    {
      title: '城市',
      dataIndex: ['hotelInfos', 'cityName'],
      key: 'cityName',
      width: 120,
    },
    {
      title: '地址',
      dataIndex: ['hotelInfos', 'address'],
      key: 'address',
      width: 250,
    },
    {
      title: '电话',
      dataIndex: ['hotelInfos', 'telephone'],
      key: 'telephone',
      width: 150,
    },
    {
      title: '品牌',
      dataIndex: ['hotelInfos', 'brandName'],
      key: 'brandName',
      width: 150,
      render: (text: string) => text || '-',
    },
    {
      title: '酒店类别',
      dataIndex: ['hotelInfos', 'hotelBelongTo'],
      key: 'hotelBelongTo',
      width: 150,
      render: (text: string) => {
        const map: Record<string, string> = {
          PayOnSpot: '现付',
          Prepay: '预付',
          Supplier: '供应商',
        };
        return map[text] || text;
      },
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col min-h-[calc(100vh-64px)]">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">自助匹配酒店内容查询</h1>
            <p className="text-gray-600">携程接口 - hotelInfoSearch</p>
          </div>
          <Link
            href="/product"
            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            返回产品中心
          </Link>
        </div>

        <Card className="mb-6">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleQuery}
            initialValues={{
              languageCode: 'zh-CN',
              env: 'test',
            }}
          >
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Form.Item label="环境" name="env">
                  <Select
                    options={[
                      { label: '测试环境', value: 'test' },
                      { label: '生产环境', value: 'prod' },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="语言代码" name="languageCode">
                  <Input placeholder="固定 zh-CN" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Supplier ID" name="supplierId">
                  <Input placeholder="酒店所属的 supplierId" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="集团 ID" name="mgrgroupid">
                  <Input placeholder="酒店所属集团 id" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="品牌" name="brand">
                  <Input placeholder="酒店品牌" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="酒店 ID 列表" name="hotelIds">
                  <Input placeholder="携程子酒店 id，逗号分隔，最多5个" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="起始酒店 ID" name="startHotelId">
                  <Input placeholder="查找的起始酒店 id" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="批次大小" name="batchSize">
                  <Input placeholder="一次查询的酒店数量，最大10" />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item>
                  <Space>
                    <Button type="primary" htmlType="submit" loading={loading}>
                      查询
                    </Button>
                    <Button onClick={handleReset}>重置</Button>
                  </Space>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>

        <div className="flex-1 flex flex-col gap-4">
          {data && (
            <Card>
              <div className="mb-4 space-y-3">
                {data.code && (
                  <div>
                    <strong>返回代码：</strong> <Tag color={data.code === '0' ? 'success' : 'error'}>{data.code}</Tag>
                  </div>
                )}
                {data.message && (
                  <div>
                    <strong>返回消息：</strong> {data.message}
                  </div>
                )}
                {data.maxHotelId && (
                  <Alert
                    message={
                      <div>
                        <strong>最大酒店 ID：</strong>{' '}
                        <Tag color="blue" style={{ fontSize: '14px', padding: '4px 8px' }}>
                          {data.maxHotelId}
                        </Tag>
                        <span className="ml-2 text-gray-600 text-sm">
                          （可作为下一次查询的起始酒店 ID）
                        </span>
                      </div>
                    }
                    type="info"
                    showIcon
                    closable={false}
                  />
                )}
              </div>

              {data.hotelLists && data.hotelLists.length > 0 ? (
                <Table
                  columns={tableColumns}
                  dataSource={data.hotelLists}
                  rowKey={(record) => {
                    // 优先使用 __uniqueId，确保key唯一性且稳定
                    if (record.__uniqueId) {
                      return record.__uniqueId;
                    }
                    // 回退方案：使用 hotelId 加上其他字段组合（不再使用随机数，避免不稳定）
                    const hotelName = record.hotelInfos?.hotelName || '';
                    const cityName = record.hotelInfos?.cityName || '';
                    return `hotel-${record.hotelId}-${hotelName}-${cityName}`;
                  }}
                  pagination={false}
                  loading={loading}
                  scroll={{ x: 1200 }}
                />
              ) : (
                <div className="text-gray-500 text-center py-8">暂无数据</div>
              )}
            </Card>
          )}

          <div className="mt-4 flex justify-end">
            <Link
              href="/product"
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              返回产品中心
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
