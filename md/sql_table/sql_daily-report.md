#sql语句

```sql
SELECT 
    b.HotelName AS 酒店名称,
    b.GroupCode AS 管理公司,
    b.PMSType AS PMS类型,
    b.PropertyType AS 产权类型,
    b.MDMCity AS 城市编码,
    SUM(a.rms_ttl) AS 房间总数,
    SUM(a.rms_occ) AS 已入住房数,
    CAST(
        CASE WHEN SUM(a.rms_ttl) > 0 
            THEN SUM(a.rms_occ) * 1.0 / SUM(a.rms_ttl) 
            ELSE 0 END 
        AS DECIMAL(10,4)
    ) AS 出租率,
    CAST(
        CASE WHEN SUM(a.rms_occ) > 0 
            THEN SUM(a.rev_rm) * 1.0 / SUM(a.rms_occ) 
            ELSE 0 END 
        AS DECIMAL(10,2)
    ) AS 平均房价,
    CAST(
        CASE WHEN SUM(a.rms_ttl) > 0 
            THEN SUM(a.rev_rm) * 1.0 / SUM(a.rms_ttl) 
            ELSE 0 END 
        AS DECIMAL(10,2)
    ) AS 每房收益,
    SUM(a.rev_rm) AS 客房收入,
    SUM(a.rev_fb) AS 餐饮收入,
    SUM(a.rev_ot) AS 其他收入,
    SUM(a.rev_rm + a.rev_fb + a.rev_ot) AS 总收入
FROM [192.168.210.170].[Report].dbo.bi_ttl AS a
INNER JOIN [CrsStar].dbo.StarHotelBaseInfo AS b 
    ON a.hotelid = b.HotelCode
WHERE 
    a.bdate BETWEEN '2025-10-01' AND '2025-10-31'
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
    b.MDMCity;

```