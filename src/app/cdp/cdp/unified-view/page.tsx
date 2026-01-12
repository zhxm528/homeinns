'use client';

import Link from 'next/link';
import Sidebar from "@/components/cdp/cdp/Sidebar";

const subMenuItems = [
  {
    name: 'OneID 规则配置',
    code: 'oneid',
    description: 'OneID 规则配置与管理',
  },
  {
    name: '身份合并策略',
    code: 'merge-strategy',
    description: '用户身份合并策略配置',
  },
  {
    name: '用户主档管理',
    code: 'master-data',
    description: '用户主档数据管理',
  },
  {
    name: '多实体关系管理',
    code: 'entity-relation',
    description: '人/设备/账号多实体关系管理',
  },
];

export default function UnifiedViewPage() {
  return (
    <div className="flex h-[calc(100vh-8rem)]">
      <Sidebar />
      <div className="flex-1 bg-gray-50 overflow-y-auto">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">用户统一视图</h1>
            <p className="text-gray-600">OneID配置、身份合并、用户主档、多实体关系</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {subMenuItems.map((item) => (
              <Link
                key={item.code}
                href={`/cdp/cdp/unified-view/${item.code}`}
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
