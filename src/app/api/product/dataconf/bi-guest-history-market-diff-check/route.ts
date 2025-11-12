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
    const startDate = params.startDate || new Date().toISOString().split('T')[0];
    const endDate = params.endDate || new Date().toISOString().split('T')[0];
    const hotelList = params.hotelList || ''; // 逗号分隔的酒店代码字符串

    // 日志打印前端页面传入的参数
    console.log('[BI和客史市场差异检查] 前端页面传入的参数:', params);

    // 构建SQL查询
    // 转义单引号，防止SQL注入
    const safeStartDate = startDate.replace(/'/g, "''");
    const safeEndDate = endDate.replace(/'/g, "''");
    const safeHotelList = hotelList.replace(/'/g, "''");

    const sql = `
/********************************************************************
* 通用 BI vs CRS 对比脚本（兼容无 STRING_SPLIT 的 SQL Server）
* 特性：
*  - 使用 XML 法拆分酒店列表（兼容旧版本）
*  - 支持日期范围、多酒店
*  - 防止 NULL 导致的聚合警告（使用 ISNULL）
*  - 金额保留两位小数，百分比取整
*  - 来源：远程 BI -> [192.168.210.170].[Report].dbo.bi_mkt
*           CRS  -> [CrsStar ].dbo.*
********************************************************************/

DECLARE
    @StartDate DATE = '${safeStartDate}',
    @EndDate   DATE = '${safeEndDate}',
    @HotelList NVARCHAR(MAX) = '${safeHotelList}';  -- 多个酒店用逗号分隔

-- 清理（保险）
IF OBJECT_ID('tempdb..#BI') IS NOT NULL DROP TABLE #BI;
IF OBJECT_ID('tempdb..#CRS') IS NOT NULL DROP TABLE #CRS;
IF OBJECT_ID('tempdb..#HotelList') IS NOT NULL DROP TABLE #HotelList;
IF OBJECT_ID('tempdb..#HotelInfo') IS NOT NULL DROP TABLE #HotelInfo;

---------------------------------------------------------------------
-- 拆分酒店列表：XML 法（兼容旧版 SQL Server）
---------------------------------------------------------------------
${hotelList ? `
;WITH xml_source AS (
    SELECT CAST('<x>' + REPLACE(@HotelList, ',', '</x><x>') + '</x>' AS XML) AS xmldata
)
, Split AS (
    SELECT LTRIM(RTRIM(m.n.value('.[1]', 'NVARCHAR(100)'))) AS HotelCd
    FROM xml_source t
    CROSS APPLY t.xmldata.nodes('/x') m(n)
)
SELECT DISTINCT HotelCd
INTO #HotelList
FROM Split
WHERE LEN(LTRIM(RTRIM(HotelCd))) > 0;
` : `
-- 如果没有指定酒店列表，创建空表
SELECT CAST('' AS NVARCHAR(100)) AS HotelCd
INTO #HotelList
WHERE 1=0;
`}

---------------------------------------------------------------------
-- 1) 从远程 BI 汇总（按 hotelid, date, class）
---------------------------------------------------------------------
SELECT 
    a.hotelid AS HotelId,
    CAST(a.bdate AS DATE) AS BusinessDate,
    a.class AS Category,
    ISNULL(SUM(a.rms_occ), 0) AS biOCC,
    ISNULL(SUM(a.rev_rm), 0)   AS biBIRM,
    ISNULL(SUM(a.avg_rt), 0)   AS biBIRT
INTO #BI
FROM [192.168.210.170].[Report].dbo.bi_mkt a
${hotelList ? 'INNER JOIN #HotelList h ON a.hotelid = h.HotelCd' : ''}
WHERE CAST(a.bdate AS DATE) BETWEEN @StartDate AND @EndDate
GROUP BY a.hotelid, CAST(a.bdate AS DATE), a.class;

---------------------------------------------------------------------
-- 2) 从 CRS 汇总（按 HotelCd, DailyDate, Marketplace）
---------------------------------------------------------------------
SELECT
    a.HotelCd,
    CAST(b.DailyDate AS DATE) AS DailyDate,
    a.Marketplace,
    ISNULL(SUM(b.RoomNightNum), 0) AS crsRoomNightNum,
    ISNULL(SUM(b.RoomCost), 0)      AS crsRoomCost,
    ISNULL(SUM(b.OtherCost), 0)     AS crsOtherCost,
    ISNULL(SUM(b.TotalCost), 0)     AS crsTotalCost
INTO #CRS
FROM [CrsStar ].dbo.MemberChildOrderRecord a
INNER JOIN [CrsStar ].dbo.MemberChildOrderRecordDailyRate b
    ON a.Res_Account = b.OrderNo
${hotelList ? 'INNER JOIN #HotelList hl ON a.HotelCd = hl.HotelCd' : ''}
WHERE CAST(b.DailyDate AS DATE) BETWEEN @StartDate AND @EndDate
GROUP BY a.HotelCd, CAST(b.DailyDate AS DATE), a.Marketplace;

---------------------------------------------------------------------
-- 3) （可选）获取酒店名称：从 CRS 的 StarHotelBaseInfo 拿 name（若存在）
--    只选择在BI或CRS数据中出现的酒店
---------------------------------------------------------------------
SELECT DISTINCT
    s.HotelCode AS HotelId,
    s.HotelName
INTO #HotelInfo
FROM [CrsStar ].dbo.StarHotelBaseInfo s
WHERE s.HotelCode IN (SELECT DISTINCT HotelId FROM #BI)
   OR s.HotelCode IN (SELECT DISTINCT HotelCd FROM #CRS);

---------------------------------------------------------------------
-- 4) 最终汇总与对比
---------------------------------------------------------------------
SELECT
    bi.HotelId   AS HotelCode,
    ISNULL(hi.HotelName, '') AS HotelName,
    bi.BusinessDate AS [日期],
    bi.Category     AS [类别],

    -- BI 数据
    bi.biOCC    AS [BI间夜数],
    ROUND(bi.biBIRM, 2) AS [BI房费金额],

    -- CRS 数据（若无数据，则 0）
    ISNULL(crs.crsRoomNightNum, 0) AS [CRS间夜数],
    ROUND(ISNULL(crs.crsRoomCost, 0), 2) AS [CRS房费金额],

    -- 差值与百分比（金额差保留两位小数；百分比取整）
    (ISNULL(crs.crsRoomNightNum, 0) - ISNULL(bi.biOCC, 0)) AS [间夜差],
    ROUND(ISNULL(crs.crsRoomCost, 0) - ISNULL(bi.biBIRM, 0), 2) AS [金额差],
    CASE 
        WHEN ISNULL(bi.biBIRM, 0) = 0 THEN NULL
        ELSE CAST(ROUND(((ISNULL(crs.crsRoomCost, 0) - ISNULL(bi.biBIRM, 0)) / NULLIF(bi.biBIRM,0)) * 100, 0) AS INT)
    END AS [差异百分比]
FROM #BI bi
LEFT JOIN #CRS crs
    ON bi.HotelId = crs.HotelCd
   AND bi.BusinessDate = crs.DailyDate
   AND bi.Category = crs.Marketplace
LEFT JOIN #HotelInfo hi
    ON bi.HotelId = hi.HotelId
ORDER BY bi.HotelId, bi.BusinessDate, bi.Category;

---------------------------------------------------------------------
-- 5) 清理临时表
---------------------------------------------------------------------
IF OBJECT_ID('tempdb..#BI') IS NOT NULL DROP TABLE #BI;
IF OBJECT_ID('tempdb..#CRS') IS NOT NULL DROP TABLE #CRS;
IF OBJECT_ID('tempdb..#HotelList') IS NOT NULL DROP TABLE #HotelList;
IF OBJECT_ID('tempdb..#HotelInfo') IS NOT NULL DROP TABLE #HotelInfo;
    `;

    console.log('[BI和客史市场差异检查] 查询SQL:', sql);
    console.log('[BI和客史市场差异检查] 查询参数:', { startDate, endDate, hotelList });

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

    console.log('[BI和客史市场差异检查] 查询结果数量:', results.length);

    // 格式化日期的辅助函数
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

    // 格式化查询结果中的日期字段
    const formattedResults = results.map((row: any) => ({
      ...row,
      日期: formatDate(row.日期),
    }));

    // 计算合计行
    const totalRow = {
      HotelCode: '合计',
      HotelName: '合计',
      日期: '合计',
      类别: '合计',
      BI间夜数: formattedResults.reduce((sum: number, row: any) => sum + (Number(row.BI间夜数) || 0), 0),
      BI房费金额: formattedResults.reduce((sum: number, row: any) => sum + (Number(row.BI房费金额) || 0), 0),
      CRS间夜数: formattedResults.reduce((sum: number, row: any) => sum + (Number(row.CRS间夜数) || 0), 0),
      CRS房费金额: formattedResults.reduce((sum: number, row: any) => sum + (Number(row.CRS房费金额) || 0), 0),
      间夜差: formattedResults.reduce((sum: number, row: any) => sum + (Number(row.间夜差) || 0), 0),
      金额差: formattedResults.reduce((sum: number, row: any) => sum + (Number(row.金额差) || 0), 0),
      差异百分比: (() => {
        const totalBI = formattedResults.reduce((sum: number, row: any) => sum + (Number(row.BI房费金额) || 0), 0);
        const totalDiff = formattedResults.reduce((sum: number, row: any) => sum + (Number(row.金额差) || 0), 0);
        return totalBI > 0 ? Math.round((totalDiff / totalBI) * 100) : null;
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
      message: 'BI和客史市场差异检查数据',
      params,
      timestamp: new Date().toISOString(),
      total,
      items,
    };

    console.log('[BI和客史市场差异检查] 返回给前端的内容:', JSON.stringify(responseData, null, 2));

    return NextResponse.json({
      success: true,
      data: responseData,
      message: '查询成功',
    });

  } catch (error) {
    console.error('[BI和客史市场差异检查] 查询失败:', error);
    
    return NextResponse.json({
      success: false,
      data: null,
      error: error instanceof Error ? error.message : '查询失败',
      message: '查询失败',
    });
  }
}
