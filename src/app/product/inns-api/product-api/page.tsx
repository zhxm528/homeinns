'use client';
import '@ant-design/v5-patch-for-react-19';

import { useState } from 'react';
import Link from 'next/link';
// @ts-ignore: antd may not have types installed in this environment
import 'antd/dist/reset.css';
// @ts-ignore: antd types might be missing
import { Button, Input, message, Form, Space, Card, Row, Col, Select, DatePicker, Table } from 'antd';
// @ts-ignore: antd locale types might be missing
import zhCN from 'antd/locale/zh_CN';
// @ts-ignore: dayjs types might be missing
import dayjs from 'dayjs';
// @ts-ignore: antd types might be missing
import { ConfigProvider } from 'antd';

export default function ProductApiPage() {
  const [loading, setLoading] = useState(false);
  const [requestData, setRequestData] = useState<any>(null);
  const [responseData, setResponseData] = useState<any>(null);
  const [form] = Form.useForm();

  const handleQuery = async (values: any) => {
    setLoading(true);
    try {
      // 构建请求体
      const requestBody: Record<string, any> = {};
      
      if (values.ResvType) requestBody.ResvType = values.ResvType;
      if (values.HotelCd) requestBody.HotelCd = values.HotelCd;
      if (values.ArrDate) requestBody.ArrDate = dayjs(values.ArrDate).format('YYYY-MM-DD');
      if (values.DepDate) requestBody.DepDate = dayjs(values.DepDate).format('YYYY-MM-DD');
      if (values.RmTypeCds) requestBody.RmTypeCds = values.RmTypeCds;
      if (values.RoomNum) requestBody.RoomNum = parseInt(values.RoomNum, 10);
      if (values.Adults) requestBody.Adults = parseInt(values.Adults, 10);
      if (values.IsAvail !== undefined && values.IsAvail !== null) requestBody.IsAvail = parseInt(values.IsAvail, 10);
      if (values.MembershipType) requestBody.MembershipType = values.MembershipType;
      if (values.MemberNo) requestBody.MemberNo = values.MemberNo;
      if (values.RuleDimension) requestBody.RuleDimension = values.RuleDimension;
      if (values.AllowLoadPromotion !== undefined) requestBody.AllowLoadPromotion = values.AllowLoadPromotion;
      if (values.OnlyShowEnabledPromotion !== undefined) requestBody.OnlyShowEnabledPromotion = values.OnlyShowEnabledPromotion;

      // 保存请求数据用于显示
      setRequestData(requestBody);

      const res = await fetch('/api/product/inns-api/product-api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      const json = await res.json();

      if (json.success) {
        setResponseData(json.data);
        message.success('查询成功');
      } else {
        message.error(json.message || '查询失败');
        setResponseData(null);
      }
    } catch (e: any) {
      message.error(e?.message || '请求失败');
      setResponseData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    form.resetFields();
    setRequestData(null);
    setResponseData(null);
  };

  // 将响应数据转换为表格数据
  const convertResponseToTableData = (data: any) => {
    // 添加调试日志
    console.log('[表格转换] 接收到的数据:', data);
    console.log('[表格转换] 数据类型:', typeof data);
    
    if (!data) {
      console.log('[表格转换] 数据为空');
      return [];
    }
    
    // 打印数据的所有键
    if (typeof data === 'object') {
      console.log('[表格转换] 数据键:', Object.keys(data));
    }
    
    // 根据后端返回结构，responseData 应该是如家接口的原始响应数据
    // 应该直接包含 Products 字段
    let products: any[] = [];
    
    // 优先检查 data.Products（最常见的情况）
    if (data.Products && Array.isArray(data.Products)) {
      products = data.Products;
      console.log('[表格转换] 从 data.Products 获取数据，数组长度:', products.length);
    }
    // 如果 data.data 存在且包含 Products（双重包装的情况）
    else if (data.data && data.data.Products && Array.isArray(data.data.Products)) {
      products = data.data.Products;
      console.log('[表格转换] 从 data.data.Products 获取数据，数组长度:', products.length);
    }
    // 如果 data.data 本身就是数组（可能是直接返回的 Products 数组）
    else if (data.data && Array.isArray(data.data)) {
      products = data.data;
      console.log('[表格转换] data.data 是数组，直接使用，数组长度:', products.length);
    }
    else {
      console.log('[表格转换] 未找到 Products 数组');
      console.log('[表格转换] 完整数据结构:', JSON.stringify(data, null, 2));
      return [];
    }
    
    if (products.length === 0) {
      console.log('[表格转换] Products 数组为空');
      return [];
    }
    
    const tableData: any[] = [];
    
    products.forEach((product: any, productIndex: number) => {
      const roomType = product.RoomType || {};
      const roomTypeCode = roomType.RoomTypeCode || '';
      const roomTypeName = roomType.RoomTypeName || '';
      
      if (product.RoomRates && Array.isArray(product.RoomRates)) {
        product.RoomRates.forEach((rate: any, rateIndex: number) => {
          const rateCode = rate.RateCode || '';
          const rateName = rate.RateName || '';
          
          if (rate.RoomRateDetailDailys && Array.isArray(rate.RoomRateDetailDailys)) {
            rate.RoomRateDetailDailys.forEach((daily: any, dailyIndex: number) => {
              tableData.push({
                key: `${productIndex}-${rateIndex}-${dailyIndex}`,
                roomTypeCode,
                roomTypeName,
                rateCode,
                rateName,
                date: daily.StDate ? dayjs(daily.StDate).format('YYYY-MM-DD') : '',
                price1: daily.Prs1 || 0,
                price2: daily.Prs2 || 0,
                price3: daily.Prs3 || 0,
                price4: daily.Prs4 || 0,
                availableRooms: daily.AvailableRooms || 0,
                tax: daily.Tax || 0,
                serviceCharge: daily.ServiceCharge || 0,
              });
            });
          } else {
            // 如果没有每日详情，至少显示价格计划信息
            tableData.push({
              key: `${productIndex}-${rateIndex}-0`,
              roomTypeCode,
              roomTypeName,
              rateCode,
              rateName,
              date: '-',
              price1: '-',
              price2: '-',
              price3: '-',
              price4: '-',
              availableRooms: '-',
              tax: '-',
              serviceCharge: '-',
            });
          }
        });
      } else {
        // 如果没有价格计划，至少显示房型信息
        tableData.push({
          key: `${productIndex}-0-0`,
          roomTypeCode,
          roomTypeName,
          rateCode: '-',
          rateName: '-',
          date: '-',
          price1: '-',
          price2: '-',
          price3: '-',
          price4: '-',
          availableRooms: '-',
          tax: '-',
          serviceCharge: '-',
        });
      }
    });
    
    console.log('[表格转换] 转换后的表格数据条数:', tableData.length);
    return tableData;
  };

  const tableColumns = [
    {
      title: '房型编号',
      dataIndex: 'roomTypeCode',
      key: 'roomTypeCode',
      width: 100,
    },
    {
      title: '房型名称',
      dataIndex: 'roomTypeName',
      key: 'roomTypeName',
      width: 150,
    },
    {
      title: '价格码',
      dataIndex: 'rateCode',
      key: 'rateCode',
      width: 100,
    },
    {
      title: '价格名称',
      dataIndex: 'rateName',
      key: 'rateName',
      width: 150,
    },
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      width: 120,
    },
    {
      title: '1人价格',
      dataIndex: 'price1',
      key: 'price1',
      width: 100,
      align: 'right' as const,
    },
    {
      title: '2人价格',
      dataIndex: 'price2',
      key: 'price2',
      width: 100,
      align: 'right' as const,
    },
    {
      title: '3人价格',
      dataIndex: 'price3',
      key: 'price3',
      width: 100,
      align: 'right' as const,
    },
    {
      title: '4人价格',
      dataIndex: 'price4',
      key: 'price4',
      width: 100,
      align: 'right' as const,
    },
    {
      title: '可用房间数',
      dataIndex: 'availableRooms',
      key: 'availableRooms',
      width: 100,
      align: 'right' as const,
    },
    {
      title: '税费',
      dataIndex: 'tax',
      key: 'tax',
      width: 80,
      align: 'right' as const,
    },
    {
      title: '服务费',
      dataIndex: 'serviceCharge',
      key: 'serviceCharge',
      width: 100,
      align: 'right' as const,
    },
  ];

  return (
    <ConfigProvider locale={zhCN}>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col min-h-[calc(100vh-64px)]">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">产品接口</h1>
              <p className="text-gray-600">如家接口 - GetProducts</p>
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
                ResvType: 'CSRV',
                RoomNum: 1,
                Adults: 1,
                IsAvail: 1,
                AllowLoadPromotion: true,
                OnlyShowEnabledPromotion: false,
              }}
            >
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Form.Item 
                    label="预定类型" 
                    name="ResvType"
                    rules={[{ required: true, message: '请输入预定类型' }]}
                  >
                    <Input placeholder="CSRV（固定字符串）" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item 
                    label="酒店编号" 
                    name="HotelCd"
                    rules={[{ required: true, message: '请输入酒店编号' }]}
                  >
                    <Input placeholder="酒店6位长度的唯一编号" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item 
                    label="到店日期" 
                    name="ArrDate"
                    rules={[{ required: true, message: '请选择到店日期' }]}
                  >
                    <DatePicker 
                      className="w-full"
                      format="YYYY-MM-DD"
                      placeholder="yyyy-MM-dd"
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item 
                    label="离店日期" 
                    name="DepDate"
                    rules={[{ required: true, message: '请选择离店日期' }]}
                  >
                    <DatePicker 
                      className="w-full"
                      format="YYYY-MM-DD"
                      placeholder="yyyy-MM-dd"
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item 
                    label="房型编号" 
                    name="RmTypeCds"
                  >
                    <Input placeholder="不填写则获取酒店全量房型数据" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item 
                    label="房间数" 
                    name="RoomNum"
                    rules={[{ required: true, message: '请输入房间数' }]}
                  >
                    <Input type="number" placeholder="正整数，默认为1" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item 
                    label="成人数" 
                    name="Adults"
                    rules={[{ required: true, message: '请输入成人数' }]}
                  >
                    <Input type="number" placeholder="正整数，默认为1" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item 
                    label="可用性过滤" 
                    name="IsAvail"
                  >
                    <Select
                      options={[
                        { label: '0 - 实时查询', value: 0 },
                        { label: '1 - 渠道拉取数据缓存（默认）', value: 1 },
                      ]}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item 
                    label="会员类型" 
                    name="MembershipType"
                  >
                    <Select
                      allowClear
                      placeholder="选择会员类型"
                      options={[
                        { label: 'cy - 商旅企业', value: 'cy' },
                        { label: '10 - 钻石账户（首旅汇如Life）', value: '10' },
                        { label: '2 - 铂金账户（首旅汇如Life）', value: '2' },
                        { label: '3 - 金账户（首旅汇如Life）', value: '3' },
                        { label: '4 - 银账户（首旅汇如Life）', value: '4' },
                        { label: '5 - E账户（首旅汇如Life）', value: '5' },
                        { label: 'E - 荣誉（首享会Bravo）', value: 'E' },
                        { label: 'D - 传奇（首享会Bravo）', value: 'D' },
                        { label: 'C - 大使（首享会Bravo）', value: 'C' },
                        { label: 'B - 精英（首享会Bravo）', value: 'B' },
                        { label: 'A - 新秀（首享会Bravo）', value: 'A' },
                      ]}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item 
                    label="企业编号" 
                    name="MemberNo"
                  >
                    <Input placeholder="商旅企业预订专用，MembershipType=CY时必填" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item 
                    label="自定义规则维度" 
                    name="RuleDimension"
                  >
                    <Input placeholder="仅用于官网传参" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item 
                    label="是否加载活动产品" 
                    name="AllowLoadPromotion"
                    rules={[{ required: true, message: '请选择是否加载活动产品' }]}
                  >
                    <Select
                      options={[
                        { label: '是', value: true },
                        { label: '否', value: false },
                      ]}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item 
                    label="是否只显示可用活动产品" 
                    name="OnlyShowEnabledPromotion"
                    rules={[{ required: true, message: '请选择是否只显示可用活动产品' }]}
                  >
                    <Select
                      options={[
                        { label: '是', value: true },
                        { label: '否', value: false },
                      ]}
                    />
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

          {/* 显示请求JSON */}
          {requestData && (
            <Card className="mb-6">
              <div className="mb-4">
                <h2 className="text-xl font-semibold mb-2">调用接口的JSON格式入参</h2>
                <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">
                  {JSON.stringify(requestData, null, 2)}
                </pre>
              </div>
            </Card>
          )}

          {/* 显示响应数据表格 */}
          {responseData && (() => {
            const tableData = convertResponseToTableData(responseData);
            return (
              <Card className="mb-6">
                <div className="mb-4">
                  <h2 className="text-xl font-semibold mb-4">接口返回数据表格</h2>
                  {responseData.ResCode !== undefined && (
                    <div className="mb-4 text-sm">
                      <span className="font-semibold">返回码：</span>
                      <span className={responseData.ResCode === 0 ? 'text-green-600' : 'text-red-600'}>
                        {responseData.ResCode}
                      </span>
                      {responseData.ResDesc && (
                        <>
                          <span className="ml-4 font-semibold">返回描述：</span>
                          <span>{responseData.ResDesc}</span>
                        </>
                      )}
                      {responseData.HotelCd && (
                        <>
                          <span className="ml-4 font-semibold">酒店编号：</span>
                          <span>{responseData.HotelCd}</span>
                        </>
                      )}
                      <span className="ml-4 font-semibold">表格数据条数：</span>
                      <span>{tableData.length}</span>
                    </div>
                  )}
                  {tableData.length > 0 ? (
                    <Table
                      columns={tableColumns}
                      dataSource={tableData}
                      pagination={{
                        pageSize: 20,
                        showSizeChanger: true,
                        showTotal: (total) => `共 ${total} 条记录`,
                      }}
                      scroll={{ x: 1200 }}
                      size="small"
                    />
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p className="text-lg font-semibold mb-2">暂无表格数据</p>
                      <p className="text-sm mt-2 mb-4">请检查响应数据中是否包含 Products 数组</p>
                      <div className="text-left bg-gray-100 p-4 rounded-lg max-w-2xl mx-auto">
                        <p className="text-xs font-semibold mb-2">数据结构调试信息：</p>
                        <p className="text-xs">
                          <span className="font-semibold">数据键：</span>
                          {responseData && typeof responseData === 'object' 
                            ? Object.keys(responseData).join(', ') 
                            : '无'}
                        </p>
                        {responseData && responseData.Products !== undefined && (
                          <p className="text-xs mt-1">
                            <span className="font-semibold">Products 类型：</span>
                            {Array.isArray(responseData.Products) 
                              ? `数组（长度：${responseData.Products.length}）` 
                              : typeof responseData.Products}
                          </p>
                        )}
                        {responseData && responseData.data && (
                          <p className="text-xs mt-1">
                            <span className="font-semibold">data.data 存在：</span>
                            {responseData.data.Products !== undefined 
                              ? (Array.isArray(responseData.data.Products) 
                                  ? `数组（长度：${responseData.data.Products.length}）` 
                                  : typeof responseData.data.Products)
                              : '无 Products 字段'}
                          </p>
                        )}
                        <p className="text-xs mt-2 text-gray-600">
                          提示：请打开浏览器控制台查看详细的调试日志
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            );
          })()}

          {/* 显示响应JSON */}
          {responseData && (
            <Card className="mb-6">
              <div className="mb-4">
                <h2 className="text-xl font-semibold mb-2">接口返回的JSON格式字符串</h2>
                <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm max-h-96">
                  {JSON.stringify(responseData, null, 2)}
                </pre>
              </div>
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
    </ConfigProvider>
  );
}
