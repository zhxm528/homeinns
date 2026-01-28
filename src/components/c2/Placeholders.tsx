import type React from "react";

type MetricItem = {
  label: string;
  value: string;
  hint?: string;
};

type TablePlaceholderProps = {
  columns: string[];
  rows?: number;
};

type TabsPlaceholderProps = {
  tabs: string[];
};

type FormPlaceholderProps = {
  fields: string[];
  columns?: number;
};

export function MetricGrid({ items }: { items: MetricItem[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">{item.label}</p>
          <p className="text-2xl font-semibold text-gray-900 mt-2">{item.value}</p>
          {item.hint && <p className="text-xs text-gray-400 mt-1">{item.hint}</p>}
        </div>
      ))}
    </div>
  );
}

export function TablePlaceholder({ columns, rows = 4 }: TablePlaceholderProps) {
  const dataRows = Array.from({ length: rows }, (_, index) => index);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500 border-b border-gray-200">
            {columns.map((column) => (
              <th key={column} className="py-2 pr-4 font-medium">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dataRows.map((row) => (
            <tr key={row} className="border-b border-gray-100 text-gray-600">
              {columns.map((column) => (
                <td key={`${row}-${column}`} className="py-3 pr-4">
                  --
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function TabsPlaceholder({ tabs }: TabsPlaceholderProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab, index) => (
        <div
          key={tab}
          className={`px-4 py-2 rounded-full text-sm border ${
            index === 0 ? "bg-blue-50 text-blue-700 border-blue-200" : "text-gray-600 border-gray-200"
          }`}
        >
          {tab}
        </div>
      ))}
    </div>
  );
}

export function FormPlaceholder({ fields, columns = 2 }: FormPlaceholderProps) {
  const gridCols = columns === 1 ? "md:grid-cols-1" : "md:grid-cols-2";

  return (
    <div className={`grid grid-cols-1 gap-4 ${gridCols}`}>
      {fields.map((field) => (
        <div key={field}>
          <div className="text-sm text-gray-500 mb-2">{field}</div>
          <div className="h-10 rounded-md bg-gray-100" />
        </div>
      ))}
    </div>
  );
}

export function CalendarPlaceholder() {
  const cells = Array.from({ length: 35 }, (_, index) => index + 1);

  return (
    <div className="grid grid-cols-7 gap-2">
      {cells.map((cell) => (
        <div key={cell} className="h-16 rounded-md border border-gray-200 bg-white" />
      ))}
    </div>
  );
}

export function StatusList({ items }: { items: string[] }) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item} className="flex items-center justify-between rounded-md border border-gray-200 px-4 py-3">
          <span className="text-sm text-gray-700">{item}</span>
          <span className="text-xs text-gray-400">--</span>
        </div>
      ))}
    </div>
  );
}
