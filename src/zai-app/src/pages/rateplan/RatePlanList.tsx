import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaSearch } from 'react-icons/fa';
import HotelSelect from '../../components/common/HotelSelect';
import RoomTypeSelect from '../../components/common/RoomTypeSelect';
import RateCodeSelect from '../../components/common/RateCodeSelect';
import { Switch } from 'antd';
import TokenCheck from '../../components/common/TokenCheck';
import { message } from 'antd';
import request from '../../utils/request';

interface RatePlan {
  ratePlanId: string;
  chainId: string;
  hotelId: string;
  roomTypeId: string;
  rateCodeId: string;
  roomType: string;
  rateCode: string;
  roomTypeName: string;
  rateCodeName: string;
  ratePlanName: string;
  description: string;
  finalStatus: number;
  finalInventory: number;
  finalPrice: number;
  createdAt: number;
  updatedAt: number;
  marketCode: string;
  channelId: string;
  minlos: number;
  maxlos: number;
  minadv: number;
  maxadv: number;
  validFrom: string;
  validTo: string;
  limitStartTime: string;
  limitEndTime: string;
  limitAvailWeeks: string | null;
  priceModifier: string;
  isPercentage: number;
  reservationType: string;
  cancellationType: string;
  latestCancellationDays: string;
  latestCancellationTime: string;
  cancellableAfterBooking: number;
  orderRetentionTime: string;
  stayStartDate: string;
  stayEndDate: string;
  bookingStartDate: string;
  bookingEndDate: string;
  priceRuleType: string;
  parentRateCodeId: string;
}

interface RoomType {
  roomTypeId: string;
  roomType: string;
  roomTypeName: string;
  hotelId: string;
  ratePlans: RatePlan[];
}

interface SearchParams {
  hotelId: string;
  roomTypeCode: string;
  rateCode: string;
}

interface Column {
  title: string;
  dataIndex: keyof RatePlan;
  key: string;
  render?: (text: any, record: RatePlan) => React.ReactNode;
}

