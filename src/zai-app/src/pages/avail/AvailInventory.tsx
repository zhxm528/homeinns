import React, { useState } from 'react';
import { Form, Select, DatePicker, InputNumber, Button, Row, Col, Collapse, Table, Checkbox, Tabs, Calendar, Badge, Radio, message } from 'antd';
import { Space } from 'antd/lib';
import type { RangePickerProps } from 'antd/es/date-picker';
import type { FormInstance } from 'antd/es/form';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import type { TabsProps } from 'antd';
import { CaretRightOutlined, CaretDownOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import HotelSelect from '../../components/common/HotelSelect';
import request from '../../utils/request';

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
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [dateRanges, setDateRanges] = useState<DateRange[]>([
    { startDate: dayjs(), endDate: dayjs() }
  ]);
  const [priceMode, setPriceMode] = useState<'separate' | 'unified'>('separate');
  const [price, setPrice] = useState<number | null>(null);
  const [activePanels, setActivePanels] = useState<string[]>(['0', '1', '2', '3']);
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);
  const [selectedDates, setSelectedDates] = useState<Dayjs[]>([dayjs()]);
  const [selectedWeeks, setSelectedWeeks] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);
  const [currentMonth, setCurrentMonth] = useState<Dayjs>(dayjs());
  const [selectedHotel, setSelectedHotel] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<string>('hotel');
  const [activeTab, setActiveTab] = useState('rateplan');
  const [isAvailable, setIsAvailable] = useState<string>('nochange');
  const [remainingInventoryType, setRemainingInventoryType] = useState<string>('nochange');
  const [remainingInventoryValue, setRemainingInventoryValue] = useState<number>(0);
  const [dateModel, setDateModel] = useState<string>('multiple');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoadingRoomTypes, setIsLoadingRoomTypes] = useState<boolean>(false);

  // Disable dates before today
  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    return current && current < dayjs().startOf('day');
  };

  // 查询酒店下的房型
  const fetchHotelRoomTypes = async (hotelId: string) => {
    if (!hotelId) {
      setRoomTypes([]);
      return;
    }

    setIsLoadingRoomTypes(true);
    try {
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
          selected: true,
          rateCodes: roomType.rateCodes ? roomType.rateCodes.map((rateCode: any) => ({
            ...rateCode,
            selected: true
          })) : []
        }));

        setRoomTypes(convertedRoomTypes);
        // 重置展开的行
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
      setIsLoadingRoomTypes(false);
    }
  };

  const handleSubmit = async (values: any) => {
    // 设置提交状态
    setIsSubmitting(true);
    
    try {
      // 获取用户信息中的chainId
      const userInfo = localStorage.getItem('user');
      const chainId = userInfo ? JSON.parse(userInfo).chainId : '';
      
      if (!chainId) {
        message.error('未找到chainId，请重新登录');
        return;
      }

      if (!selectedHotel) {
        message.error('请选择酒店');
        return;
      }

      // 构建请求体
      const requestBody = {
        chainId: chainId,
        hotelId: selectedHotel,
        availLevel: selectedLevel === 'hotel' ? 'hotel' : selectedLevel === 'roomType' ? 'roomtype' : 'rateplan',
        roomTypes: selectedLevel !== 'hotel' ? (() => {
          if (selectedLevel === 'roomType') {
            // 房型级：只提交选中的房型
            return roomTypes
              .filter(roomType => roomType.selected)
              .map(roomType => ({
                id: roomType.id,
                code: roomType.code,
                rateCodes: []
              }));
          } else if (selectedLevel === 'rateplan') {
            // 商品级：只要房型下有选中的rateCode，就提交该房型
            const selectedRoomTypes = roomTypes.filter(roomType => 
              roomType.rateCodes.some(rateCode => rateCode.selected)
            );
            return selectedRoomTypes.map(roomType => ({
              id: roomType.id,
              code: roomType.code,
              rateCodes: roomType.rateCodes
                .filter(rateCode => rateCode.selected)
                .map(rateCode => ({
                  id: rateCode.id,
                  code: rateCode.code
                }))
            }));
          }
          return [];
        })() : [],
        DateModel: dateModel,
        dateRanges: dateRanges.map(range => ({
          startDate: range.startDate.format('YYYY-MM-DD'),
          endDate: range.endDate.format('YYYY-MM-DD')
        })),
        applicableWeekdays: weekDays.map(week => selectedWeeks.includes(week.value) ? '1' : '0').join(''),
        selectedDates: selectedDates.map(date => date.format('YYYY-MM-DD')),
        isAvailable: isAvailable,
        remainingInventory: {
          type: remainingInventoryType,
          value: ['set', 'increase', 'decrease'].includes(remainingInventoryType) ? remainingInventoryValue : 0
        }
      };

      // 验证必填字段
      if (selectedLevel === 'roomType' && requestBody.roomTypes.length === 0) {
        message.error('请至少选择一个房型');
        return;
      }
      
      if (selectedLevel === 'rateplan' && requestBody.roomTypes.length === 0) {
        message.error('请至少选择一个房价码');
        return;
      }

      if (requestBody.dateRanges.length === 0) {
        message.error('请至少选择一个日期范围');
        return;
      }

      // 确保selectedDates不为空（日历模式）
      if (dateModel === 'calendar' && requestBody.selectedDates.length === 0) {
        message.error('日历模式下请至少选择一个日期');
        return;
      }

      // 在控制台打印请求体JSON格式
      console.log('API请求体:', JSON.stringify(requestBody, null, 2));

      // 调用后台API
      const response = await request.post('/api/rateinventorystatus/avail/inventory', requestBody);
      
      if (response.status === 200) {
        message.success('房态房量设置保存成功');
        console.log('API响应:', response.data);
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
      // 重置提交状态
      setIsSubmitting(false);
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
  const isAllSelected = roomTypes.length > 0 && roomTypes.every(roomType => 
    roomType.selected && roomType.rateCodes.every(rateCode => rateCode.selected)
  );

  // Define columns for 房型模式
  const roomTypeColumns = [
    {
      title: '',
      dataIndex: 'selected',
      key: 'selected',
      render: (_: any, record: RoomType) => (
        <Checkbox
          checked={record.selected}
          onChange={(e: CheckboxChangeEvent) => handleRoomTypeSelect(record.id, e.target.checked)}
        />
      ),
    },
    {
      title: '房型代码',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '房型名称',
      dataIndex: 'name',
      key: 'name',
    },
  ];

  const customPanelHeader = (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center h-8">
        <span>选择房型房价码</span>
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <Checkbox
            checked={isAllSelected}
            onChange={(e: CheckboxChangeEvent) => handleSelectAll(e.target.checked)}
          >
            全选
          </Checkbox>
        </div>
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

  const customHotelPanelHeader = (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center h-8">
        <span>选择酒店</span>
      </div>
    </div>
  );

  // Update active tab when selected level changes
  React.useEffect(() => {
    if (selectedLevel === 'roomType') {
      setActiveTab('roomType');
    } else if (selectedLevel === 'rateplan') {
      setActiveTab('rateplan');
    }
  }, [selectedLevel]);

  // 当酒店选择改变时，查询该酒店的房型
  React.useEffect(() => {
    if (selectedHotel && (selectedLevel === 'roomType' || selectedLevel === 'rateplan')) {
      fetchHotelRoomTypes(selectedHotel);
    } else if (!selectedHotel) {
      setRoomTypes([]);
    }
  }, [selectedHotel, selectedLevel]);

  // Handle tab change and update selected level
  const handleTabChange = (key: string) => {
    setActiveTab(key);
    if (key === 'roomType') {
      setSelectedLevel('roomType');
    } else if (key === 'rateplan') {
      setSelectedLevel('rateplan');
    }
  };

  const handleDateModelChange = (key: string) => {
    setDateModel(key);
  };

  const handleIsAvailableChange = (value: string) => {
    setIsAvailable(value);
  };

  const handleRemainingInventoryTypeChange = (value: string) => {
    setRemainingInventoryType(value);
  };

  const handleRemainingInventoryValueChange = (value: number | null) => {
    setRemainingInventoryValue(value || 0);
  };

  return (
    <div className="p-6">
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
          {/* Panel 0: Hotel Selection */}
          <Panel header={customHotelPanelHeader} key="0">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <span className="font-medium w-20">选择酒店:</span>
                <HotelSelect
                  value={selectedHotel}
                  onChange={(value: string) => setSelectedHotel(value)}
                  placeholder="请选择酒店"
                  style={{ width: 300 }}
                />
              </div>
              <div className="flex items-center gap-4">
                <span className="font-medium w-20">级别:</span>
                <Radio.Group value={selectedLevel} onChange={(e) => setSelectedLevel(e.target.value)}>
                                  <Radio value="hotel">酒店级</Radio>
                <Radio value="roomType">房型级</Radio>
                <Radio value="rateplan">商品级</Radio>
                </Radio.Group>
              </div>
            </div>
          </Panel>

          {/* Panel 1: Room Type and Rate Code Selection - Only show for roomType and product levels */}
          {selectedLevel !== 'hotel' && (
            <Panel header={customPanelHeader} key="1">
              <Tabs activeKey={activeTab} onChange={handleTabChange}>
                <TabPane tab="房型级" key="roomType">
                  {isLoadingRoomTypes ? (
                    <div className="flex justify-center items-center py-8">
                      <div className="text-gray-500">正在加载房型信息...</div>
                    </div>
                  ) : roomTypes.length === 0 ? (
                    <div className="flex justify-center items-center py-8">
                      <div className="text-gray-500">
                        {selectedHotel ? '该酒店暂无房型信息' : '请先选择酒店'}
                      </div>
                    </div>
                  ) : (
                    <Table
                      columns={roomTypeColumns}
                      dataSource={roomTypes}
                      rowKey="id"
                      pagination={false}
                    />
                  )}
                </TabPane>
                <TabPane tab="商品级" key="rateplan">
                  {isLoadingRoomTypes ? (
                    <div className="flex justify-center items-center py-8">
                      <div className="text-gray-500">正在加载房型信息...</div>
                    </div>
                  ) : roomTypes.length === 0 ? (
                    <div className="flex justify-center items-center py-8">
                      <div className="text-gray-500">
                        {selectedHotel ? '该酒店暂无房型信息' : '请先选择酒店'}
                      </div>
                    </div>
                  ) : (
                    <Table
                      columns={columns}
                      dataSource={roomTypes}
                      rowKey="id"
                      expandable={{
                        expandedRowRender,
                        expandRowByClick: false,
                        expandedRowKeys,
                        onExpandedRowsChange: (expandedKeys) => setExpandedRowKeys(expandedKeys as string[]),
                      }}
                      pagination={false}
                    />
                  )}
                </TabPane>
              </Tabs>
            </Panel>
          )}

          {/* Panel 2: Date Selection */}
          <Panel header={customDatePanelHeader} key="2">
            <div className="mb-4">
              <Tabs defaultActiveKey="multiple" onChange={handleDateModelChange}>
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
                <span>房态房量设置</span>
              </div>
            </div>
          } key="3">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <span className="font-bold">设置房态</span>
                <Radio.Group value={isAvailable} onChange={(e) => handleIsAvailableChange(e.target.value)}>
                  <Radio value="nochange">不改变</Radio>
                  <Radio value="O">有房</Radio>
                  <Radio value="C">满房</Radio>
                </Radio.Group>
              </div>
              {/* 设置房量 section */}
              <div className="flex flex-col gap-2 mt-4">
                <span className="font-bold">设置房量</span>
                <div className="flex items-center gap-4">
                  <span className="font-medium w-20">剩余房量</span>
                  <Radio.Group 
                    value={remainingInventoryType} 
                    onChange={(e) => handleRemainingInventoryTypeChange(e.target.value)} 
                    className="flex items-center gap-4"
                  >
                    <Radio value="nochange">不变</Radio>
                    <Radio value="increase">
                      增加
                      <InputNumber 
                        min={1} 
                        className="mx-2 w-16" 
                        size="small" 
                        disabled={remainingInventoryType !== 'increase'}
                        value={remainingInventoryType === 'increase' ? remainingInventoryValue : undefined}
                        onChange={handleRemainingInventoryValueChange}
                      />
                      间
                    </Radio>
                    <Radio value="decrease">
                      减少
                      <InputNumber 
                        min={1} 
                        className="mx-2 w-16" 
                        size="small" 
                        disabled={remainingInventoryType !== 'decrease'}
                        value={remainingInventoryType === 'decrease' ? remainingInventoryValue : undefined}
                        onChange={handleRemainingInventoryValueChange}
                      />
                      间
                    </Radio>
                    <Radio value="set">
                      设置为
                      <InputNumber 
                        min={0} 
                        className="mx-2 w-16" 
                        size="small" 
                        disabled={remainingInventoryType !== 'set'}
                        value={remainingInventoryType === 'set' ? remainingInventoryValue : undefined}
                        onChange={handleRemainingInventoryValueChange}
                      />
                    </Radio>
                  </Radio.Group>
                </div>
              </div>
            </div>
          </Panel>
        </Collapse>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Space>
            <Button 
              onClick={() => form.resetFields()}
              disabled={isSubmitting}
            >
              重置
            </Button>
            <Button 
              type="primary" 
              htmlType="submit"
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              {isSubmitting ? '保存中...' : '保存'}
            </Button>
          </Space>
        </div>
      </Form>
    </div>
  );
};

export default AvailPrice; 