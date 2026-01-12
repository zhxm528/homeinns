# CDP 客户数据平台系统

## 文件说明
- 首页 `/src/app/cdp/page.tsx`
- 页眉菜单 `/src/components/Header.tsx`（需要添加 CDP 菜单项）
- CDP 首页侧边栏 `/src/components/cdp/Sidebar.tsx`（专门用于 CDP 首页，只显示所有模块）
- 全局侧边栏菜单 `/src/components/Sidebar.tsx`（用于其他页面，只显示"酒店管理"等非 CDP 模块）
- 模块侧边栏 `/src/components/cdp/{模块代码}/Sidebar.tsx`（每个模块独立的侧边栏）
- 模块首页 `/src/app/cdp/{模块代码}/page.tsx`（每个模块的首页）
- 布局结构：左侧侧边栏（一级菜单+二级菜单）+ 右侧主体内容区域
- 后台程序路径规则：`/src/app/api/cdp/{模块代码}/{一级菜单代码}/{二级菜单代码}/route.ts`
- 前台页面路径规则：`/src/app/cdp/{模块代码}/{一级菜单代码}/{二级菜单代码}/page.tsx`

## 实现规则

### 1. CDP 首页生成规则（`/src/app/cdp/page.tsx`）

首页需要展示所有10个一级模块的入口卡片，每个卡片点击后进入对应模块的首页。

#### 首页布局要求：
- 使用 `flex` 布局，左侧显示侧边栏（`<Sidebar />`），右侧显示主体内容
- 主体内容区域使用网格布局（`grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6`），每行显示2-3个卡片
- 每个模块卡片包含：
  - 模块图标（使用不同颜色的背景和SVG图标）
  - 模块名称（中文名称 + 英文缩写）
  - 模块描述（可选）
  - 点击卡片跳转到对应模块首页：`/cdp/{模块代码}`

#### 模块代码映射：
- CDP → `cdp`
- FA → `fa`
- PA → `pa`
- CA → `ca`
- AB → `ab`
- MA → `ma`
- SCRM → `scrm`
- LM → `lm`
- REM → `rem`
- 系统管理与治理 → `system`

#### 卡片样式要求：
- 白色背景，圆角，阴影效果
- 每个模块使用不同的主题色（如：CDP-蓝色、FA-绿色、PA-紫色等）
- 卡片内显示模块图标、名称和描述
- 支持 hover 效果

### 2. 页眉菜单定义规则

页眉菜单需要在 `/src/components/Header.tsx` 中添加 CDP 菜单项。

#### 页眉菜单要求：
- 在 `menuItems` 数组中添加 CDP 菜单项
- 菜单项名称：`"CDP"`
- 菜单项链接：`"/cdp"`
- 菜单项应显示在页眉导航栏中，与其他菜单项（首页、价格、产品线、关于）并列显示
- 支持桌面端和移动端显示

#### 实现方式：
在 `/src/components/Header.tsx` 的 `menuItems` 数组中添加：
```typescript
{ name: "CDP", href: "/cdp" }
```

#### 页眉菜单跳转规则：
- **点击页眉的"CDP"菜单** → 访问 `/cdp` 路由 → 渲染 `/src/app/cdp/page.tsx` (CDP首页)
- CDP首页路径：`/src/app/cdp/page.tsx`
- CDP首页路由：`/cdp`
- CDP首页功能：展示所有10个一级模块的入口卡片，每个卡片都是可点击的链接，点击后跳转到对应模块的首页

#### CDP首页模块链接显示规则：
- CDP首页必须显示所有10个模块的链接卡片
- 每个模块卡片包含：
  - 模块图标（不同颜色主题）
  - 模块名称（中文名称 + 英文缩写）
  - 模块描述
  - 可点击链接，跳转到 `/cdp/{模块代码}`
- 模块链接映射：
  - 客户数据平台（CDP） → `/cdp/cdp`
  - 融合分析平台（FA） → `/cdp/fa`
  - 画像分析（PA） → `/cdp/pa`
  - 会话分析（CA） → `/cdp/ca`
  - 实验分析（AB） → `/cdp/ab`
  - 营销自动化（MA） → `/cdp/ma`
  - 社交客户管理（SCRM） → `/cdp/scrm`
  - 客户忠诚度管理（LM） → `/cdp/lm`
  - 智能推荐（REM） → `/cdp/rem`
  - 系统管理与治理 → `/cdp/system`

### 3. CDP 首页侧边栏定义规则

CDP 首页使用独立的侧边栏组件 `/src/components/cdp/Sidebar.tsx`，专门用于 CDP 首页，只显示所有模块的入口。

#### CDP 首页侧边栏路径：
- 路径：`/src/components/cdp/Sidebar.tsx`
- 使用位置：`/src/app/cdp/page.tsx`（CDP 首页）

### 3.1 全局侧边栏菜单定义规则（其他页面使用）

全局侧边栏菜单在 `/src/components/Sidebar.tsx` 中定义，用于其他非 CDP 页面（如酒店管理等）。

