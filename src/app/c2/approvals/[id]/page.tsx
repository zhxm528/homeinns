import PageShell from "@/components/c2/PageShell";
import SectionCard from "@/components/c2/SectionCard";
import { TablePlaceholder } from "@/components/c2/Placeholders";

type ApprovalDetailProps = {
  params: { id: string };
};

export default function ApprovalDetailPage({ params }: ApprovalDetailProps) {
  return (
    <PageShell
      title={`审批单 #${params.id}`}
      description="申请详情与审批动作"
      actions={[
        { label: "通过", href: "#", variant: "primary" },
        { label: "驳回", href: "#", variant: "secondary" },
      ]}
    >
      <div className="space-y-6">
        <SectionCard title="申请信息" description="申请基本信息">
          <TablePlaceholder columns={["字段", "内容"]} rows={4} />
        </SectionCard>

        <SectionCard title="审批记录" description="审批流程与日志">
          <TablePlaceholder columns={["节点", "操作人", "时间", "结果"]} rows={3} />
        </SectionCard>
      </div>
    </PageShell>
  );
}
