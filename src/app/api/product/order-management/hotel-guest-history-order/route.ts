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
    const dateType = params.dateType || 'DepDate'; // 日期类型：CreateDate, ArrDate, DepDate
    const startDate = params.startDate || '';
    const endDate = params.endDate || '';
    const marketplaces = params.marketplaces ? params.marketplaces.split(',') : [];
    const agentCds = params.agentCds ? params.agentCds.split(',') : [];
    const orderStatuses = params.orderStatuses ? params.orderStatuses.split(',') : [];
    const hotelCode = params.hotelCode || '';
    const hotelName = params.hotelName || '';
    const groupCodes = params.groupCodes ? params.groupCodes.split(',') : [];
    const pmsTypes = params.pmsTypes ? params.pmsTypes.split(',') : [];
    const propertyTypes = params.propertyTypes ? params.propertyTypes.split(',') : [];
    const provinces = params.provinces ? params.provinces.split(',') : [];
    const cities = params.cities ? params.cities.split(',') : [];
    const resAccount = params.resAccount || '';
    const pmsOrderNo = params.pmsOrderNo || '';
    const memberName = params.memberName || '';
    const roomCode = params.roomCode || '';
    const rateCode = params.rateCode || '';

    console.log('[酒店客史订单] 前端页面传入的参数:', params);

    // 构建WHERE条件
    let whereConditions = ['1=1'];

    // 根据日期类型选择对应的字段
    // 日期类型映射：CreateDate -> a.CreateDate, ArrDate -> a.ArrDate, DepDate -> a.DepDate
    const dateFieldMap: Record<string, string> = {
      'CreateDate': 'a.CreateDate',
      'ArrDate': 'a.ArrDate',
      'DepDate': 'a.DepDate'
    };
    const dateField = dateFieldMap[dateType] || 'a.DepDate'; // 默认使用离店日期

    // 日期范围
    if (startDate) {
      whereConditions.push(`${dateField} >= '${startDate.replace(/'/g, "''")}'`);
    }
    if (endDate) {
      whereConditions.push(`${dateField} <= '${endDate.replace(/'/g, "''")}'`);
    }

    if (marketplaces.length > 0) {
      const marketplacesList = marketplaces.map(m => `'${m.trim().replace(/'/g, "''")}'`).join(',');
      whereConditions.push(`a.Marketplace IN (${marketplacesList})`);
    }
    if (agentCds.length > 0) {
      const agentCdsList = agentCds.map(a => `'${a.trim().replace(/'/g, "''")}'`).join(',');
      whereConditions.push(`a.AgentCd IN (${agentCdsList})`);
    }
    if (orderStatuses.length > 0) {
      const orderStatusesList = orderStatuses.map(s => `'${s.trim().replace(/'/g, "''")}'`).join(',');
      whereConditions.push(`a.sta NOT IN (${orderStatusesList})`);
    } else {
      // 默认排除已取消的订单
      //whereConditions.push(`a.sta NOT IN ('Canceled','NW','C')`);
    }
    if (hotelCode) {
      whereConditions.push(`a.HotelCd LIKE '%${hotelCode.replace(/'/g, "''")}%'`);
    }
    if (hotelName) {
      whereConditions.push(`h.HotelName LIKE '%${hotelName.replace(/'/g, "''")}%'`);
    }
    if (groupCodes.length > 0) {
      const groupCodesList = groupCodes.map(code => `'${code.trim().replace(/'/g, "''")}'`).join(',');
      whereConditions.push(`h.GroupCode IN (${groupCodesList})`);
    }
    if (pmsTypes.length > 0) {
      const pmsTypesList = pmsTypes.map(type => `'${type.trim().replace(/'/g, "''")}'`).join(',');
      whereConditions.push(`h.PMSType IN (${pmsTypesList})`);
    }
    if (propertyTypes.length > 0) {
      const propertyTypesList = propertyTypes.map(type => `'${type.trim().replace(/'/g, "''")}'`).join(',');
      whereConditions.push(`h.PropertyType IN (${propertyTypesList})`);
    }
    if (provinces.length > 0) {
      const provincesList = provinces.map(p => `'${p.trim().replace(/'/g, "''")}'`).join(',');
      whereConditions.push(`h.MDMProvince IN (${provincesList})`);
    }
    if (cities.length > 0) {
      const citiesList = cities.map(city => `'${city.trim().replace(/'/g, "''")}'`).join(',');
      whereConditions.push(`h.MDMCity IN (${citiesList})`);
    }
    if (resAccount) {
      whereConditions.push(`a.Res_Account = '${resAccount.replace(/'/g, "''")}'`);
    }
    if (pmsOrderNo) {
      whereConditions.push(`a.PMSOrderNo = '${pmsOrderNo.replace(/'/g, "''")}'`);
    }
    if (memberName) {
      whereConditions.push(`a.MemberName LIKE '%${memberName.replace(/'/g, "''")}%'`);
    }
    if (roomCode) {
      whereConditions.push(`a.RoomCode LIKE '%${roomCode.replace(/'/g, "''")}%'`);
    }
    if (rateCode) {
      whereConditions.push(`a.RateCode LIKE '%${rateCode.replace(/'/g, "''")}%'`);
    }

    const whereClause = whereConditions.join(' AND ');

    // 构建SQL查询，限制最多查询1000条订单数据
    const sql = `
SELECT TOP 100
    a.Res_Account     AS CRS订单号,
    a.PMSOrderNo      AS PMS订单号,
    a.sta             AS 订单状态,
    a.HotelCd         AS 酒店代码,
    h.HotelName       AS 酒店名称,
    a.AgentCd         AS 渠道代码,
    a.Marketplace     AS 市场代码,
    a.ArrDate         AS 入住日期,
    a.DepDate         AS 离店日期,
    a.MemberName      AS 客人姓名,
    a.RoomCode        AS 房型代码,
    s.RoomTypeName    AS 房型名称,
    a.RateCode        AS 房价码,
    r.RateCodeName    AS 房价码名称,
    a.PayType         AS 费用类型,
    a.cusno_des       AS 公司档案,
    a.CreateDate      AS 预订日期,
    SUM(b.RoomNightNum) AS 间夜数,
    SUM(b.RoomCost)     AS 客房收入,
    SUM(b.RepastCost)   AS 餐饮收入,
    SUM(b.OtherCost)    AS 其他收入,
    SUM(b.TotalCost)    AS 总收入
FROM [CrsStar].dbo.MemberChildOrderRecord a
LEFT JOIN [CrsStar].dbo.MemberChildOrderRecordDailyRate b
    ON a.Res_Account = b.OrderNo
LEFT JOIN [CrsStar].dbo.StarHotelBaseInfo h
    ON a.HotelCd = h.HotelCode
LEFT JOIN [CrsStar].dbo.StarRateCodeInfo r
    ON a.HotelCd = r.HotelCode
   AND a.RateCode = r.RateCode
LEFT JOIN [CrsStar].dbo.StarRoomInfo s
    ON a.HotelCd = s.HotelCode
   AND a.RoomCode = s.RoomTypeCode
WHERE ${whereClause}
GROUP BY
    a.Res_Account, a.PMSOrderNo, a.sta, 
    a.HotelCd, h.HotelName,
    a.AgentCd, a.Marketplace,
    a.ArrDate, a.DepDate, a.MemberName,
    a.RoomCode, s.RoomTypeName,
    a.RateCode, r.RateCodeName,
    a.PayType, a.cusno_des, a.CreateDate
ORDER BY a.DepDate DESC, a.Res_Account;
    `;

    console.log('[酒店客史订单] 查询SQL:', sql);

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

    console.log('[酒店客史订单] 查询结果数量:', results.length);

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
      console.log('[酒店客史订单] 获取酒店选项列表完成，酒店代码:', hotelCodeOptions.length, '酒店名称:', hotelNameOptions.length);
    } catch (error) {
      console.error('[酒店客史订单] 获取酒店选项列表失败:', error);
    }

    const total = results.length;

    // 分页处理
    const startIndex = (page - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, total);
    const items = results.slice(startIndex, endIndex);

    const responseData = {
      message: '酒店客史订单查询成功',
      params,
      timestamp: new Date().toISOString(),
      total,
      items,
      options: {
        hotelCodes: hotelCodeOptions,
        hotelNames: hotelNameOptions,
      },
    };

    //console.log('[酒店客史订单] 返回给前端的内容:', JSON.stringify(responseData, null, 2));

    return NextResponse.json({ success: true, data: responseData, message: '查询成功' });
  } catch (error) {
    console.error('[酒店客史订单] 查询失败:', error);
    return NextResponse.json({ success: false, data: null, message: '查询失败', error: error instanceof Error ? error.message : '未知错误' });
  }
}
