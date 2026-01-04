import React, { useEffect, useState } from 'react';
import { Select } from 'antd';

interface StoreAgeOption {
  value: string;
  label: string;
}

interface StoreAgeSelectProps {
  value?: string;
  onChange?: (value: string | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
  allowClear?: boolean;
}

const StoreAgeSelect: React.FC<StoreAgeSelectProps> = ({
  value,
  onChange,
  placeholder = '选择店年龄',
  disabled = false,
  style,
  allowClear = true
}) => {
  const [options, setOptions] = useState<StoreAgeOption[]>([]);
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

          let storeAgeOptions: StoreAgeOption[] = [];

          // 根据 chainCode 设置不同的选项
          if (chainCode === 'UC') {
            storeAgeOptions = [
              { value: 'mature', label: '成熟店18个月以上' },
              { value: 'sub_new', label: '次新店6-18个月' },
              { value: 'new', label: '新店0-6个月' }
            ];
          } else if (chainCode === 'JG') {
            storeAgeOptions = [
              { value: 'within_1_year', label: '1年内' },
              { value: '1_to_3_years', label: '1-3年' },
              { value: '3_to_7_years', label: '3-7年' },
              { value: 'over_7_years', label: '7年以上' }
            ];
          } else {
            // 默认选项
            storeAgeOptions = [
              { value: 'mature', label: '成熟店18个月以上' },
              { value: 'sub_new', label: '次新店6-18个月' },
              { value: 'new', label: '新店0-6个月' }
            ];
          }

          setOptions(storeAgeOptions);
        } else {
          // 如果没有用户信息，使用默认选项
          setOptions([
            { value: 'mature', label: '成熟店' },
            { value: 'sub_new', label: '次新店' },
            { value: 'new', label: '新店' }
          ]);
        }
      } catch (error) {
        console.error('加载店年龄选项失败:', error);
        // 出错时使用默认选项
        setOptions([
          { value: 'mature', label: '成熟店' },
          { value: 'sub_new', label: '次新店' },
          { value: 'new', label: '新店' }
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

export default StoreAgeSelect; 