#### CDP 首页侧边栏结构：
- 顶部显示"CDP 客户数据平台"标题，可点击返回 CDP 首页
- **只显示所有10个模块的链接**（CDP、FA、PA、CA、AB、MA、SCRM、LM、REM、System）
- **重要**：CDP 首页的侧边栏只需要展示每个{模块代码}即可，不需要展开显示每个模块的详细菜单
- 每个模块项点击后跳转到对应模块的首页：`/cdp/{模块代码}`
- 不包含"酒店管理"等其他模块

#### CDP 首页侧边栏菜单数据格式：
```typescript
{
  name: "CDP 客户数据平台",
  href: "/cdp", // CDP 首页
  children: [
    {
      name: "客户数据平台（CDP）",
      href: "/cdp/cdp", // 模块首页，不包含 children
    },
    {
      name: "融合分析平台（FA）",
      href: "/cdp/fa", // 模块首页，不包含 children
    },
    {
      name: "画像分析（PA）",
      href: "/cdp/pa", // 模块首页，不包含 children
    },
    {
      name: "会话分析（CA）",
      href: "/cdp/ca", // 模块首页，不包含 children
    },
    {
      name: "实验分析（AB）",
      href: "/cdp/ab", // 模块首页，不包含 children
    },
    {
      name: "营销自动化（MA）",
      href: "/cdp/ma", // 模块首页，不包含 children
    },
    {
      name: "社交客户管理（SCRM）",
      href: "/cdp/scrm", // 模块首页，不包含 children
    },
    {
      name: "客户忠诚度管理（LM）",
      href: "/cdp/lm", // 模块首页，不包含 children
    },
    {
      name: "智能推荐（REM）",
      href: "/cdp/rem", // 模块首页，不包含 children
    },
    {
      name: "系统管理与治理",
      href: "/cdp/system", // 模块首页，不包含 children
    },
  ]
}
```

#### CDP 首页侧边栏显示规则：
- **只显示模块代码**：侧边栏中每个模块项只显示模块名称和链接，不包含子菜单
- **不展开详细菜单**：模块项不可展开，点击后直接跳转到模块首页
- **简洁明了**：保持侧边栏简洁，方便用户快速选择模块
- **模块详细菜单**：每个模块的详细菜单（一级菜单、二级菜单）在模块内部的专用侧边栏中显示
- **独立组件**：CDP 首页使用独立的侧边栏组件 `/src/components/cdp/Sidebar.tsx`，与全局侧边栏分离

#### 全局侧边栏结构（其他页面使用）：
- 全局侧边栏 `/src/components/Sidebar.tsx` 用于其他非 CDP 页面
- 只显示"酒店管理"等非 CDP 模块
- 不包含 CDP 相关的任何模块

### 3.1 模块侧边栏定义规则

每个模块需要创建独立的侧边栏组件，用于该模块的所有页面。

#### 模块侧边栏路径：
- 路径格式：`/src/components/cdp/{模块代码}/Sidebar.tsx`
- 示例：CDP模块侧边栏 → `/src/components/cdp/cdp/Sidebar.tsx`

#### 模块侧边栏结构：
- 一级菜单：显示该模块下的一级菜单（如"数据接入"、"数据治理"等）
- 二级菜单：显示一级菜单下的功能页面（如"数据源管理"、"实时数据接入"等）
- 不显示模块名称，只显示该模块内部的菜单结构

#### 模块菜单数据格式：
```typescript
// /src/components/cdp/cdp/Sidebar.tsx
const menuData: MenuItem[] = [
  {
    name: "数据接入",
    href: "/cdp/cdp/data-ingestion", // 一级菜单页面
    children: [
      { name: "数据源管理", href: "/cdp/cdp/data-ingestion/source-management" },
      { name: "实时数据接入", href: "/cdp/cdp/data-ingestion/realtime" },
      { name: "离线数据导入", href: "/cdp/cdp/data-ingestion/offline" },
      { name: "数据接入监控", href: "/cdp/cdp/data-ingestion/monitor" }
    ],
  },
  {
    name: "数据治理",
    href: "/cdp/cdp/data-governance",
    children: [
      { name: "数据标准管理", href: "/cdp/cdp/data-governance/standard" },
      // ... 其他二级菜单
    ],
  },
  // ... 其他一级菜单
];
```

#### 路径命名规则：
- 模块代码：使用英文小写缩写（如 `cdp`, `fa`, `pa` 等）
- 一级菜单代码：使用英文小写，多个单词用连字符连接（如 `data-ingestion`, `data-governance` 等）
- 二级菜单代码：使用英文小写，多个单词用连字符连接（如 `source-management`, `realtime` 等）

#### 路径生成规则说明：
- **其他模块的二级菜单路径**：按照相同的规则生成，格式为：
  - 前台页面：`/src/app/cdp/{模块代码}/{一级菜单代码}/{二级菜单代码}/page.tsx`
  - 后台程序：`/src/app/api/cdp/{模块代码}/{一级菜单代码}/{二级菜单代码}/route.ts`
- **一级菜单代码转换规则**：中文名称转换为英文小写，多个单词用连字符连接
  - 示例：用户分析 → `user-analysis`，产品分析 → `product-analysis`
