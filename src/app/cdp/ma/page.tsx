'use client';

import Link from 'next/link';
import Sidebar from "@/components/cdp/ma/Sidebar";

const menuItems = [
  { name: '营销画布', code: 'canvas', description: '营销流程编排、多触点策略配置、实时决策节点' },
  { name: '触达管理', code: 'reach-management', description: '渠道管理、人群投放、触达频控' },
  { name: '内容与素材', code: 'content-material', description: 'AI内容生成、素材库管理、策略模板管理' },
  { name: '任务与监控', code: 'task-monitor', description: '执行监控、效果分析、异常预警' },
];

export default function MAModuleHome() {
  return (
    <div className="flex h-[calc(100vh-8rem)]">
      <Sidebar />
      <div className="flex-1 bg-gray-50 overflow-y-auto">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">营销自动化（MA）</h1>
            <p className="text-gray-600">Marketing Automation - 智能营销自动化</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {menuItems.map((item) => (
              <Link
                key={item.code}
                href={`/cdp/ma/${item.code}`}
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
