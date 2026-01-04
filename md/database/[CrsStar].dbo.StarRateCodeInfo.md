# 房价码
## 表名
[CrsStar].dbo.StarRateCodeInfo
## 表结构
名称	值	值类型	#	类型	长度	标度	精度	非空	身份	默认	排序规则	描述
ID	[NULL]	[NULL]	1	bigint	8	[NULL]	19	TRUE	TRUE	[NULL]	[NULL]	[NULL]
HotelCode	[NULL]	[NULL]	2	varchar	10	[NULL]	[NULL]	TRUE	FALSE	[NULL]	Chinese_PRC_CI_AS	[NULL]
RateCode	[NULL]	[NULL]	3	varchar	10	[NULL]	[NULL]	TRUE	FALSE	[NULL]	Chinese_PRC_CI_AS	[NULL]
CateCode	[NULL]	[NULL]	4	varchar	10	[NULL]	[NULL]	TRUE	FALSE	[NULL]	Chinese_PRC_CI_AS	[NULL]
RateCodeName	[NULL]	[NULL]	5	varchar	500	[NULL]	[NULL]	TRUE	FALSE	[NULL]	Chinese_PRC_CI_AS	[NULL]
BeginDate	[NULL]	[NULL]	6	datetime	8	3	23	TRUE	FALSE	[NULL]	[NULL]	[NULL]
EndDate	[NULL]	[NULL]	7	datetime	8	3	23	TRUE	FALSE	[NULL]	[NULL]	[NULL]
MinLos	[NULL]	[NULL]	8	int	4	[NULL]	10	TRUE	FALSE	[NULL]	[NULL]	[NULL]
MaxLos	[NULL]	[NULL]	9	int	4	[NULL]	10	TRUE	FALSE	[NULL]	[NULL]	[NULL]
MinAdvBookin	[NULL]	[NULL]	10	int	4	[NULL]	10	TRUE	FALSE	[NULL]	[NULL]	[NULL]
MaxAdvBookin	[NULL]	[NULL]	11	int	4	[NULL]	10	TRUE	FALSE	[NULL]	[NULL]	[NULL]
Market	[NULL]	[NULL]	12	varchar	200	[NULL]	[NULL]	FALSE	FALSE	[NULL]	Chinese_PRC_CI_AS	[NULL]
Sources	[NULL]	[NULL]	13	varchar	200	[NULL]	[NULL]	FALSE	FALSE	[NULL]	Chinese_PRC_CI_AS	[NULL]
RoomTypeCode	[NULL]	[NULL]	14	varchar	500	[NULL]	[NULL]	TRUE	FALSE	[NULL]	Chinese_PRC_CI_AS	[NULL]
IsPrice	[NULL]	[NULL]	15	int	4	[NULL]	10	FALSE	FALSE	[NULL]	[NULL]	[NULL]
RateGroup	[NULL]	[NULL]	16	int	4	[NULL]	10	FALSE	FALSE	[NULL]	[NULL]	[NULL]
ShortInfo	[NULL]	[NULL]	17	varchar	500	[NULL]	[NULL]	FALSE	FALSE	[NULL]	Chinese_PRC_CI_AS	[NULL]
LongInfo	[NULL]	[NULL]	18	varchar	5000	[NULL]	[NULL]	FALSE	FALSE	[NULL]	Chinese_PRC_CI_AS	[NULL]
IsAllowDown	[NULL]	[NULL]	19	int	4	[NULL]	10	FALSE	FALSE	[NULL]	[NULL]	[NULL]
Sort	[NULL]	[NULL]	20	int	4	[NULL]	10	FALSE	FALSE	[NULL]	[NULL]	[NULL]
IsDelete	[NULL]	[NULL]	21	int	4	[NULL]	10	FALSE	FALSE	[NULL]	[NULL]	是否删除
RateGrouping	[NULL]	[NULL]	22	varchar	500	[NULL]	[NULL]	FALSE	FALSE	[NULL]	Chinese_PRC_CI_AS	[NULL]
HourNums	[NULL]	[NULL]	23	varchar	10	[NULL]	[NULL]	FALSE	FALSE	[NULL]	Chinese_PRC_CI_AS	[NULL]
CheckBeginDate	[NULL]	[NULL]	24	datetime	8	3	23	FALSE	FALSE	[NULL]	[NULL]	[NULL]
CheckEndDate	[NULL]	[NULL]	25	datetime	8	3	23	FALSE	FALSE	[NULL]	[NULL]	[NULL]
SLEnable	[NULL]	[NULL]	26	varchar	50	[NULL]	[NULL]	FALSE	FALSE	[NULL]	Chinese_PRC_CI_AS	[NULL]
RateCodeDisplayName	[NULL]	[NULL]	27	varchar	500	[NULL]	[NULL]	FALSE	FALSE	[NULL]	Chinese_PRC_CI_AS	[NULL]
XMSSyncSwitch	[NULL]	[NULL]	28	int	4	[NULL]	10	FALSE	FALSE	[NULL]	[NULL]	[NULL]
IsEnableDP	[NULL]	[NULL]	29	bit	1	[NULL]	1	FALSE	FALSE	0	[NULL]	[NULL]
IsCYPrice	[NULL]	[NULL]	30	bit	1	[NULL]	1	FALSE	FALSE	[NULL]	[NULL]	[NULL]
TypeCode	[NULL]	[NULL]	31	varchar	10	[NULL]	[NULL]	FALSE	FALSE	[NULL]	Chinese_PRC_CI_AS	[NULL]
RateCodeEnName	[NULL]	[NULL]	32	varchar	100	[NULL]	[NULL]	FALSE	FALSE	[NULL]	Chinese_PRC_CI_AS	[NULL]
Resflag	[NULL]	[NULL]	33	varchar	20	[NULL]	[NULL]	FALSE	FALSE	[NULL]	Chinese_PRC_CI_AS	[NULL]
Priv	[NULL]	[NULL]	34	varchar	10	[NULL]	[NULL]	FALSE	FALSE	[NULL]	Chinese_PRC_CI_AS	[NULL]
CheckInBeginTime	[NULL]	[NULL]	35	datetime	8	3	23	FALSE	FALSE	[NULL]	[NULL]	[NULL]
CheckInEndTime	[NULL]	[NULL]	36	datetime	8	3	23	FALSE	FALSE	[NULL]	[NULL]	[NULL]
CommissionCode	[NULL]	[NULL]	37	varchar	100	[NULL]	[NULL]	FALSE	FALSE	[NULL]	Chinese_PRC_CI_AS	[NULL]
IsMultiPrice	[NULL]	[NULL]	38	bit	1	[NULL]	1	FALSE	FALSE	[NULL]	[NULL]	[NULL]
RateCheck	[NULL]	[NULL]	39	bit	1	[NULL]	1	FALSE	FALSE	[NULL]	[NULL]	[NULL]
RateNote	[NULL]	[NULL]	40	nvarchar	100	[NULL]	[NULL]	FALSE	FALSE	[NULL]	Chinese_PRC_CI_AS	[NULL]
TeamNote	[NULL]	[NULL]	41	varchar	500	[NULL]	[NULL]	FALSE	FALSE	[NULL]	Chinese_PRC_CI_AS	[NULL]
TeamNoteEn	[NULL]	[NULL]	42	varchar	500	[NULL]	[NULL]	FALSE	FALSE	[NULL]	Chinese_PRC_CI_AS	[NULL]
BeginTime	[NULL]	[NULL]	43	varchar	10	[NULL]	[NULL]	FALSE	FALSE	[NULL]	Chinese_PRC_CI_AS	[NULL]
EndTime	[NULL]	[NULL]	44	varchar	10	[NULL]	[NULL]	FALSE	FALSE	[NULL]	Chinese_PRC_CI_AS	[NULL]
RateSecret	[NULL]	[NULL]	45	varchar	1	[NULL]	[NULL]	FALSE	FALSE	[NULL]	Chinese_PRC_CI_AS	[NULL]
WeekControl	[NULL]	[NULL]	46	varchar	20	[NULL]	[NULL]	FALSE	FALSE	[NULL]	Chinese_PRC_CI_AS	[NULL]
ContinuousWeekControl	[NULL]	[NULL]	47	varchar	20	[NULL]	[NULL]	FALSE	FALSE	[NULL]	Chinese_PRC_CI_AS	[NULL]
												


## 字段说明


## 表关联关系


## 关联查询示例
```sql

```