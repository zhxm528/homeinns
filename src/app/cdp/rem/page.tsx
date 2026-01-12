'use client';

import Link from 'next/link';
import Sidebar from "@/components/cdp/rem/Sidebar";

const menuItems = [
  { name: '推荐策略', code: 'strategy', description: '场景策略配置、人群策略、规则引擎' },
  { name: '推荐模型', code: 'model', description: '模型管理、模型训练、模型评估' },
  { name: '推荐位管理', code: 'position-management', description: '推荐位配置、展示策略、渠道绑定' },
  { name: '推荐效果', code: 'effect', description: '点击率分析、转化率分析、推荐效果对比' },
];

export default function REMModuleHome() {
  return (
    <div className="flex h-[calc(100vh-8rem)]">
      <Sidebar />
      <div className="flex-1 bg-gray-50 overflow-y-auto">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">智能推荐（REM）</h1>
            <p className="text-gray-600">Recommend Management - 智能推荐引擎</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {menuItems.map((item) => (
              <Link
                key={item.code}
                href={`/cdp/rem/${item.code}`}
                className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow p-6"
              >
                <h2 className="text-lg font-semibold text-gray-900 mb-2">{item.name}</h2>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
