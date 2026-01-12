'use client';

import Link from 'next/link';
import Sidebar from "@/components/cdp/Sidebar";

const modules = [
  {
    code: 'cdp',
    name: '客户数据平台',
    enName: 'CDP',
    description: 'Customer Data Platform - 统一客户数据管理',
    color: 'blue',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
    ),
  },
  {
    code: 'fa',
    name: '融合分析平台',
    enName: 'FA',
    description: 'Fabric Analytics - 多维度数据分析',
    color: 'green',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    ),
  },
  {
    code: 'pa',
    name: '画像分析',
    enName: 'PA',
    description: 'Profile Analytics - 用户画像深度分析',
    color: 'purple',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    ),
  },
  {
    code: 'ca',
    name: '会话分析',
    enName: 'CA',
    description: 'Conversation Analytics - 对话数据智能分析',
    color: 'orange',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    ),
  },
  {
    code: 'ab',
    name: '实验分析',
    enName: 'AB',
    description: 'AB Test - A/B测试与效果分析',
    color: 'red',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    ),
  },
  {
    code: 'ma',
    name: '营销自动化',
    enName: 'MA',
    description: 'Marketing Automation - 智能营销自动化',
    color: 'pink',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
    ),
  },
  {
    code: 'scrm',
    name: '社交客户管理',
    enName: 'SCRM',
    description: 'Social Customer Relationship Management',
    color: 'indigo',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    ),
  },
  {
    code: 'lm',
    name: '客户忠诚度管理',
    enName: 'LM',
    description: 'Loyalty Management - 会员忠诚度管理',
    color: 'yellow',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    ),
  },
  {
    code: 'rem',
    name: '智能推荐',
    enName: 'REM',
    description: 'Recommend Management - 智能推荐引擎',
    color: 'teal',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    ),
  },
  {
    code: 'system',
    name: '系统管理与治理',
    enName: 'System',
    description: 'System Management & Governance',
    color: 'gray',
    icon: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </>
    ),
  },
];

const colorClasses = {
  blue: { bg: 'bg-blue-100', text: 'text-blue-600', hover: 'hover:bg-blue-50' },
  green: { bg: 'bg-green-100', text: 'text-green-600', hover: 'hover:bg-green-50' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-600', hover: 'hover:bg-purple-50' },
  orange: { bg: 'bg-orange-100', text: 'text-orange-600', hover: 'hover:bg-orange-50' },
  red: { bg: 'bg-red-100', text: 'text-red-600', hover: 'hover:bg-red-50' },
  pink: { bg: 'bg-pink-100', text: 'text-pink-600', hover: 'hover:bg-pink-50' },
  indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600', hover: 'hover:bg-indigo-50' },
  yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600', hover: 'hover:bg-yellow-50' },
  teal: { bg: 'bg-teal-100', text: 'text-teal-600', hover: 'hover:bg-teal-50' },
  gray: { bg: 'bg-gray-100', text: 'text-gray-600', hover: 'hover:bg-gray-50' },
};

export default function CDPHome() {
  return (
    <div className="flex h-[calc(100vh-8rem)]">
      <Sidebar />
      <div className="flex-1 bg-gray-50 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* 页面标题 */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">CDP 客户数据平台系统</h1>
            <p className="text-gray-600">统一客户数据管理、分析与营销平台</p>
          </div>

          {/* 模块卡片网格布局 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {modules.map((module) => {
              const colors = colorClasses[module.color as keyof typeof colorClasses];
              return (
                <Link
                  key={module.code}
                  href={`/cdp/${module.code}`}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div className={`w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center mr-4`}>
                        <svg
                          className={`w-6 h-6 ${colors.text}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          {module.icon}
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">{module.name}</h2>
                        <p className="text-sm text-gray-500">{module.enName}</p>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm">{module.description}</p>
                    <div className="mt-4 flex items-center text-sm text-gray-500">
                      <span>进入模块</span>
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
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
