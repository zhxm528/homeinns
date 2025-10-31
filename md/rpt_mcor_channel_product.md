#渠道产量报表
##前端程序
- 创建 渠道产量报表 app/report/channel/productreport/page.tsx 页面
- 在产品中心页面 app/product/page.tsx 的 "订单管理" 面板中，增加一个菜单 "渠道产量" ，同时增加路由到 app/report/channel/productreport/page.tsx 渠道产量报表 页面
- 页面标题: 渠道产量报表
- 页面内容: 调用后端API，显示返回结果

##后端程序
- 创建 app/api/report/channel/productreport/route.ts 渠道产量报表 后台程序
- 在 渠道产量报表 后台程序中，调用数据库查询功能，查询结果回显在 渠道产量报表 页面

##查询用到的数据库表
- 主查询表： [CrsStar ].dbo.MemberChildOrderRecord
- 子查询表1： [CrsStar ].dbo.StarRateCodeInfo
- 子查询表2： [CrsStar ].dbo.StarHotelBaseInfo

##查询条件
- AgentCd 渠道代码
- HotelCd
- Marketplace

##查询项
- 酒店代码
- 酒店名称
- 渠道代码
- 渠道名称
- 


##渠道代码的枚举
```
RES	酒店直接预订
WKI	酒店前台上门散客
GDS	全球预定系统
TSY	中航信直连
WEB	C3官方网站
WNY	官方网站-首旅南苑
WJG	官方网站-首旅建国
WJL	官方网站-首旅京伦
WXY	官方网站-欣燕都连锁
WYJ	官方网站-雅客怡家
WHS	官方网站-首旅寒舍
BTG	集团订房中心
OTA	国外旅行社
DTA	国内旅行社
BSH	集团酒店之间的销售
CTI	第三方网络预订
APP	移动客户端
WAT	C3首享会小程序
OBR	首旅酒店集团官方旗舰店
WG	酒店网关
MSJ	集团大客户直连
CTP C3携程直连
MDI	C3新美大直连
COL	畅联
ZKT	直客通
JD	C3京东直连
SHK	首旅慧科
WXS	建国小程序
DOU	抖音直连
OBF	首享会飞猪旗舰店
CTM	C3首酒大客户直连
```