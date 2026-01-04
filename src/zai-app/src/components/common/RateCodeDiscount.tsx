import React from 'react';
import Select from 'react-select';

export interface DiscountOption {
  value: string;
  label: string;
}

export interface RateCodeDiscountProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  isDisabled?: boolean;
  className?: string;
  size?: 'small' | 'middle' | 'large';
}

const discountOptions: DiscountOption[] = [
  { value: '0.1', label: '10%' },
  { value: '0.11', label: '11%' },
  { value: '0.12', label: '12%' },
  { value: '0.13', label: '13%' },
  { value: '0.14', label: '14%' },
  { value: '0.15', label: '15%' },
  { value: '0.16', label: '16%' },
  { value: '0.17', label: '17%' },
  { value: '0.18', label: '18%' },
  { value: '0.19', label: '19%' },
  { value: '0.2', label: '20%' },
  { value: '0.21', label: '21%' },
  { value: '0.22', label: '22%' },
  { value: '0.23', label: '23%' },
  { value: '0.24', label: '24%' },
  { value: '0.25', label: '25%' },
  { value: '0.26', label: '26%' },
  { value: '0.27', label: '27%' },
  { value: '0.28', label: '28%' },
  { value: '0.29', label: '29%' },
  { value: '0.3', label: '30%' },
  { value: '0.31', label: '31%' },
  { value: '0.32', label: '32%' },
  { value: '0.33', label: '33%' },
  { value: '0.34', label: '34%' },
  { value: '0.35', label: '35%' },
  { value: '0.36', label: '36%' },
  { value: '0.37', label: '37%' },
  { value: '0.38', label: '38%' },
  { value: '0.39', label: '39%' },
  { value: '0.4', label: '40%' },
  { value: '0.41', label: '41%' },
  { value: '0.42', label: '42%' },
  { value: '0.43', label: '43%' },
  { value: '0.44', label: '44%' },
  { value: '0.45', label: '45%' },
  { value: '0.46', label: '46%' },
  { value: '0.47', label: '47%' },
  { value: '0.48', label: '48%' },
  { value: '0.49', label: '49%' },
  { value: '0.5', label: '50%' },
  { value: '0.51', label: '51%' },
  { value: '0.52', label: '52%' },
  { value: '0.53', label: '53%' },
  { value: '0.54', label: '54%' },
  { value: '0.55', label: '55%' },
  { value: '0.56', label: '56%' },
  { value: '0.57', label: '57%' },
  { value: '0.58', label: '58%' },
  { value: '0.59', label: '59%' },
  { value: '0.6', label: '60%' },
  { value: '0.61', label: '61%' },
  { value: '0.62', label: '62%' },
  { value: '0.63', label: '63%' },
  { value: '0.64', label: '64%' },
  { value: '0.65', label: '65%' },
  { value: '0.66', label: '66%' },
  { value: '0.67', label: '67%' },
  { value: '0.68', label: '68%' },
  { value: '0.69', label: '69%' },
  { value: '0.7', label: '70%' },
  { value: '0.71', label: '71%' },
  { value: '0.72', label: '72%' },
  { value: '0.73', label: '73%' },
  { value: '0.74', label: '74%' },
  { value: '0.75', label: '75%' },
  { value: '0.76', label: '76%' },
  { value: '0.77', label: '77%' },
  { value: '0.78', label: '78%' },
  { value: '0.79', label: '79%' },
  { value: '0.8', label: '80%' },
  { value: '0.81', label: '81%' },
  { value: '0.82', label: '82%' },
  { value: '0.83', label: '83%' },
  { value: '0.84', label: '84%' },
  { value: '0.85', label: '85%' },
  { value: '0.86', label: '86%' },
  { value: '0.87', label: '87%' },
  { value: '0.88', label: '88%' },
  { value: '0.89', label: '89%' },
  { value: '0.9', label: '90%' },
  { value: '0.91', label: '91%' },
  { value: '0.92', label: '92%' },
  { value: '0.93', label: '93%' },
  { value: '0.94', label: '94%' },
  { value: '0.95', label: '95%' },
  { value: '0.96', label: '96%' },
  { value: '0.97', label: '97%' },
  { value: '0.98', label: '98%' },
  { value: '0.99', label: '99%' },
  { value: '1', label: '100%' },
];

const RateCodeDiscount: React.FC<RateCodeDiscountProps> = ({
  value,
  onChange,
  placeholder = '请选择价格折扣',
  isDisabled = false,
  className = '',
  size = 'middle'
}) => {
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
      options={discountOptions}
      value={discountOptions.find(option => option.value === value)}
      onChange={(option) => onChange?.(option?.value || '')}
      isDisabled={isDisabled}
      placeholder={placeholder}
      isClearable={false}
      isSearchable={true}
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

export default RateCodeDiscount;
