'use client';

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import SectionSidebar from "@/components/SectionSidebar";
import QueryFilters, { type PrivateDomainFilters } from "@/components/cdp/private-domain-metrics/QueryFilters";
import Breadcrumb from "@/components/Breadcrumb";
import { headerMenuById } from "@/data/menu";
import type { PrivateDomainOverview } from "@/lib/privateDomainMetrics";

const statusStyles: Record<string, { border: string; text: string; badge: string }> = {
  good: { border: "border-emerald-200", text: "text-emerald-600", badge: "bg-emerald-50 text-emerald-600" },
  warn: { border: "border-amber-200", text: "text-amber-600", badge: "bg-amber-50 text-amber-600" },
  bad: { border: "border-red-200", text: "text-red-600", badge: "bg-red-50 text-red-600" },
};

export default function PrivateDomainMetricsOverviewPage() {
  const section = headerMenuById("cdp");
  if (!section) {
    throw new Error("CDP menu configuration missing.");
  }

  const [data, setData] = useState<PrivateDomainOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [filters, setFilters] = useState<PrivateDomainFilters>({
    managementType: "",
    region: "",
    cityArea: "",
    storeAge: "",
    city: "",
    hotel: "",
    startDate: "",
    endDate: "",
  });

  const handleFiltersChange = useCallback((newFilters: PrivateDomainFilters) => {
    setFilters(newFilters);
  }, []);

  const getTimePeriodLabel = () => {
    // 如果已选择周期，直接返回对应标签
    if (filters.selectedPeriod) {
      const periodMap: Record<string, string> = {
        week: "本周",
        month: "本月",
        quarter: "本季度",
        year: "本年",
      };
      return periodMap[filters.selectedPeriod] || "当前";
    }

    if (!filters.startDate || !filters.endDate) return "当前";
    const start = new Date(filters.startDate);
    const end = new Date(filters.endDate);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // 检查是否是本周
    const dayOfWeek = today.getDay();
    const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const weekStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - diff);
    if (start.getTime() === weekStart.getTime() && end.getTime() === today.getTime()) {
      return "本周";
    }
    
    // 检查是否是本月
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    if (start.getTime() === monthStart.getTime() && end.getTime() === today.getTime()) {
      return "本月";
    }
    
    // 检查是否是本季度
    const quarterStartMonth = Math.floor(today.getMonth() / 3) * 3;
    const quarterStart = new Date(today.getFullYear(), quarterStartMonth, 1);
    if (start.getTime() === quarterStart.getTime() && end.getTime() === today.getTime()) {
      return "本季度";
    }
    
    // 检查是否是本年
    const yearStart = new Date(today.getFullYear(), 0, 1);
    if (start.getTime() === yearStart.getTime() && end.getTime() === today.getTime()) {
      return "本年";
    }
    
    return "当前";
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/cdp/private-domain-metrics/overview");
        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`);
        }
        const payload = (await response.json()) as PrivateDomainOverview;
        setData(payload);
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "请求失败");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex h-[calc(100vh-8rem)]">
      <SectionSidebar title={section.title} href={section.url} items={section.sidebar ?? []} />
      <div className="flex-1 bg-gray-50 overflow-y-auto">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Breadcrumb
              items={[
                { label: "数据CDP", href: "/cdp" },
                { label: "私域指标总览" },
              ]}
            />
          </div>

          <QueryFilters onChange={handleFiltersChange} />

          {loading && (
            <div className="mt-8 bg-white border border-gray-200 rounded-xl p-6 text-gray-600">
              正在加载数据...
            </div>
          )}

          {!loading && errorMessage && (
            <div className="mt-8 bg-white border border-red-200 rounded-xl p-6 text-red-600">
              数据加载失败：{errorMessage}
            </div>
          )}

          {!loading && data && (
            <div className="mt-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.metrics.map((metric) => {
                  const style = statusStyles[metric.status] ?? statusStyles.warn;
                  const timePeriodLabel = getTimePeriodLabel();
                  const regionLabel = filters.region ? `${filters.region}大区目标` : "目标";
                  return (
                    <Link
                      key={metric.id}
                      href={metric.detailUrl}
                      className={`bg-white border ${style.border} rounded-2xl p-5 transition hover:shadow-md`}
                    >
                      <div className="flex items-center justify-between">
                        <h2 className="text-sm font-semibold text-gray-700">{metric.name}</h2>
                        <span className={`px-2 py-1 rounded-full text-xs ${style.badge}`}>{timePeriodLabel}</span>
                      </div>
                      <div className="mt-3 text-3xl font-semibold text-gray-900">{metric.currentValue}</div>
                      {filters.region && (
                        <div className="mt-2 text-sm text-gray-500">{regionLabel} {metric.target}</div>
                      )}
                      <div className={`mt-3 text-sm font-medium ${style.text}`}>
                        同比 {metric.trendValue}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
