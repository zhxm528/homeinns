import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/38/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // 获取查询参数
    const groupCodes = searchParams.get('groupCodes') || '';
    const rateCode = searchParams.get('rateCode') || '';
    const marketCode = searchParams.get('marketCode') || '';

    // 构建SQL查询
    // 使用LEFT JOIN，确保即使HotelCode为空或JOIN不到数据也能返回
    let sql = `
      SELECT 
        s.ID,
        s.BrandCode AS 品牌代码,
        s.ColumnName AS 房价码组名称,
        s.ColumnPosition AS 级别,
        s.RateCodeEqual AS 房价码列表,
        s.ResvTypeEqual AS 渠道码,
        s.HotelCode AS 酒店代码,
        h.HotelName AS 酒店名称,
        h.GroupCode AS 管理公司
      FROM [CrsStar].dbo.StarProducitonReportSetting AS s
      LEFT JOIN [CrsStar].dbo.StarHotelBaseInfo AS h 
        ON s.HotelCode = h.HotelCode
        AND h.IsDelete = 0
      WHERE 1=1
        AND (s.HotelCode IS NULL OR s.HotelCode = '' OR h.GroupCode IS NOT NULL)
    `;

    // 添加查询条件
    // 酒店管理公司筛选：使用BrandCode字段进行筛选
    if (groupCodes) {
      const codes = groupCodes.split(',').map(code => `'${code.trim()}'`).join(',');
      sql += ` AND s.BrandCode IN (${codes})`;
    }

    if (rateCode) {
      sql += ` AND s.RateCodeEqual LIKE '%${rateCode}%'`;
    }

    if (marketCode) {
      sql += ` AND EXISTS (
        SELECT 1 FROM [CrsStar].dbo.SOP_StarMarketInfo_Brand AS m
        WHERE m.MarketCode LIKE '%${marketCode}%'
        AND m.BrandCode = s.BrandCode
        AND m.IsValid = 1
        AND m.IsDelete = 0
      )`;
    }

    sql += ` ORDER BY s.ColumnPosition, s.HotelCode`;

    console.log('房价码分组查询SQL:', sql);
    console.log('查询参数:', { groupCodes, rateCode, marketCode });

    // 执行查询
    const results = await executeQuery<any>(sql);

    // 处理结果 - 解析房价码列表并计算数量
    // 注意：当 HotelCode 为空时，酒店相关的字段（酒店代码、酒店名称、管理公司）会为 NULL
    const processedResults = await Promise.all(results.map(async (row: any) => {
      // 解析房价码列表
      let 房价码明细列表: string[] = [];
      let 房价码数量 = 0;
      
      if (row.房价码列表) {
        // 假设房价码列表格式为逗号分隔的字符串
        房价码明细列表 = row.房价码列表.split(',').map((rc: string) => rc.trim()).filter((rc: string) => rc);
        房价码数量 = 房价码明细列表.length;
      }

      // 查询市场码信息
      let 市场码 = '';
      if (row.品牌代码) {
        try {
          const marketQuery = `
            SELECT TOP 1 MarketCode 
            FROM [CrsStar].dbo.SOP_StarMarketInfo_Brand 
            WHERE BrandCode = '${row.品牌代码}' 
            AND IsValid = 1 
            AND IsDelete = 0
          `;
          const marketResults = await executeQuery<any>(marketQuery);
          if (marketResults.length > 0) {
            市场码 = marketResults[0].MarketCode || '';
          }
        } catch (error) {
          console.warn('查询市场码失败:', error);
        }
      }
      
      return {
        ID: row.ID,
        品牌代码: row.品牌代码 || '',
        房价码组名称: row.房价码组名称 || '',
        房价码数量: 房价码数量,
        房价码明细列表: 房价码明细列表,
        级别: row.级别 || 0,
        酒店代码: row.酒店代码 || '',
        酒店名称: row.酒店名称 || '',
        管理公司: row.管理公司 || '',
        渠道码: row.渠道码 || '',
        市场码: 市场码
      };
    }));

    console.log('房价码分组查询结果:', processedResults);

    return NextResponse.json({
      success: true,
      data: processedResults,
      message: '查询成功'
    });

  } catch (error) {
    console.error('房价码分组查询失败:', error);
    
    // 返回备用数据
    const fallbackData = [
      {
        ID: 1,
        品牌代码: 'JG',
        房价码组名称: '标准房价码',
        房价码数量: 2,
        房价码明细列表: ['TTCOR1 TestRateCode1', 'TTCOB1 TestRateCode2'],
        级别: 1,
        酒店代码: 'BJ001',
        酒店名称: '北京建国饭店',
        管理公司: 'JG',
        渠道码: 'CTP',
        市场码: ''
      },
      {
        ID: 2,
        品牌代码: 'NI',
        房价码组名称: '通用房价码',
        房价码数量: 0,
        房价码明细列表: [],
        级别: 2,
        酒店代码: '',
        酒店名称: '',
        管理公司: '',
        渠道码: 'WEB',
        市场码: ''
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
