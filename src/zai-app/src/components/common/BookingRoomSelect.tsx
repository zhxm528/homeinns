import React from 'react';
import { Select } from 'antd';

interface BookingRoomSelectProps {
  value?: number;
  onChange?: (value: number) => void;
  placeholder?: string;
  disabled?: boolean;
}

const BookingRoomSelect: React.FC<BookingRoomSelectProps> = ({
  value,
  onChange,
  placeholder = '请选择房间数',
  disabled = false,
}) => {
  // 生成1-30的选项
  const options = Array.from({ length: 30 }, (_, index) => ({
    value: index + 1,
    label: `${index + 1}间`,
  }));

  return (
    <Select
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      options={options}
      disabled={disabled}
      size="large"
      style={{ width: '100%' }}
    />
  );
};

export default BookingRoomSelect;
