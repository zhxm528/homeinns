import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaBox, FaBed, FaChevronDown, FaChevronUp, FaAngleDown, FaAngleUp } from 'react-icons/fa';
import ChainSelect from '../../components/common/ChainSelect';
import HotelSelect from '../../components/common/HotelSelect';
import Select from 'react-select';
import request from '../../utils/request';
import { message, Modal, Table, Checkbox, Form, Input, InputNumber, Space, TimePicker, Button, Row, Col } from 'antd';
import { TabContext } from '../../App';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import dayjs from 'dayjs';
import WeekdaySelect from '../../components/common/WeekdaySelect';
import FuturePeriodData from '../../components/common/FuturePeriodDate';
import Toast from '@/components/Toast';
import TokenCheck from '@/components/common/TokenCheck';
import Pagination from '../../components/common/Pagesize';

interface RateCode {
  rateCodeId: string;
  chainId: string;
  hotelId: string;
  hotelName: string;
  rateCode: string;
  rateCodeName: string;
  description: string;
  priceModifier: string | null;
  isPercentage: boolean | null;
  minlos: number | null;
  maxlos: number | null;
  minadv: number | null;
  maxadv: number | null;
  validFrom: string | null;
  validTo: string | null;
  limitStartTime: string | null;
  limitEndTime: string | null;
  stayStartDate: string | null;
  stayEndDate: string | null;
  bookingStartDate: string | null;
  bookingEndDate: string | null;
  reservationType: string;
  cancellationType: string;
  latestCancellationDays: number | null;
  latestCancellationTime: string | null;
  cancellableAfterBooking: boolean;
  orderRetentionTime: string | null;
  marketCode: string | null;
  channelId: string | null;
  status: string | null;
  createdAt: number;
}

interface Package {
  serviceId: string;
  chainId: string;
  hotelId: string;
  rateCodeId: string;
  roomTypeId: string;
  rateCode: string;
  roomType: string;
  serviceCode: string;
  serviceName: string;
  description: string;
  unitPrice: number;
  unitNum: number;
  limitStartTime: string;
  limitEndTime: string;
  availWeeks: string;
  createdAt: string;
}

interface SearchParams {
  hotelId: string;
  rateCode: string;
  rateCodeName: string;
  priceRuleType: string;
  parentRateCodeId: string;
}

interface RoomType {
  roomTypeId: string;
  roomTypeCode: string;
  roomTypeName: string;
  standardPrice: number;
  maxOccupancy: number;
  roomCount: number;
}

interface AdditionalService {
  serviceId: string;
  serviceCode: string;
  serviceName: string;
  serviceType: string;
  price: number;
  description: string;
}


interface PackageFormData {
  serviceId: string;
  chainId: string;
  hotelId: string;
  rateCodeId: string;
  roomTypeId: string;
  rateCode: string;
  roomType: string;
  serviceCode: string;
  serviceName: string;
  description: string;
  unitPrice: number;
  unitNum: number;
  limitStartTime: dayjs.Dayjs;
  limitEndTime: dayjs.Dayjs;
  availWeeks: string;
  createdAt: Date;
}

const priceRuleOptions = [
  { value: '0', label: '一口价' },
  { value: '1', label: '基础价' },
  { value: '2', label: '折扣价' },
  { value: '3', label: '二级折扣价' },
];

