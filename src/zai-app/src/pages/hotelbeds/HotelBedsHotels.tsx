import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaSync, FaPlus, FaMinus } from 'react-icons/fa';
import { RightOutlined } from '@ant-design/icons';
import Toast from '../../components/Toast';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import TokenCheck from '@/components/common/TokenCheck';

interface ToastMessage {
  message: string;
  type: 'success' | 'error' | 'info';
}

interface RoomType {
  roomCode: string;
  roomType: string;
  characteristicCode: string;
  minPax: number;
  maxPax: number;
  maxAdults: number;
  maxChildren: number;
  minAdults: number;
  roomFacilities: any[] | null;
  roomStays: {
    order: string;
    description: string;
    stayType: string;
    roomStayFacilities: any[] | null;
  }[];
}

interface HotelDetails {
  code: number;
  name: {
    content: string;
  };
  description: {
    content: string;
  };
  coordinates: {
    longitude: number;
    latitude: number;
  };
  address: {
    content: string;
    street: string;
  };
  city: {
    content: string;
  };
  email: string;
  phones: {
    phoneNumber: string;
    phoneType: string;
  }[];
  rooms: RoomType[];
  wildcards: {
    roomType: string;
    roomCode: string;
    characteristicCode: string;
    hotelRoomDescription: {
      content: string;
    };
  }[];
  ranking: number;
  countryCode: string;
  stateCode: string;
  destinationCode: string;
  zoneCode: number;
  categoryCode: string;
  categoryGroupCode: string;
  chainCode: string;
  accommodationTypeCode: string;
  boardCodes: string[];
  segmentCodes: string[];
  postalCode: string | null;
  lastUpdate: string;
  results: SearchResults | null;
}

interface HotelResult {
  timestamp: string;
  errorCode: number;
  message: string;
  response: string;
  hotelId: string;
  checkIn: string;
  checkOut: string;
}

interface HotelResultItem {
  hotelId: string;
  hotelCode: string;
  hotelName: string;
  hotel: HotelResult[];
}

interface SearchResults {
  timestamp: string;
  hotels: HotelResultItem[];
}

interface SyncErrorResponse {
  results: {
    timestamp: string;
    errorCode: number;
    message: string;
  };
}

interface SyncHotelResult {
  timestamp: string;
  errorCode: number;
  message: string;
  response: string;
  hotelId: string;
  checkIn: string;
  checkOut: string;
}

interface SyncHotel {
  hotelId: string;
  hotelCode: string;
  hotelName: string;
  hotel: SyncHotelResult[];
}

interface SyncResults {
  timestamp: string;
  hotels: SyncHotel[];
}

interface SyncResponseData {
  results: {
    results: SyncResults;
  }[];
}

