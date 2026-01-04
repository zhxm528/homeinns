'use client';
import '@ant-design/v5-patch-for-react-19';

import { useState } from 'react';
import Link from 'next/link';
// @ts-ignore: antd may not have types installed in this environment
import 'antd/dist/reset.css';
// @ts-ignore: antd types might be missing
import { Button, Input, Table, message, Form, Space, Card, Row, Col, Select } from 'antd';
// @ts-ignore: antd types might be missing
import type { ColumnsType } from 'antd/es/table';

interface SubRoom {
  roomId: number;
  roomTypeCode?: string;
  ratePlanCode?: string;
  roomName?: string;
  mealType: number;
  maxOccupancy: number;
  maxAdultOccupancy: number;
  balanceType: string;
  twinBed: boolean;
  kingSize: boolean;
  status: string;
  allowAddBed?: boolean;
}

interface HotelData {
  hotelId: string;
  hotelCode?: string;
  subRoomLists?: SubRoom[];
  code?: string;
  message?: string;
}

interface ApiResponse {
  languageCode?: string;
  code?: string;
  message?: string;
  datas?: HotelData[];
}

export default function MappingInfoSearchPage() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ApiResponse | null>(null);
  const [form] = Form.useForm();

  const handleQuery = async (values: any) => {
    setLoading(true);
    try {
      // 构建请求体
      const requestBody: Record<string, any> = {};
      
      if (values.languageCode) requestBody.languageCode = values.languageCode;
      if (values.getMappingInfoType) requestBody.getMappingInfoType = values.getMappingInfoType;
      if (values.hotelIds) {
        // hotelIds 可以是逗号分隔的字符串或数组
        const hotelIdsStr = Array.isArray(values.hotelIds) 
          ? values.hotelIds.join(',') 
          : values.hotelIds;
        // 将逗号分隔的字符串转换为数组
        const hotelIdsArray = hotelIdsStr
          .split(',')
          .map((id: string) => id.trim())
          .filter(Boolean);
        requestBody.hotelIds = hotelIdsArray;
      }
      if (values.env) requestBody.env = values.env;

      const res = await fetch('/api/product/ctrip/mappingInfoSearch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      const json = await res.json();
      
      if (json.success) {
        setData(json.data);
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

  // 售卖房型表格列定义
  const subRoomTableColumns: ColumnsType<SubRoom> = [
    {
      title: '房型ID',
      dataIndex: 'roomId',
      key: 'roomId',
      width: 120,
    },
    {
      title: '供应商房型Code',
      dataIndex: 'roomTypeCode',
      key: 'roomTypeCode',
      width: 150,
      render: (text: string) => text || '-',
    },
    {
      title: 'Rate Plan Code',
      dataIndex: 'ratePlanCode',
      key: 'ratePlanCode',
      width: 150,
      render: (text: string) => text || '-',
    },
    {
      title: '房型名称',
      dataIndex: 'roomName',
      key: 'roomName',
      width: 250,
      render: (text: string) => text || '-',
    },
    {
      title: '餐食类型',
      dataIndex: 'mealType',
      key: 'mealType',
      width: 100,
      align: 'right',
    },
    {
      title: '最大入住人数',
      dataIndex: 'maxOccupancy',
      key: 'maxOccupancy',
      width: 120,
      align: 'right',
    },
    {
      title: '最大入住成人数',
      dataIndex: 'maxAdultOccupancy',
      key: 'maxAdultOccupancy',
      width: 140,
      align: 'right',
    },
    {
      title: '价格类型',
      dataIndex: 'balanceType',
      key: 'balanceType',
      width: 100,
      render: (text: string) => {
        const map: Record<string, string> = {
          Prepay: '预付',
          PayOnSpot: '现付',
          Package: '套餐',
        };
        return map[text] || text;
      },
    },
    {
      title: '是否双床',
      dataIndex: 'twinBed',
      key: 'twinBed',
      width: 100,
      render: (value: boolean) => value ? '是' : '否',
    },
    {
      title: '是否大床',
      dataIndex: 'kingSize',
      key: 'kingSize',
      width: 100,
      render: (value: boolean) => value ? '是' : '否',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (text: string) => {
        const map: Record<string, string> = {
          Show: '显示',
          Hidden: '隐藏',
          Deactivate: '已废弃',
        };
        return map[text] || text;
      },
    },
    {
      title: '允许加床',
      dataIndex: 'allowAddBed',
      key: 'allowAddBed',
      width: 100,
      render: (value: boolean | undefined) => value === undefined ? '-' : (value ? '是' : '否'),
    },
  ];

  // 酒店表格列定义（展开行显示售卖房型列表）
  const hotelTableColumns: ColumnsType<HotelData> = [
    {
      title: '携程子酒店ID',
      dataIndex: 'hotelId',
      key: 'hotelId',
      width: 150,
    },
    {
      title: '供应商酒店Code',
      dataIndex: 'hotelCode',
      key: 'hotelCode',
      width: 150,
      render: (text: string) => text || '-',
    },
    {
      title: '售卖房型数量',
      key: 'roomCount',
      width: 120,
      align: 'right',
      render: (_: any, record: HotelData) => {
        return record.subRoomLists ? record.subRoomLists.length : 0;
      },
    },
    {
      title: '错误代码',
      dataIndex: 'code',
      key: 'code',
      width: 120,
      render: (text: string) => text || '-',
    },
    {
      title: '错误消息',
      dataIndex: 'message',
      key: 'message',
      width: 300,
      render: (text: string) => text || '-',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col min-h-[calc(100vh-64px)]">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">自助匹配携程映射信息查询</h1>
            <p className="text-gray-600">携程接口 - mappingInfoSearch</p>
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
              getMappingInfoType: 'UnMapping',
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
                <Form.Item label="获取信息类型" name="getMappingInfoType">
                  <Select
                    options={[
                      { label: 'UnMapping - 未匹配', value: 'UnMapping' },
                      { label: 'Mapping - 已匹配', value: 'Mapping' },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item 
                  label="酒店 ID 列表" 
                  name="hotelIds"
                  rules={[{ required: true, message: '请输入酒店 ID 列表' }]}
                >
                  <Input placeholder="携程子酒店 id，逗号分隔，最多5个，必填" />
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
              <div className="mb-4">
                {data.code && (
                  <div className="mb-2">
                    <strong>返回代码：</strong> {data.code}
                  </div>
                )}
                {data.message && (
                  <div className="mb-2">
                    <strong>返回消息：</strong> {data.message}
                  </div>
                )}
              </div>

              {data.datas && data.datas.length > 0 ? (
                <Table
                  columns={hotelTableColumns}
                  dataSource={data.datas}
                  rowKey={(record) => record.hotelId}
                  pagination={false}
                  loading={loading}
                  scroll={{ x: 1000 }}
                  expandable={{
                    expandedRowRender: (record: HotelData) => {
                      if (record.subRoomLists && record.subRoomLists.length > 0) {
                        return (
                          <Table
                            columns={subRoomTableColumns}
                            dataSource={record.subRoomLists}
                            rowKey={(room) => `${room.roomId}-${room.mealType}`}
                            pagination={false}
                            size="small"
                            scroll={{ x: 1500 }}
                          />
                        );
                      }
                      return <div className="text-gray-500 p-4">该酒店无售卖房型数据或查询失败</div>;
                    },
                    rowExpandable: (record: HotelData) => true,
                  }}
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

