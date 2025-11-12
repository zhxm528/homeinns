#执行操作说明
##待执行任务，需要执行以下内容：
###bi-guest-history-diff-check
- 前台页面 src/app/product/business-analysis/daily-report/page.tsx 
- 后台程序 src/app/api/product/business-analysis/daily-report/route.ts 
- SQL语句 md/sql_table/sql_daily-report.md 

##需要用到的其他规则文件
- 前台页面执行规则 md/sql_table/sql_table_app.md 
- 后台程序执行规则 md/sql_table/sql_table_api.md 





##已执行任务，忽略以下内容：
- 忽略内容开始
```
###channel-trial-order-rate
- 前台页面 src/app/product/report-analysis/channel-trial-order-rate/page.tsx 
- 后台程序 src/app/api/product/report-analysis/channel-trial-order-rate/route.ts 
- SQL语句 md/sql_table/sql_channel-trial-order-rate.md 
- 前台页面执行规则 md/sql_table/sql_table_app.md 
- 后台程序执行规则 md/sql_table/sql_table_api.md 
### channel-trial-order-rate 增加echart
- 修改前台页面 src/app/product/report-analysis/channel-trial-order-rate/page.tsx 增加一个echart图表
- 图表的横向坐标是日期，纵向坐标是百分比
- 图表中有两个折线图：试单成功率、下单成功率
###channel-trial-order-rate 修改 渠道代码 下拉选择的枚举值
- 修改前台页面 src/app/product/report-analysis/channel-trial-order-rate/page.tsx 修改查询条件中，"渠道代码"下拉选择的枚举值
- 枚举值：HYATT - 凯悦； CHAGDA - Agoda；CHMTTG - 美团；UCW - 逸扉小程序；CHFZLX - 飞猪；CHCTRP - 携程；UCC - 逸扉万信商旅小程序；CHDYRL - 抖音；CTM - 商旅大客户；800333 - 官网；CHDBBK - Booking；CHZKTS - 首享会；

###account-config-check
- 前台页面 src/app/product/dataconf/account-config-check/page.tsx 
- 后台程序 src/app/api/product/dataconf/account-config-check/route.ts 
- SQL语句 md/sql_table/sql_account-config-check.md 
- 前台页面执行规则 md/sql_table/sql_table_app.md 
- 后台程序执行规则 md/sql_table/sql_table_api.md 

###bi-guest-history-diff-check
- 前台页面 src/app/product/dataconf/bi-guest-history-diff-check/page.tsx 
- 后台程序 src/app/api/product/dataconf/bi-guest-history-diff-check/route.ts 
- SQL语句 md/sql_table/sql_bi-guest-history-diff-check.md 

###bi-guest-history-diff-check
- 前台页面 src/app/product/dataconf/bi-guest-history-diff-check/page.tsx 
- 后台程序 src/app/api/product/dataconf/bi-guest-history-diff-check/route.ts 
- 前端页面增加一个查询条件，用户勾选"仅查看有差异酒店"
- 有差异的标准是：
 - 如果 PMSType='Cambridge' 时，相差率取整后不等于6的记录是差异记录；
 - 如果 PMSType不等于'Cambridge' 时，相差率取整后大于0的记录是差异记录；

 ###bi-guest-history-diff-check
- 前台页面 src/app/product/dataconf/bi-guest-history-diff-check/page.tsx 
- 后台程序 src/app/api/product/dataconf/bi-guest-history-diff-check/route.ts 
- 前台页面的表格中，第一列“酒店代码”增加超链接，点击后跳转到 前台页面 src/app/product/dataconf/bi-guest-history-market-diff-check/page.tsx；
- 跳转时，需要附带传输参数："开始日期"和"结束日期"都是当前行的"日期","选择酒店"是"酒店代码"；
- 跳转到 src/app/product/dataconf/bi-guest-history-market-diff-check/page.tsx 页面后，系统根据传入的参数作为查询条件查出内容回显在表格中；


 ###bi-guest-history-market-diff-check
- 前台页面 src/app/product/dataconf/bi-guest-history-market-diff-check/page.tsx 
- 后台程序 src/app/api/product/dataconf/bi-guest-history-market-diff-check/route.ts 
- SQL语句 md/sql_table/sql_bi-guest-history-market-diff-check.md 


###bi-guest-history-diff-check
- 前台页面 src/app/product/dataconf/bi-guest-history-diff-check/page.tsx 
- 后台程序 src/app/api/product/dataconf/bi-guest-history-diff-check/route.ts 
- 前台页面的表格中，第一列“酒店代码”增加超链接，点击后跳转到 前台页面 src/app/product/dataconf/bi-guest-history-market-diff-check/page.tsx；
- 跳转时，需要附带传输参数："开始日期"和"结束日期"都是当前行的"日期","选择酒店"是"酒店代码"；
- 跳转到 src/app/product/dataconf/bi-guest-history-market-diff-check/page.tsx 页面后，系统根据传入的参数作为查询条件查出内容回显在表格中；

 
```
- 忽略内容结束




