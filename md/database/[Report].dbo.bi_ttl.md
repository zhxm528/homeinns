# 经营分析酒店日报表
## 表名
[192.168.210.170].[Report].dbo.bi_ttl
## 表结构
列名	#	类型	长度	标度	精度	非空	身份	默认	排序规则	描述
bdate	1	datetime	8	3	23	true	false	[NULL]	[NULL]	[NULL]
cdate	2	datetime	8	3	23	false	false	[NULL]	[NULL]	[NULL]
hotelid	3	varchar	10	[NULL]	[NULL]	true	false	[NULL]	Chinese_PRC_CI_AS	[NULL]
class	4	varchar	50	[NULL]	[NULL]	true	false	[NULL]	Chinese_PRC_CI_AS	[NULL]
descript1	5	varchar	50	[NULL]	[NULL]	false	false	[NULL]	Chinese_PRC_CI_AS	[NULL]
rms_ttl	6	decimal	9	2	18	false	false	[NULL]	[NULL]	[NULL]
rms_occ	7	decimal	9	2	18	false	false	[NULL]	[NULL]	[NULL]
rms_oos	8	decimal	9	2	18	false	false	[NULL]	[NULL]	[NULL]
rms_ooo	9	decimal	9	2	18	false	false	[NULL]	[NULL]	[NULL]
rms_htl	10	decimal	9	2	18	false	false	[NULL]	[NULL]	[NULL]
rms_avl	11	decimal	9	2	18	false	false	[NULL]	[NULL]	[NULL]
rms_dus	12	decimal	9	2	18	false	false	[NULL]	[NULL]	[NULL]
rev_rm	13	money	8	4	19	false	false	[NULL]	[NULL]	[NULL]
rev_fb	14	money	8	4	19	false	false	[NULL]	[NULL]	[NULL]
rev_ot	15	decimal	9	2	18	false	false	[NULL]	[NULL]	[NULL]
avg_rt	16	money	8	4	19	false	false	[NULL]	[NULL]	[NULL]
urc_num	17	decimal	9	2	18	false	false	[NULL]	[NULL]	[NULL]
fbd_num	18	decimal	9	2	18	false	false	[NULL]	[NULL]	[NULL]
createtime	19	datetime	8	3	23	false	false	[NULL]	[NULL]	[NULL]


## 字段说明
- bdate: 业务日期，表示数据是哪一天的数据
- cdate: 数据接收的日期，暂不使用
- hotelid: 酒店代码，表示数据是这家酒店的数据，关联 StarHotelBaseInfo.HotelCode
- class: 数据分类，只取 class='total'的数据
- descript1:  数据分类名称，暂不使用
- rms_ttl: 酒店总房间数，表示这家酒店在业务日期这天的总房间数，该数值不包含坏房数；
- rms_occ: 酒店实际出租房间数，表示这家酒店在业务日期这天的实际销售的出租房间数，该数值不包含免费房和自用房；
- rms_oos: 酒店维修房数，表示这家酒店在业务日期这天的维修房间数；
- rms_ooo: 酒店坏房数，表示这家酒店在业务日期这天的坏房房间数；
- rms_htl: 酒店坏房数，表示这家酒店在业务日期这天的酒店自用的房间数；
- rms_avl: 酒店当日到达数，表示这家酒店在业务日期这天入住的房间数；
- rms_dus: 酒店坏房数，表示这家酒店在业务日期这天过夜的房间数，该数值不包含小时房房间数；
- rev_rm: 金额字段，表示酒店客房收入
- rev_fb: 金额字段，表示酒店餐饮收入
- rev_ot: 金额字段，表示酒店其他收入
- avg_rt: 金额字段，表示平均房价
- urc_num: 成人人数，表示这家酒店在业务日期这天预订的成人数
- fbd_num: 小孩人数，表示这家酒店在业务日期这天预订的小孩数
- createtime: 记录创建时间

## 表关联关系
- hotelid → [CrsStar].dbo.StarHotelBaseInfo.HotelCode

## 关联查询示例
```sql
SELECT 
    t.bdate,
    t.hotelid,
    b.HotelName,
    t.class,
    t.rms_ttl,
    t.rms_occ,
    t.rev_rm,
    t.rev_fb,
    t.rev_ot
FROM [192.168.210.170].[Report].dbo.bi_ttl t
LEFT JOIN [CrsStar].dbo.StarHotelBaseInfo b
    ON h.hotelid = b.HotelCode
WHERE h.bdate >= '2025-01-01' AND h.bdate < '2026-01-01'
AND h.hotelid in ('JL0002')
```

