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

    // SQL中的变量转换为前端传入的参数
    const hotelCode = params.hotelCode || '';
    const startDate = params.startDate || '';
    const endDate = params.endDate || '';

    // 日志打印前端页面传入的参数
    console.log('[经营日报-每日明细] 前端页面传入的参数:', params);

    if (!hotelCode) {
      return NextResponse.json({
        success: false,
        data: null,
        error: '酒店代码不能为空',
        message: '查询失败',
      });
    }

    if (!startDate || !endDate) {
      return NextResponse.json({
        success: false,
        data: null,
        error: '日期范围不能为空',
        message: '查询失败',
      });
    }

    // 构建SQL查询 - 按日期分组
    const sql = `
SELECT 
    CAST(a.bdate AS DATE) AS 日期,
    SUM(a.rms_ttl) AS 房间总数,
    SUM(a.rms_occ) AS 已入住房数,
    CAST(
        CASE WHEN SUM(a.rms_ttl) > 0 
            THEN SUM(a.rms_occ) * 1.0 / SUM(a.rms_ttl) 
            ELSE 0 END 
        AS DECIMAL(10,4)
    ) AS 出租率,
    CAST(
        CASE WHEN SUM(a.rms_occ) > 0 
            THEN SUM(a.rev_rm) * 1.0 / SUM(a.rms_occ) 
            ELSE 0 END 
        AS DECIMAL(10,2)
    ) AS 平均房价,
    SUM(a.rev_rm) AS 客房收入,
    SUM(a.rev_fb) AS 餐饮收入,
    SUM(a.rev_ot) AS 其他收入,
    SUM(a.rev_rm + a.rev_fb + a.rev_ot) AS 总收入
FROM [192.168.210.170].[Report].dbo.bi_ttl AS a
INNER JOIN [CrsStar].dbo.StarHotelBaseInfo AS b 
    ON a.hotelid = b.HotelCode
WHERE 
    a.bdate BETWEEN '${startDate.replace(/'/g, "''")}' AND '${endDate.replace(/'/g, "''")}'
    AND a.class = 'total'
    AND b.HotelCode = '${hotelCode.replace(/'/g, "''")}'
    AND b.Status = 1
    AND b.IsDelete = 0
GROUP BY 
    CAST(a.bdate AS DATE)
ORDER BY 
    CAST(a.bdate AS DATE);
    `;

    console.log('[经营日报-每日明细] 查询SQL:', sql);
    console.log('[经营日报-每日明细] 查询参数:', { hotelCode, startDate, endDate });

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

    console.log('[经营日报-每日明细] 查询结果数量:', results.length);

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
      实际售卖间夜数: row.已入住房数, // 实际售卖间夜数就是已入住房数
    }));

    // 获取酒店信息
    let hotelInfo: any = {};
    if (formattedResults.length > 0) {
      try {
        const hotelInfoSql = `
          SELECT HotelCode, HotelName, GroupCode, PMSType, PropertyType, MDMCity
          FROM [CrsStar].dbo.StarHotelBaseInfo
          WHERE HotelCode = '${hotelCode.replace(/'/g, "''")}'
          AND Status = 1
          AND IsDelete = 0
        `;
        const hotelInfoResult = await getPool().request().query(hotelInfoSql);
        if (hotelInfoResult.recordset.length > 0) {
          hotelInfo = hotelInfoResult.recordset[0];
        }
      } catch (error) {
        console.warn('获取酒店信息失败:', error);
      }
    }

    // 日志打印返回给前端的内容
    const responseData = {
      message: '经营日报-每日明细数据',
      params,
      timestamp: new Date().toISOString(),
      hotelInfo,
      data: formattedResults,
    };

    console.log('[经营日报-每日明细] 返回给前端的内容:', JSON.stringify(responseData, null, 2));

    return NextResponse.json({
      success: true,
      data: responseData,
      message: '查询成功',
    });

  } catch (error) {
    console.error('[经营日报-每日明细] 查询失败:', error);
    
    return NextResponse.json({
      success: false,
      data: null,
      error: error instanceof Error ? error.message : '查询失败',
      message: '查询失败',
    });
  }
}

