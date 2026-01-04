import React, { useState, useRef, useEffect } from 'react';
import { Card, DatePicker, Select, Button, Row, Col, Space, Typography } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';
import MetricCard from '@/components/echart/MetricCard';
import PieChart from '@/components/echart/PieChart';
import BarChart from '@/components/echart/BarChart';
import HorizontalBarChart from '@/components/echart/HorizontalBarChart';
import { EChartsOption } from 'echarts';
import TokenCheck from '../../components/common/TokenCheck';

// 酒店列表
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

const OverallOperationMonthly: React.FC = () => {
  const [date, setDate] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [selectedManageTypes, setSelectedManageTypes] = useState<string[]>([]);
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>([]);
  const [selectedHotel, setSelectedHotel] = useState<string | undefined>(undefined);

  // 图表配置
  const gopOption: EChartsOption = {
    legend: {
      data: ['实际', '预算', '去年'],
      bottom: 0,
      itemGap: 20,
      itemWidth: 15,
      itemHeight: 15,
      textStyle: { fontSize: 12 },
    },
    tooltip: {
      trigger: 'item' as const,
      formatter: '{b}: {c}%',
    },
    series: [{
      type: 'pie',
      radius: ['65%', '80%'],
      center: ['50%', '45%'],
      label: { show: true, position: 'center', fontSize: 30, formatter: '{c}%', color: '#8BA6C1' },
      data: [
        { value: 60, name: '实际', itemStyle: { color: '#8BA6C1' } },
        { value: 50, name: '预算', itemStyle: { color: '#ff4d4f' } },
        { value: 70, name: '去年', itemStyle: { color: '#52c41a' } },
      ],
    }],
  };

  const progressOption: EChartsOption = {
    tooltip: { trigger: 'item' as const, formatter: '{b}: {c}%' },
    series: [{
      type: 'pie',
      radius: ['65%', '80%'],
      center: ['50%', '40%'],
      label: { show: true, position: 'center', fontSize: 30, formatter: '70%' },
      data: [
        { value: 70, name: '已完成', itemStyle: { color: '#8BA6C1' } },
        { value: 30, name: '未完成', itemStyle: { color: '#f0f0f0' } },
      ],
    }],
  };

  const progressBarOption: EChartsOption = {
    tooltip: { trigger: 'axis' as const, formatter: '{b}: {c}%' },
    grid: { left: 100, right: 20, top: 10, bottom: 10, containLabel: true },
    xAxis: { type: 'value', max: 100, axisLabel: { formatter: '{value}%' } },
    yAxis: {
      type: 'category',
      data: ['GOP', '总收入', '其他收入', '餐饮收入', '客房收入'],
      axisLine: { show: false },
      axisTick: { show: false },
    },
    series: [{
      type: 'bar',
      data: [65, 70, 60, 75, 80],
      itemStyle: { color: '#8BA6C1' },
      label: { show: true, position: 'right', formatter: '{c}%' },
      barWidth: 15,
    }],
  };

  const barOption: EChartsOption = {
    legend: { data: ['当月', '预算', '去年'], bottom: 0 },
    tooltip: { trigger: 'axis' as const, axisPointer: { type: 'shadow' } },
    grid: { left: 60, right: 60, top: 20, bottom: 60 },
    xAxis: {
      type: 'category',
      data: ['客房收入', '餐饮收入', '其他收入', '总收入', 'GOP'],
      axisLabel: { interval: 0, rotate: 0 },
    },
    yAxis: { type: 'value', max: 100, axisLabel: { formatter: '{value}%' } },
    series: [
      { name: '当月', type: 'bar', barGap: 0, data: [90, 86, 70, 85, 100], itemStyle: { color: '#1f77b4' }, label: { show: true, position: 'top', formatter: '{c}%' } },
      { name: '预算', type: 'bar', data: [95, 92, 75, 88, 105], itemStyle: { color: '#2ca02c' }, label: { show: true, position: 'top', formatter: '{c}%' } },
      { name: '去年', type: 'bar', data: [82, 80, 65, 78, 95], itemStyle: { color: '#ff7f0e' }, label: { show: true, position: 'top', formatter: '{c}%' } },
    ],
  };

  return (
    <TokenCheck>
    <div style={{ padding: '24px' }}>
      {/* 查询条件区域 */}
      <Card>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Typography.Title level={4}>整体经营</Typography.Title>
          <Row gutter={[16, 16]} style={{ width: '100%' }}>
            <Col xs={24} sm={12} md={8} lg={6}>
              <DatePicker.RangePicker
                picker="month"
                value={date}
                onChange={(dates) => setDate(dates as [dayjs.Dayjs, dayjs.Dayjs] | null)}
                format="YYYY-MM"
                style={{ width: '100%' }}
                locale={locale}
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

      <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
        {/* 左侧列 */}
        <Col span={16}>
          <Card><MetricCard title="总收入" value="8,562万元" budget="-12.5%" lastYear="8.3%" /></Card>
          <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
            <Col span={12}><MetricCard title="客房收入" value="4,235" budget="-10.2%" lastYear="7.8%" /></Col>
            <Col span={12}><MetricCard title="餐饮收入" value="2,856" budget="-8.6%" lastYear="6.5%" /></Col>
            <Col span={12}><MetricCard title="其它收入" value="1,471" budget="-5.8%" lastYear="5.2%" /></Col>
            <Col span={12}><MetricCard title="GOP" value="3.256" budget="-15.3%" lastYear="9.1%" /></Col>
          </Row>
          <Card style={{ marginTop: '24px' }}>
            <BarChart id="barChart" option={barOption as echarts.EChartOption} />
          </Card>
        </Col>

        {/* 右侧列 */}
        <Col span={8}>
          <Card title="GOP率">
            <PieChart id="gopOption" option={gopOption as echarts.EChartOption} />
          </Card>
          <Card title="年累计进度" style={{ marginTop: '24px' }}>
            <PieChart id="progressChart" option={progressOption as echarts.EChartOption} />
            <HorizontalBarChart id="progressBarChart" option={progressBarOption as echarts.EChartOption} />
          </Card>
        </Col>
      </Row>
    </div>
    </TokenCheck>
  );
};

export default OverallOperationMonthly;