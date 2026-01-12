'use client';

import Sidebar from "@/components/cdp/cdp/Sidebar";
import { useState } from "react";

export default function SourceManagementPage() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex h-[calc(100vh-8rem)]">
      <Sidebar />
      <div className="flex-1 bg-gray-50 overflow-y-auto">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* 页面标题 */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">数据源管理</h1>
            <p className="text-gray-600">管理 CRM / App / Web / 小程序 / 第三方数据源</p>
          </div>

          {/* 功能内容区域 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">数据源列表</h2>
              <div className="text-gray-600">
                <p>数据源管理功能开发中...</p>
                <p className="mt-2 text-sm">此页面将包含：</p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                  <li>数据源配置与连接管理</li>
                  <li>数据源类型：CRM、App、Web、小程序、第三方</li>
                  <li>数据源状态监控</li>
                  <li>数据源测试与验证</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
