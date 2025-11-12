#房价码自定义组产量报表
##核心功能
- 在app/目录下创建 report/ratecode/productreport 子目录
- 在app/report/ratecode/productreport/目录下创建默认首页page.tsx
- 在产品中心页面 app/product/page.tsx 中的 "报表分析"下增加"房价码产量报表" 并且设置路由到 app/report/ratecode/productreport/目录下 page.tsx 页面
- 页面标题: 房价码产量报表
- 页面内容: 调用后端API，显示返回结果
##后端程序
- 创建后端API 文件 app/api/report/ratecode/productreport/route.ts
- 在app/api/report/ratecode/productreport/route.ts文件中，调用数据库查询功能

##页面展示内容
- 页面内容用表格形式展示，不需要分页，第一行和第一列需要锁定；
- 列名：房价码组名称、房价码、渠道、间夜数、客房收入、平均房价
- 表格上方为查询条件：
 - 指定日期段查询日期 格式为yyyy-mm-dd，默认为近30天
 - 房价码列表 格式为逗号隔开的字符串，默认为空
 - 发布渠道列表 下拉框 多选，默认为空
 - 管理公司列表 管理公司列表 checkbox 多选 默认为空
 - 酒店PMS类型 下拉框 checkbox 多选
 - 酒店产权类型 下拉框 checkbox 多选
 - 状态列表 状态列表 格式为枚举值 1或0，默认为1
 - 是否删除列表 是否删除列表 格式为枚举值 1或0，默认为0
 - 酒店列表 下拉框自查询 单选酒店 默认为空
- 点击房价码数量弹出窗口显示具体房价码代码和房价码名称
- 点击渠道数量弹出窗口显示具体渠道代码和渠道名称

- 渠道的枚举为
```
 - CTP 携程
 - MDI 美团
 - OBR 飞猪
 - CTM 商旅
 - WEB 官渠
 ```

 - PropertyType 产权类型的枚举
```
BZ 北展
FCQD 非产权店
SJJT 首酒集团
SLJT 首旅集团
SLZY 首旅置业
```

- PMSType PMS类型的枚举
```
Cambridge 康桥
Opera 手工填报
P3 如家P3
Soft 软连接
X6 西软X6
XMS 西软XMS
```
- 页面右上角和右下角添加 返回 按钮 支持返回到 app/product/page.tsx 页面

##实现酒店列表控件的自查询功能
- 前端查询条件中，酒店列表控件的自查询功能
- 后端实现支持 酒店编号 HotelCode 和 酒店名称 HotelName 的模糊查询
- 查询表 [CrsStar].dbo.StarHotelBaseInfo
- 查询条件的参数包括：PropertyType 产权类型的枚举、PMSType PMS类型的枚举、GroupCode管理公司枚举
- 查询条件自动获取页面用户选择的PropertyType、PMSType、GroupCode

