import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Toast from '../../components/Toast';
import { TabContext } from '../../App';
import { API_BASE_URL } from '../../config';
import request from '../../utils/request';
import { Select, Button, Table, Spin, Collapse } from 'antd';
import StatusSelect from '../../components/common/StatusSelect';
import TokenCheck from '../../components/common/TokenCheck';

interface ToastMessage {
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ChannelRmtype {
  hotelCd: string;
  rmTypeCd: string;
}

interface SyncResponse {
  success: boolean;
  message: string;
  data: {
    channelRmtypes: ChannelRmtype[];
    resCode: number;
    resDesc: string;
  };
}

const ChainAdd: React.FC = () => {
  const navigate = useNavigate();
  const tabContext = useContext(TabContext);
  const { chainId } = useParams();
  const isEdit = Boolean(chainId);

  console.log('=== 页面初始化 ===');
  console.log('当前URL参数:', { chainId });
  console.log('页面模式:', isEdit ? '编辑模式' : '新增模式');
  console.log('当前路径:', window.location.pathname);

  const [formData, setFormData] = useState({
    chainId: '',
    chainCode: '',
    chainName: '',
    contactEmail: '',
    contactPhone: '',
    headquartersAddress: '',
    status: 1
  });
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [syncLoading, setSyncLoading] = useState(false);
  const [syncData, setSyncData] = useState<ChannelRmtype[]>([]);
  const [showSyncPanel, setShowSyncPanel] = useState(false);

  // 获取集团详情
  const fetchChainDetail = async () => {
    if (!isEdit) {
      console.log('新增模式，无需获取详情');
      return;
    }

    try {
      console.log('编辑模式，开始获取集团详情');
      console.log('获取集团详情 - 请求URL:', `/chain/${chainId}`);
      const res = await request.get(`/chain/${chainId}`);
      console.log('获取集团详情 - 响应数据:', JSON.stringify(res.data, null, 2));

      if (res.data) {
        const chainData = res.data;
        setFormData({
          chainId: chainData.chainId || '',
          chainCode: chainData.chainCode || '',
          chainName: chainData.chainName || '',
          contactEmail: chainData.contactEmail || '',
          contactPhone: chainData.contactPhone || '',
          headquartersAddress: chainData.headquartersAddress || '',
          status: chainData.status || 1
        });
        console.log('编辑回显chain对象:', JSON.stringify(chainData, null, 2));
      } else {
        showToast('获取集团详情失败：数据格式不正确', 'error');
      }
    } catch (error: any) {
      console.error('获取集团详情失败:', error);
      showToast(error.response?.data?.message || '获取集团详情失败', 'error');
    }
  };

  useEffect(() => {
    console.log('=== useEffect 执行 ===');
    console.log('当前模式:', isEdit ? '编辑模式' : '新增模式');
    console.log('chainId:', chainId);
    
    if (isEdit) {
      console.log('编辑模式，开始获取详情');
      fetchChainDetail();
    } else {
      console.log('新增模式，初始化空表单');
    }
  }, [chainId]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
  };

  // 检查是否显示同步酒店按钮
  const shouldShowSyncButton = () => {
    return ['JG', 'NY', 'JL','NH',  'YF', 'WX'].includes(formData.chainCode);
  };

  // 同步酒店数据
  const handleSyncHotels = async () => {
    try {
      setSyncLoading(true);
      console.log('=== 同步酒店数据 ===');
      console.log('请求URL:', '/api/homeinns/channel-rmtype');
      console.log('请求方法:', 'POST');
      
      const requestBody = {
        
      };
      
      console.log('请求体:', JSON.stringify(requestBody, null, 2));

      const response = await request.post('/api/homeinns/channel-rmtype', requestBody);
      
      console.log('=== 同步酒店响应 ===');
      console.log('响应数据:', JSON.stringify(response.data, null, 2));

      if (response.data.success) {
        const syncResponse: SyncResponse = response.data;
        setSyncData(syncResponse.data.channelRmtypes || []);
        setShowSyncPanel(true);
        showToast('同步酒店数据成功', 'success');
      } else {
        showToast(response.data.message || '同步酒店数据失败', 'error');
      }
    } catch (error: any) {
      console.error('同步酒店数据失败:', error);
      console.log('=== 错误详情 ===');
      console.log('错误响应数据:', JSON.stringify(error.response?.data, null, 2));
      console.log('错误状态码:', error.response?.status);
      console.log('错误信息:', error.message);
      console.log('================');
      showToast(error.response?.data?.message || '同步酒店数据失败', 'error');
    } finally {
      setSyncLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('=== 提交表单 ===');
    console.log('当前模式:', isEdit ? '编辑模式' : '新增模式');
    
    try {
      // 准备提交的数据
      const submitData = {
        chainId: formData.chainId,
        chainCode: formData.chainCode,
        chainName: formData.chainName,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        headquartersAddress: formData.headquartersAddress,
        status: formData.status
      };

      console.log('提交数据 - 请求体:', JSON.stringify(submitData, null, 2));

      if (isEdit) {
        // 更新
        console.log('编辑模式 - 更新集团');
        console.log('更新集团 - 请求URL:', '/chain/update');
        const res = await request.put(`/chain/update`, submitData);
        console.log('更新集团 - 响应数据:', JSON.stringify(res.data, null, 2));
        showToast(res.data.message || '更新集团成功', 'success');
      } else {
        // 新增
        console.log('新增模式 - 添加集团');
        console.log('新增集团 - 请求URL:', '/chain/add');
        const res = await request.post(`/chain/add`, submitData);
        console.log('新增集团 - 响应数据:', JSON.stringify(res.data, null, 2));
        showToast(res.data.message || '添加集团成功', 'success');
      }
      setTimeout(() => {
        if (tabContext && tabContext.removeTab) {
          if (isEdit) {
            tabContext.removeTab(`/chain/edit/${chainId}`);
          } else {
            tabContext.removeTab('/chain/add');
          }
        }
        if (tabContext && tabContext.setActiveTab) {
          tabContext.setActiveTab('/chain/list');
        }
        navigate('/chain/list');
      }, 1500);
    } catch (error: any) {
      showToast(error.response?.data?.message || (isEdit ? '更新集团失败' : '添加集团失败'), 'error');
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
        <div className="bg-white rounded shadow p-6">
          <h2 className="text-lg font-semibold mb-6">{isEdit ? '编辑集团' : '新增集团'}</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  集团代码 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  className="border rounded px-3 py-2 w-full"
                  value={formData.chainCode}
                  onChange={e => handleInputChange('chainCode', e.target.value)}
                  disabled={isEdit}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  集团名称 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  className="border rounded px-3 py-2 w-full"
                  value={formData.chainName}
                  onChange={e => handleInputChange('chainName', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  邮箱
                </label>
                <input
                  type="email"
                  className="border rounded px-3 py-2 w-full"
                  value={formData.contactEmail}
                  onChange={e => handleInputChange('contactEmail', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  电话
                </label>
                <input
                  type="tel"
                  className="border rounded px-3 py-2 w-full"
                  value={formData.contactPhone}
                  onChange={e => handleInputChange('contactPhone', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  地址
                </label>
                <input
                  type="text"
                  className="border rounded px-3 py-2 w-full"
                  value={formData.headquartersAddress}
                  onChange={e => handleInputChange('headquartersAddress', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  状态 <span className="text-red-500">*</span>
                </label>
                <StatusSelect
                  value={formData.status}
                  onChange={(value) => {
                    handleInputChange('status', value === undefined ? 1 : value);
                  }}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4">
              {shouldShowSyncButton() && (
                <Button
                  type="primary"
                  onClick={handleSyncHotels}
                  loading={syncLoading}
                  style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                  size="large"
                >
                  同步酒店
                </Button>
              )}
              <button
                type="button"
                onClick={() => {
                  if (tabContext && tabContext.removeTab) {
                    if (isEdit) {
                      tabContext.removeTab(`/chain/edit/${chainId}`);
                    } else {
                      tabContext.removeTab('/chain/add');
                    }
                  }
                  if (tabContext && tabContext.setActiveTab) {
                    tabContext.setActiveTab('/chain/list');
                  }
                  navigate('/chain/list');
                }}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                取消
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {isEdit ? '保存' : '新增'}
              </button>
            </div>
          </form>
        </div>

                {/* 酒店同步列表面板 */}
        {showSyncPanel && syncData.length > 0 && (
          <div className="bg-white rounded shadow p-6 mt-6">
            <h3 className="text-lg font-semibold mb-4">酒店同步列表</h3>
            <Table
              dataSource={syncData}
              columns={[
                {
                  title: '酒店代码',
                  dataIndex: 'hotelCd',
                  key: 'hotelCd',
                  width: 200,
                },
                {
                  title: '房型代码',
                  dataIndex: 'rmTypeCd',
                  key: 'rmTypeCd',
                  width: 200,
                }
              ]}
              rowKey={(record) => `${record.hotelCd}-${record.rmTypeCd}`}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
              }}
              size="middle"
              bordered
            />
          </div>
        )}
      </div>
    </TokenCheck>
  );
};

export default ChainAdd; 