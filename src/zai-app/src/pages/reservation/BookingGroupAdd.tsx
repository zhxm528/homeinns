import React, { useState } from 'react';
import { FaPlus, FaMinus, FaSearch } from 'react-icons/fa';
import { DatePicker, Modal, Collapse } from 'antd';
import type { RangePickerProps } from 'antd/es/date-picker';
import dayjs from 'dayjs';
import locale from 'antd/es/date-picker/locale/zh_CN';
import TokenCheck from '../../components/common/TokenCheck';
import Toast from '../../components/Toast';
import request from '../../utils/request';

interface ToastMessage {
  message: string;
  type: 'success' | 'error' | 'info';
}

interface RoomType {
  id: string;
  name: string;
  roomCount: number;
  price: number;
  remark: string;
  checkIn: string;
  checkOut: string;
  dateRange?: [string, string];
  breakfast: 'NO' | 'SINGLE' | 'DOUBLE';
}

interface GroupInfo {
  hotelId: string;
  hotelName: string;
  rateCode: string;
  rateCodeName: string;
  rateCodeDesc: string;
  companyName: string;
  bookingPolicy: string;    // 预订政策
  cancelPolicy: string;     // 取消政策
  noshowPolicy: string;     // Noshow政策
  invoiceRequirement: string; // 发票要求
  guestBenefits: string;    // 客人权益
  roomTypes: {
    id: string;
    name: string;
    defaultPrice: number;
  }[];
  salesperson?: string;
}

