import Link from "next/link";
import PageShell from "@/components/c2/PageShell";
import SectionCard from "@/components/c2/SectionCard";

const quickLinks = [
  { label: "集团总览", href: "/c2/dashboard" },
  { label: "活动列表", href: "/c2/campaigns" },
  { label: "区域日历", href: "/c2/region/calendar" },
  { label: "底限策略", href: "/c2/floors" },
  { label: "效果看板", href: "/c2/analytics" },
];

const modules = [
  {
    title: "促销总览",
    description: "集团、区域、门店的统一视角",
    items: [
      { label: "集团总览", href: "/c2/dashboard" },
      { label: "区域总览", href: "/c2/region/dashboard" },
      { label: "门店总览", href: "/c2/hotel/dashboard" },
    ],
  },
  {
    title: "活动管理",
    description: "活动创建、审批、修改与详情",
    items: [
      { label: "活动列表", href: "/c2/campaigns" },
      { label: "创建活动", href: "/c2/campaigns/create" },
      { label: "审批列表", href: "/c2/approvals" },
    ],
  },
  {
    title: "报名与执行",
    description: "区域启停与门店报名",
    items: [
      { label: "区域日历", href: "/c2/region/calendar" },
      { label: "区域管控", href: "/c2/region/control" },
      { label: "门店报名", href: "/c2/hotel/enroll/demo" },
    ],
  },
  {
    title: "价格与底限",
    description: "底限策略与校验日志",
    items: [
      { label: "底限策略", href: "/c2/floors" },
      { label: "校验日志", href: "/c2/floors/validation-log" },
    ],
  },
  {
    title: "数据分析",
    description: "效果看板与活动复盘",
    items: [
      { label: "效果看板", href: "/c2/analytics" },
      { label: "门店看板", href: "/c2/analytics/hotel" },
    ],
  },
];

export default function PromotionHome() {
  return (
    <PageShell
      title="促销4.0"
      description="统一促销管理入口：策略、规则、活动、执行与复盘"
      actions={[
        { label: "创建活动", href: "/c2/campaigns/create", variant: "primary" },
        { label: "查看活动", href: "/c2/campaigns", variant: "secondary" },
      ]}
    >
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <SectionCard title="快捷入口" description="常用页面与操作">
          <div className="flex flex-wrap gap-2">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex items-center rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-700 hover:border-blue-200 hover:text-blue-600"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </SectionCard>
        <SectionCard title="状态提醒" description="实时风险与提醒">
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-center justify-between">
              <span>接近底限活动</span>
              <span className="text-amber-600">6</span>
            </div>
            <div className="flex items-center justify-between">
              <span>待审批申请</span>
              <span className="text-blue-600">12</span>
            </div>
            <div className="flex items-center justify-between">
              <span>即将结束活动</span>
              <span className="text-gray-900">9</span>
            </div>
          </div>
        </SectionCard>
        <SectionCard title="执行概览" description="报名与执行反馈">
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-center justify-between">
              <span>区域参与率</span>
              <span className="text-gray-900">78%</span>
            </div>
            <div className="flex items-center justify-between">
              <span>门店报名率</span>
              <span className="text-gray-900">62%</span>
            </div>
            <div className="flex items-center justify-between">
              <span>执行达成率</span>
              <span className="text-gray-900">85%</span>
            </div>
          </div>
        </SectionCard>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {modules.map((module) => (
          <SectionCard key={module.title} title={module.title} description={module.description}>
            <div className="flex flex-wrap gap-3">
              {module.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-gray-700 hover:text-blue-600"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </SectionCard>
        ))}
      </div>
    </PageShell>
  );
}
