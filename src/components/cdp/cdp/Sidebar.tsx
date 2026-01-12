'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface MenuItem {
  name: string;
  href?: string;
  children?: MenuItem[];
}

const menuData: MenuItem[] = [
  {
    name: "数据接入",
    href: "/cdp/cdp/data-ingestion",
    children: [
      { name: "数据源管理", href: "/cdp/cdp/data-ingestion/source-management" },
      { name: "实时数据接入", href: "/cdp/cdp/data-ingestion/realtime" },
      { name: "离线数据导入", href: "/cdp/cdp/data-ingestion/offline" },
      { name: "数据接入监控", href: "/cdp/cdp/data-ingestion/monitor" },
    ],
  },
  {
    name: "数据治理",
    href: "/cdp/cdp/data-governance",
    children: [
      { name: "数据标准管理", href: "/cdp/cdp/data-governance/standard" },
      { name: "字段映射与清洗规则", href: "/cdp/cdp/data-governance/mapping" },
      { name: "数据质量监控", href: "/cdp/cdp/data-governance/quality" },
      { name: "数据血缘与影响分析", href: "/cdp/cdp/data-governance/lineage" },
    ],
  },
  {
    name: "用户统一视图",
    href: "/cdp/cdp/unified-view",
    children: [
      { name: "OneID 规则配置", href: "/cdp/cdp/unified-view/oneid" },
      { name: "身份合并策略", href: "/cdp/cdp/unified-view/merge-strategy" },
      { name: "用户主档管理", href: "/cdp/cdp/unified-view/master-data" },
      { name: "多实体关系管理", href: "/cdp/cdp/unified-view/entity-relation" },
    ],
  },
  {
    name: "标签体系",
    href: "/cdp/cdp/tag-system",
    children: [
      { name: "标签目录管理", href: "/cdp/cdp/tag-system/catalog" },
      { name: "行为标签", href: "/cdp/cdp/tag-system/behavior" },
      { name: "属性标签", href: "/cdp/cdp/tag-system/attribute" },
      { name: "统计标签", href: "/cdp/cdp/tag-system/statistical" },
      { name: "AI 自动标签生成", href: "/cdp/cdp/tag-system/ai-generation" },
    ],
  },
  {
    name: "人群管理",
    href: "/cdp/cdp/audience-management",
    children: [
      { name: "人群圈选", href: "/cdp/cdp/audience-management/segment" },
      { name: "动态人群", href: "/cdp/cdp/audience-management/dynamic" },
      { name: "人群分层管理", href: "/cdp/cdp/audience-management/layer" },
      { name: "人群预估与覆盖分析", href: "/cdp/cdp/audience-management/coverage" },
    ],
  },
  {
    name: "数据服务",
    href: "/cdp/cdp/data-service",
    children: [
      { name: "数据 API 服务", href: "/cdp/cdp/data-service/api" },
      { name: "实时画像查询", href: "/cdp/cdp/data-service/profile-query" },
      { name: "标签服务订阅", href: "/cdp/cdp/data-service/tag-subscription" },
      { name: "下游系统授权管理", href: "/cdp/cdp/data-service/authorization" },
    ],
  },
];

export default function CDPSidebar() {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpand = (itemName: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemName)) {
      newExpanded.delete(itemName);
    } else {
      newExpanded.add(itemName);
    }
    setExpandedItems(newExpanded);
  };

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.name);
    const isActive = item.href && (pathname === item.href || pathname?.startsWith(item.href + '/'));

    return (
      <li key={item.name} className="mb-1">
        <div className="flex items-center">
          {hasChildren ? (
            <button
              onClick={() => toggleExpand(item.name)}
              className="flex items-center justify-between w-full px-3 py-2 text-sm rounded-md transition-colors text-gray-700 hover:bg-gray-200"
              style={{ paddingLeft: `${0.75 + level * 1}rem` }}
            >
              <span>{item.name}</span>
              <svg
                className={`w-4 h-4 transition-transform ${
                  isExpanded ? "rotate-90" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          ) : (
            <>
              {item.href ? (
                <Link
                  href={item.href}
                  className={`block w-full px-3 py-2 text-sm rounded-md transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-gray-200"
                  }`}
                  style={{ paddingLeft: `${0.75 + level * 1}rem` }}
                >
                  {item.name}
                </Link>
              ) : (
                <span
                  className="block px-3 py-2 text-sm text-gray-500"
                  style={{ paddingLeft: `${0.75 + level * 1}rem` }}
                >
                  {item.name}
                </span>
              )}
            </>
          )}
        </div>
        {hasChildren && isExpanded && (
          <ul className="mt-1 space-y-1">
            {item.children!.map((child) => renderMenuItem(child, level + 1))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-full overflow-y-auto flex-shrink-0">
      <div className="p-4">
        <div className="mb-4">
          <Link href="/cdp/cdp" className="text-lg font-semibold text-gray-900 hover:text-blue-600">
            客户数据平台
          </Link>
        </div>
        <ul className="space-y-1">
          {menuData.map((item) => renderMenuItem(item))}
        </ul>
      </div>
    </aside>
  );
}
