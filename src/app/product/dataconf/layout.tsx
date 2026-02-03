import type { ReactNode } from 'react';
import { headerMenuById } from '@/data/menu';
import SectionSidebar from '@/components/SectionSidebar';

export default function DataconfLayout({ children }: { children: ReactNode }) {
  const section = headerMenuById('crs');
  if (!section) {
    throw new Error('CRS menu configuration missing.');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen">
        <SectionSidebar title={section.title} href={section.url} items={section.sidebar ?? []} />
        <main className="flex-1 min-w-0 w-full">{children}</main>
      </div>
    </div>
  );
}
