# 执行任务说明
- "以下任务为需要执行的任务："以下，"以下任务为已经执行，请忽略，不需要执行的任务："以上的任务执行
- "以下任务为已经执行，请忽略，不需要执行的任务："以下的任务不执行
## 以下任务为需要执行的任务：
- 修改：房价码页面 http://localhost:3000/crs/rate/code
- 数据库查询用到的表参考：md\database\crs\hotel_rate_code.sql
- 页面布局：查询条件+列表
- 查询条件包括：管理公司 GroupCode、酒店编码 HotelCode、酒店名称 HotelName、房价码代码 RateCode、房价码名称 RateCodeName、有效期 BeginDate - EndDate、提前预订限制 MinAdvBookin - MaxAdvBookin 、连住限制 MinLos - MaxLos、市场码 Market、房型 RoomTypeCode、团队码 BlockCode、限时售卖 BeginTime - EndTime、佣金码 CommissionCode、
- 固定的查询条件 IsDelete=0
- 列表列同查询条件
- 数据库链接读取 src\lib\38\config.ts
- 表格上方设计一个“数据看板”的板块，根据表格的列设计6个比较常用的统计看板，选用echart组件；


- http://localhost:3000/crs/rate/publish 创建页面和相关的后台程序，查询 star_publish_rate_code_info 表
- 数据库查询用到的表参考：md\database\crs\hotel_rate_publish (StarPublishRateCodeInfo).sql
- 页面布局：面包屑+查询条件+列表
- 查询条件包括：管理公司 GroupCode、酒店编码 HotelCode、酒店名称 HotelName、渠道代码 channel_code、房价码 rate_code、有效期 begin_date - end_date
- 固定的查询条件 IsDelete=0
- 列表列同查询条件
- 数据库链接读取 src\lib\38\config.ts
- 表格上方设计一个“数据看板”的板块，根据表格的列设计6个比较常用的统计看板，选用echart组件；

## 以下任务为已经执行，请忽略，不需要执行的任务：

