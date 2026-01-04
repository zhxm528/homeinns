#sql语句
```sql
--检查科目配置是否符合每日实际收入情况
DECLARE @BDate date = '2025-09-26';  -- 起始日
DECLARE @Days  int  = 1;            -- 天数窗口；想查当天可设为 1
DECLARE @End   date = DATEADD(DAY, @Days, @BDate);

;WITH hotels AS (
    SELECT DISTINCT
        LTRIM(RTRIM(HotelCode)) AS hotelid,
        LTRIM(RTRIM(HotelName)) AS hotelName
    FROM [CrsStar].dbo.StarHotelBaseInfo WITH (NOLOCK)
    WHERE GroupCode IN ('NH','JL','JG','NY','KP','NI')
      -- AND isDelete = 0 AND status = 1   -- 需要时放开
      -- AND HotelCode = 'JG0030' 
      AND HotelCode NOT IN ('JG0017','JG0024','JG0051','JG0056','JG0061','JG0063','JG0064','JG0066','JG0068','JG0071','JG0072','JG0075','JG0081','JG0096','JG0101','JG0108','JL0005','JL0007','JL0009','JL0013')
),
src AS (
    SELECT DISTINCT
        LTRIM(RTRIM(h.hotelid))   AS hotelid,
        LTRIM(RTRIM(hs.hotelName)) AS hotelName,
        LTRIM(RTRIM(h.class1))    AS class1,
        h.dept                    AS dept,
        h.deptname                AS deptname,
        LTRIM(RTRIM(h.descript1)) AS descript1
    FROM [192.168.210.170].[Report].dbo.bi_htlrev AS h WITH (NOLOCK)
    JOIN hotels AS hs
      ON hs.hotelid = LTRIM(RTRIM(h.hotelid))
    WHERE h.bdate >= @BDate AND h.bdate < @End
      AND (h.descript1 not like '%-%' and h.descript1 not like '%合计%' and h.descript1 not like '%人均%') 
      AND (h.deptname = 'FB' or h.deptname = '餐饮')            -- 默认库大多 CI，不区分大小写；如需容错，可保留 TRIM
      AND ISNULL(h.class1,'') <> ''          -- 仅过滤空/NULL；TRIM 保留在选择列中
)
SELECT s.hotelid, s.hotelName, s.class1, s.descript1, s.dept, s.deptname
FROM src AS s
WHERE NOT EXISTS (
    SELECT 1
    FROM [192.168.210.170].[Report].dbo.TransCodeConfig AS t WITH (NOLOCK)
    WHERE t.hotelid = s.hotelid
      AND t.class1  = s.class1                -- 按你要求：仅按 class1 判断是否已配置
)
ORDER BY s.hotelid, s.class1;
```