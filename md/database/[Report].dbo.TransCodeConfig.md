# 财务科目配置表
## 表名
[192.168.210.170].[Report].dbo.TransCodeConfig
## 表结构
列名	#	类型	长度	标度	精度	非空	身份	默认	排序规则	描述
hotelid	2	varchar	10	[NULL]	[NULL]	true	false	[NULL]	Chinese_PRC_CI_AS	[NULL]
dept	3	varchar	50	[NULL]	[NULL]	true	false	[NULL]	Chinese_PRC_CI_AS	[NULL]
deptname	4	varchar	50	[NULL]	[NULL]	false	false	[NULL]	Chinese_PRC_CI_AS	[NULL]
class	5	varchar	50	[NULL]	[NULL]	true	false	[NULL]	Chinese_PRC_CI_AS	[NULL]
descript	6	varchar	50	[NULL]	[NULL]	false	false	[NULL]	Chinese_PRC_CI_AS	[NULL]
class1	7	varchar	50	[NULL]	[NULL]	true	false	[NULL]	Chinese_PRC_CI_AS	[NULL]
descript1	8	varchar	50	[NULL]	[NULL]	false	false	[NULL]	Chinese_PRC_CI_AS	[NULL]
sort	9	int	4	[NULL]	10	false	false	[NULL]	[NULL]	[NULL]
id	12	int	4	[NULL]	10	true	true	[NULL]	[NULL]	[NULL]



## 字段说明
- hotelid: 酒店代码，表示数据是这家酒店的数据，关联 StarHotelBaseInfo.HotelCode
- dept: 大类代码，表示数据大类的代码
- deptname: 大类名称，表示数据大类的名称，与 dept 是一对一关系
- class: 数据二级分类，表示数据数据二级的代码
- descript:  数据二级分类名称，表示数据二级分类的名称，与 class 是一对一关系
- class1: 数据三级分类，表示数据数据三级的代码，关联 bi_htlrev.class
- descript1:  数据三级分类名称，表示数据三级分类的名称，与 class1 是一对一关系
- sort: 排序；
- id: 数据库表的唯一主键；

## 表关联关系
- hotelid → [CrsStar].dbo.StarHotelBaseInfo.HotelCode

## 关联查询示例
```sql
SELECT 
    c.hotelid,
    b.HotelName,
    c.dept,
    c.deptname,
    c.class,
    c.descript,
    c.class1,
    c.descript1
FROM [192.168.210.170].[Report].dbo.TransCodeConfig c
LEFT JOIN [CrsStar].dbo.StarHotelBaseInfo b
    ON h.hotelid = b.HotelCode
WHERE h.hotelid in ('JL0002')
```

