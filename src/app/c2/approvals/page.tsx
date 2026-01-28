import PageShell from "@/components/c2/PageShell";
import SectionCard from "@/components/c2/SectionCard";
import { TablePlaceholder } from "@/components/c2/Placeholders";

export default function ApprovalListPage() {
  return (
    <PageShell
      title="审批列表"
      description="承接 BPM 的申请与审批"
      actions={[
        { label: "批量处理", href: "#", variant: "secondary" },
        { label: "导出", href: "#", variant: "ghost" },
      ]}
    >
      <div className="space-y-6">
        <SectionCard title="筛选条件" description="申请类型、区域与状态">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="h-10 rounded-md bg-gray-100" />
            <div className="h-10 rounded-md bg-gray-100" />
            <div className="h-10 rounded-md bg-gray-100" />
            <div className="h-10 rounded-md bg-gray-100" />
          </div>
        </SectionCard>

        <SectionCard title="审批列表" description="待审批与已处理">
          <TablePlaceholder columns={["申请单", "申请人", "区域", "状态", "提交时间", "操作"]} rows={5} />
        </SectionCard>
      </div>
    </PageShell>
  );
}
