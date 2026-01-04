import React, { useState, useEffect } from 'react';
import { Row, Col, message, Input, DatePicker, Select, Button, ConfigProvider } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import zhCN from 'antd/locale/zh_CN';
import HotelSelect from '../../components/common/HotelSelect';
import ChannelsSelect from '../../components/common/ChannelsSelect';
import BookingStatusesSelect from '../../components/common/BookingStatusesSelect';
import { CaretRightOutlined, CaretDownOutlined } from '@ant-design/icons';
import TokenCheck from '../../components/common/TokenCheck';
import request from '../../utils/request';

// 设置dayjs默认语言为中文
dayjs.locale('zh-cn');

/*
API响应体示例：
{
  "status": "success",
  "data": {
    "bookings": [
      {
        "bookingId": "BKG202507130001",
        "chainId": "CHAIN001",
        "hotelId": "HOTEL001",
        "chainCode": "CH001",
        "chainName": "链条集团",
        "hotelCode": "HT001",
        "hotelName": "示例酒店",
        "roomTypeCode": "RT001",
        "roomTypeName": "豪华大床房",
        "rateCode": "RC001",
        "rateCodeName": "标准价",
        "packageCode": "PKG001",
        "packageName": "含早餐",
        "channelCode": "C001",
        "channelSubcode": "C001A",
        "bookerCode": "BK001",
        "agentCode": "AG001",
        "sourceCode": "SRC001",
        "marketCode": "MKT001",
        "bookerType": "个人",
        "channelResvNo": "CH123456",
        "channelResvSno": "CH123456-01",
        "channelResvPno": "CH123456-P01",
        "crsResvNo": "CRS123456",
        "crsResvPno": "CRS123456-P01",
        "crsResvCheckinNo": "CRSCHK001",
        "agentResvNo": "AG123456",
        "agentResvPno": "AG123456-P01",
        "hotelResvNo": "HT123456",
        "hotelResvKey": "HT123456-KEY",
        "hotelResvConfirm": "HTCONF123",
        "hotelRoomNo": "501",
        "paymentType": "预付",
        "reservationType": "标准预订",
        "cancellationType": "可取消",
        "latestCancellationDays": 1,
        "latestCancellationTime": "18:00:00",
        "cancellableAfterBooking": true,
        "orderRetentionTime": "20:00:00",
        "arrivalTime": "15:00:00",
        "remarkHotel": "欢迎贵宾",
        "remarkChannel": "渠道备注信息",
        "remarkAgent": "代理备注",
        "remarkGuest": "客人偏好：高楼层",
        "remarkSpecial": "特殊需求：无烟房",
        "remarkInvoice": "需开发票",
        "remarkCancel": "因航班取消",
        "companyId": "COMP001",
        "companyNo": "CNO001",
        "companyName": "ABC科技有限公司",
        "companyTmcId": "TMC001",
        "companyTmcNo": "TMCNO001",
        "companyTmcName": "示例TMC",
        "memberNoGuest": "MBGUEST001",
        "memberTypeGuest": "银卡",
        "memberNoBooker": "MBBOOKER001",
        "memberTypeBooker": "金卡",
        "guestId": "GUEST001",
        "guestName": "张三",
        "guestEname": "Zhang San",
        "bookerId": "BOOKER001",
        "bookerName": "李四",
        "bookingDate": "2025-07-12",
        "advanceBookingDays": 5.0,
        "checkInDate": "2025-07-15",
        "checkOutDate": "2025-07-18",
        "stayDays": 3,
        "checkInDateActual": "2025-07-15",
        "checkOutDateActual": "2025-07-18",
        "stayDaysActual": 3,
        "totalRooms": 1,
        "totalRoomsActual": 1,
        "totalRoomNights": 3,
        "totalRoomNightsActual": 3,
        "totalGuests": 2,
        "totalGuestsActual": 2,
        "bookingType": "散客",
        "bookingStatusChannel": "确认",
        "bookingStatusHotel": "确认",
        "bookingStatusAgent": "确认",
        "depositAmountChannel": 100.00,
        "depositAmountAgent": 50.00,
        "depositAmountHotel": 0.00,
        "penaltyAmountChannel": 0.00,
        "penaltyAmountHotel": 0.00,
        "penaltyAmountAgent": 0.00,
        "totalPriceChannel": 900.00,
        "totalPriceHotel": 880.00,
        "totalPriceAgent": 920.00,
        "totalPriceChannelActual": 900.00,
        "totalPriceHotelActual": 880.00,
        "totalPriceAgentActual": 920.00,
        "paymentDate": "2025-07-13",
        "paymentNo": "PAY123456",
        "billDate": "2025-07-13",
        "billNo": "BILL7890",
        "cateringFeeHotel": 150.00,
        "banquetFeeHotel": 0.00,
        "otherFeeHotel": 20.00,
        "totalRevenueFeeHotel": 1050.00,
        "sign": 1,
        "salesLevelA": {
          "id": "SLA001",
          "name": "销售A",
          "phone": "13800001111",
          "email": "sla@example.com"
        },
        "salesLevelB": {
          "id": "SLB001",
          "name": "销售B",
          "phone": "13800002222",
          "email": "slb@example.com"
        },
        "salesLevelC": {
          "id": "SLC001",
          "name": "销售C",
          "phone": "13800003333",
          "email": "slc@example.com"
        },
        "createdAt": "2025-07-12T10:00:00",
        "updatedAt": "2025-07-13T08:00:00",
        "guestInfo": {
          "guestId": "GUEST001",
          "guestName": "张三",
          "guestEname": "Zhang San",
          "firstName": "San",
          "lastName": "Zhang",
          "idType": "身份证",
          "idNumber": "310xxxxxxxxxxxxxx",
          "phone": "13812345678",
          "email": "zhangsan@example.com",
          "address": "上海市徐汇区XXX路88号",
          "specialRequests": "需要安静房间，远离电梯",
          "memberLevel": "银卡",
          "memberCardNo": "MB12345678",
          "memberType": "个人会员"
        },
        "bookerInfo": {
          "guestId": "BOOKER001",
          "guestName": "李四",
          "guestEname": "Li Si",
          "firstName": "Si",
          "lastName": "Li",
          "idType": "护照",
          "idNumber": "P123456789",
          "phone": "13987654321",
          "email": "lisi@example.com",
          "address": "北京市朝阳区YYY路99号",
          "specialRequests": "尽量安排中午办理入住",
          "memberLevel": "金卡",
          "memberCardNo": "MB98765432",
          "memberType": "协议客户"
        },
        "companyInfo": {
          "companyId": "COMP001",
          "companyCode": "C10001",
          "companyName": "ABC科技有限公司",
          "companyEname": "ABC Tech Co., Ltd.",
          "contactPerson": "王经理",
          "contactEmail": "wang@example.com",
          "contactPhone": "021-88888888",
          "address": "上海市浦东新区科技园100号",
          "memberLevel": "企业金卡",
          "memberCardNo": "CORP123456",
          "memberType": "企业会员"
        }
      },
      {
        "bookingId": "BKG202507130002",
        "chainId": "CHAIN001",
        "hotelId": "HOTEL002",
        "chainCode": "CH001",
        "chainName": "链条集团",
        "hotelCode": "HT002",
        "hotelName": "商务酒店",
        "roomTypeCode": "RT002",
        "roomTypeName": "标准双床房",
        "rateCode": "RC002",
        "rateCodeName": "商务价",
        "packageCode": "PKG002",
        "packageName": "无早餐",
        "channelCode": "C002",
        "channelSubcode": "C002A",
        "bookerCode": "BK002",
        "agentCode": "AG002",
        "sourceCode": "SRC002",
        "marketCode": "MKT002",
        "bookerType": "企业",
        "channelResvNo": "CH789012",
        "channelResvSno": "CH789012-01",
        "channelResvPno": "CH789012-P01",
        "crsResvNo": "CRS789012",
        "crsResvPno": "CRS789012-P01",
        "crsResvCheckinNo": "CRSCHK002",
        "agentResvNo": "AG789012",
        "agentResvPno": "AG789012-P01",
        "hotelResvNo": "HT789012",
        "hotelResvKey": "HT789012-KEY",
        "hotelResvConfirm": "HTCONF456",
        "hotelRoomNo": "302",
        "paymentType": "到付",
        "reservationType": "企业预订",
        "cancellationType": "不可取消",
        "latestCancellationDays": 0,
        "latestCancellationTime": "00:00:00",
        "cancellableAfterBooking": false,
        "orderRetentionTime": "18:00:00",
        "arrivalTime": "14:00:00",
        "remarkHotel": "企业客户",
        "remarkChannel": "企业协议价",
        "remarkAgent": "企业客户优先",
        "remarkGuest": "需要发票",
        "remarkSpecial": "无特殊要求",
        "remarkInvoice": "开票信息：ABC公司",
        "remarkCancel": "",
        "companyId": "COMP002",
        "companyNo": "CNO002",
        "companyName": "XYZ贸易公司",
        "companyTmcId": "TMC002",
        "companyTmcNo": "TMCNO002",
        "companyTmcName": "企业TMC",
        "memberNoGuest": "MBGUEST002",
        "memberTypeGuest": "金卡",
        "memberNoBooker": "MBBOOKER002",
        "memberTypeBooker": "钻石卡",
        "guestId": "GUEST002",
        "guestName": "王五",
        "guestEname": "Wang Wu",
        "bookerId": "BOOKER002",
        "bookerName": "赵六",
        "bookingDate": "2025-07-11",
        "advanceBookingDays": 4.0,
        "checkInDate": "2025-07-14",
        "checkOutDate": "2025-07-16",
        "stayDays": 2,
        "checkInDateActual": "2025-07-14",
        "checkOutDateActual": "2025-07-16",
        "stayDaysActual": 2,
        "totalRooms": 1,
        "totalRoomsActual": 1,
        "totalRoomNights": 2,
        "totalRoomNightsActual": 2,
        "totalGuests": 1,
        "totalGuestsActual": 1,
        "bookingType": "企业",
        "bookingStatusChannel": "确认",
        "bookingStatusHotel": "确认",
        "bookingStatusAgent": "确认",
        "depositAmountChannel": 0.00,
        "depositAmountAgent": 0.00,
        "depositAmountHotel": 0.00,
        "penaltyAmountChannel": 0.00,
        "penaltyAmountHotel": 0.00,
        "penaltyAmountAgent": 0.00,
        "totalPriceChannel": 600.00,
        "totalPriceHotel": 580.00,
        "totalPriceAgent": 620.00,
        "totalPriceChannelActual": 600.00,
        "totalPriceHotelActual": 580.00,
        "totalPriceAgentActual": 620.00,
        "paymentDate": "",
        "paymentNo": "",
        "billDate": "2025-07-16",
        "billNo": "BILL4567",
        "cateringFeeHotel": 0.00,
        "banquetFeeHotel": 0.00,
        "otherFeeHotel": 0.00,
        "totalRevenueFeeHotel": 580.00,
        "sign": 1,
        "salesLevelA": {
          "id": "SLA002",
          "name": "销售D",
          "phone": "13800004444",
          "email": "sld@example.com"
        },
        "salesLevelB": {
          "id": "SLB002",
          "name": "销售E",
          "phone": "13800005555",
          "email": "sle@example.com"
        },
        "salesLevelC": {
          "id": "SLC002",
          "name": "销售F",
          "phone": "13800006666",
          "email": "slf@example.com"
        },
        "createdAt": "2025-07-11T09:00:00",
        "updatedAt": "2025-07-12T10:00:00",
        "guestInfo": {
          "guestId": "GUEST002",
          "guestName": "王五",
          "guestEname": "Wang Wu",
          "firstName": "Wu",
          "lastName": "Wang",
          "idType": "身份证",
          "idNumber": "110xxxxxxxxxxxxxx",
          "phone": "13712345678",
          "email": "wangwu@example.com",
          "address": "北京市海淀区ZZZ路66号",
          "specialRequests": "无特殊要求",
          "memberLevel": "金卡",
          "memberCardNo": "MB87654321",
          "memberType": "企业会员"
        },
        "bookerInfo": {
          "guestId": "BOOKER002",
          "guestName": "赵六",
          "guestEname": "Zhao Liu",
          "firstName": "Liu",
          "lastName": "Zhao",
          "idType": "身份证",
          "idNumber": "110xxxxxxxxxxxxxx",
          "phone": "13687654321",
          "email": "zhaoliu@example.com",
          "address": "北京市西城区WWW路33号",
          "specialRequests": "企业客户",
          "memberLevel": "钻石卡",
          "memberCardNo": "MB11223344",
          "memberType": "企业客户"
        },
        "companyInfo": {
          "companyId": "COMP002",
          "companyCode": "C20002",
          "companyName": "XYZ贸易公司",
          "companyEname": "XYZ Trading Co., Ltd.",
          "contactPerson": "李经理",
          "contactEmail": "li@example.com",
          "contactPhone": "010-66666666",
          "address": "北京市朝阳区贸易大厦200号",
          "memberLevel": "企业钻石卡",
          "memberCardNo": "CORP789012",
          "memberType": "企业客户"
        }
      }
    ],
    "totalElements": 45,
    "totalPages": 3,
    "size": 20,
    "number": 0,
    "first": true,
    "last": false,
    "numberOfElements": 20
  }
}
*/

