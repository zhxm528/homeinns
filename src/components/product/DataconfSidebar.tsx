'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type MenuItem = {
  name: string;
  href: string;
};

const menuItems: MenuItem[] = [
  { name: '房价码分组', href: '/product/dataconf/ratecodegroup' },
  { name: '科目配置', href: '/product/dataconf/account-config-check' },
  { name: 'BI和客史差异检查', href: '/product/dataconf/bi-guest-history-diff-check' },
  { name: 'BI和客史市场差异检查', href: '/product/dataconf/bi-guest-history-market-diff-check' },
];

export default function DataconfSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0 overflow-y-auto flex-shrink-0">
      <div className="p-4">
        <div className="mb-4">
          <Link href="/product" className="text-lg font-semibold text-gray-900 hover:text-blue-600">
            数据配置
          </Link>
        </div>
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`block w-full px-3 py-2 text-sm rounded-md transition-colors ${
                    isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-200'
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
