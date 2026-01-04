import React, { useState } from 'react';
import HotelSelect from '../../components/common/HotelSelect';
import { Select, DatePicker } from 'antd';
import type { DefaultOptionType } from 'antd/es/select';
import dayjs from 'dayjs';
import TokenCheck from '../../components/common/TokenCheck';

// Mock order data
const mockOrders = [
  {
    id: '999240170805405',
    status: 'R',
    auditStatus: '未审核',
    orderNo: '999240170805405',
    dateRange: '2025/05/09 - 2025/05/16',
    guest: '李惠丽',
    price: '¥3500',
    confirmNo: 'CN123456',
    roomNo: '801',
    extraFees: '无',
    hotelId: 'HOTEL_001',
  },
  {
    id: '999240170805406',
    status: 'I',
    auditStatus: '已通过',
    orderNo: '999240170805406',
    dateRange: '2025/06/01 - 2025/06/03',
    guest: '王小明',
    price: '¥1200',
    confirmNo: 'CN123457',
    roomNo: '502',
    extraFees: '早餐 ¥100',
    hotelId: 'HOTEL_002',
  },
];

const statusOptions: DefaultOptionType[] = [
  { value: '', label: '订单状态' },
  { value: 'R', label: '预订' },
  { value: 'I', label: '入住' },
  { value: 'O', label: '离店' },
  { value: 'N', label: '应到未到' },
  { value: 'QK', label: '挂账' },
  { value: 'C', label: '取消' },
  { value: 'D', label: '续住' },
];

const auditStatusOptions: DefaultOptionType[] = [
  { value: '', label: '全部审核' },
  { value: '未审核', label: '未审核' },
  { value: '已通过', label: '已通过' },
  { value: '已拒绝', label: '已拒绝' },
];

const orderStatusOptions = [
  { value: 'R', label: '预订' },
  { value: 'I', label: '入住' },
  { value: 'O', label: '离店' },
  { value: 'N', label: '应到未到' },
  { value: 'QK', label: '挂账' },
  { value: 'C', label: '取消' },
  { value: 'D', label: '续住' },
];