// 接口类型定义
interface BookingListRequest {
  chainId: string;
  hotelId: string;
  crsResvNo: string;
  channelResvNo: string;
  hotelResvNo: string;
  guestName: string;
  bookerName: string;
  channelCode: string;
  channelCodes: string[];
  rateCode: string;
  roomTypeCode: string;
  checkInDateStart: string;
  checkInDateEnd: string;
  checkOutDateStart: string;
  checkOutDateEnd: string;
  bookingStatus: string[];
  page: number;
  size: number;
}

// 新增：订单详情接口响应类型
interface BookingDetailResponse {
  bookingId: string;
  chainId: string;
  hotelId: string;
  chainCode: string;
  chainName: string;
  hotelCode: string;
  hotelName: string;
  roomTypeCode: string;
  roomTypeName: string;
  rateCode: string;
  rateCodeName: string;
  packageCode: string;
  packageName: string;
  channelCode: string;
  channelSubcode: string;
  bookerCode: string;
  agentCode: string;
  sourceCode: string;
  marketCode: string;
  bookerType: string;
  channelResvNo: string;
  channelResvSno: string;
  channelResvPno: string;
  crsResvNo: string;
  crsResvPno: string;
  crsResvCheckinNo: string;
  agentResvNo: string;
  agentResvPno: string;
  hotelResvNo: string;
  hotelResvKey: string;
  hotelResvConfirm: string;
  hotelRoomNo: string;
  paymentType: string;
  reservationType: string;
  cancellationType: string;
  latestCancellationDays: number;
  latestCancellationTime: string;
  cancellableAfterBooking: boolean;
  orderRetentionTime: string;
  arrivalTime: string;
  remarkHotel: string;
  remarkChannel: string;
  remarkAgent: string;
  remarkGuest: string;
  remarkSpecial: string;
  remarkInvoice: string;
  remarkCancel: string;
  companyId: string;
  companyNo: string;
  companyName: string;
  companyTmcId: string;
  companyTmcNo: string;
  companyTmcName: string;
  memberNoGuest: string;
  memberTypeGuest: string;
  memberNoBooker: string;
  memberTypeBooker: string;
  guestId: string;
  guestName: string;
  guestEname: string;
  bookerId: string;
  bookerName: string;
  bookingDate: string;
  advanceBookingDays: number;
  checkInDate: string;
  checkOutDate: string;
  stayDays: number;
  checkInDateActual: string;
  checkOutDateActual: string;
  stayDaysActual: number;
  totalRooms: number;
  totalRoomsActual: number;
  totalRoomNights: number;
  totalRoomNightsActual: number;
  totalGuests: number;
  totalGuestsActual: number;
  bookingType: string;
  bookingStatusChannel: string;
  bookingStatusHotel: string;
  bookingStatusAgent: string;
  depositAmountChannel: number;
  depositAmountAgent: number;
  depositAmountHotel: number;
  penaltyAmountChannel: number;
  penaltyAmountHotel: number;
  penaltyAmountAgent: number;
  totalPriceChannel: number;
  totalPriceHotel: number;
  totalPriceAgent: number;
  totalPriceChannelActual: number;
  totalPriceHotelActual: number;
  totalPriceAgentActual: number;
  paymentDate: string;
  paymentNo: string;
  billDate: string;
  billNo: string;
  cateringFeeHotel: number;
  banquetFeeHotel: number;
  otherFeeHotel: number;
  totalRevenueFeeHotel: number;
  sign: number;
  salesLevelA: SalesLevel;
  salesLevelB: SalesLevel;
  salesLevelC: SalesLevel;
  createdAt: string;
  updatedAt: string;
  guestInfo: GuestInfo;
  bookerInfo: BookerInfo;
  companyInfo: CompanyInfo;
  dailyDetails: DailyDetail[];
  logs: BookingLog[];
}

// 新增：日明细类型
interface DailyDetail {
  stayDate: string;
  rooms: number;
  roomsActual: number;
  priceChannel: number;
  priceHotel: number;
  priceAgent: number;
  priceChannelActual: number;
  priceHotelActual: number;
  priceAgentActual: number;
  cateringFeeHotel: number;
  banquetFeeHotel: number;
  otherFeeHotel: number;
  totalRevenueFeeHotel: number;
  bookingDailyId?: string; // 添加可选的 bookingDailyId 字段
}

// 新增：订单日志类型
interface BookingLog {
  bookingLogId: string;
  bookingId: string;
  version: string;
  operation: string;
  operator: string;
  operatorName: string;
  operateTime: string;
  bookingSnapshot: any;
  changeSummary: any;
}

  // 订单状态枚举值转换
  const getBookingStatusText = (status: string): string => {
    const statusMap: { [key: string]: string } = {
      'RESERVED': '待确认',
      'CONFIRMED': '已确认',
      'CANCEL': '已取消',
      'CHECKIN': '已入住',
      'CHECKOUT': '已离店',
      'NOSHOW': '未入住'
    };
    return statusMap[status] || status;
  };

  // 支付类型枚举值转换
  const getReservationTypeText = (reservationType: string): string => {
    const reservationTypeMap: { [key: string]: string } = {
      'CREDIT': '月结授信',
      'DEPOSIT': '月结预存',
      'PREPAY': '客人在线支付',
      'CASH': '客人现付'
    };
    return reservationTypeMap[reservationType] || reservationType;
  };

  // 支付状态枚举值转换
  const getPaymentTypeText = (paymentType: string): string => {
    const paymentTypeMap: { [key: string]: string } = {
      'PAID': '已支付',
      'UNPAID': '未支付',
      'PARTIAL': '支付部分'
    };
    return paymentTypeMap[paymentType] || paymentType;
  };

  // 订单类型枚举值转换
  const getBookingTypeText = (bookingType: string): string => {
    const bookingTypeMap: { [key: string]: string } = {
      'NEW': '新单',
      'MODIFY': '修改单',
      'CANCEL': '取消单'
    };
    return bookingTypeMap[bookingType] || bookingType;
  };

  // 取消类型枚举值转换
  const getCancellationTypeText = (cancellationType: string): string => {
    const cancellationTypeMap: { [key: string]: string } = {
      'FREECANCEL': '免费取消',
      'PARTIAL': '部分退款',
      'NONREFUNDABLE': '不可取消'
    };
    return cancellationTypeMap[cancellationType] || cancellationType;
  };

  // 支付类型枚举值转换
  const getPaymentTypeTextForSnapshot = (paymentType: string): string => {
    const paymentTypeMap: { [key: string]: string } = {
      'PAID': '已支付',
      'UNPAID': '未支付',
      'PARTIAL': '支付部分'
    };
    return paymentTypeMap[paymentType] || paymentType;
  };

  // 预订类型枚举值转换
  const getReservationTypeTextForSnapshot = (reservationType: string): string => {
    const reservationTypeMap: { [key: string]: string } = {
      'CREDIT': '月结授信',
      'DEPOSIT': '月结预存',
      'PREPAY': '客人在线支付',
      'CASH': '客人现付'
    };
    return reservationTypeMap[reservationType] || reservationType;
  };

  // 计算最晚取消时间
  const calculateLatestCancellationTime = (checkInDate: string, latestCancellationDays: number, latestCancellationTime: string): string => {
    if (!latestCancellationDays && !latestCancellationTime) {
      return '无限制';
    }
    
    try {
      // 解析入住日期
      const checkInDateObj = new Date(checkInDate);
      if (isNaN(checkInDateObj.getTime())) {
        return '日期格式错误';
      }
      
      // 解析时间字符串，格式为 HH:mm:ss
      const timeParts = latestCancellationTime.split(':');
      if (timeParts.length !== 3) {
        return '时间格式错误，应为 HH:mm:ss 格式';
      }
      
      const hours = parseInt(timeParts[0]);
      const minutes = parseInt(timeParts[1]);
      const seconds = parseInt(timeParts[2]);
      
      // 验证时间范围
      if (isNaN(hours) || hours < 0 || hours > 23) {
        return '小时范围错误，应为 0-23';
      }
      if (isNaN(minutes) || minutes < 0 || minutes > 59) {
        return '分钟范围错误，应为 0-59';
      }
      if (isNaN(seconds) || seconds < 0 || seconds > 59) {
        return '秒数范围错误，应为 0-59';
      }
      
      // 计算最晚取消时间
      const latestCancellationDate = new Date(checkInDateObj);
      latestCancellationDate.setDate(latestCancellationDate.getDate() - latestCancellationDays);
      latestCancellationDate.setHours(hours, minutes, seconds, 0);
      
      // 格式化日期时间，精确到分钟
      const year = latestCancellationDate.getFullYear();
      const month = String(latestCancellationDate.getMonth() + 1).padStart(2, '0');
      const day = String(latestCancellationDate.getDate()).padStart(2, '0');
      const hour = String(latestCancellationDate.getHours()).padStart(2, '0');
      const minute = String(latestCancellationDate.getMinutes()).padStart(2, '0');
      
      const result = `${year}-${month}-${day} ${hour}:${minute}`;
      
      // 调试日志
      console.log('=== 最晚取消时间计算详情 ===');
      console.log('入住日期:', checkInDate);
      console.log('提前取消天数:', latestCancellationDays);
      console.log('具体时间格式:', latestCancellationTime, '(HH:mm:ss)');
      console.log('时间解析结果:', { 
        hours: `${hours.toString().padStart(2, '0')}`, 
        minutes: `${minutes.toString().padStart(2, '0')}`, 
        seconds: `${seconds.toString().padStart(2, '0')}` 
      });
      console.log('计算结果:', result);
      
      return result;
    } catch (error) {
      console.error('计算最晚取消时间出错:', error);
      return '计算错误';
    }
  };

  // 获取取消政策文本
  const getCancellationPolicyText = (cancellationType: string, checkInDate: string, latestCancellationDays: number, latestCancellationTime: string): string => {
    if (cancellationType === 'FREECANCEL') {
      return '可以随时免费取消';
    } else if (cancellationType === 'NONREFUNDABLE') {
      return '一旦预订不可取消，取消需要收取罚金';
    } else if (cancellationType === 'PARTIAL'){
      const latestTime = calculateLatestCancellationTime(checkInDate, latestCancellationDays, latestCancellationTime);
      return `最晚取消时间：${latestTime}`;
    } else{
      return '可免费取消';
    }
  };

