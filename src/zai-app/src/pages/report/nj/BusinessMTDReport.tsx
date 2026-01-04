import React, { useState, useEffect, useRef } from 'react';
import { Card, DatePicker, Select, Button, Row, Col, Space, Typography, Table, Form, Input, Switch, Tooltip } from 'antd';
import { UpOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';
import type { ColumnsType } from 'antd/es/table';
import TokenCheck from '@/components/common/TokenCheck';

// 引入封装好的组件
import BarChart from '@/components/echart/BarChart';
import LineChart from '@/components/echart/LineChart';
// import PieChart from '@/components/echart/PieChart';

// 表格数据类型定义
interface TableDataItem {
  key: string;
  hotelCode: string;
  hotelName: string;
  propertyType: string;
  hotelType: string;
  managementCompany: string;
  brand: string;
  city: string;
  chainName: string;
  mtdRevenue: number;
  mtdOccupancy: number;
  mtdAdr: number;
  mtdRevpar: number;
  budgetRevenue: number;
  budgetOccupancy: number;
  lastYearRevenue: number;
  lastYearOccupancy: number;
  // 新增字段
  revpar?: number;
  revparLastYear?: number;
  revparBudget?: number;
  adv?: number;
  advLastYear?: number;
  advBudget?: number;
  occ?: number;
  occLastYear?: number;
  occBudget?: number;
  roomRevenue?: number;
  roomRevenueLastYear?: number;
  roomRevenueBudget?: number;
  foodRevenue?: number;
  foodRevenueLastYear?: number;
  foodRevenueBudget?: number;
  totalRevenue?: number;
  totalRevenueLastYear?: number;
  totalRevenueBudget?: number;
  availableRooms?: number;
  availableRoomsLastYear?: number;
  availableRoomsBudget?: number;
  actualRentedRooms?: number;
  actualRentedRoomsLastYear?: number;
  actualRentedRoomsBudget?: number;
}

interface ChartDataItem {
  hotelName: string;
  mtdRevenue: number;
  budgetRevenue: number;
  lastYearRevenue: number;
}

// 模拟数据
const mockTableData: TableDataItem[] = [
  {
    key: '1',
    hotelCode: 'NY0009',
    hotelName: '首旅南苑雪山饭店',
    propertyType: '非产权店',
    hotelType: '委托管理',
    managementCompany: '首旅南苑',
    brand: '首旅南苑',
    city: '温州',
    chainName: '首旅南苑',
    mtdRevenue: 1250000,
    mtdOccupancy: 85.6,
    mtdAdr: 680,
    mtdRevpar: 582,
    budgetRevenue: 1300000,
    budgetOccupancy: 88.0,
    lastYearRevenue: 1180000,
    lastYearOccupancy: 82.3,
  },
  {
    key: '2',
    hotelCode: 'NY0002',
    hotelName: '南苑环球酒店',
    propertyType: '首酒',
    hotelType: '委托管理',
    managementCompany: '首旅南苑',
    brand: '首旅南苑',
    city: '宁波',
    chainName: '首旅南苑',
    mtdRevenue: 980000,
    mtdOccupancy: 78.2,
    mtdAdr: 620,
    mtdRevpar: 485,
    budgetRevenue: 1000000,
    budgetOccupancy: 80.0,
    lastYearRevenue: 920000,
    lastYearOccupancy: 75.8,
  },
  {
    key: '3',
    hotelCode: 'JG0001',
    hotelName: '北京建国饭店',
    propertyType: '置业',
    hotelType: '委托管理',
    managementCompany: '首旅建国',
    brand: '建国',
    city: '北京',
    chainName: '首旅建国',
    mtdRevenue: 1560000,
    mtdOccupancy: 92.1,
    mtdAdr: 720,
    mtdRevpar: 663,
    budgetRevenue: 1500000,
    budgetOccupancy: 90.0,
    lastYearRevenue: 1420000,
    lastYearOccupancy: 89.5,
  },
  {
    key: '4',
    hotelCode: 'NI0001',
    hotelName: '诺金酒店',
    propertyType: '置业',
    hotelType: '委托管理',
    managementCompany: '凯燕',
    brand: '诺金',
    city: '北京',
    chainName: '诺金国际',
    mtdRevenue: 2100000,
    mtdOccupancy: 95.2,
    mtdAdr: 1200,
    mtdRevpar: 1142,
    budgetRevenue: 2000000,
    budgetOccupancy: 92.0,
    lastYearRevenue: 1950000,
    lastYearOccupancy: 91.8,
  },
  {
    key: '5',
    hotelCode: 'KP0001',
    hotelName: '北京凯宾斯基',
    propertyType: '置业',
    hotelType: '委托管理',
    managementCompany: '凯燕',
    brand: '凯宾斯基',
    city: '北京',
    chainName: '凯燕',
    mtdRevenue: 1800000,
    mtdOccupancy: 88.7,
    mtdAdr: 950,
    mtdRevpar: 843,
    budgetRevenue: 1750000,
    budgetOccupancy: 87.0,
    lastYearRevenue: 1680000,
    lastYearOccupancy: 85.2,
  },
  {
    key: '6',
    hotelCode: 'NY0001',
    hotelName: '南苑饭店',
    propertyType: '首酒',
    hotelType: '委托管理',
    managementCompany: '首旅南苑',
    brand: '首旅南苑',
    city: '宁波',
    chainName: '首旅南苑',
    mtdRevenue: 1350000,
    mtdOccupancy: 82.5,
    mtdAdr: 750,
    mtdRevpar: 619,
    budgetRevenue: 1400000,
    budgetOccupancy: 85.0,
    lastYearRevenue: 1280000,
    lastYearOccupancy: 80.1,
  },
  {
    key: '7',
    hotelCode: 'JG0002',
    hotelName: '北京国际饭店',
    propertyType: '置业',
    hotelType: '委托管理',
    managementCompany: '首旅建国',
    brand: '建国',
    city: '北京',
    chainName: '首旅建国',
    mtdRevenue: 1680000,
    mtdOccupancy: 89.3,
    mtdAdr: 850,
    mtdRevpar: 759,
    budgetRevenue: 1650000,
    budgetOccupancy: 88.0,
    lastYearRevenue: 1550000,
    lastYearOccupancy: 86.7,
  },
  {
    key: '8',
    hotelCode: 'JL0008',
    hotelName: '京伦饭店',
    propertyType: '首酒',
    hotelType: '委托管理',
    managementCompany: '首旅京伦',
    brand: '京伦',
    city: '北京',
    chainName: '首旅京伦',
    mtdRevenue: 1420000,
    mtdOccupancy: 86.8,
    mtdAdr: 780,
    mtdRevpar: 677,
    budgetRevenue: 1450000,
    budgetOccupancy: 87.0,
    lastYearRevenue: 1350000,
    lastYearOccupancy: 84.2,
  },
];

const mockChartData: ChartDataItem[] = [
  { hotelName: '首旅南苑雪山饭店', mtdRevenue: 1250000, budgetRevenue: 1300000, lastYearRevenue: 1180000 },
  { hotelName: '南苑环球酒店', mtdRevenue: 980000, budgetRevenue: 1000000, lastYearRevenue: 920000 },
  { hotelName: '北京建国饭店', mtdRevenue: 1560000, budgetRevenue: 1500000, lastYearRevenue: 1420000 },
  { hotelName: '诺金酒店', mtdRevenue: 2100000, budgetRevenue: 2000000, lastYearRevenue: 1950000 },
  { hotelName: '北京凯宾斯基', mtdRevenue: 1800000, budgetRevenue: 1750000, lastYearRevenue: 1680000 },
  { hotelName: '南苑饭店', mtdRevenue: 1350000, budgetRevenue: 1400000, lastYearRevenue: 1280000 },
  { hotelName: '北京国际饭店', mtdRevenue: 1680000, budgetRevenue: 1650000, lastYearRevenue: 1550000 },
  { hotelName: '京伦饭店', mtdRevenue: 1420000, budgetRevenue: 1450000, lastYearRevenue: 1350000 },
];

// 酒店列表 - 按照详细列表更新
const hotelList = [
  '首旅南苑雪山饭店',
  '南苑新城-绍兴柯桥东方山水店',
  '绍兴首旅南苑酒店',
  '南苑饭店',
  '南苑环球酒店',
  '首旅南苑云荟酒店',
  '中林南苑云上清溪',
  '南苑新城酒店（东钱湖店）',
  '象山华友首旅南苑云荟酒店',
  '南苑五龙潭度假酒店',
  '宁波东部新城首旅南苑环球酒店',
  '杭州首旅南苑凯豪酒店',
  '上合南苑云荟酒店',
  '舟旅南苑海上丝绸之路酒店',
  '广州建国酒店',
  '北京建国饭店',
  '北京国际饭店',
  '西苑饭店',
  '北京前门建国饭店',
  '民族饭店',
  '北京工大建国饭店(北工大科技大厦)',
  '北京唯实国际文化交流中心',
  '北京松鹤建国培训中心',
  '北京中建雁栖湖景酒店',
  '北京好苑建国酒店',
  '北京银保建国酒店',
  '沙河唯实国际文化交流中心',
  '亚洲大酒店',
  '北京展览馆宾馆',
  '崇文门饭店',
  '宣武门商务酒店',
  '东方饭店',
  '和平里大酒店',
  '北京香山饭店',
  '京伦饭店',
  '沙家浜建国铂萃酒店',
  '苏州黎花建国度假酒店',
  '兰州长城建国饭店',
  '江西南昌文演建国饭店',
  '杭州白马湖建国饭店',
  '山东烟台凤凰大厦建国饭店',
  '海阳建国饭店',
  '青岛-上合建国饭店',
  '郑州建国饭店',
  '郑地奥体建国饭店',
  '郑州正商建国饭店',
  '正商林溪铭筑京伦酒店',
  '西安建国饭店',
  '武汉东方建国大酒店',
  '江诚建国饭店',
  '遵义中建建国酒店',
  '九江信华建国酒店',
  '九江荣华建国酒店',
  '三亚红塘湾建国度假酒店',
  '威海海悦建国饭店',
  '平舆建国国际酒店',
  '商丘信华建国酒店',
  '商丘瑞恒建国饭店',
  '迁安建国饭店',
  '秦皇岛首旅京伦酒店',
  '雄安绿博园建国饭店',
  '泸州建国饭店',
  '宝鸡建国饭店',
  '渭南建国饭店',
  '渭南建国饭店B座',
  '韶山建国酒店',
  '郴州仙居岭京伦酒店',
  '平遥峰岩建国饭店',
  '运城建国饭店',
  '康城建国国际大酒店',
  '正商红椰湾京伦酒店',
  '吉林通化丽景建国饭店',
  '元和建国饭店',
  '昌吉建国饭店',
  '自贡建国饭店',
  '长桓宏瑞建国',
  '亮马河大厦',
  '汀州建国',
  '雁荡山建国',
  '澄碧建国',
  '兴安盟建国',
  '新侨饭店',
  '庚华建国',
  '呼伦贝尔',
  '大同云冈',
  '三亚石溪墅',
  '丹东威尼斯',
  '南苑新芝宾馆 （含新芝二期宁波国宾馆）',
  '泸州首旅航发空港酒店',
  '南苑JUN酒店',
  '前湾海悦首旅南苑酒店',
  '南苑汐山温泉酒店',
  '宁波国际会议中心酒店（望岚酒店）',
  '北京凯宾斯基',
  '诺金酒店',
  '北京饭店诺金',
  '环球影城诺金',
  '环球影城大酒店',
  '雄安国际酒店',
  '朱家角安麓',
  '官塘安麓',
  '兰考富成建国酒店',
];

// 合并所有酒店为表格展示数据：优先使用已有的 mockTableData，其他酒店填充默认值
const allHotelData: TableDataItem[] = hotelList.map((hotelName, index) => {
  const existing = mockTableData.find(item => item.hotelName === hotelName);
  if (existing) return existing;
  const simulatedCode = `SIM${String(index + 1).padStart(4, '0')}`;
  return {
    key: `h-${index + 1}`,
    hotelCode: simulatedCode,
    hotelName,
    propertyType: '',
    hotelType: '',
    managementCompany: '',
    brand: '',
    city: '',
    chainName: '',
    mtdRevenue: 0,
    mtdOccupancy: 0,
    mtdAdr: 0,
    mtdRevpar: 0,
    budgetRevenue: 0,
    budgetOccupancy: 0,
    lastYearRevenue: 0,
    lastYearOccupancy: 0,
  };
});

// 管理公司选项
const companyOptions = [
  { label: '首旅南苑', value: '首旅南苑' },
  { label: '首旅建国', value: '首旅建国' },
  { label: '首旅京伦', value: '首旅京伦' },
  { label: '凯燕', value: '凯燕' },
  { label: '诺金管理', value: '诺金管理' },
  { label: '安麓', value: '安麓' },
];

// 管理类型选项
const manageTypeOptions = [
  { label: '委托管理', value: '委托管理' },
  { label: '特许经营', value: '特许经营' },
];

// 产权类型选项
const propertyTypeOptions = [
  { label: '非产权店', value: '非产权店' },
  { label: '首酒', value: '首酒' },
  { label: '置业', value: '置业' },
  { label: '首旅', value: '首旅' },
  { label: '北展', value: '北展' },
  { label: '合资', value: '合资' },
];

// 大区选项
const districtOptions = [
  { label: '一区', value: '一区' },
  { label: '二区', value: '二区' },
];

// 城区选项
const cityAreaOptions = [
  { label: '华中', value: '华中' },
  { label: '华南', value: '华南' },
  { label: '华北', value: '华北' },
  { label: '华东', value: '华东' },
  { label: '华西', value: '华西' },
];

// 品牌选项
const brandOptions = [
  { label: '首旅南苑', value: '首旅南苑' },
  { label: '首旅南苑云荟', value: '首旅南苑云荟' },
  { label: '建国', value: '建国' },
  { label: '建国铂萃', value: '建国铂萃' },
  { label: '京伦', value: '京伦' },
  { label: '凯宾斯基', value: '凯宾斯基' },
  { label: '诺金', value: '诺金' },
  { label: '白牌', value: '白牌' },
  { label: '安麓', value: '安麓' },
];

// 城市选项
const cityOptions = [
  { label: '温州', value: '温州' },
  { label: '绍兴', value: '绍兴' },
  { label: '宁波', value: '宁波' },
  { label: '青岛', value: '青岛' },
  { label: '舟山', value: '舟山' },
  { label: '广州', value: '广州' },
  { label: '北京', value: '北京' },
  { label: '苏州', value: '苏州' },
  { label: '兰州', value: '兰州' },
  { label: '南昌', value: '南昌' },
  { label: '杭州', value: '杭州' },
  { label: '烟台', value: '烟台' },
  { label: '海阳', value: '海阳' },
  { label: '郑州', value: '郑州' },
  { label: '西安', value: '西安' },
  { label: '武汉', value: '武汉' },
  { label: '遵义', value: '遵义' },
  { label: '九江', value: '九江' },
  { label: '三亚', value: '三亚' },
  { label: '威海', value: '威海' },
  { label: '驻马店', value: '驻马店' },
  { label: '商丘', value: '商丘' },
  { label: '唐山', value: '唐山' },
  { label: '秦皇岛', value: '秦皇岛' },
  { label: '雄安新区', value: '雄安新区' },
  { label: '泸州', value: '泸州' },
  { label: '宝鸡', value: '宝鸡' },
  { label: '渭南', value: '渭南' },
  { label: '韶山', value: '韶山' },
  { label: '郴州', value: '郴州' },
  { label: '平遥', value: '平遥' },
  { label: '运城', value: '运城' },
  { label: '克拉玛依', value: '克拉玛依' },
  { label: '文昌', value: '文昌' },
  { label: '通化', value: '通化' },
  { label: '锡林浩特', value: '锡林浩特' },
  { label: '昌吉', value: '昌吉' },
  { label: '自贡', value: '自贡' },
  { label: '长垣市', value: '长垣市' },
  { label: '汀州', value: '汀州' },
  { label: '乐清', value: '乐清' },
  { label: '兰考', value: '兰考' },
  { label: '琼海', value: '琼海' },
  { label: '呼伦贝尔', value: '呼伦贝尔' },
  { label: '大同', value: '大同' },
  { label: '丹东', value: '丹东' },
  { label: '宁海', value: '宁海' },
  { label: '上海', value: '上海' },
  { label: '成都', value: '成都' },
];

const BusinessMTDReport: React.FC = () => {
  const [form] = Form.useForm();
  const [date, setDate] = useState<dayjs.Dayjs>(dayjs().startOf('month'));
  const [selectedHotels, setSelectedHotels] = useState<string[]>([]);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [selectedManageTypes, setSelectedManageTypes] = useState<string[]>([]);
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>([]);
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [selectedCityAreas, setSelectedCityAreas] = useState<string[]>([]);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [expandedPanels, setExpandedPanels] = useState({
    queryForm: true,
    preview: true,
    trend: true,
    detail: true
  });
  const queryFormRef = useRef<HTMLDivElement>(null);

  // 滚动到查询条件区域的函数
  const scrollToQueryForm = () => {
    queryFormRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 组件挂载后设置表单初始值
  useEffect(() => {
    form.setFieldsValue({
      date: dayjs().startOf('month')
    });
  }, [form]);

  // 切换Panel展开/收起状态
  const togglePanel = (panelKey: keyof typeof expandedPanels) => {
    setExpandedPanels(prev => ({
      ...prev,
      [panelKey]: !prev[panelKey]
    }));
  };

  // 帮助提示内容
  const helpContent = (
    <div>
      <div>1、入住率=实际出租间夜数/可售间夜数</div>
      <div>2、平均房价=客房收入/实际出租间夜数</div>
      <div>3、RevPAR=客房收入/可售间夜数</div>
      <div>4、单房收益=总收入/可售间夜数</div>
    </div>
  );

  // 指标预览帮助提示内容
  const previewHelpContent = (
    <div>
      <div>1、数据来源为符合查询条件的所有酒店汇总</div>
      <div>2、差异%=(本期值-去年同期值)/去年同期值</div>
      <div>3、完成率%=(本期值-预算值)/预算值</div>
    </div>
  );

  // 指标明细帮助提示内容
  const detailHelpContent = (
    <div>
      <div>1、显示12个月的月度数据趋势</div>
      <div>2、数据来源为符合查询条件的所有酒店汇总</div>
    </div>
  );

  // 第一个表格列定义
  const columns1: ColumnsType<TableDataItem> = [
    {
      title: '酒店编号',
      dataIndex: 'hotelCode',
      key: 'hotelCode',
      fixed: 'left',
      width: 100,
    },
    {
      title: '酒店名称',
      dataIndex: 'hotelName',
      key: 'hotelName',
      fixed: 'left',
      width: 180,
    },
    {
      title: 'RevPAR',
      dataIndex: 'revpar',
      key: 'revpar',
      width: 100,
      render: (value) => value?.toLocaleString() || '-',
    },
    {
      title: '去年同期',
      dataIndex: 'revparLastYear',
      key: 'revparLastYear',
      width: 100,
      render: (value) => value?.toLocaleString() || '-',
    },
    {
      title: '差异%',
      key: 'revparDiff',
      width: 80,
      render: (_, record) => {
        if (record.revpar && record.revparLastYear) {
          const diff = ((record.revpar - record.revparLastYear) / record.revparLastYear * 100).toFixed(1);
          const color = parseFloat(diff) >= 0 ? '#52c41a' : '#ff4d4f';
          return <span style={{ color }}>{diff}%</span>;
        }
        return '-';
      },
    },
    {
      title: '预算',
      dataIndex: 'revparBudget',
      key: 'revparBudget',
      width: 100,
      render: (value) => value?.toLocaleString() || '-',
    },
    {
      title: '完成率%',
      key: 'revparCompletion',
      width: 80,
      render: (_, record) => {
        if (record.revpar && record.revparBudget) {
          const rate = (record.revpar / record.revparBudget * 100).toFixed(1);
          return `${rate}%`;
        }
        return '-';
      },
    },
    {
      title: 'ADV',
      dataIndex: 'adv',
      key: 'adv',
      width: 100,
      render: (value) => value?.toLocaleString() || '-',
    },
    {
      title: '去年同期',
      dataIndex: 'advLastYear',
      key: 'advLastYear',
      width: 100,
      render: (value) => value?.toLocaleString() || '-',
    },
    {
      title: '差异%',
      key: 'advDiff',
      width: 80,
      render: (_, record) => {
        if (record.adv && record.advLastYear) {
          const diff = ((record.adv - record.advLastYear) / record.advLastYear * 100).toFixed(1);
          const color = parseFloat(diff) >= 0 ? '#52c41a' : '#ff4d4f';
          return <span style={{ color }}>{diff}%</span>;
        }
        return '-';
      },
    },
    {
      title: '预算',
      dataIndex: 'advBudget',
      key: 'advBudget',
      width: 100,
      render: (value) => value?.toLocaleString() || '-',
    },
    {
      title: '完成率%',
      key: 'advCompletion',
      width: 80,
      render: (_, record) => {
        if (record.adv && record.advBudget) {
          const rate = (record.adv / record.advBudget * 100).toFixed(1);
          return `${rate}%`;
        }
        return '-';
      },
    },
    {
      title: 'OCC',
      dataIndex: 'occ',
      key: 'occ',
      width: 80,
      render: (value) => value ? `${value}%` : '-',
    },
    {
      title: '去年同期',
      dataIndex: 'occLastYear',
      key: 'occLastYear',
      width: 100,
      render: (value) => value ? `${value}%` : '-',
    },
    {
      title: '差异%',
      key: 'occDiff',
      width: 80,
      render: (_, record) => {
        if (record.occ && record.occLastYear) {
          const diff = (record.occ - record.occLastYear).toFixed(1);
          const color = parseFloat(diff) >= 0 ? '#52c41a' : '#ff4d4f';
          return <span style={{ color }}>{diff}%</span>;
        }
        return '-';
      },
    },
    {
      title: '预算',
      dataIndex: 'occBudget',
      key: 'occBudget',
      width: 80,
      render: (value) => value ? `${value}%` : '-',
    },
    {
      title: '完成率%',
      key: 'occCompletion',
      width: 80,
      render: (_, record) => {
        if (record.occ && record.occBudget) {
          const rate = (record.occ / record.occBudget * 100).toFixed(1);
          return `${rate}%`;
        }
        return '-';
      },
    },
    {
      title: '客房收入',
      dataIndex: 'roomRevenue',
      key: 'roomRevenue',
      width: 120,
      render: (value) => value?.toLocaleString() || '-',
    },
    {
      title: '去年同期',
      dataIndex: 'roomRevenueLastYear',
      key: 'roomRevenueLastYear',
      width: 100,
      render: (value) => value?.toLocaleString() || '-',
    },
    {
      title: '差异%',
      key: 'roomRevenueDiff',
      width: 80,
      render: (_, record) => {
        if (record.roomRevenue && record.roomRevenueLastYear) {
          const diff = ((record.roomRevenue - record.roomRevenueLastYear) / record.roomRevenueLastYear * 100).toFixed(1);
          const color = parseFloat(diff) >= 0 ? '#52c41a' : '#ff4d4f';
          return <span style={{ color }}>{diff}%</span>;
        }
        return '-';
      },
    },
    {
      title: '预算',
      dataIndex: 'roomRevenueBudget',
      key: 'roomRevenueBudget',
      width: 100,
      render: (value) => value?.toLocaleString() || '-',
    },
    {
      title: '完成率%',
      key: 'roomRevenueCompletion',
      width: 80,
      render: (_, record) => {
        if (record.roomRevenue && record.roomRevenueBudget) {
          const rate = (record.roomRevenue / record.roomRevenueBudget * 100).toFixed(1);
          return `${rate}%`;
        }
        return '-';
      },
    },
    {
      title: '餐饮收入',
      dataIndex: 'foodRevenue',
      key: 'foodRevenue',
      width: 120,
      render: (value) => value?.toLocaleString() || '-',
    },
    {
      title: '去年同期',
      dataIndex: 'foodRevenueLastYear',
      key: 'foodRevenueLastYear',
      width: 100,
      render: (value) => value?.toLocaleString() || '-',
    },
    {
      title: '差异%',
      key: 'foodRevenueDiff',
      width: 80,
      render: (_, record) => {
        if (record.foodRevenue && record.foodRevenueLastYear) {
          const diff = ((record.foodRevenue - record.foodRevenueLastYear) / record.foodRevenueLastYear * 100).toFixed(1);
          const color = parseFloat(diff) >= 0 ? '#52c41a' : '#ff4d4f';
          return <span style={{ color }}>{diff}%</span>;
        }
        return '-';
      },
    },
    {
      title: '预算',
      dataIndex: 'foodRevenueBudget',
      key: 'foodRevenueBudget',
      width: 100,
      render: (value) => value?.toLocaleString() || '-',
    },
    {
      title: '完成率%',
      key: 'foodRevenueCompletion',
      width: 80,
      render: (_, record) => {
        if (record.foodRevenue && record.foodRevenueBudget) {
          const rate = (record.foodRevenue / record.foodRevenueBudget * 100).toFixed(1);
          return `${rate}%`;
        }
        return '-';
      },
    },
    {
      title: '总收入',
      dataIndex: 'totalRevenue',
      key: 'totalRevenue',
      width: 120,
      render: (value) => value?.toLocaleString() || '-',
    },
    {
      title: '去年同期',
      dataIndex: 'totalRevenueLastYear',
      key: 'totalRevenueLastYear',
      width: 100,
      render: (value) => value?.toLocaleString() || '-',
    },
    {
      title: '差异%',
      key: 'totalRevenueDiff',
      width: 80,
      render: (_, record) => {
        if (record.totalRevenue && record.totalRevenueLastYear) {
          const diff = ((record.totalRevenue - record.totalRevenueLastYear) / record.totalRevenueLastYear * 100).toFixed(1);
          const color = parseFloat(diff) >= 0 ? '#52c41a' : '#ff4d4f';
          return <span style={{ color }}>{diff}%</span>;
        }
        return '-';
      },
    },
    {
      title: '预算',
      dataIndex: 'totalRevenueBudget',
      key: 'totalRevenueBudget',
      width: 100,
      render: (value) => value?.toLocaleString() || '-',
    },
    {
      title: '完成率%',
      key: 'totalRevenueCompletion',
      width: 80,
      render: (_, record) => {
        if (record.totalRevenue && record.totalRevenueBudget) {
          const rate = (record.totalRevenue / record.totalRevenueBudget * 100).toFixed(1);
          return `${rate}%`;
        }
        return '-';
      },
    },
    {
      title: '可售房数',
      dataIndex: 'availableRooms',
      key: 'availableRooms',
      width: 100,
      render: (value) => value?.toLocaleString() || '-',
    },
    {
      title: '年同期',
      dataIndex: 'availableRoomsLastYear',
      key: 'availableRoomsLastYear',
      width: 100,
      render: (value) => value?.toLocaleString() || '-',
    },
    {
      title: '差异%',
      key: 'availableRoomsDiff',
      width: 80,
      render: (_, record) => {
        if (record.availableRooms && record.availableRoomsLastYear) {
          const diff = ((record.availableRooms - record.availableRoomsLastYear) / record.availableRoomsLastYear * 100).toFixed(1);
          const color = parseFloat(diff) >= 0 ? '#52c41a' : '#ff4d4f';
          return <span style={{ color }}>{diff}%</span>;
        }
        return '-';
      },
    },
    {
      title: '预算',
      dataIndex: 'availableRoomsBudget',
      key: 'availableRoomsBudget',
      width: 100,
      render: (value) => value?.toLocaleString() || '-',
    },
    {
      title: '完成率%',
      key: 'availableRoomsCompletion',
      width: 80,
      render: (_, record) => {
        if (record.availableRooms && record.availableRoomsBudget) {
          const rate = (record.availableRooms / record.availableRoomsBudget * 100).toFixed(1);
          return `${rate}%`;
        }
        return '-';
      },
    },
    {
      title: '实际出租数',
      dataIndex: 'actualRentedRooms',
      key: 'actualRentedRooms',
      width: 100,
      render: (value) => value?.toLocaleString() || '-',
    },
    {
      title: '年同期',
      dataIndex: 'actualRentedRoomsLastYear',
      key: 'actualRentedRoomsLastYear',
      width: 100,
      render: (value) => value?.toLocaleString() || '-',
    },
    {
      title: '差异%',
      key: 'actualRentedRoomsDiff',
      width: 80,
      render: (_, record) => {
        if (record.actualRentedRooms && record.actualRentedRoomsLastYear) {
          const diff = ((record.actualRentedRooms - record.actualRentedRoomsLastYear) / record.actualRentedRoomsLastYear * 100).toFixed(1);
          const color = parseFloat(diff) >= 0 ? '#52c41a' : '#ff4d4f';
          return <span style={{ color }}>{diff}%</span>;
        }
        return '-';
      },
    },
    {
      title: '预算',
      dataIndex: 'actualRentedRoomsBudget',
      key: 'actualRentedRoomsBudget',
      width: 100,
      render: (value) => value?.toLocaleString() || '-',
    },
    {
      title: '完成率%',
      key: 'actualRentedRoomsCompletion',
      width: 80,
      render: (_, record) => {
        if (record.actualRentedRooms && record.actualRentedRoomsBudget) {
          const rate = (record.actualRentedRooms / record.actualRentedRoomsBudget * 100).toFixed(1);
          return `${rate}%`;
        }
        return '-';
      },
    },
  ];

  // 第二个表格列定义
  const columns2: ColumnsType<TableDataItem> = [
    {
      title: '酒店编号',
      dataIndex: 'hotelCode',
      key: 'hotelCode',
      fixed: 'left',
      width: 100,
    },
    {
      title: '酒店名称',
      dataIndex: 'hotelName',
      key: 'hotelName',
      fixed: 'left',
      width: 180,
    },
    {
      title: 'MTD收入完成率(%)',
      key: 'revenueCompletion',
      width: 140,
      render: (_, record) => {
        const rate = ((record.mtdRevenue / record.budgetRevenue) * 100).toFixed(1);
        return `${rate}%`;
      },
    },
    {
      title: 'MTD入住率完成率(%)',
      key: 'occupancyCompletion',
      width: 140,
      render: (_, record) => {
        const rate = ((record.mtdOccupancy / record.budgetOccupancy) * 100).toFixed(1);
        return `${rate}%`;
      },
    },
    {
      title: '收入同比增长(%)',
      key: 'revenueGrowth',
      width: 130,
      render: (_, record) => {
        const growth = (((record.mtdRevenue - record.lastYearRevenue) / record.lastYearRevenue) * 100).toFixed(1);
        const color = parseFloat(growth) >= 0 ? '#52c41a' : '#ff4d4f';
        return <span style={{ color }}>{growth}%</span>;
      },
    },
    {
      title: '入住率同比增长(%)',
      key: 'occupancyGrowth',
      width: 130,
      render: (_, record) => {
        const growth = (((record.mtdOccupancy - record.lastYearOccupancy) / record.lastYearOccupancy) * 100).toFixed(1);
        const color = parseFloat(growth) >= 0 ? '#52c41a' : '#ff4d4f';
        return <span style={{ color }}>{growth}%</span>;
      },
    },
  ];

  // 月度柱状图（横坐标为12个月，展示当月增量）
  const monthLabels = Array.from({ length: 12 }, (_, i) => `${i + 1}月`);
  const sumCurrent = mockChartData.reduce((s, it) => s + it.mtdRevenue, 0);
  const sumBudget = mockChartData.reduce((s, it) => s + it.budgetRevenue, 0);
  const sumLast = mockChartData.reduce((s, it) => s + it.lastYearRevenue, 0);
  const monthlyCum = (total: number) => monthLabels.map((_, i) => Math.round(total * (i + 1) / 12));
  const monthlyIncFromCum = (cum: number[]) => cum.map((v, i) => (i === 0 ? v : v - cum[i - 1]));
  const currentCum = monthlyCum(sumCurrent);
  const budgetCum = monthlyCum(sumBudget);
  const lastCum = monthlyCum(sumLast);
  const currentMonthly = monthlyIncFromCum(currentCum);
  const budgetMonthly = monthlyIncFromCum(budgetCum);
  const lastMonthly = monthlyIncFromCum(lastCum);
  // 生成折线图的月度数据（随月份变化）：分别为本年/预算/去年
  const lineSeason = (i: number, phase: number, amp = 0.12) => 1 + amp * Math.sin(((i + phase) / 12) * 2 * Math.PI);
  const currentLineMonthly = monthLabels.map((_, i) => Math.round(currentMonthly[i] * lineSeason(i, 2)));
  const budgetLineMonthly = monthLabels.map((_, i) => Math.round(budgetMonthly[i] * lineSeason(i, 4, 0.1)));
  const lastLineMonthly = monthLabels.map((_, i) => Math.round(lastMonthly[i] * lineSeason(i, 6, 0.14)));

  const barChartOption = {
    title: {
      text: 'RevPAR',
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold' as const,
      },
    },
    tooltip: {
      trigger: 'axis' as const,
      axisPointer: { type: 'shadow' as const },
      formatter: (params: any) => {
        const name = params?.[0]?.name ?? '';
        const lines = params
          .map((p: any) => `${p.marker}${p.seriesName}: ${p.value.toLocaleString()}元`)
          .join('<br/>');
        return `${name}<br/>${lines}`;
      },
    },
    legend: {
      data: ['本年', '预算', '去年'],
      bottom: 10,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true,
    },
    xAxis: {
      type: 'category' as const,
      data: monthLabels,
      axisLabel: {
        rotate: 45,
        fontSize: 12,
      },
    },
    yAxis: {
      type: 'value' as const,
      axisLabel: {
        formatter: (value: number) => `${(value / 10000).toFixed(0)}万`,
      },
    },
    series: [
      {
        name: '本年',
        type: 'line' as const,
        data: currentLineMonthly,
        yAxisIndex: 0,
        smooth: true,
        symbol: 'circle' as const,
        symbolSize: 6,
        lineStyle: { width: 2, color: '#1d39c4' },
        itemStyle: { color: '#1d39c4' },
      },
      {
        name: '预算',
        type: 'line' as const,
        data: budgetLineMonthly,
        yAxisIndex: 0,
        smooth: true,
        symbol: 'circle' as const,
        symbolSize: 6,
        lineStyle: { width: 2, color: '#52c41a' },
        itemStyle: { color: '#52c41a' },
      },
      {
        name: '去年',
        type: 'line' as const,
        data: lastLineMonthly,
        yAxisIndex: 0,
        smooth: true,
        symbol: 'circle' as const,
        symbolSize: 6,
        lineStyle: { width: 2, color: '#fa8c16' },
        itemStyle: { color: '#fa8c16' },
      },
    ],
  };

  // 单房收益折线图配置（RevPAR）
  const revparBaseCurrent = (() => {
    const arr = mockTableData.map(i => i.mtdRevpar || 0);
    return arr.length ? Math.round(arr.reduce((s, v) => s + v, 0) / arr.length) : 0;
  })();
  const ratioBudget = sumCurrent ? sumBudget / sumCurrent : 1;
  const ratioLast = sumCurrent ? sumLast / sumCurrent : 1;
  // 使每个月的RevPAR模拟值不同（加入季节性变化）
  const seasonalFactor = (i: number) => 1 + 0.15 * Math.sin(((i + 1) / 12) * 2 * Math.PI);
  const revparCurrentSeries = monthLabels.map((_, i) => Math.round(revparBaseCurrent * seasonalFactor(i)));
  const revparBudgetSeries = monthLabels.map((_, i) =>
    Math.round(revparBaseCurrent * ratioBudget * (0.98 + 0.04 * Math.sin(((i + 3) / 12) * 2 * Math.PI)))
  );
  const revparLastSeries = monthLabels.map((_, i) =>
    Math.round(revparBaseCurrent * ratioLast * (0.96 + 0.05 * Math.sin(((i + 6) / 12) * 2 * Math.PI)))
  );

  const yearBarOption = {
    title: {
      text: '单房收益',
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold' as const,
      },
    },
    tooltip: {
      trigger: 'axis' as const,
      axisPointer: { type: 'line' as const },
    },
    legend: { data: ['本年', '去年', '预算'], bottom: 10 },
    grid: { left: '3%', right: '4%', bottom: '15%', containLabel: true },
    xAxis: {
      type: 'category' as const,
      data: monthLabels,
      axisLabel: { rotate: 45, fontSize: 12 },
    },
    yAxis: {
      type: 'value' as const,
      axisLabel: { formatter: (value: number) => `${value}` },
    },
    series: [
      {
        name: '本年',
        type: 'line' as const,
        data: revparCurrentSeries,
        smooth: true, symbol: 'circle' as const, symbolSize: 6,
        itemStyle: { color: '#1890ff' },
      },
      {
        name: '去年',
        type: 'line' as const,
        data: revparLastSeries,
        smooth: true, symbol: 'circle' as const, symbolSize: 6,
        itemStyle: { color: '#faad14' },
      },
      {
        name: '预算',
        type: 'line' as const,
        data: revparBudgetSeries,
        smooth: true, symbol: 'circle' as const, symbolSize: 6,
        itemStyle: { color: '#52c41a' },
      },
    ],
  };

  // 右侧标题计数显示
  const hotelCount = allHotelData.length;
  const countExtra = <span style={{ color: 'rgba(0,0,0,.45)' }}>酒店数: {hotelCount}</span>;

  // 平均房价折线图（ADR）
  const adrBase = (() => {
    const arr = mockTableData.map(i => i.mtdAdr || 0);
    return arr.length ? Math.round(arr.reduce((s, v) => s + v, 0) / arr.length) : 0;
  })();
  const adrCurrentSeries = monthLabels.map((_, i) => Math.round(adrBase * (1 + 0.12 * Math.sin(((i + 1) / 12) * 2 * Math.PI))));
  const adrBudgetSeries = monthLabels.map((_, i) => Math.round(adrBase * ratioBudget * (0.98 + 0.06 * Math.sin(((i + 3) / 12) * 2 * Math.PI))));
  const adrLastSeries = monthLabels.map((_, i) => Math.round(adrBase * ratioLast * (0.96 + 0.08 * Math.sin(((i + 6) / 12) * 2 * Math.PI))));

  const avgPriceOption = {
    title: {
      text: 'ADR',
      left: 'center',
      textStyle: { fontSize: 16, fontWeight: 'bold' as const },
    },
    tooltip: { trigger: 'axis' as const, axisPointer: { type: 'line' as const } },
    legend: { data: ['本年', '预算', '去年'], bottom: 10 },
    grid: { left: '3%', right: '4%', bottom: '15%', containLabel: true },
    xAxis: { type: 'category' as const, data: monthLabels, axisLabel: { rotate: 45, fontSize: 12 } },
    yAxis: { type: 'value' as const, axisLabel: { formatter: (value: number) => `${value}` } },
    series: [
      { name: '本年', type: 'line' as const, data: adrCurrentSeries, smooth: true, symbol: 'circle' as const, symbolSize: 6, lineStyle: { width: 2, color: '#1890ff' }, itemStyle: { color: '#1890ff' } },
      { name: '预算', type: 'line' as const, data: adrBudgetSeries, smooth: true, symbol: 'circle' as const, symbolSize: 6, lineStyle: { width: 2, color: '#52c41a' }, itemStyle: { color: '#52c41a' } },
      { name: '去年', type: 'line' as const, data: adrLastSeries, smooth: true, symbol: 'circle' as const, symbolSize: 6, lineStyle: { width: 2, color: '#fa8c16' }, itemStyle: { color: '#fa8c16' } },
    ],
  };

  // 入住率折线图（OCC）
  const occBase = (() => {
    const arr = mockTableData.map(i => i.mtdOccupancy || 0);
    return arr.length ? Math.round(arr.reduce((s, v) => s + v, 0) / arr.length) : 0;
  })();
  const occCurrentSeries = monthLabels.map((_, i) => {
    const v = occBase * (1 + 0.08 * Math.sin(((i + 1) / 12) * 2 * Math.PI));
    return Math.max(0, Math.min(100, Math.round(v)));
  });
  const occBudgetSeries = monthLabels.map((_, i) => {
    const v = occBase * (ratioBudget || 1) * (0.98 + 0.06 * Math.sin(((i + 3) / 12) * 2 * Math.PI));
    return Math.max(0, Math.min(100, Math.round(v)));
  });
  const occLastSeries = monthLabels.map((_, i) => {
    const v = occBase * (ratioLast || 1) * (0.96 + 0.07 * Math.sin(((i + 6) / 12) * 2 * Math.PI));
    return Math.max(0, Math.min(100, Math.round(v)));
  });

  const occOption = {
    title: { text: 'OCC', left: 'center', textStyle: { fontSize: 16, fontWeight: 'bold' as const } },
    tooltip: { trigger: 'axis' as const, axisPointer: { type: 'line' as const } },
    legend: { data: ['本年', '预算', '去年'], bottom: 10 },
    grid: { left: '3%', right: '4%', bottom: '15%', containLabel: true },
    xAxis: { type: 'category' as const, data: monthLabels, axisLabel: { rotate: 45, fontSize: 12 } },
    yAxis: { type: 'value' as const, axisLabel: { formatter: (value: number) => `${value}%` } },
    series: [
      { name: '本年', type: 'line' as const, data: occCurrentSeries, smooth: true, symbol: 'circle' as const, symbolSize: 6, lineStyle: { width: 2, color: '#1890ff' }, itemStyle: { color: '#1890ff' } },
      { name: '预算', type: 'line' as const, data: occBudgetSeries, smooth: true, symbol: 'circle' as const, symbolSize: 6, lineStyle: { width: 2, color: '#52c41a' }, itemStyle: { color: '#52c41a' } },
      { name: '去年', type: 'line' as const, data: occLastSeries, smooth: true, symbol: 'circle' as const, symbolSize: 6, lineStyle: { width: 2, color: '#fa8c16' }, itemStyle: { color: '#fa8c16' } },
    ],
  };

  // 指标明细（4行 × 12列）
  const detailColumns = [
    { title: '指标', dataIndex: 'metric', key: 'metric', fixed: 'left' as const, width: 120 },
    ...monthLabels.map((m, idx) => ({ title: m, dataIndex: `m${idx + 1}`, key: `m${idx + 1}` })),
  ];

  const buildRow = (metric: string, values: number[], suffix = '') => {
    const row: any = { key: metric, metric };
    values.forEach((v, i) => { row[`m${i + 1}`] = `${v}${suffix}`; });
    return row;
  };
  // 单房收益这里用 RevPAR 的 1.2 倍作为示例模拟
  const detailData = [
    buildRow('入住率OCC', occCurrentSeries, '%'),
    buildRow('平均房价ADR', adrCurrentSeries),
    buildRow('RevPAR', revparCurrentSeries),
    buildRow('单房收益', revparCurrentSeries.map(v => Math.round(v * 1.2))),
  ];

  // 指标预览表格数据
  const previewData = {
    occ: {
      mtdCurrent: 85.6,
      mtdLastYear: 82.3,
      mtdBudget: 88.0,
      mtdCompletion: 97.3,
      ytdCurrent: 87.2,
      ytdLastYear: 84.1,
      ytdBudget: 89.5,
      ytdCompletion: 97.4,
    },
    adr: {
      mtdCurrent: 680,
      mtdLastYear: 650,
      mtdBudget: 700,
      mtdCompletion: 97.1,
      ytdCurrent: 695,
      ytdLastYear: 665,
      ytdBudget: 710,
      ytdCompletion: 97.9,
    },
    revpar: {
      mtdCurrent: 582,
      mtdLastYear: 535,
      mtdBudget: 616,
      mtdCompletion: 94.5,
      ytdCurrent: 606,
      ytdLastYear: 558,
      ytdBudget: 635,
      ytdCompletion: 95.4,
    },
    singleRoomRevenue: {
      mtdCurrent: 698,
      mtdLastYear: 642,
      mtdBudget: 739,
      mtdCompletion: 94.5,
      ytdCurrent: 727,
      ytdLastYear: 670,
      ytdBudget: 762,
      ytdCompletion: 95.4,
    },
  };

  // 指标预览表格列定义
  const previewColumns = [
    {
      title: '指标',
      dataIndex: 'metric',
      key: 'metric',
      width: 120,
      fixed: 'left' as const,
    },
    {
      title: '本月',
      dataIndex: 'mtdCurrent',
      key: 'mtdCurrent',
      width: 100,
      align: 'right' as const,
    },
    ...(showComparison ? [
      {
        title: '去年同期',
        dataIndex: 'mtdLastYear',
        key: 'mtdLastYear',
        width: 100,
        align: 'right' as const,
      },
    ] : []),
    {
      title: '差异%',
      dataIndex: 'mtdDiff',
      key: 'mtdDiff',
      width: 80,
      align: 'right' as const,
      render: (value: number, record: any) => {
        const current = record.mtdCurrent;
        const lastYear = record.mtdLastYear;
        if (current && lastYear && lastYear !== 0) {
          const diffPercent = ((current - lastYear) / lastYear * 100).toFixed(1);
          const color = parseFloat(diffPercent) >= 0 ? '#52c41a' : '#ff4d4f';
          return <span style={{ color }}>{parseFloat(diffPercent) >= 0 ? '+' : ''}{diffPercent}%</span>;
        }
        return '-';
      },
    },
    ...(showComparison ? [
      {
        title: '预算',
        dataIndex: 'mtdBudget',
        key: 'mtdBudget',
        width: 100,
        align: 'right' as const,
      },
    ] : []),
    {
      title: '完成率%',
      dataIndex: 'mtdCompletion',
      key: 'mtdCompletion',
      width: 100,
      align: 'right' as const,
      render: (value: number) => <span style={{ color: '#87CEEB' }}>{value}%</span>,
    },
    {
      title: '本年',
      dataIndex: 'ytdCurrent',
      key: 'ytdCurrent',
      width: 100,
      align: 'right' as const,
    },
    ...(showComparison ? [
      {
        title: '去年同期',
        dataIndex: 'ytdLastYear',
        key: 'ytdLastYear',
        width: 100,
        align: 'right' as const,
      },
    ] : []),
    {
      title: '差异%',
      dataIndex: 'ytdDiff',
      key: 'ytdDiff',
      width: 80,
      align: 'right' as const,
      render: (value: number, record: any) => {
        const current = record.ytdCurrent;
        const lastYear = record.ytdLastYear;
        if (current && lastYear && lastYear !== 0) {
          const diffPercent = ((current - lastYear) / lastYear * 100).toFixed(1);
          const color = parseFloat(diffPercent) >= 0 ? '#52c41a' : '#ff4d4f';
          return <span style={{ color }}>{parseFloat(diffPercent) >= 0 ? '+' : ''}{diffPercent}%</span>;
        }
        return '-';
      },
    },
    ...(showComparison ? [
      {
        title: '预算',
        dataIndex: 'ytdBudget',
        key: 'ytdBudget',
        width: 100,
        align: 'right' as const,
      },
    ] : []),
    {
      title: '完成率%',
      dataIndex: 'ytdCompletion',
      key: 'ytdCompletion',
      width: 100,
      align: 'right' as const,
      render: (value: number) => <span style={{ color: '#87CEEB' }}>{value}%</span>,
    },
  ];

  // 查询处理
  const handleQuery = () => {
    setLoading(true);
    // 模拟API调用
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  // 重置处理
  const handleReset = () => {
    form.resetFields();
    setDate(dayjs().startOf('month'));
    setSelectedHotels([]);
    setSelectedCompanies([]);
    setSelectedManageTypes([]);
    setSelectedPropertyTypes([]);
    setSelectedDistricts([]);
    setSelectedCityAreas([]);
    setSelectedCities([]);
  };

  return (
    <TokenCheck>
      <div style={{ padding: '12px' }}>
        

        {/* 第一个Panel: 查询条件 */}
                <div ref={queryFormRef}>
          <Card 
            title={
              <Space>
                <Tooltip 
                  title={helpContent} 
                  placement="topLeft"
                  overlayStyle={{ maxWidth: '300px' }}
                >
                  <QuestionCircleOutlined 
                    style={{ color: '#1890ff', cursor: 'pointer' }} 
                    title="查看帮助"
                  />
                </Tooltip>
                <span 
                  style={{ cursor: 'pointer' }}
                  onClick={() => togglePanel('queryForm')}
                >
                  查询条件 {expandedPanels.queryForm ? '▼' : '▶'}
                </span>
              </Space>
            } 
            style={{ marginBottom: '10px' }}
                      >
            {expandedPanels.queryForm && (
              <Form 
                form={form} 
                layout="vertical"
                initialValues={{
                  date: dayjs().startOf('month')
                }}
              >
              <Row gutter={[24, 24]}>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item label="" name="date" style={{ marginTop: '0px',
                      marginBottom: '0px' }}>
                    <DatePicker
                      picker="month"
                      onChange={(value) => {
                        setDate(value || dayjs().startOf('month'));
                        form.setFieldsValue({ date: value || dayjs().startOf('month') });
                      }}
                      locale={locale}
                      style={{ width: '100%' }}
                      format="YYYY年MM月"
                      placeholder="请选择月份"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item label="" name="companies" style={{ marginTop: '0px',
                      marginBottom: '0px' }}>
                    <Select
                      mode="multiple"
                      allowClear
                      placeholder="请选择管理公司"
                      options={companyOptions}
                      value={selectedCompanies}
                      onChange={setSelectedCompanies}
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item label="" name="propertyTypes" style={{ marginTop: '0px',
                      marginBottom: '0px' }}>
                    <Select
                      mode="multiple"
                      allowClear
                      placeholder="请选择产权类型"
                      options={propertyTypeOptions}
                      value={selectedPropertyTypes}
                      onChange={setSelectedPropertyTypes}
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item label="" name="manageTypes" style={{ marginTop: '0px',
                      marginBottom: '0px' }}>
                    <Select
                      mode="multiple"
                      allowClear
                      placeholder="请选择管理类型"
                      options={manageTypeOptions}
                      value={selectedManageTypes}
                      onChange={setSelectedManageTypes}
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item label="" name="districts" style={{ marginTop: '0px',
                      marginBottom: '0px' }}>
                    <Select
                      mode="multiple"
                      allowClear
                      placeholder="请选择大区"
                      options={districtOptions}
                      value={selectedDistricts}
                      onChange={setSelectedDistricts}
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item label="" name="cityAreas" style={{ marginTop: '0px',
                      marginBottom: '0px' }}>
                    <Select
                      mode="multiple"
                      allowClear
                      placeholder="请选择城区"
                      options={cityAreaOptions}
                      value={selectedCityAreas}
                      onChange={setSelectedCityAreas}
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                   <Form.Item label="" name="cities" style={{ marginTop: '0px',
                      marginBottom: '0px' }}>
                     <Select
                       mode="multiple"
                       allowClear
                       placeholder="请选择城市"
                       options={cityOptions}
                       value={selectedCities}
                       onChange={setSelectedCities}
                       style={{ width: '100%' }}
                     />
                   </Form.Item>
                </Col>                 
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item label="" name="hotels" style={{ marginTop: '0px',
                      marginBottom: '0px' }}>
                    <Select
                      mode="multiple"
                      placeholder="请选择酒店"
                      options={hotelList.map(hotel => ({ label: hotel, value: hotel }))}
                      value={selectedHotels}
                      onChange={setSelectedHotels}
                      style={{ width: '100%' }}
                      showSearch
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item 
                    label=" " 
                    style={{ 
                      marginTop: '0px',
                      marginBottom: '0px',
                      paddingTop: '0px',
                      paddingBottom: '0px'
                    }}
                  >
                    <Space>
                      <Button type="primary" onClick={handleQuery} loading={loading}>
                        查询
                      </Button>
                      <Button onClick={handleReset}>
                        重置
                      </Button>
                      <Button type="primary" onClick={() => {
                        setSelectedPropertyTypes(['首酒']);
                        form.setFieldsValue({ propertyTypes: ['首酒'] });
                      }}>
                        首酒产权
                      </Button>
                      <Button type="primary" onClick={() => {
                      const allPropertyTypes = propertyTypeOptions.map(option => option.value);
                      const nonPropertyTypes = allPropertyTypes.filter(type => type !== '非产权店');
                      setSelectedPropertyTypes(nonPropertyTypes);
                      form.setFieldsValue({ propertyTypes: nonPropertyTypes });
                    }}>
                      产权店
                    </Button>
                    </Space>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
            )}
        </Card>
        </div>

        {/* 第二个Panel: 指标预览 */}
        <Card 
          title={
            <Space>
              <Tooltip 
                title={previewHelpContent} 
                placement="topLeft"
                overlayStyle={{ maxWidth: '400px' }}
              >
                <QuestionCircleOutlined 
                  style={{ color: '#1890ff', cursor: 'pointer' }} 
                  title="查看帮助"
                />
              </Tooltip>
                              <span 
                  style={{ cursor: 'pointer' }}
                  onClick={() => togglePanel('preview')}
                >
                  指标预览 {expandedPanels.preview ? '▼' : '▶'}
                </span>
            </Space>
          }
          extra={
            <Space>
              <span>展开</span>
              <Switch 
                checked={showComparison} 
                onChange={setShowComparison}
                size="small"
              />
              <span style={{ color: 'rgba(0,0,0,.45)' }}>
                {date.format('YYYY年MM月')} | 酒店数: 102
              </span>
              <UpOutlined 
                style={{ color: '#1890ff', cursor: 'pointer' }} 
                onClick={scrollToQueryForm}
                title="返回查询条件"
              />
            </Space>
          }
          style={{ marginBottom: '10px' }}
                  >
          {expandedPanels.preview && (
            <Table
              columns={previewColumns}
              dataSource={[
                {
                  key: 'occ',
                  metric: '入住率OCC',
                  ...previewData.occ,
                },
                {
                  key: 'adr',
                  metric: '平均房价ADR',
                  ...previewData.adr,
                },
                {
                  key: 'revpar',
                  metric: 'RevPAR',
                  ...previewData.revpar,
                },
                {
                  key: 'singleRoomRevenue',
                  metric: '单房收益',
                  ...previewData.singleRoomRevenue,
                },
              ]}
              pagination={false}
              size="small"
              bordered
              scroll={{ x: showComparison ? 1000 : 600 }}
            />
          )}
        </Card>

        {/* 第三个Panel: ECharts图表 */}
        <Card 
          title={
            <Space>
              <Tooltip 
                title={helpContent} 
                placement="topLeft"
                overlayStyle={{ maxWidth: '300px' }}
              >
                <QuestionCircleOutlined 
                  style={{ color: '#1890ff', cursor: 'pointer' }} 
                  title="查看帮助"
                />
              </Tooltip>
                              <span 
                  style={{ cursor: 'pointer' }}
                  onClick={() => togglePanel('trend')}
                >
                  指标趋势 {expandedPanels.trend ? '▼' : '▶'}
                </span>
            </Space>
          }
          extra={
            <Space>
              <span style={{ color: 'rgba(0,0,0,.45)' }}>
                {date.format('YYYY年MM月')} | 酒店数: 102
              </span>
              <UpOutlined 
                style={{ color: '#1890ff', cursor: 'pointer' }} 
                onClick={scrollToQueryForm}
                title="返回查询条件"
              />
            </Space>
          } 
          style={{ marginBottom: '24px' }}
                  >
          {expandedPanels.trend && (
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={12}>
                <Card title="入住率" extra={countExtra} size="small">
                  <BarChart id="occChart" option={occOption} />
                </Card>
              </Col>
              <Col xs={24} lg={12}>
                <Card title="平均房价" extra={countExtra} size="small">
                  <BarChart id="avgPriceChart" option={avgPriceOption} />
                </Card>
              </Col>
              <Col xs={24} lg={12}>
                <Card title="RevPAR" extra={countExtra} size="small">
                  <BarChart id="barChart" option={barChartOption} />
                </Card>
              </Col>
              <Col xs={24} lg={12}>
                <Card title="单房收益" extra={countExtra} size="small">
                  <BarChart id="ytdBarChart" option={yearBarOption} />
                </Card>
              </Col>
            </Row>
          )}
        </Card>

        {/* 第四个Panel: 第二个表格 */}
        <Card 
          title={
            <Space>
              <Tooltip 
                title={detailHelpContent} 
                placement="topLeft"
                overlayStyle={{ maxWidth: '400px' }}
              >
                <QuestionCircleOutlined 
                  style={{ color: '#1890ff', cursor: 'pointer' }} 
                  title="查看帮助"
                />
              </Tooltip>
                              <span 
                  style={{ cursor: 'pointer' }}
                  onClick={() => togglePanel('detail')}
                >
                  指标明细 {expandedPanels.detail ? '▼' : '▶'}
                </span>
            </Space>
          }
          extra={
            <Space>
              <span style={{ color: 'rgba(0,0,0,.45)' }}>
                {date.format('YYYY年MM月')} | 酒店数: 102
              </span>
              <UpOutlined 
                style={{ color: '#1890ff', cursor: 'pointer' }} 
                onClick={scrollToQueryForm}
                title="返回查询条件"
              />
            </Space>
          }
                  >
          {expandedPanels.detail && (
            <Table
              columns={detailColumns as any}
              dataSource={detailData}
              loading={loading}
              pagination={false}
              scroll={{ x: 1200 }}
              bordered
              size="middle"
            />
          )}
        </Card>
      </div>
    </TokenCheck>
  );
};

export default BusinessMTDReport;
