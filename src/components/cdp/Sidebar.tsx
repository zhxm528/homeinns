'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

interface MenuItem {
  name: string;
  href: string;
}

const menuData: MenuItem[] = [
  {
    name: "客户数据平台（CDP）",
    href: "/cdp/cdp",
  },
  {
    name: "融合分析平台（FA）",
    href: "/cdp/fa",
  },
  {
    name: "画像分析（PA）",
    href: "/cdp/pa",
  },
  {
    name: "会话分析（CA）",
    href: "/cdp/ca",
  },
  {
    name: "实验分析（AB）",
    href: "/cdp/ab",
  },
  {
    name: "营销自动化（MA）",
    href: "/cdp/ma",
  },
  {
    name: "社交客户管理（SCRM）",
    href: "/cdp/scrm",
  },
  {
    name: "客户忠诚度管理（LM）",
    href: "/cdp/lm",
  },
  {
    name: "智能推荐（REM）",
    href: "/cdp/rem",
  },
  {
    name: "系统管理与治理",
    href: "/cdp/system",
  },
];

export default function CDPHomeSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-full overflow-y-auto flex-shrink-0">
      <div className="p-4">
        <div className="mb-4">
          <Link href="/cdp" className="text-lg font-semibold text-gray-900 hover:text-blue-600">
            CDP 客户数据平台
          </Link>
        </div>
        <ul className="space-y-1">
          {menuData.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            return (
              <li key={item.href} className="mb-1">
                <Link
                  href={item.href}
                  className={`block px-3 py-2 text-sm rounded-md transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
