import React, { useEffect, useState } from 'react';
import { Collapse, Descriptions } from 'antd';
import TokenCheck from '../components/common/TokenCheck';

const Home = () => {
  const [localStorageData, setLocalStorageData] = useState<Record<string, string>>({});

  useEffect(() => {
    const data: Record<string, string> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        data[key] = localStorage.getItem(key) || '';
      }
    }
    setLocalStorageData(data);
  }, []);

  return (
    <TokenCheck checkToken={false}>
      <div className="flex flex-col h-full">     
        <div className="flex-1 p-6 bg-white rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">欢迎使用酒店管理系统</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 这里可以添加仪表盘卡片 */}
            <div className="bg-blue-50 p-6 rounded-lg">
              <h2 className="text-lg font-semibold text-blue-800 mb-2">总资产</h2>
              <p className="text-3xl font-bold text-blue-600">0</p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <h2 className="text-lg font-semibold text-green-800 mb-2">当月营收</h2>
              <p className="text-3xl font-bold text-green-600">0</p>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg">
              <h2 className="text-lg font-semibold text-purple-800 mb-2">年度收入</h2>
              <p className="text-3xl font-bold text-purple-600">0</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg">
              <h2 className="text-lg font-semibold text-blue-800 mb-2">酒店总数</h2>
              <p className="text-3xl font-bold text-blue-600">0</p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <h2 className="text-lg font-semibold text-green-800 mb-2">今日订单</h2>
              <p className="text-3xl font-bold text-green-600">0</p>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg">
              <h2 className="text-lg font-semibold text-purple-800 mb-2">待处理事项</h2>
              <p className="text-3xl font-bold text-purple-600">0</p>
            </div>
          </div>

          {/* 当前用户信息面板 */}
          <Collapse 
            className="mt-6"
            defaultActiveKey={[]}
            items={[
              {
                key: '1',
                label: '当前用户',
                children: (
                  <Descriptions bordered column={1}>
                    {Object.entries(localStorageData).map(([key, value]) => (
                      <Descriptions.Item key={key} label={key}>
                        {value}
                      </Descriptions.Item>
                    ))}
                  </Descriptions>
                ),
              },
            ]}
          />
        </div>
      </div>
    </TokenCheck>
  );
};

export default Home;
