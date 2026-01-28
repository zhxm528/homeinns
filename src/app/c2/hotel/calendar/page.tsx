import PageShell from "@/components/c2/PageShell";
import SectionCard from "@/components/c2/SectionCard";
import { CalendarPlaceholder, TablePlaceholder } from "@/components/c2/Placeholders";

export default function HotelCalendarPage() {
  return (
    <PageShell
      title="门店促销日历"
      description="我的促销日历与报名状态"
      actions={[{ label: "去报名", href: "/c2/hotel/enroll/demo", variant: "primary" }]}
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr,1fr]">
        <SectionCard title="日历视图">
          <CalendarPlaceholder />
        </SectionCard>
        <SectionCard title="活动信息" description="选中活动摘要">
          <TablePlaceholder columns={["字段", "内容"]} rows={6} />
        </SectionCard>
      </div>
    </PageShell>
  );
}
