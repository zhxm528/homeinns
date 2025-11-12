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

    const month = params.month || '2025-10';
    const compareYear = params.compareYear || '2024';

    // 日志打印前端页面传入的参数
    console.log('前端页面传入的参数:', params);

    // 生成35条模拟数据（34个国家 + 1个合计行）
    const countries = [
      { name: '澳大利亚', code: 'AUS' },
      { name: '中国', code: 'CHN' },
      { name: '德国', code: 'DEU' },
      { name: '中国香港', code: 'HKG' },
      { name: '马来西亚', code: 'MYS' },
      { name: '塞尔维亚', code: 'SRB' },
      { name: '泰国', code: 'THA' },
      { name: '中国台湾', code: 'TWN' },
      { name: '美国', code: 'USA' },
      { name: '委内瑞拉', code: 'VEN' },
      { name: '日本', code: 'JPN' },
      { name: '韩国', code: 'KOR' },
      { name: '新加坡', code: 'SGP' },
      { name: '印度', code: 'IND' },
      { name: '印度尼西亚', code: 'IDN' },
      { name: '菲律宾', code: 'PHL' },
      { name: '越南', code: 'VNM' },
      { name: '英国', code: 'GBR' },
      { name: '法国', code: 'FRA' },
      { name: '意大利', code: 'ITA' },
      { name: '西班牙', code: 'ESP' },
      { name: '加拿大', code: 'CAN' },
      { name: '墨西哥', code: 'MEX' },
      { name: '巴西', code: 'BRA' },
      { name: '阿根廷', code: 'ARG' },
      { name: '俄罗斯', code: 'RUS' },
      { name: '土耳其', code: 'TUR' },
      { name: '埃及', code: 'EGY' },
      { name: '南非', code: 'ZAF' },
      { name: '新西兰', code: 'NZL' },
      { name: '瑞士', code: 'CHE' },
      { name: '荷兰', code: 'NLD' },
      { name: '比利时', code: 'BEL' },
      { name: '奥地利', code: 'AUT' },
    ];

    const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
    const randFloat = (min: number, max: number) => Math.random() * (max - min) + min;

    const makeRow = (countryName: string, code: string, isTotal: boolean = false) => {
      let 房数, 房数百分比, 人数, 人数百分比, 去年房数, 去年人数;

      if (isTotal) {
        // 合计行的特殊处理（可以根据实际需求调整）
        房数 = 6992.5;
        房数百分比 = 100.01;
        人数 = 11398;
        人数百分比 = 100.01;
        去年房数 = 7235.5;
        去年人数 = 10690;
      } else {
        if (code === 'CHN') {
          // 中国是主要数据
          房数 = rand(6500, 7000) + randFloat(0, 1);
          房数百分比 = randFloat(99.5, 99.9);
          人数 = rand(11000, 11500);
          人数百分比 = randFloat(99.5, 99.9);
          去年房数 = rand(7000, 7200) + randFloat(0, 1);
          去年人数 = rand(10500, 10700);
        } else if (code === 'AUS') {
          // 澳大利亚
          房数 = rand(5, 10) + randFloat(0, 1);
          房数百分比 = randFloat(0.05, 0.15);
          人数 = rand(10, 20);
          人数百分比 = randFloat(0.1, 0.15);
          去年房数 = rand(0, 5);
          去年人数 = rand(0, 10);
        } else {
          房数 = randFloat(0, 50);
          房数百分比 = randFloat(0, 0.5);
          人数 = rand(0, 100);
          人数百分比 = randFloat(0, 0.5);
          去年房数 = randFloat(0, 50);
          去年人数 = rand(0, 100);
        }
      }

      return {
        国家: countryName,
        代码: code,
        [`${month}_房数`]: 房数,
        [`${month}_房数%`]: 房数百分比,
        [`${month}_人数`]: 人数,
        [`${month}_人数%`]: 人数百分比,
        [`${compareYear}_房数`]: 去年房数,
        [`${compareYear}_人数`]: 去年人数,
        __type: isTotal ? 'total' : 'normal',
      };
    };

    // 生成合计行（放在第一位）和国家数据
    const allRows = [
      makeRow('合计', '', true),
      ...countries.map(c => makeRow(c.name, c.code)),
    ];

    const total = allRows.length; // 35条（1条合计+34条国家）

    const startIndex = (page - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, total);
    const items = allRows.slice(startIndex, endIndex);

    // 日志打印返回给前端的内容
    const responseData = {
      message: '国家月统计报表数据',
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
    console.error('国家月统计报表查询失败:', error);
    
    return NextResponse.json({
      success: false,
      data: null,
      error: error instanceof Error ? error.message : '查询失败',
      message: '查询失败',
    });
  }
}