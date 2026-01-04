import React, { useState } from 'react';
import { Form, Input, Select, DatePicker, InputNumber, Card, Button, Space, Typography, message, Row, Col, Modal, Table } from 'antd';
import { PlusOutlined, MinusCircleOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import type { FormInstance } from 'antd/es/form';
import dayjs from 'dayjs';
import locale from 'antd/es/date-picker/locale/zh_CN';
import TokenCheck from '../../components/common/TokenCheck';
import { useLocation } from 'react-router-dom';

const { TextArea } = Input;
const { RangePicker } = DatePicker;

interface RoomRequest {
  roomType: string;
  count: number;
  breakfast: string;  // 新增早餐字段
}

interface GroupFormData {
  // 基本信息
  teamName: string;
  salesperson: string;
  hotel: string;
  company: string;
  
  // 联系人信息
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  
  // 确认函接收人
  confirmationReceivers: string[];
  
  // 预订需求
  paymentMethod: string[];    // 新增结算方式
  latestCancellationDays: number;  // 新增最晚取消天数
  latestCancellationTime: string;  // 新增入住当晚最晚取消时间
  advanceBookingDays: number;      // 新增提前预订天数
  validPeriod: [dayjs.Dayjs, dayjs.Dayjs];  // 改名：dateRange -> validPeriod
  roomRequests: RoomRequest[];
  estimatedGuestCount: number;
  minRoomCount: number;      // 新增团队起订房间数
  specialRequests?: string;
  bookingPolicy: string;
  cancellationPolicy: string;
  noshowPolicy: string;
  invoiceRequirements?: string;  // 新增发票要求
  guestBenefits?: string;       // 新增客人权益
}

interface PriceInfo {
  roomTypeCode: string;
  roomTypeName: string;
  price: number;
  calculationResult: '通过' | '未通过';
  suggestedPrice: number;
}

const statusOptions = [
  { label: '草稿', value: 'DRAFT' },
  { label: '预订中', value: 'CONFIRMING' },
  { label: '已完成', value: 'COMPLETED' }
];

const roomTypeOptions = [
  { label: '标准单人间', value: 'SINGLE' },
  { label: '标准双人间', value: 'DOUBLE' },
  { label: '豪华单人间', value: 'DELUXE_SINGLE' },
  { label: '豪华双人间', value: 'DELUXE_DOUBLE' },
  { label: '套房', value: 'SUITE' }
];

const breakfastOptions = [
  { label: '无早', value: 'NO_BREAKFAST' },
  { label: '单早', value: 'SINGLE_BREAKFAST' },
  { label: '双早', value: 'DOUBLE_BREAKFAST' }
];

const GroupAdd: React.FC = () => {
  const [form] = Form.useForm<GroupFormData>();
  const [loading, setLoading] = useState(false);
  const [expandedPanels, setExpandedPanels] = useState({
    basic: true,
    contact: true,
    confirmation: true,
    booking: true
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false);
  const [priceInfo, setPriceInfo] = useState<PriceInfo[]>([]);
  const location = useLocation();
  const isEditPage = location.pathname.includes('/edit/');
  const [isCloseBookingModalVisible, setIsCloseBookingModalVisible] = useState(false);

  const togglePanel = (panel: keyof typeof expandedPanels) => {
    setExpandedPanels(prev => ({
      ...prev,
      [panel]: !prev[panel]
    }));
  };

  const handleSubmit = async (values: GroupFormData) => {
    try {
      setLoading(true);
      const [checkInDate, checkOutDate] = values.validPeriod;
      
      const formData = {
        ...values,
        checkInDate: checkInDate.format('YYYY-MM-DD'),
        checkOutDate: checkOutDate.format('YYYY-MM-DD')
      };

      // 模拟获取价格信息
      const mockPriceInfo: PriceInfo[] = values.roomRequests.map(request => {
        const roomType = roomTypeOptions.find(opt => opt.value === request.roomType);
        const basePrice = Math.floor(Math.random() * 500) + 300; // 模拟基础价格
        const calculationResult = Math.random() > 0.5 ? '通过' : '未通过'; // 模拟测算结果
        const suggestedPrice = Math.round(basePrice * 0.95); // 模拟建议价格

        return {
          roomTypeCode: request.roomType,
          roomTypeName: roomType?.label || '',
          price: basePrice,
          calculationResult,
          suggestedPrice
        };
      });

      setPriceInfo(mockPriceInfo);
      setIsModalVisible(true);
    } catch (error) {
      console.error('保存失败:', error);
      message.error('保存失败');
    } finally {
      setLoading(false);
    }
  };

  const handleModalOk = async () => {
    try {
      setLoading(true);
      // TODO: 调用后端 API 保存数据
      message.success('保存成功');
      setIsModalVisible(false);
    } catch (error) {
      console.error('保存失败:', error);
      message.error('保存失败');
    } finally {
      setLoading(false);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const handleViewConfirmation = () => {
    const formData = form.getFieldsValue();
    setIsConfirmationModalVisible(true);
  };

  const handleConfirmationModalCancel = () => {
    setIsConfirmationModalVisible(false);
  };

  const priceColumns = [
    {
      title: '房型代码',
      dataIndex: 'roomTypeCode',
      key: 'roomTypeCode',
    },
    {
      title: '房型名称',
      dataIndex: 'roomTypeName',
      key: 'roomTypeName',
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `¥${price}`,
    },
    {
      title: '测算结果',
      dataIndex: 'calculationResult',
      key: 'calculationResult',
      render: (result: '通过' | '未通过') => (
        <span style={{ color: result === '通过' ? '#52c41a' : '#f5222d' }}>
          {result}
        </span>
      ),
    },
    {
      title: '建议价格',
      dataIndex: 'suggestedPrice',
      key: 'suggestedPrice',
      render: (price: number) => `¥${price}`,
    },
  ];

  const handleCloseBooking = () => {
    setIsCloseBookingModalVisible(true);
  };

  const handleCloseBookingConfirm = () => {
    // TODO: 实现关闭预订的后端逻辑
    message.success('团队已关闭');
    setIsCloseBookingModalVisible(false);
  };

  const handleCloseBookingCancel = () => {
    setIsCloseBookingModalVisible(false);
  };

  // 添加订单列表的列定义
  const orderColumns = [
    {
      title: 'CRS订单号',
      dataIndex: 'crsOrderNo',
      key: 'crsOrderNo',
      width: 120,
    },
    {
      title: 'PMS订单号',
      dataIndex: 'pmsOrderNo',
      key: 'pmsOrderNo',
      width: 120,
    },
    {
      title: '第三方订单号',
      dataIndex: 'thirdPartyOrderNo',
      key: 'thirdPartyOrderNo',
      width: 120,
    },
    {
      title: '客人姓名',
      dataIndex: 'guestName',
      key: 'guestName',
      width: 100,
      render: (name: string) => {
        if (!name) return '-';
        return name.replace(/(?<=.{1})./g, '*');
      },
    },
    {
      title: '酒店',
      dataIndex: 'hotelName',
      key: 'hotelName',
      width: 120,
    },
    {
      title: '入住日期',
      dataIndex: 'checkInDate',
      key: 'checkInDate',
      width: 100,
    },
    {
      title: '离店日期',
      dataIndex: 'checkOutDate',
      key: 'checkOutDate',
      width: 100,
    },
    {
      title: '房间数',
      dataIndex: 'roomCount',
      key: 'roomCount',
      width: 80,
    },
    {
      title: '早餐',
      dataIndex: 'breakfast',
      key: 'breakfast',
      width: 80,
    },
    {
      title: '房价',
      dataIndex: 'roomPrice',
      key: 'roomPrice',
      width: 100,
      render: (price: number) => `¥${price}`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <span style={{ 
          color: status === '已确认' ? '#52c41a' : 
                 status === '已离店' ? '#faad14' : 
                 status === '已取消' ? '#f5222d' : '#1890ff'
        }}>
          {status}
        </span>
      ),
    },
  ];

  // 模拟订单数据
  const mockOrders = [
    {
      key: '1',
      crsOrderNo: 'CRS20240301001',
      pmsOrderNo: 'PMS20240301001',
      thirdPartyOrderNo: 'TP20240301001',
      guestName: '张三',
      hotelName: '北京建国饭店',
      checkInDate: '2024-03-01',
      checkOutDate: '2024-03-03',
      roomCount: 2,
      breakfast: '双早',
      roomPrice: 888,
      status: '已确认'
    },
    {
      key: '2',
      crsOrderNo: 'CRS20240301002',
      pmsOrderNo: 'PMS20240301002',
      thirdPartyOrderNo: 'TP20240301002',
      guestName: '李四',
      hotelName: '北京建国饭店',
      checkInDate: '2024-03-01',
      checkOutDate: '2024-03-02',
      roomCount: 1,
      breakfast: '单早',
      roomPrice: 666,
      status: '已离店'
    },
    {
      key: '2',
      crsOrderNo: 'CRS20240301003',
      pmsOrderNo: 'PMS20240301003',
      thirdPartyOrderNo: 'TP20240301003',
      guestName: '李四',
      hotelName: '北京建国饭店',
      checkInDate: '2024-03-01',
      checkOutDate: '2024-03-02',
      roomCount: 1,
      breakfast: '单早',
      roomPrice: 666,
      status: '已离店'
    }
  ];

  const handleExportPDF = () => {
    message.success('正在导出PDF，请稍候...');
    // TODO: 实现导出PDF的逻辑
  };

  return (
    <TokenCheck checkToken={false}>
    <div style={{ padding: 24 }}>
      <Card>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Typography.Title level={4}>
              {isEditPage ? '编辑团队预订' : '新增团队预订'}
            </Typography.Title>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
                teamName: '中信集团培训团',
                salesperson: 'zhangsan',
                hotel: 'BJJD',
                company: 'BJLY',
                contactName: '张三',
                contactPhone: '13800138000',
                contactEmail: 'zhangsan@example.com',
                confirmationReceivers: ['zhangsan@example.com'],
                paymentMethod: ['CASH_ONLY'],
                latestCancellationDays: 1,
                latestCancellationTime: '18:00',
                advanceBookingDays: 1,
                bookingPolicy: '预订政策说明',
                cancellationPolicy: '取消政策说明',
                noshowPolicy: 'No-show政策说明',
                estimatedGuestCount: 10,
                minRoomCount: 5,
                validPeriod: [dayjs(), dayjs().add(30, 'day')],
                roomRequests: [{ 
                  roomType: 'SINGLE', 
                  count: 5, 
                  breakfast: 'DOUBLE_BREAKFAST',
                  price: 500
                }]
            }}
          >
            {/* 基本信息 */}
            <Card 
              title={
                  <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                <Space>
                  <span>基本信息</span>
                      <span style={{ fontSize: '12px', color: '#999' }}>(团队创建后 团队码系统自动生成)</span>
                  <Button 
                    type="text" 
                    icon={expandedPanels.basic ? <UpOutlined /> : <DownOutlined />}
                    onClick={() => togglePanel('basic')}
                  />
                    </Space>
                    {isEditPage && (
                      <span style={{ color: '#1890ff', fontWeight: 'bold' }}>
                        团队号：BJ20240301
                      </span>
                    )}
                </Space>
              } 
              type="inner"
              bodyStyle={{ display: expandedPanels.basic ? 'block' : 'none' }}
              style={{ marginBottom: 16 }}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="teamName"
                    label="团队名称"
                    rules={[{ required: true, message: '请输入团队名称' }]}
                  >
                      <Input 
                        placeholder="请输入团队名称，例如：中信集团培训团" 
                        size="large"
                      />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                      name="salesperson"
                      label="集团销售员"
                      rules={[{ required: true, message: '请选择销售员' }]}
                  >
                    <Select
                        placeholder="请选择销售员"
                        size="large"
                        options={[
                          { label: '张三', value: 'zhangsan' },
                          { label: '李四', value: 'lisi' },
                          { label: '王五', value: 'wangwu' },
                          { label: '赵六', value: 'zhaoliu' }
                        ]}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                      name="hotel"
                      label="预订酒店"
                      rules={[{ required: true, message: '请选择预订酒店' }]}
                  >
                    <Select
                        placeholder="请选择预订酒店"
                        size="large"
                        disabled={isEditPage}
                        options={[
                          { label: '北京建国饭店(200241)', value: 'BJJD' },
                          { label: '上海建国饭店(200242)', value: 'SHJD' },
                          { label: '广州建国饭店(200243)', value: 'GZJD' },
                          { label: '深圳建国饭店(200244)', value: 'SZJD' }
                        ]}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                      name="company"
                      label="协议公司"
                      rules={[{ required: true, message: '请选择协议公司' }]}
                  >
                    <Select
                        placeholder="请选择协议公司"
                        size="large"
                        disabled={isEditPage}
                        options={[
                          { label: '北京旅游有限公司(880123123)', value: 'BJLY' },
                          { label: '上海商务服务有限公司(880123124)', value: 'SHSW' },
                          { label: '广州会展服务有限公司(880123125)', value: 'GZHZ' },
                          { label: '深圳科技发展有限公司(880123126)', value: 'SZKJ' }
                        ]}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            {/* 联系人信息 */}
            <Card 
              title={
                <Space>
                    <span>协议公司联系人</span>
                  <Button 
                    type="text" 
                    icon={expandedPanels.contact ? <UpOutlined /> : <DownOutlined />}
                    onClick={() => togglePanel('contact')}
                  />
                </Space>
              } 
              type="inner"
              bodyStyle={{ display: expandedPanels.contact ? 'block' : 'none' }}
              style={{ marginBottom: 16 }}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="contactName"
                    label="联系人姓名"
                    rules={[{ required: true, message: '请输入联系人姓名' }]}
                  >
                      <Input 
                        placeholder="请输入联系人姓名" 
                        size="large"
                      />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="contactPhone"
                    label="联系电话"
                    rules={[
                      { required: true, message: '请输入联系电话' },
                      { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' }
                    ]}
                  >
                      <Input 
                        placeholder="请输入联系电话" 
                        size="large"
                      />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="contactEmail"
                      label="联系邮箱"
                    rules={[
                        { required: true, message: '请输入联系邮箱' },
                      { type: 'email', message: '请输入正确的邮箱地址' }
                    ]}
                  >
                      <Input 
                        placeholder="请输入联系邮箱" 
                        size="large"
                      />
                  </Form.Item>
                </Col>
              </Row>
            </Card>

              {/* 确认函接收人 */}
              <Card 
                title={
                  <Space>
                    <span>确认函接收人</span>
                    <Button 
                      type="text" 
                      icon={expandedPanels.confirmation ? <UpOutlined /> : <DownOutlined />}
                      onClick={() => togglePanel('confirmation')}
                    />
                  </Space>
                } 
                type="inner"
                bodyStyle={{ display: expandedPanels.confirmation ? 'block' : 'none' }}
                style={{ marginBottom: 16 }}
              >
                <Form.List
                  name="confirmationReceivers"
                  initialValue={['']}
                >
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map(({ key, name, ...restField }) => (
                        <Row key={key} gutter={16} style={{ marginBottom: 8 }}>
                          <Col span={22}>
                            <Form.Item
                              {...restField}
                              name={name}
                              rules={[
                                { required: true, message: '请输入接收邮箱' },
                                { type: 'email', message: '请输入正确的邮箱地址' }
                              ]}
                            >
                              <Input 
                                placeholder="请输入接收确认函的邮箱地址" 
                                size="large"
                              />
                            </Form.Item>
                          </Col>
                          <Col span={2}>
                            {fields.length > 1 && (
                              <Button
                                type="text"
                                danger
                                icon={<MinusCircleOutlined />}
                                onClick={() => remove(name)}
                                style={{ marginTop: 8 }}
                              />
                            )}
                          </Col>
                        </Row>
                      ))}
                      <Form.Item>
                        <Button
                          type="dashed"
                          onClick={() => add()}
                          block
                          icon={<PlusOutlined />}
                          size="large"
                        >
                          添加接收邮箱
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </Form.List>
              </Card>

            {/* 预订需求 */}
            <Card 
              title={
                <Space>
                  <span>预订需求</span>
                  <Button 
                    type="text" 
                    icon={expandedPanels.booking ? <UpOutlined /> : <DownOutlined />}
                    onClick={() => togglePanel('booking')}
                  />
                </Space>
              } 
              type="inner"
              bodyStyle={{ display: expandedPanels.booking ? 'block' : 'none' }}
              style={{ marginBottom: 16 }}
            >
              <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="paymentMethod"
                      label="结算方式（下单时校验）"
                      rules={[{ required: true, message: '请选择结算方式' }]}
                    >
                      <Select
                        mode="multiple"
                        placeholder="请选择结算方式"
                        size="large"
                        options={[
                          { label: '现付', value: 'CASH_ONLY' },
                          { label: '预付', value: 'PREPAID_ONLY' }
                        ]}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="advanceBookingDays"
                      label="提前预订天数"
                      rules={[{ required: true, message: '请输入提前预订天数' }]}
                    >
                      <InputNumber
                        min={0}
                        style={{ width: '100%' }}
                        placeholder="请输入提前预订天数"
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="latestCancellationDays"
                      label="须提前几天取消 (取消订单时校验)"
                      rules={[{ required: true, message: '请选择提前取消天数' }]}
                    >
                      <Select
                        placeholder="请选择提前取消天数"
                        size="large"
                        options={[
                          { label: '当天', value: '0' },
                          { label: '1天', value: '1' },
                          { label: '2天', value: '2' },
                          { label: '3天', value: '3' },
                          { label: '4天', value: '4' },
                          { label: '5天', value: '5' },
                          { label: '6天', value: '6' },
                          { label: '7天', value: '7' },
                          { label: '8天', value: '8' },
                          { label: '9天', value: '9' },
                          { label: '10天', value: '10' },
                        ]}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="latestCancellationTime"
                      label="入住当晚最晚取消时间 (取消订单时校验)"
                      rules={[{ required: true, message: '请选择最晚取消时间' }]}
                    >
                      <Select
                        placeholder="请选择最晚取消时间"
                        size="large"
                        options={[
                          { label: '15:00', value: '15:00' },
                          { label: '16:00', value: '16:00' },
                          { label: '17:00', value: '17:00' },
                          { label: '18:00', value: '18:00' },
                          { label: '19:00', value: '19:00' },
                          { label: '20:00', value: '20:00' },
                          { label: '21:00', value: '21:00' },
                          { label: '22:00', value: '22:00' }
                        ]}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      name="bookingPolicy"
                      label="预订政策  (确认函中显示)"
                      rules={[{ required: true, message: '请输入预订政策' }]}
                    >
                      <TextArea
                        rows={2}
                        placeholder="请输入预订政策说明"
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      name="cancellationPolicy"
                      label="取消政策 (确认函中显示)"
                      rules={[{ required: true, message: '请输入取消政策' }]}
                    >
                      <TextArea
                        rows={2}
                        placeholder="请输入取消政策说明"
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                <Col span={24}>
                  <Form.Item
                      name="noshowPolicy"
                      label="No-show政策 (确认函中显示)"
                      rules={[{ required: true, message: '请输入 No-show 政策' }]}
                    >
                      <TextArea
                        rows={2}
                        placeholder="请输入 No-show 政策说明，如未入住时的扣款规则等"
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="validPeriod"
                      label="有效期"
                      rules={[{ required: true, message: '请选择有效期' }]}
                    >
                      <RangePicker 
                        style={{ width: '100%' }} 
                        locale={locale}
                        placeholder={['开始日期', '结束日期']}
                        format="YYYY-MM-DD"
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="estimatedGuestCount"
                      label="预计总人数"
                      rules={[{ required: true, message: '请输入预计总人数' }]}
                    >
                      <InputNumber
                        min={1}
                        style={{ width: '100%' }}
                        placeholder="请输入预计总人数"
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="minRoomCount"
                      label="保底起订间夜数 (首次预订和取消时校验)"
                      rules={[{ required: true, message: '请输入团队起订房间数' }]}
                    >
                      <InputNumber
                        min={1}
                        style={{ width: '100%' }}
                        placeholder="请输入团队起订房间数"
                        size="large"
                      />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.List
                    name="roomRequests"
                    rules={[
                      {
                        validator: async (_, roomRequests) => {
                          if (!roomRequests || roomRequests.length < 1) {
                            return Promise.reject(new Error('至少添加一种房型'));
                          }
                        },
                      },
                    ]}
                  >
                    {(fields, { add, remove }, { errors }) => (
                      <>
                        {fields.map(({ key, name, ...restField }) => (
                          <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                            <Form.Item
                              {...restField}
                              name={[name, 'roomType']}
                              rules={[{ required: true, message: '请选择房型' }]}
                            >
                              <Select
                                placeholder="选择房型"
                                  style={{ width: 320 }}
                                  size="large"
                                options={roomTypeOptions}
                              />
                            </Form.Item>
                              <Form.Item
                                {...restField}
                                name={[name, 'breakfast']}
                                rules={[{ required: true, message: '请选择早餐' }]}
                              >
                                <Select
                                  placeholder="早餐"
                                  style={{ width: 120 }}
                                  size="large"
                                  options={breakfastOptions}
                                />
                              </Form.Item>
                              <Form.Item
                                {...restField}
                                name={[name, 'price']}
                                rules={[{ required: true, message: '请输入房价' }]}
                              >
                                <InputNumber
                                  min={0}
                                  placeholder="房价"
                                  style={{ width: 160 }}
                                  prefix="¥"
                                  precision={2}
                                  size="large"
                              />
                            </Form.Item>
                            {fields.length > 1 && (
                              <MinusCircleOutlined onClick={() => remove(name)} />
                            )}
                          </Space>
                        ))}
                        <Form.Item>
                          <Button
                            type="dashed"
                            onClick={() => add()}
                            block
                            icon={<PlusOutlined />}
                              size="large"
                          >
                            添加房型
                          </Button>
                          <Form.ErrorList errors={errors} />
                        </Form.Item>
                      </>
                    )}
                  </Form.List>
                </Col>
                  <Col span={24}>
                    <Form.Item
                      name="specialRequests"
                      label="特别需求 (确认函中显示)"
                    >
                      <TextArea
                        rows={4}
                        placeholder="请输入特别需求，如连通房、无障碍房、会议支持等"
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                  <Form.Item
                      name="invoiceRequirements"
                      label="发票要求 (确认函中显示)"
                    >
                      <TextArea
                        rows={2}
                        placeholder="请输入发票要求，如开票金额、开票类型等"
                        size="large"
                    />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                      name="guestBenefits"
                      label="客人权益 (确认函中显示)"
                  >
                    <TextArea
                        rows={2}
                        placeholder="请输入客人权益，如延迟退房、免费取消等"
                        size="large"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            <Form.Item>
              <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                  <Button onClick={() => form.resetFields()} size="large">重置</Button>
                  <Button type="primary" htmlType="submit" loading={loading} size="large">
                    提交&测算
                  </Button>
                  {isEditPage && (
                    <>
                      <Button type="primary" size="large" onClick={handleViewConfirmation}>
                        团队订单明细
                      </Button>
                      <Button type="primary" danger size="large" onClick={handleCloseBooking}>
                        关闭预订
                      </Button>
                    </>
                  )}
              </Space>
            </Form.Item>
          </Form>

            <Modal
              title="价格确认"
              open={isModalVisible}
              onOk={handleModalOk}
              onCancel={handleModalCancel}
              width={800}
              okText="确认"
              cancelText="取消"
            >
              <Table
                columns={priceColumns}
                dataSource={priceInfo}
                rowKey="roomTypeCode"
                pagination={false}
                bordered
              />
            </Modal>

            <Modal
              title="订单明细"
              open={isConfirmationModalVisible}
              onCancel={handleConfirmationModalCancel}
              width={1200}
              footer={null}
            >
              <div style={{ marginBottom: 16, textAlign: 'right' }}>
                <Button type="primary" onClick={handleExportPDF}>
                  导出PDF
                </Button>
              </div>
              <Table
                columns={orderColumns}
                dataSource={mockOrders}
                pagination={false}
                size="middle"
                bordered
                scroll={{ x: 'max-content' }}
              />
            </Modal>

            <Modal
              title="关闭预订"
              open={isCloseBookingModalVisible}
              onOk={handleCloseBookingConfirm}
              onCancel={handleCloseBookingCancel}
              okText="确认"
              cancelText="取消"
            >
              <p>关闭后，该团队不再接收新的新的预订，请知晓。</p>
            </Modal>
        </Space>
      </Card>
    </div>
    </TokenCheck>
  );
};

export default GroupAdd;
