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

interface MasterRoom {
  roomId: string;
  roomName: string;
  maxOccupancy: number;
  maxAdultOccupancy: number;
  hasWindow: string;
  hasWifi: string;
  hasCableInternet: string;
}

interface HotelData {
  hotelId: string;
  masterRoomLists?: MasterRoom[];
  code?: string;
  message?: string;
}

interface ApiResponse {
  languageCode?: string;
  code?: string;
  message?: string;
  datas?: HotelData[];
}

export default function MasterRoomInfoSearchPage() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ApiResponse | null>(null);
  const [form] = Form.useForm();

  const handleQuery = async (values: any) => {
    setLoading(true);
    try {
      // 构建请求体
      const requestBody: Record<string, any> = {};
      
      if (values.languageCode) requestBody.languageCode = values.languageCode;
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

      const res = await fetch('/api/product/ctrip/masterRoomInfoSearch', {
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

  // 母房型表格列定义
  const roomTableColumns: ColumnsType<MasterRoom> = [
    {
      title: '房型ID',
      dataIndex: 'roomId',
      key: 'roomId',
      width: 120,
    },
    {
      title: '房型名称',
      dataIndex: 'roomName',
      key: 'roomName',
      width: 200,
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
      title: '是否有窗',
      dataIndex: 'hasWindow',
      key: 'hasWindow',
      width: 100,
      render: (text: string) => {
        const map: Record<string, string> = {
          Yes: '是',
          No: '否',
          Unknow: '未知',
          partly: '部分有窗',
        };
        return map[text] || text;
      },
    },
    {
      title: '是否有WiFi',
      dataIndex: 'hasWifi',
      key: 'hasWifi',
      width: 100,
      render: (text: string) => {
        const map: Record<string, string> = {
          Yes: '是',
          No: '否',
          Unknow: '未知',
        };
        return map[text] || text;
      },
    },
    {
      title: '是否有有线网络',
      dataIndex: 'hasCableInternet',
      key: 'hasCableInternet',
      width: 120,
      render: (text: string) => {
        const map: Record<string, string> = {
          Yes: '是',
          No: '否',
          Unknow: '未知',
        };
        return map[text] || text;
      },
    },
  ];

  // 酒店表格列定义（展开行显示母房型列表）
  const hotelTableColumns: ColumnsType<HotelData> = [
    {
      title: '携程子酒店ID',
      dataIndex: 'hotelId',
      key: 'hotelId',
      width: 150,
    },
    {
      title: '母房型数量',
      key: 'roomCount',
      width: 120,
      align: 'right',
      render: (_: any, record: HotelData) => {
        return record.masterRoomLists ? record.masterRoomLists.length : 0;
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">自助匹配携程母房型内容查询</h1>
            <p className="text-gray-600">携程接口 - masterRoomInfoSearch</p>
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
                <Form.Item label="酒店 ID 列表" name="hotelIds">
                  <Input placeholder="携程子酒店 id，逗号分隔，最多5个" />
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
                  scroll={{ x: 800 }}
                  expandable={{
                    expandedRowRender: (record: HotelData) => {
                      if (record.masterRoomLists && record.masterRoomLists.length > 0) {
                        return (
                          <Table
                            columns={roomTableColumns}
                            dataSource={record.masterRoomLists}
                            rowKey={(room) => room.roomId}
                            pagination={false}
                            size="small"
                          />
                        );
                      }
                      return <div className="text-gray-500 p-4">该酒店无母房型数据或查询失败</div>;
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

