# 房价码是否在渠道发布
## 表名
[CrsStar].dbo.StarPublishRateCodeInfo
## 表结构
名称	值	值类型	#	类型	长度	标度	精度	非空	身份	默认	排序规则	描述
ID	[NULL]	[NULL]	1	bigint	8	[NULL]	19	TRUE	TRUE	[NULL]	[NULL]	[NULL]
HotelCode	[NULL]	[NULL]	2	varchar	10	[NULL]	[NULL]	TRUE	FALSE	[NULL]	Chinese_PRC_CI_AS	[NULL]
ChannelCode	[NULL]	[NULL]	3	varchar	50	[NULL]	[NULL]	FALSE	FALSE	[NULL]	Chinese_PRC_CI_AS	[NULL]
RateCode	[NULL]	[NULL]	4	varchar	50	[NULL]	[NULL]	FALSE	FALSE	[NULL]	Chinese_PRC_CI_AS	[NULL]
BeginDate	[NULL]	[NULL]	5	datetime	8	3	23	FALSE	FALSE	[NULL]	[NULL]	[NULL]
EndDate	[NULL]	[NULL]	6	datetime	8	3	23	FALSE	FALSE	[NULL]	[NULL]	[NULL]
PublishStatus	[NULL]	[NULL]	7	varchar	100	[NULL]	[NULL]	FALSE	FALSE	[NULL]	Chinese_PRC_CI_AS	发布房价针对身份:1，协议客户；2，会员；3，散客；4，团队
MemberClass	[NULL]	[NULL]	8	varchar	100	[NULL]	[NULL]	FALSE	FALSE	[NULL]	Chinese_PRC_CI_AS	[NULL]
CreateDate	[NULL]	[NULL]	9	datetime	8	3	23	FALSE	FALSE	[NULL]	[NULL]	[NULL]
GuidValue	[NULL]	[NULL]	10	varchar	100	[NULL]	[NULL]	FALSE	FALSE	[NULL]	Chinese_PRC_CI_AS	[NULL]
CommissionCode	[NULL]	[NULL]	11	varchar	100	[NULL]	[NULL]	FALSE	FALSE	[NULL]	Chinese_PRC_CI_AS	[NULL]
ProtocolUnit	[NULL]	[NULL]	12	varchar	100	[NULL]	[NULL]	FALSE	FALSE	[NULL]	Chinese_PRC_CI_AS	[NULL]
TeamNo	[NULL]	[NULL]	13	varchar	30	[NULL]	[NULL]	FALSE	FALSE	[NULL]	Chinese_PRC_CI_AS	[NULL]
TeamStatus	[NULL]	[NULL]	14	int	4	[NULL]	10	FALSE	FALSE	[NULL]	[NULL]	[NULL]
LatestTime	[NULL]	[NULL]	15	varchar	10	[NULL]	[NULL]	FALSE	FALSE	[NULL]	Chinese_PRC_CI_AS	[NULL]
MemberFlags	[NULL]	[NULL]	16	varchar	100	[NULL]	[NULL]	FALSE	FALSE	[NULL]	Chinese_PRC_CI_AS	[NULL]
IsUnifyPublish	[NULL]	[NULL]	17	bit	1	[NULL]	1	FALSE	FALSE	[NULL]	[NULL]	[NULL]


## 字段说明


## 表关联关系


## 关联查询示例
```sql

```

