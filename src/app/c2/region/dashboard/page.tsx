import PageShell from "@/components/c2/PageShell";
import SectionCard from "@/components/c2/SectionCard";
import { MetricGrid, TablePlaceholder } from "@/components/c2/Placeholders";

export default function RegionDashboardPage() {
  return (
    <PageShell
      title="区域促销总览"
      description="区域概览：参与率、风险与门店下钻"
      actions={[
        { label: "区域日历", href: "/c2/region/calendar", variant: "primary" },
        { label: "区域管控", href: "/c2/region/control", variant: "secondary" },
      ]}
    >
      <SectionCard title="执行指标" description="区域执行与参与情况">
        <MetricGrid
          items={[
            { label: "活动参与率", value: "81%", hint: "本月" },
            { label: "预订间夜", value: "3,420", hint: "本月" },
            { label: "离店间夜", value: "2,960", hint: "本月" },
            { label: "执行率", value: "87%", hint: "本月" },
          ]}
        />
      </SectionCard>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SectionCard title="活动风险分布" description="区域内风险概况">
          <div className="h-48 rounded-lg border border-dashed border-gray-200 bg-gray-50" />
        </SectionCard>
        <SectionCard title="门店参与明细" description="可下钻门店">
          <TablePlaceholder columns={["门店", "报名状态", "渠道", "执行率"]} rows={4} />
        </SectionCard>
      </div>
    </PageShell>
  );
}
