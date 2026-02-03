import { NextRequest, NextResponse } from 'next/server';
import { executeQuery, initDatabase, getPool } from '@/lib/38/database';
import { TABLE_NAMES } from '@/lib/38/config';

const ORDER_TABLE = '[CrsStar].dbo.MemberChildOrderRecord';
const DAILY_RATE_TABLE = '[CrsStar].dbo.MemberChildOrderRecordDailyRate';
const CHANNEL_ORDER_TABLE = '[CrsStar].dbo.View_StarOrderRoom_All';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pageInput = Number(searchParams.get('page') || 1);
    const page = Number.isNaN(pageInput) ? 1 : Math.max(1, pageInput);
    const pageSizeInput = Number(searchParams.get('pageSize') || 10);
    const pageSize = Number.isNaN(pageSizeInput) ? 10 : Math.min(Math.max(pageSizeInput, 1), 500);

    const filters = {
      GroupCode: searchParams.get('GroupCode') || undefined,
      HotelCd: searchParams.get('HotelCd') || undefined,
      HotelName: searchParams.get('HotelName') || undefined,
      ResvType: searchParams.get('ResvType') || undefined,
      AgentCd: searchParams.get('AgentCd') || undefined,
      Marketplace: searchParams.get('Marketplace') || undefined,
      RateCode: searchParams.get('RateCode') || undefined,
      RoomCode: searchParams.get('RoomCode') || undefined,
      RoomNightNum: searchParams.get('RoomNightNum') || undefined,
      RoomAmount: searchParams.get('RoomAmount') || undefined,
      ArrDateStart: searchParams.get('ArrDateStart') || undefined,
      ArrDateEnd: searchParams.get('ArrDateEnd') || undefined,
      DepDateStart: searchParams.get('DepDateStart') || undefined,
      DepDateEnd: searchParams.get('DepDateEnd') || undefined,
      Rooms: searchParams.get('Rooms') || undefined,
      Member: searchParams.get('Member') || undefined,
      PayType: searchParams.get('PayType') || undefined,
      ParentOrderNo: searchParams.get('ParentOrderNo') || undefined,
      PMSOrderNo: searchParams.get('PMSOrderNo') || undefined,
      ThirdOrderNo: searchParams.get('ThirdOrderNo') || undefined,
      rsvDatetimeStart: searchParams.get('rsvDatetimeStart') || undefined,
      rsvDatetimeEnd: searchParams.get('rsvDatetimeEnd') || undefined,
      sta: searchParams.get('sta') || undefined,
    };

    try {
      getPool();
    } catch {
      await initDatabase();
    }

    const conditions: string[] = ['m.IsDel = 0', '(m.sta IS NULL OR m.sta <> \'C\')'];
    const params: any[] = [];
    let paramIndex = 0;

    const pushParam = (sql: string, value: any) => {
      conditions.push(sql.replace('{param}', `@param${paramIndex}`));
      params.push(value);
      paramIndex += 1;
    };

    if (filters.GroupCode) {
      pushParam('h.GroupCode = {param}', filters.GroupCode);
    }
    if (filters.HotelCd) {
      pushParam('m.HotelCd = {param}', filters.HotelCd);
    }
    if (filters.HotelName) {
      pushParam('h.HotelName LIKE {param}', `%${filters.HotelName}%`);
    }
    if (filters.ResvType) {
      pushParam('v.ResvType = {param}', filters.ResvType);
    }
    if (filters.AgentCd) {
      pushParam('COALESCE(m.AgentCd, v.AgentCd) = {param}', filters.AgentCd);
    }
    if (filters.Marketplace) {
      pushParam('m.Marketplace LIKE {param}', `%${filters.Marketplace}%`);
    }
    if (filters.RateCode) {
      pushParam('m.RateCode = {param}', filters.RateCode);
    }
    if (filters.RoomCode) {
      pushParam('m.RoomCode = {param}', filters.RoomCode);
    }
    if (filters.RoomNightNum) {
      const value = Number(filters.RoomNightNum);
      if (!Number.isNaN(value)) {
        pushParam('COALESCE(dr.RoomNightNum, 0) = {param}', value);
      }
    }
    if (filters.RoomAmount) {
      const value = Number(filters.RoomAmount);
      if (!Number.isNaN(value)) {
        pushParam('COALESCE(dr.RoomAmount, 0) = {param}', value);
      }
    }
    if (filters.ArrDateStart) {
      pushParam('m.ArrDate >= {param}', filters.ArrDateStart);
    }
    if (filters.ArrDateEnd) {
      pushParam('m.ArrDate < DATEADD(day, 1, {param})', filters.ArrDateEnd);
    }
    if (filters.DepDateStart) {
      pushParam('m.DepDate >= {param}', filters.DepDateStart);
    }
    if (filters.DepDateEnd) {
      pushParam('m.DepDate < DATEADD(day, 1, {param})', filters.DepDateEnd);
    }
    if (filters.Rooms) {
      const value = Number(filters.Rooms);
      if (!Number.isNaN(value)) {
        pushParam('m.Rooms = {param}', value);
      }
    }
    if (filters.Member) {
      pushParam('m.MemberCardId = {param}', filters.Member);
    }
    if (filters.PayType) {
      pushParam('m.PayType = {param}', filters.PayType);
    }
    if (filters.ParentOrderNo) {
      pushParam('m.ParentOrderNo LIKE {param}', `%${filters.ParentOrderNo}%`);
    }
    if (filters.PMSOrderNo) {
      pushParam('m.PMSOrderNo LIKE {param}', `%${filters.PMSOrderNo}%`);
    }
    if (filters.ThirdOrderNo) {
      pushParam('m.ThirdOrderNo LIKE {param}', `%${filters.ThirdOrderNo}%`);
    }
    if (filters.rsvDatetimeStart) {
      pushParam('m.rsvDatetime >= {param}', filters.rsvDatetimeStart);
    }
    if (filters.rsvDatetimeEnd) {
      pushParam('m.rsvDatetime < DATEADD(day, 1, {param})', filters.rsvDatetimeEnd);
    }
    if (filters.sta) {
      pushParam('m.sta = {param}', filters.sta);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const baseCte = `
      WITH base AS (
        SELECT
          h.GroupCode AS GroupCode,
          m.HotelCd AS HotelCd,
          h.HotelName AS HotelName,
          v.ResvType AS ResvType,
          COALESCE(m.AgentCd, v.AgentCd) AS AgentCd,
          m.Marketplace AS Marketplace,
          m.RateCode AS RateCode,
          m.RoomCode AS RoomCode,
          COALESCE(dr.RoomNightNum, 0) AS RoomNightNum,
          COALESCE(dr.RoomAmount, 0) AS RoomAmount,
          m.ArrDate AS ArrDate,
          m.DepDate AS DepDate,
          m.Rooms AS Rooms,
          m.MemberCardId AS Member,
          m.PayType AS PayType,
          m.ParentOrderNo AS ParentOrderNo,
          m.PMSOrderNo AS PMSOrderNo,
          m.ThirdOrderNo AS ThirdOrderNo,
          m.rsvDatetime AS rsvDatetime,
          m.sta AS sta
        FROM ${ORDER_TABLE} m
        LEFT JOIN ${CHANNEL_ORDER_TABLE} v
          ON v.OrderNo = m.ParentOrderNo
        LEFT JOIN ${TABLE_NAMES.HOTEL_BASE_INFO} h
          ON h.HotelCode = m.HotelCd
        LEFT JOIN (
          SELECT
            ParentOrderNo,
            SUM(RoomNightNum) AS RoomNightNum,
            SUM(XFRoomCost) AS RoomAmount
          FROM ${DAILY_RATE_TABLE}
          GROUP BY ParentOrderNo
        ) dr
          ON dr.ParentOrderNo = m.ParentOrderNo
        ${whereClause}
      )
    `;

    const countSql = `
      ${baseCte}
      SELECT COUNT(1) AS total FROM base
    `;

    const statusCountsSql = `
      ${baseCte}
      SELECT TOP 6
        COALESCE(NULLIF(LTRIM(RTRIM(sta)), ''), '未填写') AS name,
        COUNT(1) AS value
      FROM base
      GROUP BY COALESCE(NULLIF(LTRIM(RTRIM(sta)), ''), '未填写')
      ORDER BY COUNT(1) DESC
    `;

    const resvTypeCountsSql = `
      ${baseCte}
      SELECT TOP 6
        COALESCE(NULLIF(LTRIM(RTRIM(ResvType)), ''), '未填写') AS name,
        COUNT(1) AS value
      FROM base
      GROUP BY COALESCE(NULLIF(LTRIM(RTRIM(ResvType)), ''), '未填写')
      ORDER BY COUNT(1) DESC
    `;

    const agentCountsSql = `
      ${baseCte}
      SELECT TOP 8
        COALESCE(NULLIF(LTRIM(RTRIM(AgentCd)), ''), '未填写') AS name,
        COUNT(1) AS value
      FROM base
      GROUP BY COALESCE(NULLIF(LTRIM(RTRIM(AgentCd)), ''), '未填写')
      ORDER BY COUNT(1) DESC
    `;

    const marketplaceCountsSql = `
      ${baseCte}
      SELECT TOP 8
        COALESCE(NULLIF(LTRIM(RTRIM(Marketplace)), ''), '未填写') AS name,
        COUNT(1) AS value
      FROM base
      GROUP BY COALESCE(NULLIF(LTRIM(RTRIM(Marketplace)), ''), '未填写')
      ORDER BY COUNT(1) DESC
    `;

    const hotelCountsSql = `
      ${baseCte}
      SELECT TOP 8
        COALESCE(NULLIF(LTRIM(RTRIM(HotelCd)), ''), '未填写') AS name,
        COUNT(1) AS value
      FROM base
      GROUP BY COALESCE(NULLIF(LTRIM(RTRIM(HotelCd)), ''), '未填写')
      ORDER BY COUNT(1) DESC
    `;

    const payTypeCountsSql = `
      ${baseCte}
      SELECT TOP 6
        COALESCE(NULLIF(LTRIM(RTRIM(PayType)), ''), '未填写') AS name,
        COUNT(1) AS value
      FROM base
      GROUP BY COALESCE(NULLIF(LTRIM(RTRIM(PayType)), ''), '未填写')
      ORDER BY COUNT(1) DESC
    `;

    const dataSql = `
      ${baseCte}
      SELECT *
      FROM base
      ORDER BY rsvDatetime DESC, ParentOrderNo
      OFFSET ${(page - 1) * pageSize} ROWS
      FETCH NEXT ${pageSize} ROWS ONLY
    `;

    const countResult = await executeQuery<{ total: number }>(countSql, params.length > 0 ? params : undefined);
    const total = countResult?.[0]?.total ?? 0;
    const records = await executeQuery(dataSql, params.length > 0 ? params : undefined);
    const statusCounts = await executeQuery<{ name: string; value: number }>(
      statusCountsSql,
      params.length > 0 ? params : undefined
    );
    const resvTypeCounts = await executeQuery<{ name: string; value: number }>(
      resvTypeCountsSql,
      params.length > 0 ? params : undefined
    );
    const agentCounts = await executeQuery<{ name: string; value: number }>(
      agentCountsSql,
      params.length > 0 ? params : undefined
    );
    const marketplaceCounts = await executeQuery<{ name: string; value: number }>(
      marketplaceCountsSql,
      params.length > 0 ? params : undefined
    );
    const hotelCounts = await executeQuery<{ name: string; value: number }>(
      hotelCountsSql,
      params.length > 0 ? params : undefined
    );
    const payTypeCounts = await executeQuery<{ name: string; value: number }>(
      payTypeCountsSql,
      params.length > 0 ? params : undefined
    );

    return NextResponse.json({
      success: true,
      data: records,
      total,
      page,
      pageSize,
      stats: {
        statusCounts,
        resvTypeCounts,
        agentCounts,
        marketplaceCounts,
        hotelCounts,
        payTypeCounts,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message || '查询失败',
        data: [],
        total: 0,
      },
      { status: 500 }
    );
  }
}
