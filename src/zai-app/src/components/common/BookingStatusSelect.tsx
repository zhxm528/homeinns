import React from 'react';
import { Select } from 'antd';

interface BookingStatusSelectProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
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

const BookingStatusSelect: React.FC<BookingStatusSelectProps> = ({
  value,
  onChange,
  placeholder = '请选择订单状态',
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
      allowClear={allowClear}
      size={size}
      style={{ width: '100%', ...style }}
    />
  );
};

export default BookingStatusSelect; 