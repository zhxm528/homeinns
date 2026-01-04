import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaSave, FaTimes, FaDollarSign } from 'react-icons/fa';
import HotelSelect from '../../components/common/HotelSelect';
import ChannelSelect from '../../components/common/ChannelSelect';
import Select from 'react-select';
import { TimePicker, Switch, DatePicker, Row, Col } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import locale from 'antd/es/date-picker/locale/zh_CN';
import Toast from '../../components/Toast';
import { TabContext } from '../../App';
import request from '../../utils/request';
import { message } from 'antd';
import TokenCheck from '@/components/common/TokenCheck';

interface RateCodeForm {
  chain_id: string;
  hotel_id: string;
  hotel_name: string;
  rate_code: string;
  rate_code_name: string;
  description: string;
  market_code: string;
  channel_id: string;
  minlos: number;
  maxlos: number;
  minadv: number;
  maxadv: number;
  valid_from: Date | null;
  valid_to: Date | null;
  limit_start_time: string;
  limit_end_time: string;
  limitAvailWeeks: number[];
  price_modifier: string;
  is_percentage: number;
  reservation_type: string;
  cancellation_type: string;
  latest_cancellation_days: number;
  latest_cancellation_time: string;
  cancellable_after_booking: number;
  order_retention_time: string;
  stay_start_date: Date | null;
  stay_end_date: Date | null;
  booking_start_date: Date | null;
  booking_end_date: Date | null;
  price_rule_type: string;
  parent_rate_code_id: string;
}





interface ToastMessage {
  message: string;
  type: 'success' | 'error' | 'info';
}

