import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaSave, FaTimes } from 'react-icons/fa';
import HotelSelect from '../../components/common/HotelSelect';
import request from '../../utils/request';
import { message } from 'antd';
import { TabContext } from '../../App';
import TokenCheck from '../../components/common/TokenCheck';

interface RoomTypeFormData {
  hotelId: string;
  roomTypeCode: string;
  roomTypeName: string;
  description: string;
  standardPrice: number;
  maxOccupancy: number;
  physicalInventory: number;
  roomTypeId?: string;
  status?: number;
}

const RoomTypeAdd: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const tabContext = useContext(TabContext);
  const isEditMode = location.pathname.includes('/edit/');
  const roomTypeId = location.pathname.split('/edit/')[1];

  const [formData, setFormData] = useState<RoomTypeFormData>({
    hotelId: '',
    roomTypeCode: '',
    roomTypeName: '',
    description: '',
    standardPrice: 0,
    maxOccupancy: 1,
    physicalInventory: 0
  });

  // 加载房型数据
  useEffect(() => {
    const fetchRoomTypeData = async () => {
      if (isEditMode && roomTypeId) {
        try {
          console.log('获取房型数据 - 请求URL:', `/api/roomtype/${roomTypeId}`);
          const response = await request.get(`/api/roomtype/${roomTypeId}`);
          console.log('获取房型数据 - 响应数据:', response.data);

          if (response.data.success) {
            const roomTypeData = response.data.data;
            setFormData({
              hotelId: roomTypeData.hotelId || '',
              roomTypeCode: roomTypeData.roomTypeCode || '',
              roomTypeName: roomTypeData.roomTypeName || '',
              description: roomTypeData.description || '',
              standardPrice: roomTypeData.standardPrice || 0,
              maxOccupancy: roomTypeData.maxOccupancy || 1,
              physicalInventory: roomTypeData.physicalInventory || 0
            });
          } else {
            message.error(response.data.message || '获取房型数据失败');
          }
        } catch (error) {
          console.error('获取房型数据失败:', error);
          if (error instanceof Error) {
            console.error('错误类型:', error.name);
            console.error('错误信息:', error.message);
            console.error('错误堆栈:', error.stack);
          }
          message.error('获取房型数据失败');
        }
      }
    };

    fetchRoomTypeData();
  }, [isEditMode, roomTypeId]);

  const handleInputChange = (field: keyof RoomTypeFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 验证必填字段
    if (!formData.hotelId) {
      message.error('请选择所属酒店');
      return;
    }
    if (!formData.roomTypeCode) {
      message.error('请输入房型代码');
      return;
    }
    if (!formData.roomTypeName) {
      message.error('请输入房型名称');
      return;
    }

    try {
      const userInfo = JSON.parse(localStorage.getItem('user') || '{}');
      
      const requestBody: RoomTypeFormData & { chainId: string } = {
        hotelId: formData.hotelId,
        chainId: userInfo.chainId,
        roomTypeCode: formData.roomTypeCode,
        roomTypeName: formData.roomTypeName,
        description: formData.description,
        standardPrice: formData.standardPrice,
        maxOccupancy: formData.maxOccupancy,
        physicalInventory: formData.physicalInventory,
        status: 1
      };

      if (isEditMode) {
        // 编辑模式
        requestBody.roomTypeId = roomTypeId;
        console.log('编辑房型 - 请求体:', JSON.stringify(requestBody, null, 2));
        const response = await request.put(`/api/roomtype/update`, requestBody);
        console.log('编辑房型 - 响应数据:', response.data);

        if (response.data.success) {
          message.success('编辑房型成功');
          setTimeout(() => {
            if (tabContext && tabContext.removeTab) {
              tabContext.removeTab(`/api/roomtype/edit/${roomTypeId}`);
            }
            if (tabContext && tabContext.setActiveTab) {
              tabContext.setActiveTab('/api/roomtype/list');
            }
            navigate('/api/roomtype/list');
          }, 1500);
        } else {
          message.error(response.data.message || '编辑房型失败');
        }
      } else {
        // 新增模式
        console.log('添加房型 - 请求体:', JSON.stringify(requestBody, null, 2));
        const response = await request.post('/api/roomtype/add', requestBody);
        console.log('添加房型 - 响应数据:', response.data);

        if (response.data.success) {
          message.success('添加房型成功');
          setTimeout(() => {
            if (tabContext && tabContext.removeTab) {
              tabContext.removeTab('/api/roomtype/add');
            }
            if (tabContext && tabContext.setActiveTab) {
              tabContext.setActiveTab('/api/roomtype/list');
            }
            navigate('/api/roomtype/list');
          }, 1500);
        } else {
          message.error(response.data.message || '添加房型失败');
        }
      }
    } catch (error) {
      console.error(isEditMode ? '编辑房型失败:' : '添加房型失败:', error);
      if (error instanceof Error) {
        console.error('错误类型:', error.name);
        console.error('错误信息:', error.message);
        console.error('错误堆栈:', error.stack);
      }
      message.error(isEditMode ? '编辑房型失败' : '添加房型失败');
    }
  };

  const handleCancel = () => {
    if (isEditMode) {
      if (tabContext && tabContext.removeTab) {
        tabContext.removeTab(`/api/roomtype/edit/${roomTypeId}`);
      }
    } else {
      if (tabContext && tabContext.removeTab) {
        tabContext.removeTab('/api/roomtype/add');
      }
    }
    if (tabContext && tabContext.setActiveTab) {
      tabContext.setActiveTab('/api/roomtype/list');
    }
    navigate('/api/roomtype/list');
  };

  return (
    <TokenCheck>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">{isEditMode ? '编辑房型' : '添加房型'}</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                所属酒店
                <span className="text-red-500 ml-1">*</span>
              </label>
              <HotelSelect
                value={formData.hotelId}
                onChange={(value) => handleInputChange('hotelId', value)}
                disabled={isEditMode}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                房型代码
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.roomTypeCode}
                onChange={(e) => handleInputChange('roomTypeCode', e.target.value)}
                placeholder="请输入房型代码"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                房型名称
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.roomTypeName}
                onChange={(e) => handleInputChange('roomTypeName', e.target.value)}
                placeholder="请输入房型名称"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">房型描述</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="请输入房型描述"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">标准房价</label>
              <input
                type="number"
                min="0"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.standardPrice}
                onChange={(e) => handleInputChange('standardPrice', Number(e.target.value))}
                placeholder="请输入标准房价"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">入住人数</label>
              <input
                type="number"
                min="1"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.maxOccupancy}
                onChange={(e) => handleInputChange('maxOccupancy', Number(e.target.value))}
                placeholder="请输入入住人数"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">房间数量</label>
              <input
                type="number"
                min="0"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.physicalInventory}
                onChange={(e) => handleInputChange('physicalInventory', Number(e.target.value))}
                placeholder="请输入房间数量"
              />
            </div>
          </div>

          <div className="flex justify-end mt-6 space-x-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center"
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
        </form>
      </div>
    </TokenCheck>
  );
};

export default RoomTypeAdd; 