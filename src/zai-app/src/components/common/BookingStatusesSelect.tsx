import React from 'react';
import { Select } from 'antd';

interface BookingStatusesSelectProps {
  value?: string[];
  onChange?: (value: string[]) => void;
  placeholder?: string;
  mode?: 'multiple' | 'tags';
  maxTagCount?: number;
  showSearch?: boolean;
  allowClear?: boolean;
  size?: 'large' | 'middle' | 'small';
  style?: React.CSSProperties;
}

// 订单状态枚举
const bookingStatusOptions = [
  { value: 'RESERVED', label: '待确认' },
  { value: 'CONFIRMED', label: '已确认' },
  { value: 'CANCEL', label: '已取消' },
  { value: 'CHECKIN', label: '已入住' },
  { value: 'CHECKOUT', label: '已离店' },
  { value: 'NOSHOW', label: '未入住' },
];

const BookingStatusesSelect: React.FC<BookingStatusesSelectProps> = ({
  value = [],
  onChange,
  placeholder = '请选择订单状态',
  mode = 'multiple',
  maxTagCount = 3,
  showSearch = true,
  allowClear = true,
  size = 'large',
  style,
}) => {
  return (
    <Select
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      options={bookingStatusOptions}
      mode={mode}
      maxTagCount={maxTagCount}
      showSearch={showSearch}
      allowClear={allowClear}
      size={size}
      style={{ width: '100%', ...style }}
      filterOption={(input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
      }
    />
  );
};

export default BookingStatusesSelect; 