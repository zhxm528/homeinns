'use client';

import type React from "react";
import SectionSidebar from "@/components/SectionSidebar";
import { headerMenuById } from "@/data/menu";

type C2ShellProps = {
  children: React.ReactNode;
};

export default function C2Shell({ children }: C2ShellProps) {
  const section = headerMenuById("promotion40");

  if (!section) {
    return (
      <div className="flex h-[calc(100vh-8rem+200px)]">
        <div className="flex-1 bg-gray-50">
          <div className="max-w-3xl mx-auto px-6 py-12">
            <h1 className="text-2xl font-semibold text-gray-900">Promotion 4.0</h1>
            <p className="text-gray-600 mt-2">Menu configuration missing.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-8rem+200px)]">
      <SectionSidebar
        title={section.title}
        href={section.url}
        items={section.sidebar ?? []}
        keepExpanded={false}
        highlightParents={false}
        inactiveUrls={["/c2"]}
      />
      <div className="flex-1 bg-gray-50 overflow-y-auto">{children}</div>
    </div>
  );
}
