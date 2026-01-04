import React, { useState, useEffect } from 'react';
import { Select, message } from 'antd';
import request from '@/utils/request';

interface RoomTypeSelectProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  hotelId?: string;
}

interface RoomTypeData {
  roomTypeCode: string;
  roomTypeName: string;
}

const RoomTypeSelect: React.FC<RoomTypeSelectProps> = ({
  value,
  onChange,
  placeholder = '请选择房型',
  disabled = false,
  hotelId,
}) => {
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    fetchRoomTypes();
  }, []);

  const fetchRoomTypes = async () => {
    try {
      setLoading(true);
      
      // 如果hotelId为空，从localStorage获取
      const finalHotelId = hotelId || localStorage.getItem('hotelId') || '';
      
      // 打印请求信息
      console.log('=== 获取房型列表请求信息 ===');
      console.log('请求URL:', '/api/roomtype/select/list');
      console.log('请求方法:', 'POST');
      console.log('请求参数:', JSON.stringify({ hotelId: finalHotelId }, null, 2));
      console.log('========================');

      const response = await request.post('/api/roomtype/select/component', {
        hotelId: finalHotelId
      });
      
      // 打印响应信息
      console.log('=== 获取房型列表响应信息 ===');
      console.log('响应数据:');
      console.log(JSON.stringify(response.data, null, 2));
      console.log('========================');
      
      if (response.data.success) {
        const roomTypeOptions = response.data.data.map((item: RoomTypeData) => ({
          value: item.roomTypeCode,
          label: item.roomTypeName,
        }));
        setOptions(roomTypeOptions);
      } else {
        message.error('获取房型列表失败');
      }
    } catch (error) {
      console.error('Failed to fetch room types:', error);
      message.error('获取房型列表失败');
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

export default RoomTypeSelect;
