import React, { useState } from 'react';
import { DatePicker, Select, Button, Table, Card, Space, Typography, Row, Col, message } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';
import 'antd/dist/reset.css';
import TokenCheck from '../../components/common/TokenCheck';

// 设置 dayjs 语言为中文
dayjs.locale('zh-cn');

// 自定义周格式化函数
const weekFormat = (date: dayjs.Dayjs) => {
  const year = date.format('YYYY');
  const week = date.format('w');
  return `${year}-第${week}周`;
};

const hotels = [
  '前门建国饭店',
  '北京民族饭店',
  '京伦饭店',
  '北京建国饭店',
  '西苑饭店',
  '国际饭店',
  '东方饭店',
  '崇文门饭店',
  '香山饭店',
  '北京展览馆宾馆',
  '京都信苑酒店',
  '和平里大酒店',
  '新侨饭店',
  '郑州建国饭店',
  '西安建国饭店',
  '广州建国酒店',
  '亚洲大酒店',
  '北京工人建国饭店',
  '北京松鹤建国培训中心',
  '北京中建雅悦酒店',
  '北京建国国际文化交流中心',
  '沙河建国际文化交流中心',
  '北京昆仑大酒店',
  '北京银保建国酒店',
  '绿博园建国饭店',
  '郑州奥体建国饭店',
  '眉山建国饭店',
  '武汉东方建国大酒店',
  '宝鸡建国饭店',
  '湖南建国饭店',
  '清青建国饭店B座',
  '甘肃长城建国饭店',
  '杭州自己湖建国饭店',
  '苏州姑苏建国度假酒店',
  '三亚红榈建国度假酒店',
  '漫心中建建国酒店',
  '青岛上合建国酒店',
  '昌吉建国饭店',
  '泰皇岛首旅京伦酒店',
  '平遥建国饭店',
  '辽诺建国饭店',
  '通化京景建国饭店',
  '平果建国饭店',
  '海阳建国饭店',
  '文昌工商红椰湾洱伦饭店',
  '泸州建国饭店',
  '安庆建国饭店',
  '江西文洪建国饭店',
  '瑞阳建国',
  '凤凰大厦建国饭店',
  '江苏常熟沙家浜建国度假酒店',
  '双安建国饭店',
  '运城建国饭店',
  '商丘恒华建国酒店',
  '九江贤中建国饭店',
  '特发建国饭店',
  '丹东威尼斯酒店',
  '呼伦贝尔首旅京伦酒店',
  '云和建国饭店',
  '汪安建国饭店',
  '云岗建国饭店',
  '九江恒华建国饭店',
  '长德生物酒店',
  '仙居岭秀化酒店',
  '威海海悦建国饭店',
  '青海山庄饭店',
  '三亚石榴建国度假酒店',
  '庐江温泉建国饭店',
  '郑州正商建国饭店',
  '上岛咖啡茶店',
  '库尔勒建国大酒店',
  '港联建国商务饭店',
  '福建江州建国',
  '永丰大酒店',
  '明珠北大酒店'
];

interface WeeklyData {
  actualRoomNights: number;
  availableRoomNights: number;
  occupancyRate: number;
  averagePrice: number;
  revPAR: number;
  roomRevenue: number;
  restaurantRevenue: number;
  banquetRevenue: number;
  otherRevenue: number;
  totalRevenue: number;
}

interface HotelData {
  actual: WeeklyData;
  forecast: WeeklyData;
  budget: WeeklyData;
  lastYear: WeeklyData;
}

const mockData: HotelData = {
  actual: {
    actualRoomNights: 11500,
    availableRoomNights: 15000,
    occupancyRate: 76.7,
    averagePrice: 870,
    revPAR: 667.3,
    roomRevenue: 2335000,
    restaurantRevenue: 1800000,
    banquetRevenue: 650000,
    otherRevenue: 400000,
    totalRevenue: 5185000,
  },
  forecast: {
    actualRoomNights: 12000,
    availableRoomNights: 15000,
    occupancyRate: 80,
    averagePrice: 880,
    revPAR: 704,
    roomRevenue: 2464000,
    restaurantRevenue: 1850000,
    banquetRevenue: 680000,
    otherRevenue: 420000,
    totalRevenue: 5414000,
  },
  budget: {
    actualRoomNights: 12855,
    availableRoomNights: 15000,
    occupancyRate: 85.7,
    averagePrice: 900,
    revPAR: 771.3,
    roomRevenue: 2700000,
    restaurantRevenue: 2000000,
    banquetRevenue: 750000,
    otherRevenue: 450000,
    totalRevenue: 5900000,
  },
  lastYear: {
    actualRoomNights: 11145,
    availableRoomNights: 15000,
    occupancyRate: 74.3,
    averagePrice: 850,
    revPAR: 631.5,
    roomRevenue: 2210000,
    restaurantRevenue: 1680000,
    banquetRevenue: 580000,
    otherRevenue: 380000,
    totalRevenue: 4850000,
  },
};

