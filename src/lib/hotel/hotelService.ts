import { HotelDAO } from './hotelDAO';
import { HotelBaseInfo } from './config';
import { initDatabase } from './database';

// 酒店服务层
export class HotelService {
  
  // 初始化服务
  static async initialize(): Promise<void> {
    try {
      await initDatabase();
    } catch (error) {
      console.error('酒店服务初始化失败:', error);
      throw error;
    }
  }

  // 获取所有酒店列表
  static async getAllHotels(): Promise<HotelBaseInfo[]> {
    try {
      return await HotelDAO.getAllHotels();
    } catch (error) {
      console.error('获取酒店列表失败:', error);
      throw new Error('获取酒店列表失败');
    }
  }

  // 根据ID获取酒店详情
  static async getHotelById(id: number): Promise<HotelBaseInfo | null> {
    try {
      if (!id || id <= 0) {
        throw new Error('无效的酒店ID');
      }
      return await HotelDAO.getHotelById(id);
    } catch (error) {
      console.error('获取酒店详情失败:', error);
      throw new Error('获取酒店详情失败');
    }
  }

  // 搜索酒店
  static async searchHotels(searchTerm: string): Promise<HotelBaseInfo[]> {
    try {
      if (!searchTerm || searchTerm.trim().length === 0) {
        return await HotelDAO.getAllHotels();
      }

      const trimmedTerm = searchTerm.trim();
      
      // 同时搜索酒店名称和城市
      const [nameResults, cityResults] = await Promise.all([
        HotelDAO.searchHotelsByName(trimmedTerm),
        HotelDAO.getHotelsByCity(trimmedTerm)
      ]);

      // 合并结果并去重
      const allResults = [...nameResults, ...cityResults];
      const uniqueResults = allResults.filter((hotel, index, self) => 
        index === self.findIndex(h => h.ID === hotel.ID)
      );

      return uniqueResults;
    } catch (error) {
      console.error('搜索酒店失败:', error);
      throw new Error('搜索酒店失败');
    }
  }

  // 根据条件查询酒店
  static async queryHotels(conditions: {
    hotelCode?: string;
    hotelName?: string;
    groupCodes?: string[];
    hotelTypes?: string[];
    propertyTypes?: string[];
    pmsTypes?: string[];
    areas?: string[];
    urbanAreas?: string[];
    cities?: string[];
    status?: number;
    isDelete?: number;
  }): Promise<HotelBaseInfo[]> {
    try {
      return await HotelDAO.queryHotels(conditions);
    } catch (error) {
      console.error('查询酒店失败:', error);
      throw new Error('查询酒店失败');
    }
  }

  // 获取酒店统计信息
  static async getHotelStatistics(): Promise<{
    totalHotels: number;
    hotelsByCity: Array<{ city: string; count: number }>;
    hotelsByStarLevel: Array<{ starLevel: string; count: number }>;
  }> {
    try {
      return await HotelDAO.getHotelStatistics();
    } catch (error) {
      console.error('获取酒店统计信息失败:', error);
      throw new Error('获取酒店统计信息失败');
    }
  }

  // 格式化酒店数据用于前端显示
  static formatHotelForDisplay(hotel: HotelBaseInfo): {
    id: number;
    name: string;
    location: string;
    rating: number;
    price: number;
    image: string;
    amenities: string[];
    description: string;
    distance: string;
  } {
    // 解析设施信息
    const amenities = hotel.HotelFeatures ? 
      hotel.HotelFeatures.split(',').map(f => f.trim()).filter(f => f.length > 0) :
      ['免费WiFi', '停车场', '早餐'];

    // 根据星级生成评分
    const starLevel = hotel.HotelStar ? parseInt(hotel.HotelStar) : 3;
    const rating = Math.min(5, Math.max(3, starLevel + 0.5));

    // 根据星级和城市生成价格
    const cityName = hotel.MDMCity || hotel.Area || '未知城市';
    const basePrice = hotel.HotelMinPrice || (200 + (starLevel * 50) + (cityName.length * 10));
    const price = Math.round(basePrice / 10) * 10;

    return {
      id: hotel.ID,
      name: hotel.HotelName,
      location: `${cityName} ${hotel.HotelAddress || ''}`,
      rating,
      price,
      image: `/api/placeholder/300/200`,
      amenities,
      description: hotel.Describe || `${cityName}优质酒店，设施完善，服务周到`,
      distance: `距离市中心${Math.floor(Math.random() * 10 + 1)}公里`
    };
  }

  // 批量格式化酒店数据
  static formatHotelsForDisplay(hotels: HotelBaseInfo[]): ReturnType<typeof HotelService.formatHotelForDisplay>[] {
    return hotels.map(hotel => this.formatHotelForDisplay(hotel));
  }
}
