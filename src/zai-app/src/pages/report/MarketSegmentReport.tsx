import React, { useState, useEffect, useRef } from 'react';
import {
  Row,
  Col,
  Card,
  Table,
  DatePicker,
  Select,
  Button,
  Space,
  Typography,
  message
} from 'antd';
import dayjs from 'dayjs';
import locale from 'antd/es/date-picker/locale/zh_CN';
import 'dayjs/locale/zh-cn';
import { SearchOutlined } from '@ant-design/icons';
import TokenCheck from '../../components/common/TokenCheck';

// 引入封装好的组件
import MarketSegmentGroupedBarChart from '@/components/echart/MarketSegmentGroupedBarChart';

const { Title } = Typography;

// 工具函数：格式化数字
  const formatInt = (num: number) => num.toLocaleString('en-US', { maximumFractionDigits: 0 });

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

// 表格列定义
  const tableColumns = [
    { title: '市场细分', dataIndex: 'segment', key: 'segment' },
    {
    title: '当月数据',
    children: [
        { title: '间夜', dataIndex: 'currentNights', key: 'currentNights', render: (v: number) => formatInt(v) },
        { title: '占比', dataIndex: 'currentRatio', key: 'currentRatio' },
        { title: '收入', dataIndex: 'currentIncome', key: 'currentIncome', render: (v: number) => formatInt(v) },
      { title: '平均房价', dataIndex: 'currentAdr', key: 'currentAdr', render: (v: number) => formatInt(v) },
      ],
    },
    {
    title: '去年同期',
    children: [
        { title: '间夜', dataIndex: 'lastNights', key: 'lastNights', render: (v: number) => formatInt(v) },
        { title: '占比', dataIndex: 'lastRatio', key: 'lastRatio' },
        { title: '收入', dataIndex: 'lastIncome', key: 'lastIncome', render: (v: number) => formatInt(v) },
      { title: '平均房价', dataIndex: 'lastAdr', key: 'lastAdr', render: (v: number) => formatInt(v) },
      ],
    },
    {
    title: '差异/完成率',
    children: [
        { title: '差异', dataIndex: 'difference', key: 'difference' },
        { title: '完成率', dataIndex: 'completionRate', key: 'completionRate' },
      ],
    },
  ];

