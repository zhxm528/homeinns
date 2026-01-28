import PageShell from "@/components/c2/PageShell";
import SectionCard from "@/components/c2/SectionCard";
import { MetricGrid, TablePlaceholder } from "@/components/c2/Placeholders";

export default function HotelDashboardPage() {
  return (
    <PageShell
      title="门店促销总览"
      description="门店概览：近期活动与提醒"
      actions={[
        { label: "我的日历", href: "/c2/hotel/calendar", variant: "primary" },
        { label: "去报名", href: "/c2/hotel/enroll/demo", variant: "secondary" },
      ]}
    >
      <SectionCard title="门店执行概况" description="重点指标与提醒">
        <MetricGrid
          items={[
            { label: "参与活动", value: "6", hint: "进行中" },
            { label: "待报名", value: "3", hint: "可报名" },
            { label: "执行率", value: "84%", hint: "本月" },
            { label: "风险提示", value: "2", hint: "需关注" },
          ]}
        />
      </SectionCard>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SectionCard title="近期活动" description="门店最近参与活动">
          <TablePlaceholder columns={["活动", "渠道", "价格", "状态"]} rows={3} />
        </SectionCard>
        <SectionCard title="提醒事项" description="关键提示与风险">
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-center justify-between">
              <span>一口价活动上线提醒</span>
              <span className="text-amber-600">1</span>
            </div>
            <div className="flex items-center justify-between">
              <span>高风险活动待确认</span>
              <span className="text-red-600">1</span>
            </div>
            <div className="flex items-center justify-between">
              <span>即将结束活动</span>
              <span className="text-gray-900">2</span>
            </div>
          </div>
        </SectionCard>
      </div>
    </PageShell>
  );
}
