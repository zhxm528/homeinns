import React, { useState } from 'react';
import { Card, Form, Input, DatePicker, Button, Row, Col, Space, Select, InputNumber, Table, Tag, Tooltip, Modal, message } from 'antd';

import HotelSelect from '../../components/common/HotelSelect';


import ChannelSelect from '../../components/common/ChannelSelect';

import RateCodeSelect from '../../components/common/RateCodeSelect';
import dayjs from 'dayjs';
import locale from 'antd/es/date-picker/locale/zh_CN';
import 'dayjs/locale/zh-cn';
import TokenCheck from '../../components/common/TokenCheck';
import request from '../../utils/request';

const { RangePicker } = DatePicker;

// 新的房型数据接口
interface BookingDailyRate {
  stayDate: string;
  isAvailable: string;
  remainingInventory: number;
  channelSingleOccupancy: number;
  hotelSingleOccupancy: number;
  agentSingleOccupancy: number;
}

interface BookingRoomType {
  roomTypeId: string;
  roomTypeCode: string;
  roomTypeName: string;
  description: string;
  standardPrice: number;
  maxOccupancy: number;
  physicalInventory: number;
  bookingDailyRate: BookingDailyRate[];
}

interface RoomTypeResponse {
  hotelId: string;
  chainId: string;
  checkIn: string;
  checkOut: string;
  channelCode: string;
  rateCode: string;
  bookingRoomTypes: BookingRoomType[];
}

// 表格展示用的房型数据接口
interface RoomTypeTableData {
  key: string;
  roomTypeId: string;
  roomTypeCode: string;
  roomTypeName: string;
  description: string;
  standardPrice: number;
  maxOccupancy: number;
  physicalInventory: number;
  minRemainingInventory: number;
  avgChannelPrice: number;
  avgHotelPrice: number;
  avgAgentPrice: number;
  isAvailable: boolean;
  bookingDailyRate: BookingDailyRate[];
}

