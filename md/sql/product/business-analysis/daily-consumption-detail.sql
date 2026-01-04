-- 每日消费明细查询SQL
-- 参数说明：
-- @StartDate: 起始日期（格式：'YYYY-MM-DD'）
-- @EndDate: 结束日期（格式：'YYYY-MM-DD'）
-- @HotelIds: 酒店代码列表（逗号分隔，如：'JG0001,JG0002,JL0001'），为空则查询所有酒店
-- @Dept: 部门代码（可选，如：'rm'=客房，'fb'=餐饮，'ot'=其他，'ri'=租赁），为空则查询所有部门
-- @Class1: 一级科目代码（可选），为空则查询所有科目

DECLARE @StartDate date = '2025-01-01';  -- 起始日期
DECLARE @EndDate   date = '2025-01-31';  -- 结束日期
DECLARE @HotelIds  varchar(MAX) = '';     -- 酒店代码列表，逗号分隔，如：'JG0001,JG0002,JL0001'，为空则查询所有酒店
DECLARE @Dept      varchar(50) = '';      -- 部门代码，可选：'rm'=客房，'fb'=餐饮，'ot'=其他，'ri'=租赁，为空则查询所有部门
DECLARE @Class1    varchar(50) = '';     -- 一级科目代码，为空则查询所有科目

-- 主查询
SELECT 
    CAST(h.bdate AS date) AS 业务日期,
    LTRIM(RTRIM(h.hotelid)) AS 酒店代码,
    LTRIM(RTRIM(b.HotelName)) AS 酒店名称,
    LTRIM(RTRIM(b.GroupCode)) AS 管理公司,
    LTRIM(RTRIM(h.dept)) AS 部门代码,
    LTRIM(RTRIM(h.deptname)) AS 部门名称,
    CASE h.dept
        WHEN 'fb' THEN N'餐饮收入'
        WHEN 'ot' THEN N'其他收入'
        WHEN 'rm' THEN N'客房收入'
        WHEN 'ri' THEN N'租赁'
        ELSE h.dept
    END AS 大类,
    LTRIM(RTRIM(h.class)) AS 二级分类代码,
    LTRIM(RTRIM(h.descript)) AS 二级分类名称,
    LTRIM(RTRIM(h.class1)) AS 一级科目代码,
    LTRIM(RTRIM(h.descript1)) AS 一级科目名称,
    ISNULL(h.amount, 0) AS 收入金额,
    ISNULL(h.rebate, 0) AS 冲减金额,
    ISNULL(h.amount, 0) - ISNULL(h.rebate, 0) AS 净收入金额,
    h.createtime AS 创建时间
FROM [192.168.210.170].[Report].dbo.bi_htlrev AS h WITH (NOLOCK)
LEFT JOIN [CrsStar].dbo.StarHotelBaseInfo AS b WITH (NOLOCK)
    ON LTRIM(RTRIM(h.hotelid)) = LTRIM(RTRIM(b.HotelCode))
WHERE h.bdate >= @StartDate 
  AND h.bdate <= @EndDate
  -- 过滤掉合计行和无效数据
  AND (h.descript1 NOT LIKE '%-%' AND h.descript1 NOT LIKE '%合计%' AND h.descript1 NOT LIKE '%人均%')
  AND ISNULL(h.class1, '') <> ''
  -- 酒店代码过滤（如果提供）
  AND (@HotelIds = '' OR h.hotelid IN (
      SELECT LTRIM(RTRIM(value))
      FROM STRING_SPLIT(@HotelIds, ',')
      WHERE LTRIM(RTRIM(value)) <> ''
  ))
  -- 部门过滤（如果提供）
  AND (@Dept = '' OR h.dept = @Dept)
  -- 科目过滤（如果提供）
  AND (@Class1 = '' OR h.class1 = @Class1)
ORDER BY 
    h.bdate,
    h.hotelid,
    h.dept,
    h.class1,
    h.class;
