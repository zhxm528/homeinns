# 经营分析酒店日报每日消费明细表
## 表名
[192.168.210.170].[Report].dbo.bi_htlrev
## 表结构
列名	#	类型	长度	标度	精度	非空	身份	默认	排序规则	描述
bdate	1	datetime	8	3	23	true	false	[NULL]	[NULL]	[NULL]
cdate	2	datetime	8	3	23	false	false	[NULL]	[NULL]	[NULL]
hotelid	3	varchar	10	[NULL]	[NULL]	true	false	[NULL]	Chinese_PRC_CI_AS	[NULL]
dept	4	varchar	50	[NULL]	[NULL]	true	false	[NULL]	Chinese_PRC_CI_AS	[NULL]
deptname	5	varchar	50	[NULL]	[NULL]	false	false	[NULL]	Chinese_PRC_CI_AS	[NULL]
class	6	varchar	50	[NULL]	[NULL]	true	false	[NULL]	Chinese_PRC_CI_AS	[NULL]
descript	7	varchar	100	[NULL]	[NULL]	false	false	[NULL]	Chinese_PRC_CI_AS	[NULL]
class1	8	varchar	50	[NULL]	[NULL]	true	false	[NULL]	Chinese_PRC_CI_AS	[NULL]
descript1	9	varchar	100	[NULL]	[NULL]	false	false	[NULL]	Chinese_PRC_CI_AS	[NULL]
amount	10	money	8	4	19	false	false	[NULL]	[NULL]	[NULL]
rebate	11	money	8	4	19	false	false	[NULL]	[NULL]	[NULL]
createtime	12	datetime	8	3	23	false	false	[NULL]	[NULL]	[NULL]

## 字段说明
- bdate: 业务日期，表示数据是哪一天的数据
- cdate: 数据接收的日期，暂不使用
- hotelid: 酒店代码，表示数据是这家酒店的数据，关联 StarHotelBaseInfo.HotelCode
- dept: 大类代码，表示数据大类的代码
- deptname: 大类名称，表示数据大类的名称，与 dept 是一对一关系
- class: 数据二级分类，表示数据数据二级的代码，关联 TransCodeConfig.class1
- descript:  数据二级分类名称，表示数据二级分类的名称，与 class 是一对一关系
- class1: 数据三级分类，表示数据数据三级的代码
- descript1:  数据三级分类名称，表示数据三级分类的名称，与 class1 是一对一关系
- amount: 金额字段，是收入金额
- rebate: 金额字段，是冲减金额
- createtime: 记录创建时间

## 表关联关系
- hotelid → [CrsStar].dbo.StarHotelBaseInfo.HotelCode
- class → [192.168.210.170].[Report].dbo.TransCodeConfig.class1

## 关联查询示例
```sql
SELECT 
    h.hotelid,
    b.HotelName,
    h.dept,
    h.deptname,
    h.class1,
    h.descript1,
    h.amount
FROM [192.168.210.170].[Report].dbo.bi_htlrev h
LEFT JOIN [CrsStar].dbo.StarHotelBaseInfo b
    ON h.hotelid = b.HotelCode
WHERE h.bdate >= '2025-01-01' AND h.bdate < '2026-01-01'
AND h.hotelid in ('JL0002')
```

## 示例数据
| bdate | hotelid | dept | deptname | class | descript | class1 | descript1 | amount | rebate |
|--------|---------|------|----------|-------|----------|--------|-----------|--------|--------|
| 2025-01-01 | JG0001 | rm | 客房 | 001 | 客房收入 | 1001 | 客房服务费 | 5000.00 | 0.00 |
| 2025-01-01 | JG0001 | fb | 餐饮 | 002 | 早餐 | 2001 | 饮料 | 500.00 | 50.00 |