const ReservationAudit: React.FC = () => {
  const [search, setSearch] = useState({
    status: '',
    auditStatus: '',
    orderNo: '',
    guest: '',
    hotelId: '',
    stayDate: null as dayjs.Dayjs | null,
  });

  const [showAuditModal, setShowAuditModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [auditForm, setAuditForm] = useState({
    confirmNo: '',
    orderStatus: 'R',
    remarks: '',
  });

  // 过滤订单
  const filteredOrders = mockOrders.filter(order => {
    return (
      (!search.status || order.status === search.status) &&
      (!search.auditStatus || order.auditStatus === search.auditStatus) &&
      (!search.orderNo || order.orderNo.includes(search.orderNo)) &&
      (!search.guest || order.guest.includes(search.guest)) &&
      (!search.hotelId || order.hotelId === search.hotelId) &&
      (!search.stayDate || order.dateRange.includes(search.stayDate.format('YYYY/MM/DD')))
    );
  });

  const handleAuditClick = (order: any) => {
    setSelectedOrder(order);
    setAuditForm({
      confirmNo: order.confirmNo || '',
      orderStatus: 'R',
      remarks: '',
    });
    setShowAuditModal(true);
  };

  const handleAuditSubmit = () => {
    // Here you would typically make an API call to save the audit data
    console.log('Audit data:', {
      orderId: selectedOrder.id,
      ...auditForm,
    });
    setShowAuditModal(false);
  };

  return (
    <TokenCheck>
      <div className="flex flex-col h-[calc(100vh-48px)] bg-gray-50">
        {/* 查询条件面板 */}
        <div className="bg-white p-4 border-b">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-4 items-end">
              <Select
                style={{ width: 128 }}
                size="large"
                value={search.status || undefined}
                onChange={(value) => setSearch(s => ({ ...s, status: value }))}
                options={statusOptions}
                placeholder="订单状态"
                allowClear
              />

              <Select
                style={{ width: 128 }}
                size="large"
                value={search.auditStatus || undefined}
                onChange={(value) => setSearch(s => ({ ...s, auditStatus: value }))}
                options={auditStatusOptions}
                placeholder="全部审核"
                allowClear
              />

              <input
                type="text"
                className="w-52 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={search.orderNo}
                onChange={e => setSearch(s => ({ ...s, orderNo: e.target.value }))}
                placeholder="订单号"
              />

              <input
                type="text"
                className="w-36 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={search.guest}
                onChange={e => setSearch(s => ({ ...s, guest: e.target.value }))}
                placeholder="客人姓名"
              />

              <div className="w-52">
                <HotelSelect
                  value={search.hotelId}
                  onChange={(value: string) => setSearch(s => ({ ...s, hotelId: value }))}
                  placeholder="所属酒店"
                />
              </div>

              <DatePicker
                style={{ width: 128 }}
                size="large"
                value={search.stayDate}
                onChange={(date) => setSearch(s => ({ ...s, stayDate: date }))}
                placeholder="在住日期"
                format="YYYY-MM-DD"
                allowClear
              />
            </div>

            <div className="flex gap-4">
              <button
                className="px-4 py-2 bg-white text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                onClick={() => setSearch({
                  status: '',
                  auditStatus: '',
                  orderNo: '',
                  guest: '',
                  hotelId: '',
                  stayDate: null,
                })}
              >
                重置
              </button>

              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={() => {
                  // 这里可以添加查询逻辑
                  console.log('Search with:', search);
                }}
              >
                查询
              </button>
            </div>
          </div>
        </div>

        {/* 订单列表 */}
        <div className="flex-1 overflow-auto">
          <table className="w-full bg-white">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">状态</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">审核</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">订单号</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">入离日期</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">客人姓名</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">订单价格</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">确认号</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">房号</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">杂费项</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs ${
                      order.status === 'R' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'I' ? 'bg-green-100 text-green-800' :
                      order.status === 'O' ? 'bg-gray-100 text-gray-800' :
                      order.status === 'N' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'QK' ? 'bg-purple-100 text-purple-800' :
                      order.status === 'C' ? 'bg-red-100 text-red-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {statusOptions.find(opt => opt.value === order.status)?.label || order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleAuditClick(order)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                    >
                      审核
                    </button>
                  </td>
                  <td className="px-4 py-3 text-blue-600 cursor-pointer hover:underline">{order.orderNo}</td>
                  <td className="px-4 py-3">{order.dateRange}</td>
                  <td className="px-4 py-3">{order.guest}</td>
                  <td className="px-4 py-3 font-medium">{order.price}</td>
                  <td className="px-4 py-3">{order.confirmNo}</td>
                  <td className="px-4 py-3">{order.roomNo}</td>
                  <td className="px-4 py-3">{order.extraFees}</td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                    暂无数据
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 审核弹窗 */}
        {showAuditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-[480px]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">订单审核</h3>
                <button
                  onClick={() => setShowAuditModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    确认号
                  </label>
                  <input
                    type="text"
                    value={auditForm.confirmNo}
                    onChange={(e) => setAuditForm(f => ({ ...f, confirmNo: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="请输入确认号"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    酒店确认号只能输入数字或字母，如有多个用逗号分割
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    订单状态
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {orderStatusOptions.map(option => (
                      <label key={option.value} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          value={option.value}
                          checked={auditForm.orderStatus === option.value}
                          onChange={(e) => setAuditForm(f => ({ ...f, orderStatus: e.target.value }))}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    确认备注
                  </label>
                  <textarea
                    value={auditForm.remarks}
                    onChange={(e) => setAuditForm(f => ({ ...f, remarks: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    placeholder="请输入确认备注"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowAuditModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  取消
                </button>
                <button
                  onClick={handleAuditSubmit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  确认
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </TokenCheck>
  );
};

export default ReservationAudit; 