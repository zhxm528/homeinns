# 渠道
## 表名
[CrsStar].dbo.SOP_StarChannelInfo_Brand
## 表结构
列名	#	类型	长度	标度	精度	非空	身份	默认	排序规则	描述
ID	1	bigint	8	[NULL]	19	TRUE	TRUE	[NULL]	[NULL]	[NULL]
ChannelCode	2	varchar	10	[NULL]	[NULL]	TRUE	FALSE	[NULL]	Chinese_PRC_CI_AS	[NULL]
ChannelName	3	varchar	100	[NULL]	[NULL]	TRUE	FALSE	[NULL]	Chinese_PRC_CI_AS	[NULL]
Sort	4	int	4	[NULL]	10	TRUE	FALSE	[NULL]	[NULL]	[NULL]
IsValid	5	int	4	[NULL]	10	FALSE	FALSE	[NULL]	[NULL]	[NULL]
IsDelete	6	int	4	[NULL]	10	FALSE	FALSE	[NULL]	[NULL]	[NULL]
ChannelName_EN	7	varchar	500	[NULL]	[NULL]	FALSE	FALSE	[NULL]	Chinese_PRC_CI_AS	[NULL]
UseOverBooking	8	int	4	[NULL]	10	FALSE	FALSE	[NULL]	[NULL]	[NULL]
BrandCode	9	varchar	10	[NULL]	[NULL]	TRUE	FALSE	[NULL]	Chinese_PRC_CI_AS	[NULL]
CheckPriceSwitch	10	int	4	[NULL]	10	TRUE	FALSE	1	[NULL]	[NULL]
ChannelCate	11	varchar	20	[NULL]	[NULL]	FALSE	FALSE	[NULL]	Chinese_PRC_CI_AS	[NULL]
InventoryMode	12	varchar	20	[NULL]	[NULL]	FALSE	FALSE	[NULL]	Chinese_PRC_CI_AS	[NULL]
IsIntegral	13	bit	1	[NULL]	1	FALSE	FALSE	[NULL]	[NULL]	[NULL]
ApplicableIdentity	14	varchar	200	[NULL]	[NULL]	FALSE	FALSE	[NULL]	Chinese_PRC_CI_AS	[NULL]
ApplicableIdentityValue	15	varchar	200	[NULL]	[NULL]	FALSE	FALSE	[NULL]	Chinese_PRC_CI_AS	[NULL]
OneLevelCode	16	varchar	10	[NULL]	[NULL]	FALSE	FALSE	[NULL]	Chinese_PRC_CI_AS	[NULL]
OneLevelName	17	varchar	50	[NULL]	[NULL]	FALSE	FALSE	[NULL]	Chinese_PRC_CI_AS	[NULL]
IsOffline	18	bit	1	[NULL]	1	FALSE	FALSE	[NULL]	[NULL]	[NULL]
FloatingVal	19	decimal	9	2	18	FALSE	FALSE	[NULL]	[NULL]	[NULL]
FloatingType	20	char	1	[NULL]	[NULL]	FALSE	FALSE	[NULL]	Chinese_PRC_CI_AS	[NULL]
CommissionModel	21	smallint	2	[NULL]	5	FALSE	FALSE	[NULL]	[NULL]	[NULL]


## 字段说明


## 表关联关系


## 关联查询示例
```sql

```