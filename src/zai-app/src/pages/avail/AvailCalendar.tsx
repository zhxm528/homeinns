import React, { useState, ChangeEvent, useEffect } from 'react';
import { Switch, DatePicker, Modal, Checkbox, Table, Button, message, Tooltip } from 'antd';
import type { SelectProps } from 'antd/es/select';
import type { ColumnsType } from 'antd/es/table';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import type { RangePickerProps } from 'antd/es/date-picker';
import type { ModalProps } from 'antd/es/modal';
import type { CheckboxProps } from 'antd/es/checkbox';
import type { ButtonProps } from 'antd/es/button';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';
import HotelSelect from '../../components/common/HotelSelect';
import { CaretRightOutlined, CaretDownOutlined, SearchOutlined, ReloadOutlined, ExportOutlined, ImportOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import request from '../../utils/request';

const { RangePicker } = DatePicker;

// 定义接口响应类型
interface RateCode {
  rateCodeId: string;
  rateCodeCode: string;
  rateCodeName: string;
}

interface RoomType {
  roomTypeId: string;
  roomTypeCode: string;
  roomTypeName: string;
  rateCodes: RateCode[];
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface SelectRatePlanResponse {
  roomTypes: RoomType[];
}

// 新增：房价查询请求参数类型
interface RatePricesRequest {
  chainId: string;
  hotelId: string;
  roomTypeCode: string[];
  roomTypeRateCodeMappings: {
    roomTypeCode: string;
    rateCodes: string[];
  }[];
  startDate: string;
  endDate: string;
  pageNum: number;
  pageSize: number;
}

// 新增：根据JSON示例更新房价查询响应数据类型
interface ChannelPrice {
  singleOccupancy: number;
  doubleOccupancy: number;
}

interface HotelPrice {
  singleOccupancy: number;
  doubleOccupancy: number;
}

interface AgentPrice {
  singleOccupancy: number;
  doubleOccupancy: number;
}

interface Package {
  packageCode: string;
  packageDescription: string;
}

// 新增：每日数据接口
interface DailyData {
  date: string;
  isAvailable: string; // "O" 表示可用，"C" 表示不可用
  remainingInventory: number;
  soldInventory: number;
  channelPrice: ChannelPrice;
  hotelPrice: HotelPrice;
  agentPrice: AgentPrice;
  minStayDays: number;
  maxStayDays: number;
  minAdvanceDays: number;
  maxAdvanceDays: number;
  latestCancelDays: number;
  latestCancelTimeSameDay: string;
  paymentType: string;
  latestReservationTimeSameDay: string;
  isCancellable: boolean;
  cancelPenalty: number;
}

// 新增：房型每日数据接口
interface RoomTypeDailyData {
  date: string;
  sold: number;
  remaining: number;
  isAvailable: string;
}

// 新增：酒店每日数据接口
interface HotelDailyData {
  date: string;
  sold: number;
  remaining: number;
  isAvailable: string;
}

interface RateCodeDetail {
  rateCode: string;
  rateCodeName: string;
  dailyData: DailyData[];
  packages: Package[];
}

interface RoomTypeDetail {
  roomTypeCode: string;
  roomTypeName: string;
  roomTypeDescription: string;
  dailyData: RoomTypeDailyData[];
  rateCodes: RateCodeDetail[];
}

interface HotelDetail {
  hotelCode: string;
  hotelName: string;
  dailyData: HotelDailyData[];
  roomTypes: RoomTypeDetail[];
}

interface Pagination {
  totalHotels: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

interface NewRatePricesResponse {
  success: boolean;
  message: string;
  data: {
    status: string;
    data: {
      hotels: HotelDetail[];
      pagination: Pagination;
    };
  };
}

// 保留原有的接口以兼容现有代码
interface RatePriceItem {
  priceId: string;
  chainId: string;
  hotelId: string;
  hotelCode: string;
  ratePlanId: string;
  roomTypeId: string;
  roomTypeCode: string;
  rateCodeId: string;
  rateCode: string;
  stayDate: string;
  channelSingleOccupancy: number;
  channelDoubleOccupancy: number;
  hotelSingleOccupancy: number;
  hotelDoubleOccupancy: number;
  agentSingleOccupancy: number;
  agentDoubleOccupancy: number;
  createdAt: string;
  updatedAt: string;
}

interface RatePricesResponse {
  data: RatePriceItem[];
}

// 生成未来14天的日期
const generateDates = () => {
  const dates = [];
  const today = dayjs();
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  for (let i = 0; i < 14; i++) {
    const date = today.add(i, 'day');
    dates.push({
      date,
      weekday: weekdays[date.day()],
      monthDay: date.format('MM-DD'),
    });
  }
  return dates;
};

// 定义表格数据类型
interface RoomTypeSelection {
  id: string;
  name: string;
  rateCodes: {
    id: string;
    name: string;
    rateCodeCode: string;
  }[];
  selected: boolean;
  rateCodesSelected: Record<string, boolean>;
}

const Calendar: React.FC = () => {
  const [search, setSearch] = useState({
    hotelId: '',
    dateRange: [dayjs(), dayjs().add(13, 'day')] as [Dayjs, Dayjs],
  });

  const navigate = useNavigate();

  const initializeSearch = async () => {
    const defaultHotelId = localStorage.getItem('hotelId');
    console.log('defaultHotelId', defaultHotelId);
    if (defaultHotelId) {
      setSearch(prev => ({
        ...prev,
        hotelId: defaultHotelId,
        dateRange: [dayjs(), dayjs().add(13, 'day')] as [Dayjs, Dayjs],
      }));
  
      // 等待房型加载完成之后再调用查询
      await fetchRoomTypes(defaultHotelId);
      //fetchRatePrices();
    } else {
      message.warning('请先选择一个酒店以加载房型数据');
    }
  };
  

  useEffect(() => {
    initializeSearch();

    // 新增：打印localStorage中AvailCalendarSearchRoomType的值
    const savedRoomTypes = localStorage.getItem('AvailCalendarSearchRoomType');
    console.log('=== localStorage中的AvailCalendarSearchRoomType值 ===');
    if (savedRoomTypes) {
      try {
        const parsedRoomTypes = JSON.parse(savedRoomTypes);
        console.log('解析后的房型代码数组:', parsedRoomTypes);
        console.log('房型代码数量:', parsedRoomTypes.length);
        console.log('数据类型:', typeof parsedRoomTypes);
        console.log('是否为数组:', Array.isArray(parsedRoomTypes));
      } catch (error) {
        console.log('解析localStorage数据失败:', error);
        console.log('原始数据:', savedRoomTypes);
      }
    } else {
      console.log('localStorage中没有找到AvailCalendarSearchRoomType数据');
    }
    console.log('==============================================');

    // 新增：打印localStorage中AvailCalendarSearchRateplan的值
    const savedRateplans = localStorage.getItem('AvailCalendarSearchRateplan');
    console.log('=== localStorage中的AvailCalendarSearchRateplan值 ===');
    if (savedRateplans) {
      try {
        const parsedRateplans = JSON.parse(savedRateplans);
        console.log('解析后的房价码数组:', parsedRateplans);
        console.log('房价码数量:', parsedRateplans.length);
        console.log('数据类型:', typeof parsedRateplans);
        console.log('是否为数组:', Array.isArray(parsedRateplans));
      } catch (error) {
        console.log('解析localStorage数据失败:', error);
        console.log('原始数据:', savedRateplans);
      }
    } else {
      console.log('localStorage中没有找到AvailCalendarSearchRateplan数据');
    }
    console.log('==============================================');
  }, []);

  // 添加房型展开状态管理
  const [expandedRoomTypes, setExpandedRoomTypes] = useState<Record<string, boolean>>({});

  // 添加房态状态管理
  const [roomStatus, setRoomStatus] = useState<Record<string, Record<string, {
    available: boolean;
    remainingCount: number;
    soldCount: number;
    totalCount: number;
  }>>>({});

  // 添加价格状态管理
  const [priceStatus, setPriceStatus] = useState<Record<string, Record<string, {
    channelPrice: number;
    hotelPrice: number;
  }>>>({});

  // 添加快速选择房型的状态
  const [isQuickSelectModalVisible, setIsQuickSelectModalVisible] = useState(false);
  const [roomTypeSelections, setRoomTypeSelections] = useState<RoomTypeSelection[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 新增：保存原始房型数据
  const [originalRoomTypes, setOriginalRoomTypes] = useState<RoomType[]>([]);

  // 新增：查询结果状态管理
  const [queryResults, setQueryResults] = useState<RatePriceItem[]>([]);
  const [isQueryLoading, setIsQueryLoading] = useState(false);
  const [queryError, setQueryError] = useState<string>('');
  
  // 新增：记录有价格数据的房价码
  const [availableRateCodes, setAvailableRateCodes] = useState<Set<string>>(new Set());

  // 新增：记录查询到的酒店数量
  const [queryHotelCount, setQueryHotelCount] = useState<number>(0);

  // 新增：存储从API返回的日期范围
  const [apiDates, setApiDates] = useState<Array<{
    date: dayjs.Dayjs;
    weekday: string;
    monthDay: string;
  }>>([]);

  // 新增：酒店级别状态管理
  const [hotelStatus, setHotelStatus] = useState<Record<string, {
    available: boolean;
    soldCount: number;
    remainingCount: number;
    totalCount: number;
  }>>({});

  // 新增：房价码状态管理
  const [rateCodeStatus, setRateCodeStatus] = useState<Record<string, Record<string, {
    available: boolean;
    remainingCount: number;
    soldCount: number;
    totalCount: number;
  }>>>({});

  const dates = generateDates();

  // 获取房型数据
  const fetchRoomTypes = async (hotelId: string) => {
    try {
      setIsLoading(true);
      
      // 打印请求信息
      console.log('=== 获取房型数据请求信息 ===');
      console.log('请求URL:', `/api/rateplan/selectRatePlanByHotelId`);
      console.log('请求参数:', JSON.stringify({ hotelId }, null, 2));
      console.log('========================');

      const response = await request.get<SelectRatePlanResponse>(
        `/api/rateplan/selectRatePlanByHotelId`,
        {
          params: { hotelId }
        }
      );

      // 打印响应数据
      console.log('=== 获取房型数据响应信息 ===');
      console.log('响应数据:', JSON.stringify(response.data, null, 2));
      console.log('========================');

      // 转换数据格式
      const selections = response.data.roomTypes.map((roomType: RoomType) => ({
        id: roomType.roomTypeId,
        name: `${roomType.roomTypeName}`,
        rateCodes: roomType.rateCodes.map((rateCode: RateCode) => ({
          id: rateCode.rateCodeId,
          name: `${rateCode.rateCodeName}`,
          rateCodeCode: rateCode.rateCodeCode
        })),
        selected: false,
        rateCodesSelected: roomType.rateCodes.reduce((acc: Record<string, boolean>, rateCode: RateCode) => ({
          ...acc,
          [rateCode.rateCodeId]: false
        }), {})
      }));

      // 新增：根据localStorage中的值自动勾选房型
      const savedRoomTypes = localStorage.getItem('AvailCalendarSearchRoomType');
      const savedRateplans = localStorage.getItem('AvailCalendarSearchRateplan');
      
      if (savedRoomTypes || savedRateplans) {
        try {
          const savedRoomTypeCodes = savedRoomTypes ? JSON.parse(savedRoomTypes) : [];
          const savedRateplanCodes = savedRateplans ? JSON.parse(savedRateplans) : [];
          
          console.log('=== 自动勾选房型和房价码 ===');
          console.log('localStorage中的房型代码:', savedRoomTypeCodes);
          console.log('localStorage中的房价码:', savedRateplanCodes);
          
          selections.forEach(roomType => {
            // 从原始数据中查找对应的房型代码
            const originalRoomType = response.data.roomTypes.find(rt => rt.roomTypeId === roomType.id);
            if (originalRoomType) {
              // 检查是否勾选房型
              if (savedRoomTypeCodes.includes(originalRoomType.roomTypeCode)) {
                roomType.selected = true;
                console.log(`自动勾选房型: ${roomType.name} (${originalRoomType.roomTypeCode})`);
              }
              
              // 检查该房型下的房价码
              roomType.rateCodes.forEach(rateCode => {
                const rateplanKey = `${originalRoomType.roomTypeCode}-${rateCode.rateCodeCode}`;
                if (savedRateplanCodes.includes(rateplanKey)) {
                  roomType.rateCodesSelected[rateCode.id] = true;
                  console.log(`自动勾选房价码: ${rateCode.name} (${rateplanKey})`);
                }
              });
            }
          });
          
          console.log('自动勾选完成');
          console.log('====================');
        } catch (error) {
          console.error('解析localStorage数据失败:', error);
        }
      }

      setRoomTypeSelections(selections);
      
      // 初始化展开状态 - 默认不展开
      const initialExpanded: Record<string, boolean> = {};
      selections.forEach((roomType: RoomTypeSelection) => {
        initialExpanded[roomType.id] = false; // 改为 false，默认不展开
      });
      setExpandedRoomTypes(initialExpanded);

      // 保存原始房型数据
      setOriginalRoomTypes(response.data.roomTypes);

    } catch (error: any) {
      console.error('获取房型数据失败:', error);
      console.log('=== 错误详情 ===');
      console.log('错误响应数据:', JSON.stringify(error.response?.data, null, 2));
      console.log('错误状态码:', error.response?.status);
      console.log('错误信息:', error.message);
      console.log('================');
      
      if (error.response) {
        if (error.response.status === 401) {
          Modal.error({
            title: '登录已过期',
            content: '请重新登录',
            okText: '关闭',
            onOk: () => {
              navigate('/login');
            }
          });
        } else if (error.response.status === 403) {
          Modal.error({
            title: '权限不足',
            content: '没有权限获取房型数据',
            okText: '关闭'
          });
        } else {
          Modal.error({
            title: '获取房型数据失败',
            content: error.response.data?.message || '请稍后重试',
            okText: '关闭'
          });
        }
      } else if (error.request) {
        Modal.error({
          title: '网络连接失败',
          content: '请检查网络设置或联系管理员',
          okText: '关闭'
        });
      } else {
        Modal.error({
          title: '获取房型数据失败',
          content: '请稍后重试',
          okText: '关闭'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 新增：查询房价数据
  const fetchRatePrices = async () => {
    if (roomTypeSelections.length === 0) {
      message.warning('房型数据尚未加载完成，请稍候再试');
      return;
    }
    
    if (!search.hotelId) {      
      message.warning('请先选择酒店');
      return;
    }

    if (!search.dateRange || search.dateRange.length !== 2) {
      message.warning('请选择日期范围');
      return;
    }

    // 获取选中的房型和房价码
    const selectedRoomTypes = roomTypeSelections.filter(roomType => roomType.selected);
    const selectedRateCodes: string[] = [];
    const selectedRoomTypeCodes: string[] = [];

    selectedRoomTypes.forEach(roomType => {
      // 获取房型代码（从房型名称中提取，这里假设格式为"房型名称(房型代码)"）
      const roomTypeMatch = roomType.name.match(/\(([^)]+)\)$/);
      if (roomTypeMatch) {
        selectedRoomTypeCodes.push(roomTypeMatch[1]);
      }

      // 获取选中的房价码
      Object.entries(roomType.rateCodesSelected).forEach(([rateCodeId, selected]) => {
        if (selected) {
          const rateCode = roomType.rateCodes.find(rc => rc.id === rateCodeId);
          if (rateCode) {
            selectedRateCodes.push(rateCode.name);
          }
        }
      });
    });

    if (selectedRoomTypeCodes.length === 0 && selectedRateCodes.length === 0) {
      message.warning('请至少选择一个房型或房价码');
      return;
    }

    try {
      setIsQueryLoading(true);
      setQueryError('');

      // 获取chainId
      const userInfo = localStorage.getItem('user');
      const chainId = userInfo ? JSON.parse(userInfo).chainId : '';

      if (!chainId) {
        message.error('未找到链ID信息，请重新登录');
        return;
      }

      // 构建roomTypeRateCodeMappings
      const roomTypeRateCodeMappings: { roomTypeCode: string; rateCodes: string[] }[] = [];
      
      roomTypeSelections.forEach(roomType => {
        // 从原始数据中查找对应的房型代码
        const originalRoomType = originalRoomTypes.find(rt => rt.roomTypeId === roomType.id);
        if (originalRoomType) {
          // 获取该房型下选中的房价码
          const selectedRateCodesForRoom: string[] = [];
          roomType.rateCodes.forEach(rateCode => {
            if (roomType.rateCodesSelected[rateCode.id]) {
              selectedRateCodesForRoom.push(rateCode.rateCodeCode);
            }
          });
          
          // 只有当该房型有选中的房价码时，才添加到映射中
          if (selectedRateCodesForRoom.length > 0) {
            roomTypeRateCodeMappings.push({
              roomTypeCode: originalRoomType.roomTypeCode,
              rateCodes: selectedRateCodesForRoom
            });
          }
        }
      });

      // 更新验证逻辑
      if (selectedRoomTypeCodes.length === 0 && roomTypeRateCodeMappings.length === 0) {
        message.warning('请至少选择一个房型或房价码');
        return;
      }

      // 构建请求参数
      const requestData: RatePricesRequest = {
        chainId,
        hotelId: search.hotelId,
        roomTypeCode: selectedRoomTypeCodes,
        roomTypeRateCodeMappings,
        startDate: search.dateRange[0].format('YYYY-MM-DD'),
        endDate: search.dateRange[1].format('YYYY-MM-DD'),
        pageNum: 1,
        pageSize: 1000 // 设置较大的页面大小以获取所有数据
      };

      // 打印请求信息
      console.log('=== 查询房价数据请求信息 ===');
      console.log('请求URL:', `/api/rateprices/calendar`);
      console.log('请求参数:', JSON.stringify(requestData, null, 2));
      console.log('========================');

      // 更新：使用新的响应类型
      const response = await request.post<NewRatePricesResponse>(
        `/api/rateprices/calendar`,
        requestData
      );

      // 打印响应数据
      console.log('=== 查询房价数据响应信息 ===');
      console.log('响应数据:', JSON.stringify(response.data, null, 2));
      console.log('========================');

      if (response.data.success && response.data.data.status === 'success') {
        // 更新：处理新的响应结构
        const hotels = response.data.data.data.hotels;
        setQueryHotelCount(hotels.length);
        message.success(`查询成功，共获取 ${hotels.length} 个酒店的数据`);
        
        // 更新房态和价格数据
        updateRoomAndPriceDataNew(hotels);
      } else {
        setQueryError('查询失败');
        message.error('查询失败');
      }

    } catch (error: any) {
      console.error('查询房价数据失败:', error);
      console.log('=== 错误详情 ===');
      console.log('错误响应数据:', JSON.stringify(error.response?.data, null, 2));
      console.log('错误状态码:', error.response?.status);
      console.log('错误信息:', error.message);
      console.log('================');
      
      setQueryError(error.response?.data?.message || error.message || '查询失败');
      
      if (error.response) {
        if (error.response.status === 401) {
          Modal.error({
            title: '登录已过期',
            content: '请重新登录',
            okText: '关闭',
            onOk: () => {
              navigate('/login');
            }
          });
        } else if (error.response.status === 403) {
          Modal.error({
            title: '权限不足',
            content: '没有权限查询房价数据',
            okText: '关闭'
          });
        } else {
          Modal.error({
            title: '查询房价数据失败',
            content: error.response.data?.message || '请稍后重试',
            okText: '关闭'
          });
        }
      } else if (error.request) {
        Modal.error({
          title: '网络连接失败',
          content: '请检查网络设置或联系管理员',
          okText: '关闭'
        });
      } else {
        Modal.error({
          title: '查询房价数据失败',
          content: '请稍后重试',
          okText: '关闭'
        });
      }
    } finally {
      setIsQueryLoading(false);
    }
  };

  // 新增：更新房态和价格数据（新版本）
  const updateRoomAndPriceDataNew = (hotels: HotelDetail[]) => {
    console.log('=== 开始更新房态和价格数据（新版本） ===');
    console.log('接收到的酒店数据:', hotels);
    console.log('当前房型选择:', roomTypeSelections.map(rt => ({
      id: rt.id,
      name: rt.name,
      rateCodes: rt.rateCodes.map(rc => ({ id: rc.id, name: rc.name, code: rc.rateCodeCode }))
    })));
    console.log('原始房型数据:', originalRoomTypes.map(rt => ({
      id: rt.roomTypeId,
      code: rt.roomTypeCode,
      name: rt.roomTypeName
    })));
    
    // 新增：提取API返回的日期范围
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const extractedDates: Array<{
      date: dayjs.Dayjs;
      weekday: string;
      monthDay: string;
    }> = [];
    
    if (hotels.length > 0 && hotels[0].dailyData.length > 0) {
      hotels[0].dailyData.forEach(dailyData => {
        const date = dayjs(dailyData.date);
        extractedDates.push({
          date,
          weekday: weekdays[date.day()],
          monthDay: date.format('MM-DD'),
        });
      });
      setApiDates(extractedDates);
      console.log('提取的API日期范围:', extractedDates);
    }
    
    // 更新房态数据
    const newRoomStatus: Record<string, Record<string, {
      available: boolean;
      remainingCount: number;
      soldCount: number;
      totalCount: number;
    }>> = {};

    // 更新价格数据 - 使用房型代码+房价码代码作为唯一标识
    const newPriceStatus: Record<string, Record<string, {
      channelPrice: number;
      hotelPrice: number;
    }>> = {};

    // 新增：记录有价格数据的房价码ID
    const newAvailableRateCodes = new Set<string>();

    // 新增：酒店级别状态管理
    const newHotelStatus: Record<string, {
      available: boolean;
      soldCount: number;
      remainingCount: number;
      totalCount: number;
    }> = {};

    // 新增：房价码状态管理 - 使用房型代码+房价码代码作为唯一标识
    const newRateCodeStatus: Record<string, Record<string, {
      available: boolean;
      remainingCount: number;
      soldCount: number;
      totalCount: number;
    }>> = {};

    // 处理每个酒店的数据
    hotels.forEach(hotel => {
      console.log(`处理酒店: ${hotel.hotelName} (${hotel.hotelCode})`);
      
      // 新增：处理酒店级别的每日数据
      hotel.dailyData.forEach(dailyData => {
        newHotelStatus[dailyData.date] = {
          available: dailyData.isAvailable === 'O',
          soldCount: dailyData.sold,
          remainingCount: dailyData.remaining,
          totalCount: dailyData.sold + dailyData.remaining,
        };
        console.log(`酒店级别数据: ${dailyData.date}, isAvailable=${dailyData.isAvailable}, available=${dailyData.isAvailable === 'O'}`);
      });
      
      hotel.roomTypes.forEach(roomType => {
        console.log(`处理房型: ${roomType.roomTypeName} (${roomType.roomTypeCode})`);
        
        // 通过房型代码找到对应的房型选择
        const roomTypeSelection = roomTypeSelections.find(rt => {
          // 从原始数据中查找对应的房型
          const originalRoomType = originalRoomTypes.find(ort => ort.roomTypeId === rt.id);
          const isMatch = originalRoomType && originalRoomType.roomTypeCode === roomType.roomTypeCode;
          if (isMatch) {
            console.log(`房型匹配成功: ${rt.name} (${originalRoomType.roomTypeCode})`);
          }
          return isMatch;
        });

        if (roomTypeSelection) {
          console.log(`找到匹配的房型: ${roomTypeSelection.name}`);
          
          // 更新房态数据 - 使用房型的每日数据
          if (!newRoomStatus[roomTypeSelection.id]) {
            newRoomStatus[roomTypeSelection.id] = {};
          }
          
          // 处理房型的每日数据
          roomType.dailyData.forEach(dailyData => {
            newRoomStatus[roomTypeSelection.id][dailyData.date] = {
              available: dailyData.isAvailable === 'O',
              remainingCount: dailyData.remaining,
              soldCount: dailyData.sold,
              totalCount: dailyData.remaining + dailyData.sold,
            };
          });

          // 处理该房型下的房价码
          roomType.rateCodes.forEach(rateCode => {
            console.log(`处理房价码: ${rateCode.rateCodeName} (${rateCode.rateCode})`);
            console.log(`房价码每日数据:`, rateCode.dailyData);
            
            // 通过房价码代码找到对应的房价码选择
            const rateCodeSelection = roomTypeSelection.rateCodes.find(rc => rc.rateCodeCode === rateCode.rateCode);
            
            if (rateCodeSelection) {
              console.log(`找到匹配的房价码: ${rateCodeSelection.name} (${rateCodeSelection.rateCodeCode})`);
              console.log(`房价码ID: ${rateCodeSelection.id}`);
              
              // 记录有价格数据的房价码ID
              newAvailableRateCodes.add(rateCodeSelection.id);
              
              // 使用房型代码+房价码代码作为唯一标识
              const uniqueKey = `${roomType.roomTypeCode}-${rateCode.rateCode}`;
              console.log(`使用唯一标识: ${uniqueKey}`);
              
              if (!newPriceStatus[uniqueKey]) {
                newPriceStatus[uniqueKey] = {};
              }
              
              // 处理房价码的每日数据
              rateCode.dailyData.forEach(dailyData => {
                console.log(`处理房价码每日数据: ${dailyData.date}, remainingInventory=${dailyData.remainingInventory}, soldInventory=${dailyData.soldInventory}`);
                
                newPriceStatus[uniqueKey][dailyData.date] = {
                  channelPrice: dailyData.channelPrice.singleOccupancy,
                  hotelPrice: dailyData.hotelPrice.singleOccupancy,
                };
                
                // 新增：房价码状态管理 - 使用房型代码+房价码代码作为唯一标识
                if (!newRateCodeStatus[uniqueKey]) {
                  newRateCodeStatus[uniqueKey] = {};
                }
                
                newRateCodeStatus[uniqueKey][dailyData.date] = {
                  available: dailyData.isAvailable === 'O',
                  remainingCount: dailyData.remainingInventory,
                  soldCount: dailyData.soldInventory,
                  totalCount: dailyData.remainingInventory + dailyData.soldInventory,
                };
                
                console.log(`设置房价码状态: Key=${uniqueKey}, date=${dailyData.date}, remainingCount=${dailyData.remainingInventory}`);
              });
              
              console.log(`更新价格数据: 渠道价格=${rateCode.dailyData[0]?.channelPrice.singleOccupancy}, 酒店价格=${rateCode.dailyData[0]?.hotelPrice.singleOccupancy}`);
            } else {
              console.log(`未找到匹配的房价码: ${rateCode.rateCode}`);
              console.log('可用的房价码:', roomTypeSelection.rateCodes.map(rc => `${rc.name}(${rc.rateCodeCode})`));
            }
          });
        } else {
          console.log(`未找到匹配的房型: ${roomType.roomTypeCode}`);
          console.log('可用的房型:', roomTypeSelections.map(rt => {
            const originalRoomType = originalRoomTypes.find(ort => ort.roomTypeId === rt.id);
            return `${rt.name}(${originalRoomType?.roomTypeCode || 'unknown'})`;
          }));
        }
      });
    });

    console.log('更新后的房态数据:', newRoomStatus);
    console.log('更新后的价格数据:', newPriceStatus);
    console.log('有价格数据的房价码ID:', Array.from(newAvailableRateCodes));
    console.log('=== 房态和价格数据更新完成（新版本） ===');
    console.log('酒店级别状态数据:', newHotelStatus);
    console.log('房价码状态数据:', newRateCodeStatus);

    setRoomStatus(prev => ({ ...prev, ...newRoomStatus }));
    setPriceStatus(prev => ({ ...prev, ...newPriceStatus }));
    setAvailableRateCodes(newAvailableRateCodes);
    setHotelStatus(newHotelStatus);
    setRateCodeStatus(newRateCodeStatus);
  };

  // 打开快速选择房型弹窗
  const handleOpenQuickSelect = async () => {
    if (!search.hotelId) {
      message.warning('请先选择酒店');
      return;
    }
    await fetchRoomTypes(search.hotelId);
    setIsQuickSelectModalVisible(true);
  };

  // 禁用日期
  const disabledDate = (current: dayjs.Dayjs) => {
    const today = dayjs().startOf('day');
    const maxDate = today.add(366, 'day');
    return current && (current < today || current > maxDate);
  };

  // 处理房型展开/收起
  const handleRoomTypeToggle = (roomTypeId: string) => {
    setExpandedRoomTypes(prev => ({
      ...prev,
      [roomTypeId]: !prev[roomTypeId]
    }));
  };

  // 处理房态切换
  const handleRoomTypeAvailabilityChange = async (roomTypeId: string, date: string, checked: boolean) => {
    if (!search.hotelId) {
      message.warning('请先选择酒店');
      return;
    }

    // 从原始数据中查找对应的房型代码
    const originalRoomType = originalRoomTypes.find(rt => rt.roomTypeId === roomTypeId);
    if (!originalRoomType) {
      message.error('未找到房型信息');
      return;
    }

    try {
      // 构建请求参数
      const requestBody = {
        hotelId: search.hotelId,
        roomTypeCode: originalRoomType.roomTypeCode,
        stayDate: date,
        isAvailable: checked ? 'O' : 'C' // 开关为开时传"O"，开关为关时传"C"
      };

      // 打印请求信息
      console.log('=== 更新房型状态请求信息 ===');
      console.log('请求URL:', `/api/rateprices/dailyroomtypestatus`);
      console.log('请求参数:', JSON.stringify(requestBody, null, 2));
      console.log('========================');

      // 调用后台接口
      const response = await request.post('/api/rateprices/dailyroomtypestatus', requestBody);

      // 打印响应数据
      console.log('=== 更新房型状态响应信息 ===');
      console.log('响应数据:', JSON.stringify(response.data, null, 2));
      console.log('========================');

      if (response.data.success) {
        // 更新本地状态
        setRoomStatus(prev => ({
          ...prev,
          [roomTypeId]: {
            ...prev[roomTypeId],
            [date]: {
              ...prev[roomTypeId][date],
              available: checked
            }
          }
        }));
        
        message.success('房型状态更新成功');
      } else {
        message.error(response.data.message || '房型状态更新失败');
      }
    } catch (error: any) {
      console.error('更新房型状态失败:', error);
      console.log('=== 错误详情 ===');
      console.log('错误响应数据:', JSON.stringify(error.response?.data, null, 2));
      console.log('错误状态码:', error.response?.status);
      console.log('错误信息:', error.message);
      console.log('================');
      
      if (error.response) {
        if (error.response.status === 401) {
          Modal.error({
            title: '登录已过期',
            content: '请重新登录',
            okText: '关闭',
            onOk: () => {
              navigate('/login');
            }
          });
        } else if (error.response.status === 403) {
          Modal.error({
            title: '权限不足',
            content: '没有权限更新房型状态',
            okText: '关闭'
          });
        } else {
          Modal.error({
            title: '更新房型状态失败',
            content: error.response.data?.message || '请稍后重试',
            okText: '关闭'
          });
        }
      } else if (error.request) {
        Modal.error({
          title: '网络连接失败',
          content: '请检查网络设置或联系管理员',
          okText: '关闭'
        });
      } else {
        Modal.error({
          title: '更新房型状态失败',
          content: '请稍后重试',
          okText: '关闭'
        });
      }
    }
  };

  // 获取房态数据
  const getRoomStatus = (roomTypeId: string, date: dayjs.Dayjs) => {
    return roomStatus[roomTypeId]?.[date.format('YYYY-MM-DD')] ?? {
      available: false,
      remainingCount: 0,
      soldCount: 0,
      totalCount: 0,
    };
  };

  // 获取价格数据
  const getPriceStatus = (rateCodeId: string, date: dayjs.Dayjs, roomTypeCode?: string, rateCodeCode?: string) => {
    // 如果有房型代码和房价码代码，使用唯一标识
    let key = rateCodeId;
    if (roomTypeCode && rateCodeCode) {
      key = `${roomTypeCode}-${rateCodeCode}`;
    }
    
    const priceStatusForDate = priceStatus[key]?.[date.format('YYYY-MM-DD')];
    const rateCodeStatusForDate = rateCodeStatus[key]?.[date.format('YYYY-MM-DD')];
    
    const result = {
      channelPrice: priceStatusForDate?.channelPrice || 0,
      hotelPrice: priceStatusForDate?.hotelPrice || 0,
      soldCount: rateCodeStatusForDate?.soldCount || 0,
      remainingCount: rateCodeStatusForDate?.remainingCount || 0,
    };
    
    // 添加调试日志
    if (rateCodeId.includes('BAR') || rateCodeId.includes('DBL.ST-3')) {
      console.log(`getPriceStatus调试: rateCodeId=${rateCodeId}, key=${key}, date=${date.format('YYYY-MM-DD')}`);
      console.log(`priceStatus数据:`, priceStatusForDate);
      console.log(`rateCodeStatus数据:`, rateCodeStatusForDate);
      console.log(`返回结果:`, result);
    }
    
    return result;
  };

  // 新增：获取酒店状态数据
  const getHotelStatus = (date: dayjs.Dayjs) => {
    return hotelStatus[date.format('YYYY-MM-DD')] ?? {
      available: false,
      soldCount: 0,
      remainingCount: 0,
      totalCount: 0,
    };
  };

  // 新增：处理房价码可用性变化
  const handleRateCodeAvailabilityChange = async (roomTypeCode: string, rateCodeCode: string, date: string, checked: boolean) => {
    if (!search.hotelId) {
      message.warning('请先选择酒店');
      return;
    }

    try {
      // 构建请求参数
      const requestBody = {
        hotelId: search.hotelId,
        roomTypeCode: roomTypeCode,
        rateCode: rateCodeCode,
        stayDate: date,
        isAvailable: checked ? 'O' : 'C' // 开关为开时传"O"，开关为关时传"C"
      };

      // 打印请求信息
      console.log('=== 更新房价码状态请求信息 ===');
      console.log('请求URL:', `/api/rateprices/dailyratecodestatus`);
      console.log('请求参数:', JSON.stringify(requestBody, null, 2));
      console.log('========================');

      // 调用后台接口
      const response = await request.post('/api/rateprices/dailyratecodestatus', requestBody);

      // 打印响应数据
      console.log('=== 更新房价码状态响应信息 ===');
      console.log('响应数据:', JSON.stringify(response.data, null, 2));
      console.log('========================');

      if (response.data.success) {
        // 更新本地状态
        const uniqueKey = `${roomTypeCode}-${rateCodeCode}`;
        setRateCodeStatus(prev => ({
          ...prev,
          [uniqueKey]: {
            ...prev[uniqueKey],
            [date]: {
              ...prev[uniqueKey]?.[date],
              available: checked
            }
          }
        }));
        
        message.success('房价码状态更新成功');
      } else {
        message.error(response.data.message || '房价码状态更新失败');
      }
    } catch (error: any) {
      console.error('更新房价码状态失败:', error);
      console.log('=== 错误详情 ===');
      console.log('错误响应数据:', JSON.stringify(error.response?.data, null, 2));
      console.log('错误状态码:', error.response?.status);
      console.log('错误信息:', error.message);
      console.log('================');
      
      if (error.response) {
        if (error.response.status === 401) {
          Modal.error({
            title: '登录已过期',
            content: '请重新登录',
            okText: '关闭',
            onOk: () => {
              navigate('/login');
            }
          });
        } else if (error.response.status === 403) {
          Modal.error({
            title: '权限不足',
            content: '没有权限更新房价码状态',
            okText: '关闭'
          });
        } else {
          Modal.error({
            title: '更新房价码状态失败',
            content: error.response.data?.message || '请稍后重试',
            okText: '关闭'
          });
        }
      } else if (error.request) {
        Modal.error({
          title: '网络连接失败',
          content: '请检查网络设置或联系管理员',
          okText: '关闭'
        });
      } else {
        Modal.error({
          title: '更新房价码状态失败',
          content: '请稍后重试',
          okText: '关闭'
        });
      }
    }
  };

  // 新增：处理酒店级开关点击
  const handleHotelAvailabilityChange = async (date: dayjs.Dayjs, checked: boolean) => {
    if (!search.hotelId) {
      message.warning('请先选择酒店');
      return;
    }

    try {
      // 构建请求参数
      const requestBody = {
        hotelId: search.hotelId,
        stayDate: date.format('YYYY-MM-DD'),
        isAvailable: checked ? 'O' : 'C' // 开关为开时传"O"，开关为关时传"C"
      };

      // 打印请求信息
      console.log('=== 更新酒店状态请求信息 ===');
      console.log('请求URL:', `/api/rateprices/dailyhotelstatus`);
      console.log('请求参数:', JSON.stringify(requestBody, null, 2));
      console.log('========================');

      // 调用后台接口
      const response = await request.post('/api/rateprices/dailyhotelstatus', requestBody);

      // 打印响应数据
      console.log('=== 更新酒店状态响应信息 ===');
      console.log('响应数据:', JSON.stringify(response.data, null, 2));
      console.log('========================');

      if (response.data.success) {
        // 更新本地状态
        setHotelStatus(prev => ({
          ...prev,
          [date.format('YYYY-MM-DD')]: {
            ...prev[date.format('YYYY-MM-DD')],
            available: checked
          }
        }));
        
        message.success('酒店状态更新成功');
      } else {
        message.error(response.data.message || '酒店状态更新失败');
      }
    } catch (error: any) {
      console.error('更新酒店状态失败:', error);
      console.log('=== 错误详情 ===');
      console.log('错误响应数据:', JSON.stringify(error.response?.data, null, 2));
      console.log('错误状态码:', error.response?.status);
      console.log('错误信息:', error.message);
      console.log('================');
      
      if (error.response) {
        if (error.response.status === 401) {
          Modal.error({
            title: '登录已过期',
            content: '请重新登录',
            okText: '关闭',
            onOk: () => {
              navigate('/login');
            }
          });
        } else if (error.response.status === 403) {
          Modal.error({
            title: '权限不足',
            content: '没有权限更新酒店状态',
            okText: '关闭'
          });
        } else {
          Modal.error({
            title: '更新酒店状态失败',
            content: error.response.data?.message || '请稍后重试',
            okText: '关闭'
          });
        }
      } else if (error.request) {
        Modal.error({
          title: '网络连接失败',
          content: '请检查网络设置或联系管理员',
          okText: '关闭'
        });
      } else {
        Modal.error({
          title: '更新酒店状态失败',
          content: '请稍后重试',
          okText: '关闭'
        });
      }
    }
  };

  // 新增：格式化价格显示
  const formatPrice = (price: number) => {
    if (price === 0 || price === null || price === undefined) {
      return '--';
    }
    
    // 保留两位小数
    const fixedPrice = price.toFixed(2);
    
    // 如果末尾是.00，则去掉小数部分
    const cleanPrice = fixedPrice.endsWith('.00') ? fixedPrice.slice(0, -3) : fixedPrice;
    
    // 添加千分位分隔符
    const parts = cleanPrice.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    
    return `¥${parts.join('.')}`;
  };

  // 新增：根据剩余库存数量返回颜色类名
  const getInventoryColor = (remainingCount: number) => {
    if (remainingCount === 0) {
      return 'text-red-500'; // 红色
    } else if (remainingCount <= 5) {
      return 'text-orange-500'; // 橙色
    } else {
      return 'text-green-500'; // 绿色
    }
  };

  // 处理全选/取消全选
  const handleSelectAll = (checked: boolean) => {
    setRoomTypeSelections(prev => prev.map(roomType => ({
      ...roomType,
      selected: checked,
      rateCodesSelected: roomType.rateCodes.reduce((acc, rateCode) => ({
        ...acc,
        [rateCode.id]: checked
      }), {})
    })));
  };

  // 处理反选
  const handleInvertSelection = () => {
    setRoomTypeSelections(prev => prev.map(roomType => ({
      ...roomType,
      selected: !roomType.selected,
      rateCodesSelected: Object.entries(roomType.rateCodesSelected).reduce((acc, [rateCodeId, selected]) => ({
        ...acc,
        [rateCodeId]: !selected
      }), {})
    })));
  };

  // 处理房型选择
  const handleRoomTypeSelect = (roomTypeId: string, checked: boolean) => {
    setRoomTypeSelections(prev => prev.map(roomType => {
      if (roomType.id === roomTypeId) {
        return {
          ...roomType,
          selected: checked,
          rateCodesSelected: roomType.rateCodes.reduce((acc, rateCode) => ({
            ...acc,
            [rateCode.id]: checked
          }), {})
        };
      }
      return roomType;
    }));
  };

  // 处理房价码选择
  const handleRateCodeSelect = (roomTypeId: string, rateCodeId: string, checked: boolean) => {
    setRoomTypeSelections(prev => prev.map(roomType => {
      if (roomType.id === roomTypeId) {
        const newRateCodesSelected = {
          ...roomType.rateCodesSelected,
          [rateCodeId]: checked
        };
        const allRateCodesSelected = roomType.rateCodes.every(
          rateCode => newRateCodesSelected[rateCode.id]
        );
        return {
          ...roomType,
          selected: allRateCodesSelected,
          rateCodesSelected: newRateCodesSelected
        };
      }
      return roomType;
    }));
  };

  // 定义表格列
  const columns: ColumnsType<RoomTypeSelection> = [
    {
      title: '房型/房价码',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div className="flex items-center gap-2">
          <Checkbox
            checked={record.selected}
            onChange={(e: CheckboxChangeEvent) => handleRoomTypeSelect(record.id, e.target.checked)}
          />
          <span>{text}</span>
        </div>
      ),
    },
  ];

  // 展开行配置
  const expandedRowRender = (record: RoomTypeSelection) => {
    return (
      <div className="pl-8">
        {record.rateCodes
          .filter(rateCode => queryHotelCount === 0 || availableRateCodes.has(rateCode.id))
          .map(rateCode => (
          <div key={rateCode.id} className="flex items-center gap-2 py-2">
            <Checkbox
              checked={record.rateCodesSelected[rateCode.id]}
              onChange={(e: CheckboxChangeEvent) => handleRateCodeSelect(record.id, rateCode.id, e.target.checked)}
            />
            <span>{rateCode.name}</span>
          </div>
        ))}
      </div>
    );
  };

  const handleReset = () => {
    setSearch({
      hotelId: '',
      dateRange: [dayjs(), dayjs().add(13, 'day')]
    });
    // 清空房型数据和查询结果
    setRoomTypeSelections([]);
    setQueryResults([]);
    setQueryError('');
    setQueryHotelCount(0);
    setRoomStatus({});
    setPriceStatus({});
    setAvailableRateCodes(new Set());
    // 新增：清空API日期范围
    setApiDates([]);
    // 新增：清空酒店级别状态数据
    setHotelStatus({});
    // 新增：清空房价码状态数据
    setRateCodeStatus({});
  };

  const handleSearch = () => {
    fetchRatePrices();
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Exporting data...');
  };

  const handleImport = () => {
    // TODO: Implement import functionality
    console.log('Importing data...');
  };

  // 新增：处理快速选择房型弹窗确定按钮
  const handleQuickSelectConfirm = () => {
    // 获取选中的房型代码
    const selectedRoomTypeCodes: string[] = [];
    // 新增：获取选中的房价码
    const selectedRateplans: string[] = [];
    
    roomTypeSelections.forEach(roomType => {
      // 从原始房型数据中查找对应的房型代码
      const originalRoomType = originalRoomTypes.find(rt => rt.roomTypeId === roomType.id);
      if (originalRoomType) {
        // 如果房型被选中，添加到房型代码列表
        if (roomType.selected) {
          selectedRoomTypeCodes.push(originalRoomType.roomTypeCode);
        }
        
        // 处理该房型下选中的房价码（无论房型是否被选中）
        roomType.rateCodes.forEach(rateCode => {
          if (roomType.rateCodesSelected[rateCode.id]) {
            // 格式：roomTypeCode-rateCodeCode
            const rateplanKey = `${originalRoomType.roomTypeCode}-${rateCode.rateCodeCode}`;
            selectedRateplans.push(rateplanKey);
          }
        });
      } else {
        // 如果找不到原始数据，使用房型ID作为备选
        if (roomType.selected) {
          selectedRoomTypeCodes.push(roomType.id);
        }
      }
    });

    // 保存房型代码到localStorage
    localStorage.setItem('AvailCalendarSearchRoomType', JSON.stringify(selectedRoomTypeCodes));
    
    // 新增：保存房价码到localStorage
    localStorage.setItem('AvailCalendarSearchRateplan', JSON.stringify(selectedRateplans));
    
    // 显示成功消息
    message.success(`已保存 ${selectedRoomTypeCodes.length} 个房型代码和 ${selectedRateplans.length} 个房价码到本地存储`);
    
    // 关闭弹窗
    setIsQuickSelectModalVisible(false);
    
    // 打印保存的信息
    console.log('=== 保存的房型代码 ===');
    console.log('选中的房型代码:', selectedRoomTypeCodes);
    console.log('localStorage键:', 'AvailCalendarSearchRoomType');
    console.log('保存的值:', JSON.stringify(selectedRoomTypeCodes));
    console.log('====================');
    
    // 新增：打印保存的房价码信息
    console.log('=== 保存的房价码 ===');
    console.log('选中的房价码:', selectedRateplans);
    console.log('localStorage键:', 'AvailCalendarSearchRateplan');
    console.log('保存的值:', JSON.stringify(selectedRateplans));
    console.log('====================');
  };

  // 过滤已选择的房型和房价码
  const filteredRoomTypeSelections = roomTypeSelections.filter(roomType => {
    // 如果房型被选中，或者房型下有被选中的房价码，则显示该房型
    const hasSelectedRateCodes = Object.values(roomType.rateCodesSelected).some(selected => selected);
    return roomType.selected || hasSelectedRateCodes;
  }).map(roomType => ({
    ...roomType,
    // 只显示被选中的房价码
    rateCodes: roomType.rateCodes.filter(rateCode => roomType.rateCodesSelected[rateCode.id])
  }));

  useEffect(() => {
    if (
      search.hotelId &&
      roomTypeSelections.length > 0 &&
      search.dateRange &&
      search.dateRange.length === 2
    ) {
      fetchRatePrices();
    }
  }, [search.hotelId, roomTypeSelections, search.dateRange]);

  return (
    <div className="flex flex-col h-[calc(100vh-48px)] bg-gray-50">
      {/* 查询条件面板 */}
      <div className="bg-white p-4 border-b">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-4 items-end justify-between">
            <div className="flex flex-wrap gap-4 items-end">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={handleOpenQuickSelect}
              >
                快速选择房型
              </button>
              <div className="w-52">
                <HotelSelect
                  value={search.hotelId}
                  onChange={(value: string) => {
                    setSearch(s => ({ ...s, hotelId: value }));
                    // 如果选择了新的酒店，自动加载房型数据
                    if (value) {
                      fetchRoomTypes(value);
                    }
                  }}
                  placeholder="选择酒店"
                />
                
              </div>

              <RangePicker
                style={{ width: 300 }}
                size="large"
                value={search.dateRange}
                onChange={(dates) => {
                  if (dates) {
                    setSearch(s => ({ ...s, dateRange: dates as [Dayjs, Dayjs] }));
                  }
                }}
                locale={locale}
                disabledDate={disabledDate}
              />
            </div>
            <div className="flex gap-2">
              <Button
                size="large"
                onClick={() => {
                  const startDate = dayjs();
                  const endDate = startDate.add(6, 'day');
                  setSearch(s => ({ ...s, dateRange: [startDate, endDate] }));
                }}
              >
                近7天
              </Button>
              <Button
                size="large"
                onClick={() => {
                  const startDate = dayjs();
                  const endDate = startDate.add(13, 'day');
                  setSearch(s => ({ ...s, dateRange: [startDate, endDate] }));
                }}
              >
                近14天
              </Button>
              <Button
                size="large"
                onClick={() => {
                  const startDate = dayjs();
                  const endDate = startDate.add(29, 'day');
                  setSearch(s => ({ ...s, dateRange: [startDate, endDate] }));
                }}
              >
                近30天
              </Button>
              <Button
                size="large"
                icon={<ReloadOutlined />}
                onClick={handleReset}
              >
                重置
              </Button>
              <Button
                size="large"
                type="primary"
                icon={<SearchOutlined />}
                onClick={handleSearch}
                loading={isQueryLoading}
              >
                查询
              </Button>
              <Button
                size="large"
                icon={<ExportOutlined />}
                onClick={handleExport}
              >
                导出
              </Button>
              <Button
                size="large"
                icon={<ImportOutlined />}
                onClick={handleImport}
              >
                导入
              </Button>
            </div>
          </div>
          
          
        </div>
      </div>

      {/* 快速选择房型弹窗 */}
      <Modal
        title="快速选择房型"
        open={isQuickSelectModalVisible}
        onCancel={() => setIsQuickSelectModalVisible(false)}
        width={600}
        footer={[
          <Button key="cancel" onClick={() => setIsQuickSelectModalVisible(false)}>
            取消
          </Button>,
          <Button key="confirm" type="primary" onClick={handleQuickSelectConfirm}>
            确定
          </Button>,
        ]}
      >
        <div className="mb-4 flex gap-4">
          <Checkbox
            onChange={(e: CheckboxChangeEvent) => handleSelectAll(e.target.checked)}
            checked={roomTypeSelections.every(roomType => roomType.selected)}
          >
            全选
          </Checkbox>
          <Checkbox onChange={handleInvertSelection}>反选</Checkbox>
        </div>
        <Table
          columns={columns}
          dataSource={roomTypeSelections}
          rowKey="id"
          expandable={{
            expandedRowRender,
            defaultExpandAllRows: true,
          }}
          pagination={false}
          loading={isLoading}
        />
      </Modal>

      {/* 表格 */}
      <div className="flex-1 overflow-auto p-4">
        <div className="bg-white rounded-lg shadow h-full">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="text-gray-400 text-lg mb-2">正在加载房型数据...</div>
              <div className="text-gray-400 text-sm">请稍候</div>
            </div>
          ) : roomTypeSelections.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="text-gray-400 text-lg mb-2">暂无房型数据</div>
              <div className="text-gray-400 text-sm">请先选择酒店以加载房型信息</div>
            </div>
          ) : (
            <div className="overflow-auto h-full">
              <table className="w-full table-fixed">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-gray-50">
                    <th className="w-40 px-4 py-3 text-left text-sm font-medium text-gray-700 border-b whitespace-nowrap bg-gray-50 shadow-sm sticky left-0 z-20">房型/房价码</th>
                    {(apiDates.length > 0 ? apiDates : dates).map(({ date, weekday, monthDay }) => (
                      <th key={date.format('YYYY-MM-DD')} className="w-20 px-4 py-3 text-center text-sm font-medium text-gray-700 border-b bg-gray-50 shadow-sm">
                        <div className={weekday === '周六' || weekday === '周日' ? 'text-orange-500 font-bold' : ''}>
                          {weekday}
                        </div>
                        <div>{monthDay}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          <div>开关</div>
                          <div>售/余</div>
                          <div className="text-blue-600">渠道价</div>
                          <div className="text-gray-500">酒店价</div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Hotel-level row */}
                  <tr className="border-b bg-blue-50">
                    <td className="w-40 px-4 py-3 text-sm font-medium text-gray-900 whitespace-nowrap sticky left-0 z-10 bg-blue-50">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-blue-600">酒店级</span>
                      </div>
                    </td>
                    {(apiDates.length > 0 ? apiDates : dates).map(({ date }) => {
                      // 使用酒店级别的状态数据
                      const hotelStatusData = getHotelStatus(date);
                      
                      return (
                        <td key={date.format('YYYY-MM-DD')} className="w-20 px-4 py-3 text-center border-b">
                          <div className="flex flex-col items-center gap-2">
                            <Switch
                              checked={hotelStatusData.available}
                              size="small"
                              onChange={(checked) => handleHotelAvailabilityChange(date, checked)}
                            />
                            <div className="text-sm text-gray-600">
                              {hotelStatusData.totalCount === 0 ? '--' : (
                                <>
                                  <span>{hotelStatusData.soldCount}</span>
                                  <span>/</span>
                                  <span className={getInventoryColor(hotelStatusData.remainingCount)}>{hotelStatusData.remainingCount}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                  
                  {filteredRoomTypeSelections.map(roomType => (
                    <React.Fragment key={roomType.id}>
                      {/* 房型行 */}
                      <tr className="border-b">
                        <td className="w-40 px-4 py-3 text-sm font-medium text-gray-900 whitespace-nowrap sticky left-0 z-10 bg-white">
                          <div 
                            className="flex items-center gap-2 cursor-pointer hover:text-blue-600"
                            onClick={() => handleRoomTypeToggle(roomType.id)}
                          >
                            {expandedRoomTypes[roomType.id] ? (
                              <CaretDownOutlined className="text-gray-500" />
                            ) : (
                              <CaretRightOutlined className="text-gray-500" />
                            )}
                            <Tooltip 
                              title={() => {
                                const originalRoomType = originalRoomTypes.find(rt => rt.roomTypeId === roomType.id);
                                return originalRoomType ? `${originalRoomType.roomTypeCode}` : '未知';
                              }}
                              placement="right"
                            >
                              <span>{roomType.name}</span>
                            </Tooltip>
                          </div>
                        </td>
                        {(apiDates.length > 0 ? apiDates : dates).map(({ date }) => {
                          const status = getRoomStatus(roomType.id, date);
                          return (
                            <td key={date.format('YYYY-MM-DD')} className="w-20 px-4 py-3 text-center border-b">
                              <div className="flex flex-col items-center gap-2">
                                <Switch
                                  checked={status.available}
                                  size="small"
                                  onChange={(checked) => handleRoomTypeAvailabilityChange(roomType.id, date.format('YYYY-MM-DD'), checked)}
                                />
                                <div className="text-sm text-gray-600">
                                  {status.totalCount === 0 ? '--' : (
                                    <>
                                      <span>{status.soldCount}</span>
                                      <span>/</span>
                                      <span className={getInventoryColor(status.remainingCount)}>{status.remainingCount}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                      {/* 房价码行 */}
                      {expandedRoomTypes[roomType.id] && roomType.rateCodes.map(rateCode => (
                        <tr key={rateCode.id} className="border-b bg-gray-50">
                          <td className="w-40 px-4 py-2 text-sm text-gray-600 pl-8 whitespace-nowrap sticky left-0 z-10 bg-gray-50">
                            <Tooltip 
                              title={`${rateCode.rateCodeCode}`}
                              placement="right"
                            >
                              <span>{rateCode.name}</span>
                            </Tooltip>
                          </td>
                          {(apiDates.length > 0 ? apiDates : dates).map(({ date }) => {
                            // 从原始数据中获取房型代码和房价码代码
                            const originalRoomType = originalRoomTypes.find(rt => rt.roomTypeId === roomType.id);
                            const prices = getPriceStatus(rateCode.id, date, originalRoomType?.roomTypeCode, rateCode.rateCodeCode);
                            const isSamePrice = prices.channelPrice === prices.hotelPrice;
                            
                            // 获取房价码状态数据
                            const uniqueKey = `${originalRoomType?.roomTypeCode}-${rateCode.rateCodeCode}`;
                            const rateCodeStatusData = rateCodeStatus[uniqueKey]?.[date.format('YYYY-MM-DD')];
                            const isAvailable = rateCodeStatusData?.available ?? false;
                            
                            return (
                              <td key={date.format('YYYY-MM-DD')} className="w-20 px-4 py-2 text-center border-b">
                                <div className="flex flex-col items-center gap-1">
                                  {/* 第一行：开关 */}
                                  <Switch
                                    checked={isAvailable}
                                    size="small"
                                    onChange={(checked) => handleRateCodeAvailabilityChange(
                                      originalRoomType?.roomTypeCode || '', 
                                      rateCode.rateCodeCode, 
                                      date.format('YYYY-MM-DD'), 
                                      checked
                                    )}
                                  />
                                  {/* 第二行：库存信息 */}
                                  <div className="text-xs text-gray-500">
                                    <span>{prices.soldCount}</span> / <span>{prices.remainingCount}</span>
                                  </div>
                                  {/* 第三行：渠道价格 */}
                                  <div className="text-sm text-blue-600">
                                    {formatPrice(prices.channelPrice)}
                                  </div>
                                  {/* 第四行：酒店价格（如果不同） */}
                                  {!isSamePrice && (
                                    <div className="text-xs text-gray-500">
                                      {formatPrice(prices.hotelPrice)}
                                    </div>
                                  )}
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calendar; 