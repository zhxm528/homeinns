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
    const pageSize = requestedPageSize > 1000 ? requestedPageSize : [10, 50, 100, 1000].includes(requestedPageSize) ? requestedPageSize : 10;

    // SQL中的变量转换为前端传入的参数
    const title = params.title || '';
    const describe = params.describe || '';
    const categoryIds = params.categoryIds || ''; // 逗号分隔
    const otaTypes = params.otaTypes || ''; // 逗号分隔
    const apprStatuses = params.apprStatuses || ''; // 逗号分隔
    const promotionTypes = params.promotionTypes || ''; // 逗号分隔
    const policyFormulaIDs = params.policyFormulaIDs || ''; // 逗号分隔
    const titleTypes = params.titleTypes || ''; // 逗号分隔
    const depCodes = params.depCodes || ''; // 逗号分隔
    const startDate = params.startDate || '';
    const endDate = params.endDate || '';

    // 日志打印前端页面传入的参数
    console.log('[促销主题列表] 前端页面传入的参数:', params);

    // 构建SQL查询条件
    const safeTitle = title.replace(/'/g, "''");
    const safeDescribe = describe.replace(/'/g, "''");
    const safeStartDate = startDate.replace(/'/g, "''");
    const safeEndDate = endDate.replace(/'/g, "''");

    // 构建 WHERE 条件
    let whereConditions = 'WHERE 1 = 1';
    
    if (title) {
      whereConditions += ` AND (t.Title LIKE N'%${safeTitle}%' OR t.Describe LIKE N'%${safeTitle}%')`;
    }
    if (describe && !title) {
      whereConditions += ` AND t.Describe LIKE N'%${safeDescribe}%'`;
    }
    if (categoryIds) {
      const categoryList = categoryIds.split(',').map(c => `'${c.replace(/'/g, "''")}'`).join(',');
      whereConditions += ` AND t.CategoryId IN (${categoryList})`;
    }
    if (otaTypes) {
      const otaList = otaTypes.split(',').map(c => `'${c.replace(/'/g, "''")}'`).join(',');
      whereConditions += ` AND t.OTAType IN (${otaList})`;
    }
    whereConditions += ` AND t.ApprStatus IN ('1')`;
    if (promotionTypes) {
      const promoList = promotionTypes.split(',').map(c => `'${c.replace(/'/g, "''")}'`).join(',');
      whereConditions += ` AND d.PromotionType IN (${promoList})`;
    }
    if (policyFormulaIDs) {
      const policyList = policyFormulaIDs.split(',').map(c => `'${c.replace(/'/g, "''")}'`).join(',');
      whereConditions += ` AND d.PolicyFormulaID IN (${policyList})`;
    }
    if (titleTypes) {
      const titleTypeList = titleTypes.split(',').map(c => `'${c.replace(/'/g, "''")}'`).join(',');
      whereConditions += ` AND d.TitleType IN (${titleTypeList})`;
    }
    if (depCodes) {
      const depList = depCodes.split(',').map(c => `'${c.replace(/'/g, "''")}'`).join(',');
      whereConditions += ` AND g.DepCode IN (${depList})`;
    }
    if (startDate) {
      whereConditions += ` AND d.StartDate >= '${safeStartDate}'`;
    }
    if (endDate) {
      whereConditions += ` AND d.EndDate <= '${safeEndDate}'`;
    }

    const sql = `
SELECT 
    -- 🔹 活动主题表字段
    t.ID AS TitleID,
    t.Title,
    t.Describe,
    t.CategoryId,
    t.OTAType,
    t.ApprStatus,

    -- 🔹 明细表字段
    d.ID AS DetailID,
    d.StartDate,
    d.EndDate,
    d.PromotionType,
    d.PolicyFormulaID,
    d.TitleType,

    -- 🔹 品牌归属表字段
    g.ID AS GroupID,
    g.DepCode

FROM [192.168.210.73].[SalePromotion].dbo.SalesPromotionTitle AS t WITH (NOLOCK)
LEFT JOIN [192.168.210.73].[SalePromotion].dbo.SalesPromotionTitleDetail AS d WITH (NOLOCK)
    ON t.ID = d.SalesPromotionTitleID
LEFT JOIN [192.168.210.73].[SalePromotion].dbo.SalesPromotion_Rule_Group AS g WITH (NOLOCK)
    ON t.ID = g.SalesPromotionTitleID

${whereConditions}

ORDER BY t.Title, g.DepCode, d.PromotionType;
    `;

    console.log('[促销主题列表] 查询SQL:', sql);
    console.log('[促销主题列表] 查询参数:', { title, describe, categoryIds, otaTypes, apprStatuses, promotionTypes, policyFormulaIDs, titleTypes, depCodes, startDate, endDate });

    // 执行查询
    let results: any[];
    try {
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

    console.log('[促销主题列表] 查询结果数量:', results.length);

    // 格式化日期
    const formatDate = (date: any): string => {
      if (!date) return '';
      if (date instanceof Date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      }
      if (typeof date === 'string') {
        const dateObj = new Date(date);
        if (!isNaN(dateObj.getTime())) {
          const year = dateObj.getFullYear();
          const month = String(dateObj.getMonth() + 1).padStart(2, '0');
          const day = String(dateObj.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        }
        if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
          return date;
        }
      }
      return String(date);
    };

    // 格式化查询结果
    const formattedResults = results.map((row: any) => ({
      ...row,
      StartDate: formatDate(row.StartDate),
      EndDate: formatDate(row.EndDate),
    }));

    // 分页处理
    const total = formattedResults.length;
    const startIndex = (page - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, total);
    const items = formattedResults.slice(startIndex, endIndex);

    // 日志打印返回给前端的内容
    const responseData = {
      message: '促销主题列表数据',
      params,
      timestamp: new Date().toISOString(),
      total,
      items,
    };

    //console.log('[促销主题列表] 返回给前端的内容:', JSON.stringify(responseData, null, 2));

    return NextResponse.json({
      success: true,
      data: responseData,
      message: '查询成功',
    });

  } catch (error) {
    console.error('[促销主题列表] 查询失败:', error);
    
    return NextResponse.json({
      success: false,
      data: null,
      error: error instanceof Error ? error.message : '查询失败',
      message: '查询失败',
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 日志打印前端页面传入的参数
    console.log('[促销主题列表] 前端页面传入的参数(POST):', body);

    // 模拟返回数据
    const responseData = {
      message: '促销主题列表操作成功',
      params: body,
      timestamp: new Date().toISOString(),
      data: {},
    };

    // 日志打印返回给前端的内容
    console.log('[促销主题列表] 返回给前端的内容(POST):', JSON.stringify(responseData, null, 2));

    return NextResponse.json({
      success: true,
      data: responseData,
      message: '操作成功',
    });

  } catch (error) {
    console.error('[促销主题列表] 操作失败:', error);
    
    return NextResponse.json({
      success: false,
      data: null,
      error: error instanceof Error ? error.message : '操作失败',
      message: '操作失败',
    });
  }
}

