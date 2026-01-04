import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaSave, FaTimes, FaPlus, FaTrash } from 'react-icons/fa';
import { DatePicker, Row, Col, Button, Input, Select, Card, Table, Tag } from 'antd';
const { RangePicker } = DatePicker;
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import locale from 'antd/es/date-picker/locale/zh_CN';
import Toast from '../../components/Toast';
import { TabContext } from '../../App';
import request from '../../utils/request';
import { message } from 'antd';
import TokenCheck from '@/components/common/TokenCheck';
import RateCodePriceRuleType from '../../components/common/RateCodePriceRuleType';
import RateCodePriceFormula from '../../components/common/RateCodePriceFormula';
import RateCodeParentSelect from '../../components/common/RateCodeParentSelect';
import RateCodeDiscount from '../../components/common/RateCodeDiscount';
import RateCodeDiscountSelect from '../../components/common/RateCodeDiscountSelect';

interface RoomType {
  room_type_id: string;
  room_type_name: string;
  room_type_code: string;
  description?: string;
  standard_price?: number;
  physical_inventory?: number;
  max_occupancy?: number;
  chain_id?: string;
  hotel_id?: string;
}

interface PricePeriod {
  id: string;
  startDate: Date | null;
  endDate: Date | null;
  channelPrice: number;
  hotelPrice: number;
}

interface BasePricePeriod {
  id: string;
  startDate: Date | null;
  endDate: Date | null;
  priceMode: 'direct' | 'formula'; // 价格模式：直接改价 或 公式改价
  channelPrice: number;
  hotelPrice: number;
  formula: string; // 公式：add, subtract, multiply, divide
  channelOffset: number; // 渠道偏移值
  hotelOffset: number; // 酒店偏移值
  weekDays: string; // 周控制：7位字符串，周一到周日，从周一到周日，选中为'1'，未选中为'0'
}

interface RoomTypePrice {
  roomType: RoomType;
  pricePeriods: PricePeriod[];
}

interface RoomTypeBasePrice {
  roomType: RoomType;
  basePricePeriods: BasePricePeriod[];
}

interface ToastMessage {
  message: string;
  type: 'success' | 'error' | 'info';
}

