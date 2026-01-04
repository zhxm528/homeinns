import React, { useState, useEffect, useContext } from 'react';
import { FaSearch, FaChevronDown, FaChevronUp, FaChevronLeft, FaChevronRight, FaFileAlt, FaPaperPlane, FaDownload } from 'react-icons/fa';
import { TabContext } from '../../App';
import HotelSelect from '../../components/common/HotelSelect';
import request from '../../utils/request';
import { message, DatePicker, Input, Button, Tooltip, Modal, Table, Checkbox, Form, InputNumber, Upload, Select } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import dayjs from 'dayjs';
import TokenCheck from '@/components/common/TokenCheck';

const { RangePicker } = DatePicker;

interface CheckingRecord {
  checkingId: string;
  chainId: string;
  hotelId: string;
  hotelCode: string;
  hotelName: string;
  crsOrderNo: string;
  pmsOrderNo: string;
  thirdPartyOrderNo: string;
  checkInDate: string;
  checkOutDate: string;
  actualCheckInDate: string;
  actualCheckOutDate: string;
  orderStatus: 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled';
  roomCount: number;
  nightCount: number;
  bookingAmount: number;
  hotelAmount: number;
  settlementAmount: number;
  settlementMethod: string;
  bookerName: string;
  guestName: string;
  difference: number;
  createdAt: number;
  updatedAt: number | null;
}

interface SearchParams {
  hotelId: string;
  dateRange: [string, string] | null;
  pmsOrderNo: string;
  crsOrderNo: string;
  thirdPartyOrderNo: string;
  showDifferenceOnly: boolean;
  guestName: string;
  orderStatus: string;
  guest: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: CheckingRecord[];
  total?: number;
  current?: number;
  pageSize?: number;
}

interface AdjustmentLog {
  id: string;
  adjustmentDate: string;
  adjuster: string;
  beforeAmount: number;
  afterAmount: number;
  difference: number;
  description: string;
  voucherUrl: string;
}

interface PushLog {
  id: string;
  pushTime: string;
  orderCompany: string;
  settlementCompany: string;
  settlementMethod: string;
  pushAmount: number;
  pushResult: 'success' | 'failed';
  errorMessage?: string;
}

