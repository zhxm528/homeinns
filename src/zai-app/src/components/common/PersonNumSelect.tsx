import React from 'react';
import { Select } from 'antd';

export interface PersonNumSelectProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
}

const personNumOptions = [
  { value: '1', label: '1人' },
  { value: '2', label: '2人' },
  { value: '3', label: '3人' },
  { value: '4', label: '4人' },
];

const PersonNumSelect: React.FC<PersonNumSelectProps> = ({
  value,
  onChange,
  placeholder = '请选择入住人数',
  disabled = false,
  style
}) => {
  return (
    <Select
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      style={{ width: '100%', ...style }}
      options={personNumOptions}
      allowClear
      size="large"
    />
  );
};

export default PersonNumSelect;
