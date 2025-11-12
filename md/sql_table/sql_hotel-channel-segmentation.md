#查询酒店渠道明细的SQL
##涉及的表
- [CrsStar].dbo.MemberChildOrderRecord 订单表
- [CrsStar].dbo.StarHotelBaseInfo 酒店表
- [CrsStar].dbo.MemberChildOrderRecordDailyRate 订单每日明细表
##SQL语句
sql
```
DECLARE 
    @QueryDate       date = '2025-10-31',
    @YearStart       date = DATEFROMPARTS(YEAR('2025-10-31'), 1, 1),
    @MonthStart      date = DATEFROMPARTS(YEAR('2025-10-31'), MONTH('2025-10-31'), 1);

-- 假如需要：把列表参数启用（示例）
-- INSERT INTO @ValidStatus   VALUES (N'Active'), (N'Confirmed');     -- 仅示例，具体取值以你们业务为准
-- INSERT INTO @AgentCdList   VALUES (N'CTP'), (N'MDI'), (N'OBR'), (N'WEB'), (N'WAT');
-- INSERT INTO @GroupCodeList VALUES (N'JG'), (N'JL'), (N'NY'), (N'NH'), (N'NI'), (N'KP'), (N'NU');

;WITH base AS (
    SELECT
        a.AgentCd,
        a.HotelCd,
        b.HotelName,
        c.DailyDate,
        RoomNight = COALESCE(c.RoomNightNum, 0),
        RoomRev   = COALESCE(c.RoomCost, 0)
    FROM [CrsStar].dbo.MemberChildOrderRecord a
    JOIN [CrsStar].dbo.StarHotelBaseInfo b
           ON b.HotelCode = a.HotelCd
    LEFT JOIN [CrsStar].dbo.MemberChildOrderRecordDailyRate c
           ON c.OrderNo = a.Res_Account
    WHERE
        -- 业务口径：先圈定“今年离店”的订单
        a.DepDate >= @YearStart
        AND a.DepDate <  DATEADD(year, 1, @YearStart)

        -- 状态：如果用表变量
        -- AND EXISTS (SELECT 1 FROM @ValidStatus s WHERE s.sta = a.sta)
        -- 你当前逻辑是排除取消：
        AND a.sta NOT IN ('C','Canceled','')

        -- 渠道：用表变量/硬编码二选一
        -- AND EXISTS (SELECT 1 FROM @AgentCdList l WHERE l.AgentCd = a.AgentCd)
        AND a.AgentCd IN ('CTP','MDI','OBR','WEB','WAT')

        -- 酒店过滤
        AND b.Status = 1
        AND b.IsDelete = 0
        -- AND EXISTS (SELECT 1 FROM @GroupCodeList g WHERE g.GroupCode = b.GroupCode)
        AND b.GroupCode IN ('JG','JL','NY','NH','NI','KP','NU')
)
SELECT
    AgentCd AS 渠道代码,
    CASE AgentCd
        WHEN 'CTP' THEN N'携程线上'
        WHEN 'MDI' THEN N'美团线上'
        WHEN 'OBR' THEN N'飞猪线上'
        WHEN 'WAT' THEN N'首享会'
        WHEN 'WEB' THEN N'如家官网'
        ELSE N'其他'
    END AS 渠道名称,
    HotelCd AS 酒店代码,
    HotelName AS 酒店名称,

    -- 当日
    SUM(CASE WHEN DailyDate = @QueryDate THEN RoomNight ELSE 0 END) AS 当日间夜数,
    SUM(CASE WHEN DailyDate = @QueryDate THEN RoomRev   ELSE 0 END) AS 当日客房收入,

    -- 当月 MTD: 月初到查询日
    SUM(CASE WHEN DailyDate >= @MonthStart AND DailyDate <= @QueryDate THEN RoomNight ELSE 0 END) AS 当月MTD间夜数,
    SUM(CASE WHEN DailyDate >= @MonthStart AND DailyDate <= @QueryDate THEN RoomRev   ELSE 0 END) AS 当月MTD客房收入,

    -- 当年 YTD: 年初到查询日（已在 CTE 限定，也可再写一遍以自解释）
    SUM(CASE WHEN DailyDate >= @YearStart  AND DailyDate <= @QueryDate THEN RoomNight ELSE 0 END) AS 当年YTD间夜数,
    SUM(CASE WHEN DailyDate >= @YearStart  AND DailyDate <= @QueryDate THEN RoomRev   ELSE 0 END) AS 当年YTD客房收入

FROM base
GROUP BY AgentCd, HotelCd, HotelName
ORDER BY AgentCd, HotelCd;
```