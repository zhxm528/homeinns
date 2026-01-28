import PageShell from "@/components/c2/PageShell";
import SectionCard from "@/components/c2/SectionCard";
import { MetricGrid, TablePlaceholder } from "@/components/c2/Placeholders";

type AnalyticsCampaignProps = {
  params: { id: string };
};

export default function AnalyticsCampaignPage({ params }: AnalyticsCampaignProps) {
  return (
    <PageShell
      title={`活动复盘 #${params.id}`}
      description="活动效果明细与对比"
      actions={[{ label: "导出复盘", href: "#", variant: "secondary" }]}
    >
      <SectionCard title="活动概览" description="关键指标">
        <MetricGrid
          items={[
            { label: "参与率", value: "83%", hint: "活动周期" },
            { label: "预订间夜", value: "2,140", hint: "活动周期" },
            { label: "离店间夜", value: "1,980", hint: "活动周期" },
            { label: "执行率", value: "89%", hint: "活动周期" },
          ]}
        />
      </SectionCard>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SectionCard title="趋势对比" description="活动前后对比">
          <div className="h-48 rounded-lg border border-dashed border-gray-200 bg-gray-50" />
        </SectionCard>
        <SectionCard title="门店明细" description="门店执行数据">
          <TablePlaceholder columns={["门店", "报名状态", "预订间夜", "执行率"]} rows={4} />
        </SectionCard>
      </div>
    </PageShell>
  );
}
