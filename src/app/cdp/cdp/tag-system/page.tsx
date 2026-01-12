'use client';

import Link from 'next/link';
import Sidebar from "@/components/cdp/cdp/Sidebar";

const subMenuItems = [
  {
    name: '标签目录管理',
    code: 'catalog',
    description: '标签目录结构与分类管理',
  },
  {
    name: '行为标签',
    code: 'behavior',
    description: '用户行为标签管理',
  },
  {
    name: '属性标签',
    code: 'attribute',
    description: '用户属性标签管理',
  },
  {
    name: '统计标签',
    code: 'statistical',
    description: '统计类标签管理',
  },
  {
    name: 'AI 自动标签生成',
    code: 'ai-generation',
    description: 'AI 自动标签生成与管理',
  },
];

export default function TagSystemPage() {
  return (
    <div className="flex h-[calc(100vh-8rem)]">
      <Sidebar />
      <div className="flex-1 bg-gray-50 overflow-y-auto">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">标签体系</h1>
            <p className="text-gray-600">标签目录、行为标签、属性标签、统计标签、AI标签</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {subMenuItems.map((item) => (
              <Link
                key={item.code}
                href={`/cdp/cdp/tag-system/${item.code}`}
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
