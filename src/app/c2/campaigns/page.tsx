"use client"

import PageShell from "@/components/c2/PageShell";
import SectionCard from "@/components/c2/SectionCard";
import Breadcrumb from "@/components/Breadcrumb";
import { TablePlaceholder } from "@/components/c2/Placeholders";
// @ts-ignore: antd types might be missing
import { Select, Input } from "antd";
import "antd/dist/reset.css";
import { useState } from "react";

export default function CampaignListPage() {
  const [activeEntry, setActiveEntry] = useState<string | null>(null);
  const [activeTypes, setActiveTypes] = useState<Set<string>>(new Set());
  const [activeChannels, setActiveChannels] = useState<Set<string>>(new Set());
  const toggleType = (label: string) => {
    setActiveTypes((prev) => {
      const next = new Set(prev);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      return next;
    });
  };

  const toggleChannel = (label: string) => {
    setActiveChannels((prev) => {
      const next = new Set(prev);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      return next;
    });
  };

  return (
    <PageShell
      title="活动列表"
      description="全集团促销活动控制塔"
      showHeader={false}
      actions={[
        { label: "创建活动", href: "/c2/campaigns/create", variant: "primary" },
        { label: "导出", href: "#", variant: "secondary" },
      ]}
    >
      <div className="mb-6">
        <Breadcrumb
          items={[
            { label: "促销4.0", href: "/c2" },
            { label: "活动管理", href: "/c2/campaigns" },
            { label: "活动列表" },
          ]}
        />
      </div>
      <div className="space-y-6">
        <SectionCard title="活动入口" collapsible>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {["C端", "B端", "会员私域", "商务日房", "内用房"].map((label) => (
              <button
                key={label}
                type="button"
                onClick={() => setActiveEntry(label)}
                className={`flex items-center justify-between rounded-lg border px-4 py-3 text-sm font-medium shadow-sm transition-colors ${
                  activeEntry === label
                    ? "border-blue-500 bg-blue-50 text-blue-600"
                    : "border-gray-200 bg-white text-gray-700 hover:border-blue-200 hover:text-blue-600"
                }`}
              >
                <span>{label}</span>
              </button>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="活动类型" collapsible>
          <div className="flex flex-wrap gap-2">
            {[
              "当天类",
              "尾房类",
              "提前类",
              "连住类",
              "人群类",
              "中长租类",
              "内用房类",
              "业主优惠",
              "附加打包类",
              "闲置房类",
              "渠道价类",
              "时租房类",
              "新客活动类",
              "私域活动类",
              "抖音特殊类活动",
              "一口价活动",
              "立减券类",
              "商旅类",
            ].map((label) => (
              <button
                key={label}
                type="button"
                onClick={() => toggleType(label)}
                className={`inline-flex items-center rounded-full border px-3 py-1 text-sm transition-colors ${
                  activeTypes.has(label)
                    ? "border-blue-500 bg-blue-50 text-blue-600"
                    : "border-gray-200 bg-white text-gray-700 hover:border-blue-200 hover:text-blue-600"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="活动筛选" collapsible>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {["活动名称", "活动描述", "折扣方式", "生效日期", "活动标签", "面客标签"].map((label) => (
              <label key={label} className="flex flex-col gap-2 text-sm text-gray-700">
                <span className="font-medium">{label}</span>
                <Select
                  mode="multiple"
                  allowClear
                  placeholder={`请选择${label}`}
                  className="w-full"
                  options={[
                    { value: `${label}选项1`, label: `${label}选项 1` },
                    { value: `${label}选项2`, label: `${label}选项 2` },
                    { value: `${label}选项3`, label: `${label}选项 3` },
                  ]}
                />
              </label>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="酒店范围" collapsible>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {["品牌", "商圈", "分层", "区域", "城区", "城市", "酒店"].map((label) => (
              <label key={label} className="flex flex-col gap-2 text-sm text-gray-700">
                <span className="font-medium">{label}</span>
                <Select
                  mode="multiple"
                  allowClear
                  placeholder={`请选择${label}`}
                  className="w-full"
                  options={[
                    { value: `${label}选项1`, label: `${label}选项 1` },
                    { value: `${label}选项2`, label: `${label}选项 2` },
                    { value: `${label}选项3`, label: `${label}选项 3` },
                  ]}
                />
              </label>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="渠道范围" collapsible>
          <div className="flex flex-wrap gap-2">
            {["官渠", "抖音", "携程", "美团", "飞猪"].map((label) => (
              <button
                key={label}
                type="button"
                onClick={() => toggleChannel(label)}
                className={`inline-flex items-center rounded-full border px-3 py-1 text-sm transition-colors ${
                  activeChannels.has(label)
                    ? "border-blue-500 bg-blue-50 text-blue-600"
                    : "border-gray-200 bg-white text-gray-700 hover:border-blue-200 hover:text-blue-600"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="活动列表" collapsible>
          <TablePlaceholder
            columns={["活动名称", "类型", "渠道", "覆盖范围", "状态", "操作"]}
            rows={5}
          />
        </SectionCard>
      </div>
    </PageShell>
  );
}
