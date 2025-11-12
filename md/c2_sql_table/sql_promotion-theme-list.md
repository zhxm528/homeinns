#sql语句
sql
```
SELECT 
    -- 🔹 活动主题表字段
    t.ID AS TitleID,
    t.Title,
    t.Describe,
    t.CategoryId,
    t.OTAType,
    t.ApprStatus,
    t.StartDate,
    t.EndDate,

    -- 🔹 明细表字段
    d.ID AS DetailID,
    d.PromotionType,
    d.PolicyFormulaID,
    d.TitleType,

    -- 🔹 品牌归属表字段
    g.ID AS GroupID,
    g.DeptCode

FROM [192.168.210.73].[SalePromotion].dbo.SalesPromotionTitle AS t WITH (NOLOCK)
LEFT JOIN [192.168.210.73].[SalePromotion].dbo.SalesPromotionTitleDetail AS d WITH (NOLOCK)
    ON t.ID = d.SalesPromotionTitleID
LEFT JOIN [192.168.210.73].[SalePromotion].dbo.SalesPromotion_Rule_Group AS g WITH (NOLOCK)
    ON t.ID = g.SalesPromotionTitleID

WHERE 1 = 1
    -- 🔸 活动主题过滤条件
    AND (t.Title LIKE N'%促销%' OR t.Describe LIKE N'%促销%')
    AND t.CategoryId IN ('1', '2')
    AND t.OTAType IN ('1', '2')
    AND t.ApprStatus IN ('1', '2')

    -- 🔸 明细表过滤条件
    AND d.PromotionType IN ('1', '2')
    AND d.PolicyFormulaID IN ('1', '2')
    AND d.TitleType IN ('1', '2')

    -- 🔸 品牌归属表过滤条件
    AND g.DeptCode IN ('1', '2')

ORDER BY t.Title, g.DeptCode, d.PromotionType;
```