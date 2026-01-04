import React, { useState, useEffect } from 'react';
import { Form, Select, DatePicker, InputNumber, Button, Row, Col, Collapse, Table, Checkbox, Tabs, Calendar, Badge, Radio, message } from 'antd';
import HotelSelect, { HotelOption } from '../../components/common/HotelSelect';
import RateCodePriceFormula from '../../components/common/RateCodePriceFormula';
import request from '../../utils/request';
import { Space } from 'antd/lib';
import type { RangePickerProps } from 'antd/es/date-picker';
import type { FormInstance } from 'antd/es/form';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import type { TabsProps } from 'antd';
import { CaretRightOutlined, CaretDownOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Panel } = Collapse;
const { TabPane } = Tabs;

interface RoomType {
  id: string;
  code: string;
  name: string;
  selected: boolean;
  rateCodes: RateCode[];
}

interface RateCode {
  id: string;
  code: string;
  name: string;
  bookingType: string;
  cancellationRule: string;
  priceRule: string;
  priceDiscount: string;
  selected: boolean;
}

interface DateRange {
  startDate: dayjs.Dayjs;
  endDate: dayjs.Dayjs;
}

// 初始空数据
const initialRoomTypes: RoomType[] = [];

const weekDays = [
  { label: '周一', value: 1 },
  { label: '周二', value: 2 },
  { label: '周三', value: 3 },
  { label: '周四', value: 4 },
  { label: '周五', value: 5 },
  { label: '周六', value: 6 },
  { label: '周日', value: 0 },
];

