'use client';

import Link from 'next/link';
import Sidebar from "@/components/cdp/system/Sidebar";

const menuItems = [
  { name: '组织与权限', code: 'organization-permission', description: '组织管理、角色管理、权限策略' },
  { name: '系统配置', code: 'system-config', description: '参数配置、通用字典、集成配置' },
  { name: '安全与合规', code: 'security-compliance', description: '数据脱敏、审计日志、合规策略' },
  { name: '运维监控', code: 'operation-monitor', description: '系统健康监控、任务调度、告警管理' },
];

export default function SystemModuleHome() {
  return (
    <div className="flex h-[calc(100vh-8rem)]">
      <Sidebar />
      <div className="flex-1 bg-gray-50 overflow-y-auto">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">系统管理与治理</h1>
            <p className="text-gray-600">System Management & Governance - 系统管理与治理</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {menuItems.map((item) => (
              <Link
                key={item.code}
                href={`/cdp/system/${item.code}`}
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
