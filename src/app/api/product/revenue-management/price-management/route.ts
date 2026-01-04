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
    const allowedPageSizes = [10, 50, 100, 1000];
    const pageSize = allowedPageSizes.includes(requestedPageSize) 
      ? Math.min(requestedPageSize, 1000) 
      : 10;

    // SQL中的查询条件转换为前端传入的参数
    const hotelCode = params.hotelCode || '';
    const hotelName = params.hotelName || '';
    const groupCodes = params.groupCodes ? params.groupCodes.split(',') : [];
    const pmsTypes = params.pmsTypes ? params.pmsTypes.split(',') : [];
    const propertyTypes = params.propertyTypes ? params.propertyTypes.split(',') : [];
    const rateCode = params.rateCode || '';
    const rateCodeName = params.rateCodeName || '';
    const marketCode = params.marketCode || '';
    const sources = params.sources || '';
    const channels = params.channels ? params.channels.split(',') : [];

    console.log('[价格管理] 前端页面传入的参数:', params);

    // 构建WHERE条件
    let whereConditions = ['r.IsDelete = 0'];

    if (hotelCode) {
      whereConditions.push(`r.HotelCode LIKE '%${hotelCode.replace(/'/g, "''")}%'`);
    } else {
      // 如果没有指定酒店代码，默认查询所有（移除硬编码限制）
      // 如果需要默认值，可以在这里设置
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
    if (rateCode) {
      whereConditions.push(`r.RateCode LIKE '%${rateCode.replace(/'/g, "''")}%'`);
    }
    if (rateCodeName) {
      whereConditions.push(`r.RateCodeName LIKE '%${rateCodeName.replace(/'/g, "''")}%'`);
    }
    if (marketCode) {
      whereConditions.push(`r.Market LIKE '%${marketCode.replace(/'/g, "''")}%'`);
    }
    if (sources) {
      whereConditions.push(`r.Sources LIKE '%${sources.replace(/'/g, "''")}%'`);
    }
    if (channels.length > 0) {
      const channelsList = channels.map(channel => `'${channel.trim().replace(/'/g, "''")}'`).join(',');
      whereConditions.push(`EXISTS (
        SELECT 1 
        FROM [CrsStar].dbo.StarPublishRateCodeInfo p
        WHERE p.HotelCode = r.HotelCode 
          AND p.RateCode = r.RateCode 
          AND p.ChannelCode IN (${channelsList})
      )`);
    }

    const whereClause = whereConditions.join(' AND ');

    // 构建渠道筛选条件（用于发布渠道子查询）
    const channelFilter = channels.length > 0
      ? ` AND p2.ChannelCode IN (${channels.map(channel => `'${channel.trim().replace(/'/g, "''")}'`).join(',')})`
      : '';

    // 构建SQL查询
    const sql = `
SELECT TOP 100
    r.HotelCode AS 酒店代码,
    h.HotelName AS 酒店名称,
    h.HotelType AS 酒店类型,
    h.GroupCode AS 集团代码,
    h.PMSType AS PMS类型,
    h.PropertyType AS 产权类型,
    r.RateCode AS 房价码,
    r.RateCodeName AS 房价名称,
    STUFF((
        SELECT ',' + r2.RoomTypeCode
        FROM [CrsStar].dbo.StarRateCodeInfo r2
        WHERE r2.HotelCode = r.HotelCode AND r2.RateCode = r.RateCode
        FOR XML PATH(''), TYPE
    ).value('.', 'NVARCHAR(MAX)'), 1, 1, '') AS 房型代码,
    MIN(CONVERT(varchar(10), r.BeginDate, 120)) AS 开始日期,
    MAX(CONVERT(varchar(10), r.EndDate, 120)) AS 结束日期,
    MIN(r.MinLos) AS 最小连住天数,
    MAX(r.MaxLos) AS 最大连住天数,
    MIN(r.MinAdvBookin) AS 最小预订提前天数,
    MAX(r.MaxAdvBookin) AS 最大预订提前天数,
    r.Market AS 市场代码,
    m.CodeName AS 市场名称,
    r.Sources AS 来源代码,
    r.CateCode AS 类别码,
    r.ShortInfo AS 短备注,
    r.LongInfo AS 长备注,
    STUFF((
        SELECT ',' + p2.ChannelCode
        FROM [CrsStar].dbo.StarPublishRateCodeInfo p2
        WHERE p2.HotelCode = r.HotelCode AND p2.RateCode = r.RateCode${channelFilter}
        FOR XML PATH(''), TYPE
    ).value('.', 'NVARCHAR(MAX)'), 1, 1, '') AS 发布渠道,
    STUFF((
        SELECT ',' + s2.ColumnName
        FROM [CrsStar].dbo.StarProducitonReportSetting s2
        WHERE s2.HotelCode = r.HotelCode AND s2.RateCodeEqual = r.RateCode
        FOR XML PATH(''), TYPE
    ).value('.', 'NVARCHAR(MAX)'), 1, 1, '') AS 分组名称
FROM [CrsStar].dbo.StarRateCodeInfo r
LEFT JOIN [CrsStar].dbo.StarHotelBaseInfo h
       ON r.HotelCode = h.HotelCode AND h.IsDelete = 0
LEFT JOIN [CrsStar].dbo.SOP_StarMarketInfo_Brand m
       ON r.Market = m.MarketCode AND m.IsValid = 1 AND m.IsDelete = 0
WHERE ${whereClause}
GROUP BY 
    r.HotelCode,
    h.HotelName,
    h.HotelType,
    h.GroupCode,
    h.PMSType,
    h.PropertyType,
    r.RateCode,
    r.RateCodeName,
    r.Market,
    m.CodeName,
    r.Sources,
    r.CateCode,
    r.ShortInfo,
    r.LongInfo
ORDER BY r.HotelCode, r.RateCode;
    `;

    console.log('[价格管理] 查询SQL:', sql);

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

    console.log('[价格管理] 查询结果数量:', results.length);

    // 查询所有酒店代码和名称的列表（用于 Select 选项）
    // 根据 hotel_search.md 规则，查询所有酒店（不限制状态和删除标记）
    let hotelCodeOptions: Array<{ label: string; value: string }> = [];
    let hotelNameOptions: Array<{ label: string; value: string }> = [];
    try {
      const optionsSql = `
        SELECT
          h.HotelCode AS 酒店代码,
          h.HotelName AS 酒店名称
        FROM [CrsStar].dbo.StarHotelBaseInfo h
        ORDER BY h.HotelCode
      `;
      const optionsResult = await currentPool.request().query(optionsSql);
      const uniqueHotels = optionsResult.recordset;
      hotelCodeOptions = uniqueHotels.map((r: any) => ({ label: r.酒店代码, value: r.酒店代码 }));
      hotelNameOptions = uniqueHotels.map((r: any) => ({ label: r.酒店名称, value: r.酒店名称 }));
      console.log('[价格管理] 获取酒店选项列表完成，酒店代码:', hotelCodeOptions.length, '酒店名称:', hotelNameOptions.length);
    } catch (error) {
      console.error('[价格管理] 获取酒店选项列表失败:', error);
    }

    const total = results.length;

    // 分页处理
    const startIndex = (page - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, total);
    const items = results.slice(startIndex, endIndex);

    const responseData = {
      message: '价格管理查询成功',
      params,
      timestamp: new Date().toISOString(),
      total,
      items,
      options: {
        hotelCodes: hotelCodeOptions,
        hotelNames: hotelNameOptions,
      },
    };

    //console.log('[价格管理] 返回给前端的内容:', JSON.stringify(responseData, null, 2));

    return NextResponse.json({ success: true, data: responseData, message: '查询成功' });
  } catch (error) {
    console.error('[价格管理] 查询失败:', error);
    return NextResponse.json({ success: false, data: null, message: '查询失败', error: error instanceof Error ? error.message : '未知错误' });
  }
}
