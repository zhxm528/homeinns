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
    const requestedPageSize = parseInt(params.pageSize || '10', 10);
    // 确保每页至少显示10条，最大不超过1000（除非是导出等特殊情况）
    const pageSize = requestedPageSize > 1000 ? requestedPageSize : Math.max(requestedPageSize, 10);

    // SQL中的变量转换为前端传入的参数
    let agentCds = params.agentCds ? params.agentCds.split(',').map(c => c.trim()).filter(Boolean) : [];
    const startDate = params.startDate || '';
    const endDate = params.endDate || '';
    const hotelCds = params.hotelCds ? params.hotelCds.split(',').map(c => c.trim()).filter(Boolean) : [];
    const groupCode = params.groupCode ? params.groupCode.trim() : '';
    const showGroup = params.showGroup === 'true'; // 是否显示集团数据，默认为 false

    // 如果 groupCode 是 YF 或 WX，需要转换渠道代码：WEB 对应 APP、WEB、MSJ
    if ((groupCode === 'YF' || groupCode === 'WX') && agentCds.includes('WEB')) {
      // 移除 WEB，添加 APP、WEB、MSJ
      agentCds = agentCds.filter(cd => cd !== 'WEB');
      agentCds.push('APP', 'WEB', 'MSJ');
      // 去重
      agentCds = Array.from(new Set(agentCds));
      console.log('[渠道月产量] 集团代码为 YF/WX，渠道代码转换: WEB -> APP, WEB, MSJ，转换后:', agentCds);
    }

    // 日志打印前端页面传入的参数
    console.log('[渠道月产量] 前端页面传入的参数:', params);

    // 构建WHERE条件
    let hotelWhereCondition = '';
    let groupWhereCondition = '';

    // 渠道代码条件
    // 如果渠道代码为空，不查询任何数据
    const agentCdCondition = agentCds.length > 0 
      ? `r.AgentCd IN (${agentCds.map(cd => `'${cd.replace(/'/g, "''")}'`).join(',')})`
      : `1=0`; // 如果渠道代码条件为空，不返回任何数据

    // 日期范围条件
    const dateCondition = startDate && endDate
      ? `r.DepDate >= '${startDate.replace(/'/g, "''")}' AND r.DepDate < '${(new Date(new Date(endDate).getTime() + 86400000)).toISOString().split('T')[0].replace(/'/g, "''")}'`
      : startDate
      ? `r.DepDate >= '${startDate.replace(/'/g, "''")}'`
      : endDate
      ? `r.DepDate < '${(new Date(new Date(endDate).getTime() + 86400000)).toISOString().split('T')[0].replace(/'/g, "''")}'`
      : '';

    // 酒店代码条件（按酒店明细）
    // 如果酒店代码为空，不查询任何数据
    if (hotelCds.length > 0) {
      const hotelCodes = hotelCds.map(cd => `'${cd.replace(/'/g, "''")}'`).join(',');
      hotelWhereCondition = `AND r.HotelCd IN (${hotelCodes})`;
    } else {
      // 如果酒店代码条件为空，第一条 SQL 不返回任何数据
      hotelWhereCondition = `AND 1=0`;
    }

    // 集团代码条件（按集团明细）
    // 如果集团代码为空，不查询任何数据
    if (groupCode) {
      groupWhereCondition = `AND h.GroupCode = '${groupCode.replace(/'/g, "''")}'`;
    } else {
      // 如果集团代码条件为空，第二条 SQL 不返回任何数据
      groupWhereCondition = `AND 1=0`;
    }

    // 判断是否使用 P3 SQL（当 groupCode 为 YF 或 WX 时）
    const useP3Sql = groupCode === 'YF' || groupCode === 'WX';

    // 构建SQL查询
    // 第二条 SQL：按集团明细（根据 showGroup 决定是否包含）
    const groupSqlPart = showGroup ? `
    UNION ALL

    -- 第二条 SQL：按集团明细
    SELECT 
        h.GroupCode AS GroupOrHotel,
        r.AgentCd,
        'Group' AS TypeFlag,
        dr.RoomCost,
        dr.RoomNightNum,
        MONTH(dr.DailyDate) AS MonthNumber
    FROM [CrsStar].dbo.MemberChildOrderRecord r
    LEFT JOIN [CrsStar].dbo.MemberChildOrderRecordDailyRate dr
           ON r.Res_Account = dr.OrderNo
    LEFT JOIN [CrsStar].dbo.StarHotelBaseInfo h
           ON r.HotelCd = h.HotelCode
    WHERE 
        ${agentCdCondition}
        AND r.sta NOT IN ('C','Canceled','')
        ${dateCondition ? `AND ${dateCondition}` : ''}
        ${groupWhereCondition}` : '';

    const sql = `
WITH MonthlyData AS
(
    -- 第一条 SQL：按酒店明细
    SELECT 
        r.HotelCd AS GroupOrHotel,
        r.AgentCd,
        'Hotel' AS TypeFlag,
        dr.RoomCost,
        dr.RoomNightNum,
        MONTH(dr.DailyDate) AS MonthNumber
    FROM [CrsStar].dbo.MemberChildOrderRecord r
    LEFT JOIN [CrsStar].dbo.MemberChildOrderRecordDailyRate dr
           ON r.Res_Account = dr.OrderNo
    LEFT JOIN [CrsStar].dbo.StarHotelBaseInfo h
           ON r.HotelCd = h.HotelCode
    WHERE 
        ${agentCdCondition}
        AND r.sta NOT IN ('C','Canceled','')
        ${dateCondition ? `AND ${dateCondition}` : ''}
        ${hotelWhereCondition}
${groupSqlPart}
)

SELECT
    GroupOrHotel,
    AgentCd,
    TypeFlag,
    SUM(RoomCost) AS TotalRoomCost,
    SUM(RoomNightNum) AS TotalRoomNightNum,
    SUM(CASE WHEN MonthNumber = 1 THEN RoomCost ELSE 0 END) AS Jan_RoomCost,
    SUM(CASE WHEN MonthNumber = 2 THEN RoomCost ELSE 0 END) AS Feb_RoomCost,
    SUM(CASE WHEN MonthNumber = 3 THEN RoomCost ELSE 0 END) AS Mar_RoomCost,
    SUM(CASE WHEN MonthNumber = 4 THEN RoomCost ELSE 0 END) AS Apr_RoomCost,
    SUM(CASE WHEN MonthNumber = 5 THEN RoomCost ELSE 0 END) AS May_RoomCost,
    SUM(CASE WHEN MonthNumber = 6 THEN RoomCost ELSE 0 END) AS Jun_RoomCost,
    SUM(CASE WHEN MonthNumber = 7 THEN RoomCost ELSE 0 END) AS Jul_RoomCost,
    SUM(CASE WHEN MonthNumber = 8 THEN RoomCost ELSE 0 END) AS Aug_RoomCost,
    SUM(CASE WHEN MonthNumber = 9 THEN RoomCost ELSE 0 END) AS Sep_RoomCost,
    SUM(CASE WHEN MonthNumber = 10 THEN RoomCost ELSE 0 END) AS Oct_RoomCost,
    SUM(CASE WHEN MonthNumber = 11 THEN RoomCost ELSE 0 END) AS Nov_RoomCost,
    SUM(CASE WHEN MonthNumber = 12 THEN RoomCost ELSE 0 END) AS Dec_RoomCost,
    SUM(CASE WHEN MonthNumber = 1 THEN RoomNightNum ELSE 0 END) AS Jan_RoomNightNum,
    SUM(CASE WHEN MonthNumber = 2 THEN RoomNightNum ELSE 0 END) AS Feb_RoomNightNum,
    SUM(CASE WHEN MonthNumber = 3 THEN RoomNightNum ELSE 0 END) AS Mar_RoomNightNum,
    SUM(CASE WHEN MonthNumber = 4 THEN RoomNightNum ELSE 0 END) AS Apr_RoomNightNum,
    SUM(CASE WHEN MonthNumber = 5 THEN RoomNightNum ELSE 0 END) AS May_RoomNightNum,
    SUM(CASE WHEN MonthNumber = 6 THEN RoomNightNum ELSE 0 END) AS Jun_RoomNightNum,
    SUM(CASE WHEN MonthNumber = 7 THEN RoomNightNum ELSE 0 END) AS Jul_RoomNightNum,
    SUM(CASE WHEN MonthNumber = 8 THEN RoomNightNum ELSE 0 END) AS Aug_RoomNightNum,
    SUM(CASE WHEN MonthNumber = 9 THEN RoomNightNum ELSE 0 END) AS Sep_RoomNightNum,
    SUM(CASE WHEN MonthNumber = 10 THEN RoomNightNum ELSE 0 END) AS Oct_RoomNightNum,
    SUM(CASE WHEN MonthNumber = 11 THEN RoomNightNum ELSE 0 END) AS Nov_RoomNightNum,
    SUM(CASE WHEN MonthNumber = 12 THEN RoomNightNum ELSE 0 END) AS Dec_RoomNightNum
FROM MonthlyData
GROUP BY
    GroupOrHotel,
    AgentCd,
    TypeFlag
ORDER BY
    TypeFlag,
    AgentCd,
    GroupOrHotel;
    `;

    // 根据 useP3Sql 决定使用哪个 SQL
    let finalSql = sql;
    if (useP3Sql) {
      // 构建 P3 SQL（当 groupCode 为 YF 或 WX 时使用）
      // 酒店代码条件（按酒店明细）
      let p3HotelWhereCondition = '';
      if (hotelCds.length > 0) {
        const hotelCodes = hotelCds.map(cd => `'${cd.replace(/'/g, "''")}'`).join(',');
        p3HotelWhereCondition = `AND r.HotelCd IN (${hotelCodes})`;
      } else {
        p3HotelWhereCondition = `AND 1=0`;
      }

      // 集团代码条件（按集团明细）
      let p3GroupWhereCondition = '';
      if (groupCode) {
        p3GroupWhereCondition = `AND h.GroupCode = '${groupCode.replace(/'/g, "''")}'`;
      } else {
        p3GroupWhereCondition = `AND 1=0`;
      }

      // P3 SQL 的第二条 SQL：按集团明细（根据 showGroup 决定是否包含）
      const p3GroupSqlPart = showGroup ? `
    UNION ALL

    -- 第二段：按集团
    SELECT
        h.GroupCode AS GroupOrHotel,
        r.AgentCd,
        'Group' AS TypeFlag,
        r.RoomCost,
        r.RoomNightNum,
        MONTH(r.DepDate) AS MonthNumber
    FROM [CrsStar].dbo.MemberChildOrderRecord r
    LEFT JOIN [CrsStar].dbo.StarHotelBaseInfo h
           ON r.HotelCd = h.HotelCode
    WHERE
        ${agentCdCondition}
        AND r.sta NOT IN ('C','Canceled','')
        ${dateCondition ? `AND ${dateCondition}` : ''}
        ${p3GroupWhereCondition}` : '';

      finalSql = `
WITH MonthlyData AS
(
    -- 第一段：按酒店
    SELECT
        r.HotelCd AS GroupOrHotel,
        r.AgentCd,
        'Hotel' AS TypeFlag,
        r.RoomCost,
        r.RoomNightNum,
        MONTH(r.DepDate) AS MonthNumber
    FROM [CrsStar].dbo.MemberChildOrderRecord r
    LEFT JOIN [CrsStar].dbo.StarHotelBaseInfo h
           ON r.HotelCd = h.HotelCode
    WHERE
        ${agentCdCondition}
        AND r.sta NOT IN ('C','Canceled','')
        ${dateCondition ? `AND ${dateCondition}` : ''}
        ${p3HotelWhereCondition}
${p3GroupSqlPart}
)

SELECT
    GroupOrHotel,
    AgentCd,
    TypeFlag,
    SUM(RoomCost) AS TotalRoomCost,
    SUM(RoomNightNum) AS TotalRoomNightNum,
    SUM(CASE WHEN MonthNumber = 1 THEN RoomCost ELSE 0 END) AS Jan_RoomCost,
    SUM(CASE WHEN MonthNumber = 2 THEN RoomCost ELSE 0 END) AS Feb_RoomCost,
    SUM(CASE WHEN MonthNumber = 3 THEN RoomCost ELSE 0 END) AS Mar_RoomCost,
    SUM(CASE WHEN MonthNumber = 4 THEN RoomCost ELSE 0 END) AS Apr_RoomCost,
    SUM(CASE WHEN MonthNumber = 5 THEN RoomCost ELSE 0 END) AS May_RoomCost,
    SUM(CASE WHEN MonthNumber = 6 THEN RoomCost ELSE 0 END) AS Jun_RoomCost,
    SUM(CASE WHEN MonthNumber = 7 THEN RoomCost ELSE 0 END) AS Jul_RoomCost,
    SUM(CASE WHEN MonthNumber = 8 THEN RoomCost ELSE 0 END) AS Aug_RoomCost,
    SUM(CASE WHEN MonthNumber = 9 THEN RoomCost ELSE 0 END) AS Sep_RoomCost,
    SUM(CASE WHEN MonthNumber = 10 THEN RoomCost ELSE 0 END) AS Oct_RoomCost,
    SUM(CASE WHEN MonthNumber = 11 THEN RoomCost ELSE 0 END) AS Nov_RoomCost,
    SUM(CASE WHEN MonthNumber = 12 THEN RoomCost ELSE 0 END) AS Dec_RoomCost,
    SUM(CASE WHEN MonthNumber = 1 THEN RoomNightNum ELSE 0 END) AS Jan_RoomNightNum,
    SUM(CASE WHEN MonthNumber = 2 THEN RoomNightNum ELSE 0 END) AS Feb_RoomNightNum,
    SUM(CASE WHEN MonthNumber = 3 THEN RoomNightNum ELSE 0 END) AS Mar_RoomNightNum,
    SUM(CASE WHEN MonthNumber = 4 THEN RoomNightNum ELSE 0 END) AS Apr_RoomNightNum,
    SUM(CASE WHEN MonthNumber = 5 THEN RoomNightNum ELSE 0 END) AS May_RoomNightNum,
    SUM(CASE WHEN MonthNumber = 6 THEN RoomNightNum ELSE 0 END) AS Jun_RoomNightNum,
    SUM(CASE WHEN MonthNumber = 7 THEN RoomNightNum ELSE 0 END) AS Jul_RoomNightNum,
    SUM(CASE WHEN MonthNumber = 8 THEN RoomNightNum ELSE 0 END) AS Aug_RoomNightNum,
    SUM(CASE WHEN MonthNumber = 9 THEN RoomNightNum ELSE 0 END) AS Sep_RoomNightNum,
    SUM(CASE WHEN MonthNumber = 10 THEN RoomNightNum ELSE 0 END) AS Oct_RoomNightNum,
    SUM(CASE WHEN MonthNumber = 11 THEN RoomNightNum ELSE 0 END) AS Nov_RoomNightNum,
    SUM(CASE WHEN MonthNumber = 12 THEN RoomNightNum ELSE 0 END) AS Dec_RoomNightNum
FROM MonthlyData
GROUP BY
    GroupOrHotel,
    AgentCd,
    TypeFlag
ORDER BY
    TypeFlag,
    AgentCd,
    GroupOrHotel;
      `;
    }

    console.log('[渠道月产量] 查询SQL:', finalSql);
    console.log('[渠道月产量] 查询参数:', { agentCds, startDate, endDate, hotelCds, groupCode, useP3Sql });

    // 初始化数据库连接
    let currentPool;
    try {
      getPool();
      currentPool = getPool();
    } catch {
      await initDatabase();
      currentPool = getPool();
    }

    // 查询所有酒店代码和集团代码的列表（用于 Select 选项）
    let hotelCodeOptions: Array<{ label: string; value: string }> = [];
    let groupCodeOptions: Array<{ label: string; value: string }> = [];
    try {
      // 如果指定了集团代码，只查询该集团下的酒店代码
      let hotelOptionsSql = '';
      if (groupCode) {
        hotelOptionsSql = `
          SELECT DISTINCT
            h.HotelCode AS 酒店代码,
            h.GroupCode AS 集团代码
          FROM [CrsStar].dbo.StarHotelBaseInfo h
          WHERE h.Status = 1 AND h.IsDelete = 0
            AND h.GroupCode = '${groupCode.replace(/'/g, "''")}'
          ORDER BY h.HotelCode
        `;
      } else {
        hotelOptionsSql = `
          SELECT DISTINCT
            h.HotelCode AS 酒店代码,
            h.GroupCode AS 集团代码
          FROM [CrsStar].dbo.StarHotelBaseInfo h
          WHERE h.Status = 1 AND h.IsDelete = 0
          ORDER BY h.HotelCode
        `;
      }
      
      const optionsResult = await currentPool.request().query(hotelOptionsSql);
      const uniqueHotels = optionsResult.recordset;
      hotelCodeOptions = uniqueHotels.map((r: any) => ({ label: r.酒店代码, value: r.酒店代码 }));
      
      // 查询所有集团代码（不受groupCode参数影响）
      const groupOptionsSql = `
        SELECT DISTINCT
          h.GroupCode AS 集团代码
        FROM [CrsStar].dbo.StarHotelBaseInfo h
        WHERE h.Status = 1 AND h.IsDelete = 0
          AND h.GroupCode IS NOT NULL
        ORDER BY h.GroupCode
      `;
      const groupOptionsResult = await currentPool.request().query(groupOptionsSql);
      const uniqueGroupCodes = groupOptionsResult.recordset.map((r: any) => r.集团代码).filter(Boolean);
      groupCodeOptions = uniqueGroupCodes.map((code: string) => {
        const groupCodeMap: Record<string, string> = {
          'JG': '建国',
          'JL': '京伦',
          'NY': '南苑',
          'NH': '云荟',
          'NI': '诺金',
          'NU': '诺岚',
          'KP': '凯宾斯基',
          'YF': '逸扉',
          'WX': '万信',
        };
        return { label: `${code} - ${groupCodeMap[code] || code}`, value: code };
      });
      console.log('[渠道月产量] 获取选项列表完成，酒店代码:', hotelCodeOptions.length, '集团代码:', groupCodeOptions.length, groupCode ? `(筛选集团: ${groupCode})` : '');
    } catch (error) {
      console.error('[渠道月产量] 获取选项列表失败:', error);
    }

    // 执行主查询
    let results: any[] = [];
    try {
      const request = currentPool.request();
      
      console.log('🔍 [SQL Query]', finalSql);
      const startTime = Date.now();
      const result = await request.query(finalSql);
      const endTime = Date.now();
      
      console.log(`✅ [SQL Result] 执行成功，耗时: ${endTime - startTime}ms，返回 ${result.recordset.length} 条记录`);
      results = result.recordset;
    } catch (error) {
      console.error('❌ [SQL Error] 查询执行失败:', error);
      console.error('🔍 [Failed SQL]', finalSql);
      // 即使主查询失败，也返回选项列表
      return NextResponse.json({
        success: false,
        data: {
          message: '查询失败',
          params,
          timestamp: new Date().toISOString(),
          total: 0,
          items: [],
          options: {
            hotelCodes: hotelCodeOptions,
            groupCodes: groupCodeOptions,
          },
        },
        error: error instanceof Error ? error.message : '查询失败',
        message: '查询失败，但已加载选项列表',
      });
    }

    console.log('[渠道月产量] 查询结果数量:', results.length);

    // 计算合计行
    const totalRow = {
      GroupOrHotel: '合计',
      AgentCd: '合计',
      TypeFlag: '合计',
      TotalRoomCost: results.reduce((sum: number, row: any) => sum + (Number(row.TotalRoomCost) || 0), 0),
      TotalRoomNightNum: results.reduce((sum: number, row: any) => sum + (Number(row.TotalRoomNightNum) || 0), 0),
      Jan_RoomCost: results.reduce((sum: number, row: any) => sum + (Number(row.Jan_RoomCost) || 0), 0),
      Feb_RoomCost: results.reduce((sum: number, row: any) => sum + (Number(row.Feb_RoomCost) || 0), 0),
      Mar_RoomCost: results.reduce((sum: number, row: any) => sum + (Number(row.Mar_RoomCost) || 0), 0),
      Apr_RoomCost: results.reduce((sum: number, row: any) => sum + (Number(row.Apr_RoomCost) || 0), 0),
      May_RoomCost: results.reduce((sum: number, row: any) => sum + (Number(row.May_RoomCost) || 0), 0),
      Jun_RoomCost: results.reduce((sum: number, row: any) => sum + (Number(row.Jun_RoomCost) || 0), 0),
      Jul_RoomCost: results.reduce((sum: number, row: any) => sum + (Number(row.Jul_RoomCost) || 0), 0),
      Aug_RoomCost: results.reduce((sum: number, row: any) => sum + (Number(row.Aug_RoomCost) || 0), 0),
      Sep_RoomCost: results.reduce((sum: number, row: any) => sum + (Number(row.Sep_RoomCost) || 0), 0),
      Oct_RoomCost: results.reduce((sum: number, row: any) => sum + (Number(row.Oct_RoomCost) || 0), 0),
      Nov_RoomCost: results.reduce((sum: number, row: any) => sum + (Number(row.Nov_RoomCost) || 0), 0),
      Dec_RoomCost: results.reduce((sum: number, row: any) => sum + (Number(row.Dec_RoomCost) || 0), 0),
      Jan_RoomNightNum: results.reduce((sum: number, row: any) => sum + (Number(row.Jan_RoomNightNum) || 0), 0),
      Feb_RoomNightNum: results.reduce((sum: number, row: any) => sum + (Number(row.Feb_RoomNightNum) || 0), 0),
      Mar_RoomNightNum: results.reduce((sum: number, row: any) => sum + (Number(row.Mar_RoomNightNum) || 0), 0),
      Apr_RoomNightNum: results.reduce((sum: number, row: any) => sum + (Number(row.Apr_RoomNightNum) || 0), 0),
      May_RoomNightNum: results.reduce((sum: number, row: any) => sum + (Number(row.May_RoomNightNum) || 0), 0),
      Jun_RoomNightNum: results.reduce((sum: number, row: any) => sum + (Number(row.Jun_RoomNightNum) || 0), 0),
      Jul_RoomNightNum: results.reduce((sum: number, row: any) => sum + (Number(row.Jul_RoomNightNum) || 0), 0),
      Aug_RoomNightNum: results.reduce((sum: number, row: any) => sum + (Number(row.Aug_RoomNightNum) || 0), 0),
      Sep_RoomNightNum: results.reduce((sum: number, row: any) => sum + (Number(row.Sep_RoomNightNum) || 0), 0),
      Oct_RoomNightNum: results.reduce((sum: number, row: any) => sum + (Number(row.Oct_RoomNightNum) || 0), 0),
      Nov_RoomNightNum: results.reduce((sum: number, row: any) => sum + (Number(row.Nov_RoomNightNum) || 0), 0),
      Dec_RoomNightNum: results.reduce((sum: number, row: any) => sum + (Number(row.Dec_RoomNightNum) || 0), 0),
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
      message: '渠道月产量数据',
      params,
      timestamp: new Date().toISOString(),
      total,
      items,
      options: {
        hotelCodes: hotelCodeOptions,
        groupCodes: groupCodeOptions,
      },
    };

    //console.log('[渠道月产量] 返回给前端的内容:', JSON.stringify(responseData, null, 2));

    return NextResponse.json({
      success: true,
      data: responseData,
      message: '查询成功',
    });

  } catch (error) {
    console.error('[渠道月产量] 查询失败:', error);
    
    return NextResponse.json({
      success: false,
      data: null,
      error: error instanceof Error ? error.message : '查询失败',
      message: '查询失败',
    });
  }
}