- **二级菜单代码转换规则**：中文名称转换为英文小写，多个单词用连字符连接
  - 示例：新增/活跃/留存分析 → `retention-analysis`，用户生命周期分析 → `lifecycle-analysis`

#### 一级菜单代码映射（以CDP模块为例）：
- 数据接入 → `data-ingestion`
- 数据治理 → `data-governance`
- 用户统一视图 → `unified-view`
- 标签体系 → `tag-system`
- 人群管理 → `audience-management`
- 数据服务 → `data-service`

### 4. 前台页面创建规则

为每个二级菜单创建对应的前台页面。

#### 页面路径规则：
- 路径格式：`/src/app/cdp/{模块代码}/{一级菜单代码}/{二级菜单代码}/page.tsx`
- 示例：数据源管理页面 → `/src/app/cdp/cdp/data-ingestion/source-management/page.tsx`

#### 页面结构要求：
- 使用 `'use client'` 指令（如果需要客户端交互）
- 导入 `Sidebar` 组件
- 布局：左侧侧边栏 + 右侧主体内容
- 右侧主体内容包含：
  - 页面标题和描述
  - 功能区域（查询条件、数据表格、表单等）
  - 操作按钮（新增、编辑、删除、导出等）

#### 页面模板结构：
```tsx
'use client';
import Sidebar from "@/components/cdp/{模块代码}/Sidebar"; // 使用模块专用侧边栏

export default function PageName() {
  return (
    <div className="flex h-[calc(100vh-8rem)]">
      <Sidebar />
      <div className="flex-1 bg-gray-50 overflow-y-auto">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* 页面标题 */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">页面标题</h1>
            <p className="text-gray-600">页面描述</p>
          </div>
          {/* 功能内容区域 */}
        </div>
      </div>
    </div>
  );
}
```

#### 页面侧边栏使用规则：
- **CDP 首页** (`/src/app/cdp/page.tsx`)：使用全局侧边栏 `@/components/Sidebar`
- **模块首页** (`/src/app/cdp/{模块代码}/page.tsx`)：使用模块侧边栏 `@/components/cdp/{模块代码}/Sidebar`
- **一级菜单页面** (`/src/app/cdp/{模块代码}/{一级菜单代码}/page.tsx`)：使用模块侧边栏 `@/components/cdp/{模块代码}/Sidebar`
- **二级菜单页面** (`/src/app/cdp/{模块代码}/{一级菜单代码}/{二级菜单代码}/page.tsx`)：使用模块侧边栏 `@/components/cdp/{模块代码}/Sidebar`

### 5. 后台程序创建规则

为每个二级菜单创建对应的后台 API 程序。

#### API 路径规则：
- 路径格式：`/src/app/api/cdp/{模块代码}/{一级菜单代码}/{二级菜单代码}/route.ts`
- 示例：数据源管理API → `/src/app/api/cdp/cdp/data-ingestion/source-management/route.ts`

#### API 结构要求：
- 支持 `GET`、`POST`、`PUT`、`DELETE` 等 HTTP 方法
- 使用 `NextRequest` 和 `NextResponse` 处理请求和响应
- 返回统一的 JSON 格式：`{ success: boolean, data: any, message: string }`
- 包含错误处理机制

#### API 模板结构：
```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // 处理 GET 请求逻辑
    return NextResponse.json({
      success: true,
      data: {},
      message: '查询成功',
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : '查询失败',
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // 处理 POST 请求逻辑
    return NextResponse.json({
      success: true,
      data: {},
      message: '操作成功',
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : '操作失败',
    }, { status: 500 });
  }
}
```

### 6. 模块首页创建规则

为每个一级模块创建模块首页，展示该模块下所有一级菜单的入口。

#### 模块首页路径：
- 路径格式：`/src/app/cdp/{模块代码}/page.tsx`
- 示例：CDP模块首页 → `/src/app/cdp/cdp/page.tsx`

#### 模块首页布局：
- 左侧侧边栏显示该模块的菜单结构（使用该模块专用的侧边栏组件：`@/components/cdp/{模块代码}/Sidebar`）
- 右侧主体区域展示该模块下所有一级菜单的卡片
- 每个一级菜单卡片点击后跳转到对应的一级菜单页面：`/cdp/{模块代码}/{一级菜单代码}`

#### 模块首页模板结构：
```tsx
'use client';
import Link from 'next/link';
import Sidebar from "@/components/cdp/{模块代码}/Sidebar"; // 使用模块专用侧边栏

export default function ModuleHome() {
  return (
    <div className="flex h-[calc(100vh-8rem)]">
      <Sidebar />
      <div className="flex-1 bg-gray-50 overflow-y-auto">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* 模块标题 */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">模块名称</h1>
            <p className="text-gray-600">模块描述</p>
          </div>
          {/* 一级菜单卡片 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* 一级菜单卡片列表 */}
          </div>
        </div>
      </div>
    </div>
  );
}
```

### 6.1 模块侧边栏创建规则

为每个模块创建独立的侧边栏组件，用于显示该模块的菜单结构。

