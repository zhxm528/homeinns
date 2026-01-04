import React, { useState } from 'react';
import { CaretRightOutlined, CaretDownOutlined } from '@ant-design/icons';
import { Select } from 'antd';
import TokenCheck from '../../components/common/TokenCheck';

interface Order {
  id: string;
  status: string;
  guest: string;
  room: string;
  nights: number;
  dateRange: string;
  created: string;
  payType: string;
  channel: string;
  orderNo: string;
  remark: string;
  hotelId: string;
  teamCode: string;
}

// Mock order data
const mockOrders: Order[] = [
  {
    id: '999240170805405',
    status: '预订',
    guest: '李惠丽',
    room: '豪华大床房（自动窗帘+畅享无线投屏）',
    nights: 7,
    dateRange: '2025/05/09 - 2025/05/16',
    created: '05/11 17:05',
    payType: '预付',
    channel: 'OTA',
    orderNo: '999240170805405',
    remark: '无',
    hotelId: 'HOTEL_001',
    teamCode: 'ABCDEFG',
  },
  {
    id: '999240170805406',
    status: '未处理',
    guest: '王小明',
    room: '标准双床房',
    nights: 2,
    dateRange: '2025/06/01 - 2025/06/03',
    created: '05/10 10:20',
    payType: '到付',
    channel: 'OTA',
    orderNo: '999240170805406',
    remark: '需要安静房间',
    hotelId: 'HOTEL_002',
    teamCode: 'HIJKLMN',
  },
  // 可继续添加更多 mock 数据
];

const orderStatusTabs = [
  { value: '', label: '全部订单' },
  { value: '未处理', label: '未处理订单' },
  { value: '今日新订', label: '今日新订' },
  { value: '今日入住', label: '今日入住' },
  { value: '待入住', label: '待入住' },
  { value: '已入住', label: '已入住' },
];

const hotelOptions = [
  { value: '', label: '所属酒店' },
  { value: 'HOTEL_001', label: '北京建国饭店' },
  { value: 'HOTEL_002', label: '上海建国饭店' },
  { value: 'HOTEL_003', label: '广州建国饭店' },
  { value: 'HOTEL_004', label: '深圳建国饭店' },
];

const companyOptions = [
  { value: '', label: '协议公司' },
  { value: 'BJLY', label: '北京旅游有限公司' },
  { value: 'SHSW', label: '上海商务服务有限公司' },
  { value: 'GZHZ', label: '广州会展服务有限公司' },
  { value: 'SZKJ', label: '深圳科技发展有限公司' },
];

const paymentOptions = [
  { value: 'CASH_ONLY', label: '现付' },
  { value: 'PREPAID_ONLY', label: '预付' },
];

