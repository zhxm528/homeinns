#手工填报酒店月报
##参数
-指定年月，用于查自然月的每一天的数据 bdate
-指定酒店范围 hotelid
##sql语句
sql
```
WITH src AS (
    SELECT
        h.hotelid,
        CASE h.dept
            WHEN 'fb' THEN N'餐饮收入'
            WHEN 'ot' THEN N'其他收入'
            WHEN 'rm' THEN N'客房收入'
            WHEN 'ri' THEN N'租赁'
            ELSE h.dept
        END AS 大类,
        h.class       AS 小类,
        h.descript    AS 小类名称,
        CAST(h.bdate AS date) AS bdate,
        ISNULL(h.amount,0)    AS amount
    FROM [Report].dbo.bi_htlrev AS h
    WHERE h.hotelid IN ('JG0110','KP0001','NI0001','NI0002','KP0002','NI0003')
      AND h.bdate >= CAST('2025-10-01' AS date)
      AND h.bdate <= CAST('2025-10-31' AS date)
),
agg AS (
    SELECT
        hotelid,
        大类,
        小类,
        小类名称,

        -- 2025-10-01 ~ 2025-10-31 每天一列
        SUM(CASE WHEN bdate = '2025-10-01' THEN amount ELSE 0 END) AS [2025-10-01],
        SUM(CASE WHEN bdate = '2025-10-02' THEN amount ELSE 0 END) AS [2025-10-02],
        SUM(CASE WHEN bdate = '2025-10-03' THEN amount ELSE 0 END) AS [2025-10-03],
        SUM(CASE WHEN bdate = '2025-10-04' THEN amount ELSE 0 END) AS [2025-10-04],
        SUM(CASE WHEN bdate = '2025-10-05' THEN amount ELSE 0 END) AS [2025-10-05],
        SUM(CASE WHEN bdate = '2025-10-06' THEN amount ELSE 0 END) AS [2025-10-06],
        SUM(CASE WHEN bdate = '2025-10-07' THEN amount ELSE 0 END) AS [2025-10-07],
        SUM(CASE WHEN bdate = '2025-10-08' THEN amount ELSE 0 END) AS [2025-10-08],
        SUM(CASE WHEN bdate = '2025-10-09' THEN amount ELSE 0 END) AS [2025-10-09],
        SUM(CASE WHEN bdate = '2025-10-10' THEN amount ELSE 0 END) AS [2025-10-10],
        SUM(CASE WHEN bdate = '2025-10-11' THEN amount ELSE 0 END) AS [2025-10-11],
        SUM(CASE WHEN bdate = '2025-10-12' THEN amount ELSE 0 END) AS [2025-10-12],
        SUM(CASE WHEN bdate = '2025-10-13' THEN amount ELSE 0 END) AS [2025-10-13],
        SUM(CASE WHEN bdate = '2025-10-14' THEN amount ELSE 0 END) AS [2025-10-14],
        SUM(CASE WHEN bdate = '2025-10-15' THEN amount ELSE 0 END) AS [2025-10-15],
        SUM(CASE WHEN bdate = '2025-10-16' THEN amount ELSE 0 END) AS [2025-10-16],
        SUM(CASE WHEN bdate = '2025-10-17' THEN amount ELSE 0 END) AS [2025-10-17],
        SUM(CASE WHEN bdate = '2025-10-18' THEN amount ELSE 0 END) AS [2025-10-18],
        SUM(CASE WHEN bdate = '2025-10-19' THEN amount ELSE 0 END) AS [2025-10-19],
        SUM(CASE WHEN bdate = '2025-10-20' THEN amount ELSE 0 END) AS [2025-10-20],
        SUM(CASE WHEN bdate = '2025-10-21' THEN amount ELSE 0 END) AS [2025-10-21],
        SUM(CASE WHEN bdate = '2025-10-22' THEN amount ELSE 0 END) AS [2025-10-22],
        SUM(CASE WHEN bdate = '2025-10-23' THEN amount ELSE 0 END) AS [2025-10-23],
        SUM(CASE WHEN bdate = '2025-10-24' THEN amount ELSE 0 END) AS [2025-10-24],
        SUM(CASE WHEN bdate = '2025-10-25' THEN amount ELSE 0 END) AS [2025-10-25],
        SUM(CASE WHEN bdate = '2025-10-26' THEN amount ELSE 0 END) AS [2025-10-26],
        SUM(CASE WHEN bdate = '2025-10-27' THEN amount ELSE 0 END) AS [2025-10-27],
        SUM(CASE WHEN bdate = '2025-10-28' THEN amount ELSE 0 END) AS [2025-10-28],
        SUM(CASE WHEN bdate = '2025-10-29' THEN amount ELSE 0 END) AS [2025-10-29],
        SUM(CASE WHEN bdate = '2025-10-30' THEN amount ELSE 0 END) AS [2025-10-30],
        SUM(CASE WHEN bdate = '2025-10-31' THEN amount ELSE 0 END) AS [2025-10-31],

        -- 在同一层计算分组标志位
        GROUPING(小类)     AS grp_小类,
        GROUPING(小类名称) AS grp_小类名称
    FROM src
    GROUP BY
        GROUPING SETS (
            (hotelid, 大类, 小类, 小类名称), -- 明细
            (hotelid, 大类)                 -- 大类小计
        )
)
SELECT
    hotelid AS 酒店,
    大类,
    CASE WHEN grp_小类 = 1 THEN N'小计' ELSE 小类 END         AS 小类,
    CASE WHEN grp_小类名称 = 1 THEN N'小计' ELSE 小类名称 END AS 小类名称,

    [2025-10-01],[2025-10-02],[2025-10-03],[2025-10-04],[2025-10-05],
    [2025-10-06],[2025-10-07],[2025-10-08],[2025-10-09],[2025-10-10],
    [2025-10-11],[2025-10-12],[2025-10-13],[2025-10-14],[2025-10-15],
    [2025-10-16],[2025-10-17],[2025-10-18],[2025-10-19],[2025-10-20],
    [2025-10-21],[2025-10-22],[2025-10-23],[2025-10-24],[2025-10-25],
    [2025-10-26],[2025-10-27],[2025-10-28],[2025-10-29],[2025-10-30],[2025-10-31]
FROM agg
ORDER BY
    hotelid,                    -- 第一排序：hotelid
    大类,
    CASE WHEN grp_小类 = 1 THEN 1 ELSE 0 END,  -- 小计行放在同组明细之后
    小类;
```