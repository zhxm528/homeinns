import PageShell from "@/components/c2/PageShell";
import SectionCard from "@/components/c2/SectionCard";
import { TablePlaceholder } from "@/components/c2/Placeholders";

export default function RegionControlPage() {
  return (
    <PageShell
      title="区域精细化管控"
      description="区域启停与范围控制"
      actions={[{ label: "批量启停", href: "#", variant: "primary" }]}
    >
      <div className="space-y-6">
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          此处操作不改变集团活动规则，仅影响本区域执行状态。
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr,2fr]">
          <SectionCard title="过滤条件" description="城市 / 品牌 / 门店类型">
            <div className="space-y-3">
              <div className="h-10 rounded-md bg-gray-100" />
              <div className="h-10 rounded-md bg-gray-100" />
              <div className="h-10 rounded-md bg-gray-100" />
              <div className="h-10 rounded-md bg-gray-100" />
            </div>
          </SectionCard>
          <SectionCard title="可管控活动" description="区域权限范围内">
            <TablePlaceholder columns={["活动", "状态", "范围", "操作"]} rows={6} />
          </SectionCard>
        </div>
      </div>
    </PageShell>
  );
}
