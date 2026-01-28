import PageShell from "@/components/c2/PageShell";
import SectionCard from "@/components/c2/SectionCard";
import { MetricGrid, TablePlaceholder } from "@/components/c2/Placeholders";

export default function AnalyticsOverviewPage() {
  return (
    <PageShell
      title="效果看板"
      description="活动效果总览与趋势"
      actions={[{ label: "导出", href: "#", variant: "secondary" }]}
    >
      <SectionCard title="核心指标" description="活动维度效果">
        <MetricGrid
          items={[
            { label: "活动参与率", value: "79%", hint: "本月" },
            { label: "预订间夜", value: "12,480", hint: "本月" },
            { label: "离店间夜", value: "10,930", hint: "本月" },
            { label: "执行率", value: "86%", hint: "本月" },
          ]}
        />
      </SectionCard>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SectionCard title="趋势图" description="预订与离店趋势">
          <div className="h-48 rounded-lg border border-dashed border-gray-200 bg-gray-50" />
        </SectionCard>
        <SectionCard title="活动明细" description="活动效果列表">
          <TablePlaceholder columns={["活动", "参与率", "预订间夜", "执行率"]} rows={4} />
        </SectionCard>
      </div>
    </PageShell>
  );
}
