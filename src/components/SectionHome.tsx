import Link from "next/link";
import SectionSidebar from "@/components/SectionSidebar";
import type { HeaderMenu, SidebarItem } from "@/data/menu";
import { getModuleConfig } from "@/data/moduleConfig";

type SectionHomeProps = {
  section: HeaderMenu;
};

// 为侧边栏菜单项生成图标（简化版，可按需扩展）
const getItemIcon = (item: SidebarItem) => {
  // 可根据 item.id 或 item.title 返回不同的图标
  return (
    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
      <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    </div>
  );
};

export default function SectionHome({ section }: SectionHomeProps) {
  const items = section.sidebar ?? [];
  const moduleConfig = getModuleConfig(section.id);

  return (
    <div className="flex h-[calc(100vh-8rem)]">
      <SectionSidebar title={section.title} href={section.url} items={items} />
      <div className="flex-1 bg-gray-50 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{section.title}</h1>
            <p className="text-gray-600">
              {moduleConfig ? `${moduleConfig.descriptionEn} - ${moduleConfig.descriptionCn}` : "模块首页与导航入口"}
            </p>
          </div>
          {items.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-gray-600">
              暂无侧边栏菜单配置
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start mb-4">
                    <div className="flex-shrink-0 mr-4">{getItemIcon(item)}</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{item.title}</h3>
                      {item.children && item.children.length > 0 && (
                        <p className="text-sm text-gray-500 mb-3">
                          {item.children.length} 个子模块
                        </p>
                      )}
                    </div>
                  </div>
                  {item.children && item.children.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {item.children.slice(0, 3).map((child) => (
                          <span
                            key={child.id}
                            className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700"
                          >
                            {child.title}
                          </span>
                        ))}
                        {item.children.length > 3 && (
                          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                            +{item.children.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  <Link
                    href={item.url}
                    className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    进入模块
                    <svg className="ml-1 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
