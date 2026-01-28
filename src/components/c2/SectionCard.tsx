import type React from "react";

type SectionCardProps = {
  title: string;
  description?: string;
  action?: React.ReactNode;
  collapsible?: boolean;
  defaultOpen?: boolean;
  children: React.ReactNode;
};

export default function SectionCard({
  title,
  description,
  action,
  collapsible = false,
  defaultOpen = true,
  children,
}: SectionCardProps) {
  if (collapsible) {
    return (
      <details className="group bg-white border border-gray-200 rounded-lg p-6 shadow-sm" open={defaultOpen ? true : undefined}>
        <summary className="flex cursor-pointer list-none flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
          </div>
          <div className="flex items-center gap-3">
            {action && <div>{action}</div>}
            <span className="text-sm text-gray-500 group-open:hidden">展开</span>
            <span className="text-sm text-gray-500 hidden group-open:inline">收起</span>
          </div>
        </summary>
        <div className="mt-4">{children}</div>
      </details>
    );
  }

  return (
    <section className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
      {children}
    </section>
  );
}