interface GuestInfo {
  guestId: string;
  guestName: string;
  guestEname: string;
  firstName: string;
  lastName: string;
  idType: string;
  idNumber: string;
  phone: string;
  email: string;
  address: string;
  specialRequests: string;
  memberLevel: string;
  memberCardNo: string;
  memberType: string;
}

interface BookerInfo {
  guestId: string;
  guestName: string;
  guestEname: string;
  firstName: string;
  lastName: string;
  idType: string;
  idNumber: string;
  phone: string;
  email: string;
  address: string;
  specialRequests: string;
  memberLevel: string;
  memberCardNo: string;
  memberType: string;
}

interface CompanyInfo {
  companyId: string;
  companyCode: string;
  companyName: string;
  companyEname: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  memberLevel: string;
  memberCardNo: string;
  memberType: string;
}

interface SalesLevel {
  id: string;
  name: string;
  phone: string;
  email: string;
}

interface BookingOrder {
  bookingId: string;
  chainId: string;
  hotelId: string;
  chainCode: string;
  chainName: string;
  hotelCode: string;
  hotelName: string;
  roomTypeCode: string;
  roomTypeName: string;
  rateCode: string;
  rateCodeName: string;
  packageCode: string;
  packageName: string;
  channelCode: string;
  channelSubcode: string;
  bookerCode: string;
  agentCode: string;
  sourceCode: string;
  marketCode: string;
  bookerType: string;
  channelResvNo: string;
  channelResvSno: string;
  channelResvPno: string;
  crsResvNo: string;
  crsResvPno: string;
  crsResvCheckinNo: string;
  agentResvNo: string;
  agentResvPno: string;
  hotelResvNo: string;
  hotelResvKey: string;
  hotelResvConfirm: string;
  hotelRoomNo: string;
  paymentType: string;
  reservationType: string;
  cancellationType: string;
  latestCancellationDays: number;
  latestCancellationTime: string;
  cancellableAfterBooking: boolean;
  orderRetentionTime: string;
  arrivalTime: string;
  remarkHotel: string;
  remarkChannel: string;
  remarkAgent: string;
  remarkGuest: string;
  remarkSpecial: string;
  remarkInvoice: string;
  remarkCancel: string;
  companyId: string;
  companyNo: string;
  companyName: string;
  companyTmcId: string;
  companyTmcNo: string;
  companyTmcName: string;
  memberNoGuest: string;
  memberTypeGuest: string;
  memberNoBooker: string;
  memberTypeBooker: string;
  guestId: string;
  guestName: string;
  guestEname: string;
  bookerId: string;
  bookerName: string;
  bookingDate: string;
  advanceBookingDays: number;
  checkInDate: string;
  checkOutDate: string;
  stayDays: number;
  checkInDateActual: string;
  checkOutDateActual: string;
  stayDaysActual: number;
  totalRooms: number;
  totalRoomsActual: number;
  totalRoomNights: number;
  totalRoomNightsActual: number;
  totalGuests: number;
  totalGuestsActual: number;
  bookingType: string;
  bookingStatusChannel: string;
  bookingStatusHotel: string;
  bookingStatusAgent: string;
  depositAmountChannel: number;
  depositAmountAgent: number;
  depositAmountHotel: number;
  penaltyAmountChannel: number;
  penaltyAmountHotel: number;
  penaltyAmountAgent: number;
  totalPriceChannel: number;
  totalPriceHotel: number;
  totalPriceAgent: number;
  totalPriceChannelActual: number;
  totalPriceHotelActual: number;
  totalPriceAgentActual: number;
  paymentDate: string;
  paymentNo: string;
  billDate: string;
  billNo: string;
  cateringFeeHotel: number;
  banquetFeeHotel: number;
  otherFeeHotel: number;
  totalRevenueFeeHotel: number;
  sign: number;
  salesLevelA: SalesLevel;
  salesLevelB: SalesLevel;
  salesLevelC: SalesLevel;
  createdAt: string;
  updatedAt: string;
  guestInfo: GuestInfo;
  bookerInfo: BookerInfo;
  companyInfo: CompanyInfo;
}

interface BookingListResponse {
  status: string;
  data: {
    bookings: BookingOrder[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
    numberOfElements: number;
  };
}

interface UpdatePriceRequest {
  bookingId: string;
  bookingDailyId: string;
  stayDate: string;
  priceChannelActual: number;
  priceHotelActual: number;
  isNew: boolean;
  action: string;
}

const orderStatusTabs = [
  { value: '', label: '全部订单' },
  { value: 'RESERVED', label: '待确认' },
  { value: 'CONFIRMED', label: '已确认' },
  { value: 'CHECKIN', label: '已入住' },
  { value: 'CHECKOUT', label: '已离店' },
  { value: 'NOSHOW', label: '应到未到' },
  { value: 'CANCEL', label: '已取消' },
];

const ReservationList: React.FC = () => {
  const [search, setSearch] = useState({
    status: '',
    orderNo: '',
    channelOrderNo: '',
    hotelOrderNo: '',
    guest: '',
    hotelId: '',
    channels: [] as string[],
    bookingStatus: [] as string[],
  });
  const [selectedOrderId, setSelectedOrderId] = useState<string>('');
  const [showDetail, setShowDetail] = useState(true);
  const [showGuestRequirements, setShowGuestRequirements] = useState(true);
  const [showOrderTips, setShowOrderTips] = useState(true);
  const [showConfirmationResult, setShowConfirmationResult] = useState(true);
  const [showConfirmNumberModal, setShowConfirmNumberModal] = useState(false);
  const [confirmNumber, setConfirmNumber] = useState('');
  const [showOrderLog, setShowOrderLog] = useState(true);

  // API相关状态
  const [orders, setOrders] = useState<BookingOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [pagination, setPagination] = useState({
    page: 0,
    size: 20,
    total: 0,
    totalPages: 0,
  });

  // 新增：订单详情相关状态
  const [selectedOrderDetail, setSelectedOrderDetail] = useState<BookingDetailResponse | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string>('');

  // 新增：酒店确认号相关状态
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // 新增：日志弹窗相关状态
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [showSnapshotModal, setShowSnapshotModal] = useState(false);
  const [selectedLogData, setSelectedLogData] = useState<any>(null);
  const [snapshotActiveTab, setSnapshotActiveTab] = useState<'detail' | 'json'>('detail');
  const [changeActiveTab, setChangeActiveTab] = useState<'change' | 'json'>('change');

  // 新增：修改价格相关状态
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [priceTableData, setPriceTableData] = useState<any[]>([]);
  const [priceLoading, setPriceLoading] = useState(false);
  const [discontinuousDateIndexes, setDiscontinuousDateIndexes] = useState<number[]>([]);
  const [saveResults, setSaveResults] = useState<{[key: string]: {status: 'success' | 'error' | 'pending', message: string}}>({});

  // 解析改变数据并生成表格数据
  const parseChangeData = (changeData: any) => {
    if (!changeData || typeof changeData !== 'object') {
      return [];
    }

    const changes: Array<{
      field: string;
      fieldName: string;
      beforeValue: any;
      afterValue: any;
      category: string;
    }> = [];

    // 递归遍历对象，找出所有变化的字段
    const traverseObject = (obj: any, path: string = '', category: string = '基本信息') => {
      if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
        Object.entries(obj).forEach(([key, value]) => {
          const currentPath = path ? `${path}.${key}` : key;
          
          // 如果是嵌套对象，继续遍历
          if (value && typeof value === 'object' && !Array.isArray(value)) {
            let subCategory = category;
            // 根据路径设置分类
            if (key === 'guestInfo') subCategory = '客人信息';
            else if (key === 'bookerInfo') subCategory = '预订人信息';
            else if (key === 'companyInfo') subCategory = '公司信息';
            else if (key === 'dailyDetails') subCategory = '间夜明细';
            else if (key === 'salesLevelA' || key === 'salesLevelB' || key === 'salesLevelC') subCategory = '销售级别';
            
            traverseObject(value, currentPath, subCategory);
          } else {
            // 如果是数组，处理数组元素
            if (Array.isArray(value)) {
              value.forEach((item, index) => {
                if (item && typeof item === 'object') {
                  traverseObject(item, `${currentPath}[${index}]`, category);
                }
              });
            } else {
              // 普通字段，添加到变化列表
              const fieldName = getFieldDisplayName(key);
              changes.push({
                field: currentPath,
                fieldName,
                beforeValue: value,
                afterValue: value, // 这里需要根据实际数据结构调整
                category
              });
            }
          }
        });
      }
    };

    traverseObject(changeData);
    return changes;
  };

  // 获取字段显示名称
  const getFieldDisplayName = (field: string): string => {
    const fieldNameMap: { [key: string]: string } = {
      bookingId: '订单ID',
      chainId: '集团ID',
      hotelId: '酒店ID',
      chainCode: '集团代码',
      chainName: '集团名称',
      hotelCode: '酒店代码',
      hotelName: '酒店名称',
      roomTypeCode: '房型代码',
      roomTypeName: '房型名称',
      rateCode: '价格代码',
      rateCodeName: '价格名称',
      channelCode: '渠道代码',
      guestName: '客人姓名',
      bookerName: '预订人姓名',
      checkInDate: '入住日期',
      checkOutDate: '离店日期',
      totalRooms: '房间数量',
      totalPriceChannel: '渠道总价',
      totalPriceHotel: '酒店总价',
      bookingStatusHotel: '酒店预订状态',
      paymentType: '支付方式',
      remarkHotel: '酒店备注',
      remarkGuest: '客人备注',
      phone: '电话',
      email: '邮箱',
      address: '地址',
      idNumber: '证件号码',
      companyName: '公司名称',
      contactPerson: '联系人',
      stayDate: '在住日期',
      priceChannelActual: '渠道实际价格',
      priceHotelActual: '酒店实际价格',
      rooms: '房间数',
      roomsActual: '实际房间数'
    };

    return fieldNameMap[field] || field;
  };

