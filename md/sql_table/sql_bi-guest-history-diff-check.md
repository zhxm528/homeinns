#SQL语句
sql
```
/********************************************************************
* 名称：BI 与 CRS 客史数据对比脚本（含房型金额差异）
* 功能：对比 BI 系统与 CRS 系统在相同日期、相同酒店下的间夜数与房费金额差异，
*       并同时显示房型级别的 BI 汇总结果与对应差异百分比
* 特性：
*   - 消除 NULL 警告
*   - 金额差保留两位小数
*   - 相差百分比取整数
*   - 支持 PropertyType、PMSType
* 作者：Jian Zhou
* 版本：v3.1
* 日期：2025-11-12
********************************************************************/

DECLARE 
    @StartDate DATETIME = '2025-09-08',    -- 起始日期
    @EndDate   DATETIME = '2025-09-15';    -- 结束日期

BEGIN
    ---------------------------------------------------------------
    -- 1. 清理旧临时表
    ---------------------------------------------------------------
    IF OBJECT_ID('tempdb..#BIData') IS NOT NULL DROP TABLE #BIData;
    IF OBJECT_ID('tempdb..#BIDataRoomType') IS NOT NULL DROP TABLE #BIDataRoomType;
    IF OBJECT_ID('tempdb..#CRSData') IS NOT NULL DROP TABLE #CRSData;

    ---------------------------------------------------------------
    -- 2. BI 数据汇总（主表：bi_mkt）
    ---------------------------------------------------------------
    SELECT 
        hotelid,
        CAST(bdate AS DATE) AS bdate,
        SUM(ISNULL(rms_occ, 0)) AS occ,    
        SUM(ISNULL(rev_rm, 0)) AS rm
    INTO #BIData
    FROM [192.168.210.170].[Report].dbo.bi_mkt
    WHERE bdate BETWEEN @StartDate AND @EndDate
    GROUP BY hotelid, CAST(bdate AS DATE);

    ---------------------------------------------------------------
    -- 3. 新增：BI 房型数据汇总（bi_rmtype）
    ---------------------------------------------------------------
    SELECT 
        hotelid,
        CAST(bdate AS DATE) AS bdate,
        SUM(ISNULL(rms_occ, 0)) AS occ,
        SUM(ISNULL(rev_rm, 0)) AS rm
    INTO #BIDataRoomType
    FROM [192.168.210.170].[Report].dbo.bi_rmtype
    WHERE bdate BETWEEN @StartDate AND @EndDate
    GROUP BY hotelid, CAST(bdate AS DATE);

    ---------------------------------------------------------------
    -- 4. CRS 客史数据汇总
    ---------------------------------------------------------------
    SELECT 
        a.HotelCd AS hotelid,
        CAST(b.DailyDate AS DATE) AS bdate,
        SUM(ISNULL(b.RoomNightNum, 0)) AS occ,
        SUM(CASE 
              WHEN c.PMSType = 'XMS' THEN ISNULL(b.XFRoomCost, 0)
              WHEN c.PMSType IN ('x6', 'Cambridge') THEN ISNULL(b.RoomCost, 0)
              ELSE 0 
            END) AS rm,
        SUM(ISNULL(b.OtherCost, 0)) AS otherCost,
        MAX(c.PMSType) AS PMSType,
        MAX(c.PropertyType) AS PropertyType
    INTO #CRSData
    FROM [CrsStar ].dbo.MemberChildOrderRecord a
    INNER JOIN [CrsStar ].dbo.MemberChildOrderRecordDailyRate b
        ON a.Res_Account = b.OrderNo
    INNER JOIN [CrsStar ].dbo.StarHotelBaseInfo c
        ON a.HotelCd = c.HotelCode
    WHERE b.DailyDate BETWEEN @StartDate AND @EndDate
      AND c.PMSType IN ('XMS', 'x6', 'Cambridge')
    GROUP BY a.HotelCd, CAST(b.DailyDate AS DATE);

    ---------------------------------------------------------------
    -- 5. 对比汇总结果（增加房型金额差异列）
    ---------------------------------------------------------------
    SELECT 
        c.HotelCode,
        c.HotelName,
        c.PMSType,
        c.PropertyType,
        bi.bdate,

        -- 原 BI 汇总
        bi.occ AS BI间夜,
        bi.rm AS BI金额,

        -- 新增：BI 房型汇总
        ISNULL(rt.occ, 0) AS BI房型间夜,
        ISNULL(rt.rm, 0)  AS BI房型金额,

        -- CRS 汇总
        crs.occ AS CRS间夜,
        crs.rm AS CRS金额,

        -- 主金额差异
        ROUND(ISNULL(crs.rm,0) - ISNULL(bi.rm,0), 2) AS 金额差,
        CASE 
            WHEN ISNULL(bi.rm,0) = 0 THEN NULL
            ELSE ROUND(((ISNULL(crs.rm,0) - ISNULL(bi.rm,0)) / ISNULL(bi.rm,1)) * 100, 0)
        END AS 相差百分比,

        -- 🆕 新增：房型金额 vs CRS金额 的差异
        ROUND(ISNULL(rt.rm,0) - ISNULL(crs.rm,0), 2) AS 房型金额差,
        CASE 
            WHEN ISNULL(crs.rm,0) = 0 THEN NULL
            ELSE ROUND(((ISNULL(rt.rm,0) - ISNULL(crs.rm,0)) / ISNULL(crs.rm,1)) * 100, 0)
        END AS 房型相差百分比

    FROM #BIData bi
    LEFT JOIN #CRSData crs 
        ON bi.hotelid = crs.hotelid 
       AND bi.bdate = crs.bdate
    LEFT JOIN #BIDataRoomType rt
        ON bi.hotelid = rt.hotelid
       AND bi.bdate = rt.bdate
    INNER JOIN [CrsStar ].dbo.StarHotelBaseInfo c
        ON bi.hotelid = c.HotelCode
    WHERE 
        c.PMSType IN ('XMS', 'x6', 'Cambridge')
    ORDER BY bi.bdate, c.PMSType, c.HotelName;

END

```