'use client';

import Link from 'next/link';
import Sidebar from "@/components/cdp/lm/Sidebar";

const menuItems = [
  { name: '会员体系', code: 'membership-system', description: '等级规则配置、升降级策略、会员身份管理' },
  { name: '积分与权益', code: 'points-benefits', description: '积分规则、权益配置、权益核销' },
  { name: '会员运营', code: 'membership-operation', description: '会员任务、会员活动、会员触达' },
  { name: '忠诚度分析', code: 'loyalty-analysis', description: '活跃度分析、忠诚度评分、会员生命周期' },
];

export default function LMModuleHome() {
  return (
    <div className="flex h-[calc(100vh-8rem)]">
      <Sidebar />
      <div className="flex-1 bg-gray-50 overflow-y-auto">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">客户忠诚度管理（LM）</h1>
            <p className="text-gray-600">Loyalty Management - 会员忠诚度管理</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {menuItems.map((item) => (
              <Link
                key={item.code}
                href={`/cdp/lm/${item.code}`}
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
