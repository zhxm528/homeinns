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
    const startDate = params.startDate || '';
    const endDate = params.endDate || '';
    const groupCodes = params.groupCodes || ''; // 逗号分隔的字符串，如 'NH,JL,JG,NY,KP,NI,NU'
    const hotelCode = params.hotelCode || ''; // 酒店代码（模糊查询）
    const hotelName = params.hotelName || ''; // 酒店名称（模糊查询）
    const areas = params.areas || ''; // 区域（逗号分隔）
    const urbanAreas = params.urbanAreas || ''; // 城市区域（逗号分隔）
    const provinces = params.provinces || ''; // 省份（逗号分隔）
    const cities = params.cities || ''; // 城市（逗号分隔）

    // 日志打印前端页面传入的参数
    console.log('[经营日报] 前端页面传入的参数:', params);

    // 构建WHERE条件
    let whereConditions = `WHERE a.class = 'total' AND b.Status = 1 AND b.IsDelete = 0`;

    // 日期范围
    if (startDate && endDate) {
      whereConditions += ` AND a.bdate BETWEEN '${startDate.replace(/'/g, "''")}' AND '${endDate.replace(/'/g, "''")}'`;
    }

    // 管理公司
    if (groupCodes) {
      const codes = groupCodes.split(',').map(code => `'${code.trim().replace(/'/g, "''")}'`).join(',');
      whereConditions += ` AND b.GroupCode IN (${codes})`;
    }

    // 酒店代码（模糊查询）
    if (hotelCode) {
      whereConditions += ` AND b.HotelCode LIKE '%${hotelCode.replace(/'/g, "''")}%'`;
    }

    // 酒店名称（模糊查询）
    if (hotelName) {
      whereConditions += ` AND b.HotelName LIKE '%${hotelName.replace(/'/g, "''")}%'`;
    }

    // 区域
    if (areas) {
      const areaList = areas.split(',').map(area => `'${area.trim().replace(/'/g, "''")}'`).join(',');
      whereConditions += ` AND b.Area IN (${areaList})`;
    }

    // 城市区域
    if (urbanAreas) {
      const urbanAreaList = urbanAreas.split(',').map(area => `'${area.trim().replace(/'/g, "''")}'`).join(',');
      whereConditions += ` AND b.UrbanArea IN (${urbanAreaList})`;
    }

    // 省份
    if (provinces) {
      const provinceList = provinces.split(',').map(province => `'${province.trim().replace(/'/g, "''")}'`).join(',');
      whereConditions += ` AND b.MDMProvince IN (${provinceList})`;
    }

    // 城市
    if (cities) {
      const cityList = cities.split(',').map(city => `'${city.trim().replace(/'/g, "''")}'`).join(',');
      whereConditions += ` AND b.MDMCity IN (${cityList})`;
    }

    // 构建SQL查询
    const sql = `
SELECT 
    b.HotelCode AS 酒店代码,
    b.HotelName AS 酒店名称,
    b.GroupCode AS 管理公司,
    b.PMSType AS PMS类型,
    b.PropertyType AS 物业类型,
    b.MDMCity AS 城市编码,
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
    CAST(
        CASE WHEN SUM(a.rms_ttl) > 0 
            THEN SUM(a.rev_rm) * 1.0 / SUM(a.rms_ttl) 
            ELSE 0 END 
        AS DECIMAL(10,2)
    ) AS 每房收益,
    SUM(a.rev_rm) AS 客房收入,
    SUM(a.rev_fb) AS 餐饮收入,
    SUM(a.rev_ot) AS 其他收入,
    SUM(a.rev_rm + a.rev_fb + a.rev_ot) AS 总收入
FROM [192.168.210.170].[Report].dbo.bi_ttl AS a
INNER JOIN [CrsStar].dbo.StarHotelBaseInfo AS b 
    ON a.hotelid = b.HotelCode
${whereConditions}
GROUP BY 
    b.HotelCode,
    b.HotelName,
    b.GroupCode,
    b.PMSType,
    b.PropertyType,
    b.MDMCity;
    `;

    console.log('[经营日报] 查询SQL:', sql);
    console.log('[经营日报] 查询参数:', { startDate, endDate, groupCodes, hotelCode, hotelName, areas, urbanAreas, provinces, cities });

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

    console.log('[经营日报] 查询结果数量:', results.length);

    // 计算合计行
    const totalRow = {
      酒店代码: '合计',
      酒店名称: '合计',
      管理公司: '合计',
      PMS类型: '合计',
      物业类型: '合计',
      城市编码: '合计',
      房间总数: results.reduce((sum: number, row: any) => sum + (Number(row.房间总数) || 0), 0),
      已入住房数: results.reduce((sum: number, row: any) => sum + (Number(row.已入住房数) || 0), 0),
      出租率: (() => {
        const totalRooms = results.reduce((sum: number, row: any) => sum + (Number(row.房间总数) || 0), 0);
        const totalOcc = results.reduce((sum: number, row: any) => sum + (Number(row.已入住房数) || 0), 0);
        return totalRooms > 0 ? Number((totalOcc / totalRooms).toFixed(4)) : 0;
      })(),
      平均房价: (() => {
        const totalOcc = results.reduce((sum: number, row: any) => sum + (Number(row.已入住房数) || 0), 0);
        const totalRev = results.reduce((sum: number, row: any) => sum + (Number(row.客房收入) || 0), 0);
        return totalOcc > 0 ? Number((totalRev / totalOcc).toFixed(2)) : 0;
      })(),
      每房收益: (() => {
        const totalRooms = results.reduce((sum: number, row: any) => sum + (Number(row.房间总数) || 0), 0);
        const totalRev = results.reduce((sum: number, row: any) => sum + (Number(row.客房收入) || 0), 0);
        return totalRooms > 0 ? Number((totalRev / totalRooms).toFixed(2)) : 0;
      })(),
      客房收入: results.reduce((sum: number, row: any) => sum + (Number(row.客房收入) || 0), 0),
      餐饮收入: results.reduce((sum: number, row: any) => sum + (Number(row.餐饮收入) || 0), 0),
      其他收入: results.reduce((sum: number, row: any) => sum + (Number(row.其他收入) || 0), 0),
      总收入: results.reduce((sum: number, row: any) => sum + (Number(row.总收入) || 0), 0),
      __type: 'total',
    };

    // 合并合计行和数据行
    const allRows = [totalRow, ...results.map((row: any) => ({ ...row, __type: 'normal' }))];
    const total = allRows.length;

    // 分页处理
    const startIndex = (page - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, total);
    const items = allRows.slice(startIndex, endIndex);

    // 日志打印返回给前端的内容
    const responseData = {
      message: '经营日报数据',
      params,
      timestamp: new Date().toISOString(),
      total,
      items,
    };

    console.log('[经营日报] 返回给前端的内容:', JSON.stringify(responseData, null, 2));

    return NextResponse.json({
      success: true,
      data: responseData,
      message: '查询成功',
    });

  } catch (error) {
    console.error('[经营日报] 查询失败:', error);
    
    return NextResponse.json({
      success: false,
      data: null,
      error: error instanceof Error ? error.message : '查询失败',
      message: '查询失败',
    });
  }
}

