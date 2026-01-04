import React, { useEffect, useState } from 'react';
import { Select, Row, Col } from 'antd';

interface DistrictOption {
  value: string;
  label: string;
}

interface CityAreaOption {
  value: string;
  label: string;
}

interface DistrictSelectProps {
  districtValue?: string;
  cityAreaValue?: string;
  onDistrictChange?: (value: string | undefined) => void;
  onCityAreaChange?: (value: string | undefined) => void;
  districtPlaceholder?: string;
  cityAreaPlaceholder?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
  allowClear?: boolean;
}

const DistrictSelect: React.FC<DistrictSelectProps> = ({
  districtValue,
  cityAreaValue,
  onDistrictChange,
  onCityAreaChange,
  districtPlaceholder = '请选择大区',
  cityAreaPlaceholder = '请选择城区',
  disabled = false,
  style,
  allowClear = true
}) => {
  const [districtOptions, setDistrictOptions] = useState<DistrictOption[]>([]);
  const [cityAreaOptions, setCityAreaOptions] = useState<CityAreaOption[]>([]);
  const [loading, setLoading] = useState(false);

  // 大区和城区的联动映射
  const districtCityAreaMap: Record<string, CityAreaOption[]> = {
    'east_china': [
      { value: 'shanghai', label: '上海城区' },
      { value: 'jiangsu_1', label: '江苏一区' },
      { value: 'jiangsu_2', label: '江苏二区' },
      { value: 'hubei_shandong', label: '湖北山东' }
    ],
    'zhejiang': [
      { value: 'zhejiang_1', label: '浙江一区' },
      { value: 'zhejiang_2', label: '浙江二区' }
    ],
    'northwest': [
      { value: 'northwest_1', label: '西北一区' },
      { value: 'northwest_2', label: '西北二区' }
    ],
    'southwest': [
      { value: 'southwest_1', label: '西南一区' },
      { value: 'southwest_2', label: '西南二区' }
    ],
    'south_china_1': [
      { value: 'south_china_1a', label: '华南一区A' },
      { value: 'south_china_1b', label: '华南一区B' }
    ],
    'south_china_2': [
      { value: 'south_china_2a', label: '华南二区A' },
      { value: 'south_china_2b', label: '华南二区B' }
    ],
    'north_china': [
      { value: 'north_china_1', label: '华北一区' },
      { value: 'north_china_2', label: '华北二区' }
    ]
  };

  useEffect(() => {
    const loadOptions = () => {
      setLoading(true);
      try {
        // 从 localStorage 获取用户信息
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          const chainCode = user.chainCode;

          let districtOptions: DistrictOption[] = [];

          // 根据 chainCode 设置不同的选项
          if (chainCode === 'UC') {
            districtOptions = [
              { value: 'east_china', label: '华东大区' },
              { value: 'zhejiang', label: '浙江区域' },
              { value: 'northwest', label: '西北大区' },
              { value: 'southwest', label: '西南大区' },
              { value: 'south_china_1', label: '华南一区' },
              { value: 'south_china_2', label: '华南二区' },
              { value: 'north_china', label: '华北大区' }
            ];
          } else if (chainCode === 'JG') {
            districtOptions = [
              { value: 'north_china', label: '华北' },
              { value: 'west_china', label: '华西' },
              { value: 'east_china', label: '华东' },
              { value: 'south_china', label: '华南' },
              { value: 'central_china', label: '华中' }
            ];
          } else {
            // 默认选项
            districtOptions = [
              { value: 'north_china', label: '华北' },
              { value: 'east_china', label: '华东' },
              { value: 'south_china', label: '华南' },
              { value: 'central_china', label: '华中' },
              { value: 'west_china', label: '华西' }
            ];
          }

          setDistrictOptions(districtOptions);
        } else {
          // 如果没有用户信息，使用默认选项
          setDistrictOptions([
            { value: 'north_china', label: '华北' },
            { value: 'east_china', label: '华东' },
            { value: 'south_china', label: '华南' },
            { value: 'central_china', label: '华中' },
            { value: 'west_china', label: '华西' }
          ]);
        }
      } catch (error) {
        console.error('加载大区选项失败:', error);
        // 出错时使用默认选项
        setDistrictOptions([
          { value: 'north_china', label: '华北' },
          { value: 'east_china', label: '华东' },
          { value: 'south_china', label: '华南' },
          { value: 'central_china', label: '华中' },
          { value: 'west_china', label: '华西' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadOptions();
  }, []);

  // 当大区选择改变时，更新城区选项
  useEffect(() => {
    if (districtValue && districtCityAreaMap[districtValue]) {
      setCityAreaOptions(districtCityAreaMap[districtValue]);
    } else {
      setCityAreaOptions([]);
    }
  }, [districtValue]);

  // 处理大区值的变化
  const handleDistrictChange = (newValue: string | undefined) => {
    if (onDistrictChange) {
      onDistrictChange(newValue);
    }
    // 清空城区选择
    if (onCityAreaChange) {
      onCityAreaChange(undefined);
    }
  };

  // 处理城区值的变化
  const handleCityAreaChange = (newValue: string | undefined) => {
    if (onCityAreaChange) {
      onCityAreaChange(newValue);
    }
  };

  return (
    <Row gutter={8}>
      <Col span={12}>
        <Select
          value={districtValue}
          onChange={handleDistrictChange}
          placeholder={loading ? '加载中...' : districtPlaceholder}
          disabled={disabled || loading}
          size="large"
          style={{ width: '100%', ...style }}
          allowClear={allowClear}
          options={districtOptions}
          loading={loading}
        />
      </Col>
      <Col span={12}>
        <Select
          value={cityAreaValue}
          onChange={handleCityAreaChange}
          placeholder={cityAreaPlaceholder}
          disabled={disabled || !districtValue}
          size="large"
          style={{ width: '100%', ...style }}
          allowClear={allowClear}
          options={cityAreaOptions}
        />
      </Col>
    </Row>
  );
};

export default DistrictSelect; 