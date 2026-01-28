import PageShell from "@/components/c2/PageShell";
import SectionCard from "@/components/c2/SectionCard";
import { MetricGrid, TablePlaceholder } from "@/components/c2/Placeholders";

export default function AnalyticsHotelPage() {
  return (
    <PageShell
      title="门店活动效果"
      description="门店视角活动效果"
      actions={[{ label: "导出", href: "#", variant: "secondary" }]}
    >
      <SectionCard title="门店指标" description="活动效果汇总">
        <MetricGrid
          items={[
            { label: "参与活动", value: "6", hint: "本月" },
            { label: "预订间夜", value: "420", hint: "本月" },
            { label: "离店间夜", value: "380", hint: "本月" },
            { label: "执行率", value: "82%", hint: "本月" },
          ]}
        />
      </SectionCard>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SectionCard title="活动明细" description="门店活动效果">
          <TablePlaceholder columns={["活动", "渠道", "预订间夜", "执行率"]} rows={5} />
        </SectionCard>
        <SectionCard title="趋势图" description="近30天趋势">
          <div className="h-48 rounded-lg border border-dashed border-gray-200 bg-gray-50" />
        </SectionCard>
      </div>
    </PageShell>
  );
}
