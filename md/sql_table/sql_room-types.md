#房型信息的查询SQL语句
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
    r.RoomTypeClass AS 房型大类代码,
    r.RoomTypeCode AS 房型代码,
    r.RoomTypeName AS 房型名称,
    r.Number AS 房型人数,
    r.Area AS 房型面积,
    r.isValid AS 房型状态,
    r.IsDelete AS 房型是否删除
FROM [CrsStar].dbo.StarHotelBaseInfo h
LEFT JOIN [CrsStar].dbo.StarRoomInfo r ON h.HotelCode = r.HotelCode
ORDER BY h.HotelCode, r.RoomTypeCode;
```