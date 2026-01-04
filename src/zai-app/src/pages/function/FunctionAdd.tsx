import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, Card, message, Space, Row, Col } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
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
}

interface FunctionAddRequest {
  chainId: string;
  functionName: string;
  functionCode: string;
  functionType: string;
  functionStatus: string;
  parentFunctionId?: string;
  functionPath?: string;
  functionIcon?: string;
  functionSort?: number;
  functionDescription?: string;
}

const FunctionAdd: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [parentFunctions, setParentFunctions] = useState<FunctionItem[]>([]);
  const [parentLoading, setParentLoading] = useState(false);

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

  // 获取上级功能列表
  const fetchParentFunctions = async () => {
    setParentLoading(true);
    try {
      const userInfo = getUserInfo();
      if (!userInfo?.chainId) {
        message.error('未获取到用户信息或chainId');
        return;
      }

      const response = await request.post('/api/function/parent/list', {
        chainId: userInfo.chainId,
        functionType: FUNCTION_TYPE.MENU, // 只获取菜单类型的作为上级功能
      });

      if (response.data.status === 'success') {
        setParentFunctions(response.data.data || []);
      } else {
        message.error('获取上级功能列表失败');
      }
    } catch (error: any) {
      console.error('获取上级功能列表异常:', error);
      message.error(error.response?.data?.message || error.message || '网络请求失败');
    } finally {
      setParentLoading(false);
    }
  };

  // 提交表单
  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const userInfo = getUserInfo();
      if (!userInfo?.chainId) {
        message.error('未获取到用户信息或chainId');
        return;
      }

      const requestBody: FunctionAddRequest = {
        chainId: userInfo.chainId,
        functionName: values.functionName,
        functionCode: values.functionCode,
        functionType: values.functionType,
        functionStatus: values.functionStatus,
        parentFunctionId: values.parentFunctionId || undefined,
        functionPath: values.functionPath || undefined,
        functionIcon: values.functionIcon || undefined,
        functionSort: values.functionSort || 0,
        functionDescription: values.functionDescription || undefined,
      };

      console.log('=== 新增功能请求 ===');
      console.log('请求体:', JSON.stringify(requestBody, null, 2));

      const response = await request.post('/api/function/add', requestBody);
      
      console.log('=== 新增功能响应 ===');
      console.log('响应体:', JSON.stringify(response.data, null, 2));

      if (response.data.status === 'success') {
        message.success('功能新增成功');
        navigate('/function/list');
      } else {
        message.error(response.data.message || '功能新增失败');
      }
    } catch (error: any) {
      console.error('新增功能异常:', error);
      message.error(error.response?.data?.message || error.message || '网络请求失败');
    } finally {
      setLoading(false);
    }
  };

  // 验证功能代码唯一性
  const validateFunctionCode = async (rule: any, value: string) => {
    if (!value) {
      return Promise.resolve();
    }

    try {
      const userInfo = getUserInfo();
      if (!userInfo?.chainId) {
        return Promise.reject(new Error('未获取到用户信息'));
      }

      const response = await request.post('/api/function/check-code', {
        chainId: userInfo.chainId,
        functionCode: value,
      });

      if (response.data.status === 'success') {
        if (response.data.data.exists) {
          return Promise.reject(new Error('功能代码已存在'));
        }
        return Promise.resolve();
      } else {
        return Promise.reject(new Error('验证失败'));
      }
    } catch (error: any) {
      console.error('验证功能代码异常:', error);
      return Promise.reject(new Error('验证失败'));
    }
  };

  // 初始加载
  useEffect(() => {
    fetchParentFunctions();
  }, []);

  return (
    <TokenCheck>
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="w-full">
          {/* 页面标题 */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <h1 className="text-2xl font-semibold text-gray-900">新增功能</h1>
              </div>
            </div>
          </div>

          {/* 表单卡片 */}
          <Card>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={{
                functionType: FUNCTION_TYPE.MENU,
                functionStatus: FUNCTION_STATUS.ACTIVE,
                functionSort: 0,
              }}
            >
              <Row gutter={24}>
                {/* 基本信息 */}
                <Col span={24}>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">基本信息</h3>
                </Col>
                
                <Col span={12}>
                  <Form.Item
                    label="功能名称"
                    name="functionName"
                    rules={[
                      { required: true, message: '请输入功能名称' },
                      { max: 50, message: '功能名称不能超过50个字符' },
                    ]}
                  >
                    <Input placeholder="请输入功能名称" size="large" />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    label="功能代码"
                    name="functionCode"
                    rules={[
                      { required: true, message: '请输入功能代码' },
                      { pattern: /^[A-Z_][A-Z0-9_]*$/, message: '功能代码只能包含大写字母、数字和下划线，且必须以字母或下划线开头' },
                      { max: 50, message: '功能代码不能超过50个字符' },
                      { validator: validateFunctionCode },
                    ]}
                  >
                    <Input placeholder="请输入功能代码，如：USER_MANAGE" size="large" />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    label="功能类型"
                    name="functionType"
                    rules={[{ required: true, message: '请选择功能类型' }]}
                  >
                    <Select placeholder="请选择功能类型" size="large">
                      <Select.Option value={FUNCTION_TYPE.MENU}>菜单</Select.Option>
                      <Select.Option value={FUNCTION_TYPE.BUTTON}>按钮</Select.Option>
                      <Select.Option value={FUNCTION_TYPE.API}>接口</Select.Option>
                      <Select.Option value={FUNCTION_TYPE.PAGE}>页面</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    label="功能状态"
                    name="functionStatus"
                    rules={[{ required: true, message: '请选择功能状态' }]}
                  >
                    <Select placeholder="请选择功能状态" size="large">
                      <Select.Option value={FUNCTION_STATUS.ACTIVE}>启用</Select.Option>
                      <Select.Option value={FUNCTION_STATUS.INACTIVE}>禁用</Select.Option>
                      <Select.Option value={FUNCTION_STATUS.DEPRECATED}>已废弃</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    label="上级功能"
                    name="parentFunctionId"
                  >
                    <Select
                      placeholder="请选择上级功能"
                      allowClear
                      loading={parentLoading}
                      showSearch
                      size="large"
                      filterOption={(input, option) =>
                        (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
                      }
                    >
                      {parentFunctions.map(item => (
                        <Select.Option key={item.functionId} value={item.functionId}>
                          {item.functionName}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    label="功能路径"
                    name="functionPath"
                    rules={[
                      { max: 200, message: '功能路径不能超过200个字符' },
                    ]}
                  >
                    <Input placeholder="请输入功能路径，如：/user/manage" size="large" />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    label="功能图标"
                    name="functionIcon"
                    rules={[
                      { max: 50, message: '功能图标不能超过50个字符' },
                    ]}
                  >
                    <Input placeholder="请输入功能图标，如：UserOutlined" size="large" />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    label="排序"
                    name="functionSort"
                    rules={[
                      { type: 'number', min: 0, message: '排序必须大于等于0' },
                      { type: 'number', max: 9999, message: '排序不能超过9999' },
                    ]}
                  >
                    <Input type="number" placeholder="请输入排序值" size="large" />
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item
                    label="功能描述"
                    name="functionDescription"
                    rules={[
                      { max: 500, message: '功能描述不能超过500个字符' },
                    ]}
                  >
                    <Input.TextArea
                      rows={4}
                      placeholder="请输入功能描述"
                      showCount
                      maxLength={500}
                      size="large"
                    />
                  </Form.Item>
                </Col>
              </Row>

              {/* 操作按钮 */}
              <div className="flex justify-center pt-6 border-t">
                <Space size="large">
                  <Button
                    onClick={() => navigate('/function/list')}
                    size="large"
                  >
                    取消
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    icon={<SaveOutlined />}
                    size="large"
                  >
                    保存
                  </Button>
                </Space>
              </div>
            </Form>
          </Card>
        </div>
      </div>
    </TokenCheck>
  );
};

export default FunctionAdd; 