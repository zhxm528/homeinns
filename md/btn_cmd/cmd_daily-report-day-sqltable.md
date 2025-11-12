# 前后台程序的执行规则说明
##上下文说明
- 后台程序 app/api/product/business-analysis/daily-report-day/route.ts
- 入口前台页面 app/product/business-analysis/daily-report/page.tsx
- 前台回显页面 app/product/business-analysis/daily-report-day/page.tsx
- SQL语句 

##核心功能
- 在入口前台页面 app/product/business-analysis/daily-report/page.tsx 中的表格第一列，酒店代码，增加一个超链接，点击后打开一个新的浏览器页签，同时调用后台程序 app/api/product/business-analysis/daily-report-day/route.ts
- 在后台程序 app/api/product/business-analysis/daily-report-day/route.ts 中实现执行SQL语句，并将结果返回给前台回显页面；
- 在回显页面上，上方显示echart的折线图，下方显示每日明细数据；echart横坐标是每天，纵坐标是指标的数值，每一个指标是一条折线；表格的列是每日，表格的行是指标，指标包括：客房收入、餐饮收入、其他收入、实际售卖间夜数、出租率、平均房价