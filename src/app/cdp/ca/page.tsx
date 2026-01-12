'use client';

import Link from 'next/link';
import Sidebar from "@/components/cdp/ca/Sidebar";

const menuItems = [
  { name: '会话数据接入', code: 'data-ingestion', description: '微信/客服/社群接入、语音转文本管理、会话数据治理' },
  { name: '内容分析', code: 'content-analysis', description: '关键词分析、主题聚类、高频问题分析' },
  { name: '用户互动分析', code: 'interaction-analysis', description: '互动频率分析、响应时效分析、客服表现分析' },
  { name: '情感与意图', code: 'sentiment-intent', description: '情绪识别、用户意图识别、风险会话预警' },
];

export default function CAModuleHome() {
  return (
    <div className="flex h-[calc(100vh-8rem)]">
      <Sidebar />
      <div className="flex-1 bg-gray-50 overflow-y-auto">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">会话分析（CA）</h1>
            <p className="text-gray-600">Conversation Analytics - 对话数据智能分析</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {menuItems.map((item) => (
              <Link
                key={item.code}
                href={`/cdp/ca/${item.code}`}
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
