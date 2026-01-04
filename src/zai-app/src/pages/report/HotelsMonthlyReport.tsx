import React, { useState, useMemo } from 'react';
import { DatePicker, Table, Select, Switch, Button, Card, Space, Typography, Row, Col, message } from 'antd';
import { DownOutlined, RightOutlined, SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
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

const manageModes = [
  '置业产权',
  '首酒产权',
  '北展产权',
  '委托管理',
  '特许'
];

interface WeeklyData {
  hotelName: string;
  actual: {
    soldRoomNights: number;
    availableRoomNights: number;
    occupancyRate: number;
    averagePrice: number;
    revPAR: number;
    roomRevenue: number;
    restaurantRevenue: number;
    banquetRevenue: number;
    otherRevenue: number;
    totalRevenue: number;
  };
  current: {
    soldRoomNights: number;
    availableRoomNights: number;
    occupancyRate: number;
    averagePrice: number;
    revPAR: number;
    roomRevenue: number;
    restaurantRevenue: number;
    banquetRevenue: number;
    otherRevenue: number;
    totalRevenue: number;
  };
  budget: {
    soldRoomNights: number;
    availableRoomNights: number;
    occupancyRate: number;
    averagePrice: number;
    revPAR: number;
    roomRevenue: number;
    restaurantRevenue: number;
    banquetRevenue: number;
    otherRevenue: number;
    totalRevenue: number;
  };
  lastYear: {
    soldRoomNights: number;
    availableRoomNights: number;
    occupancyRate: number;
    averagePrice: number;
    revPAR: number;
    roomRevenue: number;
    restaurantRevenue: number;
    banquetRevenue: number;
    otherRevenue: number;
    totalRevenue: number;
  };
}

const mockData: WeeklyData[] = [
  {
    hotelName: '京伦饭店',
    actual: {
      soldRoomNights: 2750,
      availableRoomNights: 3500,
      occupancyRate: 78.6,
      averagePrice: 875,
      revPAR: 687.5,
      roomRevenue: 2406250,
      restaurantRevenue: 1820000,
      banquetRevenue: 670000,
      otherRevenue: 410000,
      totalRevenue: 5306250,
    },
    current: {
      soldRoomNights: 2800,
      availableRoomNights: 3500,
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
      soldRoomNights: 3000,
      availableRoomNights: 3500,
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
      soldRoomNights: 2600,
      availableRoomNights: 3500,
      occupancyRate: 74.3,
      averagePrice: 850,
      revPAR: 631.5,
      roomRevenue: 2210000,
      restaurantRevenue: 1680000,
      banquetRevenue: 580000,
      otherRevenue: 380000,
      totalRevenue: 4850000,
    },
  },
  {
    hotelName: '建国饭店',
    actual: {
      soldRoomNights: 2200,
      availableRoomNights: 3000,
      occupancyRate: 73.3,
      averagePrice: 780,
      revPAR: 572,
      roomRevenue: 1716000,
      restaurantRevenue: 1420000,
      banquetRevenue: 520000,
      otherRevenue: 320000,
      totalRevenue: 3976000,
    },
    current: {
      soldRoomNights: 2200,
      availableRoomNights: 3000,
      occupancyRate: 73.3,
      averagePrice: 780,
      revPAR: 572,
      roomRevenue: 1716000,
      restaurantRevenue: 1420000,
      banquetRevenue: 520000,
      otherRevenue: 320000,
      totalRevenue: 3976000,
    },
    budget: {
      soldRoomNights: 2400,
      availableRoomNights: 3000,
      occupancyRate: 80,
      averagePrice: 800,
      revPAR: 640,
      roomRevenue: 1920000,
      restaurantRevenue: 1500000,
      banquetRevenue: 600000,
      otherRevenue: 380000,
      totalRevenue: 4400000,
    },
    lastYear: {
      soldRoomNights: 2100,
      availableRoomNights: 3000,
      occupancyRate: 70,
      averagePrice: 750,
      revPAR: 525,
      roomRevenue: 1575000,
      restaurantRevenue: 1280000,
      banquetRevenue: 480000,
      otherRevenue: 290000,
      totalRevenue: 3625000,
    },
  },
];

// 添加板块数据接口
interface SectionData {
  title: string;
  data: WeeklyData[];
}

const mockSectionData: SectionData[] = [
  {
    title: '2025年第18周',
    data: mockData,
  },
  {
    title: '年累计',
    data: [
      {
        hotelName: '京伦饭店',
        actual: {
          soldRoomNights: 44800,
          availableRoomNights: 56000,
          occupancyRate: 80,
          averagePrice: 885,
          revPAR: 708,
          roomRevenue: 39648000,
          restaurantRevenue: 29600000,
          banquetRevenue: 10880000,
          otherRevenue: 6720000,
          totalRevenue: 86848000,
        },
        current: {
          soldRoomNights: 44800,
          availableRoomNights: 56000,
          occupancyRate: 80,
          averagePrice: 885,
          revPAR: 708,
          roomRevenue: 39648000,
          restaurantRevenue: 29600000,
          banquetRevenue: 10880000,
          otherRevenue: 6720000,
          totalRevenue: 86848000,
        },
        budget: {
          soldRoomNights: 48000,
          availableRoomNights: 56000,
          occupancyRate: 85.7,
          averagePrice: 905,
          revPAR: 775.6,
          roomRevenue: 43440000,
          restaurantRevenue: 32000000,
          banquetRevenue: 12000000,
          otherRevenue: 7200000,
          totalRevenue: 94640000,
        },
        lastYear: {
          soldRoomNights: 41600,
          availableRoomNights: 56000,
          occupancyRate: 74.3,
          averagePrice: 855,
          revPAR: 635.3,
          roomRevenue: 35568000,
          restaurantRevenue: 26880000,
          banquetRevenue: 9280000,
          otherRevenue: 6080000,
          totalRevenue: 77808000,
        },
      },
      {
        hotelName: '建国饭店',
        actual: {
          soldRoomNights: 35200,
          availableRoomNights: 48000,
          occupancyRate: 73.3,
          averagePrice: 782,
          revPAR: 573.2,
          roomRevenue: 27526400,
          restaurantRevenue: 22720000,
          banquetRevenue: 8320000,
          otherRevenue: 5120000,
          totalRevenue: 63686400,
        },
        current: {
          soldRoomNights: 35200,
          availableRoomNights: 48000,
          occupancyRate: 73.3,
          averagePrice: 782,
          revPAR: 573.2,
          roomRevenue: 27526400,
          restaurantRevenue: 22720000,
          banquetRevenue: 8320000,
          otherRevenue: 5120000,
          totalRevenue: 63686400,
        },
        budget: {
          soldRoomNights: 38400,
          availableRoomNights: 48000,
          occupancyRate: 80,
          averagePrice: 802,
          revPAR: 641.6,
          roomRevenue: 30796800,
          restaurantRevenue: 24000000,
          banquetRevenue: 9600000,
          otherRevenue: 6080000,
          totalRevenue: 70476800,
        },
        lastYear: {
          soldRoomNights: 33600,
          availableRoomNights: 48000,
          occupancyRate: 70,
          averagePrice: 752,
          revPAR: 526.4,
          roomRevenue: 25267200,
          restaurantRevenue: 20480000,
          banquetRevenue: 7680000,
          otherRevenue: 4640000,
          totalRevenue: 58067200,
        },
      },
    ],
  },
  {
    title: '全年',
    data: [
      {
        hotelName: '京伦饭店',
        actual: {
          soldRoomNights: 44800,
          availableRoomNights: 56000,
          occupancyRate: 80,
          averagePrice: 885,
          revPAR: 708,
          roomRevenue: 39648000,
          restaurantRevenue: 29600000,
          banquetRevenue: 10880000,
          otherRevenue: 6720000,
          totalRevenue: 86848000,
        },
        current: {
          soldRoomNights: 44800,
          availableRoomNights: 56000,
          occupancyRate: 80,
          averagePrice: 885,
          revPAR: 708,
          roomRevenue: 39648000,
          restaurantRevenue: 29600000,
          banquetRevenue: 10880000,
          otherRevenue: 6720000,
          totalRevenue: 86848000,
        },
        budget: {
          soldRoomNights: 48000,
          availableRoomNights: 56000,
          occupancyRate: 85.7,
          averagePrice: 905,
          revPAR: 775.6,
          roomRevenue: 43440000,
          restaurantRevenue: 32000000,
          banquetRevenue: 12000000,
          otherRevenue: 7200000,
          totalRevenue: 94640000,
        },
        lastYear: {
          soldRoomNights: 41600,
          availableRoomNights: 56000,
          occupancyRate: 74.3,
          averagePrice: 855,
          revPAR: 635.3,
          roomRevenue: 35568000,
          restaurantRevenue: 26880000,
          banquetRevenue: 9280000,
          otherRevenue: 6080000,
          totalRevenue: 77808000,
        },
      },
      {
        hotelName: '建国饭店',
        actual: {
          soldRoomNights: 35200,
          availableRoomNights: 48000,
          occupancyRate: 73.3,
          averagePrice: 782,
          revPAR: 573.2,
          roomRevenue: 27526400,
          restaurantRevenue: 22720000,
          banquetRevenue: 8320000,
          otherRevenue: 5120000,
          totalRevenue: 63686400,
        },
        current: {
          soldRoomNights: 35200,
          availableRoomNights: 48000,
          occupancyRate: 73.3,
          averagePrice: 782,
          revPAR: 573.2,
          roomRevenue: 27526400,
          restaurantRevenue: 22720000,
          banquetRevenue: 8320000,
          otherRevenue: 5120000,
          totalRevenue: 63686400,
        },
        budget: {
          soldRoomNights: 38400,
          availableRoomNights: 48000,
          occupancyRate: 80,
          averagePrice: 802,
          revPAR: 641.6,
          roomRevenue: 30796800,
          restaurantRevenue: 24000000,
          banquetRevenue: 9600000,
          otherRevenue: 6080000,
          totalRevenue: 70476800,
        },
        lastYear: {
          soldRoomNights: 33600,
          availableRoomNights: 48000,
          occupancyRate: 70,
          averagePrice: 752,
          revPAR: 526.4,
          roomRevenue: 25267200,
          restaurantRevenue: 20480000,
          banquetRevenue: 7680000,
          otherRevenue: 4640000,
          totalRevenue: 58067200,
        },
      },
    ],
  },
];

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

// 创建表格组件
const RevenueTable: React.FC<{
  data: WeeklyData[];
  expanded: boolean;
  sectionType: 'week' | 'month' | 'year';
  actualTitle: string;
}> = ({ data, expanded, sectionType, actualTitle }) => {
  const getCurrentTitle = () => {
    switch (sectionType) {
      case 'week':
        return actualTitle;
      case 'month':
      case 'year':
        return '预测';
      default:
        return '预测';
    }
  };

  const columns = useMemo(() => {
    const getColumnsByGroup = (group: 'actual' | 'current' | 'budget' | 'lastYear' | 'diff' | 'completion' | 'total') => {
      // 展开时显示全部，收起时只显示3列
      if (!expanded) {
        const simpleCols = [
          {
            title: '出租率(%)',
            dataIndex: group === 'diff' || group === 'completion' ? undefined : [group, 'occupancyRate'],
            key: `${group}_occupancyRate`,
            width: 110,
            render: group === 'diff'
              ? (_: any, record: WeeklyData) => `${calculateDiff(record.current.occupancyRate, record.lastYear.occupancyRate, true)}%`
              : group === 'completion'
              ? (_: any, record: WeeklyData) => calculateCompletionRate(record.current.occupancyRate, record.budget.occupancyRate)
              : group === 'total'
              ? (_: any, record: WeeklyData) => `${((record.actual.occupancyRate + record.current.occupancyRate) / 2).toFixed(1)}%`
              : (value: number) => `${value}%`,
          },
          {
            title: '平均房价(元)',
            dataIndex: group === 'diff' || group === 'completion' ? undefined : [group, 'averagePrice'],
            key: `${group}_averagePrice`,
            width: 120,
            render: group === 'diff'
              ? (_: any, record: WeeklyData) => calculateDiff(record.current.averagePrice, record.lastYear.averagePrice)
              : group === 'completion'
              ? (_: any, record: WeeklyData) => calculateCompletionRate(record.current.averagePrice, record.budget.averagePrice)
              : group === 'total'
              ? (_: any, record: WeeklyData) => formatNumber((record.actual.averagePrice + record.current.averagePrice) / 2)
              : (value: number) => formatNumber(value),
          },
          {
            title: '总收入(元)',
            dataIndex: group === 'diff' || group === 'completion' ? undefined : [group, 'totalRevenue'],
            key: `${group}_totalRevenue`,
            width: 130,
            render: group === 'diff'
              ? (_: any, record: WeeklyData) => calculateDiff(record.current.totalRevenue, record.lastYear.totalRevenue)
              : group === 'completion'
              ? (_: any, record: WeeklyData) => calculateCompletionRate(record.current.totalRevenue, record.budget.totalRevenue)
              : group === 'total'
              ? (_: any, record: WeeklyData) => formatNumber(record.actual.totalRevenue + record.current.totalRevenue)
              : (value: number) => formatNumber(value),
          },
        ];
        return simpleCols;
      }
      // 展开时原有全部列
      const allColumns = [
        {
          title: '已售间夜数',
          dataIndex: group === 'diff' || group === 'completion' ? undefined : [group, 'soldRoomNights'],
          key: `${group}_soldRoomNights`,
          width: 100,
          render: group === 'diff'
            ? (_: any, record: WeeklyData) => calculateDiff(record.current.soldRoomNights, record.lastYear.soldRoomNights)
            : group === 'completion'
            ? (_: any, record: WeeklyData) => calculateCompletionRate(record.current.soldRoomNights, record.budget.soldRoomNights)
            : group === 'total'
            ? (_: any, record: WeeklyData) => formatNumber(record.actual.soldRoomNights + record.current.soldRoomNights)
            : (value: number) => formatNumber(value),
        },
        {
          title: '可售间夜数',
          dataIndex: group === 'diff' || group === 'completion' ? undefined : [group, 'availableRoomNights'],
          key: `${group}_availableRoomNights`,
          width: 100,
          render: group === 'diff'
            ? (_: any, record: WeeklyData) => calculateDiff(record.current.availableRoomNights, record.lastYear.availableRoomNights)
            : group === 'completion'
            ? (_: any, record: WeeklyData) => calculateCompletionRate(record.current.availableRoomNights, record.budget.availableRoomNights)
            : group === 'total'
            ? (_: any, record: WeeklyData) => formatNumber(record.actual.availableRoomNights + record.current.availableRoomNights)
            : (value: number) => formatNumber(value),
        },
        {
          title: '出租率(%)',
          dataIndex: group === 'diff' || group === 'completion' ? undefined : [group, 'occupancyRate'],
          key: `${group}_occupancyRate`,
          width: 110,
          render: group === 'diff'
            ? (_: any, record: WeeklyData) => `${calculateDiff(record.current.occupancyRate, record.lastYear.occupancyRate, true)}%`
            : group === 'completion'
            ? (_: any, record: WeeklyData) => calculateCompletionRate(record.current.occupancyRate, record.budget.occupancyRate)
            : group === 'total'
            ? (_: any, record: WeeklyData) => `${((record.actual.occupancyRate + record.current.occupancyRate) / 2).toFixed(1)}%`
            : (value: number) => `${value}%`,
        },
        {
          title: '平均房价(元)',
          dataIndex: group === 'diff' || group === 'completion' ? undefined : [group, 'averagePrice'],
          key: `${group}_averagePrice`,
          width: 120,
          render: group === 'diff'
            ? (_: any, record: WeeklyData) => calculateDiff(record.current.averagePrice, record.lastYear.averagePrice)
            : group === 'completion'
            ? (_: any, record: WeeklyData) => calculateCompletionRate(record.current.averagePrice, record.budget.averagePrice)
            : group === 'total'
            ? (_: any, record: WeeklyData) => formatNumber((record.actual.averagePrice + record.current.averagePrice) / 2)
            : (value: number) => formatNumber(value),
        },
        {
          title: '每房收益',
          dataIndex: group === 'diff' || group === 'completion' ? undefined : [group, 'revPAR'],
          key: `${group}_revPAR`,
          width: 100,
          render: group === 'diff'
            ? (_: any, record: WeeklyData) => calculateDiff(record.current.revPAR, record.lastYear.revPAR)
            : group === 'completion'
            ? (_: any, record: WeeklyData) => calculateCompletionRate(record.current.revPAR, record.budget.revPAR)
            : group === 'total'
            ? (_: any, record: WeeklyData) => formatNumber((record.actual.revPAR + record.current.revPAR) / 2)
            : (value: number) => formatNumber(value),
        },
        {
          title: '客房收入',
          dataIndex: group === 'diff' || group === 'completion' ? undefined : [group, 'roomRevenue'],
          key: `${group}_roomRevenue`,
          width: 100,
          render: group === 'diff'
            ? (_: any, record: WeeklyData) => calculateDiff(record.current.roomRevenue, record.lastYear.roomRevenue)
            : group === 'completion'
            ? (_: any, record: WeeklyData) => calculateCompletionRate(record.current.roomRevenue, record.budget.roomRevenue)
            : group === 'total'
            ? (_: any, record: WeeklyData) => formatNumber(record.actual.roomRevenue + record.current.roomRevenue)
            : (value: number) => formatNumber(value),
        },
        {
          title: '餐厅收入',
          dataIndex: group === 'diff' || group === 'completion' ? undefined : [group, 'restaurantRevenue'],
          key: `${group}_restaurantRevenue`,
          width: 100,
          render: group === 'diff'
            ? (_: any, record: WeeklyData) => calculateDiff(record.current.restaurantRevenue, record.lastYear.restaurantRevenue)
            : group === 'completion'
            ? (_: any, record: WeeklyData) => calculateCompletionRate(record.current.restaurantRevenue, record.budget.restaurantRevenue)
            : group === 'total'
            ? (_: any, record: WeeklyData) => formatNumber(record.actual.restaurantRevenue + record.current.restaurantRevenue)
            : (value: number) => formatNumber(value),
        },
        {
          title: '宴会收入',
          dataIndex: group === 'diff' || group === 'completion' ? undefined : [group, 'banquetRevenue'],
          key: `${group}_banquetRevenue`,
          width: 100,
          render: group === 'diff'
            ? (_: any, record: WeeklyData) => calculateDiff(record.current.banquetRevenue, record.lastYear.banquetRevenue)
            : group === 'completion'
            ? (_: any, record: WeeklyData) => calculateCompletionRate(record.current.banquetRevenue, record.budget.banquetRevenue)
            : group === 'total'
            ? (_: any, record: WeeklyData) => formatNumber(record.actual.banquetRevenue + record.current.banquetRevenue)
            : (value: number) => formatNumber(value),
        },
        {
          title: '其他收入',
          dataIndex: group === 'diff' || group === 'completion' ? undefined : [group, 'otherRevenue'],
          key: `${group}_otherRevenue`,
          width: 100,
          render: group === 'diff'
            ? (_: any, record: WeeklyData) => calculateDiff(record.current.otherRevenue, record.lastYear.otherRevenue)
            : group === 'completion'
            ? (_: any, record: WeeklyData) => calculateCompletionRate(record.current.otherRevenue, record.budget.otherRevenue)
            : group === 'total'
            ? (_: any, record: WeeklyData) => formatNumber(record.actual.otherRevenue + record.current.otherRevenue)
            : (value: number) => formatNumber(value),
        },
        {
          title: '总收入(元)',
          dataIndex: group === 'diff' || group === 'completion' ? undefined : [group, 'totalRevenue'],
          key: `${group}_totalRevenue`,
          width: 130,
          render: group === 'diff'
            ? (_: any, record: WeeklyData) => calculateDiff(record.current.totalRevenue, record.lastYear.totalRevenue)
            : group === 'completion'
            ? (_: any, record: WeeklyData) => calculateCompletionRate(record.current.totalRevenue, record.budget.totalRevenue)
            : group === 'total'
            ? (_: any, record: WeeklyData) => formatNumber(record.actual.totalRevenue + record.current.totalRevenue)
            : (value: number) => formatNumber(value),
        },
      ];
      return allColumns;
    };

    return [
      {
        title: '项目',
        dataIndex: 'hotelName',
        key: 'hotelName',
        fixed: 'left' as const,
        width: 200,
      },
      ...(sectionType === 'week' ? [] : [{
        title: '实际',
        children: getColumnsByGroup('actual'),
      }]),
      {
        title: getCurrentTitle(),
        children: getColumnsByGroup('current'),
      },
      ...(sectionType === 'month' || sectionType === 'year' ? [{
        title: '合计',
        children: getColumnsByGroup('total'),
      }] : []),
      {
        title: '去年同期',
        children: getColumnsByGroup('lastYear'),
      },
      {
        title: '差异',
        children: getColumnsByGroup('diff'),
      },
      {
        title: '预算',
        children: getColumnsByGroup('budget'),
      },
      {
        title: '完成率',
        children: getColumnsByGroup('completion'),
      },
    ];
  }, [expanded, sectionType, actualTitle]);

  return (
    <Table
      columns={columns}
      dataSource={data}
      bordered
      size="middle"
      scroll={{ x: 'max-content' }}
      pagination={false}
      rowKey="hotelName"
    />
  );
};

// 复制自 HotelDailyReport.tsx
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
const hotelList = [
  '前门建国饭店', '北京民族饭店', '京伦饭店', '北京建国饭店', '西苑饭店', '国际饭店', '东方饭店', '崇文门饭店',
  '香山饭店', '北京展览馆宾馆', '宣武门商务酒店', '和平里大酒店', '新侨饭店', '郑州建国饭店', '西苑建国饭店',
  '西安建国饭店', '广州建国酒店', '亚洲大酒店', '北京工大建国酒店', '北京松鹤建国培训中心', '北京宁建雁栖湖酒店',
  '北京唯实国际文化交流中心', '沙河唯实国际文化交流中心', '北京园博大酒店', '北京银保建国酒店', '绿博园建国饭店',
  '郑州奥体建国饭店', '韶山建国酒店', '武汉东方建国酒店', '宝鸡建国饭店', '南阳建国饭店', '滑南建国饭店B座',
  '甘肃长城建国饭店', '杭州白马湖建国饭店', '苏州黎花建国假日酒店', '三亚红塘湾建国酒店', '遵义中建国饭店',
  '昌吉建国饭店', '秦皇岛首旅京伦酒店', '平遥峰岩建国饭店', '江诚建国饭店', '通化丽景建国饭店',
  '平舆建国国际酒店', '海阳建国饭店', '文县正南红种湾京伦饭店', '泸州建国饭店', '江西文澳建国饭店',
  '瑞昌建国', '凤凰大厦建国饭店', '江苏常熟沙家浜建国铂华酒店', '兴安盟建国饭店', '运城建国饭店',
  '南丘信华建国饭店', '好苑建国饭店', '丹东威尼斯酒店', '呼伦贝尔首旅京伦酒店', '元和建国酒店',
  '迁安建国饭店', '云冈建国饭店', '九江信华建国饭店', '长恨宫森林建国酒店', '仙居岭京伦酒店',
  '威海海悦建国酒店', '雁荡山建国饭店', '三亚石溪墅建国度假酒店', '庐华温泉建国饭店', '郑州山商建国饭店',
  '正南南溪酒店', '库尔勒康城建国国际酒店', '渑池建国商务饭店', '福建广建国酒店'
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

const HotelWeeklyReport: React.FC = () => {
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([dayjs(), dayjs()]);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [selectedManageTypes, setSelectedManageTypes] = useState<string[]>([]);
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>([]);
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [selectedCityAreas, setSelectedCityAreas] = useState<string[]>([]);
  const [selectedStoreAges, setSelectedStoreAges] = useState<string[]>([]);
  const [expanded, setExpanded] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  // 判断所选日期范围是否包含本月或未来
  const isForecast = dateRange[0].isSame(dayjs(), 'month') || dateRange[0].isAfter(dayjs(), 'month');

  const toggleSection = (sectionTitle: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle]
    }));
  };

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
                  value={dateRange[0]}
                  onChange={(date) => {
                    if (date) {
                      setDateRange([date, date]);
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
                <Space>
                  <span>展开</span>
                  <Switch
                    checked={expanded}
                    onChange={setExpanded}
                  />
                  <Button type="primary">查询</Button>
                  <Button>重置</Button>
                </Space>
              </Col>
            </Row>
          </Space>
        </Card>

        {/* 数据表格区域 */}
        <Card>
          {mockSectionData.map((section, index) => (
            <div key={section.title} style={{ marginBottom: 20 }}>
              <div 
                style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                onClick={() => toggleSection(section.title)}
              >
                {collapsedSections[section.title] ? (
                  <RightOutlined style={{ marginRight: 8 }} />
                ) : (
                  <DownOutlined style={{ marginRight: 8 }} />
                )}
                <h3 style={{ margin: 0 }}>{index === 0 ? `${dateRange[0].year()}年${dateRange[0].format('MM')}月` : section.title}</h3>
              </div>
              <div style={{ marginLeft: 24, padding: 16, border: '1px solid #f0f0f0', borderRadius: 4, ...(collapsedSections[section.title] ? { display: 'none' } : {}) }}>
                <RevenueTable 
                  data={section.data} 
                  expanded={expanded} 
                  sectionType={index === 0 ? 'week' : index === 1 ? 'month' : 'year'}
                  actualTitle={isForecast ? '预测' : '实际'}
                />
              </div>
            </div>
          ))}
        </Card>
      </div>
    </TokenCheck>
  );
};

export default HotelWeeklyReport; 