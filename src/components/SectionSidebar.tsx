'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { SidebarItem } from "@/data/menu";

type SectionSidebarProps = {
  title: string;
  href: string;
  items: SidebarItem[];
  keepExpanded?: boolean;
  highlightParents?: boolean;
  inactiveUrls?: string[];
};

const iconMap: Record<string, JSX.Element> = {
  hotel_info: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21h18V8l-9-4-9 4v13zM9 21V9h6v12" />
  ),
  hotel_room: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12h16M4 16h16M7 12V7a3 3 0 016 0v5" />
  ),
  hotel_rate: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 1.119-3 2.5S10.343 13 12 13s3 1.119 3 2.5S13.657 18 12 18m0-12v1m0 10v1M6 5h12a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2z" />
  ),
  hotel_channel: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h6m4 0h6M4 12h6m4 0h6M4 17h6m4 0h6" />
  ),
  hotel_finance: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v8m-4-4h8M5 6h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2z" />
  ),
  c3: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h10M7 12h10M7 17h10" />
  ),
  c2: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 7h14M7 12h10M9 17h6" />
  ),
  data_assets: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7c0 1.657 3.582 3 8 3s8-1.343 8-3m-16 0c0-1.657 3.582-3 8-3s8 1.343 8 3m-16 0v10c0 1.657 3.582 3 8 3s8-1.343 8-3V7" />
  ),
  business_board: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M6 6v12m6-12v12m6-12v12M4 18h16" />
  ),
  data_management: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m-6-6h12M5 6h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2z" />
  ),
  private_domain_metrics: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 19h16M7 16V8m5 8V5m5 11v-4" />
  ),
  marketing_plan: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h8M8 11h8M8 15h5M5 4h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" />
  ),
  marketing_touch: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 20v-6m0 0V8m0 6h6m-6 0H6" />
  ),
  coupon_management: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 9h16v6H4V9zm2 0V7a1 1 0 011-1h2a2 2 0 014 0h2a1 1 0 011 1v2" />
  ),
  tag_management: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h5l5 5-5 5H7V7zM7 7l5-5 7 7-5 5" />
  ),
  customer_segment: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5-2.236M7 20H2v-2a3 3 0 015-2.236M12 12a4 4 0 100-8 4 4 0 000 8zm0 0a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  ),
  common_audience: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M6 10h12M8 14h8M10 18h4" />
  ),
  customer_profile: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11a4 4 0 11-8 0 4 4 0 018 0zm2 9H6a6 6 0 0112 0z" />
  ),
  data_board: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5h16v4H4V5zm0 6h7v8H4v-8zm9 0h7v8h-7v-8z" />
  ),
  customer_management: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20v-2a5 5 0 015-5h0a5 5 0 015 5v2M7 8a5 5 0 0110 0 5 5 0 01-10 0z" />
  ),
  acquire_customers: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  ),
  marketing_conversion: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h6v6H4V6zm10 0h6v6h-6V6zM4 14h6v6H4v-6zm10 3h6" />
  ),
  task_center: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M6 4h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2z" />
  ),
  content_center: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h10M4 18h8" />
  ),
  scrm_coupon: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 9h16v6H4V9zm0 0a2 2 0 002-2h2a2 2 0 114 0h2a2 2 0 012 2" />
  ),
  single_store_activity: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10l9-7 9 7v8a2 2 0 01-2 2h-4v-6H9v6H5a2 2 0 01-2-2v-8z" />
  ),
  statistics: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 19h16M7 16v-6m5 6V8m5 8v-4" />
  ),
  marketing_config: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6h4l1 3h3l-2 3 2 3h-3l-1 3h-4l-1-3H6l2-3-2-3h3l1-3z" />
  ),
};

const getIcon = (itemId: string, level: number) => {
  const iconPath = iconMap[itemId];
  if (iconPath) {
    return (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {iconPath}
      </svg>
    );
  }
  if (level > 0) {
    return (
      <span className="inline-block w-2 h-2 rounded-full bg-current opacity-60" />
    );
  }
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="7" strokeWidth={2} />
    </svg>
  );
};

