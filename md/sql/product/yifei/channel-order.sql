;WITH base AS (
    SELECT
        a.OrderNo,
        a.HotelCd,
        h.HotelName,
        a.RateCode,
        a.RoomTypeCode,
        a.ArrDate,
        a.DepDate,
        a.RoomNum,
        ISNULL(a.ActualRt, 0) AS ActualRt,
        a.CrsStatus
    FROM CrsStar.dbo.View_StarOrderRoom_All AS a
    INNER JOIN CrsStar.dbo.StarHotelBaseInfo AS h WITH (NOLOCK)
        ON a.HotelCd = h.HotelCode
    WHERE
        h.GroupCode = 'YF'
        AND a.AgentCd = 'CHDBBK'
        AND a.CrsStatus <> 'C'
)
SELECT
    b.OrderNo,
    pms.PMSOrderNo,
    b.HotelCd,
    b.HotelName,
    b.RateCode,
    b.RoomTypeCode,
    b.ArrDate,
    b.DepDate,
    b.RoomNum,
    b.ActualRt,
    b.CrsStatus
FROM base AS b
OUTER APPLY (
    SELECT TOP (1)
        p.ChannelUniqueResID AS PMSOrderNo
    FROM CrsStar.dbo.View_StarOrderOtherRole_All AS p WITH (NOLOCK)
    WHERE
        p.OrderNo = b.OrderNo
        AND p.OrderType = 'PMS3OrderNo'
    ORDER BY
        p.ChannelUniqueResID DESC   -- 若有更可靠的时间/自增ID字段，建议替换这里
) AS pms;
