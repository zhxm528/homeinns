import { NextRequest, NextResponse } from 'next/server';
import { executeQuery, initDatabase, getPool } from '@/lib/38/database';
import { TABLE_NAMES } from '@/lib/38/config';

const PUBLISH_RATE_TABLE = TABLE_NAMES.STAR_PUBLISH_RATE_CODE_INFO;

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
      ChannelCode: searchParams.get('ChannelCode') || undefined,
      RateCode: searchParams.get('RateCode') || undefined,
      BeginDate: searchParams.get('BeginDate') || undefined,
      EndDate: searchParams.get('EndDate') || undefined,
    };

    try {
      getPool();
    } catch {
      await initDatabase();
    }

    const conditions: string[] = ['h.IsDelete = 0'];
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
      pushParam('p.HotelCode = {param}', filters.HotelCode);
    }
    if (filters.HotelName) {
      pushParam('h.HotelName LIKE {param}', `%${filters.HotelName}%`);
    }
    if (filters.ChannelCode) {
      pushParam('p.ChannelCode = {param}', filters.ChannelCode);
    }
    if (filters.RateCode) {
      pushParam('p.RateCode = {param}', filters.RateCode);
    }
    if (filters.BeginDate) {
      pushParam('p.BeginDate >= {param}', filters.BeginDate);
    }
    if (filters.EndDate) {
      pushParam('p.EndDate <= {param}', filters.EndDate);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const countSql = `
      SELECT COUNT(1) AS total
      FROM ${PUBLISH_RATE_TABLE} p
      LEFT JOIN ${TABLE_NAMES.HOTEL_BASE_INFO} h
        ON h.HotelCode = p.HotelCode
      ${whereClause}
    `;

    const groupCountsSql = `
      SELECT TOP 6
        COALESCE(NULLIF(LTRIM(RTRIM(h.GroupCode)), ''), '未填写') AS name,
        COUNT(1) AS value
      FROM ${PUBLISH_RATE_TABLE} p
      LEFT JOIN ${TABLE_NAMES.HOTEL_BASE_INFO} h
        ON h.HotelCode = p.HotelCode
      ${whereClause}
      GROUP BY COALESCE(NULLIF(LTRIM(RTRIM(h.GroupCode)), ''), '未填写')
      ORDER BY COUNT(1) DESC
    `;

    const channelCountsSql = `
      SELECT TOP 6
        COALESCE(NULLIF(LTRIM(RTRIM(p.ChannelCode)), ''), '未填写') AS name,
        COUNT(1) AS value
      FROM ${PUBLISH_RATE_TABLE} p
      LEFT JOIN ${TABLE_NAMES.HOTEL_BASE_INFO} h
        ON h.HotelCode = p.HotelCode
      ${whereClause}
      GROUP BY COALESCE(NULLIF(LTRIM(RTRIM(p.ChannelCode)), ''), '未填写')
      ORDER BY COUNT(1) DESC
    `;

    const rateCodeCountsSql = `
      SELECT TOP 8
        COALESCE(NULLIF(LTRIM(RTRIM(p.RateCode)), ''), '未填写') AS name,
        COUNT(1) AS value
      FROM ${PUBLISH_RATE_TABLE} p
      LEFT JOIN ${TABLE_NAMES.HOTEL_BASE_INFO} h
        ON h.HotelCode = p.HotelCode
      ${whereClause}
      GROUP BY COALESCE(NULLIF(LTRIM(RTRIM(p.RateCode)), ''), '未填写')
      ORDER BY COUNT(1) DESC
    `;

    const hotelCodeCountsSql = `
      SELECT TOP 8
        COALESCE(NULLIF(LTRIM(RTRIM(p.HotelCode)), ''), '未填写') AS name,
        COUNT(1) AS value
      FROM ${PUBLISH_RATE_TABLE} p
      LEFT JOIN ${TABLE_NAMES.HOTEL_BASE_INFO} h
        ON h.HotelCode = p.HotelCode
      ${whereClause}
      GROUP BY COALESCE(NULLIF(LTRIM(RTRIM(p.HotelCode)), ''), '未填写')
      ORDER BY COUNT(1) DESC
    `;

    const endMonthCountsSql = `
      SELECT TOP 8
        COALESCE(CONVERT(varchar(7), p.EndDate, 120), '未填写') AS name,
        COUNT(1) AS value
      FROM ${PUBLISH_RATE_TABLE} p
      LEFT JOIN ${TABLE_NAMES.HOTEL_BASE_INFO} h
        ON h.HotelCode = p.HotelCode
      ${whereClause}
      GROUP BY COALESCE(CONVERT(varchar(7), p.EndDate, 120), '未填写')
      ORDER BY COUNT(1) DESC
    `;

    const dataSql = `
      SELECT
        h.GroupCode AS GroupCode,
        p.HotelCode AS HotelCode,
        h.HotelName AS HotelName,
        p.ChannelCode AS ChannelCode,
        p.RateCode AS RateCode,
        p.BeginDate AS BeginDate,
        p.EndDate AS EndDate
      FROM ${PUBLISH_RATE_TABLE} p
      LEFT JOIN ${TABLE_NAMES.HOTEL_BASE_INFO} h
        ON h.HotelCode = p.HotelCode
      ${whereClause}
      ORDER BY p.HotelCode, p.ChannelCode, p.RateCode
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
    const channelCounts = await executeQuery<{ name: string; value: number }>(
      channelCountsSql,
      params.length > 0 ? params : undefined
    );
    const rateCodeCounts = await executeQuery<{ name: string; value: number }>(
      rateCodeCountsSql,
      params.length > 0 ? params : undefined
    );
    const hotelCodeCounts = await executeQuery<{ name: string; value: number }>(
      hotelCodeCountsSql,
      params.length > 0 ? params : undefined
    );
    const endMonthCounts = await executeQuery<{ name: string; value: number }>(
      endMonthCountsSql,
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
        channelCounts,
        rateCodeCounts,
        hotelCodeCounts,
        endMonthCounts,
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
