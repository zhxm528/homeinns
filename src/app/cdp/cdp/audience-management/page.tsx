'use client';

import Link from 'next/link';
import Sidebar from "@/components/cdp/cdp/Sidebar";

const subMenuItems = [
  {
    name: '人群圈选',
    code: 'segment',
    description: '条件/行为/组合人群圈选',
  },
  {
    name: '动态人群',
    code: 'dynamic',
    description: '动态人群管理与更新',
  },
  {
    name: '人群分层管理',
    code: 'layer',
    description: '人群分层与层级管理',
  },
  {
    name: '人群预估与覆盖分析',
    code: 'coverage',
    description: '人群预估与覆盖范围分析',
  },
];

export default function AudienceManagementPage() {
  return (
    <div className="flex h-[calc(100vh-8rem)]">
      <Sidebar />
      <div className="flex-1 bg-gray-50 overflow-y-auto">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">人群管理</h1>
            <p className="text-gray-600">人群圈选、动态人群、人群分层、覆盖分析</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {subMenuItems.map((item) => (
              <Link
                key={item.code}
                href={`/cdp/cdp/audience-management/${item.code}`}
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
