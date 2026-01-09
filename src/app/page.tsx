import Sidebar from "@/components/Sidebar";

export default function Home() {
  return (
    <div className="flex h-[calc(100vh-8rem)]">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-50 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-semibold text-gray-900 mb-4">
            欢迎使用酒店CRS系统辅助工具
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            中央预订系统(Central Reservation System)，集成酒店预订、房态管理、价格策略等核心功能，为酒店提供统一的预订管理平台。
          </p>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-gray-700">
              请从左侧菜单选择功能模块开始使用。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
