"use client";
import { useMemo, useState } from "react";
import SectionSidebar from "@/components/SectionSidebar";
import Breadcrumb from "@/components/Breadcrumb";
import { headerMenuById } from "@/data/menu";

const tabs = [
  {
    id: "member-acquisition",
    title: "会员拉新",
    summary: "追踪会员拉新投放、企微触达及官网转化的漏斗。",
  },
  {
    id: "qiyi-friends",
    title: "企微好友拉新",
    summary: "统计企微私域触达、导流和拉新转化节点的能力。",
  },
  {
    id: "official-booking",
    title: "官渠订房占比",
    summary: "衡量官网/小程序在整体订单结构中的贡献与趋势。",
  },
];

const periodOptions = [
  { id: "wtd", label: "自然周", description: "短期波动、执行力" },
  { id: "mtd", label: "自然月", description: "日常经营主视角" },
  { id: "qtd", label: "自然季度", description: "策略调整、渠道判断" },
  { id: "ytd", label: "自然年", description: "长期趋势、复盘" },
];

const memberSections = [
  {
    title: "结果指标",
    metrics: [
      {
        title: "新增会员数",
        description: "当期注册成功会员数",
        value: "12,480",
        subLabel: "较上周 +6.4%",
      },
      {
        title: "新增会员增长率",
        description: "（本期 − 上期）÷ 上期",
        value: "18.2%",
        subLabel: "较上周 +2.3ppt",
      },
      {
        title: "拉新成本（CAC）",
        description: "拉新投入 ÷ 新增会员数",
        value: "¥142",
        subLabel: "较上月 −3.8%",
      },
    ],
  },
  {
    title: "质量指标",
    metrics: [
      {
        title: "新会员7/30天留存",
        description: "",
        value: "56% / 42%",
        subLabel: "7天 / 30天",
      },
      {
        title: "新会员首单转化率",
        description: "",
        value: "28%",
        subLabel: "较去年同期 +4ppt",
      },
      {
        title: "新会员ARPU",
        description: "",
        value: "¥365",
        subLabel: "较上月 +5.6%",
      },
    ],
  },
  {
    title: "画像&行为拆解",
    metrics: [
      {
        title: "新会员画像分布",
        description: "年龄、地区、出行/消费偏好",
        value: "25-35岁占60%",
        subLabel: "一线/准一线占47%",
      },
      {
        title: "新会员行为路径",
        description: "",
        value: "小程序→企微→官网",
        subLabel: "转化闭环平均3.4步",
      },
    ],
  },
];

const channelMetrics = [
  {
    title: "新增会员数",
    rows: [
      { channel: "企微", value: "3,820", share: "30.6%" },
      { channel: "小程序", value: "2,540", share: "20.3%" },
      { channel: "活动", value: "1,610", share: "12.8%" },
      { channel: "抖音", value: "4,510", share: "36.3%" },
    ],
  },
  {
    title: "新增会员增长率",
    rows: [
      { channel: "企微", value: "16.2%", share: "29%" },
      { channel: "小程序", value: "12.4%", share: "18%" },
      { channel: "活动", value: "9.8%", share: "10%" },
      { channel: "抖音", value: "22.5%", share: "43%" },
    ],
  },
];

const MetricCard = ({
  title,
  description,
  value,
  subLabel,
}: {
  title: string;
  description: string;
  value?: string;
  subLabel?: string;
}) => (
  <div className="flex flex-col rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
    <p className="text-lg font-semibold text-gray-900">{title}</p>
    {value && <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>}
    {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
    {subLabel && <p className="mt-1 text-xs text-gray-400">{subLabel}</p>}
  </div>
);

export default function IndicatorSystemPage() {
  const section = headerMenuById("cdp");
  if (!section) {
    throw new Error("CDP menu configuration missing.");
  }

  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const currentTab = tabs.find((tab) => tab.id === activeTab) ?? tabs[0];
  const [selectedPeriod, setSelectedPeriod] = useState("mtd");

  const showMemberContent = useMemo(
    () => activeTab === "member-acquisition",
    [activeTab],
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
                { label: "指标体系" },
              ]}
            />
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <header className="mb-6">
              <h1 className="text-3xl font-semibold text-gray-900">专题看板</h1>
              <p className="text-sm text-gray-500">围绕私域指标体系，按照主题切换视角。</p>
            </header>

            <div className="mb-6 flex flex-wrap gap-3">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    activeTab === tab.id
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 bg-white text-gray-600 hover:border-blue-500"
                  }`}
                >
                  {tab.title}
                </button>
              ))}
            </div>

            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {periodOptions.map((option) => {
                  const isActive = selectedPeriod === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setSelectedPeriod(option.id)}
                      className={`rounded-2xl border px-4 py-4 text-left text-sm transition ${
                        isActive
                          ? "border-blue-500 bg-blue-50 text-blue-700 shadow"
                          : "border-gray-200 bg-white text-gray-700 hover:border-blue-500"
                      }`}
                    >
                      <p className="font-semibold">{option.label}</p>
                      <p className="text-[0.75rem] text-gray-500">{option.description}</p>
                    </button>
                  );
                })}
              </div>

              {showMemberContent ? (
                <div className="space-y-6">
                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
                    <p className="text-sm font-semibold text-gray-700">结果指标</p>
                    <div className="mt-4 grid gap-4 md:grid-cols-3">
                      {memberSections[0].metrics.map((metric) => (
                        <MetricCard key={metric.title} {...metric} />
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
                    <p className="text-sm font-semibold text-gray-700">渠道结构指标</p>
                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      {channelMetrics.map((metric) => (
                        <div
                          key={metric.title}
                          className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
                        >
                          <div className="flex items-center justify-between">
                            <p className="text-base font-semibold text-gray-900">{metric.title}</p>
                            <span className="text-xs uppercase tracking-wide text-gray-400">渠道</span>
                          </div>
                          <div className="mt-3 overflow-x-auto">
                            <table className="min-w-full text-left text-sm">
                              <thead>
                                <tr className="border-b border-gray-100">
                                  <th className="px-3 py-2 text-xs font-medium uppercase tracking-wide text-gray-500">
                                    渠道
                                  </th>
                                  <th className="px-3 py-2 text-xs font-medium uppercase tracking-wide text-gray-500">
                                    指标数值
                                  </th>
                                  <th className="px-3 py-2 text-xs font-medium uppercase tracking-wide text-gray-500">
                                    占比
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {metric.rows.map((row) => (
                                  <tr key={row.channel} className="border-b border-gray-100 last:border-none">
                                    <td className="px-3 py-2 text-sm font-medium text-gray-700">{row.channel}</td>
                                    <td className="px-3 py-2 text-sm text-gray-900">{row.value}</td>
                                    <td className="px-3 py-2 text-sm text-gray-500">{row.share}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
                    <p className="text-sm font-semibold text-gray-700">质量指标</p>
                    <div className="mt-4 grid gap-4 md:grid-cols-3">
                      {memberSections[1].metrics.map((metric) => (
                        <MetricCard key={metric.title} {...metric} />
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
                    <p className="text-sm font-semibold text-gray-700">画像&行为拆解</p>
                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      {memberSections[2].metrics.map((metric) => (
                        <MetricCard key={metric.title} {...metric} />
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-6">
                  <p className="text-base font-semibold text-gray-900">{currentTab.title}</p>
                  <p className="text-sm text-gray-600">{currentTab.summary}</p>
                  <div className="h-48 rounded-xl border border-gray-200 bg-white shadow-inner" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
