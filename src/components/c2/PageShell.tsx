import Link from "next/link";
import type React from "react";

type PageAction = {
  label: string;
  href?: string;
  variant?: "primary" | "secondary" | "ghost";
};

type PageShellProps = {
  title: string;
  description?: string;
  actions?: PageAction[];
  children: React.ReactNode;
  showHeader?: boolean;
};

const getActionClasses = (variant?: PageAction["variant"]) => {
  switch (variant) {
    case "primary":
      return "inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors";
    case "ghost":
      return "inline-flex items-center px-4 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium hover:text-blue-600 hover:border-blue-200 transition-colors";
    case "secondary":
    default:
      return "inline-flex items-center px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 text-sm font-medium hover:border-blue-200 hover:text-blue-600 transition-colors";
  }
};

export default function PageShell({ title, description, actions, children, showHeader = true }: PageShellProps) {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
      {showHeader && (
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            {description && <p className="text-gray-600 mt-1">{description}</p>}
          </div>
          {actions && actions.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {actions.map((action) =>
                action.href ? (
                  <Link key={action.label} href={action.href} className={getActionClasses(action.variant)}>
                    {action.label}
                  </Link>
                ) : (
                  <button key={action.label} type="button" className={getActionClasses(action.variant)}>
                    {action.label}
                  </button>
                ),
              )}
            </div>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