#### 模块侧边栏路径：
- 路径格式：`/src/components/cdp/{模块代码}/Sidebar.tsx`
- 示例：CDP模块侧边栏 → `/src/components/cdp/cdp/Sidebar.tsx`
- 示例：FA模块侧边栏 → `/src/components/cdp/fa/Sidebar.tsx`

#### 模块侧边栏结构要求：
- 每个模块有自己独立的侧边栏组件
- 侧边栏显示该模块下的一级菜单和二级菜单
- 一级菜单可展开/收起
- 二级菜单在一级菜单展开时显示
- 支持三级菜单（二级菜单下的具体功能页面）

#### 模块侧边栏数据格式：
```typescript
// /src/components/cdp/{模块代码}/Sidebar.tsx
const menuData: MenuItem[] = [
  {
    name: "一级菜单名称",
    href: "/cdp/{模块代码}/{一级菜单代码}", // 一级菜单页面
    children: [
      {
        name: "二级菜单名称",
        href: "/cdp/{模块代码}/{一级菜单代码}/{二级菜单代码}", // 二级菜单页面
      },
      // ... 其他二级菜单
    ],
  },
  // ... 其他一级菜单
];
```

#### 模块侧边栏使用方式：
在模块首页和子页面中导入并使用该模块的侧边栏：
```tsx
import Sidebar from "@/components/cdp/{模块代码}/Sidebar";

export default function ModulePage() {
  return (
    <div className="flex h-[calc(100vh-8rem)]">
      <Sidebar />
      {/* 页面内容 */}
    </div>
  );
}
```

#### 模块侧边栏实现要求：
- 使用与全局 Sidebar 相同的样式和交互逻辑
- 支持菜单项的展开/收起
- 支持当前页面的高亮显示
- 支持路由跳转
- 响应式设计，支持移动端

#### 模块侧边栏示例（CDP模块）：
```typescript
// /src/components/cdp/cdp/Sidebar.tsx
const menuData: MenuItem[] = [
  {
    name: "数据接入",
    href: "/cdp/cdp/data-ingestion",
    children: [
      { name: "数据源管理", href: "/cdp/cdp/data-ingestion/source-management" },
      { name: "实时数据接入", href: "/cdp/cdp/data-ingestion/realtime" },
      { name: "离线数据导入", href: "/cdp/cdp/data-ingestion/offline" },
      { name: "数据接入监控", href: "/cdp/cdp/data-ingestion/monitor" },
    ],
  },
  {
    name: "数据治理",
    href: "/cdp/cdp/data-governance",
    children: [
      { name: "数据标准管理", href: "/cdp/cdp/data-governance/standard" },
      { name: "字段映射与清洗规则", href: "/cdp/cdp/data-governance/mapping" },
      { name: "数据质量监控", href: "/cdp/cdp/data-governance/quality" },
      { name: "数据血缘与影响分析", href: "/cdp/cdp/data-governance/lineage" },
    ],
  },
  // ... 其他一级菜单
];
```

### 7. 一级菜单页面创建规则

为每个一级菜单创建一级菜单页面，展示该一级菜单下所有二级菜单的入口。

#### 一级菜单页面路径：
- 路径格式：`/src/app/cdp/{模块代码}/{一级菜单代码}/page.tsx`
- 示例：数据接入页面 → `/src/app/cdp/cdp/data-ingestion/page.tsx`

#### 一级菜单页面布局：
- 左侧侧边栏显示该模块的菜单结构（使用该模块专用的侧边栏组件：`@/components/cdp/{模块代码}/Sidebar`）
- 右侧主体区域展示该一级菜单下所有二级菜单的卡片或列表
- 每个二级菜单点击后跳转到对应的二级菜单页面：`/cdp/{模块代码}/{一级菜单代码}/{二级菜单代码}`

#### 一级菜单页面模板结构：
```tsx
'use client';
import Link from 'next/link';
import Sidebar from "@/components/cdp/{模块代码}/Sidebar"; // 使用模块专用侧边栏

export default function FirstLevelMenuPage() {
  return (
    <div className="flex h-[calc(100vh-8rem)]">
      <Sidebar />
      <div className="flex-1 bg-gray-50 overflow-y-auto">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* 一级菜单标题 */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">一级菜单名称</h1>
            <p className="text-gray-600">一级菜单描述</p>
          </div>
          {/* 二级菜单卡片 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 二级菜单卡片列表 */}
          </div>
        </div>
      </div>
    </div>
  );
}
```

## 系统整体模块结构（一级模块）

1. **客户数据平台（CDP）** - Customer Data Platform
2. **融合分析平台（FA）** - Fabric Analytics
3. **画像分析（PA）** - Profile Analytics
4. **会话分析（CA）** - Conversation Analytics
5. **实验分析（AB）** - AB Test
6. **营销自动化（MA）** - Marketing Automation
7. **社交客户管理（SCRM）** - Social Customer Relationship Management
8. **客户忠诚度管理（LM）** - Loyalty Management
9. **智能推荐（REM）** - Recommend Management
10. **系统管理与治理** - System Management & Governance（支撑模块）

## 页面布局规则