  // 解析快照JSON并生成表格数据
  const parseSnapshotData = (snapshotData: any) => {
    if (!snapshotData || typeof snapshotData !== 'object') {
      return [];
    }

    const tableData: Array<{ key: string; value: any; category: string }> = [];
    
    // 基本信息
    const basicInfo = [
      { key: 'CRS订单号', value: snapshotData.crsResvNo, category: '基本信息' },
      { key: '渠道订单号', value: snapshotData.channelResvNo, category: '基本信息' },
      { key: '酒店订单号', value: snapshotData.hotelResvNo, category: '基本信息' },
      { key: '酒店人工确认号', value: snapshotData.hotelResvConfirm, category: '基本信息' },
      { key: '预订日期', value: snapshotData.bookingDate, category: '基本信息' },
      { key: '订单类型', value: getBookingTypeText(snapshotData.bookingType), category: '基本信息' },
      { key: '订单状态', value: getBookingStatusText(snapshotData.bookingStatusHotel), category: '基本信息' },
    ];

    // 酒店信息
    const hotelInfo = [
      { key: '酒店名称', value: snapshotData.hotelName, category: '酒店信息' },
      { key: '酒店代码', value: snapshotData.hotelCode, category: '酒店信息' },
      { key: '房型名称', value: snapshotData.roomTypeName, category: '酒店信息' },
      { key: '房型代码', value: snapshotData.roomTypeCode, category: '酒店信息' },
      { key: '房价代码', value: snapshotData.rateCode, category: '酒店信息' },
      { key: '房价名称', value: snapshotData.rateCodeName, category: '酒店信息' },
    ];

    // 客人信息
    const guestInfo = [
      { key: '客人姓名', value: snapshotData.guestName, category: '客人信息' },
      { key: '客人英文名', value: snapshotData.guestEname, category: '客人信息' },
      { key: '预订人姓名', value: snapshotData.bookerName, category: '客人信息' },
      { key: '预订人类型', value: snapshotData.bookerType, category: '客人信息' },
      { key: '入住人数', value: snapshotData.totalGuests, category: '客人信息' },
      { key: '房间数量', value: snapshotData.totalRooms, category: '客人信息' },
    ];

    // 入住信息
    const stayInfo = [
      { key: '入住日期', value: snapshotData.checkInDate, category: '入住信息' },
      { key: '离店日期', value: snapshotData.checkOutDate, category: '入住信息' },
      { key: '入住天数', value: snapshotData.stayDays, category: '入住信息' },
      { key: '到达时间', value: snapshotData.arrivalTime ? snapshotData.arrivalTime.substring(0, 5) : '', category: '入住信息' },
    ];

    // 价格信息
    const priceInfo = [
      { key: '渠道总价', value: `¥${snapshotData.totalPriceChannel}`, category: '价格信息' },
      { key: '酒店总价', value: `¥${snapshotData.totalPriceHotel}`, category: '价格信息' },
      { key: '支付类型', value: getPaymentTypeTextForSnapshot(snapshotData.paymentType), category: '价格信息' },
      { key: '预订类型', value: getReservationTypeTextForSnapshot(snapshotData.reservationType), category: '价格信息' },
    ];

    // 备注信息
    const remarkInfo = [
      { key: '渠道备注', value: snapshotData.remarkChannel, category: '备注信息' },
      { key: '酒店备注', value: snapshotData.remarkHotel, category: '备注信息' },
      { key: '客人备注', value: snapshotData.remarkGuest, category: '备注信息' },
      { key: '特殊需求', value: snapshotData.remarkSpecial, category: '备注信息' },
      { key: '发票要求', value: snapshotData.remarkInvoice, category: '备注信息' },
    ];

    // 取消政策
    const cancellationInfo = [
      { key: '取消类型', value: getCancellationTypeText(snapshotData.cancellationType), category: '取消政策' },
      { key: '提前取消天数', value: snapshotData.latestCancellationDays, category: '取消政策' },
      { key: '最晚取消时间', value: snapshotData.latestCancellationTime ? snapshotData.latestCancellationTime.substring(0, 5) : '', category: '取消政策' },
      { key: '是否可取消预订', value: snapshotData.cancellableAfterBooking ? '是' : '否', category: '取消政策' },
      { key: '房间保留时间', value: snapshotData.orderRetentionTime ? snapshotData.orderRetentionTime.substring(0, 5) : '', category: '取消政策' },
    ];

    return [
      ...basicInfo,
      ...hotelInfo,
      ...guestInfo,
      ...stayInfo,
      ...priceInfo,
      ...remarkInfo,
      ...cancellationInfo
    ].filter(item => item.value !== null && item.value !== undefined && item.value !== '');
  };

  // 获取用户信息
  const getUserInfo = () => {
    try {
      const userInfo = localStorage.getItem('user');
      return userInfo ? JSON.parse(userInfo) : null;
    } catch (error) {
      console.error('解析用户信息失败:', error);
      return null;
    }
  };

  // 获取订单列表
  const fetchOrders = async (searchParams: any = {}) => {
    setLoading(true);
    setError('');
    
    try {
      const userInfo = getUserInfo();
      if (!userInfo?.chainId) {
        setError('未获取到用户信息或chainId');
        return;
      }

      const requestBody: BookingListRequest = {
        chainId: userInfo.chainId,
        hotelId: searchParams.hotelId || '',
        crsResvNo: searchParams.orderNo || '',  // 搜索CRS订单号
        channelResvNo: searchParams.channelOrderNo || '',  // 搜索渠道订单号
        hotelResvNo: searchParams.hotelOrderNo || '',  // 搜索酒店订单号
        guestName: searchParams.guest || '',
        bookerName: '',
        channelCode: '',
        channelCodes: searchParams.channels || [],
        rateCode: '',
        roomTypeCode: '',
        checkInDateStart: '',
        checkInDateEnd: '',
        checkOutDateStart: '',
        checkOutDateEnd: '',
        bookingStatus: searchParams.bookingStatus || [],
        page: pagination.page,
        size: pagination.size,
      };

      // 打印请求体 - JSON格式
      console.log('=== 订单列表请求体 ===');
      console.log('请求URL:', '/api/booking/list');
      console.log('请求方法:', 'POST');
      console.log('请求体:', JSON.stringify(requestBody, null, 2));
      console.log('请求参数详情:', {
        chainId: requestBody.chainId,
        hotelId: requestBody.hotelId || '未选择',
        crsResvNo: requestBody.crsResvNo || '未输入',
        channelResvNo: requestBody.channelResvNo || '未输入',
        hotelResvNo: requestBody.hotelResvNo || '未输入',
        guestName: requestBody.guestName || '未输入',
        channelCodes: requestBody.channelCodes.length > 0 ? requestBody.channelCodes.join(',') : '未选择',
        bookingStatus: requestBody.bookingStatus.length > 0 ? requestBody.bookingStatus.join(',') : '未选择',
        page: requestBody.page,
        size: requestBody.size,
      });

      const response = await request.post<BookingListResponse>('/api/booking/list', requestBody);
      
      // 打印响应体 - JSON格式
      console.log('=== 订单列表响应体 ===');
      console.log('响应状态:', response.status);
      console.log('响应状态文本:', response.statusText);
      console.log('响应头:', response.headers);
      console.log('响应体:', JSON.stringify(response.data, null, 2));
      
      if (response.data.status === 'success') {
        const { bookings, totalElements, totalPages, size, number } = response.data.data;
        
        // 打印响应数据详情
        console.log('=== 响应数据详情 ===');
        console.log('订单数量:', bookings.length);
        console.log('总记录数:', totalElements);
        console.log('总页数:', totalPages);
        console.log('当前页:', number + 1);
        console.log('每页大小:', size);
        console.log('订单列表:', bookings.map(order => ({
          bookingId: order.bookingId,
          crsResvNo: order.crsResvNo,
          guestName: order.guestName,
          roomTypeName: order.roomTypeName,
          totalRooms: order.totalRooms,
          checkInDate: order.checkInDate,
          checkOutDate: order.checkOutDate,
          stayDays: order.stayDays,
          bookingType: order.bookingType,
          bookingTypeText: getBookingTypeText(order.bookingType),
          bookingStatusChannel: order.bookingStatusChannel,
          bookingStatusHotel: order.bookingStatusHotel,
          bookingStatusHotelText: getBookingStatusText(order.bookingStatusHotel),
                      paymentType: order.paymentType,
            paymentTypeText: getPaymentTypeText(order.paymentType),
            reservationType: order.reservationType,
            reservationTypeText: getReservationTypeText(order.reservationType),
          totalPriceChannelActual: order.totalPriceChannelActual,
          totalPriceHotelActual: order.totalPriceHotelActual,
          cancellableAfterBooking: order.cancellableAfterBooking,
          latestCancellationDays: order.latestCancellationDays,
          latestCancellationTime: order.latestCancellationTime,
          cancellationPolicyText: getCancellationPolicyText(order.cancellationType, order.checkInDate, order.latestCancellationDays, order.latestCancellationTime),
          orderRetentionTime: order.orderRetentionTime,
          showRetentionTime: order.paymentType === 'UNPAID',
        })));
        
        // 直接使用API返回的数据，不需要转换
        setOrders(bookings);
        setPagination(prev => ({
          ...prev,
          total: totalElements,
          totalPages,
          page: number,
        }));

        // 如果当前选中的订单不在新数据中，选择第一个
        if (bookings.length > 0 && !bookings.find(order => order.bookingId === selectedOrderId)) {
          setSelectedOrderId(bookings[0].bookingId);
        }
      } else {
        console.log('=== 请求失败 ===');
        console.log('错误响应:', response.data);
        setError('获取订单列表失败');
      }
    } catch (error: any) {
      console.error('=== 网络请求异常 ===');
      console.error('错误类型:', error.name);
      console.error('错误消息:', error.message);
      console.error('错误堆栈:', error.stack);
      if (error.response) {
        console.error('错误响应状态:', error.response.status);
        console.error('错误响应数据:', JSON.stringify(error.response.data, null, 2));
      } else if (error.request) {
        console.error('请求已发送但无响应:', error.request);
      }
      setError(error.response?.data?.message || error.message || '网络请求失败');
    } finally {
      setLoading(false);
    }
  };

  // 新增：保存酒店确认号
  const saveHotelConfirmNumber = async (bookingId: string, confirmNumber: string) => {
    if (!bookingId || !confirmNumber.trim()) {
      console.log('=== 保存酒店确认号参数验证失败 ===');
      console.log('订单ID:', bookingId);
      console.log('确认号:', confirmNumber);
      return false;
    }

    // 获取用户信息
    const userInfo = getUserInfo();
    if (!userInfo?.userId) {
      console.log('=== 保存酒店确认号用户信息获取失败 ===');
      console.log('用户信息:', userInfo);
      setConfirmMessage({ type: 'error', text: '未获取到用户信息，请重新登录' });
      return false;
    }

    setConfirmLoading(true);
    
    try {
      console.log('=== 保存酒店确认号请求 ===');
      console.log('请求URL:', `/api/booking/${bookingId}/confirm`);
      console.log('请求方法:', 'POST');
      console.log('订单ID:', bookingId);
      console.log('确认号:', confirmNumber);
      console.log('用户ID:', userInfo.userId);

      const requestBody = {
        confirmNumber: confirmNumber.trim(),
        userId: userInfo.userId
      };

      console.log('请求体:', JSON.stringify(requestBody, null, 2));

      const response = await request.post(`/api/booking/${bookingId}/confirm`, requestBody);
      
      console.log('=== 保存酒店确认号响应 ===');
      console.log('响应状态:', response.status);
      console.log('响应状态文本:', response.statusText);
      console.log('响应体:', JSON.stringify(response.data, null, 2));
      
              if (response.data.status === 'success') {
          console.log('=== 保存成功 ===');
          console.log('酒店确认号已保存:', confirmNumber);
          
          // 显示成功消息
          setConfirmMessage({ type: 'success', text: '酒店确认号保存成功' });
          
          // 重新获取订单详情以更新显示
          await fetchOrderDetail(bookingId);
          
          return true;
        } else {
          console.log('=== 保存失败 ===');
          console.log('错误响应:', response.data);
          
          // 显示错误消息
          setConfirmMessage({ type: 'error', text: response.data.message || '保存失败，请重试' });
          
          return false;
        }
          } catch (error: any) {
        console.error('=== 保存酒店确认号请求异常 ===');
        console.error('错误类型:', error.name);
        console.error('错误消息:', error.message);
        console.error('错误堆栈:', error.stack);
        if (error.response) {
          console.error('错误响应状态:', error.response.status);
          console.error('错误响应数据:', JSON.stringify(error.response.data, null, 2));
          
          // 显示错误消息
          setConfirmMessage({ type: 'error', text: error.response.data?.message || '网络请求失败' });
        } else if (error.request) {
          console.error('请求已发送但无响应:', error.request);
          setConfirmMessage({ type: 'error', text: '网络连接失败，请检查网络' });
        } else {
          setConfirmMessage({ type: 'error', text: '保存失败，请重试' });
        }
        return false;
    } finally {
      setConfirmLoading(false);
    }
  };

