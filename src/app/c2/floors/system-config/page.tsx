"use client"

import PageShell from "@/components/c2/PageShell";
import SectionCard from "@/components/c2/SectionCard";
// @ts-ignore: antd types might be missing
import { Tabs, Switch, Select, DatePicker, Button } from "antd";
import "antd/dist/reset.css";
import { useState } from "react";

export default function SystemConfigPage() {
  const [expandedMonth, setExpandedMonth] = useState<string | null>(null);
  const [seasonMonths, setSeasonMonths] = useState<Record<"low" | "mid" | "high", Set<number>>>({
    low: new Set([1, 2, 9, 11, 12]),
    mid: new Set([3, 4, 5, 6, 10]),
    high: new Set([7, 8]),
  });
  const { RangePicker } = DatePicker;

  const toggleExpand = (month: string) => {
    setExpandedMonth((prev) => (prev === month ? null : month));
  };

  const renderDiscountLimit = () => (
    <div className="space-y-4">
      <SectionCard title="">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="space-y-2">
            <div className="text-sm text-gray-600">状态</div>
            <Select className="w-full" placeholder="请选择" options={[]} />
          </div>
          <div className="space-y-2 xl:col-span-2">
            <div className="text-sm text-gray-600">日期</div>
            <RangePicker className="w-full" />
          </div>
          <div className="flex items-end justify-end gap-3">
            <Button type="primary">查询</Button>
            <Button>新建</Button>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-200">
                {[
                  "编号",
                  "管理部门",
                  "淡季底限折扣（1,2,9,11,12）\n官渠/渠道",
                  "平季底限折扣（3,4,5,6,10）\n官渠/渠道",
                  "旺季底限折扣（7,8）\n官渠/渠道",
                  "创建时间",
                  "状态",
                  "酒店分层",
                  "操作",
                ].map((col) => (
                  <th key={col} className="py-3 px-4 font-medium whitespace-pre-line">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 4 }).map((_, row) => (
                <tr key={row} className="border-b border-gray-100 text-gray-600">
                  {Array.from({ length: 9 }).map((__, col) => (
                    <td key={`${row}-${col}`} className="py-3 px-4 whitespace-nowrap">
                      --
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );

  const toggleSeasonMonth = (season: "low" | "mid" | "high", month: number) => {
    setSeasonMonths((prev) => {
      const nextLow = new Set(prev.low);
      const nextMid = new Set(prev.mid);
      const nextHigh = new Set(prev.high);
      const buckets = { low: nextLow, mid: nextMid, high: nextHigh };
      const target = buckets[season];

      if (target.has(month)) {
        target.delete(month);
        return { low: nextLow, mid: nextMid, high: nextHigh };
      }

      nextLow.delete(month);
      nextMid.delete(month);
      nextHigh.delete(month);
      target.add(month);

      return { low: nextLow, mid: nextMid, high: nextHigh };
    });
  };

  const renderSeasonColumn = (
    season: "low" | "mid" | "high",
    label: string,
  ) => (
    <div className="space-y-2">
      <div className="text-sm text-gray-600">
        <span className="text-red-500 mr-1">*</span>{label}
      </div>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {Array.from({ length: 12 }, (_, index) => index + 1).map((month) => {
          const selected = seasonMonths[season].has(month);
          return (
            <button
              key={`${season}-${month}`}
              type="button"
              onClick={() => toggleSeasonMonth(season, month)}
              className={`rounded-md border px-2 py-1 text-sm transition-colors ${
                selected
                  ? "border-blue-500 bg-blue-50 text-blue-600"
                  : "border-gray-200 text-gray-600 hover:border-blue-200 hover:text-blue-600"
              }`}
            >
              {month}月
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderParamConfig = () => (
    <div className="space-y-4">
      <SectionCard title="酒店收益期选择">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {renderSeasonColumn("low", "淡季")}
          {renderSeasonColumn("mid", "平季")}
          {renderSeasonColumn("high", "旺季")}
        </div>
      </SectionCard>

      <SectionCard title="一口价回溯库存开关控制">
        <div className="space-y-4 text-sm text-gray-700">
          <div className="flex items-center gap-3">
            <Switch />
            <span>一口价回溯库存关闭逻辑：</span>
          </div>
          <div className="flex items-center gap-3">
            <Switch />
            <span>一口价回溯库存增加逻辑：</span>
          </div>
          <div className="flex items-center gap-3">
            <Switch />
            <span>一口价回溯CB限制库存关闭逻辑：</span>
          </div>
          <div className="flex items-center gap-3">
            <Switch />
            <span>一口价回溯CB限制库存添加逻辑：</span>
          </div>
        </div>
      </SectionCard>
    </div>
  );

  return (
    <PageShell title="">
      <div className="-mt-6">
        <Tabs
          items={[
            { key: "official", label: "官渠折扣底限", children: renderDiscountLimit() },
            { key: "ota", label: "OTA折扣底限", children: renderDiscountLimit() },
            { key: "b2b", label: "B端折扣底限", children: renderDiscountLimit() },
            { key: "private", label: "会员私域折扣底限", children: renderDiscountLimit() },
            {
              key: "fixed",
              label: "一口价折扣底限",
              children: (
                <div className="space-y-4">
                  <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="text-left text-gray-500 border-b border-gray-200">
                          {["月份", "可用价格档", "创建时间", "操作"].map((col) => (
                            <th key={col} className="py-3 px-4 font-medium">
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          {
                            month: "1月",
                            tiers:
                              "99,119,129,139,149,159,169,179,189,199,209,219,229,239,249,259",
                            createdAt: "2025/6/12 11:08:11",
                          },
                          {
                            month: "2月",
                            tiers:
                              "99,119,129,139,149,159,169,179,189,199,209,219,229,239,249,259",
                            createdAt: "2025/6/12 11:08:25",
                          },
                          {
                            month: "3月",
                            tiers:
                              "99,119,129,139,149,159,169,179,189,199,209,219,229,239,249,259",
                            createdAt: "2025/6/12 11:08:58",
                          },
                          {
                            month: "4月",
                            tiers:
                              "99,109,119,129,139,149,159,169,179,189,199,209,219,229,239,249",
                            createdAt: "2025/6/13 17:02:38",
                          },
                        ].map((row) => {
                          const isExpanded = expandedMonth === row.month;
                          return (
                          <tr key={row.month} className="border-b border-gray-100 text-gray-600">
                            <td className="py-4 px-4 whitespace-nowrap">{row.month}</td>
                            <td className="py-4 px-4 text-gray-500 leading-6">
                              <button
                                type="button"
                                onClick={() => toggleExpand(row.month)}
                                className={`text-left ${isExpanded ? "" : "truncate max-w-[360px]"} block`}
                                title={row.tiers}
                              >
                                {row.tiers}
                              </button>
                            </td>
                            <td className="py-4 px-4 whitespace-nowrap">{row.createdAt}</td>
                            <td className="py-4 px-4 whitespace-nowrap text-blue-600">编辑</td>
                          </tr>
                        )})}
                      </tbody>
                    </table>
                  </div>
                </div>
              ),
            },
            { key: "params", label: "参数配置", children: renderParamConfig() },
          ]}
        />
      </div>
    </PageShell>
  );
}
