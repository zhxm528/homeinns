import React, { useState, useEffect } from 'react';
import { Row, Col, Input, Select, Button, Table, message, Modal, Space, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import TokenCheck from '../../components/common/TokenCheck';
import request from '../../utils/request';

// 功能状态枚举
const FUNCTION_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  DEPRECATED: 'DEPRECATED'
};

// 功能类型枚举
const FUNCTION_TYPE = {
  MENU: 'MENU',
  BUTTON: 'BUTTON',
  API: 'API',
  PAGE: 'PAGE'
};

// 接口类型定义
interface FunctionItem {
  functionId: string;
  functionName: string;
  functionCode: string;
  functionType: string;
  functionStatus: string;
  parentFunctionId: string;
  parentFunctionName: string;
  functionPath: string;
  functionIcon: string;
  functionSort: number;
  functionDescription: string;
  chainId: string;
  chainName: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

interface FunctionListRequest {
  functionName: string;
  functionCode: string;
  functionType: string;
  functionStatus: string;
  parentFunctionId: string;
  pageNum: number;
  pageSize: number;
}

interface FunctionListResponse {
  success: boolean;
  message: string;
  data: {
    total: number;
    pageSize: number;
    list: FunctionItem[];
    pageNum: number;
  };
}

const FunctionList: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<FunctionItem[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });
  const [searchForm, setSearchForm] = useState({
    functionName: '',
    functionCode: '',
    functionType: '',
    functionStatus: '',
    parentFunctionId: '',
  });

  // 获取用户信息
  const getUserInfo = () => {
    try {
      const userInfo = localStorage.getItem('user');
      return userInfo ? JSON.parse(userInfo) : null;
    } catch (error) {
      console.error('解析用户信息失败:', error);
      return null;
    }
  };

  // 获取功能列表
  const fetchFunctionList = async (params: any = {}) => {
    setLoading(true);
    try {
      const userInfo = getUserInfo();
      if (!userInfo?.chainId) {
        message.error('未获取到用户信息或chainId');
        return;
      }

      const requestBody: FunctionListRequest = {
        functionName: params.functionName || searchForm.functionName,
        functionCode: params.functionCode || searchForm.functionCode,
        functionType: params.functionType || searchForm.functionType,
        functionStatus: params.functionStatus || searchForm.functionStatus,
        parentFunctionId: params.parentFunctionId || searchForm.parentFunctionId,
        pageNum: pagination.current - 1,
        pageSize: pagination.pageSize,
      };

      console.log('=== 功能列表请求 ===');
      console.log('请求体:', JSON.stringify(requestBody, null, 2));

      const response = await request.post<FunctionListResponse>('/api/function/list', requestBody);
      
      console.log('=== 功能列表响应 ===');
      console.log('响应体:', JSON.stringify(response.data, null, 2));

      if (response.data.success) {
        const { total, pageSize, list, pageNum } = response.data.data;
        setData(list || []);
        setPagination(prev => ({
          ...prev,
          total: total || 0,
          current: (pageNum || 0) + 1,
        }));
      } else {
        message.error(response.data.message || '获取功能列表失败');
      }
    } catch (error: any) {
      console.error('获取功能列表异常:', error);
      message.error(error.response?.data?.message || error.message || '网络请求失败');
    } finally {
      setLoading(false);
    }
  };

  // 删除功能
  const handleDelete = (functionId: string, functionName: string) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除功能"${functionName}"吗？此操作不可恢复。`,
      okText: '确定',
      cancelText: '取消',
      okType: 'danger',
      onOk: async () => {
        try {
          const response = await request.delete(`/api/function/${functionId}`);
          if (response.data.status === 'success') {
            message.success('删除成功');
            fetchFunctionList();
          } else {
            message.error(response.data.message || '删除失败');
          }
        } catch (error: any) {
          console.error('删除功能异常:', error);
          message.error(error.response?.data?.message || error.message || '删除失败');
        }
      },
    });
  };

  // 处理搜索
  const handleSearch = () => {
    setPagination(prev => ({ ...prev, current: 1 }));
    fetchFunctionList();
  };

  // 重置搜索
  const handleReset = () => {
    setSearchForm({
      functionName: '',
      functionCode: '',
      functionType: '',
      functionStatus: '',
      parentFunctionId: '',
    });
    setPagination(prev => ({ ...prev, current: 1 }));
    fetchFunctionList({});
  };

  // 处理分页变化
  const handleTableChange = (pagination: any) => {
    setPagination(prev => ({
      ...prev,
      current: pagination.current,
      pageSize: pagination.pageSize,
    }));
  };

  // 获取功能状态文本
  const getFunctionStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      [FUNCTION_STATUS.ACTIVE]: '启用',
      [FUNCTION_STATUS.INACTIVE]: '禁用',
      [FUNCTION_STATUS.DEPRECATED]: '已废弃',
    };
    return statusMap[status] || status;
  };

  // 获取功能状态颜色
  const getFunctionStatusColor = (status: string) => {
    const colorMap: { [key: string]: string } = {
      [FUNCTION_STATUS.ACTIVE]: 'green',
      [FUNCTION_STATUS.INACTIVE]: 'red',
      [FUNCTION_STATUS.DEPRECATED]: 'orange',
    };
    return colorMap[status] || 'default';
  };

  // 获取功能类型文本
  const getFunctionTypeText = (type: string) => {
    const typeMap: { [key: string]: string } = {
      [FUNCTION_TYPE.MENU]: '菜单',
      [FUNCTION_TYPE.BUTTON]: '按钮',
      [FUNCTION_TYPE.API]: '接口',
      [FUNCTION_TYPE.PAGE]: '页面',
    };
    return typeMap[type] || type;
  };

  // 表格列定义
  const columns = [
    {
      title: '功能名称',
      dataIndex: 'functionName',
      key: 'functionName',
      width: 200,
      render: (text: string, record: FunctionItem) => (
        <div>
          <div className="font-medium">{text}</div>
          <div className="text-xs text-gray-500">{record.functionCode}</div>
        </div>
      ),
    },
    {
      title: '功能类型',
      dataIndex: 'functionType',
      key: 'functionType',
      width: 100,
      render: (type: string) => (
        <Tag color="blue">{getFunctionTypeText(type)}</Tag>
      ),
    },
    {
      title: '功能状态',
      dataIndex: 'functionStatus',
      key: 'functionStatus',
      width: 100,
      render: (status: string) => (
        <Tag color={getFunctionStatusColor(status)}>
          {getFunctionStatusText(status)}
        </Tag>
      ),
    },
    {
      title: '上级功能',
      dataIndex: 'parentFunctionName',
      key: 'parentFunctionName',
      width: 150,
      render: (text: string) => text || '-',
    },
    {
      title: '功能路径',
      dataIndex: 'functionPath',
      key: 'functionPath',
      width: 200,
      render: (text: string) => text || '-',
    },
    {
      title: '排序',
      dataIndex: 'functionSort',
      key: 'functionSort',
      width: 80,
      render: (sort: number) => sort || 0,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 160,
      render: (text: string) => text ? new Date(text).toLocaleString() : '-',
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right' as const,
      render: (text: string, record: FunctionItem) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => navigate(`/function/edit/${record.functionId}`)}
          >
            编辑
          </Button>
          <Button
            type="link"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.functionId, record.functionName)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  // 初始加载
  useEffect(() => {
    fetchFunctionList();
  }, [pagination.current, pagination.pageSize]);

  return (
    <TokenCheck>
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-lg shadow">
          {/* 页面标题 */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-semibold text-gray-900">功能管理</h1>
            </div>
          </div>

          {/* 搜索条件 */}
          <div className="px-6 py-4 border-b border-gray-200">
            <Row gutter={24} className="mb-4">
              <Col span={6}>
                <Input
                  placeholder="功能名称"
                  value={searchForm.functionName}
                  onChange={(e) => setSearchForm(prev => ({ ...prev, functionName: e.target.value }))}
                  allowClear
                  size="large"
                />
              </Col>
              <Col span={6}>
                <Input
                  placeholder="功能代码"
                  value={searchForm.functionCode}
                  onChange={(e) => setSearchForm(prev => ({ ...prev, functionCode: e.target.value }))}
                  allowClear
                  size="large"
                />
              </Col>
              <Col span={6}>
                <Select
                  placeholder="功能类型"
                  value={searchForm.functionType}
                  onChange={(value) => setSearchForm(prev => ({ ...prev, functionType: value }))}
                  allowClear
                  style={{ width: '100%' }}
                  size="large"
                  options={[
                    { value: FUNCTION_TYPE.MENU, label: '菜单' },
                    { value: FUNCTION_TYPE.BUTTON, label: '按钮' },
                    { value: FUNCTION_TYPE.API, label: '接口' },
                    { value: FUNCTION_TYPE.PAGE, label: '页面' },
                  ]}
                />
              </Col>
              <Col span={6}>
                <Select
                  placeholder="功能状态"
                  value={searchForm.functionStatus}
                  onChange={(value) => setSearchForm(prev => ({ ...prev, functionStatus: value }))}
                  allowClear
                  style={{ width: '100%' }}
                  size="large"
                  options={[
                    { value: FUNCTION_STATUS.ACTIVE, label: '启用' },
                    { value: FUNCTION_STATUS.INACTIVE, label: '禁用' },
                    { value: FUNCTION_STATUS.DEPRECATED, label: '已废弃' },
                  ]}
                />
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={6}>
                <Space>
                  <Button
                    type="primary"
                    icon={<SearchOutlined />}
                    onClick={handleSearch}
                    size="large"
                  >
                    搜索
                  </Button>
                  <Button
                    icon={<ReloadOutlined />}
                    onClick={handleReset}
                    size="large"
                  >
                    重置
                  </Button>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => navigate('/function/add')}
                    size="large"
                  >
                    新增功能
                  </Button>
                </Space>
              </Col>
            </Row>
          </div>

          {/* 数据表格 */}
          <div className="px-6 py-4">
            <Table
              columns={columns}
              dataSource={data}
              rowKey="functionId"
              loading={loading}
              pagination={{
                current: pagination.current,
                pageSize: pagination.pageSize,
                total: pagination.total,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
                pageSizeOptions: ['10', '20', '50', '100'],
              }}
              onChange={handleTableChange}
              scroll={{ x: 1200 }}
            />
          </div>
        </div>
      </div>
    </TokenCheck>
  );
};

export default FunctionList; 