### 首页布局
- 首页展示所有一级模块的入口卡片
- 每个卡片点击后进入对应模块的首页
- 布局：左侧侧边栏 + 右侧主体内容区域
- 右侧主体区域采用网格布局展示模块卡片（建议每行2-3个卡片）

### 子页面布局
- 所有子页面统一采用：**左侧侧边栏 + 右侧主体内容区域**
- 左侧侧边栏显示：
  - 一级菜单（可展开/收起）
  - 二级菜单（在一级菜单展开时显示）
- 右侧主体内容区域显示具体功能页面内容

## 以下是需要执行的任务

### 1. 客户数据平台（CDP）

#### 模块信息
- 模块代码：`cdp`
- 模块首页：`/src/app/cdp/cdp/page.tsx`
- 模块侧边栏：`/src/components/cdp/cdp/Sidebar.tsx`
- 模块API：`/src/app/api/cdp/cdp/route.ts`（如需要）

#### 一级菜单
- 数据接入（代码：`data-ingestion`）
  - 一级菜单页面：`/src/app/cdp/cdp/data-ingestion/page.tsx`
  - 一级菜单API：`/src/app/api/cdp/cdp/data-ingestion/route.ts`
- 数据治理（代码：`data-governance`）
  - 一级菜单页面：`/src/app/cdp/cdp/data-governance/page.tsx`
  - 一级菜单API：`/src/app/api/cdp/cdp/data-governance/route.ts`
- 用户统一视图（代码：`unified-view`）
  - 一级菜单页面：`/src/app/cdp/cdp/unified-view/page.tsx`
  - 一级菜单API：`/src/app/api/cdp/cdp/unified-view/route.ts`
- 标签体系（代码：`tag-system`）
  - 一级菜单页面：`/src/app/cdp/cdp/tag-system/page.tsx`
  - 一级菜单API：`/src/app/api/cdp/cdp/tag-system/route.ts`
- 人群管理（代码：`audience-management`）
  - 一级菜单页面：`/src/app/cdp/cdp/audience-management/page.tsx`
  - 一级菜单API：`/src/app/api/cdp/cdp/audience-management/route.ts`
- 数据服务（代码：`data-service`）
  - 一级菜单页面：`/src/app/cdp/cdp/data-service/page.tsx`
  - 一级菜单API：`/src/app/api/cdp/cdp/data-service/route.ts`

#### 二级菜单

**1.1 数据接入**
- 数据源管理（CRM / App / Web / 小程序 / 第三方）
  - 前台页面：`/src/app/cdp/cdp/data-ingestion/source-management/page.tsx`
  - 后台程序：`/src/app/api/cdp/cdp/data-ingestion/source-management/route.ts`
- 实时数据接入（SDK / API / Webhook）
  - 前台页面：`/src/app/cdp/cdp/data-ingestion/realtime/page.tsx`
  - 后台程序：`/src/app/api/cdp/cdp/data-ingestion/realtime/route.ts`
- 离线数据导入（文件 / DB / 云存储）
  - 前台页面：`/src/app/cdp/cdp/data-ingestion/offline/page.tsx`
  - 后台程序：`/src/app/api/cdp/cdp/data-ingestion/offline/route.ts`
- 数据接入监控
  - 前台页面：`/src/app/cdp/cdp/data-ingestion/monitor/page.tsx`
  - 后台程序：`/src/app/api/cdp/cdp/data-ingestion/monitor/route.ts`

**1.2 数据治理**
- 数据标准管理
  - 前台页面：`/src/app/cdp/cdp/data-governance/standard/page.tsx`
  - 后台程序：`/src/app/api/cdp/cdp/data-governance/standard/route.ts`
- 字段映射与清洗规则
  - 前台页面：`/src/app/cdp/cdp/data-governance/mapping/page.tsx`
  - 后台程序：`/src/app/api/cdp/cdp/data-governance/mapping/route.ts`
- 数据质量监控
  - 前台页面：`/src/app/cdp/cdp/data-governance/quality/page.tsx`
  - 后台程序：`/src/app/api/cdp/cdp/data-governance/quality/route.ts`
- 数据血缘与影响分析
  - 前台页面：`/src/app/cdp/cdp/data-governance/lineage/page.tsx`
  - 后台程序：`/src/app/api/cdp/cdp/data-governance/lineage/route.ts`

**1.3 用户统一视图**
- OneID 规则配置
  - 前台页面：`/src/app/cdp/cdp/unified-view/oneid/page.tsx`
  - 后台程序：`/src/app/api/cdp/cdp/unified-view/oneid/route.ts`
- 身份合并策略
  - 前台页面：`/src/app/cdp/cdp/unified-view/merge-strategy/page.tsx`
  - 后台程序：`/src/app/api/cdp/cdp/unified-view/merge-strategy/route.ts`
- 用户主档管理
  - 前台页面：`/src/app/cdp/cdp/unified-view/master-data/page.tsx`
  - 后台程序：`/src/app/api/cdp/cdp/unified-view/master-data/route.ts`
- 多实体关系管理（人 / 设备 / 账号）
  - 前台页面：`/src/app/cdp/cdp/unified-view/entity-relation/page.tsx`
  - 后台程序：`/src/app/api/cdp/cdp/unified-view/entity-relation/route.ts`