const RateCodeEdit: React.FC = () => {
  const navigate = useNavigate();
  const tabContext = useContext(TabContext);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const { rateCodeId } = useParams();
  
  // 添加panel展开/收起状态
  const [panelStates, setPanelStates] = useState({
    basicInfo: true,
    bookingRules: true,
    advancedSettings: true
  });

  const [formData, setFormData] = useState<RateCodeForm>({
    chain_id: '',
    hotel_id: '',
    hotel_name: '',
    rate_code: '',
    rate_code_name: '',
    description: '',
    market_code: '',
    channel_id: '',
    minlos: 0,
    maxlos: 999,
    minadv: 0,
    maxadv: 999,
    valid_from: null,
    valid_to: null,
    limit_start_time: '00:00',
    limit_end_time: '23:59',
    limitAvailWeeks: [1, 2, 3, 4, 5, 6, 7],
    price_modifier: '1',
    is_percentage: 0,
    reservation_type: '预付月结订单，客人已支付全额房费，杂费客人自理。',
    cancellation_type: '最晚订单取消时间为入住当晚18:00之前，逾期需支付首晚房费。',
    latest_cancellation_days: 0,
    latest_cancellation_time: '18:00',
    cancellable_after_booking: 1,
    order_retention_time: '18:00',
    stay_start_date: new Date(),
    stay_end_date: new Date(new Date().getFullYear() + 3, 11, 31),
    booking_start_date: new Date(),
    booking_end_date: new Date(new Date().getFullYear() + 3, 11, 31),
    price_rule_type: '0',
    parent_rate_code_id: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof RateCodeForm, string>>>({});

  // 添加一个函数来转换星期选择为字符串
  const convertWeeksToString = (weeks: number[]): string => {
    const weekString = Array(7).fill('0');
    weeks.forEach(week => {
      if (week >= 1 && week <= 7) {
        weekString[week - 1] = '1';
      }
    });
    return weekString.join('');
  };

  // 添加一个函数来转换字符串为星期数组
  const convertStringToWeeks = (weekString: string): number[] => {
    return weekString.split('').reduce((acc, char, index) => {
      if (char === '1') {
        acc.push(index + 1);
      }
      return acc;
    }, [] as number[]);
  };

  useEffect(() => {
    const fetchRateCodeDetail = async () => {
      try {
        if (rateCodeId) {
          console.log('获取房价码详情 - 请求URL:', `/api/ratecode/edit/${rateCodeId}`);
          const res = await request.get(`/api/ratecode/edit/${rateCodeId}`);
          console.log('获取房价码详情 - 响应数据:', JSON.stringify(res.data, null, 2));
          
          if (res.data) {
            const detail = res.data;
            setFormData({
              chain_id: detail.chainId || '',
              hotel_id: detail.hotelId || '',
              hotel_name: detail.hotelName || '',
              rate_code: detail.rateCode || '',
              rate_code_name: detail.rateCodeName || '',
              description: detail.description || '',
              market_code: detail.marketCode || '',
              channel_id: detail.channelId || '',
              minlos: detail.minlos || 0,
              maxlos: detail.maxlos || 0,
              minadv: detail.minadv || 0,
              maxadv: detail.maxadv || 0,
              valid_from: detail.validFrom ? new Date(detail.validFrom) : null,
              valid_to: detail.validTo ? new Date(detail.validTo) : null,
              limit_start_time: detail.limitStartTime || '00:00',
              limit_end_time: detail.limitEndTime || '00:00',
              limitAvailWeeks: detail.limitAvailWeeks ? convertStringToWeeks(detail.limitAvailWeeks) : [1, 2, 3, 4, 5, 6, 7],
              price_modifier: detail.priceModifier || '1',
              is_percentage: detail.isPercentage || 0,
              reservation_type: detail.reservationType || '',
              cancellation_type: detail.cancellationType || '',
              latest_cancellation_days: detail.latestCancellationDays ? parseInt(detail.latestCancellationDays) : 0,
              latest_cancellation_time: detail.latestCancellationTime || '18:00',
              cancellable_after_booking: detail.cancellableAfterBooking || 0,
              order_retention_time: detail.orderRetentionTime || '18:00',
              stay_start_date: detail.stayStartDate ? new Date(detail.stayStartDate) : null,
              stay_end_date: detail.stayEndDate ? new Date(detail.stayEndDate) : null,
              booking_start_date: detail.bookingStartDate ? new Date(detail.bookingStartDate) : null,
              booking_end_date: detail.bookingEndDate ? new Date(detail.bookingEndDate) : null,
              price_rule_type: detail.priceRuleType || '',
              parent_rate_code_id: detail.parentRateCodeId || '',
            });
          }
        }
      } catch (error) {
        console.error('获取房价码详情失败:', error);
        message.error('获取房价码详情失败');
      }
    };

    fetchRateCodeDetail();
  }, [rateCodeId]);

  const handleInputChange = (field: keyof RateCodeForm, value: any) => {
    console.log('Form field changed:', field, value);
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof RateCodeForm, string>> = {};

    // Required fields validation - 只有基本信息panel中的字段为必填
    const requiredFields: (keyof RateCodeForm)[] = [
      'chain_id', 'hotel_id', 'rate_code_name', 'market_code',
      'stay_start_date', 'stay_end_date', 'booking_start_date', 'booking_end_date', 'description'
    ];

    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = '此字段为必填项';
      }
    });

    // Number validation
    const numberFields = ['minlos', 'maxlos', 'minadv', 'maxadv'];
    numberFields.forEach(field => {
      const value = formData[field as keyof RateCodeForm];
      if (typeof value === 'number' && value < 0) {
        newErrors[field as keyof RateCodeForm] = '不能为负数';
      }
    });



    // Date validation
    if (formData.valid_from && formData.valid_to && formData.valid_from > formData.valid_to) {
      newErrors.valid_to = '结束日期不能早于开始日期';
    }

    if (formData.stay_start_date && formData.stay_end_date && formData.stay_start_date > formData.stay_end_date) {
      newErrors.stay_end_date = '结束日期不能早于开始日期';
    }

    if (formData.booking_start_date && formData.booking_end_date && formData.booking_start_date > formData.booking_end_date) {
      newErrors.booking_end_date = '结束日期不能早于开始日期';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        // 准备提交的数据
        const submitData = {
          ...formData,
          rate_code_id: rateCodeId,
          limitAvailWeeks: convertWeeksToString(formData.limitAvailWeeks)
        };
        
        console.log('提交数据 - 请求体:', JSON.stringify(submitData, null, 2));
        const res = await request.put(`/api/ratecode/update`, submitData);
        console.log('更新房价码 - 响应数据:', JSON.stringify(res.data, null, 2));
        
        // 立即关闭当前tab并导航到列表页面
        if (tabContext && tabContext.removeTab) {
          tabContext.removeTab(`/api/ratecode/edit/${rateCodeId}`);
        }
        if (tabContext && tabContext.setActiveTab) {
          tabContext.setActiveTab('/api/ratecode/list');
        }
        navigate('/api/ratecode/list');
        
        // 显示成功消息
        showToast(res.data.message || '更新房价码成功', 'success');
      } catch (error: any) {
        console.error('操作失败:', error);
        showToast(error.response?.data?.message || '操作失败', 'error');
      }
    }
  };

  const handleCancel = () => {
    if (tabContext && tabContext.removeTab) {
      tabContext.removeTab(`/api/ratecode/edit/${rateCodeId}`);
    }
    if (tabContext && tabContext.setActiveTab) {
      tabContext.setActiveTab('/api/ratecode/list');
    }
    navigate('/api/ratecode/list');
  };

  // 切换panel展开/收起状态
  const togglePanel = (panelName: 'basicInfo' | 'bookingRules' | 'advancedSettings') => {
    setPanelStates(prev => ({
      ...prev,
      [panelName]: !prev[panelName]
    }));
  };

  return (
    <TokenCheck>
      <div className="p-6">
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
       

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow">
          <div className="p-6">
             {/* 基本信息 Panel */}
             <div className="mb-8">
               <div 
                 className="bg-gray-50 px-4 py-3 border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
                 onClick={() => togglePanel('basicInfo')}
               >
                 <div className="flex items-center justify-between">
                   <h3 className="text-lg font-medium text-gray-900">基本信息</h3>
                   <svg 
                     className={`w-5 h-5 text-gray-500 transition-transform ${panelStates.basicInfo ? 'rotate-180' : ''}`}
                     fill="none" 
                     stroke="currentColor" 
                     viewBox="0 0 24 24"
                   >
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                   </svg>
                 </div>
               </div>
               {panelStates.basicInfo && (
                 <div className="p-6">
                   <Row gutter={[16, 16]}>
                     {/* 所属酒店 */}
                     <Col span={24}>
                       <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">
                           所属酒店 <span className="text-red-500">*</span>
                         </label>
                         <div className="w-full px-3 py-2 border rounded-lg bg-gray-50 text-gray-700">
                           {formData.hotel_name || '未设置酒店'}
                         </div>
                       </div>
                     </Col>

                     {/* 房价码代码 */}
                     <Col xs={24} sm={12}>
                       <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">
                           房价码代码 <span className="text-red-500">*</span>
                         </label>
                         <div className="w-full px-3 py-2 border rounded-lg bg-gray-50 text-gray-700">
                           {formData.rate_code || '未设置房价码'}
                         </div>
                       </div>
                     </Col>

                     {/* 房价码名称 */}
                     <Col xs={24} sm={12}>
                       <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">
                           房价码名称 <span className="text-red-500">*</span>
                         </label>
                         <input
                           type="text"
                           className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                           value={formData.rate_code_name}
                           onChange={(e) => handleInputChange('rate_code_name', e.target.value)}
                         />
                         {errors.rate_code_name && (
                           <p className="mt-1 text-sm text-red-600">{errors.rate_code_name}</p>
                         )}
                       </div>
                     </Col>

                     {/* 市场码 */}
                     <Col xs={24} sm={12}>
                       <div>
                                                   <label className="block text-sm font-medium text-gray-700 mb-1">
                            市场码 <span className="text-red-500">*</span>
                          </label>
                         <input
                           type="text"
                           className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                           value={formData.market_code}
                                                       onChange={(e) => handleInputChange('market_code', e.target.value)}
                          />
                          {errors.market_code && (
                            <p className="mt-1 text-sm text-red-600">{errors.market_code}</p>
                          )}
                       </div>
                     </Col>

                     {/* 渠道 */}
                     <Col xs={24} sm={12}>
                       <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">
                           渠道
                         </label>
                         <ChannelSelect
                           value={formData.channel_id}
                           onChange={(value: string) => handleInputChange('channel_id', value)}
                         />
                         {errors.channel_id && (
                           <p className="mt-1 text-sm text-red-600">{errors.channel_id}</p>
                         )}
                       </div>
                                          </Col>

                     {/* 入住有效开始日期和结束日期 */}
                     <Col xs={24} sm={12}>
                       <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">
                           入住有效开始日期 <span className="text-red-500">*</span>
                         </label>
                         <DatePicker
                           value={formData.stay_start_date ? dayjs(formData.stay_start_date) : null}
                           onChange={(date) => handleInputChange('stay_start_date', date?.toDate() || null)}
                           format="YYYY-MM-DD"
                           size="large"
                           style={{ width: '100%' }}
                           placeholder="选择日期"
                           locale={locale}
                         />
                         {errors.stay_start_date && (
                           <p className="mt-1 text-sm text-red-600">{errors.stay_start_date}</p>
                         )}
                       </div>
                     </Col>

                     <Col xs={24} sm={12}>
                       <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">
                           入住有效结束日期 <span className="text-red-500">*</span>
                         </label>
                         <DatePicker
                           value={formData.stay_end_date ? dayjs(formData.stay_end_date) : null}
                           onChange={(date) => handleInputChange('stay_end_date', date?.toDate() || null)}
                           format="YYYY-MM-DD"
                           size="large"
                           style={{ width: '100%' }}
                           placeholder="选择日期"
                           locale={locale}
                         />
                         {errors.stay_end_date && (
                           <p className="mt-1 text-sm text-red-600">{errors.stay_end_date}</p>
                         )}
                       </div>
                     </Col>

                     {/* 预订有效开始日期和结束日期 */}
                     <Col xs={24} sm={12}>
                       <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">
                           预订有效开始日期 <span className="text-red-500">*</span>
                         </label>
                         <DatePicker
                           value={formData.booking_start_date ? dayjs(formData.booking_start_date) : null}
                           onChange={(date) => handleInputChange('booking_start_date', date?.toDate() || null)}
                           format="YYYY-MM-DD"
                           size="large"
                           style={{ width: '100%' }}
                           placeholder="选择日期"
                           locale={locale}
                         />
                         {errors.booking_start_date && (
                           <p className="mt-1 text-sm text-red-600">{errors.booking_start_date}</p>
                         )}
                       </div>
                     </Col>

                     <Col xs={24} sm={12}>
                       <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">
                           预订有效结束日期 <span className="text-red-500">*</span>
                         </label>
                         <DatePicker
                           value={formData.booking_end_date ? dayjs(formData.booking_end_date) : null}
                           onChange={(date) => handleInputChange('booking_end_date', date?.toDate() || null)}
                           format="YYYY-MM-DD"
                           size="large"
                           style={{ width: '100%' }}
                           placeholder="选择日期"
                           locale={locale}
                         />
                         {errors.booking_end_date && (
                           <p className="mt-1 text-sm text-red-600">{errors.booking_end_date}</p>
                         )}
                       </div>
                     </Col>

                     {/* 描述 */}
                     <Col span={24}>
                       <div>
                                                   <label className="block text-sm font-medium text-gray-700 mb-1">
                            描述 <span className="text-red-500">*</span>
                          </label>
                         <textarea
                           className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                           value={formData.description}
                                                       onChange={(e) => handleInputChange('description', e.target.value)}
                            rows={3}
                          />
                          {errors.description && (
                            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                          )}
                       </div>
                     </Col>
                   </Row>
                 </div>
               )}
               </div>

               {/* 政策规则 Panel */}
               <div className="mb-8">
                 <div 
                   className="bg-gray-50 px-4 py-3 border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
                   onClick={() => togglePanel('bookingRules')}
                 >
                   <div className="flex items-center justify-between">
                     <h3 className="text-lg font-medium text-gray-900">政策规则</h3>
                     <svg 
                       className={`w-5 h-5 text-gray-500 transition-transform ${panelStates.bookingRules ? 'rotate-180' : ''}`}
                       fill="none" 
                       stroke="currentColor" 
                       viewBox="0 0 24 24"
                     >
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                     </svg>
                   </div>
                 </div>
                 {panelStates.bookingRules && (
                   <div className="p-6">
                     <Row gutter={[16, 16]}>
                       {/* 预订类型 */}
                       <Col xs={24} sm={12}>
                         <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">
                             预订类型
                           </label>
                           <input
                             type="text"
                             className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                             value={formData.reservation_type}
                             onChange={(e) => handleInputChange('reservation_type', e.target.value)}
                           />
                         </div>
                       </Col>

                       {/* 取消规则 */}
                       <Col xs={24} sm={12}>
                         <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">
                             取消规则
                           </label>
                           <input
                             type="text"
                             className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                             value={formData.cancellation_type}
                             onChange={(e) => handleInputChange('cancellation_type', e.target.value)}
                           />
                         </div>
                       </Col>

                                               {/* 提前几天取消 */}
                        <Col xs={24} sm={12}>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              提前几天取消
                            </label>
                            <Select
                              options={[
                                { value: 0, label: '入住当天' },
                                { value: 1, label: '提前1天' },
                                { value: 2, label: '提前2天' },
                                { value: 3, label: '提前3天' },
                                { value: 4, label: '提前4天' },
                                { value: 5, label: '提前5天' },
                                { value: 6, label: '提前6天' },
                                { value: 7, label: '提前7天' },
                              ]}
                              value={[
                                { value: 0, label: '入住当天' },
                                { value: 1, label: '提前1天' },
                                { value: 2, label: '提前2天' },
                                { value: 3, label: '提前3天' },
                                { value: 4, label: '提前4天' },
                                { value: 5, label: '提前5天' },
                                { value: 6, label: '提前6天' },
                                { value: 7, label: '提前7天' },
                              ].find(option => option.value === formData.latest_cancellation_days)}
                              onChange={(option) => handleInputChange('latest_cancellation_days', option?.value || 0)}
                              placeholder="请选择提前取消天数"
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
                                })
                              }}
                            />
                          </div>
                        </Col>

                      {/* 是否可以取消 */}
                      <Col xs={24} sm={12}>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            可以取消
                          </label>
                          <div className="flex items-center h-full">
                            <Switch
                              checked={formData.cancellable_after_booking === 1}
                              onChange={(checked) => handleInputChange('cancellable_after_booking', checked ? 1 : 0)}
                            />
                          </div>
                        </div>
                      </Col>

                       {/* 入住当天最晚保留时间 */}
                       <Col xs={24} sm={12}>
                         <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">
                             入住当天最晚保留时间
                           </label>
                           <div style={{ width: '100%' }}>
                             <TimePicker
                               value={formData.order_retention_time ? (dayjs(formData.order_retention_time, 'HH:mm') as any) : undefined}
                               onChange={(time) => handleInputChange('order_retention_time', time ? (time as any).format('HH:mm') : '00:00')}
                               format="HH:mm"
                             />
                           </div>
                         </div>
                       </Col>
                         
                       {/* 入住当天最晚取消时间 */}
                       <Col xs={24} sm={12}>
                         <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">
                             入住当天最晚取消时间
                           </label>
                           <div style={{ width: '100%' }}>
                             <TimePicker
                               value={formData.latest_cancellation_time ? (dayjs(formData.latest_cancellation_time, 'HH:mm') as any) : undefined}
                               onChange={(time) => handleInputChange('latest_cancellation_time', time ? (time as any).format('HH:mm') : '00:00')}
                               format="HH:mm"
                             />
                           </div>
                         </div>
                       </Col>
                     </Row>
                   </div>
                 )}
               </div>

               

               {/* 预订限制 Panel */}
          <div className="mb-8">
            <div 
              className="bg-gray-50 px-4 py-3 border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => togglePanel('advancedSettings')}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">预订限制</h3>
                <svg 
                  className={`w-5 h-5 text-gray-500 transition-transform ${panelStates.advancedSettings ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
                              {panelStates.advancedSettings && (
                    <div className="p-6">
                      <Row gutter={[16, 16]}>
                        {/* 最小连住天数和最大连住天数 */}
                        <Col xs={24} sm={12}>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              最小连住天数
                            </label>
                            <input
                              type="number"
                              min="0"
                              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              value={formData.minlos}
                              onChange={(e) => handleInputChange('minlos', parseInt(e.target.value) || 0)}
                            />
                            {errors.minlos && (
                              <p className="mt-1 text-sm text-red-600">{errors.minlos}</p>
                            )}
                          </div>
                        </Col>

                        <Col xs={24} sm={12}>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              最大连住天数
                            </label>
                            <input
                              type="number"
                              min="0"
                              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              value={formData.maxlos}
                              onChange={(e) => handleInputChange('maxlos', parseInt(e.target.value) || 0)}
                            />
                            {errors.maxlos && (
                              <p className="mt-1 text-sm text-red-600">{errors.maxlos}</p>
                            )}
                          </div>
                        </Col>

                        {/* 最小提前预订天数和最大提前预订天数 */}
                        <Col xs={24} sm={12}>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              最小提前预订天数
                            </label>
                            <input
                              type="number"
                              min="0"
                              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              value={formData.minadv}
                              onChange={(e) => handleInputChange('minadv', parseInt(e.target.value) || 0)}
                            />
                            {errors.minadv && (
                              <p className="mt-1 text-sm text-red-600">{errors.minadv}</p>
                            )}
                          </div>
                        </Col>

                        <Col xs={24} sm={12}>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              最大提前预订天数
                            </label>
                            <input
                              type="number"
                              min="0"
                              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              value={formData.maxadv}
                              onChange={(e) => handleInputChange('maxadv', parseInt(e.target.value) || 0)}
                            />
                            {errors.maxadv && (
                              <p className="mt-1 text-sm text-red-600">{errors.maxadv}</p>
                            )}
                          </div>
                        </Col>

                        {/* 限时开始日期和结束日期 */}
                        <Col xs={24} sm={12}>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              限时开始日期
                            </label>
                            <DatePicker
                              value={formData.valid_from ? dayjs(formData.valid_from) : null}
                              onChange={(date) => handleInputChange('valid_from', date?.toDate() || null)}
                              format="YYYY-MM-DD"
                              size="large"
                              style={{ width: '100%' }}
                              placeholder="选择日期"
                              locale={locale}
                            />
                            {errors.valid_from && (
                              <p className="mt-1 text-sm text-red-600">{errors.valid_from}</p>
                            )}
                          </div>
                        </Col>

                        <Col xs={24} sm={12}>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              限时结束日期
                            </label>
                            <DatePicker
                              value={formData.valid_to ? dayjs(formData.valid_to) : null}
                              onChange={(date) => handleInputChange('valid_to', date?.toDate() || null)}
                              format="YYYY-MM-DD"
                              size="large"
                              style={{ width: '100%' }}
                              placeholder="选择日期"
                              locale={locale}
                            />
                            {errors.valid_to && (
                              <p className="mt-1 text-sm text-red-600">{errors.valid_to}</p>
                            )}
                          </div>
                        </Col>

                        {/* 限时当天开始时间和结束时间 */}
                        <Col xs={24} sm={12}>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              限时当天开始时间
                            </label>
                            <div style={{ width: '100%' }}>
                              <TimePicker
                                value={formData.limit_start_time ? (dayjs(formData.limit_start_time, 'HH:mm') as any) : undefined}
                                onChange={(time) => handleInputChange('limit_start_time', time ? (time as any).format('HH:mm') : '00:00')}
                                format="HH:mm"
                              />
                            </div>
                          </div>
                        </Col>

                        <Col xs={24} sm={12}>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              限时当天结束时间
                            </label>
                            <div style={{ width: '100%' }}>
                              <TimePicker
                                value={formData.limit_end_time ? (dayjs(formData.limit_end_time, 'HH:mm') as any) : undefined}
                                onChange={(time) => handleInputChange('limit_end_time', time ? (time as any).format('HH:mm') : '00:00')}
                                format="HH:mm"
                              />
                            </div>
                          </div>
                        </Col>

                        {/* 选择星期 */}
                        <Col span={24}>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              星期控制（入住）
                            </label>
                            <div className="flex flex-wrap gap-2">
                              {[
                                { value: 1, label: '一' },
                                { value: 2, label: '二' },
                                { value: 3, label: '三' },
                                { value: 4, label: '四' },
                                { value: 5, label: '五' },
                                { value: 6, label: '六' },
                                { value: 7, label: '日' },
                              ].map((day) => (
                                <label key={day.value} className="flex items-center">
                                  <input
                                    type="checkbox"
                                    className="mr-1"
                                    checked={formData.limitAvailWeeks.includes(day.value)}
                                    onChange={(e) => {
                                      const newWeeks = e.target.checked
                                        ? [...formData.limitAvailWeeks, day.value].sort((a, b) => a - b)
                                        : formData.limitAvailWeeks.filter((w) => w !== day.value);
                                      handleInputChange('limitAvailWeeks', newWeeks);
                                    }}
                                  />
                                  {day.label}
                                </label>
                              ))}
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </div>
                 )}
           </div>



        <div className="flex justify-between mt-6">
          <div>
            <button
              type="button"
              onClick={() => {
                if (tabContext && tabContext.addTab) {
                  tabContext.addTab({
                    id: `/api/ratecode/price-settings/${rateCodeId}`,
                    title: '房价码价格设置',
                    path: `/api/ratecode/price-settings/${rateCodeId}`
                  });
                }
                navigate(`/api/ratecode/price-settings/${rateCodeId}`);
              }}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center"
            >
              <FaDollarSign className="mr-2" />
              价格设置
            </button>
          </div>
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 flex items-center"
            >
              <FaTimes className="mr-2" />
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center"
            >
              <FaSave className="mr-2" />
              保存
            </button>
          </div>
        </div>
          </div>
        </form>
      </div>
    </TokenCheck>
  );
};

export default RateCodeEdit; 