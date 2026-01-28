"use client"

import PageShell from "@/components/c2/PageShell";
import SectionCard from "@/components/c2/SectionCard";
// @ts-ignore: antd types might be missing
import { Input, Select, Radio } from "antd";
import "antd/dist/reset.css";

export default function CampaignCreatePage() {
  return (
    <PageShell title="创建活动" actions={[]}>
      <div className="space-y-6 -mt-12">
        <SectionCard title="">
          <div className="overflow-x-auto">
            <ol className="flex min-w-max items-center gap-6 text-sm text-gray-700">
              {[
                "主题设置",
                "价格和渠道",
                "早餐配置",
                "酒店范围",
              ].map((label, index) => (
                <li key={label} className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-white text-xs font-semibold text-gray-700">
                    {index + 1}
                  </span>
                  {index === 0 ? (
                    <a href="#theme" className="whitespace-nowrap text-blue-600 hover:text-blue-700">
                      {label}
                    </a>
                  ) : (
                    <span className="whitespace-nowrap">{label}</span>
                  )}
                  {index < 3 && <span className="h-px w-8 bg-gray-200" aria-hidden="true" />}
                </li>
              ))}
            </ol>
          </div>
        </SectionCard>

        <SectionCard title="主题设置" id="theme">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm text-gray-700">
              <span className="font-medium">
                <span className="text-red-500 mr-1">*</span>活动类型
              </span>
              <Select placeholder="请选择活动类型" options={[{ value: "oneprice", label: "一口价活动" }]} />
            </label>
            <label className="flex flex-col gap-2 text-sm text-gray-700">
              <span className="font-medium">
                <span className="text-red-500 mr-1">*</span>活动名称
              </span>
              <Input placeholder="请输入活动名称" />
            </label>
            <label className="flex flex-col gap-2 text-sm text-gray-700">
              <span className="font-medium">
                <span className="text-red-500 mr-1">*</span>活动主题
              </span>
              <Input placeholder="活动主题 (如)" />
            </label>
            <div className="flex flex-col gap-2 text-sm text-gray-700">
              <span className="font-medium">
                <span className="text-red-500 mr-1">*</span>是否跨年度
              </span>
              <Radio.Group className="flex items-center gap-6" defaultValue="no">
                <Radio value="yes">是</Radio>
                <Radio value="no">否</Radio>
              </Radio.Group>
            </div>
            <label className="flex flex-col gap-2 text-sm text-gray-700">
              <span className="font-medium">
                <span className="text-red-500 mr-1">*</span>活动品类
              </span>
              <Select placeholder="请选择品类" options={[]} />
            </label>
            <label className="flex flex-col gap-2 text-sm text-gray-700">
              <span className="font-medium">关联品牌</span>
              <Select placeholder="请选择品牌" options={[]} />
            </label>
            <label className="flex flex-col gap-2 text-sm text-gray-700 md:col-span-2">
              <span className="font-medium">
                <span className="text-red-500 mr-1">*</span>活动介绍
              </span>
              <Input.TextArea rows={3} placeholder="请输入活动的简短介绍内容" />
            </label>
            <label className="flex flex-col gap-2 text-sm text-gray-700 md:col-span-2">
              <span className="font-medium">运营备注(可选)</span>
              <Input.TextArea rows={3} placeholder="仅C端侧出现的内容信息" />
            </label>
          </div>
        </SectionCard>

        <div className="flex justify-end">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 text-sm font-medium hover:border-blue-200 hover:text-blue-600 transition-colors"
          >
            下一步
          </button>
        </div>
      </div>
    </PageShell>
  );
}
