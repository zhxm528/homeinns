import React, { useState, useRef } from 'react';
import { Table, InputNumber, Card, Modal, Button, Select, Switch, Row, Col, Space, Typography, message, Upload, Collapse } from 'antd';
import dayjs from 'dayjs';
import locale from 'antd/es/date-picker/locale/zh_CN';
import 'dayjs/locale/zh-cn';
import TokenCheck from '../../components/common/TokenCheck';
import YearSelect from '../../components/common/YearSelect';
import ManageTypeSelect from '../../components/common/ManageTypeSelect';
import CitySelect from '../../components/common/CitySelect';
import StoreAgeSelect from '../../components/common/StoreAgeSelect';
import DistrictSelect from '../../components/common/DistrictSelect';
import HotelSelect from '../../components/common/HotelSelect';
import request from '../../utils/request';

const months = Array.from({ length: 12 }, (_, i) => `${i + 1}月`);

// 生成模拟数据
const getRandom = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const initialData: any[] = [];

// 判断科目是否需要显示为百分比格式
const isPercentageSubject = (subjectName: string) => {
  return subjectName.includes('出租率') || subjectName.includes('GOP%') || subjectName.includes('经营毛利%');
};

// 格式化数值显示
const formatValue = (value: number, subjectName: string) => {
  if (value === undefined || value === null) return '';
  
  if (isPercentageSubject(subjectName)) {
    // 如果是百分比科目，将小数转换为百分比（例如：0.8 -> 80%）
    const percentage = value * 100;
    // 如果小数点后都是0，则不显示小数部分
    return percentage % 1 === 0 ? Math.round(percentage) + '%' : percentage.toFixed(1) + '%';
  }
  
  return value.toLocaleString('en-US');
};

const columns = [
  { title: '科目', dataIndex: 'item', key: 'item', width: 320, fixed: 'left' },
  { title: '预算年份', dataIndex: 'year', key: 'year', width: 80 },
  ...Array.from({ length: 12 }, (_, i) => ([
    {
      title: `${i + 1}月预算`,
      dataIndex: `m${i + 1}`,
      key: `m${i + 1}`,
      width: 100,
      align: 'center',
      render: (value: number, record: any) => formatValue(value, record.item)
    },
    {
      title: `${i + 1}月比例`,
      dataIndex: `m${i + 1}Rate`,
      key: `m${i + 1}Rate`,
      width: 100,
      align: 'center',
      render: (value: number) => value !== undefined && value !== null ? value + '%' : ''
    }
  ])).flat(),
  {
    title: '年合计预算',
    dataIndex: 'yearTotal',
    key: 'yearTotal',
    width: 120,
    align: 'center',
    render: (value: number, record: any) => formatValue(value, record.item)
  },
  {
    title: '年合计比例',
    dataIndex: 'yearTotalRate',
    key: 'yearTotalRate',
    width: 120,
    align: 'center',
    render: (value: number) => value !== undefined && value !== null ? value + '%' : ''
  },
  {
    title: 'Q1',
    dataIndex: 'q1',
    key: 'q1',
    width: 100,
    align: 'center',
    render: (value: number, record: any) => formatValue(value, record.item)
  },
  {
    title: 'Q2',
    dataIndex: 'q2',
    key: 'q2',
    width: 100,
    align: 'center',
    render: (value: number, record: any) => formatValue(value, record.item)
  },
  {
    title: 'Q3',
    dataIndex: 'q3',
    key: 'q3',
    width: 100,
    align: 'center',
    render: (value: number, record: any) => formatValue(value, record.item)
  },
  {
    title: 'Q4',
    dataIndex: 'q4',
    key: 'q4',
    width: 100,
    align: 'center',
    render: (value: number, record: any) => formatValue(value, record.item)
  }
];

let handleCellClick: (rowKey: number, colKey: string, value: number) => void;

// 获取当前日期是第几周
function getWeek(date: Date) {
  const firstDay = new Date(date.getFullYear(), 0, 1);
  const dayOfYear = ((date as any) - (firstDay as any)) / 86400000 + 1;
  return Math.ceil((dayOfYear + firstDay.getDay()) / 7);
}

const currentYear = new Date().getFullYear();

