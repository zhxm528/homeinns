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

    // 生成35条模拟数据（34个房型 + 1个合计行）
    const roomTypes = [
      { code: 'BKND', desc: '豪华大床房' },
      { code: 'BTND', desc: '豪华双床房' },
      { code: 'CSNC', desc: '舒睡高级大床房' },
      { code: 'CSND', desc: '舒睡行政大床房' },
      { code: 'EKND', desc: '行政大床房' },
      { code: 'ETND', desc: '行政双床房' },
      { code: 'SKEC', desc: '静享电竞大床房(无窗)' },
      { code: 'SKNC', desc: '静享大床房(无窗)' },
      { code: 'UKNC', desc: '高级大床房' },
      { code: 'UKSC', desc: '逸扉高级大床房' },
      { code: 'UTNC', desc: '高级双床房' },
      { code: 'XKNU', desc: '逸扉行政房' },
      { code: 'RT01', desc: '标准大床房' },
      { code: 'RT02', desc: '标准双床房' },
      { code: 'RT03', desc: '商务大床房' },
      { code: 'RT04', desc: '商务双床房' },
      { code: 'RT05', desc: '豪华套房' },
      { code: 'RT06', desc: '行政套房' },
      { code: 'RT07', desc: '总统套房' },
      { code: 'RT08', desc: '家庭房' },
      { code: 'RT09', desc: '主题房' },
      { code: 'RT10', desc: '观景房' },
      { code: 'RT11', desc: '海景房' },
      { code: 'RT12', desc: '山景房' },
      { code: 'RT13', desc: '园景房' },
      { code: 'RT14', desc: '湖景房' },
      { code: 'RT15', desc: '江景房' },
      { code: 'RT16', desc: '城景房' },
      { code: 'RT17', desc: '豪华景观房' },
      { code: 'RT18', desc: '特色主题房' },
      { code: 'RT19', desc: '智能客房' },
      { code: 'RT20', desc: '环保客房' },
      { code: 'RT21', desc: '无障碍房' },
      { code: 'RT22', desc: '长租客房' },
    ];

    const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
    const randFloat = (min: number, max: number) => Math.random() * (max - min) + min;

    const makeRow = (roomType: { code: string; desc: string }, isTotal: boolean = false) => {
      let 散客人数, 散客间天, 散客房费, 散客平均房价;
      let 团体会议人数, 团体会议间天, 团体会议房费, 团体会议平均房价;

      if (isTotal) {
        // 合计行的特殊处理
        散客人数 = 387;
        散客间天 = 244.0;
        散客房费 = 140339.92;
        散客平均房价 = 575.16;
        团体会议人数 = 0;
        团体会议间天 = 0.0;
        团体会议房费 = 0.0;
        团体会议平均房价 = 0.0;
      } else if (roomType.code === 'BKND') {
        // BKND的示例数据
        散客人数 = 93;
        散客间天 = 67.0;
        散客房费 = 39468.4;
        散客平均房价 = 589.08;
        团体会议人数 = 0;
        团体会议间天 = 0.0;
        团体会议房费 = 0;
        团体会议平均房价 = 0;
      } else if (roomType.code === 'BTND') {
        散客人数 = 63;
        散客间天 = 31.0;
        散客房费 = 16696.52;
        散客平均房价 = 538.6;
        团体会议人数 = 0;
        团体会议间天 = 0.0;
        团体会议房费 = 0;
        团体会议平均房价 = 0;
      } else if (roomType.code === 'CSNC') {
        散客人数 = 8;
        散客间天 = 5.0;
        散客房费 = 2035.52;
        散客平均房价 = 407.1;
        团体会议人数 = 0;
        团体会议间天 = 0.0;
        团体会议房费 = 0;
        团体会议平均房价 = 0;
      } else if (roomType.code === 'CSND') {
        散客人数 = 8;
        散客间天 = 5.0;
        散客房费 = 3613;
        散客平均房价 = 722.6;
        团体会议人数 = 0;
        团体会议间天 = 0.0;
        团体会议房费 = 0;
        团体会议平均房价 = 0;
      } else if (roomType.code === 'EKND') {
        散客人数 = 62;
        散客间天 = 40.0;
        散客房费 = 28797.35;
        散客平均房价 = 719.93;
        团体会议人数 = 0;
        团体会议间天 = 0.0;
        团体会议房费 = 0;
        团体会议平均房价 = 0;
      } else if (roomType.code === 'ETND') {
        散客人数 = 13;
        散客间天 = 6.0;
        散客房费 = 4434.38;
        散客平均房价 = 739.06;
        团体会议人数 = 0;
        团体会议间天 = 0.0;
        团体会议房费 = 0;
        团体会议平均房价 = 0;
      } else if (roomType.code === 'SKEC') {
        散客人数 = 13;
        散客间天 = 10.0;
        散客房费 = 6805.38;
        散客平均房价 = 680.54;
        团体会议人数 = 0;
        团体会议间天 = 0.0;
        团体会议房费 = 0;
        团体会议平均房价 = 0;
      } else if (roomType.code === 'SKNC') {
        散客人数 = 6;
        散客间天 = 4.0;
        散客房费 = 2083.62;
        散客平均房价 = 520.91;
        团体会议人数 = 0;
        团体会议间天 = 0.0;
        团体会议房费 = 0;
        团体会议平均房价 = 0;
      } else if (roomType.code === 'UKNC') {
        散客人数 = 63;
        散客间天 = 44.0;
        散客房费 = 20084.29;
        散客平均房价 = 456.46;
        团体会议人数 = 0;
        团体会议间天 = 0.0;
        团体会议房费 = 0;
        团体会议平均房价 = 0;
      } else if (roomType.code === 'UKSC') {
        散客人数 = 13;
        散客间天 = 10.0;
        散客房费 = 5737.86;
        散客平均房价 = 573.79;
        团体会议人数 = 0;
        团体会议间天 = 0.0;
        团体会议房费 = 0;
        团体会议平均房价 = 0;
      } else if (roomType.code === 'UTNC') {
        散客人数 = 43;
        散客间天 = 21.0;
        散客房费 = 9695.84;
        散客平均房价 = 461.71;
        团体会议人数 = 0;
        团体会议间天 = 0.0;
        团体会议房费 = 0;
        团体会议平均房价 = 0;
      } else if (roomType.code === 'XKNU') {
        散客人数 = 2;
        散客间天 = 1.0;
        散客房费 = 887.76;
        散客平均房价 = 887.76;
        团体会议人数 = 0;
        团体会议间天 = 0.0;
        团体会议房费 = 0;
        团体会议平均房价 = 0;
      } else {
        // 其他房型生成随机数据
        散客人数 = rand(0, 100);
        散客间天 = randFloat(0, 50);
        散客房费 = randFloat(0, 50000);
        散客平均房价 = 散客间天 > 0 ? 散客房费 / 散客间天 : 0;
        团体会议人数 = rand(0, 50);
        团体会议间天 = randFloat(0, 30);
        团体会议房费 = randFloat(0, 30000);
        团体会议平均房价 = 团体会议间天 > 0 ? 团体会议房费 / 团体会议间天 : 0;
      }

      return {
        代码: roomType.code,
        描述: roomType.desc,
        散客_人数: 散客人数,
        散客_间天: 散客间天,
        散客_房费: 散客房费,
        散客_平均房价: 散客平均房价,
        团体会议_人数: 团体会议人数,
        团体会议_间天: 团体会议间天,
        团体会议_房费: 团体会议房费,
        团体会议_平均房价: 团体会议平均房价,
        __type: isTotal ? 'total' : 'normal',
      };
    };

    // 生成合计行（放在第一位）和房型数据
    const totalRow = makeRow({ code: '总计', desc: '总计' }, true);
    totalRow.代码 = '总计';
    totalRow.描述 = '总计';
    const allRows = [
      totalRow,
      ...roomTypes.map(rt => makeRow(rt)),
    ];

    const total = allRows.length; // 35条（1条合计+34个房型）

    const startIndex = (page - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, total);
    const items = allRows.slice(startIndex, endIndex);

    // 日志打印返回给前端的内容
    const responseData = {
      message: '销售分析(房型)报表数据',
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
    console.error('销售分析(房型)报表查询失败:', error);
    
    return NextResponse.json({
      success: false,
      data: null,
      error: error instanceof Error ? error.message : '查询失败',
      message: '查询失败',
    });
  }
}