import sql from 'mssql';
import { dbConfig } from './config';

// 数据库连接池
let pool: sql.ConnectionPool | null = null;

// 初始化数据库连接池
export async function initDatabase(): Promise<void> {
  try {
    if (!pool) {
      pool = await sql.connect(dbConfig);
      console.log('🔗 [Database] 数据库连接池初始化成功');
    }
  } catch (error) {
    console.error('❌ [Database] 数据库连接失败:', error);
    throw error;
  }
}

// 关闭数据库连接池
export async function closeDatabase(): Promise<void> {
  try {
    if (pool) {
      await pool.close();
      pool = null;
      console.log('🔗 [Database] 数据库连接池已关闭');
    }
  } catch (error) {
    console.error('❌ [Database] 关闭数据库连接失败:', error);
    throw error;
  }
}

// 获取数据库连接池
export function getPool(): sql.ConnectionPool {
  if (!pool) {
    throw new Error('数据库连接池未初始化，请先调用 initDatabase()');
  }
  return pool;
}

// 执行查询
export async function executeQuery<T = any>(query: string, params?: any[]): Promise<T[]> {
  try {
    // 如果连接池未初始化，自动初始化
    if (!pool) {
      await initDatabase();
    }
    
    const currentPool = getPool();
    const request = currentPool.request();
    
    // 打印SQL语句和参数
    console.log('🔍 [SQL Query]', query);
    if (params && params.length > 0) {
      console.log('📝 [SQL Params]', params);
    }
    
    // 添加参数
    if (params) {
      params.forEach((param, index) => {
        request.input(`param${index}`, param);
      });
    }
    
    const startTime = Date.now();
    const result = await request.query(query);
    const endTime = Date.now();
    
    // 打印执行结果
    console.log(`✅ [SQL Result] 执行成功，耗时: ${endTime - startTime}ms，返回 ${result.recordset.length} 条记录`);
    
    return result.recordset;
  } catch (error) {
    console.error('❌ [SQL Error] 查询执行失败:', error);
    console.error('🔍 [Failed SQL]', query);
    if (params && params.length > 0) {
      console.error('📝 [Failed Params]', params);
    }
    throw error;
  }
}

// 执行存储过程
export async function executeProcedure<T = any>(
  procedureName: string, 
  params?: Record<string, any>
): Promise<T[]> {
  try {
    // 如果连接池未初始化，自动初始化
    if (!pool) {
      await initDatabase();
    }
    
    const currentPool = getPool();
    const request = currentPool.request();
    
    // 打印存储过程调用和参数
    console.log('🔍 [Stored Procedure]', procedureName);
    if (params && Object.keys(params).length > 0) {
      console.log('📝 [SP Params]', params);
    }
    
    // 添加参数
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        request.input(key, value);
      });
    }
    
    const startTime = Date.now();
    const result = await request.execute(procedureName);
    const endTime = Date.now();
    
    // 打印执行结果
    console.log(`✅ [SP Result] 存储过程执行成功，耗时: ${endTime - startTime}ms，返回 ${result.recordset.length} 条记录`);
    
    return result.recordset;
  } catch (error) {
    console.error('❌ [SP Error] 存储过程执行失败:', error);
    console.error('🔍 [Failed SP]', procedureName);
    if (params && Object.keys(params).length > 0) {
      console.error('📝 [Failed SP Params]', params);
    }
    throw error;
  }
}
