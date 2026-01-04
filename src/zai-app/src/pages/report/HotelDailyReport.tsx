import React, { useState, useContext, useEffect } from 'react';
import { DatePicker, Collapse, Select, Button, Table, Card, Space, Typography, Row, Col, Statistic, Form } from 'antd';
import type { SelectProps } from 'antd/es/select';
import type { ButtonProps } from 'antd/es/button';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';
import 'antd/dist/reset.css';
import { TabContext } from '../../App';
import { useNavigate, useLocation } from 'react-router-dom';
import TokenCheck from '../../components/common/TokenCheck';

const { Panel } = Collapse;
const { Title } = Typography;

// 千分位格式化
const formatNumber = (num: number) => num.toLocaleString();

const mockData = {
  date: '2025-03-16',
  project: 'XXXX酒店',
  day: {
    occupancy: 87.3,
    avgPrice: 968,
    totalIncome: 3120000,
  },
  month: {
    occupancy: 82.1,
    avgPrice: 945,
    totalIncome: 21280000,
  },
  table: [
    { name: '入住率(%)', actual: 87.3, budget: 85, rate: '102.7%', lastYear: 81.2, growth: '7.5%' },
    { name: '平均房价(元)', actual: 968, budget: 950, rate: '101.9%', lastYear: 910, growth: '6.4%' },
    { name: '每房收益(元/间夜)', actual: 845, budget: 800, rate: '105.6%', lastYear: 738, growth: '14.5%' },
    { name: '客房收入(万元)', actual: 1_320_000, budget: 1_250_000, rate: '105.6%', lastYear: 1_080_000, growth: '22.2%' },
    { name: '餐饮收入(万元)', actual: 1_050_000, budget: 1_000_000, rate: '105.0%', lastYear: 900_000, growth: '16.7%' },
    { name: '-- 自助餐厅', actual: 420_000, budget: 400_000, rate: '105.0%', lastYear: 350_000, growth: '20.0%' },
    { name: '-- 中餐厅', actual: 320_000, budget: 300_000, rate: '106.7%', lastYear: 270_000, growth: '18.5%' },
    { name: '-- 特色餐厅', actual: 180_000, budget: 170_000, rate: '105.9%', lastYear: 150_000, growth: '20.0%' },
    { name: '-- 堂食/合作(含婚宴)', actual: 130_000, budget: 130_000, rate: '100.0%', lastYear: 130_000, growth: '0.0%' },
    { name: '其他收入(万元)', actual: 1_050_000, budget: 1_000_000, rate: '105.0%', lastYear: 900_000, growth: '16.7%' },
    { name: '总收入(含客房:万元)', actual: 2_370_000, budget: 2_250_000, rate: '105.3%', lastYear: 1_980_000, growth: '19.7%' },
  ],
  team: [
    { name: 'A公司年会', rooms: 30, avgPrice: 880, income: 26_400 },
    { name: 'B集团培训', rooms: 18, avgPrice: 920, income: 16_560 },
  ],
  banquet: [
    { name: 'C企业答谢宴', count: '12桌/120人', income: 36_000 },
    { name: 'D协会年会', count: '8桌/80人', income: 24_000 },
  ],
  monthlyIncome: [
    { name: '入住率(%)', actual: 87.3, budget: 85, rate: '102.7%', lastYear: 81.2, growth: '7.5%' },
    { name: '平均房价(元)', actual: 968, budget: 950, rate: '101.9%', lastYear: 910, growth: '6.4%' },
    { name: '每房收益(元/间夜)', actual: 845, budget: 800, rate: '105.6%', lastYear: 738, growth: '14.5%' },
    { name: '客房收入(万元)', actual: 1_320_000, budget: 1_250_000, rate: '105.6%', lastYear: 1_080_000, growth: '22.2%' },
    { name: '餐饮收入(万元)', actual: 1_050_000, budget: 1_000_000, rate: '105.0%', lastYear: 900_000, growth: '16.7%' },
    { name: '-- 自助餐厅', actual: 420_000, budget: 400_000, rate: '105.0%', lastYear: 350_000, growth: '20.0%' },
    { name: '-- 中餐厅', actual: 320_000, budget: 300_000, rate: '106.7%', lastYear: 270_000, growth: '18.5%' },
    { name: '-- 特色餐厅', actual: 180_000, budget: 170_000, rate: '105.9%', lastYear: 150_000, growth: '20.0%' },
    { name: '-- 堂食/合作(含婚宴)', actual: 130_000, budget: 130_000, rate: '100.0%', lastYear: 130_000, growth: '0.0%' },
    { name: '其他收入(万元)', actual: 1_050_000, budget: 1_000_000, rate: '105.0%', lastYear: 900_000, growth: '16.7%' },
    { name: '总收入(含客房:万元)', actual: 2_370_000, budget: 2_250_000, rate: '105.3%', lastYear: 1_980_000, growth: '19.7%' },
  ],
  yearlyIncome: [
    { name: '入住率(%)', actual: 82.5, budget: 80.0, rate: '103.1%', lastYear: 78.5, growth: '5.1%' },
    { name: '平均房价(元)', actual: 958, budget: 930, rate: '103.0%', lastYear: 895, growth: '7.0%' },
    { name: '每房收益(元/间夜)', actual: 790, budget: 750, rate: '105.3%', lastYear: 702, growth: '12.5%' },
    { name: '客房收入(万元)', actual: 15800000, budget: 15000000, rate: '105.3%', lastYear: 13500000, growth: '17.0%' },
    { name: '餐饮收入(万元)', actual: 12500000, budget: 12000000, rate: '104.2%', lastYear: 11000000, growth: '13.6%' },
    { name: '-- 自助餐厅', actual: 5000000, budget: 4800000, rate: '104.2%', lastYear: 4300000, growth: '16.3%' },
    { name: '-- 中餐厅', actual: 3800000, budget: 3600000, rate: '105.6%', lastYear: 3200000, growth: '18.8%' },
    { name: '-- 特色餐厅', actual: 2200000, budget: 2100000, rate: '104.8%', lastYear: 1900000, growth: '15.8%' },
    { name: '-- 堂食/合作(含婚宴)', actual: 1500000, budget: 1500000, rate: '100.0%', lastYear: 1600000, growth: '-6.3%' },
    { name: '其他收入(万元)', actual: 8500000, budget: 8000000, rate: '106.3%', lastYear: 7200000, growth: '18.1%' },
    { name: '总收入(含服务费)', actual: 36800000, budget: 35000000, rate: '105.1%', lastYear: 31700000, growth: '16.1%' },
  ],
};

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

