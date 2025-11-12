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
    const propertyTypes = params.propertyTypes || ''; // 逗号分隔的字符串
    const pmsTypes = params.pmsTypes || ''; // 逗号分隔的字符串，但SQL中固定为 'XMS', 'x6', 'Cambridge'
    const onlyShowDiff = params.onlyShowDiff === 'true'; // 仅查看有差异酒店

    // 日志打印前端页面传入的参数
    console.log('[BI和客史差异检查] 前端页面传入的参数:', params);

    // 构建PropertyType过滤条件（如果有）
    const propertyTypeFilter = propertyTypes
      ? `AND c.PropertyType IN (${propertyTypes.split(',').map(t => `'${t.trim().replace(/'/g, "''")}'`).join(',')})`
      : '';

    // 构建PMSType过滤条件（如果有，否则使用默认值）
    const pmsTypeList = pmsTypes
      ? pmsTypes.split(',').map(t => t.trim().replace(/'/g, "''")).filter(t => t)
      : ['XMS', 'x6', 'Cambridge']; // 默认值
    const pmsTypeFilter = `('${pmsTypeList.join("','")}')`;

    // 构建SQL查询
    const sql = `
/********************************************************************
* 名称：BI 与 CRS 客史数据对比脚本（含 ISNULL 防警告版）
* 功能：对比 BI 系统与 CRS 系统在相同日期、相同酒店下的间夜数与房费金额差异
********************************************************************/

DECLARE 
    @StartDate DATETIME = '${startDate.replace(/'/g, "''")}',
    @EndDate   DATETIME = '${endDate.replace(/'/g, "''")}';

BEGIN
    ---------------------------------------------------------------
    -- 1. 清理旧临时表
    ---------------------------------------------------------------
    IF OBJECT_ID('tempdb..#BIData') IS NOT NULL DROP TABLE #BIData;
    IF OBJECT_ID('tempdb..#CRSData') IS NOT NULL DROP TABLE #CRSData;

    ---------------------------------------------------------------
    -- 2. BI 数据汇总（来自远程服务器 192.168.210.170）
    ---------------------------------------------------------------
    SELECT 
        hotelid,
        CAST(bdate AS DATE) AS bdate,
        SUM(ISNULL(rms_occ, 0)) AS occ,
        SUM(ISNULL(rev_rm, 0)) AS rm
    INTO #BIData
    FROM [192.168.210.170].[Report].dbo.bi_mkt
    WHERE bdate BETWEEN @StartDate AND @EndDate
    GROUP BY hotelid, CAST(bdate AS DATE);

    ---------------------------------------------------------------
    -- 3. CRS 客史数据汇总
    ---------------------------------------------------------------
    SELECT 
        a.HotelCd AS hotelid,
        CAST(b.DailyDate AS DATE) AS bdate,
        SUM(ISNULL(b.RoomNightNum, 0)) AS occ,
        SUM(CASE 
              WHEN c.PMSType = 'XMS' THEN ISNULL(b.XFRoomCost, 0)
              WHEN c.PMSType IN ('x6', 'Cambridge') THEN ISNULL(b.RoomCost, 0)
              ELSE 0 
            END) AS rm,
        SUM(ISNULL(b.OtherCost, 0)) AS otherCost,
        MAX(c.PMSType) AS PMSType,
        MAX(c.PropertyType) AS PropertyType
    INTO #CRSData
    FROM [CrsStar ].dbo.MemberChildOrderRecord a
    INNER JOIN [CrsStar ].dbo.MemberChildOrderRecordDailyRate b
        ON a.Res_Account = b.OrderNo
    INNER JOIN [CrsStar ].dbo.StarHotelBaseInfo c
        ON a.HotelCd = c.HotelCode
    WHERE b.DailyDate BETWEEN @StartDate AND @EndDate
      AND c.PMSType IN ${pmsTypeFilter}
    GROUP BY a.HotelCd, CAST(b.DailyDate AS DATE);

    ---------------------------------------------------------------
    -- 4. 对比汇总结果
    ---------------------------------------------------------------
    SELECT 
        c.HotelCode,
        c.HotelName,
        c.PMSType,
        c.PropertyType,
        bi.bdate,
        bi.occ AS BI间夜,
        crs.occ AS CRS间夜,
        bi.rm AS BI金额,
        crs.rm AS CRS金额,
        ROUND(ISNULL(crs.rm,0) - ISNULL(bi.rm,0), 2) AS 金额差,
        CASE 
            WHEN ISNULL(bi.rm,0) = 0 THEN NULL
            ELSE ROUND(((ISNULL(crs.rm,0) - ISNULL(bi.rm,0)) / ISNULL(bi.rm,1)) * 100, 0)
        END AS 相差百分比
    FROM #BIData bi
    LEFT JOIN #CRSData crs 
        ON bi.hotelid = crs.hotelid 
       AND bi.bdate = crs.bdate
    INNER JOIN [CrsStar ].dbo.StarHotelBaseInfo c
        ON bi.hotelid = c.HotelCode
    WHERE 
        c.PMSType IN ${pmsTypeFilter}
        ${propertyTypeFilter}
    ORDER BY bi.bdate, c.PMSType, c.HotelName;
END
    `;

    console.log('[BI和客史差异检查] 查询SQL:', sql);
    console.log('[BI和客史差异检查] 查询参数:', { startDate, endDate, propertyTypes, pmsTypes, onlyShowDiff });

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

    console.log('[BI和客史差异检查] 查询结果数量:', results.length);

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
    let formattedResults = results.map((row: any) => ({
      ...row,
      bdate: formatDate(row.bdate),
    }));

    // 如果勾选了"仅查看有差异酒店"，进行过滤
    if (onlyShowDiff) {
      formattedResults = formattedResults.filter((row: any) => {
        const pctDiff = row.相差百分比;
        if (pctDiff === null || pctDiff === undefined) return false;
        
        const roundedPct = Math.round(pctDiff);
        const pmsType = row.PMSType;
        const hotelCode = row.HotelCode;
        
        // 如果 PMSType='Cambridge' 时，相差率取整后不等于6的记录是差异记录
        // 如果 PMSType不等于'Cambridge' 时，相差率取整后大于0的记录是差异记录
        if (pmsType === 'Cambridge') {
          if(hotelCode === 'JG0003' || hotelCode === 'JG0004' || hotelCode === 'JG0005'|| hotelCode === 'JG0040'){
            return roundedPct > 0;
          }
          return roundedPct !== 6;
        } else {
          return roundedPct > 0;
        }
      });
    }

    // 计算合计行
    const totalRow = {
      HotelCode: '合计',
      HotelName: '合计',
      PMSType: '合计',
      PropertyType: '合计',
      bdate: '合计',
      BI间夜: formattedResults.reduce((sum: number, row: any) => sum + (Number(row.BI间夜) || 0), 0),
      CRS间夜: formattedResults.reduce((sum: number, row: any) => sum + (Number(row.CRS间夜) || 0), 0),
      BI金额: formattedResults.reduce((sum: number, row: any) => sum + (Number(row.BI金额) || 0), 0),
      CRS金额: formattedResults.reduce((sum: number, row: any) => sum + (Number(row.CRS金额) || 0), 0),
      金额差: formattedResults.reduce((sum: number, row: any) => sum + (Number(row.金额差) || 0), 0),
      相差百分比: (() => {
        const totalBI = formattedResults.reduce((sum: number, row: any) => sum + (Number(row.BI金额) || 0), 0);
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
      message: 'BI和客史差异检查数据',
      params,
      timestamp: new Date().toISOString(),
      total,
      items,
    };

    //console.log('[BI和客史差异检查] 返回给前端的内容:', JSON.stringify(responseData, null, 2));

    return NextResponse.json({
      success: true,
      data: responseData,
      message: '查询成功',
    });

  } catch (error) {
    console.error('[BI和客史差异检查] 查询失败:', error);
    
    return NextResponse.json({
      success: false,
      data: null,
      error: error instanceof Error ? error.message : '查询失败',
      message: '查询失败',
    });
  }
}
