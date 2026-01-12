'use client';

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { name: "首页", href: "/" },
    { name: "价格", href: "/price" },
    { name: "产品线", href: "/subsystem" },
    { name: "CDP", href: "/cdp" },
    { name: "关于", href: "/about" },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex">
        {/* 侧边栏区域，与页面体侧边栏宽度一致，Logo靠左显示 */}
        <div className="w-64 flex-shrink-0 flex items-center px-4">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white font-bold text-lg">Z</span>
            </div>
            <span className="text-xl font-bold text-gray-900">首旅如家</span>
          </Link>
        </div>
        {/* 内容区域，与页面体内容区域对齐 */}
        <div className="flex-1 px-6">
          <div className="flex items-center h-16">
          {/* Desktop Menu */}
          <nav className="hidden md:flex space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4 ml-auto">
            <Link
              href="/login"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
            >
              登录
            </Link>
            <Link
              href="/signup"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              注册
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none focus:text-blue-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
              <div className="md:hidden">
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 rounded-lg mt-2">
                  {menuItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <Link
                      href="/login"
                      className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      登录
                    </Link>
                    <Link
                      href="/signup"
                      className="bg-blue-600 text-white block px-3 py-2 rounded-lg text-base font-medium hover:bg-blue-700 transition-colors mt-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      注册
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
