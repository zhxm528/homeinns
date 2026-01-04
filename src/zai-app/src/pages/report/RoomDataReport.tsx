import React, { useState, useEffect, useRef } from 'react';
import { Card, DatePicker, Select, Button, Row, Col, Space, Typography } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';
import TokenCheck from '@/components/common/TokenCheck';

// 引入封装好的组件
import MetricCard from '@/components/echart/MetricCard';
import PieChart from '@/components/echart/PieChart';
import BarChart from '@/components/echart/BarChart';

// 图表数据接口
interface ChartData {
  title: string;
  unit: string;
  actual: number;
  budget: number;
  lastYear: number;
  budgetRate: string;
  yearRate: string;
  isPercentage?: boolean;
}

// 酒店与筛选项
const hotelList = [
  '前门建国饭店', '北京民族饭店', '京伦饭店', '北京建国饭店', '西苑饭店', '国际饭店', '东方饭店', '崇文门饭店',
  // ...其余省略
];

const companyOptions = [
  { label: '诺金国际', value: '诺金国际' },
  { label: '首旅建国', value: '首旅建国' },
  // ...其余省略
];

const manageTypeOptions = [
  { label: '委托管理', value: '委托管理' },
  { label: '合资委管', value: '合资委管' },
  { label: '特许加盟', value: '特许加盟' },
];

const propertyTypeOptions = [
  { label: '首旅集团', value: '首旅集团' },
  { label: '首旅置业', value: '首旅置业' },
  // ...其余省略
];

// 图表数据定义
const chartDataMap: Record<string, ChartData> = {
  occupancyRate: {
    title: '出租率',
    unit: '%',
    actual: 60,
    budget: 50,
    lastYear: 70,
    budgetRate: '-50%',
    yearRate: '12%',
    isPercentage: true
  },
  averagePrice: {
    title: '平均房价',
    unit: '元',
    actual: 300,
    budget: 290,
    lastYear: 270,
    budgetRate: '12%',
    yearRate: '12%'
  },
  roomRevenue: {
    title: '客房收入',
    unit: '万元',
    actual: 300,
    budget: 290,
    lastYear: 270,
    budgetRate: '12%',
    yearRate: '12%'
  },
  revenuePerRoom: {
    title: '每房收益',
    unit: '元',
    actual: 300,
    budget: 290,
    lastYear: 270,
    budgetRate: '12%',
    yearRate: '12%'
  },
  roomProfit: {
    title: '客房利润',
    unit: '万元',
    actual: 300,
    budget: 290,
    lastYear: 270,
    budgetRate: '12%',
    yearRate: '12%'
  },
  profitRate: {
    title: '利润率',
    unit: '%',
    actual: 60,
    budget: 50,
    lastYear: 70,
    budgetRate: '-50%',
    yearRate: '12%',
    isPercentage: true
  }
};

// 创建 ECharts Option
const createBarOption = (data: ChartData): echarts.EChartsOption => ({
  tooltip: {
    trigger: 'axis' as const,
    axisPointer: {
      type: 'shadow'
    }
  },
  grid: {
    top: 60,
    bottom: 40,
    left: 40,
    right: 20,
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: ['实际', '预算', '去年'],
    axisLine: { show: true },
    axisTick: { show: true },
    axisLabel: {
      interval: 0
    }
  },
  yAxis: {
    type: 'value',
    axisLine: { show: true },
    axisTick: { show: true },
    splitLine: { show: true },
    axisLabel: {
      formatter: (value: number) => `${value}${data.unit}`
    }
  },
  series: [
    {
      type: 'bar',
      barWidth: '30%',
      data: [
        { value: data.actual, itemStyle: { color: '#1890ff' } },
        { value: data.budget, itemStyle: { color: '#b7b7b7' } },
        { value: data.lastYear, itemStyle: { color: '#fac858' } }
      ],
      label: {
        show: true,
        position: 'top',
        formatter: (params) => `${params.value}${data.unit}`
      }
    }
  ]
});

const RoomData: React.FC = () => {
  const [date, setDate] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [selectedManageTypes, setSelectedManageTypes] = useState<string[]>([]);
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>([]);
  const [selectedHotel, setSelectedHotel] = useState<string | undefined>(undefined);

  return (
    <TokenCheck>
      <div style={{ padding: '24px' }}>
        {/* 查询条件区域 */}
        <Card>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Typography.Title level={4}>客房数据</Typography.Title>
            <Row gutter={[16, 16]} style={{ width: '100%' }}>
              <Col xs={24} sm={12} md={8} lg={6}>
                <DatePicker.RangePicker
                  picker="month"
                  value={date}
                  onChange={(dates) => setDate(dates as [dayjs.Dayjs, dayjs.Dayjs] | null)}
                  format="YYYY-MM"
                  locale={locale}
                  style={{ width: '100%' }}
                />
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Select
                  mode="multiple"
                  placeholder="管理公司"
                  options={companyOptions}
                  value={selectedCompanies}
                  onChange={setSelectedCompanies}
                  style={{ width: '100%' }}
                />
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Select
                  mode="multiple"
                  placeholder="产权类型"
                  options={propertyTypeOptions}
                  value={selectedPropertyTypes}
                  onChange={setSelectedPropertyTypes}
                  style={{ width: '100%' }}
                />
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Select
                  mode="multiple"
                  placeholder="管理类型"
                  options={manageTypeOptions}
                  value={selectedManageTypes}
                  onChange={setSelectedManageTypes}
                  style={{ width: '100%' }}
                />
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Select
                  showSearch
                  placeholder="选择酒店"
                  options={hotelList.map(hotel => ({ label: hotel, value: hotel }))}
                  value={selectedHotel}
                  onChange={setSelectedHotel}
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  style={{ width: '100%' }}
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

        {/* 指标卡片 + 图表 */}
        <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
          {Object.entries(chartDataMap).map(([key, data]) => (
            <Col xs={24} sm={24} md={12} lg={12} xl={8} key={key}>
              <Card>
                <MetricCard
                  title={data.title}
                  value={`${data.actual}${data.unit}`}
                  budget={data.budgetRate}
                  lastYear={data.yearRate}
                />
                <div style={{ height: '300px', marginTop: '16px' }}>
                  <BarChart id="barChart" option={createBarOption(data) as echarts.EChartOption} />
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </TokenCheck>
  );
};

export default RoomData;