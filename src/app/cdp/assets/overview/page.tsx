'use client';

import { useEffect, useMemo, useState } from "react";
// @ts-ignore: echarts types might be missing
import ReactECharts from "echarts-for-react";
import SectionSidebar from "@/components/SectionSidebar";
import { headerMenuById } from "@/data/menu";

type OverviewCard = {
  id: string;
  title: string;
  value: string | number;
  subItems: { label: string; value: number }[];
};

type TrendSummary = {
  label: string;
  value: number;
  change: number;
};

type AssetOverviewResponse = {
  summary: {
    updatedAt: string;
  };
  overviewCards: OverviewCard[];
  trend: {
    summary: TrendSummary[];
    range: { start: string; end: string };
    dates: string[];
    series: { name: string; data: number[] }[];
  };
  distribution: {
    title: string;
    unit: string;
    items: { name: string; value: number }[];
  };
};

const cardStyles = [
  "from-blue-100 via-blue-200 to-indigo-300",
  "from-violet-200 via-purple-200 to-indigo-300",
  "from-cyan-100 via-sky-200 to-blue-300",
];

const tabs = [
  { id: "customer", label: "客户视图" },
  { id: "tag", label: "标签视图" },
  { id: "segment", label: "分群视图" },
];

const formatChange = (value: number) => {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
};

export default function AssetOverviewPage() {
  const section = headerMenuById("cdp");
  if (!section) {
    throw new Error("CDP menu configuration missing.");
  }

  const [activeTab, setActiveTab] = useState("customer");
  const [data, setData] = useState<AssetOverviewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/cdp/assets/overview");
        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`);
        }
        const payload = (await response.json()) as AssetOverviewResponse;
        setData(payload);
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "请求失败");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartOption = useMemo(() => {
    if (!data) {
      return {};
    }
    return {
      color: ["#5B7CFF", "#4BCFA3"],
      tooltip: { trigger: "axis" },
      grid: { left: 32, right: 24, top: 24, bottom: 28 },
      xAxis: {
        type: "category",
        data: data.trend.dates,
        boundaryGap: false,
        axisLine: { lineStyle: { color: "#E5E7EB" } },
        axisLabel: { color: "#6B7280" },
      },
      yAxis: {
        type: "value",
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { lineStyle: { color: "#E5E7EB", type: "dashed" } },
        axisLabel: { color: "#6B7280" },
      },
      series: data.trend.series.map((item) => ({
        name: item.name,
        type: "line",
        smooth: true,
        symbol: "circle",
        symbolSize: 6,
        data: item.data,
        lineStyle: { width: 2 },
        areaStyle: { opacity: 0.1 },
      })),
      legend: {
        bottom: 0,
        textStyle: { color: "#6B7280" },
      },
    };
  }, [data]);

  const distributionOption = useMemo(() => {
    if (!data) {
      return {};
    }
    const names = data.distribution.items.map((item) => item.name);
    return {
      tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
      grid: { left: 140, right: 24, top: 10, bottom: 20 },
      xAxis: {
        type: "value",
        axisLine: { lineStyle: { color: "#E5E7EB" } },
        axisLabel: { color: "#6B7280" },
        splitLine: { lineStyle: { color: "#E5E7EB", type: "dashed" } },
      },
      yAxis: {
        type: "category",
        data: names,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: "#6B7280" },
      },
      series: [
        {
          name: data.distribution.unit,
          type: "bar",
          data: data.distribution.items.map((item) => item.value),
          barWidth: 18,
          itemStyle: { color: "#5B7CFF", borderRadius: [6, 6, 6, 6] },
        },
      ],
    };
  }, [data]);

  return (
    <div className="flex h-[calc(100vh-8rem)]">
      <SectionSidebar title={section.title} href={section.url} items={section.sidebar ?? []} />
      <div className="flex-1 bg-gray-50 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">资产概览</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2">
                <span className="text-sm text-gray-500">统计主体</span>
                <select className="text-sm text-gray-700 bg-transparent focus:outline-none">
                  <option>客户</option>
                  <option>会员</option>
                </select>
              </div>
              <div className="text-sm text-gray-500">页面数据 +1 更新</div>
            </div>
          </div>

          {loading && (
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-gray-600">
              正在加载数据...
            </div>
          )}

          {!loading && errorMessage && (
            <div className="bg-white border border-red-200 rounded-lg p-6 text-red-600">
              数据加载失败：{errorMessage}
            </div>
          )}

          {!loading && data && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {data.overviewCards.map((card, index) => (
                  <div
                    key={card.id}
                    className={`relative overflow-hidden rounded-2xl p-6 text-gray-900 bg-gradient-to-br ${cardStyles[index % cardStyles.length]}`}
                  >
                    <div className="absolute -right-6 -top-10 h-28 w-28 rounded-full bg-white/30 blur-2xl" />
                    <div className="absolute right-6 top-6 h-16 w-16 rounded-full bg-white/40" />
                    <div className="relative">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                        {card.title}
                        <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-white/70 text-[10px] text-gray-700">
                          ?
                        </span>
                      </div>
                      <div className="mt-3 text-3xl font-semibold text-gray-900">{card.value}</div>
                      <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-gray-700">
                        {card.subItems.map((item) => (
                          <div key={item.label} className="flex items-center justify-between">
                            <span className="text-gray-700/90">{item.label}</span>
                            <span className="font-semibold text-gray-900">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-5 py-2 rounded-lg border text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? "border-blue-600 text-blue-600 bg-white"
                        : "border-transparent text-gray-600 bg-white"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600/10 text-blue-600">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 19h16M6 16V8m6 8V6m6 10v-4" />
                      </svg>
                    </span>
                    <h2 className="text-lg font-semibold text-gray-900">客户趋势</h2>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3M3 11h18M5 7h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2z" />
                      </svg>
                      <span>{data.trend.range.start}</span>
                      <span className="text-gray-400">To</span>
                      <span>{data.trend.range.end}</span>
                    </div>
                    <button className="h-9 w-9 rounded-lg border border-gray-200 text-gray-500 hover:text-blue-600">
                      <svg className="h-4 w-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6h4m6 4a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h4l2-2h8a2 2 0 012 2z" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                  {data.trend.summary.map((item) => (
                    <div key={item.label} className="border-r border-gray-100 pr-6 last:border-r-0 last:pr-0">
                      <div className="text-sm text-gray-500">{item.label}</div>
                      <div className="mt-2 text-2xl font-semibold text-gray-900">{item.value}</div>
                      <div
                        className={`mt-2 text-sm font-medium ${
                          item.change >= 0 ? "text-emerald-600" : "text-red-500"
                        }`}
                      >
                        {item.change >= 0 ? "▲" : "▼"} {formatChange(item.change)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <ReactECharts option={chartOption} style={{ height: 320 }} />
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-6">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600/10 text-blue-600">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h8M4 12h12M4 18h16" />
                    </svg>
                  </span>
                  <h2 className="text-lg font-semibold text-gray-900">{data.distribution.title}</h2>
                </div>
                <div className="text-sm text-gray-500 mb-3">{data.distribution.unit}</div>
                <ReactECharts option={distributionOption} style={{ height: 360 }} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
