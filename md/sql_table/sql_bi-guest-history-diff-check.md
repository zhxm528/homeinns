#SQL语句
sql
```
/********************************************************************
* 名称：BI 与 CRS 客史数据对比脚本（含 ISNULL 防警告版）
* 功能：对比 BI 系统与 CRS 系统在相同日期、相同酒店下的间夜数与房费金额差异
* 特性：
*   - 消除 NULL 警告
*   - 金额差保留两位小数
*   - 相差百分比取整数
*   - 支持 PropertyType、PMSType
* 作者：Jian Zhou
* 版本：v2.5
* 日期：2025-11-05
********************************************************************/

DECLARE 
    @StartDate DATETIME = '2025-09-08',    -- 起始日期
    @EndDate   DATETIME = '2025-09-15',    -- 结束日期
    --@DiffPct   DECIMAL(10,2) = 1.00;       -- 金额差异阈值（百分比）

BEGIN
    ---------------------------------------------------------------
    -- 1. 清理旧临时表
    ---------------------------------------------------------------
    IF OBJECT_ID('tempdb..#BIData') IS NOT NULL DROP TABLE #BIData;
    IF OBJECT_ID('tempdb..#CRSData') IS NOT NULL DROP TABLE #CRSData;

    ---------------------------------------------------------------
    -- 2. BI 数据汇总（来自远程服务器 192.168.210.170）
    ---------------------------------------------------------------
    SELECT 
        hotelid,
        CAST(bdate AS DATE) AS bdate,
        SUM(ISNULL(rms_occ, 0)) AS occ,    -- ✅ NULL 安全
        SUM(ISNULL(rev_rm, 0)) AS rm       -- ✅ NULL 安全
    INTO #BIData
    FROM [192.168.210.170].[Report].dbo.bi_mkt
    WHERE bdate BETWEEN @StartDate AND @EndDate
    GROUP BY hotelid, CAST(bdate AS DATE);

    ---------------------------------------------------------------
    -- 3. CRS 客史数据汇总
    ---------------------------------------------------------------
    SELECT 
        a.HotelCd AS hotelid,
        CAST(b.DailyDate AS DATE) AS bdate,
        SUM(ISNULL(b.RoomNightNum, 0)) AS occ,    -- ✅ NULL 安全
        SUM(CASE 
              WHEN c.PMSType = 'XMS' THEN ISNULL(b.XFRoomCost, 0)
              WHEN c.PMSType IN ('x6', 'Cambridge') THEN ISNULL(b.RoomCost, 0)
              ELSE 0 
            END) AS rm,                            -- ✅ NULL 安全
        SUM(ISNULL(b.OtherCost, 0)) AS otherCost,  -- ✅ NULL 安全
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
    -- 4. 对比汇总结果
    ---------------------------------------------------------------
    SELECT 
        c.HotelCode,
        c.HotelName,
        c.PMSType,
        c.PropertyType,
        bi.bdate,
        bi.occ AS BI间夜,
        crs.occ AS CRS间夜,
        bi.rm AS BI金额,
        crs.rm AS CRS金额,
        ROUND(ISNULL(crs.rm,0) - ISNULL(bi.rm,0), 2) AS 金额差,     -- ✅ 保留两位小数
        CASE 
            WHEN ISNULL(bi.rm,0) = 0 THEN NULL
            ELSE ROUND(((ISNULL(crs.rm,0) - ISNULL(bi.rm,0)) / ISNULL(bi.rm,1)) * 100, 0)  -- ✅ 百分比取整
        END AS 相差百分比
    FROM #BIData bi
    LEFT JOIN #CRSData crs 
        ON bi.hotelid = crs.hotelid 
       AND bi.bdate = crs.bdate
    INNER JOIN [CrsStar ].dbo.StarHotelBaseInfo c
        ON bi.hotelid = c.HotelCode
    WHERE 
        c.PMSType IN ('XMS', 'x6', 'Cambridge')
        --AND (
            --ISNULL(bi.occ,0) <> ISNULL(crs.occ,0) 
            --OR ABS(ISNULL(crs.rm,0) - ISNULL(bi.rm,0)) > (ISNULL(bi.rm,0) * @DiffPct / 100.0)
        --)
        --AND bi.hotelid NOT IN ('JG0086','JG0089','JL0003')
    ORDER BY bi.bdate, c.PMSType, c.HotelName;

END
```