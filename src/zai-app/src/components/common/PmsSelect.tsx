import React from 'react';
import { Select } from 'antd';
import type { SelectProps } from 'antd/es/select';

const { Option } = Select;

// PMS系统选项
const PMS_OPTIONS = [
  { value: '西软XMS', label: '西软XMS' },
  { value: '西软X6', label: '西软X6' },
  { value: '康桥Cambridge', label: '康桥Cambridge' },
  { value: '如家P3', label: '如家P3' },
  { value: 'HotelBeds', label: 'HotelBeds' },
  { value: '携程代理通DLT', label: '携程代理通' },
  { value: '其他Other', label: '其他' }
];

interface PmsSelectProps extends Omit<SelectProps, 'options'> {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

const PmsSelect: React.FC<PmsSelectProps> = ({
  value,
  onChange,
  placeholder = '请选择PMS系统',
  ...restProps
}) => {
  return (
    <Select
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      allowClear
      showSearch
      size="large"
      style={{ width: '100%' }}
      filterOption={(input, option) =>
        (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
      }
      {...restProps}
    >
      {PMS_OPTIONS.map(option => (
        <Option key={option.value} value={option.value}>
          {option.label}
        </Option>
      ))}
    </Select>
  );
};

export default PmsSelect; 