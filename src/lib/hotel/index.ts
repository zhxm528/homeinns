// 导出所有酒店相关模块
export { dbConfig, TABLE_NAMES, HotelBaseInfo, HOTEL_CONSTANTS, HotelDisplayInfo } from './config';
export { initDatabase, closeDatabase, getPool, executeQuery, executeProcedure } from './database';
export { HotelDAO } from './hotelDAO';
export { HotelService } from './hotelService';

// 默认导出酒店服务
export { HotelService as default } from './hotelService';
