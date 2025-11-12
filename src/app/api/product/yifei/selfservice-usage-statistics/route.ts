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
    const pageSize = [10, 50, 100].includes(parseInt(params.pageSize || '10', 10)) 
      ? parseInt(params.pageSize || '10', 10) 
      : 10;

    // 日志打印前端页面传入的参数
    console.log('前端页面传入的参数:', params);

    // 生成35条模拟数据（34条来源 + 1条合计行）
    const sources = [
      '团队', '如家', '旅行社', '凯悦', 'OTA', '新媒体', '协议', 
      '逸粉', 'walk in', '集团大客户', '时租房', '其他',
      '来源1', '来源2', '来源3', '来源4', '来源5', '来源6', '来源7', '来源8',
      '来源9', '来源10', '来源11', '来源12', '来源13', '来源14', '来源15',
      '来源16', '来源17', '来源18', '来源19', '来源20', '来源21', '来源22'
    ];

    const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
    const randFloat = (min: number, max: number) => Math.random() * (max - min) + min;

    const makeRow = (sourceName: string, isTotal: boolean = false) => {
      let 入住人次统计, 入住人次占比, 入住间夜统计, 入住间夜占比;
      let 续住人次统计, 续住人次占比, 续住间夜统计, 续住间夜占比;
      let 离店人次统计, 离店人次占比, 离店间夜统计, 离店间夜占比;
      let 总计人次统计, 总计人次占比, 总计间夜统计, 总计间夜占比;

      if (isTotal) {
        // 合计行的特殊处理（可以根据实际需求调整）
        入住人次统计 = 3.0;
        入住人次占比 = 1.08;
        入住间夜统计 = 2.0;
        入住间夜占比 = 1.33;
        续住人次统计 = 0.0;
        续住人次占比 = 0.0;
        续住间夜统计 = 0.0;
        续住间夜占比 = 0.0;
        离店人次统计 = 3.0;
        离店人次占比 = 2.21;
        离店间夜统计 = 2.0;
        离店间夜占比 = 2.35;
        总计人次统计 = 6.0;
        总计人次占比 = 1.44;
        总计间夜统计 = 4.0;
        总计间夜占比 = 1.69;
      } else if (sourceName === 'OTA') {
        // OTA是主要数据
        入住人次统计 = 3.0;
        入住人次占比 = 2.33;
        入住间夜统计 = 2.0;
        入住间夜占比 = 2.82;
        续住人次统计 = 0.0;
        续住人次占比 = 0.0;
        续住间夜统计 = 0.0;
        续住间夜占比 = 0.0;
        离店人次统计 = 3.0;
        离店人次占比 = 4.55;
        离店间夜统计 = 2.0;
        离店间夜占比 = 5.41;
        总计人次统计 = 6.0;
        总计人次占比 = 3.08;
        总计间夜统计 = 4.0;
        总计间夜占比 = 3.70;
      } else {
        // 其他来源都是0
        入住人次统计 = 0.0;
        入住人次占比 = 0.0;
        入住间夜统计 = 0.0;
        入住间夜占比 = 0.0;
        续住人次统计 = 0.0;
        续住人次占比 = 0.0;
        续住间夜统计 = 0.0;
        续住间夜占比 = 0.0;
        离店人次统计 = 0.0;
        离店人次占比 = 0.0;
        离店间夜统计 = 0.0;
        离店间夜占比 = 0.0;
        总计人次统计 = 0.0;
        总计人次占比 = 0.0;
        总计间夜统计 = 0.0;
        总计间夜占比 = 0.0;
      }

      return {
        来源: sourceName,
        入住_人次_统计: 入住人次统计,
        入住_人次_占比: 入住人次占比,
        入住_间夜_统计: 入住间夜统计,
        入住_间夜_占比: 入住间夜占比,
        续住_人次_统计: 续住人次统计,
        续住_人次_占比: 续住人次占比,
        续住_间夜_统计: 续住间夜统计,
        续住_间夜_占比: 续住间夜占比,
        离店_人次_统计: 离店人次统计,
        离店_人次_占比: 离店人次占比,
        离店_间夜_统计: 离店间夜统计,
        离店_间夜_占比: 离店间夜占比,
        总计_人次_统计: 总计人次统计,
        总计_人次_占比: 总计人次占比,
        总计_间夜_统计: 总计间夜统计,
        总计_间夜_占比: 总计间夜占比,
        __type: isTotal ? 'total' : 'normal',
      };
    };

    // 生成合计行（放在第一位）和来源数据
    const allRows = [
      makeRow('总计', true),
      ...sources.map(s => makeRow(s)),
    ];

    const total = allRows.length; // 35条（1条合计+34条来源）

    const startIndex = (page - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, total);
    const items = allRows.slice(startIndex, endIndex);

    // 日志打印返回给前端的内容
    const responseData = {
      message: '自助机使用统计报表数据',
      params,
      timestamp: new Date().toISOString(),
      total,
      items,
    };
    console.log('返回给前端的内容:', JSON.stringify(responseData, null, 2));

    return NextResponse.json({
      success: true,
      data: responseData,
      message: '查询成功',
    });

  } catch (error) {
    console.error('自助机使用统计报表查询失败:', error);
    
    return NextResponse.json({
      success: false,
      data: null,
      error: error instanceof Error ? error.message : '查询失败',
      message: '查询失败',
    });
  }
}