import PageShell from "@/components/c2/PageShell";
import SectionCard from "@/components/c2/SectionCard";
import { TabsPlaceholder, TablePlaceholder } from "@/components/c2/Placeholders";

type CampaignDetailProps = {
  params: { id: string };
};

export default function CampaignDetailPage({ params }: CampaignDetailProps) {
  return (
    <PageShell
      title={`活动详情 #${params.id}`}
      description="基础信息、规则与报名情况"
      actions={[
        { label: "编辑", href: `/c2/campaigns/${params.id}/edit`, variant: "primary" },
        { label: "暂停", href: "#", variant: "secondary" },
      ]}
    >
      <div className="space-y-6">
        <SectionCard title="状态栏" description="活动状态与风险">
          <div className="flex flex-wrap gap-3">
            <span className="rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700">生效中</span>
            <span className="rounded-full bg-amber-50 px-3 py-1 text-sm text-amber-700">接近底限</span>
          </div>
        </SectionCard>

        <SectionCard title="详情 Tabs">
          <TabsPlaceholder
            tabs={["基础信息", "规则与价格", "覆盖范围", "渠道配置", "报名情况", "操作日志"]}
          />
        </SectionCard>

        <SectionCard title="报名情况" description="报名统计与明细">
          <TablePlaceholder columns={["门店", "报名状态", "渠道", "执行率"]} rows={4} />
        </SectionCard>
      </div>
    </PageShell>
  );
}