const AvailPrice: React.FC = () => {
  const [form] = Form.useForm<FormInstance>();
  const [roomTypes, setRoomTypes] = useState<RoomType[]>(initialRoomTypes);
  const [dateRanges, setDateRanges] = useState<DateRange[]>([
    { startDate: dayjs(), endDate: dayjs() }
  ]);
  const [priceMode, setPriceMode] = useState<'separate' | 'unified'>('separate');
  const [price, setPrice] = useState<number | null>(null);
  const [activePanels, setActivePanels] = useState<string[]>(['1', '2', '3']);
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);
  const [selectedDates, setSelectedDates] = useState<Dayjs[]>([]);
  const [selectedWeeks, setSelectedWeeks] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);
  const [currentMonth, setCurrentMonth] = useState<Dayjs>(dayjs());
  const [loading, setLoading] = useState<boolean>(false);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [selectedHotelId, setSelectedHotelId] = useState<string>('');
  const [selectedHotel, setSelectedHotel] = useState<HotelOption | null>(null);

  // 获取房型和房价码数据
  const fetchRoomTypesAndRateCodes = async (hotelId?: string) => {
    try {
      setLoading(true);
      
      // 如果没有选择酒店，不进行API调用
      if (!hotelId) {
        setRoomTypes([]);
        setExpandedRowKeys([]);
        return;
      }

      // 获取用户信息中的chainId
      const userInfo = localStorage.getItem('user');
      const chainId = userInfo ? JSON.parse(userInfo).chainId : '';
      
      if (!chainId) {
        message.error('未找到chainId，请重新登录');
        return;
      }

      // 构建请求体
      const requestBody = {
        chainId: chainId,
        hotelId: hotelId
      };

      // 在控制台打印请求体JSON格式
      console.log('查询房型API请求体:', JSON.stringify(requestBody, null, 2));

      // 调用API查询酒店下的房型
      const response = await request.post('/api/roomtype/calendar/selectWithRateCodes', requestBody);

      // 打印后端接口返回的JSON格式字符串
      console.log('后端接口返回数据:', JSON.stringify(response.data, null, 2));

      if (response.status === 200 && response.data.success) {
        // 转换API返回的数据格式为组件需要的格式
        const apiRoomTypes = response.data.data || [];
        const convertedRoomTypes: RoomType[] = apiRoomTypes.map((roomType: any) => ({
          id: roomType.roomTypeId,
          code: roomType.roomTypeCode,
          name: roomType.roomTypeName,
          selected: false,
          rateCodes: roomType.rateCodes ? roomType.rateCodes.map((rateCode: any) => ({
            id: rateCode.id,
            code: rateCode.code,
            name: rateCode.name,
            bookingType: rateCode.bookingType || '',
            cancellationRule: rateCode.cancellationRule || '',
            priceRule: rateCode.priceRule || '',
            priceDiscount: rateCode.priceDiscount || '',
            selected: false
          })) : []
        }));
        
        setRoomTypes(convertedRoomTypes);
        // 设置默认展开所有房型
        setExpandedRowKeys(convertedRoomTypes.map(roomType => roomType.id));
      } else {
        message.error(response.data.message || '获取房型信息失败');
        setRoomTypes([]);
      }
    } catch (error: any) {
      console.error('获取房型信息失败:', error);
      message.error('获取房型信息失败，请重试');
      setRoomTypes([]);
    } finally {
      setLoading(false);
    }
  };

  // 处理酒店选择变化
  const handleHotelChange = (hotel: HotelOption | null) => {
    setSelectedHotel(hotel);
    if (hotel) {
      // 当选择酒店时，获取该酒店的房型和房价码数据
      fetchRoomTypesAndRateCodes(hotel.hotelId);
    } else {
      // 当清空酒店选择时，清空房型数据
      setRoomTypes([]);
      setExpandedRowKeys([]);
    }
  };

  // 页面初始化时加载默认酒店的房型数据
  useEffect(() => {
    const defaultHotelId = localStorage.getItem('hotelId');
    if (defaultHotelId) {
      console.log('页面初始化，使用默认酒店ID:', defaultHotelId);
      
      // 设置默认酒店信息
      const defaultHotel: HotelOption = {
        hotelId: defaultHotelId,
        hotelCode: localStorage.getItem('hotelCode') || '',
        hotelName: localStorage.getItem('hotelName') || ''
      };
      setSelectedHotel(defaultHotel);
      setSelectedHotelId(defaultHotelId);
      
      // 获取房型数据
      fetchRoomTypesAndRateCodes(defaultHotelId);
    }
  }, []);

  // Disable dates before today
  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    return current && current < dayjs().startOf('day');
  };

  const handleSubmit = async (values: any) => {
    try {
      setSubmitLoading(true);
      // 获取选中的房型和房价码
      const selectedRoomTypes = roomTypes
        .filter(roomType => roomType.selected)
        .map(roomType => ({
          id: roomType.id,
          code: roomType.code,
          rateCodes: roomType.rateCodes
            .filter(rateCode => rateCode.selected)
            .map(rateCode => ({
              id: rateCode.id,
              code: rateCode.code
            }))
        }))
        .filter(roomType => roomType.rateCodes.length > 0);

      // 检查是否选择了酒店
      if (!selectedHotel) {
        message.error('请先选择酒店');
        return;
      }

      // 检查是否有选中的房型
      if (selectedRoomTypes.length === 0) {
        message.error('请至少选择一个房型和房价码');
        return;
      }

      // 检查分开改价模式下是否至少输入了一个价格
      if (priceMode === 'separate') {
        const channelPrice = values.channelPrice;
        const hotelPrice = values.hotelPrice;
        
        if (!channelPrice && !hotelPrice) {
          message.error('请至少输入渠道价格或酒店价格');
          return;
        }
      }

      // 检查统一加价模式下是否至少输入了一个加价值
      if (priceMode === 'unified') {
        const channelOffset = values.channelOffset;
        const hotelOffset = values.hotelOffset;
        
        if (!channelOffset && !hotelOffset) {
          message.error('请至少输入渠道加价或酒店加价');
          return;
        }
      }

      // 构建日期相关数据
      const dateRangesData = dateRanges.map(range => ({
        startDate: range.startDate.format('YYYY-MM-DD'),
        endDate: range.endDate.format('YYYY-MM-DD')
      }));

      const selectedDatesData = selectedDates.map(date => 
        date.format('YYYY-MM-DD')
      );

      // 构建适用星期字符串 (1111111 表示周一到周日都适用)
      const applicableWeekdays = weekDays
        .map(week => selectedWeeks.includes(week.value) ? '1' : '0')
        .join('');

      // 构建请求体
      const requestBody = {
        chainId: localStorage.getItem('chainId') || "hotelbeds",
        hotelId: selectedHotel?.hotelId || "1b6847a3-a26f-4d7a-9bd6-f74da210c0f5",
        availLevel: "rateplan",
        roomTypes: selectedRoomTypes,
        dateModel: selectedDates.length > 0 ? "calendar" : "multiple",
        dateRanges: dateRangesData,
        applicableWeekdays: applicableWeekdays,
        selectedDates: selectedDatesData,
        priceMode: priceMode,
        separatePrice: priceMode === 'separate' ? {
          hotelPrice: values.hotelPrice,
          channelPrice: values.channelPrice
        } : undefined,
        unifiedPrice: priceMode === 'unified' ? {
          formula: values.formula,
          hotelOffset: values.hotelOffset,
          channelOffset: values.channelOffset
        } : undefined
      };

      // 在控制台打印请求体JSON格式
      console.log('API请求体:', JSON.stringify(requestBody, null, 2));

      // 调用后端API
      const response = await request.post('/api/rateprices/maintain', requestBody);

      // 打印后端接口返回的JSON格式字符串
      console.log('后端接口返回数据:', JSON.stringify(response.data, null, 2));

      if (response.status === 200) {
        message.success('价格设置保存成功');
        console.log('API响应:', response.data);
      } else {
        message.error('保存失败，请重试');
      }
      
    } catch (error: any) {
      console.error('保存失败:', error);
      
      // 打印详细的错误信息
      if (error.response) {
        console.error('错误状态码:', error.response.status);
        console.error('错误响应数据:', error.response.data);
        console.error('错误响应头:', error.response.headers);
        
        // 显示具体的错误信息
        if (error.response.data && error.response.data.message) {
          message.error(`保存失败: ${error.response.data.message}`);
        } else if (error.response.data && error.response.data.error) {
          message.error(`保存失败: ${error.response.data.error}`);
        } else {
          message.error(`保存失败: HTTP ${error.response.status}`);
        }
      } else if (error.request) {
        console.error('请求错误:', error.request);
        message.error('网络请求失败，请检查网络连接');
      } else {
        console.error('其他错误:', error.message);
        message.error('保存失败，请重试');
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  const handlePanelChange = (keys: string[]) => {
    setActivePanels(keys);
  };

  // 处理房型选择
  const handleRoomTypeSelect = (roomTypeId: string, checked: boolean) => {
    setRoomTypes(prev => prev.map(roomType => {
      if (roomType.id === roomTypeId) {
        return {
          ...roomType,
          selected: checked,
          rateCodes: roomType.rateCodes.map(rateCode => ({
            ...rateCode,
            selected: checked
          }))
        };
      }
      return roomType;
    }));
  };

  // 处理房价码选择
  const handleRateCodeSelect = (roomTypeId: string, rateCodeId: string, checked: boolean) => {
    console.log('handleRateCodeSelect called with:', { roomTypeId, rateCodeId, checked });
    setRoomTypes(prev => {
      console.log('Previous roomTypes:', prev);
      const newRoomTypes = prev.map(roomType => {
        if (roomType.id === roomTypeId) {
          console.log('Found matching roomType:', roomType);
          const newRateCodes = roomType.rateCodes.map(rateCode => 
            rateCode.id === rateCodeId ? { ...rateCode, selected: checked } : rateCode
          );
          console.log('Updated rateCodes:', newRateCodes);
          const allRateCodesSelected = newRateCodes.every(rateCode => rateCode.selected);
          return {
            ...roomType,
            selected: allRateCodesSelected,
            rateCodes: newRateCodes
          };
        }
        return roomType;
      });
      console.log('New roomTypes:', newRoomTypes);
      return newRoomTypes;
    });
  };

  // 处理全选
  const handleSelectAll = (checked: boolean) => {
    setRoomTypes(prev => prev.map(roomType => ({
      ...roomType,
      selected: checked,
      rateCodes: roomType.rateCodes.map(rateCode => ({
        ...rateCode,
        selected: checked
      }))
    })));
  };

  // 处理反选
  const handleInvertSelection = () => {
    setRoomTypes(prev => prev.map(roomType => ({
      ...roomType,
      selected: !roomType.selected,
      rateCodes: roomType.rateCodes.map(rateCode => ({
        ...rateCode,
        selected: !rateCode.selected
      }))
    })));
  };

  // 检查是否全部选中
  const isAllSelected = roomTypes.every(roomType => 
    roomType.selected && roomType.rateCodes.every(rateCode => rateCode.selected)
  );

  // 自定义面板标题
  const customPanelHeader = (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center h-8">
        <span>选择房型房价码</span>
        <Space>
          <div onClick={(e) => e.stopPropagation()}>
            <Checkbox
              checked={isAllSelected}
              onChange={(e) => handleSelectAll(e.target.checked)}
            >
              全选
            </Checkbox>
          </div>
          <Button 
            type="link" 
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleInvertSelection();
            }}
          >
            反选
          </Button>
        </Space>
      </div>
    </div>
  );

  const columns = [
    {
      title: '',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: RoomType) => (
        <div className="flex items-center gap-2">
          <div onClick={(e) => e.stopPropagation()}>
            <Checkbox
              checked={record.selected}
              onChange={(e: CheckboxChangeEvent) => handleRoomTypeSelect(record.id, e.target.checked)}
            />
          </div>
          <span className="cursor-pointer">{record.code} {record.name}</span>
        </div>
      ),
    },
  ];

  const rateCodeColumns = [
    {
      title: '',
      dataIndex: 'code',
      key: 'code',
      width: 80,
      render: (_: string, record: RateCode, parentRecord: RoomType) => {
        console.log('Rendering rate code checkbox:', { record, parentRecord });
        return (
          <div onClick={(e) => e.stopPropagation()}>
            <Checkbox
              checked={record.selected}
              onChange={(e: CheckboxChangeEvent) => {
                console.log('Checkbox onChange event:', e.target.checked);
                handleRateCodeSelect(parentRecord.id, record.id, e.target.checked);
              }}
            />
          </div>
        );
      },
    },
    {
      title: '',
      dataIndex: 'code',
      key: 'code',
      width: 80,
    },
    {
      title: '',
      dataIndex: 'name',
      key: 'name',
      width: 100,
    },
    {
      title: '',
      dataIndex: 'bookingType',
      key: 'bookingType',
      width: 80,
    },
    {
      title: '',
      dataIndex: 'cancellationRule',
      key: 'cancellationRule',
      width: 120,
    },
    {
      title: '',
      dataIndex: 'priceRule',
      key: 'priceRule',
      width: 100,
    },
    {
      title: '',
      dataIndex: 'priceDiscount',
      key: 'priceDiscount',
      width: 80,
    },
  ];

  const expandedRowRender = (record: RoomType) => {
    return (
      <div className="pl-8">
        <Table
          columns={rateCodeColumns.map(col => ({
            ...col,
            render: col.render ? (text: string, rateCode: RateCode) => col.render!(text, rateCode, record) : undefined
          }))}
          dataSource={record.rateCodes}
          rowKey="id"
          pagination={false}
          showHeader={false}
          size="small"
        />
      </div>
    );
  };

  const handleDateSelect = (date: Dayjs) => {
    setSelectedDates(prev => {
      const dateStr = date.format('YYYY-MM-DD');
      const exists = prev.some(d => d.format('YYYY-MM-DD') === dateStr);
      if (exists) {
        return prev.filter(d => d.format('YYYY-MM-DD') !== dateStr);
      }
      return [...prev, date];
    });
  };

  const handleWeekSelect = (week: number) => {
    setSelectedWeeks(prev => {
      if (prev.includes(week)) {
        return prev.filter(w => w !== week);
      }
      return [...prev, week];
    });
  };

  const handleMonthChange = (date: Dayjs) => {
    setCurrentMonth(date);
  };

  const dateCellRender = (date: Dayjs) => {
    const isSelected = selectedDates.some(d => d.format('YYYY-MM-DD') === date.format('YYYY-MM-DD'));
    const isWeekSelected = selectedWeeks.includes(date.day());
    
    if (isSelected || isWeekSelected) {
      return (
        <div className="h-full w-full bg-blue-100 rounded-sm" />
      );
    }
    return null;
  };

  const handleAddDateRange = () => {
    setDateRanges(prev => [...prev, { startDate: dayjs(), endDate: dayjs() }]);
  };

  const handleDateRangeChange = (index: number, field: 'startDate' | 'endDate', value: dayjs.Dayjs | null) => {
    if (!value) return;
    setDateRanges(prev => prev.map((range, i) => 
      i === index ? { ...range, [field]: value } : range
    ));
  };

  const handleRemoveDateRange = (index: number) => {
    if (index === 0) return;
    setDateRanges(prev => prev.filter((_, i) => i !== index));
  };

  const customDatePanelHeader = (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center h-8">
        <span>选择日期</span>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      {/* 酒店选择区域 */}
      <div className="mb-6">
        <div className="text-lg font-medium mb-4">选择酒店</div>
        <div className="max-w-md">
          <HotelSelect
            value={selectedHotelId}
            onChange={setSelectedHotelId}
            onHotelChange={handleHotelChange}
            placeholder="请选择酒店"
            required={true}
          />
        </div>
      </div>

      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
      >
        <Collapse
          activeKey={activePanels}
          onChange={handlePanelChange}
          className="mb-4"
          expandIcon={({ isActive }) => (
            isActive ? <CaretDownOutlined /> : <CaretRightOutlined />
          )}
        >
          {/* Panel 1: Room Type and Rate Code Selection */}
          <Panel header={customPanelHeader} key="1">
            <Table
              columns={columns}
              dataSource={roomTypes}
              rowKey="id"
              loading={loading}
              expandable={{
                expandedRowRender,
                expandRowByClick: false,
                expandedRowKeys,
                onExpandedRowsChange: (expandedKeys) => setExpandedRowKeys(expandedKeys as string[]),
              }}
              pagination={false}
            />
          </Panel>

          {/* Panel 2: Date Selection */}
          <Panel header={customDatePanelHeader} key="2">
            <div className="mb-4">
              <Tabs defaultActiveKey="multiple">
                <TabPane tab="多段模式" key="multiple">
                  <div className="flex flex-col gap-4">
                    {dateRanges.map((range, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <RangePicker
                          style={{ width: '100%' }}
                          disabledDate={disabledDate}
                          value={[range.startDate, range.endDate]}
                          onChange={(dates) => {
                            if (dates) {
                              handleDateRangeChange(index, 'startDate', dates[0]);
                              handleDateRangeChange(index, 'endDate', dates[1]);
                            }
                          }}
                        />
                        {index > 0 && (
                          <Button 
                            type="link" 
                            danger
                            onClick={() => handleRemoveDateRange(index)}
                          >
                            删除
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button 
                      type="dashed" 
                      onClick={handleAddDateRange}
                      style={{ width: '100%' }}
                    >
                      + 添加日期段
                    </Button>
                    <div className="flex flex-col gap-2 mt-4">
                      <span className="font-medium">适用星期</span>
                      <div className="flex gap-2">
                        {weekDays.map(week => (
                          <Checkbox
                            key={week.value}
                            checked={selectedWeeks.includes(week.value)}
                            onChange={() => handleWeekSelect(week.value)}
                          >
                            {week.label}
                          </Checkbox>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabPane>
                <TabPane tab="日历模式" key="calendar">
                  <div className="flex flex-col gap-4 h-[250px] overflow-hidden">
                    <div className="grid grid-cols-3 gap-4 h-full">
                      {[0, 1, 2].map((monthOffset) => {
                        const monthDate = dayjs().add(monthOffset, 'month');
                        return (
                          <div key={monthOffset} className="border rounded p-2">
                            <div className="text-center font-medium mb-2">
                              {monthDate.format('YYYY年MM月')}
                            </div>
                            <div className="grid grid-cols-7 gap-1 text-center text-sm">
                              {['日', '一', '二', '三', '四', '五', '六'].map((day) => (
                                <div key={day} className="py-1">{day}</div>
                              ))}
                              {Array.from({ length: monthDate.startOf('month').day() }).map((_, index) => (
                                <div key={`empty-${index}`} className="py-1"></div>
                              ))}
                              {Array.from({ length: monthDate.daysInMonth() }).map((_, index) => {
                                const date = monthDate.date(index + 1);
                                const isSelected = selectedDates.some(d => d.format('YYYY-MM-DD') === date.format('YYYY-MM-DD'));
                                return (
                                  <div
                                    key={index}
                                    className={`py-1 cursor-pointer hover:bg-blue-50 ${
                                      isSelected ? 'bg-blue-100' : ''
                                    }`}
                                    onClick={() => handleDateSelect(date)}
                                  >
                                    {index + 1}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </TabPane>
              </Tabs>
            </div>
          </Panel>

          {/* Panel 3: Price Setting */}
          <Panel header={
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center h-8">
                <span>设置价格</span>
              </div>
            </div>
          } key="3">
            <div className="flex flex-col gap-4">
              <Radio.Group 
                value={priceMode} 
                onChange={(e) => setPriceMode(e.target.value)} 
                className="mb-4"
              >
                <Radio.Button value="separate">分开改价</Radio.Button>
                <Radio.Button value="unified">统一加减价</Radio.Button>
              </Radio.Group>

              <div className="flex flex-col gap-4">
                {/* 分开改价模式 */}
                {priceMode === 'separate' && (
                  <div className="flex flex-col gap-4">
                    <div className="flex gap-4">
                      <Form.Item
                        label="渠道价格"
                        name="channelPrice"
                        rules={[
                          { type: 'number', min: 0, message: '价格必须大于0' }
                        ]}
                        className="flex-1"
                      >
                        <InputNumber
                          style={{ width: '100%' }}
                          placeholder="请输入渠道价格（可选）"
                          min={0}
                          precision={2}
                          addonAfter="元"
                        />
                      </Form.Item>

                      <Form.Item
                        label="酒店价格"
                        name="hotelPrice"
                        rules={[
                          { type: 'number', min: 0, message: '价格必须大于0' }
                        ]}
                        className="flex-1"
                      >
                        <InputNumber
                          style={{ width: '100%' }}
                          placeholder="请输入酒店价格（可选）"
                          min={0}
                          precision={2}
                          addonAfter="元"
                        />
                      </Form.Item>
                    </div>
                  </div>
                )}

                {/* 统一加减价模式 */}
                {priceMode === 'unified' && (
                  <div className="flex flex-col gap-4">
                    <div className="flex gap-4">
                      <Form.Item
                        label="公式"
                        name="formula"
                        rules={[{ required: true, message: '请选择公式' }]}
                        className="flex-1"
                      >
                        <RateCodePriceFormula
                          placeholder="请选择公式"
                        />
                      </Form.Item>
                    </div>
                    <div className="flex gap-4">
                      <Form.Item
                        label="渠道加价"
                        name="channelOffset"
                        rules={[
                          { type: 'number', message: '请输入有效数值' }
                        ]}
                        className="flex-1"
                      >
                        <InputNumber
                          style={{ width: '100%' }}
                          placeholder="请输入渠道加价"
                          precision={2}
                        />
                      </Form.Item>

                      <Form.Item
                        label="酒店加价"
                        name="hotelOffset"
                        rules={[
                          { type: 'number', message: '请输入有效数值' }
                        ]}
                        className="flex-1"
                      >
                        <InputNumber
                          style={{ width: '100%' }}
                          placeholder="请输入酒店加价"
                          precision={2}
                        />
                      </Form.Item>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Panel>
        </Collapse>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Space>
            <Button onClick={() => form.resetFields()}>
              重置
            </Button>
            <Button type="primary" htmlType="submit" loading={submitLoading}>
              保存
            </Button>
          </Space>
        </div>
      </Form>
    </div>
  );
};

export default AvailPrice; 