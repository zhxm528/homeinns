import React, { useEffect } from 'react';
import { DatePicker, Space } from 'antd';
import type { RangePickerProps } from 'antd/es/date-picker';
import dayjs from 'dayjs';
import locale from 'antd/es/date-picker/locale/zh_CN';

const { RangePicker } = DatePicker;

export interface FuturePeriodDataProps {
  value?: [string, string];
  onChange?: (value: [string, string]) => void;
  disabled?: boolean;
  className?: string;
}

const FuturePeriodData: React.FC<FuturePeriodDataProps> = ({
  value,
  onChange,
  disabled = false,
  className = ''
}) => {
  // 获取当前日期
  const today = dayjs().startOf('day');
  
  // 获取3年后的日期
  const threeYearsLater = dayjs().add(3, 'year').endOf('day');

  // 设置默认值
  useEffect(() => {
    if (!value || (!value[0] && !value[1])) {
      const defaultEndDate = dayjs().add(1, 'year').endOf('day');
      onChange?.([
        today.format('YYYY-MM-DD'),
        defaultEndDate.format('YYYY-MM-DD')
      ]);
    }
  }, []);

  // 禁用日期函数
  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    // 禁用今天之前的日期和3年后的日期
    return current && (current < today || current > threeYearsLater);
  };

  // 处理日期变化
  const handleChange = (dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null) => {
    if (dates && dates[0] && dates[1]) {
      onChange?.([
        dates[0].format('YYYY-MM-DD'),
        dates[1].format('YYYY-MM-DD')
      ]);
    } else {
      onChange?.(['', '']);
    }
  };

  // 转换初始值
  const initialValue: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null = value && value[0] && value[1] ? [
    dayjs(value[0]),
    dayjs(value[1])
  ] : null;

  return (
    <Space className={className} style={{ width: '100%' }}>
      <RangePicker
        value={initialValue}
        size="large"
        onChange={handleChange}
        disabledDate={disabledDate}
        disabled={disabled}
        format="YYYY-MM-DD"
        placeholder={['开始日期', '结束日期']}
        style={{ width: '100%', minWidth: 0 }}
        allowClear
        locale={locale}
      />
    </Space>
  );
};

export default FuturePeriodData;
