import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaSync, FaPlus, FaMinus } from 'react-icons/fa';
import { RightOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import Toast from '../../components/Toast';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import TokenCheck from '../../components/common/TokenCheck';

interface ToastMessage {
  message: string;
  type: 'success' | 'error' | 'info';
}

interface HotelInfo {
  s_Hotel: string | null;
  s_HotelCd: string;
  s_HotelNm: string;
  s_HotelNm_En: string;
  s_HotelClass: string;
  s_HotelType: string;
  s_HotelNature: string;
  s_ContractNo: string;
  s_Address: string;
  s_sAddress: string;
  s_remarkAddress: string;
  s_Tel: string;
  s_Fax: string;
  s_Zip: string;
  s_Contact: string | null;
  s_Email: string;
  s_Notice: string;
  s_RJPMS: boolean;
  s_ResRoom: string | null;
  s_Region: string | null;
  s_RegionDes: string;
  s_ResvClass: string;
  s_BAuditD: string | null;
  s_TAuditD: string | null;
  s_Savetel: string | null;
  s_Savenet: string | null;
  s_CostPoint: string | null;
  s_AssessTp: boolean;
  s_HideWeekRate: boolean;
  s_CityCode: string;
  s_PayNet: boolean;
  s_Sort: number;
  s_SellerEmail: string;
  s_ArrdTime: string | null;
  s_UpperLimit_Discount: string | null;
  s_LowerLimit_Discount: string | null;
  s_HotelLevel: string | null;
  s_Detail: string;
  s_Toairport: string;
  s_ToStation: string;
  s_ToCenter: string;
  s_Sight: string;
  s_Establishment: string;
  s_Dish: string;
  s_BreakFast: string;
  s_Img: string;
  s_Map: string;
  s_Note: string;
  s_HotelOpen: string;
  s_Fitment: string;
  s_Card: string;
  s_PaymentTp: string;
  s_LandMarkCd: string;
  s_LandMarkNm: string;
  lon: number;
  lat: number;
  AverageNum: string;
  IncrementNum: string | null;
  CountNum: string;
  Decoration: string | null;
  point: string | null;
  s_HotelGroupCode: string;
  s_HotelStar: string;
  s_HotelGrade: string;
  Amap_Lon: number;
  Amap_Lat: number;
}

interface HotelResponse {
  HotelInfos: HotelInfo[];
  ResCode: number;
  ResDesc: string;
}

const HomeinnsHotels: React.FC = () => {
  const [hotelCodes, setHotelCodes] = useState<string[]>(['']);
  const [isSearchPanelExpanded, setIsSearchPanelExpanded] = useState(true);
  const [isSyncPanelExpanded, setIsSyncPanelExpanded] = useState(true);
  const [hotelDetails, setHotelDetails] = useState<HotelResponse[]>([]);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

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
      // 从localStorage获取token
      const token = localStorage.getItem('token');
      if (!token) {
        showToast('未登录或登录已过期，请重新登录', 'error');
        return;
      }

      // 过滤掉空的酒店编号
      const validHotelCodes = hotelCodes.filter(code => code.trim() !== '');
      if (validHotelCodes.length === 0) {
        showToast('请至少输入一个酒店编号', 'error');
        return;
      }

      // 构建请求体
      const requestBody = validHotelCodes.map(code => ({
        HotelCd: code.trim(),
        chainId: localStorage.getItem('chainId')
      }));

      console.log('发送请求体:', JSON.stringify(requestBody, null, 2));

      // 调用后端API
      const response = await axios.post(
        `${API_BASE_URL}/api/homeinns/hotel/details`,
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

  // 同步房间信息
  const handleSyncRooms = async (hotel: any) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showToast('未登录或登录已过期，请重新登录', 'error');
        return;
      }

      // 从 localStorage 获取用户信息
      const userInfo = JSON.parse(localStorage.getItem('user') || '{}');
      console.log('当前用户信息:', userInfo);

      const requestBody = {
        hotelCode: hotel.s_HotelCd,
        hotelName: hotel.s_HotelNm,
        hotelNameEn: hotel.s_HotelNm_En,
        hotelType: hotel.s_HotelType,
        hotelNature: hotel.s_HotelNature,
        contractNo: hotel.s_ContractNo,
        address: hotel.s_Address,
        tel: hotel.s_Tel,
        fax: hotel.s_Fax,
        zip: hotel.s_Zip,
        email: hotel.s_Email,
        cityCode: hotel.s_CityCode,
        landMarkCode: hotel.s_LandMarkCd,
        chainId: userInfo.chainId,
        description: hotel.s_Notice,
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

      console.log('保存酒店 - 请求体:', JSON.stringify(requestBody, null, 2));

      const response = await axios.post(
        `${API_BASE_URL}/api/homeinns/hotel/save`,
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data) {
        console.log('保存酒店 - 响应数据:', response.data);
        showToast('保存成功', 'success');
      }
    } catch (error: any) {
      console.error('保存失败:', error);
      showToast(error.response?.data?.message || '保存失败', 'error');
    }
  };

  // 同步所有酒店
  const handleSyncAllHotels = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showToast('未登录或登录已过期，请重新登录', 'error');
        return;
      }

      // 从 localStorage 获取用户信息
      const userInfo = JSON.parse(localStorage.getItem('user') || '{}');
      console.log('当前用户信息:', userInfo);

      // 显示确认对话框
      Modal.confirm({
        title: '确认同步',
        content: `系统将更新所有酒店，耗时较长（约10分钟），是否继续？`,
        okText: '确认',
        cancelText: '取消',
        onOk: async () => {
          try {
      const requestBody = {
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

      console.log('同步所有酒店 - 请求体:', JSON.stringify(requestBody, null, 2));

      const response = await axios.post(
        `${API_BASE_URL}/api/inithotels/getAllHotelRoomType`,
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data) {
        console.log('同步所有酒店 - 响应数据:', response.data);
        showToast('同步成功', 'success');
      }
          } catch (error: any) {
            console.error('同步失败:', error);
            showToast(error.response?.data?.message || '同步失败', 'error');
          }
        }
      });
    } catch (error: any) {
      console.error('同步失败:', error);
      showToast(error.response?.data?.message || '同步失败', 'error');
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
            <h3 className="text-lg font-medium">如家酒店</h3>
          </div>
          {isSearchPanelExpanded ? <FaChevronUp /> : <FaChevronDown />}
        </div>
        {isSearchPanelExpanded && (
          <div className="p-4">
            <form onSubmit={handleSearch}>
              <div className="space-y-4">
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    如家酒店编号
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

      {/* 同步所有酒店 Panel */}
      <div className="bg-white rounded shadow mb-4">
        <div 
          className="flex items-center justify-between p-4 cursor-pointer border-b"
          onClick={() => setIsSyncPanelExpanded(!isSyncPanelExpanded)}
        >
          <div className="flex items-center">
            <RightOutlined className={`mr-2 transition-transform duration-200 ${isSyncPanelExpanded ? 'rotate-90' : ''}`} />
            <h3 className="text-lg font-medium">同步管理</h3>
          </div>
          {isSyncPanelExpanded ? <FaChevronUp /> : <FaChevronDown />}
        </div>
        {isSyncPanelExpanded && (
          <div className="p-4">
            <div className="flex justify-end">
              <button
                onClick={handleSyncAllHotels}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
              >
                <FaSync className="mr-2" />
                同步所有酒店
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 酒店详情 Panels */}
      {hotelDetails.map((response, index) => (
        response.HotelInfos.map((hotel) => (
          <div key={hotel.s_HotelCd} className="bg-white rounded shadow mb-4">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">酒店信息</h3>
                <button
                  onClick={() => handleSyncRooms(hotel)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
                >
                  <FaSync className="mr-2" />
                  保存
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">酒店编号</label>
                  <div className="border rounded px-3 py-2 bg-gray-50">{hotel.s_HotelCd}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">酒店名称</label>
                  <div className="border rounded px-3 py-2 bg-gray-50">{hotel.s_HotelNm}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">英文名称</label>
                  <div className="border rounded px-3 py-2 bg-gray-50">{hotel.s_HotelNm_En}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">酒店类型</label>
                  <div className="border rounded px-3 py-2 bg-gray-50">{hotel.s_HotelType}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">酒店性质</label>
                  <div className="border rounded px-3 py-2 bg-gray-50">{hotel.s_HotelNature}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">合同编号</label>
                  <div className="border rounded px-3 py-2 bg-gray-50">{hotel.s_ContractNo}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">地址</label>
                  <div className="border rounded px-3 py-2 bg-gray-50">{hotel.s_Address}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">电话</label>
                  <div className="border rounded px-3 py-2 bg-gray-50">{hotel.s_Tel}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">传真</label>
                  <div className="border rounded px-3 py-2 bg-gray-50">{hotel.s_Fax}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">邮编</label>
                  <div className="border rounded px-3 py-2 bg-gray-50">{hotel.s_Zip}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
                  <div className="border rounded px-3 py-2 bg-gray-50">{hotel.s_Email}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">城市代码</label>
                  <div className="border rounded px-3 py-2 bg-gray-50">{hotel.s_CityCode}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">地标代码</label>
                  <div className="border rounded px-3 py-2 bg-gray-50">{hotel.s_LandMarkCd}</div>
                </div>
              </div>

              {/* 备注单独占一行 */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">备注</label>
                <div className="border rounded px-3 py-2 bg-gray-50 whitespace-pre-line">{hotel.s_Notice}</div>
              </div>
            </div>
          </div>
        ))
      ))}
    </div>
    </TokenCheck>
  );
};

export default HomeinnsHotels; 