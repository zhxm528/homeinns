import Link from "next/link";
import SectionSidebar from "@/components/SectionSidebar";
import { headerMenuById } from "@/data/menu";

const pages = [
  { title: "总览页", description: "四大指标卡片与私域转化链路", href: "/cdp/private-domain-metrics/overview" },
  { title: "指标一详情页", description: "企微每百人成功拉新", href: "/cdp/private-domain-metrics/metric-one" },
  { title: "指标二详情页", description: "逸粉每百人成功拉新", href: "/cdp/private-domain-metrics/metric-two" },
  { title: "指标三详情页", description: "逸扉小程序渠道间夜占比", href: "/cdp/private-domain-metrics/metric-three" },
  { title: "指标四详情页", description: "金牛及以上逸粉本人预订且入住占比", href: "/cdp/private-domain-metrics/metric-four" },
];

export default function PrivateDomainMetricsHome() {
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">私域指标</h1>
            <p className="text-gray-600">指标总览与四项指标详情入口</p>
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