const ReservationList: React.FC = () => {
  const [search, setSearch] = useState({
    status: '',
    orderNo: '',
    guest: '',
    hotelId: '',
    teamCode: '',
    company: '',
  });
  const [selectedOrderId, setSelectedOrderId] = useState<string>(mockOrders[0].id);
  const [showDetail, setShowDetail] = useState(true);
  const [showGuestRequirements, setShowGuestRequirements] = useState(true);
  const [showOrderTips, setShowOrderTips] = useState(true);
  const [showConfirmationResult, setShowConfirmationResult] = useState(true);
  const [showConfirmNumberModal, setShowConfirmNumberModal] = useState(false);
  const [confirmNumber, setConfirmNumber] = useState('');
  const [showOrderLog, setShowOrderLog] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showConfirmLetterModal, setShowConfirmLetterModal] = useState(false);

  // Mock order log data
  const mockOrderLogs = [
    {
      time: '2025-05-11 17:05:23',
      operator: '系统',
      content: '订单创建成功',
    },
    {
      time: '2025-05-11 17:05:25',
      operator: '系统',
      content: '订单自动确认成功',
    },
    {
      time: '2025-05-11 17:10:15',
      operator: '张经理',
      content: '修改订单备注：客人要求安静房间',
    },
    {
      time: '2025-05-11 17:15:30',
      operator: '系统',
      content: '发送订单确认短信给客人',
    },
  ];

  // 过滤订单
  const filteredOrders = mockOrders.filter(order => {
    return (
      (!search.status || order.status === search.status) &&
      (!search.orderNo || order.orderNo.includes(search.orderNo)) &&
      (!search.guest || order.guest.includes(search.guest)) &&
      (!search.hotelId || order.hotelId === search.hotelId)
    );
  });

  const selectedOrder = (filteredOrders.find(order => order.id === selectedOrderId) || filteredOrders[0]) as Order;

  // 保证选中项在过滤后仍然存在
  React.useEffect(() => {
    if (selectedOrder && filteredOrders.length > 0) {
      setSelectedOrderId(selectedOrder.id);
    } else if (filteredOrders.length > 0) {
      setSelectedOrderId(filteredOrders[0].id);
    }
  }, [search, filteredOrders.length]);

  return (
    <TokenCheck checkToken={false}>
      <div className="flex flex-col h-[calc(100vh-48px)] bg-gray-50">
        {/* 查询条件面板 */}
        <div className="bg-white p-4 border-b">
          {/* 第一行：订单状态Tabs */}
          <div className="flex gap-2 mb-4">
            {orderStatusTabs.map(tab => (
              <button
                key={tab.value}
                className={`px-5 py-2 rounded-t text-sm font-medium border-b-2 transition-colors duration-150 focus:outline-none
                  ${search.status === tab.value ? 'border-blue-500 text-blue-600 bg-blue-50' : 'border-transparent text-gray-600 bg-transparent hover:bg-gray-100'}`}
                onClick={() => setSearch(s => ({ ...s, status: tab.value }))}
              >
                {tab.label}
              </button>
            ))}
          </div>
          {/* 第二行：其他条件 */}
          <div className="flex flex-wrap gap-4 items-end">
            <input
              type="text"
              className="w-36 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={search.teamCode}
              onChange={e => setSearch(s => ({ ...s, teamCode: e.target.value }))}
              placeholder="团队号"
            />
            <input
              type="text"
              className="w-36 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <select
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={search.hotelId}
                onChange={e => setSearch(s => ({ ...s, hotelId: e.target.value }))}
              >
                {hotelOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-52">
              <select
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={search.company}
                onChange={e => setSearch(s => ({ ...s, company: e.target.value }))}
              >
                {companyOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        {/* 下方左右结构 */}
        <div className="flex flex-1 min-h-0">
          {/* 左侧订单列表 */}
          <div className="w-96 min-w-[320px] max-w-[400px] border-r bg-white overflow-y-auto">
            <div className="p-4 border-b text-lg font-bold">订单列表</div>
            <ul>
              {filteredOrders.map(order => (
                <li
                  key={order.id}
                  className={`cursor-pointer px-4 py-3 border-b hover:bg-blue-50 ${selectedOrderId === order.id ? 'bg-blue-100 border-l-4 border-blue-500' : ''}`}
                  onClick={() => setSelectedOrderId(order.id)}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-blue-700">{order.orderNo}</span>
                  </div>
                  <div className="text-sm text-gray-700 truncate">{order.room}</div>
                  <div className="text-xs text-gray-500">{order.guest} | {order.nights}晚 | {order.dateRange}</div>
                  <div className="text-xs mt-1">
                    <span className="inline-block px-2 py-0.5 rounded bg-blue-100 text-blue-700 mr-2">{order.status}</span>
                    <span className="inline-block px-2 py-0.5 rounded bg-gray-100 text-gray-700">{order.payType}</span>
                  </div>
                </li>
              ))}
              {filteredOrders.length === 0 && (
                <li className="text-center text-gray-400 py-8">无匹配订单</li>
              )}
            </ul>
          </div>

          {/* 右侧订单详情 */}
          <div className="flex-1 p-0 overflow-y-auto">
            {selectedOrder ? (
              <div className="w-full bg-white rounded shadow p-6">
                {/* 订单号和状态 */}
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <span className="text-xl font-bold text-blue-700">订单号：{selectedOrder.orderNo}</span>
                    <span className="ml-4 text-sm text-gray-500">团队号：{selectedOrder.teamCode || 'ABCDEFG'}</span>
                    <span className="ml-4 text-sm text-gray-500">{selectedOrder.created}</span>
                  </div>
                  <span className="px-3 py-1 rounded bg-blue-100 text-blue-700 text-sm">{selectedOrder.status}</span>
                </div>

                {/* 顾客信息和可入住人数 */}
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-bold text-lg">{selectedOrder.guest}</div>
                  </div>
                  <div className="text-right text-gray-700 text-base">
                    <div className="mb-1">可入住人数</div>
                    <div className="font-bold text-lg">2 成人</div>
                  </div>
                </div>

                {/* 预订客房 */}
                <div className="flex justify-between items-center border-t border-b py-3 my-3">
                  <div>
                    <div className="font-bold">{selectedOrder.room} <span className="font-normal text-gray-500">&lt;无早&gt;</span></div>
                    <div className="text-sm text-blue-700">
                      房型代码: <a href="#">DKFG</a>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="mb-1">间数</div>
                    <div className="font-bold text-lg">1 间</div>
                  </div>
                </div>

                {/* 入住信息 */}
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <div className="mb-1">入住日期</div>
                    <div className="font-bold text-lg">{selectedOrder.dateRange}</div>
                  </div>
                  <div>
                    <div className="mb-1">天数</div>
                    <div className="font-bold text-lg">{selectedOrder.nights} 晚</div>
                  </div>
                  <div>
                    <div className="mb-1">总间夜数</div>
                    <div className="font-bold text-lg">{selectedOrder.nights}</div>
                  </div>
                </div>

                {/* 订单总价和结算价 */}
                <div className="flex justify-between items-center mt-6 gap-8">
                  <div className="flex items-center gap-4">
                    <div className="font-semibold text-gray-700">渠道总价</div>
                    <div className="text-xl font-bold text-blue-700">¥3500</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="font-semibold text-gray-700">渠道结算价</div>
                    <div className="text-xl font-bold text-blue-600">¥3200</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="font-semibold text-gray-700">酒店总价</div>
                    <div className="text-xl font-bold text-green-600">¥3200</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="font-semibold text-gray-700">酒店结算价</div>
                    <div className="text-xl font-bold text-green-600">¥3200</div>
                  </div>
                </div>

                {/* 间夜明细 Panel */}
                <div className="mt-8 bg-gray-50 rounded shadow">
                  <div
                    className="px-4 py-2 border-b font-bold text-gray-700 bg-gray-100 rounded-t flex items-center cursor-pointer select-none"
                    onClick={() => setShowDetail(v => !v)}
                  >
                    <span className="mr-2">{showDetail ? <CaretDownOutlined /> : <CaretRightOutlined />}</span>
                    间夜明细
                  </div>
                  {showDetail && (
                    <table className="w-full text-sm text-left">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="px-4 py-2 font-medium text-gray-700">日期</th>
                          <th className="px-4 py-2 font-medium text-gray-700">渠道预计收入</th>
                          <th className="px-4 py-2 font-medium text-gray-700">酒店预计收入</th>
                          <th className="px-4 py-2 font-medium text-gray-700">餐食</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { date: '05-09(星期五)', channelIncome: 320.55, hotelIncome: 301.55, meal: '不含餐' },
                          { date: '05-10(星期六)', channelIncome: 300.13, hotelIncome: 281.13, meal: '不含餐' },
                          { date: '05-11(星期日)', channelIncome: 300.13, hotelIncome: 281.13, meal: '不含餐' },
                          { date: '05-12(星期一)', channelIncome: 320.55, hotelIncome: 301.55, meal: '不含餐' },
                          { date: '05-13(星期二)', channelIncome: 320.55, hotelIncome: 301.55, meal: '不含餐' },
                          { date: '05-14(星期三)', channelIncome: 320.55, hotelIncome: 301.55, meal: '不含餐' },
                          { date: '05-15(星期四)', channelIncome: 320.55, hotelIncome: 301.55, meal: '不含餐' },
                        ].map((row, idx) => (
                          <tr key={row.date} className="bg-white">
                            <td className="px-4 py-2">{row.date}</td>
                            <td className="px-4 py-2 text-blue-600">{row.channelIncome}</td>
                            <td className="px-4 py-2 text-green-600">{row.hotelIncome}</td>
                            <td className="px-4 py-2">{row.meal}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>

                {/* 客人要求 Panel */}
                <div className="mt-8 bg-gray-50 rounded shadow">
                  <div
                    className="px-4 py-2 border-b font-bold text-gray-700 bg-gray-100 rounded-t flex items-center cursor-pointer select-none"
                    onClick={() => setShowGuestRequirements(v => !v)}
                  >
                    <span className="mr-2">{showGuestRequirements ? <CaretDownOutlined /> : <CaretRightOutlined />}</span>
                    客人要求
                  </div>
                  {showGuestRequirements && (
                    <div className="p-4 space-y-3 text-gray-700 text-sm">
                      <div>
                        <div className="font-semibold mb-2">特殊要求</div>
                        <div className="pl-4 space-y-2">
                          <div>预付订单，客人已支付房费，请贵酒店务必保留房间</div>
                        </div>
                      </div>
                      <div>
                        <div className="font-semibold mb-2">发票要求</div>
                        <div className="pl-4 space-y-2">
                          <div>如客人需要发票，请贵酒店开具，开票金额：CNY2177.60</div>
                        </div>
                      </div>                    
                      <div>
                        <div className="font-semibold mb-2">客人权益</div>
                        <div className="pl-4 space-y-2">
                          <div>客人未入住时，可在入住当天20:00:00前免费取消订单</div>
                          <div>客人享受订单全部房间离店时免费延迟退房至14:00</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 订单提示 Panel */}
                <div className="mt-8 bg-gray-50 rounded shadow">
                  <div
                    className="px-4 py-2 border-b font-bold text-gray-700 bg-gray-100 rounded-t flex items-center cursor-pointer select-none"
                    onClick={() => setShowOrderTips(v => !v)}
                  >
                    <span className="mr-2">{showOrderTips ? <CaretDownOutlined /> : <CaretRightOutlined />}</span>
                    订单提示
                  </div>
                  {showOrderTips && (
                    <div className="p-4 space-y-4 text-gray-700 text-sm">
                      <div>
                        <div className="font-semibold mb-2">预订政策</div>
                        <div className="pl-4 space-y-2">
                          <div>预付订单，客人已支付房费，请贵酒店务必保留房间</div>
                        </div>
                      </div>
                      <div>
                        <div className="font-semibold mb-2">取消政策</div>
                        <div className="pl-4 space-y-2">
                          <div>北京时间2025-05-09 20:00前 免费</div>
                          <div>北京时间2025-05-09 20:00后 1 晚房费</div>
                          <div>如果客人未入住，将根据取消政策进行扣除。</div>
                        </div>
                      </div>
                      <div>
                        <div className="font-semibold mb-2">未入住</div>
                        <div className="pl-4 space-y-2">
                          <div>如果客人未入住，将根据取消政策进行扣除。</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 确认结果 Panel */}
                <div className="mt-8 bg-gray-50 rounded shadow">
                  <div
                    className="px-4 py-2 border-b font-bold text-gray-700 bg-gray-100 rounded-t flex items-center cursor-pointer select-none"
                    onClick={() => setShowConfirmationResult(v => !v)}
                  >
                    <span className="mr-2">{showConfirmationResult ? <CaretDownOutlined /> : <CaretRightOutlined />}</span>
                    确认结果
                  </div>
                  {showConfirmationResult && (
                    <div className="p-4">
                      <table className="w-full text-sm">
                        <tbody>
                          <tr className="border-b">
                            <td className="py-3 font-medium text-gray-700 w-32">酒店确认号</td>
                            <td className="py-3">
                              <div className="flex items-center gap-2">
                                <span>{confirmNumber || '未确认'}</span>
                                <button
                                  onClick={() => setShowConfirmNumberModal(true)}
                                  className="text-blue-600 hover:text-blue-800"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-3 font-medium text-gray-700">确认备注</td>
                            <td className="py-3">无</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-3 font-medium text-gray-700">确认方式</td>
                            <td className="py-3">系统自动确认</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-3 font-medium text-gray-700">确认人</td>
                            <td className="py-3">系统</td>
                          </tr>
                          <tr>
                            <td className="py-3 font-medium text-gray-700">确认结果</td>
                            <td className="py-3">
                              <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">已确认</span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* 订单日志 Panel */}
                <div className="mt-8 bg-gray-50 rounded shadow">
                  <div
                    className="px-4 py-2 border-b font-bold text-gray-700 bg-gray-100 rounded-t flex items-center cursor-pointer select-none"
                    onClick={() => setShowOrderLog(v => !v)}
                  >
                    <span className="mr-2">{showOrderLog ? <CaretDownOutlined /> : <CaretRightOutlined />}</span>
                    订单日志
                  </div>
                  {showOrderLog && (
                    <div className="p-4">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2 font-medium text-gray-700 w-48">操作时间</th>
                            <th className="text-left py-2 font-medium text-gray-700 w-32">操作人</th>
                            <th className="text-left py-2 font-medium text-gray-700">操作内容</th>
                          </tr>
                        </thead>
                        <tbody>
                          {mockOrderLogs.map((log, index) => (
                            <tr key={index} className="border-b last:border-b-0">
                              <td className="py-3 text-gray-600">{log.time}</td>
                              <td className="py-3 text-gray-600">{log.operator}</td>
                              <td className="py-3 text-gray-600">{log.content}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* 取消订单按钮 */}
                <div className="mt-8 flex justify-start gap-4">
                  <button
                    onClick={() => setShowConfirmLetterModal(true)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    查看确认函
                  </button>
                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    取消订单
                  </button>
                </div>

                {/* 确认函弹窗 */}
                {showConfirmLetterModal && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-[800px] max-h-[80vh] overflow-y-auto">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">订单确认函</h3>
                        <button
                          onClick={() => setShowConfirmLetterModal(false)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>

                      <div className="space-y-6">
                        {/* 订单基本信息 */}
                        <div className="border-b pb-4">
                          <h4 className="text-lg font-semibold mb-4">订单信息</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <div className="text-sm text-gray-500">订单号</div>
                              <div className="font-medium">{selectedOrder.orderNo}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-500">团队号</div>
                              <div className="font-medium">{selectedOrder.teamCode}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-500">客人姓名</div>
                              <div className="font-medium">{selectedOrder.guest}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-500">房型</div>
                              <div className="font-medium">{selectedOrder.room}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-500">入住日期</div>
                              <div className="font-medium">{selectedOrder.dateRange}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-500">订单状态</div>
                              <div className="font-medium">{selectedOrder.status}</div>
                            </div>
                          </div>
                        </div>

                        {/* 预订条款 */}
                        <div className="border-b pb-4">
                          <h4 className="text-lg font-semibold mb-4">预订条款</h4>
                          <div className="space-y-4">
                            <div>
                              <div className="font-medium mb-2">预订政策</div>
                              <div className="text-gray-600">预付订单，客人已支付房费，请贵酒店务必保留房间</div>
                            </div>
                            <div>
                              <div className="font-medium mb-2">取消政策</div>
                              <div className="text-gray-600">
                                <div>北京时间2025-05-09 20:00前 免费</div>
                                <div>北京时间2025-05-09 20:00后 1 晚房费</div>
                              </div>
                            </div>
                            <div>
                              <div className="font-medium mb-2">未入住政策</div>
                              <div className="text-gray-600">如果客人未入住，将根据取消政策进行扣除。</div>
                            </div>
                          </div>
                        </div>

                        {/* 客人权益 */}
                        <div>
                          <h4 className="text-lg font-semibold mb-4">客人权益</h4>
                          <div className="space-y-2 text-gray-600">
                            <div>客人未入住时，可在入住当天20:00:00前免费取消订单</div>
                            <div>客人享受订单全部房间离店时免费延迟退房至14:00</div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 flex justify-end">
                        <button
                          onClick={() => setShowConfirmLetterModal(false)}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                        >
                          关闭
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 取消订单确认弹窗 */}
                {showCancelModal && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-[600px]">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">取消订单确认</h3>
                        <button
                          onClick={() => setShowCancelModal(false)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>

                      <div className="space-y-4 mb-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm text-gray-500">订单号</div>
                            <div className="font-medium">{selectedOrder.orderNo}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">团队号</div>
                            <div className="font-medium">{selectedOrder.teamCode}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">客人姓名</div>
                            <div className="font-medium">{selectedOrder.guest}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">房型</div>
                            <div className="font-medium">{selectedOrder.room}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">入住日期</div>
                            <div className="font-medium">{selectedOrder.dateRange}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">订单状态</div>
                            <div className="font-medium">{selectedOrder.status}</div>
                          </div>
                        </div>

                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                          <div className="flex items-start">
                            <svg className="h-5 w-5 text-yellow-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <div className="text-sm text-yellow-700">
                              取消订单后，系统将根据取消政策计算退款金额。是否确认取消该订单？
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => setShowCancelModal(false)}
                          className="px-4 py-2 text-gray-600 hover:text-gray-800"
                        >
                          返回
                        </button>
                        <button
                          onClick={() => {
                            // TODO: 调用取消订单 API
                            setShowCancelModal(false);
                          }}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        >
                          确认取消
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 确认号编辑弹窗 */}
                {showConfirmNumberModal && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">编辑酒店确认号</h3>
                        <button
                          onClick={() => setShowConfirmNumberModal(false)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                      <div className="mb-4">
                        <input
                          type="text"
                          value={confirmNumber}
                          onChange={(e) => setConfirmNumber(e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="请输入酒店确认号"
                        />
                        <p className="mt-2 text-sm text-gray-500">
                          酒店确认号只能输入数字或字母，如有多个用逗号分割
                        </p>
                      </div>
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => setShowConfirmNumberModal(false)}
                          className="px-4 py-2 text-gray-600 hover:text-gray-800"
                        >
                          取消
                        </button>
                        <button
                          onClick={() => {
                            // 这里可以添加保存逻辑
                            setShowConfirmNumberModal(false);
                          }}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          保存
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-gray-400 mt-20">请选择左侧订单查看详情</div>
            )}
          </div>
        </div>
      </div>
    </TokenCheck>
  );
};

export default ReservationList; 