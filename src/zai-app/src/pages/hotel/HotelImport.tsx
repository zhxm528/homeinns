import React, { useState, useRef } from 'react';
import { FaUpload, FaDownload, FaTimes } from 'react-icons/fa';
import TokenCheck from '@/components/common/TokenCheck';
import ChainSelect from '@/components/common/ChainSelect';
import { message, Modal, Table, Button, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import request from '@/utils/request';

interface HotelData {
  hotelId: string;
  chainId: string;
  hotelCode: string;
  hotelName: string;
  address: string;
  contactPhone: string;
  status: number;
  resultType?: 'imported' | 'duplicate' | 'error';
}

interface ImportResponse {
  success: boolean;
  message: string;
  data: {
    importedHotels: HotelData[];
    duplicateHotels: HotelData[];
    errorHotels: HotelData[];
    totalCount: number;
    importedCount: number;
    duplicateCount: number;
    errorCount: number;
  };
}

const HotelImport: React.FC = () => {
  const [selectedChainId, setSelectedChainId] = useState<string>('');
  const [selectedChainName, setSelectedChainName] = useState<string>('');
  const [importResults, setImportResults] = useState<HotelData[]>([]);
  const [loading, setLoading] = useState(false);
  const [templateLoading, setTemplateLoading] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChainChange = (value: string) => {
    setSelectedChainId(value);
    // 根据选中的 chainId 获取对应的 chainName
    if (value) {
      // 从 localStorage 获取用户信息中的集团列表
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        // 这里需要根据实际情况获取集团名称
        // 暂时使用 chainId 作为名称，后续可以通过 API 获取
        setSelectedChainName(value);
      }
    } else {
      setSelectedChainName('');
    }
  };

  // 获取集团名称的函数
  const getChainName = async (chainId: string): Promise<string> => {
    try {
      const response = await request.get(`/chain/components/selectChainList?status=1`);
      if (response.data && Array.isArray(response.data)) {
        const chain = response.data.find((item: any) => item.chainId === chainId);
        return chain ? chain.chainName : chainId;
      }
      return chainId;
    } catch (error) {
      console.error('获取集团名称失败:', error);
      return chainId;
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 检查文件类型
      if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
        message.error('请选择Excel文件（.xlsx或.xls格式）');
        return;
      }
      
      // 检查文件大小（限制为10MB）
      if (file.size > 10 * 1024 * 1024) {
        message.error('文件大小不能超过10MB');
        return;
      }

      setFileList([file]);
    }
  };

  const handleImport = async () => {
    if (!selectedChainId) {
      message.error('请选择集团');
      return;
    }

    if (fileList.length === 0) {
      message.error('请选择要导入的Excel文件');
      return;
    }

    const file = fileList[0];
    
    try {
      setLoading(true);
      
      // 创建FormData
      const formData = new FormData();
      formData.append('file', file);
      formData.append('chainId', selectedChainId);

      console.log('=== 酒店导入请求信息 ===');
      console.log('请求URL:', '/api/hotel/import/parse');
      console.log('请求方法:', 'POST');
      console.log('集团ID:', selectedChainId);
      console.log('文件名:', file.name);
      console.log('文件大小:', file.size, 'bytes');
      console.log('========================');

      const response = await request.post('/api/hotel/import/parse', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('=== 酒店导入响应信息 ===');
      console.log('响应数据:');
      console.log(JSON.stringify(response.data, null, 2));
      console.log('========================');

      if (response.data.success) {
        const resultData = response.data.data;
        
        // 合并所有酒店数据用于显示
        const allHotels: HotelData[] = [
          ...resultData.importedHotels.map((hotel: HotelData) => ({ ...hotel, resultType: 'imported' })),
          ...resultData.duplicateHotels.map((hotel: HotelData) => ({ ...hotel, resultType: 'duplicate' })),
          ...resultData.errorHotels.map((hotel: HotelData) => ({ ...hotel, resultType: 'error' }))
        ];
        
        setImportResults(allHotels);
        
        Modal.success({
          title: '导入完成',
          content: (
            <div className="text-left">
              <p className="mb-2">导入结果：</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="font-medium">总数量：</div>
                <div>{resultData.totalCount}</div>
                <div className="font-medium">成功导入：</div>
                <div className="text-green-600">{resultData.importedCount}</div>
                <div className="font-medium">重复数据：</div>
                <div className="text-yellow-600">{resultData.duplicateCount}</div>
                <div className="font-medium">失败数量：</div>
                <div className="text-red-600">{resultData.errorCount}</div>
              </div>
            </div>
          ),
          width: 400,
          okText: '确定'
        });
      } else {
        message.error(response.data.message || '导入失败');
      }
    } catch (error: any) {
      console.error('导入失败:', error);
      console.log('=== 错误详情 ===');
      console.log('错误响应数据:', JSON.stringify(error.response?.data, null, 2));
      console.log('错误状态码:', error.response?.status);
      console.log('错误信息:', error.message);
      console.log('================');
      
      if (error.response) {
        if (error.response.status === 400) {
          message.error('文件格式错误或数据有误，请检查Excel文件格式');
        } else if (error.response.status === 401) {
          message.error('登录已过期，请重新登录');
        } else if (error.response.status === 403) {
          message.error('权限不足，无法执行导入操作');
        } else if (error.response.status === 413) {
          message.error('文件太大，请选择小于10MB的文件');
        } else if (error.response.status === 500) {
          message.error('服务器错误，请稍后重试');
        } else {
          message.error(error.response.data?.message || '导入失败，请稍后重试');
        }
      } else if (error.request) {
        message.error('网络连接失败，请检查网络设置');
      } else {
        message.error('导入失败，请稍后重试');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClearResults = () => {
    setImportResults([]);
    setFileList([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDownloadTemplate = async () => {
    if (!selectedChainId) {
      message.error('请先选择集团');
      return;
    }

    try {
      setTemplateLoading(true);
      console.log('=== 下载模板请求信息 ===');
      console.log('请求URL:', `/api/hotel/import/download/${selectedChainId}`);
      console.log('请求方法:', 'GET');
      console.log('集团ID:', selectedChainId);
      console.log('========================');

      const response = await request.get(`/api/hotel/import/download/${selectedChainId}`, {
        responseType: 'arraybuffer' // 设置响应类型为二进制数据
      });

      console.log('=== 下载模板响应信息 ===');
      console.log('响应状态:', response.status);
      console.log('响应头:', response.headers);
      console.log('数据大小:', response.data.byteLength, 'bytes');
      console.log('========================');

      // 获取集团名称
      const chainName = await getChainName(selectedChainId);

      // 后端返回的是文件流数据，直接处理为Blob
      const blob = new Blob([response.data], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' // Excel文件类型
      });
      
      // 创建下载链接
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      // 使用集团名称作为文件名
      const fileName = `${chainName}_酒店列表.xlsx`;
      link.setAttribute('download', fileName);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      message.success('模板下载成功');
    } catch (error: any) {
      console.error('下载模板失败:', error);
      console.log('=== 错误详情 ===');
      console.log('错误状态码:', error.response?.status);
      console.log('错误信息:', error.message);
      if (error.response?.data instanceof ArrayBuffer) {
        console.log('错误响应数据大小:', error.response.data.byteLength, 'bytes');
      } else {
        console.log('错误响应数据:', error.response?.data);
      }
      console.log('================');
      
      if (error.response) {
        if (error.response.status === 400) {
          message.error('请求参数错误，请检查集团ID');
        } else if (error.response.status === 401) {
          message.error('登录已过期，请重新登录');
        } else if (error.response.status === 403) {
          message.error('权限不足，无法下载模板');
        } else if (error.response.status === 404) {
          message.error('模板文件不存在');
        } else if (error.response.status === 500) {
          message.error('服务器错误，请稍后重试');
        } else {
          message.error(error.response.data?.message || '下载模板失败，请稍后重试');
        }
      } else if (error.request) {
        message.error('网络连接失败，请检查网络设置');
      } else {
        message.error('下载模板失败，请稍后重试');
      }
    } finally {
      setTemplateLoading(false);
    }
  };

  // 表格列定义
  const columns = [
    {
      title: '酒店代码',
      dataIndex: 'hotelCode',
      key: 'hotelCode',
      width: 120,
    },
    {
      title: '酒店名称',
      dataIndex: 'hotelName',
      key: 'hotelName',
      width: 200,
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
      width: 300,
    },
    {
      title: '电话',
      dataIndex: 'contactPhone',
      key: 'contactPhone',
      width: 150,
    },
    {
      title: '导入状态',
      dataIndex: 'resultType',
      key: 'resultType',
      width: 120,
      render: (resultType: string) => {
        if (resultType === 'imported') {
          return <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800">成功导入</span>;
        } else if (resultType === 'duplicate') {
          return <span className="px-2 py-1 rounded text-xs bg-yellow-100 text-yellow-800">重复数据</span>;
        } else if (resultType === 'error') {
          return <span className="px-2 py-1 rounded text-xs bg-red-100 text-red-800">导入失败</span>;
        }
        return <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-800">未知</span>;
      },
    },
    {
      title: '酒店状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: number) => (
        <span className={`px-2 py-1 rounded text-xs ${
          status === 1 
            ? 'bg-blue-100 text-blue-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {status === 1 ? '启用' : '停用'}
        </span>
      ),
    },
  ];

  return (
    <TokenCheck>
      <div className="p-6">
        {/* 上面的Panel - 输入项和按钮 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">酒店导入</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                选择集团 <span className="text-red-500">*</span>
              </label>
              <ChainSelect
                value={selectedChainId}
                onChange={handleChainChange}
                placeholder="请选择集团"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                选择Excel文件 <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center space-x-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 cursor-pointer flex items-center"
                >
                  <FaUpload className="mr-2" />
                  选择文件
                </label>
                {fileList.length > 0 && (
                  <span className="text-sm text-gray-600">
                    {fileList[0].name}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={handleImport}
              disabled={loading || !selectedChainId || fileList.length === 0}
              className={`px-6 py-2 rounded-lg flex items-center ${
                loading || !selectedChainId || fileList.length === 0
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  导入中...
                </>
              ) : (
                <>
                  <FaUpload className="mr-2" />
                  导入
                </>
              )}
            </button>

            <button
              onClick={handleDownloadTemplate}
              disabled={templateLoading || !selectedChainId}
              className={`px-4 py-2 border rounded-lg flex items-center ${
                templateLoading || !selectedChainId
                  ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                  : 'border-green-500 text-green-600 hover:bg-green-50'
              }`}
            >
              {templateLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-2"></div>
                  下载中...
                </>
              ) : (
                <>
                  <FaDownload className="mr-2" />
                  下载模板
                </>
              )}
            </button>

            <button
              onClick={handleClearResults}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center"
            >
              <FaTimes className="mr-2" />
              清空结果
            </button>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            <p>• 支持的文件格式：.xlsx, .xls</p>
            <p>• 文件大小限制：10MB</p>
            <p>• 请确保Excel文件格式正确，包含必要的列</p>
            <p>• 建议先下载模板，按照模板格式填写数据</p>
          </div>
        </div>

        {/* 下面的Panel - 响应结果表格 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">导入结果</h3>
          
          {importResults.length > 0 ? (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  共导入 {importResults.length} 条记录
                </div>
                <div className="text-sm">
                  <span className="text-green-600">
                    成功导入: {importResults.filter(r => r.resultType === 'imported').length}
                  </span>
                  <span className="mx-2">|</span>
                  <span className="text-yellow-600">
                    重复数据: {importResults.filter(r => r.resultType === 'duplicate').length}
                  </span>
                  <span className="mx-2">|</span>
                  <span className="text-red-600">
                    失败: {importResults.filter(r => r.resultType === 'error').length}
                  </span>
                </div>
              </div>
              
              <Table
                dataSource={importResults}
                columns={columns}
                rowKey={(record, index) => index?.toString() || '0'}
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) => 
                    `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
                }}
                scroll={{ x: 1200 }}
                size="middle"
              />
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <FaUpload className="text-4xl mx-auto mb-4 text-gray-300" />
              <p>暂无导入结果</p>
              <p className="text-sm mt-2">请先选择集团和Excel文件，然后点击导入按钮</p>
            </div>
          )}
        </div>
      </div>
    </TokenCheck>
  );
};

export default HotelImport;
