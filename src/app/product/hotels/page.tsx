'use client';
import '@ant-design/v5-patch-for-react-19';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
// @ts-ignore: antd may not have types installed in this environment
import 'antd/dist/reset.css';
// @ts-ignore: antd types might be missing
import { Input, Select, ConfigProvider, Button } from 'antd';
// @ts-ignore: antd locale types might be missing
import zhCN from 'antd/locale/zh_CN';
// @ts-ignore: echarts types might be missing
import ReactECharts from 'echarts-for-react';

interface Hotel {
  HotelCode: string;
  HotelName: string;
  GroupCode: string;
  HotelType: string;
  PropertyType: string;
  PMSType: string;
  Status: number;
  IsDelete: number;
  Area?: string;
  UrbanArea?: string;
  MDMCity?: string;
  MDMProvince?: string;
  PostCode?: string;
}

export default function HotelList() {
  const [hotelCode, setHotelCode] = useState<string | undefined>(undefined);
  const [hotelName, setHotelName] = useState<string | undefined>(undefined);
  const [groupCodes, setGroupCodes] = useState<string[]>(['JG','NY','NH','JL','NI','NU','KP']);
  const [hotelTypes, setHotelTypes] = useState<string[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<string[]>([]);
  const [pmsTypes, setPmsTypes] = useState<string[]>([]);
  const [areas, setAreas] = useState<string[]>([]);
  const [urbanAreas, setUrbanAreas] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [status, setStatus] = useState<boolean | null>(true);
  const [isDelete, setIsDelete] = useState<boolean | null>(false);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 酒店代码和酒店名称的选项列表
  const [hotelCodeOptions, setHotelCodeOptions] = useState<Array<{ label: string; value: string }>>([]);
  const [hotelNameOptions, setHotelNameOptions] = useState<Array<{ label: string; value: string }>>([]);

  // 获取酒店选项列表（用于 Select 组件）
  const fetchHotelOptions = async () => {
    console.log('🔍 [前端] 开始获取酒店选项列表...');
    console.log('[前端] 请求URL: /api/selecthotels');
    console.log('[前端] 请求时间:', new Date().toISOString());
    
    try {
      const response = await fetch('/api/selecthotels');
      console.log('[前端] API响应状态:', response.status, response.statusText);
      console.log('[前端] API响应头:', Object.fromEntries(response.headers.entries()));
      
      const result = await response.json();
      //console.log('[前端] API响应数据:', result);
      //console.log('[前端] result.success:', result.success);
      //console.log('[前端] result.data:', result.data);
      //console.log('[前端] result.data?.options:', result.data?.options);
      
      if (result.success && result.data?.options) {
        const hotelCodes = result.data.options.hotelCodes || [];
        const hotelNames = result.data.options.hotelNames || [];
        
        console.log('[前端] ✅ 获取酒店选项列表成功');
        console.log(`[前端] 酒店编号选项数量: ${hotelCodes.length}`);
        console.log(`[前端] 酒店名称选项数量: ${hotelNames.length}`);
        
        if (hotelCodes.length > 0) {
          console.log('[前端] 酒店编号选项前3个:', hotelCodes.slice(0, 3));
        } else {
          console.warn('[前端] ⚠️ 警告: 酒店编号选项为空！');
        }
        
        if (hotelNames.length > 0) {
          console.log('[前端] 酒店名称选项前3个:', hotelNames.slice(0, 3));
        } else {
          console.warn('[前端] ⚠️ 警告: 酒店名称选项为空！');
        }
        
        setHotelCodeOptions(hotelCodes);
        setHotelNameOptions(hotelNames);
        
        console.log('[前端] ✅ 状态已更新: hotelCodeOptions.length =', hotelCodes.length);
        console.log('[前端] ✅ 状态已更新: hotelNameOptions.length =', hotelNames.length);
      } else {
        console.error('[前端] ❌ 获取酒店选项列表失败');
        console.error('[前端] 失败原因: result.success =', result.success);
        console.error('[前端] 失败原因: result.data?.options =', result.data?.options);
        console.error('[前端] 错误信息:', result.error || result.message);
      }
    } catch (err) {
      console.error('[前端] ❌ 获取酒店选项列表异常');
      console.error('[前端] 异常类型:', err instanceof Error ? err.constructor.name : typeof err);
      console.error('[前端] 异常消息:', err instanceof Error ? err.message : String(err));
      console.error('[前端] 异常堆栈:', err instanceof Error ? err.stack : '无堆栈信息');
    }
  };

  // API调用函数
  const fetchHotels = async () => {
    try {
      const params = new URLSearchParams();
      
      if (hotelCode) params.append('hotelCode', hotelCode);
      if (hotelName) params.append('hotelName', hotelName);
      if (groupCodes.length > 0) params.append('groupCodes', groupCodes.join(','));
      if (hotelTypes.length > 0) params.append('hotelTypes', hotelTypes.join(','));
      if (propertyTypes.length > 0) params.append('propertyTypes', propertyTypes.join(','));
      if (pmsTypes.length > 0) params.append('pmsTypes', pmsTypes.join(','));
      if (areas.length > 0) params.append('areas', areas.join(','));
      if (urbanAreas.length > 0) params.append('urbanAreas', urbanAreas.join(','));
      if (cities.length > 0) params.append('cities', cities.join(','));
      if (status !== null) params.append('status', status ? '1' : '0');
      if (isDelete !== null) params.append('isDelete', isDelete ? '1' : '0');
      
      const url = `/api/hotels?${params.toString()}`;
      const response = await fetch(url);
      const result = await response.json();
      
      if (result.success) {
        setHotels(result.data);
        setError(null);
      } else {
        setHotels(result.data || []);
        setError(result.error || '获取酒店数据失败');
      }
    } catch (err) {
      console.error('API调用失败:', err);
      setError('网络请求失败，请检查网络连接');
    }
  };

  // 初始化加载酒店数据和选项列表
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      setError(null);
      // 先获取酒店选项列表
      await fetchHotelOptions();
      // 然后获取酒店数据
      await fetchHotels();
      setLoading(false);
    };

    initializeData();
  }, []);

  // 查询酒店
  const handleSearch = async () => {
    try {
      setLoading(true);
      await fetchHotels();
    } catch (err) {
      console.error('查询失败:', err);
      setError('查询失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 重置查询条件
  const handleReset = () => {
    setHotelCode(undefined);
    setHotelName(undefined);
    setGroupCodes(['JG','NY','NH','JL','NI','NU','KP']);
    setHotelTypes([]);
    setPropertyTypes([]);
    setPmsTypes([]);
    setAreas([]);
    setUrbanAreas([]);
    setCities([]);
    setStatus(true);
    setIsDelete(false);
  };

  // 枚举转换函数
  const getGroupCodeDisplay = (code: string) => {
    const groupCodeMap: Record<string, string> = {
      'JG': '建国',
      'JL': '京伦',
      'NY': '南苑',
      'NH': '云荟',
      'NI': '诺金',
      'NU': '诺岚',
      'KP': '凯宾斯基',
      'YF': '逸扉',
      'WX': '万信'
    };
    return groupCodeMap[code] || code;
  };

  const getHotelTypeDisplay = (type: string) => {
    const hotelTypeMap: Record<string, string> = {
      'H002': '托管',
      'H003': '加盟',
      'H004': '直营/全委'
    };
    return hotelTypeMap[type] || type;
  };

  const getPropertyTypeDisplay = (type: string) => {
    const propertyTypeMap: Record<string, string> = {
      'BZ': '北展',
      'FCQD': '非产权店',
      'SJJT': '首酒集团',
      'SLJT': '首旅集团',
      'SLZY': '首旅置业',
      'SFT': '首副通'
    };
    return propertyTypeMap[type] || type;
  };

  const getPmsTypeDisplay = (type: string) => {
    const pmsTypeMap: Record<string, string> = {
      'Cambridge': '康桥',
      'Opera': '手工填报',
      'P3': '如家P3',
      'Soft': '软连接',
      'X6': '西软X6',
      'XMS': '西软XMS'
    };
    return pmsTypeMap[type] || type;
  };

  // 状态枚举转换函数
  const getStatusDisplay = (status: number) => {
    const statusMap: Record<number, string> = {
      1: '启用',
      0: '停用'
    };
    return statusMap[status] || '未知';
  };

  const getIsDeleteDisplay = (isDelete: number) => {
    const isDeleteMap: Record<number, string> = {
      1: '已删除',
      0: '正常'
    };
    return isDeleteMap[isDelete] || '未知';
  };

  // 城市 ZipCode 到 CityName 的映射（从 /md/枚举值/城市.md 解析）
  const cityZipCodeMap: Record<string, string> = {
    '612100': '眉山市',
    '644000': '宜宾市',
    '638000': '广安市',
    '635000': '达州市',
    '625000': '雅安市',
    '635500': '巴中市',
    '641300': '资阳市',
    '624600': '阿坝藏族羌族自治州',
    '626000': '甘孜藏族自治州',
    '615000': '凉山彝族自治州',
    '55000': '贵阳市',
    '553000': '六盘水市',
    '563000': '遵义市',
    '561000': '安顺市',
    '554300': '铜仁市',
    '551500': '黔西南布依族苗族自治州',
    '551700': '毕节市',
    '550100': '黔南布依族苗族自治州',
    '650000': '昆明市',
    '655000': '曲靖市',
    '653100': '玉溪市',
    '678000': '保山市',
    '657000': '昭通市',
    '674100': '丽江市',
    '665000': '普洱市',
    '677000': '临沧市',
    '675000': '楚雄彝族自治州',
    '654400': '红河哈尼族彝族自治州',
    '663000': '文山壮族苗族自治州',
    '666200': '西双版纳傣族自治州',
    '671000': '大理白族自治州',
    '678400': '德宏傣族景颇族自治州',
    '671400': '怒江傈僳族自治州',
    '674400': '迪庆藏族自治州',
    '850000': '拉萨市',
    '854000': '昌都地区',
    '856000': '山南地区',
    '857000': '日喀则地区',
    '852000': '那曲地区',
    '859100': '阿里地区',
    '860100': '林芝地区',
    '710000': '西安市',
    '727000': '铜川市',
    '721000': '宝鸡市',
    '712000': '咸阳市',
    '714000': '渭南市',
    '716000': '延安市',
    '723000': '汉中市',
    '719000': '榆林市',
    '725000': '安康市',
    '711500': '商洛市',
    '730000': '兰州市',
    '737100': '嘉峪关市',
    '730900': '白银市',
    '741000': '天水市',
    '733000': '武威市',
    '734000': '张掖市',
    '744000': '平凉市',
    '735000': '酒泉市',
    '744500': '庆阳市',
    '743000': '定西市',
    '742100': '陇南市',
    '731100': '临夏回族自治州',
    '747000': '甘南藏族自治州',
    '810000': '西宁市',
    '810600': '海东地区',
    '810300': '海北藏族自治州',
    '811300': '黄南藏族自治州',
    '813000': '海南藏族自治州',
    '814000': '果洛藏族自治州',
    '815000': '玉树藏族自治州',
    '817000': '海西蒙古族藏族自治州',
    '750000': '银川市',
    '753000': '石嘴山市',
    '751100': '吴忠市',
    '756000': '固原市',
    '751700': '中卫市',
    '830000': '乌鲁木齐市',
    '834000': '克拉玛依市',
    '838000': '吐鲁番地区',
    '839000': '哈密地区',
    '831100': '昌吉回族自治州',
    '833400': '博尔塔拉蒙古自治州',
    '841000': '巴音郭楞蒙古自治州',
    '843000': '阿克苏地区',
    '835600': '克孜勒苏柯尔克孜自治州',
    '844000': '喀什地区',
    '848000': '和田地区',
    '833200': '伊犁哈萨克自治州',
    '834700': '塔城地区',
    '836500': '阿勒泰地区',
    '832000': '石河子市',
    '843300': '阿拉尔市',
    '843900': '图木舒克市',
    '831300': '五家渠市',
    '000000': '香港特别行政区',
    '572000': '三沙市',
    '330000': '南昌市',
    '333000': '景德镇市',
    '337000': '萍乡市',
    '332000': '九江市',
    '338000': '新余市',
    '335000': '鹰潭市',
    '341000': '赣州市',
    '343000': '吉安市',
    '336000': '宜春市',
    '332900': '抚州市',
    '334000': '上饶市',
    '250000': '济南市',
    '266000': '青岛市',
    '255000': '淄博市',
    '277100': '枣庄市',
    '257000': '东营市',
    '264000': '烟台市',
    '261000': '潍坊市',
    '272100': '济宁市',
    '271000': '泰安市',
    '265700': '威海市',
    '276800': '日照市',
    '271100': '莱芜市',
    '276000': '临沂市',
    '253000': '德州市',
    '252000': '聊城市',
    '256600': '滨州市',
    '450000': '郑州市',
    '475000': '开封市',
    '471000': '洛阳市',
    '467000': '平顶山市',
    '454900': '安阳市',
    '456600': '鹤壁市',
    '453000': '新乡市',
    '454100': '焦作市',
    '457000': '濮阳市',
    '461000': '许昌市',
    '462000': '漯河市',
    '472000': '三门峡市',
    '473000': '南阳市',
    '476000': '商丘市',
    '464000': '信阳市',
    '466000': '周口市',
    '463000': '驻马店市',
    '430000': '武汉市',
    '435000': '黄石市',
    '442000': '十堰市',
    '443000': '宜昌市',
    '441000': '襄阳市',
    '436000': '鄂州市',
    '448000': '荆门市',
    '432100': '孝感市',
    '434000': '荆州市',
    '438000': '黄冈市',
    '437000': '咸宁市',
    '441300': '随州市',
    '445000': '恩施土家族苗族自治州',
    '442400': '神农架',
    '410000': '长沙市',
    '412000': '株洲市',
    '411100': '湘潭市',
    '421000': '衡阳市',
    '422000': '邵阳市',
    '414000': '岳阳市',
    '415000': '常德市',
    '427000': '张家界市',
    '413000': '益阳市',
    '423000': '郴州市',
    '425000': '永州市',
    '418000': '怀化市',
    '417000': '娄底市',
    '416000': '湘西土家族苗族自治州',
    '510000': '广州市',
    '521000': '韶关市',
    '518000': '深圳市',
    '519000': '珠海市',
    '515000': '汕头市',
    '528000': '佛山市',
    '529000': '江门市',
    '524000': '湛江市',
    '525000': '茂名市',
    '526000': '肇庆市',
    '516000': '惠州市',
    '514000': '梅州市',
    '516600': '汕尾市',
    '517000': '河源市',
    '529500': '阳江市',
    '511500': '清远市',
    '511700': '东莞市',
    '528400': '中山市',
    '515600': '潮州市',
    '522000': '揭阳市',
    '527300': '云浮市',
    '530000': '南宁市',
    '545000': '柳州市',
    '541000': '桂林市',
    '543000': '梧州市',
    '536000': '北海市',
    '538000': '防城港市',
    '535000': '钦州市',
    '537100': '贵港市',
    '537000': '玉林市',
    '533000': '百色市',
    '542800': '贺州市',
    '547000': '河池市',
    '546100': '来宾市',
    '532200': '崇左市',
    '570000': '海口市',
    '400000': '重庆市',
    '610000': '成都市',
    '643000': '自贡市',
    '617000': '攀枝花市',
    '646100': '泸州市',
    '618000': '德阳市',
    '621000': '绵阳市',
    '628000': '广元市',
    '629000': '遂宁市',
    '641000': '内江市',
    '614000': '乐山市',
    '637000': '南充市',
    '100000': '北京市',
    '050000': '石家庄市',
    '063000': '唐山市',
    '066000': '秦皇岛市',
    '056000': '邯郸市',
    '054000': '邢台市',
    '071000': '保定市',
    '075000': '张家口市',
    '067000': '承德市',
    '061000': '沧州市',
    '065000': '廊坊市',
    '053000': '衡水市',
    '030000': '太原市',
    '037000': '大同市',
    '045000': '阳泉市',
    '046000': '长治市',
    '048000': '晋城市',
    '036000': '朔州市',
    '030600': '晋中市',
    '044000': '运城市',
    '034000': '忻州市',
    '041000': '临汾市',
    '030500': '吕梁市',
    '010000': '呼和浩特市',
    '014000': '包头市',
    '016000': '乌海市',
    '024000': '赤峰市',
    '028000': '通辽市',
    '010300': '鄂尔多斯市',
    '021000': '呼伦贝尔市',
    '014400': '巴彦淖尔市',
    '011800': '乌兰察布市',
    '137500': '兴安盟',
    '011100': '锡林郭勒盟',
    '110000': '沈阳市',
    '116000': '大连市',
    '114000': '鞍山市',
    '113000': '抚顺市',
    '117000': '本溪市',
    '118000': '丹东市',
    '121000': '锦州市',
    '115000': '营口市',
    '123000': '阜新市',
    '111000': '辽阳市',
    '124000': '盘锦市',
    '112000': '铁岭市',
    '122000': '朝阳市',
    '125000': '葫芦岛市',
    '130000': '长春市',
    '132000': '吉林市',
    '136000': '四平市',
    '136200': '辽源市',
    '134000': '通化市',
    '134300': '白山市',
    '131100': '松原市',
    '137000': '白城市',
    '133000': '延边朝鲜族自治州',
    '150000': '哈尔滨市',
    '161000': '齐齐哈尔市',
    '158100': '鸡西市',
    '154100': '鹤岗市',
    '155100': '双鸭山市',
    '163000': '大庆市',
    '152300': '伊春市',
    '154000': '佳木斯市',
    '154600': '七台河市',
    '157000': '牡丹江市',
    '164300': '黑河市',
    '152000': '绥化市',
    '165000': '大兴安岭地区',
    '200000': '上海市',
    '210000': '南京市',
    '214000': '无锡市',
    '221000': '徐州市',
    '213000': '常州市',
    '215000': '苏州市',
    '226000': '南通市',
    '222000': '连云港市',
    '223200': '淮安市',
    '224000': '盐城市',
    '225000': '扬州市',
    '212000': '镇江市',
    '225300': '泰州市',
    '223800': '宿迁市',
    '310000': '杭州市',
    '315000': '宁波市',
    '325000': '温州市',
    '314000': '嘉兴市',
    '313000': '湖州市',
    '312000': '绍兴市',
    '321000': '金华市',
    '324000': '衢州市',
    '316000': '舟山市',
    '318000': '台州市',
    '323000': '丽水市',
    '230000': '合肥市',
    '241000': '芜湖市',
    '233000': '蚌埠市',
    '232000': '淮南市',
    '243000': '马鞍山市',
    '235000': '淮北市',
    '244000': '铜陵市',
    '246000': '安庆市',
    '242700': '黄山市',
    '239000': '滁州市',
    '236100': '阜阳市',
    '234100': '宿州市',
    '237000': '六安市',
    '236800': '亳州市',
    '247100': '池州市',
    '366000': '宣城市',
    '350000': '福州市',
    '361000': '厦门市',
    '351100': '莆田市',
    '365000': '三明市',
    '362000': '泉州市',
    '363000': '漳州市',
    '353000': '南平市',
    '364000': '龙岩市',
    '352100': '宁德市',
    '614200': '峨眉山市',
    '315100': '象山(宁波)',
  };

  // 根据 PostCode (ZipCode) 获取城市名称
  const getCityNameByZipCode = (postCode: string | undefined): string => {
    if (!postCode) return '-';
    const cityName = cityZipCodeMap[postCode];
    return cityName || postCode; // 如果找不到映射，返回原始 PostCode
  };

  // 枚举选项数据
  const groupCodeOptions = [
    { label: '建国', value: 'JG' },
    { label: '京伦', value: 'JL' },
    { label: '南苑', value: 'NY' },
    { label: '云荟', value: 'NH' },
    { label: '诺金', value: 'NI' },
    { label: '诺岚', value: 'NU' },
    { label: '凯宾斯基', value: 'KP' },
    { label: '逸扉', value: 'YF' },
    { label: '万信', value: 'WX' }
  ];

  const hotelTypeOptions = [
    { label: '托管', value: 'H002' },
    { label: '加盟', value: 'H003' },
    { label: '直营/全委', value: 'H004' }
  ];

  const propertyTypeOptions = [
    { label: '北展', value: 'BZ' },
    { label: '非产权店', value: 'FCQD' },
    { label: '首酒集团', value: 'SJJT' },
    { label: '首旅集团', value: 'SLJT' },
    { label: '首旅置业', value: 'SLZY' },
    { label: '首副通', value: 'SFT' }
  ];

  const pmsTypeOptions = [
    { label: '康桥', value: 'Cambridge' },
    { label: '手工填报', value: 'Opera' },
    { label: '如家P3', value: 'P3' },
    { label: '软连接', value: 'Soft' },
    { label: '西软X6', value: 'X6' },
    { label: '西软XMS', value: 'XMS' }
  ];

  // 从酒店数据中提取大区、城区、城市的唯一值（用于下拉选项）
  const areaOptions = Array.from(new Set(hotels.map(h => h.Area).filter(Boolean))).map(v => ({ label: v!, value: v! }));
  const urbanAreaOptions = Array.from(new Set(hotels.map(h => h.UrbanArea).filter(Boolean))).map(v => ({ label: v!, value: v! }));
  const cityOptions = Array.from(new Set(hotels.map(h => h.MDMCity).filter(Boolean))).map(v => ({ label: v!, value: v! }));

  // 按 propertyType 分组统计酒店数量
  const propertyTypeStats = useMemo(() => {
    const stats: Record<string, number> = {};
    hotels.forEach((hotel) => {
      const propertyType = hotel.PropertyType || '未知';
      stats[propertyType] = (stats[propertyType] || 0) + 1;
    });
    return stats;
  }, [hotels]);

  // 按 pmsType 分组统计酒店数量
  const pmsTypeStats = useMemo(() => {
    const stats: Record<string, number> = {};
    hotels.forEach((hotel) => {
      const pmsType = hotel.PMSType || '未知';
      stats[pmsType] = (stats[pmsType] || 0) + 1;
    });
    return stats;
  }, [hotels]);

  // 饼状图配置
  const pieChartOption = useMemo(() => {
    const data = Object.entries(propertyTypeStats).map(([key, value]) => ({
      name: getPropertyTypeDisplay(key),
      value: value,
    }));

    // 如果没有数据，返回空配置
    if (data.length === 0) {
      return {
        title: {
          text: '产权类型分布',
          left: 'center',
        },
        tooltip: {
          trigger: 'item',
        },
        series: [
          {
            type: 'pie',
            radius: '60%',
            data: [],
          },
        ],
      };
    }

    return {
      title: {
        text: '产权类型分布',
        left: 'center',
        textStyle: {
          fontSize: 18,
          fontWeight: 'bold',
        },
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)',
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        top: 'middle',
      },
      series: [
        {
          name: '酒店数量',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2,
          },
          label: {
            show: true,
            formatter: '{b}: {c} ({d}%)',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 16,
              fontWeight: 'bold',
            },
          },
          data: data,
        },
      ],
    };
  }, [propertyTypeStats]);

  // PMS类型饼状图配置
  const pmsTypePieChartOption = useMemo(() => {
    const data = Object.entries(pmsTypeStats).map(([key, value]) => ({
      name: getPmsTypeDisplay(key),
      value: value,
    }));

    // 如果没有数据，返回空配置
    if (data.length === 0) {
      return {
        title: {
          text: 'PMS类型分布',
          left: 'center',
        },
        tooltip: {
          trigger: 'item',
        },
        series: [
          {
            type: 'pie',
            radius: '60%',
            data: [],
          },
        ],
      };
    }

    return {
      title: {
        text: 'PMS类型分布',
        left: 'center',
        textStyle: {
          fontSize: 18,
          fontWeight: 'bold',
        },
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)',
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        top: 'middle',
      },
      series: [
        {
          name: '酒店数量',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2,
          },
          label: {
            show: true,
            formatter: '{b}: {c} ({d}%)',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 16,
              fontWeight: 'bold',
            },
          },
          data: data,
        },
      ],
    };
  }, [pmsTypeStats]);

  return (
    <ConfigProvider locale={zhCN}>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 页面标题和返回按钮 */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">酒店列表查询</h1>
              <p className="text-gray-600">查询和管理酒店基础信息，列表按管理公司、酒店编号字母顺序排序</p>
            </div>
            {/* 右上角返回按钮 */}
            <Link
              href="/product"
              className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              返回
            </Link>
          </div>
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 搜索和筛选 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* 酒店编码 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                酒店编码
              </label>
              <Select
                allowClear
                showSearch
                placeholder="选择或输入酒店编码（支持自查询）..."
                className="w-full"
                value={hotelCode}
                onChange={(val) => setHotelCode(val || undefined)}
                options={hotelCodeOptions.length > 0 ? hotelCodeOptions : []}
                filterOption={(input, option) =>
                  ((option?.label as string) || '').toLowerCase().includes(input.toLowerCase())
                }
              />
            </div>

            {/* 酒店名称 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                酒店名称
              </label>
              <Select
                allowClear
                showSearch
                placeholder="选择或输入酒店名称（支持自查询）..."
                className="w-full"
                value={hotelName}
                onChange={(val) => setHotelName(val || undefined)}
                options={hotelNameOptions.length > 0 ? hotelNameOptions : []}
                filterOption={(input, option) =>
                  ((option?.label as string) || '').toLowerCase().includes(input.toLowerCase())
                }
              />
            </div>

            {/* 管理公司 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                管理公司
              </label>
              <Select
                mode="multiple"
                allowClear
                showSearch
                placeholder="选择管理公司"
                className="w-full"
                value={groupCodes}
                onChange={(vals) => setGroupCodes(vals as string[])}
                options={groupCodeOptions}
                filterOption={(input, option) =>
                  ((option?.label as string) || '').toLowerCase().includes(input.toLowerCase())
                }
              />
            </div>

            {/* 酒店类型 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                酒店类型
              </label>
              <Select
                mode="multiple"
                allowClear
                showSearch
                placeholder="选择酒店类型"
                className="w-full"
                value={hotelTypes}
                onChange={(vals) => setHotelTypes(vals as string[])}
                options={hotelTypeOptions}
                filterOption={(input, option) =>
                  ((option?.label as string) || '').toLowerCase().includes(input.toLowerCase())
                }
              />
            </div>

            {/* 产权类型 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                产权类型
              </label>
              <Select
                mode="multiple"
                allowClear
                showSearch
                placeholder="选择产权类型"
                className="w-full"
                value={propertyTypes}
                onChange={(vals) => setPropertyTypes(vals as string[])}
                options={propertyTypeOptions}
                filterOption={(input, option) =>
                  ((option?.label as string) || '').toLowerCase().includes(input.toLowerCase())
                }
              />
            </div>

            {/* PMS类型 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PMS类型
              </label>
              <Select
                mode="multiple"
                allowClear
                showSearch
                placeholder="选择PMS类型"
                className="w-full"
                value={pmsTypes}
                onChange={(vals) => setPmsTypes(vals as string[])}
                options={pmsTypeOptions}
                filterOption={(input, option) =>
                  ((option?.label as string) || '').toLowerCase().includes(input.toLowerCase())
                }
              />
            </div>

            {/* 大区 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                大区
              </label>
              <Select
                mode="multiple"
                allowClear
                showSearch
                placeholder="选择大区"
                className="w-full"
                value={areas}
                onChange={(vals) => setAreas(vals as string[])}
                options={areaOptions}
                filterOption={(input, option) =>
                  ((option?.label as string) || '').toLowerCase().includes(input.toLowerCase())
                }
              />
            </div>

            {/* 城区 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                城区
              </label>
              <Select
                mode="multiple"
                allowClear
                showSearch
                placeholder="选择城区"
                className="w-full"
                value={urbanAreas}
                onChange={(vals) => setUrbanAreas(vals as string[])}
                options={urbanAreaOptions}
                filterOption={(input, option) =>
                  ((option?.label as string) || '').toLowerCase().includes(input.toLowerCase())
                }
              />
            </div>

            {/* 城市 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                城市
              </label>
              <Select
                mode="multiple"
                allowClear
                showSearch
                placeholder="选择城市"
                className="w-full"
                value={cities}
                onChange={(vals) => setCities(vals as string[])}
                options={cityOptions}
                filterOption={(input, option) =>
                  ((option?.label as string) || '').toLowerCase().includes(input.toLowerCase())
                }
              />
            </div>

            {/* 状态筛选 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                状态
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="status"
                    checked={status === true}
                    onChange={() => setStatus(true)}
                    className="mr-1"
                  />
                  <span className="text-sm">启用</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="status"
                    checked={status === false}
                    onChange={() => setStatus(false)}
                    className="mr-1"
                  />
                  <span className="text-sm">停用</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="status"
                    checked={status === null}
                    onChange={() => setStatus(null)}
                    className="mr-1"
                  />
                  <span className="text-sm">全部</span>
                </label>
              </div>
            </div>

            {/* 删除状态 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                是否删除
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="isDelete"
                    checked={isDelete === false}
                    onChange={() => setIsDelete(false)}
                    className="mr-1"
                  />
                  <span className="text-sm">正常</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="isDelete"
                    checked={isDelete === true}
                    onChange={() => setIsDelete(true)}
                    className="mr-1"
                  />
                  <span className="text-sm">已删除</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="isDelete"
                    checked={isDelete === null}
                    onChange={() => setIsDelete(null)}
                    className="mr-1"
                  />
                  <span className="text-sm">全部</span>
                </label>
              </div>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="mt-6 flex gap-4">
            <Button
              type="primary"
              onClick={handleSearch}
              loading={loading}
              style={{ color: '#ffffff' }}
            >
              查询
            </Button>
            <Button
              onClick={handleReset}
              style={{ backgroundColor: '#9ca3af', borderColor: '#9ca3af', color: '#ffffff' }}
            >
              重置
            </Button>
          </div>
        </div>

        {/* 加载状态 */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-lg text-gray-600">正在加载酒店数据...</span>
              </div>
            </div>
        )}

        {/* 结果统计 */}
        {!loading && hotels.length > 0 && (
          <div className="mb-4 px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
            <div className="text-gray-800 font-medium">
              共找到 <span className="text-blue-600 font-bold">{hotels.length}</span> 家酒店
            </div>
            {error && (
              <span className="text-sm text-orange-600">
                (使用备用数据)
              </span>
            )}
          </div>
        )}

        {/* 酒店列表 */}
        {!loading && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      酒店编号
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      酒店名称
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      管理公司
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      酒店类型
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      产权类型
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      PMS类型
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      状态
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      是否删除
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      大区
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      城区
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      城市
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {hotels.map((hotel, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {hotel.HotelCode}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {hotel.HotelName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {getGroupCodeDisplay(hotel.GroupCode)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {getHotelTypeDisplay(hotel.HotelType) || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {getPropertyTypeDisplay(hotel.PropertyType) || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {getPmsTypeDisplay(hotel.PMSType) || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          hotel.Status === 1 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {getStatusDisplay(hotel.Status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          hotel.IsDelete === 0 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {getIsDeleteDisplay(hotel.IsDelete)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {hotel.Area || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {hotel.UrbanArea || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {hotel.PostCode ? getCityNameByZipCode(hotel.PostCode) : (hotel.MDMCity || '-')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        </div>
        )}

        {/* 饼状图：产权类型分布和PMS类型分布 */}
        {!loading && hotels.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 mt-8">
            {/* 产权类型分布饼状图 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <ReactECharts
                option={pieChartOption}
                style={{ height: '500px', width: '100%' }}
                opts={{ renderer: 'canvas' }}
              />
            </div>
            {/* PMS类型分布饼状图 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <ReactECharts
                option={pmsTypePieChartOption}
                style={{ height: '500px', width: '100%' }}
                opts={{ renderer: 'canvas' }}
              />
            </div>
        </div>
        )}

        {/* 空状态 */}
        {!loading && hotels.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">未找到符合条件的酒店</h3>
            <p className="text-gray-500">请尝试调整查询条件</p>
          </div>
        )}

        {/* 结果统计 */}
        {!loading && (
        <div className="mt-8 text-center text-gray-600">
            共找到 {hotels.length} 家酒店
            {error && (
              <span className="ml-2 text-sm text-orange-600">
                (使用备用数据)
              </span>
            )}
        </div>
        )}

        {/* 右下角返回按钮 */}
        <div className="mt-8 flex justify-end">
          <Link
            href="/product"
            className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            返回产品中心
          </Link>
        </div>
        </div>
      </div>
    </ConfigProvider>
  );
}
