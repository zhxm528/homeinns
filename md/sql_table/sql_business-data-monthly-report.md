#sql语句
```sql
WITH MonthlyData AS (
    SELECT 
        b.HotelName,
        b.GroupCode,
        b.PMSType,
        b.PropertyType,
        b.MDMCity,
        MONTH(a.bdate) AS MonthNum,

        SUM(a.rms_ttl) AS rms_ttl,
        SUM(a.rms_occ) AS rms_occ,
        SUM(a.rev_rm) AS rev_rm,
        SUM(a.rev_fb) AS rev_fb,
        SUM(a.rev_ot) AS rev_ot
    FROM [192.168.210.170].[Report].dbo.bi_ttl AS a
    INNER JOIN [CrsStar].dbo.StarHotelBaseInfo AS b 
        ON a.hotelid = b.HotelCode
    WHERE 
        a.bdate BETWEEN '2025-01-01' AND '2025-12-31'
        AND a.class = 'total'
        AND b.GroupCode IN ('NH','JL','JG','NY','KP','NI','NU')
        AND b.HotelCode LIKE '%JG%'
        AND b.HotelName LIKE '%建国%'
        AND b.Status = 1
        AND b.IsDelete = 0
        AND b.Area IN ('10000017')
        AND b.UrbanArea IN ('10000083')
        AND b.MDMProvince IN ('110000')
        AND b.MDMCity IN ('010000')
    GROUP BY 
        b.HotelName,
        b.GroupCode,
        b.PMSType,
        b.PropertyType,
        b.MDMCity,
        MONTH(a.bdate)
)
SELECT
    HotelName,
    GroupCode,
    PMSType,
    PropertyType,
    MDMCity,

    /* -------------------- 1 月 -------------------- */
    SUM(CASE WHEN MonthNum = 1 THEN rev_rm + rev_fb + rev_ot ELSE 0 END) AS Jan_Total,
    SUM(CASE WHEN MonthNum = 1 THEN rev_rm ELSE 0 END) AS Jan_Room,
    SUM(CASE WHEN MonthNum = 1 THEN rev_fb ELSE 0 END) AS Jan_FB,
    SUM(CASE WHEN MonthNum = 1 THEN rev_ot ELSE 0 END) AS Jan_Others,
    CASE WHEN SUM(CASE WHEN MonthNum = 1 THEN rms_ttl ELSE 0 END) > 0 THEN 
        CAST(SUM(CASE WHEN MonthNum = 1 THEN rms_occ ELSE 0 END)*1.0 /
             SUM(CASE WHEN MonthNum = 1 THEN rms_ttl ELSE 0 END) AS DECIMAL(10,4))
    ELSE 0 END AS Jan_OccRate,
    CASE WHEN SUM(CASE WHEN MonthNum = 1 THEN rms_occ ELSE 0 END) > 0 THEN 
        CAST(SUM(CASE WHEN MonthNum = 1 THEN rev_rm ELSE 0 END)*1.0 /
             SUM(CASE WHEN MonthNum = 1 THEN rms_occ ELSE 0 END) AS DECIMAL(10,2))
    ELSE 0 END AS Jan_ADR,
    CASE WHEN SUM(CASE WHEN MonthNum = 1 THEN rms_ttl ELSE 0 END) > 0 THEN 
        CAST(SUM(CASE WHEN MonthNum = 1 THEN rev_rm ELSE 0 END)*1.0 /
             SUM(CASE WHEN MonthNum = 1 THEN rms_ttl ELSE 0 END) AS DECIMAL(10,2))
    ELSE 0 END AS Jan_RevPAR,

    /* -------------------- 2 月 -------------------- */
    SUM(CASE WHEN MonthNum = 2 THEN rev_rm + rev_fb + rev_ot ELSE 0 END) AS Feb_Total,
    SUM(CASE WHEN MonthNum = 2 THEN rev_rm ELSE 0 END) AS Feb_Room,
    SUM(CASE WHEN MonthNum = 2 THEN rev_fb ELSE 0 END) AS Feb_FB,
    SUM(CASE WHEN MonthNum = 2 THEN rev_ot ELSE 0 END) AS Feb_Others,
    CASE WHEN SUM(CASE WHEN MonthNum = 2 THEN rms_ttl ELSE 0 END) > 0 THEN 
        CAST(SUM(CASE WHEN MonthNum = 2 THEN rms_occ ELSE 0 END)*1.0 /
             SUM(CASE WHEN MonthNum = 2 THEN rms_ttl ELSE 0 END) AS DECIMAL(10,4))
    ELSE 0 END AS Feb_OccRate,
    CASE WHEN SUM(CASE WHEN MonthNum = 2 THEN rms_occ ELSE 0 END) > 0 THEN 
        CAST(SUM(CASE WHEN MonthNum = 2 THEN rev_rm ELSE 0 END)*1.0 /
             SUM(CASE WHEN MonthNum = 2 THEN rms_occ ELSE 0 END) AS DECIMAL(10,2))
    ELSE 0 END AS Feb_ADR,
    CASE WHEN SUM(CASE WHEN MonthNum = 2 THEN rms_ttl ELSE 0 END) > 0 THEN 
        CAST(SUM(CASE WHEN MonthNum = 2 THEN rev_rm ELSE 0 END)*1.0 /
             SUM(CASE WHEN MonthNum = 2 THEN rms_ttl ELSE 0 END) AS DECIMAL(10,2))
    ELSE 0 END AS Feb_RevPAR,

    /* -------------------- 3 月 -------------------- */
    SUM(CASE WHEN MonthNum = 3 THEN rev_rm + rev_fb + rev_ot ELSE 0 END) AS Mar_Total,
    SUM(CASE WHEN MonthNum = 3 THEN rev_rm ELSE 0 END) AS Mar_Room,
    SUM(CASE WHEN MonthNum = 3 THEN rev_fb ELSE 0 END) AS Mar_FB,
    SUM(CASE WHEN MonthNum = 3 THEN rev_ot ELSE 0 END) AS Mar_Others,
    CASE WHEN SUM(CASE WHEN MonthNum = 3 THEN rms_ttl ELSE 0 END) > 0 THEN 
        CAST(SUM(CASE WHEN MonthNum = 3 THEN rms_occ ELSE 0 END)*1.0 /
             SUM(CASE WHEN MonthNum = 3 THEN rms_ttl ELSE 0 END) AS DECIMAL(10,4))
    ELSE 0 END AS Mar_OccRate,
    CASE WHEN SUM(CASE WHEN MonthNum = 3 THEN rms_occ ELSE 0 END) > 0 THEN 
        CAST(SUM(CASE WHEN MonthNum = 3 THEN rev_rm ELSE 0 END)*1.0 /
             SUM(CASE WHEN MonthNum = 3 THEN rms_occ ELSE 0 END) AS DECIMAL(10,2))
    ELSE 0 END AS Mar_ADR,
    CASE WHEN SUM(CASE WHEN MonthNum = 3 THEN rms_ttl ELSE 0 END) > 0 THEN 
        CAST(SUM(CASE WHEN MonthNum = 3 THEN rev_rm ELSE 0 END)*1.0 /
             SUM(CASE WHEN MonthNum = 3 THEN rms_ttl ELSE 0 END) AS DECIMAL(10,2))
    ELSE 0 END AS Mar_RevPAR,

    /* -------------------- 4 月 -------------------- */
    SUM(CASE WHEN MonthNum = 4 THEN rev_rm + rev_fb + rev_ot ELSE 0 END) AS Apr_Total,
    SUM(CASE WHEN MonthNum = 4 THEN rev_rm ELSE 0 END) AS Apr_Room,
    SUM(CASE WHEN MonthNum = 4 THEN rev_fb ELSE 0 END) AS Apr_FB,
    SUM(CASE WHEN MonthNum = 4 THEN rev_ot ELSE 0 END) AS Apr_Others,
    CASE WHEN SUM(CASE WHEN MonthNum = 4 THEN rms_ttl ELSE 0 END) > 0 THEN 
        CAST(SUM(CASE WHEN MonthNum = 4 THEN rms_occ ELSE 0 END)*1.0 /
             SUM(CASE WHEN MonthNum = 4 THEN rms_ttl ELSE 0 END) AS DECIMAL(10,4))
    ELSE 0 END AS Apr_OccRate,
    CASE WHEN SUM(CASE WHEN MonthNum = 4 THEN rms_occ ELSE 0 END) > 0 THEN 
        CAST(SUM(CASE WHEN MonthNum = 4 THEN rev_rm ELSE 0 END)*1.0 /
             SUM(CASE WHEN MonthNum = 4 THEN rms_occ ELSE 0 END) AS DECIMAL(10,2))
    ELSE 0 END AS Apr_ADR,
    CASE WHEN SUM(CASE WHEN MonthNum = 4 THEN rms_ttl ELSE 0 END) > 0 THEN 
        CAST(SUM(CASE WHEN MonthNum = 4 THEN rev_rm ELSE 0 END)*1.0 /
             SUM(CASE WHEN MonthNum = 4 THEN rms_ttl ELSE 0 END) AS DECIMAL(10,2))
    ELSE 0 END AS Apr_RevPAR,

    /* -------------------- 5 月 -------------------- */
    SUM(CASE WHEN MonthNum = 5 THEN rev_rm + rev_fb + rev_ot ELSE 0 END) AS May_Total,
    SUM(CASE WHEN MonthNum = 5 THEN rev_rm ELSE 0 END) AS May_Room,
    SUM(CASE WHEN MonthNum = 5 THEN rev_fb ELSE 0 END) AS May_FB,
    SUM(CASE WHEN MonthNum = 5 THEN rev_ot ELSE 0 END) AS May_Others,
    CASE WHEN SUM(CASE WHEN MonthNum = 5 THEN rms_ttl ELSE 0 END) > 0 THEN 
        CAST(SUM(CASE WHEN MonthNum = 5 THEN rms_occ ELSE 0 END)*1.0 /
             SUM(CASE WHEN MonthNum = 5 THEN rms_ttl ELSE 0 END) AS DECIMAL(10,4))
    ELSE 0 END AS May_OccRate,
    CASE WHEN SUM(CASE WHEN MonthNum = 5 THEN rms_occ ELSE 0 END) > 0 THEN 
        CAST(SUM(CASE WHEN MonthNum = 5 THEN rev_rm ELSE 0 END)*1.0 /
             SUM(CASE WHEN MonthNum = 5 THEN rms_occ ELSE 0 END) AS DECIMAL(10,2))
    ELSE 0 END AS May_ADR,
    CASE WHEN SUM(CASE WHEN MonthNum = 5 THEN rms_ttl ELSE 0 END) > 0 THEN 
        CAST(SUM(CASE WHEN MonthNum = 5 THEN rev_rm ELSE 0 END)*1.0 /
             SUM(CASE WHEN MonthNum = 5 THEN rms_ttl ELSE 0 END) AS DECIMAL(10,2))
    ELSE 0 END AS May_RevPAR,

    /* -------------------- 6 月 -------------------- */
    SUM(CASE WHEN MonthNum = 6 THEN rev_rm + rev_fb + rev_ot ELSE 0 END) AS Jun_Total,
    SUM(CASE WHEN MonthNum = 6 THEN rev_rm ELSE 0 END) AS Jun_Room,
    SUM(CASE WHEN MonthNum = 6 THEN rev_fb ELSE 0 END) AS Jun_FB,
    SUM(CASE WHEN MonthNum = 6 THEN rev_ot ELSE 0 END) AS Jun_Others,
    CASE WHEN SUM(CASE WHEN MonthNum = 6 THEN rms_ttl ELSE 0 END) > 0 THEN 
        CAST(SUM(CASE WHEN MonthNum = 6 THEN rms_occ ELSE 0 END)*1.0 /
             SUM(CASE WHEN MonthNum = 6 THEN rms_ttl ELSE 0 END) AS DECIMAL(10,4))
    ELSE 0 END AS Jun_OccRate,
    CASE WHEN SUM(CASE WHEN MonthNum = 6 THEN rms_occ ELSE 0 END) > 0 THEN 
        CAST(SUM(CASE WHEN MonthNum = 6 THEN rev_rm ELSE 0 END)*1.0 /
             SUM(CASE WHEN MonthNum = 6 THEN rms_occ ELSE 0 END) AS DECIMAL(10,2))
    ELSE 0 END AS Jun_ADR,
    CASE WHEN SUM(CASE WHEN MonthNum = 6 THEN rms_ttl ELSE 0 END) > 0 THEN 
        CAST(SUM(CASE WHEN MonthNum = 6 THEN rev_rm ELSE 0 END)*1.0 /
             SUM(CASE WHEN MonthNum = 6 THEN rms_ttl ELSE 0 END) AS DECIMAL(10,2))
    ELSE 0 END AS Jun_RevPAR,

    /* -------------------- 7 月 -------------------- */
    SUM(CASE WHEN MonthNum = 7 THEN rev_rm + rev_fb + rev_ot ELSE 0 END) AS Jul_Total,
    SUM(CASE WHEN MonthNum = 7 THEN rev_rm ELSE 0 END) AS Jul_Room,
    SUM(CASE WHEN MonthNum = 7 THEN rev_fb ELSE 0 END) AS Jul_FB,
    SUM(CASE WHEN MonthNum = 7 THEN rev_ot ELSE 0 END) AS Jul_Others,
    CASE WHEN SUM(CASE WHEN MonthNum = 7 THEN rms_ttl ELSE 0 END) > 0 THEN 
        CAST(SUM(CASE WHEN MonthNum = 7 THEN rms_occ ELSE 0 END)*1.0 /
             SUM(CASE WHEN MonthNum = 7 THEN rms_ttl ELSE 0 END) AS DECIMAL(10,4))
    ELSE 0 END AS Jul_OccRate,
    CASE WHEN SUM(CASE WHEN MonthNum = 7 THEN rms_occ ELSE 0 END) > 0 THEN 
        CAST(SUM(CASE WHEN MonthNum = 7 THEN rev_rm ELSE 0 END)*1.0 /
             SUM(CASE WHEN MonthNum = 7 THEN rms_occ ELSE 0 END) AS DECIMAL(10,2))
    ELSE 0 END AS Jul_ADR,
    CASE WHEN SUM(CASE WHEN MonthNum = 7 THEN rms_ttl ELSE 0 END) > 0 THEN 
        CAST(SUM(CASE WHEN MonthNum = 7 THEN rev_rm ELSE 0 END)*1.0 /
             SUM(CASE WHEN MonthNum = 7 THEN rms_ttl ELSE 0 END) AS DECIMAL(10,2))
    ELSE 0 END AS Jul_RevPAR,

    /* -------------------- 8 月 -------------------- */
    SUM(CASE WHEN MonthNum = 8 THEN rev_rm + rev_fb + rev_ot ELSE 0 END) AS Aug_Total,
    SUM(CASE WHEN MonthNum = 8 THEN rev_rm ELSE 0 END) AS Aug_Room,
    SUM(CASE WHEN MonthNum = 8 THEN rev_fb ELSE 0 END) AS Aug_FB,
    SUM(CASE WHEN MonthNum = 8 THEN rev_ot ELSE 0 END) AS Aug_Others,
    CASE WHEN SUM(CASE WHEN MonthNum = 8 THEN rms_ttl ELSE 0 END) > 0 THEN 
        CAST(SUM(CASE WHEN MonthNum = 8 THEN rms_occ ELSE 0 END)*1.0 /
             SUM(CASE WHEN MonthNum = 8 THEN rms_ttl ELSE 0 END) AS DECIMAL(10,4))
    ELSE 0 END AS Aug_OccRate,
    CASE WHEN SUM(CASE WHEN MonthNum = 8 THEN rms_occ ELSE 0 END) > 0 THEN 
        CAST(SUM(CASE WHEN MonthNum = 8 THEN rev_rm ELSE 0 END)*1.0 /
             SUM(CASE WHEN MonthNum = 8 THEN rms_occ ELSE 0 END) AS DECIMAL(10,2))
    ELSE 0 END AS Aug_ADR,
    CASE WHEN SUM(CASE WHEN MonthNum = 8 THEN rms_ttl ELSE 0 END) > 0 THEN 
        CAST(SUM(CASE WHEN MonthNum = 8 THEN rev_rm ELSE 0 END)*1.0 /
             SUM(CASE WHEN MonthNum = 8 THEN rms_ttl ELSE 0 END) AS DECIMAL(10,2))
    ELSE 0 END AS Aug_RevPAR,

    /* -------------------- 9 月 -------------------- */
    SUM(CASE WHEN MonthNum = 9 THEN rev_rm + rev_fb + rev_ot ELSE 0 END) AS Sep_Total,
    SUM(CASE WHEN MonthNum = 9 THEN rev_rm ELSE 0 END) AS Sep_Room,
    SUM(CASE WHEN MonthNum = 9 THEN rev_fb ELSE 0 END) AS Sep_FB,
    SUM(CASE WHEN MonthNum = 9 THEN rev_ot ELSE 0 END) AS Sep_Others,
    CASE WHEN SUM(CASE WHEN MonthNum = 9 THEN rms_ttl ELSE 0 END) > 0 THEN 
        CAST(SUM(CASE WHEN MonthNum = 9 THEN rms_occ ELSE 0 END)*1.0 /
             SUM(CASE WHEN MonthNum = 9 THEN rms_ttl ELSE 0 END) AS DECIMAL(10,4))
    ELSE 0 END AS Sep_OccRate,
    CASE WHEN SUM(CASE WHEN MonthNum = 9 THEN rms_occ ELSE 0 END) > 0 THEN 
        CAST(SUM(CASE WHEN MonthNum = 9 THEN rev_rm ELSE 0 END)*1.0 /
             SUM(CASE WHEN MonthNum = 9 THEN rms_occ ELSE 0 END) AS DECIMAL(10,2))
    ELSE 0 END AS Sep_ADR,
    CASE WHEN SUM(CASE WHEN MonthNum = 9 THEN rms_ttl ELSE 0 END) > 0 THEN 
        CAST(SUM(CASE WHEN MonthNum = 9 THEN rev_rm ELSE 0 END)*1.0 /
             SUM(CASE WHEN MonthNum = 9 THEN rms_ttl ELSE 0 END) AS DECIMAL(10,2))
    ELSE 0 END AS Sep_RevPAR,

    /* -------------------- 10 月 -------------------- */
    SUM(CASE WHEN MonthNum = 10 THEN rev_rm + rev_fb + rev_ot ELSE 0 END) AS Oct_Total,
    SUM(CASE WHEN MonthNum = 10 THEN rev_rm ELSE 0 END) AS Oct_Room,
    SUM(CASE WHEN MonthNum = 10 THEN rev_fb ELSE 0 END) AS Oct_FB,
    SUM(CASE WHEN MonthNum = 10 THEN rev_ot ELSE 0 END) AS Oct_Others,
    CASE WHEN SUM(CASE WHEN MonthNum = 10 THEN rms_ttl ELSE 0 END) > 0 THEN 
        CAST(SUM(CASE WHEN MonthNum = 10 THEN rms_occ ELSE 0 END)*1.0 /
             SUM(CASE WHEN MonthNum = 10 THEN rms_ttl ELSE 0 END) AS DECIMAL(10,4))
    ELSE 0 END AS Oct_OccRate,
    CASE WHEN SUM(CASE WHEN MonthNum = 10 THEN rms_occ ELSE 0 END) > 0 THEN 
        CAST(SUM(CASE WHEN MonthNum = 10 THEN rev_rm ELSE 0 END)*1.0 /
             SUM(CASE WHEN MonthNum = 10 THEN rms_occ ELSE 0 END) AS DECIMAL(10,2))
    ELSE 0 END AS Oct_ADR,
    CASE WHEN SUM(CASE WHEN MonthNum = 10 THEN rms_ttl ELSE 0 END) > 0 THEN 
        CAST(SUM(CASE WHEN MonthNum = 10 THEN rev_rm ELSE 0 END)*1.0 /
             SUM(CASE WHEN MonthNum = 10 THEN rms_ttl ELSE 0 END) AS DECIMAL(10,2))
    ELSE 0 END AS Oct_RevPAR,

    /* -------------------- 11 月 -------------------- */
    SUM(CASE WHEN MonthNum = 11 THEN rev_rm + rev_fb + rev_ot ELSE 0 END) AS Nov_Total,
    SUM(CASE WHEN MonthNum = 11 THEN rev_rm ELSE 0 END) AS Nov_Room,
    SUM(CASE WHEN MonthNum = 11 THEN rev_fb ELSE 0 END) AS Nov_FB,
    SUM(CASE WHEN MonthNum = 11 THEN rev_ot ELSE 0 END) AS Nov_Others,
    CASE WHEN SUM(CASE WHEN MonthNum = 11 THEN rms_ttl ELSE 0 END) > 0 THEN 
        CAST(SUM(CASE WHEN MonthNum = 11 THEN rms_occ ELSE 0 END)*1.0 /
             SUM(CASE WHEN MonthNum = 11 THEN rms_ttl ELSE 0 END) AS DECIMAL(10,4))
    ELSE 0 END AS Nov_OccRate,
    CASE WHEN SUM(CASE WHEN MonthNum = 11 THEN rms_occ ELSE 0 END) > 0 THEN 
        CAST(SUM(CASE WHEN MonthNum = 11 THEN rev_rm ELSE 0 END)*1.0 /
             SUM(CASE WHEN MonthNum = 11 THEN rms_occ ELSE 0 END) AS DECIMAL(10,2))
    ELSE 0 END AS Nov_ADR,
    CASE WHEN SUM(CASE WHEN MonthNum = 11 THEN rms_ttl ELSE 0 END) > 0 THEN 
        CAST(SUM(CASE WHEN MonthNum = 11 THEN rev_rm ELSE 0 END)*1.0 /
             SUM(CASE WHEN MonthNum = 11 THEN rms_ttl ELSE 0 END) AS DECIMAL(10,2))
    ELSE 0 END AS Nov_RevPAR,

    /* -------------------- 12 月 -------------------- */
    SUM(CASE WHEN MonthNum = 12 THEN rev_rm + rev_fb + rev_ot ELSE 0 END) AS Dec_Total,
    SUM(CASE WHEN MonthNum = 12 THEN rev_rm ELSE 0 END) AS Dec_Room,
    SUM(CASE WHEN MonthNum = 12 THEN rev_fb ELSE 0 END) AS Dec_FB,
    SUM(CASE WHEN MonthNum = 12 THEN rev_ot ELSE 0 END) AS Dec_Others,
    CASE WHEN SUM(CASE WHEN MonthNum = 12 THEN rms_ttl ELSE 0 END) > 0 THEN 
        CAST(SUM(CASE WHEN MonthNum = 12 THEN rms_occ ELSE 0 END)*1.0 /
             SUM(CASE WHEN MonthNum = 12 THEN rms_ttl ELSE 0 END) AS DECIMAL(10,4))
    ELSE 0 END AS Dec_OccRate,
    CASE WHEN SUM(CASE WHEN MonthNum = 12 THEN rms_occ ELSE 0 END) > 0 THEN 
        CAST(SUM(CASE WHEN MonthNum = 12 THEN rev_rm ELSE 0 END)*1.0 /
             SUM(CASE WHEN MonthNum = 12 THEN rms_occ ELSE 0 END) AS DECIMAL(10,2))
    ELSE 0 END AS Dec_ADR,
    CASE WHEN SUM(CASE WHEN MonthNum = 12 THEN rms_ttl ELSE 0 END) > 0 THEN 
        CAST(SUM(CASE WHEN MonthNum = 12 THEN rev_rm ELSE 0 END)*1.0 /
             SUM(CASE WHEN MonthNum = 12 THEN rms_ttl ELSE 0 END) AS DECIMAL(10,2))
    ELSE 0 END AS Dec_RevPAR,

    /* -------------------- 全年合计 -------------------- */
    SUM(rev_rm + rev_fb + rev_ot) AS Year_Total,
    SUM(rev_rm) AS Year_Room,
    SUM(rev_fb) AS Year_FB,
    SUM(rev_ot) AS Year_Others,

    CASE WHEN SUM(rms_ttl) > 0 THEN 
        CAST(SUM(rms_occ)*1.0 / SUM(rms_ttl) AS DECIMAL(10,4))
    ELSE 0 END AS Year_OccRate,

    CASE WHEN SUM(rms_occ) > 0 THEN 
        CAST(SUM(rev_rm)*1.0 / SUM(rms_occ) AS DECIMAL(10,2))
    ELSE 0 END AS Year_ADR,

    CASE WHEN SUM(rms_ttl) > 0 THEN 
        CAST(SUM(rev_rm)*1.0 / SUM(rms_ttl) AS DECIMAL(10,2))
    ELSE 0 END AS Year_RevPAR

FROM MonthlyData
GROUP BY 
    HotelName,
    GroupCode,
    PMSType,
    PropertyType,
    MDMCity;

```