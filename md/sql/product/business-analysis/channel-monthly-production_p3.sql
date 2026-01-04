WITH MonthlyData AS
(
    -- 第一段：按酒店
    SELECT
        r.HotelCd AS GroupOrHotel,
        r.AgentCd,
        'Hotel' AS TypeFlag,
        r.RoomCost,
        r.RoomNightNum,
        MONTH(r.DepDate) AS MonthNumber
    FROM [CrsStar].dbo.MemberChildOrderRecord r
    LEFT JOIN [CrsStar].dbo.StarHotelBaseInfo h
           ON r.HotelCd = h.HotelCode
    WHERE
        r.AgentCd IN ('WEB')
        AND r.sta NOT IN ('C','Canceled','')
        AND r.DepDate >= '2025-01-01' AND r.DepDate < '2026-01-01'
        AND r.HotelCd IN ('NY0003','JG0079')   -- ⭐ 新增条件

    UNION ALL

    -- 第二段：按集团
    SELECT
        h.GroupCode AS GroupOrHotel,
        r.AgentCd,
        'Group' AS TypeFlag,
        r.RoomCost,
        r.RoomNightNum,
        MONTH(r.DepDate) AS MonthNumber
    FROM [CrsStar].dbo.MemberChildOrderRecord r
    LEFT JOIN [CrsStar].dbo.StarHotelBaseInfo h
           ON r.HotelCd = h.HotelCode
    WHERE
        r.AgentCd IN ('WEB')
        AND r.sta NOT IN ('C','Canceled','')
        AND r.DepDate >= '2025-01-01' AND r.DepDate < '2026-01-01'
        AND h.GroupCode IN ('YF')
)

SELECT
    GroupOrHotel,
    AgentCd,
    TypeFlag,

    -- 全年合计
    SUM(RoomCost) AS TotalRoomCost,
    SUM(RoomNightNum) AS TotalRoomNightNum,

    -- 每月房费
    SUM(CASE WHEN MonthNumber = 1 THEN RoomCost ELSE 0 END) AS Jan_RoomCost,
    SUM(CASE WHEN MonthNumber = 2 THEN RoomCost ELSE 0 END) AS Feb_RoomCost,
    SUM(CASE WHEN MonthNumber = 3 THEN RoomCost ELSE 0 END) AS Mar_RoomCost,
    SUM(CASE WHEN MonthNumber = 4 THEN RoomCost ELSE 0 END) AS Apr_RoomCost,
    SUM(CASE WHEN MonthNumber = 5 THEN RoomCost ELSE 0 END) AS May_RoomCost,
    SUM(CASE WHEN MonthNumber = 6 THEN RoomCost ELSE 0 END) AS Jun_RoomCost,
    SUM(CASE WHEN MonthNumber = 7 THEN RoomCost ELSE 0 END) AS Jul_RoomCost,
    SUM(CASE WHEN MonthNumber = 8 THEN RoomCost ELSE 0 END) AS Aug_RoomCost,
    SUM(CASE WHEN MonthNumber = 9 THEN RoomCost ELSE 0 END) AS Sep_RoomCost,
    SUM(CASE WHEN MonthNumber = 10 THEN RoomCost ELSE 0 END) AS Oct_RoomCost,
    SUM(CASE WHEN MonthNumber = 11 THEN RoomCost ELSE 0 END) AS Nov_RoomCost,
    SUM(CASE WHEN MonthNumber = 12 THEN RoomCost ELSE 0 END) AS Dec_RoomCost,

    -- 每月房晚
    SUM(CASE WHEN MonthNumber = 1 THEN RoomNightNum ELSE 0 END) AS Jan_RoomNightNum,
    SUM(CASE WHEN MonthNumber = 2 THEN RoomNightNum ELSE 0 END) AS Feb_RoomNightNum,
    SUM(CASE WHEN MonthNumber = 3 THEN RoomNightNum ELSE 0 END) AS Mar_RoomNightNum,
    SUM(CASE WHEN MonthNumber = 4 THEN RoomNightNum ELSE 0 END) AS Apr_RoomNightNum,
    SUM(CASE WHEN MonthNumber = 5 THEN RoomNightNum ELSE 0 END) AS May_RoomNightNum,
    SUM(CASE WHEN MonthNumber = 6 THEN RoomNightNum ELSE 0 END) AS Jun_RoomNightNum,
    SUM(CASE WHEN MonthNumber = 7 THEN RoomNightNum ELSE 0 END) AS Jul_RoomNightNum,
    SUM(CASE WHEN MonthNumber = 8 THEN RoomNightNum ELSE 0 END) AS Aug_RoomNightNum,
    SUM(CASE WHEN MonthNumber = 9 THEN RoomNightNum ELSE 0 END) AS Sep_RoomNightNum,
    SUM(CASE WHEN MonthNumber = 10 THEN RoomNightNum ELSE 0 END) AS Oct_RoomNightNum,
    SUM(CASE WHEN MonthNumber = 11 THEN RoomNightNum ELSE 0 END) AS Nov_RoomNightNum,
    SUM(CASE WHEN MonthNumber = 12 THEN RoomNightNum ELSE 0 END) AS Dec_RoomNightNum

FROM MonthlyData
GROUP BY
    GroupOrHotel,
    AgentCd,
    TypeFlag
ORDER BY
    TypeFlag,
    AgentCd,
    GroupOrHotel;
