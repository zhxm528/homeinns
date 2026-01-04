# 核心功能
## 以下是需要执行的任务
（暂无待执行任务）

## 以下是执行过的任务，请忽略
- 前台页面 src/app/product/business-analysis/channel-monthly-production/page.tsx
- 后台程序 src/app/api/product/business-analysis/channel-monthly-production/route.ts
- 前台页面中，查询条件 "集团代码" 从多选改为单选
- 后台程序增加逻辑： 判断 groupCode如果等于YF或者WX，则执行新的sql语句 md/sql_table/channel-monthly-production_p3.sql
- 增加个导出按钮，点击后把表格中的数据导出excel文件
- 在查询条件中增加"显示集团"勾选项，控制是否显示集团代码所对应的行的数据，默认为不勾选
