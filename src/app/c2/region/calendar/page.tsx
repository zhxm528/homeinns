import PageShell from "@/components/c2/PageShell";
import SectionCard from "@/components/c2/SectionCard";
import { CalendarPlaceholder, TablePlaceholder } from "@/components/c2/Placeholders";

export default function RegionCalendarPage() {
  return (
    <PageShell
      title="区域促销日历"
      description="日/周/月日历与报名统计"
      actions={[{ label: "查看报名明细", href: "/c2/region/enroll-status", variant: "secondary" }]}
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr,1fr]">
        <SectionCard title="活动日历">
          <CalendarPlaceholder />
        </SectionCard>
        <SectionCard title="活动摘要" description="选中活动的规则与报名">
          <TablePlaceholder columns={["字段", "内容"]} rows={6} />
        </SectionCard>
      </div>
    </PageShell>
  );
}
