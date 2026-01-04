import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import request from '@/utils/request';

export interface ChainOption {
  value: string;
  label: string;
}

interface ChainSelectProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isDisabled?: boolean;
}

interface Chain {
  chainId: string;
  chainName: string;
}

const ChainSelect: React.FC<ChainSelectProps> = ({
  value,
  onChange,
  placeholder = '请选择集团',
  isDisabled = false
}) => {
  const [chainOptions, setChainOptions] = useState<ChainOption[]>([]);
  const [loading, setLoading] = useState(false);

  // 获取当前选中的选项
  const selectedOption = chainOptions.find(opt => opt.value === value) || null;

  useEffect(() => {
    const fetchChains = async () => {
      try {
        setLoading(true);
        console.log('=== 获取集团列表 ===');
        
        // 从 localStorage 获取用户信息
        const userStr = localStorage.getItem('user');
        let roleId = 0;
        let userChainId = '';
        
        if (userStr) {
          const user = JSON.parse(userStr);
          roleId = user.roleId || 0;
          userChainId = user.chainId || '';
        }
        
        console.log('用户角色ID:', roleId);
        console.log('用户集团ID:', userChainId);
        
        // 如果 roleId 不等于 0，只加载当前用户的集团
        if (roleId !== 0 && userChainId) {
          console.log('角色ID不为0，只加载用户所属集团');
          const response = await request.get(`/chain/components/selectChainList?status=1`);
          console.log('响应数据:', JSON.stringify(response.data, null, 2));
          
          if (response.data && Array.isArray(response.data)) {
            const options = response.data.map((chain: Chain) => ({
              value: chain.chainId,
              label: chain.chainName
            }));
            setChainOptions(options);

            // 如果没有选中值，则使用当前用户的 chainId
            if (!value) {
              onChange(userChainId);
            }
          }
        } else {
          // roleId 等于 0 或没有 chainId，加载所有集团
          console.log('角色ID为0或没有chainId，加载所有集团');
          const response = await request.get('/chain/components/selectChainList?status=1');
          console.log('响应数据:', JSON.stringify(response.data, null, 2));
          
          if (response.data && Array.isArray(response.data)) {
            const options = response.data.map((chain: Chain) => ({
              value: chain.chainId,
              label: chain.chainName
            }));
            setChainOptions(options);

            // 如果没有选中值，则使用 localStorage 中的 chainId
            if (!value && userChainId) {
              // 确保 chainId 在选项列表中
              const defaultOption = options.find(opt => opt.value === userChainId);
              if (defaultOption) {
                onChange(userChainId);
              }
            }
          }
        }
      } catch (err) {
        console.error('获取集团列表失败:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchChains();
  }, []);

  const handleChange = (selectedOption: ChainOption | null) => {
    onChange(selectedOption?.value || '');
  };

  return (
    <Select
      options={chainOptions}
      value={selectedOption}
      onChange={handleChange}
      isDisabled={isDisabled || loading}
      placeholder={loading ? '加载中...' : placeholder}
      className="react-select-container"
      classNamePrefix="react-select"
      noOptionsMessage={() => '暂无数据'}
      isLoading={loading}
    />
  );
};

export default ChainSelect;
