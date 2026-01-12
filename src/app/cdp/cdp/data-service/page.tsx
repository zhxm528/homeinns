'use client';

import Link from 'next/link';
import Sidebar from "@/components/cdp/cdp/Sidebar";

const subMenuItems = [
  {
    name: '数据 API 服务',
    code: 'api',
    description: '数据 API 服务配置与管理',
  },
  {
    name: '实时画像查询',
    code: 'profile-query',
    description: '实时用户画像查询服务',
  },
  {
    name: '标签服务订阅',
    code: 'tag-subscription',
    description: '标签服务订阅与管理',
  },
  {
    name: '下游系统授权管理',
    code: 'authorization',
    description: '下游系统访问授权管理',
  },
];

export default function DataServicePage() {
  return (
    <div className="flex h-[calc(100vh-8rem)]">
      <Sidebar />
      <div className="flex-1 bg-gray-50 overflow-y-auto">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">数据服务</h1>
            <p className="text-gray-600">API服务、画像查询、标签订阅、系统授权</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {subMenuItems.map((item) => (
              <Link
                key={item.code}
                href={`/cdp/cdp/data-service/${item.code}`}
                className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">{item.name}</h2>
                  <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                  <div className="flex items-center text-sm text-blue-600">
                    <span>进入功能</span>
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
