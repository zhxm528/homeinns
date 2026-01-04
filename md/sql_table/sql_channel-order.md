#sql语句
sql
```
SELECT DISTINCT
    o.OrderNo AS CRS订单号,
    o.HotelCd AS 酒店代码,
    h.HotelName AS 酒店名称,
    o.AgentCd AS 渠道代码,
    o.ResvType AS 预订类型,
    o.ArrDate AS 入住日期,
    o.DepDate AS 离店日期,
    o.RoomTypeCode AS 房型代码,
    s.RoomTypeName AS 房型名称,
    o.RateCode AS 房价码,
    r.RateCodeName AS 房价码名称,
    o.PayCd AS 费用类型,
    o.MemberNo AS 会员编号,
    o.GustNm AS 客人姓名,
    o.MobileTel AS 手机号码,
    o.TotalXf AS 总消费,
    o.ResStatus AS 订单状态,
    o.BookDate AS 预订日期  -- 新增显示，方便验证排序
FROM [CrsStar].dbo.View_StarOrderRoom_All o
LEFT JOIN [CrsStar].dbo.StarHotelBaseInfo h
    ON o.HotelCd = h.HotelCode
   AND h.GroupCode IN ('GRP001', 'GRP002')           -- 示例：多选集团
   AND h.PMSType IN ('PMS_A', 'PMS_B')
   AND h.PropertyType IN ('HOTEL', 'RESORT')
   AND h.MDMProvince IN ('110000', '310000')
   AND h.MDMCity IN ('110100', '310100')
LEFT JOIN [CrsStar].dbo.StarRoomInfo s
    ON o.HotelCd = s.HotelCode 
   AND o.RoomTypeCode = s.RoomTypeCode
LEFT JOIN [CrsStar].dbo.StarRateCodeInfo r
    ON o.HotelCd = r.HotelCode 
   AND o.RateCode = r.RateCode
WHERE o.DepDate >= '2025-08-01'
  AND o.DepDate < '2025-09-01'
  AND o.ResStatus NOT IN ('Canceled', 'NW', 'C')

  -- 多选条件：请按需替换括号内值
  AND o.AgentCd   IN ('OTA001', 'OTA002', 'DIRECT')     -- 多选渠道代码
  AND o.ResvType  IN ('FIT', 'GIT', 'CORP')             -- 多选预订类型
  AND o.RateCode  IN ('BAR', 'CORP10', 'PKG001')        -- 多选房价码

ORDER BY 
    o.BookDate DESC,    -- 预订日期：从新到旧
    o.OrderNo DESC;     -- 同日期内，订单号倒序（可选）
```