import React, { useEffect, useState } from 'react';
import { Select } from 'antd';

interface PropertyTypeOption {
  value: string;
  label: string;
}

interface PropertyTypeSelectProps {
  value?: string;
  onChange?: (value: string | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
  allowClear?: boolean;
}

const PropertyTypeSelect: React.FC<PropertyTypeSelectProps> = ({
  value,
  onChange,
  placeholder = '请选择产选类型',
  disabled = false,
  style,
  allowClear = true
}) => {
  const [options, setOptions] = useState<PropertyTypeOption[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadOptions = () => {
      setLoading(true);
      try {
        // 从 localStorage 获取用户信息
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          const chainCode = user.chainCode;

          let propertyTypeOptions: PropertyTypeOption[] = [];

          // 根据 chainCode 设置不同的选项
          if (chainCode === 'UC') {
            propertyTypeOptions = [
              { value: '产权', label: '产权' },
              { value: '非产权', label: '非产权' }
            ];
          } else if (chainCode === 'JG') {
            propertyTypeOptions = [
              { value: '首旅', label: '首旅' },
              { value: '首酒', label: '首酒' },
              { value: '置业', label: '置业' },
              { value: '北展', label: '北展' },
              { value: '非产权', label: '非产权' }
            ];
          } else {
            // 默认选项
            propertyTypeOptions = [
              { value: '产权', label: '产权' },
              { value: '非产权', label: '非产权' }
            ];
          }

          setOptions(propertyTypeOptions);
        } else {
          // 如果没有用户信息，使用默认选项
          setOptions([
            { value: '产权', label: '产权' },
            { value: '非产权', label: '非产权' }
          ]);
        }
      } catch (error) {
        console.error('加载产选类型选项失败:', error);
        // 出错时使用默认选项
        setOptions([
          { value: '产权', label: '产权' },
          { value: '非产权', label: '非产权' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadOptions();
  }, []);

  // 处理值的变化
  const handleChange = (newValue: string | undefined) => {
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <Select
      value={value}
      onChange={handleChange}
      placeholder={loading ? '加载中...' : placeholder}
      disabled={disabled || loading}
      size="large"
      style={{ width: '100%', ...style }}
      allowClear={allowClear}
      options={options}
      loading={loading}
    />
  );
};

export default PropertyTypeSelect; 