// 模拟数据
  const tableData = [
    // 散客
    { key: '1', segment: '门市散客', currentNights: 320, currentRatio: '8%', currentIncome: 48000, currentAdr: 150, lastNights: 300, lastRatio: '7%', lastIncome: 42000, lastAdr: 140, difference: '+20', completionRate: '107%' },
    { key: '2', segment: '最佳可用房价', currentNights: 210, currentRatio: '5%', currentIncome: 31500, currentAdr: 150, lastNights: 190, lastRatio: '4%', lastIncome: 26600, lastAdr: 140, difference: '+20', completionRate: '111%' },
    { key: '3', segment: '包价', currentNights: 180, currentRatio: '4%', currentIncome: 25200, currentAdr: 140, lastNights: 170, lastRatio: '4%', lastIncome: 23800, lastAdr: 140, difference: '+10', completionRate: '106%' },
    { key: '4', segment: '折扣', currentNights: 150, currentRatio: '4%', currentIncome: 21000, currentAdr: 140, lastNights: 140, lastRatio: '3%', lastIncome: 19600, lastAdr: 140, difference: '+10', completionRate: '107%' },
    { key: '5', segment: '最后保留房协议', currentNights: 120, currentRatio: '3%', currentIncome: 16800, currentAdr: 140, lastNights: 110, lastRatio: '3%', lastIncome: 15400, lastAdr: 140, difference: '+10', completionRate: '109%' },
  { key: '6', segment: '无最后保留房协议', currentNights: 100, currentRatio: '2%', currentIncome: 21000, currentAdr: 140, lastNights: 90, lastRatio: '2%', lastIncome: 19600, lastAdr: 140, difference: '+10', completionRate: '107%' },
    { key: '7', segment: '航空公司预订', currentNights: 80, currentRatio: '2%', currentIncome: 10400, currentAdr: 130, lastNights: 75, lastRatio: '2%', lastIncome: 9750, lastAdr: 130, difference: '+5', completionRate: '107%' },
    { key: '8', segment: '特殊协议公司', currentNights: 60, currentRatio: '1%', currentIncome: 7800, currentAdr: 130, lastNights: 55, lastRatio: '1%', lastIncome: 7150, lastAdr: 130, difference: '+5', completionRate: '109%' },
    { key: '9', segment: '政府协议', currentNights: 50, currentRatio: '1%', currentIncome: 6500, currentAdr: 130, lastNights: 48, lastRatio: '1%', lastIncome: 6240, lastAdr: 130, difference: '+2', completionRate: '104%' },
    { key: '10', segment: '长住', currentNights: 40, currentRatio: '1%', currentIncome: 4800, currentAdr: 120, lastNights: 38, lastRatio: '1%', lastIncome: 4560, lastAdr: 120, difference: '+2', completionRate: '105%' },
    { key: '11', segment: '日用房', currentNights: 35, currentRatio: '1%', currentIncome: 3850, currentAdr: 110, lastNights: 32, lastRatio: '1%', lastIncome: 3520, lastAdr: 110, difference: '+3', completionRate: '109%' },
    { key: '12', segment: 'IT房中心散客', currentNights: 30, currentRatio: '1%', currentIncome: 3900, currentAdr: 130, lastNights: 28, lastRatio: '1%', lastIncome: 3640, lastAdr: 130, difference: '+2', completionRate: '107%' },
    { key: '13', segment: '批发商散客', currentNights: 28, currentRatio: '1%', currentIncome: 3360, currentAdr: 120, lastNights: 25, lastRatio: '1%', lastIncome: 3000, lastAdr: 120, difference: '+3', completionRate: '112%' },
    { key: '14', segment: '内部员工', currentNights: 20, currentRatio: '0.5%', currentIncome: 2000, currentAdr: 100, lastNights: 18, lastRatio: '0.5%', lastIncome: 1800, lastAdr: 100, difference: '+2', completionRate: '111%' },
    { key: '15', segment: '同行业', currentNights: 18, currentRatio: '0.5%', currentIncome: 1980, currentAdr: 110, lastNights: 16, lastRatio: '0.5%', lastIncome: 1760, lastAdr: 110, difference: '+2', completionRate: '113%' },
    { key: '16', segment: '管理层特价', currentNights: 15, currentRatio: '0.4%', currentIncome: 1800, currentAdr: 120, lastNights: 14, lastRatio: '0.4%', lastIncome: 1680, lastAdr: 120, difference: '+1', completionRate: '107%' },
    { key: '17', segment: '会员消费', currentNights: 12, currentRatio: '0.3%', currentIncome: 1440, currentAdr: 120, lastNights: 11, lastRatio: '0.3%', lastIncome: 1320, lastAdr: 120, difference: '+1', completionRate: '109%' },
    // 团队
    { key: '18', segment: '纯房团', currentNights: 200, currentRatio: '5%', currentIncome: 26000, currentAdr: 130, lastNights: 180, lastRatio: '4%', lastIncome: 23400, lastAdr: 130, difference: '+20', completionRate: '111%' },
    { key: '19', segment: '公司团', currentNights: 180, currentRatio: '4%', currentIncome: 23400, currentAdr: 130, lastNights: 170, lastRatio: '4%', lastIncome: 22100, lastAdr: 130, difference: '+10', completionRate: '106%' },
    { key: '20', segment: '奖励团', currentNights: 120, currentRatio: '3%', currentIncome: 15600, currentAdr: 130, lastNights: 110, lastRatio: '3%', lastIncome: 14300, lastAdr: 130, difference: '+10', completionRate: '109%' },
    { key: '21', segment: '协会团', currentNights: 100, currentRatio: '2%', currentIncome: 13000, currentAdr: 130, lastNights: 95, lastRatio: '2%', lastIncome: 12350, lastAdr: 130, difference: '+5', completionRate: '105%' },
    { key: '22', segment: '交易会、展览', currentNights: 90, currentRatio: '2%', currentIncome: 11700, currentAdr: 130, lastNights: 85, lastRatio: '2%', lastIncome: 11050, lastAdr: 130, difference: '+5', completionRate: '106%' },
    { key: '23', segment: '政府团', currentNights: 80, currentRatio: '2%', currentIncome: 10400, currentAdr: 130, lastNights: 75, lastRatio: '2%', lastIncome: 9750, lastAdr: 130, difference: '+5', completionRate: '107%' },
    { key: '24', segment: '旅游系列团', currentNights: 70, currentRatio: '2%', currentIncome: 9100, currentAdr: 130, lastNights: 65, lastRatio: '2%', lastIncome: 8450, lastAdr: 130, difference: '+5', completionRate: '108%' },
    { key: '25', segment: '旅游一次性团', currentNights: 60, currentRatio: '1%', currentIncome: 7800, currentAdr: 130, lastNights: 55, lastRatio: '1%', lastIncome: 7150, lastAdr: 130, difference: '+5', completionRate: '109%' },
    { key: '26', segment: '误机团', currentNights: 50, currentRatio: '1%', currentIncome: 6500, currentAdr: 130, lastNights: 48, lastRatio: '1%', lastIncome: 6240, lastAdr: 130, difference: '+2', completionRate: '104%' },
    { key: '27', segment: '机组', currentNights: 40, currentRatio: '1%', currentIncome: 5200, currentAdr: 130, lastNights: 38, lastRatio: '1%', lastIncome: 4940, lastAdr: 130, difference: '+2', completionRate: '105%' },
    // 其他
    { key: '28', segment: '自用房', currentNights: 20, currentRatio: '0.5%', currentIncome: 0, currentAdr: 0, lastNights: 18, lastRatio: '0.5%', lastIncome: 0, lastAdr: 0, difference: '+2', completionRate: '111%' },
    { key: '29', segment: '免费房', currentNights: 15, currentRatio: '0.4%', currentIncome: 0, currentAdr: 0, lastNights: 14, lastRatio: '0.4%', lastIncome: 0, lastAdr: 0, difference: '+1', completionRate: '107%' },
    { key: '30', segment: '酒店内部特殊', currentNights: 10, currentRatio: '0.3%', currentIncome: 0, currentAdr: 0, lastNights: 9, lastRatio: '0.3%', lastIncome: 0, lastAdr: 0, difference: '+1', completionRate: '111%' },
  ];

