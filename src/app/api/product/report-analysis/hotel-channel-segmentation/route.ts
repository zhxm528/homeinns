import { NextRequest, NextResponse } from 'next/server';
import { getPool, initDatabase } from '@/lib/38/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // 获取查询参数
    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });

    const page = Math.max(parseInt(params.page || '1', 10) || 1, 1);
    // 支持导出时传入大pageSize获取所有数据，默认1000
    const requestedPageSize = parseInt(params.pageSize || '1000', 10);
    const pageSize = requestedPageSize > 1000 ? requestedPageSize : [10, 50, 100, 1000].includes(requestedPageSize) ? requestedPageSize : 1000;

    // SQL中的变量转换为前端传入的参数
    const queryDate = params.queryDate || new Date().toISOString().split('T')[0];
    const channelCodes = params.channelCodes || '';
    const groupCodes = params.groupCodes || '';

    // 日志打印前端页面传入的参数
    console.log('前端页面传入的参数:', params);

    // 构建SQL查询
    const agentCdFilter = channelCodes 
      ? `AND a.AgentCd IN (${channelCodes.split(',').map(code => `'${code.trim()}'`).join(',')})`
      : `AND a.AgentCd IN ('CTP','MDI','OBR','WEB','WAT')`;

    const groupCodeFilter = groupCodes
      ? `AND b.GroupCode IN (${groupCodes.split(',').map(code => `'${code.trim()}'`).join(',')})`
      : `AND b.GroupCode IN ('JG','JL','NY','NH','NI','KP','NU')`;

    const sql = `
DECLARE 
    @QueryDate       date = CAST('${queryDate}' AS DATE),
    @YearStart       date = DATEFROMPARTS(YEAR('${queryDate}'), 1, 1),
    @MonthStart      date = DATEFROMPARTS(YEAR('${queryDate}'), MONTH('${queryDate}'), 1);

;WITH base AS (
    SELECT
        a.AgentCd,
        a.HotelCd,
        b.HotelName,
        c.DailyDate,
        RoomNight = COALESCE(c.RoomNightNum, 0),
        RoomRev   = COALESCE(c.RoomCost, 0)
    FROM [CrsStar].dbo.MemberChildOrderRecord a
    JOIN [CrsStar].dbo.StarHotelBaseInfo b
           ON b.HotelCode = a.HotelCd
    LEFT JOIN [CrsStar].dbo.MemberChildOrderRecordDailyRate c
           ON c.OrderNo = a.Res_Account
    WHERE
        -- 业务口径：先圈定"今年离店"的订单
        a.DepDate >= @YearStart
        AND a.DepDate <  DATEADD(year, 1, @YearStart)

        -- 状态：排除取消
        AND a.sta NOT IN ('C','Canceled','')

        -- 渠道过滤
        ${agentCdFilter}

        -- 酒店过滤
        AND b.Status = 1
        AND b.IsDelete = 0
        ${groupCodeFilter}
)
SELECT
    AgentCd AS 渠道代码,
    CASE AgentCd
        WHEN 'CTP' THEN N'携程线上'
        WHEN 'MDI' THEN N'美团线上'
        WHEN 'OBR' THEN N'飞猪线上'
        WHEN 'WAT' THEN N'首享会'
        WHEN 'WEB' THEN N'如家官网'
        ELSE N'其他'
    END AS 渠道名称,
    HotelCd AS 酒店代码,
    HotelName AS 酒店名称,

    -- 当日
    SUM(CASE WHEN DailyDate = @QueryDate THEN RoomNight ELSE 0 END) AS 当日间夜数,
    SUM(CASE WHEN DailyDate = @QueryDate THEN RoomRev   ELSE 0 END) AS 当日客房收入,

    -- 当月 MTD: 月初到查询日
    SUM(CASE WHEN DailyDate >= @MonthStart AND DailyDate <= @QueryDate THEN RoomNight ELSE 0 END) AS 当月MTD间夜数,
    SUM(CASE WHEN DailyDate >= @MonthStart AND DailyDate <= @QueryDate THEN RoomRev   ELSE 0 END) AS 当月MTD客房收入,

    -- 当年 YTD: 年初到查询日
    SUM(CASE WHEN DailyDate >= @YearStart  AND DailyDate <= @QueryDate THEN RoomNight ELSE 0 END) AS 当年YTD间夜数,
    SUM(CASE WHEN DailyDate >= @YearStart  AND DailyDate <= @QueryDate THEN RoomRev   ELSE 0 END) AS 当年YTD客房收入

FROM base
GROUP BY AgentCd, HotelCd, HotelName
ORDER BY 当月MTD间夜数 DESC, AgentCd, HotelCd;
    `;

    console.log('酒店渠道细分查询SQL:', sql);
    console.log('查询参数:', { queryDate, channelCodes, groupCodes });

    // 执行查询，设置超时时间为3分钟（180000毫秒）
    let results: any[];
    try {
      // 如果连接池未初始化，自动初始化
      try {
        getPool();
      } catch {
        await initDatabase();
      }
      const currentPool = getPool();
      const request = currentPool.request();
      
      // 注意：超时时间在数据库配置文件 config.ts 的 options.requestTimeout 中设置为 90000ms
      // 如果需要为单个请求设置不同的超时时间，可以在这里设置（需要重启连接池才能生效）
      
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

    console.log('酒店渠道细分查询结果数量:', results.length);

    // 计算合计行
    const totalRow = {
      渠道代码: '合计',
      渠道名称: '合计',
      酒店代码: '合计',
      酒店名称: '合计',
      当日间夜数: results.reduce((sum: number, row: any) => sum + (Number(row.当日间夜数) || 0), 0),
      当日客房收入: results.reduce((sum: number, row: any) => sum + (Number(row.当日客房收入) || 0), 0),
      当月MTD间夜数: results.reduce((sum: number, row: any) => sum + (Number(row.当月MTD间夜数) || 0), 0),
      当月MTD客房收入: results.reduce((sum: number, row: any) => sum + (Number(row.当月MTD客房收入) || 0), 0),
      当年YTD间夜数: results.reduce((sum: number, row: any) => sum + (Number(row.当年YTD间夜数) || 0), 0),
      当年YTD客房收入: results.reduce((sum: number, row: any) => sum + (Number(row.当年YTD客房收入) || 0), 0),
      __type: 'total',
    };

    // 合并合计行和数据行
    const allRows = [totalRow, ...results.map((row: any) => ({ ...row, __type: 'normal' }))];
    const total = allRows.length;

    // 分页处理
    const startIndex = (page - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, total);
    const items = allRows.slice(startIndex, endIndex);

    // 日志打印返回给前端的内容
    const responseData = {
      message: '酒店渠道细分数据',
      params,
      timestamp: new Date().toISOString(),
      total,
      items,
    };
    console.log('返回给前端的内容:', JSON.stringify(responseData, null, 2));

    return NextResponse.json({
      success: true,
      data: responseData,
      message: '查询成功',
    });

  } catch (error) {
    console.error('酒店渠道细分查询失败:', error);
    
    return NextResponse.json({
      success: false,
      data: null,
      error: error instanceof Error ? error.message : '查询失败',
      message: '查询失败',
    });
  }
}
