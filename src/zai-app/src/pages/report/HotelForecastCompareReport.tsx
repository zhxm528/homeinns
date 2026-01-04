import React, { useState } from 'react';
import { DatePicker, Switch, Select, Card, Table, Space, Button, Row, Col, Typography, message } from 'antd';
import type { Dayjs } from 'dayjs';
import type { SelectProps } from 'antd/es/select';
import type { ButtonProps } from 'antd/es/button';
import type { DatePickerProps } from 'antd/es/date-picker';
import type { RowProps } from 'antd/es/row';
import type { ColProps } from 'antd/es/col';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';
import TokenCheck from '../../components/common/TokenCheck';

// 设置 dayjs 语言为中文
dayjs.locale('zh-cn');

// 自定义周格式化函数
const weekFormat = (date: dayjs.Dayjs) => {
  const year = date.format('YYYY');
  const week = date.format('w');
  return `${year}-第${week}周`;
};

interface HotelMetrics {
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
}

interface HotelData {
  name: string;
  currentWeek: HotelMetrics;
  lastWeek: HotelMetrics;
}

const generateHotelData = (name: string, baseMultiplier: number = 1): HotelData => ({
  name,
  currentWeek: {
    soldRoomNights: Math.round(10000 * baseMultiplier * 1.2),
    availableRoomNights: Math.round(12000 * baseMultiplier * 1.2),
    occupancyRate: 83.5 + Math.random() * 4,
    averagePrice: Math.round(800 * baseMultiplier),
    revPAR: Math.round(680 * baseMultiplier * 10) / 10,
    roomRevenue: Math.round(8000000 * baseMultiplier * 1.2),
    restaurantRevenue: Math.round(2500000 * baseMultiplier * 1.2),
    banquetRevenue: Math.round(1800000 * baseMultiplier * 1.2),
    otherRevenue: Math.round(1000000 * baseMultiplier * 1.2),
    totalRevenue: Math.round(13300000 * baseMultiplier * 1.2)
  },
  lastWeek: {
    soldRoomNights: Math.round(10000 * baseMultiplier),
    availableRoomNights: Math.round(12000 * baseMultiplier),
    occupancyRate: 80.5 + Math.random() * 3,
    averagePrice: Math.round(780 * baseMultiplier),
    revPAR: Math.round(650 * baseMultiplier * 10) / 10,
    roomRevenue: Math.round(8000000 * baseMultiplier),
    restaurantRevenue: Math.round(2500000 * baseMultiplier),
    banquetRevenue: Math.round(1800000 * baseMultiplier),
    otherRevenue: Math.round(1000000 * baseMultiplier),
    totalRevenue: Math.round(13300000 * baseMultiplier)
  }
});

const mockData: HotelData[] = [
  '前门建国饭店', '北京民族饭店', '京伦饭店', '北京建国饭店', '西苑饭店',
  '国际饭店', '东方饭店', '崇文门饭店', '香山饭店', '北京展览馆宾馆',
  '和平里大酒店', '新侨饭店', '郑州建国饭店', '西安建国饭店', '广州建国酒店',
  '亚洲大酒店', '北京工人建国酒店', '北京松鹤建国培训中心', '北京中建雅颂酒店',
  '北京建国国际文化交流中心', '沙河建国际文化交流中心', '北京颐和园建国饭店',
  '绿博园建国饭店', '郑州美伦建国饭店', '昆山建国饭店', '武汉东方建国大酒店',
  '宝鸡建国饭店', '海南建国饭店', '清青建国饭店B座', '甘肃长城建国饭店',
  '杭州日航建国饭店', '苏州新区建国饭店', '三亚红塘湾建国酒店', '漫湾中建建国酒店',
  '青岛上合建国酒店', '昌吉建国饭店', '泰皇宫建国饭店', '平遥县建国饭店',
  '辽诺建国饭店', '通化国京建国饭店', '平果建国饭店', '海阳建国饭店',
  '文昌工商红椰湾洛论坛饭店', '沙州建国饭店', '江西文洲建国饭店', '瑶玛建国',
  '凤凰大厦建国饭店', '江苏常熟沙家浜建国饭店', '双安建国饭店', '运城建国饭店',
  '商丘恒华建国饭店', '九江中辉建国酒店', '好莱建国饭店', '丹东威尼斯酒店',
  '呼伦贝尔富都大酒店', '元和建国饭店', '汪安建国饭店', '云岗建国饭店',
  '九江恒华建国酒店', '长德先锋酒店', '仙居岭亭化酒店', '威海海悦建国饭店',
  '青海山河建国饭店', '三亚石梅湾艾美度假酒店', '庐山温泉建国饭店',
  '郑州正商建国饭店', '上海铂菲特', '库尔勒梨城花园酒店', '港联建国南务饭店',
  '福建江夏建国', '完美大厦', '明珠建国饭店'
].map((name, index) => generateHotelData(name, 0.8 + (index % 5) * 0.1));

