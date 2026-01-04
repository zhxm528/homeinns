import React, { useEffect, useState } from 'react';
import { Checkbox, Space } from 'antd';
import type { CheckboxProps } from 'antd';

export interface WeekdaySelectProps {
  value?: string;
  onChange: (value: string) => void;
  isDisabled?: boolean;
  className?: string;
}

const WeekdaySelect: React.FC<WeekdaySelectProps> = ({
  value,
  onChange,
  isDisabled = false,
  className = ''
}) => {
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5, 6, 7]);

  // 将7位字符串转换为选中的天数数组
  useEffect(() => {
    if (value) {
      const days: number[] = [];
      for (let i = 0; i < 7; i++) {
        if (value[i] === '1') {
          days.push(i + 1);
        }
      }
      setSelectedDays(days);
    } else {
      // 如果没有提供value，默认全选
      setSelectedDays([1, 2, 3, 4, 5, 6, 7]);
      onChange('1111111');
    }
  }, [value]);

  // 处理选择变化
  const handleChange = (checkedValues: (string | number)[]) => {
    const days = checkedValues as number[];
    setSelectedDays(days);
    
    // 生成7位字符串
    let result = '0000000';
    days.forEach(day => {
      result = result.substring(0, day - 1) + '1' + result.substring(day);
    });
    
    onChange(result);
  };

  return (
    <Space className={className}>
      <Checkbox.Group
        value={selectedDays}
        onChange={handleChange}
        disabled={isDisabled}
      >
        <Checkbox value={1}>周一</Checkbox>
        <Checkbox value={2}>周二</Checkbox>
        <Checkbox value={3}>周三</Checkbox>
        <Checkbox value={4}>周四</Checkbox>
        <Checkbox value={5}>周五</Checkbox>
        <Checkbox value={6}>周六</Checkbox>
        <Checkbox value={7}>周日</Checkbox>
      </Checkbox.Group>
    </Space>
  );
};

export default WeekdaySelect; 