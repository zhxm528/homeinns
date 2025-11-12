'use client';
import '@ant-design/v5-patch-for-react-19';

import { useEffect, useState } from 'react';

export default function BusinessDataMonthlyReportPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/product/report-analysis/business-data-monthly-report', {
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
        <h1 className="text-2xl font-bold text-gray-900 mb-4">经营数据自然月报</h1>

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

