'use client';

import Link from 'next/link';
import Sidebar from "@/components/cdp/fa/Sidebar";

const menuItems = [
  { name: '用户分析', code: 'user-analysis', description: '新增/活跃/留存分析、用户生命周期、用户价值分析' },
  { name: '产品分析', code: 'product-analysis', description: '功能使用路径、漏斗分析、留存与流失分析' },
  { name: '营销分析', code: 'marketing-analysis', description: '渠道效果分析、转化归因分析、ROI分析' },
  { name: '经营分析', code: 'business-analysis', description: '收入结构分析、成本与收益分析、关键经营指标看板' },
  { name: '场景分析', code: 'scenario-analysis', description: '自定义分析模型、业务指标建模、跨域数据联动分析' },
  { name: '智能分析', code: 'intelligent-analysis', description: '自动洞察、异常波动识别、大模型分析解读' },
];

export default function FAModuleHome() {
  return (
    <div className="flex h-[calc(100vh-8rem)]">
      <Sidebar />
      <div className="flex-1 bg-gray-50 overflow-y-auto">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">融合分析平台（FA）</h1>
            <p className="text-gray-600">Fabric Analytics - 多维度数据分析</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {menuItems.map((item) => (
              <Link
                key={item.code}
                href={`/cdp/fa/${item.code}`}
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
