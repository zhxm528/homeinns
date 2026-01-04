import React, { useEffect, useState } from 'react';
import { Select } from 'antd';

interface YearOption {
  value: number;
  label: string;
}

interface YearSelectProps {
  value?: number;
  onChange?: (value: number | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
  allowClear?: boolean;
  baseYear?: number; // 基准年份，默认为当前年份
  range?: number; // 前后年份范围，默认为5年
}

const YearSelect: React.FC<YearSelectProps> = ({
  value,
  onChange,
  placeholder = '请选择年份',
  disabled = false,
  style,
  allowClear = true,
  baseYear,
  range = 5
}) => {
  const [options, setOptions] = useState<YearOption[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const generateYearOptions = () => {
      setLoading(true);
      try {
        // 使用传入的基准年份或当前年份
        const currentYear = baseYear || new Date().getFullYear();
        
        // 生成前后指定范围的年份选项
        const yearOptions: YearOption[] = [];
        for (let i = currentYear - range; i <= currentYear + range; i++) {
          yearOptions.push({
            value: i,
            label: `${i}年`
          });
        }

        setOptions(yearOptions);
      } catch (error) {
        console.error('生成年份选项失败:', error);
        // 出错时使用当前年份前后5年作为默认选项
        const currentYear = new Date().getFullYear();
        const defaultOptions: YearOption[] = [];
        for (let i = currentYear - 5; i <= currentYear + 5; i++) {
          defaultOptions.push({
            value: i,
            label: `${i}年`
          });
        }
        setOptions(defaultOptions);
      } finally {
        setLoading(false);
      }
    };

    generateYearOptions();
  }, [baseYear, range]);

  // 处理值的变化
  const handleChange = (newValue: number | undefined) => {
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
      showSearch
      filterOption={(input, option) => 
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
      }
    />
  );
};

export default YearSelect; 