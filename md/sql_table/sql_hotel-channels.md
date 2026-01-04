#渠道信息的查询SQL语句
sql
```
SELECT
    h.HotelCode AS 酒店编号,
    h.HotelName AS 酒店名称,
    h.GroupCode AS 管理公司,
    h.HotelType AS 酒店类型,
    h.PropertyType AS 产权类型,
    h.PMSType AS PMS类型,
    h.Area AS 大区,
    h.UrbanArea AS 城区,
    h.MDMProvince AS 省份,
    h.MDMCity AS 城市,
    h.Status AS 状态,
    h.IsDelete AS 是否删除,
    r.ChannelCode AS 渠道代码
    r.ChannelName AS 渠道名称
FROM [CrsStar].dbo.StarHotelBaseInfo h
LEFT JOIN [CrsStar].dbo.SOP_StarChannelInfo_Brand r ON h.GroupCode = r.BrandCode
ORDER BY h.HotelCode, r.ChannelCode;
```