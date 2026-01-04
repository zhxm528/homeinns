import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaSearch, FaFileExcel } from 'react-icons/fa';
import { RightOutlined } from '@ant-design/icons';
import { DatePicker, Input, Row, Col, Card, Space, Button, Table, Tag, Spin } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import Toast from '../../components/Toast';
import request from '../../utils/request';
import TokenCheck from '@/components/common/TokenCheck';

interface ToastMessage {
  message: string;
  type: 'success' | 'error' | 'info';
}

interface PriceCheckRequest {
  hotels: string[];
  checkDate: string;
}

interface PriceCheckResult {
  hotelCode: string;
  hotelName: string;
  address: string;
  roomTypeNum: number;
  roomTypeCodes: string;
  price: string;
  checkDate: string;
  rateCode: string;
  inventory: string;
  status: string;
}

interface PriceCheckResponse {
  success: boolean;
  message: string;
  data: PriceCheckResult[];
}

const HotelBedsPriceCheck: React.FC = () => {
  const [priceCheck, setPriceCheck] = useState<PriceCheckRequest>({
    hotels: [],
    checkDate: '' 
  });
  const [isSearchPanelExpanded, setIsSearchPanelExpanded] = useState(true);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [searchResults, setSearchResults] = useState<PriceCheckResponse | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isExporting, setIsExporting] = useState(false);


  // 显示消息提示
  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
  };

  // 更新价格检查参数
  const handlePriceCheckChange = (field: keyof PriceCheckRequest, value: string | string[]) => {
    setPriceCheck(prev => ({ ...prev, [field]: value }));
  };

  // 查询价格
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 验证检查条件
      if (priceCheck.checkDate.trim() === '' || priceCheck.hotels.length === 0) {
        showToast('请填写完整的检查条件', 'error');
        return;
      }

      setIsSearching(true);

      // 构建请求体
      const requestBody = {
        hotels: priceCheck.hotels,
        checkDate: priceCheck.checkDate
      };

      console.log('发送酒店可用性检查请求:', JSON.stringify(requestBody, null, 2));

      // 调用后端API
      const response = await request.post('/api/hotelbeds/hotel/availability', requestBody);

      if (response.data) {
        setSearchResults(response.data);
        showToast('价格检查成功', 'success');
      }
    } catch (error: any) {
      console.error('价格检查失败:', error);
      
      // 获取更详细的错误信息
      let errorMessage = '价格检查失败';
      if (error.response) {
        console.error('错误响应数据:', error.response.data);
        console.error('错误状态码:', error.response.status);
        errorMessage = `服务器错误 (${error.response.status}): ${error.response.data?.message || '未知错误'}`;
      } else if (error.request) {
        console.error('未收到响应:', error.request);
        errorMessage = '服务器未响应，请检查服务器是否正常运行';
      } else {
        console.error('请求错误:', error.message);
        errorMessage = `请求错误: ${error.message}`;
      }
      
      showToast(errorMessage, 'error');
    } finally {
      setIsSearching(false);
    }
  };

  // 格式化日期显示
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // 格式化为 yyyy-MM-dd
  };

  // Excel导出功能
  const handleExportExcel = async () => {
    if (!searchResults || !searchResults.data || searchResults.data.length === 0) {
      showToast('没有数据可导出', 'error');
      return;
    }

    try {
      setIsExporting(true);

      // 构建请求体，包含表格中的所有数据
      const requestBody = {
        data: searchResults.data
      };

      console.log('发送Excel导出请求:', JSON.stringify(requestBody, null, 2));

      // 调用后端API
      const response = await request.post('/api/hotelbeds/hotel/export/excel', requestBody, {
        responseType: 'blob' // 设置响应类型为blob以处理文件下载
      });

      // 创建下载链接
      const blob = new Blob([response.data], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `HB价格检查结果_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      showToast('Excel导出成功', 'success');
    } catch (error: any) {
      console.error('Excel导出失败:', error);
      
      // 获取更详细的错误信息
      let errorMessage = 'Excel导出失败';
      if (error.response) {
        console.error('错误响应数据:', error.response.data);
        console.error('错误状态码:', error.response.status);
        errorMessage = `服务器错误 (${error.response.status}): ${error.response.data?.message || '未知错误'}`;
      } else if (error.request) {
        console.error('未收到响应:', error.request);
        errorMessage = '服务器未响应，请检查服务器是否正常运行';
      } else {
        console.error('请求错误:', error.message);
        errorMessage = `请求错误: ${error.message}`;
      }
      
      showToast(errorMessage, 'error');
    } finally {
      setIsExporting(false);
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

        {/* 页面标题 */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">HB价格检查</h1>
        </div>

        {/* 查询条件区域 */}
        <Card 
          title="查询条件" 
          className="mb-6"
          extra={
            <Button 
              type="text" 
              icon={isSearchPanelExpanded ? <FaChevronUp /> : <FaChevronDown />}
              onClick={() => setIsSearchPanelExpanded(!isSearchPanelExpanded)}
            />
          }
        >
          {isSearchPanelExpanded && (
            <form onSubmit={handleSearch}>
              <Row gutter={[16, 16]}>
                
                <Col xs={24} sm={24}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      酒店编码 *
                    </label>
                    <Input.TextArea
                      className="w-full"
                      placeholder="请输入酒店编码，支持英文逗号、中文逗号、空格、换行分隔"
                      value={priceCheck.hotels.join(', ')}
                      onChange={(e) => {
                        const hotelCodes = e.target.value
                          // 支持英文逗号、中文逗号、空格、换行分隔
                          .split(/[,，\s\n]+/)
                          .map(code => code.trim())
                          .filter(code => code !== '');
                        handlePriceCheckChange('hotels', hotelCodes);
                      }}
                      rows={4}
                    />
                  </div>
                </Col>
                <Col xs={24} sm={24}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      检查日期 *
                    </label>
                    <DatePicker
                      className="w-full"
                      placeholder="请选择检查日期"
                      value={priceCheck.checkDate ? dayjs(priceCheck.checkDate) : null}
                      onChange={(date: Dayjs | null) => {
                        const dateString = date ? date.format('YYYY-MM-DD') : '';
                        handlePriceCheckChange('checkDate', dateString);
                      }}
                      format="YYYY-MM-DD"
                    />
                  </div>
                </Col>
              </Row>
              
              {/* 操作按钮区域 */}
              <div className="mt-6">
                <Space>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={isSearching}
                    icon={<FaSearch />}
                    size="middle"
                  >
                    {isSearching ? '检查中...' : '检查价格'}
                  </Button>
                </Space>
              </div>
            </form>
          )}
        </Card>

        {/* 数据展示区域 */}
        {searchResults && searchResults.data && searchResults.data.length > 0 && (
          <Card title="价格检查结果">
            <Table
              dataSource={searchResults.data || []}
              rowKey={(record, index) => `row-${index}`}
              pagination={false}
              loading={isSearching}
              columns={[
                {
                  title: '酒店编号',
                  dataIndex: 'hotelCode',
                  key: 'hotelCode',
                  align: 'center',
                  width: 120,
                  render: (hotelCode) => hotelCode || '-',
                },
                {
                  title: '酒店名称',
                  dataIndex: 'hotelName',
                  key: 'hotelName',
                  align: 'left',
                  width: 200,
                  ellipsis: true,
                  render: (hotelName) => hotelName || '-',
                },
                {
                  title: '地址',
                  dataIndex: 'address',
                  key: 'address',
                  align: 'left',
                  width: 200,
                  ellipsis: true,
                },
                {
                  title: '房型数量',
                  dataIndex: 'roomTypeNum',
                  key: 'roomTypeNum',
                  align: 'center',
                  width: 100,
                },
                {
                  title: '房型代码',
                  dataIndex: 'roomTypeCodes',
                  key: 'roomTypeCodes',
                  align: 'left',
                  width: 300,
                  ellipsis: true,
                  render: (codes) => (
                    <div className="max-w-xs">
                      {codes}
                    </div>
                  ),
                },
                {
                  title: '价格',
                  dataIndex: 'price',
                  key: 'price',
                  align: 'center',
                  width: 100,
                  render: (price) => price || '-',
                },
                {
                  title: '检查日期',
                  dataIndex: 'checkDate',
                  key: 'checkDate',
                  align: 'center',
                  width: 120,
                  render: (date) => formatDate(date),
                },
                {
                  title: '价格代码',
                  dataIndex: 'rateCode',
                  key: 'rateCode',
                  align: 'center',
                  width: 120,
                },
                {
                  title: '库存',
                  dataIndex: 'inventory',
                  key: 'inventory',
                  align: 'center',
                  width: 80,
                },
                {
                  title: '状态',
                  dataIndex: 'status',
                  key: 'status',
                  align: 'center',
                  width: 100,
                  render: (status) => (
                    <Tag color={status === '需确认' ? 'warning' : 'default'}>
                      {status}
                    </Tag>
                  ),
                },
              ]}
              scroll={{ x: 1500 }}
            />
            
            {/* Excel导出按钮 */}
            <div className="mt-4 flex justify-end">
              <Button
                type="primary"
                icon={<FaFileExcel />}
                loading={isExporting}
                onClick={handleExportExcel}
                disabled={!searchResults || !searchResults.data || searchResults.data.length === 0}
              >
                {isExporting ? '导出中...' : 'Excel导出'}
              </Button>
            </div>
          </Card>
        )}
        </div>
      </TokenCheck>
    );
  };
  
  export default HotelBedsPriceCheck; 