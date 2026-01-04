import { NextRequest, NextResponse } from 'next/server';
import { getPool, initDatabase } from '@/lib/38/database';

export async function GET(request: NextRequest) {
  console.log('🚀 [SelectHotels] ========== API 请求开始 ==========');
  console.log('[SelectHotels] 请求URL:', request.url);
  console.log('[SelectHotels] 请求时间:', new Date().toISOString());
  
  try {
    // 初始化数据库连接
    console.log('[SelectHotels] 步骤1: 开始初始化数据库连接...');
    let currentPool;
    try {
      currentPool = getPool();
      console.log('[SelectHotels] ✅ 数据库连接池已存在，直接使用');
    } catch (error) {
      console.log('[SelectHotels] ⚠️ 数据库连接池不存在，开始初始化...');
      await initDatabase();
      currentPool = getPool();
      console.log('[SelectHotels] ✅ 数据库连接池初始化成功');
    }

    // 查询所有酒店信息（用于 Select 组件选项）
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
          h.IsDelete AS 是否删除
      FROM [CrsStar].dbo.StarHotelBaseInfo h
      ORDER BY h.HotelCode;
    `;

    console.log('[SelectHotels] 步骤2: 准备执行SQL查询');
    console.log('[SelectHotels] SQL语句:', sql);

    // 执行查询
    let results: any[];
    try {
      console.log('[SelectHotels] 步骤3: 创建数据库请求对象...');
      const dbRequest = currentPool.request();
      
      console.log('[SelectHotels] 步骤4: 开始执行SQL查询...');
      const startTime = Date.now();
      const result = await dbRequest.query(sql);
      const endTime = Date.now();
      
      console.log(`[SelectHotels] ✅ SQL查询执行成功，耗时: ${endTime - startTime}ms`);
      console.log(`[SelectHotels] 查询返回记录数: ${result.recordset.length}`);
      
      results = result.recordset;
      
      // 打印前几条记录用于调试
      if (results.length > 0) {
        console.log('[SelectHotels] 前3条记录示例:');
        results.slice(0, 3).forEach((r: any, index: number) => {
          console.log(`  [${index + 1}] 酒店编号: ${r.酒店编号}, 酒店名称: ${r.酒店名称}`);
        });
      } else {
        console.warn('[SelectHotels] ⚠️ 警告: 查询结果为空，没有找到任何酒店记录！');
      }
    } catch (error) {
      console.error('[SelectHotels] ❌ SQL查询执行失败');
      console.error('[SelectHotels] 错误详情:', error);
      console.error('[SelectHotels] 错误类型:', error instanceof Error ? error.constructor.name : typeof error);
      console.error('[SelectHotels] 错误消息:', error instanceof Error ? error.message : String(error));
      console.error('[SelectHotels] 错误堆栈:', error instanceof Error ? error.stack : '无堆栈信息');
      console.error('[SelectHotels] 失败的SQL:', sql);
      throw error;
    }

    console.log('[SelectHotels] 步骤5: 开始格式化数据...');
    console.log(`[SelectHotels] 原始结果数量: ${results.length}`);

    // 格式化数据，生成酒店编号和酒店名称的选项列表
    const hotelCodeOptions = results.map((r: any) => {
      const option = {
        label: r.酒店编号 || '',
        value: r.酒店编号 || '',
      };
      return option;
    }).filter(opt => opt.value); // 过滤掉空值

    const hotelNameOptions = results.map((r: any) => {
      const option = {
        label: r.酒店名称 || '',
        value: r.酒店名称 || '',
      };
      return option;
    }).filter(opt => opt.value); // 过滤掉空值

    console.log(`[SelectHotels] 格式化后的选项数量:`);
    console.log(`  - 酒店编号选项: ${hotelCodeOptions.length}`);
    console.log(`  - 酒店名称选项: ${hotelNameOptions.length}`);
    
    if (hotelCodeOptions.length > 0) {
      console.log('[SelectHotels] 酒店编号选项前3个示例:');
      hotelCodeOptions.slice(0, 3).forEach((opt, index) => {
        console.log(`  [${index + 1}] label: ${opt.label}, value: ${opt.value}`);
      });
    }
    
    if (hotelNameOptions.length > 0) {
      console.log('[SelectHotels] 酒店名称选项前3个示例:');
      hotelNameOptions.slice(0, 3).forEach((opt, index) => {
        console.log(`  [${index + 1}] label: ${opt.label}, value: ${opt.value}`);
      });
    }

    const responseData = {
      message: '酒店列表查询成功',
      timestamp: new Date().toISOString(),
      total: results.length,
      items: results,
      options: {
        hotelCodes: hotelCodeOptions,
        hotelNames: hotelNameOptions,
      },
    };

    console.log('[SelectHotels] 步骤6: 准备返回响应数据');
    console.log('[SelectHotels] 响应数据结构:');
    console.log(`  - total: ${responseData.total}`);
    console.log(`  - options.hotelCodes.length: ${responseData.options.hotelCodes.length}`);
    console.log(`  - options.hotelNames.length: ${responseData.options.hotelNames.length}`);
    console.log(`  - items.length: ${responseData.items.length}`);

    const response = NextResponse.json({ 
      success: true, 
      data: responseData, 
      message: '查询成功' 
    });
    
    console.log('[SelectHotels] ✅ API 请求处理成功，准备返回响应');
    console.log('[SelectHotels] ========== API 请求结束 ==========');
    
    return response;
  } catch (error) {
    console.error('[SelectHotels] ❌ ========== API 请求失败 ==========');
    console.error('[SelectHotels] 错误发生时间:', new Date().toISOString());
    console.error('[SelectHotels] 错误类型:', error instanceof Error ? error.constructor.name : typeof error);
    console.error('[SelectHotels] 错误消息:', error instanceof Error ? error.message : String(error));
    console.error('[SelectHotels] 错误堆栈:', error instanceof Error ? error.stack : '无堆栈信息');
    
    const errorResponse = NextResponse.json({ 
      success: false, 
      data: null, 
      message: '查询失败', 
      error: error instanceof Error ? error.message : '未知错误' 
    });
    
    console.error('[SelectHotels] ========== 错误响应已返回 ==========');
    
    return errorResponse;
  }
}

