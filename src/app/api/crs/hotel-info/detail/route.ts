import { NextRequest, NextResponse } from 'next/server';
import { executeQuery, initDatabase, getPool } from '@/lib/38/database';
import { TABLE_NAMES } from '@/lib/38/config';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const filters = {
      HotelCode: searchParams.get('HotelCode') || undefined,
      HotelName: searchParams.get('HotelName') || undefined,
      PropertyType: searchParams.get('PropertyType') || undefined,
      HotelType: searchParams.get('HotelType') || undefined,
      PMSType: searchParams.get('PMSType') || undefined,
      Area: searchParams.get('Area') || undefined,
      UrbanArea: searchParams.get('UrbanArea') || undefined,
      MDMCity: searchParams.get('MDMCity') || undefined,
      GroupCode: searchParams.get('GroupCode') || undefined,
      Status: searchParams.get('Status') || undefined,
    };

    try {
      getPool();
    } catch {
      await initDatabase();
    }

    const conditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 0;

    const pushParam = (sql: string, value: any) => {
      conditions.push(sql.replace('{param}', `@param${paramIndex}`));
      params.push(value);
      paramIndex += 1;
    };

    if (filters.HotelCode) {
      pushParam('HotelCode = {param}', filters.HotelCode);
    }
    if (filters.HotelName) {
      pushParam('HotelName LIKE {param}', `%${filters.HotelName}%`);
    }
    if (filters.PropertyType) {
      pushParam('PropertyType = {param}', filters.PropertyType);
    }
    if (filters.HotelType) {
      pushParam('HotelType = {param}', filters.HotelType);
    }
    if (filters.PMSType) {
      pushParam('PMSType = {param}', filters.PMSType);
    }
    if (filters.Area) {
      pushParam('Area = {param}', filters.Area);
    }
    if (filters.UrbanArea) {
      pushParam('UrbanArea = {param}', filters.UrbanArea);
    }
    if (filters.MDMCity) {
      pushParam('MDMCity = {param}', filters.MDMCity);
    }
    if (filters.GroupCode) {
      pushParam('GroupCode = {param}', filters.GroupCode);
    }
    if (filters.Status) {
      pushParam('Status = {param}', filters.Status);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const sql = `
      SELECT TOP 1000
        HotelCode,
        HotelName,
        PropertyType,
        HotelType,
        PMSType,
        Area,
        UrbanArea,
        MDMCity,
        GroupCode,
        Status
      FROM ${TABLE_NAMES.HOTEL_BASE_INFO}
      ${whereClause}
      ORDER BY HotelCode
    `;

    const records = await executeQuery(sql, params.length > 0 ? params : undefined);

    return NextResponse.json({
      success: true,
      data: records,
      total: records.length,
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
