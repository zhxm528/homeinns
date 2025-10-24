import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/38/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // 获取查询参数
    const startDate = searchParams.get('startDate') || new Date().toISOString().split('T')[0];
    const endDate = searchParams.get('endDate') || new Date().toISOString().split('T')[0];
    const rateCodes = searchParams.get('rateCodes') || '';
    const channelCodes = searchParams.get('channelCodes') || '';
    const groupCodes = searchParams.get('groupCodes') || '';
    const hotelCode = searchParams.get('hotelCode') || '';
    const status = searchParams.get('status') || '1';
    const isDelete = searchParams.get('isDelete') || '0';
    const pmsTypes = searchParams.get('pmsTypes') || '';
    const propertyTypes = searchParams.get('propertyTypes') || '';

    // 构建SQL查询
    // 注意：这是一个示例查询，因为实际数据库中可能没有订单表
    // 实际使用时需要根据数据库结构调整
    const sql = `
DECLARE @StartDate DATE = CAST('${startDate}' AS DATE);
DECLARE @EndDate DATE = CAST('${endDate}' AS DATE);

WITH RateCodeGroups AS (
    SELECT
        h.hotelCode,
        h.hotelName,
        h.GroupCode,
        h.PMSType,
        h.PropertyType,
        h.status,
        h.isDelete,
        r.rateCode,
        r.rateCodeName,
        r.RateGrouping,
        p.ChannelCode
    FROM [CrsStar].dbo.StarHotelBaseInfo AS h
    INNER JOIN [CrsStar].dbo.StarRateCodeInfo AS r
        ON h.hotelCode = r.hotelCode
        AND r.isDelete = ${isDelete}
        AND r.beginDate <= @EndDate
        AND r.endDate >= @StartDate
        ${rateCodes ? `AND r.rateCode IN (${rateCodes.split(',').map(code => `'${code.trim()}'`).join(',')})` : ''}
    INNER JOIN [CrsStar].dbo.StarPublishRateCodeInfo AS p
        ON r.rateCode = p.rateCode
        AND r.hotelCode = p.hotelCode
        AND p.beginDate <= @EndDate
        AND p.endDate >= @StartDate
        ${channelCodes ? `AND p.ChannelCode IN (${channelCodes.split(',').map(code => `'${code.trim()}'`).join(',')})` : ''}
    WHERE 
        ${groupCodes ? `h.GroupCode IN (${groupCodes.split(',').map(code => `'${code.trim()}'`).join(',')})` : '1=1'}
        ${hotelCode ? `AND h.hotelCode = '${hotelCode}'` : ''}
        AND h.Status = ${status}
        AND h.IsDelete = ${isDelete}
        ${pmsTypes ? `AND h.PMSType IN (${pmsTypes.split(',').map(type => `'${type.trim()}'`).join(',')})` : ''}
        ${propertyTypes ? `AND h.PropertyType IN (${propertyTypes.split(',').map(type => `'${type.trim()}'`).join(',')})` : ''}
)
SELECT
    ISNULL(rcg.RateGrouping, '未分组') AS 房价码组名称,
    COUNT(DISTINCT rcg.rateCode) AS 房价码,
    COUNT(DISTINCT rcg.ChannelCode) AS 渠道,
    -- 以下字段需要从实际订单表获取，这里使用模拟数据
    0 AS 间夜数,
    0 AS 客房收入,
    0 AS 平均房价,
    STUFF((
        SELECT DISTINCT ',' + r2.rateCode + ' ' + r2.rateCodeName
        FROM RateCodeGroups AS r2
        WHERE r2.RateGrouping = rcg.RateGrouping
            AND r2.GroupCode = rcg.GroupCode
        FOR XML PATH(''), TYPE
    ).value('.', 'NVARCHAR(MAX)'), 1, 1, '') AS 房价码明细,
    STUFF((
        SELECT DISTINCT ',' + r2.ChannelCode + ' ' + 
            CASE r2.ChannelCode
                WHEN 'CTP' THEN '携程'
                WHEN 'MDI' THEN '美团'
                WHEN 'OBR' THEN '飞猪'
                WHEN 'CTM' THEN '商旅'
                WHEN 'WEB' THEN '官渠'
                ELSE r2.ChannelCode
            END
        FROM RateCodeGroups AS r2
        WHERE r2.RateGrouping = rcg.RateGrouping
            AND r2.GroupCode = rcg.GroupCode
        FOR XML PATH(''), TYPE
    ).value('.', 'NVARCHAR(MAX)'), 1, 1, '') AS 渠道明细
FROM RateCodeGroups AS rcg
GROUP BY rcg.RateGrouping, rcg.GroupCode
ORDER BY rcg.GroupCode, rcg.RateGrouping;
    `;

    console.log('房价码产量报表查询SQL:', sql);
    console.log('查询参数:', { startDate, endDate, rateCodes, channelCodes, groupCodes, hotelCode, status, isDelete, pmsTypes, propertyTypes });

    // 执行查询
    const results = await executeQuery(sql);

    console.log('房价码产量报表查询结果:', results);

    return NextResponse.json({
      success: true,
      data: results,
      message: '查询成功'
    });

  } catch (error) {
    console.error('房价码产量报表查询失败:', error);
    
    // 返回备用数据
    const fallbackData = [
      {
        房价码组名称: '标准房价组',
        房价码: 5,
        渠道: 3,
        间夜数: 1250,
        客房收入: 156250,
        平均房价: 125,
        房价码明细: 'TTCOR1 标准房价,TTCOR2 商务房价,TTCOR3 会员房价,TTCOR4 团队房价,TTCOR5 协议房价',
        渠道明细: 'CTP 携程,MDI 美团,OBR 飞猪'
      },
      {
        房价码组名称: '优惠房价组',
        房价码: 3,
        渠道: 2,
        间夜数: 850,
        客房收入: 102000,
        平均房价: 120,
        房价码明细: 'DISCO1 折扣房价,DISCO2 促销房价,DISCO3 特价房价',
        渠道明细: 'WEB 官渠,CTM 商旅'
      }
    ];

    return NextResponse.json({
      success: false,
      data: fallbackData,
      error: error instanceof Error ? error.message : '数据库查询失败',
      fallback: true,
      message: '使用备用数据'
    });
  }
}

