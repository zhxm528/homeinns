'use client';

import Sidebar from "@/components/cdp/cdp/Sidebar";
import { useState } from "react";

export default function OfflineDataImportPage() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex h-[calc(100vh-8rem)]">
      <Sidebar />
      <div className="flex-1 bg-gray-50 overflow-y-auto">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">离线数据导入</h1>
            <p className="text-gray-600">文件 / DB / 云存储离线数据导入</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">离线数据导入</h2>
              <div className="text-gray-600">
                <p>离线数据导入功能开发中...</p>
                <p className="mt-2 text-sm">此页面将包含：</p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                  <li>文件上传导入</li>
                  <li>数据库连接导入</li>
                  <li>云存储数据导入</li>
                  <li>导入任务管理</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
