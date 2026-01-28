export type ModuleConfig = {
  id: string;
  icon: (props: { className?: string }) => React.ReactNode;
  iconBgColor: string;
  title: string;
  abbreviation: string;
  descriptionEn: string;
  descriptionCn: string;
};

// 模块图标组件
const DatabaseIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
  </svg>
);

const PersonIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const MegaphoneIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
  </svg>
);

const UsersIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const BuildingIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const WrenchIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export const moduleConfigs: Record<string, ModuleConfig> = {
  cdp: {
    id: "cdp",
    icon: (props) => <DatabaseIcon {...props} />,
    iconBgColor: "bg-blue-100",
    title: "客户数据平台",
    abbreviation: "CDP",
    descriptionEn: "Customer Data Platform",
    descriptionCn: "统一客户数据管理",
  },
  pa: {
    id: "pa",
    icon: (props) => <PersonIcon {...props} />,
    iconBgColor: "bg-purple-100",
    title: "画像分析",
    abbreviation: "PA",
    descriptionEn: "Profile Analytics",
    descriptionCn: "用户画像深度分析",
  },
  ma: {
    id: "ma",
    icon: (props) => <MegaphoneIcon {...props} />,
    iconBgColor: "bg-pink-100",
    title: "营销自动化",
    abbreviation: "MA",
    descriptionEn: "Marketing Automation",
    descriptionCn: "智能营销自动化",
  },
  scrm: {
    id: "scrm",
    icon: (props) => <UsersIcon {...props} />,
    iconBgColor: "bg-blue-100",
    title: "社交客户管理",
    abbreviation: "SCRM",
    descriptionEn: "Social Customer Relationship Management",
    descriptionCn: "企业微信客户关系管理",
  },
  crs: {
    id: "crs",
    icon: (props) => <BuildingIcon {...props} />,
    iconBgColor: "bg-green-100",
    title: "中央预订",
    abbreviation: "CRS",
    descriptionEn: "Central Reservation System",
    descriptionCn: "酒店中央预订系统",
  },
  tools: {
    id: "tools",
    icon: (props) => <WrenchIcon {...props} />,
    iconBgColor: "bg-yellow-100",
    title: "辅助工具",
    abbreviation: "Tools",
    descriptionEn: "Auxiliary Tools",
    descriptionCn: "系统辅助工具集",
  },
};

export const getModuleConfig = (id: string): ModuleConfig | undefined => {
  return moduleConfigs[id];
};
