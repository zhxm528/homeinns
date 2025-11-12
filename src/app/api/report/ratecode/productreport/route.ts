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

    // 生成35条模拟数据（1条合计行 + 34条数据）
    const rateCodeGroups = [
      '标准房价组',
      '商务房价组',
      '会员房价组',
      '团队房价组',
      '协议房价组',
      '优惠房价组',
      '促销房价组',
      '特价房价组',
      '长租房价组',
      '包价房价组',
      '团体房价组',
      '散客房价组',
      '网络房价组',
      '官渠房价组',
      'OTA房价组',
      '商旅房价组',
      '企业房价组',
      '政府房价组',
      '会议房价组',
      '宴会房价组',
      '度假房价组',
      '商务套房组',
      '豪华套房组',
      '行政套房组',
      '总统套房组',
      '家庭房组',
      '主题房组',
      '观景房组',
      '海景房组',
      '山景房组',
      '园景房组',
      '湖景房组',
      '江景房组',
      '城景房组',
    ];

    const rateCodes = [
      'TTCOR1', 'TTCOR2', 'TTCOR3', 'TTCOR4', 'TTCOR5',
      'BUSI1', 'BUSI2', 'MEMB1', 'MEMB2', 'TEAM1',
      'AGRE1', 'AGRE2', 'DISC1', 'DISC2', 'PROM1',
      'SPEC1', 'LONG1', 'PKG1', 'GRP1', 'IND1',
      'WEB1', 'OFF1', 'OTA1', 'CTM1', 'CORP1',
      'GOV1', 'MEE1', 'BAN1', 'VAC1', 'SUIT1',
      'DLX1', 'EXE1', 'PRES1', 'FAM1', 'THEME1',
    ];

    const channels = ['携程', '美团', '飞猪', '商旅', '官渠', 'Booking', 'Agoda', '去哪儿', '同程', '途牛'];

    const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
    const randFloat = (min: number, max: number) => Math.random() * (max - min) + min;

    const makeRow = (group: string, index: number, isTotal: boolean = false) => {
      if (isTotal) {
        // 合计行的特殊处理
        return {
          房价码组: '合计',
          房价码: '34',
          渠道: '10',
          间夜数: 12500.0,
          客房收入: 1562500.50,
          平均房价: 125.00,
          __type: 'total',
        };
      }

      const rateCode = rateCodes[index % rateCodes.length];
      const channel = channels[rand(0, channels.length - 1)];
      const 间夜数 = randFloat(100, 500);
      const 平均房价 = randFloat(80, 300);
      const 客房收入 = 间夜数 * 平均房价;

      return {
        房价码组: group,
        房价码: rateCode,
        渠道: channel,
        间夜数: 间夜数,
        客房收入: 客房收入,
        平均房价: 平均房价,
        __type: 'normal',
      };
    };

    // 生成合计行（放在第一位）和数据行
    const totalRow = makeRow('合计', 0, true);
    const allRows = [
      totalRow,
      ...rateCodeGroups.map((group, index) => makeRow(group, index)),
    ];

    const total = allRows.length; // 35条（1条合计+34条数据）

    const startIndex = (page - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, total);
    const items = allRows.slice(startIndex, endIndex);

    // 日志打印返回给前端的内容
    const responseData = {
      message: '房价码产量报表数据',
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
    console.error('房价码产量报表查询失败:', error);
    
    return NextResponse.json({
      success: false,
      data: null,
      error: error instanceof Error ? error.message : '查询失败',
      message: '查询失败',
    });
  }
}
