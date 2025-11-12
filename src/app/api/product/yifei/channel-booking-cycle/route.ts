import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // 获取查询参数
    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });

    const page = Math.max(parseInt(params.page || '1', 10) || 1, 1);
    const pageSize = [10,50,100].includes(parseInt(params.pageSize || '10',10)) ? parseInt(params.pageSize || '10',10) : 10;

    // 日志打印前端页面传入的参数
    console.log('前端页面传入的参数:', params);

    // 生成35条模拟数据
    const hotels = Array.from({ length: 34 }, (_, i) => ({ code: `HT${(i+1).toString().padStart(3,'0')}`, name: `示例酒店${i+1}` }));
    // 合计行放第一条
    const makeRow = (name: string) => {
      const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
      const rowBase = {
        酒店: name,
        未提前间夜数: rand(100, 5000),
        未提前间夜占比: rand(0, 3000) / 100,
        提前1天间夜数: rand(100, 5000),
        提前1天间夜占比: rand(0, 3000) / 100,
        提前2天间夜数: rand(100, 4000),
        提前2天间夜占比: rand(0, 3000) / 100,
        提前3天间夜数: rand(50, 3000),
        提前3天间夜占比: rand(0, 3000) / 100,
        提前4天间夜数: rand(50, 2000),
        提前4天间夜占比: rand(0, 3000) / 100,
        提前5天间夜数: rand(20, 1500),
        提前5天间夜占比: rand(0, 3000) / 100,
        提前6天间夜数: rand(10, 1200),
        提前6天间夜占比: rand(0, 3000) / 100,
        提前7天及以上间夜数: rand(10, 1000),
        提前7天及以上间夜占比: rand(0, 3000) / 100,
      };
      return rowBase;
    };

    const allRows = [ { __type: 'total', ...makeRow('合计') }, ...hotels.map(h => makeRow(h.name)) ];
    const total = allRows.length; // 35条（1条合计+34条酒店）

    const startIndex = (page - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, total);
    const items = allRows.slice(startIndex, endIndex);

    // 日志打印返回给前端的内容
    const responseData = {
      message: '渠道预订周期统计表数据',
      params,
      timestamp: new Date().toISOString(),
      total,
      items
    };
    console.log('返回给前端的内容:', JSON.stringify(responseData, null, 2));

    return NextResponse.json({
      success: true,
      data: responseData,
      message: '查询成功'
    });

  } catch (error) {
    console.error('渠道预订周期统计表查询失败:', error);
    
    return NextResponse.json({
      success: false,
      data: null,
      error: error instanceof Error ? error.message : '查询失败',
      message: '查询失败'
    });
  }
}
