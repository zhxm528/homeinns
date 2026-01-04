import React, { useState, useContext } from 'react';
import { 
  Card, 
  DatePicker, 
  Select, 
  Button, 
  Table, 
  Space, 
  Typography, 
  Row, 
  Col, 
  Modal,
  Tag,
  Tooltip
} from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';
import { TabContext } from '../../App';
import { useNavigate } from 'react-router-dom';
import TokenCheck from '../../components/common/TokenCheck';

const { Title } = Typography;
const { RangePicker } = DatePicker;

// 房价码映射表
const rateCodeMapping = {
  'BAR': '门市价',
  'CORP': '公司协议价',
  'GOV': '政府协议价',
  'WALK': '散客价',
  'GRP': '团队价',
  'TOUR': '旅行社价',
  'PROMO': '促销价',
  'MEMBER': '会员价',
  'VIP': 'VIP价',
  'GROUP': '团体价',
};

// 模拟数据
const mockData = [
  {
    hotelId: '001',
    hotelName: '北京建国饭店',
    rateCodeGroupName: '商务客',
    rateCodes: ['BAR', 'CORP', 'GOV'],
    channels: ['官网', '携程', '美团'],
    nights: 150,
    roomRevenue: 450000,
    avgPrice: 3000,
  },
  {
    hotelId: '002',
    hotelName: '上海建国饭店',
    rateCodeGroupName: '散客',
    rateCodes: ['BAR', 'WALK'],
    channels: ['官网', '飞猪'],
    nights: 200,
    roomRevenue: 600000,
    avgPrice: 3000,
  },
  {
    hotelId: '003',
    hotelName: '广州建国饭店',
    rateCodeGroupName: '团队客',
    rateCodes: ['GRP', 'TOUR'],
    channels: ['携程', '同程', '途牛'],
    nights: 300,
    roomRevenue: 750000,
    avgPrice: 2500,
  },
];

