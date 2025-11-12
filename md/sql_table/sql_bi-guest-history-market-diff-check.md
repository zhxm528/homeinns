#SQL语句
sql
```
/********************************************************************
* 通用 BI vs CRS 对比脚本（兼容无 STRING_SPLIT 的 SQL Server）
* 特性：
*  - 使用 XML 法拆分酒店列表（兼容旧版本）
*  - 支持日期范围、多酒店
*  - 防止 NULL 导致的聚合警告（使用 ISNULL）
*  - 金额保留两位小数，百分比取整
*  - 来源：远程 BI -> [192.168.210.170].[Report].dbo.bi_mkt
*           CRS  -> [CrsStar ].dbo.*
* 作者：Jian Zhou（示例）
* 版本：v1.0
* 日期：2025-11-05
********************************************************************/

DECLARE
    @StartDate DATE = '2025-03-20',
    @EndDate   DATE = '2025-03-25',
    @HotelList NVARCHAR(MAX) = 'NY0003,NY0005';  -- 多个酒店用逗号分隔

-- 清理（保险）
IF OBJECT_ID('tempdb..#BI') IS NOT NULL DROP TABLE #BI;
IF OBJECT_ID('tempdb..#CRS') IS NOT NULL DROP TABLE #CRS;
IF OBJECT_ID('tempdb..#HotelList') IS NOT NULL DROP TABLE #HotelList;

---------------------------------------------------------------------
-- 拆分酒店列表：XML 法（兼容旧版 SQL Server）
---------------------------------------------------------------------
;WITH xml_source AS (
    SELECT CAST('<x>' + REPLACE(@HotelList, ',', '</x><x>') + '</x>' AS XML) AS xmldata
)
, Split AS (
    SELECT LTRIM(RTRIM(m.n.value('.[1]', 'NVARCHAR(100)'))) AS HotelCd
    FROM xml_source t
    CROSS APPLY t.xmldata.nodes('/x') m(n)
)
SELECT DISTINCT HotelCd
INTO #HotelList
FROM Split
WHERE LEN(LTRIM(RTRIM(HotelCd))) > 0;

---------------------------------------------------------------------
-- 1) 从远程 BI 汇总（按 hotelid, date, class）
---------------------------------------------------------------------
SELECT 
    a.hotelid AS HotelId,
    CAST(a.bdate AS DATE) AS BusinessDate,
    a.class AS Category,
    ISNULL(SUM(a.rms_occ), 0) AS biOCC,
    ISNULL(SUM(a.rev_rm), 0)   AS biBIRM,
    ISNULL(SUM(a.avg_rt), 0)   AS biBIRT
INTO #BI
FROM [192.168.210.170].[Report].dbo.bi_mkt a
INNER JOIN #HotelList h ON a.hotelid = h.HotelCd
WHERE CAST(a.bdate AS DATE) BETWEEN @StartDate AND @EndDate
GROUP BY a.hotelid, CAST(a.bdate AS DATE), a.class;

---------------------------------------------------------------------
-- 2) 从 CRS 汇总（按 HotelCd, DailyDate, Marketplace）
---------------------------------------------------------------------
SELECT
    a.HotelCd,
    CAST(b.DailyDate AS DATE) AS DailyDate,
    a.Marketplace,
    ISNULL(SUM(b.RoomNightNum), 0) AS crsRoomNightNum,
    ISNULL(SUM(b.RoomCost), 0)      AS crsRoomCost,
    ISNULL(SUM(b.OtherCost), 0)     AS crsOtherCost,
    ISNULL(SUM(b.TotalCost), 0)     AS crsTotalCost
INTO #CRS
FROM [CrsStar ].dbo.MemberChildOrderRecord a
INNER JOIN [CrsStar ].dbo.MemberChildOrderRecordDailyRate b
    ON a.Res_Account = b.OrderNo
INNER JOIN #HotelList hl
    ON a.HotelCd = hl.HotelCd
WHERE CAST(b.DailyDate AS DATE) BETWEEN @StartDate AND @EndDate
GROUP BY a.HotelCd, CAST(b.DailyDate AS DATE), a.Marketplace;

---------------------------------------------------------------------
-- 3) （可选）获取酒店名称：从 CRS 的 StarHotelBaseInfo 拿 name（若存在）
--    如果你有更可靠的酒店名称表，可改成那张表。
---------------------------------------------------------------------
IF OBJECT_ID('tempdb..#HotelInfo') IS NOT NULL DROP TABLE #HotelInfo;
SELECT 
    s.HotelCode AS HotelId,
    s.HotelName
INTO #HotelInfo
FROM [CrsStar ].dbo.StarHotelBaseInfo s
INNER JOIN #HotelList hl ON s.HotelCode = hl.HotelCd;

---------------------------------------------------------------------
-- 4) 最终汇总与对比
---------------------------------------------------------------------
SELECT
    bi.HotelId   AS HotelCode,
    hi.HotelName AS HotelName,
    bi.BusinessDate AS [日期],
    bi.Category     AS [类别],

    -- BI 数据
    bi.biOCC    AS [BI间夜数],
    ROUND(bi.biBIRM, 2) AS [BI房费金额],

    -- CRS 数据（若无数据，则 0）
    ISNULL(crs.crsRoomNightNum, 0) AS [CRS间夜数],
    ROUND(ISNULL(crs.crsRoomCost, 0), 2) AS [CRS房费金额],

    -- 差值与百分比（金额差保留两位小数；百分比取整）
    (ISNULL(crs.crsRoomNightNum, 0) - ISNULL(bi.biOCC, 0)) AS [间夜差],
    ROUND(ISNULL(crs.crsRoomCost, 0) - ISNULL(bi.biBIRM, 0), 2) AS [金额差],
    CASE 
        WHEN ISNULL(bi.biBIRM, 0) = 0 THEN NULL
        ELSE CAST(ROUND(((ISNULL(crs.crsRoomCost, 0) - ISNULL(bi.biBIRM, 0)) / NULLIF(bi.biBIRM,0)) * 100, 0) AS INT)
    END AS [差异百分比]
FROM #BI bi
LEFT JOIN #CRS crs
    ON bi.HotelId = crs.HotelCd
   AND bi.BusinessDate = crs.DailyDate
   AND bi.Category = crs.Marketplace
LEFT JOIN #HotelInfo hi
    ON bi.HotelId = hi.HotelId
ORDER BY bi.HotelId, bi.BusinessDate, bi.Category;

---------------------------------------------------------------------
-- 5) 清理临时表
---------------------------------------------------------------------
IF OBJECT_ID('tempdb..#BI') IS NOT NULL DROP TABLE #BI;
IF OBJECT_ID('tempdb..#CRS') IS NOT NULL DROP TABLE #CRS;
IF OBJECT_ID('tempdb..#HotelList') IS NOT NULL DROP TABLE #HotelList;
IF OBJECT_ID('tempdb..#HotelInfo') IS NOT NULL DROP TABLE #HotelInfo;

-- End of script

```