const RateCodeList: React.FC = () => {
  const navigate = useNavigate();
  const tabContext = useContext(TabContext);
  const [searchParams, setSearchParams] = useState<SearchParams>(() => {
    // 从localStorage获取hotelId作为默认值
    const defaultHotelId = localStorage.getItem('hotelId') || '';
    return {
      hotelId: defaultHotelId,
      rateCode: '',
      rateCodeName: '',
      priceRuleType: '',
      parentRateCodeId: '',
    };
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [rateCodes, setRateCodes] = useState<RateCode[]>([]);

  // 房型选择相关状态
  const [isRoomTypeModalVisible, setIsRoomTypeModalVisible] = useState(false);
  const [selectedRateCode, setSelectedRateCode] = useState<RateCode | null>(null);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [selectedRoomTypes, setSelectedRoomTypes] = useState<string[]>([]);

  // 套餐选择相关状态
  const [isPackageModalVisible, setIsPackageModalVisible] = useState(false);
  const [packages, setPackages] = useState<Package[]>([]);
  const [selectedPackages, setSelectedPackages] = useState<string[]>([]);

  const [form] = Form.useForm();
  const [isAddingPackage, setIsAddingPackage] = useState(false);
  const [isSearchPanelExpanded, setIsSearchPanelExpanded] = useState(true);

  const fetchRateCodes = async () => {
    try {
      setLoading(true);
      const userInfo = JSON.parse(localStorage.getItem('user') || '{}');
      
      const requestBody = {
        hotelId: searchParams.hotelId || null,
        rateCode: searchParams.rateCode || null,
        rateCodeName: searchParams.rateCodeName || null,
        priceRuleType: searchParams.priceRuleType || null,
        parentRateCodeId: searchParams.parentRateCodeId || null,
        pagination: {
          current: currentPage,
          pageSize: pageSize
        }
      };

      const response = await request.post('/api/ratecode/list', requestBody);

      // 修改这里以匹配您的后端响应格式
      if (response.data.code === 200) {
        setRateCodes(response.data.data.list || []);
        setTotal(response.data.data.pagination?.total || 0);
        setCurrentPage(response.data.data.pagination?.current || 1);
        setPageSize(response.data.data.pagination?.pageSize || 10);
      } else {
        message.error(response.data.message || '获取房价码列表失败');
        setRateCodes([]);
        setTotal(0);
      }
    } catch (error) {
      message.error('获取房价码列表失败');
      setRateCodes([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRateCodes();
  }, [currentPage, pageSize]);

  const handleInputChange = (field: keyof SearchParams, value: string) => {
    setSearchParams(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchRateCodes();
  };

  const handleAdd = () => {
    navigate('/api/ratecode/add', { state: { title: '添加房价码' } });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // 重新加载数据
    fetchRateCodes();
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // 重置到第一页
    // 重新加载数据
    fetchRateCodes();
  };

  const handleEdit = async (rateCodeId: string) => {
    try {
      // 直接跳转到编辑页面，让编辑页面自己获取数据
      if (tabContext && tabContext.addTab) {
        tabContext.addTab({
          id: `/api/ratecode/edit/${rateCodeId}`,
          title: '编辑房价码',
          path: `/api/ratecode/edit/${rateCodeId}`,
        });
      } else {
        navigate(`/api/ratecode/edit/${rateCodeId}`);
      }
    } catch (error: any) {
      message.error('跳转到编辑页面失败');
    }
  };

  // 获取房型列表
  const fetchRoomTypes = async (hotelId: string, ratecodeId: string) => {
    try {
      setLoading(true);
      const userInfo = JSON.parse(localStorage.getItem('user') || '{}');
      const chainId = localStorage.getItem('chainId');
      const defaultHotelId = localStorage.getItem('hotelId');
      
      const requestBody = {
        chainId: chainId,
        hotelId: defaultHotelId,
        ratecodeId: ratecodeId
      };

      const response = await request.post('/api/rateplan/bind/list', requestBody);
      
      if (response.data.success) {
        const roomTypesData = response.data.data || [];
        setRoomTypes(roomTypesData);
        
        // 根据API返回的selected字段设置已选中的房型ID列表
        const selectedRoomTypeIds = roomTypesData
          .filter((roomType: any) => roomType.selected === true)
          .map((roomType: any) => roomType.roomTypeId);
        setSelectedRoomTypes(selectedRoomTypeIds);
      } else {
        message.error(response.data.message || '获取房型列表失败');
      }
    } catch (error) {
      message.error('获取房型列表失败');
    } finally {
      setLoading(false);
    }
  };



  // 处理选择房型按钮点击
  const handleSelectRoomType = async (rateCode: RateCode) => {
    setSelectedRateCode(rateCode);
    setIsRoomTypeModalVisible(true);
    setLoading(true);
    
    try {
      // 只调用一个接口获取房型列表，传入当前行的ratecodeId
      await fetchRoomTypes(rateCode.hotelId, rateCode.rateCodeId);
    } catch (error) {
      message.error('加载房型数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 处理房型选择
  const handleRoomTypeSelect = (roomTypeId: string, checked: boolean) => {
    setSelectedRoomTypes(prev => 
      checked 
        ? [...prev, roomTypeId]
        : prev.filter(id => id !== roomTypeId)
    );
  };

  // 处理全选
  const handleSelectAll = (e: CheckboxChangeEvent) => {
    if (e.target.checked) {
      setSelectedRoomTypes(roomTypes.map(room => room.roomTypeId));
    } else {
      setSelectedRoomTypes([]);
    }
  };

  // 处理确认选择
  const handleConfirmRoomTypeSelection = async () => {
    if (!selectedRateCode) return;

    try {
      const chainId = localStorage.getItem('chainId');
      const hotelId = localStorage.getItem('hotelId');
      const userInfo = JSON.parse(localStorage.getItem('user') || '{}');

      // 获取选中的房型信息
      const selectedRoomTypeInfo = roomTypes.filter(room => 
        selectedRoomTypes.includes(room.roomTypeId)
      );

      const requestBody = {
        chainId: chainId,
        hotelId: hotelId,
        ratecodeId: selectedRateCode.rateCodeId,
        ratecode: selectedRateCode.rateCode,
        roomtypeId: selectedRoomTypes,
        roomtypecode: selectedRoomTypeInfo.map(room => room.roomTypeCode),
        user: {
          userId: userInfo.userId,
          loginName: userInfo.loginName,
          userName: userInfo.userName,
          roleId: userInfo.roleId,
          roleName: userInfo.roleName,
          chainId: userInfo.chainId,
          chainName: userInfo.chainName
        }
      };

      const response = await request.post('/api/rateplan/bind', requestBody);

      if (response.data.success) {
        message.success('房型关联成功');
        setIsRoomTypeModalVisible(false);
        setSelectedRoomTypes([]);
        fetchRateCodes(); // 刷新列表
      } else {
        message.error(response.data.message || '房型关联失败');
      }
    } catch (error) {
      message.error('房型关联失败');
    }
  };

  // 房型表格列定义
  const roomTypeColumns = [
    {
      title: '选择',
      dataIndex: 'roomTypeId',
      key: 'select',
      width: 60,
      render: (roomTypeId: string) => (
        <Checkbox
          checked={selectedRoomTypes.includes(roomTypeId)}
          onChange={(e) => handleRoomTypeSelect(roomTypeId, e.target.checked)}
        />
      )
    },
    {
      title: '房型代码',
      dataIndex: 'roomTypeCode',
      key: 'roomTypeCode',
    },
    {
      title: '房型名称',
      dataIndex: 'roomTypeName',
      key: 'roomTypeName',
    }
  ];

  // 获取套餐列表
  const fetchPackages = async (hotelId: string) => {
    try {
      setLoading(true);
      const userInfo = JSON.parse(localStorage.getItem('user') || '{}');
      const chainId = localStorage.getItem('chainId');
      
      const requestBody = {
        chainId: chainId,
        hotelId: hotelId,
        rateCodeId: selectedRateCode?.rateCodeId,
        user: {
          userId: userInfo.userId,
          loginName: userInfo.loginName,
          userName: userInfo.userName,
          roleId: userInfo.roleId,
          roleName: userInfo.roleName,
          chainId: userInfo.chainId,
          chainName: userInfo.chainName
        }
      };

      const response = await request.post('/api/additionalservice/select/list', requestBody);
      
      if (response.data.success) {
        setPackages(response.data.data || []);
      } else {
        message.error(response.data.message || '获取套餐列表失败');
      }
    } catch (error) {
      message.error('获取套餐列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 获取已绑定的套餐列表
  const fetchBoundPackages = async (rateCodeId: string) => {
    try {
      const chainId = localStorage.getItem('chainId');
      const hotelId = localStorage.getItem('hotelId');
      const userInfo = JSON.parse(localStorage.getItem('user') || '{}');

      const requestBody = {
        chainId: chainId,
        hotelId: hotelId,
        ratecodeId: rateCodeId,
        user: {
          userId: userInfo.userId,
          loginName: userInfo.loginName,
          userName: userInfo.userName,
          roleId: userInfo.roleId,
          roleName: userInfo.roleName,
          chainId: userInfo.chainId,
          chainName: userInfo.chainName
        }
      };

      const response = await request.post('/api/rateplan/package/bind/list', requestBody);
      
      if (response.data.success) {
        // 设置已选中的套餐ID列表
        const boundPackageIds = response.data.data.map((item: any) => item.serviceId);
        setSelectedPackages(boundPackageIds);
      } else {
        message.error(response.data.message || '获取已绑定套餐失败');
      }
    } catch (error) {
      message.error('获取已绑定套餐失败');
    }
  };

  // 处理添加套餐按钮点击
  const handleSelectPackage = async (rateCode: RateCode) => {
    setSelectedRateCode(rateCode);
    setIsPackageModalVisible(true);
    setLoading(true);
    
    try {
      // 并行获取套餐列表和已绑定的套餐
      await Promise.all([
        fetchPackages(rateCode.hotelId),
        fetchBoundPackages(rateCode.rateCodeId)
      ]);
    } catch (error) {
      message.error('加载套餐数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 处理套餐选择
  const handlePackageSelect = (packageId: string, checked: boolean) => {
    setSelectedPackages(prev => 
      checked 
        ? [...prev, packageId]
        : prev.filter(id => id !== packageId)
    );
  };

  // 处理套餐全选
  const handleSelectAllPackages = (e: CheckboxChangeEvent) => {
    if (e.target.checked) {
      setSelectedPackages(packages.map(pkg => pkg.serviceId));
    } else {
      setSelectedPackages([]);
    }
  };

  // 处理确认添加套餐
  const handleConfirmPackageSelection = async () => {
    if (!selectedRateCode) return;

    try {
      const chainId = localStorage.getItem('chainId');
      const hotelId = localStorage.getItem('hotelId');
      const userInfo = JSON.parse(localStorage.getItem('user') || '{}');

      // 获取选中的套餐信息
      const selectedPackageInfo = packages.filter(pkg => 
        selectedPackages.includes(pkg.serviceId)
      );

      const requestBody = {
        chainId: chainId,
        hotelId: hotelId,
        ratecodeId: selectedRateCode.rateCodeId,
        ratecode: selectedRateCode.rateCode,
        serviceId: selectedPackages,
        serviceCode: selectedPackageInfo.map(pkg => pkg.serviceCode),
        user: {
          userId: userInfo.userId,
          loginName: userInfo.loginName,
          userName: userInfo.userName,
          roleId: userInfo.roleId,
          roleName: userInfo.roleName,
          chainId: userInfo.chainId,
          chainName: userInfo.chainName
        }
      };

      const response = await request.post('/api/rateplan/package/bind', requestBody);

      if (response.data.success) {
        message.success('套餐关联成功');
        setIsPackageModalVisible(false);
        setSelectedPackages([]);
        fetchRateCodes(); // 刷新列表
      } else {
        message.error(response.data.message || '套餐关联失败');
      }
    } catch (error) {
      message.error('套餐关联失败');
    }
  };

  // 处理删除套餐
  const handleDeletePackage = async (serviceId: string) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('user') || '{}');
      const chainId = localStorage.getItem('chainId');
      const hotelId = localStorage.getItem('hotelId');

      const requestBody = {
        chainId: chainId,
        hotelId: hotelId,
        user: {
          userId: userInfo.userId,
          loginName: userInfo.loginName,
          userName: userInfo.userName,
          roleId: userInfo.roleId,
          roleName: userInfo.roleName,
          chainId: userInfo.chainId,
          chainName: userInfo.chainName
        }
      };

      const response = await request.delete(`/api/additionalservice/${serviceId}`, { data: requestBody });

      if (response.data.success) {
        message.success('删除套餐成功');
        // 刷新套餐列表
        if (selectedRateCode) {
          fetchPackages(selectedRateCode.hotelId);
        }
      } else {
        message.error(response.data.message || '删除套餐失败');
      }
    } catch (error) {
      message.error('删除套餐失败');
    }
  };

  // 套餐表格列定义
  const packageColumns = [
    {
      title: '套餐代码',
      dataIndex: 'serviceCode',
      key: 'serviceCode',
      width: 120,
    },
    {
      title: '套餐名称',
      dataIndex: 'serviceName',
      key: 'serviceName',
      width: 150,
    },
    {
      title: '价格',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      width: 100,
      render: (price: number) => `¥${price.toFixed(2)}`
    },
    {
      title: '数量',
      dataIndex: 'unitNum',
      key: 'unitNum',
      width: 80,
      render: (quantity: number) => `${quantity}份`
    },
    {
      title: '时间范围',
      key: 'timeRange',
      width: 200,
      render: (record: Package) => (
        <span>
          {record.limitStartTime} - {record.limitEndTime}
        </span>
      )
    },
    {
      title: '星期限制',
      dataIndex: 'availWeeks',
      key: 'availWeeks',
      width: 200,
      render: (weeks: string) => {
        const weekMap = {
          0: '日',
          1: '一',
          2: '二',
          3: '三',
          4: '四',
          5: '五',
          6: '六'
        };
        return weeks.split('').map((day, index) => 
          day === '1' ? weekMap[index as keyof typeof weekMap] : null
        ).filter(Boolean).join('、');
      }
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      render: (record: Package) => (
        <button
          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded border border-red-200 hover:border-red-400 transition-colors duration-200"
          onClick={() => {
            Modal.confirm({
              title: '确认删除',
              content: `确定要删除套餐"${record.serviceName}"吗？`,
              okText: '确认',
              cancelText: '取消',
              onOk: () => handleDeletePackage(record.serviceId)
            });
          }}
          title="删除"
        >
          <FaTrash />
        </button>
      )
    }
  ];

  // 处理添加套餐
  const handleAddPackage = async (values: PackageFormData) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('user') || '{}');
      const chainId = localStorage.getItem('chainId');
      const hotelId = localStorage.getItem('hotelId');

      const requestBody = {
        serviceId: values.serviceId,
        chainId: chainId,
        hotelId: hotelId,
        rateCodeId: selectedRateCode?.rateCodeId,
        rateCode: selectedRateCode?.rateCode,
        roomTypeId: values.roomTypeId,
        roomType: values.roomType,
        serviceCode: values.serviceCode,
        serviceName: values.serviceName,
        description: values.description,
        unitPrice: values.unitPrice,
        unitNum: values.unitNum,
        limitStartTime: values.limitStartTime.format('HH:mm'),
        limitEndTime: values.limitEndTime.format('HH:mm'),
        availWeeks: values.availWeeks,
        createdAt: new Date(),
        user: {
          userId: userInfo.userId,
          loginName: userInfo.loginName,
          userName: userInfo.userName,
          roleId: userInfo.roleId,
          roleName: userInfo.roleName,
          chainId: userInfo.chainId,
          chainName: userInfo.chainName
        }
      };

      const response = await request.post('/api/additionalservice/ratecode/bind', requestBody);

      if (response.data.success) {
        message.success('添加套餐成功');
        form.resetFields();
        // 刷新套餐列表
        if (selectedRateCode) {
          fetchPackages(selectedRateCode.hotelId);
        }
      } else {
        message.error(response.data.message || '添加套餐失败');
      }
    } catch (error) {
      message.error('添加套餐失败');
    }
  };

  return (
    <TokenCheck>
    <div className="p-6">
      

      {/* Search Panel */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div 
          className="p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
          onClick={() => setIsSearchPanelExpanded(!isSearchPanelExpanded)}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">查询条件</h2>
            <div className="flex items-center text-gray-500">
              {isSearchPanelExpanded ? (
                <FaAngleUp className="text-sm" />
              ) : (
                <FaAngleDown className="text-sm" />
              )}
            </div>
          </div>
        </div>
        {isSearchPanelExpanded && (
          <form onSubmit={handleSearch} className="p-6">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} lg={6}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">所属酒店</label>
                  <HotelSelect
                    value={searchParams.hotelId}
                    onChange={(value: string) => handleInputChange('hotelId', value)}
                  />
                </div>
              </Col>

              <Col xs={24} sm={12} lg={6}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">房价码代码</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchParams.rateCode}
                    onChange={(e) => handleInputChange('rateCode', e.target.value)}
                  />
                </div>
              </Col>

              <Col xs={24} sm={12} lg={6}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">房价码名称</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchParams.rateCodeName}
                    onChange={(e) => handleInputChange('rateCodeName', e.target.value)}
                  />
                </div>
              </Col>

              <Col xs={24} sm={12} lg={6}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">价格规则</label>
                                     <Select
                     options={priceRuleOptions}
                     value={priceRuleOptions.find(option => option.value === searchParams.priceRuleType)}
                     onChange={(option) => handleInputChange('priceRuleType', option?.value || '')}
                     isClearable
                     placeholder="请选择价格规则"
                     className="react-select-container"
                     classNamePrefix="react-select"
                     styles={{
                       control: (base) => ({
                         ...base,
                         minHeight: '42px',
                         height: '42px',
                         padding: '0 8px',
                         border: '1px solid #e2e8f0',
                         borderRadius: '0.5rem',
                         '&:hover': {
                           borderColor: '#e2e8f0'
                         }
                       }),
                       menu: (base) => ({
                         ...base,
                         zIndex: 9999
                       }),
                       menuPortal: (base) => ({
                         ...base,
                         zIndex: 9999
                       })
                     }}
                   />
                </div>
              </Col>
            </Row>

          <div className="flex justify-end mt-4 space-x-3">
            <button
              type="button"
              onClick={() => {
                // 重置时保持hotelId的默认值
                const defaultHotelId = localStorage.getItem('hotelId') || '';
                setSearchParams({
                  hotelId: defaultHotelId,
                  rateCode: '',
                  rateCodeName: '',
                  priceRuleType: '',
                  parentRateCodeId: '',
                });
              }}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
            >
              重置
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center"
            >
              <FaSearch className="mr-2" />
              查询
            </button>
            <button
              type="button"
              onClick={handleAdd}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center"
            >
              <FaPlus className="mr-2" />
              添加房价码
            </button>
          </div>
        </form>
        )}
      </div>

      {/* Rate Code List Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto max-h-[690px] overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">所属酒店</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">房价码代码</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">房价码名称</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">房价码描述</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">价格折扣</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">操作</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rateCodes.map((rateCode) => (
                <tr key={rateCode.rateCodeId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{rateCode.hotelName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{rateCode.rateCode}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{rateCode.rateCodeName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{rateCode.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {rateCode.priceModifier ? `${rateCode.priceModifier}${rateCode.isPercentage ? '%' : ''}` : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => handleEdit(rateCode.rateCodeId)}
                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded border border-blue-200 hover:border-blue-400 transition-colors duration-200"
                        title="编辑"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded border border-green-200 hover:border-green-400 transition-colors duration-200"
                        onClick={() => handleSelectPackage(rateCode)}
                        title="选择打包套餐"
                      >
                        <FaBox />
                      </button>
                      <button
                        className="p-2 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded border border-purple-200 hover:border-purple-400 transition-colors duration-200"
                        onClick={() => handleSelectRoomType(rateCode)}
                        title="选择房型"
                      >
                        <FaBed />
                      </button>
                      <button
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded border border-red-200 hover:border-red-400 transition-colors duration-200"
                        onClick={() => {/* TODO: Implement delete */}}
                        title="删除"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          current={currentPage}
          total={total}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          showSizeChanger={true}
          showTotal={true}
          pageSizeOptions={[10, 50, 100, 200]}
          className="mt-4 rounded-lg shadow"
        />
      </div>

        {/* 房型选择弹窗 */}
        <Modal
          title="选择房型"
          open={isRoomTypeModalVisible}
          onOk={handleConfirmRoomTypeSelection}
          onCancel={() => {
            setIsRoomTypeModalVisible(false);
            setSelectedRoomTypes([]);
          }}
          width={1000}
          okText="确认"
          cancelText="取消"
        >
          <div className="mb-4">
            <Checkbox
              onChange={handleSelectAll}
              checked={selectedRoomTypes.length === roomTypes.length && roomTypes.length > 0}
              indeterminate={selectedRoomTypes.length > 0 && selectedRoomTypes.length < roomTypes.length}
            >
              全选
            </Checkbox>
          </div>
          <Table
            columns={roomTypeColumns}
            dataSource={roomTypes}
            rowKey="roomTypeId"
            loading={loading}
            pagination={false}
            scroll={{ y: 400 }}
          />
        </Modal>

        {/* 套餐选择弹窗 */}
        <Modal
          title="添加套餐"
          open={isPackageModalVisible}
          onCancel={() => {
            setIsPackageModalVisible(false);
            setSelectedPackages([]);
            form.resetFields();
          }}
          width={1000}
          footer={null}
        >
          {/* 添加房价码信息显示 */}
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-gray-600">房价码：</span>
                <span className="font-medium">{selectedRateCode?.rateCode}</span>
              </div>
              <div>
                <span className="text-gray-600">房价码名称：</span>
                <span className="font-medium">{selectedRateCode?.rateCodeName}</span>
              </div>
            </div>
          </div>

          <Table
            columns={packageColumns}
            dataSource={packages}
            rowKey="serviceId"
            loading={loading}
            pagination={false}
            scroll={{ y: 400 }}
          />
          
          <div className="mt-4 border-t pt-4">
            <h3 className="text-lg font-medium mb-4">添加新套餐</h3>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleAddPackage}
              className="grid grid-cols-2 gap-4"
            >
              <Form.Item
                name="serviceCode"
                label="套餐代码"
                rules={[{ required: true, message: '请输入套餐代码' }]}
              >
                <Input placeholder="请输入套餐代码" />
              </Form.Item>

              <Form.Item
                name="serviceName"
                label="套餐名称"
                rules={[{ required: true, message: '请输入套餐名称' }]}
              >
                <Input placeholder="请输入套餐名称" />
              </Form.Item>

              <Form.Item
                name="description"
                label="描述"
                rules={[{ required: true, message: '请输入描述' }]}
                className="col-span-2"
              >
                <Input.TextArea 
                  placeholder="请输入套餐描述" 
                  rows={3}
                  maxLength={200}
                  showCount
                />
              </Form.Item>

              <Form.Item
                name="unitPrice"
                label="价格"
                rules={[{ required: true, message: '请输入价格' }]}
              >
                <InputNumber
                  min={0}
                  precision={2}
                  style={{ width: '100%' }}
                  placeholder="请输入价格"
                  prefix="¥"
                />
              </Form.Item>

              <Form.Item
                name="unitNum"
                label="数量"
                rules={[{ required: true, message: '请输入数量' }]}
              >
                <InputNumber
                  min={1}
                  style={{ width: '100%' }}
                  placeholder="请输入数量"
                />
              </Form.Item>

              <Form.Item
                label="时间范围"
                required
                rules={[{ required: true, message: '请选择时间范围' }]}
              >
                <Space>
                  <Form.Item
                    name="limitStartTime"
                    noStyle
                    rules={[
                      { required: true, message: '请选择开始时间' },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || !getFieldValue('limitEndTime')) {
                            return Promise.resolve();
                          }
                          if (value.isAfter(getFieldValue('limitEndTime'))) {
                            return Promise.reject(new Error('开始时间必须小于结束时间'));
                          }
                          return Promise.resolve();
                        },
                      }),
                    ]}
                  >
                    <TimePicker
                      format="HH:mm"
                      placeholder="开始时间"
                      style={{ width: 120 }}
                    />
                  </Form.Item>
                  <span>-</span>
                  <Form.Item
                    name="limitEndTime"
                    noStyle
                    rules={[
                      { required: true, message: '请选择结束时间' },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || !getFieldValue('limitStartTime')) {
                            return Promise.resolve();
                          }
                          if (value.isBefore(getFieldValue('limitStartTime'))) {
                            return Promise.reject(new Error('结束时间必须大于开始时间'));
                          }
                          return Promise.resolve();
                        },
                      }),
                    ]}
                  >
                    <TimePicker
                      format="HH:mm"
                      placeholder="结束时间"
                      style={{ width: 120 }}
                    />
                  </Form.Item>
                </Space>
              </Form.Item>

              <Form.Item
                name="availWeeks"
                label="星期限制"
                rules={[{ required: true, message: '请选择星期限制' }]}
              >
                <WeekdaySelect
                  value={form.getFieldValue('availWeeks') || '1111111'}
                  onChange={(value) => form.setFieldsValue({ availWeeks: value })}
                />
              </Form.Item>

              <div className="col-span-2 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => form.resetFields()}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                >
                  重置
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsPackageModalVisible(false);
                    setSelectedPackages([]);
                    form.resetFields();
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  添加套餐
                </button>
              </div>
            </Form>
          </div>
        </Modal>
    </div>
    </TokenCheck>
  );
};

export default RateCodeList; 