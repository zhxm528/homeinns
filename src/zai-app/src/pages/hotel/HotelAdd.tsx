import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSave, FaTimes, FaStar } from 'react-icons/fa';
import TokenCheck from '@/components/common/TokenCheck';
import CitySelect from '@/components/common/CitySelect';
import StatusSelect from '@/components/common/StatusSelect';
import PmsSelect from '@/components/common/PmsSelect';
import PropertyTypeSelect from '@/components/common/PropertyTypeSelect';
import ManageTypeSelect from '@/components/common/ManageTypeSelect';
import ChainSelect from '@/components/common/ChainSelect';
import axios from 'axios';
import { message, Modal, DatePicker } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { API_BASE_URL } from '@/config';
import request from '@/utils/request';
import { TabContext } from '../../App';

interface HotelFormData {
  hotelId: string;
  chainId: string;
  hotelCode: string;
  hotelName: string;
  address: string;
  description: string;
  cityId: string;
  country: string;
  status: number;
  contactEmail: string;
  contactPhone: string;
  ownershipType: string;
  managementModel: string;
  managementCompany: string;
  brand: string;
  region: string;
  cityArea: string;
  pmsVersion: string;
  openingDate: string;
  lastRenovationDate: string;
  closureDate: string;
  totalPhysicalRooms: number;
  basePrice: number;
  thresholdPrice: number;
  breakfastPrice: number;
  parkingPrice: number;
}

