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
    // 支持导出时传入大pageSize获取所有数据，默认10
    const requestedPageSize = parseInt(params.pageSize || '10', 10);
    const pageSize = requestedPageSize > 1000 ? requestedPageSize : [10, 50, 100, 1000].includes(requestedPageSize) ? requestedPageSize : 10;

    // SQL中的变量转换为前端传入的参数
    const agentCd = params.agentCd || 'CTM';
    const startDate = params.startDate || '';
    const endDate = params.endDate || '';

    // 如果没有传入日期，默认使用最近6天
    const defaultEndDate = new Date();
    const defaultStartDate = new Date();
    defaultStartDate.setDate(defaultEndDate.getDate() - 5);
    
    const finalStartDate = startDate || defaultStartDate.toISOString().split('T')[0];
    const finalEndDate = endDate || defaultEndDate.toISOString().split('T')[0];

    // 日志打印前端页面传入的参数
    console.log('[渠道试单下单率报表] 前端页面传入的参数:', params);

    // 构建SQL查询
    const sql = `
SELECT
    CAST(CreateTime AS DATE) AS 日期,

    -- CRS_CheckAvailable（试单）
    SUM(CASE WHEN FunName = 'CRS_CheckAvailable' THEN 1 ELSE 0 END) AS [试单总请求数],
    SUM(CASE WHEN FunName = 'CRS_CheckAvailable' AND Fail = '0' THEN 1 ELSE 0 END) AS [试单成功数],
    ROUND(
        SUM(CASE WHEN FunName = 'CRS_CheckAvailable' AND Fail = '0' THEN 1 ELSE 0 END) * 100.0 /
        NULLIF(SUM(CASE WHEN FunName = 'CRS_CheckAvailable' THEN 1 ELSE 0 END), 0),
        2
    ) AS [试单成功率],

    -- CRS_CreateOrder（下单）
    SUM(CASE WHEN FunName = 'CRS_CreateOrder' THEN 1 ELSE 0 END) AS [下单总请求数],
    SUM(CASE WHEN FunName = 'CRS_CreateOrder' AND Fail = '0' THEN 1 ELSE 0 END) AS [下单成功数],
    ROUND(
        SUM(CASE WHEN FunName = 'CRS_CreateOrder' AND Fail = '0' THEN 1 ELSE 0 END) * 100.0 /
        NULLIF(SUM(CASE WHEN FunName = 'CRS_CreateOrder' THEN 1 ELSE 0 END), 0),
        2
    ) AS [下单成功率]

FROM [192.168.210.170].[Report].dbo.P3MonitorNote
WHERE AgentCd = '${agentCd.replace(/'/g, "''")}'
  AND FunName IN ('CRS_CheckAvailable', 'CRS_CreateOrder')
  AND CAST(CreateTime AS DATE) BETWEEN '${finalStartDate.replace(/'/g, "''")}' AND '${finalEndDate.replace(/'/g, "''")}'
GROUP BY CAST(CreateTime AS DATE)
ORDER BY 日期;
    `;

    console.log('[渠道试单下单率报表] 查询SQL:', sql);
    console.log('[渠道试单下单率报表] 查询参数:', { agentCd, startDate: finalStartDate, endDate: finalEndDate });

    // 执行查询
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

    console.log('[渠道试单下单率报表] 查询结果数量:', results.length);

    // 格式化日期的辅助函数
    const formatDate = (date: any): string => {
      if (!date) return '';
      // 如果是Date对象
      if (date instanceof Date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      }
      // 如果是字符串，尝试解析
      if (typeof date === 'string') {
        const dateObj = new Date(date);
        if (!isNaN(dateObj.getTime())) {
          const year = dateObj.getFullYear();
          const month = String(dateObj.getMonth() + 1).padStart(2, '0');
          const day = String(dateObj.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        }
        // 如果已经是 yyyy-MM-dd 格式，直接返回
        if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
          return date;
        }
      }
      return String(date);
    };

    // 格式化查询结果中的日期字段
    const formattedResults = results.map((row: any) => ({
      ...row,
      日期: formatDate(row.日期),
    }));

    // 计算合计行
    const totalRow = {
      日期: '合计',
      试单总请求数: formattedResults.reduce((sum: number, row: any) => sum + (Number(row.试单总请求数) || 0), 0),
      试单成功数: formattedResults.reduce((sum: number, row: any) => sum + (Number(row.试单成功数) || 0), 0),
      试单成功率: (() => {
        const totalRequests = formattedResults.reduce((sum: number, row: any) => sum + (Number(row.试单总请求数) || 0), 0);
        const totalSuccess = formattedResults.reduce((sum: number, row: any) => sum + (Number(row.试单成功数) || 0), 0);
        return totalRequests > 0 ? Math.round((totalSuccess / totalRequests) * 100 * 100) / 100 : 0;
      })(),
      下单总请求数: formattedResults.reduce((sum: number, row: any) => sum + (Number(row.下单总请求数) || 0), 0),
      下单成功数: formattedResults.reduce((sum: number, row: any) => sum + (Number(row.下单成功数) || 0), 0),
      下单成功率: (() => {
        const totalRequests = formattedResults.reduce((sum: number, row: any) => sum + (Number(row.下单总请求数) || 0), 0);
        const totalSuccess = formattedResults.reduce((sum: number, row: any) => sum + (Number(row.下单成功数) || 0), 0);
        return totalRequests > 0 ? Math.round((totalSuccess / totalRequests) * 100 * 100) / 100 : 0;
      })(),
      __type: 'total',
    };

    // 合并合计行和数据行
    const allRows = [totalRow, ...formattedResults.map((row: any) => ({ ...row, __type: 'normal' }))];
    const total = allRows.length;

    // 分页处理
    const startIndex = (page - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, total);
    const items = allRows.slice(startIndex, endIndex);

    // 日志打印返回给前端的内容
    const responseData = {
      message: '渠道试单下单率报表数据',
      params,
      timestamp: new Date().toISOString(),
      total,
      items,
    };

    console.log('[渠道试单下单率报表] 返回给前端的内容:', JSON.stringify(responseData, null, 2));

    return NextResponse.json({
      success: true,
      data: responseData,
      message: '查询成功',
    });

  } catch (error) {
    console.error('[渠道试单下单率报表] 查询失败:', error);
    
    return NextResponse.json({
      success: false,
      data: null,
      error: error instanceof Error ? error.message : '查询失败',
      message: '查询失败',
    });
  }
}
