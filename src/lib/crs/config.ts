// PostgreSQL 数据库配置
export const dbConfig = {
  host: process.env.DB_HOST || 'localhost', // 数据库主机地址
  port: 5432, // PostgreSQL 默认端口
  database: 'qmdj', // 数据库名
  schema: 'public', // Schema 名称
  user: 'mz', // 用户名
  password: '12qw!@QW', // 密码
  // PostgreSQL 连接选项
  options: {
    // 连接超时时间（毫秒）
    connectionTimeoutMillis: 10000,
    // 查询超时时间（毫秒）
    query_timeout: 90000,
    // 是否使用 SSL
    ssl: false,
    // 最大连接数
    max: 100,
    // 最小连接数
    min: 10,
    // 空闲连接超时时间（毫秒）
    idleTimeoutMillis: 10000,
  },
  // 连接池配置
  pool: {
    max: 100, // 最大连接数
    min: 10, // 最小连接数
    idleTimeoutMillis: 10000, // 空闲连接超时时间
    acquireTimeoutMillis: 10000, // 获取连接超时时间
  }
};

// 数据库连接字符串（用于某些 PostgreSQL 客户端库）
export const connectionString = `postgresql://${dbConfig.user}:${encodeURIComponent(dbConfig.password)}@${dbConfig.host}:${dbConfig.port}/${dbConfig.database}?schema=${dbConfig.schema}`;

// 数据库类型
export const dbType = 'PostgreSQL' as const;

