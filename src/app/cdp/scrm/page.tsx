'use client';

import Link from 'next/link';
import Sidebar from "@/components/cdp/scrm/Sidebar";

const menuItems = [
  { name: '社交用户管理', code: 'user-management', description: '社交账号绑定、社交标签管理、私域用户池' },
  { name: '社群运营', code: 'community-operation', description: '社群管理、社群活跃度分析、群内容分析' },
  { name: '社交互动', code: 'social-interaction', description: '消息管理、自动回复规则、互动任务' },
  { name: '私域分析', code: 'private-domain-analysis', description: '私域转化分析、社交裂变分析、社交关系图谱' },
];

export default function SCRMModuleHome() {
  return (
    <div className="flex h-[calc(100vh-8rem)]">
      <Sidebar />
      <div className="flex-1 bg-gray-50 overflow-y-auto">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">社交客户管理（SCRM）</h1>
            <p className="text-gray-600">Social Customer Relationship Management</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {menuItems.map((item) => (
              <Link
                key={item.code}
                href={`/cdp/scrm/${item.code}`}
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
