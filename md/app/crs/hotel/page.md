# 核心功能
## 文件说明
- 前台页面 `/src/app/crs/hotel/page.tsx`
- 后台程序 `/src/app/api/crs/hotel/route.ts`
- 菜单 `/src/components/Sidebar.tsx`
- 本地数据库 酒店表 `/md/database/crs/hotel_base_info.sql`
- 本地数据库 房型表 `/md/database/crs/hotel_room_type.sql`
- 数据库配置文件 `/src/lib/crs/config.ts`
## 以下是需要执行的任务
- 酒店查询条件下，增加一个“同步”按钮，点击后，从 `/src/lib/38/config.ts` 获取`HotelBaseInfo`表的数据，插入到 `/src/lib/38/config.ts`中的`hotel_base_info`表

## 以下是执行过的任务，请忽略
- 实现前台页面 `/src/app/crs/hotel/page.tsx`展现左右结构，左边为查询酒店列表，右边为查询房型列表
- 实现后台程序 `/src/app/api/crs/hotel/route.ts` 查询酒店和房型
- 点击菜单中“基础信息”跳转到前台页面 `/src/app/crs/hotel/page.tsx`

- 前台页面 (src/app/crs/hotel/page.tsx) 左边需要显示 侧边栏菜单 (src/components/Sidebar.tsx)
- 调整页面布局：酒店列表的查询条件和房型列表的查询条件要拆分成两个板块，分别对应酒店列表和房型列表。
