import PageShell from "@/components/c2/PageShell";
import SectionCard from "@/components/c2/SectionCard";
import { MetricGrid, TablePlaceholder, StatusList } from "@/components/c2/Placeholders";

export default function GroupDashboardPage() {
  return (
    <PageShell
      title="集团促销总览"
      description="集团控制塔：总量、风险与审批"
      actions={[
        { label: "创建活动", href: "/c2/campaigns/create", variant: "primary" },
        { label: "查看审批", href: "/c2/approvals", variant: "secondary" },
      ]}
    >
      <SectionCard title="核心指标" description="今日 / 本周 / 本月">
        <MetricGrid
          items={[
            { label: "申请活动数", value: "128", hint: "本月" },
            { label: "生效活动数", value: "64", hint: "当前" },
            { label: "即将上线", value: "18", hint: "7天内" },
            { label: "即将结束", value: "12", hint: "7天内" },
          ]}
        />
      </SectionCard>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SectionCard title="风险提示" description="接近底限与高折扣活动">
          <StatusList
            items={[
              "接近底限：8 个活动",
              "短周期免校验：5 个活动",
              "高折扣：3 个活动",
            ]}
          />
        </SectionCard>
        <SectionCard title="待审批活动" description="需要集团审批">
          <TablePlaceholder columns={["申请单", "类型", "区域", "状态", "提交时间"]} rows={3} />
        </SectionCard>
      </div>
    </PageShell>
  );
}
