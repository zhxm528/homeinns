import React, { useState, useEffect } from 'react';
import { Table, DatePicker, Select, Card, Space, Row, Col, Typography, Button, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';
// 引入封装好的 LineChart
import LineChart from '@/components/echart/LineChart';
import TokenCheck from '../../components/common/TokenCheck';


// 数据接口定义
interface HotelData {
  name: string;
  jan: string;
  feb: string;
  mar: string;
  apr: string;
  may: string;
  jun: string;
  jul: string;
  aug: string;
  sep: string;
  oct: string;
  nov: string;
  dec: string;
  accurateCount: number;  // 准确次数
  overPredictCount: number;  // 超预测次数
  underPredictCount: number;  // 差预测次数
  accuracyRate: string;  // 准确率
}

// 模拟数据
const mockData: HotelData[] = [
  {
    name: '前门建国饭店',
    jan: '+1.2%', feb: '-0.8%', mar: '+2.3%', apr: '-1.5%', may: '+0.5%', jun: '0.0%',
    jul: '-2.1%', aug: '+1.8%', sep: '-0.6%', oct: '+0.9%', nov: '-1.3%', dec: '+2.5%',
    accurateCount: 8, overPredictCount: 2, underPredictCount: 2, accuracyRate: '1.3%'
  },
  {
    name: '北京民族饭店',
    jan: '+0.5%', feb: '-1.2%', mar: '+2.0%', apr: '-0.4%', may: '+1.5%', jun: '-2.3%',
    jul: '+0.8%', aug: '-0.7%', sep: '+1.1%', oct: '-1.9%', nov: '+0.2%', dec: '-0.5%',
    accurateCount: 7, overPredictCount: 3, underPredictCount: 2, accuracyRate: '1.2%'
  },
  {
    name: '京伦饭店',
    jan: '-0.3%', feb: '+1.7%', mar: '-2.5%', apr: '+0.4%', may: '-1.1%', jun: '+2.2%',
    jul: '-0.6%', aug: '+1.3%', sep: '-1.8%', oct: '+0.7%', nov: '-0.9%', dec: '+2.8%',
    accurateCount: 6, overPredictCount: 4, underPredictCount: 2, accuracyRate: '1.3%'
  },
  {
    name: '北京建国饭店',
    jan: '+2.9%', feb: '-2.4%', mar: '+1.0%', apr: '-0.2%', may: '+2.1%', jun: '-1.4%',
    jul: '+0.6%', aug: '-0.5%', sep: '+1.9%', oct: '-2.1%', nov: '+0.3%', dec: '-0.8%',
    accurateCount: 9, overPredictCount: 2, underPredictCount: 1, accuracyRate: '1.6%'
  },
  {
    name: '西苑饭店',
    jan: '-1.5%', feb: '+2.6%', mar: '-0.7%', apr: '+0.9%', may: '-1.2%', jun: '+1.8%',
    jul: '-2.2%', aug: '+0.5%', sep: '-0.4%', oct: '+2.3%', nov: '-1.0%', dec: '+0.7%',
    accurateCount: 7, overPredictCount: 3, underPredictCount: 2, accuracyRate: '1.4%'
  },
  {
    name: '国际饭店',
    jan: '+0.3%', feb: '-0.9%', mar: '+1.5%', apr: '-2.7%', may: '+0.8%', jun: '-1.3%',
    jul: '+2.4%', aug: '-0.1%', sep: '+1.2%', oct: '-0.6%', nov: '+0.4%', dec: '-1.8%',
    accurateCount: 8, overPredictCount: 2, underPredictCount: 2, accuracyRate: '1.3%'
  },
  {
    name: '东方饭店',
    jan: '-2.0%', feb: '+1.0%', mar: '-1.6%', apr: '+2.5%', may: '-0.4%', jun: '+0.2%',
    jul: '-1.9%', aug: '+1.7%', sep: '-0.3%', oct: '+2.1%', nov: '-0.8%', dec: '+1.9%',
    accurateCount: 6, overPredictCount: 4, underPredictCount: 2, accuracyRate: '1.4%'
  },
  {
    name: '崇文门饭店',
    jan: '+1.1%', feb: '-0.5%', mar: '+0.9%', apr: '-2.3%', may: '+2.7%', jun: '-1.0%',
    jul: '+0.4%', aug: '-0.7%', sep: '+1.6%', oct: '-1.2%', nov: '+0.2%', dec: '-2.8%',
    accurateCount: 7, overPredictCount: 3, underPredictCount: 2, accuracyRate: '1.7%'
  },
  {
    name: '香山饭店',
    jan: '-0.2%', feb: '+2.3%', mar: '-1.4%', apr: '+1.8%', may: '-0.9%', jun: '+1.5%',
    jul: '-2.6%', aug: '+0.6%', sep: '-1.1%', oct: '+2.0%', nov: '-0.3%', dec: '+1.4%',
    accurateCount: 8, overPredictCount: 2, underPredictCount: 2, accuracyRate: '1.4%'
  },
  {
    name: '北京展览馆宾馆',
    jan: '+2.2%', feb: '-1.7%', mar: '+0.3%', apr: '-0.6%', may: '+1.9%', jun: '-2.0%',
    jul: '+0.7%', aug: '-0.8%', sep: '+1.0%', oct: '-1.5%', nov: '+0.5%', dec: '-2.4%',
    accurateCount: 7, overPredictCount: 3, underPredictCount: 2, accuracyRate: '1.3%'
  }
];

// 月份标签与字段映射
const monthsLabels = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
const monthKeys = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'] as (keyof HotelData)[];

// 计算每月平均绝对误差
const avgAbsErrorByMonth = monthKeys.map(key => {
  const totalAbs = mockData.reduce((sum, item) => sum + Math.abs(parseFloat(item[key] as string)), 0);
  return Number((totalAbs / mockData.length).toFixed(1));
});

// 表格列配置
const columns: ColumnsType<HotelData> = [
  {
    title: '项目名称',
    dataIndex: 'name',
    fixed: 'left',
    width: 200,
  },
  {
    title: '1月',
    dataIndex: 'jan',
    align: 'right',
  },
  {
    title: '2月',
    dataIndex: 'feb',
    align: 'right',
  },
  {
    title: '3月',
    dataIndex: 'mar',
    align: 'right',
  },
  {
    title: '4月',
    dataIndex: 'apr',
    align: 'right',
  },
  {
    title: '5月',
    dataIndex: 'may',
    align: 'right',
  },
  {
    title: '6月',
    dataIndex: 'jun',
    align: 'right',
  },
  {
    title: '7月',
    dataIndex: 'jul',
    align: 'right',
  },
  {
    title: '8月',
    dataIndex: 'aug',
    align: 'right',
  },
  {
    title: '9月',
    dataIndex: 'sep',
    align: 'right',
  },
  {
    title: '10月',
    dataIndex: 'oct',
    align: 'right',
  },
  {
    title: '11月',
    dataIndex: 'nov',
    align: 'right',
  },
  {
    title: '12月',
    dataIndex: 'dec',
    align: 'right',
  },
  {
    title: '准确次数',
    dataIndex: 'accurateCount',
    align: 'right',
  },
  {
    title: '超预测次数',
    dataIndex: 'overPredictCount',
    align: 'right',
  },
  {
    title: '差预测次数',
    dataIndex: 'underPredictCount',
    align: 'right',
  },
  {
    title: '准确率',
    dataIndex: 'accuracyRate',
    align: 'right',
    render: (_, record) => {
      const totalAbs = monthKeys.reduce((sum, key) => sum + Math.abs(parseFloat(record[key] as string)), 0);
      const avgAbs = totalAbs / monthKeys.length;
      return `${avgAbs.toFixed(1)}%`;
    },
  }
];

// 查询选项
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

// 主组件
const HotelForecastAccuracyWeeklyReport: React.FC = () => {
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([dayjs(), dayjs()]);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [selectedManageTypes, setSelectedManageTypes] = useState<string[]>([]);
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>([]);
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [selectedCityAreas, setSelectedCityAreas] = useState<string[]>([]);
  const [selectedStoreAges, setSelectedStoreAges] = useState<string[]>([]);

  // 折线图配置
  const lineOption = {
    tooltip: {
      trigger: 'axis' as const,
      formatter: '{b0}: {c0}%'
    },
    xAxis: {
      type: 'category' as const,
      data: monthsLabels
    },
    yAxis: {
      type: 'value' as const,
      name: '平均绝对误差(%)',
      min: 0,
      max: 3
    },
    series: [{
      name: '月度平均绝对误差',
      type: 'line' as const,
      data: avgAbsErrorByMonth
    }]
  };

  return (
    <TokenCheck>
      <div className="p-6">
        <Card>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Typography.Title level={4}>酒店预测准确率月报</Typography.Title>
            
            {/* 查询条件 */}
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={8} lg={6}>
                <DatePicker.RangePicker
                  value={dateRange}
                  onChange={(dates) => setDateRange(dates as [Dayjs, Dayjs])}
                  allowClear={false}
                  format="YYYY-MM-DD"
                  locale={locale}
                  style={{ width: '100%' }}
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
                  <Button type="primary">查询</Button>
                  <Button>重置</Button>
                </Space>
              </Col>
            </Row>

            {/* 折线图 */}
            <LineChart id="accuracyLineChart" option={lineOption} />

            {/* 表格 */}
            <Table
              columns={columns}
              dataSource={mockData}
              scroll={{ x: 'max-content' }}
              pagination={false}
              bordered
              size="middle"
            />
          </Space>
        </Card>
      </div>
    </TokenCheck>
  );
};

export default HotelForecastAccuracyWeeklyReport;