**1.4 标签体系**
- 标签目录管理
  - 前台页面：`/src/app/cdp/cdp/tag-system/catalog/page.tsx`
  - 后台程序：`/src/app/api/cdp/cdp/tag-system/catalog/route.ts`
- 行为标签
  - 前台页面：`/src/app/cdp/cdp/tag-system/behavior/page.tsx`
  - 后台程序：`/src/app/api/cdp/cdp/tag-system/behavior/route.ts`
- 属性标签
  - 前台页面：`/src/app/cdp/cdp/tag-system/attribute/page.tsx`
  - 后台程序：`/src/app/api/cdp/cdp/tag-system/attribute/route.ts`
- 统计标签
  - 前台页面：`/src/app/cdp/cdp/tag-system/statistical/page.tsx`
  - 后台程序：`/src/app/api/cdp/cdp/tag-system/statistical/route.ts`
- AI 自动标签生成
  - 前台页面：`/src/app/cdp/cdp/tag-system/ai-generation/page.tsx`
  - 后台程序：`/src/app/api/cdp/cdp/tag-system/ai-generation/route.ts`

**1.5 人群管理**
- 人群圈选（条件 / 行为 / 组合）
  - 前台页面：`/src/app/cdp/cdp/audience-management/segment/page.tsx`
  - 后台程序：`/src/app/api/cdp/cdp/audience-management/segment/route.ts`
- 动态人群
  - 前台页面：`/src/app/cdp/cdp/audience-management/dynamic/page.tsx`
  - 后台程序：`/src/app/api/cdp/cdp/audience-management/dynamic/route.ts`
- 人群分层管理
  - 前台页面：`/src/app/cdp/cdp/audience-management/layer/page.tsx`
  - 后台程序：`/src/app/api/cdp/cdp/audience-management/layer/route.ts`
- 人群预估与覆盖分析
  - 前台页面：`/src/app/cdp/cdp/audience-management/coverage/page.tsx`
  - 后台程序：`/src/app/api/cdp/cdp/audience-management/coverage/route.ts`

**1.6 数据服务**
- 数据 API 服务
  - 前台页面：`/src/app/cdp/cdp/data-service/api/page.tsx`
  - 后台程序：`/src/app/api/cdp/cdp/data-service/api/route.ts`
- 实时画像查询
  - 前台页面：`/src/app/cdp/cdp/data-service/profile-query/page.tsx`
  - 后台程序：`/src/app/api/cdp/cdp/data-service/profile-query/route.ts`
- 标签服务订阅
  - 前台页面：`/src/app/cdp/cdp/data-service/tag-subscription/page.tsx`
  - 后台程序：`/src/app/api/cdp/cdp/data-service/tag-subscription/route.ts`
- 下游系统授权管理
  - 前台页面：`/src/app/cdp/cdp/data-service/authorization/page.tsx`
  - 后台程序：`/src/app/api/cdp/cdp/data-service/authorization/route.ts`

### 2. 融合分析平台（FA）

#### 模块信息
- 模块代码：`fa`
- 模块首页：`/src/app/cdp/fa/page.tsx`
- 模块侧边栏：`/src/components/cdp/fa/Sidebar.tsx`
- 模块API：`/src/app/api/cdp/fa/route.ts`（如需要）

#### 一级菜单
- 用户分析
- 产品分析
- 营销分析
- 经营分析
- 场景分析
- 智能分析

#### 二级菜单

**2.1 用户分析**
- 新增 / 活跃 / 留存分析
- 用户生命周期分析
- 用户价值分析（LTV）

**2.2 产品分析**
- 功能使用路径
- 漏斗分析
- 留存与流失分析

**2.3 营销分析**
- 渠道效果分析
- 转化归因分析
- ROI 分析

**2.4 经营分析**
- 收入结构分析
- 成本与收益分析
- 关键经营指标看板

**2.5 场景分析**
- 自定义分析模型
- 业务指标建模
- 跨域数据联动分析

**2.6 智能分析**
- 自动洞察
- 异常波动识别
- 大模型分析解读

### 3. 画像分析（PA）

#### 模块信息
- 模块代码：`pa`
- 模块首页：`/src/app/cdp/pa/page.tsx`
- 模块侧边栏：`/src/components/cdp/pa/Sidebar.tsx`
- 模块API：`/src/app/api/cdp/pa/route.ts`（如需要）

#### 一级菜单
- 画像概览
- 画像维度
- 画像对比
- 画像洞察

#### 二级菜单

**3.1 画像概览**
- 单用户画像
- 人群画像
- 实时画像预览

**3.2 画像维度**
- 基础属性画像
- 行为画像
- 偏好画像
- 价值画像

**3.3 画像对比**
- 人群画像对比
- 时间维度变化对比
- 标签分布对比

**3.4 画像洞察**
- 关键特征洞察
- 用户画像总结（AI）
- 画像导出

### 4. 会话分析（CA）

#### 模块信息
- 模块代码：`ca`
- 模块首页：`/src/app/cdp/ca/page.tsx`
- 模块侧边栏：`/src/components/cdp/ca/Sidebar.tsx`
- 模块API：`/src/app/api/cdp/ca/route.ts`（如需要）

