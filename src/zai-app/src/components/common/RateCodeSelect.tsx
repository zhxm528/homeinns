import React, { useState, useEffect } from 'react';
import { Select, message } from 'antd';
import request from '@/utils/request';

interface RateCodeSelectProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  hotelId?: string;
}

interface RateCodeData {
  rateCodeId: string;
  chainId: string;
  hotelId: string;
  rateCode: string;
  rateCodeName: string;
  description: string;
  marketCode: string | null;
  channelId: string | null;
  minlos: number | null;
  maxlos: number | null;
  minadv: number | null;
  maxadv: number | null;
  validFrom: string | null;
  validTo: string | null;
  limitStartTime: string | null;
  limitEndTime: string | null;
  limitAvailWeeks: number | null;
  priceModifier: string | null;
  isPercentage: number | null;
  reservationType: string;
  cancellationType: string;
  latestCancellationDays: number | null;
  latestCancellationTime: string | null;
  cancellableAfterBooking: number;
  orderRetentionTime: string | null;
  stayStartDate: string | null;
  stayEndDate: string | null;
  bookingStartDate: string | null;
  bookingEndDate: string | null;
  priceRuleType: number | null;
  parentRateCodeId: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  hotelName: string | null;
  status: string | null;
}

const RateCodeSelect: React.FC<RateCodeSelectProps> = ({
  value,
  onChange,
  placeholder = '请选择价格代码',
  disabled = false,
  hotelId,
}) => {
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    fetchRateCodes();
  }, [hotelId]);

  const fetchRateCodes = async () => {
    try {
      setLoading(true);
      
      // 如果hotelId为空，不进行API调用
      const finalHotelId = hotelId || localStorage.getItem('hotelId') || '';
      
      if (!finalHotelId) {
        setOptions([]);
        return;
      }
      
      // 打印请求信息
      console.log('=== 获取房价码列表请求信息 ===');
      console.log('请求URL:', '/api/ratecode/select/component');
      console.log('请求方法:', 'POST');
      console.log('请求参数:', JSON.stringify({ hotelId: finalHotelId }, null, 2));
      console.log('========================');

      const response = await request.post('/api/ratecode/select/component', {
        hotelId: finalHotelId
      });
      
      // 打印响应信息
      console.log('=== 获取房价码列表响应信息 ===');
      console.log('响应数据:');
      console.log(JSON.stringify(response.data, null, 2));
      console.log('========================');
      
      if (response.data.success) {
        const rateCodeOptions = response.data.data.map((item: RateCodeData) => ({
          value: item.rateCode,
          label: item.rateCodeName,
        }));
        setOptions(rateCodeOptions);
      } else {
        message.error('获取房价码列表失败');
      }
    } catch (error) {
      console.error('Failed to fetch rate codes:', error);
      message.error('获取房价码列表失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Select
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      loading={loading}
      options={options}
      disabled={disabled}
      size="large"
      style={{ width: '100%' }}
      allowClear
    />
  );
};

export default RateCodeSelect;
