// 酒店业务配置 - 从38目录导入数据库配置
export { dbConfig, TABLE_NAMES } from '../38/config';
export type { HotelBaseInfo } from '../38/config';

// 酒店业务相关常量
export const HOTEL_CONSTANTS = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  SEARCH_DEBOUNCE_TIME: 500,
} as const;

// 酒店业务类型定义
export interface HotelDisplayInfo {
  id: number;
  name: string;
  location: string;
  rating: number;
  price: number;
  image: string;
  amenities: string[];
  description: string;
  distance: string;
}
