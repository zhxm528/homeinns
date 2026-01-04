import React, { useState, useRef, useEffect } from 'react';
import {
  Card,
  DatePicker,
  Select,
  Button,
  Row,
  Col,
  Space,
  Typography,
  Table,
  Form,
  message
} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import locale from 'antd/es/date-picker/locale/zh_CN';
import 'dayjs/locale/zh-cn';
import EffectScatterChart from '@/components/echart/EffectScatterChart'; // 引入新封装的散点图组件
import TokenCheck from '../../components/common/TokenCheck';

// 酒店数据模拟
const hotelData = [
  { name: '广州南海', x: 120, y: 180, type: '双超', revenue: 50000000 },
  { name: '北京建国', x: 100, y: 120, type: '双超', revenue: 42000000 },
  { name: '上海虹桥', x: 80, y: 110, type: '双超', revenue: 35000000 },
  { name: '成都锦江', x: 60, y: 90, type: '预算达标', revenue: 28000000 },
  { name: '西安钟楼', x: 40, y: 70, type: '预算达标', revenue: 22000000 },
  { name: '杭州西湖', x: 30, y: 50, type: '预算未达标', revenue: 18000000 },
  { name: '南京夫子庙', x: -10, y: 20, type: '预算未达标', revenue: 15000000 },
  { name: '重庆解放碑', x: -30, y: -10, type: '双低', revenue: 10000000 },
  { name: '沈阳故宫', x: -50, y: -40, type: '双低', revenue: 8000000 },
];

// 查询条件选项
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

const HotelPerformanceQuadrant: React.FC = () => {
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([dayjs(), dayjs()]);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [selectedManageTypes, setSelectedManageTypes] = useState<string[]>([]);
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>([]);
  const [selectedCityAreas, setSelectedCityAreas] = useState<string[]>([]);
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [selectedStoreAges, setSelectedStoreAges] = useState<string[]>([]);

  // 图表配置
  const scatterOption = {
    title: {
      text: '酒店业绩（总收入年累计）',
      left: 'center',
      top: 10,
      textStyle: { fontSize: 18 }
    },
    grid: { left: 100, right: 100, top: 100, bottom: 100 },
    xAxis: {
      name: '总收入与预算差额',
      nameLocation: 'end',
      splitLine: { show: true },
      min: -120,
      max: 140,
      axisLabel: { formatter: '{value}' },
      axisLine: { onZero: true },
    },
    yAxis: {
      name: '总收入与去年差额',
      nameLocation: 'end',
      splitLine: { show: true },
      min: -100,
      max: 200,
      axisLabel: { formatter: '{value}' },
      axisLine: { onZero: true },
    },
    tooltip: {
      trigger: 'axis' as const,
      axisPointer: { type: 'shadow' as const },
      formatter: function (params: any[]) {
        return params.map(p => `${p.name}: ${p.value[2]}百万`).join('<br>');
      }
    },
    series: [{
      type: 'effectScatter' as const,
      coordinateSystem: 'cartesian2d',
      data: hotelData.map(hotel => ({
        name: hotel.name,
        value: [hotel.x, hotel.y, hotel.revenue / 1000000], // 单位：百万
        type: hotel.type
      })),
      symbolSize: (params: any) => params[2], // 收入除以10作为圆圈大小
      itemStyle: {
        color: '#1890FF',
        opacity: 0.6
      },
      label: {
        show: true,
        position: 'right' as const,
        formatter: (params: any) => `${params.name}`,
        color: '#333'
      }
    }]
  };

  return (
    <TokenCheck>
      <div className="p-6">
      {/* 查询条件区域 */}
      <Card>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Typography.Title level={4}>酒店业绩象限图</Typography.Title>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8} lg={6}>
              <DatePicker.RangePicker
                picker="month"
                value={dateRange}
                onChange={(dates) => dates && setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs])}
                allowClear={false}
                format="YYYY-MM"
                locale={locale}
                style={{ width: '100%' }}
              />
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Select
                mode="multiple"
                allowClear
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
                allowClear
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
                allowClear
                placeholder="管理类型"
                options={manageTypeOptions}
                value={selectedManageTypes}
                onChange={setSelectedManageTypes}
                style={{ width: '100%' }}
              />
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Select
                mode="multiple"
                allowClear
                placeholder="大区"
                options={districtOptions}
                value={selectedDistricts}
                onChange={setSelectedDistricts}
                style={{ width: '100%' }}
              />
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Select
                mode="multiple"
                allowClear
                placeholder="城区"
                options={cityAreaOptions}
                value={selectedCityAreas}
                onChange={setSelectedCityAreas}
                style={{ width: '100%' }}
              />
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Select
                mode="multiple"
                allowClear
                placeholder="店龄"
                options={storeAgeOptions}
                value={selectedStoreAges}
                onChange={setSelectedStoreAges}
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

      {/* 图表区域 */}
      <Card title="酒店业绩象限图" style={{ marginTop: '24px' }}>
        <EffectScatterChart id="quadrantChart" option={scatterOption as echarts.EChartOption} />
      </Card>
    </div>
    </TokenCheck>
  );
};

export default HotelPerformanceQuadrant;