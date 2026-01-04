#查询酒店的搜索条件
本规则定义酒店查询的标准条件，这些条件适用于需要查询酒店即列表中有酒店一列的表格查询条件。
##查询条件定义
- 酒店代码：支持模糊查询、支持自查询，使用 Ant Design Select 组件，即下拉框Select组件，"酒店代码的自查询"是指，支持框中输入字符串，根据字符串可以从所有酒店代码列表中联想出下拉框中可以查到的酒店代码；
- 酒店名称：支持模糊查询、支持自查询，使用 Ant Design Select 组件，即下拉框Select组件，"酒店名称的自查询"是指，支持框中输入字符串，根据字符串可以从所有酒店名称列表中联想出下拉框中可以查到的酒店名称；
- 管理公司：支持模糊查询、支持自查询，支持多选，使用 Ant Design Select 组件，即下拉框Select组件（注意不用checkbox而是用select）；
- 产权类型：支持模糊查询、支持自查询，支持多选，使用 Ant Design Select 组件，即下拉框Select组件（注意不用checkbox而是用select）；
- PMS类型：支持模糊查询、支持自查询，支持多选，使用 Ant Design Select 组件，即下拉框Select组件（注意不用checkbox而是用select）；
- 大区：支持模糊查询、支持自查询，支持多选，使用 Ant Design Select 组件，即下拉框Select组件（注意不用checkbox而是用select）；
- 城区：支持模糊查询、支持自查询，支持多选，使用 Ant Design Select 组件，即下拉框Select组件（注意不用checkbox而是用select）；
- 城市：支持模糊查询、支持自查询，支持多选，使用 Ant Design Select 组件，即下拉框Select组件（注意不用checkbox而是用select）；
##按钮样式
- 按钮都需要使用 Ant Design Button 组件
##查询条件的枚举值
- HotelType 酒店类型的枚举值
枚举值
```
H002 托管
H003 加盟
H004 直营/全委
```

- PropertyType 产权类型的枚举值
枚举值
```
BZ 北展
FCQD 非产权店
SJJT 首酒集团
SLJT 首旅集团
SLZY 首旅置业
SFT 首副通
```

- PMSType PMS类型的枚举值
枚举值
```
Cambridge 康桥
Opera 手工填报
P3 如家P3
Soft 软连接
X6 西软X6
XMS 西软XMS
```


- GroupCode 管理公司的枚举值
枚举值
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

- Status 状态的枚举
枚举值
```
1 启用
0 停用
空或者null 全部
枚举值
```
- IsDelete 是否删除标记的枚举值
```
1 已删除
0 正常
空或者null 全部
枚举值
```
##查询列
```
HotelCode 酒店编号
HotelName 酒店名称
GroupCode 管理公司 需要用枚举值转换显示
HotelType 酒店类型 需要用枚举值转换显示
PropertyType 产权类型 需要用枚举值转换显示
PMSType PMS类型 需要用枚举值转换显示
Area 大区
UrbanArea 城区
MDMProvince 省份
MDMCity 城市
Status 状态
IsDelete 是否删除
```

##酒店表表名
- 表名： [CrsStar ].dbo.StarHotelBaseInfo
##酒店表表结构
```
名称	类型	长度
ID	bigint	8
HotelCode	varchar	10
HotelName	varchar	500
HotelENName	varchar	500
HotelLangName	varchar	500
HotelType	varchar	40
HotelStar	varchar	40
GroupCode	varchar	40
HotelAddress	varchar	1000
ShortHotelAddress	varchar	500
HotelEnAddress	varchar	1000
PostCode	varchar	100
MobilePhone	varchar	100
Phone	varchar	100
Email	varchar	100
Fax	varchar	100
LandMark	varchar	1000
Catering	varchar	-1
Banquet	varchar	-1
Prompt	varchar	-1
HotelFeatures	varchar	-1
BusinessArea	varchar	5000
HotelArea	decimal	9
MeetingRoomArea	decimal	9
TheBanquetArea	decimal	9
AllRoomNums	int	4
UseMoney	int	4
Status	int	4
NearbyHotel	varchar	5000
HotelKeyword	varchar	5000
Describe	varchar	-1
Remarks	varchar	-1
CreateDate	datetime	8
Sort	int	4
IsDelete	int	4
OpenDate	datetime	8
PMSType	nvarchar	50
RestaurantResvEmail	nvarchar	50
BanquetResvEmail	nvarchar	50
ResvClass	varchar	20
ContractNo	varchar	500
DisplayStatus	int	4
AdminCode	varchar	50
PresaleDate	datetime	8
OpeningDate	datetime	8
OverBookStatus	smallint	2
SalesId	varchar	50
RateCodeSwitch	varchar	100
RoomTypeSwitch	varchar	100
BestPriceExclusion	bit	1
Area	nvarchar	50
UrbanArea	nvarchar	50
HotelBrand	nvarchar	50
HotelStatusStartDate	datetime	8
ClosingDate	datetime	8
MDMProvince	nvarchar	50
MDMCity	nvarchar	50
HotelMinPrice	decimal	9
DefaultOpenSale	bit	1
DefaultRollPriceStock	bit	1
DescribeEn	varchar	-1
GuaranteedPrice	decimal	9
BestPriceVocChannelMode	bit	1
PropertyType	varchar	20

```
##查询酒店的SQL语句
- 使用支持酒店代码和酒店名称下拉框选项查询用
sql
``` 
SELECT
    h.HotelCode AS 酒店编号,
    h.HotelName AS 酒店名称,
    h.GroupCode AS 管理公司,
    h.HotelType AS 酒店类型,
    h.PropertyType AS 产权类型,
    h.PMSType AS PMS类型,
    h.Area AS 大区,
    h.UrbanArea AS 城区,
    h.MDMProvince AS 省份,
    h.MDMCity AS 城市,
    h.Status AS 状态,
    h.IsDelete AS 是否删除
FROM [CrsStar].dbo.StarHotelBaseInfo h
ORDER BY h.HotelCode;
```
