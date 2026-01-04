# 核心功能
## 执行任务需要参考规则文件：
- 前台页面执行规则 md/sql_table/sql_table_app.md 
- 后台程序执行规则 md/sql_table/sql_table_api.md 

- 每次执行完毕该md文件后，把"需要执行的内容"至"不需要执行的内容，忽略以下内容"之间区域的内容追加到文档最下面。

## 需要执行的内容

## 不需要执行的内容，忽略以下内容

- 前台页面 src/app/product/business-analysis/daily-consumption-detail/page.tsx
- **检查代码**避免报错：`Encountered two children with the same key, `0`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version.`
- **检查代码**避免报错：`Warning: [antd: Table] `index` parameter of `rowKey` function is deprecated. There is no guarantee that it will work as expected.`
- 后台程序 src/app/api/product/business-analysis/daily-consumption-detail/route.ts
- SQL语句 /md/sql/product/business-analysis/daily-consumption-detail.sql



- 前台页面 src/app/product/business-analysis/channel-monthly-production/page.tsx
- 后台程序 src/app/api/product/business-analysis/channel-monthly-production/route.ts
- SQL语句 md/sql_table/channel-monthly-production.sql
- 前台页面执行规则 md/sql_table/sql_table_app.md 
- 后台程序执行规则 md/sql_table/sql_table_api.md


- 前台页面 src/app/product/report-analysis/channel-trial-order-rate/page.tsx 
- 后台程序 src/app/api/product/report-analysis/channel-trial-order-rate/route.ts 
- SQL语句 md/sql_table/sql_channel-trial-order-rate.md 
- 前台页面执行规则 md/sql_table/sql_table_app.md 
- 后台程序执行规则 md/sql_table/sql_table_api.md 

- 修改前台页面 src/app/product/report-analysis/channel-trial-order-rate/page.tsx 增加一个echart图表
- 图表的横向坐标是日期，纵向坐标是百分比
- 图表中有两个折线图：试单成功率、下单成功率
###channel-trial-order-rate 修改 渠道代码 下拉选择的枚举值
- 修改前台页面 src/app/product/report-analysis/channel-trial-order-rate/page.tsx 修改查询条件中，"渠道代码"下拉选择的枚举值
- 枚举值：HYATT - 凯悦； CHAGDA - Agoda；CHMTTG - 美团；UCW - 逸扉小程序；CHFZLX - 飞猪；CHCTRP - 携程；UCC - 逸扉万信商旅小程序；CHDYRL - 抖音；CTM - 商旅大客户；800333 - 官网；CHDBBK - Booking；CHZKTS - 首享会；


- 前台页面 src/app/product/dataconf/account-config-check/page.tsx 
- 后台程序 src/app/api/product/dataconf/account-config-check/route.ts 
- SQL语句 md/sql_table/sql_account-config-check.md 
- 前台页面执行规则 md/sql_table/sql_table_app.md 
- 后台程序执行规则 md/sql_table/sql_table_api.md 


- 前台页面 src/app/product/dataconf/bi-guest-history-diff-check/page.tsx 
- 后台程序 src/app/api/product/dataconf/bi-guest-history-diff-check/route.ts 
- SQL语句 md/sql_table/sql_bi-guest-history-diff-check.md 


- 前台页面 src/app/product/dataconf/bi-guest-history-diff-check/page.tsx 
- 后台程序 src/app/api/product/dataconf/bi-guest-history-diff-check/route.ts 
- 前端页面增加一个查询条件，用户勾选"仅查看有差异酒店"
- 有差异的标准是：
 - 如果 PMSType='Cambridge' 时，相差率取整后不等于6的记录是差异记录；
 - 如果 PMSType不等于'Cambridge' 时，相差率取整后大于0的记录是差异记录；


- 前台页面 src/app/product/dataconf/bi-guest-history-diff-check/page.tsx 
- 后台程序 src/app/api/product/dataconf/bi-guest-history-diff-check/route.ts 
- 前台页面的表格中，第一列“酒店代码”增加超链接，点击后跳转到 前台页面 src/app/product/dataconf/bi-guest-history-market-diff-check/page.tsx；
- 跳转时，需要附带传输参数："开始日期"和"结束日期"都是当前行的"日期","选择酒店"是"酒店代码"；
- 跳转到 src/app/product/dataconf/bi-guest-history-market-diff-check/page.tsx 页面后，系统根据传入的参数作为查询条件查出内容回显在表格中；



- 前台页面 src/app/product/dataconf/bi-guest-history-market-diff-check/page.tsx 
- 后台程序 src/app/api/product/dataconf/bi-guest-history-market-diff-check/route.ts 
- SQL语句 md/sql_table/sql_bi-guest-history-market-diff-check.md 



- 前台页面 src/app/product/dataconf/bi-guest-history-diff-check/page.tsx 
- 后台程序 src/app/api/product/dataconf/bi-guest-history-diff-check/route.ts 
- 前台页面的表格中，第一列“酒店代码”增加超链接，点击后跳转到 前台页面 src/app/product/dataconf/bi-guest-history-market-diff-check/page.tsx；
- 跳转时，需要附带传输参数："开始日期"和"结束日期"都是当前行的"日期","选择酒店"是"酒店代码"；
- 跳转到 src/app/product/dataconf/bi-guest-history-market-diff-check/page.tsx 页面后，系统根据传入的参数作为查询条件查出内容回显在表格中；

- 前台页面 src/app/product/dataconf/bi-guest-history-diff-check/page.tsx 
- 后台程序 src/app/api/product/dataconf/bi-guest-history-diff-check/route.ts 
- SQL语句 md/sql_table/sql_bi-guest-history-diff-check.md
- SQL语句有变化：
 - 房型金额差：BI房型金额 - CRS金额（保留两位小数）
 - 房型金额相差百分比：((BI房型金额 - CRS金额) / CRS金额) * 100（取整）



- 前台页面 src/app/product/hotels/room-types/page.tsx 
- 后台程序 src/app/api/product/hotels/room-types/route.ts 
- SQL语句 md/sql_table/sql_roomtype.md


- 前台页面 src/app/product/hotels/package-price/page.tsx 
- 后台程序 src/app/api/product/hotels/package-price/route.ts 
- SQL语句 md/sql_table/sql_package-price.md



- 前台页面 src/app/product/hotels/hotel-channels/page.tsx 
- 后台程序 src/app/api/product/hotels/hotel-channels/route.ts 
- SQL语句 md/sql_table/sql_hotel-channels.md



- 前台页面 src/app/product/order-management/hotel-guest-history-order/page.tsx 
- 后台程序 src/app/api/product/order-management/hotel-guest-history-order/route.ts
- SQL语句 md/sql_table/sql_hotel-guest-history-order.md




已执行内容记录
- 前台页面 src/app/product/report-analysis/business-data-monthly-report/page.tsx
- 后台程序 src/app/api/product/report-analysis/business-data-monthly-report/route.ts
- SQL语句 md/sql_table/business-data-monthly-report.sql

- 前台页面 src/app/product/report-analysis/business-data-monthly-report/page.tsx
- 后台程序 src/app/api/product/report-analysis/
- 前台页面的表格中增加第一行，作为所有符合查询条件的汇总数据（不是当前页的酒店范围，是所有符合查询条件的酒店范围）

- Frontend page: Created /src/app/product/yifei/channel-order/page.tsx
- Backend API: Created /src/app/api/product/yifei/channel-order/route.ts
- SQL file: Created /md/sql/product/yifei/channel-order.sql