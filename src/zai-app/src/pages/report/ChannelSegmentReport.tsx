import React, { useState } from 'react';
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
import type { ColumnsType } from 'antd/es/table';
// 引入封装好的组件
import ChannelSegmentGroupedBarChart from '@/components/echart/ChannelSegmentGroupedBarChart';
import TokenCheck from '../../components/common/TokenCheck';

// 工具函数：格式化数字
const formatInt = (num: number) => num.toLocaleString('en-US', { maximumFractionDigits: 0 });

// 查询条件选项
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

// 表格列定义
const tableColumns = [
  { title: '渠道名称', dataIndex: 'channel', key: 'channel' },
  {
    title: '当月数据',
    children: [
      { title: '间夜', dataIndex: 'currentNights', key: 'currentNights', render: (v: number) => formatInt(v) },
      { title: '占比', dataIndex: 'currentRatio', key: 'currentRatio' },
      { title: '收入', dataIndex: 'currentIncome', key: 'currentIncome', render: (v: number) => formatInt(v) },
      { title: 'ADR', dataIndex: 'currentAdr', key: 'currentAdr', render: (v: number) => formatInt(v) },
    ],
  },
  {
    title: '去年同期',
    children: [
      { title: '间夜', dataIndex: 'lastNights', key: 'lastNights', render: (v: number) => formatInt(v) },
      { title: '占比', dataIndex: 'lastRatio', key: 'lastRatio' },
      { title: '收入', dataIndex: 'lastIncome', key: 'lastIncome', render: (v: number) => formatInt(v) },
      { title: 'ADR', dataIndex: 'lastAdr', key: 'lastAdr', render: (v: number) => formatInt(v) },
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
const channelNames = [
  '酒店直接预订', '酒店前台', '全球预定', '官方网站', '集团订单房', '国外旅行代理', '酒店网关', '集团大客户', '携程直连', '新美大直连',
  '畅联', '直客通', '京东直连', '首旅惠科', '建国小程序', '抖音直连', '自享会飞猪', '首酒大客户'
];

const tableData = channelNames.map((channel, i) => ({
  key: i + 1,
  channel,
  currentNights: 1000 - i * 30,
  currentRatio: (8 - i * 0.2).toFixed(1) + '%',
  currentIncome: 150000 - i * 5000,
  currentAdr: 150 + i * 2,
  lastNights: 900 - i * 25,
  lastRatio: (7.5 - i * 0.18).toFixed(1) + '%',
  lastIncome: 140000 - i * 4000,
  lastAdr: 145 + i * 2,
  difference: '+' + (100 - i * 3),
  completionRate: (100 - i * 2) + '%',
}));

// 图表模拟数据
const chartData = {
  income: {
    current: [60, 40], // 线上, 线下
    last: [55, 45]
  },
  adr: {
    current: [155, 145],
    last: [150, 140]
  },
  nights: {
    current: [700, 300],
    last: [650, 350]
  }
};

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

const ChannelSegmentReport: React.FC = () => {
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([dayjs(), dayjs()]);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [selectedManageTypes, setSelectedManageTypes] = useState<string[]>([]);
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>([]);
  const [selectedHotel, setSelectedHotel] = useState<string | undefined>(undefined);
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [selectedCityAreas, setSelectedCityAreas] = useState<string[]>([]);
  const [selectedStoreAges, setSelectedStoreAges] = useState<string[]>([]);

  return (
    <TokenCheck>
      <div className="p-6">
        {/* 查询条件区域 */}
        <Card>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Typography.Title level={4}>渠道细分</Typography.Title>
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
                <Select
                  showSearch
                  allowClear
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

        {/* 图表区域 */}
        <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
          <Col span={8}>
            <Card title="收入占比对比">
              <ChannelSegmentGroupedBarChart id="incomeChart" title="收入占比对比" current={chartData.income.current} last={chartData.income.last} />
            </Card>
          </Col>
          <Col span={8}>
            <Card title="平均房价对比（元）">
              <ChannelSegmentGroupedBarChart id="adrChart" title="平均房价对比" current={chartData.adr.current} last={chartData.adr.last} />
            </Card>
          </Col>
          <Col span={8}>
            <Card title="已售间夜数占比对比">
              <ChannelSegmentGroupedBarChart id="nightsChart" title="间夜数对比" current={chartData.nights.current} last={chartData.nights.last} />
            </Card>
          </Col>
        </Row>

        {/* 数据表格 */}
        <Card style={{ marginTop: '24px' }} title="渠道细分数据">
          <Table
            columns={tableColumns}
            dataSource={tableData}
            pagination={false}
            bordered
            scroll={{ x: 'max-content' }}
          />
        </Card>
      </div>
    </TokenCheck>
  );
};

export default ChannelSegmentReport;