import React from 'react';
import { Select } from 'antd';

interface StatusSelectProps {
  value?: number | string | undefined;
  onChange?: (value: number | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
  allowClear?: boolean;
}

const StatusSelect: React.FC<StatusSelectProps> = ({
  value,
  onChange,
  placeholder = '请选择状态',
  disabled = false,
  style,
  allowClear = true
}) => {
  // 处理值的变化
  const handleChange = (newValue: number | undefined) => {
    if (onChange) {
      onChange(newValue);
    }
  };

  // 将输入值转换为数字，支持空值
  const numericValue = value !== undefined && value !== '' && value !== '-1' ? Number(value) : undefined;

  return (
    <Select
      value={numericValue}
      onChange={handleChange}
      placeholder={placeholder}
      disabled={disabled}
      size="large"
      style={{ width: '100%', ...style }}
      allowClear={allowClear}
      options={[
        { value: 1, label: '启用' },
        { value: 0, label: '停用' }
      ]}
    />
  );
};

export default StatusSelect;
