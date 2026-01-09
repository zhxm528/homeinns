import { NextRequest, NextResponse } from 'next/server';
import { getPool, initDatabase, executeQuery } from '@/lib/crs/database';

export async function GET(request: NextRequest) {
  console.log('🚀 [CRS Hotel] ========== API 请求开始 ==========');
  console.log('[CRS Hotel] 请求URL:', request.url);
  console.log('[CRS Hotel] 请求时间:', new Date().toISOString());
  
  try {
    const { searchParams } = new URL(request.url);
    const hotelCode = searchParams.get('hotelCode') || undefined;
    const hotelName = searchParams.get('hotelName') || undefined;
    const roomTypeCode = searchParams.get('roomTypeCode') || undefined;
    const roomTypeName = searchParams.get('roomTypeName') || undefined;

    // 初始化数据库连接
    console.log('[CRS Hotel] 步骤1: 开始初始化数据库连接...');
    let currentPool;
    try {
      currentPool = getPool();
      console.log('[CRS Hotel] ✅ 数据库连接池已存在，直接使用');
    } catch (error) {
      console.log('[CRS Hotel] ⚠️ 数据库连接池不存在，开始初始化...');
      await initDatabase();
      currentPool = getPool();
      console.log('[CRS Hotel] ✅ 数据库连接池初始化成功');
    }

    // 构建酒店查询条件
    const hotelConditions: string[] = [];
    const hotelParams: any[] = [];
    let paramIndex = 1;

    if (hotelCode) {
      hotelConditions.push(`hotel_code = $${paramIndex}`);
      hotelParams.push(hotelCode);
      paramIndex++;
    }
    if (hotelName) {
      hotelConditions.push(`hotel_name ILIKE $${paramIndex}`);
      hotelParams.push(`%${hotelName}%`);
      paramIndex++;
    }

    const hotelWhereClause = hotelConditions.length > 0 
      ? `WHERE ${hotelConditions.join(' AND ')}` 
      : '';

    // 查询酒店列表
    const hotelSql = `
      SELECT 
        hotel_code,
        hotel_name,
        hotel_en_name,
        hotel_type,
        hotel_star,
        group_code,
        hotel_address,
        mdm_city,
        mdm_province,
        status,
        is_delete,
        is_active
      FROM public.hotel_base_info
      ${hotelWhereClause}
      ORDER BY hotel_code
      LIMIT 1000
    `;

    console.log('[CRS Hotel] 步骤2: 准备执行酒店查询');
    console.log('[CRS Hotel] SQL语句:', hotelSql);
    if (hotelParams.length > 0) {
      console.log('[CRS Hotel] 参数:', hotelParams);
    }

    let hotels: any[] = [];
    try {
      hotels = await executeQuery<any>(hotelSql, hotelParams.length > 0 ? hotelParams : undefined);
      console.log('[CRS Hotel] ✅ 酒店查询成功，返回', hotels.length, '条记录');
    } catch (error) {
      console.error('[CRS Hotel] ❌ 酒店查询失败:', error);
      throw error;
    }

    // 构建房型查询条件
    const roomTypeConditions: string[] = [];
    const roomTypeParams: any[] = [];
    paramIndex = 1;

    if (hotelCode) {
      roomTypeConditions.push(`hotel_code = $${paramIndex}`);
      roomTypeParams.push(hotelCode);
      paramIndex++;
    }
    if (roomTypeCode) {
      roomTypeConditions.push(`room_type_code = $${paramIndex}`);
      roomTypeParams.push(roomTypeCode);
      paramIndex++;
    }
    if (roomTypeName) {
      roomTypeConditions.push(`room_type_name ILIKE $${paramIndex}`);
      roomTypeParams.push(`%${roomTypeName}%`);
      paramIndex++;
    }

    const roomTypeWhereClause = roomTypeConditions.length > 0 
      ? `WHERE ${roomTypeConditions.join(' AND ')}` 
      : '';

    // 查询房型列表
    const roomTypeSql = `
      SELECT 
        hotel_code,
        room_type_code,
        room_type_name,
        room_type_class,
        number,
        max_number,
        area,
        sort,
        is_valid,
        is_delete,
        is_main_room,
        room_type_name_en
      FROM public.hotel_room_type
      ${roomTypeWhereClause}
      ORDER BY hotel_code, room_type_code
      LIMIT 1000
    `;

    console.log('[CRS Hotel] 步骤3: 准备执行房型查询');
    console.log('[CRS Hotel] SQL语句:', roomTypeSql);
    if (roomTypeParams.length > 0) {
      console.log('[CRS Hotel] 参数:', roomTypeParams);
    }

    let roomTypes: any[] = [];
    try {
      roomTypes = await executeQuery<any>(roomTypeSql, roomTypeParams.length > 0 ? roomTypeParams : undefined);
      console.log('[CRS Hotel] ✅ 房型查询成功，返回', roomTypes.length, '条记录');
    } catch (error) {
      console.error('[CRS Hotel] ❌ 房型查询失败:', error);
      throw error;
    }

    console.log('[CRS Hotel] ========== API 请求成功 ==========');

    return NextResponse.json({
      success: true,
      data: {
        hotels,
        roomTypes,
      },
      total: {
        hotels: hotels.length,
        roomTypes: roomTypes.length,
      },
    });
  } catch (error: any) {
    console.error('[CRS Hotel] ❌ API 请求失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || '查询失败',
        data: {
          hotels: [],
          roomTypes: [],
        },
        total: {
          hotels: 0,
          roomTypes: 0,
        },
      },
      { status: 500 }
    );
  }
}

