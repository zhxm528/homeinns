import React, { useEffect, useState } from 'react';
import { Select, message } from 'antd';
import request from '@/utils/request';

export interface ChainOption {
  value: string;
  label: string;
}

interface ChainsSelectProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  allowClear?: boolean;
  maxTagCount?: number;
  size?: 'large' | 'middle' | 'small';
  style?: React.CSSProperties;
}

interface Chain {
  chainId: string;
  chainName: string;
}

const ChainsSelect: React.FC<ChainsSelectProps> = ({
  value = [],
  onChange,
  placeholder = '请选择集团',
  disabled = false,
  allowClear = true,
  maxTagCount = 3,
  size = 'large',
  style
}) => {
  const [chainOptions, setChainOptions] = useState<{ value: string; label: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchChains = async () => {
      try {
        setLoading(true);
        console.log('=== 获取集团列表 ===');
        
        // 加载所有集团
        const response = await request.get('/chain/components/selectChainList?status=1');
        console.log('响应数据:', JSON.stringify(response.data, null, 2));
        
        if (response.data && Array.isArray(response.data)) {
          const options = response.data.map((chain: Chain) => ({
            value: chain.chainId,
            label: chain.chainName
          }));
          setChainOptions(options);
        }
      } catch (err) {
        console.error('获取集团列表失败:', err);
        message.error('获取集团列表失败');
      } finally {
        setLoading(false);
      }
    };

    fetchChains();
  }, []);

  const handleChange = (selectedValues: string[]) => {
    onChange(selectedValues);
  };

  const handleDropdownVisibleChange = (open: boolean) => {
    setDropdownOpen(open);
  };

  return (
    <Select
      mode="multiple"
      value={value}
      onChange={handleChange}
      placeholder={loading ? '加载中...' : placeholder}
      loading={loading}
      disabled={disabled || loading}
      allowClear={allowClear}
      maxTagCount={maxTagCount}
      size={size}
      style={{ width: '100%', ...style }}
      options={chainOptions}
      showSearch
      open={dropdownOpen}
      onDropdownVisibleChange={handleDropdownVisibleChange}
      filterOption={(input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
      }
      notFoundContent={loading ? '加载中...' : '暂无数据'}
    />
  );
};

export default ChainsSelect;
