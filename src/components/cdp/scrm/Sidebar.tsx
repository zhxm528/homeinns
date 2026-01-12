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
    name: "社交用户管理",
    href: "/cdp/scrm/user-management",
  },
  {
    name: "社群运营",
    href: "/cdp/scrm/community-operation",
  },
  {
    name: "社交互动",
    href: "/cdp/scrm/social-interaction",
  },
  {
    name: "私域分析",
    href: "/cdp/scrm/private-domain-analysis",
  },
];

export default function SCRMSidebar() {
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
          <Link href="/cdp/scrm" className="text-lg font-semibold text-gray-900 hover:text-blue-600">
            社交客户管理
          </Link>
        </div>
        <ul className="space-y-1">
          {menuData.map((item) => renderMenuItem(item))}
        </ul>
      </div>
    </aside>
  );
}