const RatePlanList: React.FC = () => {
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [expandedPanels, setExpandedPanels] = useState<Set<string>>(new Set());
  const [isSearchPanelOpen, setIsSearchPanelOpen] = useState(true);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    hotelId: '',
    roomTypeCode: '',
    rateCode: ''
  });

  const handleSearchChange = (field: keyof SearchParams, value: string) => {
    setSearchParams(prev => ({
      ...prev,
      [field]: value,
      // 当酒店改变时，清空房型和房价码的选择
      ...(field === 'hotelId' && {
        roomTypeCode: '',
        rateCode: ''
      })
    }));
  };

  // 处理搜索响应数据
  const processResponseData = (data: RatePlan[]) => {
    // 按房型分组
    const roomTypeMap = new Map<string, RoomType>();
    
    data.forEach(plan => {
      if (!roomTypeMap.has(plan.roomTypeId)) {
        roomTypeMap.set(plan.roomTypeId, {
          roomTypeId: plan.roomTypeId,
          roomType: plan.roomType,
          roomTypeName: plan.roomTypeName,
          hotelId: plan.hotelId,
          ratePlans: []
        });
      }
      roomTypeMap.get(plan.roomTypeId)?.ratePlans.push(plan);
    });

    return Array.from(roomTypeMap.values());
  };

  const handleSearch = async () => {
    try {
      // 打印请求信息
      console.log('=== 获取房价计划列表请求信息 ===');
      console.log('请求URL:', '/api/rateplan/list');
      console.log('请求方法:', 'POST');
      console.log('请求参数:', JSON.stringify({
        hotelId: searchParams.hotelId,
        ratecodeId: searchParams.rateCode,
        roomTypeId: searchParams.roomTypeCode
      }, null, 2));
      console.log('========================');

      const response = await request.post('/api/rateplan/list', {
        hotelId: searchParams.hotelId,
        ratecodeId: searchParams.rateCode,
        roomTypeId: searchParams.roomTypeCode
      });

      // 打印响应信息
      console.log('=== 获取房价计划列表响应信息 ===');
      console.log('响应数据:');
      console.log(JSON.stringify(response.data, null, 2));
      console.log('========================');

      if (response.data.success) {
        const processedData = processResponseData(response.data.data);
        setRoomTypes(processedData);
      } else {
        message.error(response.data.message || '获取房价计划列表失败');
      }
    } catch (error) {
      console.error('Failed to fetch rate plans:', error);
      message.error('获取房价计划列表失败');
    }
  };

  const handleReset = () => {
    setSearchParams({
      hotelId: '',
      roomTypeCode: '',
      rateCode: ''
    });
  };

  const togglePanel = (roomTypeCode: string) => {
    setExpandedPanels(prev => {
      const newSet = new Set(prev);
      if (newSet.has(roomTypeCode)) {
        newSet.delete(roomTypeCode);
      } else {
        newSet.add(roomTypeCode);
      }
      return newSet;
    });
  };

  const filteredRoomTypes = roomTypes.filter(roomType =>
    !searchParams.hotelId || roomType.hotelId === searchParams.hotelId
  );

  const handleStatusChange = (checked: boolean, rateCode: string) => {
    setRoomTypes(prev => prev.map(roomType => ({
      ...roomType,
      ratePlans: roomType.ratePlans.map(plan => 
        plan.rateCode === rateCode 
          ? { ...plan, status: checked ? 'active' : 'inactive' }
          : plan
      )
    })));
  };

  const rateCodeColumns: Column[] = [
    {
      title: '房价码',
      dataIndex: 'rateCode',
      key: 'rateCode',
    },
    {
      title: '房价码名称',
      dataIndex: 'rateCodeName',
      key: 'rateCodeName',
    },
    {
      title: '预订类型',
      dataIndex: 'reservationType',
      key: 'reservationType',
      render: (text: string) => {
        const types: { [key: string]: string } = {
          'prepaid': '预付',
          'pay_at_hotel': '到付',
        };
        return types[text] || text;
      },
    },
    {
      title: '取消规则',
      dataIndex: 'cancellationType',
      key: 'cancellationType',
      render: (text: string) => {
        if (!text) return '-';
        try {
          const rules = JSON.parse(text);
          return `${rules.days}天前可取消`;
        } catch (e) {
          return text;
        }
      },
    },
    {
      title: '价格规则',
      dataIndex: 'priceRuleType',
      key: 'priceRuleType',
      render: (text: string) => {
        const types: { [key: string]: string } = {
          '0': '一口价',
          '1': '基础价',
          '2': '折扣价',
          '3': '折上折'
        };
        return types[text] || text;
      },
    },
    {
      title: '折扣',
      dataIndex: 'priceModifier',
      key: 'priceModifier',
      render: (text: string) => {
        if (!text) return '-';
        return `${text}%`;
      },
    },
  ];

  return (
    <TokenCheck>
    <div className="p-6 flex-1 overflow-x-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">商品列表</h1>
      </div>

      {/* 搜索面板 */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div 
          className="flex items-center justify-between p-4 cursor-pointer"
          onClick={() => setIsSearchPanelOpen(!isSearchPanelOpen)}
        >
          <div className="flex items-center">
            <FaSearch className="mr-2 text-gray-500" />
            <span className="font-medium">搜索条件</span>
          </div>
          {isSearchPanelOpen ? <FaChevronUp /> : <FaChevronDown />}
        </div>

        {isSearchPanelOpen && (
          <div className="p-4 border-t">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">所属酒店</label>
                <HotelSelect
                  value={searchParams.hotelId}
                  onChange={(value) => handleSearchChange('hotelId', value)}
                />
              </div>
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">选择房型</label>
                  <RoomTypeSelect
                    value={searchParams.roomTypeCode}
                    onChange={(value) => handleSearchChange('roomTypeCode', value)}
                    hotelId={searchParams.hotelId}
                    placeholder="请选择房型"
                  />
              </div>
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">选择房价码</label>
                  <RateCodeSelect
                    value={searchParams.rateCode}
                    onChange={(value) => handleSearchChange('rateCode', value)}
                    hotelId={searchParams.hotelId}
                />
              </div>
            </div>
            <div className="flex justify-end mt-4 space-x-2">
              <button
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                onClick={handleReset}
              >
                重置
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                onClick={handleSearch}
              >
                搜索
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 房型面板列表 */}
      <div className="space-y-4">
        {filteredRoomTypes.map((roomType) => (
          <div key={roomType.roomTypeId} className="bg-white rounded-lg shadow">
            <div 
              className="p-4 cursor-pointer flex items-center justify-between"
              onClick={() => togglePanel(roomType.roomType)}
            >
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  {expandedPanels.has(roomType.roomType) ? <FaChevronUp /> : <FaChevronDown />}
                </div>
                <div className="grid grid-cols-3 gap-4 w-full">
                  <div>
                    <span className="text-sm text-gray-500">房型代码</span>
                    <p className="font-medium">{roomType.roomType}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">房型名称</span>
                    <p className="font-medium">{roomType.roomTypeName}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">房价计划数</span>
                    <p className="font-medium">{roomType.ratePlans.length}个</p>
                  </div>
                </div>
              </div>
            </div>

            {expandedPanels.has(roomType.roomType) && (
              <div className="border-t">
                <div className="p-4">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {rateCodeColumns.map(column => (
                          <th
                            key={column.key}
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            {column.title}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {roomType.ratePlans.map((ratePlan) => (
                        <tr key={ratePlan.ratePlanId}>
                          {rateCodeColumns.map(column => (
                            <td key={`${ratePlan.ratePlanId}-${column.key}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {column.render 
                                ? column.render(String(ratePlan[column.dataIndex as keyof RatePlan]), ratePlan)
                                : String(ratePlan[column.dataIndex as keyof RatePlan])}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
    </TokenCheck>
  );
};

export default RatePlanList; 