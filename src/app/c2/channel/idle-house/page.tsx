"use client"

import PageShell from "@/components/c2/PageShell";
import Breadcrumb from "@/components/Breadcrumb";

export default function IdleHouseConfigPage() {
  const handleVisitSystem = () => {
    window.open("https://spm3.bthhotels.com/IdleHouse/List", "_blank");
  };

  return (
    <PageShell>
      <div className="mb-6">
        <Breadcrumb
          items={[
            { label: "促销4.0", href: "/c2" },
            { label: "渠道管理", href: "/c2/channel" },
            { label: "闲置房配置" },
          ]}
        />
      </div>
      <div className="flex items-center justify-center h-screen">
        <button
          onClick={handleVisitSystem}
          className="px-6 py-3 bg-blue-600 text-white text-base font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          访问原系统
        </button>
      </div>
    </PageShell>
  );
}
