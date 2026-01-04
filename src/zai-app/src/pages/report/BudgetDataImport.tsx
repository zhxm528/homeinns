import React, { useState } from 'react';
import { Table, Card, Button, Form, Row, Col, Select, Collapse, Space, Modal, DatePicker, Input, message, Upload, Progress } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs, { Dayjs } from 'dayjs';
import request from '@/utils/request';

const { Panel } = Collapse;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface HotelData {
  propertyType: string;
  hotelType: string;
  manageCompany: string;
  brand: string;
  province: string;
  city: string;
  hotelCode: string;
  hotelName: string;
  pmsType: string;
}

const propertyTypeOptions = ['首酒', '置业', '北展', '首旅'];
const hotelTypeOptions = ['委托管理'];
const manageCompanyOptions = ['首旅南苑', '首旅建国', '首旅京伦', '凯宾斯基', '诺金', '凯燕'];
const brandOptions = ['首旅南苑', '首旅南苑云荟', '建国', '京伦', '凯宾斯基', '诺金', '白牌'];
const provinceOptions = ['北京', '浙江', '广东', '河南', '陕西'];
const cityOptions = ['北京', '宁波', '广州', '郑州', '西安'];
const pmsTypeOptions = ['XMS', 'Cambridge', 'X6', '手工填报'];

const columns: ColumnsType<HotelData> = [
  {
    title: '酒店编号',
    dataIndex: 'hotelCode',
    key: 'hotelCode',
    fixed: 'left' as const,
    width: 120,
  },
  {
    title: '酒店名称',
    dataIndex: 'hotelName',
    key: 'hotelName',
    fixed: 'left' as const,
    width: 180,
  },
  { title: '产权类型', dataIndex: 'propertyType', key: 'propertyType' },
  { title: '酒店类型', dataIndex: 'hotelType', key: 'hotelType' },
  { title: '管理公司', dataIndex: 'manageCompany', key: 'manageCompany' },
  { title: '品牌', dataIndex: 'brand', key: 'brand' },
  { title: '省份', dataIndex: 'province', key: 'province' },
  { title: '城市', dataIndex: 'city', key: 'city' },
  { title: 'PMS类型', dataIndex: 'pmsType', key: 'pmsType' },
  {
    title: '经营数据模板',
    key: 'operationTemplate',
    render: (_: unknown, record: HotelData) => (
      <Button type="primary" size="small" onClick={() => handleDownload('operation', record)}>下载</Button>
    ),
  },
  {
    title: '导入经营数据',
    key: 'importOperation',
    render: (_: unknown, record: HotelData) => (
      <Button type="default" size="small" onClick={() => handleImport('operation', record)}>导入</Button>
    ),
  },
  {
    title: '预算模板',
    key: 'budgetTemplate',
    render: (_: unknown, record: HotelData) => (
      <Button type="primary" size="small" onClick={() => handleDownload('budget', record)}>下载</Button>
    ),
  },
  {
    title: '导入预算',
    key: 'importBudget',
    render: (_: unknown, record: HotelData) => (
      <Button type="default" size="small" onClick={() => handleImport('budget', record)}>导入</Button>
    ),
  },
];

