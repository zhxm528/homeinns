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
// @ts-ignore: antd types might be missing
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

interface SubRoomMapping {
  subRoomId: string;
  roomTypeCode: string;
  roomTypeName?: string;
  ratePlanCode?: string;
  ratePlanName?: string;
}

interface RoomResult {
  subRoomId: number;
  code: string;
  message: string;
}

interface HotelResult {
  hotelId: number;
  code: string;
  message: string;
}

interface ApiResponse {
  languageCode?: string;
  code?: string;
  message?: string;
  requestId?: string;
  resultList?: {
    hotel?: HotelResult;
    roomLists?: RoomResult[];
  };
}

export default function MappingInfoSetPage() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ApiResponse | null>(null);
  const [clientTime, setClientTime] = useState<string | null>(null);
  const [serverTime, setServerTime] = useState<string | null>(null);
  const [form] = Form.useForm();

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      // 记录客户端时间
      const clientTimeStr = new Date().toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
      setClientTime(clientTimeStr);

      // 构建请求体
      const requestBody: Record<string, any> = {};
      
      if (values.languageCode) requestBody.languageCode = values.languageCode;
      if (values.setType) requestBody.setType = values.setType;
      if (values.hotelId) requestBody.hotelId = values.hotelId;
      if (values.hotelCode) requestBody.hotelCode = values.hotelCode;
      if (values.env) requestBody.env = values.env;

      // 处理 subRoomMappings
      if (values.setType === 'addMapping' || values.setType === 'deleteRoomMapping') {
        if (!values.subRoomMappings || values.subRoomMappings.length === 0) {
          message.error('当设置类型为新增或删除房型映射时，房型映射列表不能为空');
          setLoading(false);
          return;
        }
        requestBody.subRoomMappings = values.subRoomMappings.map((item: SubRoomMapping) => ({
          subRoomId: item.subRoomId,
          roomTypeCode: item.roomTypeCode,
          roomTypeName: item.roomTypeName || undefined,
          ratePlanCode: item.ratePlanCode || undefined,
          ratePlanName: item.ratePlanName || undefined,
        }));
      }

      const res = await fetch('/api/product/ctrip/mappingInfoSet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      const json = await res.json();

      // 获取服务器时间（从API响应中）
      if (json.serverTime) {
        setServerTime(json.serverTime);
      }

      if (json.success) {
        setData(json.data);
        message.success('设置成功');
      } else {
        message.error(json.message || '设置失败');
        setData(null);
        setClientTime(null);
        setServerTime(null);
      }
    } catch (e: any) {
      message.error(e?.message || '请求失败');
      setData(null);
      setClientTime(null);
      setServerTime(null);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    form.resetFields();
    setData(null);
    setClientTime(null);
    setServerTime(null);
  };

  // 房型结果表格列定义
  const roomResultTableColumns: ColumnsType<RoomResult> = [
    {
      title: '携程售卖产品ID',
      dataIndex: 'subRoomId',
      key: 'subRoomId',
      width: 150,
    },
    {
      title: '处理结果码',
      dataIndex: 'code',
      key: 'code',
      width: 120,
      render: (code: string) => (
        <Tag color={code === '0' ? 'success' : 'error'}>{code}</Tag>
      ),
    },
    {
      title: '处理结果信息',
      dataIndex: 'message',
      key: 'message',
      width: 300,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col min-h-[calc(100vh-64px)]">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">自助匹配携程母房型内容设置</h1>
            <p className="text-gray-600">携程接口 - mappingInfoSet</p>
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
            onFinish={handleSubmit}
            initialValues={{
              languageCode: 'zh-CN',
              setType: 'addMapping',
              env: 'test',
              subRoomMappings: [],
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
                <Form.Item 
                  label="语言代码" 
                  name="languageCode"
                  rules={[{ required: true, message: '请输入语言代码' }]}
                >
                  <Input placeholder="通常固定为 zh-CN" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item 
                  label="设置类型" 
                  name="setType"
                  rules={[{ required: true, message: '请选择设置类型' }]}
                >
                  <Select
                    options={[
                      { label: 'addMapping - 新增酒店或房型 Mapping 关系', value: 'addMapping' },
                      { label: 'deleteHotelMapping - 删除酒店及其下房型 Mapping 关系', value: 'deleteHotelMapping' },
                      { label: 'deleteRoomMapping - 仅删除房型 Mapping 关系', value: 'deleteRoomMapping' },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item 
                  label="携程子酒店ID" 
                  name="hotelId"
                  rules={[{ required: true, message: '请输入携程子酒店ID' }]}
                >
                  <Input placeholder="携程子酒店 ID" type="number" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item 
                  label="合作方酒店Code" 
                  name="hotelCode"
                  rules={[{ required: true, message: '请输入合作方酒店 code' }]}
                >
                  <Input placeholder="合作方酒店 code" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) => prevValues.setType !== currentValues.setType}
            >
              {({ getFieldValue }) => {
                const setType = getFieldValue('setType');
                if (setType === 'addMapping' || setType === 'deleteRoomMapping') {
                  return (
                    <Form.List name="subRoomMappings">
                      {(fields, { add, remove }) => (
                        <>
                          <Row gutter={[16, 16]}>
                            <Col span={24}>
                              <div className="mb-2">
                                <strong>房型映射列表（最多50个）：</strong>
                                <Button
                                  type="dashed"
                                  onClick={() => add()}
                                  icon={<PlusOutlined />}
                                  className="ml-2"
                                  disabled={fields.length >= 50}
                                >
                                  添加房型映射
                                </Button>
                              </div>
                            </Col>
                          </Row>
                          {fields.map((field, index) => {
                            const { key, ...restField } = field;
                            return (
                            <Card key={key} className="mb-4" size="small">
                              <Row gutter={[16, 16]} align="middle">
                                <Col span={4}>
                                  <Form.Item
                                    {...restField}
                                    label="携程售卖产品ID"
                                    name={[field.name, 'subRoomId']}
                                    rules={[{ required: true, message: '请输入携程售卖产品ID' }]}
                                  >
                                    <Input placeholder="必填" type="number" />
                                  </Form.Item>
                                </Col>
                                <Col span={4}>
                                  <Form.Item
                                    {...restField}
                                    label="合作方房型Code"
                                    name={[field.name, 'roomTypeCode']}
                                    rules={[{ required: true, message: '请输入合作方房型 code' }]}
                                  >
                                    <Input placeholder="必填" />
                                  </Form.Item>
                                </Col>
                                <Col span={4}>
                                  <Form.Item
                                    {...restField}
                                    label="合作方房型名称"
                                    name={[field.name, 'roomTypeName']}
                                  >
                                    <Input placeholder="可选" />
                                  </Form.Item>
                                </Col>
                                <Col span={4}>
                                  <Form.Item
                                    {...restField}
                                    label="合作方价格计划Code"
                                    name={[field.name, 'ratePlanCode']}
                                  >
                                    <Input placeholder="可选" />
                                  </Form.Item>
                                </Col>
                                <Col span={4}>
                                  <Form.Item
                                    {...restField}
                                    label="合作方价格计划名称"
                                    name={[field.name, 'ratePlanName']}
                                  >
                                    <Input placeholder="可选" />
                                  </Form.Item>
                                </Col>
                                <Col span={4}>
                                  <Form.Item label=" " colon={false}>
                                    <Button
                                      danger
                                      icon={<DeleteOutlined />}
                                      onClick={() => remove(field.name)}
                                    >
                                      删除
                                    </Button>
                                  </Form.Item>
                                </Col>
                              </Row>
                            </Card>
                            );
                          })}
                          {fields.length === 0 && (
                            <Alert
                              message="请至少添加一个房型映射"
                              type="info"
                              showIcon
                              className="mb-4"
                            />
                          )}
                        </>
                      )}
                    </Form.List>
                  );
                }
                return null;
              }}
            </Form.Item>

            <Row>
              <Col span={24}>
                <Form.Item>
                  <Space>
                    <Button type="primary" htmlType="submit" loading={loading}>
                      提交设置
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
                {data.requestId && (
                  <div>
                    <strong>日志序列号：</strong> {data.requestId}
                  </div>
                )}
                {clientTime && (
                  <div>
                    <strong>客户端时间：</strong> {clientTime}
                  </div>
                )}
                {serverTime && (
                  <div>
                    <strong>服务器时间：</strong> {serverTime}
                  </div>
                )}
              </div>

              {data.resultList && (
                <div className="space-y-4">
                  {data.resultList.hotel && (
                    <Card size="small" title="酒店级别处理结果">
                      <Row gutter={[16, 16]}>
                        <Col span={8}>
                          <strong>携程酒店ID：</strong> {data.resultList.hotel.hotelId}
                        </Col>
                        <Col span={8}>
                          <strong>处理结果码：</strong>{' '}
                          <Tag color={data.resultList.hotel.code === '0' ? 'success' : 'error'}>
                            {data.resultList.hotel.code}
                          </Tag>
                        </Col>
                        <Col span={8}>
                          <strong>处理结果信息：</strong> {data.resultList.hotel.message}
                        </Col>
                      </Row>
                    </Card>
                  )}

                  {data.resultList.roomLists && data.resultList.roomLists.length > 0 && (
                    <Card size="small" title="房型级别处理结果">
                      <Table
                        columns={roomResultTableColumns}
                        dataSource={data.resultList.roomLists}
                        rowKey={(record) => record.subRoomId}
                        pagination={false}
                        scroll={{ x: 600 }}
                      />
                    </Card>
                  )}
                </div>
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

