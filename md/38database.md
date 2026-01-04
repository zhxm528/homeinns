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


## 房价码基础信息表： StarRateCodeInfo
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

##订单表： MemberChildOrderRecord
 - 表名: [CrsStar ].dbo.MemberChildOrderRecord
 - 表结构：
```
列名	类型	长度
Id	int	4
MemberName	nvarchar	60
MemberSourceType	varchar	50
IdNo	varchar	30
Res_Account	varchar	100
PMSOrderNo	varchar	100
Res_Id	varchar	50
ArrDate	datetime	8
DepDate	datetime	8
RoomNightNum	decimal	9
AgentCd	varchar	50
PayType	varchar	50
RoomCode	varchar	50
RateCode	varchar	50
RoomCost	decimal	9
RepastCost	decimal	9
OtherCost	decimal	9
TotalCost	decimal	9
Marketplace	varchar	255
RoomNum	varchar	50
Remark	varchar	255
GuestsNum	int	4
CreateDate	datetime	8
CreateBy	varchar	50
IsDel	bit	1
IsSend	bit	1
FolioNo	varchar	50
FolioType	varchar	50
HotelCd	varchar	50
Rooms	int	4
Rate	decimal	9
MemberCardId	varchar	50
MemberCardType	varchar	50
MemberCardLevel	varchar	50
SendCount	int	4
OperType	varchar	50
OrderType	varchar	50
Oper	varchar	50
ParentOrderNo	varchar	100
Src	varchar	100
CyNo	varchar	50
UpdateTime	datetime	8
cusno_des	varchar	500
source_des	varchar	500
agent_des	varchar	500
cusno	varchar	200
source_no	varchar	200
agent	varchar	200
sta	varchar	50
cohabitantId	varchar	50
rsvClass	varchar	5
rsvDatetime	datetime	8
```
##订单每日明细表： MemberChildOrderRecordDailyRate
 - 表名: [CrsStar ].dbo.MemberChildOrderRecordDailyRate
 - 表结构：
```
列名	类型	长度
Id	int	4
OrderNo	varchar	50
PMSOrderNo	varchar	50
ParentOrderNo	varchar	50
RoomCost	decimal	9
RepastCost	decimal	9
OtherCost	decimal	9
TotalCost	decimal	9
CreateName	varchar	50
CreateDate	datetime	8
DailyDate	datetime	8
RoomNightNum	decimal	9
OrRoomNightNum	decimal	9
XFRoomCost	decimal	9
```


##每日经营按酒店统计表： bi_ttl
 - 表名: [192.168.210.170].[Report ].dbo.bi_ttl
 - 表结构：
```
列名	类型	长度
bdate	datetime	8
cdate	datetime	8
hotelid	varchar	10
class	varchar	50
descript1	varchar	50
rms_ttl	decimal	9
rms_occ	decimal	9
rms_oos	decimal	9
rms_ooo	decimal	9
rms_htl	decimal	9
rms_avl	decimal	9
rms_dus	decimal	9
rev_rm	money	8
rev_fb	money	8
rev_ot	decimal	9
avg_rt	money	8
urc_num	decimal	9
fbd_num	decimal	9
createtime	datetime	8
```


##每日经营按收费项统计表： bi_htlrev
 - 表名: [192.168.210.170].[Report ].dbo.bi_htlrev
 - 表结构：
```
列名	类型	长度
bdate	datetime	8
cdate	datetime	8
hotelid	varchar	10
dept	varchar	50
deptname	varchar	50
class	varchar	50
descript	varchar	100
class1	varchar	50
descript1	varchar	100
amount	money	8
rebate	money	8
createtime	datetime	8
```

