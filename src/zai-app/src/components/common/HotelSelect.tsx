import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Select, Spin } from 'antd';
import request from '../../utils/request';
import debounce from 'lodash/debounce';

const { Option } = Select;

export interface HotelOption {
  hotelId: string;
  hotelCode: string;
  hotelName: string;
}

interface HotelSelectProps {
  value: string;
  onChange: (value: string) => void;
  onHotelChange?: (hotel: HotelOption | null) => void;
  placeholder?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
  required?: boolean;
}

const HotelSelect: React.FC<HotelSelectProps> = ({
  value,
  onChange,
  onHotelChange,
  placeholder = '请选择酒店',
  disabled = false,
  style,
  required = false
}) => {
  const [loading, setLoading] = useState(false);
  const [hotels, setHotels] = useState<HotelOption[]>([]);
  const [searchText, setSearchText] = useState('');
  const [isRemoteSearch, setIsRemoteSearch] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 50,
    total: 0
  });
  const [hasMore, setHasMore] = useState(true);
  const selectRef = useRef<any>(null);
  const isInitialLoad = useRef(true);

  // 设置默认酒店
  const setDefaultHotel = useCallback(() => {
    if (!value && isInitialLoad.current) {
      const defaultHotelId = localStorage.getItem('hotelId');
      if (defaultHotelId) {
        const hotel = hotels.find(h => h.hotelId === defaultHotelId);
        if (hotel) {
          onChange(defaultHotelId);
          // 调用 onHotelChange 回调
          if (onHotelChange) {
            onHotelChange(hotel);
          }
        }
      }
      isInitialLoad.current = false;
    }
  }, [value, hotels, onChange, onHotelChange]);

  // 获取酒店列表
  const fetchHotels = async (keyword?: string, page = 1, isLoadMore = false) => {
    try {
      setLoading(true);
      const userInfo = JSON.parse(localStorage.getItem('user') || '{}');
      const chainId = localStorage.getItem('chainId') || '{}';

      if (!chainId) {
        console.error('未找到集团ID，请重新登录！');
        return;
      }

      const requestBody = {
        chainId: chainId,
        keyword: keyword || '',
        pagination: {
          current: page,
          pageSize: pagination.pageSize
        },
        user: {
          userId: userInfo.userId,
          loginName: userInfo.loginName,
          userName: userInfo.userName,
          roleId: userInfo.roleId,
          roleName: userInfo.roleName,
          chainId: userInfo.chainId,
          chainName: userInfo.chainName
        }
      };

      console.log('=== HotelSelect 接口调用信息 ===');
      console.log('请求URL:', '/api/hotel/select');
      console.log('请求方法:', 'POST');
      console.log('请求体 (JSON格式):');
      console.log(JSON.stringify(requestBody, null, 2));
      console.log('========================');

      const response = await request.post('/api/hotel/select', requestBody);

      console.log('=== HotelSelect 接口响应信息 ===');
      console.log('响应状态:', response.status);
      console.log('响应体 (JSON格式):');
      console.log(JSON.stringify(response.data, null, 2));
      console.log('========================');

      let newHotels: HotelOption[] = [];
      let total = 0;

      if (Array.isArray(response.data)) {
        newHotels = response.data;
        total = response.data.length;
      } else if (response.data && Array.isArray(response.data.data)) {
        newHotels = response.data.data;
        total = response.data.total || response.data.data.length;
      } else if (response.data && Array.isArray(response.data.list)) {
        newHotels = response.data.list;
        total = response.data.total || response.data.list.length;
      }

      setHotels(prev => isLoadMore ? [...prev, ...newHotels] : newHotels);
      setPagination(prev => ({ ...prev, total }));
      setHasMore(newHotels.length === pagination.pageSize);

      // 在数据加载完成后设置默认酒店
      if (isInitialLoad.current && !value && newHotels.length > 0) {
        const defaultHotelId = localStorage.getItem('hotelId');
        if (defaultHotelId) {
          const defaultHotel = newHotels.find(hotel => hotel.hotelId === defaultHotelId);
          if (defaultHotel) {
            onChange(defaultHotelId);
            // 调用 onHotelChange 回调
            if (onHotelChange) {
              onHotelChange(defaultHotel);
            }
          }
        }
        isInitialLoad.current = false;
      }
    } catch (error) {
      console.error('获取酒店列表失败:', error);
      setHotels([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  // 使用 useCallback 和 debounce 优化远程搜索
  const debouncedFetchHotels = useCallback(
    debounce((keyword: string) => {
      setPagination(prev => ({ ...prev, current: 1 })); // 重置页码
      fetchHotels(keyword, 1);
    }, 800),
    []
  );

  // 组件挂载时获取酒店列表
  useEffect(() => {
    fetchHotels();
  }, []);

  // 监听酒店列表变化，设置默认酒店
  useEffect(() => {
    setDefaultHotel();
  }, [hotels, setDefaultHotel]);

  // 监听 localStorage 变化
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'hotelId' && !value) {
        const newHotelId = e.newValue;
        if (newHotelId) {
          const hotel = hotels.find(h => h.hotelId === newHotelId);
          if (hotel) {
            onChange(newHotelId);
            // 调用 onHotelChange 回调
            if (onHotelChange) {
              onHotelChange(hotel);
            }
          }
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [hotels, value, onChange, onHotelChange]);

  // 使用 useMemo 优化本地搜索性能
  const filteredOptions = useMemo(() => {
    // 如果是远程搜索且正在加载，保持显示当前过滤结果
    if (isRemoteSearch && loading) {
      return hotels.filter(hotel => 
        hotel.hotelCode.toLowerCase().includes(searchText.toLowerCase()) ||
        hotel.hotelName.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    
    // 如果是远程搜索且不在加载，显示远程搜索结果
    if (isRemoteSearch) {
      return hotels;
    }
    
    // 本地搜索
    return hotels.filter(hotel => 
      hotel.hotelCode.toLowerCase().includes(searchText.toLowerCase()) ||
      hotel.hotelName.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [hotels, searchText, isRemoteSearch, loading]);

  const handleSearch = (value: string) => {
    setSearchText(value);
    if (value.length >= 2) {  // 当输入超过2个字符时才触发远程搜索
      setIsRemoteSearch(true);
      debouncedFetchHotels(value);
    } else {
      setIsRemoteSearch(false);
      // 当输入少于2个字符时，使用本地搜索
      if (value.length === 0) {
        fetchHotels();  // 清空搜索时重新加载所有数据
      }
    }
  };

  const handleChange = (value: string) => {
    onChange(value);
    
    // 调用 onHotelChange 回调，提供完整的酒店信息
    if (onHotelChange) {
      if (value) {
        const selectedHotel = hotels.find(hotel => hotel.hotelId === value);
        onHotelChange(selectedHotel || null);
      } else {
        onHotelChange(null);
      }
    }
  };

  const handlePopupScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { target } = e;
    const scrollElement = target as HTMLDivElement;
    const { scrollTop, scrollHeight, clientHeight } = scrollElement;

    // 当滚动到距离底部 20px 时加载更多
    if (scrollHeight - scrollTop - clientHeight < 20 && !loading && hasMore) {
      const nextPage = pagination.current + 1;
      setPagination(prev => ({ ...prev, current: nextPage }));
      fetchHotels(searchText, nextPage, true);
    }
  };

  return (
    <div>
      <Select
        ref={selectRef}
        value={value || undefined}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        loading={loading}
        size="large"
        style={{ width: '100%', ...style }}
        notFoundContent={loading ? <Spin size="small" /> : '暂无数据'}
        showSearch
        allowClear={!required}
        filterOption={(input, option) => {
          const label = option?.label?.toString().toLowerCase() || '';
          return label.includes(input.toLowerCase());
        }}
        onSearch={handleSearch}
        listHeight={200}
        virtual
        onPopupScroll={handlePopupScroll}
        options={filteredOptions.map(hotel => ({
          value: hotel.hotelId,
          label: `${hotel.hotelCode} ${hotel.hotelName}`,
          title: `${hotel.hotelCode} ${hotel.hotelName}`
        }))}
        optionLabelProp="title"
        dropdownStyle={{ zIndex: 9999 }}
      />
    </div>
  );
};

export default HotelSelect; 