  // 新增：获取订单详情
  const fetchOrderDetail = async (bookingId: string) => {
    if (!bookingId) return;
    
    setDetailLoading(true);
    setDetailError('');
    
    try {
      console.log('=== 订单详情请求 ===');
      console.log('请求URL:', `/api/booking/${bookingId}`);
      console.log('请求方法:', 'GET');
      console.log('订单ID:', bookingId);

      const response = await request.get<BookingDetailResponse>(`/api/booking/${bookingId}`);
      
      console.log('=== 订单详情响应 ===');
      console.log('响应状态:', response.status);
      console.log('响应状态文本:', response.statusText);
      console.log('=== 订单详情响应体 (JSON格式) ===');
      console.log(JSON.stringify(response.data, null, 2));
      console.log('=== 订单详情响应体结束 ===');
      
      // 直接使用API返回的数据
      setSelectedOrderDetail(response.data);
      
      console.log('=== 订单详情数据解析 ===');
              console.log('订单基本信息:', {
          bookingId: response.data.bookingId,
          crsResvNo: response.data.crsResvNo,
          channelResvNo: response.data.channelResvNo,
          hotelResvNo: response.data.hotelResvNo,
          guestName: response.data.guestName,
          roomTypeName: response.data.roomTypeName,
          totalRooms: response.data.totalRooms,
          checkInDate: response.data.checkInDate,
          checkOutDate: response.data.checkOutDate,
          stayDays: response.data.stayDays,
          bookingType: response.data.bookingType,
          bookingTypeText: getBookingTypeText(response.data.bookingType),
          bookingStatusHotel: response.data.bookingStatusHotel,
          bookingStatusHotelText: getBookingStatusText(response.data.bookingStatusHotel),
                      paymentType: response.data.paymentType,
            paymentTypeText: getPaymentTypeText(response.data.paymentType),
            reservationType: response.data.reservationType,
            reservationTypeText: getReservationTypeText(response.data.reservationType),
          totalPriceChannelActual: response.data.totalPriceChannelActual,
          totalPriceHotelActual: response.data.totalPriceHotelActual,
          cancellableAfterBooking: response.data.cancellableAfterBooking,
          latestCancellationDays: response.data.latestCancellationDays,
          latestCancellationTime: response.data.latestCancellationTime,
          cancellationPolicyText: getCancellationPolicyText(response.data.cancellationType, response.data.checkInDate, response.data.latestCancellationDays, response.data.latestCancellationTime),
          orderRetentionTime: response.data.orderRetentionTime,
          showRetentionTime: response.data.paymentType === 'UNPAID',
        });
      
      console.log('日明细数量:', response.data.dailyDetails?.length || 0);
      console.log('日志数量:', response.data.logs?.length || 0);
      
    } catch (error: any) {
      console.error('=== 订单详情请求异常 ===');
      console.error('错误类型:', error.name);
      console.error('错误消息:', error.message);
      console.error('错误堆栈:', error.stack);
      if (error.response) {
        console.error('错误响应状态:', error.response.status);
        console.error('错误响应数据:', JSON.stringify(error.response.data, null, 2));
      } else if (error.request) {
        console.error('请求已发送但无响应:', error.request);
      }
      setDetailError(error.response?.data?.message || error.message || '获取订单详情失败');
    } finally {
      setDetailLoading(false);
    }
  };

  // 初始加载和搜索条件变化时获取数据
  useEffect(() => {
    fetchOrders(search);
  }, [search, pagination.page, pagination.size]);

  // 处理搜索条件变化
  const handleSearchChange = (newSearch: any) => {
    console.log('=== 搜索条件变化 ===');
    console.log('原搜索条件:', search);
    console.log('新搜索条件:', newSearch);
    console.log('变化详情:', {
      status: search.status !== newSearch.status ? `${search.status} → ${newSearch.status}` : '无变化',
      orderNo: search.orderNo !== newSearch.orderNo ? `${search.orderNo} → ${newSearch.orderNo}` : '无变化',
      channelOrderNo: search.channelOrderNo !== newSearch.channelOrderNo ? `${search.channelOrderNo} → ${newSearch.channelOrderNo}` : '无变化',
      hotelOrderNo: search.hotelOrderNo !== newSearch.hotelOrderNo ? `${search.hotelOrderNo} → ${newSearch.hotelOrderNo}` : '无变化',
      guest: search.guest !== newSearch.guest ? `${search.guest} → ${newSearch.guest}` : '无变化',
      hotelId: search.hotelId !== newSearch.hotelId ? `${search.hotelId} → ${newSearch.hotelId}` : '无变化',
      channels: JSON.stringify(search.channels) !== JSON.stringify(newSearch.channels) ? `${search.channels.join(',')} → ${newSearch.channels.join(',')}` : '无变化',
    });
    
    setSearch(newSearch);
    setPagination(prev => ({ ...prev, page: 0 })); // 重置页码
  };

