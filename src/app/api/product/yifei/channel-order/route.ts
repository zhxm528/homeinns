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
    // 限制分页大小，允许10, 50, 100, 1000, 10000这几个值（10000用于导出）
    const allowedPageSizes = [10, 50, 100, 1000, 10000];
    const pageSize = allowedPageSizes.includes(requestedPageSize) 
      ? requestedPageSize 
      : 10;

    // SQL中的查询条件转换为前端传入的参数
    const startDate = params.startDate || '';
    const endDate = params.endDate || '';
    const hotelCode = params.hotelCode || '';
    const hotelName = params.hotelName || '';
    const agentCd = params.agentCd || '';
    const groupCode = params.groupCode || 'YF';
    const crsStatus = params.crsStatus || '';

    console.log('[渠道订单-逸扉报表] 前端页面传入的参数:', params);

    // 构建WHERE条件
    let whereConditions: string[] = [];

    // 集团代码条件
    if (groupCode) {
      whereConditions.push(`h.GroupCode = '${groupCode.replace(/'/g, "''")}'`);
    }

    // 渠道代码条件
    if (agentCd) {
      whereConditions.push(`a.AgentCd = '${agentCd.replace(/'/g, "''")}'`);
    }

    // 订单状态条件
    if (crsStatus) {
      whereConditions.push(`a.CrsStatus = '${crsStatus.replace(/'/g, "''")}'`);
    } else {
      // 默认排除已取消的订单
      whereConditions.push(`a.CrsStatus <> 'C'`);
    }

    // 日期范围条件
    if (startDate) {
      whereConditions.push(`a.ArrDate >= '${startDate.replace(/'/g, "''")}'`);
    }
    if (endDate) {
      whereConditions.push(`a.ArrDate < '${endDate.replace(/'/g, "''")}'`);
    }

    // 酒店代码条件
    if (hotelCode) {
      whereConditions.push(`a.HotelCd LIKE '%${hotelCode.replace(/'/g, "''")}%'`);
    }

    // 酒店名称条件
    if (hotelName) {
      whereConditions.push(`h.HotelName LIKE '%${hotelName.replace(/'/g, "''")}%'`);
    }

    const whereClause = whereConditions.length > 0 ? whereConditions.join(' AND ') : '1=1';

    // 构建SQL查询（基于 channel-order.sql）
    const sql = `
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
    WHERE ${whereClause}
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
        p.ChannelUniqueResID DESC
) AS pms
ORDER BY 
    b.ArrDate DESC,
    b.OrderNo DESC;
    `;

    console.log('[渠道订单-逸扉报表] 查询SQL:', sql);

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

    console.log('[渠道订单-逸扉报表] 查询结果数量:', results.length);

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
        ${groupCode ? `AND h.GroupCode = '${groupCode.replace(/'/g, "''")}'` : ''}
        ORDER BY h.HotelCode
      `;
      const optionsResult = await currentPool.request().query(optionsSql);
      const uniqueHotels = optionsResult.recordset;
      hotelCodeOptions = uniqueHotels.map((r: any) => ({ label: r.酒店代码, value: r.酒店代码 }));
      hotelNameOptions = uniqueHotels.map((r: any) => ({ label: r.酒店名称, value: r.酒店名称 }));

      console.log('[渠道订单-逸扉报表] 获取选项列表完成，酒店代码:', hotelCodeOptions.length, '酒店名称:', hotelNameOptions.length);
    } catch (error) {
      console.error('[渠道订单-逸扉报表] 获取选项列表失败:', error);
    }

    // 分页处理
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

    return NextResponse.json({ success: true, data: responseData, message: '查询成功' });
  } catch (error) {
    console.error('[渠道订单-逸扉报表] 查询失败:', error);
    return NextResponse.json({ success: false, data: null, message: '查询失败', error: error instanceof Error ? error.message : '未知错误' });
  }
}
