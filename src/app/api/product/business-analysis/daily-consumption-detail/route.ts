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
    // 如果 pageSize 大于 1000，认为是导出请求，允许返回所有数据
    // 否则限制为 10, 100，或者如果请求的是"全部"，则使用一个很大的值
    const pageSize = requestedPageSize > 1000 ? requestedPageSize : [10, 100].includes(requestedPageSize) ? requestedPageSize : 10;

    // SQL中的变量转换为前端传入的参数
    const startDate = params.startDate || '';
    const endDate = params.endDate || '';
    const hotelIds = params.hotelIds || ''; // 酒店代码列表（逗号分隔）
    const deptname = params.deptname || ''; // 科目大类名称
    const descript = params.descript || ''; // 科目名称

    // 日志打印前端页面传入的参数
    console.log('[每日消费明细] 前端页面传入的参数:', params);
    console.log('[每日消费明细] 解析参数:', { startDate, endDate, hotelIds, deptname, descript, page, pageSize });

    // 初始化数据库连接（在查询选项列表之前）
    let currentPool;
    try {
      getPool();
      currentPool = getPool();
    } catch {
      await initDatabase();
      currentPool = getPool();
    }

    // 查询所有酒店代码和名称的列表（用于 Select 选项）
    let hotelCodeOptions: Array<{ label: string; value: string }> = [];
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
      console.log('[每日消费明细] 获取酒店选项列表完成，酒店代码:', hotelCodeOptions.length);
    } catch (error) {
      console.error('[每日消费明细] 获取酒店选项列表失败:', error);
    }

    // 查询所有部门代码的列表（用于 Select 选项）
    let deptOptions: Array<{ label: string; value: string }> = [];
    try {
      const deptSql = `
        SELECT DISTINCT
          h.dept AS 部门代码,
          h.deptname AS 部门名称
        FROM [192.168.210.170].[Report].dbo.bi_htlrev AS h WITH (NOLOCK)
        WHERE h.dept IS NOT NULL AND h.dept <> ''
        ORDER BY h.dept
      `;
      const deptResult = await currentPool.request().query(deptSql);
      deptOptions = deptResult.recordset.map((r: any) => ({
        label: `${r.部门代码} - ${r.部门名称 || r.部门代码}`,
        value: r.部门代码
      }));
      console.log('[每日消费明细] 获取部门选项列表完成，部门:', deptOptions.length);
    } catch (error) {
      console.error('[每日消费明细] 获取部门选项列表失败:', error);
    }

    // 构建WHERE条件
    // 如果日期为空，不查询任何数据，但返回选项列表
    if (!startDate || !endDate) {
      return NextResponse.json({
        success: true,
        data: {
          message: '每日消费明细 - 查询结果',
          params,
          timestamp: new Date().toISOString(),
          total: 0,
          items: [],
          options: {
            hotelCodes: hotelCodeOptions,
            depts: deptOptions,
          },
        },
        message: '请选择起始日期和结束日期',
      });
    }

    let whereConditions = `WHERE h.bdate >= '${startDate.replace(/'/g, "''")}' AND h.bdate <= '${endDate.replace(/'/g, "''")}'`;
    
    // 过滤掉合计行和无效数据
    whereConditions += ` AND (h.descript1 NOT LIKE '%-%' AND h.descript1 NOT LIKE '%合计%' AND h.descript1 NOT LIKE '%人均%')`;
    whereConditions += ` AND ISNULL(h.class1, '') <> ''`;

    // 酒店代码过滤
    if (hotelIds) {
      const hotelIdList = hotelIds.split(',').map(id => `'${id.trim().replace(/'/g, "''")}'`).join(',');
      whereConditions += ` AND h.hotelid IN (${hotelIdList})`;
    }

    // 科目大类名称过滤（使用模糊查询）
    if (deptname) {
      whereConditions += ` AND h.deptname LIKE '%${deptname.replace(/'/g, "''")}%'`;
    }

    // 科目名称过滤（使用模糊查询）
    if (descript) {
      whereConditions += ` AND h.descript LIKE '%${descript.replace(/'/g, "''")}%'`;
    }

    // 构建SQL查询
    const sql = `
SELECT 
    CAST(h.bdate AS date) AS 业务日期,
    LTRIM(RTRIM(h.hotelid)) AS 酒店代码,
    LTRIM(RTRIM(b.HotelName)) AS 酒店名称,
    LTRIM(RTRIM(b.GroupCode)) AS 管理公司,
    LTRIM(RTRIM(h.dept)) AS 部门代码,
    LTRIM(RTRIM(h.deptname)) AS 部门名称,
    CASE h.dept
        WHEN 'fb' THEN N'餐饮收入'
        WHEN 'ot' THEN N'其他收入'
        WHEN 'rm' THEN N'客房收入'
        WHEN 'ri' THEN N'租赁'
        ELSE h.dept
    END AS 大类,
    LTRIM(RTRIM(h.class)) AS 二级分类代码,
    LTRIM(RTRIM(h.descript)) AS 二级分类名称,
    LTRIM(RTRIM(h.class1)) AS 一级科目代码,
    LTRIM(RTRIM(h.descript1)) AS 一级科目名称,
    ISNULL(h.amount, 0) AS 收入金额,
    ISNULL(h.rebate, 0) AS 冲减金额,
    ISNULL(h.amount, 0) - ISNULL(h.rebate, 0) AS 净收入金额,
    h.createtime AS 创建时间
FROM [192.168.210.170].[Report].dbo.bi_htlrev AS h WITH (NOLOCK)
LEFT JOIN [CrsStar].dbo.StarHotelBaseInfo AS b WITH (NOLOCK)
    ON LTRIM(RTRIM(h.hotelid)) = LTRIM(RTRIM(b.HotelCode))
${whereConditions}
ORDER BY 
    h.bdate,
    h.hotelid,
    h.dept,
    h.class1,
    h.class;
    `;

    console.log('[每日消费明细] 查询SQL:', sql);

    // 执行主查询
    let results: any[] = [];
    try {
      const request = currentPool.request();
      console.log('🔍 [SQL Query]', sql);
      const started = Date.now();
      const dbResult = await request.query(sql);
      console.log(`✅ [SQL Result] ${dbResult.recordset.length} rows in ${Date.now() - started}ms`);
      results = dbResult.recordset || [];
    } catch (e) {
      console.error('❌ [SQL Error]', e);
      console.error('🔍 [Failed SQL]', sql);
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
            depts: deptOptions,
          },
        },
        error: e instanceof Error ? e.message : '查询失败',
        message: '查询失败，但已加载选项列表',
      });
    }

    const totalCount = results.length;

    // 分页处理
    const startIndex = (page - 1) * pageSize;
    const endIndex = pageSize > 1000 ? totalCount : Math.min(startIndex + pageSize, totalCount);
    const items = results.slice(startIndex, endIndex);

    const responseData = {
      message: '每日消费明细 - 查询结果',
      params,
      timestamp: new Date().toISOString(),
      total: totalCount,
      items,
      options: {
        hotelCodes: hotelCodeOptions,
        depts: deptOptions,
      },
    };

    // 日志打印返回给前端的内容
    console.log('[每日消费明细] 返回给前端的内容:', JSON.stringify({ ...responseData, items: `[${items.length} items]` }, null, 2));

    return NextResponse.json({ success: true, data: responseData, message: '查询成功' });
  } catch (error) {
    console.error('[每日消费明细] 查询失败:', error);
    return NextResponse.json({ 
      success: false, 
      data: null, 
      message: '查询失败', 
      error: error instanceof Error ? error.message : '未知错误' 
    });
  }
}