const HotelDailyReport: React.FC = () => {
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([dayjs(mockData.date), dayjs(mockData.date)]);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [selectedManageTypes, setSelectedManageTypes] = useState<string[]>([]);
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>([]);
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [selectedCityAreas, setSelectedCityAreas] = useState<string[]>([]);
  const [selectedStoreAges, setSelectedStoreAges] = useState<string[]>([]);
  const [selectedHotel, setSelectedHotel] = useState<string | undefined>(undefined);

  const tabContext = useContext(TabContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleQuery = () => {
    // 构建查询参数
    const params = new URLSearchParams();
    if (dateRange) {
      params.append('startDate', dateRange[0].format('YYYY-MM-DD'));
      params.append('endDate', dateRange[1].format('YYYY-MM-DD'));
    }
    if (selectedCompanies.length) params.append('companies', selectedCompanies.join(','));
    if (selectedManageTypes.length) params.append('manageTypes', selectedManageTypes.join(','));
    if (selectedPropertyTypes.length) params.append('propertyTypes', selectedPropertyTypes.join(','));
    if (selectedDistricts.length) params.append('districts', selectedDistricts.join(','));
    if (selectedCityAreas.length) params.append('cityAreas', selectedCityAreas.join(','));
    if (selectedStoreAges.length) params.append('storeAges', selectedStoreAges.join(','));
    if (selectedHotel) params.append('hotel', selectedHotel);

    const queryString = params.toString();
    const path = `/report/hotel-daily${queryString ? `?${queryString}` : ''}`;

    // 更新当前页签的路径，使用基础路径作为页签ID
    if (tabContext && tabContext.updateTab) {
      tabContext.updateTab('/report/hotel-daily', {
        title: `酒店日报 - ${selectedHotel || '全部'}`,
        path: path,
      });
    }
    
    // 使用 navigate 更新 URL，但保持在同一页签中
    navigate(path, { replace: true });
  };

  const handleReset = () => {
    setDateRange([dayjs(mockData.date), dayjs(mockData.date)]);
    setSelectedCompanies([]);
    setSelectedManageTypes([]);
    setSelectedPropertyTypes([]);
    setSelectedDistricts([]);
    setSelectedCityAreas([]);
    setSelectedStoreAges([]);
    setSelectedHotel(undefined);

    // 重置时更新页签，使用基础路径作为页签ID
    if (tabContext && tabContext.updateTab) {
      tabContext.updateTab('/report/hotel-daily', {
        title: '酒店日报',
        path: '/report/hotel-daily',
      });
    }
    navigate('/report/hotel-daily', { replace: true });
  };

  return (
    <TokenCheck>
      <div style={{ padding: '24px' }}>
        {/* 查询条件区域 */}
        <Card style={{ marginBottom: '24px' }}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Title level={4}>酒店项目日报</Title>
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
                <Select
                  showSearch
                  allowClear
                  placeholder="选择酒店"
                  style={{ width: '100%' }}
                  options={hotelList.map(hotel => ({ label: hotel, value: hotel }))}
                  value={selectedHotel}
                  onChange={setSelectedHotel}
                  filterOption={(input: string, option: any) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
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

        {/* 数据汇总表格 */}
        <Card style={{ marginBottom: '24px' }}>
          <Title level={5} style={{ marginBottom: '16px' }}>数据汇总</Title>
          <Table
            columns={[
              { title: '项目', dataIndex: 'name', key: 'name', fixed: 'left', width: 120 },
              { title: '入住率', dataIndex: 'occupancy', key: 'occupancy', align: 'right', width: 90 },
              { title: '平均房价', dataIndex: 'avgPrice', key: 'avgPrice', align: 'right', width: 100 },
              { title: '每间收益', dataIndex: 'perRoomIncome', key: 'perRoomIncome', align: 'right', width: 100 },
              { title: '总收入', dataIndex: 'income', key: 'income', align: 'right', width: 110 },
              { title: '预算', dataIndex: 'budget', key: 'budget', align: 'right', width: 100 },
              { title: '完成率', dataIndex: 'rate', key: 'rate', align: 'right', width: 90 },
              { title: '上年同期', dataIndex: 'lastYear', key: 'lastYear', align: 'right', width: 110 },
              { title: '增长率', dataIndex: 'growth', key: 'growth', align: 'right', width: 90 },
              { title: '月进度', dataIndex: 'monthProgress', key: 'monthProgress', align: 'right', width: 90 },
              { title: '年进度', dataIndex: 'yearProgress', key: 'yearProgress', align: 'right', width: 90 },
            ]}
            dataSource={[
              { 
                key: '1', 
                name: '广州洲际', 
                occupancy: '81%', 
                avgPrice: '981', 
                perRoomIncome: '795', 
                income: '36,750', 
                budget: '40,057', 
                rate: '61%', 
                lastYear: '60,571', 
                growth: '-47%', 
                monthProgress: '47%', 
                yearProgress: '18%' 
              },
            ]}
            pagination={false}
            scroll={{ x: 1000 }}
            bordered
            size="middle"
          />
        </Card>

        {/* 数据卡片区 */}
        <Row gutter={16} style={{ marginBottom: '24px' }}>
          <Col span={12}>
            <Card title="当日">
              <Space direction="horizontal" size="large" style={{ width: '100%', justifyContent: 'space-between', display: 'flex' }}>
                <Statistic title="入住率" value={mockData.day.occupancy} suffix="%" />
                <Statistic title="平均房价" value={formatNumber(mockData.day.avgPrice)} />
                <Statistic title="总收入" value={formatNumber(mockData.day.totalIncome / 10000)} suffix="万" />
              </Space>
            </Card>
          </Col>
          <Col span={12}>
            <Card title="月累计">
              <Space direction="horizontal" size="large" style={{ width: '100%', justifyContent: 'space-between', display: 'flex' }}>
                <Statistic title="入住率" value={mockData.month.occupancy} suffix="%" />
                <Statistic title="平均房价" value={formatNumber(mockData.month.avgPrice)} />
                <Statistic title="总收入" value={formatNumber(mockData.month.totalIncome / 10000)} suffix="万" />
              </Space>
            </Card>
          </Col>
        </Row>

        {/* 收入表格区（可折叠） */}
        <Collapse defaultActiveKey={["income"]} style={{ marginBottom: '24px' }}>
          <Panel header="3月16日收入" key="income">
            <Table
              columns={[
                { title: '项目', dataIndex: 'name', key: 'name' },
                { title: '实际', dataIndex: 'actual', key: 'actual', align: 'right' },
                { title: '预算', dataIndex: 'budget', key: 'budget', align: 'right' },
                { title: '完成率', dataIndex: 'rate', key: 'rate', align: 'right' },
                { title: '上年同期', dataIndex: 'lastYear', key: 'lastYear', align: 'right' },
                { title: '增长率', dataIndex: 'growth', key: 'growth', align: 'right' },
              ]}
              dataSource={mockData.table.map(row => ({
                ...row,
                key: row.name,
                actual: typeof row.actual === 'number' ? formatNumber(row.actual) : row.actual,
                budget: typeof row.budget === 'number' ? formatNumber(row.budget) : row.budget,
                lastYear: typeof row.lastYear === 'number' ? formatNumber(row.lastYear) : row.lastYear,
              }))}
              pagination={false}
              bordered
              size="middle"
            />
          </Panel>
        </Collapse>

        {/* 月累计收入区块 */}
        <Collapse defaultActiveKey={["monthlyIncome"]} style={{ marginBottom: '24px' }}>
          <Panel header="月累计收入" key="monthlyIncome">
            <Table
              columns={[
                { title: '项目', dataIndex: 'name', key: 'name' },
                { title: '实际', dataIndex: 'actual', key: 'actual', align: 'right' },
                { title: '预算', dataIndex: 'budget', key: 'budget', align: 'right' },
                { title: '完成率', dataIndex: 'rate', key: 'rate', align: 'right' },
                { title: '上年同期', dataIndex: 'lastYear', key: 'lastYear', align: 'right' },
                { title: '增长率', dataIndex: 'growth', key: 'growth', align: 'right' },
              ]}
              dataSource={mockData.monthlyIncome.map(row => ({
                ...row,
                key: row.name,
                actual: typeof row.actual === 'number' ? formatNumber(row.actual) : row.actual,
                budget: typeof row.budget === 'number' ? formatNumber(row.budget) : row.budget,
                lastYear: typeof row.lastYear === 'number' ? formatNumber(row.lastYear) : row.lastYear,
              }))}
              pagination={false}
              bordered
              size="middle"
            />
          </Panel>
        </Collapse>

        {/* 年累计收入区块 */}
        <Collapse defaultActiveKey={["yearlyIncome"]}>
          <Panel header="年累计收入" key="yearlyIncome">
            <Table
              columns={[
                { title: '项目', dataIndex: 'name', key: 'name' },
                { title: '实际', dataIndex: 'actual', key: 'actual', align: 'right' },
                { title: '预算', dataIndex: 'budget', key: 'budget', align: 'right' },
                { title: '完成率', dataIndex: 'rate', key: 'rate', align: 'right' },
                { title: '上年同期', dataIndex: 'lastYear', key: 'lastYear', align: 'right' },
                { title: '增长率', dataIndex: 'growth', key: 'growth', align: 'right' },
                { title: '全年目标', dataIndex: 'yearlyTarget', key: 'yearlyTarget', align: 'right' },
                { title: '完成进度%', dataIndex: 'progress', key: 'progress', align: 'right' },
              ]}
              dataSource={mockData.yearlyIncome.map(row => ({
                ...row,
                key: row.name,
                actual: typeof row.actual === 'number' ? formatNumber(row.actual) : row.actual,
                budget: typeof row.budget === 'number' ? formatNumber(row.budget) : row.budget,
                lastYear: typeof row.lastYear === 'number' ? formatNumber(row.lastYear) : row.lastYear,
                yearlyTarget: typeof row.budget === 'number' ? formatNumber(row.budget * 12) : '-',
                progress: ((row.actual / (row.budget * 12)) * 100).toFixed(1) + '%',
              }))}
              pagination={false}
              bordered
              size="middle"
            />
          </Panel>
        </Collapse>
      </div>
    </TokenCheck>
  );
};

export default HotelDailyReport; 