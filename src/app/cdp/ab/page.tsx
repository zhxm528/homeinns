'use client';

import Link from 'next/link';
import Sidebar from "@/components/cdp/ab/Sidebar";

const menuItems = [
  { name: '实验管理', code: 'management', description: '实验列表、实验状态监控、实验权限管理' },
  { name: '实验配置', code: 'configuration', description: '实验目标设置、流量分配、实验策略配置' },
  { name: '实验分析', code: 'analysis', description: '转化对比分析、显著性检验、实验结论生成' },
  { name: '实验资产', code: 'assets', description: '实验模板库、历史实验复用、实验知识沉淀' },
];

export default function ABModuleHome() {
  return (
    <div className="flex h-[calc(100vh-8rem)]">
      <Sidebar />
      <div className="flex-1 bg-gray-50 overflow-y-auto">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">实验分析（AB）</h1>
            <p className="text-gray-600">AB Test - A/B测试与效果分析</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {menuItems.map((item) => (
              <Link
                key={item.code}
                href={`/cdp/ab/${item.code}`}
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
