#管理房价码分组
##核心功能
- 在app/目录下创建 product/dataconf/ratecodegroup 子目录
- 在 product/dataconf/ratecodegroup/ 目录下创建默认首页page.tsx
- 在产品中心页面 app/product/page.tsx 中增加一个新的Panel "数据配置"
- 在产品中心页面 app/product/page.tsx 的 "数据配置" Panel中，增加一个菜单 "房价码分组" 
- 在产品中心页面 app/product/page.tsx 中的 "房价码分组" 增加路由到 product/dataconf/ratecodegroup/page.tsx 页面
- 页面标题: 数据配置-房价码分组
- 页面内容: 调用后端API，显示返回结果

##后端程序
- 在app/目录下创建 api/product/dataconf/ratecodegroup  子目录
- 创建后端API文件 app/api/product/dataconf/ratecodegroup/route.ts
- 在app/api/report/ratecode/checkpublish/route.ts文件中，调用数据库查询功能，以表格显示回显在 product/dataconf/ratecodegroup/page.tsx 页面

##查询用到的数据库表
- 主查询表： 房价码分组配置表 [CrsStar ].dbo.StarProducitonReportSetting
- 子查询表1： 房价码基础信息表 [CrsStar ].dbo.StarRateCodeInfo
- 子查询表2： 酒店基础信息表 [CrsStar ].dbo.StarHotelBaseInfo
- 主查询表 [CrsStar ].dbo.StarProducitonReportSetting 和子表关联时，只要符合条件的主表记录都需要返回，如果 HotelCode 为空，则该字段为空即可，但是StarProducitonReportSetting表中HotelCode为空的记录还是需要返回；

##页面展示内容
###查询条件
####查询条件包括：
- 酒店管理公司：枚举 多选
- 房价码：自查询 模糊查询 查询表 [CrsStar ].dbo.StarRateCodeInfo 显示房价码代码+空格+名称
- 市场码：自查询 模糊查询 查询表 [CrsStar ].dbo.SOP_StarMarketInfo_Brand 显示市场码代码+空格+名称

###数据展示表格
- 表格列包括：房价码组名称、房价码数量 点击弹出窗口显示房价码代码+名称的明细、市场码 点击显示名称、渠道码 点击显示名称、级别、酒店名称、品牌名称
- 表格第一列和第一行需要锁定
- 表格不需要分页
- 表格需要显示总条数


##枚举值定义
- GroupCode 酒店管理公司 枚举值
```
JG 建国
JL 京伦
NY 南苑
NH 云荟
NI 诺金
NU 诺岚
KP 凯宾斯基
YF 逸扉
WX 万信
```

- ChannelCode 渠道 枚举值
```
CTP 携程
MDI 美团
OBR 飞猪
CTM 商旅
WEB 官渠
```