const HotelAdd: React.FC = () => {
  const navigate = useNavigate();
  const tabContext = useContext(TabContext);
  const [loading, setLoading] = useState(false);



  const [formData, setFormData] = useState<HotelFormData>({
    hotelId: '',
    chainId: '',
    hotelCode: '',
    hotelName: '',
    address: '',
    description: '',
    cityId: '',
    country: '',
    status: 1,
    contactEmail: '',
    contactPhone: '',
    ownershipType: '',
    managementModel: '',
    managementCompany: '',
    brand: '',
    region: '',
    cityArea: '',
    pmsVersion: '',
    openingDate: '',
    lastRenovationDate: '',
    closureDate: '',
    totalPhysicalRooms: 0,
    basePrice: 0,
    thresholdPrice: 0,
    breakfastPrice: 0,
    parkingPrice: 0
  });



  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 新增：处理数字输入
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = value === '' ? 0 : parseFloat(value) || 0;
    setFormData(prev => ({
      ...prev,
      [name]: numValue
    }));
  };

  const handleCityChange = (value: string | undefined) => {
    setFormData(prev => ({
      ...prev,
      cityId: value || ''
    }));
  };

  const handleStatusChange = (value: number | undefined) => {
    setFormData(prev => ({
      ...prev,
      status: value || 1
    }));
  };

  const handlePmsChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      pmsVersion: value
    }));
  };

  const handlePropertyTypeChange = (value: string | undefined) => {
    setFormData(prev => ({
      ...prev,
      ownershipType: value || ''
    }));
  };

  const handleManageTypeChange = (value: string | undefined) => {
    setFormData(prev => ({
      ...prev,
      managementModel: value || ''
    }));
  };

  const handleChainChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      chainId: value
    }));
  };

  const handleDateChange = (field: string, date: dayjs.Dayjs | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: date ? date.format('YYYY-MM-DD') : ''
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        message.error('未登录或登录已过期，请重新登录');
        return;
      }

      // 表单验证
      if (!formData.chainId) {
        message.error('请选择所属集团');
        return;
      }
      if (!formData.hotelCode) {
        message.error('请输入酒店代码');
        return;
      }
      if (!formData.hotelName) {
        message.error('请输入酒店名称');
        return;
      }

      // 构建请求体
      const requestBody = {
        chainId: formData.chainId,
        hotelCode: formData.hotelCode.trim(),
        hotelName: formData.hotelName.trim(),
        address: formData.address.trim(),
        description: formData.description.trim(),
        cityId: formData.cityId,
        country: formData.country.trim(),
        status: formData.status,
        contactEmail: formData.contactEmail.trim(),
        contactPhone: formData.contactPhone.trim(),
        ownershipType: formData.ownershipType.trim(),
        managementModel: formData.managementModel.trim(),
        managementCompany: formData.managementCompany.trim(),
        brand: formData.brand.trim(),
        region: formData.region.trim(),
        cityArea: formData.cityArea.trim(),
        pmsVersion: formData.pmsVersion.trim(),
        openingDate: formData.openingDate.trim(),
        lastRenovationDate: formData.lastRenovationDate.trim(),
        closureDate: formData.closureDate.trim(),
        totalPhysicalRooms: formData.totalPhysicalRooms,
        basePrice: formData.basePrice,
        thresholdPrice: formData.thresholdPrice,
        breakfastPrice: formData.breakfastPrice,
        parkingPrice: formData.parkingPrice
      };

      // 打印请求体
      console.log('=== 新增酒店请求信息 ===');
      console.log('请求URL:', '/api/hotel/add');
      console.log('请求方法:', 'POST');
      console.log('请求体:');
      console.log(JSON.stringify(requestBody, null, 2));
      console.log('========================');

      const response = await request.post(
        '/api/hotel/add',
        requestBody
      );

      // 打印返回消息体
      console.log('=== 保存酒店响应信息 ===');
      console.log('响应数据:');
      console.log(JSON.stringify(response.data, null, 2));
      console.log('========================');

      if (response.data.success) {
        const hotelData = response.data.data;
        Modal.success({
          title: '新增成功',
          content: (
            <div className="text-left">
              <p className="mb-2">酒店信息已新增：</p>
              <div className="grid grid-cols-2 gap-2 text-sm">                
                {hotelData.hotelCode && (
                  <>
                    <div className="font-medium">酒店代码：</div>
                    <div>{hotelData.hotelCode}</div>
                  </>
                )}
                {hotelData.hotelName && (
                  <>
                    <div className="font-medium">酒店名称：</div>
                    <div>{hotelData.hotelName}</div>
                  </>
                )}
                {hotelData.address && (
                  <>
                    <div className="font-medium">地址：</div>
                    <div>{hotelData.address}</div>
                  </>
                )}
                {hotelData.description && (
                  <>
                    <div className="font-medium">描述：</div>
                    <div>{hotelData.description}</div>
                  </>
                )}
                {hotelData.cityId && (
                  <>
                    <div className="font-medium">城市ID：</div>
                    <div>{hotelData.cityId}</div>
                  </>
                )}
                {hotelData.country && (
                  <>
                    <div className="font-medium">国家：</div>
                    <div>{hotelData.country}</div>
                  </>
                )}
                {hotelData.status && (
                  <>
                    <div className="font-medium">状态：</div>
                    <div>{hotelData.status === 1 ? '启用' : '停用'}</div>
                  </>
                )}
                {hotelData.contactEmail && (
                  <>
                    <div className="font-medium">邮箱：</div>
                    <div>{hotelData.contactEmail}</div>
                  </>
                )}
                {hotelData.contactPhone && (
                  <>
                    <div className="font-medium">电话：</div>
                    <div>{hotelData.contactPhone}</div>
                  </>
                )}
                {hotelData.ownershipType && (
                  <>
                    <div className="font-medium">所有权类型：</div>
                    <div>{hotelData.ownershipType}</div>
                  </>
                )}
                {hotelData.managementModel && (
                  <>
                    <div className="font-medium">管理模式：</div>
                    <div>{hotelData.managementModel}</div>
                  </>
                )}
                {hotelData.managementCompany && (
                  <>
                    <div className="font-medium">管理公司：</div>
                    <div>{hotelData.managementCompany}</div>
                  </>
                )}
                {hotelData.brand && (
                  <>
                    <div className="font-medium">品牌：</div>
                    <div>{hotelData.brand}</div>
                  </>
                )}
                {hotelData.region && (
                  <>
                    <div className="font-medium">区域：</div>
                    <div>{hotelData.region}</div>
                  </>
                )}
                {hotelData.cityArea && (
                  <>
                    <div className="font-medium">城市区域：</div>
                    <div>{hotelData.cityArea}</div>
                  </>
                )}
                {hotelData.pmsVersion && (
                  <>
                    <div className="font-medium">PMS版本：</div>
                    <div>{hotelData.pmsVersion}</div>
                  </>
                )}
                {hotelData.openingDate && (
                  <>
                    <div className="font-medium">开业日期：</div>
                    <div>{hotelData.openingDate}</div>
                  </>
                )}
                {hotelData.lastRenovationDate && (
                  <>
                    <div className="font-medium">最近装修日期：</div>
                    <div>{hotelData.lastRenovationDate}</div>
                  </>
                )}
                {hotelData.closureDate && (
                  <>
                    <div className="font-medium">关闭日期：</div>
                    <div>{hotelData.closureDate}</div>
                  </>
                )}
                {hotelData.totalPhysicalRooms && (
                  <>
                    <div className="font-medium">房间总数：</div>
                    <div>{hotelData.totalPhysicalRooms}</div>
                  </>
                )}
                {hotelData.basePrice && (
                  <>
                    <div className="font-medium">基础价格：</div>
                    <div>¥{hotelData.basePrice.toFixed(2)}</div>
                  </>
                )}
                {hotelData.thresholdPrice && (
                  <>
                    <div className="font-medium">阈值价格：</div>
                    <div>¥{hotelData.thresholdPrice.toFixed(2)}</div>
                  </>
                )}
                {hotelData.breakfastPrice && (
                  <>
                    <div className="font-medium">早餐价格：</div>
                    <div>¥{hotelData.breakfastPrice.toFixed(2)}</div>
                  </>
                )}
                {hotelData.parkingPrice && (
                  <>
                    <div className="font-medium">停车价格：</div>
                    <div>¥{hotelData.parkingPrice.toFixed(2)}</div>
                  </>
                )}
                {hotelData.createdAt && (
                  <>
                    <div className="font-medium">创建时间：</div>
                    <div>{hotelData.createdAt}</div>
                  </>
                )}
                {hotelData.updatedAt && (
                  <>
                    <div className="font-medium">更新时间：</div>
                    <div>{hotelData.updatedAt}</div>
                  </>
                )}
              </div>
            </div>
          ),
          width: 600,
          okText: '关闭',
          onOk: () => {
        navigate('/hotel/list');
          }
        });
      } else {
        Modal.error({
          title: '保存失败',
          content: response.data.message || '保存失败',
          okText: '关闭'
        });
      }
    } catch (error: any) {
      console.error('保存失败:', error);
      console.log('=== 错误详情 ===');
      console.log('错误响应数据:', JSON.stringify(error.response?.data, null, 2));
      console.log('错误状态码:', error.response?.status);
      console.log('错误信息:', error.message);
      console.log('================');
      
      if (error.response) {
        // 服务器返回错误响应
        if (error.response.status === 400) {
          if (error.response.data.message?.includes('酒店代码')) {
            Modal.error({
              title: '酒店代码重复',
              content: '该酒店代码已存在，请修改酒店代码',
              okText: '关闭',
              onOk: () => {
                // 聚焦到酒店代码输入框
                const hotelCodeInput = document.querySelector('input[name="hotelCode"]') as HTMLInputElement;
                if (hotelCodeInput) {
                  hotelCodeInput.focus();
                  hotelCodeInput.select();
                }
              }
            });
          } else {
            Modal.error({
              title: '输入数据有误',
              content: error.response.data.message || '请检查输入数据后重试',
              okText: '关闭'
            });
          }
        } else if (error.response.status === 401) {
          Modal.error({
            title: '登录已过期',
            content: '请重新登录',
            okText: '关闭',
            onOk: () => {
            navigate('/login');
            }
          });
        } else if (error.response.status === 403) {
          Modal.error({
            title: '权限不足',
            content: '没有权限执行此操作',
            okText: '关闭'
          });
        } else if (error.response.status === 500) {
          Modal.error({
            title: '服务器错误',
            content: '请稍后重试',
            okText: '关闭'
          });
        } else {
          Modal.error({
            title: '新增失败',
            content: error.response.data.message || '请稍后重试',
            okText: '关闭'
          });
        }
      } else if (error.request) {
        // 请求发送失败
        Modal.error({
          title: '网络连接失败',
          content: '请检查网络设置或联系管理员',
          okText: '关闭'
        });
      } else {
        // 其他错误
        Modal.error({
          title: '新增失败',
          content: '请稍后重试',
          okText: '关闭'
        });
      }
    }
  };

  const handleCancel = () => {
    if (!tabContext) return;
    
    // 关闭当前tab
    tabContext.removeTab('/hotel/add');
    
    // 打开酒店列表tab
    tabContext.addTab({
      id: '/hotel/list',
      title: '酒店列表',
      path: '/hotel/list',
    });
  };

  const handleSetDefaultHotel = async () => {
    message.info('请先保存酒店信息后再设置默认酒店');
  };

  return (
    <TokenCheck>
    <div className="p-6">
      

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">所属集团 <span className="text-red-500">*</span></label>
              <ChainSelect
                value={formData.chainId}
                onChange={handleChainChange}
                placeholder="请选择所属集团"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">酒店代码 <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="hotelCode"
                value={formData.hotelCode}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">酒店名称 <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="hotelName"
                value={formData.hotelName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">地址</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">城市</label>
              <CitySelect
                value={formData.cityId}
                onChange={handleCityChange}
                placeholder="请选择城市"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">国家</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="请输入国家"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">电话</label>
              <input
                type="tel"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">状态</label>
              <StatusSelect
                value={formData.status}
                onChange={handleStatusChange}
                placeholder="请选择状态"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">产权类型</label>
              <PropertyTypeSelect
                value={formData.ownershipType}
                onChange={handlePropertyTypeChange}
                placeholder="请选择产权类型"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">管理模式</label>
              <ManageTypeSelect
                value={formData.managementModel}
                onChange={handleManageTypeChange}
                placeholder="请选择管理模式"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">管理公司</label>
              <input
                type="text"
                name="managementCompany"
                value={formData.managementCompany}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="请输入管理公司"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">品牌</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="请输入品牌"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">大区</label>
              <input
                type="text"
                name="region"
                value={formData.region}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="请输入区域"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">城区</label>
              <input
                type="text"
                name="cityArea"
                value={formData.cityArea}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="请输入城市区域"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">PMS版本</label>
              <PmsSelect
                value={formData.pmsVersion}
                onChange={handlePmsChange}
                placeholder="请选择PMS版本"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">开业日期</label>
              <DatePicker
                value={formData.openingDate ? dayjs(formData.openingDate) : null}
                onChange={(date) => handleDateChange('openingDate', date)}
                placeholder="请选择开业日期"
                style={{ width: '100%' }}
                size="large"
                format="YYYY-MM-DD"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">最近装修日期</label>
              <DatePicker
                value={formData.lastRenovationDate ? dayjs(formData.lastRenovationDate) : null}
                onChange={(date) => handleDateChange('lastRenovationDate', date)}
                placeholder="请选择最近装修日期"
                style={{ width: '100%' }}
                size="large"
                format="YYYY-MM-DD"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">关闭日期</label>
              <DatePicker
                value={formData.closureDate ? dayjs(formData.closureDate) : null}
                onChange={(date) => handleDateChange('closureDate', date)}
                placeholder="请选择关闭日期"
                style={{ width: '100%' }}
                size="large"
                format="YYYY-MM-DD"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">房间总数</label>
              <input
                type="number"
                name="totalPhysicalRooms"
                value={formData.totalPhysicalRooms}
                onChange={handleNumberChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                placeholder="请输入房间总数"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">基础价格 (¥)</label>
              <input
                type="number"
                name="basePrice"
                value={formData.basePrice}
                onChange={handleNumberChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                step="0.01"
                placeholder="请输入基础价格"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">阈值价格 (¥)</label>
              <input
                type="number"
                name="thresholdPrice"
                value={formData.thresholdPrice}
                onChange={handleNumberChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                step="0.01"
                placeholder="请输入阈值价格"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">早餐价格 (¥)</label>
              <input
                type="number"
                name="breakfastPrice"
                value={formData.breakfastPrice}
                onChange={handleNumberChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                step="0.01"
                placeholder="请输入早餐价格"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">停车价格 (¥)</label>
              <input
                type="number"
                name="parkingPrice"
                value={formData.parkingPrice}
                onChange={handleNumberChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                step="0.01"
                placeholder="请输入停车价格"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end mt-6 space-x-2">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center"
            >
              <FaTimes className="mr-2" />
              取消
            </button>
            <button
              type="button"
              onClick={handleSetDefaultHotel}
              className="px-4 py-2 border border-yellow-500 rounded-lg text-yellow-600 hover:bg-yellow-50 flex items-center"
            >
              <FaStar className="mr-2" />
              设为默认酒店
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
    </div>
    </TokenCheck>
  );
};

export default HotelAdd; 