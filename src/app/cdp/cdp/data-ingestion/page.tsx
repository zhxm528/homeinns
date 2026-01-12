'use client';

import Link from 'next/link';
import Sidebar from "@/components/cdp/cdp/Sidebar";

const subMenuItems = [
  {
    name: '数据源管理',
    code: 'source-management',
    description: 'CRM / App / Web / 小程序 / 第三方数据源管理',
  },
  {
    name: '实时数据接入',
    code: 'realtime',
    description: 'SDK / API / Webhook 实时数据接入',
  },
  {
    name: '离线数据导入',
    code: 'offline',
    description: '文件 / DB / 云存储离线数据导入',
  },
  {
    name: '数据接入监控',
    code: 'monitor',
    description: '数据接入状态监控与告警',
  },
];

export default function DataIngestionPage() {
  return (
    <div className="flex h-[calc(100vh-8rem)]">
      <Sidebar />
      <div className="flex-1 bg-gray-50 overflow-y-auto">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* 页面标题 */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">数据接入</h1>
            <p className="text-gray-600">数据源管理、实时接入、离线导入、接入监控</p>
          </div>

          {/* 二级菜单卡片 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {subMenuItems.map((item) => (
              <Link
                key={item.code}
                href={`/cdp/cdp/data-ingestion/${item.code}`}
                className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">{item.name}</h2>
                  <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                  <div className="flex items-center text-sm text-blue-600">
                    <span>进入功能</span>
                    <svg
                      className="ml-2 w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
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