const BudgetEntry: React.FC = () => {
  // 添加CSS动画样式
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  const [data, setData] = useState<any[]>([]);
  const [hotelGroups, setHotelGroups] = useState<any[]>([]);
  const [modal, setModal] = useState({ visible: false, rowKey: -1, colKey: '', value: 0 });
  const [editValue, setEditValue] = useState<number>(0);
  const [logs, setLogs] = useState<{ week: string; value: number; time: string; user: string; status?: string }[]>([]);
  const [selectedHotel, setSelectedHotel] = useState<string>('');
  const [budgetOpen, setBudgetOpen] = useState<boolean>(true);
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [selectedManageType, setSelectedManageType] = useState<string | undefined>(undefined);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string | undefined>(undefined);
  const [selectedCityArea, setSelectedCityArea] = useState<string | undefined>(undefined);
  const [selectedStoreAge, setSelectedStoreAge] = useState<string | undefined>(undefined);
  const [selectedHotelInfo, setSelectedHotelInfo] = useState<{hotelCode: string, hotelName: string} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchPanelCollapsed, setSearchPanelCollapsed] = useState<boolean>(false);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  handleCellClick = (rowKey, colKey, value) => {
    setModal({ visible: true, rowKey, colKey, value });
    setEditValue(value);
    // 这里可以根据rowKey/colKey加载历史日志，先用mock
    setLogs([
      { week: '第23周', value, time: '2024-06-01 10:00', user: '张三', status: '已通过' },
      { week: '第22周', value: value + 1000, time: '2024-05-20 09:30', user: '李四', status: '待审核' }
    ]);
  };

  const handleCancel = () => setModal({ ...modal, visible: false });
  const handleSave = () => {
    // 更新酒店分组数据
    setHotelGroups(prev => prev.map(hotel => ({
      ...hotel,
      subjects: hotel.subjects.map((subject: any) => 
        subject.key === modal.rowKey ? { ...subject, [modal.colKey]: editValue } : subject
      )
    })));
    
    setLogs(prev => [
      { week: '第' + getWeek(new Date()) + '周', value: editValue, time: new Date().toLocaleString(), user: '当前用户', status: '待审核' },
      ...prev
    ]);
    setModal({ ...modal, visible: false });
  };

  // 下载模板
  const handleDownloadTemplate = async () => {
    try {
      // 检查酒店ID是否为空
      if (!selectedHotel) {
        message.warning('请先选择酒店');
        return;
      }

      // 设置下载状态
      setIsDownloading(true);
      setDownloadProgress(0);

      const params: any = {
        year: selectedYear
      };

      // 如果选择了酒店，则添加酒店ID参数
      if (selectedHotel) {
        params.hotelId = selectedHotel;
      }

      console.log('下载模板参数:', params);

      // 模拟下载进度
      const progressInterval = setInterval(() => {
        setDownloadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 15;
        });
      }, 200);

      // 调用下载模板API
      const response = await request.get('/api/uc/budget/download-modified-template', {
        params,
        responseType: 'blob', // 设置响应类型为blob，用于文件下载
        onDownloadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setDownloadProgress(progress);
          }
        }
      });

      // 清除进度定时器
      clearInterval(progressInterval);
      setDownloadProgress(100);

      // 创建下载链接
      const blob = new Blob([response.data], { 
        type: response.headers['content-type'] || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // 从响应头获取文件名，如果没有则使用默认名称
      const contentDisposition = response.headers['content-disposition'];
      let filename = '逸扉酒店预算填报模板.xlsx';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, '');
        }
      }

      // 如果从响应头没有获取到文件名，则使用包含酒店名称和年份的默认文件名
      if (filename === '逸扉酒店预算填报模板.xlsx') {
        if (selectedHotelInfo) {
          filename = `${selectedHotelInfo.hotelCode}${selectedHotelInfo.hotelName}${selectedYear}年预算填报模板.xlsx`;
        } else {
          filename = `通用${selectedYear}年预算填报模板.xlsx`;
        }
      }
      
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // 延迟重置状态，让用户看到100%完成
      setTimeout(() => {
        setIsDownloading(false);
        setDownloadProgress(0);
        message.success('模板下载成功');
      }, 500);

    } catch (error) {
      console.error('下载模板失败:', error);
      setIsDownloading(false);
      setDownloadProgress(0);
      message.error('下载模板失败，请重试');
    }
  };

  // 处理文件上传
  const handleFileUpload = async (file: File) => {
    try {
      // 显示加载提示
      const loadingMessage = message.loading('正在上传文件，请稍候...', 0);

      // 创建 FormData
      const formData = new FormData();
      formData.append('file', file);
      
      // 添加其他参数
      if (selectedYear) {
        formData.append('year', selectedYear.toString());
      }
      if (selectedHotel) {
        formData.append('hotelId', selectedHotel);
      }

      // 添加 chainId 参数，从 localStorage 获取
      const chainId = localStorage.getItem('chainId');
      if (chainId) {
        try {
         formData.append('chainId', chainId);
        } catch (error) {
          console.error('解析用户信息失败:', error);
        }
      }

      // 调用上传API
      const response = await request.post('/api/hotelbudget/ucUploadbudget', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // 关闭加载提示
      loadingMessage();

      // 处理响应
      if (response.data.success) {
        message.success('文件上传成功');
        // 可以在这里刷新数据或进行其他操作
      } else {
        message.error(response.data.message || '文件上传失败');
      }
    } catch (error) {
      console.error('文件上传失败:', error);
      message.error('文件上传失败，请重试');
    }
  };

  // 处理导入按钮点击
  const handleImportClick = () => {
    // 显示确认对话框
    Modal.confirm({
      title: '确认导入年份和酒店',
      content: (
        <div>
          
          <p><strong>年份：</strong>{selectedYear}年</p>
          <p><strong>酒店：</strong>{selectedHotelInfo ? `${selectedHotelInfo.hotelCode} - ${selectedHotelInfo.hotelName}` : '未选择酒店'}</p>
          <p>确定要继续导入吗？</p>
        </div>
      ),
      okText: '继续',
      cancelText: '取消',
      onOk: () => {
        // 用户确认后，触发文件选择
        if (fileInputRef.current) {
          fileInputRef.current.click();
        }
      }
    });
  };

  // 处理导出按钮点击
  const handleExport = async () => {
    try {
      // 检查是否有数据可以导出
      if (hotelGroups.length === 0) {
        message.warning('暂无数据可导出，请先查询数据');
        return;
      }

      setLoading(true);
      
      // 构建导出数据，按照panel从上到下的顺序
      const exportData = hotelGroups.map((hotel, hotelIndex) => ({
        hotelIndex,
        hotelCode: hotel.hotelCode,
        hotelName: hotel.hotelName,
        hotelId: hotel.hotelId,
        chainCode: hotel.chainCode,
        chainName: hotel.chainName,
        hotelManagementModel: hotel.hotelManagementModel,
        subjects: hotel.subjects.map((subject: any, subjectIndex: number) => ({
          subjectIndex,
          item: subject.item,
          subjectCode: subject.subjectCode,
          year: subject.year,
          m1: subject.m1,
          m1Rate: subject.m1Rate,
          m2: subject.m2,
          m2Rate: subject.m2Rate,
          m3: subject.m3,
          m3Rate: subject.m3Rate,
          m4: subject.m4,
          m4Rate: subject.m4Rate,
          m5: subject.m5,
          m5Rate: subject.m5Rate,
          m6: subject.m6,
          m6Rate: subject.m6Rate,
          m7: subject.m7,
          m7Rate: subject.m7Rate,
          m8: subject.m8,
          m8Rate: subject.m8Rate,
          m9: subject.m9,
          m9Rate: subject.m9Rate,
          m10: subject.m10,
          m10Rate: subject.m10Rate,
          m11: subject.m11,
          m11Rate: subject.m11Rate,
          m12: subject.m12,
          m12Rate: subject.m12Rate,
          yearTotal: subject.yearTotal,
          yearTotalRate: subject.yearTotalRate,
          q1: subject.q1,
          q2: subject.q2,
          q3: subject.q3,
          q4: subject.q4
        }))
      }));

      // 构建导出参数，使用当前查询条件
      const params: any = {
        year: selectedYear,
        exportData
      };

      // 添加其他查询参数（如果有的话）
      if (selectedHotel) {
        params.hotelId = selectedHotel;
      }
      if (selectedManageType) {
        params.hotelManagementModel = selectedManageType;
      }
      if (selectedCity) {
        params.cityId = selectedCity;
      }

      // 添加 chainId 参数，从 localStorage 获取
      const chainId = localStorage.getItem('chainId');
      if (chainId) {
        params.chainId = chainId;
      }

      // 在F12控制台打印JSON格式的请求体
      console.log('导出请求体 (JSON格式):', JSON.stringify(params, null, 2));

      // 调用导出API
      const response = await request.post('/api/hotelbudget/hotelBudgetExport', params);

      if (response.data.success) {
        message.success('导出成功');
      } else {
        message.error(response.data.message || '导出失败');
      }
    } catch (error) {
      console.error('导出失败:', error);
      message.error('导出失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 查询数据
  const handleQuery = async () => {
    try {
      setLoading(true);
      
      const params: any = {
        year: selectedYear
      };

      // 添加其他查询参数
      if (selectedHotel) {
        params.hotelId = selectedHotel;
      }
      if (selectedManageType) {
        params.hotelManagementModel = selectedManageType;
      }
      if (selectedCity) {
        params.cityId = selectedCity;
      }

      // 添加 chainId 参数，从 localStorage 获取
      const chainId = localStorage.getItem('chainId');
      if (chainId) {
        params.chainId = chainId;
      }

      console.log('查询参数:', params);
      console.log('请求体参数 (JSON格式):', JSON.stringify(params, null, 2));

      const response = await request.post('/api/hotelbudget/hotelBudgetList', params);

      if (response.data.success) {
        // 按酒店分组数据
        const hotelMap = new Map();
        
        response.data.data.forEach((item: any, index: number) => {
          const hotelKey = `${item.hotelCode}_${item.hotelName}`;
          
          if (!hotelMap.has(hotelKey)) {
            hotelMap.set(hotelKey, {
              hotelCode: item.hotelCode,
              hotelName: item.hotelName,
              hotelId: item.hotelId,
              chainCode: item.chainCode,
              chainName: item.chainName,
              hotelManagementModel: item.hotelManagementModel,
              subjects: []
            });
          }
          
          const hotelData = hotelMap.get(hotelKey);
          hotelData.subjects.push({
            key: index,
            item: item.subjectName,
            subjectCode: item.subjectCode,
            year: item.budgetYear,
            m1: item.janBudget,
            m1Rate: item.janRatio ? Math.round(item.janRatio * 100) : undefined,
            m2: item.febBudget,
            m2Rate: item.febRatio ? Math.round(item.febRatio * 100) : undefined,
            m3: item.marBudget,
            m3Rate: item.marRatio ? Math.round(item.marRatio * 100) : undefined,
            m4: item.aprBudget,
            m4Rate: item.aprRatio ? Math.round(item.aprRatio * 100) : undefined,
            m5: item.mayBudget,
            m5Rate: item.mayRatio ? Math.round(item.mayRatio * 100) : undefined,
            m6: item.junBudget,
            m6Rate: item.junRatio ? Math.round(item.junRatio * 100) : undefined,
            m7: item.julBudget,
            m7Rate: item.julRatio ? Math.round(item.julRatio * 100) : undefined,
            m8: item.augBudget,
            m8Rate: item.augRatio ? Math.round(item.augRatio * 100) : undefined,
            m9: item.sepBudget,
            m9Rate: item.sepRatio ? Math.round(item.sepRatio * 100) : undefined,
            m10: item.octBudget,
            m10Rate: item.octRatio ? Math.round(item.octRatio * 100) : undefined,
            m11: item.novBudget,
            m11Rate: item.novRatio ? Math.round(item.novRatio * 100) : undefined,
            m12: item.decBudget,
            m12Rate: item.decRatio ? Math.round(item.decRatio * 100) : undefined,
            yearTotal: item.annualBudget,
            yearTotalRate: item.annualRatio ? Math.round(item.annualRatio * 100) : undefined,
            q1: item.q1Budget,
            q2: item.q2Budget,
            q3: item.q3Budget,
            q4: item.q4Budget
          });
        });
        
        const hotelGroupsArray = Array.from(hotelMap.values());
        setHotelGroups(hotelGroupsArray);
        setData(response.data.data); // 保留原始数据用于其他功能
        message.success('查询成功');
      } else {
        message.error(response.data.message || '查询失败');
      }
    } catch (error) {
      console.error('查询失败:', error);
      message.error('查询失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 重置查询条件
  const handleReset = () => {
    setSelectedYear(currentYear);
    setSelectedManageType(undefined);
    setSelectedCity('');
    setSelectedDistrict(undefined);
    setSelectedCityArea(undefined);
    setSelectedStoreAge(undefined);
    setSelectedHotel('');
    setSelectedHotelInfo(null);
    setData([]);
    setHotelGroups([]);
  };

  // 处理文件选择
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // 验证文件类型
      const allowedTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
        'application/vnd.ms-excel', // .xls
        'application/vnd.ms-excel.sheet.macroEnabled.12', // .xlsm
      ];
      
      if (!allowedTypes.includes(file.type)) {
        message.error('请选择Excel文件格式（.xlsx, .xls, .xlsm）');
        return;
      }

      // 验证文件大小（限制为10MB）
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        message.error('文件大小不能超过10MB');
        return;
      }

      // 上传文件
      handleFileUpload(file);
    }
    
    // 清空文件输入框，允许重复选择同一文件
    if (event.target) {
      event.target.value = '';
    }
  };

  return (
    <TokenCheck checkToken={false}>
      <div className="p-6">
        <Collapse
          activeKey={searchPanelCollapsed ? [] : ['search']}
          onChange={(keys) => setSearchPanelCollapsed(keys.length === 0)}
          style={{ marginBottom: '24px' }}
        >
          <Collapse.Panel header="预算填报" key="search">
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <YearSelect
                    value={selectedYear}
                    onChange={(value) => setSelectedYear(value || currentYear)}
                    placeholder="选择年份"
                  />
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <ManageTypeSelect
                    value={selectedManageType}
                    onChange={setSelectedManageType}
                    placeholder="管理类型"
                  />
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <DistrictSelect
                    districtValue={selectedDistrict}
                    cityAreaValue={selectedCityArea}
                    onDistrictChange={setSelectedDistrict}
                    onCityAreaChange={setSelectedCityArea}
                    districtPlaceholder="大区"
                    cityAreaPlaceholder="城区"
                  />
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <StoreAgeSelect
                    value={selectedStoreAge}
                    onChange={setSelectedStoreAge}
                  />
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <CitySelect
                    value={selectedCity}
                    onChange={(value) => setSelectedCity(value || '')}
                    placeholder="选择城市"
                  />
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <HotelSelect
                    value={selectedHotel}
                    onChange={setSelectedHotel}
                    onHotelChange={(hotel) => {
                      if (hotel) {
                        setSelectedHotelInfo({
                          hotelCode: hotel.hotelCode,
                          hotelName: hotel.hotelName
                        });
                      } else {
                        setSelectedHotelInfo(null);
                      }
                    }}
                    placeholder="选择酒店"
                    required={false}
                  />
                </Col>
                <Col xs={24} sm={12} md={12} lg={12}>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Space>
                      {selectedYear && selectedHotel && (
                        <>
                          <Button type="primary" size="large" onClick={handleImportClick}>导入</Button>
                          <Button 
                            size="large" 
                            onClick={handleDownloadTemplate}
                            loading={isDownloading}
                            disabled={isDownloading}
                          >
                            {isDownloading ? '下载中...' : '下载模板'}
                          </Button>
                        </>
                      )}
                      {hotelGroups.length > 0 && (
                        <Button 
                          type="primary" 
                          size="large" 
                          onClick={handleExport}
                          loading={loading}
                        >
                          导出
                        </Button>
                      )}
                      <Button 
                        type="primary" 
                        size="large" 
                        onClick={handleQuery}
                        loading={loading}
                      >
                        查询
                      </Button>
                      <Button size="large" onClick={handleReset}>重置</Button>
                    </Space>
                    {isDownloading && (
                      <div style={{ width: '100%', maxWidth: '300px' }}>
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          marginBottom: '4px',
                          fontSize: '12px',
                          color: '#666'
                        }}>
                          <span>下载进度</span>
                          <span>{Math.round(downloadProgress)}%</span>
                        </div>
                        <div style={{
                          width: '100%',
                          height: '6px',
                          backgroundColor: '#f0f0f0',
                          borderRadius: '3px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            width: `${downloadProgress}%`,
                            height: '100%',
                            backgroundColor: '#1890ff',
                            borderRadius: '3px',
                            transition: 'width 0.3s ease',
                            background: 'linear-gradient(90deg, #1890ff 0%, #40a9ff 50%, #1890ff 100%)',
                            backgroundSize: '200% 100%',
                            animation: downloadProgress > 0 && downloadProgress < 100 ? 'shimmer 1.5s infinite' : 'none'
                          }} />
                        </div>
                      </div>
                    )}
                  </Space>
                  {/* 隐藏的文件输入框 */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls,.xlsm"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                  />
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Space>
                    <label style={{ display: 'flex', alignItems: 'center', marginBottom: 0 }}>
                      <span style={{ marginRight: 6 }}>预算开放</span>
                      <Switch checked={budgetOpen} onChange={setBudgetOpen} />
                    </label>
                  </Space>
                </Col>
              </Row>
            </Space>
          </Collapse.Panel>
        </Collapse>

        <Card style={{ marginTop: '24px' }} title="预算明细" bordered={false}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '50px' }}>
              <div>加载中...</div>
            </div>
          ) : hotelGroups.length > 0 ? (
            <Collapse defaultActiveKey={hotelGroups.map((_, index) => index)}>
              {hotelGroups.map((hotel, hotelIndex) => (
                <Collapse.Panel 
                  key={hotelIndex}
                  header={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 'bold' }}>
                        {hotel.hotelCode} - {hotel.hotelName}
                      </span>
                      <span style={{ fontSize: '12px', color: '#666' }}>
                        ({hotel.hotelManagementModel})
                      </span>
                    </div>
                  }
                >
                  <Table
                    columns={columns as any}
                    dataSource={hotel.subjects}
                    pagination={false}
                    bordered
                    scroll={{ x: 2000, y: 400 }}
                    sticky={{ offsetHeader: 0 }}
                    size="small"
                  />
                </Collapse.Panel>
              ))}
            </Collapse>
          ) : (
            <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
              暂无数据，请点击查询按钮获取数据
            </div>
          )}
        </Card>
        <Modal
          open={modal.visible}
          title="修改预算"
          onCancel={handleCancel}
          footer={null}
          destroyOnClose
        >
          {/* 显示预算项和月份 */}
          {modal.visible && (
            <div style={{ marginBottom: 12, fontWeight: 500, fontSize: 16 }}>
              <span style={{ marginRight: 24 }}>预算项：{(() => {
                for (const hotel of hotelGroups) {
                  const subject = hotel.subjects.find((s: any) => s.key === modal.rowKey);
                  if (subject) return subject.item;
                }
                return '';
              })()}</span>
              <span>月份：{(() => {
                const idx = modal.colKey.startsWith('m') ? Number(modal.colKey.slice(1)) - 1 : -1;
                return idx >= 0 ? months[idx] : '';
              })()}</span>
            </div>
          )}
          <div style={{ marginBottom: 16 }}>
            <InputNumber
              min={0}
              value={editValue}
              style={{ width: '100%' }}
              formatter={v => {
                if (!v) return '';
                const subjectName = (() => {
                  for (const hotel of hotelGroups) {
                    const subject = hotel.subjects.find((s: any) => s.key === modal.rowKey);
                    if (subject) return subject.item;
                  }
                  return '';
                })();
                
                if (isPercentageSubject(subjectName)) {
                  const percentage = Number(v) * 100;
                  // 如果小数点后都是0，则不显示小数部分
                  return percentage % 1 === 0 ? Math.round(percentage) + '%' : percentage.toFixed(1) + '%';
                }
                return Number(v).toLocaleString('en-US');
              }}
              parser={v => {
                if (!v) return 0;
                const subjectName = (() => {
                  for (const hotel of hotelGroups) {
                    const subject = hotel.subjects.find((s: any) => s.key === modal.rowKey);
                    if (subject) return subject.item;
                  }
                  return '';
                })();
                
                const cleanValue = String(v).replace(/,/g, '').replace('%', '');
                const numValue = Number(cleanValue);
                
                if (isPercentageSubject(subjectName)) {
                  return numValue / 100; // 将百分比转换回小数
                }
                return numValue;
              }}
              onChange={v => setEditValue(Number(v))}
            />
          </div>
          <div style={{ maxHeight: 200, overflow: 'auto', marginBottom: 16 }}>
            <Table
              size="small"
              columns={[
                { 
                  title: '预算值', 
                  dataIndex: 'value', 
                  key: 'value', 
                  render: (v: number) => {
                    const subjectName = (() => {
                      for (const hotel of hotelGroups) {
                        const subject = hotel.subjects.find((s: any) => s.key === modal.rowKey);
                        if (subject) return subject.item;
                      }
                      return '';
                    })();
                    
                    return formatValue(v, subjectName);
                  }
                },
                { title: '修改时间', dataIndex: 'time', key: 'time' },
                { title: '修改人', dataIndex: 'user', key: 'user' }
              ]}
              dataSource={logs.map((log, idx) => ({ ...log, key: idx }))}
              pagination={false}
              bordered
            />
          </div>
          <div style={{ textAlign: 'right' }}>
            <Button onClick={handleCancel} style={{ marginRight: 8 }}>取消</Button>
            <Button type="primary" onClick={handleSave}>保存</Button>
          </div>
        </Modal>
      </div>
    </TokenCheck>
  );
};

export default BudgetEntry; 