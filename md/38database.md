# 数据库连接
 - 数据库类型: SQL Server
 - URL: jdbc:sqlserver://;serverName=192.168.210.38;databaseName=master
 - 驱动类: om.microsoft.sqlserver.jdbc.SQLServerDriver
 - 连接主机: 192.168.210.38
 - 连接端口: 1433
 - 连接用户: CRS_admin    
 - 连接密码: Ruji@2019Ber10funf
 - 连接数据库：master
 - 连接池最大连接数: 100
 - 连接池最小连接数: 10
 - 连接池最大等待时间: 10000
 - 连接池最大等待时间: 10000

#表名和表结构
##酒店基础信息表： StarHotelBaseInfo
 - 表名: [CrsStar ].dbo.StarHotelBaseInfo
 - 表结构：
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


##房价码基础信息表： StarRateCodeInfo
 - 表名: [CrsStar ].dbo.StarRateCodeInfo
 - 表结构：
```
名称	类型	长度
ID	bigint	8
HotelCode	varchar	10
RateCode	varchar	10
CateCode	varchar	10
RateCodeName	varchar	500
BeginDate	datetime	8
EndDate	datetime	8
MinLos	int	4
MaxLos	int	4
MinAdvBookin	int	4
MaxAdvBookin	int	4
Market	varchar	200
Sources	varchar	200
RoomTypeCode	varchar	500
IsPrice	int	4
RateGroup	int	4
ShortInfo	varchar	500
LongInfo	varchar	5000
IsAllowDown	int	4
Sort	int	4
IsDelete	int	4
RateGrouping	varchar	500
HourNums	varchar	10
CheckBeginDate	datetime	8
CheckEndDate	datetime	8
SLEnable	varchar	50
RateCodeDisplayName	varchar	500
XMSSyncSwitch	int	4
IsEnableDP	bit	1
IsCYPrice	bit	1
TypeCode	varchar	10
RateCodeEnName	varchar	100
Resflag	varchar	20
Priv	varchar	10
CheckInBeginTime	datetime	8
CheckInEndTime	datetime	8
CommissionCode	varchar	100
IsMultiPrice	bit	1
RateCheck	bit	1
RateNote	nvarchar	100
TeamNote	varchar	500
TeamNoteEn	varchar	500
BeginTime	varchar	10
EndTime	varchar	10
RateSecret	varchar	1
WeekControl	varchar	20
ContinuousWeekControl	varchar	20
```


##房价码发布配置表： StarPublishRateCodeInfo
 - 表名: [CrsStar ].dbo.StarPublishRateCodeInfo
 - 表结构：
```
名称	类型	长度
ID	bigint	8
HotelCode	varchar	10
ChannelCode	varchar	50
RateCode	varchar	50
BeginDate	datetime	8
EndDate	datetime	8
PublishStatus	varchar	100
MemberClass	varchar	100
CreateDate	datetime	8
GuidValue	varchar	100
CommissionCode	varchar	100
ProtocolUnit	varchar	100
TeamNo	varchar	30
TeamStatus	int	4
LatestTime	varchar	10
MemberFlags	varchar	100
IsUnifyPublish	bit	1
```