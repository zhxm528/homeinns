"use client";
import Link from "next/link";
import SectionSidebar from "@/components/SectionSidebar";
import Breadcrumb from "@/components/Breadcrumb";
import { headerMenuById } from "@/data/menu";
import {
  PrivateDomainBoardDrill,
  privateDomainBoardDrills,
  privateDomainInsightModules,
} from "@/data/privateDomainBoard";
import type { ReactNode } from "react";
import { useState } from "react";

const drillMap: Record<string, PrivateDomainBoardDrill> = Object.fromEntries(
  privateDomainBoardDrills.map((drill) => [drill.slug, drill]),
);

type InfoTipProps = {
  label: string;
  tooltip: ReactNode;
};

const InfoTip = ({ label, tooltip }: InfoTipProps) => (
  <div className="relative group inline-flex gap-1 items-center rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-500">
    <span>{label}</span>
    <span className="flex h-4 w-4 items-center justify-center rounded-full border border-gray-300 text-[0.65rem] font-semibold text-gray-500">
      i
    </span>
    <div className="pointer-events-none absolute left-1/2 bottom-full z-10 w-60 -translate-x-1/2 rounded-lg bg-black/80 px-3 py-2 text-left text-[0.65rem] text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-hover:pointer-events-auto">
      {tooltip}
    </div>
  </div>
);

const TrendArrow = ({ direction }: { direction: "up" | "down" | "flat" }) => {
  const map = {
    up: { icon: "↑", color: "text-emerald-600" },
    down: { icon: "↓", color: "text-red-600" },
    flat: { icon: "→", color: "text-gray-500" },
  };
  const item = map[direction];
  return (
    <span className={`text-xl font-semibold ${item.color}`}>{item.icon}</span>
  );
};

const periodOptions = [
  {
    id: "wtd",
    label: "自然周（WTD）",
    description: "短期波动、执行力",
    current: "本周",
    comparison: "上周同期",
  },
  {
    id: "mtd",
    label: "自然月（MTD）",
    description: "日常经营主视角",
    current: "本月",
    comparison: "上月同期 + 去年同期",
  },
  {
    id: "qtd",
    label: "自然季度（QTD）",
    description: "策略调整、渠道判断",
    current: "本季度",
    comparison: "上季度",
  },
  {
    id: "ytd",
    label: "自然年（YTD）",
    description: "长期趋势、复盘",
    current: "本年",
    comparison: "去年",
  },
];

export default function PrivateDomainBoardInsightPage() {
  const section = headerMenuById("cdp");
  if (!section) {
    throw new Error("CDP menu configuration missing.");
  }

  const [selectedPeriod, setSelectedPeriod] = useState(
    periodOptions.find((option) => option.id === "mtd")?.id ?? periodOptions[0].id,
  );

  return (
    <div className="flex h-[calc(100vh-8rem)]">
      <SectionSidebar title={section.title} href={section.url} items={section.sidebar ?? []} />
      <div className="flex-1 bg-gray-50 overflow-y-auto">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Breadcrumb
              items={[
                { label: "数据CDP", href: "/cdp" },
                { label: "私域看板", href: "/cdp/private-domain-board" },
                { label: "数据洞察" },
              ]}
            />
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">私域看板数据洞察</h1>
            <p className="text-gray-600">各模块核心指标一览</p>
          </div>

            <section className="mb-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {periodOptions.map((option) => {
                  const isSelected = selectedPeriod === option.id;
                  return (
                    <div key={option.id} className="group relative">
                      <button
                        type="button"
                        onClick={() => setSelectedPeriod(option.id)}
                        aria-pressed={isSelected}
                        className={`w-full rounded-2xl border px-4 py-4 text-left transition focus:outline-none ${
                          isSelected
                            ? "border-blue-500 bg-blue-50 shadow"
                            : "border-gray-200 bg-white hover:border-blue-500 hover:shadow-md"
                        }`}
                      >
                        <p className="text-sm font-semibold text-gray-900">{option.label}</p>
                        <p className="text-xs text-gray-500">{option.description}</p>
                      </button>
                      <div className="pointer-events-none absolute left-1/2 top-full z-10 w-56 -translate-x-1/2 rounded-lg border border-gray-200 bg-black/90 px-3 py-2 text-[0.65rem] text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                        <p className="font-semibold">当前周期：{option.current}</p>
                        <p className="mt-1 text-white/70">默认对比：{option.comparison}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

          <div className="space-y-10">
            {privateDomainInsightModules.map((module) => (
              <section key={module.id} className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
                <header>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {module.title}核心指标
                  </h2>
                </header>

                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  {module.metrics.map((metric) => {
                    const drill = drillMap[metric.drillSlug];
                    return (
                      <article
                        key={metric.id}
                        className="relative flex flex-col rounded-2xl border border-gray-100 bg-gradient-to-br from-white to-gray-50 p-6 shadow-sm"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1">
                            <h3 className="text-xl font-semibold text-gray-900">{metric.title}</h3>
                            <p className="text-sm text-gray-600">{metric.indicatorName}</p>
                          </div>
                        </div>

                        <div className="mt-6 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
                          <div>
                            <p className="text-4xl font-bold text-gray-900">{metric.displayValue}</p>
                            <p className="text-sm text-gray-500">{metric.display}</p>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <div className="flex items-center gap-2">
                              <TrendArrow direction={metric.trendDirection} />
                              <p className="text-sm font-semibold text-gray-800">{metric.trendLabel}</p>
                            </div>
                            <p className="text-xs text-gray-500">{metric.periodComparison}</p>
                          </div>
                        </div>

                        <div className="mt-5 flex flex-wrap gap-3">
                          <InfoTip label="计算公式" tooltip={<p>{metric.formula}</p>} />
                          <InfoTip label="统计口径" tooltip={<p>{metric.scope}</p>} />
                          <InfoTip
                            label="下钻板块"
                            tooltip={
                              <div className="space-y-1">
                                <p className="text-sm font-medium text-white">{drill?.title}</p>
                                <p className="text-[0.7rem] text-white/70">{drill?.summary}</p>
                                {drill && (
                                  <Link
                                    href={`/cdp/private-domain-board/data-insight/drill/${drill.slug}`}
                                    className="text-xs font-semibold text-indigo-200 underline"
                                  >
                                    进入专题
                                  </Link>
                                )}
                              </div>
                            }
                          />
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
