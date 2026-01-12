'use client';

import Sidebar from "@/components/cdp/cdp/Sidebar";
import { useState } from "react";

export default function RealtimeDataIngestionPage() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex h-[calc(100vh-8rem)]">
      <Sidebar />
      <div className="flex-1 bg-gray-50 overflow-y-auto">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">实时数据接入</h1>
            <p className="text-gray-600">SDK / API / Webhook 实时数据接入配置与管理</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">实时数据接入配置</h2>
              <div className="text-gray-600">
                <p>实时数据接入功能开发中...</p>
                <p className="mt-2 text-sm">此页面将包含：</p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                  <li>SDK 接入配置</li>
                  <li>API 接入配置</li>
                  <li>Webhook 接入配置</li>
                  <li>实时数据流监控</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
