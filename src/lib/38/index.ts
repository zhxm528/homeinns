// 导出数据库相关模块
export { dbConfig, TABLE_NAMES, HotelBaseInfo } from './config';
export { initDatabase, closeDatabase, getPool, executeQuery, executeProcedure } from './database';

// 默认导出数据库工具
export { initDatabase as default } from './database';