  // 处理分页变化
  const handlePageChange = (newPage: number) => {
    console.log('=== 分页变化 ===');
    console.log('当前页:', pagination.page + 1);
    console.log('目标页:', newPage + 1);
    console.log('总页数:', pagination.totalPages);
    console.log('每页大小:', pagination.size);
    console.log('总记录数:', pagination.total);
    
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  // Mock order log data
  const mockOrderLogs = [
    {
      time: '2025-05-11 17:05:23',
      operator: '系统',
      content: '订单创建成功',
    },
    {
      time: '2025-05-11 17:05:25',
      operator: '系统',
      content: '订单自动确认成功',
    },
    {
      time: '2025-05-11 17:10:15',
      operator: '张经理',
      content: '修改订单备注：客人要求安静房间',
    },
    {
      time: '2025-05-11 17:15:30',
      operator: '系统',
      content: '发送订单确认短信给客人',
    },
  ];

  // 处理订单选择
  const handleOrderSelect = (order: BookingOrder) => {
    console.log('=== 订单选择 ===');
    console.log('选中订单ID:', order.bookingId);
    console.log('订单详情:', {
      bookingId: order.bookingId,
      crsResvNo: order.crsResvNo,
      channelResvNo: order.channelResvNo,
      hotelResvNo: order.hotelResvNo,
      guestName: order.guestName,
      roomTypeName: order.roomTypeName,
      totalRooms: order.totalRooms,
      checkInDate: order.checkInDate,
      checkOutDate: order.checkOutDate,
      stayDays: order.stayDays,
      bookingType: order.bookingType,
      bookingTypeText: getBookingTypeText(order.bookingType),
      bookingStatusChannel: order.bookingStatusChannel,
      bookingStatusHotel: order.bookingStatusHotel,
      bookingStatusHotelText: getBookingStatusText(order.bookingStatusHotel),
              paymentType: order.paymentType,
        paymentTypeText: getPaymentTypeText(order.paymentType),
        reservationType: order.reservationType,
        reservationTypeText: getReservationTypeText(order.reservationType),
      totalPriceChannelActual: order.totalPriceChannelActual,
      totalPriceHotelActual: order.totalPriceHotelActual,
      cancellableAfterBooking: order.cancellableAfterBooking,
      latestCancellationDays: order.latestCancellationDays,
      latestCancellationTime: order.latestCancellationTime,
      cancellationPolicyText: getCancellationPolicyText(order.cancellationType, order.checkInDate, order.latestCancellationDays, order.latestCancellationTime),
      orderRetentionTime: order.orderRetentionTime,
      showRetentionTime: order.paymentType === 'UNPAID',
    });
    
    setSelectedOrderId(order.bookingId);
    
    // 调用订单详情接口
    console.log('=== 开始获取订单详情 ===');
    console.log('即将调用 fetchOrderDetail 函数获取订单详情');
    fetchOrderDetail(order.bookingId);
  };

  // 获取当前选中的订单（从列表数据中）
  const selectedOrder = orders.find(order => order.bookingId === selectedOrderId);

  // 保证选中项在过滤后仍然存在，并自动选择第一个订单
  React.useEffect(() => {
    if (orders.length > 0) {
      // 如果当前选中的订单不在新列表中，或者没有选中任何订单，则选择第一个
      const currentSelectedOrder = orders.find(order => order.bookingId === selectedOrderId);
      if (!currentSelectedOrder) {
        setSelectedOrderId(orders[0].bookingId);
        // 如果还没有详情数据，则获取详情
        if (!selectedOrderDetail || selectedOrderDetail.bookingId !== orders[0].bookingId) {
          fetchOrderDetail(orders[0].bookingId);
        }
      } else {
        // 如果当前选中的订单仍然存在，确保有详情数据
        if (!selectedOrderDetail || selectedOrderDetail.bookingId !== currentSelectedOrder.bookingId) {
          fetchOrderDetail(currentSelectedOrder.bookingId);
        }
      }
    } else {
      // 如果没有订单，清空选中的订单ID和详情数据
      setSelectedOrderId('');
      setSelectedOrderDetail(null);
    }
  }, [search, orders.length]);

  // 使用详情数据或列表数据作为显示数据
  const displayOrder = selectedOrderDetail || selectedOrder;

  // 新增：打开修改价格弹窗
  const handleOpenPriceModal = () => {
    if (selectedOrderDetail?.dailyDetails) {
      const tableData = selectedOrderDetail.dailyDetails.map((detail, index) => ({
        id: index,
        stayDate: detail.stayDate,
        priceChannelActual: detail.priceChannelActual,
        priceHotelActual: detail.priceHotelActual,
        action: 'NOCHANGE',
        isNew: false,
        bookingDailyId: detail.bookingDailyId || `daily_${index}`, // 优先使用真实的 bookingDailyId，如果没有则使用索引
      }));
      setPriceTableData(tableData);
      setDiscontinuousDateIndexes([]); // 清空不连续日期索引
      setSaveResults({}); // 清空保存结果
      setShowPriceModal(true);
    }
  };

  // 新增：添加早到行
  const handleAddEarlyArrival = () => {
    const newRow = {
      id: Date.now(),
      stayDate: '',
      priceChannelActual: 0,
      priceHotelActual: 0,
      action: 'ADD',
      isNew: true,
      bookingDailyId: '',
    };
    setPriceTableData(prev => {
      const newData = [newRow, ...prev];
      // 检查连续性
      const dates = newData.map(row => row.stayDate);
      const continuityCheck = checkDateContinuity(dates);
      setDiscontinuousDateIndexes(continuityCheck.discontinuousIndexes);
      return newData;
    });
  };

  // 新增：添加延住行
  const handleAddExtendedStay = () => {
    const newRow = {
      id: Date.now(),
      stayDate: '',
      priceChannelActual: 0,
      priceHotelActual: 0,
      action: 'ADD',
      isNew: true,
      bookingDailyId: '',
    };
    setPriceTableData(prev => {
      const newData = [...prev, newRow];
      // 检查连续性
      const dates = newData.map(row => row.stayDate);
      const continuityCheck = checkDateContinuity(dates);
      setDiscontinuousDateIndexes(continuityCheck.discontinuousIndexes);
      return newData;
    });
  };

  // 新增：更新表格数据
  const handleUpdatePriceTableData = (index: number, field: string, value: any) => {
    setPriceTableData(prev => {
      const newData = prev.map((row, i) => 
        i === index ? { ...row, [field]: value } : row
      );
      
      // 如果更新的是日期字段，检查连续性
      if (field === 'stayDate') {
        const dates = newData.map(row => row.stayDate);
        const continuityCheck = checkDateContinuity(dates);
        setDiscontinuousDateIndexes(continuityCheck.discontinuousIndexes);
      }
      
      return newData;
    });
  };

  // 新增：检查日期连续性
  const checkDateContinuity = (dates: string[]): { isContinuous: boolean; discontinuousIndexes: number[] } => {
    const discontinuousIndexes: number[] = [];
    const sortedDates = dates
      .map((date, index) => ({ date, index }))
      .filter(item => item.date) // 过滤掉空日期
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    for (let i = 1; i < sortedDates.length; i++) {
      const prevDate = new Date(sortedDates[i - 1].date);
      const currDate = new Date(sortedDates[i].date);
      const diffTime = currDate.getTime() - prevDate.getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      
      if (diffDays !== 1) {
        discontinuousIndexes.push(sortedDates[i - 1].index);
        discontinuousIndexes.push(sortedDates[i].index);
      }
    }
    
    return {
      isContinuous: discontinuousIndexes.length === 0,
      discontinuousIndexes: [...new Set(discontinuousIndexes)] // 去重
    };
  };

  // 新增：保存价格修改
  const handleSavePriceChanges = async () => {
    setPriceLoading(true);
    try {
      // 检查是否有空日期
      const hasEmptyDate = priceTableData.some(row => !row.stayDate);
      if (hasEmptyDate) {
        message.error('请填写所有日期');
        return;
      }

      // 检查日期连续性
      const dates = priceTableData.map(row => row.stayDate);
      const continuityCheck = checkDateContinuity(dates);
      if (!continuityCheck.isContinuous) {
        message.error('入住日期不连续，请检查后再次提交。');
        return;
      }

      const updateRequests: UpdatePriceRequest[] = priceTableData
        .map(row => ({
          bookingId: displayOrder?.bookingId || '',
          bookingDailyId: row.bookingDailyId,
          stayDate: row.stayDate,
          priceChannelActual: row.priceChannelActual,
          priceHotelActual: row.priceHotelActual,
          isNew: row.isNew,
          action: row.action,
        }));

      if (updateRequests.length === 0) {
        message.info('没有数据需要保存');
        setShowPriceModal(false);
        return;
      }

      console.log('=== 保存价格修改请求 ===');
      console.log('请求URL:', '/api/booking/updateprice/batch');
      console.log('请求方法:', 'POST');
      console.log('请求体:', JSON.stringify(updateRequests, null, 2));

      // 初始化所有行的保存状态为pending
      const initialResults: {[key: string]: {status: 'pending', message: string}} = {};
      priceTableData.forEach(row => {
        initialResults[row.id] = { status: 'pending', message: '保存中...' };
      });
      setSaveResults(initialResults);

      const response = await request.post('/api/booking/updateprice/batch', updateRequests);
      
      console.log('=== 保存价格修改响应 ===');
      console.log('响应状态:', response.status);
      console.log('响应体:', JSON.stringify(response.data, null, 2));

      if (response.data.success) {
        // 处理新的响应格式，根据 results 数组更新每行的状态
        const newResults: {[key: string]: {status: 'success' | 'error', message: string}} = {};
        
        // 初始化所有行为成功状态
        priceTableData.forEach(row => {
          newResults[row.id] = { status: 'success', message: '保存成功' };
        });
        
        // 根据 results 数组更新具体行的状态
        if (response.data.results && Array.isArray(response.data.results)) {
          response.data.results.forEach((result: any) => {
            // 根据 bookingDailyId 找到对应的行
            let targetRow = priceTableData.find(row => row.bookingDailyId === result.bookingDailyId);
            
            // 如果通过 bookingDailyId 没找到，尝试通过 stayDate 匹配
            if (!targetRow) {
              targetRow = priceTableData.find(row => row.stayDate === result.stayDate);
            }
            
            // 如果还是没找到，尝试通过索引匹配（假设 results 数组顺序与 priceTableData 顺序一致）
            if (!targetRow && result.bookingDailyId) {
              const indexMatch = result.bookingDailyId.match(/daily_(\d+)/);
              if (indexMatch) {
                const index = parseInt(indexMatch[1]);
                targetRow = priceTableData[index];
              }
            }
            
            if (targetRow) {
              newResults[targetRow.id] = {
                status: result.success ? 'success' : 'error',
                message: result.message || (result.success ? '保存成功' : '保存失败')
              };
            } else {
              console.warn('未找到匹配的行:', result);
            }
          });
        }
        
        setSaveResults(newResults);
        
        // 显示总体结果消息
        if (response.data.successCount > 0 && response.data.failCount === 0) {
          message.success(response.data.message || '价格修改保存成功');
          // 不关闭窗口，保持打开状态
          setDiscontinuousDateIndexes([]); // 清空不连续日期索引
        } else if (response.data.successCount > 0 && response.data.failCount > 0) {
          message.warning(response.data.message || '价格修改部分成功');
        } else {
          message.error(response.data.message || '价格修改保存失败');
        }
      } else {
        // 更新所有行的保存状态为失败
        const errorResults: {[key: string]: {status: 'error', message: string}} = {};
        priceTableData.forEach(row => {
          errorResults[row.id] = { status: 'error', message: response.data.message || '保存失败' };
        });
        setSaveResults(errorResults);
        message.error(response.data.message || '保存失败');
      }
    } catch (error: any) {
      console.error('=== 保存价格修改异常 ===');
      console.error('错误:', error);
      message.error(error.response?.data?.message || error.message || '保存失败');
    } finally {
      setPriceLoading(false);
    }
  };

  return (
    <ConfigProvider locale={zhCN}>
      <TokenCheck>
      <div className="flex flex-col h-[calc(100vh-48px)] bg-gray-50">
      {/* 查询条件面板 */}
      <div className="bg-white p-4 border-b">
        {/* 第一行：订单状态Tabs */}
        <div className="flex gap-2 mb-4">
          {orderStatusTabs.map(tab => (
            <button
              key={tab.value}
              className={`px-5 py-2 rounded-t text-sm font-medium border-b-2 transition-colors duration-150 focus:outline-none
                ${search.status === tab.value ? 'border-blue-500 text-blue-600 bg-blue-50' : 'border-transparent text-gray-600 bg-transparent hover:bg-gray-100'}`}
              onClick={() => handleSearchChange({ ...search, status: tab.value })}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {/* 第二行：查询条件 */}
        <Row gutter={24} className="mb-4">
          <Col span={6}>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={search.orderNo}
              onChange={e => handleSearchChange({ ...search, orderNo: e.target.value })}
              placeholder="CRS订单号"
            />
          </Col>
          <Col span={6}>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={search.channelOrderNo}
              onChange={e => handleSearchChange({ ...search, channelOrderNo: e.target.value })}
              placeholder="渠道订单号"
            />
          </Col>
          <Col span={6}>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={search.hotelOrderNo}
              onChange={e => handleSearchChange({ ...search, hotelOrderNo: e.target.value })}
              placeholder="酒店订单号"
            />
          </Col>
          <Col span={6}>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={search.guest}
              onChange={e => handleSearchChange({ ...search, guest: e.target.value })}
              placeholder="客人姓名"
            />
          </Col>
        </Row>
        
        {/* 第三行：酒店和渠道选择 */}
        <Row gutter={24} className="mb-4">
          <Col span={6}>
            <HotelSelect
              value={search.hotelId}
              onChange={(value: string) => handleSearchChange({ ...search, hotelId: value })}
              placeholder="选择酒店"
              required={false}  // 明确设置为false，允许清空
            />
          </Col>
          <Col span={6}>
            <ChannelsSelect
              value={search.channels}
              onChange={(value: string[]) => handleSearchChange({ ...search, channels: value })}
              placeholder="请选择渠道"
              mode="multiple"
              maxTagCount={3}
              showSearch={true}
              allowClear={true}
            />
          </Col>
          <Col span={6}>
            <BookingStatusesSelect
              value={search.bookingStatus}
              onChange={(value: string[]) => handleSearchChange({ ...search, bookingStatus: value })}
              placeholder="请选择订单状态"
              mode="multiple"
              maxTagCount={3}
              showSearch={true}
              allowClear={true}
            />
          </Col>
        </Row>
        
        {/* 错误提示 */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="text-red-700 text-sm">{error}</div>
          </div>
        )}
      </div>
      {/* 下方左右结构 */}
      <div className="flex flex-1 min-h-0">
        {/* 左侧订单列表 */}
        <div className="w-96 min-w-[320px] max-w-[400px] border-r bg-white overflow-y-auto">
          <div className="p-4 border-b text-lg font-bold flex justify-between items-center">
            <span>订单列表</span>
            {loading && (
              <div className="text-sm text-gray-500">加载中...</div>
            )}
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              <ul>
                {orders.map(order => (
                  <li
                    key={order.bookingId}
                    className={`cursor-pointer px-4 py-3 border-b hover:bg-blue-50 ${selectedOrderId === order.bookingId ? 'bg-blue-100 border-l-4 border-blue-500' : ''}`}
                    onClick={() => handleOrderSelect(order)}
              >
                <div className="flex justify-between items-center">
                      <span className="font-semibold text-blue-700">{getBookingTypeText(order.bookingType)} {order.crsResvNo || order.bookingId}</span>
                      <span className="text-xs text-gray-500">{order.bookingDate}</span>
                </div>
                    <div className="text-xs text-gray-500">渠道单: {order.channelResvNo} | 酒店单: {order.hotelResvNo}</div>                    
                <div className="text-xs mt-1">
                      <span className="inline-block px-2 py-0.5 rounded bg-yellow-100 text-gray-700 mr-2">{getBookingStatusText(order.bookingStatusHotel)}</span>
                      <span className="inline-block px-2 py-0.5 rounded bg-green-100 text-gray-700 mr-2">{getReservationTypeText(order.reservationType)}</span>
                      <span className="inline-block px-2 py-0.5 rounded bg-purple-100 text-gray-700 mr-2">{getPaymentTypeText(order.paymentType)}</span>
                    </div>
                    <div className="text-sm text-gray-500">{order.guestName}</div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-700">{order.roomTypeName} | {order.totalRooms}间</span>
                      <span className="text-xs text-gray-500">{order.checkInDate} - {order.checkOutDate} | {order.stayDays}晚</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-700">渠道价: {order.totalPriceChannelActual}元 | 酒店价: {order.totalPriceHotelActual}元</span>
                      <span className="text-xs text-gray-500">{order.rateCodeName}</span>
                    </div>
                    
                    
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-700">操作人: {order.salesLevelA.name}</span>
                      <span className="text-xs text-gray-500">时间: {order.updatedAt}</span>
                </div>
              </li>
            ))}
                {orders.length === 0 && !loading && (
              <li className="text-center text-gray-400 py-8">无匹配订单</li>
            )}
          </ul>
              
              {/* 分页 */}
              {pagination.totalPages > 1 && (
                <div className="p-4 border-t flex justify-between items-center bg-gray-50">
                  <div className="text-sm text-gray-500">
                    共 {pagination.total} 条记录，每页 {pagination.size} 条
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 0}
                      className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                    >
                      上一页
                    </button>
                    <span className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded">
                      {pagination.page + 1} / {pagination.totalPages}
                    </span>
                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page >= pagination.totalPages - 1}
                      className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                    >
                      下一页
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* 右侧订单详情 */}
        <div className="flex-1 p-0 overflow-y-auto">
          {detailLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <div className="text-gray-600">加载订单详情中...</div>
              </div>
            </div>
          ) : detailError ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-red-600 mb-2">加载失败</div>
                <div className="text-gray-600 text-sm">{detailError}</div>
              </div>
            </div>
          ) : orders.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-gray-400 mb-2">暂无订单</div>
                <div className="text-gray-500 text-sm">请调整查询条件或稍后再试</div>
              </div>
            </div>
          ) : displayOrder ? (
            <div className="w-full bg-white rounded shadow p-6">
              {/* 订单号和状态 */}
              <div className="flex justify-between items-center mb-4">
                <div>
                  <span className="text-xl font-bold text-blue-700">{getBookingTypeText(displayOrder.bookingType)}：{displayOrder.crsResvNo || displayOrder.bookingId}</span>
                  <span className="ml-4 text-sm text-gray-500">{displayOrder.bookingDate}</span>
                </div>
                <div>
                  <span className="px-3 py-1 rounded bg-yellow-100 text-gray-700 text-sm ml-4">{getBookingStatusText(displayOrder.bookingStatusHotel)}</span>
                  <span className="px-3 py-1 rounded bg-green-100 text-gray-700 text-sm ml-4">{getReservationTypeText(displayOrder.reservationType)}</span>
                  <span className="px-3 py-1 rounded bg-purple-100 text-gray-700 text-sm ml-4">{getPaymentTypeText(displayOrder.paymentType)}</span>
                </div>
              </div>

              {/* 新增：渠道号和酒店单号信息 */}
              <div className="flex gap-8 mb-4 text-sm">
                <div>
                  <span className="text-gray-600">渠道号：</span>
                  <span className="font-medium">{displayOrder.channelResvNo || '无'}</span>
                </div>
                <div>
                  <span className="text-gray-600">酒店单号：</span>
                  <span className="font-medium">{displayOrder.hotelResvNo || '无'}</span>
                </div>
              </div>

              {/* 顾客信息和可入住人数 */}
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-bold text-lg">{displayOrder.guestName}</div>
                </div>
              </div>

              {/* 预订客房 */}
              <div className="flex justify-between items-center border-t border-b py-3 my-3">
                <div>
                  <div className="font-bold">
                    <span className="font-bold text-lg">{displayOrder.roomTypeName}</span> 
                    <span className="font-normal text-sm ml-2"> {displayOrder.totalRooms} 间</span>
                    <span className="font-normal text-gray-500 ml-2">&lt;{displayOrder.packageName || '无早'}&gt;</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="mb-1">
                    <span className="font-normal text-sm ml-2">入住日期:</span>
                    <span className="font-bold text-lg ml-1"> {displayOrder.checkInDateActual}</span>
                    <span className="font-normal text-sm ml-6">离店日期:</span>
                    <span className="font-bold text-lg ml-1">{displayOrder.checkOutDateActual}</span>
                    <span className="font-normal text-sm ml-4"> 共 {displayOrder.stayDays} 晚</span>
                  </div>
                </div>
              </div>

              
              <div className="flex justify-between items-center border-t border-b py-3 my-3">
                <div>
                  <div className="font-normal">
                    <span className="font-normal text-sm">{displayOrder.rateCodeName}</span> 
                </div>
                </div>
                <div>
                  <div className="font-normal">
                    <span className="font-normal text-sm ml-2">{displayOrder.rateCode}</span>
                  </div>
                </div>
              </div>

              {/* 订单总价和结算价 */}
              <div className="flex justify-between items-center mt-6 gap-8">
                <div className="flex items-center gap-4">
                  <div className="font-semibold text-gray-700">渠道总价</div>
                  <div className="px-3 py-1 rounded text-xl font-bold bg-yellow-100 text-gray-700">¥{displayOrder.totalPriceChannelActual?.toFixed(2) || '0.00'}</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="font-semibold text-gray-700">酒店总价</div>
                  <div className="px-3 py-1 rounded text-xl font-bold bg-green-100 text-gray-600">¥{displayOrder.totalPriceHotelActual?.toFixed(2) || '0.00'}</div>
                </div>
              </div>

              {/* 间夜明细 Panel */}
              <div className="mt-8 bg-gray-50 rounded shadow">
                <div
                  className="px-4 py-2 border-b font-bold text-gray-700 bg-gray-100 rounded-t flex items-center cursor-pointer select-none"
                  onClick={() => setShowDetail(v => !v)}
                >
                  <span className="mr-2">{showDetail ? <CaretDownOutlined /> : <CaretRightOutlined />}</span>
                  间夜明细
                </div>
                {showDetail && (
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-4 py-2 font-medium text-gray-700">在住日期</th>
                        <th className="px-4 py-2 font-medium text-gray-700">渠道每日房价</th>
                        <th className="px-4 py-2 font-medium text-gray-700">酒店每日房价</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrderDetail?.dailyDetails?.map((detail, idx) => (
                        <tr key={detail.stayDate} className="bg-white">
                          <td className="px-4 py-2">{detail.stayDate}</td>
                          <td className="px-4 py-2 text-blue-600">¥{detail.priceChannelActual?.toFixed(2) || '0.00'}</td>
                          <td className="px-4 py-2 text-green-600">¥{detail.priceHotelActual?.toFixed(2) || '0.00'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* 客人要求 Panel */}
              <div className="mt-8 bg-gray-50 rounded shadow">
                <div
                  className="px-4 py-2 border-b font-bold text-gray-700 bg-gray-100 rounded-t flex items-center cursor-pointer select-none"
                  onClick={() => setShowGuestRequirements(v => !v)}
                >
                  <span className="mr-2">{showGuestRequirements ? <CaretDownOutlined /> : <CaretRightOutlined />}</span>
                  客人要求
                </div>
                {showGuestRequirements && (
                  <div className="p-4 space-y-3 text-gray-700 text-sm">
                    <div>
                      <div className="font-semibold mb-2">渠道备注</div>
                      <div className="pl-4 space-y-2">
                        <div>{displayOrder.remarkChannel || '无内容'}</div>
                      </div>
                    </div>
                    <div>
                      <div className="font-semibold mb-2">特殊要求</div>
                      <div className="pl-4 space-y-2">
                        <div>{displayOrder.remarkSpecial || '无特殊要求'}</div>
                      </div>
                    </div>
                    <div>
                      <div className="font-semibold mb-2">发票要求</div>
                      <div className="pl-4 space-y-2">
                        <div>{displayOrder.remarkInvoice || '无发票要求'}</div>
                      </div>
                    </div>                    
                    <div>
                      <div className="font-semibold mb-2">客人权益</div>
                      <div className="pl-4 space-y-2">
                        {displayOrder.paymentType === 'UNPAID' && (
                          <div>房间最晚保留到 {displayOrder.orderRetentionTime || '18:00'}</div>
                        )}
                        <div>{displayOrder.remarkGuest || ''}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 订单提示 Panel */}
              <div className="mt-8 bg-gray-50 rounded shadow">
                <div
                  className="px-4 py-2 border-b font-bold text-gray-700 bg-gray-100 rounded-t flex items-center cursor-pointer select-none"
                  onClick={() => setShowOrderTips(v => !v)}
                >
                  <span className="mr-2">{showOrderTips ? <CaretDownOutlined /> : <CaretRightOutlined />}</span>
                  订单提示
                </div>
                {showOrderTips && (
                  <div className="p-4 space-y-4 text-gray-700 text-sm">
                    <div>
                      <div className="font-semibold mb-2">预订类型</div>
                      <div className="pl-4 space-y-2">
                                                 <div>{getReservationTypeText(displayOrder.reservationType)}订单，{displayOrder.paymentType === 'PAID' ? '客人已支付房费，请贵酒店务必保留房间' : '客人到店支付房费'}</div>
                      </div>
                    </div>
                    <div>
                      <div className="font-semibold mb-2">取消政策</div>
                      <div className="pl-4 space-y-2">
                        <div>{getCancellationPolicyText(displayOrder.cancellationType, displayOrder.checkInDate, displayOrder.latestCancellationDays, displayOrder.latestCancellationTime)}</div>
                      </div>
                    </div>
                    <div>
                      <div className="font-semibold mb-2">未入住</div>
                      <div className="pl-4 space-y-2">
                        <div>如果客人未入住，将根据取消政策进行扣除。</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 确认结果 Panel */}
              <div className="mt-8 bg-gray-50 rounded shadow">
                <div
                  className="px-4 py-2 border-b font-bold text-gray-700 bg-gray-100 rounded-t flex items-center cursor-pointer select-none"
                  onClick={() => setShowConfirmationResult(v => !v)}
                >
                  <span className="mr-2">{showConfirmationResult ? <CaretDownOutlined /> : <CaretRightOutlined />}</span>
                  确认结果
                </div>
                {showConfirmationResult && (
                  <div className="p-4">
                    <table className="w-full text-sm">
                      <tbody>
                        <tr className="border-b">
                          <td className="py-3 font-medium text-gray-700 w-32">酒店确认号</td>
                          <td className="py-3">
                            <div className="flex items-center gap-2">
                              <span>{displayOrder.hotelResvConfirm || confirmNumber || '未确认'}</span>
                              <button
                                onClick={() => setShowConfirmNumberModal(true)}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3 font-medium text-gray-700">确认备注</td>
                          <td className="py-3">{displayOrder.remarkHotel || '无'}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* 订单日志 Panel */}
              <div className="mt-8 bg-gray-50 rounded shadow">
                <div
                  className="px-4 py-2 border-b font-bold text-gray-700 bg-gray-100 rounded-t flex items-center cursor-pointer select-none"
                  onClick={() => setShowOrderLog(v => !v)}
                >
                  <span className="mr-2">{showOrderLog ? <CaretDownOutlined /> : <CaretRightOutlined />}</span>
                  订单日志
                </div>
                {showOrderLog && (
                  <div className="p-4">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 font-medium text-gray-700 w-48">操作时间</th>
                          <th className="text-left py-2 font-medium text-gray-700 w-32">操作人</th>
                          <th className="text-left py-2 font-medium text-gray-700">操作类型</th>
                          <th className="text-left py-2 font-medium text-gray-700 w-32">操作</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrderDetail?.logs?.map((log, index) => (
                          <tr key={log.bookingLogId} className="border-b last:border-b-0">
                            <td className="py-3 text-gray-600">{log.operateTime?.replace('T', ' ')}</td>
                            <td className="py-3 text-gray-600">{log.operatorName}</td>
                            <td className="py-3 text-gray-600">{log.operation}</td>
                            <td className="py-3 text-gray-600">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => {
                                    setSelectedLogData(log.changeSummary);
                                    setShowChangeModal(true);
                                  }}
                                  className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                                >
                                  改变
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedLogData(log.bookingSnapshot);
                                    setSnapshotActiveTab('detail');
                                    setShowSnapshotModal(true);
                                  }}
                                  className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
                                >
                                  快照
                                </button>
                              </div>
                            </td>
                          </tr>
                        )) || mockOrderLogs.map((log, index) => (
                          <tr key={index} className="border-b last:border-b-0">
                            <td className="py-3 text-gray-600">{log.time}</td>
                            <td className="py-3 text-gray-600">{log.operator}</td>
                            <td className="py-3 text-gray-600">{log.content}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* 修改价格按钮 */}
              <div className="mt-8 flex justify-start">
                <button
                  onClick={handleOpenPriceModal}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  修改价格
                </button>
              </div>

              {/* 确认号编辑弹窗 */}
              {showConfirmNumberModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 w-96">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">编辑酒店确认号</h3>
                      <button
                        onClick={() => setShowConfirmNumberModal(false)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                    <div className="mb-4">
                      <input
                        type="text"
                        value={confirmNumber}
                        onChange={(e) => setConfirmNumber(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="请输入酒店确认号"
                      />
                      <p className="mt-2 text-sm text-gray-500">
                        酒店确认号只能输入数字或字母，如有多个用逗号分割
                      </p>
                      
                      {/* 消息提示 */}
                      {confirmMessage && (
                        <div className={`mt-3 p-3 rounded-lg text-sm ${
                          confirmMessage.type === 'success' 
                            ? 'bg-green-50 text-green-700 border border-green-200' 
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                          {confirmMessage.text}
                        </div>
                      )}
                    </div>
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => setShowConfirmNumberModal(false)}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                      >
                        返回
                      </button>
                      <button
                        onClick={async () => {
                          if (confirmLoading) return;
                          
                          // 清除之前的消息
                          setConfirmMessage(null);
                          
                          const success = await saveHotelConfirmNumber(selectedOrderId, confirmNumber);
                          if (success) {
                            setShowConfirmNumberModal(false);
                            setConfirmNumber('');
                            // 3秒后清除成功消息
                            setTimeout(() => setConfirmMessage(null), 3000);
                          }
                        }}
                        disabled={confirmLoading}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          confirmLoading 
                            ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {confirmLoading ? '保存中...' : '保存'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 改变详情弹窗 */}
              {showChangeModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 w-4/5 max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">改变详情</h3>
                      <button
                        onClick={() => {
                          setShowChangeModal(false);
                          setSelectedLogData(null);
                        }}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                    
                    {/* 页签导航 */}
                    <div className="flex border-b mb-4">
                      <button
                        onClick={() => setChangeActiveTab('change')}
                        className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                          changeActiveTab === 'change'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        改变
                      </button>
                      <button
                        onClick={() => setChangeActiveTab('json')}
                        className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                          changeActiveTab === 'json'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        报文
                      </button>
                    </div>
                    
                    <div className="flex-1 overflow-auto">
                      {selectedLogData ? (
                        <>
                          {/* 改变页签内容 */}
                          {changeActiveTab === 'change' && (
                            <div className="space-y-6">
                              {(() => {
                                const changeData = parseChangeData(selectedLogData);
                                const groupedData = changeData.reduce((acc, item) => {
                                  if (!acc[item.category]) {
                                    acc[item.category] = [];
                                  }
                                  acc[item.category].push(item);
                                  return acc;
                                }, {} as Record<string, typeof changeData>);

                                return Object.entries(groupedData).map(([category, items]) => (
                                  <div key={category} className="bg-gray-50 rounded-lg p-4">
                                    <h4 className="font-semibold text-gray-800 mb-3 border-b pb-2">{category}</h4>
                                    <div className="overflow-x-auto">
                                      <table className="w-full text-sm">
                                        <thead>
                                          <tr className="bg-gray-100">
                                            <th className="px-3 py-2 text-left font-medium text-gray-700">字段名称</th>
                                            <th className="px-3 py-2 text-left font-medium text-gray-700">修改前</th>
                                            <th className="px-3 py-2 text-left font-medium text-gray-700">修改后</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {items.map((item, index) => (
                                            <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                                              <td className="px-3 py-2 text-gray-700 font-medium">{item.fieldName}</td>
                                              <td className="px-3 py-2 text-gray-600">
                                                <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">
                                                  {item.beforeValue !== null && item.beforeValue !== undefined 
                                                    ? String(item.beforeValue) 
                                                    : '无'}
                                                </span>
                                              </td>
                                              <td className="px-3 py-2 text-gray-600">
                                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                                                  {item.afterValue !== null && item.afterValue !== undefined 
                                                    ? String(item.afterValue) 
                                                    : '无'}
                                                </span>
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                ));
                              })()}
                            </div>
                          )}

                          {/* 报文页签内容 */}
                          {changeActiveTab === 'json' && (
                            <div className="bg-gray-50 rounded-lg p-4 h-full">
                              <pre className="text-sm text-gray-700 bg-white p-4 rounded border overflow-auto h-full font-mono">
                                {JSON.stringify(selectedLogData, null, 2)}
                              </pre>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="text-center text-gray-500 py-8">无改变数据</div>
                      )}
                    </div>
                    
                    <div className="flex justify-end mt-4">
                      <button
                        onClick={() => {
                          setShowChangeModal(false);
                          setSelectedLogData(null);
                        }}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                      >
                        关闭
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 快照详情弹窗 */}
              {showSnapshotModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 w-4/5 max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">快照详情</h3>
                      <button
                        onClick={() => {
                          setShowSnapshotModal(false);
                          setSelectedLogData(null);
                        }}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                    
                    {/* 页签导航 */}
                    <div className="flex border-b mb-4">
                      <button
                        onClick={() => setSnapshotActiveTab('detail')}
                        className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                          snapshotActiveTab === 'detail'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        详情
                      </button>
                      <button
                        onClick={() => setSnapshotActiveTab('json')}
                        className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                          snapshotActiveTab === 'json'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        报文
                      </button>
                    </div>
                    
                    <div className="flex-1 overflow-auto">
                      {selectedLogData ? (
                        <>
                          {/* 详情页签内容 */}
                          {snapshotActiveTab === 'detail' && (
                            <div className="space-y-6">
                              {(() => {
                                const parsedData = parseSnapshotData(selectedLogData);
                                const groupedData = parsedData.reduce((acc, item) => {
                                  if (!acc[item.category]) {
                                    acc[item.category] = [];
                                  }
                                  acc[item.category].push(item);
                                  return acc;
                                }, {} as Record<string, typeof parsedData>);

                                return Object.entries(groupedData).map(([category, items]) => (
                                  <div key={category} className="bg-gray-50 rounded-lg p-4">
                                    <h4 className="font-semibold text-gray-800 mb-3 border-b pb-2">{category}</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                      {items.map((item, index) => (
                                        <div key={index} className="bg-white p-3 rounded border">
                                          <div className="text-sm font-medium text-gray-600 mb-1">{item.key}</div>
                                          <div className="text-sm text-gray-800 break-words">
                                            {typeof item.value === 'string' && item.value.length > 50 
                                              ? `${item.value.substring(0, 50)}...` 
                                              : item.value}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ));
                              })()}
                              
                              {/* 日明细信息 */}
                              {selectedLogData.dailyDetails && selectedLogData.dailyDetails.length > 0 && (
                                <div className="bg-gray-50 rounded-lg p-4">
                                  <h4 className="font-semibold text-gray-800 mb-3 border-b pb-2">每日明细</h4>
                                  <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                      <thead>
                                        <tr className="bg-gray-100">
                                          <th className="px-3 py-2 text-left font-medium text-gray-700">入住日期</th>
                                          <th className="px-3 py-2 text-left font-medium text-gray-700">渠道价格</th>
                                          <th className="px-3 py-2 text-left font-medium text-gray-700">酒店价格</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {selectedLogData.dailyDetails.map((detail: any, index: number) => (
                                          <tr key={index} className="bg-white border-b">
                                            <td className="px-3 py-2">{detail.stayDate}</td>
                                            <td className="px-3 py-2">¥{detail.priceChannelActual}</td>
                                            <td className="px-3 py-2">¥{detail.priceHotelActual}</td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                          
                          {/* 报文页签内容 */}
                          {snapshotActiveTab === 'json' && (
                            <div className="bg-gray-50 rounded-lg p-4 h-full">
                              <pre className="text-sm text-gray-700 bg-white p-4 rounded border overflow-auto h-full font-mono">
                                {JSON.stringify(selectedLogData, null, 2)}
                              </pre>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="text-center text-gray-500 py-8">无快照数据</div>
                      )}
                    </div>
                    <div className="flex justify-end mt-4">
                      <button
                        onClick={() => {
                          setShowSnapshotModal(false);
                          setSelectedLogData(null);
                        }}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                      >
                        关闭
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 修改价格弹窗 */}
              {showPriceModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 w-4/5 max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">修改价格</h3>
                      <button
                        onClick={() => setShowPriceModal(false)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="flex-1 overflow-auto">
                      {discontinuousDateIndexes.length > 0 && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <div className="text-red-700 text-sm">⚠️ 入住日期不连续，请检查后再次提交。</div>
                        </div>
                      )}
                      <table className="w-full text-sm border-collapse">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="px-4 py-2 border text-left font-medium text-gray-700">日期</th>
                            <th className="px-4 py-2 border text-left font-medium text-gray-700">渠道价格</th>
                            <th className="px-4 py-2 border text-left font-medium text-gray-700">酒店价格</th>
                            <th className="px-4 py-2 border text-left font-medium text-gray-700">操作</th>
                            <th className="px-4 py-2 border text-left font-medium text-gray-700">保存结果</th>
                          </tr>
                        </thead>
                        <tbody>
                          {priceTableData.map((row, index) => (
                            <tr key={row.id} className={`${row.isNew ? 'bg-yellow-50' : 'bg-white'}`}>
                              <td className="px-4 py-2 border">
                                {row.isNew ? (
                                  <DatePicker
                                    value={row.stayDate ? dayjs(row.stayDate) : null}
                                    onChange={(date) => handleUpdatePriceTableData(index, 'stayDate', date ? date.format('YYYY-MM-DD') : '')}
                                    style={{ 
                                      width: '100%',
                                      borderColor: discontinuousDateIndexes.includes(index) ? '#ff4d4f' : undefined
                                    }}
                                    size="large"
                                    status={discontinuousDateIndexes.includes(index) ? 'error' : undefined}
                                  />
                                ) : (
                                  <span className={discontinuousDateIndexes.includes(index) ? 'text-red-500' : ''}>
                                    {row.stayDate}
                                  </span>
                                )}
                              </td>
                              <td className="px-4 py-2 border">
                                <Input
                                  type="number"
                                  value={row.priceChannelActual}
                                  onChange={(e) => handleUpdatePriceTableData(index, 'priceChannelActual', parseFloat(e.target.value) || 0)}
                                  style={{ width: '100%' }}
                                  size="large"
                                  step="0.01"
                                  min="0"
                                />
                              </td>
                              <td className="px-4 py-2 border">
                                <Input
                                  type="number"
                                  value={row.priceHotelActual}
                                  onChange={(e) => handleUpdatePriceTableData(index, 'priceHotelActual', parseFloat(e.target.value) || 0)}
                                  style={{ width: '100%' }}
                                  size="large"
                                  step="0.01"
                                  min="0"
                                />
                              </td>
                              <td className="px-4 py-2 border">
                                <Select
                                  value={row.action}
                                  onChange={(value) => handleUpdatePriceTableData(index, 'action', value)}
                                  style={{ width: '100%' }}
                                  size="large"
                                  options={row.isNew ? [
                                    { value: 'ADD', label: '新增' },
                                  ] : [
                                    { value: 'NOCHANGE', label: '不改变' },
                                    { value: 'CHANGEPRICE', label: '改价' },
                                    { value: 'CANCEL', label: '取消' },
                                  ]}
                                />
                              </td>
                              <td className="px-4 py-2 border">
                                {saveResults[row.id] ? (
                                  <div className={`flex items-center gap-2 ${
                                    saveResults[row.id].status === 'success' ? 'text-green-600' :
                                    saveResults[row.id].status === 'error' ? 'text-red-600' :
                                    'text-blue-600'
                                  }`}>
                                    {saveResults[row.id].status === 'success' && (
                                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                      </svg>
                                    )}
                                    {saveResults[row.id].status === 'error' && (
                                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                      </svg>
                                    )}
                                    {saveResults[row.id].status === 'pending' && (
                                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                                    )}
                                    <span className="text-sm">{saveResults[row.id].message}</span>
                                  </div>
                                ) : (
                                  <span className="text-gray-400 text-sm">未保存</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="flex justify-between items-center mt-4 pt-4 border-t">
                      <div className="flex gap-2">
                        <Button
                          type="primary"
                          onClick={handleAddEarlyArrival}
                          style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                        >
                          早到
                        </Button>
                        <Button
                          type="primary"
                          onClick={handleAddExtendedStay}
                        >
                          延住
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={async () => {
                            setShowPriceModal(false);
                            // 关闭窗口时刷新订单详情
                            if (displayOrder?.bookingId) {
                              await fetchOrderDetail(displayOrder.bookingId);
                            }
                          }}
                        >
                          返回
                        </Button>
                        <Button
                          type="primary"
                          onClick={handleSavePriceChanges}
                          loading={priceLoading}
                          disabled={discontinuousDateIndexes.length > 0}
                        >
                          保存
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-gray-400 mt-20">请选择左侧订单查看详情</div>
          )}
        </div>
      </div>
    </div>
    </TokenCheck>
    </ConfigProvider>
  );
};

export default ReservationList; 