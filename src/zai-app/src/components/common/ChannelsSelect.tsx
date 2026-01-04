import React, { useState, useEffect } from 'react';
import { Select, message } from 'antd';
import request from '@/utils/request';

interface ChannelsSelectProps {
  value?: string[];
  onChange?: (value: string[]) => void;
  placeholder?: string;
  mode?: 'multiple' | 'tags';
  maxTagCount?: number;
  showSearch?: boolean;
  allowClear?: boolean;
}

interface ChannelData {
  channelCode: string;
  channelName: string;
}

const ChannelsSelect: React.FC<ChannelsSelectProps> = ({
  value = [],
  onChange,
  placeholder = '请选择渠道',
  mode = 'multiple',
  maxTagCount = 3,
  showSearch = true,
  allowClear = true,
}) => {
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    fetchChannels();
  }, []);

  const fetchChannels = async () => {
    try {
      setLoading(true);
      // 打印请求信息
      console.log('=== 获取渠道列表请求信息 ===');
      console.log('请求URL:', '/channel/select/component');
      console.log('请求方法:', 'POST');
      console.log('请求参数:', JSON.stringify({}, null, 2));
      console.log('========================');

      const response = await request.post('/channel/select/component', {});

      // 打印响应信息
      console.log('=== 获取渠道列表响应信息 ===');
      console.log('响应数据:');
      console.log(JSON.stringify(response.data, null, 2));
      console.log('========================');
      
      if (response.data.success) {
        const channelOptions = response.data.data.map((item: ChannelData) => ({
          value: item.channelCode,
          label: item.channelName,
        }));
        setOptions(channelOptions);
      } else {
        message.error('获取渠道列表失败');
      }
    } catch (error) {
      console.error('Failed to fetch channels:', error);
      message.error('获取渠道列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (selectedValues: string[]) => {
    if (onChange) {
      onChange(selectedValues);
    }
  };

  return (
    <Select
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      loading={loading}
      options={options}
      mode={mode}
      maxTagCount={maxTagCount}
      showSearch={showSearch}
      allowClear={allowClear}
      size="large"
      style={{ width: '100%' }}
      filterOption={(input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
      }
    />
  );
};

export default ChannelsSelect; 