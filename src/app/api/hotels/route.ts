import { NextRequest, NextResponse } from 'next/server';
import { HotelService } from '@/lib/hotel';
import { HotelBaseInfo } from '@/lib/38/config';

// 初始化标志
let isDbReady = false;

// 初始化数据库连接
async function ensureDatabaseInitialized() {
  try {
    await HotelService.initialize();
    return true;
  } catch (error) {
    console.error('数据库初始化失败:', error);
    return false;
  }
}

// 模拟数据作为备用
const fallbackHotels: HotelBaseInfo[] = [
  {
    ID: 1,
    HotelCode: "JG001",
    HotelName: "如家酒店（北京朝阳店）",
    GroupCode: "JG",
    HotelType: "H002",
    PropertyType: "SLJT",
    PMSType: "P3",
    Status: 1,
    IsDelete: 0,
    CreateDate: new Date(),
  },
  {
    ID: 2,
    HotelCode: "JL002",
    HotelName: "汉庭酒店（上海浦东店）",
    GroupCode: "JL",
    HotelType: "H003",
    PropertyType: "FCQD",
    PMSType: "Opera",
    Status: 1,
    IsDelete: 0,
    CreateDate: new Date(),
  },
  {
    ID: 3,
    HotelCode: "NY003",
    HotelName: "全季酒店（广州天河店）",
    GroupCode: "NY",
    HotelType: "H004",
    PropertyType: "SJJT",
    PMSType: "Cambridge",
    Status: 1,
    IsDelete: 0,
    CreateDate: new Date(),
  },
  {
    ID: 4,
    HotelCode: "NH004",
    HotelName: "桔子酒店（深圳南山店）",
    GroupCode: "NH",
    HotelType: "H002",
    PropertyType: "SLZY",
    PMSType: "Soft",
    Status: 0,
    IsDelete: 0,
    CreateDate: new Date(),
  },
  {
    ID: 5,
    HotelCode: "NI005",
    HotelName: "海友酒店（杭州西湖店）",
    GroupCode: "NI",
    HotelType: "H003",
    PropertyType: "BZ",
    PMSType: "X6",
    Status: 1,
    IsDelete: 1,
    CreateDate: new Date(),
  },
  {
    ID: 6,
    HotelCode: "KP006",
    HotelName: "星程酒店（成都春熙路店）",
    GroupCode: "KP",
    HotelType: "H004",
    PropertyType: "SLJT",
    PMSType: "XMS",
    Status: 1,
    IsDelete: 0,
    CreateDate: new Date(),
  }
];

// 初始化数据库连接
ensureDatabaseInitialized().then(ready => {
  isDbReady = ready;
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  // 获取查询参数
  const hotelCode = searchParams.get('hotelCode');
  const hotelName = searchParams.get('hotelName');
  const groupCodes = searchParams.get('groupCodes')?.split(',') || ['JG','JL','NY','NH','NI','KP'];
  const hotelTypes = searchParams.get('hotelTypes')?.split(',') || [];
  const propertyTypes = searchParams.get('propertyTypes')?.split(',') || [];
  const pmsTypes = searchParams.get('pmsTypes')?.split(',') || [];
  const areas = searchParams.get('areas')?.split(',') || [];
  const urbanAreas = searchParams.get('urbanAreas')?.split(',') || [];
  const cities = searchParams.get('cities')?.split(',') || [];
  const status = searchParams.get('status');
  const isDelete = searchParams.get('isDelete');

  let hotels: HotelBaseInfo[] = [];
  let error: string | null = null;
  let fallbackUsed = false;

  if (isDbReady) {
    try {
      // 构建查询条件
      const queryConditions = {
        hotelCode: hotelCode || undefined,
        hotelName: hotelName || undefined,
        groupCodes: groupCodes.length > 0 ? groupCodes : undefined,
        hotelTypes: hotelTypes.length > 0 ? hotelTypes : undefined,
        propertyTypes: propertyTypes.length > 0 ? propertyTypes : undefined,
        pmsTypes: pmsTypes.length > 0 ? pmsTypes : undefined,
        areas: areas.length > 0 ? areas : undefined,
        urbanAreas: urbanAreas.length > 0 ? urbanAreas : undefined,
        cities: cities.length > 0 ? cities : undefined,
        status: status !== null ? parseInt(status) : undefined,
        isDelete: isDelete !== null ? parseInt(isDelete) : undefined,
      };

      hotels = await HotelService.queryHotels(queryConditions);
    } catch (err) {
      console.error('从数据库获取酒店数据失败:', err);
      error = '无法连接到酒店数据库，正在使用备用数据。';
      hotels = fallbackHotels;
      fallbackUsed = true;
    }
  } else {
    error = '数据库服务未准备好，正在使用备用数据。';
    hotels = fallbackHotels;
    fallbackUsed = true;
  }

  // 直接返回原始数据，不进行格式化
  return NextResponse.json({
    success: error === null,
    data: hotels,
    total: hotels.length,
    error,
    fallback: fallbackUsed,
  });
}

export async function POST(request: Request) {
  const { id } = await request.json();

  let hotel: HotelBaseInfo | null = null;
  let error: string | null = null;
  let fallbackUsed = false;

  if (isDbReady) {
    try {
      hotel = await HotelService.getHotelById(id);
    } catch (err) {
      console.error('从数据库获取酒店详情失败:', err);
      error = '无法连接到酒店数据库，正在使用备用数据。';
      hotel = fallbackHotels.find(h => h.ID === id) || null;
      fallbackUsed = true;
    }
  } else {
    error = '数据库服务未准备好，正在使用备用数据。';
    hotel = fallbackHotels.find(h => h.ID === id) || null;
    fallbackUsed = true;
  }

  return NextResponse.json({
    success: error === null,
    data: hotel,
    error,
    fallback: fallbackUsed,
  });
}