import PageShell from "@/components/c2/PageShell";
import SectionCard from "@/components/c2/SectionCard";
import { TablePlaceholder } from "@/components/c2/Placeholders";

export default function RegionEnrollStatusPage() {
  return (
    <PageShell
      title="区域报名明细"
      description="已报/未报名门店明细"
      actions={[{ label: "导出明细", href: "#", variant: "secondary" }]}
    >
      <div className="space-y-6">
        <SectionCard title="筛选条件" description="门店、活动、状态">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="h-10 rounded-md bg-gray-100" />
            <div className="h-10 rounded-md bg-gray-100" />
            <div className="h-10 rounded-md bg-gray-100" />
          </div>
        </SectionCard>
        <SectionCard title="报名明细">
          <TablePlaceholder columns={["门店", "活动", "报名状态", "渠道", "更新时间"]} rows={6} />
        </SectionCard>
      </div>
    </PageShell>
  );
}
