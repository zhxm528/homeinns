import PageShell from "@/components/c2/PageShell";
import SectionCard from "@/components/c2/SectionCard";
import { FormPlaceholder } from "@/components/c2/Placeholders";

type FloorDetailProps = {
  params: { id: string };
};

export default function FloorPolicyDetailPage({ params }: FloorDetailProps) {
  return (
    <PageShell
      title={`底限策略 #${params.id}`}
      description="策略详情与规则配置"
      actions={[{ label: "保存策略", href: "#", variant: "primary" }]}
    >
      <div className="space-y-6">
        <SectionCard title="策略配置" description="适用范围与底限规则">
          <FormPlaceholder fields={["策略名称", "适用范围", "底限规则", "生效时间", "状态"]} columns={2} />
        </SectionCard>

        <SectionCard title="说明" description="校验与风险提示">
          <div className="rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
            策略修改会影响实时底限校验结果，请谨慎调整。
          </div>
        </SectionCard>
      </div>
    </PageShell>
  );
}
