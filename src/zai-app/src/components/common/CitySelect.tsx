import React, { useState, useEffect } from 'react';
import { Select, Spin } from 'antd';
import request from '../../utils/request';

export interface CityOption {
  cityCode: string;
  cityName: string;
}

export interface CitySelectProps {
  value?: string;
  onChange?: (value: string | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
}

const CitySelect: React.FC<CitySelectProps> = ({
  value,
  onChange,
  placeholder = '选择城市',
  disabled = false,
  style
}) => {
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState<CityOption[]>([]);

  // 获取城市列表
  const fetchCities = async () => {
    try {
      setLoading(true);
      const response = await request.get('/city/list');
      
      if (response.data && Array.isArray(response.data)) {
        setCities(response.data);
      } else if (response.data && Array.isArray(response.data.data)) {
        setCities(response.data.data);
      } else {
        console.error('API返回的数据格式不正确:', response.data);
        setCities([]);
      }
    } catch (error: any) {
      console.error('获取城市列表失败:', error);
      // 网络错误或其他错误时，设置空数组，确保组件正常显示
      setCities([]);
      
      // 如果是网络错误，可以在控制台显示更详细的信息
      if (error.code === 'ERR_NETWORK') {
        console.warn('网络连接失败，城市列表将显示为空');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  return (
    <Select
      value={value || undefined}
      onChange={(val) => onChange?.(val)}
      placeholder={placeholder}
      disabled={disabled}
      loading={loading}
      size="large"
      style={{ width: '100%', ...style }}
      notFoundContent={loading ? <Spin size="small" /> : '暂无数据'}
      options={cities.map(city => ({
        value: city.cityCode,
        label: city.cityName
      }))}
      allowClear
      showSearch
      filterOption={(input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
      }
    />
  );
};

export default CitySelect;
