import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import request from '../../utils/request';

export interface DiscountRateCodeOption {
  value: string;
  label: string;
  rateCodeId: string;
  rateCode: string;
  rateCodeName: string;
}

export interface RateCodeDiscountSelectProps {
  rateCodeId?: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  isDisabled?: boolean;
  className?: string;
  size?: 'small' | 'middle' | 'large';
}

const RateCodeDiscountSelect: React.FC<RateCodeDiscountSelectProps> = ({
  rateCodeId,
  value,
  onChange,
  placeholder = '请选择折扣房价码',
  isDisabled = false,
  className = '',
  size = 'middle'
}) => {
  const [options, setOptions] = useState<DiscountRateCodeOption[]>([]);
  const [loading, setLoading] = useState(false);

  // 获取折扣房价码列表
  useEffect(() => {
    const fetchDiscountRateCodes = async () => {
      setLoading(true);
      try {
        const response = await request.post(`/api/ratecode/discount-rate-code`, {
          rateCodeId
        });
        console.log('获取折扣房价码列表 - 响应数据:', JSON.stringify(response.data, null, 2));

        if (response.data && response.data.success && Array.isArray(response.data.data)) {
          const discountRateCodeOptions: DiscountRateCodeOption[] = response.data.data.map((item: any) => ({
            value: item.rateCodeId || item.id,
            label: `${item.rateCode || item.code} - ${item.rateCodeName || item.name}`,
            rateCodeId: item.rateCodeId || item.id,
            rateCode: item.rateCode || item.code,
            rateCodeName: item.rateCodeName || item.name
          }));
          setOptions(discountRateCodeOptions);
        } else {
          setOptions([]);
        }
      } catch (error) {
        console.error('获取折扣房价码列表失败:', error);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDiscountRateCodes();
  }, [rateCodeId]);

  const getHeight = () => {
    switch (size) {
      case 'small':
        return '32px';
      case 'large':
        return '40px';
      default:
        return '36px';
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'small':
        return '12px';
      case 'large':
        return '16px';
      default:
        return '14px';
    }
  };

  return (
    <Select
      options={options}
      value={options.find(option => option.value === value)}
      onChange={(option) => onChange?.(option?.value || '')}
      isDisabled={isDisabled || loading}
      placeholder={loading ? '加载中...' : placeholder}
      isClearable={true}
      isSearchable={true}
      className={`react-select-container ${className}`}
      classNamePrefix="react-select"
      isLoading={loading}
      noOptionsMessage={() => '暂无折扣房价码'}
      styles={{
        control: (provided, state) => ({
          ...provided,
          minHeight: getHeight(),
          height: getHeight(),
          fontSize: getFontSize(),
          borderColor: state.isFocused ? '#1890ff' : '#d9d9d9',
          boxShadow: state.isFocused ? '0 0 0 2px rgba(24, 144, 255, 0.2)' : 'none',
          '&:hover': {
            borderColor: '#1890ff',
          },
        }),
        valueContainer: (provided) => ({
          ...provided,
          height: getHeight(),
          padding: '0 8px',
        }),
        input: (provided) => ({
          ...provided,
          margin: '0px',
          fontSize: getFontSize(),
        }),
        indicatorSeparator: () => ({
          display: 'none',
        }),
        indicatorsContainer: (provided) => ({
          ...provided,
          height: getHeight(),
        }),
        option: (provided, state) => ({
          ...provided,
          fontSize: getFontSize(),
          backgroundColor: state.isSelected
            ? '#1890ff'
            : state.isFocused
            ? '#f0f0f0'
            : 'white',
          color: state.isSelected ? 'white' : '#333',
          '&:hover': {
            backgroundColor: state.isSelected ? '#1890ff' : '#f0f0f0',
          },
        }),
        menu: (provided) => ({
          ...provided,
          zIndex: 9999,
        }),
        singleValue: (provided) => ({
          ...provided,
          fontSize: getFontSize(),
        }),
        placeholder: (provided) => ({
          ...provided,
          fontSize: getFontSize(),
          color: '#bfbfbf',
        }),
        loadingMessage: (provided) => ({
          ...provided,
          fontSize: getFontSize(),
          color: '#bfbfbf',
        }),
        noOptionsMessage: (provided) => ({
          ...provided,
          fontSize: getFontSize(),
          color: '#bfbfbf',
        }),
      }}
    />
  );
};

export default RateCodeDiscountSelect;
