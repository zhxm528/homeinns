import { NextRequest, NextResponse } from 'next/server';
import { getPool, initDatabase } from '@/lib/38/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });

    const page = Math.max(parseInt(params.page || '1', 10) || 1, 1);
    const requestedPageSize = parseInt(params.pageSize || '10', 10);
    // 限制分页大小最大为1000，只允许10, 50, 100, 1000这几个值
    const allowedPageSizes = [10, 50, 100, 1000];
    const pageSize = allowedPageSizes.includes(requestedPageSize) 
      ? Math.min(requestedPageSize, 1000) 
      : 10;

    // SQL中的查询条件转换为前端传入的参数
    const startDate = params.startDate || '';
    const endDate = params.endDate || '';
    const orderStatuses = params.orderStatuses ? params.orderStatuses.split(',') : [];
    const agentCd = params.agentCd || '';
    const resvTypes = params.resvTypes ? params.resvTypes.split(',') : [];
    const rateCodes = params.rateCodes ? params.rateCodes.split(',') : [];
    const hotelCode = params.hotelCode || '';
    const hotelName = params.hotelName || '';
    const groupCodes = params.groupCodes ? params.groupCodes.split(',') : [];
    const pmsTypes = params.pmsTypes ? params.pmsTypes.split(',') : [];
    const propertyTypes = params.propertyTypes ? params.propertyTypes.split(',') : [];
    const provinces = params.provinces ? params.provinces.split(',') : [];
    const cities = params.cities ? params.cities.split(',') : [];
    const orderNo = params.orderNo || '';
    const memberNo = params.memberNo || '';
    const guestName = params.guestName || '';
    const roomTypeCode = params.roomTypeCode || '';

    console.log('[渠道订单] 前端页面传入的参数:', params);

    // 构建WHERE条件
    let whereConditions = ['1=1'];

    // 日期范围
    if (startDate) {
      whereConditions.push(`o.DepDate >= '${startDate.replace(/'/g, "''")}'`);
    } else {
      // 默认查询最近一个月
      const defaultStartDate = new Date();
      defaultStartDate.setMonth(defaultStartDate.getMonth() - 1);
      whereConditions.push(`o.DepDate >= '${defaultStartDate.toISOString().split('T')[0]}'`);
    }
    if (endDate) {
      whereConditions.push(`o.DepDate < '${endDate.replace(/'/g, "''")}'`);
    }

    if (orderStatuses.length > 0) {
      const orderStatusesList = orderStatuses.map(s => `'${s.trim().replace(/'/g, "''")}'`).join(',');
      whereConditions.push(`o.ResStatus NOT IN (${orderStatusesList})`);
    } else {
      // 默认排除已取消的订单
      //whereConditions.push(`o.ResStatus NOT IN ('Canceled','NW','C')`);
    }
    if (agentCd) {
      whereConditions.push(`o.AgentCd LIKE '%${agentCd.trim().replace(/'/g, "''")}%'`);
    }
    if (resvTypes.length > 0) {
      const resvTypesList = resvTypes.map(t => `'${t.trim().replace(/'/g, "''")}'`).join(',');
      whereConditions.push(`o.ResvType IN (${resvTypesList})`);
    }
    if (rateCodes.length > 0) {
      const rateCodesList = rateCodes.map(r => `'${r.trim().replace(/'/g, "''")}'`).join(',');
      whereConditions.push(`o.RateCode IN (${rateCodesList})`);
    }
    if (hotelCode) {
      whereConditions.push(`o.HotelCd LIKE '%${hotelCode.replace(/'/g, "''")}%'`);
    }
    if (hotelName) {
      whereConditions.push(`h.HotelName LIKE '%${hotelName.replace(/'/g, "''")}%'`);
    }
    if (orderNo) {
      whereConditions.push(`o.OrderNo = '${orderNo.replace(/'/g, "''")}'`);
    }
    if (memberNo) {
      whereConditions.push(`o.MemberNo LIKE '%${memberNo.replace(/'/g, "''")}%'`);
    }
    if (guestName) {
      whereConditions.push(`o.GustNm LIKE '%${guestName.replace(/'/g, "''")}%'`);
    }
    if (roomTypeCode) {
      whereConditions.push(`o.RoomTypeCode LIKE '%${roomTypeCode.replace(/'/g, "''")}%'`);
    }

    const whereClause = whereConditions.join(' AND ');

    // 构建JOIN条件
    let joinConditions = '';
    if (groupCodes.length > 0) {
      const groupCodesList = groupCodes.map(code => `'${code.trim().replace(/'/g, "''")}'`).join(',');
      joinConditions += ` AND h.GroupCode IN (${groupCodesList})`;
    }
    if (pmsTypes.length > 0) {
      const pmsTypesList = pmsTypes.map(type => `'${type.trim().replace(/'/g, "''")}'`).join(',');
      joinConditions += ` AND h.PMSType IN (${pmsTypesList})`;
    }
    if (propertyTypes.length > 0) {
      const propertyTypesList = propertyTypes.map(type => `'${type.trim().replace(/'/g, "''")}'`).join(',');
      joinConditions += ` AND h.PropertyType IN (${propertyTypesList})`;
    }
    if (provinces.length > 0) {
      const provincesList = provinces.map(p => `'${p.trim().replace(/'/g, "''")}'`).join(',');
      joinConditions += ` AND h.MDMProvince IN (${provincesList})`;
    }
    if (cities.length > 0) {
      const citiesList = cities.map(city => `'${city.trim().replace(/'/g, "''")}'`).join(',');
      joinConditions += ` AND h.MDMCity IN (${citiesList})`;
    }

    // 构建SQL查询，限制最多查询1000条订单数据
    const sql = `
SELECT TOP 100
    o.OrderNo AS CRS订单号,
    o.HotelCd AS 酒店代码,
    h.HotelName AS 酒店名称,
    o.AgentCd AS 渠道代码,
    o.ResvType AS 预订类型,
    o.ArrDate AS 入住日期,
    o.DepDate AS 离店日期,
    o.RoomNum AS 房间数,
    o.RoomTypeCode AS 房型代码,
    s.RoomTypeName AS 房型名称,
    o.RateCode AS 房价码,
    r.RateCodeName AS 房价码名称,
    o.PayCd AS 费用类型,
    o.MemberNo AS 会员编号,
    o.GustNm AS 客人姓名,
    o.MobileTel AS 手机号码,
    o.TotalXf AS 总消费,
    o.CrsStatus AS 订单状态,
    o.CRSResvDate AS 预订日期
FROM [CrsStar].dbo.View_StarOrderRoom_All o
LEFT JOIN [CrsStar].dbo.StarHotelBaseInfo h
    ON o.HotelCd = h.HotelCode
   ${joinConditions}
LEFT JOIN [CrsStar].dbo.StarRoomInfo s
    ON o.HotelCd = s.HotelCode 
   AND o.RoomTypeCode = s.RoomTypeCode
LEFT JOIN [CrsStar].dbo.StarRateCodeInfo r
    ON o.HotelCd = r.HotelCode 
   AND o.RateCode = r.RateCode
WHERE ${whereClause}
ORDER BY 
    o.CRSResvDate DESC,
    o.OrderNo DESC;
    `;

    console.log('[渠道订单] 查询SQL:', sql);

    // 初始化数据库连接
    try {
      getPool();
    } catch {
      await initDatabase();
    }
    const currentPool = getPool();

    // 执行查询
    let results: any[];
    try {
      const request = currentPool.request();
      
      console.log('🔍 [SQL Query]', sql);
      const startTime = Date.now();
      const result = await request.query(sql);
      const endTime = Date.now();
      
      console.log(`✅ [SQL Result] 执行成功，耗时: ${endTime - startTime}ms，返回 ${result.recordset.length} 条记录`);
      results = result.recordset;
    } catch (error) {
      console.error('❌ [SQL Error] 查询执行失败:', error);
      console.error('🔍 [Failed SQL]', sql);
      throw error;
    }

    console.log('[渠道订单] 查询结果数量:', results.length);

    // 查询所有酒店代码和名称的列表（用于 Select 选项）
    let hotelCodeOptions: Array<{ label: string; value: string }> = [];
    let hotelNameOptions: Array<{ label: string; value: string }> = [];
    try {
      const optionsSql = `
        SELECT DISTINCT 
          h.HotelCode AS 酒店代码,
          h.HotelName AS 酒店名称
        FROM [CrsStar].dbo.StarHotelBaseInfo h
        WHERE h.Status = 1 AND h.IsDelete = 0
        ORDER BY h.HotelCode
      `;
      const optionsResult = await currentPool.request().query(optionsSql);
      const uniqueHotels = optionsResult.recordset;
      hotelCodeOptions = uniqueHotels.map((r: any) => ({ label: r.酒店代码, value: r.酒店代码 }));
      hotelNameOptions = uniqueHotels.map((r: any) => ({ label: r.酒店名称, value: r.酒店名称 }));
      console.log('[渠道订单] 获取酒店选项列表完成，酒店代码:', hotelCodeOptions.length, '酒店名称:', hotelNameOptions.length);
    } catch (error) {
      console.error('[渠道订单] 获取酒店选项列表失败:', error);
    }

    // 分页处理（不包含合计行）
    const total = results.length;
    const startIndex = (page - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, total);
    const items = results.slice(startIndex, endIndex);

    const responseData = {
      message: '渠道订单查询成功',
      params,
      timestamp: new Date().toISOString(),
      total,
      items,
      options: {
        hotelCodes: hotelCodeOptions,
        hotelNames: hotelNameOptions,
      },
    };

    //console.log('[渠道订单] 返回给前端的内容:', JSON.stringify(responseData, null, 2));

    return NextResponse.json({ success: true, data: responseData, message: '查询成功' });
  } catch (error) {
    console.error('[渠道订单] 查询失败:', error);
    return NextResponse.json({ success: false, data: null, message: '查询失败', error: error instanceof Error ? error.message : '未知错误' });
  }
}