const findActiveParents = (items: SidebarItem[], pathname: string) => {
  const expanded = new Set<string>();

  const walk = (nodes: SidebarItem[], parentIds: string[]) => {
    for (const node of nodes) {
      const isActive =
        pathname === node.url || pathname.startsWith(`${node.url}/`);
      const nextParents = isActive ? [...parentIds, node.id] : parentIds;
      if (node.children?.length) {
        walk(node.children, nextParents);
      }
      if (isActive) {
        parentIds.forEach((id) => expanded.add(id));
      }
    }
  };

  walk(items, []);
  return expanded;
};

const findAllExpandable = (items: SidebarItem[]) => {
  const expanded = new Set<string>();

  const walk = (nodes: SidebarItem[]) => {
    for (const node of nodes) {
      if (node.children?.length) {
        expanded.add(node.id);
        walk(node.children);
      }
    }
  };

  walk(items);
  return expanded;
};

export default function SectionSidebar({
  title,
  href,
  items,
  keepExpanded = false,
  highlightParents = true,
  inactiveUrls = [],
}: SectionSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const activeParents = useMemo(
    () => {
      if (!pathname) {
        return new Set<string>();
      }
      if (keepExpanded) {
        return findAllExpandable(items);
      }
      return findActiveParents(items, pathname);
    },
    [items, keepExpanded, pathname],
  );

  useEffect(() => {
    setExpandedItems(activeParents);
  }, [activeParents]);

  const toggleExpand = (itemId: string) => {
    if (keepExpanded) {
      return;
    }
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  };

  const renderMenuItem = (item: SidebarItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.id);
    const childMatchesPath = item.children?.some((child) => child.url === pathname);
    const isActive = pathname === item.url && !childMatchesPath && !inactiveUrls.includes(item.url);
    const icon = getIcon(item.id, level);

    return (
      <li key={item.id} className="mb-1">
        <div className="flex items-center">
          {hasChildren ? (
            <div
              className={`flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors ${
                isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-200"
              }`}
              style={{ paddingLeft: `${0.75 + level * 1}rem` }}
            >
              <span className={`mr-2 flex-shrink-0 ${collapsed ? "mx-auto" : ""}`}>{icon}</span>
              <button
                type="button"
                onClick={() => toggleExpand(item.id)}
                className={`flex-1 text-left ${collapsed ? "sr-only" : ""}`}
                title={item.title}
              >
                {item.title}
              </button>
              <button
                type="button"
                onClick={() => toggleExpand(item.id)}
                className={`ml-2 flex-shrink-0 ${collapsed || keepExpanded ? "hidden" : ""}`}
                aria-label={isExpanded ? "收起菜单" : "展开菜单"}
              >
                <svg
                  className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-90" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          ) : (
            <Link
              href={item.url}
              title={item.title}
              className={`block w-full px-3 py-2 text-sm rounded-md transition-colors ${
                isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-200"
              }`}
              style={{ paddingLeft: `${0.75 + level * 1}rem` }}
            >
              <span className={`inline-flex items-center ${collapsed ? "justify-center w-full" : ""}`}>
                <span className={`mr-2 flex-shrink-0 ${collapsed ? "mr-0" : ""}`}>{icon}</span>
                <span className={collapsed ? "sr-only" : ""}>{item.title}</span>
              </span>
            </Link>
          )}
        </div>
        {hasChildren && (keepExpanded || isExpanded) && (
          <ul className="mt-1 space-y-1">
            {item.children!.map((child) => renderMenuItem(child, level + 1))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <aside
      className={`border-r border-gray-200 bg-white h-full overflow-y-auto flex-shrink-0 transition-all duration-200 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <Link
            href={href}
            className={`text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors ${
              collapsed ? "sr-only" : ""
            }`}
          >
            {title}
          </Link>
          <button
            type="button"
            onClick={() => setCollapsed((prev) => !prev)}
            className="inline-flex items-center justify-center w-8 h-8 rounded-md border border-gray-200 text-gray-600 hover:text-blue-600 hover:border-blue-200"
            aria-label={collapsed ? "展开侧边栏" : "收起侧边栏"}
          >
            <svg
              className={`w-4 h-4 transition-transform ${collapsed ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
        <ul className="space-y-1">
          {items.map((item) => renderMenuItem(item))}
        </ul>
      </div>
    </aside>
  );
}
