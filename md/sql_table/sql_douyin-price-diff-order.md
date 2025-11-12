#查询订单金额和扩展金额差异的SQL语句
##涉及的表
- [CrsStar].dbo.View_StarOrderRoom_All 订单表
- [CrsStar].dbo.View_StarOrderExtension_All 订单扩展字段表
- [CrsStar].dbo.View_StarOrderBill_All 订单扩展金额表
##SQL语句
sql
```
SELECT orderRoom.OrderNo as C3订单号,
 orderRoom.HotelCd as 酒店代码,
 orderRoom.HotelName as 酒店名称,
 orderRoom.GustNm as 客人姓名,
 orderRoom.RoomTypeCode as 房型,
 orderRoom.RateCode as 房价码,
 orderRoom.ArrDate as 入住日期,
 orderRoom.DepDate as 离店日期,
 orderRoom.CRSResvDate as 预订日期,
 bill.GrantRt AS  'P3金额',
 CAST(CAST(ext.Value AS DECIMAL(10,2)) / 100 AS DECIMAL(10,2))  AS '抖音金额',
 CAST(CAST(ext.Value AS DECIMAL(10,2)) / 100 AS DECIMAL(10,2))  - bill.GrantRt    AS  '差额'
  FROM [CrsStar ].dbo.View_StarOrderRoom_All orderRoom
 LEFT JOIN [CrsStar ].dbo.View_StarOrderExtension_All ext
 ON orderRoom.OrderNo = ext.OrderNo 
 AND ext.DataType  = 'TiktokPriceIncrease'
 LEFT JOIN [CrsStar ].dbo.View_StarOrderBill_All bill
 ON orderRoom.OrderNo = bill.OrderNo
 WHERE 
  orderRoom.DepDate > = '2025-09-20'
 AND orderRoom.AgentCd IN ( 'CHDYRL','DOU')
 AND HotelCd like 'UC%'
 AND   CAST(CAST(ext.Value  AS DECIMAL(10,2)) / 100 AS DECIMAL(10,2)) <> orderRoom.MustPayMoney
```