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
  console.log('========== [携程接口 mappingInfoSet] 开始调用 ==========');
  console.log('[携程接口 mappingInfoSet] 请求URL:', url);
  console.log('[携程接口 mappingInfoSet] 请求方法: POST');
  console.log('[携程接口 mappingInfoSet] 请求头:', JSON.stringify(headers, null, 2));
  console.log('[携程接口 mappingInfoSet] 请求参数:', requestBodyStr);
  console.log('[携程接口 mappingInfoSet] 请求时间:', new Date().toISOString());

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
    console.log('[携程接口 mappingInfoSet] 响应状态码:', response.status);
    console.log('[携程接口 mappingInfoSet] 响应状态文本:', response.statusText);
    console.log('[携程接口 mappingInfoSet] 响应头:', JSON.stringify(Object.fromEntries(response.headers.entries()), null, 2));
    console.log('[携程接口 mappingInfoSet] 请求耗时:', `${duration}ms`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[携程接口 mappingInfoSet] 响应错误内容:', errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const responseDataStr = JSON.stringify(data, null, 2);
    
    // 打印完整的响应结果
    console.log('[携程接口 mappingInfoSet] 响应结果:', responseDataStr);
    console.log('========== [携程接口 mappingInfoSet] 调用完成 ==========');
    
    return data;
  } catch (error) {
    console.error('========== [携程接口 mappingInfoSet] 调用失败 ==========');
    console.error('[携程接口 mappingInfoSet] 错误类型:', error instanceof Error ? error.constructor.name : typeof error);
    console.error('[携程接口 mappingInfoSet] 错误消息:', error instanceof Error ? error.message : String(error));
    console.error('[携程接口 mappingInfoSet] 错误堆栈:', error instanceof Error ? error.stack : '无堆栈信息');
    console.error('========== [携程接口 mappingInfoSet] 错误结束 ==========');
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    // 从请求体中获取参数
    const body = await request.json();
    const params: Record<string, any> = body || {};

    console.log('[携程接口 mappingInfoSet] 前端页面传入的参数:', params);

    // 构建请求体
    const requestBody: any = {
      languageCode: params.languageCode || 'en-US',
    };

    // 必填参数验证
    if (!params.setType) {
      return NextResponse.json({
        success: false,
        data: null,
        message: '请求参数错误：setType 为必填字段',
      });
    }
    requestBody.setType = params.setType;

    if (!params.hotelId) {
      return NextResponse.json({
        success: false,
        data: null,
        message: '请求参数错误：hotelId 为必填字段',
      });
    }
    requestBody.hotelId = parseInt(params.hotelId, 10);

    if (!params.hotelCode) {
      return NextResponse.json({
        success: false,
        data: null,
        message: '请求参数错误：hotelCode 为必填字段',
      });
    }
    requestBody.hotelCode = params.hotelCode;

    // subRoomMappings 处理
    if (params.setType === 'addMapping' || params.setType === 'deleteRoomMapping') {
      if (!params.subRoomMappings || !Array.isArray(params.subRoomMappings) || params.subRoomMappings.length === 0) {
        return NextResponse.json({
          success: false,
          data: null,
          message: '请求参数错误：当 setType 为 addMapping 或 deleteRoomMapping 时，subRoomMappings 为必填字段且不能为空',
        });
      }

      // 验证数量限制（最多50个）
      if (params.subRoomMappings.length > 50) {
        return NextResponse.json({
          success: false,
          data: null,
          message: '请求参数错误：subRoomMappings 最多可设置 50 个产品',
        });
      }

      // 处理 subRoomMappings 数组
      requestBody.subRoomMappings = params.subRoomMappings.map((item: any) => {
        const mapping: any = {};
        
        if (item.subRoomId) {
          mapping.subRoomId = parseInt(item.subRoomId, 10);
        }
        if (item.roomTypeCode) {
          mapping.roomTypeCode = item.roomTypeCode;
        }
        if (item.roomTypeName) {
          mapping.roomTypeName = item.roomTypeName;
        }
        if (item.ratePlanCode) {
          mapping.ratePlanCode = item.ratePlanCode;
        }
        if (item.ratePlanName) {
          mapping.ratePlanName = item.ratePlanName;
        }

        return mapping;
      });

      // 验证必填字段
      for (let i = 0; i < requestBody.subRoomMappings.length; i++) {
        const mapping = requestBody.subRoomMappings[i];
        if (!mapping.subRoomId) {
          return NextResponse.json({
            success: false,
            data: null,
            message: `请求参数错误：subRoomMappings[${i}].subRoomId 为必填字段`,
          });
        }
        if (!mapping.roomTypeCode) {
          return NextResponse.json({
            success: false,
            data: null,
            message: `请求参数错误：subRoomMappings[${i}].roomTypeCode 为必填字段`,
          });
        }
      }
    } else if (params.setType === 'deleteHotelMapping') {
      // deleteHotelMapping 时不需要 subRoomMappings
      requestBody.subRoomMappings = [];
    }

    // 选择环境（优先使用前端传入的 env，其次使用环境变量，默认测试环境）
    const envFromParam = params.env === 'prod' ? 'prod' : params.env === 'test' ? 'test' : null;
    const env = envFromParam || (process.env.CTRIP_ENV === 'prod' ? 'prod' : 'test');
    const config = CTRIP_CONFIG[env];

    // 检查配置
    if (!config.username || !config.password) {
      console.warn('[携程接口 mappingInfoSet] 警告：未配置携程用户名或密码，返回模拟数据');
      
      // 返回模拟数据用于测试
      const mockData = {
        code: '0',
        message: 'Success（模拟数据）',
        requestId: '162742088503487da76e767045fca9b2',
        resultList: {
          hotel: {
            hotelId: requestBody.hotelId,
            code: '0',
            message: 'Success',
          },
          roomLists: requestBody.subRoomMappings.map((item: any) => ({
            subRoomId: item.subRoomId,
            code: '0',
            message: 'Success',
          })),
        },
      };

      // 生成服务器时间
      const serverTime = new Date().toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });

      return NextResponse.json({
        success: true,
        data: mockData,
        message: '设置成功（模拟数据）',
        serverTime,
      });
    }

    // 调用携程接口
    const endpoint = '/static/v2/json/mappingInfoSet';
    console.log('[携程接口 mappingInfoSet] 准备调用携程接口，环境:', env);
    console.log('[携程接口 mappingInfoSet] 构建的请求体:', JSON.stringify(requestBody, null, 2));
    
    const responseData = await callCtripApi(endpoint, requestBody, config);

    console.log('[携程接口 mappingInfoSet] 携程接口调用成功，返回给前端的数据:', JSON.stringify(responseData, null, 2));

    // 生成服务器时间
    const serverTime = new Date().toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });

    return NextResponse.json({
      success: true,
      data: responseData,
      message: '设置成功',
      serverTime,
    });
  } catch (error) {
    console.error('[携程接口 mappingInfoSet] 设置失败:', error);
    return NextResponse.json({
      success: false,
      data: null,
      message: '设置失败',
      error: error instanceof Error ? error.message : '未知错误',
    });
  }
}

