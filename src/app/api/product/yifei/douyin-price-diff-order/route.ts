import { NextRequest, NextResponse } from 'next/server';
import { getPool, initDatabase } from '@/lib/38/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });

    const depDateStart = params.depDateStart || new Date().toISOString().split('T')[0];
    // 固定的渠道与酒店Like，不从前端读取
    const fixedAgentCds = ['CHDYRL', 'DOU'];
    const agentCds = fixedAgentCds.map(s => `'${s.replace(/'/g, "''")}'`).join(',');
    // hotelCdLike 可能是单个模式如 'UC%' 或多个模式如 'UC%,WX%'
    const hotelCdLike = params.hotelCdLike || 'UC%';
    
    // 解析 hotelCdLike，支持多个模式（逗号分隔）
    const hotelCdPatterns = hotelCdLike.split(',').map(p => p.trim()).filter(Boolean);
    const hotelCdLikeConditions = hotelCdPatterns.map(pattern => {
      const escapedPattern = pattern.replace(/'/g, "''");
      return `orderRoom.HotelCd LIKE '${escapedPattern}'`;
    }).join(' OR ');

    //console.log('[抖音加价差异订单] 使用的查询参数(固定部分不受前端控制):', { depDateStart, agentCds, hotelCdLike, hotelCdPatterns });

    const sql = `
DECLARE 
  @DepDateStart date = CAST('${depDateStart}' AS DATE);

SELECT 
  orderRoom.OrderNo AS [C3订单号],
  other.ChannelUniqueResID AS [抖音订单号],
  orderRoom.HotelCd AS [酒店代码],
  orderRoom.HotelName AS [酒店名称],
  orderRoom.GustNm AS [客人姓名],
  orderRoom.RoomTypeCode AS [房型],
  orderRoom.RateCode AS [房价码],
  CONVERT(varchar(10), orderRoom.ArrDate, 120) AS [入住日期],
  CONVERT(varchar(10), orderRoom.DepDate, 120) AS [离店日期],
  orderRoom.CRSResvDate AS [预订日期],
  bill.GrantRt AS [P3金额],
  CAST(CAST(ext.Value AS DECIMAL(10,2)) / 100 AS DECIMAL(10,2)) AS [抖音金额],
  CAST(CAST(ext.Value AS DECIMAL(10,2)) / 100 AS DECIMAL(10,2)) - bill.GrantRt AS [差额]
FROM [CrsStar].dbo.View_StarOrderRoom_All orderRoom
LEFT JOIN [CrsStar].dbo.View_StarOrderExtension_All ext
  ON orderRoom.OrderNo = ext.OrderNo 
  AND ext.DataType = 'TiktokPriceIncrease'
LEFT JOIN [CrsStar].dbo.View_StarOrderBill_All bill
  ON orderRoom.OrderNo = bill.OrderNo
  AND bill.TransClass = 'DR'
LEFT JOIN [CrsStar].dbo.View_StarOrderOtherRole_All other
  ON orderRoom.OrderNo = other.OrderNo
  AND other.OrderType NOT IN ('XMSPMSOrderNo', 'PMS3OrderNo', 'CambridgeOrderNo', 'CommissionCode', 'CHTFRS')
WHERE 
  orderRoom.DepDate >= @DepDateStart
  AND orderRoom.AgentCd IN (${agentCds})
  AND (${hotelCdLikeConditions})
  AND CAST(CAST(ext.Value AS DECIMAL(10,2)) / 100 AS DECIMAL(10,2)) <> orderRoom.MustPayMoney
ORDER BY orderRoom.OrderNo DESC;`;

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

    const totalRow = {
      C3订单号: '合计',
      抖音订单号: '合计',
      酒店代码: '合计',
      酒店名称: '合计',
      客人姓名: '合计',
      房型: '合计',
      房价码: '合计',
      入住日期: '—',
      离店日期: '—',
      预订日期: '—',
      P3金额: results.reduce((s, r) => s + (Number(r['P3金额']) || 0), 0),
      抖音金额: results.reduce((s, r) => s + (Number(r['抖音金额']) || 0), 0),
      差额: results.reduce((s, r) => s + (Number(r['差额']) || 0), 0),
      __type: 'total' as const,
    };

    const allRows = [totalRow, ...results.map(r => ({ ...r, __type: 'normal' as const }))];
    const totalCount = allRows.length;
    const items = allRows;

    const responseData = {
      message: '抖音加价差异订单 - 查询结果',
      params,
      timestamp: new Date().toISOString(),
      total: totalCount,
      items,
    };

    //console.log('[抖音加价差异订单] 返回给前端的内容:', JSON.stringify(responseData, null, 2));

    return NextResponse.json({ success: true, data: responseData, message: '查询成功' });
  } catch (error) {
    console.error('[抖音加价差异订单] 查询失败:', error);
    return NextResponse.json({ success: false, data: null, message: '查询失败', error: error instanceof Error ? error.message : '未知错误' });
  }
}