// 格式化金额：千分位，去掉末尾的0
const formatAmount = (amount: number): string => {
  // 先转换为保留2位小数的字符串
  const formatted = amount.toFixed(2);
  // 去掉末尾的0
  const trimmed = formatted.replace(/\.?0+$/, '');
  // 添加千分位
  return trimmed.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const HotelChecking: React.FC = () => {
  const tabContext = useContext(TabContext);
  
  const [records, setRecords] = useState<CheckingRecord[]>([]);
  const [isSearchPanelOpen, setIsSearchPanelOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const itemsPerPage = 10;
  const [searchParams, setSearchParams] = useState<SearchParams>({
    hotelId: '',
    dateRange: null,
    pmsOrderNo: '',
    crsOrderNo: '',
    thirdPartyOrderNo: '',
    showDifferenceOnly: true,
    guestName: '',
    orderStatus: '',
    guest: ''
  });
  const [isAdjustmentLogVisible, setIsAdjustmentLogVisible] = useState(false);
  const [currentCheckingId, setCurrentCheckingId] = useState<string>('');
  const [adjustmentLogs, setAdjustmentLogs] = useState<AdjustmentLog[]>([]);
  const [isPushLogVisible, setIsPushLogVisible] = useState(false);
  const [pushLogs, setPushLogs] = useState<PushLog[]>([]);
  const [pushLogLoading, setPushLogLoading] = useState(false);
  const [currentOrderInfo, setCurrentOrderInfo] = useState<{
    pmsOrderNo: string;
    crsOrderNo: string;
    thirdPartyOrderNo: string;
  } | null>(null);
  const [adjustmentForm] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  // 模拟数据
  const mockData: CheckingRecord[] = [
    {
      checkingId: '1',
      chainId: '1',
      hotelId: '1',
      hotelCode: 'JG0001',
      hotelName: '建国酒店001',
      crsOrderNo: 'CRS202403150001',
      pmsOrderNo: 'PMS202403150001',
      thirdPartyOrderNo: 'TP202403150001',
      checkInDate: '2024-03-15',
      checkOutDate: '2024-03-16',
      actualCheckInDate: '2024-03-15',
      actualCheckOutDate: '2024-03-16',
      orderStatus: 'checked_out',
      roomCount: 2,
      nightCount: 1,
      bookingAmount: 1200.00,
      hotelAmount: 1000.00,
      settlementAmount: 1000.00,
      settlementMethod: '月结',
      bookerName: '张三',
      guestName: '李四',
      difference: 200.00,
      createdAt: Date.now(),
      updatedAt: null
    },
    {
      checkingId: '2',
      chainId: '1',
      hotelId: '2',
      hotelCode: 'JG0002',
      hotelName: '建国酒店002',
      crsOrderNo: 'CRS202403150002',
      pmsOrderNo: 'PMS202403150002',
      thirdPartyOrderNo: 'TP202403150002',
      checkInDate: '2024-03-15',
      checkOutDate: '2024-03-17',
      actualCheckInDate: '2024-03-15',
      actualCheckOutDate: '2024-03-17',
      orderStatus: 'checked_out',
      roomCount: 1,
      nightCount: 2,
      bookingAmount: 2800.00,
      hotelAmount: 2600.00,
      settlementAmount: 2600.00,
      settlementMethod: '预存',
      bookerName: '王五',
      guestName: '赵六',
      difference: 200.00,
      createdAt: Date.now(),
      updatedAt: null
    },
    {
      checkingId: '3',
      chainId: '1',
      hotelId: '3',
      hotelCode: 'JG0003',
      hotelName: '建国酒店003',
      crsOrderNo: 'CRS202403150003',
      pmsOrderNo: 'PMS202403150003',
      thirdPartyOrderNo: 'TP202403150003',
      checkInDate: '2024-03-16',
      checkOutDate: '2024-03-18',
      actualCheckInDate: '2024-03-16',
      actualCheckOutDate: '2024-03-18',
      orderStatus: 'checked_out',
      roomCount: 3,
      nightCount: 2,
      bookingAmount: 1500.00,
      hotelAmount: 1600.00,
      settlementAmount: 1600.00,
      settlementMethod: '月结',
      bookerName: '钱七',
      guestName: '孙八',
      difference: 100,
      createdAt: Date.now(),
      updatedAt: null
    },
    {
      checkingId: '4',
      chainId: '1',
      hotelId: '4',
      hotelCode: 'JG0004',
      hotelName: '建国酒店004',
      crsOrderNo: 'CRS202403150004',
      pmsOrderNo: 'PMS202403150004',
      thirdPartyOrderNo: 'TP202403150004',
      checkInDate: '2024-03-16',
      checkOutDate: '2024-03-17',
      actualCheckInDate: '2024-03-16',
      actualCheckOutDate: '2024-03-17',
      orderStatus: 'checked_out',
      roomCount: 1,
      nightCount: 1,
      bookingAmount: 1500.00,
      hotelAmount: 1600.00,
      settlementAmount: 1600.00,
      settlementMethod: '预存',
      bookerName: '周九',
      guestName: '吴十',
      difference: -100.00,
      createdAt: Date.now(),
      updatedAt: null
    },
    {
      checkingId: '5',
      chainId: '1',
      hotelId: '5',
      hotelCode: 'JG0005',
      hotelName: '建国酒店005',
      crsOrderNo: 'CRS202403150005',
      pmsOrderNo: 'PMS202403150005',
      thirdPartyOrderNo: 'TP202403150005',
      checkInDate: '2024-03-17',
      checkOutDate: '2024-03-19',
      actualCheckInDate: '2024-03-17',
      actualCheckOutDate: '2024-03-19',
      orderStatus: 'checked_out',
      roomCount: 2,
      nightCount: 2,
      bookingAmount: 1500.00,
      hotelAmount: 1600.00,
      settlementAmount: 1600.00,
      settlementMethod: '预存',
      bookerName: '周九',
      guestName: '吴十',
      difference: -100.00,
      createdAt: Date.now(),
      updatedAt: null
    },
    {
      checkingId: '6',
      chainId: '1',
      hotelId: '6',
      hotelCode: 'JG0006',
      hotelName: '建国酒店006',
      crsOrderNo: 'CRS202403150006',
      pmsOrderNo: 'PMS202403150006',
      thirdPartyOrderNo: 'TP202403150006',
      checkInDate: '2024-03-17',
      checkOutDate: '2024-03-18',
      actualCheckInDate: '2024-03-17',
      actualCheckOutDate: '2024-03-18',
      orderStatus: 'checked_out',
      roomCount: 1,
      nightCount: 1,
      bookingAmount: 1500.00,
      hotelAmount: 1600.00,
      settlementAmount: 1600.00,
      settlementMethod: '预存',
      bookerName: '周九',
      guestName: '吴十',
      difference: -100.00,
      createdAt: Date.now(),
      updatedAt: null
    },
    {
      checkingId: '7',
      chainId: '1',
      hotelId: '7',
      hotelCode: 'JG0007',
      hotelName: '建国酒店007',
      crsOrderNo: 'CRS202403150007',
      pmsOrderNo: 'PMS202403150007',
      thirdPartyOrderNo: 'TP202403150007',
      checkInDate: '2024-03-18',
      checkOutDate: '2024-03-20',
      actualCheckInDate: '2024-03-18',
      actualCheckOutDate: '2024-03-20',
      orderStatus: 'checked_out',
      roomCount: 2,
      nightCount: 2,
      bookingAmount: 3600.00,
      hotelAmount: 3800.00,
      settlementAmount: 3800.00,
      settlementMethod: '月结',
      bookerName: '刘十五',
      guestName: '陈十六',
      difference: -200.00,
      createdAt: Date.now(),
      updatedAt: null
    },
    {
      checkingId: '8',
      chainId: '1',
      hotelId: '8',
      hotelCode: 'JG0008',
      hotelName: '建国酒店008',
      crsOrderNo: 'CRS202403150008',
      pmsOrderNo: 'PMS202403150008',
      thirdPartyOrderNo: 'TP202403150008',
      checkInDate: '2024-03-18',
      checkOutDate: '2024-03-19',
      actualCheckInDate: '2024-03-18',
      actualCheckOutDate: '2024-03-19',
      orderStatus: 'checked_out',
      roomCount: 1,
      nightCount: 1,
      bookingAmount: 1600.00,
      hotelAmount: 1600.00,
      settlementAmount: 1600.00,
      settlementMethod: '预存',
      bookerName: '杨十七',
      guestName: '黄十八',
      difference: 0,
      createdAt: Date.now(),
      updatedAt: null
    },
    {
      checkingId: '9',
      chainId: '1',
      hotelId: '9',
      hotelCode: 'JG0009',
      hotelName: '建国酒店009',
      crsOrderNo: 'CRS202403150009',
      pmsOrderNo: 'PMS202403150009',
      thirdPartyOrderNo: 'TP202403150009',
      checkInDate: '2024-03-19',
      checkOutDate: '2024-03-21',
      actualCheckInDate: '2024-03-19',
      actualCheckOutDate: '2024-03-21',
      orderStatus: 'checked_out',
      roomCount: 2,
      nightCount: 2,
      bookingAmount: 4200.00,
      hotelAmount: 4200.00,
      settlementAmount: 4200.00,
      settlementMethod: '月结',
      bookerName: '赵十九',
      guestName: '钱二十',
      difference: 0,
      createdAt: Date.now(),
      updatedAt: null
    },
    {
      checkingId: '10',
      chainId: '1',
      hotelId: '10',
      hotelCode: 'JG0010',
      hotelName: '建国酒店010',
      crsOrderNo: 'CRS202403150010',
      pmsOrderNo: 'PMS202403150010',
      thirdPartyOrderNo: 'TP202403150010',
      checkInDate: '2024-03-19',
      checkOutDate: '2024-03-20',
      actualCheckInDate: '2024-03-19',
      actualCheckOutDate: '2024-03-20',
      orderStatus: 'checked_out',
      roomCount: 1,
      nightCount: 1,
      bookingAmount: 1400.00,
      hotelAmount: 1400.00,
      settlementAmount: 1400.00,
      settlementMethod: '预存',
      bookerName: '孙二一',
      guestName: '李二二',
      difference: 0,
      createdAt: Date.now(),
      updatedAt: null
    },
    {
      checkingId: '11',
      chainId: '1',
      hotelId: '11',
      hotelCode: 'JG0011',
      hotelName: '建国酒店011',
      crsOrderNo: 'CRS202403150011',
      pmsOrderNo: 'PMS202403150011',
      thirdPartyOrderNo: 'TP202403150011',
      checkInDate: '2024-03-20',
      checkOutDate: '2024-03-22',
      actualCheckInDate: '2024-03-20',
      actualCheckOutDate: '2024-03-22',
      orderStatus: 'checked_out',
      roomCount: 2,
      nightCount: 2,
      bookingAmount: 4600.00,
      hotelAmount: 4600.00,
      settlementAmount: 4600.00,
      settlementMethod: '月结',
      bookerName: '周二三',
      guestName: '吴二四',
      difference: 0,
      createdAt: Date.now(),
      updatedAt: null
    },
    {
      checkingId: '12',
      chainId: '1',
      hotelId: '12',
      hotelCode: 'JG0012',
      hotelName: '建国酒店012',
      crsOrderNo: 'CRS202403150012',
      pmsOrderNo: 'PMS202403150012',
      thirdPartyOrderNo: 'TP202403150012',
      checkInDate: '2024-03-20',
      checkOutDate: '2024-03-21',
      actualCheckInDate: '2024-03-20',
      actualCheckOutDate: '2024-03-21',
      orderStatus: 'checked_out',
      roomCount: 1,
      nightCount: 1,
      bookingAmount: 1300.00,
      hotelAmount: 1300.00,
      settlementAmount: 1300.00,
      settlementMethod: '预存',
      bookerName: '郑二五',
      guestName: '王二六',
      difference: 0,
      createdAt: Date.now(),
      updatedAt: null
    }
  ];

  // 模拟调账日志数据
  const mockAdjustmentLogs: AdjustmentLog[] = [
    {
      id: '1',
      adjustmentDate: '2024-03-15 14:30:00',
      adjuster: '张三',
      beforeAmount: 1200.00,
      afterAmount: 1100.00,
      difference: -100.00,
      description: '酒店反馈实际房费有优惠',
      voucherUrl: '/api/vouchers/1.pdf'
    },
    {
      id: '2',
      adjustmentDate: '2024-03-15 15:45:00',
      adjuster: '李四',
      beforeAmount: 1100.00,
      afterAmount: 1100.00,
      difference: 0,
      description: '确认最终金额',
      voucherUrl: '/api/vouchers/2.pdf'
    }
  ];

  // 模拟推送日志数据
  const mockPushLogs: PushLog[] = [
    {
      id: '1',
      pushTime: '2024-03-15 14:30:00',
      orderCompany: '携程商旅 8801234564',
      settlementCompany: '国家电网 8805432134',
      settlementMethod: '月结',
      pushAmount: 1200.00,
      pushResult: 'success'
    },
    {
      id: '2',
      pushTime: '2024-03-15 15:45:00',
      orderCompany: '阿里商旅 8806789032',
      settlementCompany: '平安保险 8808273642',
      settlementMethod: '预存',
      pushAmount: 2800.00,
      pushResult: 'failed',
      errorMessage: '网络超时，请重试'
    }
  ];

  const fetchRecords = async (params: SearchParams, page: number) => {
    try {
      setLoading(true);
      const userInfo = JSON.parse(localStorage.getItem('user') || '{}');
      
      const requestBody = {
        chainId: userInfo.chainId,
        hotelId: params.hotelId || null,
        startDate: params.dateRange?.[0] || null,
        endDate: params.dateRange?.[1] || null,
        pmsOrderNo: params.pmsOrderNo || null,
        crsOrderNo: params.crsOrderNo || null,
        thirdPartyOrderNo: params.thirdPartyOrderNo || null,
        pagination: {
          current: page,
          pageSize: itemsPerPage
        },
        user: {
          userId: userInfo.userId,
          loginName: userInfo.loginName,
          userName: userInfo.userName,
          roleId: userInfo.roleId,
          roleName: userInfo.roleName,
          chainId: userInfo.chainId,
          chainName: userInfo.chainName
        }
      };

      console.log('获取对账记录 - 请求体:', JSON.stringify(requestBody, null, 2));

      const response = await request.post<ApiResponse>('/api/reconcile/hotel/list', requestBody);
      console.log('获取对账记录 - 响应数据:', response.data);

      if (response.data.success) {
        setRecords(response.data.data || []);
        setTotal(response.data.total || response.data.data.length);
        setCurrentPage(response.data.current || 1);
      } else {
        message.error(response.data.message || '获取对账记录失败');
        setRecords([]);
        setTotal(0);
      }
    } catch (error) {
      console.error('获取对账记录失败:', error);
      if (error instanceof Error) {
        console.error('错误类型:', error.name);
        console.error('错误信息:', error.message);
        console.error('错误堆栈:', error.stack);
      }
      message.error('获取对账记录失败');
      setRecords([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 使用模拟数据
    setRecords(mockData);
    setTotal(mockData.length);
  }, []);

  const handleSearchChange = (field: keyof SearchParams, value: any) => {
    setSearchParams(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchRecords(searchParams, 1);
  };

  const handleReset = () => {
    const resetParams = {
      hotelId: '',
      dateRange: null,
      pmsOrderNo: '',
      crsOrderNo: '',
      thirdPartyOrderNo: '',
      showDifferenceOnly: true,
      guestName: '',
      orderStatus: '',
      guest: ''
    };
    setSearchParams(resetParams);
    setCurrentPage(1);
    fetchRecords(resetParams, 1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(total / itemsPerPage);

  const handleViewAdjustmentLog = (checkingId: string) => {
    const record = records.find(r => r.checkingId === checkingId);
    if (record) {
      setCurrentOrderInfo({
        pmsOrderNo: record.pmsOrderNo,
        crsOrderNo: record.crsOrderNo,
        thirdPartyOrderNo: record.thirdPartyOrderNo
      });
    }
    setCurrentCheckingId(checkingId);
    setIsAdjustmentLogVisible(true);
    // 模拟加载数据
    setLoading(true);
    setTimeout(() => {
      setAdjustmentLogs(mockAdjustmentLogs);
      setLoading(false);
    }, 500);
  };

  const handleViewPushLog = (checkingId: string) => {
    const record = records.find(r => r.checkingId === checkingId);
    if (record) {
      setCurrentOrderInfo({
        pmsOrderNo: record.pmsOrderNo,
        crsOrderNo: record.crsOrderNo,
        thirdPartyOrderNo: record.thirdPartyOrderNo
      });
    }
    setCurrentCheckingId(checkingId);
    setIsPushLogVisible(true);
    // 模拟加载数据
    setPushLogLoading(true);
    setTimeout(() => {
      setPushLogs(mockPushLogs);
      setPushLogLoading(false);
    }, 500);
  };

  const handleExport = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('user') || '{}');
      
      const requestBody = {
        chainId: userInfo.chainId,
        hotelId: searchParams.hotelId || null,
        startDate: searchParams.dateRange?.[0] || null,
        endDate: searchParams.dateRange?.[1] || null,
        pmsOrderNo: searchParams.pmsOrderNo || null,
        crsOrderNo: searchParams.crsOrderNo || null,
        thirdPartyOrderNo: searchParams.thirdPartyOrderNo || null,
        user: {
          userId: userInfo.userId,
          loginName: userInfo.loginName,
          userName: userInfo.userName,
          roleId: userInfo.roleId,
          roleName: userInfo.roleName,
          chainId: userInfo.chainId,
          chainName: userInfo.chainName
        }
      };

      const response = await request.post('/api/reconcile/hotel/export', requestBody, {
        responseType: 'blob'
      });

      // 创建下载链接
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `酒店对账订单_${dayjs().format('YYYY-MM-DD_HH-mm-ss')}.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      message.success('导出成功');
    } catch (error) {
      console.error('导出失败:', error);
      message.error('导出失败');
    }
  };

  const handleDownloadVoucher = (url: string) => {
    // 模拟下载凭证
    message.success('开始下载凭证');
  };

  const adjustmentLogColumns = [
    {
      title: '调整日期',
      dataIndex: 'adjustmentDate',
      key: 'adjustmentDate',
      width: 160,
    },
    {
      title: '调账人',
      dataIndex: 'adjuster',
      key: 'adjuster',
      width: 100,
    },
    {
      title: '调账前金额',
      dataIndex: 'beforeAmount',
      key: 'beforeAmount',
      width: 120,
      render: (amount: number) => `¥${formatAmount(amount)}`,
    },
    {
      title: '调账后金额',
      dataIndex: 'afterAmount',
      key: 'afterAmount',
      width: 120,
      render: (amount: number) => `¥${formatAmount(amount)}`,
    },
    {
      title: '差额',
      dataIndex: 'difference',
      key: 'difference',
      width: 120,
      render: (amount: number) => (
        <span className={amount === 0 ? 'text-green-600' : amount > 0 ? 'text-red-600' : 'text-yellow-600'}>
          {amount === 0 ? '无差异' : amount > 0 ? `+${formatAmount(amount)}` : formatAmount(amount)}
        </span>
      ),
    },
    {
      title: '调账说明',
      dataIndex: 'description',
      key: 'description',
      width: 200,
    },
    {
      title: '调账凭证',
      key: 'voucher',
      width: 100,
      render: (_: unknown, record: AdjustmentLog) => (
        <Tooltip title="下载凭证">
          <button
            onClick={() => handleDownloadVoucher(record.voucherUrl)}
            className="text-blue-600 hover:text-blue-900"
          >
            <FaDownload className="w-4 h-4" />
          </button>
        </Tooltip>
      ),
    },
  ];

  const pushLogColumns = [
    {
      title: '推送时间',
      dataIndex: 'pushTime',
      key: 'pushTime',
      width: 160,
    },
    {
      title: '下单公司',
      dataIndex: 'orderCompany',
      key: 'orderCompany',
      width: 150,
    },
    {
      title: '结算公司',
      dataIndex: 'settlementCompany',
      key: 'settlementCompany',
      width: 200,
    },
    {
      title: '结算方式',
      dataIndex: 'settlementMethod',
      key: 'settlementMethod',
      width: 100,
    },
    {
      title: '推送金额',
      dataIndex: 'pushAmount',
      key: 'pushAmount',
      width: 120,
      render: (amount: number) => `¥${formatAmount(amount)}`,
    },
    {
      title: '推送结果',
      dataIndex: 'pushResult',
      key: 'pushResult',
      width: 120,
      render: (result: string, record: PushLog) => (
        <div>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            result === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {result === 'success' ? '成功' : '失败'}
          </span>
          {record.errorMessage && (
            <Tooltip title={record.errorMessage}>
              <span className="ml-1 text-red-500 cursor-help">!</span>
            </Tooltip>
          )}
        </div>
      ),
    },
  ];

  // 订单号信息展示组件
  const OrderInfoDisplay: React.FC = () => (
    <div className="mb-4 p-4 bg-gray-50 rounded-lg">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <span className="text-gray-500">PMS订单号：</span>
          <span className="font-medium">{currentOrderInfo?.pmsOrderNo || '-'}</span>
        </div>
        <div>
          <span className="text-gray-500">CRS订单号：</span>
          <span className="font-medium">{currentOrderInfo?.crsOrderNo || '-'}</span>
        </div>
        <div>
          <span className="text-gray-500">第三方订单号：</span>
          <span className="font-medium">{currentOrderInfo?.thirdPartyOrderNo || '-'}</span>
        </div>
      </div>
    </div>
  );

  const handleAdjustmentSubmit = async (values: any) => {
    try {
      // TODO: 实现调账提交逻辑
      console.log('调账表单数据:', values);
      message.success('调账成功');
      setIsAdjustmentLogVisible(false);
      adjustmentForm.resetFields();
      setFileList([]);
    } catch (error) {
      console.error('调账失败:', error);
      message.error('调账失败');
    }
  };

  return (
    <TokenCheck checkToken={false}>
    <div className="p-6 flex-1 overflow-x-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">酒店对账</h1>
      </div>

      {/* 搜索面板 */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div 
          className="flex items-center justify-between p-4 cursor-pointer"
          onClick={() => setIsSearchPanelOpen(!isSearchPanelOpen)}
        >
          <div className="flex items-center">
            <FaSearch className="mr-2 text-gray-500" />
            <span className="font-medium">搜索条件</span>
          </div>
          {isSearchPanelOpen ? <FaChevronUp /> : <FaChevronDown />}
        </div>

        {isSearchPanelOpen && (
          <div className="p-4 border-t">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">所属酒店</label>
                <HotelSelect
                  value={searchParams.hotelId}
                  onChange={(value) => handleSearchChange('hotelId', value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">对账日期</label>
                <RangePicker
                  className="w-full"
                  size="large"
                  placeholder={['开始日期', '结束日期']}
                  value={searchParams.dateRange ? [
                    dayjs(searchParams.dateRange[0]),
                    dayjs(searchParams.dateRange[1])
                  ] : null}
                  onChange={(dates) => {
                    if (dates) {
                      handleSearchChange('dateRange', [
                        dates[0]?.format('YYYY-MM-DD') || '',
                        dates[1]?.format('YYYY-MM-DD') || ''
                      ]);
                    } else {
                      handleSearchChange('dateRange', null);
                    }
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">PMS订单号</label>
                <Input
                  className="w-full"
                  size="large"
                  placeholder="请输入PMS订单号"
                  value={searchParams.pmsOrderNo}
                  onChange={(e) => handleSearchChange('pmsOrderNo', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CRS订单号</label>
                <Input
                  className="w-full"
                  size="large"
                  placeholder="请输入CRS订单号"
                  value={searchParams.crsOrderNo}
                  onChange={(e) => handleSearchChange('crsOrderNo', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">第三方订单号</label>
                <Input
                  className="w-full"
                  size="large"
                  placeholder="请输入第三方订单号"
                  value={searchParams.thirdPartyOrderNo}
                  onChange={(e) => handleSearchChange('thirdPartyOrderNo', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">预订人</label>
                <Input
                  className="w-full"
                  size="large"
                  placeholder="请输入预订人"
                  value={searchParams.guestName}
                  onChange={(e) => handleSearchChange('guestName', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">入住人</label>
                <Input
                  className="w-full"
                  size="large"
                  placeholder="请输入入住人"
                  value={searchParams.guest}
                  onChange={(e) => handleSearchChange('guest', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">订单状态</label>
                <Select
                  className="w-full"
                  size="large"
                  placeholder="请选择订单状态"
                  value={searchParams.orderStatus}
                  onChange={(value) => handleSearchChange('orderStatus', value)}
                  options={[
                    { value: '预订', label: '预订' },
                    { value: '已入住', label: '已入住' },
                    { value: '已离店', label: '已离店' },
                    { value: '已取消', label: '已取消' }
                  ]}
                />
              </div>
              <div className="flex items-center">
                <Checkbox
                  checked={searchParams.showDifferenceOnly}
                  onChange={(e) => handleSearchChange('showDifferenceOnly', e.target.checked)}
                >
                  仅显示差异单
                </Checkbox>
              </div>
            </div>
            <div className="flex justify-end mt-4 space-x-2">
              <Button
                onClick={handleReset}
                size="large"
              >
                重置
              </Button>
              <Button
                type="primary"
                onClick={handleSearch}
                size="large"
              >
                搜索
              </Button>
              <Button
                type="primary"
                onClick={handleExport}
                size="large"
              >
                导出订单
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* 对账列表 */}
      <div className="bg-white rounded-lg shadow min-w-[1200px]">
        <div className="overflow-x-auto relative" style={{ position: 'relative' }}>
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap min-w-[100px] bg-gray-50 sticky left-0 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">酒店代码</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap min-w-[120px] bg-gray-50 sticky left-[100px] z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">酒店名称</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap min-w-[100px] bg-gray-50 sticky left-[220px] z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">PMS单号</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap min-w-[100px]">CRS单号</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap min-w-[100px]">第三方单号</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap min-w-[100px]">预订房费</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap min-w-[100px]">酒店金额</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap min-w-[100px]">结算金额</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap min-w-[80px]">差异</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap min-w-[100px]">结算方式</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap min-w-[80px]">操作</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap min-w-[100px]">入住日期</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap min-w-[100px]">离店日期</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap min-w-[100px]">实际入住</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap min-w-[100px]">实际离店</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap min-w-[100px]">订单状态</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap min-w-[80px]">房间数</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap min-w-[80px]">间夜</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap min-w-[80px]">预订人</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap min-w-[80px]">入住人</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={15} className="px-6 py-4 text-center text-gray-500">
                        加载中...
                      </td>
                    </tr>
                  ) : records.length === 0 ? (
                    <tr>
                      <td colSpan={15} className="px-6 py-4 text-center text-gray-500">
                        暂无数据
                      </td>
                    </tr>
                  ) : (
                    records.map((record, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 bg-white sticky left-0 z-10">{record.hotelCode}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 bg-white sticky left-[100px] z-10">{record.hotelName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 bg-white sticky left-[220px] z-10">{record.pmsOrderNo}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.crsOrderNo}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.thirdPartyOrderNo}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatAmount(record.bookingAmount)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatAmount(record.hotelAmount)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatAmount(record.settlementAmount)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            record.difference === 0 ? 'bg-green-100 text-green-800' :
                            record.difference > 0 ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {record.difference === 0 ? '无差异' :
                             record.difference > 0 ? `+${formatAmount(record.difference)}` :
                             formatAmount(record.difference)}
                          </span>
                        </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.settlementMethod}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <Tooltip title="调账日志">
                          <button
                                onClick={() => handleViewAdjustmentLog(record.checkingId)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                                <FaFileAlt className="w-4 h-4" />
                              </button>
                            </Tooltip>
                            <Tooltip title="推送日志">
                              <button
                                onClick={() => handleViewPushLog(record.checkingId)}
                                className="text-green-600 hover:text-green-900"
                              >
                                <FaPaperPlane className="w-4 h-4" />
                          </button>
                            </Tooltip>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.checkInDate}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.checkOutDate}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.actualCheckInDate}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.actualCheckOutDate}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              record.orderStatus === 'checked_out' ? 'bg-green-100 text-green-800' :
                              record.orderStatus === 'checked_in' ? 'bg-blue-100 text-blue-800' :
                              record.orderStatus === 'confirmed' ? 'bg-yellow-100 text-yellow-800' :
                              record.orderStatus === 'cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {record.orderStatus === 'pending' ? '待确认' :
                               record.orderStatus === 'confirmed' ? '已确认' :
                               record.orderStatus === 'checked_in' ? '已入住' :
                               record.orderStatus === 'checked_out' ? '已离店' :
                               record.orderStatus === 'cancelled' ? '已取消' : '未知'}
                            </span>
                          </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.roomCount}间</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.nightCount}晚</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.bookerName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.guestName}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* 分页控件 */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6 mt-4 rounded-lg shadow">
        <div className="flex justify-between flex-1 sm:hidden">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            上一页
          </button>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            下一页
          </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              显示第 <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> 到{' '}
              <span className="font-medium">{Math.min(currentPage * itemsPerPage, total)}</span> 条，共{' '}
              <span className="font-medium">{total}</span> 条记录
            </p>
          </div>
          <div>
            <nav className="inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 text-gray-400 rounded-l-md border border-gray-300 bg-white text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaChevronLeft className="h-5 w-5" />
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    currentPage === index + 1
                      ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-2 py-2 text-gray-400 rounded-r-md border border-gray-300 bg-white text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaChevronRight className="h-5 w-5" />
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* 调账日志弹窗 */}
      <Modal
        title="调账日志"
        open={isAdjustmentLogVisible}
        onCancel={() => {
          setIsAdjustmentLogVisible(false);
          setCurrentOrderInfo(null);
            adjustmentForm.resetFields();
            setFileList([]);
        }}
        width={1000}
        footer={null}
      >
        <OrderInfoDisplay />
          
          {/* 调账表单 */}
          <Form
            form={adjustmentForm}
            onFinish={handleAdjustmentSubmit}
            layout="vertical"
            className="mb-6"
          >
            <div className="grid grid-cols-3 gap-4">
              <Form.Item
                name="adjustmentAmount"
                label="调整金额"
                rules={[{ required: true, message: '请输入调整金额' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="请输入调整金额"
                  precision={2}
                  prefix="¥"
                />
              </Form.Item>
              <Form.Item
                name="orderStatus"
                label="订单状态"
                rules={[{ required: true, message: '请选择订单状态' }]}
              >
                <Select
                  placeholder="请选择订单状态"
                  options={[
                    { value: '预订', label: '预订' },
                    { value: '已入住', label: '已入住' },
                    { value: '已离店', label: '已离店' },
                    { value: '已取消', label: '已取消' }
                  ]}
                />
              </Form.Item>
              <Form.Item
                name="voucher"
                label="凭证上传"
                rules={[{ required: true, message: '请上传凭证' }]}
              >
                <Upload
                  fileList={fileList}
                  onChange={({ fileList }) => setFileList(fileList)}
                  beforeUpload={() => false}
                  maxCount={1}
                >
                  <Button icon={<UploadOutlined />}>选择文件</Button>
                </Upload>
              </Form.Item>
            </div>
            <Form.Item
              name="description"
              label="调账说明"
              rules={[{ required: true, message: '请输入调账说明' }]}
            >
              <Input.TextArea
                placeholder="请输入调账说明"
                rows={4}
                showCount
                maxLength={200}
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                提交调账
              </Button>
            </Form.Item>
          </Form>

        <Table
          columns={adjustmentLogColumns}
          dataSource={adjustmentLogs}
          rowKey="id"
          loading={loading}
          pagination={false}
          scroll={{ x: 900 }}
        />
      </Modal>

      {/* 推送日志弹窗 */}
      <Modal
        title="订单推送日志"
        open={isPushLogVisible}
        onCancel={() => {
          setIsPushLogVisible(false);
          setCurrentOrderInfo(null);
        }}
        width={800}
        footer={null}
      >
        <OrderInfoDisplay />
        <Table
          columns={pushLogColumns}
          dataSource={pushLogs}
          rowKey="id"
          loading={pushLogLoading}
          pagination={false}
          scroll={{ x: 750 }}
        />
      </Modal>
    </div>
    </TokenCheck>
  );
};

export default HotelChecking; 