const RateCodePriceSettings: React.FC = () => {
  const navigate = useNavigate();
  const tabContext = useContext(TabContext);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const { rateCodeId } = useParams();
  
  const [roomTypePrices, setRoomTypePrices] = useState<RoomTypePrice[]>([]);
  const [roomTypeBasePrices, setRoomTypeBasePrices] = useState<RoomTypeBasePrice[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [priceRuleType, setPriceRuleType] = useState<string>('0'); // 默认选择一口价
  
  // 折扣价设置状态
  const [parentRateCodeId, setParentRateCodeId] = useState<string>('');
  const [priceDiscount, setPriceDiscount] = useState<string>('1'); // 默认100%
  const [priceFormula, setPriceFormula] = useState<string>('add'); // 价格公式
  const [priceOffset, setPriceOffset] = useState<number>(0); // 价格差价
  const [hotelId, setHotelId] = useState<string>(''); // 用于获取父级房价码

  // 折上折设置状态
  const [parentDiscountRateCodeId, setParentDiscountRateCodeId] = useState<string>('');
  const [discountPriceFormula, setDiscountPriceFormula] = useState<string>('add'); // 折上折价格公式
  const [discountPriceOffset, setDiscountPriceOffset] = useState<number>(0); // 折上折价格差价

  // 获取房型列表
  useEffect(() => {
    const fetchRoomTypes = async () => {
      if (!rateCodeId) return;
      
      setLoading(true);
      try {
        // 从 localStorage 获取 hotelId
        const userStr = localStorage.getItem('user');
        if (userStr) {
          try {
            const user = JSON.parse(userStr);
            if (user.hotelId) {
              setHotelId(user.hotelId);
            }
          } catch (error) {
            console.error('Failed to parse user data from localStorage:', error);
          }
        }

        const res = await request.get(`/api/ratecode/${rateCodeId}/roomtypes`);
        console.log('获取房型列表 - 响应数据:', JSON.stringify(res.data, null, 2));
        
        if (res.data && res.data.data && Array.isArray(res.data.data)) {
          const initialRoomTypePrices = res.data.data.map((roomType: RoomType) => ({
            roomType,
            pricePeriods: [{
              id: `period_${Date.now()}_${Math.random()}`,
              startDate: new Date(),
              endDate: new Date(new Date().getFullYear() + 1, 11, 31),
              channelPrice: 0,
              hotelPrice: 0
            }]
          }));
          setRoomTypePrices(initialRoomTypePrices);

          // 同时初始化基础价数据
          const initialRoomTypeBasePrices = res.data.data.map((roomType: RoomType) => ({
            roomType,
            basePricePeriods: [{
              id: `base_period_${Date.now()}_${Math.random()}`,
              startDate: new Date(),
              endDate: new Date(new Date().getFullYear() + 1, 11, 31),
              priceMode: 'direct' as const, // 默认直接改价模式
              channelPrice: 0,
              hotelPrice: 0,
              formula: 'add', // 默认加价公式
              channelOffset: 0,
              hotelOffset: 0,
              weekDays: '1111111' // 默认全选
            }]
          }));
          setRoomTypeBasePrices(initialRoomTypeBasePrices);
        }
      } catch (error) {
        console.error('获取房型列表失败:', error);
        message.error('获取房型列表失败');
      } finally {
        setLoading(false);
      }
    };

    fetchRoomTypes();
  }, [rateCodeId]);

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
  };

  // 添加价格时段
  const addPricePeriod = (roomTypeIndex: number) => {
    setRoomTypePrices(prev => {
      const newData = [...prev];
      const newPeriod: PricePeriod = {
        id: `period_${Date.now()}_${Math.random()}`,
        startDate: new Date(),
        endDate: new Date(new Date().getFullYear() + 1, 11, 31),
        channelPrice: 0,
        hotelPrice: 0
      };
      newData[roomTypeIndex].pricePeriods.push(newPeriod);
      return newData;
    });
  };

  // 删除价格时段
  const removePricePeriod = (roomTypeIndex: number, periodIndex: number) => {
    setRoomTypePrices(prev => {
      const newData = [...prev];
      newData[roomTypeIndex].pricePeriods.splice(periodIndex, 1);
      return newData;
    });
  };

  // 更新价格时段
  const updatePricePeriod = (
    roomTypeIndex: number, 
    periodIndex: number, 
    field: keyof PricePeriod, 
    value: any
  ) => {
    setRoomTypePrices(prev => {
      const newData = [...prev];
      newData[roomTypeIndex].pricePeriods[periodIndex] = {
        ...newData[roomTypeIndex].pricePeriods[periodIndex],
        [field]: value
      };
      return newData;
    });
  };

  // 添加基础价格时段
  const addBasePricePeriod = (roomTypeIndex: number) => {
    setRoomTypeBasePrices(prev => {
      const newData = [...prev];
      const newPeriod: BasePricePeriod = {
        id: `base_period_${Date.now()}_${Math.random()}`,
        startDate: new Date(),
        endDate: new Date(new Date().getFullYear() + 1, 11, 31),
        priceMode: 'direct' as const, // 默认直接改价模式
        channelPrice: 0,
        hotelPrice: 0,
        formula: 'add', // 默认加价公式
        channelOffset: 0,
        hotelOffset: 0,
        weekDays: '1111111' // 默认全选
      };
      newData[roomTypeIndex].basePricePeriods.push(newPeriod);
      return newData;
    });
  };

  // 删除基础价格时段
  const removeBasePricePeriod = (roomTypeIndex: number, periodIndex: number) => {
    setRoomTypeBasePrices(prev => {
      const newData = [...prev];
      newData[roomTypeIndex].basePricePeriods.splice(periodIndex, 1);
      return newData;
    });
  };

  // 更新基础价格时段
  const updateBasePricePeriod = (
    roomTypeIndex: number, 
    periodIndex: number, 
    field: keyof BasePricePeriod, 
    value: any
  ) => {
    setRoomTypeBasePrices(prev => {
      const newData = [...prev];
      newData[roomTypeIndex].basePricePeriods[periodIndex] = {
        ...newData[roomTypeIndex].basePricePeriods[periodIndex],
        [field]: value
      };
      return newData;
    });
  };

  // 更新周控制
  const updateWeekDays = (roomTypeIndex: number, periodIndex: number, weekDay: number) => {
    setRoomTypeBasePrices(prev => {
      const newData = [...prev];
      const currentPeriod = newData[roomTypeIndex].basePricePeriods[periodIndex];
      const weekIndex = Math.max(0, Math.min(6, weekDay - 1));
      const current = (currentPeriod.weekDays && currentPeriod.weekDays.length === 7)
        ? currentPeriod.weekDays
        : '0000000';
      const chars = current.split('');
      chars[weekIndex] = chars[weekIndex] === '1' ? '0' : '1';
      currentPeriod.weekDays = chars.join('');
      return newData;
    });
  };

  // 保存价格设置
  const handleSave = async () => {
    setSaving(true);
    try {
      let submitData: any = {
        rateCodeId,
        priceRuleType: priceRuleType
      };
      
      // 一口价设置
      submitData.fixedPrice = {
        roomTypePrices: roomTypePrices.map(rtp => ({
          roomTypeId: rtp.roomType.room_type_id,
          pricePeriods: rtp.pricePeriods.map(period => ({
            startDate: period.startDate?.toISOString().split('T')[0],
            endDate: period.endDate?.toISOString().split('T')[0],
            channelPrice: period.channelPrice,
            hotelPrice: period.hotelPrice
          }))
        }))
      };
      
      // 基础价设置
      submitData.basePrice = {
        roomTypeBasePrices: roomTypeBasePrices.map(rtp => ({
          roomTypeId: rtp.roomType.room_type_id,
          basePricePeriods: rtp.basePricePeriods.map(period => ({
            startDate: period.startDate?.toISOString().split('T')[0],
            endDate: period.endDate?.toISOString().split('T')[0],
            priceMode: period.priceMode,
            channelPrice: period.channelPrice,
            hotelPrice: period.hotelPrice,
            formula: period.formula,
            channelOffset: period.channelOffset,
            hotelOffset: period.hotelOffset,
            weekDays: period.weekDays
          }))
        }))
      };
      
      // 折扣价设置
      submitData.discountPrice = {
        parentRateCodeId,
        priceFormula
      };
      
      // 根据价格公式类型添加相应的字段
      if (priceFormula === 'add' || priceFormula === 'subtract') {
        submitData.discountPrice.priceOffset = priceOffset;
      } else if (priceFormula === 'multiply' || priceFormula === 'divide') {
        submitData.discountPrice.priceDiscount = priceDiscount;
      }
      
      // 折上折设置
      submitData.doubleDiscount = {
        parentDiscountRateCodeId,
        discountPriceFormula,
        discountPriceOffset
      };

      console.log('提交价格设置数据:', JSON.stringify(submitData, null, 2));
      const res = await request.post('/api/ratecode/PriceSettingsSave', submitData);
      console.log('保存价格设置 - 响应数据:', JSON.stringify(res.data, null, 2));
      
      showToast(res.data.message || '保存价格设置成功', 'success');
      
      // 延迟关闭tab
      setTimeout(() => {
        if (tabContext && tabContext.removeTab) {
          tabContext.removeTab(`/api/ratecode/price-settings/${rateCodeId}`);
        }
        if (tabContext && tabContext.setActiveTab) {
          tabContext.setActiveTab(`/api/ratecode/edit/${rateCodeId}`);
        }
        navigate(`/api/ratecode/edit/${rateCodeId}`);
      }, 1500);
    } catch (error: any) {
      console.error('保存价格设置失败:', error);
      showToast(error.response?.data?.message || '保存价格设置失败', 'error');
    } finally {
      setSaving(false);
    }
  };

  // 取消操作
  const handleCancel = () => {
    if (tabContext && tabContext.removeTab) {
      tabContext.removeTab(`/api/ratecode/price-settings/${rateCodeId}`);
    }
    if (tabContext && tabContext.setActiveTab) {
      tabContext.setActiveTab(`/api/ratecode/edit/${rateCodeId}`);
    }
    navigate(`/api/ratecode/edit/${rateCodeId}`);
  };

  // 表格列定义
  const columns = [
    {
      title: '房型名称',
      dataIndex: 'roomType',
      key: 'roomType',
      width: 180,
      render: (roomType: RoomType) => (
        <div style={{ padding: '8px 0' }}>
          <div style={{ fontWeight: 500, marginBottom: '4px' }}>{roomType.room_type_name}</div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>{roomType.room_type_code}</div>
        </div>
      )
    },
    {
      title: '价格时段',
      dataIndex: 'pricePeriods',
      key: 'pricePeriods',
      render: (pricePeriods: PricePeriod[], record: RoomTypePrice, roomTypeIndex: number) => (
        <div style={{ padding: '8px 0' }}>
          {pricePeriods.map((period, periodIndex) => (
            <Card 
              key={period.id} 
              size="small" 
              style={{ 
                marginBottom: '12px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
              }}
              bodyStyle={{ padding: '12px' }}
              extra={
                pricePeriods.length > 1 ? (
                  <Button
                    type="text"
                    size="small"
                    danger
                    icon={<FaTrash />}
                    onClick={() => removePricePeriod(roomTypeIndex, periodIndex)}
                  />
                ) : null
              }
            >
              <Row gutter={[12, 12]}>
                <Col span={16}>
                  <div style={{ marginBottom: '8px' }}>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '14px', 
                      fontWeight: 500, 
                      color: '#374151', 
                      marginBottom: '4px' 
                    }}>
                      日期范围
                    </label>
                    <RangePicker
                      value={[
                        period.startDate ? dayjs(period.startDate) : null,
                        period.endDate ? dayjs(period.endDate) : null
                      ]}
                      onChange={(dates) => {
                        if (dates && dates.length === 2) {
                          updatePricePeriod(roomTypeIndex, periodIndex, 'startDate', dates[0]?.toDate() || null);
                          updatePricePeriod(roomTypeIndex, periodIndex, 'endDate', dates[1]?.toDate() || null);
                        } else {
                          updatePricePeriod(roomTypeIndex, periodIndex, 'startDate', null);
                          updatePricePeriod(roomTypeIndex, periodIndex, 'endDate', null);
                        }
                      }}
                      format="YYYY-MM-DD"
                      size="small"
                      style={{ width: '100%' }}
                      placeholder={['开始日期', '结束日期']}
                      locale={locale}
                    />
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ marginBottom: '8px' }}>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '14px', 
                      fontWeight: 500, 
                      color: '#374151', 
                      marginBottom: '4px' 
                    }}>
                      渠道价格
                    </label>
                    <Input
                      type="number"
                      value={period.channelPrice}
                      onChange={(e) => updatePricePeriod(roomTypeIndex, periodIndex, 'channelPrice', parseFloat(e.target.value) || 0)}
                      placeholder="请输入渠道价格"
                      size="small"
                      style={{ width: '100%' }}
                      addonAfter="元"
                    />
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ marginBottom: '8px' }}>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '14px', 
                      fontWeight: 500, 
                      color: '#374151', 
                      marginBottom: '4px' 
                    }}>
                      酒店价格
                    </label>
                    <Input
                      type="number"
                      value={period.hotelPrice}
                      onChange={(e) => updatePricePeriod(roomTypeIndex, periodIndex, 'hotelPrice', parseFloat(e.target.value) || 0)}
                      placeholder="请输入酒店价格"
                      size="small"
                      style={{ width: '100%' }}
                      addonAfter="元"
                    />
                  </div>
                </Col>
              </Row>
            </Card>
          ))}
          <Button
            type="dashed"
            size="small"
            icon={<FaPlus />}
            onClick={() => addPricePeriod(roomTypeIndex)}
            style={{ width: '100%' }}
          >
            添加价格时段
          </Button>
        </div>
      )
    }
  ];

  // 基础价表格列定义
  const basePriceColumns = [
    {
      title: '房型名称',
      dataIndex: 'roomType',
      key: 'roomType',
      width: 180,
      render: (roomType: RoomType) => (
        <div style={{ padding: '8px 0' }}>
          <div style={{ fontWeight: 500, marginBottom: '4px' }}>{roomType.room_type_name}</div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>{roomType.room_type_code}</div>
        </div>
      )
    },
    {
      title: '基础价格时段',
      dataIndex: 'basePricePeriods',
      key: 'basePricePeriods',
      render: (basePricePeriods: BasePricePeriod[], record: RoomTypeBasePrice, roomTypeIndex: number) => (
        <div style={{ padding: '8px 0' }}>
          {basePricePeriods.map((period, periodIndex) => (
            <Card 
              key={period.id} 
              size="small" 
              style={{ 
                marginBottom: '12px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
              }}
              bodyStyle={{ padding: '12px' }}
              extra={
                basePricePeriods.length > 1 ? (
                  <Button
                    type="text"
                    size="small"
                    danger
                    icon={<FaTrash />}
                    onClick={() => removeBasePricePeriod(roomTypeIndex, periodIndex)}
                  />
                ) : null
              }
            >
              <Row gutter={[12, 12]}>
                <Col span={16}>
                  <div style={{ marginBottom: '8px' }}>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '14px', 
                      fontWeight: 500, 
                      color: '#374151', 
                      marginBottom: '4px' 
                    }}>
                      日期范围
                    </label>
                    <RangePicker
                      value={[
                        period.startDate ? dayjs(period.startDate) : null,
                        period.endDate ? dayjs(period.endDate) : null
                      ]}
                      onChange={(dates) => {
                        if (dates && dates.length === 2) {
                          updateBasePricePeriod(roomTypeIndex, periodIndex, 'startDate', dates[0]?.toDate() || null);
                          updateBasePricePeriod(roomTypeIndex, periodIndex, 'endDate', dates[1]?.toDate() || null);
                        } else {
                          updateBasePricePeriod(roomTypeIndex, periodIndex, 'startDate', null);
                          updateBasePricePeriod(roomTypeIndex, periodIndex, 'endDate', null);
                        }
                      }}
                      format="YYYY-MM-DD"
                      size="small"
                      style={{ width: '100%' }}
                      placeholder={['开始日期', '结束日期']}
                      locale={locale}
                    />
                  </div>
                </Col>
                
                <Col span={24}>
                  <div style={{ marginBottom: '8px' }}>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '14px', 
                      fontWeight: 500, 
                      color: '#374151', 
                      marginBottom: '4px' 
                    }}>
                      价格模式
                    </label>
                    <div style={{ display: 'flex', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', minWidth: '80px' }}>
                        <input
                          type="radio"
                          name={`priceMode_${period.id}`}
                          checked={period.priceMode === 'direct'}
                          onChange={() => updateBasePricePeriod(roomTypeIndex, periodIndex, 'priceMode', 'direct')}
                          style={{ margin: 0 }}
                        />
                        <span style={{ fontSize: '14px' }}>直接改价</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', minWidth: '80px' }}>
                        <input
                          type="radio"
                          name={`priceMode_${period.id}`}
                          checked={period.priceMode === 'formula'}
                          onChange={() => updateBasePricePeriod(roomTypeIndex, periodIndex, 'priceMode', 'formula')}
                          style={{ margin: 0 }}
                        />
                        <span style={{ fontSize: '14px' }}>公式改价</span>
                      </label>
                    </div>
                  </div>
                </Col>
                                   {period.priceMode === 'direct' && (
                    <>
                      <Col span={12}>
                        <div style={{ marginBottom: '8px' }}>
                          <label style={{ 
                            display: 'block', 
                            fontSize: '14px', 
                            fontWeight: 500, 
                            color: '#374151', 
                            marginBottom: '4px' 
                          }}>
                            渠道价格
                          </label>
                          <Input
                            type="number"
                            value={period.channelPrice}
                            onChange={(e) => updateBasePricePeriod(roomTypeIndex, periodIndex, 'channelPrice', parseFloat(e.target.value) || 0)}
                            placeholder="请输入渠道价格"
                            size="small"
                            style={{ width: '100%' }}
                            addonAfter="元"
                          />
                        </div>
                      </Col>
                      <Col span={12}>
                        <div style={{ marginBottom: '8px' }}>
                          <label style={{ 
                            display: 'block', 
                            fontSize: '14px', 
                            fontWeight: 500, 
                            color: '#374151', 
                            marginBottom: '4px' 
                          }}>
                            酒店价格
                          </label>
                          <Input
                            type="number"
                            value={period.hotelPrice}
                            onChange={(e) => updateBasePricePeriod(roomTypeIndex, periodIndex, 'hotelPrice', parseFloat(e.target.value) || 0)}
                            placeholder="请输入酒店价格"
                            size="small"
                            style={{ width: '100%' }}
                            addonAfter="元"
                          />
                        </div>
                      </Col>
                    </>
                  )}
                 {period.priceMode === 'formula' && (
                  <>
                    <Col span={6}>
                      <div style={{ marginBottom: '8px' }}>
                        <label style={{ 
                          display: 'block', 
                          fontSize: '14px', 
                          fontWeight: 500, 
                          color: '#374151', 
                          marginBottom: '4px' 
                        }}>
                          公式
                        </label>
                        <RateCodePriceFormula
                          value={period.formula}
                          onChange={(value) => updateBasePricePeriod(roomTypeIndex, periodIndex, 'formula', value)}
                          placeholder="请选择公式"
                          size="small"
                        />
                      </div>
                    </Col>
                    <Col span={6}>
                      <div style={{ marginBottom: '8px' }}>
                        <label style={{ 
                          display: 'block', 
                          fontSize: '14px', 
                          fontWeight: 500, 
                          color: '#374151', 
                          marginBottom: '4px' 
                        }}>
                          渠道价差
                        </label>
                        <Input
                          type="number"
                          value={period.channelOffset}
                          onChange={(e) => updateBasePricePeriod(roomTypeIndex, periodIndex, 'channelOffset', parseFloat(e.target.value) || 0)}
                          placeholder="请输入渠道价差"
                          size="small"
                          style={{ width: '100%' }}
                        />
                      </div>
                    </Col>
                    <Col span={6}>
                      <div style={{ marginBottom: '8px' }}>
                        <label style={{ 
                          display: 'block', 
                          fontSize: '14px', 
                          fontWeight: 500, 
                          color: '#374151', 
                          marginBottom: '4px' 
                        }}>
                          酒店价差
                        </label>
                        <Input
                          type="number"
                          value={period.hotelOffset}
                          onChange={(e) => updateBasePricePeriod(roomTypeIndex, periodIndex, 'hotelOffset', parseFloat(e.target.value) || 0)}
                          placeholder="请输入酒店价差"
                          size="small"
                          style={{ width: '100%' }}
                        />
                      </div>
                    </Col>
                  </>
                )}
                <Col span={24}>
                  <div style={{ marginBottom: '8px' }}>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '14px', 
                      fontWeight: 500, 
                      color: '#374151', 
                      marginBottom: '4px' 
                    }}>
                      周控制
                    </label>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {[
                        { day: 1, label: '周一' },
                        { day: 2, label: '周二' },
                        { day: 3, label: '周三' },
                        { day: 4, label: '周四' },
                        { day: 5, label: '周五' },
                        { day: 6, label: '周六' },
                        { day: 7, label: '周日' }
                      ].map(({ day, label }) => (
                        <Tag
                          key={day}
                          color={period.weekDays && period.weekDays.length === 7 && period.weekDays.charAt(day - 1) === '1' ? 'blue' : 'default'}
                          style={{ 
                            cursor: 'pointer',
                            padding: '2px 6px',
                            margin: '1px',
                            fontSize: '12px'
                          }}
                          onClick={() => updateWeekDays(roomTypeIndex, periodIndex, day)}
                        >
                          {label}
                        </Tag>
                      ))}
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>
          ))}
          <Button
            type="dashed"
            size="small"
            icon={<FaPlus />}
            onClick={() => addBasePricePeriod(roomTypeIndex)}
            style={{ width: '100%' }}
          >
            添加基础价格时段
          </Button>
        </div>
      )
    }
  ];

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

        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="text-gray-500">正在加载房型列表...</div>
              </div>
            ) : (priceRuleType === '0' && roomTypePrices.length === 0) || (priceRuleType === '1' && roomTypeBasePrices.length === 0) ? (
              <div className="text-center py-8">
                <div className="text-gray-500">暂无房型数据</div>
              </div>
            ) : (
              <>
                {/* 价格规则类型选择 */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    价格规则
                  </label>
                  <RateCodePriceRuleType
                    value={priceRuleType}
                    onChange={setPriceRuleType}
                    placeholder="请选择价格规则"
                  />
                </div>

                {/* 条件渲染面板 */}
                {priceRuleType === '0' && (
                  <Card 
                    title="一口价设置" 
                    className="mb-6"
                    size="small"
                  >
                    <Table
                      dataSource={roomTypePrices}
                      columns={columns}
                      rowKey={(record) => record.roomType.room_type_id}
                      pagination={false}
                      size="middle"
                      scroll={{ x: '100%' }}
                    />
                    
                    <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                      <Button
                        type="default"
                        icon={<FaTimes />}
                        onClick={handleCancel}
                      >
                        取消
                      </Button>
                      <Button
                        type="primary"
                        icon={<FaSave />}
                        loading={saving}
                        onClick={handleSave}
                      >
                        保存
                      </Button>
                    </div>
                  </Card>
                )}

                {priceRuleType === '1' && (
                  <Card 
                    title="基础价设置" 
                    className="mb-6"
                    size="small"
                  >
                    <Table
                      dataSource={roomTypeBasePrices}
                      columns={basePriceColumns}
                      rowKey={(record) => record.roomType.room_type_id}
                      pagination={false}
                      size="middle"
                      scroll={{ x: '100%' }}
                    />
                    
                    <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                      <Button
                        type="default"
                        icon={<FaTimes />}
                        onClick={handleCancel}
                      >
                        取消
                      </Button>
                      <Button
                        type="primary"
                        icon={<FaSave />}
                        loading={saving}
                        onClick={handleSave}
                      >
                        保存
                      </Button>
                    </div>
                  </Card>
                )}

                {/* 折扣价设置面板 */}
                {priceRuleType === '2' && (
                  <Card 
                    title="折扣价设置" 
                    className="mb-6"
                    size="small"
                  >
                    <Row gutter={[16, 16]}>
                      <Col span={24}>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            父级房价码 <span className="text-red-500">*</span>
                          </label>
                            <RateCodeParentSelect
                             rateCodeId={rateCodeId}
                             value={parentRateCodeId}
                             onChange={setParentRateCodeId}
                             placeholder="请选择父级房价码"
                             size="middle"
                           />
                        </div>
                      </Col>
                      <Col span={24}>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            价格公式 <span className="text-red-500">*</span>
                          </label>
                          <RateCodePriceFormula
                            value={priceFormula}
                            onChange={setPriceFormula}
                            placeholder="请选择价格公式"
                            size="middle"
                          />
                        </div>
                      </Col>
                      {/* 根据价格公式条件性显示不同的输入框 */}
                      {(priceFormula === 'add' || priceFormula === 'subtract') && (
                        <Col span={24}>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              价格差价 <span className="text-red-500">*</span>
                            </label>
                            <Input
                              type="number"
                              value={priceOffset}
                              onChange={(e) => setPriceOffset(parseFloat(e.target.value) || 0)}
                              placeholder="请输入价格差价"
                              size="middle"
                              style={{ width: '100%' }}
                              addonAfter="元"
                            />
                          </div>
                        </Col>
                      )}
                      
                      {(priceFormula === 'multiply' || priceFormula === 'divide') && (
                        <Col span={24}>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              价格折扣 <span className="text-red-500">*</span>
                            </label>
                            <RateCodeDiscount
                              value={priceDiscount}
                              onChange={setPriceDiscount}
                              placeholder="请选择价格折扣"
                              size="middle"
                            />
                          </div>
                        </Col>
                      )}
                    </Row>

                    <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                      <Button
                        type="default"
                        icon={<FaTimes />}
                        onClick={handleCancel}
                      >
                        取消
                      </Button>
                      <Button
                        type="primary"
                        icon={<FaSave />}
                        loading={saving}
                        onClick={handleSave}
                        disabled={
                          !parentRateCodeId || 
                          !priceFormula || 
                          ((priceFormula === 'add' || priceFormula === 'subtract') && priceOffset === 0) ||
                          ((priceFormula === 'multiply' || priceFormula === 'divide') && !priceDiscount)
                        }
                      >
                        保存
                      </Button>
                    </div>
                  </Card>
                )}

                {/* 折上折设置面板 */}
                {priceRuleType === '3' && (
                  <Card 
                    title="折上折设置" 
                    className="mb-6"
                    size="small"
                  >
                    <Row gutter={[16, 16]}>
                      <Col span={24}>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            父级折扣价 <span className="text-red-500">*</span>
                          </label>
                          <RateCodeDiscountSelect
                            rateCodeId={rateCodeId}
                            value={parentDiscountRateCodeId}
                            onChange={setParentDiscountRateCodeId}
                            placeholder="请选择父级折扣价"
                            size="middle"
                          />
                        </div>
                      </Col>
                      <Col span={24}>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            价格公式 <span className="text-red-500">*</span>
                          </label>
                          <RateCodePriceFormula
                            value={discountPriceFormula}
                            onChange={setDiscountPriceFormula}
                            placeholder="请选择价格公式"
                            size="middle"
                          />
                        </div>
                      </Col>
                      <Col span={24}>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            价格差价 <span className="text-red-500">*</span>
                          </label>
                          <Input
                            type="number"
                            value={discountPriceOffset}
                            onChange={(e) => setDiscountPriceOffset(parseFloat(e.target.value) || 0)}
                            placeholder="请输入价格差价"
                            size="middle"
                            style={{ width: '100%' }}
                            addonAfter="元"
                          />
                        </div>
                      </Col>
                    </Row>

                    <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                      <Button
                        type="default"
                        icon={<FaTimes />}
                        onClick={handleCancel}
                      >
                        取消
                      </Button>
                      <Button
                        type="primary"
                        icon={<FaSave />}
                        loading={saving}
                        onClick={handleSave}
                        disabled={
                          !parentDiscountRateCodeId || 
                          !discountPriceFormula || 
                          discountPriceOffset === 0
                        }
                      >
                        保存
                      </Button>
                    </div>
                  </Card>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </TokenCheck>
  );
};

export default RateCodePriceSettings;
