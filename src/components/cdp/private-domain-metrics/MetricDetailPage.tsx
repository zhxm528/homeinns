'use client';

import React, { useEffect, useMemo, useRef, useState } from "react";
// @ts-ignore: echarts types might be missing
import ReactECharts from "echarts-for-react";
import SectionSidebar from "@/components/SectionSidebar";
import QueryFilters from "@/components/cdp/private-domain-metrics/QueryFilters";
import Breadcrumb from "@/components/Breadcrumb";
import { headerMenuById } from "@/data/menu";
import type { PrivateDomainMetricDetail } from "@/lib/privateDomainMetrics";

type MetricDetailPageProps = {
  metricId: string;
  pageTitle: string;
  metricName?: string;
  showBreadcrumb?: boolean;
};

export default function MetricDetailPage({ metricId, pageTitle, metricName, showBreadcrumb = false }: MetricDetailPageProps) {
  const section = headerMenuById("cdp");
  if (!section) {
    throw new Error("CDP menu configuration missing.");
  }

  const [data, setData] = useState<PrivateDomainMetricDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"dashboard" | "details">("dashboard");
  const [isDefOpen, setIsDefOpen] = useState(false);
  const [expandedRegions, setExpandedRegions] = useState<Set<string>>(new Set());
  const [expandedCities, setExpandedCities] = useState<Set<string>>(new Set());
  const infoRef = useRef<HTMLDivElement | null>(null);

  const cityKey = (region: string, city: string) => `${region}||${city}`;

  const toggleRegion = (region: string) => {
    setExpandedRegions((prev) => {
      const s = new Set(prev);
      if (s.has(region)) s.delete(region);
      else s.add(region);
      return s;
    });
  };

  const isRegionExpanded = (region: string) => expandedRegions.has(region);

  const toggleCity = (region: string, city: string) => {
    const k = cityKey(region, city);
    setExpandedCities((prev) => {
      const s = new Set(prev);
      if (s.has(k)) s.delete(k);
      else s.add(k);
      return s;
    });
  };

  const isCityExpanded = (region: string, city: string) => expandedCities.has(cityKey(region, city));

  const RegionToggle = ({ region }: { region: string }) => (
    <button onClick={() => toggleRegion(region)} className="flex items-center gap-2 text-left text-sm">
      <svg className={`w-4 h-4 transform transition-transform ${isRegionExpanded(region) ? "rotate-90" : "rotate-0"}`} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 4l8 6-8 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span>{region}</span>
    </button>
  );

  const CityToggle = ({ region, city }: { region: string; city: string }) => (
    <button onClick={() => toggleCity(region, city)} className="flex items-center gap-2 text-left text-sm">
      <svg className={`w-3 h-3 transform transition-transform ${isCityExpanded(region, city) ? "rotate-90" : "rotate-0"}`} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 4l8 6-8 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span>{city}</span>
    </button>
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!infoRef.current) {
        return;
      }
      if (!infoRef.current.contains(event.target as Node)) {
        setIsInfoOpen(false);
      }
    };
    if (isInfoOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isInfoOpen]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/cdp/private-domain-metrics/${metricId}`);
        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`);
        }
        const payload = (await response.json()) as PrivateDomainMetricDetail;
        setData(payload);
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "请求失败");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [metricId]);

  const trendOption = useMemo(() => {
    if (!data) {
      return {};
    }
    return {
      tooltip: { trigger: "axis" },
      grid: { left: 36, right: 20, top: 20, bottom: 30 },
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
      series: [
        {
          name: data.name,
          type: "line",
          smooth: true,
          data: data.trend.values,
          symbol: "circle",
          symbolSize: 6,
          lineStyle: { width: 2, color: "#2563EB" },
          areaStyle: { opacity: 0.1, color: "#93C5FD" },
        },
      ],
    };
  }, [data]);

  const breakdownOption = useMemo(() => {
    if (!data) {
      return {};
    }
    const names = data.breakdown.byStore.map((item) => item.name);
    return {
      tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
      grid: { left: 160, right: 24, top: 10, bottom: 20 },
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
          name: "完成率",
          type: "bar",
          data: data.breakdown.byStore.map((item) => item.value),
          barWidth: 16,
          itemStyle: { color: "#2563EB", borderRadius: [6, 6, 6, 6] },
        },
      ],
    };
  }, [data]);

  // 模拟表格数据并生成城区、小计行与大区小计行
  const tableRows = useMemo(() => {
    type Row = {
      region: string;
      city: string;
      store: string;
      success: number; // 成功拉新企微人数
      total: number; // 可拉新企微总人数
      targetPer100?: number; // 每百人拉新目标，仅大区小计有值
      isCitySubtotal?: boolean;
      isRegionSubtotal?: boolean;
    };

    const simulated: Omit<Row, 'targetPer100' | 'isCitySubtotal' | 'isRegionSubtotal'>[] = [
      { region: "华北", city: "北京一", store: "门店A", success: 120, total: 10000 },
      { region: "华北", city: "北京一", store: "门店B", success: 80, total: 5000 },
      { region: "华北", city: "北京二", store: "门店C", success: 95, total: 7000 },
      { region: "华南", city: "广州一", store: "门店D", success: 60, total: 6000 },
      { region: "华南", city: "广州一", store: "门店E", success: 40, total: 3000 },
      { region: "华南", city: "深圳一", store: "门店F", success: 70, total: 4000 },
    ];

    // define region-level targets
    const regionTarget: Record<string, number> = { "华北": 1.5, "华南": 1.8 };

    const regions = Array.from(new Set(simulated.map((r) => r.region)));
    const result: Row[] = [];

    for (const region of regions) {
      const regionRows = simulated.filter((r) => r.region === region);
      const cities = Array.from(new Set(regionRows.map((r) => r.city)));

      for (const city of cities) {
        const cityRows = regionRows.filter((r) => r.city === city);
        // push store rows
        for (const r of cityRows) result.push({ ...r });

        // city subtotal
        const citySuccess = cityRows.reduce((s, x) => s + x.success, 0);
        const cityTotal = cityRows.reduce((s, x) => s + x.total, 0);
        result.push({
          region,
          city,
          store: "城区小计",
          success: citySuccess,
          total: cityTotal,
          isCitySubtotal: true,
        });
      }

      // region subtotal
      const regionSuccess = regionRows.reduce((s, x) => s + x.success, 0);
      const regionTotal = regionRows.reduce((s, x) => s + x.total, 0);
      result.push({
        region,
        city: "",
        store: "大区小计",
        success: regionSuccess,
        total: regionTotal,
        targetPer100: regionTarget[region] ?? 0,
        isRegionSubtotal: true,
      });
    }

    return result;
  }, []);

  return (
    <div className="flex h-[calc(100vh-8rem)]">
      <SectionSidebar title={section.title} href={section.url} items={section.sidebar ?? []} />
      <div className="flex-1 bg-gray-50 overflow-y-auto">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
          {showBreadcrumb && (
            <div className={activeTab === "details" ? "mb-2" : "mb-6"}>
              <Breadcrumb
                items={[
                  { label: "数据CDP", href: "/cdp" },
                  { label: "私域指标", href: "/cdp/private-domain-metrics" },
                  { label: metricName || data?.name || "指标详情" },
                ]}
              />
            </div>
          )}
          
          {showBreadcrumb && (
            <div className={activeTab === "details" ? "mb-2" : "mb-6"}>
              <div className="flex gap-6 border-b border-gray-200">
                <button
                  onClick={() => setActiveTab("dashboard")}
                  className={`pb-3 font-medium transition-colors ${
                    activeTab === "dashboard"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  指标看板
                </button>
                <button
                  onClick={() => setActiveTab("details")}
                  className={`pb-3 font-medium transition-colors ${
                    activeTab === "details"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  指标明细
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div>
              {!showBreadcrumb && activeTab !== "details" && (
                <div className="text-sm text-blue-600 font-semibold">{pageTitle}</div>
              )}
              <div className="flex items-center gap-2 mt-1">
                {activeTab !== "details" && (
                  <h1 className="text-2xl font-semibold text-gray-900">
                    {data?.name ?? "加载中"}
                  </h1>
                )}
                {activeTab !== "details" && (
                  <div className="relative" ref={infoRef}>
                    <button
                      type="button"
                      onClick={() => setIsInfoOpen((prev) => !prev)}
                      className="h-5 w-5 rounded-full border border-gray-300 text-gray-500 text-xs flex items-center justify-center hover:text-blue-600 hover:border-blue-300"
                      aria-label="查看指标说明"
                    >
                      ?
                    </button>
                    {isInfoOpen && data && (
                      <div className="absolute z-10 mt-2 w-[360px] rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-700 shadow-lg">
                        <div className="grid grid-cols-1 gap-3">
                          <div>
                            <div className="text-gray-500">指标定义</div>
                            <div className="mt-1 text-gray-900">{data.definition}</div>
                          </div>
                          <div>
                            <div className="text-gray-500">计算公式</div>
                            <div className="mt-1 text-gray-900">{data.formula}</div>
                          </div>
                          <div>
                            <div className="text-gray-500">分子</div>
                            <div className="mt-1 text-gray-900">{data.numerator}</div>
                          </div>
                          <div>
                            <div className="text-gray-500">分母</div>
                            <div className="mt-1 text-gray-900">{data.denominator}</div>
                          </div>
                          <div>
                            <div className="text-gray-500">考核有效期</div>
                            <div className="mt-1 text-gray-900">{data.period}</div>
                          </div>
                          <div className="border border-red-200 bg-red-50 rounded-lg p-3 text-red-600">
                            剔除规则：{data.exclusions.join("、")}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              {activeTab !== "details" && data && <p className="text-gray-600 mt-2">{data.definition}</p>}
            </div>
          </div>

          {activeTab !== "details" && <QueryFilters />}

          {loading && (
            <div className="bg-white border border-gray-200 rounded-xl p-6 text-gray-600">
              正在加载数据...
            </div>
          )}

          {!loading && errorMessage && (
            <div className="bg-white border border-red-200 rounded-xl p-6 text-red-600">
              数据加载失败：{errorMessage}
            </div>
          )}

          {!loading && data && activeTab === "dashboard" && (
            <div className="space-y-6">

              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">当前表现</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="border border-gray-200 rounded-xl p-4">
                    <div className="text-sm text-gray-500">当前值</div>
                    <div className="text-2xl font-semibold text-gray-900 mt-2">{data.currentValue}</div>
                    <div className="text-sm text-gray-500 mt-2">Q1 目标 {data.target}</div>
                  </div>
                  <div className="border border-gray-200 rounded-xl p-4">
                    <div className="text-sm text-gray-500">同比</div>
                    <div className="text-2xl font-semibold text-gray-900 mt-2">{data.yoy}</div>
                  </div>
                  <div className="border border-gray-200 rounded-xl p-4">
                    <div className="text-sm text-gray-500">环比</div>
                    <div className="text-2xl font-semibold text-gray-900 mt-2">{data.mom}</div>
                  </div>
                  <div className="border border-gray-200 rounded-xl p-4">
                    <div className="text-sm text-gray-500">排名</div>
                    <div className="text-2xl font-semibold text-gray-900 mt-2">{data.ranking}</div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-lg font-semibold text-gray-900">构成拆解</h2>
                  <div className="text-sm text-gray-500">支持门店 / 时间 / 人群拆解</div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  {[
                    { label: "分母规模", value: data.breakdown.denominator },
                    { label: "已完成量", value: data.breakdown.completed },
                    { label: "未完成量", value: data.breakdown.pending },
                  ].map((item) => (
                    <div key={item.label} className="border border-gray-200 rounded-xl p-4">
                      <div className="text-sm text-gray-500">{item.label}</div>
                      <div className="text-2xl font-semibold text-gray-900 mt-2">{item.value}</div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                  <div className="border border-gray-200 rounded-xl p-4">
                    <div className="text-sm text-gray-500 mb-3">门店拆解（完成率）</div>
                    <ReactECharts option={breakdownOption} style={{ height: 280 }} />
                  </div>
                  <div className="border border-gray-200 rounded-xl p-4 space-y-4">
                    <div>
                      <div className="text-sm text-gray-500 mb-2">时间拆解</div>
                      <div className="space-y-2">
                        {data.breakdown.byTime.map((item) => (
                          <div
                            key={item.label}
                            className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2"
                          >
                            <span className="text-sm text-gray-700">{item.label}</span>
                            <span className="text-sm font-semibold text-gray-900">{item.value}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-2">人群拆解</div>
                      <div className="space-y-2">
                        {data.breakdown.byGroup.map((item) => (
                          <div key={item.name} className="flex items-center justify-between text-sm text-gray-700">
                            <span>{item.name}</span>
                            <span className="font-semibold text-gray-900">{item.value}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-lg font-semibold text-gray-900">趋势分析</h2>
                  <div className="text-sm text-gray-500">按日趋势</div>
                </div>
                <div className="mt-4">
                  <ReactECharts option={trendOption} style={{ height: 300 }} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {data.trend.keyPoints.map((point) => (
                    <div key={point.date} className="border border-gray-200 rounded-xl p-4">
                      <div className="text-sm text-gray-500">{point.date}</div>
                      <div className="text-base font-semibold text-gray-900 mt-1">{point.label}</div>
                      <div className="text-sm text-gray-600 mt-2">{point.note}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">行动指引</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="border border-gray-200 rounded-xl p-4">
                    <div className="text-gray-500 mb-2">标准动作</div>
                    <ul className="space-y-2 text-gray-700">
                      {data.actionGuide.actions.map((item) => (
                        <li key={item}>- {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="border border-gray-200 rounded-xl p-4">
                    <div className="text-gray-500 mb-2">推荐话术</div>
                    <ul className="space-y-2 text-gray-700">
                      {data.actionGuide.scripts.map((item) => (
                        <li key={item}>- {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="border border-gray-200 rounded-xl p-4">
                    <div className="text-gray-500 mb-2">参考做法</div>
                    <ul className="space-y-2 text-gray-700">
                      {data.actionGuide.references.map((item) => (
                        <li key={item}>- {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!loading && data && activeTab === "details" && (
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">指标明细表</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-500">
                        <th className="px-4 py-2">大区 / 城区 / 门店</th>
                        <th className="px-4 py-2">成功拉新人数</th>
                        <th className="px-4 py-2">可拉新总人数</th>
                        <th className="px-4 py-2">每百人拉新数</th>
                        <th className="px-4 py-2">每百人拉新目标</th>
                        <th className="px-4 py-2">拉新完成率</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(() => {
                        const regions = Array.from(new Set(tableRows.map((r) => r.region)));
                        return regions.map((region) => {
                          const regionRows = tableRows.filter((r) => r.region === region);
                          const regionSubtotal = regionRows.find((r) => r.isRegionSubtotal)!;
                          const cities = Array.from(new Set(regionRows.map((r) => r.city).filter((c) => c)));

                          return (
                            <React.Fragment key={region}>
                              <tr key={`region-${region}`} className="font-semibold bg-gray-50">
                                <td className="px-4 py-2 align-top">
                                  <RegionToggle region={region} />
                                </td>
                                <td className="px-4 py-2 align-top">{regionSubtotal?.success ?? '-'}</td>
                                <td className="px-4 py-2 align-top">{regionSubtotal?.total ?? '-'}</td>
                                <td className="px-4 py-2 align-top">{regionSubtotal ? ((regionSubtotal.success / Math.max(1, regionSubtotal.total)) * 100).toFixed(2) : '-'}</td>
                                <td className="px-4 py-2 align-top">{regionSubtotal?.targetPer100 ? (regionSubtotal.targetPer100).toFixed(2) : '-'}</td>
                                <td className="px-4 py-2 align-top">{regionSubtotal?.targetPer100 ? `${(((regionSubtotal.success / Math.max(1, regionSubtotal.total)) * 100) / regionSubtotal.targetPer100 * 100).toFixed(1)}%` : '-'}</td>
                              </tr>

                              {isRegionExpanded(region) &&
                                cities.map((city) => {
                                  const cityStores = regionRows.filter((r) => r.city === city && !r.isCitySubtotal && !r.isRegionSubtotal);
                                  const citySubtotal = regionRows.find((r) => r.city === city && r.isCitySubtotal);

                                  return (
                                    <React.Fragment key={`city-frag-${region}-${city}`}>
                                      <tr key={`city-${region}-${city}`} className="bg-white">
                                        <td className="px-4 py-2 align-top">
                                          <div className="flex items-center gap-2">
                                            <CityToggle region={region} city={city} />
                                            <span className="text-sm text-gray-700 font-medium">{city}</span>
                                          </div>
                                        </td>
                                        <td className="px-4 py-2 align-top">{citySubtotal?.success ?? '-'}</td>
                                        <td className="px-4 py-2 align-top">{citySubtotal?.total ?? '-'}</td>
                                        <td className="px-4 py-2 align-top">{citySubtotal ? ((citySubtotal.success / Math.max(1, citySubtotal.total)) * 100).toFixed(2) : '-'}</td>
                                        <td className="px-4 py-2 align-top">-</td>
                                        <td className="px-4 py-2 align-top">-</td>
                                      </tr>

                                      {isCityExpanded(region, city) &&
                                        cityStores.map((storeRow, sidx) => (
                                          <tr key={`store-${region}-${city}-${sidx}`} className="">
                                            <td className="px-4 py-2 align-top pl-6">{city} / {storeRow.store}</td>
                                            <td className="px-4 py-2 align-top">{storeRow.success}</td>
                                            <td className="px-4 py-2 align-top">{storeRow.total}</td>
                                            <td className="px-4 py-2 align-top">{(storeRow.total > 0 ? (storeRow.success / storeRow.total) * 100 : 0).toFixed(2)}</td>
                                            <td className="px-4 py-2 align-top">-</td>
                                            <td className="px-4 py-2 align-top">-</td>
                                          </tr>
                                        ))}
                                    </React.Fragment>
                                  );
                                })}
                            </React.Fragment>
                          );
                        });
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl">
                <div className="p-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">指标定义</h2>
                    <div className="text-sm text-gray-500">点击展开查看完整定义与计算细则</div>
                  </div>
                  <button
                    onClick={() => setIsDefOpen((s) => !s)}
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-2"
                    aria-expanded={isDefOpen}
                  >
                    {isDefOpen ? "收起" : "展开"}
                    <svg className={`w-4 h-4 transition-transform ${isDefOpen ? "rotate-180" : "rotate-0"}`} viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 12a1 1 0 01-.707-.293l-4-4a1 1 0 111.414-1.414L10 9.586l3.293-3.293a1 1 0 011.414 1.414l-4 4A1 1 0 0110 12z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>

                {isDefOpen && (
                  <div className="p-6 border-t border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <div className="text-sm text-gray-500 mb-2">定义</div>
                        <div className="text-gray-900">{data.definition}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-2">计算公式</div>
                        <div className="text-gray-900">{data.formula}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-2">分子</div>
                        <div className="text-gray-900">{data.numerator}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-2">分母</div>
                        <div className="text-gray-900">{data.denominator}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-2">考核有效期</div>
                        <div className="text-gray-900">{data.period}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-2">目标值</div>
                        <div className="text-gray-900">{data.target}</div>
                      </div>
                    </div>

                    <div className="mt-6 border border-red-200 bg-red-50 rounded-lg p-4 text-red-600">
                      <div className="font-medium mb-2">剔除规则</div>
                      <div>{data.exclusions.join("、")}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
