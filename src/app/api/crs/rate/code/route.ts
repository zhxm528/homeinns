import { NextRequest, NextResponse } from 'next/server';
import { executeQuery, initDatabase, getPool } from '@/lib/38/database';
import { TABLE_NAMES } from '@/lib/38/config';

const RATE_CODE_TABLE = TABLE_NAMES.STAR_RATE_CODE_INFO;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number(searchParams.get('page') || 1));
    const pageSizeInput = Number(searchParams.get('pageSize') || 10);
    const pageSize = Number.isNaN(pageSizeInput)
      ? 10
      : Math.min(Math.max(pageSizeInput, 1), 500);

    const filters = {
      GroupCode: searchParams.get('GroupCode') || undefined,
      HotelCode: searchParams.get('HotelCode') || undefined,
      HotelName: searchParams.get('HotelName') || undefined,
      RateCode: searchParams.get('RateCode') || undefined,
      RateCodeName: searchParams.get('RateCodeName') || undefined,
      BeginDate: searchParams.get('BeginDate') || undefined,
      EndDate: searchParams.get('EndDate') || undefined,
      MinAdvBookin: searchParams.get('MinAdvBookin') || undefined,
      MaxAdvBookin: searchParams.get('MaxAdvBookin') || undefined,
      MinLos: searchParams.get('MinLos') || undefined,
      MaxLos: searchParams.get('MaxLos') || undefined,
      Market: searchParams.get('Market') || undefined,
      RoomTypeCode: searchParams.get('RoomTypeCode') || undefined,
      BlockCode: searchParams.get('BlockCode') || undefined,
      BeginTime: searchParams.get('BeginTime') || undefined,
      EndTime: searchParams.get('EndTime') || undefined,
      CommissionCode: searchParams.get('CommissionCode') || undefined,
    };

    try {
      getPool();
    } catch {
      await initDatabase();
    }

    const conditions: string[] = ['r.IsDelete = 0'];
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
    if (filters.HotelCode) {
      pushParam('r.HotelCode = {param}', filters.HotelCode);
    }
    if (filters.HotelName) {
      pushParam('h.HotelName LIKE {param}', `%${filters.HotelName}%`);
    }
    if (filters.RateCode) {
      pushParam('r.RateCode = {param}', filters.RateCode);
    }
    if (filters.RateCodeName) {
      pushParam('r.RateCodeName LIKE {param}', `%${filters.RateCodeName}%`);
    }
    if (filters.BeginDate) {
      pushParam('r.BeginDate >= {param}', filters.BeginDate);
    }
    if (filters.EndDate) {
      pushParam('r.EndDate <= {param}', filters.EndDate);
    }
    if (filters.MinAdvBookin) {
      const value = Number(filters.MinAdvBookin);
      if (!Number.isNaN(value)) {
        pushParam('r.MinAdvBookin >= {param}', value);
      }
    }
    if (filters.MaxAdvBookin) {
      const value = Number(filters.MaxAdvBookin);
      if (!Number.isNaN(value)) {
        pushParam('r.MaxAdvBookin <= {param}', value);
      }
    }
    if (filters.MinLos) {
      const value = Number(filters.MinLos);
      if (!Number.isNaN(value)) {
        pushParam('r.MinLos >= {param}', value);
      }
    }
    if (filters.MaxLos) {
      const value = Number(filters.MaxLos);
      if (!Number.isNaN(value)) {
        pushParam('r.MaxLos <= {param}', value);
      }
    }
    if (filters.Market) {
      pushParam('r.Market LIKE {param}', `%${filters.Market}%`);
    }
    if (filters.RoomTypeCode) {
      pushParam('r.RoomTypeCode LIKE {param}', `%${filters.RoomTypeCode}%`);
    }
    if (filters.BlockCode) {
      pushParam('r.BlockCode LIKE {param}', `%${filters.BlockCode}%`);
    }
    if (filters.BeginTime) {
      pushParam('r.BeginTime >= {param}', filters.BeginTime);
    }
    if (filters.EndTime) {
      pushParam('r.EndTime <= {param}', filters.EndTime);
    }
    if (filters.CommissionCode) {
      pushParam('r.CommissionCode LIKE {param}', `%${filters.CommissionCode}%`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const countSql = `
      SELECT COUNT(1) AS total
      FROM ${RATE_CODE_TABLE} r
      LEFT JOIN ${TABLE_NAMES.HOTEL_BASE_INFO} h
        ON h.HotelCode = r.HotelCode
      ${whereClause}
    `;

    const groupCountsSql = `
      SELECT TOP 6
        COALESCE(NULLIF(LTRIM(RTRIM(h.GroupCode)), ''), '未填写') AS name,
        COUNT(1) AS value
      FROM ${RATE_CODE_TABLE} r
      LEFT JOIN ${TABLE_NAMES.HOTEL_BASE_INFO} h
        ON h.HotelCode = r.HotelCode
      ${whereClause}
      GROUP BY COALESCE(NULLIF(LTRIM(RTRIM(h.GroupCode)), ''), '未填写')
      ORDER BY COUNT(1) DESC
    `;

    const marketCountsSql = `
      SELECT TOP 6
        COALESCE(NULLIF(LTRIM(RTRIM(r.Market)), ''), '未填写') AS name,
        COUNT(1) AS value
      FROM ${RATE_CODE_TABLE} r
      LEFT JOIN ${TABLE_NAMES.HOTEL_BASE_INFO} h
        ON h.HotelCode = r.HotelCode
      ${whereClause}
      GROUP BY COALESCE(NULLIF(LTRIM(RTRIM(r.Market)), ''), '未填写')
      ORDER BY COUNT(1) DESC
    `;

    const roomTypeCountsSql = `
      SELECT TOP 8
        COALESCE(NULLIF(LTRIM(RTRIM(r.RoomTypeCode)), ''), '未填写') AS name,
        COUNT(1) AS value
      FROM ${RATE_CODE_TABLE} r
      LEFT JOIN ${TABLE_NAMES.HOTEL_BASE_INFO} h
        ON h.HotelCode = r.HotelCode
      ${whereClause}
      GROUP BY COALESCE(NULLIF(LTRIM(RTRIM(r.RoomTypeCode)), ''), '未填写')
      ORDER BY COUNT(1) DESC
    `;

    const minAdvBookinCountsSql = `
      SELECT TOP 8
        COALESCE(CAST(r.MinAdvBookin AS varchar(20)), '未填写') AS name,
        COUNT(1) AS value
      FROM ${RATE_CODE_TABLE} r
      LEFT JOIN ${TABLE_NAMES.HOTEL_BASE_INFO} h
        ON h.HotelCode = r.HotelCode
      ${whereClause}
      GROUP BY COALESCE(CAST(r.MinAdvBookin AS varchar(20)), '未填写')
      ORDER BY COUNT(1) DESC
    `;

    const hotelCountsSql = `
      SELECT TOP 8
        COALESCE(NULLIF(LTRIM(RTRIM(r.HotelCode)), ''), '未填写') AS name,
        COUNT(1) AS value
      FROM ${RATE_CODE_TABLE} r
      LEFT JOIN ${TABLE_NAMES.HOTEL_BASE_INFO} h
        ON h.HotelCode = r.HotelCode
      ${whereClause}
      GROUP BY COALESCE(NULLIF(LTRIM(RTRIM(r.HotelCode)), ''), '未填写')
      ORDER BY COUNT(1) DESC
    `;

    const commissionCountsSql = `
      SELECT TOP 6
        COALESCE(NULLIF(LTRIM(RTRIM(r.CommissionCode)), ''), '未填写') AS name,
        COUNT(1) AS value
      FROM ${RATE_CODE_TABLE} r
      LEFT JOIN ${TABLE_NAMES.HOTEL_BASE_INFO} h
        ON h.HotelCode = r.HotelCode
      ${whereClause}
      GROUP BY COALESCE(NULLIF(LTRIM(RTRIM(r.CommissionCode)), ''), '未填写')
      ORDER BY COUNT(1) DESC
    `;

    const hotelTypeCountsSql = `
      SELECT TOP 6
        COALESCE(NULLIF(LTRIM(RTRIM(h.HotelType)), ''), '未填写') AS name,
        COUNT(1) AS value
      FROM ${RATE_CODE_TABLE} r
      LEFT JOIN ${TABLE_NAMES.HOTEL_BASE_INFO} h
        ON h.HotelCode = r.HotelCode
      ${whereClause}
      GROUP BY COALESCE(NULLIF(LTRIM(RTRIM(h.HotelType)), ''), '未填写')
      ORDER BY COUNT(1) DESC
    `;

    const minLosCountsSql = `
      SELECT name, value
      FROM (
        SELECT
          CASE
            WHEN r.MinLos IS NULL THEN '未设置'
            WHEN r.MinLos <= 1 THEN '1晚'
            WHEN r.MinLos = 2 THEN '2晚'
            WHEN r.MinLos = 3 THEN '3晚'
            WHEN r.MinLos = 4 THEN '4晚'
            ELSE '5晚+'
          END AS name,
          CASE
            WHEN r.MinLos IS NULL THEN 0
            WHEN r.MinLos <= 1 THEN 1
            WHEN r.MinLos = 2 THEN 2
            WHEN r.MinLos = 3 THEN 3
            WHEN r.MinLos = 4 THEN 4
            ELSE 5
          END AS sort_order,
          COUNT(1) AS value
        FROM ${RATE_CODE_TABLE} r
        LEFT JOIN ${TABLE_NAMES.HOTEL_BASE_INFO} h
          ON h.HotelCode = r.HotelCode
        ${whereClause}
        GROUP BY
          CASE
            WHEN r.MinLos IS NULL THEN '未设置'
            WHEN r.MinLos <= 1 THEN '1晚'
            WHEN r.MinLos = 2 THEN '2晚'
            WHEN r.MinLos = 3 THEN '3晚'
            WHEN r.MinLos = 4 THEN '4晚'
            ELSE '5晚+'
          END,
          CASE
            WHEN r.MinLos IS NULL THEN 0
            WHEN r.MinLos <= 1 THEN 1
            WHEN r.MinLos = 2 THEN 2
            WHEN r.MinLos = 3 THEN 3
            WHEN r.MinLos = 4 THEN 4
            ELSE 5
          END
      ) s
      ORDER BY s.sort_order
    `;

    const dataSql = `
      SELECT
        h.GroupCode AS GroupCode,
        r.HotelCode AS HotelCode,
        h.HotelName AS HotelName,
        r.RateCode AS RateCode,
        r.RateCodeName AS RateCodeName,
        r.BeginDate AS BeginDate,
        r.EndDate AS EndDate,
        r.MinAdvBookin AS MinAdvBookin,
        r.MaxAdvBookin AS MaxAdvBookin,
        r.MinLos AS MinLos,
        r.MaxLos AS MaxLos,
        r.Market AS Market,
        r.RoomTypeCode AS RoomTypeCode,
        r.BlockCode AS BlockCode,
        r.BeginTime AS BeginTime,
        r.EndTime AS EndTime,
        r.CommissionCode AS CommissionCode
      FROM ${RATE_CODE_TABLE} r
      LEFT JOIN ${TABLE_NAMES.HOTEL_BASE_INFO} h
        ON h.HotelCode = r.HotelCode
      ${whereClause}
      ORDER BY r.HotelCode, r.RateCode
      OFFSET ${(page - 1) * pageSize} ROWS
      FETCH NEXT ${pageSize} ROWS ONLY
    `;

    const countResult = await executeQuery<{ total: number }>(countSql, params.length > 0 ? params : undefined);
    const total = countResult?.[0]?.total ?? 0;
    const records = await executeQuery(dataSql, params.length > 0 ? params : undefined);
    const groupCounts = await executeQuery<{ name: string; value: number }>(
      groupCountsSql,
      params.length > 0 ? params : undefined
    );
    const marketCounts = await executeQuery<{ name: string; value: number }>(
      marketCountsSql,
      params.length > 0 ? params : undefined
    );
    const roomTypeCounts = await executeQuery<{ name: string; value: number }>(
      roomTypeCountsSql,
      params.length > 0 ? params : undefined
    );
    const minAdvBookinCounts = await executeQuery<{ name: string; value: number }>(
      minAdvBookinCountsSql,
      params.length > 0 ? params : undefined
    );
    const hotelCounts = await executeQuery<{ name: string; value: number }>(
      hotelCountsSql,
      params.length > 0 ? params : undefined
    );
    const commissionCounts = await executeQuery<{ name: string; value: number }>(
      commissionCountsSql,
      params.length > 0 ? params : undefined
    );
    const hotelTypeCounts = await executeQuery<{ name: string; value: number }>(
      hotelTypeCountsSql,
      params.length > 0 ? params : undefined
    );
    const minLosCounts = await executeQuery<{ name: string; value: number }>(
      minLosCountsSql,
      params.length > 0 ? params : undefined
    );

    return NextResponse.json({
      success: true,
      data: records,
      total,
      page,
      pageSize,
      stats: {
        groupCounts,
        marketCounts,
        roomTypeCounts,
        minAdvBookinCounts,
        hotelCounts,
        commissionCounts,
        hotelTypeCounts,
        minLosCounts,
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
