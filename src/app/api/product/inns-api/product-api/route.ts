import { NextRequest, NextResponse } from 'next/server';
import { INNS_API_CONFIG } from '@/lib/38/config';

// 调用如家接口
async function callInnsApi(requestBody: any): Promise<any> {
  const url = INNS_API_CONFIG.getProduct;
  
  // 构建请求头
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const requestBodyStr = JSON.stringify(requestBody, null, 2);

  // 打印完整的请求信息
  console.log('========== [如家接口 GetProducts] 开始调用 ==========');
  console.log('[如家接口 GetProducts] 请求URL:', url);
  console.log('[如家接口 GetProducts] 请求方法: POST');
  console.log('[如家接口 GetProducts] 请求头:', JSON.stringify(headers, null, 2));
  console.log('[如家接口 GetProducts] 请求参数:', requestBodyStr);
  console.log('[如家接口 GetProducts] 请求时间:', new Date().toISOString());

  try {
    const startTime = Date.now();
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: requestBodyStr,
    });

    const endTime = Date.now();
    const duration = endTime - startTime;

    // 打印响应状态信息
    console.log('[如家接口 GetProducts] 响应状态码:', response.status);
    console.log('[如家接口 GetProducts] 响应状态文本:', response.statusText);
    console.log('[如家接口 GetProducts] 响应头:', JSON.stringify(Object.fromEntries(response.headers.entries()), null, 2));
    console.log('[如家接口 GetProducts] 请求耗时:', `${duration}ms`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[如家接口 GetProducts] 响应错误内容:', errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const responseDataStr = JSON.stringify(data, null, 2);
    
    // 打印完整的响应结果
    console.log('[如家接口 GetProducts] 响应结果:', responseDataStr);
    console.log('========== [如家接口 GetProducts] 调用完成 ==========');
    
    return data;
  } catch (error) {
    console.error('========== [如家接口 GetProducts] 调用失败 ==========');
    console.error('[如家接口 GetProducts] 错误类型:', error instanceof Error ? error.constructor.name : typeof error);
    console.error('[如家接口 GetProducts] 错误消息:', error instanceof Error ? error.message : String(error));
    console.error('[如家接口 GetProducts] 错误堆栈:', error instanceof Error ? error.stack : '无堆栈信息');
    console.error('========== [如家接口 GetProducts] 错误结束 ==========');
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    // 从请求体中获取参数
    const body = await request.json();
    const params: Record<string, any> = body || {};

    console.log('[如家接口 GetProducts] 前端页面传入的参数:', JSON.stringify(params, null, 2));

    // 构建请求体
    const requestBody: Record<string, any> = {};
    
    if (params.ResvType) requestBody.ResvType = params.ResvType;
    if (params.HotelCd) requestBody.HotelCd = params.HotelCd;
    if (params.ArrDate) requestBody.ArrDate = params.ArrDate;
    if (params.DepDate) requestBody.DepDate = params.DepDate;
    if (params.RmTypeCds) requestBody.RmTypeCds = params.RmTypeCds;
    if (params.RoomNum !== undefined) requestBody.RoomNum = params.RoomNum;
    if (params.Adults !== undefined) requestBody.Adults = params.Adults;
    if (params.IsAvail !== undefined) requestBody.IsAvail = params.IsAvail;
    if (params.MembershipType) requestBody.MembershipType = params.MembershipType;
    if (params.MemberNo) requestBody.MemberNo = params.MemberNo;
    if (params.RuleDimension) requestBody.RuleDimension = params.RuleDimension;
    if (params.AllowLoadPromotion !== undefined) requestBody.AllowLoadPromotion = params.AllowLoadPromotion;
    if (params.OnlyShowEnabledPromotion !== undefined) requestBody.OnlyShowEnabledPromotion = params.OnlyShowEnabledPromotion;

    // 从配置文件自动添加 Terminal 相关字段
    requestBody.Terminal_License = INNS_API_CONFIG.terminal.license;
    requestBody.Terminal_Seq = INNS_API_CONFIG.terminal.seq;
    requestBody.Terminal_OprId = INNS_API_CONFIG.terminal.oprId;

    // 调用如家接口
    const responseData = await callInnsApi(requestBody);

    console.log('[如家接口 GetProducts] 返回给前端的数据:', JSON.stringify(responseData, null, 2));

    return NextResponse.json({
      success: true,
      data: responseData,
      message: '查询成功',
    });
  } catch (error) {
    console.error('[如家接口 GetProducts] 查询失败:', error);
    return NextResponse.json({
      success: false,
      data: null,
      message: '查询失败',
      error: error instanceof Error ? error.message : '未知错误',
    });
  }
}
