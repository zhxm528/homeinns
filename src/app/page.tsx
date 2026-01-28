import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import { headerMenuList } from "@/data/menu";
import { getModuleConfig } from "@/data/moduleConfig";

export default function Home() {
  // 过滤掉首页本身，只显示其他模块
  const modules = headerMenuList.filter((menu) => menu.id !== "home");

  return (
    <div className="flex h-[calc(100vh-8rem)]">
      <Sidebar />
      <div className="flex-1 bg-gray-50 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">综合平台</h1>
            <p className="text-gray-600">统一客户数据管理、分析与营销平台</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module) => {
              const config = getModuleConfig(module.id);
              if (!config) return null;

              return (
                <div
                  key={module.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start mb-4">
                    <div className={`${config.iconBgColor} rounded-lg p-2 flex-shrink-0 mr-4`}>
                      <div className="text-gray-700">{config.icon({ className: "w-6 h-6" })}</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{module.title}</h3>
                      <p className="text-sm text-gray-500 mb-2">{config.abbreviation}</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-1">{config.descriptionEn}</p>
                    <p className="text-sm text-gray-500">{config.descriptionCn}</p>
                  </div>
                  <Link
                    href={module.url}
                    className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    进入模块
                    <svg className="ml-1 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