// 图表数据模拟
  const chartData = {
    income: {
      current: [48, 52], // 散客, 团队
    last: [45, 55]
    },
    adr: {
      current: [47, 53],
    last: [44, 56]
    },
    nights: {
      current: [49, 51],
    last: [46, 54]
  }
};

const MarketSegmentReport: React.FC = () => {
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([dayjs(), dayjs()]);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [selectedManageTypes, setSelectedManageTypes] = useState<string[]>([]);
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>([]);
  const [selectedHotel, setSelectedHotel] = useState<string | undefined>(undefined);
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [selectedCityAreas, setSelectedCityAreas] = useState<string[]>([]);
  const [selectedStoreAges, setSelectedStoreAges] = useState<string[]>([]);

  const handleQuery = () => {
    console.log('执行查询');
    // 这里可以添加实际查询逻辑
  };

  const handleReset = () => {
    setDateRange([dayjs(), dayjs()]);
    setSelectedCompanies([]);
    setSelectedManageTypes([]);
    setSelectedPropertyTypes([]);
    setSelectedHotel(undefined);
    setSelectedDistricts([]);
    setSelectedCityAreas([]);
    setSelectedStoreAges([]);
  };

  return (
    <TokenCheck>
      <div className="p-6">
      {/* 查询条件区域 */}
      <Card style={{ marginBottom: '24px' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Title level={4}>市场细分</Title>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8} lg={6}>
              <DatePicker.RangePicker
                value={dateRange}
                onChange={(dates) => dates && setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs])}
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
                options={[
                  { label: '诺金国际', value: '诺金国际' },
                  { label: '首旅建国', value: '首旅建国' },
                  { label: '首旅京伦', value: '首旅京伦' },
                  { label: '首旅南苑', value: '首旅南苑' },
                  { label: '首旅安诺', value: '首旅安诺' },
                  { label: '诺金管理', value: '诺金管理' },
                  { label: '凯燕', value: '凯燕' },
                  { label: '安麓', value: '安麓' },
                ]}
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
                options={[
                  { label: '首旅集团', value: '首旅集团' },
                  { label: '首旅置业', value: '首旅置业' },
                  { label: '首酒集团', value: '首酒集团' },
                  { label: '北展', value: '北展' },
                  { label: '非产权店', value: '非产权店' },
                ]}
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
                options={[
                  { label: '委托管理', value: '委托管理' },
                  { label: '合资委管', value: '合资委管' },
                  { label: '特许加盟', value: '特许加盟' },
                ]}
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
                options={[
                  { label: '前门建国饭店', value: '前门建国饭店' },
                  { label: '北京民族饭店', value: '北京民族饭店' },
                  { label: '京伦饭店', value: '京伦饭店' },
                  { label: '北京建国饭店', value: '北京建国饭店' },
                  { label: '西苑饭店', value: '西苑饭店' },
                  { label: '国际饭店', value: '国际饭店' },
                  { label: '东方饭店', value: '东方饭店' },
                  { label: '崇文门饭店', value: '崇文门饭店' },
                  // 更多酒店...
                ]}
              value={selectedHotel}
              onChange={setSelectedHotel}
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
            />
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Space>
            <Button type="primary" onClick={handleQuery}>查询</Button>
            <Button onClick={handleReset}>重置</Button>
          </Space>
            </Col>
          </Row>
        </Space>
      </Card>

      {/* 图表区域 */}
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card title="收入占比对比">
            <MarketSegmentGroupedBarChart id="incomeChart" title="收入占比对比" current={chartData.income.current} last={chartData.income.last} />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="平均房价对比（元）">
            <MarketSegmentGroupedBarChart id="adrChart" title="平均房价对比" current={chartData.adr.current} last={chartData.adr.last} />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="已售间夜数占比对比">
            <MarketSegmentGroupedBarChart id="nightsChart" title="间夜数对比" current={chartData.nights.current} last={chartData.nights.last} />
          </Card>
        </Col>
      </Row>

      {/* 数据表格 */}
      <Row style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title="市场细分数据">
            <Table
              columns={tableColumns}
              dataSource={tableData}
              pagination={false}
              bordered
              scroll={{ x: 'max-content' }}
            />
          </Card>
        </Col>
      </Row>
    </div>
    </TokenCheck>
  );
};

export default MarketSegmentReport; 