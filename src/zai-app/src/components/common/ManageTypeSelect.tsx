import React, { useEffect, useState } from 'react';
import { Select } from 'antd';

interface ManageTypeOption {
  value: string;
  label: string;
}

interface ManageTypeSelectProps {
  value?: string;
  onChange?: (value: string | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
  allowClear?: boolean;
}

const ManageTypeSelect: React.FC<ManageTypeSelectProps> = ({
  value,
  onChange,
  placeholder = '请选择管理类型',
  disabled = false,
  style,
  allowClear = true
}) => {
  const [options, setOptions] = useState<ManageTypeOption[]>([]);
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

          let manageTypeOptions: ManageTypeOption[] = [];

          // 根据 chainCode 设置不同的选项
          if (chainCode === 'UC') {
            manageTypeOptions = [
              { value: '直营', label: '直营' },
              { value: '托管', label: '托管' },
              { value: '加盟', label: '加盟' }
            ];
          } else if (chainCode === 'JG') {
            manageTypeOptions = [
              { value: '委托管理', label: '委托管理' },
              { value: '合资委管', label: '合资委管' },
              { value: '特许加盟', label: '特许加盟' }
            ];
          } else {
            // 默认选项
            manageTypeOptions = [
              { value: '直营', label: '直营' },
              { value: '托管', label: '托管' },
              { value: '加盟', label: '加盟' }
            ];
          }

          setOptions(manageTypeOptions);
        } else {
          // 如果没有用户信息，使用默认选项
          setOptions([
            { value: '直营', label: '直营' },
            { value: '托管', label: '托管' },
            { value: '加盟', label: '加盟' }
          ]);
        }
      } catch (error) {
        console.error('加载管理类型选项失败:', error);
        // 出错时使用默认选项
        setOptions([
          { value: '直营', label: '直营' },
          { value: '托管', label: '托管' },
          { value: '加盟', label: '加盟' }
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

export default ManageTypeSelect; 