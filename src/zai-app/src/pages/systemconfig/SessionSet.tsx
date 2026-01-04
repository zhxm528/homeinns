import React, { useState, useEffect } from 'react';
import { Select, Spin, Card, Button, Space, Typography, message } from 'antd';
import { debounce } from 'lodash';
import request from '../../utils/request';
import ChainSelect from '../../components/common/ChainSelect';

const { Option } = Select;
const { Title } = Typography;

interface User {
  userId: string;
  loginName: string;
  username: string;
  // 其他字段
}

const SessionSet: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string>();
  const [selectedChainId, setSelectedChainId] = useState<string>('');
  const [selectedHotelId, setSelectedHotelId] = useState<string>('');

  // 获取用户列表
  const fetchUsers = async (searchText?: string) => {
    try {
      console.log('=== 开始获取用户列表 ===');
      console.log('搜索关键词:', searchText);
      console.log('请求URL:', '/user/list');
      
      const params = {
        search: searchText || '',
        searchFields: 'loginName,username' // 修改为逗号分隔的字符串
      };
      
      console.log('请求参数:', params);
      
      setLoading(true);
      const response = await request.get('/user/list', {
        params,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log('=== API响应详情 ===');
      console.log('响应状态:', response.status);
      console.log('响应数据:', response.data);
      
      // 确保返回的数据是数组
      const userData = response.data;
      if (Array.isArray(userData)) {
        console.log('用户列表数据:', userData);
        setUsers(userData);
      } else if (userData && Array.isArray(userData.data)) {
        console.log('用户列表数据 (data字段):', userData.data);
        setUsers(userData.data);
      } else if (userData && Array.isArray(userData.list)) {
        console.log('用户列表数据 (list字段):', userData.list);
        setUsers(userData.list);
      } else {
        console.error('API返回的数据格式不正确:', userData);
        message.error('获取用户列表失败：数据格式不正确');
        setUsers([]);
      }
    } catch (error: any) {
      console.error('=== 获取用户列表失败 ===');
      console.error('错误详情:', error);
      
      // 更详细的错误信息
      if (error.response) {
        console.error('错误响应状态:', error.response.status);
        console.error('错误响应数据:', error.response.data);
        message.error(`获取用户列表失败: ${error.response.data?.message || '服务器错误'}`);
      } else if (error.request) {
        console.error('请求已发送但未收到响应');
        message.error('获取用户列表失败：服务器无响应');
      } else {
        console.error('请求配置错误:', error.message);
        message.error('获取用户列表失败：请求配置错误');
      }
      
      setUsers([]);
    } finally {
      setLoading(false);
      console.log('=== 获取用户列表完成 ===');
    }
  };

  // 使用 debounce 优化搜索性能
  const debouncedFetchUsers = debounce((value: string) => {
    console.log('触发搜索，关键词:', value);
    fetchUsers(value);
  }, 300);

  // 自定义搜索过滤函数
  const filterOption = (input: string, option: any) => {
    const user = users.find(u => u.userId === option.value);
    if (!user) return false;
    
    const searchText = input.toLowerCase();
    return (
      user.loginName.toLowerCase().includes(searchText) ||
      user.username.toLowerCase().includes(searchText)
    );
  };

  useEffect(() => {
    console.log('=== 组件挂载 ===');
    console.log('开始初始化数据');
    fetchUsers();
    return () => {
      console.log('=== 组件卸载 ===');
    };
  }, []);

  const handleSearch = (value: string) => {
    console.log('用户输入搜索:', value);
    debouncedFetchUsers(value);
  };

  const handleChange = (value: string) => {
    console.log('=== 用户选择变更 ===');
    console.log('选中的用户ID:', value);
    const selectedUserData = users.find(user => user.userId === value);
    console.log('选中的用户数据:', selectedUserData);
    setSelectedUser(value);
  };

  const handleSave = () => {
    if (!selectedUser) {
      console.log('保存失败：未选择用户');
      message.warning('请先选择用户');
      return;
    }
    console.log('=== 保存用户选择 ===');
    console.log('选中的用户ID:', selectedUser);
    const selectedUserData = users.find(user => user.userId === selectedUser);
    console.log('选中的用户数据:', selectedUserData);
    // TODO: 实现保存逻辑
    message.success('保存成功');
  };

  // 监听 users 数据变化
  useEffect(() => {
    console.log('=== 用户列表数据更新 ===');
    console.log('当前用户列表:', users);
  }, [users]);

  // 监听 loading 状态变化
  useEffect(() => {
    console.log('=== 加载状态变更 ===');
    console.log('当前加载状态:', loading);
  }, [loading]);

  // 处理集团选择变化
  const handleChainChange = (value: string) => {
    console.log('集团选择变化:', value);
    setSelectedChainId(value);
    // 清空酒店选择
    setSelectedHotelId('');
  };

  // 处理酒店选择变化
  const handleHotelChange = (value: string) => {
    console.log('酒店选择变化:', value);
    setSelectedHotelId(value);
  };

  // 添加保存集团的处理函数
  const handleSaveChain = () => {
    if (!selectedChainId) {
      message.warning('请先选择集团');
      return;
    }
    console.log('保存集团选择:', selectedChainId);
    message.success('保存成功');
  };

  // 添加保存酒店的处理函数
  const handleSaveHotel = () => {
    if (!selectedHotelId) {
      message.warning('请先选择酒店');
      return;
    }
    console.log('保存酒店选择:', selectedHotelId);
    message.success('保存成功');
  };

  return (
    <div style={{ padding: '24px', width: '100%', height: '100%' }}>
      <Card
        title={
          <Title level={5} style={{ margin: 0 }}>Session设置</Title>
        }
        style={{ width: '100%' }}
        styles={{ body: { width: '100%' } }}
      >
        <div style={{ marginBottom: '16px', width: '100%' }}>
          <Space style={{ width: '100%', display: 'flex', alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <label className="block text-sm font-medium text-gray-700 mb-1">所属集团</label>
              <Space style={{ width: '100%', display: 'flex' }}>
                <ChainSelect
                  value={selectedChainId}
                  onChange={handleChainChange}
                  placeholder="请选择集团"
                  style={{ width: 'calc(100% - 80px)' }}
                />
                <Button type="primary" onClick={handleSaveChain}>
                  保存
                </Button>
              </Space>
            </div>
            <div style={{ flex: 1 }}>
              <label className="block text-sm font-medium text-gray-700 mb-1">所属酒店</label>
              <Space style={{ width: '100%', display: 'flex' }}>
                <ChainSelect
                  value={selectedHotelId}
                  onChange={handleHotelChange}
                  placeholder="请选择酒店"
                  chainId={selectedChainId}
                  type="hotel"
                  style={{ width: 'calc(100% - 80px)' }}
                />
                <Button type="primary" onClick={handleSaveHotel}>
                  保存
                </Button>
              </Space>
            </div>
            <div style={{ flex: 1 }}>
              <label className="block text-sm font-medium text-gray-700 mb-1">当前用户设置</label>
              <Space style={{ width: '100%', display: 'flex' }}>
                <Select
                  showSearch
                  style={{ width: 'calc(100% - 80px)', minWidth: '200px' }}
                  placeholder="请输入登录名或用户名搜索"
                  loading={loading}
                  value={selectedUser}
                  onSearch={handleSearch}
                  onChange={handleChange}
                  notFoundContent={loading ? <Spin size="small" /> : '暂无数据'}
                  filterOption={filterOption}
                  styles={{
                    popup: {
                      root: {
                        minWidth: '200px'
                      }
                    }
                  }}
                  popupMatchSelectWidth={true}
                  listHeight={256}
                  virtual={false}
                >
                  {Array.isArray(users) && users.map((user, index) => (
                    <Option key={`user-${user.userId || index}`} value={user.userId}>
                      {`${user.loginName} ${user.username}`}
                    </Option>
                  ))}
                </Select>
                <Button type="primary" onClick={handleSave}>
                  保存
                </Button>
              </Space>
            </div>
          </Space>
        </div>
      </Card>
    </div>
  );
};

export default SessionSet;