#### 一级菜单
- 会话数据接入
- 内容分析
- 用户互动分析
- 情感与意图

#### 二级菜单

**4.1 会话数据接入**
- 微信 / 客服 / 社群接入
- 语音转文本管理
- 会话数据治理

**4.2 内容分析**
- 关键词分析
- 主题聚类
- 高频问题分析

**4.3 用户互动分析**
- 互动频率分析
- 响应时效分析
- 客服表现分析

**4.4 情感与意图**
- 情绪识别
- 用户意图识别
- 风险会话预警

### 5. 实验分析（AB）

#### 模块信息
- 模块代码：`ab`
- 模块首页：`/src/app/cdp/ab/page.tsx`
- 模块侧边栏：`/src/components/cdp/ab/Sidebar.tsx`
- 模块API：`/src/app/api/cdp/ab/route.ts`（如需要）

#### 一级菜单
- 实验管理
- 实验配置
- 实验分析
- 实验资产

#### 二级菜单

**5.1 实验管理**
- 实验列表
- 实验状态监控
- 实验权限管理

**5.2 实验配置**
- 实验目标设置
- 流量分配
- 实验策略配置

**5.3 实验分析**
- 转化对比分析
- 显著性检验
- 实验结论生成

**5.4 实验资产**
- 实验模板库
- 历史实验复用
- 实验知识沉淀

### 6. 营销自动化（MA）

#### 模块信息
- 模块代码：`ma`
- 模块首页：`/src/app/cdp/ma/page.tsx`
- 模块侧边栏：`/src/components/cdp/ma/Sidebar.tsx`
- 模块API：`/src/app/api/cdp/ma/route.ts`（如需要）

#### 一级菜单
- 营销画布
- 触达管理
- 内容与素材
- 任务与监控

#### 二级菜单

**6.1 营销画布**
- 营销流程编排
- 多触点策略配置
- 实时决策节点

**6.2 触达管理**
- 渠道管理（短信 / Push / 微信 / 邮件）
- 人群投放
- 触达频控

**6.3 内容与素材**
- AI 内容生成
- 素材库管理
- 策略模板管理

**6.4 任务与监控**
- 执行监控
- 效果分析
- 异常预警

### 7. 社交客户管理（SCRM）

#### 模块信息
- 模块代码：`scrm`
- 模块首页：`/src/app/cdp/scrm/page.tsx`
- 模块侧边栏：`/src/components/cdp/scrm/Sidebar.tsx`
- 模块API：`/src/app/api/cdp/scrm/route.ts`（如需要）

#### 一级菜单
- 社交用户管理
- 社群运营
- 社交互动
- 私域分析

#### 二级菜单

**7.1 社交用户管理**
- 社交账号绑定
- 社交标签管理
- 私域用户池

**7.2 社群运营**
- 社群管理
- 社群活跃度分析
- 群内容分析

**7.3 社交互动**
- 消息管理
- 自动回复规则
- 互动任务

**7.4 私域分析**
- 私域转化分析
- 社交裂变分析
- 社交关系图谱

### 8. 客户忠诚度管理（LM）

#### 模块信息
- 模块代码：`lm`
- 模块首页：`/src/app/cdp/lm/page.tsx`
- 模块侧边栏：`/src/components/cdp/lm/Sidebar.tsx`
- 模块API：`/src/app/api/cdp/lm/route.ts`（如需要）

#### 一级菜单
- 会员体系
- 积分与权益
- 会员运营
- 忠诚度分析

#### 二级菜单

**8.1 会员体系**
- 等级规则配置
- 升降级策略
- 会员身份管理

**8.2 积分与权益**
- 积分规则
- 权益配置
- 权益核销

**8.3 会员运营**
- 会员任务
- 会员活动
- 会员触达

**8.4 忠诚度分析**
- 活跃度分析
- 忠诚度评分
- 会员生命周期

### 9. 智能推荐（REM）

#### 模块信息
- 模块代码：`rem`
- 模块首页：`/src/app/cdp/rem/page.tsx`
- 模块侧边栏：`/src/components/cdp/rem/Sidebar.tsx`
- 模块API：`/src/app/api/cdp/rem/route.ts`（如需要）

#### 一级菜单
- 推荐策略
- 推荐模型
- 推荐位管理
- 推荐效果

#### 二级菜单

**9.1 推荐策略**
- 场景策略配置
- 人群策略
- 规则引擎

**9.2 推荐模型**
- 模型管理
- 模型训练
- 模型评估

**9.3 推荐位管理**
- 推荐位配置
- 展示策略
- 渠道绑定

**9.4 推荐效果**
- 点击率分析
- 转化率分析
- 推荐效果对比

### 10. 系统管理与治理

#### 模块信息
- 模块代码：`system`
- 模块首页：`/src/app/cdp/system/page.tsx`
- 模块侧边栏：`/src/components/cdp/system/Sidebar.tsx`
- 模块API：`/src/app/api/cdp/system/route.ts`（如需要）

