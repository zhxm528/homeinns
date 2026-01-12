'use client';

import Link from 'next/link';
import Sidebar from "@/components/cdp/pa/Sidebar";

const menuItems = [
  { name: '画像概览', code: 'overview', description: '单用户画像、人群画像、实时画像预览' },
  { name: '画像维度', code: 'dimension', description: '基础属性画像、行为画像、偏好画像、价值画像' },
  { name: '画像对比', code: 'comparison', description: '人群画像对比、时间维度变化对比、标签分布对比' },
  { name: '画像洞察', code: 'insight', description: '关键特征洞察、用户画像总结（AI）、画像导出' },
];

export default function PAModuleHome() {
  return (
    <div className="flex h-[calc(100vh-8rem)]">
      <Sidebar />
      <div className="flex-1 bg-gray-50 overflow-y-auto">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">画像分析（PA）</h1>
            <p className="text-gray-600">Profile Analytics - 用户画像深度分析</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {menuItems.map((item) => (
              <Link
                key={item.code}
                href={`/cdp/pa/${item.code}`}
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
