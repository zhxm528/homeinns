#逸扉运营报表
##前端程序
- 在产品中心页面 app/product/page.tsx 的 "订单管理" 面板中，增加4个菜单： 
  - 渠道预订周期统计表 增加路由 app/report/uc/bms/channelresv/page.tsx
  - 国家月统计报表 增加路由 app/report/uc/bms/countrymonth/page.tsx
  - 销售分析(房型)报表  增加路由 app/report/uc/bms/roomtype/page.tsx
  - 自助机使用统计报表  增加路由 app/report/uc/bms/selfservice/page.tsx

##后端程序
- 渠道预订周期统计表 app/api/report/uc/bms/channelresv/route.ts 
- 国家月统计报表 app/api/report/uc/bms/countrymonth/route.ts 
- 销售分析(房型)报表 app/api/report/uc/bms/roomtype/route.ts 
- 自助机使用统计报表 app/api/report/uc/bms/selfservice/route.ts 

##查询条件
- 4张报表查询条件统一
- 开始日期 yyyy-MM-dd
- 结束日期 yyyy-MM-dd
- 大区 多选 默认为空
- 城区 多选 默认为空
- 城市 多选 默认为空
- 酒店 单选 默认为空 支持自查询

##查询项
###渠道预订周期统计表
- 酒店	
- 未提前间夜数	
- 未提前间夜占比	
- 提前1天间夜数	
- 提前1天间夜占比	
- 提前2天间夜数	
- 提前2天间夜占比	
- 提前3天间夜数	
- 提前3天间夜占比	
- 提前4天间夜数	
- 提前4天间夜占比	
- 提前5天间夜数	
- 提前5天间夜占比	
- 提前6天间夜数	
- 提前6天间夜占比	
- 提前7天及以上间夜数	
- 提前7天及以上间夜占比


###国家月统计报表

###销售分析(房型)报表

###自助机使用统计报表
