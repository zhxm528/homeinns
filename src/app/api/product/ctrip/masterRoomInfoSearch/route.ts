import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// 携程接口配置（应该从环境变量或配置文件中读取）
const CTRIP_CONFIG = {
  // 测试环境
  test: {
    baseUrl: 'https://gateway.fat.ctripqa.com',
    code: process.env.CTRIP_CODE || '2206', // 对接方Trip编号
    username: process.env.CTRIP_USERNAME || 'SLGS',
    password: process.env.CTRIP_PASSWORD || 'SLGS123',
  },
  // 生产环境
  prod: {
    baseUrl: 'https://receive-vendor-hotel.ctrip.com',
    code: process.env.CTRIP_CODE || '2206',
    username: process.env.CTRIP_USERNAME || 'SLGS',
    password: process.env.CTRIP_PASSWORD || 'SLGS123',
  },
};

// 生成 SHA-256 加密的 Authorization
function generateAuthorization(username: string, password: string): string {
  const credentials = `${username}:${password}`;
  return crypto.createHash('sha256').update(credentials).digest('hex').toLowerCase();
}

// 调用携程接口
async function callCtripApi(
  endpoint: string,
  requestBody: any,
  config: typeof CTRIP_CONFIG.test
): Promise<any> {
  const url = `${config.baseUrl}${endpoint}`;
  
  // 生成 Authorization
  const authorization = generateAuthorization(config.username, config.password);
  
  // 构建请求头
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Code': config.code,
    'Authorization': authorization,
  };

  const requestBodyStr = JSON.stringify(requestBody, null, 2);

  // 打印完整的请求信息
  console.log('========== [携程接口 masterRoomInfoSearch] 开始调用 ==========');
  console.log('[携程接口 masterRoomInfoSearch] 请求URL:', url);
  console.log('[携程接口 masterRoomInfoSearch] 请求方法: POST');
  console.log('[携程接口 masterRoomInfoSearch] 请求头:', JSON.stringify(headers, null, 2));
  console.log('[携程接口 masterRoomInfoSearch] 请求参数:', requestBodyStr);
  console.log('[携程接口 masterRoomInfoSearch] 请求时间:', new Date().toISOString());

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
    console.log('[携程接口 masterRoomInfoSearch] 响应状态码:', response.status);
    console.log('[携程接口 masterRoomInfoSearch] 响应状态文本:', response.statusText);
    console.log('[携程接口 masterRoomInfoSearch] 响应头:', JSON.stringify(Object.fromEntries(response.headers.entries()), null, 2));
    console.log('[携程接口 masterRoomInfoSearch] 请求耗时:', `${duration}ms`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[携程接口 masterRoomInfoSearch] 响应错误内容:', errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const responseDataStr = JSON.stringify(data, null, 2);
    
    // 打印完整的响应结果
    console.log('[携程接口 masterRoomInfoSearch] 响应结果:', responseDataStr);
    console.log('========== [携程接口 masterRoomInfoSearch] 调用完成 ==========');
    
    return data;
  } catch (error) {
    console.error('========== [携程接口 masterRoomInfoSearch] 调用失败 ==========');
    console.error('[携程接口 masterRoomInfoSearch] 错误类型:', error instanceof Error ? error.constructor.name : typeof error);
    console.error('[携程接口 masterRoomInfoSearch] 错误消息:', error instanceof Error ? error.message : String(error));
    console.error('[携程接口 masterRoomInfoSearch] 错误堆栈:', error instanceof Error ? error.stack : '无堆栈信息');
    console.error('========== [携程接口 masterRoomInfoSearch] 错误结束 ==========');
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    // 从请求体中获取参数
    const body = await request.json();
    const params: Record<string, any> = body || {};

    console.log('[携程接口 masterRoomInfoSearch] 前端页面传入的参数:', params);

    // 构建请求体
    const requestBody: any = {
      languageCode: params.languageCode || 'en-US',
    };

    // 可选参数
    if (params.hotelIds) {
      // hotelIds 可能是数组或逗号分隔的字符串
      if (Array.isArray(params.hotelIds)) {
        requestBody.hotelIds = params.hotelIds;
      } else if (typeof params.hotelIds === 'string') {
        const hotelIdsArray = params.hotelIds.split(',').map(id => id.trim()).filter(Boolean);
        requestBody.hotelIds = hotelIdsArray;
      }
    }

    // 选择环境（优先使用前端传入的 env，其次使用环境变量，默认测试环境）
    const envFromParam = params.env === 'prod' ? 'prod' : params.env === 'test' ? 'test' : null;
    const env = envFromParam || (process.env.CTRIP_ENV === 'prod' ? 'prod' : 'test');
    const config = CTRIP_CONFIG[env];

    // 检查配置
    if (!config.username || !config.password) {
      console.warn('[携程接口 masterRoomInfoSearch] 警告：未配置携程用户名或密码，返回模拟数据');
      
      // 返回模拟数据用于测试
      const mockData = {
        languageCode: 'en-US',
        code: '0',
        message: '成功（模拟数据）',
        datas: [
          {
            hotelId: '82362553',
            masterRoomLists: [
              {
                roomId: '12345',
                roomName: '标准大床房',
                maxOccupancy: 2,
                maxAdultOccupancy: 2,
                hasWindow: 'Yes',
                hasWifi: 'Yes',
                hasCableInternet: 'Yes',
              },
              {
                roomId: '54683',
                roomName: '江景大床房',
                maxOccupancy: 3,
                maxAdultOccupancy: 3,
                hasWindow: 'Yes',
                hasWifi: 'Yes',
                hasCableInternet: 'Yes',
              },
            ],
          },
          {
            hotelId: '52362553',
            masterRoomLists: [
              {
                roomId: '174655',
                roomName: '豪华双床房',
                maxOccupancy: 2,
                maxAdultOccupancy: 2,
                hasWindow: 'No',
                hasWifi: 'Yes',
                hasCableInternet: 'Yes',
              },
              {
                roomId: '57864',
                roomName: '豪华大床房',
                maxOccupancy: 3,
                maxAdultOccupancy: 3,
                hasWindow: 'Yes',
                hasWifi: 'Yes',
                hasCableInternet: 'Yes',
              },
            ],
          },
        ],
      };

      return NextResponse.json({
        success: true,
        data: mockData,
        message: '查询成功（模拟数据）',
      });
    }

    // 调用携程接口
    const endpoint = '/static/v2/json/masterRoomInfoSearch';
    console.log('[携程接口 masterRoomInfoSearch] 准备调用携程接口，环境:', env);
    console.log('[携程接口 masterRoomInfoSearch] 构建的请求体:', JSON.stringify(requestBody, null, 2));
    
    const responseData = await callCtripApi(endpoint, requestBody, config);

    console.log('[携程接口 masterRoomInfoSearch] 携程接口调用成功，返回给前端的数据:', JSON.stringify(responseData, null, 2));

    return NextResponse.json({
      success: true,
      data: responseData,
      message: '查询成功',
    });
  } catch (error) {
    console.error('[携程接口 masterRoomInfoSearch] 查询失败:', error);
    return NextResponse.json({
      success: false,
      data: null,
      message: '查询失败',
      error: error instanceof Error ? error.message : '未知错误',
    });
  }
}

