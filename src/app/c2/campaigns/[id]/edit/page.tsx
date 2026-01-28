import PageShell from "@/components/c2/PageShell";
import SectionCard from "@/components/c2/SectionCard";
import { FormPlaceholder, TabsPlaceholder } from "@/components/c2/Placeholders";

type CampaignEditProps = {
  params: { id: string };
};

export default function CampaignEditPage({ params }: CampaignEditProps) {
  return (
    <PageShell
      title={`修改活动 #${params.id}`}
      description="受限修改与风险提示"
      actions={[{ label: "保存修改", href: "#", variant: "primary" }]}
    >
      <div className="space-y-6">
        <SectionCard title="修改步骤">
          <TabsPlaceholder tabs={["基础信息", "规则与价格", "渠道配置", "适用范围", "确认提交"]} />
        </SectionCard>

        <SectionCard title="可修改字段" description="仅允许受限修改">
          <FormPlaceholder fields={["活动目标", "折扣/一口价", "渠道生效时间", "适用范围"]} columns={2} />
        </SectionCard>

        <SectionCard title="操作提示">
          <div className="rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
            修改需二次确认并记录日志，生效中活动只能做受限调整。
          </div>
        </SectionCard>
      </div>
    </PageShell>
  );
}