const BookingGroup: React.FC = () => {
  const [groupCode, setGroupCode] = useState('');
  const [groupInfo, setGroupInfo] = useState<GroupInfo | null>(null);
  const [selectedRooms, setSelectedRooms] = useState<RoomType[]>([]);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [loading, setLoading] = useState(false);
  const [booker, setBooker] = useState('');
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [activePanels, setActivePanels] = useState<string[]>(['1', '2']); // 默认展开所有面板

  // 显示消息提示
  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
  };

  // 查询团队信息
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupCode.trim()) {
      showToast('请输入团队码', 'error');
      return;
    }

    setLoading(true);
    try {
      // 模拟数据
      const mockData: GroupInfo = {
        hotelId: 'H001',
        hotelName: '测试酒店',
        rateCode: 'RC001',
        rateCodeName: '团队特惠价',
        rateCodeDesc: '无特殊需求',
        companyName: '测试旅行社',
        bookingPolicy: '提前7天预订，预订将按照订单总金额扣除预存款',
        cancelPolicy: '入住前3天可免费取消，3天内取消收取首晚房费',
        noshowPolicy: '未入住收取首晚房费',
        invoiceRequirement: '需提供公司抬头和税号',
        guestBenefits: '含双早，可延迟退房至14:00',
        roomTypes: [
          { id: 'RT001', name: '标准双床房', defaultPrice: 299 },
          { id: 'RT002', name: '豪华大床房', defaultPrice: 399 },
          { id: 'RT003', name: '行政套房', defaultPrice: 599 },
          { id: 'RT004', name: '总统套房', defaultPrice: 999 }
        ]
      };

      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setGroupInfo(mockData);
      // 自动添加一个默认房型
      const today = dayjs().format('YYYY-MM-DD');
      const tomorrow = dayjs().add(1, 'day').format('YYYY-MM-DD');
      setSelectedRooms([{
        id: 'RT001',
        name: '标准双床房',
        roomCount: 1,
        price: 299,
        remark: '',
        checkIn: today,
        checkOut: tomorrow,
        dateRange: [today, tomorrow],
        breakfast: 'NO'
      }]);
      setBooker('张三'); // 设置默认预订人
      showToast('查询成功', 'success');
    } catch (error: any) {
      console.error('查询失败:', error);
      showToast(error.response?.data?.message || '查询失败', 'error');
    } finally {
      setLoading(false);
    }
  };

  // 添加房型
  const handleAddRoom = () => {
    if (!groupInfo) return;
    
    const today = dayjs().format('YYYY-MM-DD');
    const tomorrow = dayjs().add(1, 'day').format('YYYY-MM-DD');
    
    setSelectedRooms([
      ...selectedRooms,
      {
        id: '',
        name: '',
        roomCount: 1,
        price: 0,
        remark: '',
        checkIn: today,
        checkOut: tomorrow,
        dateRange: [today, tomorrow],
        breakfast: 'NO'
      }
    ]);
  };

  // 删除房型
  const handleRemoveRoom = (index: number) => {
    setSelectedRooms(selectedRooms.filter((_, i) => i !== index));
  };

  // 更新房型信息
  const handleRoomChange = (index: number, field: keyof RoomType | 'dateRange', value: string | number | [string, string]) => {
    const newRooms = [...selectedRooms];
    if (field === 'id' && groupInfo) {
      const selectedRoom = groupInfo.roomTypes.find(r => r.id === value);
      newRooms[index] = {
        ...newRooms[index],
        id: value as string,
        name: selectedRoom?.name || '',
        price: selectedRoom?.defaultPrice || 0
      };
    } else if (field === 'dateRange') {
      const [checkIn, checkOut] = value as [string, string];
      newRooms[index] = {
        ...newRooms[index],
        checkIn,
        checkOut,
        dateRange: [checkIn, checkOut]
      };
    } else {
      newRooms[index] = {
        ...newRooms[index],
        [field]: value
      };
    }
    setSelectedRooms(newRooms);
  };

  // 提交订单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupInfo) {
      showToast('请先查询团队信息', 'error');
      return;
    }

    if (selectedRooms.length === 0) {
      showToast('请至少添加一个房型', 'error');
      return;
    }

    if (!booker.trim()) {
      showToast('请输入预订人', 'error');
      return;
    }

    // 显示确认弹窗
    Modal.confirm({
      title: '确认提交订单',
      content: (
        <div className="space-y-2">
          <p><span className="font-medium">酒店名称：</span>{groupInfo.hotelName}</p>
          <p><span className="font-medium">公司名称：</span>{groupInfo.companyName}</p>
          <p><span className="font-medium">销售员：</span>{groupInfo.salesperson || '未设置'}</p>
          <p><span className="font-medium">预订人：</span>{booker}</p>
        </div>
      ),
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          const orderData = {
            groupCode,
            hotelId: groupInfo.hotelId,
            rateCode: groupInfo.rateCode,
            booker,
            rooms: selectedRooms
          };

          await request.post('/api/booking/group/order', orderData);
          showToast('订单创建成功', 'success');
          // 重置表单
          setGroupCode('');
          setGroupInfo(null);
          setSelectedRooms([]);
          setBooker('');
        } catch (error: any) {
          console.error('创建订单失败:', error);
          showToast(error.response?.data?.message || '创建订单失败', 'error');
        }
      }
    });
  };

  return (
    <TokenCheck checkToken={false}>
      <div className="p-6">
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}

        <div className="bg-white rounded shadow p-6">
          <h2 className="text-xl font-semibold mb-6">团队预订录入</h2>

          {/* 团队码查询表单 */}
          <form onSubmit={handleSearch} className="mb-8">
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  团队码
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={groupCode}
                  onChange={(e) => setGroupCode(e.target.value)}
                  placeholder="请输入团队码"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                disabled={loading}
              >
                <FaSearch className="mr-2" />
                {loading ? '查询中...' : '查询'}
              </button>
            </div>
          </form>

          {/* 团队信息和房型信息面板 */}
          {groupInfo && (
            <Collapse
              activeKey={activePanels}
              onChange={(keys) => setActivePanels(keys as string[])}
              className="mb-8"
            >
              {/* 团队信息面板 */}
              <Collapse.Panel header="团队信息" key="1">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">团队名称</label>
                    <div className="px-3 py-2 bg-gray-50 rounded-lg">{groupInfo.rateCodeName}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">酒店</label>
                    <div className="px-3 py-2 bg-gray-50 rounded-lg">{groupInfo.hotelName}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">团队活动ID</label>
                    <div className="px-3 py-2 bg-gray-50 rounded-lg">{groupInfo.rateCode}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">协议公司</label>
                    <div className="px-3 py-2 bg-gray-50 rounded-lg">{groupInfo.companyName}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">预订人</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={booker}
                      onChange={(e) => setBooker(e.target.value)}
                      placeholder="请输入预订人姓名"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">预订政策</label>
                    <div className="px-3 py-2 bg-gray-50 rounded-lg">{groupInfo.bookingPolicy}</div>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">取消政策</label>
                    <div className="px-3 py-2 bg-gray-50 rounded-lg">{groupInfo.cancelPolicy}</div>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Noshow政策</label>
                    <div className="px-3 py-2 bg-gray-50 rounded-lg">{groupInfo.noshowPolicy}</div>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">特殊需求</label>
                    <div className="px-3 py-2 bg-gray-50 rounded-lg">{groupInfo.rateCodeDesc}</div>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">发票要求</label>
                    <div className="px-3 py-2 bg-gray-50 rounded-lg">{groupInfo.invoiceRequirement}</div>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">客人权益</label>
                    <div className="px-3 py-2 bg-gray-50 rounded-lg">{groupInfo.guestBenefits}</div>
                  </div>
                </div>
              </Collapse.Panel>

              {/* 房型信息面板 */}
              <Collapse.Panel header="房型信息" key="2">
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    {selectedRooms.map((room, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg mb-4">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="text-md font-medium">团队订单 {index + 1}</h4>
                          <button
                            type="button"
                            onClick={() => handleRemoveRoom(index)}
                            className="text-red-600 hover:text-red-800 hover:bg-red-50 rounded border border-red-200 hover:border-red-400 transition-colors duration-200 p-2"
                          >
                            <FaMinus />
                          </button>
                        </div>

                        <div className="flex gap-4 items-end">
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              选择房型
                            </label>
                            <select
                              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              value={room.id}
                              onChange={(e) => handleRoomChange(index, 'id', e.target.value)}
                            >
                              <option value="">请选择房型</option>
                              {groupInfo.roomTypes.map((rt) => (
                                <option key={rt.id} value={rt.id}>
                                  {rt.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="w-32">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              房间数
                            </label>
                            <input
                              type="number"
                              min="1"
                              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              value={room.roomCount}
                              onChange={(e) => handleRoomChange(index, 'roomCount', parseInt(e.target.value) || 0)}
                            />
                          </div>

                          <div className="w-32">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              价格
                            </label>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              value={room.price}
                              onChange={(e) => handleRoomChange(index, 'price', parseFloat(e.target.value) || 0)}
                            />
                          </div>

                          <div className="w-32">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              早餐
                            </label>
                            <select
                              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              value={room.breakfast}
                              onChange={(e) => handleRoomChange(index, 'breakfast', e.target.value)}
                            >
                              <option value="NO">无早</option>
                              <option value="SINGLE">单早</option>
                              <option value="DOUBLE">双早</option>
                            </select>
                          </div>

                          <div className="w-80">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              入住日期 - 离店日期
                            </label>
                            <DatePicker.RangePicker
                              className="w-full"
                              size="large"
                              locale={locale}
                              placeholder={['入住日期', '离店日期']}
                              value={room.checkIn && room.checkOut ? [dayjs(room.checkIn), dayjs(room.checkOut)] : null}
                              onChange={(dates) => {
                                if (dates) {
                                  handleRoomChange(index, 'dateRange', [
                                    dates[0]?.format('YYYY-MM-DD') || '',
                                    dates[1]?.format('YYYY-MM-DD') || ''
                                  ]);
                                } else {
                                  handleRoomChange(index, 'dateRange', ['', '']);
                                }
                              }}
                              format="YYYY-MM-DD"
                            />
                          </div>

                          <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              备注
                            </label>
                            <input
                              type="text"
                              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              value={room.remark}
                              onChange={(e) => handleRoomChange(index, 'remark', e.target.value)}
                              placeholder="请输入备注信息"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={handleAddRoom}
                      className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded border border-blue-200 hover:border-blue-400 transition-colors duration-200 px-4 py-2 flex items-center"
                    >
                      <FaPlus className="mr-2" />
                      添加房型
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    >
                      提交订单
                    </button>
                  </div>
                </form>
              </Collapse.Panel>
            </Collapse>
          )}
        </div>
      </div>
    </TokenCheck>
  );
};

export default BookingGroup;
