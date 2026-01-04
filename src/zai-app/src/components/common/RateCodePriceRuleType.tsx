import React from 'react';
import Select from 'react-select';

export interface PriceRuleTypeOption {
  value: string;
  label: string;
}

export interface RateCodePriceRuleTypeProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  isDisabled?: boolean;
  className?: string;
  size?: 'small' | 'middle' | 'large';
}

const priceRuleOptions: PriceRuleTypeOption[] = [
  { value: '0', label: '一口价' },
  { value: '1', label: '基础价' },
  { value: '2', label: '折扣价' },
  { value: '3', label: '折上折' },
];

const RateCodePriceRuleType: React.FC<RateCodePriceRuleTypeProps> = ({
  value,
  onChange,
  placeholder = '请选择价格规则类型',
  isDisabled = false,
  className = '',
  size = 'middle'
}) => {
  // 根据size设置高度
  const getHeight = () => {
    switch (size) {
      case 'small':
        return '32px';
      case 'large':
        return '48px';
      default:
        return '40px';
    }
  };

  // 根据size设置字体大小
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
      options={priceRuleOptions}
      value={priceRuleOptions.find(option => option.value === value)}
      onChange={(option) => onChange?.(option?.value || '')}
      isDisabled={isDisabled}
      placeholder={placeholder}
      isClearable={false}
      isSearchable={false}
      className={`react-select-container ${className}`}
      classNamePrefix="react-select"
      styles={{
        control: (base) => ({
          ...base,
          minHeight: getHeight(),
          height: getHeight(),
          padding: '0 8px',
          border: '1px solid #e2e8f0',
          borderRadius: '0.5rem',
          fontSize: getFontSize(),
          '&:hover': {
            borderColor: '#e2e8f0'
          },
          '&:focus-within': {
            borderColor: '#3b82f6',
            boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.1)'
          }
        }),
        option: (base, state) => ({
          ...base,
          fontSize: getFontSize(),
          backgroundColor: state.isSelected 
            ? '#3b82f6' 
            : state.isFocused 
              ? '#f1f5f9' 
              : 'white',
          color: state.isSelected ? 'white' : '#374151',
          '&:hover': {
            backgroundColor: state.isSelected ? '#3b82f6' : '#f1f5f9'
          }
        }),
        singleValue: (base) => ({
          ...base,
          fontSize: getFontSize(),
          color: '#374151'
        }),
        placeholder: (base) => ({
          ...base,
          fontSize: getFontSize(),
          color: '#9ca3af'
        }),
        menu: (base) => ({
          ...base,
          zIndex: 9999,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          border: '1px solid #e5e7eb',
          borderRadius: '0.5rem'
        }),
        menuPortal: (base) => ({
          ...base,
          zIndex: 9999
        }),
        indicatorSeparator: (base) => ({
          ...base,
          backgroundColor: '#e5e7eb'
        }),
        dropdownIndicator: (base) => ({
          ...base,
          color: '#6b7280',
          '&:hover': {
            color: '#374151'
          }
        })
      }}
    />
  );
};

export default RateCodePriceRuleType;
