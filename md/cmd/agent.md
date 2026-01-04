# 核心功能
## 以下是需要执行的任务
- Frontend page `/src/app/product/yifei/channel-order/page.tsx`
- Backend API `/src/app/api/product/yifei/channel-order/route.ts`
- SQL file `/md/database/sql/yifei/channel-order.sql`
- sql语句有变更，按照现有的sql语句更改后台程序

## 以下是执行过的任务，请忽略
- Frontend page `/src/app/product/yifei/channel-order/page.tsx` 页面中，渠道代码改为固定枚举值，添加一个枚举为“CHDBBK”
- Backend API `/src/app/api/product/yifei/channel-order/route.ts`
- 增加一个“导出”按钮，可以导出excel，excel文件中的列为表格中的列。
- 后台只打印sql，不需要打印返回前端的输出结果