const HotelBedsHotels: React.FC = () => {
  const [hotelCodes, setHotelCodes] = useState<string[]>(['']);
  const [isSearchPanelExpanded, setIsSearchPanelExpanded] = useState(true);
  const [hotelDetails, setHotelDetails] = useState<HotelDetails[]>([]);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
  const [syncResults, setSyncResults] = useState<SyncResults | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [expandedHotels, setExpandedHotels] = useState<Set<number>>(new Set());

  // 切换酒店详情的展开/收起状态
  const toggleHotelExpanded = (hotelCode: number) => {
    setExpandedHotels(prev => {
      const newSet = new Set(prev);
      if (newSet.has(hotelCode)) {
        newSet.delete(hotelCode);
      } else {
        newSet.add(hotelCode);
      }
      return newSet;
    });
  };

  // 显示消息提示
  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
  };

  // 添加酒店编号输入框
  const handleAddHotelCode = () => {
    setHotelCodes([...hotelCodes, '']);
  };

  // 删除酒店编号输入框
  const handleRemoveHotelCode = (index: number) => {
    if (hotelCodes.length > 1) {
      const newHotelCodes = hotelCodes.filter((_, i) => i !== index);
      setHotelCodes(newHotelCodes);
    }
  };

  // 更新酒店编号
  const handleHotelCodeChange = (index: number, value: string) => {
    const newHotelCodes = [...hotelCodes];
    newHotelCodes[index] = value;
    setHotelCodes(newHotelCodes);
  };

  // 查询酒店
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 过滤掉空的酒店编号
      const validHotelCodes = hotelCodes.filter(code => code.trim() !== '');
      if (validHotelCodes.length === 0) {
        showToast('请至少输入一个酒店编号', 'error');
        return;
      }

      // 从localStorage获取token
      const token = localStorage.getItem('token');
      if (!token) {
        showToast('未登录或登录已过期，请重新登录', 'error');
        return;
      }

      // 构建请求体
      const requestBody = validHotelCodes.map(code => ({
        id: code.trim()
      }));

      console.log('发送请求体:', JSON.stringify(requestBody, null, 2));

      // 调用后端API
      const response = await axios.post(
        `${API_BASE_URL}/api/hotelbeds/hotel/details`,
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data) {
        console.log('API返回数据:', JSON.stringify(response.data, null, 2));
        setHotelDetails(response.data);
        setSearchResults(response.data.results);
        showToast('查询成功', 'success');
      }
    } catch (error: any) {
      console.error('查询失败:', error);
      
      // 获取更详细的错误信息
      let errorMessage = '查询失败';
      if (error.response) {
        // 服务器返回了错误响应
        console.error('错误响应数据:', error.response.data);
        console.error('错误状态码:', error.response.status);
        errorMessage = `服务器错误 (${error.response.status}): ${error.response.data?.message || '未知错误'}`;
      } else if (error.request) {
        // 请求已发送但没有收到响应
        console.error('未收到响应:', error.request);
        errorMessage = '服务器未响应，请检查服务器是否正常运行';
      } else {
        // 请求配置出错
        console.error('请求错误:', error.message);
        errorMessage = `请求错误: ${error.message}`;
      }
      
      showToast(errorMessage, 'error');
    }
  };

  // 同步房型
  const handleSyncRooms = async () => {
    try {
      setIsSyncing(true);
      const token = localStorage.getItem('token');
      if (!token) {
        showToast('未登录或登录已过期，请重新登录', 'error');
        return;
      }

      // 构建请求体
      const requestBody = {
        hotelCodes: hotelDetails.map(hotel => hotel.code)
      };

      console.log('同步房型 - 请求体:', JSON.stringify(requestBody, null, 2));

      const response = await axios.post<SyncResponseData>(
        `${API_BASE_URL}/api/hotelbeds/hotel/initAllHotels`,
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      // 打印原始响应
      console.log('同步房型 - 原始响应:', response);
      console.log('同步房型 - 响应数据:', response.data);

      if (response.data && response.data.results && response.data.results.length > 0) {
        // 打印完整的响应体
        console.log('同步房型 - 完整响应体:', JSON.stringify(response.data, null, 2));
        
        // 获取第一个结果
        const firstResult = response.data.results[0].results;
        console.log('同步房型 - 处理结果:', JSON.stringify(firstResult, null, 2));
        
        setSyncResults(firstResult);
        showToast('同步成功', 'success');
      } else {
        console.log('同步房型 - 响应数据为空');
        showToast('同步失败：响应数据为空', 'error');
      }
    } catch (error: any) {
      console.error('同步失败:', error);
      
      // 打印错误响应的详细信息
      if (error.response) {
        console.error('错误响应状态:', error.response.status);
        console.error('错误响应头:', error.response.headers);
        console.error('错误响应体:', JSON.stringify(error.response.data, null, 2));
      } else if (error.request) {
        console.error('请求已发送但未收到响应:', error.request);
      } else {
        console.error('请求配置错误:', error.message);
      }
      
      let errorMessage = '同步失败';
      
      if (error.response?.data?.results?.message) {
        errorMessage = error.response.data.results.message;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      showToast(errorMessage, 'error');
      
      // 设置错误结果
      if (error.response?.data?.results) {
        setSyncResults({
          timestamp: error.response.data.results.timestamp || new Date().toLocaleString(),
          hotels: []
        });
      }
    } finally {
      setIsSyncing(false);
    }
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

      {/* 查询条件 Panel */}
      <div className="bg-white rounded shadow mb-4">
        <div 
          className="flex items-center justify-between p-4 cursor-pointer border-b"
          onClick={() => setIsSearchPanelExpanded(!isSearchPanelExpanded)}
        >
          <div className="flex items-center">
            <RightOutlined className={`mr-2 transition-transform duration-200 ${isSearchPanelExpanded ? 'rotate-90' : ''}`} />
            <h3 className="text-lg font-medium">HB酒店</h3>
          </div>
          {isSearchPanelExpanded ? <FaChevronUp /> : <FaChevronDown />}
        </div>
        {isSearchPanelExpanded && (
          <div className="p-4">
            <form onSubmit={handleSearch}>
              <div className="space-y-4">
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    HotelBeds 酒店编号
                  </label>
                </div>
                {hotelCodes.map((code, index) => (
                  <div key={index} className="flex items-end space-x-4">
                    <div className="flex-1">
                      <input
                        type="text"
                        className="border rounded px-3 py-2 w-full"
                        placeholder="请输入酒店编号"
                        value={code}
                        onChange={(e) => handleHotelCodeChange(index, e.target.value)}
                      />
                    </div>
                    {hotelCodes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveHotelCode(index)}
                        className="mb-1 p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded border border-red-200 hover:border-red-400 transition-colors duration-200"
                        title="删除"
                      >
                        <FaMinus />
                      </button>
                    )}
                  </div>
                ))}
                <div className="flex justify-between items-center">
                  <button
                    type="button"
                    onClick={handleAddHotelCode}
                    className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded border border-blue-200 hover:border-blue-400 transition-colors duration-200 px-4 py-2 flex items-center"
                  >
                    <FaPlus className="mr-2" />
                    添加酒店编号
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    查询
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* 查询结果 Panel */}
      {searchResults && (
        <div className="bg-white rounded shadow mb-4">
          <div className="p-4">
            <h3 className="text-lg font-medium mb-4">查询结果</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-gray-600 text-sm">
                    <th className="px-4 py-2 border">酒店代码</th>
                    <th className="px-4 py-2 border">酒店名称</th>
                    <th className="px-4 py-2 border">查询时间</th>
                    <th className="px-4 py-2 border">消息代码</th>
                    <th className="px-4 py-2 border">查询结果</th>
                    <th className="px-4 py-2 border">日期</th>
                  </tr>
                </thead>
                <tbody>
                  {searchResults.hotels.map((hotel) => (
                    hotel.hotel.map((result, index) => (
                      <tr key={`${hotel.hotelCode}-${index}`} className="hover:bg-gray-50">
                        <td className="px-4 py-2 border text-center">{hotel.hotelCode}</td>
                        <td className="px-4 py-2 border text-center">{hotel.hotelName}</td>
                        <td className="px-4 py-2 border text-center">{result.timestamp}</td>
                        <td className="px-4 py-2 border text-center">{result.errorCode}</td>
                        <td className="px-4 py-2 border text-center">{result.message}</td>
                        <td className="px-4 py-2 border text-center">{result.checkIn}</td>
                      </tr>
                    ))
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              查询时间：{searchResults.timestamp}
            </div>
          </div>
        </div>
      )}

      {/* 酒店详情 Panels */}
      {hotelDetails.map((hotel) => (
        <div key={hotel.code} className="bg-white rounded shadow mb-4">
          <div 
            className="flex items-center justify-between p-4 cursor-pointer border-b"
            onClick={() => toggleHotelExpanded(hotel.code)}
          >
            <div className="flex items-center">
              <RightOutlined className={`mr-2 transition-transform duration-200 ${expandedHotels.has(hotel.code) ? 'rotate-90' : ''}`} />
              <h3 className="text-lg font-medium">{hotel.name?.content || hotel.code}</h3>
            </div>
            {expandedHotels.has(hotel.code) ? <FaChevronUp /> : <FaChevronDown />}
          </div>
          {expandedHotels.has(hotel.code) && (
            <div className="p-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">酒店编号</label>
                  <div className="border rounded px-3 py-2 bg-gray-50">{hotel.code}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">酒店名称</label>
                  <div className="border rounded px-3 py-2 bg-gray-50">{hotel.name?.content || '-'}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">城市</label>
                  <div className="border rounded px-3 py-2 bg-gray-50">{hotel.city?.content || '-'}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">国家代码</label>
                  <div className="border rounded px-3 py-2 bg-gray-50">{hotel.countryCode || '-'}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
                  <div className="border rounded px-3 py-2 bg-gray-50">{hotel.email || '-'}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">电话</label>
                  <div className="border rounded px-3 py-2 bg-gray-50">
                    {hotel.phones && hotel.phones.length > 0 ? (
                      hotel.phones.map((phone, idx) => (
                        <div key={idx}>{phone.phoneNumber} ({phone.phoneType})</div>
                      ))
                    ) : (
                      '-'
                    )}
                  </div>
                </div>
              </div>

              {/* 地址单独占一行 */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">地址</label>
                <div className="border rounded px-3 py-2 bg-gray-50">{hotel.address?.content || '-'}</div>
              </div>

              {/* 描述单独占一行 */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
                <div className="border rounded px-3 py-2 bg-gray-50 whitespace-pre-line">{hotel.description?.content || '-'}</div>
              </div>

              {/* 房型列表 */}
              <div className="mt-6">
                <h4 className="text-lg font-medium mb-4">房型列表</h4>
                <table className="min-w-full table-auto border-collapse">
                  <thead>
                    <tr className="bg-gray-100 text-gray-600 text-sm">
                      <th className="px-4 py-2 border">房型代码</th>
                      <th className="px-4 py-2 border">房型名称</th>
                      <th className="px-4 py-2 border">最大入住人数</th>
                      <th className="px-4 py-2 border">最大成人</th>
                      <th className="px-4 py-2 border">最大儿童</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hotel.rooms && hotel.rooms.length > 0 ? (
                      hotel.rooms.map((room) => {
                        const wildcard = hotel.wildcards?.find(w => w.roomType === room.roomCode);
                        return (
                          <tr key={room.roomCode} className="hover:bg-gray-50">
                            <td className="px-4 py-2 border text-center">{room.roomCode}</td>
                            <td className="px-4 py-2 border text-center">
                              {wildcard?.hotelRoomDescription?.content || `${room.roomType} ${room.characteristicCode}`}
                            </td>
                            <td className="px-4 py-2 border text-center">{room.maxPax}</td>
                            <td className="px-4 py-2 border text-center">{room.maxAdults}</td>
                            <td className="px-4 py-2 border text-center">{room.maxChildren}</td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-4 py-2 border text-center text-gray-500">暂无房型数据</td>
                      </tr>
                    )}
                  </tbody>
                </table>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm text-gray-600">共 {hotel.rooms?.length || 0} 条数据</span>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* 统一的同步按钮 */}
      {hotelDetails.length > 0 && (
        <div className="flex justify-end mt-4">
          <button
            onClick={handleSyncRooms}
            disabled={isSyncing}
            className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center ${
              isSyncing ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSyncing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                同步中...
              </>
            ) : (
              <>
                <FaSync className="mr-2" />
                同步
              </>
            )}
          </button>
        </div>
      )}

      {/* 同步结果 Panel */}
      {syncResults && (
        <div className="mt-4 border rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 border-b">
            <div className="flex justify-between items-center">
              <h5 className="font-medium">同步结果</h5>
              <span className="text-sm text-gray-600">
                同步时间：{syncResults.timestamp}
              </span>
            </div>
          </div>
          <div className="p-4">
            {!syncResults.hotels || syncResults.hotels.length === 0 ? (
              <div className="text-center text-gray-500 py-4">
                暂无同步结果
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto border-collapse">
                  <thead>
                    <tr className="bg-gray-100 text-gray-600 text-sm">
                      <th className="px-4 py-2 border">酒店名称</th>
                      <th className="px-4 py-2 border">查询时间</th>
                      <th className="px-4 py-2 border">消息代码</th>
                      <th className="px-4 py-2 border">查询结果</th>
                      <th className="px-4 py-2 border">入住日期</th>
                      <th className="px-4 py-2 border">离店日期</th>
                    </tr>
                  </thead>
                  <tbody>
                    {syncResults.hotels.map((hotel) => (
                      hotel.hotel.map((result, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="px-4 py-2 border text-center">{hotel.hotelName}</td>
                          <td className="px-4 py-2 border text-center">{result.timestamp}</td>
                          <td className="px-4 py-2 border text-center">{result.errorCode}</td>
                          <td className="px-4 py-2 border text-center">
                            <span className={`px-2 py-1 rounded text-sm ${
                              result.errorCode === 1000 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {result.message}
                            </span>
                          </td>
                          <td className="px-4 py-2 border text-center">{result.checkIn}</td>
                          <td className="px-4 py-2 border text-center">{result.checkOut}</td>
                        </tr>
                      ))
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
    </TokenCheck>
  );
};

export default HotelBedsHotels; 