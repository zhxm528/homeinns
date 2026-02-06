import SectionSidebar from "@/components/SectionSidebar";
import Breadcrumb from "@/components/Breadcrumb";
import { headerMenuById } from "@/data/menu";
import { privateDomainBoardDrills } from "@/data/privateDomainBoard";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return privateDomainBoardDrills.map((drill) => ({
    slug: drill.slug,
  }));
}

type DrillPageProps = {
  params: {
    slug: string;
  };
};

export default function PrivateDomainDrillPage({ params }: DrillPageProps) {
  const section = headerMenuById("cdp");
  if (!section) {
    throw new Error("CDP menu configuration missing.");
  }

  const drill = privateDomainBoardDrills.find((item) => item.slug === params.slug);
  if (!drill) {
    notFound();
  }

  return (
    <div className="flex h-[calc(100vh-8rem)]">
      <SectionSidebar title={section.title} href={section.url} items={section.sidebar ?? []} />
      <div className="flex-1 bg-gray-50 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Breadcrumb
              items={[
                { label: "数据CDP", href: "/cdp" },
                { label: "私域看板", href: "/cdp/private-domain-board" },
                { label: "数据洞察", href: "/cdp/private-domain-board/data-insight" },
                { label: drill.title },
              ]}
            />
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
            <p className="text-sm text-gray-500">{drill.module}</p>
            <h1 className="text-3xl font-semibold text-gray-900 mt-2 mb-3">{drill.title}</h1>
            <p className="text-gray-600">{drill.summary}</p>
            <div className="mt-10 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-12 text-center text-gray-500">
              该专题内容正在建设中，敬请期待后续更新。
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
