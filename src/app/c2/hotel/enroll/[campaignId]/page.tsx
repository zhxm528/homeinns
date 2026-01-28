import PageShell from "@/components/c2/PageShell";
import SectionCard from "@/components/c2/SectionCard";
import { FormPlaceholder, TablePlaceholder } from "@/components/c2/Placeholders";

type HotelEnrollProps = {
  params: { campaignId: string };
};

export default function HotelEnrollPage({ params }: HotelEnrollProps) {
  return (
    <PageShell
      title={`门店报名 #${params.campaignId}`}
      description="活动规则只读，渠道参与与权益选择"
      actions={[{ label: "确认报名", href: "#", variant: "primary" }]}
    >
      <div className="space-y-6">
        <SectionCard title="活动摘要" description="规则与价格概览">
          <TablePlaceholder columns={["字段", "内容"]} rows={5} />
        </SectionCard>

        <SectionCard title="报名配置" description="渠道开关与权益选择">
          <FormPlaceholder fields={["渠道参与", "房+X 权益", "备注"]} columns={1} />
        </SectionCard>

        <SectionCard title="风险提示">
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            高风险活动需二次确认，一口价活动需关注库存机会点。
          </div>
        </SectionCard>
      </div>
    </PageShell>
  );
}