const allData: HotelData[] = [
  { propertyType: '首酒', hotelType: '委托管理', manageCompany: '首旅南苑', brand: '首旅南苑', province: '浙江', city: '宁波', hotelCode: 'NY0001', hotelName: '南苑饭店', pmsType: 'XMS' },
  { propertyType: '首酒', hotelType: '委托管理', manageCompany: '首旅南苑', brand: '首旅南苑', province: '浙江', city: '宁波', hotelCode: 'NY0002', hotelName: '南苑环球酒店', pmsType: 'XMS' },
  { propertyType: '首酒', hotelType: '委托管理', manageCompany: '首旅南苑', brand: '首旅南苑云荟', province: '浙江', city: '宁波', hotelCode: 'NY0003', hotelName: '首旅南苑云荟酒店', pmsType: 'XMS' },
  { propertyType: '置业', hotelType: '委托管理', manageCompany: '首旅建国', brand: '建国', province: '广东', city: '广州', hotelCode: 'JG0005', hotelName: '广州建国酒店', pmsType: 'Cambridge' },
  { propertyType: '置业', hotelType: '委托管理', manageCompany: '首旅建国', brand: '建国', province: '北京', city: '北京', hotelCode: 'JG0001', hotelName: '北京建国饭店', pmsType: 'Cambridge' },
  { propertyType: '置业', hotelType: '委托管理', manageCompany: '首旅建国', brand: '建国', province: '北京', city: '北京', hotelCode: 'JG0002', hotelName: '北京国际饭店', pmsType: 'Cambridge' },
  { propertyType: '置业', hotelType: '委托管理', manageCompany: '首旅建国', brand: '建国', province: '北京', city: '北京', hotelCode: 'JG0003', hotelName: '西苑饭店', pmsType: 'Cambridge' },
  { propertyType: '置业', hotelType: '委托管理', manageCompany: '首旅建国', brand: '建国', province: '北京', city: '北京', hotelCode: 'JG0008', hotelName: '北京前门建国饭店', pmsType: 'Cambridge' },
  { propertyType: '置业', hotelType: '委托管理', manageCompany: '首旅建国', brand: '建国', province: '北京', city: '北京', hotelCode: 'JG0009', hotelName: '民族饭店', pmsType: 'Cambridge' },
  { propertyType: '北展', hotelType: '委托管理', manageCompany: '首旅京伦', brand: '京伦', province: '北京', city: '北京', hotelCode: 'JL0001', hotelName: '北京展览馆宾馆', pmsType: 'XMS' },
  { propertyType: '首酒', hotelType: '委托管理', manageCompany: '首旅京伦', brand: '京伦', province: '北京', city: '北京', hotelCode: 'JL0002', hotelName: '崇文门饭店', pmsType: 'XMS' },
  { propertyType: '首酒', hotelType: '委托管理', manageCompany: '首旅京伦', brand: '京伦', province: '北京', city: '北京', hotelCode: 'JL0003', hotelName: '宣武门商务酒店', pmsType: 'XMS' },
  { propertyType: '首酒', hotelType: '委托管理', manageCompany: '首旅京伦', brand: '京伦', province: '北京', city: '北京', hotelCode: 'JL0004', hotelName: '东方饭店', pmsType: 'XMS' },
  { propertyType: '置业', hotelType: '委托管理', manageCompany: '首旅京伦', brand: '京伦', province: '北京', city: '北京', hotelCode: 'JL0005', hotelName: '和平里大酒店', pmsType: 'X6' },
  { propertyType: '置业', hotelType: '委托管理', manageCompany: '首旅京伦', brand: '京伦', province: '北京', city: '北京', hotelCode: 'JL0007', hotelName: '北京香山饭店', pmsType: 'X6' },
  { propertyType: '置业', hotelType: '委托管理', manageCompany: '首旅京伦', brand: '京伦', province: '北京', city: '北京', hotelCode: 'JL0008', hotelName: '京伦饭店', pmsType: 'Cambridge' },
  { propertyType: '首酒', hotelType: '委托管理', manageCompany: '首旅建国', brand: '建国', province: '河南', city: '郑州', hotelCode: 'JG0007', hotelName: '郑州建国饭店', pmsType: 'XMS' },
  { propertyType: '置业', hotelType: '委托管理', manageCompany: '首旅建国', brand: '建国', province: '陕西', city: '西安', hotelCode: 'JG0004', hotelName: '西安建国饭店', pmsType: 'Cambridge' },
  { propertyType: '置业', hotelType: '委托管理', manageCompany: '首旅建国', brand: '建国', province: '北京', city: '北京', hotelCode: 'JG0110', hotelName: '亮马河大厦', pmsType: '手工填报' },
  { propertyType: '置业', hotelType: '委托管理', manageCompany: '首旅建国', brand: '建国', province: '北京', city: '北京', hotelCode: 'JG0076', hotelName: '新侨饭店', pmsType: 'Cambridge' },
  { propertyType: '置业', hotelType: '委托管理', manageCompany: '凯宾斯基', brand: '凯宾斯基', province: '北京', city: '北京', hotelCode: 'KP0001', hotelName: '北京凯宾斯基', pmsType: '手工填报' },
  { propertyType: '置业', hotelType: '委托管理', manageCompany: '诺金', brand: '诺金', province: '北京', city: '北京', hotelCode: 'NI0001', hotelName: '北京诺金酒店', pmsType: '手工填报' },
  { propertyType: '首旅', hotelType: '委托管理', manageCompany: '诺金', brand: '诺金', province: '北京', city: '北京', hotelCode: 'NI0002', hotelName: '诺金饭店酒店', pmsType: '手工填报' },
  { propertyType: '首旅', hotelType: '委托管理', manageCompany: '凯燕', brand: '诺金', province: '北京', city: '北京', hotelCode: 'NI0003', hotelName: '环球影城诺金', pmsType: '手工填报' },
  { propertyType: '首旅', hotelType: '委托管理', manageCompany: '凯燕', brand: '白牌', province: '北京', city: '北京', hotelCode: 'KP0002', hotelName: '环球影城大酒店', pmsType: '手工填报' },

  { propertyType: '非产权', hotelType: '委托管理', manageCompany: '首旅建国', brand: '建国', province: '北京', city: '北京', hotelCode: 'JG0011', hotelName: '北京工大建国饭店(北工大科技大厦)', pmsType: 'XMS' },
  { propertyType: '非产权', hotelType: '委托管理', manageCompany: '首旅建国', brand: '建国', province: '北京', city: '北京', hotelCode: 'JG0022', hotelName: '北京唯实国际文化交流中心', pmsType: 'XMS' },
  { propertyType: '非产权', hotelType: '委托管理', manageCompany: '首旅建国', brand: '建国', province: '北京', city: '北京', hotelCode: 'JG0023', hotelName: '北京松鹤建国培训中心', pmsType: 'XMS' },
  { propertyType: '非产权', hotelType: '委托管理', manageCompany: '首旅建国', brand: '建国', province: '北京', city: '北京', hotelCode: 'JG0028', hotelName: '北京中建雁栖湖景酒店', pmsType: 'XMS' },
  { propertyType: '非产权', hotelType: '委托管理', manageCompany: '首旅建国', brand: '建国', province: '北京', city: '北京', hotelCode: 'JG0061', hotelName: '北京银保建国酒店', pmsType: 'XMS' },
  { propertyType: '非产权', hotelType: '委托管理', manageCompany: '首旅建国', brand: '建国', province: '北京', city: '北京', hotelCode: 'JG0079', hotelName: '沙河唯实国际文化交流中心', pmsType: 'XMS' },
  { propertyType: '非产权', hotelType: '委托管理', manageCompany: '首旅建国', brand: '建国', province: '北京', city: '北京', hotelCode: 'JG0085', hotelName: '亚洲大酒店', pmsType: 'XMS' },
].sort((a, b) => a.propertyType.localeCompare(b.propertyType, 'zh-Hans-CN', { numeric: true }));