// 格式化数字
const formatNumber = (num: number, decimals: number = 0) => {
  if (decimals === 0) {
    return num.toLocaleString('zh-CN', { maximumFractionDigits: 0 });
  }
  return num.toLocaleString('zh-CN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
};

// 计算差异
const calculateDiff = (current: number, lastYear: number, isPercentage: boolean = false) => {
  const diff = current - lastYear;
  if (isPercentage) {
    return diff.toFixed(1);
  }
  return formatNumber(diff);
};

// 计算完成率
const calculateCompletionRate = (actual: number, budget: number) => {
  if (budget === 0) return '0.0%';
  return `${((actual / budget) * 100).toFixed(1)}%`;
};

// 复制自 HotelWeeklyReport.tsx
const companyOptions = [
  { label: '诺金国际', value: '诺金国际' },
  { label: '首旅建国', value: '首旅建国' },
  { label: '首旅京伦', value: '首旅京伦' },
  { label: '首旅南苑', value: '首旅南苑' },
  { label: '首旅安诺', value: '首旅安诺' },
  { label: '诺金管理', value: '诺金管理' },
  { label: '凯燕', value: '凯燕' },
  { label: '安麓', value: '安麓' },
];
const manageTypeOptions = [
  { label: '委托管理', value: '委托管理' },
  { label: '合资委管', value: '合资委管' },
  { label: '特许加盟', value: '特许加盟' },
];
const propertyTypeOptions = [
  { label: '首旅集团', value: '首旅集团' },
  { label: '首旅置业', value: '首旅置业' },
  { label: '首酒集团', value: '首酒集团' },
  { label: '北展', value: '北展' },
  { label: '非产权店', value: '非产权店' },
];

const getTableColumns = (forecastTitle: string) => [
  {
    title: '指标',
    dataIndex: 'metric',
    key: 'metric',
    fixed: 'left' as const,
    width: 140,
  },
  {
    title: '实际',
    children: [
      { title: '当月', dataIndex: 'actual_month', key: 'actual_month', width: 100 },
      { title: '年累计', dataIndex: 'actual_year', key: 'actual_year', width: 100 },
      { title: '全年', dataIndex: 'actual_total', key: 'actual_total', width: 100 },
    ],
  },
  {
    title: forecastTitle,
    children: [
      { title: '当月', dataIndex: 'forecast_month', key: 'forecast_month', width: 100 },
      { title: '年累计', dataIndex: 'forecast_year', key: 'forecast_year', width: 100 },
      { title: '全年', dataIndex: 'forecast_total', key: 'forecast_total', width: 100 },
    ],
  },
  {
    title: '合计',
    children: [
      { title: '当月', dataIndex: 'total_month', key: 'total_month', width: 100 },
      { title: '年累计', dataIndex: 'total_year', key: 'total_year', width: 100 },
      { title: '全年', dataIndex: 'total_total', key: 'total_total', width: 100 },
    ],
  },
  {
    title: '去年同期',
    children: [
      { title: '当月', dataIndex: 'lastYear_month', key: 'lastYear_month', width: 100 },
      { title: '年累计', dataIndex: 'lastYear_year', key: 'lastYear_year', width: 100 },
      { title: '全年', dataIndex: 'lastYear_total', key: 'lastYear_total', width: 100 },
    ],
  },
  {
    title: '差异',
    children: [
      { title: '当月', dataIndex: 'diff_month', key: 'diff_month', width: 100 },
      { title: '年累计', dataIndex: 'diff_year', key: 'diff_year', width: 100 },
      { title: '全年', dataIndex: 'diff_total', key: 'diff_total', width: 100 },
    ],
  },
  {
    title: '预算',
    children: [
      { title: '当月', dataIndex: 'budget_month', key: 'budget_month', width: 100 },
      { title: '年累计', dataIndex: 'budget_year', key: 'budget_year', width: 100 },
      { title: '全年', dataIndex: 'budget_total', key: 'budget_total', width: 100 },
    ],
  },
  {
    title: '完成率',
    children: [
      { title: '当月', dataIndex: 'completion_month', key: 'completion_month', width: 100 },
      { title: '年累计', dataIndex: 'completion_year', key: 'completion_year', width: 100 },
      { title: '全年', dataIndex: 'completion_total', key: 'completion_total', width: 100 },
    ],
  },
];

const getTableData = () => [
  {
    key: 'actualRoomNights',
    metric: '实际出租间夜数',
    actual_month: formatNumber(mockData.actual.actualRoomNights),
    actual_year: formatNumber(mockData.actual.actualRoomNights),
    actual_total: formatNumber(mockData.actual.actualRoomNights),
    forecast_month: formatNumber(mockData.forecast.actualRoomNights),
    forecast_year: formatNumber(mockData.forecast.actualRoomNights),
    forecast_total: formatNumber(mockData.forecast.actualRoomNights),
    total_month: formatNumber(mockData.actual.actualRoomNights + mockData.forecast.actualRoomNights),
    total_year: formatNumber(mockData.actual.actualRoomNights + mockData.forecast.actualRoomNights),
    total_total: formatNumber(mockData.actual.actualRoomNights + mockData.forecast.actualRoomNights),
    lastYear_month: formatNumber(mockData.lastYear.actualRoomNights),
    lastYear_year: formatNumber(mockData.lastYear.actualRoomNights),
    lastYear_total: formatNumber(mockData.lastYear.actualRoomNights),
    diff_month: calculateDiff(mockData.forecast.actualRoomNights, mockData.lastYear.actualRoomNights),
    diff_year: calculateDiff(mockData.forecast.actualRoomNights, mockData.lastYear.actualRoomNights),
    diff_total: calculateDiff(mockData.forecast.actualRoomNights, mockData.lastYear.actualRoomNights),
    budget_month: formatNumber(mockData.budget.actualRoomNights),
    budget_year: formatNumber(mockData.budget.actualRoomNights),
    budget_total: formatNumber(mockData.budget.actualRoomNights),
    completion_month: calculateCompletionRate(mockData.forecast.actualRoomNights, mockData.budget.actualRoomNights),
    completion_year: calculateCompletionRate(mockData.forecast.actualRoomNights, mockData.budget.actualRoomNights),
    completion_total: calculateCompletionRate(mockData.forecast.actualRoomNights, mockData.budget.actualRoomNights),
  },
  {
    key: 'availableRoomNights',
    metric: '可出租间夜数',
    actual_month: formatNumber(mockData.actual.availableRoomNights),
    actual_year: formatNumber(mockData.actual.availableRoomNights),
    actual_total: formatNumber(mockData.actual.availableRoomNights),
    forecast_month: formatNumber(mockData.forecast.availableRoomNights),
    forecast_year: formatNumber(mockData.forecast.availableRoomNights),
    forecast_total: formatNumber(mockData.forecast.availableRoomNights),
    total_month: formatNumber(mockData.actual.availableRoomNights + mockData.forecast.availableRoomNights),
    total_year: formatNumber(mockData.actual.availableRoomNights + mockData.forecast.availableRoomNights),
    total_total: formatNumber(mockData.actual.availableRoomNights + mockData.forecast.availableRoomNights),
    lastYear_month: formatNumber(mockData.lastYear.availableRoomNights),
    lastYear_year: formatNumber(mockData.lastYear.availableRoomNights),
    lastYear_total: formatNumber(mockData.lastYear.availableRoomNights),
    diff_month: calculateDiff(mockData.forecast.availableRoomNights, mockData.lastYear.availableRoomNights),
    diff_year: calculateDiff(mockData.forecast.availableRoomNights, mockData.lastYear.availableRoomNights),
    diff_total: calculateDiff(mockData.forecast.availableRoomNights, mockData.lastYear.availableRoomNights),
    budget_month: formatNumber(mockData.budget.availableRoomNights),
    budget_year: formatNumber(mockData.budget.availableRoomNights),
    budget_total: formatNumber(mockData.budget.availableRoomNights),
    completion_month: calculateCompletionRate(mockData.forecast.availableRoomNights, mockData.budget.availableRoomNights),
    completion_year: calculateCompletionRate(mockData.forecast.availableRoomNights, mockData.budget.availableRoomNights),
    completion_total: calculateCompletionRate(mockData.forecast.availableRoomNights, mockData.budget.availableRoomNights),
  },
  {
    key: 'occupancyRate',
    metric: '出租率(%)',
    actual_month: mockData.actual.occupancyRate,
    actual_year: mockData.actual.occupancyRate,
    actual_total: mockData.actual.occupancyRate,
    forecast_month: mockData.forecast.occupancyRate,
    forecast_year: mockData.forecast.occupancyRate,
    forecast_total: mockData.forecast.occupancyRate,
    lastYear_month: mockData.lastYear.occupancyRate,
    lastYear_year: mockData.lastYear.occupancyRate,
    lastYear_total: mockData.lastYear.occupancyRate,
    diff_month: `${calculateDiff(mockData.forecast.occupancyRate, mockData.lastYear.occupancyRate, true)}%`,
    diff_year: `${calculateDiff(mockData.forecast.occupancyRate, mockData.lastYear.occupancyRate, true)}%`,
    diff_total: `${calculateDiff(mockData.forecast.occupancyRate, mockData.lastYear.occupancyRate, true)}%`,
    budget_month: mockData.budget.occupancyRate,
    budget_year: mockData.budget.occupancyRate,
    budget_total: mockData.budget.occupancyRate,
    completion_month: calculateCompletionRate(mockData.forecast.occupancyRate, mockData.budget.occupancyRate),
    completion_year: calculateCompletionRate(mockData.forecast.occupancyRate, mockData.budget.occupancyRate),
    completion_total: calculateCompletionRate(mockData.forecast.occupancyRate, mockData.budget.occupancyRate),
  },
  {
    key: 'averagePrice',
    metric: '平均房价(元)',
    actual_month: formatNumber(mockData.actual.averagePrice),
    actual_year: formatNumber(mockData.actual.averagePrice),
    actual_total: formatNumber(mockData.actual.averagePrice),
    forecast_month: formatNumber(mockData.forecast.averagePrice),
    forecast_year: formatNumber(mockData.forecast.averagePrice),
    forecast_total: formatNumber(mockData.forecast.averagePrice),
    lastYear_month: formatNumber(mockData.lastYear.averagePrice),
    lastYear_year: formatNumber(mockData.lastYear.averagePrice),
    lastYear_total: formatNumber(mockData.lastYear.averagePrice),
    diff_month: calculateDiff(mockData.forecast.averagePrice, mockData.lastYear.averagePrice),
    diff_year: calculateDiff(mockData.forecast.averagePrice, mockData.lastYear.averagePrice),
    diff_total: calculateDiff(mockData.forecast.averagePrice, mockData.lastYear.averagePrice),
    budget_month: formatNumber(mockData.budget.averagePrice),
    budget_year: formatNumber(mockData.budget.averagePrice),
    budget_total: formatNumber(mockData.budget.averagePrice),
    completion_month: calculateCompletionRate(mockData.forecast.averagePrice, mockData.budget.averagePrice),
    completion_year: calculateCompletionRate(mockData.forecast.averagePrice, mockData.budget.averagePrice),
    completion_total: calculateCompletionRate(mockData.forecast.averagePrice, mockData.budget.averagePrice),
  },
  {
    key: 'revPAR',
    metric: '每房收益(元)',
    actual_month: formatNumber(mockData.actual.revPAR),
    actual_year: formatNumber(mockData.actual.revPAR),
    actual_total: formatNumber(mockData.actual.revPAR),
    forecast_month: formatNumber(mockData.forecast.revPAR),
    forecast_year: formatNumber(mockData.forecast.revPAR),
    forecast_total: formatNumber(mockData.forecast.revPAR),
    lastYear_month: formatNumber(mockData.lastYear.revPAR),
    lastYear_year: formatNumber(mockData.lastYear.revPAR),
    lastYear_total: formatNumber(mockData.lastYear.revPAR),
    diff_month: calculateDiff(mockData.forecast.revPAR, mockData.lastYear.revPAR),
    diff_year: calculateDiff(mockData.forecast.revPAR, mockData.lastYear.revPAR),
    diff_total: calculateDiff(mockData.forecast.revPAR, mockData.lastYear.revPAR),
    budget_month: formatNumber(mockData.budget.revPAR),
    budget_year: formatNumber(mockData.budget.revPAR),
    budget_total: formatNumber(mockData.budget.revPAR),
    completion_month: calculateCompletionRate(mockData.forecast.revPAR, mockData.budget.revPAR),
    completion_year: calculateCompletionRate(mockData.forecast.revPAR, mockData.budget.revPAR),
    completion_total: calculateCompletionRate(mockData.forecast.revPAR, mockData.budget.revPAR),
  },
  {
    key: 'roomRevenue',
    metric: '客房收入(元)',
    actual_month: formatNumber(mockData.actual.roomRevenue),
    actual_year: formatNumber(mockData.actual.roomRevenue),
    actual_total: formatNumber(mockData.actual.roomRevenue),
    forecast_month: formatNumber(mockData.forecast.roomRevenue),
    forecast_year: formatNumber(mockData.forecast.roomRevenue),
    forecast_total: formatNumber(mockData.forecast.roomRevenue),
    lastYear_month: formatNumber(mockData.lastYear.roomRevenue),
    lastYear_year: formatNumber(mockData.lastYear.roomRevenue),
    lastYear_total: formatNumber(mockData.lastYear.roomRevenue),
    diff_month: calculateDiff(mockData.forecast.roomRevenue, mockData.lastYear.roomRevenue),
    diff_year: calculateDiff(mockData.forecast.roomRevenue, mockData.lastYear.roomRevenue),
    diff_total: calculateDiff(mockData.forecast.roomRevenue, mockData.lastYear.roomRevenue),
    budget_month: formatNumber(mockData.budget.roomRevenue),
    budget_year: formatNumber(mockData.budget.roomRevenue),
    budget_total: formatNumber(mockData.budget.roomRevenue),
    completion_month: calculateCompletionRate(mockData.forecast.roomRevenue, mockData.budget.roomRevenue),
    completion_year: calculateCompletionRate(mockData.forecast.roomRevenue, mockData.budget.roomRevenue),
    completion_total: calculateCompletionRate(mockData.forecast.roomRevenue, mockData.budget.roomRevenue),
  },
  {
    key: 'restaurantRevenue',
    metric: '餐厅收入(元)',
    actual_month: formatNumber(mockData.actual.restaurantRevenue),
    actual_year: formatNumber(mockData.actual.restaurantRevenue),
    actual_total: formatNumber(mockData.actual.restaurantRevenue),
    forecast_month: formatNumber(mockData.forecast.restaurantRevenue),
    forecast_year: formatNumber(mockData.forecast.restaurantRevenue),
    forecast_total: formatNumber(mockData.forecast.restaurantRevenue),
    lastYear_month: formatNumber(mockData.lastYear.restaurantRevenue),
    lastYear_year: formatNumber(mockData.lastYear.restaurantRevenue),
    lastYear_total: formatNumber(mockData.lastYear.restaurantRevenue),
    diff_month: calculateDiff(mockData.forecast.restaurantRevenue, mockData.lastYear.restaurantRevenue),
    diff_year: calculateDiff(mockData.forecast.restaurantRevenue, mockData.lastYear.restaurantRevenue),
    diff_total: calculateDiff(mockData.forecast.restaurantRevenue, mockData.lastYear.restaurantRevenue),
    budget_month: formatNumber(mockData.budget.restaurantRevenue),
    budget_year: formatNumber(mockData.budget.restaurantRevenue),
    budget_total: formatNumber(mockData.budget.restaurantRevenue),
    completion_month: calculateCompletionRate(mockData.forecast.restaurantRevenue, mockData.budget.restaurantRevenue),
    completion_year: calculateCompletionRate(mockData.forecast.restaurantRevenue, mockData.budget.restaurantRevenue),
    completion_total: calculateCompletionRate(mockData.forecast.restaurantRevenue, mockData.budget.restaurantRevenue),
  },
  {
    key: 'banquetRevenue',
    metric: '宴会收入(元)',
    actual_month: formatNumber(mockData.actual.banquetRevenue),
    actual_year: formatNumber(mockData.actual.banquetRevenue),
    actual_total: formatNumber(mockData.actual.banquetRevenue),
    forecast_month: formatNumber(mockData.forecast.banquetRevenue),
    forecast_year: formatNumber(mockData.forecast.banquetRevenue),
    forecast_total: formatNumber(mockData.forecast.banquetRevenue),
    lastYear_month: formatNumber(mockData.lastYear.banquetRevenue),
    lastYear_year: formatNumber(mockData.lastYear.banquetRevenue),
    lastYear_total: formatNumber(mockData.lastYear.banquetRevenue),
    diff_month: calculateDiff(mockData.forecast.banquetRevenue, mockData.lastYear.banquetRevenue),
    diff_year: calculateDiff(mockData.forecast.banquetRevenue, mockData.lastYear.banquetRevenue),
    diff_total: calculateDiff(mockData.forecast.banquetRevenue, mockData.lastYear.banquetRevenue),
    budget_month: formatNumber(mockData.budget.banquetRevenue),
    budget_year: formatNumber(mockData.budget.banquetRevenue),
    budget_total: formatNumber(mockData.budget.banquetRevenue),
    completion_month: calculateCompletionRate(mockData.forecast.banquetRevenue, mockData.budget.banquetRevenue),
    completion_year: calculateCompletionRate(mockData.forecast.banquetRevenue, mockData.budget.banquetRevenue),
    completion_total: calculateCompletionRate(mockData.forecast.banquetRevenue, mockData.budget.banquetRevenue),
  },
  {
    key: 'otherRevenue',
    metric: '其他收入(元)',
    actual_month: formatNumber(mockData.actual.otherRevenue),
    actual_year: formatNumber(mockData.actual.otherRevenue),
    actual_total: formatNumber(mockData.actual.otherRevenue),
    forecast_month: formatNumber(mockData.forecast.otherRevenue),
    forecast_year: formatNumber(mockData.forecast.otherRevenue),
    forecast_total: formatNumber(mockData.forecast.otherRevenue),
    lastYear_month: formatNumber(mockData.lastYear.otherRevenue),
    lastYear_year: formatNumber(mockData.lastYear.otherRevenue),
    lastYear_total: formatNumber(mockData.lastYear.otherRevenue),
    diff_month: calculateDiff(mockData.forecast.otherRevenue, mockData.lastYear.otherRevenue),
    diff_year: calculateDiff(mockData.forecast.otherRevenue, mockData.lastYear.otherRevenue),
    diff_total: calculateDiff(mockData.forecast.otherRevenue, mockData.lastYear.otherRevenue),
    budget_month: formatNumber(mockData.budget.otherRevenue),
    budget_year: formatNumber(mockData.budget.otherRevenue),
    budget_total: formatNumber(mockData.budget.otherRevenue),
    completion_month: calculateCompletionRate(mockData.forecast.otherRevenue, mockData.budget.otherRevenue),
    completion_year: calculateCompletionRate(mockData.forecast.otherRevenue, mockData.budget.otherRevenue),
    completion_total: calculateCompletionRate(mockData.forecast.otherRevenue, mockData.budget.otherRevenue),
  },
  {
    key: 'totalRevenue',
    metric: '总收入(元)',
    actual_month: formatNumber(mockData.actual.totalRevenue),
    actual_year: formatNumber(mockData.actual.totalRevenue),
    actual_total: formatNumber(mockData.actual.totalRevenue),
    forecast_month: formatNumber(mockData.forecast.totalRevenue),
    forecast_year: formatNumber(mockData.forecast.totalRevenue),
    forecast_total: formatNumber(mockData.forecast.totalRevenue),
    lastYear_month: formatNumber(mockData.lastYear.totalRevenue),
    lastYear_year: formatNumber(mockData.lastYear.totalRevenue),
    lastYear_total: formatNumber(mockData.lastYear.totalRevenue),
    diff_month: calculateDiff(mockData.forecast.totalRevenue, mockData.lastYear.totalRevenue),
    diff_year: calculateDiff(mockData.forecast.totalRevenue, mockData.lastYear.totalRevenue),
    diff_total: calculateDiff(mockData.forecast.totalRevenue, mockData.lastYear.totalRevenue),
    budget_month: formatNumber(mockData.budget.totalRevenue),
    budget_year: formatNumber(mockData.budget.totalRevenue),
    budget_total: formatNumber(mockData.budget.totalRevenue),
    completion_month: calculateCompletionRate(mockData.forecast.totalRevenue, mockData.budget.totalRevenue),
    completion_year: calculateCompletionRate(mockData.forecast.totalRevenue, mockData.budget.totalRevenue),
    completion_total: calculateCompletionRate(mockData.forecast.totalRevenue, mockData.budget.totalRevenue),
  },
];

// 添加大区、城区、店龄选项
const districtOptions = [
  { label: '一区', value: '一区' },
  { label: '二区', value: '二区' },
];

const cityAreaOptions = [
  { label: '华中', value: '华中' },
  { label: '华南', value: '华南' },
  { label: '华北', value: '华北' },
  { label: '华东', value: '华东' },
  { label: '华西', value: '华西' },
];

const storeAgeOptions = [
  { label: '1年内', value: '1年内' },
  { label: '1-3年', value: '1-3年' },
  { label: '3-7年', value: '3-7年' },
  { label: '7年以上', value: '7年以上' },
];

const HotelSingleWeeklyReport: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState<dayjs.Dayjs>(dayjs());
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [selectedManageTypes, setSelectedManageTypes] = useState<string[]>([]);
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>([]);
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [selectedCityAreas, setSelectedCityAreas] = useState<string[]>([]);
  const [selectedStoreAges, setSelectedStoreAges] = useState<string[]>([]);
  const [selectedHotel, setSelectedHotel] = useState<string>(hotels[0]);

  // 移除日期判断逻辑
  const forecastTitle = '预测';

  return (
    <TokenCheck>
      <div className="p-6">
        {/* 查询条件区域 */}
        <Card style={{ marginBottom: '24px' }}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Typography.Title level={4}>酒店月度报表</Typography.Title>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={8} lg={6}>
                <DatePicker.MonthPicker
                  value={selectedMonth}
                  onChange={(date) => {
                    if (date) {
                      setSelectedMonth(date);
                    }
                  }}
                  allowClear={false}
                  format="YYYY-MM"
                  locale={locale}
                  style={{ width: '100%' }}
                  placeholder="选择月份"
                />
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Select
                  mode="multiple"
                  allowClear
                  placeholder="管理公司"
                  style={{ width: '100%' }}
                  options={companyOptions}
                  value={selectedCompanies}
                  onChange={setSelectedCompanies}
                />
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Select
                  mode="multiple"
                  allowClear
                  placeholder="产权类型"
                  style={{ width: '100%' }}
                  options={propertyTypeOptions}
                  value={selectedPropertyTypes}
                  onChange={setSelectedPropertyTypes}
                />
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Select
                  mode="multiple"
                  allowClear
                  placeholder="管理类型"
                  style={{ width: '100%' }}
                  options={manageTypeOptions}
                  value={selectedManageTypes}
                  onChange={setSelectedManageTypes}
                />
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Select
                  mode="multiple"
                  allowClear
                  placeholder="大区"
                  style={{ width: '100%' }}
                  options={districtOptions}
                  value={selectedDistricts}
                  onChange={setSelectedDistricts}
                />
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Select
                  mode="multiple"
                  allowClear
                  placeholder="城区"
                  style={{ width: '100%' }}
                  options={cityAreaOptions}
                  value={selectedCityAreas}
                  onChange={setSelectedCityAreas}
                />
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Select
                  mode="multiple"
                  allowClear
                  placeholder="店龄"
                  style={{ width: '100%' }}
                  options={storeAgeOptions}
                  value={selectedStoreAges}
                  onChange={setSelectedStoreAges}
                />
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Select
                  showSearch
                  allowClear
                  placeholder="选择酒店"
                  style={{ width: '100%' }}
                  options={hotels.map(hotel => ({ label: hotel, value: hotel }))}
                  value={selectedHotel}
                  onChange={setSelectedHotel}
                  filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                />
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Space>
                  <Button type="primary">查询</Button>
                  <Button>重置</Button>
                </Space>
              </Col>
            </Row>
          </Space>
        </Card>

        {/* 数据表格区域 */}
        <Card>
          <Table
            columns={getTableColumns(forecastTitle)}
            dataSource={getTableData()}
            bordered
            size="middle"
            scroll={{ x: 'max-content' }}
            pagination={false}
          />
        </Card>
      </div>
    </TokenCheck>
  );
};

export default HotelSingleWeeklyReport; 