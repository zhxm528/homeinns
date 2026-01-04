import { NextRequest, NextResponse } from 'next/server';
import { getPool, initDatabase } from '@/lib/38/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });

    const page = Math.max(parseInt(params.page || '1', 10) || 1, 1);
    const requestedPageSize = parseInt(params.pageSize || '10', 10);
    const pageSize = requestedPageSize > 1000 ? requestedPageSize : [10, 50, 100, 1000].includes(requestedPageSize) ? requestedPageSize : 10;

    // SQL中的查询条件转换为前端传入的参数
    const hotelCode = params.hotelCode || '';
    const hotelName = params.hotelName || '';
    const groupCodes = params.groupCodes ? params.groupCodes.split(',') : [];
    const hotelTypes = params.hotelTypes ? params.hotelTypes.split(',') : [];
    const propertyTypes = params.propertyTypes ? params.propertyTypes.split(',') : [];
    const pmsTypes = params.pmsTypes ? params.pmsTypes.split(',') : [];
    const areas = params.areas ? params.areas.split(',') : [];
    const urbanAreas = params.urbanAreas ? params.urbanAreas.split(',') : [];
    const cities = params.cities ? params.cities.split(',') : [];
    const status = params.status !== undefined ? params.status : '';
    const isDelete = params.isDelete !== undefined ? params.isDelete : '';
    const packageCode = params.packageCode || '';
    const packageName = params.packageName || '';
    const packageStatus = params.packageStatus !== undefined ? params.packageStatus : '';
    const packageIsDelete = params.packageIsDelete !== undefined ? params.packageIsDelete : '';

    console.log('[酒店包价] 前端页面传入的参数:', params);

    // 构建WHERE条件
    let whereConditions = ['1=1'];

    if (hotelCode) {
      whereConditions.push(`h.HotelCode LIKE '%${hotelCode.replace(/'/g, "''")}%'`);
    }
    if (hotelName) {
      whereConditions.push(`h.HotelName LIKE '%${hotelName.replace(/'/g, "''")}%'`);
    }
    if (groupCodes.length > 0) {
      const groupCodesList = groupCodes.map(code => `'${code.trim().replace(/'/g, "''")}'`).join(',');
      whereConditions.push(`h.GroupCode IN (${groupCodesList})`);
    }
    if (hotelTypes.length > 0) {
      const hotelTypesList = hotelTypes.map(type => `'${type.trim().replace(/'/g, "''")}'`).join(',');
      whereConditions.push(`h.HotelType IN (${hotelTypesList})`);
    }
    if (propertyTypes.length > 0) {
      const propertyTypesList = propertyTypes.map(type => `'${type.trim().replace(/'/g, "''")}'`).join(',');
      whereConditions.push(`h.PropertyType IN (${propertyTypesList})`);
    }
    if (pmsTypes.length > 0) {
      const pmsTypesList = pmsTypes.map(type => `'${type.trim().replace(/'/g, "''")}'`).join(',');
      whereConditions.push(`h.PMSType IN (${pmsTypesList})`);
    }
    if (areas.length > 0) {
      const areasList = areas.map(area => `'${area.trim().replace(/'/g, "''")}'`).join(',');
      whereConditions.push(`h.Area IN (${areasList})`);
    }
    if (urbanAreas.length > 0) {
      const urbanAreasList = urbanAreas.map(area => `'${area.trim().replace(/'/g, "''")}'`).join(',');
      whereConditions.push(`h.UrbanArea IN (${urbanAreasList})`);
    }
    if (cities.length > 0) {
      const citiesList = cities.map(city => `'${city.trim().replace(/'/g, "''")}'`).join(',');
      whereConditions.push(`h.MDMCity IN (${citiesList})`);
    }
    if (status !== '') {
      whereConditions.push(`h.Status = ${parseInt(status)}`);
    }
    if (isDelete !== '') {
      whereConditions.push(`h.IsDelete = ${parseInt(isDelete)}`);
    }
    if (packageCode) {
      whereConditions.push(`r.PackageCode LIKE '%${packageCode.replace(/'/g, "''")}%'`);
    }
    if (packageName) {
      whereConditions.push(`r.PackageName LIKE '%${packageName.replace(/'/g, "''")}%'`);
    }
    if (packageStatus !== '') {
      whereConditions.push(`r.IsValid = ${parseInt(packageStatus)}`);
    }
    if (packageIsDelete !== '') {
      whereConditions.push(`r.IsDelete = ${parseInt(packageIsDelete)}`);
    }

    const whereClause = whereConditions.join(' AND ');

    // 构建SQL查询
    const sql = `
SELECT
    h.HotelCode AS 酒店编号,
    h.HotelName AS 酒店名称,
    h.GroupCode AS 管理公司,
    h.HotelType AS 酒店类型,
    h.PropertyType AS 产权类型,
    h.PMSType AS PMS类型,
    h.Area AS 大区,
    h.UrbanArea AS 城区,
    h.MDMProvince AS 省份,
    h.MDMCity AS 城市,
    h.Status AS 状态,
    h.IsDelete AS 是否删除,
    r.PackageCode AS 包价代码,
    r.PackageName AS 包价名称,
    r.IsValid AS 包价状态,
    r.IsDelete AS 包价是否删除
FROM [CrsStar].dbo.StarHotelBaseInfo h
LEFT JOIN [CrsStar].dbo.StarPackageInfo r ON h.HotelCode = r.HotelCode
WHERE ${whereClause}
ORDER BY h.HotelCode, r.PackageCode;
    `;

    console.log('[酒店包价] 查询SQL:', sql);

    // 初始化数据库连接
    try {
      getPool();
    } catch {
      await initDatabase();
    }
    const currentPool = getPool();

    // 执行查询
    let results: any[];
    try {
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

    console.log('[酒店包价] 查询结果数量:', results.length);

    // 查询所有酒店代码和名称的列表（用于 Select 选项）
    let hotelCodeOptions: Array<{ label: string; value: string }> = [];
    let hotelNameOptions: Array<{ label: string; value: string }> = [];
    try {
      const optionsSql = `
        SELECT DISTINCT 
          h.HotelCode AS 酒店编号,
          h.HotelName AS 酒店名称
        FROM [CrsStar].dbo.StarHotelBaseInfo h
        WHERE h.Status = 1 AND h.IsDelete = 0
        ORDER BY h.HotelCode
      `;
      const optionsResult = await currentPool.request().query(optionsSql);
      const uniqueHotels = optionsResult.recordset;
      hotelCodeOptions = uniqueHotels.map((r: any) => ({ label: r.酒店编号, value: r.酒店编号 }));
      hotelNameOptions = uniqueHotels.map((r: any) => ({ label: r.酒店名称, value: r.酒店名称 }));
      console.log('[酒店包价] 获取酒店选项列表完成，酒店编号:', hotelCodeOptions.length, '酒店名称:', hotelNameOptions.length);
    } catch (error) {
      console.error('[酒店包价] 获取酒店选项列表失败:', error);
    }

    // 计算合计行
    const totalRow = {
      酒店编号: '合计',
      酒店名称: '',
      管理公司: '',
      酒店类型: '',
      产权类型: '',
      PMS类型: '',
      大区: '',
      城区: '',
      省份: '',
      城市: '',
      状态: '',
      是否删除: '',
      包价代码: '',
      包价名称: '',
      包价状态: '',
      包价是否删除: '',
    };

    // 添加合计行到第一行
    const allRows = [totalRow, ...results];
    const total = results.length;

    // 分页处理
    const startIndex = (page - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, total + 1); // +1 因为包含合计行
    const items = allRows.slice(startIndex, endIndex);

    const responseData = {
      message: '酒店包价查询成功',
      params,
      timestamp: new Date().toISOString(),
      total,
      items,
      options: {
        hotelCodes: hotelCodeOptions,
        hotelNames: hotelNameOptions,
      },
    };

    console.log('[酒店包价] 返回给前端的内容:', JSON.stringify(responseData, null, 2));

    return NextResponse.json({ success: true, data: responseData, message: '查询成功' });
  } catch (error) {
    console.error('[酒店包价] 查询失败:', error);
    return NextResponse.json({ success: false, data: null, message: '查询失败', error: error instanceof Error ? error.message : '未知错误' });
  }
}
