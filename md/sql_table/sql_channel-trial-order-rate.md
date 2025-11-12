#sql语句
sql
```
SELECT
    CAST(CreateTime AS DATE) AS 日期,

    -- CRS_CheckAvailable（试单）
    SUM(CASE WHEN FunName = 'CRS_CheckAvailable' THEN 1 ELSE 0 END) AS [试单总请求数],
    SUM(CASE WHEN FunName = 'CRS_CheckAvailable' AND Fail = '0' THEN 1 ELSE 0 END) AS [试单成功数],
    ROUND(
        SUM(CASE WHEN FunName = 'CRS_CheckAvailable' AND Fail = '0' THEN 1 ELSE 0 END) * 100.0 /
        NULLIF(SUM(CASE WHEN FunName = 'CRS_CheckAvailable' THEN 1 ELSE 0 END), 0),
        2
    ) AS [试单成功率],

    -- CRS_CreateOrder（下单）
    SUM(CASE WHEN FunName = 'CRS_CreateOrder' THEN 1 ELSE 0 END) AS [下单总请求数],
    SUM(CASE WHEN FunName = 'CRS_CreateOrder' AND Fail = '0' THEN 1 ELSE 0 END) AS [下单成功数],
    ROUND(
        SUM(CASE WHEN FunName = 'CRS_CreateOrder' AND Fail = '0' THEN 1 ELSE 0 END) * 100.0 /
        NULLIF(SUM(CASE WHEN FunName = 'CRS_CreateOrder' THEN 1 ELSE 0 END), 0),
        2
    ) AS [下单成功率]

FROM [192.168.210.170].[Report].dbo.P3MonitorNote
WHERE AgentCd = 'CTM'
  AND FunName IN ('CRS_CheckAvailable', 'CRS_CreateOrder')
  AND CAST(CreateTime AS DATE) BETWEEN '2025-10-10' AND '2025-10-15'
GROUP BY CAST(CreateTime AS DATE)
ORDER BY 日期;

```