// 格式化数字
const formatNumber = (num: number, decimals: number = 0) => {
  if (decimals === 0) {
    return num.toLocaleString('zh-CN', { maximumFractionDigits: 0 });
  }
  return num.toLocaleString('zh-CN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
};

// 计算差异百分比
const calculateDiffPercentage = (current: number, compare: number) => {
  const diff = ((current - compare) / compare) * 100;
  return `${diff >= 0 ? '+' : ''}${diff.toFixed(1)}%`;
};

interface ColumnConfig {
  key: keyof HotelMetrics;
  label: string;
  format: number;
}

const baseColumns: ColumnConfig[] = [
  { key: 'occupancyRate', label: '出租率(%)', format: 1 },
  { key: 'averagePrice', label: '平均房价(元)', format: 0 },
  { key: 'totalRevenue', label: '总收入(元)', format: 0 }
];

const expandedColumns: ColumnConfig[] = [
  { key: 'soldRoomNights', label: '已售间夜数', format: 0 },
  { key: 'availableRoomNights', label: '可售间夜数', format: 0 },
  { key: 'revPAR', label: '每房收益', format: 1 },
  { key: 'roomRevenue', label: '客房收入', format: 0 },
  { key: 'restaurantRevenue', label: '餐厅收入', format: 0 },
  { key: 'banquetRevenue', label: '宴会收入', format: 0 },
  { key: 'otherRevenue', label: '其他收入', format: 0 }
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

const HotelForecastWeeklyCompareReport: React.FC = () => {
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([dayjs(), dayjs()]);
  const [expanded, setExpanded] = useState(false);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [selectedManageTypes, setSelectedManageTypes] = useState<string[]>([]);
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>([]);
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [selectedCityAreas, setSelectedCityAreas] = useState<string[]>([]);
  const [selectedStoreAges, setSelectedStoreAges] = useState<string[]>([]);

  // 获取当前应显示的列
  const visibleColumns = expanded ? [...baseColumns, ...expandedColumns] : baseColumns;

  const columns = [
    {
      title: '酒店名称',
      dataIndex: 'name',
      key: 'name',
      fixed: 'left' as const,
      width: 200,
    },
    {
      title: '本月预测',
      children: visibleColumns.map(col => ({
        title: col.label,
        dataIndex: ['currentWeek', col.key],
        key: `current-${col.key}`,
        render: (value: number) => formatNumber(value, col.format),
      })),
    },
    {
      title: '上月预测',
      children: visibleColumns.map(col => ({
        title: col.label,
        dataIndex: ['lastWeek', col.key],
        key: `last-${col.key}`,
        render: (value: number) => formatNumber(value, col.format),
      })),
    },
    {
      title: '差异',
      children: visibleColumns.map(col => ({
        title: col.label,
        key: `diff-${col.key}`,
        render: (_: any, record: HotelData) => 
          calculateDiffPercentage(record.currentWeek[col.key], record.lastWeek[col.key]),
      })),
    },
  ];

  return (
    <TokenCheck>
      <div className="p-6">
        <Card>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Typography.Title level={4}>酒店预测环比月报</Typography.Title>
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

export default HotelForecastWeeklyCompareReport; 