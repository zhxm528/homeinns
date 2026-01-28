"use client"

import PageShell from "@/components/c2/PageShell";
import SectionCard from "@/components/c2/SectionCard";
import { MetricGrid, TablePlaceholder } from "@/components/c2/Placeholders";
// @ts-ignore: antd types might be missing
import { Tabs, Input, Select, DatePicker, Button } from "antd";
import "antd/dist/reset.css";

const renderBoard = (title: string) => (
  <SectionCard title={title}>
    <MetricGrid
      items={[
        { label: "启用中预测数", value: "--" },
        { label: "整体预测命中率", value: "--" },
        { label: "平均符合条件天数占比", value: "--" },
        { label: "覆盖酒店总数", value: "--" },
        { label: "有效预测占比", value: "--" },
        { label: "低命中预测数", value: "--" },
        { label: "零覆盖预测数", value: "--" },
        { label: "最近 7 天新增预测数", value: "--" },
        { label: "最优折扣系数区间", value: "--" },
        { label: "最优浮动系数区间", value: "--" },
      ]}
    />
  </SectionCard>
);

const renderDetail = (title: string) => (
  <SectionCard title={title}>
    <TablePlaceholder
      columns={[
        "活动名称",
        "类型",
        "渠道",
        "覆盖范围",
        "状态",
      ]}
      rows={5}
    />
  </SectionCard>
);

const renderDiscountDetail = () => (
  <div className="space-y-6">
    <SectionCard title="活动折扣策略明细">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="space-y-2">
          <div className="text-sm text-gray-600">促销方式</div>
          <Select className="w-full" placeholder="请选择" options={[]} />
        </div>
        <div className="space-y-2">
          <div className="text-sm text-gray-600">状态</div>
          <Select className="w-full" placeholder="请选择" options={[]} />
        </div>
        <div className="space-y-2">
          <div className="text-sm text-gray-600">结果</div>
          <Select className="w-full" placeholder="请选择" options={[]} />
        </div>
        <div className="space-y-2">
          <div className="text-sm text-gray-600">类型</div>
          <Select className="w-full" placeholder="请选择" options={[]} />
        </div>
      </div>
      <div className="mt-4 flex justify-end gap-3">
        <Button type="primary">新建</Button>
        <Button>查询</Button>
      </div>
    </SectionCard>

    <SectionCard title="">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b border-gray-200">
              {[
                "促销方式",
                "管理部门",
                "淡旺季",
                "状态",
                "分层类型",
                "类型",
                "结果",
                "预测时间",
                "操作人",
                "操作",
              ].map((col) => (
                <th key={col} className="py-2 pr-4 font-medium">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 6 }).map((_, row) => (
              <tr key={row} className="border-b border-gray-100 text-gray-600">
                {Array.from({ length: 10 }).map((__, col) => (
                  <td key={`${row}-${col}`} className="py-3 pr-4">
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

const renderFixedPriceDetail = () => {
  const { RangePicker } = DatePicker;

  return (
    <div className="space-y-6">
      <SectionCard title="一口价策略明细">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="space-y-2">
            <div className="text-sm text-gray-600">折扣系数</div>
            <Input className="w-full" placeholder="请输入" />
          </div>
          <div className="space-y-2">
            <div className="text-sm text-gray-600">浮动系数</div>
            <Input className="w-full" placeholder="请输入" />
          </div>
          <div className="space-y-2">
            <div className="text-sm text-gray-600">品牌</div>
            <Select className="w-full" placeholder="请选择" options={[]} />
          </div>
          <div className="space-y-2">
            <div className="text-sm text-gray-600">日期</div>
            <RangePicker className="w-full" />
          </div>
          <div className="space-y-2">
            <div className="text-sm text-gray-600">状态</div>
            <Select className="w-full" placeholder="请选择" options={[]} />
          </div>
          <div className="space-y-2">
            <div className="text-sm text-gray-600">预测种类</div>
            <Select className="w-full" placeholder="请选择" options={[]} />
          </div>
          <div className="space-y-2">
            <div className="text-sm text-gray-600">预测编号</div>
            <Input className="w-full" placeholder="请输入" />
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-3">
          <Button type="primary">新建预测</Button>
          <Button>查询</Button>
        </div>
      </SectionCard>

      <SectionCard title="">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-200">
                {[
                  "预测编号",
                  "预测种类",
                  "价格档位(元)",
                  "折扣系数(%)",
                  "浮动系数(%)",
                  "预测方式",
                  "预测内容",
                  "预测日期",
                  "总天数",
                  "符合条件天数占比(%)",
                  "总符合酒店数",
                  "状态",
                  "操作时间",
                  "操作人",
                  "操作",
                ].map((col) => (
                  <th key={col} className="py-2 pr-4 font-medium">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 3 }).map((_, row) => (
                <tr key={row} className="border-b border-gray-100 text-gray-600">
                  {Array.from({ length: 15 }).map((__, col) => (
                    <td key={`${row}-${col}`} className="py-3 pr-4">
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
};

export default function PriceForecastPage() {
  return (
    <PageShell title="">
      <div className="-mt-6">
        <Tabs
          items={[
            {
              key: "discount-strategy",
              label: "活动折扣策略看板",
              children: renderBoard("活动折扣策略看板"),
            },
            {
              key: "fixed-strategy",
              label: "一口价策略看板",
              children: renderBoard("一口价策略看板"),
            },
            {
              key: "discount-detail",
              label: "活动折扣策略明细",
              children: renderDiscountDetail(),
            },
            {
              key: "fixed-detail",
              label: "一口价策略明细",
              children: renderFixedPriceDetail(),
            },
          ]}
        />
      </div>
    </PageShell>
  );
}