function handleDownload(type: 'operation' | 'budget', record: HotelData) {
  // TODO: 实现下载逻辑
  // type: 'operation' | 'budget'
  // record: 当前行数据
  // 可根据type和record.hotelCode等进行区分
  console.log('下载', type, record);
}

function handleImport(type: 'operation' | 'budget', record: HotelData) {
  // TODO: 实现导入逻辑
  // type: 'operation' | 'budget'
  // record: 当前行数据
  // 可根据type和record.hotelCode等进行区分
  console.log('导入', type, record);
}



const BudgetDataImport: React.FC = () => {
  const [form] = Form.useForm();
  const [tableData, setTableData] = useState<HotelData[]>(allData);

  // 下载弹窗相关
  const [operationModalVisible, setOperationModalVisible] = useState(false);
  const [budgetModalVisible, setBudgetModalVisible] = useState(false);
  const [downloadHotel, setDownloadHotel] = useState<HotelData | null>(null);
  const [operationRange, setOperationRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(dayjs().year());

  // 导入经营数据弹窗相关
  const [importOperationModalVisible, setImportOperationModalVisible] = useState(false);
  const [importHotel, setImportHotel] = useState<HotelData | null>(null);
  const [importFileList, setImportFileList] = useState<any[]>([]);

  // 导入预算弹窗相关
  const [importBudgetModalVisible, setImportBudgetModalVisible] = useState(false);
  const [importBudgetHotel, setImportBudgetHotel] = useState<HotelData | null>(null);
  const [importBudgetFileList, setImportBudgetFileList] = useState<any[]>([]);
  const [importBudgetYear, setImportBudgetYear] = useState<number>(dayjs().year());

  // 全量导入弹窗相关
  const [bulkImportModalVisible, setBulkImportModalVisible] = useState(false);
  const [bulkImportFileList, setBulkImportFileList] = useState<any[]>([]);
  const [bulkProcessing, setBulkProcessing] = useState(false);
  const [bulkProgress, setBulkProgress] = useState({ current: 0, total: 0 });

  // bi_htlrev导入弹窗相关
  const [htlrevImportModalVisible, setHtlrevImportModalVisible] = useState(false);
  const [htlrevImportFileList, setHtlrevImportFileList] = useState<any[]>([]);
  const [htlrevProcessing, setHtlrevProcessing] = useState(false);
  const [htlrevProgress, setHtlrevProgress] = useState({ current: 0, total: 0 });

  // 多酒店整年预算上传弹窗相关
  const [budgetBulkImportModalVisible, setBudgetBulkImportModalVisible] = useState(false);
  const [budgetBulkImportFileList, setBudgetBulkImportFileList] = useState<any[]>([]);
  const [budgetBulkProcessing, setBudgetBulkProcessing] = useState(false);
  const [budgetBulkProgress, setBudgetBulkProgress] = useState({ current: 0, total: 0 });
  const [budgetBulkYear, setBudgetBulkYear] = useState<number>(dayjs().year());


  // 获取当年1月1日-12月31日
  const currentYear = dayjs().year();
  const defaultRange: [Dayjs, Dayjs] = [dayjs(`${currentYear}-01-01`), dayjs(`${currentYear}-12-31`)];
  
  // 生成年份选项（当前年份前后5年）
  const yearOptions = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  // 查询按钮点击
  const handleSearch = () => {
    const values = form.getFieldsValue();
    let filtered = allData;
    // 多选条件，任一匹配即可
    Object.entries(values).forEach(([key, val]) => {
      if (Array.isArray(val) && val.length > 0) {
        filtered = filtered.filter(item => val.includes((item as any)[key]));
      }
    });
    // 查询后也排序
    setTableData(filtered.sort((a, b) => a.hotelCode.localeCompare(b.hotelCode, 'zh-Hans-CN', { numeric: true })));
  };

  // 取消按钮点击
  const handleReset = () => {
    form.resetFields();
    setTableData(allData);
  };

  // 经营数据模板下载按钮点击
  function handleOperationDownload(record: HotelData) {
    setDownloadHotel(record);
    setOperationRange(defaultRange);
    setOperationModalVisible(true);
  }

  // 预算模板下载按钮点击
  function handleBudgetDownload(record: HotelData) {
    setDownloadHotel(record);
    setSelectedYear(currentYear);
    setBudgetModalVisible(true);
  }

  // 经营数据模板下载弹窗确认
  const handleOperationModalOk = async () => {
    if (!operationRange || !operationRange[0] || !operationRange[1]) {
      message.warning('请选择日期区间');
      return;
    }
    if (!downloadHotel) return;
    try {
      const params = {
        hotelCode: downloadHotel.hotelCode,
        hotelName: downloadHotel.hotelName,
        startDate: operationRange[0]?.format('YYYY-MM-DD'),
        endDate: operationRange[1]?.format('YYYY-MM-DD'),
      };
      const res = await request.post('/api/nj/business/template', params, { responseType: 'blob' });
      // 生成文件名
      const fileName = `${downloadHotel.hotelCode}_${downloadHotel.hotelName}_${params.startDate}_${params.endDate}_经营日报.xlsx`;
      // 创建Blob并下载
      const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(link.href);
      message.success('下载成功');
    } catch (e) {
      message.error('下载失败');
    } finally {
      setOperationModalVisible(false);
    }
  };

  // 预算模板下载弹窗确认
  const handleBudgetModalOk = async () => {
    if (!selectedYear) {
      message.warning('请选择年份');
      return;
    }
    if (!downloadHotel) return;
    try {
      const params = {
        hotelCode: downloadHotel.hotelCode,
        hotelName: downloadHotel.hotelName,
        year: selectedYear,
      };
      const res = await request.post('/api/nj/budget/year/template', params, { responseType: 'blob' });
      // 生成文件名
      const fileName = `${downloadHotel.hotelCode}_${downloadHotel.hotelName}_${selectedYear}_年度预算.xlsx`;
      // 创建Blob并下载
      const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(link.href);
      message.success('下载成功');
    } catch (e) {
      message.error('下载失败');
    } finally {
      setBudgetModalVisible(false);
    }
  };

  // 关闭弹窗
  const handleOperationModalCancel = () => setOperationModalVisible(false);
  const handleBudgetModalCancel = () => setBudgetModalVisible(false);

  // 打开导入经营数据弹窗
  function handleImportOperation(record: HotelData) {
    setImportHotel(record);
    setImportFileList([]);
    setImportOperationModalVisible(true);
  }

  // 关闭导入经营数据弹窗
  const handleImportOperationCancel = () => setImportOperationModalVisible(false);

  // 导入经营数据弹窗确认
  const handleImportOperationOk = async () => {
    if (!importFileList.length) {
      message.warning('请上传文件');
      return;
    }
    if (!importHotel) return;
    try {
      const formData = new FormData();
      formData.append('hotelCode', importHotel.hotelCode);
      formData.append('hotelName', importHotel.hotelName);
      formData.append('file', importFileList[0].originFileObj);
      
      // 打印请求体
      const requestBody = {
        hotelCode: importHotel.hotelCode,
        hotelName: importHotel.hotelName,
        fileName: importFileList[0].name,
        fileSize: importFileList[0].size
      };
      console.log('=== 导入经营数据请求体 (JSON格式) ===');
      console.log(JSON.stringify(requestBody, null, 2));
      console.log('=== 导入经营数据请求体结束 ===');
      
      await request.post('/api/nj/business/makesql', formData);
      message.success('导入成功');
    } catch (e) {
      message.error('导入失败');
    } finally {
      setImportOperationModalVisible(false);
    }
  };

  // 打开导入预算弹窗
  function handleImportBudget(record: HotelData) {
    setImportBudgetHotel(record);
    setImportBudgetFileList([]);
    setImportBudgetYear(currentYear);
    setImportBudgetModalVisible(true);
  }

  // 关闭导入预算弹窗
  const handleImportBudgetCancel = () => setImportBudgetModalVisible(false);

  // 导入预算弹窗确认
  const handleImportBudgetOk = async () => {
    if (!importBudgetFileList.length) {
      message.warning('请上传文件');
      return;
    }
    if (!importBudgetHotel) return;
    try {
      const formData = new FormData();
      formData.append('hotelCode', importBudgetHotel.hotelCode);
      formData.append('hotelName', importBudgetHotel.hotelName);
      formData.append('year', importBudgetYear.toString());
      formData.append('file', importBudgetFileList[0].originFileObj);
      
      // 打印请求体
      const requestBody = {
        hotelCode: importBudgetHotel.hotelCode,
        hotelName: importBudgetHotel.hotelName,
        year: importBudgetYear,
        fileName: importBudgetFileList[0].name,
        fileSize: importBudgetFileList[0].size
      };
      console.log('=== 导入预算请求体 (JSON格式) ===');
      console.log(JSON.stringify(requestBody, null, 2));
      console.log('=== 导入预算请求体结束 ===');
      
      await request.post('/api/nj/budget/year/makesql', formData);
      message.success('导入成功');
    } catch (e) {
      message.error('导入失败');
    } finally {
      setImportBudgetModalVisible(false);
    }
  };


  // 打开全量导入弹窗
  const handleBulkImport = () => {
    setBulkImportFileList([]);
    setBulkProcessing(false);
    setBulkProgress({ current: 0, total: 0 });
    setBulkImportModalVisible(true);
  };

  // 关闭全量导入弹窗
  const handleBulkImportCancel = () => setBulkImportModalVisible(false);

  // 全量导入弹窗确认
  const handleBulkImportOk = async () => {
    if (!bulkImportFileList.length) {
      message.warning('请选择目录或文件');
      return;
    }

    // 过滤出Excel文件
    const excelFiles = bulkImportFileList.filter(file => {
      const fileName = file.name || file.originFileObj?.name || '';
      return fileName.match(/\.(xlsx|xls)$/i);
    });

    if (!excelFiles.length) {
      message.warning('选择的目录中没有Excel文件');
      return;
    }

    setBulkProcessing(true);
    setBulkProgress({ current: 0, total: excelFiles.length });

    let successCount = 0;
    let failCount = 0;

    try {
      for (let i = 0; i < excelFiles.length; i++) {
        const file = excelFiles[i];
        setBulkProgress({ current: i + 1, total: excelFiles.length });

        try {
          const formData = new FormData();
          formData.append('file', file.originFileObj || file);
          
          // 打印请求体
          const requestBody = {
            fileName: file.name || file.originFileObj?.name,
            fileSize: file.size || file.originFileObj?.size,
            currentFile: i + 1,
            totalFiles: excelFiles.length
          };
          console.log(`=== 全量导入请求体 (${i + 1}/${excelFiles.length}) ===`);
          console.log(JSON.stringify(requestBody, null, 2));
          console.log('=== 全量导入请求体结束 ===');
          
          await request.post('/api/nj/bulk/makesql', formData);
          successCount++;
          
          // 延迟一下避免请求过快
          await new Promise(resolve => setTimeout(resolve, 200));
        } catch (e) {
          console.error(`文件 ${file.name} 上传失败:`, e);
          failCount++;
        }
      }

      // 显示最终结果
      if (failCount === 0) {
        message.success(`批量导入完成！成功处理 ${successCount} 个文件`);
      } else {
        message.warning(`批量导入完成！成功 ${successCount} 个，失败 ${failCount} 个文件`);
      }
    } catch (e) {
      message.error('批量导入过程中发生错误');
    } finally {
      setBulkProcessing(false);
      setBulkProgress({ current: 0, total: 0 });
      setBulkImportModalVisible(false);
    }
  };

  // 打开bi_htlrev导入弹窗
  const handleHtlrevImport = () => {
    setHtlrevImportFileList([]);
    setHtlrevProcessing(false);
    setHtlrevProgress({ current: 0, total: 0 });
    setHtlrevImportModalVisible(true);
  };

  // 关闭bi_htlrev导入弹窗
  const handleHtlrevImportCancel = () => setHtlrevImportModalVisible(false);

  // bi_htlrev导入弹窗确认
  const handleHtlrevImportOk = async () => {
    if (!htlrevImportFileList.length) {
      message.warning('请选择目录或文件');
      return;
    }

    // 过滤出Excel文件
    const excelFiles = htlrevImportFileList.filter(file => {
      const fileName = file.name || file.originFileObj?.name || '';
      return fileName.match(/\.(xlsx|xls)$/i);
    });

    if (!excelFiles.length) {
      message.warning('选择的目录中没有Excel文件');
      return;
    }

    setHtlrevProcessing(true);
    setHtlrevProgress({ current: 0, total: excelFiles.length });

    let successCount = 0;
    let failCount = 0;

    try {
      for (let i = 0; i < excelFiles.length; i++) {
        const file = excelFiles[i];
        setHtlrevProgress({ current: i + 1, total: excelFiles.length });

        try {
          const formData = new FormData();
          formData.append('file', file.originFileObj || file);
          
          // 打印请求体
          const requestBody = {
            fileName: file.name || file.originFileObj?.name,
            fileSize: file.size || file.originFileObj?.size,
            currentFile: i + 1,
            totalFiles: excelFiles.length
          };
          console.log(`=== bi_htlrev导入请求体 (${i + 1}/${excelFiles.length}) ===`);
          console.log(JSON.stringify(requestBody, null, 2));
          console.log('=== bi_htlrev导入请求体结束 ===');
          
          await request.post('/api/nj/zhulin/makesql', formData);
          successCount++;
          
          // 延迟一下避免请求过快
          await new Promise(resolve => setTimeout(resolve, 200));
        } catch (e) {
          console.error(`文件 ${file.name} 上传失败:`, e);
          failCount++;
        }
      }

      // 显示最终结果
      if (failCount === 0) {
        message.success(`批量导入完成！成功处理 ${successCount} 个文件`);
      } else {
        message.warning(`批量导入完成！成功 ${successCount} 个，失败 ${failCount} 个文件`);
      }
    } catch (e) {
      message.error('批量导入过程中发生错误');
    } finally {
      setHtlrevProcessing(false);
      setHtlrevProgress({ current: 0, total: 0 });
      setHtlrevImportModalVisible(false);
    }
  };

  // 打开多酒店整年预算上传弹窗
  const handleBudgetBulkImport = () => {
    setBudgetBulkImportFileList([]);
    setBudgetBulkProcessing(false);
    setBudgetBulkProgress({ current: 0, total: 0 });
    setBudgetBulkYear(currentYear);
    setBudgetBulkImportModalVisible(true);
  };

  // 关闭多酒店整年预算上传弹窗
  const handleBudgetBulkImportCancel = () => setBudgetBulkImportModalVisible(false);

  // 多酒店整年预算上传弹窗确认
  const handleBudgetBulkImportOk = async () => {
    if (!budgetBulkImportFileList.length) {
      message.warning('请选择目录或文件');
      return;
    }

    if (!budgetBulkYear) {
      message.warning('请选择年份');
      return;
    }

    // 过滤出Excel文件
    const excelFiles = budgetBulkImportFileList.filter(file => {
      const fileName = file.name || file.originFileObj?.name || '';
      return fileName.match(/\.(xlsx|xls)$/i);
    });

    if (!excelFiles.length) {
      message.warning('选择的目录中没有Excel文件');
      return;
    }

    setBudgetBulkProcessing(true);
    setBudgetBulkProgress({ current: 0, total: excelFiles.length });

    let successCount = 0;
    let failCount = 0;

    try {
      for (let i = 0; i < excelFiles.length; i++) {
        const file = excelFiles[i];
        setBudgetBulkProgress({ current: i + 1, total: excelFiles.length });

        try {
          const formData = new FormData();
          formData.append('file', file.originFileObj || file);
          formData.append('year', budgetBulkYear.toString());
          
          // 打印请求体
          const requestBody = {
            fileName: file.name || file.originFileObj?.name,
            fileSize: file.size || file.originFileObj?.size,
            year: budgetBulkYear,
            currentFile: i + 1,
            totalFiles: excelFiles.length
          };
          console.log(`=== 多酒店整年预算上传请求体 (${i + 1}/${excelFiles.length}) ===`);
          console.log(JSON.stringify(requestBody, null, 2));
          console.log('=== 多酒店整年预算上传请求体结束 ===');
          
          await request.post('/api/nj/budget/bulk/makesql', formData);
          successCount++;
          
          // 延迟一下避免请求过快
          await new Promise(resolve => setTimeout(resolve, 200));
        } catch (e) {
          console.error(`文件 ${file.name} 上传失败:`, e);
          failCount++;
        }
      }

      // 显示最终结果
      if (failCount === 0) {
        message.success(`批量导入完成！成功处理 ${successCount} 个文件`);
      } else {
        message.warning(`批量导入完成！成功 ${successCount} 个，失败 ${failCount} 个文件`);
      }
    } catch (e) {
      message.error('批量导入过程中发生错误');
    } finally {
      setBudgetBulkProcessing(false);
      setBudgetBulkProgress({ current: 0, total: 0 });
      setBudgetBulkImportModalVisible(false);
    }
  };

  return (
    <Card style={{ margin: 24 }}>
      
      <Collapse defaultActiveKey={['1']} style={{ marginBottom: 16 }}>
        <Panel header="查询条件" key="1">
          <Form layout="inline" form={form}>
            <Row gutter={16} style={{ width: '100%' }}>
              <Col span={6} style={{ marginBottom: 12 }}>
                <Form.Item label="产权类型" name="propertyType">
                  <Select allowClear placeholder="请选择" size="large" mode="multiple">
                    {propertyTypeOptions.map(opt => <Option key={opt} value={opt}>{opt}</Option>)}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6} style={{ marginBottom: 12 }}>
                <Form.Item label="酒店类型" name="hotelType">
                  <Select allowClear placeholder="请选择" size="large" mode="multiple">
                    {hotelTypeOptions.map(opt => <Option key={opt} value={opt}>{opt}</Option>)}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6} style={{ marginBottom: 12 }}>
                <Form.Item label="管理公司" name="manageCompany">
                  <Select allowClear placeholder="请选择" size="large" mode="multiple">
                    {manageCompanyOptions.map(opt => <Option key={opt} value={opt}>{opt}</Option>)}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6} style={{ marginBottom: 12 }}>
                <Form.Item label="品牌" name="brand">
                  <Select allowClear placeholder="请选择" size="large" mode="multiple">
                    {brandOptions.map(opt => <Option key={opt} value={opt}>{opt}</Option>)}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6} style={{ marginBottom: 12 }}>
                <Form.Item label="省份" name="province">
                  <Select allowClear placeholder="请选择" size="large" mode="multiple">
                    {provinceOptions.map(opt => <Option key={opt} value={opt}>{opt}</Option>)}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6} style={{ marginBottom: 12 }}>
                <Form.Item label="城市" name="city">
                  <Select allowClear placeholder="请选择" size="large" mode="multiple">
                    {cityOptions.map(opt => <Option key={opt} value={opt}>{opt}</Option>)}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6} style={{ marginBottom: 12 }}>
                <Form.Item label="PMS类型" name="pmsType">
                  <Select allowClear placeholder="请选择" size="large" mode="multiple">
                    {pmsTypeOptions.map(opt => <Option key={opt} value={opt}>{opt}</Option>)}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={24} style={{ textAlign: 'right', marginTop: 8 }}>
                <Space>
                  <Button size="large" onClick={handleReset}>重置</Button>
                  <Button type="primary" size="large" onClick={handleSearch}>查询</Button>
                </Space>
              </Col>
            </Row>
          </Form>
        </Panel>
      </Collapse>
      <Table
        columns={columns.map(col => {
          if (col.key === 'operationTemplate') {
            return {
              ...col,
              render: (_: unknown, record: HotelData) => (
                <Button type="primary" size="small" onClick={() => handleOperationDownload(record)}>
                  下载
                </Button>
              ),
            };
          }
          if (col.key === 'budgetTemplate') {
            return {
              ...col,
              render: (_: unknown, record: HotelData) => (
                <Button type="primary" size="small" onClick={() => handleBudgetDownload(record)}>
                  下载
                </Button>
              ),
            };
          }
          if (col.key === 'importOperation') {
            return {
              ...col,
              render: (_: unknown, record: HotelData) => (
                <Button type="default" size="small" onClick={() => handleImportOperation(record)}>
                  导入
                </Button>
              ),
            };
          }
          if (col.key === 'importBudget') {
            return {
              ...col,
              render: (_: unknown, record: HotelData) => (
                <Button type="default" size="small" onClick={() => handleImportBudget(record)}>
                  导入
                </Button>
              ),
            };
          }
          return col;
        })}
        dataSource={tableData}
        rowKey="hotelCode"
        bordered
        scroll={{ x: 1600, y: 400 }}
        pagination={false}
      />
      <div style={{ marginTop: 16, textAlign: 'center' }}>
        <Space size="large">
          <Button type="primary" size="large" onClick={handleBulkImport}>
          多酒店多日期每日插入bi_ttl
          </Button>
          <Button type="primary" size="large" onClick={handleHtlrevImport}>
            多酒店多日期每日插入bi_htlrev
          </Button>
          <Button type="primary" size="large" onClick={handleBudgetBulkImport}>
            多酒店整年预算上传
          </Button>
        </Space>
      </div>
      {/* 经营数据模板下载弹窗 */}
      <Modal
        title="下载经营数据模板"
        open={operationModalVisible}
        onCancel={handleOperationModalCancel}
        onOk={handleOperationModalOk}
        okText="下载"
        cancelText="取消"
      >
        <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center' }}>
          <b>酒店编号：</b><span style={{ marginRight: 16 }}>{downloadHotel?.hotelCode}</span>
          <b>酒店名称：</b><span>{downloadHotel?.hotelName}</span>
        </div>
        <div style={{ marginBottom: 12 }}>
          <b>日期区间：</b>
          <RangePicker
            style={{ width: 360 }}
            value={operationRange as [Dayjs, Dayjs] | null}
            onChange={setOperationRange}
            placeholder={["开始日期", "结束日期"]}
            format="YYYY-MM-DD"
            size="large"
            allowClear={false}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <Space>
            <Button 
              size="small" 
              onClick={() => {
                const lastYear = currentYear - 1;
                setOperationRange([dayjs(`${lastYear}-01-01`), dayjs(`${lastYear}-12-31`)]);
              }}
            >
              去年
            </Button>
            <Button 
              size="small" 
              onClick={() => {
                setOperationRange([dayjs(`${currentYear}-01-01`), dayjs(`${currentYear}-06-30`)]);
              }}
            >
              上半年
            </Button>
          </Space>
        </div>
      </Modal>
      {/* 预算模板下载弹窗 */}
      <Modal
        title="下载预算模板"
        open={budgetModalVisible}
        onCancel={handleBudgetModalCancel}
        onOk={handleBudgetModalOk}
        okText="下载"
        cancelText="取消"
      >
        <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center' }}>
          <b>酒店编号：</b><span style={{ marginRight: 16 }}>{downloadHotel?.hotelCode}</span>
          <b>酒店名称：</b><span>{downloadHotel?.hotelName}</span>
        </div>
        <div style={{ marginBottom: 12 }}>
          <b>年份：</b>
          <Select
            style={{ width: 120 }}
            value={selectedYear}
            onChange={setSelectedYear}
            placeholder="请选择年份"
            size="large"
          >
            {yearOptions.map(year => (
              <Option key={year} value={year}>{year}年</Option>
            ))}
          </Select>
        </div>
      </Modal>
      {/* 导入经营数据弹窗 */}
      <Modal
        title="导入经营数据"
        open={importOperationModalVisible}
        onCancel={handleImportOperationCancel}
        onOk={handleImportOperationOk}
        okText="导入"
        cancelText="取消"
      >
        <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center' }}>
          <b>酒店编号：</b><span style={{ marginRight: 16 }}>{importHotel?.hotelCode}</span>
          <b>酒店名称：</b><span>{importHotel?.hotelName}</span>
        </div>
        <div style={{ marginBottom: 12 }}>
          <Upload
            fileList={importFileList}
            beforeUpload={() => false}
            onChange={({ fileList }) => setImportFileList(fileList)}
            maxCount={1}
          >
            <Button type="primary">选择文件</Button>
          </Upload>
        </div>
      </Modal>
      {/* 导入预算弹窗 */}
      <Modal
        title="导入预算"
        open={importBudgetModalVisible}
        onCancel={handleImportBudgetCancel}
        onOk={handleImportBudgetOk}
        okText="导入"
        cancelText="返回"
      >
        <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center' }}>
          <b>酒店编号：</b><span style={{ marginRight: 16 }}>{importBudgetHotel?.hotelCode}</span>
          <b>酒店名称：</b><span>{importBudgetHotel?.hotelName}</span>
        </div>
        <div style={{ marginBottom: 16 }}>
          <b>年份：</b>
          <Select
            style={{ width: 120 }}
            value={importBudgetYear}
            onChange={setImportBudgetYear}
            placeholder="请选择年份"
            size="large"
          >
            {yearOptions.map(year => (
              <Option key={year} value={year}>{year}年</Option>
            ))}
          </Select>
        </div>
        <div style={{ marginBottom: 12 }}>
          <Upload
            fileList={importBudgetFileList}
            beforeUpload={() => false}
            onChange={({ fileList }) => setImportBudgetFileList(fileList)}
            maxCount={1}
          >
            <Button type="primary">选择文件</Button>
          </Upload>
        </div>
      </Modal>
      {/* 全量导入弹窗 */}
      <Modal
        title="多酒店多日期每日插入bi_ttl"
        open={bulkImportModalVisible}
        onCancel={handleBulkImportCancel}
        onOk={handleBulkImportOk}
        okText={bulkProcessing ? "处理中..." : "导入"}
        cancelText="取消"
        confirmLoading={bulkProcessing}
        closable={!bulkProcessing}
        maskClosable={!bulkProcessing}
      >
          <div style={{ marginBottom: 16, padding: '12px', backgroundColor: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: '6px' }}>
           <div style={{ color: '#52c41a', fontSize: '14px' }}>
             <strong>功能说明：</strong>
             <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}> 
               <li>生成多酒店多日期每日插入bi_ttl表的SQL语句</li>
               <li>适用于导入历史经营日报的数据，包括：客房收入、餐饮收入、其他收入、总可售卖房数、实际出租房数、总房数、可用房数、单人使用房数、维修房数、不可用房数、未确认房数、已预订房数</li>
             </ul>
           </div>
         </div>
        
        {bulkProcessing && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ marginBottom: 8 }}>
              <span style={{ fontSize: '14px', color: '#666' }}>
                正在处理第 {bulkProgress.current} 个文件，共 {bulkProgress.total} 个文件
              </span>
            </div>
            <Progress
              percent={Math.round((bulkProgress.current / bulkProgress.total) * 100)}
              status="active"
              strokeColor={{
                '0%': '#108ee9',
                '100%': '#87d068',
              }}
            />
          </div>
        )}

        <div style={{ marginBottom: 12 }}>
          <div style={{ marginBottom: 8 }}>
            <strong>选择目录（包含Excel文件）：</strong>
          </div>
          <Upload
            fileList={bulkImportFileList}
            beforeUpload={() => false}
            onChange={({ fileList }) => setBulkImportFileList(fileList)}
            directory
            multiple
            accept=".xlsx,.xls"
            disabled={bulkProcessing}
          >
            <Button type="primary" disabled={bulkProcessing}>
              {bulkImportFileList.length > 0 ? `已选择 ${bulkImportFileList.length} 个文件` : '选择目录'}
            </Button>
          </Upload>
          {bulkImportFileList.length > 0 && (
            <div style={{ marginTop: 8, fontSize: '12px', color: '#666' }}>
              提示：将会处理目录中的所有Excel文件（.xlsx, .xls）
            </div>
          )}
        </div>
      </Modal>
      {/* bi_htlrev导入弹窗 */}
      <Modal
        title="多酒店多日期每日插入bi_htlrev"
        open={htlrevImportModalVisible}
        onCancel={handleHtlrevImportCancel}
        onOk={handleHtlrevImportOk}
        okText={htlrevProcessing ? "处理中..." : "导入"}
        cancelText="取消"
        confirmLoading={htlrevProcessing}
        closable={!htlrevProcessing}
        maskClosable={!htlrevProcessing}
      >
        <div style={{ marginBottom: 16, padding: '12px', backgroundColor: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: '6px' }}>
          <span style={{ color: '#52c41a', fontSize: '14px' }}>
            <strong>功能说明：</strong>生成多酒店多日期每日插入bi_htlrev表的SQL语句
          </span>
        </div>
        
        {htlrevProcessing && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ marginBottom: 8 }}>
              <span style={{ fontSize: '14px', color: '#666' }}>
                正在处理第 {htlrevProgress.current} 个文件，共 {htlrevProgress.total} 个文件
              </span>
            </div>
            <Progress
              percent={Math.round((htlrevProgress.current / htlrevProgress.total) * 100)}
              status="active"
              strokeColor={{
                '0%': '#108ee9',
                '100%': '#87d068',
              }}
            />
          </div>
        )}

        <div style={{ marginBottom: 12 }}>
          <div style={{ marginBottom: 8 }}>
            <strong>选择目录（包含Excel文件）：</strong>
          </div>
          <Upload
            fileList={htlrevImportFileList}
            beforeUpload={() => false}
            onChange={({ fileList }) => setHtlrevImportFileList(fileList)}
            directory
            multiple
            accept=".xlsx,.xls"
            disabled={htlrevProcessing}
          >
            <Button type="primary" disabled={htlrevProcessing}>
              {htlrevImportFileList.length > 0 ? `已选择 ${htlrevImportFileList.length} 个文件` : '选择目录'}
            </Button>
          </Upload>
          {htlrevImportFileList.length > 0 && (
            <div style={{ marginTop: 8, fontSize: '12px', color: '#666' }}>
              提示：将会处理目录中的所有Excel文件（.xlsx, .xls）
            </div>
          )}
        </div>
      </Modal>
      {/* 多酒店整年预算上传弹窗 */}
      <Modal
        title="多酒店整年预算上传"
        open={budgetBulkImportModalVisible}
        onCancel={handleBudgetBulkImportCancel}
        onOk={handleBudgetBulkImportOk}
        okText={budgetBulkProcessing ? "处理中..." : "导入"}
        cancelText="取消"
        confirmLoading={budgetBulkProcessing}
        closable={!budgetBulkProcessing}
        maskClosable={!budgetBulkProcessing}
      >
        <div style={{ marginBottom: 16, padding: '12px', backgroundColor: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: '6px' }}>
          <span style={{ color: '#52c41a', fontSize: '14px' }}>
            <strong>功能说明：</strong>生成多酒店整年预算上传的SQL语句
          </span>
        </div>
        
        <div style={{ marginBottom: 16 }}>
          <div style={{ marginBottom: 8 }}>
            <strong>年份：</strong>
          </div>
          <Select
            style={{ width: 120 }}
            value={budgetBulkYear}
            onChange={setBudgetBulkYear}
            placeholder="请选择年份"
            size="large"
            disabled={budgetBulkProcessing}
          >
            {yearOptions.map(year => (
              <Option key={year} value={year}>{year}年</Option>
            ))}
          </Select>
        </div>
        
        {budgetBulkProcessing && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ marginBottom: 8 }}>
              <span style={{ fontSize: '14px', color: '#666' }}>
                正在处理第 {budgetBulkProgress.current} 个文件，共 {budgetBulkProgress.total} 个文件
              </span>
            </div>
            <Progress
              percent={Math.round((budgetBulkProgress.current / budgetBulkProgress.total) * 100)}
              status="active"
              strokeColor={{
                '0%': '#108ee9',
                '100%': '#87d068',
              }}
            />
          </div>
        )}

        <div style={{ marginBottom: 12 }}>
          <div style={{ marginBottom: 8 }}>
            <strong>选择目录（包含Excel文件）：</strong>
          </div>
          <Upload
            fileList={budgetBulkImportFileList}
            beforeUpload={() => false}
            onChange={({ fileList }) => setBudgetBulkImportFileList(fileList)}
            directory
            multiple
            accept=".xlsx,.xls"
            disabled={budgetBulkProcessing}
          >
            <Button type="primary" disabled={budgetBulkProcessing}>
              {budgetBulkImportFileList.length > 0 ? `已选择 ${budgetBulkImportFileList.length} 个文件` : '选择目录'}
            </Button>
          </Upload>
          {budgetBulkImportFileList.length > 0 && (
            <div style={{ marginTop: 8, fontSize: '12px', color: '#666' }}>
              提示：将会处理目录中的所有Excel文件（.xlsx, .xls）
            </div>
          )}
        </div>
      </Modal>
    </Card>
  );
};

export default BudgetDataImport;
