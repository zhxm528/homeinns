import Link from 'next/link';
import C3Sidebar from '@/components/tools/c3/Sidebar';
import { menuData } from '@/components/tools/c3/menu';

export default function ToolsC3Page() {
  return (
    <div className="flex h-[calc(100vh-8rem)]">
      <C3Sidebar />
      <div className="flex-1 bg-gray-50 overflow-y-auto">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">C3 菜单索引</h1>
            <p className="text-gray-600">一级菜单与二级入口</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {menuData.map((section) => (
              <div
                key={section.name}
                className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">{section.name}</h2>
                    <span className="text-xs text-gray-500">
                      {section.children?.length ?? 0} 项
                    </span>
                  </div>
                  <div className="space-y-2">
                    {section.children?.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href ?? '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
