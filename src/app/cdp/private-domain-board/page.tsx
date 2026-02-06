import Link from "next/link";
import SectionSidebar from "@/components/SectionSidebar";
import { headerMenuById } from "@/data/menu";

const pages = [
  {
    title: "数据洞察",
    description: "围绕会员增长、渠道与收入质量的关键指标与下钻专题。",
    href: "/cdp/private-domain-board/data-insight",
  },
];

export default function PrivateDomainBoardHome() {
  const section = headerMenuById("cdp");
  if (!section) {
    throw new Error("CDP menu configuration missing.");
  }

  return (
    <div className="flex h-[calc(100vh-8rem)]">
      <SectionSidebar title={section.title} href={section.url} items={section.sidebar ?? []} />
      <div className="flex-1 bg-gray-50 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">私域看板</h1>
            <p className="text-gray-600">集中展示会员增长、渠道结构与收入质量的洞察入口。</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pages.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md transition"
              >
                <h2 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h2>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
