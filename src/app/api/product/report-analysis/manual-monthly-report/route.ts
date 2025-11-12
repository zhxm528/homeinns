import { NextRequest, NextResponse } from 'next/server';
import { getPool, initDatabase } from '@/lib/38/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });

    // 如果传入很大的 pageSize，则返回全部数据，不进行分页
    const requestedPageSize = parseInt(params.pageSize || '10', 10);
    const shouldReturnAll = requestedPageSize > 1000;

    // 参数：年月（YYYY-MM格式）和酒店ID列表
    const now = new Date();
    const defaultYearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const yearMonth = params.yearMonth || defaultYearMonth;
    const hotelIds = params.hotelIds || '';
    
    // 解析年月，生成该月的所有日期
    const [year, month] = yearMonth.split('-').map(Number);
    const daysInMonth = new Date(year, month, 0).getDate();
    const monthStart = `${year}-${String(month).padStart(2, '0')}-01`;
    const monthEnd = `${year}-${String(month).padStart(2, '0')}-${String(daysInMonth).padStart(2, '0')}`;

    // 生成日期列
    const dateColumns: string[] = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      dateColumns.push(dateStr);
    }

    // 酒店ID列表处理
    const hotelIdList = hotelIds
      ? hotelIds.split(',').map(id => `'${id.trim().replace(/'/g, "''")}'`).join(',')
      : `'JG0110','KP0001','NI0001','NI0002','KP0002','NI0003'`;

    // 部门(dept)过滤，前端可传入逗号分隔的部门代码，如: fb,rm,ot,ri
    const deptCodes = (params.dept || '').trim();
    const deptList = deptCodes
      ? deptCodes.split(',').map(cd => `'${cd.trim().replace(/'/g, "''")}'`).join(',')
      : '';
    const deptFilter = deptList ? `\n      AND h.dept IN (${deptList})` : '';

    console.log('[手工填报月报] 前端页面传入的参数:', params);
    console.log('[手工填报月报] 解析参数:', { yearMonth, monthStart, monthEnd, daysInMonth, hotelIdList });

    // 构建动态SQL
    const dateCaseStatements = dateColumns.map(date => 
      `SUM(CASE WHEN bdate = CAST('${date}' AS date) THEN amount ELSE 0 END) AS [${date}]`
    ).join(',\n        ');

    const dateSelectColumns = dateColumns.map(date => `[${date}]`).join(',');

    const sql = `
WITH src AS (
    SELECT
        h.hotelid,
        CASE h.dept
            WHEN 'fb' THEN N'餐饮收入'
            WHEN 'ot' THEN N'其他收入'
            WHEN 'rm' THEN N'客房收入'
            WHEN 'ri' THEN N'租赁'
            ELSE h.dept
        END AS 大类,
        h.class       AS 小类,
        h.descript    AS 小类名称,
        CAST(h.bdate AS date) AS bdate,
        ISNULL(h.amount,0)    AS amount
    FROM [192.168.210.170].[Report].dbo.bi_htlrev AS h
    WHERE h.hotelid IN (${hotelIdList})
      AND h.bdate >= CAST('${monthStart}' AS date)
      AND h.bdate <= CAST('${monthEnd}' AS date)${deptFilter}
),
agg AS (
    SELECT
        hotelid,
        大类,
        小类,
        小类名称,
        ${dateCaseStatements},
        GROUPING(小类)     AS grp_小类,
        GROUPING(小类名称) AS grp_小类名称
    FROM src
    GROUP BY
        GROUPING SETS (
            (hotelid, 大类, 小类, 小类名称),
            (hotelid, 大类)
        )
)
SELECT
    hotelid AS 酒店,
    大类,
    CASE WHEN grp_小类 = 1 THEN N'小计' ELSE 小类 END         AS 小类,
    CASE WHEN grp_小类名称 = 1 THEN N'小计' ELSE 小类名称 END AS 小类名称,
    ${dateSelectColumns}
FROM agg
ORDER BY
    hotelid,
    大类,
    CASE WHEN grp_小类 = 1 THEN 1 ELSE 0 END,
    小类;
    `;

    console.log('[手工填报月报] SQL查询:', sql);

    let results: any[] = [];
    try {
      try {
        getPool();
      } catch {
        await initDatabase();
      }
      const currentPool = getPool();
      const request = currentPool.request();
      console.log('🔍 [SQL Query]', sql);
      const started = Date.now();
      const dbResult = await request.query(sql);
      console.log(`✅ [SQL Result] ${dbResult.recordset.length} rows in ${Date.now() - started}ms`);
      results = dbResult.recordset || [];
    } catch (e) {
      console.error('❌ [SQL Error]', e);
      throw e;
    }

    // 计算合计行
    const totalRow: any = {
      酒店: '合计',
      大类: '合计',
      小类: '合计',
      小类名称: '合计',
    };
    dateColumns.forEach(date => {
      totalRow[date] = results.reduce((sum, row) => sum + (Number(row[date]) || 0), 0);
    });
    totalRow.__type = 'total';

    const allRows = [totalRow, ...results.map(r => ({ ...r, __type: 'normal' }))];
    const totalCount = allRows.length;

    // 如果 pageSize 很大，返回全部数据，否则进行分页
    const items = shouldReturnAll ? allRows : (() => {
      const page = Math.max(parseInt(params.page || '1', 10) || 1, 1);
      const pageSize = [10, 50, 100].includes(requestedPageSize) ? requestedPageSize : 10;
      const startIndex = (page - 1) * pageSize;
      const endIndex = Math.min(startIndex + pageSize, totalCount);
      return allRows.slice(startIndex, endIndex);
    })();

    const responseData = {
      message: '手工填报月报 - 查询结果',
      params,
      timestamp: new Date().toISOString(),
      total: totalCount,
      items,
      dateColumns,
    };

    //console.log('[手工填报月报] 返回给前端的内容:', JSON.stringify(responseData, null, 2));

    return NextResponse.json({ success: true, data: responseData, message: '查询成功' });
  } catch (error) {
    console.error('[手工填报月报] 查询失败:', error);
    return NextResponse.json({ success: false, data: null, message: '查询失败', error: error instanceof Error ? error.message : '未知错误' });
  }
}
