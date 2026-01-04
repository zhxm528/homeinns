# 房价码的查询SQL语句
sql
```
SELECT 
    r.HotelCode AS '酒店代码',
    h.HotelName AS '酒店名称',
    h.HotelType AS '酒店类型',
    h.GroupCode AS '集团代码',
    h.PMSType AS 'PMS类型',
    h.PropertyType AS '产权类型',

    r.RateCode AS '房价码',
    r.RateCodeName AS '房价名称',

    -- 房型聚合（可保留原值或聚合）
    STUFF((
        SELECT ',' + r2.RoomTypeCode
        FROM [CrsStar].dbo.StarRateCodeInfo r2
        WHERE r2.HotelCode = r.HotelCode AND r2.RateCode = r.RateCode
        FOR XML PATH(''), TYPE
    ).value('.', 'NVARCHAR(MAX)'), 1, 1, '') AS '房型代码',

    -- 日期类（取最小开始、最大结束）
    MIN(CONVERT(varchar(10), r.BeginDate, 120)) AS '开始日期',
    MAX(CONVERT(varchar(10), r.EndDate, 120)) AS '结束日期',

    -- 预订限制
    MIN(r.MinLos) AS '最小连住天数',
    MAX(r.MaxLos) AS '最大连住天数',
    MIN(r.MinAdvBookin) AS '最小预订提前天数',
    MAX(r.MaxAdvBookin) AS '最大预订提前天数',

    -- 市场来源
    r.Market AS '市场代码',
    m.CodeName AS '市场名称',
    r.Sources AS '来源代码',
    r.CateCode AS '类别码',

    r.ShortInfo AS '短备注',
    r.LongInfo AS '长备注',

    -- 发布渠道聚合（不限制日期）
    STUFF((
        SELECT ',' + p2.ChannelCode
        FROM [CrsStar].dbo.StarPublishRateCodeInfo p2
        WHERE p2.HotelCode = r.HotelCode AND p2.RateCode = r.RateCode
        FOR XML PATH(''), TYPE
    ).value('.', 'NVARCHAR(MAX)'), 1, 1, '') AS '发布渠道',

    -- 房价码分组聚合（不限制日期）
    STUFF((
        SELECT ',' + s2.ColumnName
        FROM [CrsStar].dbo.StarProducitonReportSetting s2
        WHERE s2.HotelCode = r.HotelCode AND s2.RateCodeEqual = r.RateCode
        FOR XML PATH(''), TYPE
    ).value('.', 'NVARCHAR(MAX)'), 1, 1, '') AS '分组名称'

FROM [CrsStar].dbo.StarRateCodeInfo r
LEFT JOIN [CrsStar].dbo.StarHotelBaseInfo h
       ON r.HotelCode = h.HotelCode AND h.IsDelete = 0
LEFT JOIN [CrsStar].dbo.SOP_StarMarketInfo_Brand m
       ON r.Market = m.MarketCode AND m.IsValid = 1 AND m.IsDelete = 0

WHERE r.IsDelete = 0
  AND r.HotelCode IN ('NY0001')

GROUP BY 
    r.HotelCode,
    h.HotelName,
    h.HotelType,
    h.GroupCode,
    h.PMSType,
    h.PropertyType,
    r.RateCode,
    r.RateCodeName,
    r.Market,
    m.CodeName,
    r.Sources,
    r.CateCode,
    r.ShortInfo,
    r.LongInfo

ORDER BY r.HotelCode, r.RateCode;
```