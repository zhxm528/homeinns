import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Row,
  Col,
  Button,
  Table,
  DatePicker,
  Select,
  Input,
  Space,
  Typography,
  message,
  Tag
} from 'antd';
import { SearchOutlined, ReloadOutlined, DownloadOutlined, DownOutlined, RightOutlined, CloseOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import LineChart from '@/components/echart/LineChart';
import PieChart from '@/components/echart/PieChart';
import type { EChartsOption } from 'echarts';

const { RangePicker } = DatePicker;
const { Title } = Typography;
const { Option } = Select;

// 日期类型枚举
const DATE_TYPES = [
  { value: 'booking', label: '预订日期' },
  { value: 'checkout', label: '离店日期' }
];

// 区域枚举
const REGIONS = [
  { value: 'south', label: '华南' },
  { value: 'central', label: '华中' },
  { value: 'north', label: '华北' }
];



// 活动分类枚举
const ACTIVITY_CATEGORIES = [
  { value: 'early_booking', label: '早订' },
  { value: 'continuous_stay', label: '连住' },
  { value: 'same_day', label: '当天' },
  { value: 'crowd', label: '人群' }
];

// 日期粒度枚举
const DATE_GRANULARITIES = [
  { value: 'day', label: '按天' },
  { value: 'week', label: '按周' },
  { value: 'month', label: '按月' },
  { value: 'quarter', label: '按季度' },
  { value: 'year', label: '按年' }
];

// 展示粒度枚举
const DISPLAY_GRANULARITIES = [
  { value: 'activity_category', label: '活动分类' },
  { value: 'activity_theme', label: '活动主题' },
  { value: 'activity_id', label: '活动ID' }
];

// 模拟数据接口
interface ProductionData {
  key: string;
  date: string;
  orderCount: number;
  roomNights: number;
  roomRate: number;
  averageRate: number;
  advanceBookingDays: number;
  stayDays: number;
}

// 查询条件接口
interface QueryParams {
  dateRange: [dayjs.Dayjs, dayjs.Dayjs];
  dateGranularity: string;
  displayGranularity: string;
  dateType: string;
  chains: string[];
  regions: string[];
  cities: string[];
  hotels: string[];
  activityCategories: string[];
  activityThemes: string[];
  activityIds: string;
  channels: string[];
}

const ProductionReport: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<ProductionData[]>([]);
  const [summary, setSummary] = useState<ProductionData | null>(null);
  const [queryPanelCollapsed, setQueryPanelCollapsed] = useState(false);
  const [resultPanelCollapsed, setResultPanelCollapsed] = useState(false);
  const [trendPanelCollapsed, setTrendPanelCollapsed] = useState(false);
  const [pieChartPanelCollapsed, setPieChartPanelCollapsed] = useState(false);
  const [selectedConditions, setSelectedConditions] = useState<Array<{ key: string; label: string; value: string }>>([]);

  // 初始化表单默认值并加载默认数据
  useEffect(() => {
    const today = dayjs();
    const thirtyDaysAgo = today.subtract(30, 'day');
    
    const defaultValues: QueryParams = {
      dateRange: [thirtyDaysAgo, today],
      dateGranularity: 'day',
      displayGranularity: 'activity_category',
      dateType: 'booking',
      chains: [],
      regions: [],
      cities: [],
      hotels: [],
      activityCategories: [],
      activityThemes: [],
      activityIds: '',
      channels: []
    };
    
    form.setFieldsValue(defaultValues);
    
    // 加载默认模拟数据
    const mockData = generateMockData(defaultValues);
    setDataSource(mockData);
    
    const summaryData = calculateSummary(mockData);
    setSummary(summaryData);
    
    // 更新已选条件
    updateSelectedConditions(defaultValues);
  }, [form]);

  // 生成模拟数据
  const generateMockData = (params: QueryParams): ProductionData[] => {
    const { dateRange, dateGranularity } = params;
    const [startDate] = dateRange;
    const mockData: ProductionData[] = [];
    
    // 生成5条固定的模拟数据
    for (let i = 0; i < 5; i++) {
      let dateStr: string;
      let displayDate: string;
      
      // 根据日期粒度计算日期和显示格式
      switch (dateGranularity) {
        case 'day':
          const dayDate = startDate.add(i, 'day');
          dateStr = dayDate.format('YYYY-MM-DD');
          displayDate = dayDate.format('MM-DD');
          break;
        case 'week':
          const weekDate = startDate.add(i, 'week');
          dateStr = weekDate.format('YYYY-MM-DD');
          displayDate = `${weekDate.format('MM-DD')}周`;
          break;
        case 'month':
          const monthDate = startDate.add(i, 'month');
          dateStr = monthDate.format('YYYY-MM-DD');
          displayDate = monthDate.format('YYYY-MM');
          break;
        case 'quarter':
          const quarterDate = startDate.add(i * 3, 'month');
          dateStr = quarterDate.format('YYYY-MM-DD');
          const quarter = Math.ceil((quarterDate.month() + 1) / 3);
          displayDate = `${quarterDate.year()}Q${quarter}`;
          break;
        case 'year':
          const yearDate = startDate.add(i, 'year');
          dateStr = yearDate.format('YYYY-MM-DD');
          displayDate = yearDate.format('YYYY');
          break;
        default:
          const defaultDate = startDate.add(i, 'day');
          dateStr = defaultDate.format('YYYY-MM-DD');
          displayDate = defaultDate.format('MM-DD');
      }
      
      // 根据日期粒度调整数据范围
      let orderCount: number;
      let roomNights: number;
      let roomRate: number;
      let averageRate: number;
      
      switch (dateGranularity) {
        case 'day':
          orderCount = Math.floor(Math.random() * 50) + 10;
          roomNights = Math.floor(Math.random() * 100) + 20;
          roomRate = Math.floor(Math.random() * 200) + 100;
          averageRate = Math.floor(Math.random() * 300) + 150;
          break;
        case 'week':
          orderCount = Math.floor(Math.random() * 200) + 50;
          roomNights = Math.floor(Math.random() * 400) + 100;
          roomRate = Math.floor(Math.random() * 200) + 100;
          averageRate = Math.floor(Math.random() * 300) + 150;
          break;
        case 'month':
          orderCount = Math.floor(Math.random() * 800) + 200;
          roomNights = Math.floor(Math.random() * 1500) + 400;
          roomRate = Math.floor(Math.random() * 200) + 100;
          averageRate = Math.floor(Math.random() * 300) + 150;
          break;
        case 'quarter':
          orderCount = Math.floor(Math.random() * 2400) + 600;
          roomNights = Math.floor(Math.random() * 4500) + 1200;
          roomRate = Math.floor(Math.random() * 200) + 100;
          averageRate = Math.floor(Math.random() * 300) + 150;
          break;
        case 'year':
          orderCount = Math.floor(Math.random() * 9600) + 2400;
          roomNights = Math.floor(Math.random() * 18000) + 4800;
          roomRate = Math.floor(Math.random() * 200) + 100;
          averageRate = Math.floor(Math.random() * 300) + 150;
          break;
        default:
          orderCount = Math.floor(Math.random() * 50) + 10;
          roomNights = Math.floor(Math.random() * 100) + 20;
          roomRate = Math.floor(Math.random() * 200) + 100;
          averageRate = Math.floor(Math.random() * 300) + 150;
      }
      
      mockData.push({
        key: i.toString(),
        date: displayDate,
        orderCount,
        roomNights,
        roomRate,
        averageRate,
        advanceBookingDays: Math.floor(Math.random() * 30) + 1,
        stayDays: Math.floor(Math.random() * 5) + 1
      });
    }
    
    return mockData;
  };

  // 计算汇总数据
  const calculateSummary = (data: ProductionData[]): ProductionData => {
    if (data.length === 0) {
          return {
      key: 'summary',
      date: '汇总',
      orderCount: 0,
      roomNights: 0,
      roomRate: 0,
      averageRate: 0,
      advanceBookingDays: 0,
      stayDays: 0
    };
    }

    const totalOrderCount = data.reduce((sum, item) => sum + item.orderCount, 0);
    const totalRoomNights = data.reduce((sum, item) => sum + item.roomNights, 0);
    const totalRoomRate = data.reduce((sum, item) => sum + item.roomRate, 0);
    const totalAdvanceBookingDays = data.reduce((sum, item) => sum + item.advanceBookingDays, 0);
    const totalStayDays = data.reduce((sum, item) => sum + item.stayDays, 0);

    return {
      key: 'summary',
      date: '汇总',
      orderCount: totalOrderCount,
      roomNights: totalRoomNights,
      roomRate: totalRoomRate,
      averageRate: totalRoomNights > 0 ? Math.round(totalRoomRate / totalRoomNights) : 0,
      advanceBookingDays: totalOrderCount > 0 ? Math.round(totalAdvanceBookingDays / totalOrderCount) : 0,
      stayDays: totalOrderCount > 0 ? Math.round(totalStayDays / totalOrderCount) : 0
    };
  };

  // 查询数据
  const handleSearch = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData = generateMockData(values);
      setDataSource(mockData);
      
      const summaryData = calculateSummary(mockData);
      setSummary(summaryData);
      
      // 更新已选条件
      updateSelectedConditions(values);
      
      message.success('查询成功');
    } catch (error) {
      console.error('查询失败:', error);
      message.error('查询失败，请检查查询条件');
    } finally {
      setLoading(false);
    }
  };

  // 重置查询条件
  const handleReset = () => {
    form.resetFields();
    const today = dayjs();
    const thirtyDaysAgo = today.subtract(30, 'day');
    
    form.setFieldsValue({
      dateRange: [thirtyDaysAgo, today],
      dateGranularity: 'day',
      dateType: 'booking',
      chains: [],
      regions: [],
      cities: [],
      hotels: [],
      activityCategories: [],
      activityThemes: [],
      activityIds: [],
      channels: []
    });
  };

  // 导出数据
  const handleExport = () => {
    if (dataSource.length === 0) {
      message.warning('暂无数据可导出');
      return;
    }
    message.success('导出功能待实现');
  };

  // 日期粒度变化处理
  const handleDateGranularityChange = (value: string) => {
    const currentValues = form.getFieldsValue();
    const updatedValues = { ...currentValues, dateGranularity: value };
    
    const mockData = generateMockData(updatedValues);
    setDataSource(mockData);
    
    const summaryData = calculateSummary(mockData);
    setSummary(summaryData);
    
    // 更新已选条件
    updateSelectedConditions(updatedValues);
  };

  // 格式化已选条件
  const formatSelectedConditions = (values: any): Array<{ key: string; label: string; value: string }> => {
    const conditions: Array<{ key: string; label: string; value: string }> = [];
    
    // 日期范围
    if (values.dateRange && values.dateRange.length === 2) {
      const startDate = values.dateRange[0].format('YYYY-MM-DD');
      const endDate = values.dateRange[1].format('YYYY-MM-DD');
      conditions.push({
        key: 'dateRange',
        label: '日期范围',
        value: `${startDate} 至 ${endDate}`
      });
    }
    
    // 日期粒度
    if (values.dateGranularity) {
      const granularityLabel = DATE_GRANULARITIES.find(item => item.value === values.dateGranularity)?.label || values.dateGranularity;
      conditions.push({
        key: 'dateGranularity',
        label: '日期粒度',
        value: granularityLabel
      });
    }
    
    // 展示粒度
    if (values.displayGranularity) {
      const displayGranularityLabel = DISPLAY_GRANULARITIES.find(item => item.value === values.displayGranularity)?.label || values.displayGranularity;
      conditions.push({
        key: 'displayGranularity',
        label: '展示粒度',
        value: displayGranularityLabel
      });
    }
    
    // 日期类型
    if (values.dateType) {
      const dateTypeLabel = DATE_TYPES.find(item => item.value === values.dateType)?.label || values.dateType;
      conditions.push({
        key: 'dateType',
        label: '日期类型',
        value: dateTypeLabel
      });
    }
    
    // 品牌
    if (values.chains && values.chains.length > 0) {
      const chainLabels = values.chains.map((chain: string) => {
        const chainMap: { [key: string]: string } = {
          'chain1': '如家至尊',
          'chain2': '如家精选',
          'chain3': '如家商旅',
          'chain4': '如家睿柏'
        };
        return chainMap[chain] || chain;
      });
      conditions.push({
        key: 'chains',
        label: '品牌',
        value: chainLabels.join('、')
      });
    }
    
    // 区域
    if (values.regions && values.regions.length > 0) {
      const regionLabels = values.regions.map((region: string) => {
        const regionMap: { [key: string]: string } = {
          'south': '华南',
          'central': '华中',
          'north': '华北'
        };
        return regionMap[region] || region;
      });
      conditions.push({
        key: 'regions',
        label: '区域',
        value: regionLabels.join('、')
      });
    }
    
    // 城市
    if (values.cities && values.cities.length > 0) {
      const cityLabels = values.cities.map((city: string) => {
        const cityMap: { [key: string]: string } = {
          'beijing': '北京',
          'shanghai': '上海',
          'guangzhou': '广州',
          'shenzhen': '深圳',
          'hangzhou': '杭州'
        };
        return cityMap[city] || city;
      });
      conditions.push({
        key: 'cities',
        label: '城市',
        value: cityLabels.join('、')
      });
    }
    
    // 酒店
    if (values.hotels && values.hotels.length > 0) {
      const hotelLabels = values.hotels.map((hotel: string) => {
        const hotelMap: { [key: string]: string } = {
          'hotel1': '如家至尊(北京店)',
          'hotel2': '如家至尊(上海店)',
          'hotel3': '如家至尊(广州店)',
          'hotel4': '如家至尊(深圳店)'
        };
        return hotelMap[hotel] || hotel;
      });
      conditions.push({
        key: 'hotels',
        label: '酒店',
        value: hotelLabels.join('、')
      });
    }
    
    // 活动分类
    if (values.activityCategories && values.activityCategories.length > 0) {
      const categoryLabels = values.activityCategories.map((category: string) => {
        const categoryMap: { [key: string]: string } = {
          'early_booking': '早订',
          'continuous_stay': '连住',
          'same_day': '当天',
          'crowd': '人群'
        };
        return categoryMap[category] || category;
      });
      conditions.push({
        key: 'activityCategories',
        label: '活动分类',
        value: categoryLabels.join('、')
      });
    }
    
    // 活动主题
    if (values.activityThemes && values.activityThemes.length > 0) {
      const themeLabels = values.activityThemes.map((theme: string) => {
        const themeMap: { [key: string]: string } = {
          'theme1': '春节特惠',
          'theme2': '暑期亲子游',
          'theme3': '商务出行',
          'theme4': '周末休闲'
        };
        return themeMap[theme] || theme;
      });
      conditions.push({
        key: 'activityThemes',
        label: '活动主题',
        value: themeLabels.join('、')
      });
    }
    
    // 活动ID
    if (values.activityIds && values.activityIds.trim()) {
      conditions.push({
        key: 'activityIds',
        label: '活动ID',
        value: values.activityIds
      });
    }
    
    // 渠道
    if (values.channels && values.channels.length > 0) {
      const channelLabels = values.channels.map((channel: string) => {
        const channelMap: { [key: string]: string } = {
          'channel1': '携程',
          'channel2': '去哪儿',
          'channel3': '飞猪',
          'channel4': '美团',
          'channel5': '官网'
        };
        return channelMap[channel] || channel;
      });
      conditions.push({
        key: 'channels',
        label: '渠道',
        value: channelLabels.join('、')
      });
    }
    

    
    return conditions;
  };

  // 更新已选条件
  const updateSelectedConditions = (values: any) => {
    const conditions = formatSelectedConditions(values);
    setSelectedConditions(conditions);
  };

  // 清除单个条件
  const handleRemoveCondition = (conditionKey: string) => {
    const currentValues = form.getFieldsValue();
    let updatedValues = { ...currentValues };
    
    // 根据条件类型重置对应的表单字段
    switch (conditionKey) {
      case 'dateRange':
        const today = dayjs();
        const thirtyDaysAgo = today.subtract(30, 'day');
        updatedValues.dateRange = [thirtyDaysAgo, today];
        break;
      case 'dateGranularity':
        updatedValues.dateGranularity = 'day';
        break;
      case 'displayGranularity':
        updatedValues.displayGranularity = 'activity_category';
        break;
      case 'dateType':
        updatedValues.dateType = 'booking';
        break;
      case 'chains':
        updatedValues.chains = [];
        break;
      case 'regions':
        updatedValues.regions = [];
        break;
      case 'cities':
        updatedValues.cities = [];
        break;
      case 'hotels':
        updatedValues.hotels = [];
        break;
      case 'activityCategories':
        updatedValues.activityCategories = [];
        break;
      case 'activityThemes':
        updatedValues.activityThemes = [];
        break;
      case 'activityIds':
        updatedValues.activityIds = '';
        break;
      case 'channels':
        updatedValues.channels = [];
        break;
    }
    
    // 更新表单值
    form.setFieldsValue(updatedValues);
    
    // 重新生成数据
    const mockData = generateMockData(updatedValues);
    setDataSource(mockData);
    
    const summaryData = calculateSummary(mockData);
    setSummary(summaryData);
    
    // 更新已选条件
    updateSelectedConditions(updatedValues);
  };

  // 表格列定义
  const columns = [
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      width: 120,
      fixed: 'left' as const
    },
    {
      title: '订单数',
      dataIndex: 'orderCount',
      key: 'orderCount',
      width: 100,
      align: 'right' as const,
      render: (value: number) => value.toLocaleString()
    },
    {
      title: '间夜数',
      dataIndex: 'roomNights',
      key: 'roomNights',
      width: 100,
      align: 'right' as const,
      render: (value: number) => value.toLocaleString()
    },
    {
      title: '房价',
      dataIndex: 'roomRate',
      key: 'roomRate',
      width: 120,
      align: 'right' as const,
      render: (value: number) => `¥${value.toLocaleString()}`
    },
    {
      title: '平均房价',
      dataIndex: 'averageRate',
      key: 'averageRate',
      width: 120,
      align: 'right' as const,
      render: (value: number) => `¥${value.toLocaleString()}`
    },
    {
      title: '提前预订天数',
      dataIndex: 'advanceBookingDays',
      key: 'advanceBookingDays',
      width: 140,
      align: 'right' as const,
      render: (value: number) => `${value}天`
    },
    {
      title: '入住天数',
      dataIndex: 'stayDays',
      key: 'stayDays',
      width: 100,
      align: 'right' as const,
      render: (value: number) => `${value}天`
    }
  ];

  // 合并数据和汇总行
  const tableData = summary ? [...dataSource, summary] : dataSource;

  // 根据展示粒度生成不同的数据结构
  const generateDisplayData = () => {
    const displayGranularity = form.getFieldValue('displayGranularity');
    
    switch (displayGranularity) {
      case 'activity_category':
        return [
          {
            key: 'early_booking',
            title: '早订',
            data: tableData
          },
          {
            key: 'continuous_stay',
            title: '连住',
            data: tableData
          },
          {
            key: 'same_day',
            title: '当天',
            data: tableData
          },
          {
            key: 'crowd',
            title: '人群',
            data: tableData
          }
        ];
      case 'activity_theme':
        return [
          {
            key: 'theme1',
            title: '春节特惠',
            data: tableData
          },
          {
            key: 'theme2',
            title: '暑期亲子游',
            data: tableData
          },
          {
            key: 'theme3',
            title: '商务出行',
            data: tableData
          },
          {
            key: 'theme4',
            title: '周末休闲',
            data: tableData
          }
        ];
      case 'activity_id':
        return [
          {
            key: 'activity_001',
            title: '活动ID: ACT001',
            data: tableData
          },
          {
            key: 'activity_002',
            title: '活动ID: ACT002',
            data: tableData
          },
          {
            key: 'activity_003',
            title: '活动ID: ACT003',
            data: tableData
          },
          {
            key: 'activity_004',
            title: '活动ID: ACT004',
            data: tableData
          }
        ];
      default:
        return [
          {
            key: 'default',
            title: '查询结果',
            data: tableData
          }
        ];
    }
  };

  const displayData = generateDisplayData();

  // 生成图表配置
  const generateChartOption = (): EChartsOption => {
    const displayGranularity = form.getFieldValue('displayGranularity');
    const dates = dataSource.map(item => item.date);
    
    // 根据展示粒度生成不同的系列数据
    let series: any[] = [];
    
    // 生成基于实际数据的模拟多系列数据
    const generateSeriesData = (baseData: number[], variation: number = 0.3) => {
      return baseData.map(value => {
        const variationAmount = value * variation;
        const randomVariation = (Math.random() - 0.5) * variationAmount;
        return Math.max(0, Math.round(value + randomVariation));
      });
    };
    
    switch (displayGranularity) {
      case 'activity_category':
        const baseRoomNights = dataSource.map(item => item.roomNights);
        series = [
          {
            name: '早订',
            type: 'line',
            data: generateSeriesData(baseRoomNights, 0.4),
            smooth: false,
            lineStyle: { color: '#1890ff' }
          },
          {
            name: '连住',
            type: 'line',
            data: generateSeriesData(baseRoomNights, 0.3),
            smooth: false,
            lineStyle: { color: '#52c41a' }
          },
          {
            name: '当天',
            type: 'line',
            data: generateSeriesData(baseRoomNights, 0.2),
            smooth: false,
            lineStyle: { color: '#faad14' }
          },
          {
            name: '人群',
            type: 'line',
            data: generateSeriesData(baseRoomNights, 0.25),
            smooth: false,
            lineStyle: { color: '#f5222d' }
          }
        ];
        break;
      case 'activity_theme':
        const baseRoomNightsTheme = dataSource.map(item => item.roomNights);
        series = [
          {
            name: '春节特惠',
            type: 'line',
            data: generateSeriesData(baseRoomNightsTheme, 0.5),
            smooth: false,
            lineStyle: { color: '#1890ff' }
          },
          {
            name: '暑期亲子游',
            type: 'line',
            data: generateSeriesData(baseRoomNightsTheme, 0.4),
            smooth: false,
            lineStyle: { color: '#52c41a' }
          },
          {
            name: '商务出行',
            type: 'line',
            data: generateSeriesData(baseRoomNightsTheme, 0.35),
            smooth: false,
            lineStyle: { color: '#faad14' }
          },
          {
            name: '周末休闲',
            type: 'line',
            data: generateSeriesData(baseRoomNightsTheme, 0.3),
            smooth: false,
            lineStyle: { color: '#f5222d' }
          }
        ];
        break;
      case 'activity_id':
        const baseRoomNightsId = dataSource.map(item => item.roomNights);
        series = [
          {
            name: 'ACT001',
            type: 'line',
            data: generateSeriesData(baseRoomNightsId, 0.4),
            smooth: false,
            lineStyle: { color: '#1890ff' }
          },
          {
            name: 'ACT002',
            type: 'line',
            data: generateSeriesData(baseRoomNightsId, 0.3),
            smooth: false,
            lineStyle: { color: '#52c41a' }
          },
          {
            name: 'ACT003',
            type: 'line',
            data: generateSeriesData(baseRoomNightsId, 0.25),
            smooth: false,
            lineStyle: { color: '#faad14' }
          },
          {
            name: 'ACT004',
            type: 'line',
            data: generateSeriesData(baseRoomNightsId, 0.2),
            smooth: false,
            lineStyle: { color: '#f5222d' }
          }
        ];
        break;
      default:
        series = [
          {
            name: '间夜量',
            type: 'line',
            data: dataSource.map(item => item.roomNights),
            smooth: false,
            lineStyle: { color: '#1890ff' }
          }
        ];
    }

    return {
      title: {
        text: '间夜量趋势图',
        left: 'center',
        textStyle: {
          fontSize: 16,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        },
        formatter: (params: any) => {
          let result = `${params[0].axisValue}<br/>`;
          params.forEach((param: any) => {
            result += `${param.marker}${param.seriesName}: ${param.value}间夜<br/>`;
          });
          return result;
        }
      },
      legend: {
        data: series.map(s => s.name),
        top: 30,
        type: 'scroll'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: dates,
        axisLabel: {
          rotate: 45
        }
      },
      yAxis: {
        type: 'value',
        name: '间夜量',
        nameLocation: 'middle',
        nameGap: 50,
        axisLabel: {
          formatter: '{value}'
        }
      },
      series: series
    };
  };

  // 生成饼状图配置
  const generatePieChartOption = (): EChartsOption => {
    // 活动主题数据
    const activityThemes = [
      { name: '春节特惠', value: 0 },
      { name: '暑期亲子游', value: 0 },
      { name: '商务出行', value: 0 },
      { name: '周末休闲', value: 0 }
    ];

    // 根据数据源计算各活动主题的间夜量
    const totalRoomNights = dataSource.reduce((sum, item) => sum + item.roomNights, 0);
    
    // 为每个活动主题分配间夜量（基于总间夜量的比例）
    activityThemes[0].value = Math.round(totalRoomNights * 0.35); // 春节特惠 35%
    activityThemes[1].value = Math.round(totalRoomNights * 0.25); // 暑期亲子游 25%
    activityThemes[2].value = Math.round(totalRoomNights * 0.25); // 商务出行 25%
    activityThemes[3].value = Math.round(totalRoomNights * 0.15); // 周末休闲 15%

    return {
      title: {
        text: '活动主题间夜量分布',
        left: 'center',
        textStyle: {
          fontSize: 16,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        top: 'middle',
        data: activityThemes.map(item => item.name)
      },
      series: [
        {
          name: '间夜量',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['60%', '50%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '18',
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: activityThemes.map((item, index) => ({
            value: item.value,
            name: item.name,
            itemStyle: {
              color: ['#1890ff', '#52c41a', '#faad14', '#f5222d'][index]
            }
          }))
        }
      ]
    };
  };

  return (
    <div style={{ padding: '24px' }}>
            
      {/* 查询条件 */}
      <Card 
        title={
          <div 
            style={{ cursor: 'pointer', userSelect: 'none', display: 'flex', alignItems: 'center' }}
            onClick={() => setQueryPanelCollapsed(!queryPanelCollapsed)}
          >
            {queryPanelCollapsed ? <RightOutlined style={{ marginRight: '8px' }} /> : <DownOutlined style={{ marginRight: '8px' }} />}
            查询条件
          </div>
        }
        style={{ marginBottom: '24px' }}
        bodyStyle={{ display: queryPanelCollapsed ? 'none' : 'block' }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSearch}
        >
          <Row gutter={[16, 16]}>

            {/* 日期类型 */}
            <Col span={4}>
              <Form.Item
                label="日期类型"
                name="dateType"
                rules={[{ required: true, message: '请选择日期类型' }]}
              >
                <Select size="large" placeholder="选择日期类型">
                  {DATE_TYPES.map(item => (
                    <Option key={item.value} value={item.value}>
                      {item.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            {/* 日期范围 */}
            <Col span={8}>
              <Form.Item
                label="日期范围"
                name="dateRange"
                rules={[{ required: true, message: '请选择日期范围' }]}
                style={{ marginBottom: '16px' }}
              >
                <RangePicker
                  style={{ width: '100%' }}
                  size="large"
                  format="YYYY-MM-DD"
                />
              </Form.Item>
            </Col>

            {/* 日期粒度 */}
            <Col span={4}>
              <Form.Item
                label="日期粒度"
                name="dateGranularity"
                rules={[{ required: true, message: '请选择日期粒度' }]}
              >
                <Select 
                  size="large" 
                  placeholder="选择日期粒度"
                  onChange={handleDateGranularityChange}
                >
                  {DATE_GRANULARITIES.map(item => (
                    <Option key={item.value} value={item.value}>
                      {item.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            {/* 展示粒度 */}
            <Col span={4}>
              <Form.Item
                label="展示粒度"
                name="displayGranularity"
                rules={[{ required: true, message: '请选择展示粒度' }]}
              >
                <Select 
                  size="large" 
                  placeholder="选择展示粒度"
                >
                  {DISPLAY_GRANULARITIES.map(item => (
                    <Option key={item.value} value={item.value}>
                      {item.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            {/* 区域 */}
            <Col span={4}>
              <Form.Item label="区域" name="regions">
                <Select
                  mode="multiple"
                  size="large"
                  placeholder="请选择区域"
                  allowClear
                  options={REGIONS.map(item => ({
                    value: item.value,
                    label: item.label
                  }))}
                />
              </Form.Item>
            </Col>

            {/* 城市 */}
            <Col span={4}>
              <Form.Item label="城市" name="cities">
                <Select
                  mode="multiple"
                  size="large"
                  placeholder="请选择城市"
                  allowClear
                  showSearch
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  options={[
                    { value: 'beijing', label: '北京' },
                    { value: 'shanghai', label: '上海' },
                    { value: 'guangzhou', label: '广州' },
                    { value: 'shenzhen', label: '深圳' },
                    { value: 'hangzhou', label: '杭州' }
                  ]}
                />
              </Form.Item>
            </Col>

            

            {/* 品牌 */}
            <Col span={4}>
              <Form.Item label="品牌" name="chains">
                <Select
                  mode="multiple"
                  size="large"
                  placeholder="请选择品牌"
                  allowClear
                  showSearch
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  options={[
                    { value: 'chain1', label: '如家至尊' },
                    { value: 'chain2', label: '如家精选' },
                    { value: 'chain3', label: '如家商旅' },
                    { value: 'chain4', label: '如家睿柏' }
                  ]}
                />
              </Form.Item>
            </Col>

            {/* 酒店 */}
            <Col span={4}>
              <Form.Item label="酒店" name="hotels">
                <Select
                  mode="multiple"
                  size="large"
                  placeholder="请选择酒店"
                  allowClear
                  showSearch
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  options={[
                    { value: 'hotel1', label: '如家至尊(北京店)' },
                    { value: 'hotel2', label: '如家至尊(上海店)' },
                    { value: 'hotel3', label: '如家至尊(广州店)' },
                    { value: 'hotel4', label: '如家至尊(深圳店)' }
                  ]}
                />
              </Form.Item>
            </Col>

            {/* 渠道 */}
            <Col span={4}>
              <Form.Item label="渠道" name="channels">
                <Select
                  mode="multiple"
                  size="large"
                  placeholder="请选择渠道"
                  allowClear
                  showSearch
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  options={[
                    { value: 'channel1', label: '携程' },
                    { value: 'channel2', label: '去哪儿' },
                    { value: 'channel3', label: '飞猪' },
                    { value: 'channel4', label: '美团' },
                    { value: 'channel5', label: '官网' }
                  ]}
                />
              </Form.Item>
            </Col>

            {/* 活动分类 */}
            <Col span={4}>
              <Form.Item label="活动分类" name="activityCategories">
                <Select
                  mode="multiple"
                  size="large"
                  placeholder="请选择活动分类"
                  allowClear
                  options={ACTIVITY_CATEGORIES.map(item => ({
                    value: item.value,
                    label: item.label
                  }))}
                />
              </Form.Item>
            </Col>

            {/* 活动主题 */}
            <Col span={4}>
              <Form.Item label="活动主题" name="activityThemes">
                <Select
                  mode="multiple"
                  size="large"
                  placeholder="请选择活动主题"
                  allowClear
                  showSearch
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  options={[
                    { value: 'theme1', label: '春节特惠' },
                    { value: 'theme2', label: '暑期亲子游' },
                    { value: 'theme3', label: '商务出行' },
                    { value: 'theme4', label: '周末休闲' }
                  ]}
                />
              </Form.Item>
            </Col>

            {/* 活动ID */}
            <Col span={4}>
              <Form.Item label="活动ID" name="activityIds">
                <Input
                  size="large"
                  placeholder="请输入活动ID"
                  allowClear
                />
              </Form.Item>
            </Col>


          </Row>

          {/* 操作按钮 */}
          <Row>
            <Col span={24}>
              <div style={{ marginTop: '16px' }}>
                <Space>
                  <Button
                    type="primary"
                    icon={<SearchOutlined />}
                    onClick={handleSearch}
                    loading={loading}
                    size="large"
                  >
                    查询
                  </Button>
                  <Button
                    icon={<ReloadOutlined />}
                    onClick={handleReset}
                    size="large"
                  >
                    重置
                  </Button>
                  <Button
                    icon={<DownloadOutlined />}
                    onClick={handleExport}
                    size="large"
                  >
                    导出
                  </Button>
                </Space>
              </div>
            </Col>
          </Row>
        </Form>
      </Card>

      {/* 已选条件 */}
      {selectedConditions.length > 0 && (
        <Card 
          title="已选条件"
          style={{ marginTop: '16px', marginBottom: '16px' }}
          size="small"
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {selectedConditions.map(condition => (
              <Tag
                key={condition.key}
                closable
                onClose={() => handleRemoveCondition(condition.key)}
                style={{ marginBottom: '4px' }}
              >
                <span style={{ fontWeight: 'bold' }}>{condition.label}:</span> {condition.value}
              </Tag>
            ))}
          </div>
        </Card>
      )}

      {/* 趋势预览 */}
      <Card 
        title={
          <div 
            style={{ cursor: 'pointer', userSelect: 'none', display: 'flex', alignItems: 'center' }}
            onClick={() => setTrendPanelCollapsed(!trendPanelCollapsed)}
          >
            {trendPanelCollapsed ? <RightOutlined style={{ marginRight: '8px' }} /> : <DownOutlined style={{ marginRight: '8px' }} />}
            趋势预览
          </div>
        }
        style={{ marginTop: '16px' }}
        bodyStyle={{ display: trendPanelCollapsed ? 'none' : 'block' }}
      >
        <LineChart 
          id="trend-chart" 
          option={generateChartOption()} 
        />
      </Card>

      {/* 活动主题分布 */}
      <Card 
        title={
          <div 
            style={{ cursor: 'pointer', userSelect: 'none', display: 'flex', alignItems: 'center' }}
            onClick={() => setPieChartPanelCollapsed(!pieChartPanelCollapsed)}
          >
            {pieChartPanelCollapsed ? <RightOutlined style={{ marginRight: '8px' }} /> : <DownOutlined style={{ marginRight: '8px' }} />}
            活动主题分布
          </div>
        }
        style={{ marginTop: '16px' }}
        bodyStyle={{ display: pieChartPanelCollapsed ? 'none' : 'block' }}
      >
        <PieChart 
          id="pie-chart" 
          option={generatePieChartOption()} 
        />
      </Card>

      {/* 查询结果 */}
      <Card 
        title={
          <div 
            style={{ cursor: 'pointer', userSelect: 'none', display: 'flex', alignItems: 'center' }}
            onClick={() => setResultPanelCollapsed(!resultPanelCollapsed)}
          >
            {resultPanelCollapsed ? <RightOutlined style={{ marginRight: '8px' }} /> : <DownOutlined style={{ marginRight: '8px' }} />}
            查询结果
          </div>
        }
        style={{ marginTop: '16px' }}
        bodyStyle={{ display: resultPanelCollapsed ? 'none' : 'block' }}
      >
        <div style={{ overflowX: 'auto' }}>
          {displayData.map((panel, index) => (
            <Card
              key={panel.key}
              title={panel.title}
              style={{ marginBottom: index < displayData.length - 1 ? '16px' : 0 }}
              size="small"
            >
              <Table
                columns={columns}
                dataSource={panel.data}
                loading={loading}
                scroll={{ x: 1000 }}
                pagination={false}
                size="middle"
                rowClassName={(record) => {
                  return record.key === 'summary' ? 'ant-table-row-summary' : '';
                }}
                summary={() => null}
              />
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default ProductionReport;