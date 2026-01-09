import { Pool, QueryResult } from 'pg';
import { dbConfig, connectionString } from './config';

// 数据库连接池
let pool: Pool | null = null;

// 初始化数据库连接池
export async function initDatabase(): Promise<void> {
  try {
    if (!pool) {
      pool = new Pool({
        host: dbConfig.host,
        port: dbConfig.port,
        database: dbConfig.database,
        user: dbConfig.user,
        password: dbConfig.password,
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        idleTimeoutMillis: dbConfig.pool.idleTimeoutMillis,
        connectionTimeoutMillis: dbConfig.options.connectionTimeoutMillis,
      });
      console.log('🔗 [CRS Database] PostgreSQL 数据库连接池初始化成功');
    }
  } catch (error) {
    console.error('❌ [CRS Database] 数据库连接失败:', error);
    throw error;
  }
}

// 关闭数据库连接池
export async function closeDatabase(): Promise<void> {
  try {
    if (pool) {
      await pool.end();
      pool = null;
      console.log('🔗 [CRS Database] 数据库连接池已关闭');
    }
  } catch (error) {
    console.error('❌ [CRS Database] 关闭数据库连接失败:', error);
    throw error;
  }
}

// 获取数据库连接池
export function getPool(): Pool {
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
    
    // 打印SQL语句和参数
    console.log('🔍 [CRS SQL Query]', query);
    if (params && params.length > 0) {
      console.log('📝 [CRS SQL Params]', params);
    }
    
    const startTime = Date.now();
    const result: QueryResult<T> = await currentPool.query(query, params);
    const endTime = Date.now();
    
    // 打印执行结果
    console.log(`✅ [CRS SQL Result] 执行成功，耗时: ${endTime - startTime}ms，返回 ${result.rows.length} 条记录`);
    
    return result.rows;
  } catch (error) {
    console.error('❌ [CRS SQL Error] 查询执行失败:', error);
    console.error('🔍 [Failed SQL]', query);
    if (params && params.length > 0) {
      console.error('📝 [Failed Params]', params);
    }
    throw error;
  }
}

