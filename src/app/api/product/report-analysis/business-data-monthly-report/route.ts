import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });

    console.log('[经营数据自然月报] 前端页面传入的参数:', params);

    const responseData = {
      message: '经营数据自然月报 - 示例数据返回',
      params,
      timestamp: new Date().toISOString(),
      items: [],
    };

    console.log('[经营数据自然月报] 返回给前端的内容:', JSON.stringify(responseData, null, 2));

    return NextResponse.json({ success: true, data: responseData, message: '查询成功' });
  } catch (error) {
    console.error('[经营数据自然月报] 查询失败:', error);
    return NextResponse.json({ success: false, data: null, message: '查询失败', error: error instanceof Error ? error.message : '未知错误' });
  }
}

