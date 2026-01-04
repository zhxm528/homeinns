import React, { useState } from 'react';
import { Card, DatePicker, Select, Button, Row, Col, Space, Typography, Table } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';
import { SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import TokenCheck from '../../components/common/TokenCheck';

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

// 图表数据定义
const chartDataMap: Record<string, ChartData> = {
  foodRevenue: {
    title: '餐饮收入',
    unit: '万元',
    actual: 180,
    budget: 170,
    lastYear: 160,
    budgetRate: '6%',
    yearRate: '12%'
  },
  foodProfit: {
    title: '餐饮经营利润',
    unit: '万元',
    actual: 45,
    budget: 40,
    lastYear: 38,
    budgetRate: '13%',
    yearRate: '18%'
  },
  foodProfitRate: {
    title: '餐饮利润率',
    unit: '%',
    actual: 25,
    budget: 23,
    lastYear: 21,
    budgetRate: '9%',
    yearRate: '19%',
    isPercentage: true
  },
  foodCostRate: {
    title: '餐饮成本率',
    unit: '%',
    actual: 25,
    budget: 23,
    lastYear: 21,
    budgetRate: '9%',
    yearRate: '19%',
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

const FoodData: React.FC = () => {
  const [date, setDate] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [selectedManageTypes, setSelectedManageTypes] = useState<string[]>([]);
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>([]);
  const [selectedHotel, setSelectedHotel] = useState<string | undefined>(undefined);

  return (
    <TokenCheck>
      <div className="p-6">
        {/* 查询条件区域 */}
        <Card>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Typography.Title level={4}>餐饮数据</Typography.Title>
            <Space wrap size="middle" style={{ width: '100%', justifyContent: 'flex-end' }}>
              <DatePicker.RangePicker
                picker="month"
                value={date}
                onChange={(dates) => setDate(dates as [dayjs.Dayjs, dayjs.Dayjs] | null)}
                format="YYYY-MM"
                locale={locale}
                style={{ width: 280 }}
              />
              <Select
                mode="multiple"
                placeholder="管理公司"
                options={companyOptions}
                value={selectedCompanies}
                onChange={setSelectedCompanies}
                style={{ width: 120 }}
              />
              <Select
                mode="multiple"
                placeholder="产权类型"
                options={propertyTypeOptions}
                value={selectedPropertyTypes}
                onChange={setSelectedPropertyTypes}
                style={{ width: 120 }}
              />
              <Select
                mode="multiple"
                placeholder="管理类型"
                options={manageTypeOptions}
                value={selectedManageTypes}
                onChange={setSelectedManageTypes}
                style={{ width: 120 }}
              />
              <Select
                showSearch
                placeholder="选择酒店"
                options={hotelList.map(hotel => ({ label: hotel, value: hotel }))}
                value={selectedHotel}
                onChange={setSelectedHotel}
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                style={{ width: 180 }}
              />
              <Button type="primary">查询</Button>
              <Button>重置</Button>
            </Space>
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

export default FoodData;