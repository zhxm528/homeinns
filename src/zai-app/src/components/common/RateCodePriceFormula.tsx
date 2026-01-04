import React from 'react';
import Select from 'react-select';

export interface PriceFormulaOption {
  value: string;
  label: string;
}

export interface RateCodePriceFormulaProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  isDisabled?: boolean;
  className?: string;
  size?: 'small' | 'middle' | 'large';
}

const priceFormulaOptions: PriceFormulaOption[] = [
  { value: 'add', label: '加价' },
  { value: 'subtract', label: '减价' },
  { value: 'multiply', label: '乘以' },
  { value: 'divide', label: '除以' },
];

const RateCodePriceFormula: React.FC<RateCodePriceFormulaProps> = ({
  value,
  onChange,
  placeholder = '请选择价格计算公式',
  isDisabled = false,
  className = '',
  size = 'middle'
}) => {
  const getHeight = () => {
    switch (size) {
      case 'small':
        return '25px';
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
      options={priceFormulaOptions}
      value={priceFormulaOptions.find(option => option.value === value)}
      onChange={(option) => onChange?.(option?.value || '')}
      isDisabled={isDisabled}
      placeholder={placeholder}
      isClearable={false}
      isSearchable={false}
      className={`react-select-container ${className}`}
      classNamePrefix="react-select"
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
      }}
    />
  );
};

export default RateCodePriceFormula;