##每日经营按市场细分统计表： bi_mkt
 - 表名: [192.168.210.170].[Report ].dbo.bi_mkt
 - 表结构：
 ```
 列名	类型	长度
bdate	datetime	8
cdate	datetime	8
hotelid	varchar	10
class	varchar	50
descript1	varchar	50
rms_occ	decimal	9
rev_rm	money	8
avg_rt	money	8
createtime	datetime	8
 ```

 ##每日经营按渠道细分统计表： bi_channel
 - 表名: [192.168.210.170].[Report ].dbo.bi_channel
 - 表结构：
 ```
 列名	类型	长度
bdate	datetime	8
cdate	datetime	8
hotelid	varchar	10
class	varchar	50
descript1	varchar	50
rms_occ	decimal	9
rev_rm	money	8
createtime	datetime	8
 ```

  ##每日经营按渠道细分统计表： bi_rmtype
 - 表名: [192.168.210.170].[Report ].dbo.bi_rmtype
 - 表结构：
 ```
 列名	类型	长度
bdate	datetime	8
cdate	datetime	8
hotelid	varchar	10
gclass	varchar	50
gdescript	varchar	50
class	varchar	10
descript1	varchar	50
rms_ttl	decimal	9
rms_occ	decimal	9
rms_oos	decimal	9
rms_ooo	decimal	9
rms_htl	decimal	9
rms_avl	decimal	9
guests	int	4
rev_rm	money	8
avg_rt	money	8
createtime	datetime	8
 ```

  ##每日经营房价码细分表 StarProducitonReportData
 - 表名: [CrsStar ].dbo.StarProducitonReportData
 - 表结构：
 ```
 名称	类型	长度
ID	bigint	8
BrandCode	varchar	10
HotelCode	varchar	10
Date	date	3
HotelName	varchar	100
MarketCode	varchar	50
MarketName	varchar	100
RateCode	varchar	50
RateCodeName	varchar	100
RoomNights	int	4
RoomRevenue	decimal	9
RoomNetRevenue	decimal	9
MealRevenue	decimal	9
MealNetRevenue	decimal	9
TotelRevenue	decimal	9
NetTotelRevenue	decimal	9
IsPMS	bit	1
IsCY	bit	1
IsShowOn	bit	1
CreateTime	datetime	8
 ```


  ##房价码分组配置表： StarProducitonReportSetting
 - 表名: [CrsStar ].dbo.StarProducitonReportSetting
 - 表结构：
 ```
列名	类型	长度
ID	int	4
BrandCode	varchar	10
ColumnName	varchar	50
ColumnPosition	int	4
ResvTypeEqual	varchar	100
ResvTypeUnEqual	varchar	100
AgentCdEqual	varchar	100
AgentCdUnEqual	varchar	100
RateCodeEqual	varchar	500
RateCodeUnEqual	varchar	500
HotelCode	varchar	10
 ```


 ##市场细分代码表： SOP_StarMarketInfo_Brand
 - 表名: [CrsStar ].dbo.SOP_StarMarketInfo_Brand
 - 表结构：
 ```
列名	类型	长度
MarketCode	varchar	10
MarketName	varchar	100
CodeCd	varchar	10
IsValid	int	4
IsDelete	int	4
CodeName	nvarchar	50
BrandCode	varchar	10
 ```


 ##房型信息表：
 - 表名: [CrsStar ].dbo.StarRoomInfo
 - 表结构：
 ```
 名称	类型	长度
ID	bigint	8
HotelCode	varchar	10
RoomTypeClass	varchar	10
RoomTypeCode	varchar	10
RoomTypeName	varchar	200
Number	int	4
MaxNumber	int	4
Area	decimal	9
Sort	int	4
Facilities	varchar	2000
Describe	varchar	2000
IsValid	int	4
IsDelete	int	4
IsHaveWindows	int	4
IsHaveSmoke	int	4
IsAddBed	int	4
Remarks	varchar	500
ModifyBy	varchar	50
ModifyTime	datetime	8
IsMainRoom	bit	1
RoomTypeNameEn	varchar	200
DescribeEn	varchar	2000
 ```

 ##渠道信息表：
 - 表名: [CrsStar ].dbo.SOP_StarChannelInfo_Brand
 - 表结构：
 ```
 列名	类型	长度
ID	bigint	8
ChannelCode	varchar	10
ChannelName	varchar	100
Sort	int	4
IsValid	int	4
IsDelete	int	4
ChannelName_EN	varchar	500
UseOverBooking	int	4
BrandCode	varchar	10
CheckPriceSwitch	int	4
ChannelCate	varchar	20
InventoryMode	varchar	20
IsIntegral	bit	1
ApplicableIdentity	varchar	200
ApplicableIdentityValue	varchar	200
OneLevelCode	varchar	10
OneLevelName	varchar	50
IsOffline	bit	1
FloatingVal	decimal	9
FloatingType	char	1

 ```


 ##包价信息表：
 - 表名: [CrsStar ].dbo.StarPackageInfo
 - 表结构：
 ```
 列名	类型	长度
PackageCode	varchar	10
HotelCode	varchar	50
PackageName	varchar	500
PackageClass	varchar	100
PackageType	varchar	40
Nums	int	4
ThrowWay	varchar	40
Calculation	varchar	40
Separate	int	4
Sort	int	4
ShortInfo	varchar	500
LongInfo	varchar	5000
CreateTime	datetime	8
UserId	varchar	100
IsValid	int	4
IsDelete	int	4
PackagePrice	decimal	9

 ```


 ##渠道订单表：
 - 表名: [CrsStar ].dbo.View_StarOrderRoom_All
 - 表结构：
 ```
 列名	类型	长度
OrderNo	varchar	50
HotelCd	varchar	50
AgentCd	varchar	50
ResvType	varchar	50
HotelName	varchar	50
ArrDate	datetime	8
DepDate	datetime	8
RoomTypeCode	varchar	50
RoomTypeName	varchar	500
RoomNum	int	4
ActualRt	decimal	9
PayCd	varchar	50
MemberType	varchar	50
MemberNo	varchar	50
ModiFlg	varchar	50
GustNm	varchar	500
MobileTel	varchar	50
CRSResvDate	datetime	8
Note	varchar	1000
EditDate	datetime	8
Opr	varchar	50
TotalXf	decimal	9
RateCode	varchar	50
CrsStatus	varchar	50
MustPayMoney	decimal	9
IsPrepay	int	4
ActCd	varchar	50
AdultNum	int	4
ChildNum	int	4
ResStatus	varchar	20
CrsOrderType	varchar	10
Sex	bit	1
Email	varchar	100
ModifyOrderStatus	varchar	50
MemberSource	varchar	50
OldNote	varchar	1000
Tunnel	varchar	50
PayEnterpriseId	varchar	20
PMSAccnt	varchar	50

 ```