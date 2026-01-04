'use client';
import '@ant-design/v5-patch-for-react-19';

import { useState, useEffect } from 'react';
import Link from 'next/link';
// @ts-ignore: antd may not have types installed in this environment
import 'antd/dist/reset.css';

export default function AvailabilityCheckPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/product/revenue-management/availability-check', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        const json = await res.json();
        setData(json);
      } catch (e: any) {
        setError(e?.message || '请求失败');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">可用性检查</h1>
            <p className="text-gray-600">查看可用性检查结果</p>
          </div>
          <Link
            href="/product"
            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            返回产品中心
          </Link>
        </div>

        {loading && <div className="text-gray-600">加载中...</div>}
        {error && <div className="text-red-600">{error}</div>}

        {!loading && !error && (
          <pre className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 overflow-auto text-sm">
            {JSON.stringify(data, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}

