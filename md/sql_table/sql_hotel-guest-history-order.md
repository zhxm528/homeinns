#sql语句
sql
```
SELECT
    a.Res_Account     AS CRS订单号,
    a.PMSOrderNo      AS PMS订单号,
    a.sta             AS 订单状态,
    a.HotelCd         AS 酒店代码,
    h.HotelName       AS 酒店名称,
    a.AgentCd         AS 渠道代码,
    a.Marketplace     AS 市场代码,
    a.ArrDate         AS 入住日期,
    a.DepDate         AS 离店日期,
    a.MemberName      AS 客人姓名,
    a.RoomCode        AS 房型代码,
    s.RoomTypeName    AS 房型名称,
    a.RateCode        AS 房价码,
    r.RateCodeName    AS 房价码名称,  -- ★ 新增房价码名称
    a.PayType         AS 费用类型,
    a.cusno_des       AS 公司档案,
    a.CreateDate      AS 预订日期,

    -- 每日明细汇总
    SUM(b.RoomNightNum) AS 间夜数,
    SUM(b.RoomCost)     AS 客房收入,
    SUM(b.RepastCost)   AS 餐饮收入,
    SUM(b.OtherCost)    AS 其他收入,
    SUM(b.TotalCost)    AS 总收入

FROM [CrsStar].dbo.MemberChildOrderRecord a
LEFT JOIN [CrsStar].dbo.MemberChildOrderRecordDailyRate b
    ON a.Res_Account = b.OrderNo
LEFT JOIN [CrsStar].dbo.StarHotelBaseInfo h
    ON a.HotelCd = h.HotelCode
LEFT JOIN [CrsStar].dbo.StarRateCodeInfo r
    ON a.HotelCd = r.HotelCode
   AND a.RateCode = r.RateCode              -- ★ 去掉日期范围限制
LEFT JOIN [CrsStar].dbo.StarRoomInfo s
    ON a.HotelCd = s.HotelCode
   AND a.RoomCode = s.RoomTypeCode

WHERE a.DepDate >= '2025-08-01'
  AND a.DepDate <  '2025-09-01'
  AND a.Marketplace IN ('NLR')
  AND a.AgentCd IN ('CTI')
  AND a.sta NOT IN ('Canceled','NW','C')

  -- 酒店表属性筛选条件
  AND h.GroupCode IN ('你的GroupCode')
  AND h.PMSType IN ('你的PMSType')
  AND h.PropertyType IN ('你的PropertyType')

  -- 城市、省份过滤
  AND h.MDMProvince IN ('你的省份代码')
  AND h.MDMCity IN ('你的城市代码')

GROUP BY
    a.Res_Account, a.PMSOrderNo, a.sta, 
    a.HotelCd, h.HotelName,
    a.AgentCd, a.Marketplace,
    a.ArrDate, a.DepDate, a.MemberName,
    a.RoomCode, s.RoomTypeName,
    a.RateCode, r.RateCodeName,
    a.PayType, a.cusno_des, a.CreateDate;
```