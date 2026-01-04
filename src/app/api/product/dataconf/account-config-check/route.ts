import { NextRequest, NextResponse } from 'next/server';
import { getPool, initDatabase } from '@/lib/38/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });

    const page = Math.max(parseInt(params.page || '1', 10) || 1, 1);
    const requestedPageSize = parseInt(params.pageSize || '10', 10);
    // 如果 pageSize 大于 1000，认为是导出请求，允许返回所有数据
    // 否则限制为 10, 50, 100
    const pageSize = requestedPageSize > 1000 ? requestedPageSize : ([10, 50, 100].includes(requestedPageSize) ? requestedPageSize : 10);

    // SQL中的变量转换为前端传入的参数
    const bDate = params.bDate || new Date().toISOString().split('T')[0];
    const days = parseInt(params.days || '1', 10) || 1;
    const hotelCode = params.hotelCode || '';

    console.log('[科目配置检查] 前端页面传入的参数:', params);
    console.log('[科目配置检查] 解析参数:', { bDate, days, hotelCode });

    const sql = `
--检查科目配置是否符合每日实际收入情况
DECLARE @BDate date = CAST('${bDate}' AS DATE);
DECLARE @Days  int  = ${days};
DECLARE @End   date = DATEADD(DAY, @Days, @BDate);

;WITH hotels AS (
    SELECT DISTINCT
        LTRIM(RTRIM(HotelCode)) AS hotelid,
        LTRIM(RTRIM(HotelName)) AS hotelName
    FROM [CrsStar].dbo.StarHotelBaseInfo WITH (NOLOCK)
    WHERE GroupCode IN ('NH','JL','JG','NY','KP','NI')
      AND HotelCode NOT IN ('JG0017','JG0024','JG0051','JG0056','JG0061','JG0063','JG0064','JG0066','JG0068','JG0071','JG0072','JG0075','JG0081','JG0096','JG0101','JG0108','JL0005','JL0007','JL0009','JL0013')
      ${hotelCode ? `AND LTRIM(RTRIM(HotelCode)) LIKE '%${hotelCode.replace(/'/g, "''")}%'` : ''}
),
src AS (
    SELECT DISTINCT
        LTRIM(RTRIM(h.hotelid))   AS hotelid,
        LTRIM(RTRIM(hs.hotelName)) AS hotelName,
        LTRIM(RTRIM(h.class1))    AS class1,
        h.dept                    AS dept,
        h.deptname                AS deptname,
        LTRIM(RTRIM(h.descript1)) AS descript1
    FROM [192.168.210.170].[Report].dbo.bi_htlrev AS h WITH (NOLOCK)
    JOIN hotels AS hs
      ON hs.hotelid = LTRIM(RTRIM(h.hotelid))
    WHERE h.bdate >= @BDate AND h.bdate < @End
      AND (h.descript1 not like '%-%' and h.descript1 not like '%合计%' and h.descript1 not like '%人均%') 
      AND (h.deptname = 'FB' or h.deptname = '餐饮' or
      h.descript like '%场地租赁%' or h.descript like '%出租%' or h.descript like '%场租%')
      AND ISNULL(h.class1,'') <> ''
)
SELECT s.hotelid, s.hotelName, s.class1, s.descript1, s.dept, s.deptname
FROM src AS s
WHERE NOT EXISTS (
    SELECT 1
    FROM [192.168.210.170].[Report].dbo.TransCodeConfig AS t WITH (NOLOCK)
    WHERE t.hotelid = s.hotelid
      AND t.class1  = s.class1
)
ORDER BY s.hotelid, s.class1;
    `;

    console.log('[科目配置检查] SQL查询:', sql);

    // 初始化数据库连接（确保在查询选项列表之前连接已建立）
    let currentPool;
    try {
      getPool();
      currentPool = getPool();
    } catch {
      await initDatabase();
      currentPool = getPool();
    }

    // 查询所有酒店代码和名称的列表（用于 Select 选项）
    // 根据 hotel_search.md 规则，查询所有酒店（不限制状态和删除标记）
    let hotelCodeOptions: Array<{ label: string; value: string }> = [];
    try {
      const optionsSql = `
        SELECT
          h.HotelCode AS 酒店代码,
          h.HotelName AS 酒店名称
        FROM [CrsStar].dbo.StarHotelBaseInfo h
        ORDER BY h.HotelCode
      `;
      const optionsResult = await currentPool.request().query(optionsSql);
      const uniqueHotels = optionsResult.recordset;
      hotelCodeOptions = uniqueHotels.map((r: any) => ({ label: r.酒店代码, value: r.酒店代码 }));
      console.log('[科目配置检查] 获取酒店选项列表完成，酒店代码:', hotelCodeOptions.length);
    } catch (error) {
      console.error('[科目配置检查] 获取酒店选项列表失败:', error);
    }

    let results: any[] = [];
    try {
      const request = currentPool.request();
      console.log('🔍 [SQL Query]', sql);
      const started = Date.now();
      const dbResult = await request.query(sql);
      console.log(`✅ [SQL Result] ${dbResult.recordset.length} rows in ${Date.now() - started}ms`);
      results = dbResult.recordset || [];
    } catch (e) {
      console.error('❌ [SQL Error]', e);
      console.error('🔍 [Failed SQL]', sql);
      // 即使主查询失败，也返回选项列表
      return NextResponse.json({
        success: false,
        data: {
          message: '查询失败',
          params,
          timestamp: new Date().toISOString(),
          total: 0,
          items: [],
          options: {
            hotelCodes: hotelCodeOptions,
          },
        },
        error: e instanceof Error ? e.message : '查询失败',
        message: '查询失败，但已加载酒店选项列表',
      });
    }

    const totalCount = results.length;

    // 分页处理
    const startIndex = (page - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalCount);
    const items = results.slice(startIndex, endIndex);

    const responseData = {
      message: '科目配置检查 - 查询结果',
      params,
      timestamp: new Date().toISOString(),
      total: totalCount,
      items,
      options: {
        hotelCodes: hotelCodeOptions,
      },
    };

    //console.log('[科目配置检查] 返回给前端的内容:', JSON.stringify(responseData, null, 2));

    return NextResponse.json({ success: true, data: responseData, message: '查询成功' });
  } catch (error) {
    console.error('[科目配置检查] 查询失败:', error);
    return NextResponse.json({ success: false, data: null, message: '查询失败', error: error instanceof Error ? error.message : '未知错误' });
  }
}