const ReservationAdd: React.FC = () => {
  const [form] = Form.useForm();
  const [selectedHotelId, setSelectedHotelId] = useState<string>('');
  const [roomTypeData, setRoomTypeData] = useState<RoomTypeTableData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);
  
  // 预订窗口相关状态
  const [bookingModalVisible, setBookingModalVisible] = useState<boolean>(false);
  const [selectedRoomType, setSelectedRoomType] = useState<RoomTypeTableData | null>(null);
  const [bookingForm] = Form.useForm();
  const [bookingLoading, setBookingLoading] = useState<boolean>(false);
  
  // 存储主表单数据，用于预订时获取
  const [mainFormData, setMainFormData] = useState<any>(null);

  // 处理API响应数据，转换为表格数据
  const processRoomTypeData = (responseData: RoomTypeResponse): RoomTypeTableData[] => {
    console.log('=== 开始处理房型数据 ===');
    console.log('输入数据JSON字符串:');
    console.log(JSON.stringify(responseData, null, 2));
    
    const processedData = responseData.bookingRoomTypes.map((roomType, index) => {
      console.log(`处理房型 ${index + 1}: ${roomType.roomTypeName}`);
      
      // 计算最小剩余库存
      const minRemainingInventory = Math.min(...roomType.bookingDailyRate.map(rate => rate.remainingInventory));
      console.log(`  - 最小剩余库存: ${minRemainingInventory}`);
      
      // 计算平均价格
      const avgChannelPrice = roomType.bookingDailyRate.reduce((sum, rate) => sum + rate.channelSingleOccupancy, 0) / roomType.bookingDailyRate.length;
      const avgHotelPrice = roomType.bookingDailyRate.reduce((sum, rate) => sum + rate.hotelSingleOccupancy, 0) / roomType.bookingDailyRate.length;
      const avgAgentPrice = roomType.bookingDailyRate.reduce((sum, rate) => sum + rate.agentSingleOccupancy, 0) / roomType.bookingDailyRate.length;
      
      console.log(`  - 平均渠道价格: ${avgChannelPrice.toFixed(2)}`);
      console.log(`  - 平均酒店价格: ${avgHotelPrice.toFixed(2)}`);
      console.log(`  - 平均代理价格: ${avgAgentPrice.toFixed(2)}`);
      
      // 判断是否可订（所有日期都可用且库存大于0，且价格不为空或0）
      const isAvailable = roomType.bookingDailyRate.every(rate => {
        const isStatusAvailable = rate.isAvailable === 'O';
        const hasInventory = rate.remainingInventory > 0;
        const hasChannelPrice = rate.channelSingleOccupancy && rate.channelSingleOccupancy > 0;
        const hasHotelPrice = rate.hotelSingleOccupancy && rate.hotelSingleOccupancy > 0;
        
        const isDayAvailable = isStatusAvailable && hasInventory && hasChannelPrice && hasHotelPrice;
        
        // 添加详细的调试日志
        if (!isDayAvailable) {
          console.log(`    ${rate.stayDate} 不可订原因:`);
          if (!isStatusAvailable) console.log(`      - 状态不可用: ${rate.isAvailable}`);
          if (!hasInventory) console.log(`      - 库存不足: ${rate.remainingInventory}`);
          if (!hasChannelPrice) console.log(`      - 渠道价格无效: ${rate.channelSingleOccupancy}`);
          if (!hasHotelPrice) console.log(`      - 酒店价格无效: ${rate.hotelSingleOccupancy}`);
        }
        
        return isDayAvailable;
      });
      console.log(`  - 可订状态: ${isAvailable ? '可订' : '不可订'}`);
      
      const processedRoomType = {
        key: `${roomType.roomTypeId}_${index}`,
        roomTypeId: roomType.roomTypeId,
        roomTypeCode: roomType.roomTypeCode,
        roomTypeName: roomType.roomTypeName,
        description: roomType.description,
        standardPrice: roomType.standardPrice,
        maxOccupancy: roomType.maxOccupancy,
        physicalInventory: roomType.physicalInventory,
        minRemainingInventory: minRemainingInventory,
        avgChannelPrice: avgChannelPrice,
        avgHotelPrice: avgHotelPrice,
        avgAgentPrice: avgAgentPrice,
        isAvailable: isAvailable,
        bookingDailyRate: roomType.bookingDailyRate,
      };
      
      console.log(`  - 处理后的房型数据JSON字符串:`);
      console.log(JSON.stringify(processedRoomType, null, 2));
      
      return processedRoomType;
    });
    
    console.log('=== 房型数据处理完成 ===');
    console.log(`总共处理了 ${processedData.length} 个房型`);
    console.log('========================');
    
    return processedData;
  };

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      console.log('表单提交数据:', values);
      
      // 检查必填字段
      if (!values.hotelId) {
        console.error('请选择酒店');
        return;
      }
      
      if (!values.rateCode) {
        console.error('请选择房价码');
        return;
      }
      
      if (!values.dateRange || !values.dateRange[0] || !values.dateRange[1]) {
        console.error('请选择入离日期');
        return;
      }
      
      // 获取用户信息中的chainId
      const chainId = localStorage.getItem('chainId');
      
      if (!chainId) {
        console.error('未找到chainId，请重新登录');
        return;
      }
      
      // 保存主表单数据，用于后续预订
      setMainFormData(values);
      
      // 构建请求参数
      const requestBody = {
        chainId: chainId,
        hotelId: values.hotelId,
        rateCode: values.rateCode,
        checkIn: values.dateRange[0].format('YYYY-MM-DD'),
        checkOut: values.dateRange[1].format('YYYY-MM-DD'),
        channelCode: values.channel
      };
      
      // 在F12中打印请求参数
      console.log('=== 查询房型价格请求信息 ===');
      console.log('请求URL:', '/api/rateprices/booking/byHotelRateCode');
      console.log('请求方法:', 'POST');
      console.log('请求参数:', JSON.stringify(requestBody, null, 2));
      console.log('========================');
      
      // 调用后台接口
      const response = await request.post('/api/rateprices/booking/byHotelRateCode', requestBody);
      
      // 在F12中打印返回数据
      console.log('=== 查询房型价格响应信息 ===');
      console.log('响应状态:', response.status);
      console.log('响应数据:', JSON.stringify(response.data, null, 2));
      console.log('========================');
      
      if (response.status === 200 && response.data.success) {
        console.log('查询房型价格成功');
        // 处理返回的房型价格数据
        const responseData = response.data.data;
        
        // 打印原始响应数据的JSON字符串
        console.log('=== 原始响应数据JSON字符串 ===');
        console.log(JSON.stringify(responseData, null, 2));
        console.log('==============================');
        
        if (responseData && responseData.bookingRoomTypes) {
          const processedData = processRoomTypeData(responseData);
          
          // 打印处理后的表格数据JSON字符串
          console.log('=== 处理后的表格数据JSON字符串 ===');
          console.log(JSON.stringify(processedData, null, 2));
          console.log('==================================');
          
          // 打印每个房型的详细信息
          console.log('=== 房型详细信息 ===');
          processedData.forEach((roomType, index) => {
            console.log(`房型 ${index + 1}: ${roomType.roomTypeName} (${roomType.roomTypeCode})`);
            console.log(`  - 房型ID: ${roomType.roomTypeId}`);
            console.log(`  - 描述: ${roomType.description}`);
            console.log(`  - 标准价格: ¥${roomType.standardPrice}`);
            console.log(`  - 最大入住人数: ${roomType.maxOccupancy}`);
            console.log(`  - 总库存: ${roomType.physicalInventory}`);
            console.log(`  - 最小剩余库存: ${roomType.minRemainingInventory}`);
            console.log(`  - 平均渠道价格: ¥${roomType.avgChannelPrice.toFixed(2)}`);
            console.log(`  - 平均酒店价格: ¥${roomType.avgHotelPrice.toFixed(2)}`);
            console.log(`  - 平均代理价格: ¥${roomType.avgAgentPrice.toFixed(2)}`);
            console.log(`  - 可订状态: ${roomType.isAvailable ? '可订' : '不可订'}`);
            console.log(`  - 每日价格详情:`);
            roomType.bookingDailyRate.forEach((dailyRate, dayIndex) => {
              console.log(`    第${dayIndex + 1}天 (${dailyRate.stayDate}):`);
              console.log(`      - 可订状态: ${dailyRate.isAvailable === 'O' ? '可订' : '不可订'}`);
              console.log(`      - 剩余库存: ${dailyRate.remainingInventory}`);
              console.log(`      - 渠道价格: ¥${dailyRate.channelSingleOccupancy}`);
              console.log(`      - 酒店价格: ¥${dailyRate.hotelSingleOccupancy}`);
              console.log(`      - 代理价格: ¥${dailyRate.agentSingleOccupancy}`);
            });
            console.log('---');
          });
          console.log('==================');
          
          setRoomTypeData(processedData);
          // 重置展开状态，默认不展开
          setExpandedRowKeys([]);
        } else {
          console.error('响应数据格式不正确');
          console.log('响应数据结构:', responseData);
          setRoomTypeData([]);
          setExpandedRowKeys([]);
        }
      } else {
        console.error('查询房型价格失败:', response.data.message || '未知错误');
        setRoomTypeData([]);
        setExpandedRowKeys([]);
      }
      
    } catch (error: any) {
      console.error('查询房型价格失败:', error);
      
      // 打印详细的错误信息
      if (error.response) {
        console.error('=== 错误响应详细信息 ===');
        console.error('错误状态码:', error.response.status);
        console.error('错误响应数据JSON字符串:');
        console.error(JSON.stringify(error.response.data, null, 2));
        console.error('错误响应头JSON字符串:');
        console.error(JSON.stringify(error.response.headers, null, 2));
        
        // 尝试解析更详细的错误信息
        if (error.response.data && error.response.data.message) {
          console.error('错误消息:', error.response.data.message);
        }
        if (error.response.data && error.response.data.error) {
          console.error('错误类型:', error.response.data.error);
        }
        if (error.response.data && error.response.data.path) {
          console.error('错误路径:', error.response.data.path);
        }
        console.error('========================');
      } else if (error.request) {
        console.error('=== 请求错误信息 ===');
        console.error('请求对象JSON字符串:');
        console.error(JSON.stringify(error.request, null, 2));
        console.error('==================');
      } else {
        console.error('=== 其他错误信息 ===');
        console.error('错误消息:', error.message);
        console.error('错误堆栈:', error.stack);
        console.error('==================');
      }
      setRoomTypeData([]);
      setExpandedRowKeys([]);
    } finally {
      setLoading(false);
    }
  };

  // 处理酒店选择变化
  const handleHotelChange = (hotelId: string) => {
    setSelectedHotelId(hotelId);
    // 清空房价码选择
    form.setFieldValue('rateCode', undefined);
  };

  // 展开行渲染函数
  const expandedRowRender = (record: RoomTypeTableData) => {
    const dailyRateColumns = [
      {
        title: '入住日期',
        dataIndex: 'stayDate',
        key: 'stayDate',
        width: 120,
      },
      {
        title: '可订状态',
        dataIndex: 'isAvailable',
        key: 'isAvailable',
        width: 100,
        render: (isAvailable: string) => (
          <Tag color={isAvailable === 'O' ? 'green' : 'red'}>
            {isAvailable === 'O' ? '可订' : '不可订'}
          </Tag>
        ),
      },
      {
        title: '剩余库存',
        dataIndex: 'remainingInventory',
        key: 'remainingInventory',
        width: 100,
        render: (inventory: number) => (
          <span style={{ color: inventory > 0 ? 'green' : 'red', fontWeight: 'bold' }}>
            {inventory}
          </span>
        ),
      },
      {
        title: '渠道价格',
        dataIndex: 'channelSingleOccupancy',
        key: 'channelSingleOccupancy',
        width: 120,
        render: (price: number) => (
          <span style={{ color: '#1890ff', fontWeight: 'bold' }}>
            ¥{price?.toFixed(2) || '0.00'}
          </span>
        ),
      },
      {
        title: '酒店价格',
        dataIndex: 'hotelSingleOccupancy',
        key: 'hotelSingleOccupancy',
        width: 120,
        render: (price: number) => (
          <span style={{ color: '#52c41a', fontWeight: 'bold' }}>
            ¥{price?.toFixed(2) || '0.00'}
          </span>
        ),
      },
      {
        title: '代理价格',
        dataIndex: 'agentSingleOccupancy',
        key: 'agentSingleOccupancy',
        width: 120,
        render: (price: number) => (
          <span style={{ color: '#fa8c16', fontWeight: 'bold' }}>
            ¥{price?.toFixed(2) || '0.00'}
          </span>
        ),
      },
    ];

    return (
      <Table
        columns={dailyRateColumns}
        dataSource={record.bookingDailyRate}
        pagination={false}
        size="small"
        rowKey="stayDate"
      />
    );
  };

  // 表格列定义
  const columns = [
    {
      title: '房型代码',
      dataIndex: 'roomTypeCode',
      key: 'roomTypeCode',
      width: 120,
    },
    {
      title: '房型名称',
      dataIndex: 'roomTypeName',
      key: 'roomTypeName',
      width: 200,
      render: (text: string, record: RoomTypeTableData) => (
        <Tooltip title={record.description}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_: any, record: RoomTypeTableData) => (
        <Button 
          type="primary" 
          size="small"
          disabled={!record.isAvailable || record.minRemainingInventory <= 0}
          onClick={() => handleSelectRoom(record)}
        >
          预订
        </Button>
      ),
    },
  ];

  // 生成CRS预订号
  const generateCrsResvNo = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const milliseconds = String(now.getMilliseconds()).padStart(3, '0');
    
    // 生成6位随机数
    const randomNum = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    
    // 格式：M + yyyyMMddHHmmssSSS + 6位随机数
    const crsResvNo = `M${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}${randomNum}`;
    
    console.log('生成的CRS预订号:', crsResvNo);
    return crsResvNo;
  };

  // 处理选择房型
  const handleSelectRoom = (roomType: RoomTypeTableData) => {
    console.log('选择房型:', roomType);
    setSelectedRoomType(roomType);
    setBookingModalVisible(true);
    // 重置预订表单并自动生成CRS预订号
    bookingForm.resetFields();
    // 设置自动生成的CRS预订号
    bookingForm.setFieldValue('crsResvNo', generateCrsResvNo());
  };

  // 处理预订确认
  const handleBookingConfirm = async (values: any) => {
    try {
      setBookingLoading(true);
      console.log('预订表单数据:', values);
      console.log('选中的房型:', selectedRoomType);
      console.log('主表单数据:', mainFormData);
      
      // 检查必要数据
      if (!selectedRoomType) {
        message.error('未选择房型，请重新选择');
        return;
      }
      
      if (!mainFormData) {
        message.error('主表单数据丢失，请重新查询房型价格');
        return;
      }
      
      // 获取用户信息
      const userInfo = localStorage.getItem('user');
      const chainId = localStorage.getItem('chainId');
      const userId = localStorage.getItem('userId');
      
      if (!chainId) {
        message.error('未找到chainId，请重新登录');
        return;
      }
      
      if (!userId) {
        message.error('未找到userId，请重新登录');
        return;
      }
      
      // 获取房间数量和入住人数
      const roomsPerDay = values.roomsPerDay || 1;
      const guestsPerRoom = values.guestsPerRoom || selectedRoomType.maxOccupancy;
      
      // 构建每日价格数据
      const dailyPrices = selectedRoomType.bookingDailyRate.map((dailyRate, index) => ({
        stayDate: dailyRate.stayDate,
        rooms: roomsPerDay,
        roomTypeCode: selectedRoomType.roomTypeCode,
        roomTypeName: selectedRoomType.roomTypeName,
        rateCode: mainFormData.rateCode,
        rateCodeName: mainFormData.rateCode, // 这里可能需要从房价码选择器获取名称
        hotelRoomNo: `房间${index + 1}`, // 这里可能需要根据实际情况调整
        priceChannel: dailyRate.channelSingleOccupancy,
        priceHotel: dailyRate.hotelSingleOccupancy,
        priceAgent: dailyRate.agentSingleOccupancy
      }));
      
      // 构建预订请求体
      const requestBody = {
        chainId: chainId,
        userId: userId,
        hotelId: mainFormData.hotelId,
        hotelCode: mainFormData.hotelId, // 这里可能需要从酒店选择器获取酒店代码
        roomTypeCode: selectedRoomType.roomTypeCode,
        roomTypeName: selectedRoomType.roomTypeName,
        rateCode: mainFormData.rateCode,
        rateCodeName: mainFormData.rateCode,
        channelCode: mainFormData.channel,
        checkInDate: mainFormData.dateRange[0].format('YYYY-MM-DD'),
        checkOutDate: mainFormData.dateRange[1].format('YYYY-MM-DD'),
        roomsPerDay: roomsPerDay,
        guestsPerRoom: guestsPerRoom,
        channelResvNo: values.channelResvNo || '',
        crsResvNo: values.crsResvNo || '',
        hotelResvNo: values.hotelResvNo || '',
        guest: {
          guestName: values.guestName || '未填写',
          guestEname: values.guestName || 'Not Provided',
          phone: values.guestPhone || '',
          email: values.guestEmail || '',
          memberNumber: values.guestMemberNumber || '',
          memberType: ''
        },
        booker: {
          bookerName: values.bookerName || values.guestName || '未填写',
          phone: values.bookerPhone || values.guestPhone || '',
          email: values.bookerEmail || values.guestEmail || '',
          memberNumber: values.bookerMemberNumber || values.guestMemberNumber || '',
          memberType: ''
        },
        company: {
          companyName: values.companyName || '',
          contactPerson: values.contactPerson || '',
          contactPhone: values.contactPhone || '',
          contactEmail: values.contactEmail || '',
          memberNumber: values.companyMemberNumber || '',
          memberType: ''
        },
        dailyPrices: dailyPrices,
        paymentType: values.paymentType || '',
        reservationType: values.reservationType || '',
        cancellationType: values.cancellationType || '',
        remarkHotel: values.remarks || '',
        remarkChannel: values.remarks || '',
        remarkAgent: values.remarks || '',
        remarkGuest: values.remarks || '',
        remarkSpecial: values.specialRequirements || '',
        remarkInvoice: values.invoiceRequirement || '',
        remarkCancel: values.cancellationType || '',
        specialRequests: values.specialRequirements || ''
      };
      
      console.log('=== 预订请求信息 ===');
      console.log('请求URL:', '/api/booking/add');
      console.log('请求方法:', 'POST');
      console.log('请求参数:', JSON.stringify(requestBody, null, 2));
      console.log('==================');
      
      // 调用预订接口
      const response = await request.post('/api/booking/add', requestBody);
      
      console.log('=== 预订响应信息 ===');
      console.log('响应状态:', response.status);
      console.log('响应数据:', JSON.stringify(response.data, null, 2));
      console.log('==================');
      
      if (response.status === 200 && response.data.success) {
        message.success('预订成功！');
        setBookingModalVisible(false);
        setSelectedRoomType(null);
        bookingForm.resetFields();
        
        // 可选：刷新房型数据
        // handleSubmit(mainFormData);
      } else {
        message.error(response.data.message || '预订失败，请稍后重试');
      }
      
    } catch (error: any) {
      console.error('预订失败:', error);
      
      // 打印详细的错误信息
      if (error.response) {
        console.error('=== 错误响应详细信息 ===');
        console.error('错误状态码:', error.response.status);
        console.error('错误响应数据:', JSON.stringify(error.response.data, null, 2));
        console.error('========================');
        message.error(error.response.data?.message || '预订失败，请稍后重试');
      } else if (error.request) {
        console.error('=== 请求错误信息 ===');
        console.error('请求对象:', JSON.stringify(error.request, null, 2));
        console.error('==================');
        message.error('网络请求失败，请检查网络连接');
      } else {
        console.error('=== 其他错误信息 ===');
        console.error('错误消息:', error.message);
        console.error('==================');
        message.error('预订失败，请稍后重试');
      }
    } finally {
      setBookingLoading(false);
    }
  };

  // 处理预订取消
  const handleBookingCancel = () => {
    setBookingModalVisible(false);
    setSelectedRoomType(null);
    bookingForm.resetFields();
  };

  // 处理客人姓名变化，自动填充预订人信息
  const handleGuestNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const guestName = e.target.value;
    const currentBookerName = bookingForm.getFieldValue('bookerName');
    
    // 如果预订人姓名为空，则自动填充客人姓名
    if (!currentBookerName && guestName) {
      bookingForm.setFieldValue('bookerName', guestName);
    }
  };

  return (
    <TokenCheck checkToken={false}>
      <div className="p-6">
        <Card title="新增订单" className="mb-6">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              hotelId: undefined,
              dateRange: undefined,
              channel: undefined,
              booker: '',
            }}
          >
            <Row gutter={24}>
              <Col span={6}>
                <Form.Item
                  name="hotelId"
                  label="酒店"
                  rules={[{ required: true, message: '请选择酒店' }]}
                >
                  <HotelSelect
                    value={form.getFieldValue('hotelId')}
                    onChange={(value) => {
                      form.setFieldValue('hotelId', value);
                      handleHotelChange(value);
                    }}
                    placeholder="请选择酒店"
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name="rateCode"
                  label="选择房价码"
                  rules={[{ required: true, message: '请选择房价码' }]}
                >
                  <RateCodeSelect
                    value={form.getFieldValue('rateCode')}
                    onChange={(value) => form.setFieldValue('rateCode', value)}
                    placeholder="请选择房价码"
                    hotelId={selectedHotelId}
                  />
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item
                  name="dateRange"
                  label="入离日期"
                  rules={[{ required: true, message: '请选择入离日期' }]}
                >
                  <RangePicker
                    style={{ width: '100%' }}
                    format="YYYY-MM-DD"
                    locale={locale}
                    size="large"
                    placeholder={['入住日期', '离店日期']}
                    disabledDate={(current) => {
                      return current && current < dayjs().startOf('day');
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name="channel"
                  label="选择渠道"
                  rules={[{ required: true, message: '请选择渠道' }]}
                >
                  <ChannelSelect
                    value={form.getFieldValue('channel')}
                    onChange={(value) => form.setFieldValue('channel', value)}
                    placeholder="请选择渠道"
                  />
                </Form.Item>
              </Col>

            </Row>

           



            <Form.Item>
              <Button type="primary" htmlType="submit" size="large" loading={loading}>
                查询房型价格
              </Button>
            </Form.Item>
          </Form>
        </Card>

        {/* 房型价格表格 */}
        {roomTypeData.length > 0 && (
          <Card title="房型价格信息" className="mt-6">
            <Table
              columns={columns}
              dataSource={roomTypeData}
              rowKey="key"
              pagination={false}
              size="middle"
              expandable={{
                expandedRowRender,
                rowExpandable: (record) => record.bookingDailyRate.length > 0,
                expandedRowKeys: expandedRowKeys,
                onExpand: (expanded, record) => {
                  if (expanded) {
                    setExpandedRowKeys([...expandedRowKeys, record.key]);
                  } else {
                    setExpandedRowKeys(expandedRowKeys.filter(key => key !== record.key));
                  }
                },
                onExpandedRowsChange: (expandedRows) => {
                  setExpandedRowKeys([...expandedRows]);
                },
              }}
            />
          </Card>
        )}

        {/* 预订窗口 */}
        <Modal
          title={`预订房型 - ${selectedRoomType?.roomTypeName}`}
          open={bookingModalVisible}
          onCancel={handleBookingCancel}
          width={1200}
          footer={[
            <Button key="cancel" onClick={handleBookingCancel}>
              取消
            </Button>,
            <Button 
              key="confirm" 
              type="primary" 
              loading={bookingLoading}
              onClick={() => bookingForm.submit()}
            >
              确认预订
            </Button>,
          ]}
        >
          <Form
            form={bookingForm}
            layout="vertical"
            onFinish={handleBookingConfirm}
            initialValues={{
              guestName: '',
              guestPhone: '',
              guestEmail: '',
              guestMemberNumber: '',
              bookerName: '',
              bookerPhone: '',
              bookerEmail: '',
              bookerMemberNumber: '',
              companyName: '',
              contactPerson: '',
              contactPhone: '',
              contactEmail: '',
              companyMemberNumber: '',
              channelResvNo: '',
              crsResvNo: '',
              hotelResvNo: '',
              roomsPerDay: 1,
              guestsPerRoom: selectedRoomType?.maxOccupancy || 2,
              cancellationType: '',
              paymentType: '',
              reservationType: '',
              invoiceRequirement: '',
              specialRequirements: '',
              remarks: '',
            }}
          >

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="crsResvNo"
                  label="CRS预订号"
                >
                  <Input placeholder="系统自动生成" readOnly />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="hotelResvNo"
                  label="酒店预订号"
                >
                  <Input placeholder="请输入酒店预订号" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="channelResvNo"
                  label="渠道预订号"
                  rules={[{ required: true, message: '请输入渠道预订号' }]}
                >
                  <Input placeholder="请输入渠道预订号" />
                </Form.Item>
              </Col>
            </Row>
            {/* 客人信息 */}
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="guestName"
                  label="客人姓名"
                  rules={[{ required: true, message: '请输入客人姓名' }]}
                >
                  <Input placeholder="请输入客人姓名" onChange={handleGuestNameChange} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="guestPhone"
                  label="客人电话"
                >
                  <Input placeholder="请输入客人电话" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="guestEmail"
                  label="客人邮箱"
                >
                  <Input placeholder="请输入客人邮箱" />
                </Form.Item>
              </Col>
            </Row>

            

            {/* 入住信息 */}           
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="roomsPerDay"
                  label="每日房间数"
                  initialValue={1}
                >
                  <InputNumber 
                    min={1} 
                    max={10} 
                    style={{ width: '100%' }}
                    placeholder="请输入每日房间数"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="guestsPerRoom"
                  label="每间入住人数"
                  initialValue={selectedRoomType?.maxOccupancy || 2}
                >
                  <InputNumber 
                    min={1} 
                    max={selectedRoomType?.maxOccupancy || 4}
                    style={{ width: '100%' }}
                    placeholder="请输入每间入住人数"
                  />
                </Form.Item>
              </Col>
            </Row>

            

            

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="cancellationType"
                  label="取消政策"
                >
                  <Select placeholder="请选择取消政策">
                    <Select.Option value="FREECANCEL">免费取消</Select.Option>
                    <Select.Option value="PARTIAL">部分退款</Select.Option>
                    <Select.Option value="NONREFUNDABLE">不可取消</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="paymentType"
                  label="支付状态"
                >
                  <Select placeholder="请选择支付状态">
                    <Select.Option value="PAID">已支付</Select.Option>
                    <Select.Option value="UNPAID">未支付</Select.Option>
                    <Select.Option value="PARTIAL">支付部分</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="reservationType"
                  label="结算类型"
                >
                  <Select placeholder="请选择结算类型">
                    <Select.Option value="CREDIT">月结授信</Select.Option>
                    <Select.Option value="DEPOSIT">月结预存</Select.Option>
                    <Select.Option value="PREPAY">客人在线支付</Select.Option>
                    <Select.Option value="CASH">客人现付</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="invoiceRequirement"
                  label="发票要求"
                >
                  <Select placeholder="请选择发票要求">
                    <Select.Option value="需要给客人开发票">需要给客人开发票</Select.Option>
                    <Select.Option value="不需要给客人开发票">不需要给客人开发票</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="specialRequirements"
                  label="特殊要求"
                >
                  <Input.TextArea 
                    rows={1} 
                    placeholder="请输入特殊要求（如：无烟房、高楼层、连通房等）" 
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="remarks"
                  label="备注"
                >
                  <Input.TextArea 
                    rows={1} 
                    placeholder="请输入备注信息" 
                  />
                </Form.Item>
              </Col>
            </Row>


          </Form>
        </Modal>
      </div>
    </TokenCheck>
  );
};

export default ReservationAdd;