#### 一级菜单
- 组织与权限
- 系统配置
- 安全与合规
- 运维监控

#### 二级菜单

**10.1 组织与权限**
- 组织管理
- 角色管理
- 权限策略

**10.2 系统配置**
- 参数配置
- 通用字典
- 集成配置

**10.3 安全与合规**
- 数据脱敏
- 审计日志
- 合规策略

**10.4 运维监控**
- 系统健康监控
- 任务调度
- 告警管理

## 以下是执行过的任务，请忽略

- 创建 CDP 首页 `/src/app/cdp/page.tsx`，展示所有10个模块的入口卡片
- 更新页眉菜单 `/src/components/Header.tsx`，添加 CDP 菜单项（链接到 `/cdp`）
- 更新侧边栏菜单 `/src/components/Sidebar.tsx`，添加 CDP 模块的完整菜单结构
- 创建所有10个模块的首页：
  - `/src/app/cdp/cdp/page.tsx` - 客户数据平台模块首页
  - `/src/app/cdp/fa/page.tsx` - 融合分析平台模块首页
  - `/src/app/cdp/pa/page.tsx` - 画像分析模块首页
  - `/src/app/cdp/ca/page.tsx` - 会话分析模块首页
  - `/src/app/cdp/ab/page.tsx` - 实验分析模块首页
  - `/src/app/cdp/ma/page.tsx` - 营销自动化模块首页
  - `/src/app/cdp/scrm/page.tsx` - 社交客户管理模块首页
  - `/src/app/cdp/lm/page.tsx` - 客户忠诚度管理模块首页
  - `/src/app/cdp/rem/page.tsx` - 智能推荐模块首页
  - `/src/app/cdp/system/page.tsx` - 系统管理与治理模块首页
- 创建 CDP 模块的一级菜单页面示例：
  - `/src/app/cdp/cdp/data-ingestion/page.tsx` - 数据接入页面
- 创建 CDP 模块的二级菜单页面示例：
  - `/src/app/cdp/cdp/data-ingestion/source-management/page.tsx` - 数据源管理页面
- 创建 CDP 模块的二级菜单后台 API 示例：
  - `/src/app/api/cdp/cdp/data-ingestion/source-management/route.ts` - 数据源管理 API（支持 GET、POST、PUT、DELETE）
- 创建 CDP 模块的所有一级菜单页面：
  - `/src/app/cdp/cdp/data-governance/page.tsx` - 数据治理页面
  - `/src/app/cdp/cdp/unified-view/page.tsx` - 用户统一视图页面
  - `/src/app/cdp/cdp/tag-system/page.tsx` - 标签体系页面
  - `/src/app/cdp/cdp/audience-management/page.tsx` - 人群管理页面
  - `/src/app/cdp/cdp/data-service/page.tsx` - 数据服务页面
- 创建 CDP 模块数据接入的剩余二级菜单页面：
  - `/src/app/cdp/cdp/data-ingestion/realtime/page.tsx` - 实时数据接入页面
  - `/src/app/cdp/cdp/data-ingestion/offline/page.tsx` - 离线数据导入页面
  - `/src/app/cdp/cdp/data-ingestion/monitor/page.tsx` - 数据接入监控页面
- 创建所有10个模块的独立侧边栏组件：
  - `/src/components/cdp/cdp/Sidebar.tsx` - CDP 模块侧边栏
  - `/src/components/cdp/fa/Sidebar.tsx` - FA 模块侧边栏
  - `/src/components/cdp/pa/Sidebar.tsx` - PA 模块侧边栏
  - `/src/components/cdp/ca/Sidebar.tsx` - CA 模块侧边栏
  - `/src/components/cdp/ab/Sidebar.tsx` - AB 模块侧边栏
  - `/src/components/cdp/ma/Sidebar.tsx` - MA 模块侧边栏
  - `/src/components/cdp/scrm/Sidebar.tsx` - SCRM 模块侧边栏
  - `/src/components/cdp/lm/Sidebar.tsx` - LM 模块侧边栏
  - `/src/components/cdp/rem/Sidebar.tsx` - REM 模块侧边栏
  - `/src/components/cdp/system/Sidebar.tsx` - System 模块侧边栏
- 更新所有模块首页使用模块专用侧边栏：
  - 所有模块首页（`/src/app/cdp/{模块代码}/page.tsx`）已更新为使用各自的模块侧边栏
  - CDP 模块的所有子页面已更新为使用 CDP 模块专用侧边栏
- 创建 CDP 首页专用侧边栏：
  - 创建 `/src/components/cdp/Sidebar.tsx` 专门用于 CDP 首页
  - CDP 首页侧边栏只显示10个模块的链接，不包含"酒店管理"
  - 每个模块项不包含子菜单，点击后直接跳转到模块首页
  - 模块的详细菜单在模块内部的专用侧边栏中显示
- 更新全局侧边栏：
  - 全局侧边栏 `/src/components/Sidebar.tsx` 已更新，移除了 CDP 相关的内容
  - 全局侧边栏只显示"酒店管理"等非 CDP 模块
  - CDP 首页使用独立的侧边栏组件，与全局侧边栏分离