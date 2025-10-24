import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/38/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // 获取查询参数
    const queryDate = searchParams.get('queryDate') || new Date().toISOString().split('T')[0];
    const rateCodes = searchParams.get('rateCodes') || '';
    const channelCodes = searchParams.get('channelCodes') || '';
    const groupCodes = searchParams.get('groupCodes') || '';
    const status = searchParams.get('status') || '1';
    const isDelete = searchParams.get('isDelete') || '0';
    const pmsTypes = searchParams.get('pmsTypes') || '';
    const propertyTypes = searchParams.get('propertyTypes') || '';

    // 构建SQL查询
    const sql = `
DECLARE @Today DATE = CAST('${queryDate}' AS DATE);

WITH RatePublish AS (
    SELECT
        h.hotelCode,
        h.hotelName,
        p.ChannelCode,
        r.rateCode,
        r.rateCodeName,
        r.beginDate AS 房价码开始日期,
        r.endDate AS 房价码结束日期,
        p.beginDate AS 发布开始日期,
        p.endDate AS 发布结束日期,
        h.PMSType,
        h.PropertyType,
        h.status,
        h.isDelete
    FROM [CrsStar].dbo.StarHotelBaseInfo AS h
    INNER JOIN [CrsStar].dbo.StarRateCodeInfo AS r
        ON h.hotelCode = r.hotelCode
        AND r.isDelete = ${isDelete}
        AND r.beginDate <= @Today
        AND r.endDate >= @Today
        ${rateCodes ? `AND r.rateCode IN (${rateCodes.split(',').map(code => `'${code.trim()}'`).join(',')})` : ''}
    INNER JOIN [CrsStar].dbo.StarPublishRateCodeInfo AS p
        ON r.rateCode = p.rateCode
        AND r.hotelCode = p.hotelCode
        AND p.beginDate <= @Today
        AND p.endDate >= @Today
        ${channelCodes ? `AND p.ChannelCode IN (${channelCodes.split(',').map(code => `'${code.trim()}'`).join(',')})` : ''}
    WHERE 
        ${groupCodes ? `h.GroupCode IN (${groupCodes.split(',').map(code => `'${code.trim()}'`).join(',')})` : '1=1'}
        AND h.Status = ${status}
        AND h.IsDelete = ${isDelete}
        ${pmsTypes ? `AND h.PMSType IN (${pmsTypes.split(',').map(type => `'${type.trim()}'`).join(',')})` : ''}
        ${propertyTypes ? `AND h.PropertyType IN (${propertyTypes.split(',').map(type => `'${type.trim()}'`).join(',')})` : ''}
)

SELECT
    rp.hotelCode AS 酒店编码,
    MAX(rp.hotelName) AS 酒店名称,
    MAX(rp.PropertyType) AS 酒店类型,
    MAX(rp.PMSType) AS PMSType,
    rp.ChannelCode AS 发布渠道,
    COUNT(DISTINCT rp.rateCode) AS 房价码发布数量,
    STUFF((
        SELECT DISTINCT ',' + r2.rateCode+' '+ r2.rateCodeName
        FROM RatePublish AS r2
        WHERE r2.hotelCode = rp.hotelCode
          AND r2.ChannelCode = rp.ChannelCode
        FOR XML PATH(''), TYPE
    ).value('.', 'NVARCHAR(MAX)'), 1, 1, '') AS 房价码明细列表
FROM RatePublish AS rp
GROUP BY rp.hotelCode, rp.ChannelCode
ORDER BY rp.hotelCode, rp.ChannelCode;
    `;

    console.log('RateCode检查查询SQL:', sql);
    console.log('查询参数:', { queryDate, rateCodes, channelCodes, groupCodes, status, isDelete, pmsTypes, propertyTypes });

    // 执行查询
    const results = await executeQuery(sql);

    console.log('RateCode检查查询结果:', results);

    return NextResponse.json({
      success: true,
      data: results,
      message: '查询成功'
    });

  } catch (error) {
    console.error('RateCode检查查询失败:', error);
    
    // 返回备用数据
    const fallbackData = [
      {
        酒店编码: 'BJ001',
        酒店名称: '北京建国饭店',
        酒店类型: 'SLJT',
        PMSType: 'X6',
        发布渠道: 'OBR',
        房价码发布数量: 2,
        房价码明细列表: 'TTCOR1 TestRateCode1,TTCOB1 TestRateCode2'
      },
      {
        酒店编码: 'SH002',
        酒店名称: '上海京伦酒店',
        酒店类型: 'SJJT',
        PMSType: 'P3',
        发布渠道: 'OBR',
        房价码发布数量: 1,
        房价码明细列表: 'TTCOR1 TestRateCode1'
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