// 查询条件选项
const companyOptions = [
  { label: '诺金国际', value: '诺金国际' },
  { label: '首旅建国', value: '首旅建国' },
  { label: '首旅京伦', value: '首旅京伦' },
  { label: '首旅南苑', value: '首旅南苑' },
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


const RatecodeReport: React.FC = () => {
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([dayjs().subtract(30, 'day'), dayjs()]);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [selectedManageTypes, setSelectedManageTypes] = useState<string[]>([]);
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>([]);
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [selectedCityAreas, setSelectedCityAreas] = useState<string[]>([]);
  const [selectedStoreAges, setSelectedStoreAges] = useState<string[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(mockData);
  const [isRateCodeModalVisible, setIsRateCodeModalVisible] = useState(false);
  const [selectedRateCodes, setSelectedRateCodes] = useState<string[]>([]);
  const [isChannelModalVisible, setIsChannelModalVisible] = useState(false);
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);

  const tabContext = useContext(TabContext);
  const navigate = useNavigate();

  // 计算汇总数据
  const summaryData = {
    rateCodeGroupName: '汇总',
    rateCodes: [],
    channels: [],
    nights: data.reduce((sum, item) => sum + item.nights, 0),
    roomRevenue: data.reduce((sum, item) => sum + item.roomRevenue, 0),
    avgPrice: data.length > 0 ? Math.round(data.reduce((sum, item) => sum + item.roomRevenue, 0) / data.reduce((sum, item) => sum + item.nights, 0)) : 0,
  };

  const handleQuery = () => {
    setLoading(true);
    // 模拟API调用
    setTimeout(() => {
      setLoading(false);
      // 这里可以根据查询条件过滤数据
      setData(mockData);
    }, 1000);
  };

  const handleReset = () => {
    setDateRange([dayjs().subtract(30, 'day'), dayjs()]);
    setSelectedCompanies([]);
    setSelectedManageTypes([]);
    setSelectedPropertyTypes([]);
    setSelectedDistricts([]);
    setSelectedCityAreas([]);
    setSelectedStoreAges([]);
  };

  const handleViewRateCodes = (rateCodes: string[]) => {
    setSelectedRateCodes(rateCodes);
    setIsRateCodeModalVisible(true);
  };

  const handleViewChannels = (channels: string[]) => {
    setSelectedChannels(channels);
    setIsChannelModalVisible(true);
  };

  const columns = [
    {
      title: '房价码组名称',
      dataIndex: 'rateCodeGroupName',
      key: 'rateCodeGroupName',
      width: 200,
      fixed: 'left' as const,
      render: (text: string) => (
        <div className="sticky-column" style={{ 
          position: 'sticky', 
          left: 0, 
          backgroundColor: '#f9fafb',
          zIndex: 10,
          boxShadow: '2px 0 5px rgba(0,0,0,0.1)'
        }}>
          {text}
        </div>
      ),
    },
    {
      title: '包含的房价码',
      dataIndex: 'rateCodes',
      key: 'rateCodes',
      width: 150,
      render: (rateCodes: string[]) => (
        <Tooltip title="点击查看详细房价码">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleViewRateCodes(rateCodes)}
            style={{ padding: 0 }}
          >
            查看房价码
          </Button>
        </Tooltip>
      ),
    },
    {
      title: '包含的渠道',
      dataIndex: 'channels',
      key: 'channels',
      width: 150,
      render: (channels: string[]) => (
        <Tooltip title="点击查看详细渠道">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleViewChannels(channels)}
            style={{ padding: 0 }}
          >
            查看渠道
          </Button>
        </Tooltip>
      ),
    },
    {
      title: '间夜数',
      dataIndex: 'nights',
      key: 'nights',
      width: 120,
      align: 'right' as const,
      render: (text: number) => text.toLocaleString(),
    },
    {
      title: '客房收入',
      dataIndex: 'roomRevenue',
      key: 'roomRevenue',
      width: 150,
      align: 'right' as const,
      render: (text: number) => `¥${text.toLocaleString()}`,
    },
    {
      title: '平均房价',
      dataIndex: 'avgPrice',
      key: 'avgPrice',
      width: 120,
      align: 'right' as const,
      render: (text: number) => `¥${text.toLocaleString()}`,
    },
  ];

  // 构建查询条件显示文本
  const getQueryConditionsText = () => {
    const conditions = [];
    if (dateRange) {
      conditions.push(`日期范围: ${dateRange[0].format('YYYY-MM-DD')} 至 ${dateRange[1].format('YYYY-MM-DD')}`);
    }
    if (selectedCompanies.length > 0) {
      conditions.push(`管理公司: ${selectedCompanies.join(', ')}`);
    }
    if (selectedManageTypes.length > 0) {
      conditions.push(`管理类型: ${selectedManageTypes.join(', ')}`);
    }
    if (selectedPropertyTypes.length > 0) {
      conditions.push(`产权类型: ${selectedPropertyTypes.join(', ')}`);
    }
    if (selectedDistricts.length > 0) {
      conditions.push(`大区: ${selectedDistricts.join(', ')}`);
    }
    if (selectedCityAreas.length > 0) {
      conditions.push(`城区: ${selectedCityAreas.join(', ')}`);
    }
    if (selectedStoreAges.length > 0) {
      conditions.push(`店龄: ${selectedStoreAges.join(', ')}`);
    }
    return conditions.length > 0 ? conditions.join(' | ') : '全部条件';
  };

  return (
    <TokenCheck>
      <div className="p-6">
        {/* 查询条件区域 */}
        <Card style={{ marginBottom: '24px' }}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Title level={4}>房价码报表</Title>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={8} lg={6}>
                <RangePicker
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
            </Row>
            <Row justify="end">
              <Col>
                <Space>
                  <Button onClick={handleReset}>重置</Button>
                  <Button type="primary" onClick={handleQuery} loading={loading}>
                    查询
                  </Button>
                </Space>
              </Col>
            </Row>
          </Space>
        </Card>

        {/* 查询条件显示 */}
        <Card style={{ marginBottom: '24px' }}>
          <div style={{ padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '6px' }}>
            <strong>当前查询条件：</strong>
            <span style={{ marginLeft: '8px', color: '#666' }}>
              {getQueryConditionsText()}
            </span>
          </div>
        </Card>

        {/* 数据表格 */}
        <Card>
          <div className="overflow-x-auto" style={{ position: 'relative', minHeight: '400px' }}>
            <table 
              className="min-w-full divide-y divide-gray-200" 
              style={{ 
                tableLayout: 'fixed', 
                borderCollapse: 'separate', 
                borderSpacing: 0, 
                minWidth: '1000px' 
              }}
            >
              <thead style={{ position: 'sticky', top: 0, zIndex: 20, backgroundColor: '#f9fafb' }}>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky-header" 
                      style={{ 
                        left: 0, 
                        width: '200px', 
                        boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
                        backgroundColor: '#f9fafb'
                      }}>
                    房价码组名称
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" 
                      style={{ width: '150px' }}>
                    包含的房价码
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" 
                      style={{ width: '150px' }}>
                    包含的渠道
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider" 
                      style={{ width: '120px' }}>
                    间夜数
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider" 
                      style={{ width: '150px' }}>
                    客房收入
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider" 
                      style={{ width: '120px' }}>
                    平均房价
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* 汇总行 */}
                <tr className="group bg-blue-50 font-semibold">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 sticky-column" 
                      style={{ 
                        position: 'sticky', 
                        left: 0, 
                        backgroundColor: '#dbeafe',
                        zIndex: 10,
                        boxShadow: '2px 0 5px rgba(0,0,0,0.1)'
                      }}>
                    {summaryData.rateCodeGroupName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    -
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    -
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                    {summaryData.nights.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                    ¥{summaryData.roomRevenue.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                    ¥{summaryData.avgPrice.toLocaleString()}
                  </td>
                </tr>
                
                {/* 数据行 */}
                {data.map((item, index) => (
                  <tr key={index} className="group hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 sticky-column" 
                        style={{ 
                          position: 'sticky', 
                          left: 0, 
                          backgroundColor: 'white',
                          zIndex: 10,
                          boxShadow: '2px 0 5px rgba(0,0,0,0.1)'
                        }}>
                      {item.rateCodeGroupName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <Tooltip title="点击查看详细房价码">
                        <Button
                          type="link"
                          icon={<EyeOutlined />}
                          onClick={() => handleViewRateCodes(item.rateCodes)}
                          style={{ padding: 0 }}
                        >
                          查看房价码
                        </Button>
                      </Tooltip>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <Tooltip title="点击查看详细渠道">
                        <Button
                          type="link"
                          icon={<EyeOutlined />}
                          onClick={() => handleViewChannels(item.channels)}
                          style={{ padding: 0 }}
                        >
                          查看渠道
                        </Button>
                      </Tooltip>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      {item.nights.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      ¥{item.roomRevenue.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      ¥{item.avgPrice.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* 房价码详情弹框 */}
        <Modal
          title="房价码详情"
          open={isRateCodeModalVisible}
          onCancel={() => setIsRateCodeModalVisible(false)}
          footer={null}
          width={500}
        >
          <div style={{ padding: '16px 0' }}>
            <p style={{ marginBottom: '12px', fontWeight: 'bold' }}>包含的房价码：</p>
            <div style={{ marginBottom: '16px' }}>
              {selectedRateCodes.map((code, index) => (
                <div key={index} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  marginBottom: '8px',
                  padding: '8px',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '4px'
                }}>
                  <Tag color="blue" style={{ marginRight: '12px', minWidth: '60px', textAlign: 'center' }}>
                    {code}
                  </Tag>
                  <span style={{ color: '#333', fontWeight: '500' }}>
                    {rateCodeMapping[code as keyof typeof rateCodeMapping] || '未知房价码'}
                  </span>
                </div>
              ))}
            </div>
            <div style={{ 
              padding: '12px', 
              backgroundColor: '#e6f7ff', 
              borderRadius: '4px',
              border: '1px solid #91d5ff'
            }}>
              <p style={{ margin: 0, color: '#1890ff', fontSize: '14px' }}>
                <strong>说明：</strong>共包含 {selectedRateCodes.length} 个房价码
              </p>
            </div>
          </div>
         </Modal>

         {/* 渠道详情弹框 */}
         <Modal
           title="渠道详情"
           open={isChannelModalVisible}
           onCancel={() => setIsChannelModalVisible(false)}
           footer={null}
           width={500}
         >
           <div style={{ padding: '16px 0' }}>
             <p style={{ marginBottom: '12px', fontWeight: 'bold' }}>包含的渠道：</p>
             <div style={{ marginBottom: '16px' }}>
               {selectedChannels.map((channel, index) => (
                 <div key={index} style={{ 
                   display: 'flex', 
                   alignItems: 'center', 
                   marginBottom: '8px',
                   padding: '8px',
                   backgroundColor: '#f5f5f5',
                   borderRadius: '4px'
                 }}>
                   <Tag color="green" style={{ marginRight: '12px', minWidth: '60px', textAlign: 'center' }}>
                     {channel}
                   </Tag>
                   <span style={{ color: '#333', fontWeight: '500' }}>
                     {channel}
                   </span>
                 </div>
               ))}
             </div>
             <div style={{ 
               padding: '12px', 
               backgroundColor: '#f6ffed', 
               borderRadius: '4px',
               border: '1px solid #b7eb8f'
             }}>
               <p style={{ margin: 0, color: '#52c41a', fontSize: '14px' }}>
                 <strong>说明：</strong>共包含 {selectedChannels.length} 个渠道
               </p>
             </div>
           </div>
         </Modal>
      </div>
    </TokenCheck>
  );
};

export default RatecodeReport;