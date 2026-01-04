import { NextRequest, NextResponse } from 'next/server';
import { getPool, initDatabase } from '@/lib/38/database';

// 经营数据自然月报
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // 获取查询参数
    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });

    // 分页参数
    const page = Math.max(parseInt(params.page || '1', 10) || 1, 1);
    const requestedPageSize = parseInt(params.pageSize || '10', 10);
    const pageSize =
      requestedPageSize > 1000 ? requestedPageSize : [10, 50, 100, 1000].includes(requestedPageSize) ? requestedPageSize : 10;

    // 查询条件参数
    const year = params.year || ''; // 年份，例如 2025
    const groupCodes = params.groupCodes || ''; // 逗号分隔的管理公司代码
    const hotelCode = params.hotelCode || ''; // 酒店代码（模糊查询）
    const hotelName = params.hotelName || ''; // 酒店名称（模糊查询）
    const areas = params.areas || ''; // 区域（逗号分隔）
    const urbanAreas = params.urbanAreas || ''; // 城市区域（逗号分隔）
    const provinces = params.provinces || ''; // 省份（逗号分隔）
    const cities = params.cities || ''; // 城市（逗号分隔）

    console.log('[经营数据自然月报] 前端页面传入的参数:', params);

    // 构建 WHERE 条件
    let whereConditions = `WHERE a.class = 'total' AND b.Status = 1 AND b.IsDelete = 0`;

    // 年份（如果传入，则按年份限定）
    if (year) {
      const safeYear = year.replace(/[^0-9]/g, '').slice(0, 4);
      if (safeYear.length === 4) {
        const startDate = `${safeYear}-01-01`;
        const endDate = `${safeYear}-12-31`;
        whereConditions += ` AND a.bdate BETWEEN '${startDate.replace(/'/g, "''")}' AND '${endDate.replace(/'/g, "''")}'`;
      }
    }

    // 管理公司
    if (groupCodes) {
      const codes = groupCodes
        .split(',')
        .map(code => `'${code.trim().replace(/'/g, "''")}'`)
        .join(',');
      whereConditions += ` AND b.GroupCode IN (${codes})`;
    }

    // 酒店代码（模糊查询）
    if (hotelCode) {
      whereConditions += ` AND b.HotelCode LIKE '%${hotelCode.replace(/'/g, "''")}%'`;
    }

    // 酒店名称（模糊查询）
    if (hotelName) {
      whereConditions += ` AND b.HotelName LIKE '%${hotelName.replace(/'/g, "''")}%'`;
    }

    // 区域
    if (areas) {
      const areaList = areas
        .split(',')
        .map(area => `'${area.trim().replace(/'/g, "''")}'`)
        .join(',');
      whereConditions += ` AND b.Area IN (${areaList})`;
    }

    // 城市区域
    if (urbanAreas) {
      const urbanAreaList = urbanAreas
        .split(',')
        .map(area => `'${area.trim().replace(/'/g, "''")}'`)
        .join(',');
      whereConditions += ` AND b.UrbanArea IN (${urbanAreaList})`;
    }

    // 省份
    if (provinces) {
      const provinceList = provinces
        .split(',')
        .map(province => `'${province.trim().replace(/'/g, "''")}'`)
        .join(',');
      whereConditions += ` AND b.MDMProvince IN (${provinceList})`;
    }

    // 城市
    if (cities) {
      const cityList = cities
        .split(',')
        .map(city => `'${city.trim().replace(/'/g, "''")}'`)
        .join(',');
      whereConditions += ` AND b.MDMCity IN (${cityList})`;
    }

    // 构建 SQL（基于 md/sql_table/sql_business-data-monthly-report.md）
    const sql = `
WITH MonthlyData AS (
    SELECT 
        b.HotelName,
        b.GroupCode,
        b.PMSType,
        b.PropertyType,
        b.MDMCity,
        MONTH(a.bdate) AS MonthNum,

        SUM(a.rms_ttl) AS rms_ttl,
        SUM(a.rms_occ) AS rms_occ,
        SUM(a.rev_rm) AS rev_rm,
        SUM(a.rev_fb) AS rev_fb,
        SUM(a.rev_ot) AS rev_ot
    FROM [192.168.210.170].[Report].dbo.bi_ttl AS a
    INNER JOIN [CrsStar].dbo.StarHotelBaseInfo AS b 
        ON a.hotelid = b.HotelCode
    ${whereConditions}
    GROUP BY 
        b.HotelName,
        b.GroupCode,
        b.PMSType,
        b.PropertyType,
        b.MDMCity,
        MONTH(a.bdate)
)
SELECT
    HotelName,
    GroupCode,
    PMSType,
    PropertyType,
    MDMCity,

    /* -------------------- 1 月 -------------------- */
    SUM(CASE WHEN MonthNum = 1 THEN rev_rm + rev_fb + rev_ot ELSE 0 END) AS Jan_Total,
    SUM(CASE WHEN MonthNum = 1 THEN rev_rm ELSE 0 END) AS Jan_Room,
    SUM(CASE WHEN MonthNum = 1 THEN rev_fb ELSE 0 END) AS Jan_FB,
    SUM(CASE WHEN MonthNum = 1 THEN rev_ot ELSE 0 END) AS Jan_Others,
    CASE WHEN SUM(CASE WHEN MonthNum = 1 THEN rms_ttl ELSE 0 END) > 0 THEN 
        CAST(SUM(CASE WHEN MonthNum = 1 THEN rms_occ ELSE 0 END)*1.0 /
             SUM(CASE WHEN MonthNum = 1 THEN rms_ttl ELSE 0 END) AS DECIMAL(10,4))
    ELSE 0 END AS Jan_OccRate,
    CASE WHEN SUM(CASE WHEN MonthNum = 1 THEN rms_occ ELSE 0 END) > 0 THEN 
        CAST(SUM(CASE WHEN MonthNum = 1 THEN rev_rm ELSE 0 END)*1.0 /
             SUM(CASE WHEN MonthNum = 1 THEN rms_occ ELSE 0 END) AS DECIMAL(10,2))
    ELSE 0 END AS Jan_ADR,
    CASE WHEN SUM(CASE WHEN MonthNum = 1 THEN rms_ttl ELSE 0 END) > 0 THEN 
        CAST(SUM(CASE WHEN MonthNum = 1 THEN rev_rm ELSE 0 END)*1.0 /
             SUM(CASE WHEN MonthNum = 1 THEN rms_ttl ELSE 0 END) AS DECIMAL(10,2))
    ELSE 0 END AS Jan_RevPAR,

    /* -------------------- 2 月 -------------------- */
    SUM(CASE WHEN MonthNum = 2 THEN rev_rm + rev_fb + rev_ot ELSE 0 END) AS Feb_Total,
    SUM(CASE WHEN MonthNum = 2 THEN rev_rm ELSE 0 END) AS Feb_Room,
    SUM(CASE WHEN MonthNum = 2 THEN rev_fb ELSE 0 END) AS Feb_FB,
    SUM(CASE WHEN MonthNum = 2 THEN rev_ot ELSE 0 END) AS Feb_Others,
    CASE WHEN SUM(CASE WHEN MonthNum = 2 THEN rms_ttl ELSE 0 END) > 0 THEN 
        CAST(SUM(CASE WHEN MonthNum = 2 THEN rms_occ ELSE 0 END)*1.0 /
             SUM(CASE WHEN MonthNum = 2 THEN rms_ttl ELSE 0 END) AS DECIMAL(10,4))
    ELSE 0 END AS Feb_OccRate,
    CASE WHEN SUM(CASE WHEN MonthNum = 2 THEN rms_occ ELSE 0 END) > 0 THEN 
        CAST(SUM(CASE WHEN MonthNum = 2 THEN rev_rm ELSE 0 END)*1.0 /
             SUM(CASE WHEN MonthNum = 2 THEN rms_occ ELSE 0 END) AS DECIMAL(10,2))
    ELSE 0 END AS Feb_ADR,
    CASE WHEN SUM(CASE WHEN MonthNum = 2 THEN rms_ttl ELSE 0 END) > 0 THEN 
        CAST(SUM(CASE WHEN MonthNum = 2 THEN rev_rm ELSE 0 END)*1.0 /
             SUM(CASE WHEN MonthNum = 2 THEN rms_ttl ELSE 0 END) AS DECIMAL(10,2))
    ELSE 0 END AS Feb_RevPAR,

    /* -------------------- 3 月 -------------------- */
    SUM(CASE WHEN MonthNum = 3 THEN rev_rm + rev_fb + rev_ot ELSE 0 END) AS Mar_Total,
    SUM(CASE WHEN MonthNum = 3 THEN rev_rm ELSE 0 END) AS Mar_Room,
    SUM(CASE WHEN MonthNum = 3 THEN rev_fb ELSE 0 END) AS Mar_FB,
    SUM(CASE WHEN MonthNum = 3 THEN rev_ot ELSE 0 END) AS Mar_Others,
    CASE WHEN SUM(CASE WHEN MonthNum = 3 THEN rms_ttl ELSE 0 END) > 0 THEN 
        CAST(SUM(CASE WHEN MonthNum = 3 THEN rms_occ ELSE 0 END)*1.0 /
             SUM(CASE WHEN MonthNum = 3 THEN rms_ttl ELSE 0 END) AS DECIMAL(10,4))
    ELSE 0 END AS Mar_OccRate,
    CASE WHEN SUM(CASE WHEN MonthNum = 3 THEN rms_occ ELSE 0 END) > 0 THEN 
        CAST(SUM(CASE WHEN MonthNum = 3 THEN rev_rm ELSE 0 END)*1.0 /
             SUM(CASE WHEN MonthNum = 3 THEN rms_occ ELSE 0 END) AS DECIMAL(10,2))
    ELSE 0 END AS Mar_ADR,
    CASE WHEN SUM(CASE WHEN MonthNum = 3 THEN rms_ttl ELSE 0 END) > 0 THEN 
        CAST(SUM(CASE WHEN MonthNum = 3 THEN rev_rm ELSE 0 END)*1.0 /
             SUM(CASE WHEN MonthNum = 3 THEN rms_ttl ELSE 0 END) AS DECIMAL(10,2))
    ELSE 0 END AS Mar_RevPAR,

    /* -------------------- 4 月 -------------------- */
    SUM(CASE WHEN MonthNum = 4 THEN rev_rm + rev_fb + rev_ot ELSE 0 END) AS Apr_Total,
    SUM(CASE WHEN MonthNum = 4 THEN rev_rm ELSE 0 END) AS Apr_Room,
    SUM(CASE WHEN MonthNum = 4 THEN rev_fb ELSE 0 END) AS Apr_FB,
    SUM(CASE WHEN MonthNum = 4 THEN rev_ot ELSE 0 END) AS Apr_Others,
    CASE WHEN SUM(CASE WHEN MonthNum = 4 THEN rms_ttl ELSE 0 END) > 0 THEN 
        CAST(SUM(CASE WHEN MonthNum = 4 THEN rms_occ ELSE 0 END)*1.0 /
             SUM(CASE WHEN MonthNum = 4 THEN rms_ttl ELSE 0 END) AS DECIMAL(10,4))
    ELSE 0 END AS Apr_OccRate,
    CASE WHEN SUM(CASE WHEN MonthNum = 4 THEN rms_occ ELSE 0 END) > 0 THEN 
        CAST(SUM(CASE WHEN MonthNum = 4 THEN rev_rm ELSE 0 END)*1.0 /
             SUM(CASE WHEN MonthNum = 4 THEN rms_occ ELSE 0 END) AS DECIMAL(10,2))
    ELSE 0 END AS Apr_ADR,
    CASE WHEN SUM(CASE WHEN MonthNum = 4 THEN rms_ttl ELSE 0 END) > 0 THEN 
        CAST(SUM(CASE WHEN MonthNum = 4 THEN rev_rm ELSE 0 END)*1.0 /
             SUM(CASE WHEN MonthNum = 4 THEN rms_ttl ELSE 0 END) AS DECIMAL(10,2))
    ELSE 0 END AS Apr_RevPAR,

    /* -------------------- 5 月 -------------------- */
    SUM(CASE WHEN MonthNum = 5 THEN rev_rm + rev_fb + rev_ot ELSE 0 END) AS May_Total,
    SUM(CASE WHEN MonthNum = 5 THEN rev_rm ELSE 0 END) AS May_Room,
    SUM(CASE WHEN MonthNum = 5 THEN rev_fb ELSE 0 END) AS May_FB,
    SUM(CASE WHEN MonthNum = 5 THEN rev_ot ELSE 0 END) AS May_Others,
    CASE WHEN SUM(CASE WHEN MonthNum = 5 THEN rms_ttl ELSE 0 END) > 0 THEN 
        CAST(SUM(CASE WHEN MonthNum = 5 THEN rms_occ ELSE 0 END)*1.0 /
             SUM(CASE WHEN MonthNum = 5 THEN rms_ttl ELSE 0 END) AS DECIMAL(10,4))
    ELSE 0 END AS May_OccRate,
    CASE WHEN SUM(CASE WHEN MonthNum = 5 THEN rms_occ ELSE 0 END) > 0 THEN 
        CAST(SUM(CASE WHEN MonthNum = 5 THEN rev_rm ELSE 0 END)*1.0 /
             SUM(CASE WHEN MonthNum = 5 THEN rms_occ ELSE 0 END) AS DECIMAL(10,2))
    ELSE 0 END AS May_ADR,
    CASE WHEN SUM(CASE WHEN MonthNum = 5 THEN rms_ttl ELSE 0 END) > 0 THEN 
        CAST(SUM(CASE WHEN MonthNum = 5 THEN rev_rm ELSE 0 END)*1.0 /
             SUM(CASE WHEN MonthNum = 5 THEN rms_ttl ELSE 0 END) AS DECIMAL(10,2))
    ELSE 0 END AS May_RevPAR,

    /* -------------------- 6 月 -------------------- */
    SUM(CASE WHEN MonthNum = 6 THEN rev_rm + rev_fb + rev_ot ELSE 0 END) AS Jun_Total,
    SUM(CASE WHEN MonthNum = 6 THEN rev_rm ELSE 0 END) AS Jun_Room,
    SUM(CASE WHEN MonthNum = 6 THEN rev_fb ELSE 0 END) AS Jun_FB,
    SUM(CASE WHEN MonthNum = 6 THEN rev_ot ELSE 0 END) AS Jun_Others,
    CASE WHEN SUM(CASE WHEN MonthNum = 6 THEN rms_ttl ELSE 0 END) > 0 THEN 
        CAST(SUM(CASE WHEN MonthNum = 6 THEN rms_occ ELSE 0 END)*1.0 /
             SUM(CASE WHEN MonthNum = 6 THEN rms_ttl ELSE 0 END) AS DECIMAL(10,4))
    ELSE 0 END AS Jun_OccRate,
    CASE WHEN SUM(CASE WHEN MonthNum = 6 THEN rms_occ ELSE 0 END) > 0 THEN 
        CAST(SUM(CASE WHEN MonthNum = 6 THEN rev_rm ELSE 0 END)*1.0 /
             SUM(CASE WHEN MonthNum = 6 THEN rms_occ ELSE 0 END) AS DECIMAL(10,2))
    ELSE 0 END AS Jun_ADR,
    CASE WHEN SUM(CASE WHEN MonthNum = 6 THEN rms_ttl ELSE 0 END) > 0 THEN 
        CAST(SUM(CASE WHEN MonthNum = 6 THEN rev_rm ELSE 0 END)*1.0 /
             SUM(CASE WHEN MonthNum = 6 THEN rms_ttl ELSE 0 END) AS DECIMAL(10,2))
    ELSE 0 END AS Jun_RevPAR,

    /* -------------------- 7 月 -------------------- */
    SUM(CASE WHEN MonthNum = 7 THEN rev_rm + rev_fb + rev_ot ELSE 0 END) AS Jul_Total,
    SUM(CASE WHEN MonthNum = 7 THEN rev_rm ELSE 0 END) AS Jul_Room,
    SUM(CASE WHEN MonthNum = 7 THEN rev_fb ELSE 0 END) AS Jul_FB,
    SUM(CASE WHEN MonthNum = 7 THEN rev_ot ELSE 0 END) AS Jul_Others,
    CASE WHEN SUM(CASE WHEN MonthNum = 7 THEN rms_ttl ELSE 0 END) > 0 THEN 
        CAST(SUM(CASE WHEN MonthNum = 7 THEN rms_occ ELSE 0 END)*1.0 /
             SUM(CASE WHEN MonthNum = 7 THEN rms_ttl ELSE 0 END) AS DECIMAL(10,4))
    ELSE 0 END AS Jul_OccRate,
    CASE WHEN SUM(CASE WHEN MonthNum = 7 THEN rms_occ ELSE 0 END) > 0 THEN 
        CAST(SUM(CASE WHEN MonthNum = 7 THEN rev_rm ELSE 0 END)*1.0 /
             SUM(CASE WHEN MonthNum = 7 THEN rms_occ ELSE 0 END) AS DECIMAL(10,2))
    ELSE 0 END AS Jul_ADR,
    CASE WHEN SUM(CASE WHEN MonthNum = 7 THEN rms_ttl ELSE 0 END) > 0 THEN 
        CAST(SUM(CASE WHEN MonthNum = 7 THEN rev_rm ELSE 0 END)*1.0 /
             SUM(CASE WHEN MonthNum = 7 THEN rms_ttl ELSE 0 END) AS DECIMAL(10,2))
    ELSE 0 END AS Jul_RevPAR,

    /* -------------------- 8 月 -------------------- */
    SUM(CASE WHEN MonthNum = 8 THEN rev_rm + rev_fb + rev_ot ELSE 0 END) AS Aug_Total,
    SUM(CASE WHEN MonthNum = 8 THEN rev_rm ELSE 0 END) AS Aug_Room,
    SUM(CASE WHEN MonthNum = 8 THEN rev_fb ELSE 0 END) AS Aug_FB,
    SUM(CASE WHEN MonthNum = 8 THEN rev_ot ELSE 0 END) AS Aug_Others,
    CASE WHEN SUM(CASE WHEN MonthNum = 8 THEN rms_ttl ELSE 0 END) > 0 THEN 
        CAST(SUM(CASE WHEN MonthNum = 8 THEN rms_occ ELSE 0 END)*1.0 /
             SUM(CASE WHEN MonthNum = 8 THEN rms_ttl ELSE 0 END) AS DECIMAL(10,4))
    ELSE 0 END AS Aug_OccRate,
    CASE WHEN SUM(CASE WHEN MonthNum = 8 THEN rms_occ ELSE 0 END) > 0 THEN 
        CAST(SUM(CASE WHEN MonthNum = 8 THEN rev_rm ELSE 0 END)*1.0 /
             SUM(CASE WHEN MonthNum = 8 THEN rms_occ ELSE 0 END) AS DECIMAL(10,2))
    ELSE 0 END AS Aug_ADR,
    CASE WHEN SUM(CASE WHEN MonthNum = 8 THEN rms_ttl ELSE 0 END) > 0 THEN 
        CAST(SUM(CASE WHEN MonthNum = 8 THEN rev_rm ELSE 0 END)*1.0 /
             SUM(CASE WHEN MonthNum = 8 THEN rms_ttl ELSE 0 END) AS DECIMAL(10,2))
    ELSE 0 END AS Aug_RevPAR,

    /* -------------------- 9 月 -------------------- */
    SUM(CASE WHEN MonthNum = 9 THEN rev_rm + rev_fb + rev_ot ELSE 0 END) AS Sep_Total,
    SUM(CASE WHEN MonthNum = 9 THEN rev_rm ELSE 0 END) AS Sep_Room,
    SUM(CASE WHEN MonthNum = 9 THEN rev_fb ELSE 0 END) AS Sep_FB,
    SUM(CASE WHEN MonthNum = 9 THEN rev_ot ELSE 0 END) AS Sep_Others,
    CASE WHEN SUM(CASE WHEN MonthNum = 9 THEN rms_ttl ELSE 0 END) > 0 THEN 
        CAST(SUM(CASE WHEN MonthNum = 9 THEN rms_occ ELSE 0 END)*1.0 /
             SUM(CASE WHEN MonthNum = 9 THEN rms_ttl ELSE 0 END) AS DECIMAL(10,4))
    ELSE 0 END AS Sep_OccRate,
    CASE WHEN SUM(CASE WHEN MonthNum = 9 THEN rms_occ ELSE 0 END) > 0 THEN 
        CAST(SUM(CASE WHEN MonthNum = 9 THEN rev_rm ELSE 0 END)*1.0 /
             SUM(CASE WHEN MonthNum = 9 THEN rms_occ ELSE 0 END) AS DECIMAL(10,2))
    ELSE 0 END AS Sep_ADR,
    CASE WHEN SUM(CASE WHEN MonthNum = 9 THEN rms_ttl ELSE 0 END) > 0 THEN 
        CAST(SUM(CASE WHEN MonthNum = 9 THEN rev_rm ELSE 0 END)*1.0 /
             SUM(CASE WHEN MonthNum = 9 THEN rms_ttl ELSE 0 END) AS DECIMAL(10,2))
    ELSE 0 END AS Sep_RevPAR,

    /* -------------------- 10 月 -------------------- */
    SUM(CASE WHEN MonthNum = 10 THEN rev_rm + rev_fb + rev_ot ELSE 0 END) AS Oct_Total,
    SUM(CASE WHEN MonthNum = 10 THEN rev_rm ELSE 0 END) AS Oct_Room,
    SUM(CASE WHEN MonthNum = 10 THEN rev_fb ELSE 0 END) AS Oct_FB,
    SUM(CASE WHEN MonthNum = 10 THEN rev_ot ELSE 0 END) AS Oct_Others,
    CASE WHEN SUM(CASE WHEN MonthNum = 10 THEN rms_ttl ELSE 0 END) > 0 THEN 
        CAST(SUM(CASE WHEN MonthNum = 10 THEN rms_occ ELSE 0 END)*1.0 /
             SUM(CASE WHEN MonthNum = 10 THEN rms_ttl ELSE 0 END) AS DECIMAL(10,4))
    ELSE 0 END AS Oct_OccRate,
    CASE WHEN SUM(CASE WHEN MonthNum = 10 THEN rms_occ ELSE 0 END) > 0 THEN 
        CAST(SUM(CASE WHEN MonthNum = 10 THEN rev_rm ELSE 0 END)*1.0 /
             SUM(CASE WHEN MonthNum = 10 THEN rms_occ ELSE 0 END) AS DECIMAL(10,2))
    ELSE 0 END AS Oct_ADR,
    CASE WHEN SUM(CASE WHEN MonthNum = 10 THEN rms_ttl ELSE 0 END) > 0 THEN 
        CAST(SUM(CASE WHEN MonthNum = 10 THEN rev_rm ELSE 0 END)*1.0 /
             SUM(CASE WHEN MonthNum = 10 THEN rms_ttl ELSE 0 END) AS DECIMAL(10,2))
    ELSE 0 END AS Oct_RevPAR,

    /* -------------------- 11 月 -------------------- */
    SUM(CASE WHEN MonthNum = 11 THEN rev_rm + rev_fb + rev_ot ELSE 0 END) AS Nov_Total,
    SUM(CASE WHEN MonthNum = 11 THEN rev_rm ELSE 0 END) AS Nov_Room,
    SUM(CASE WHEN MonthNum = 11 THEN rev_fb ELSE 0 END) AS Nov_FB,
    SUM(CASE WHEN MonthNum = 11 THEN rev_ot ELSE 0 END) AS Nov_Others,
    CASE WHEN SUM(CASE WHEN MonthNum = 11 THEN rms_ttl ELSE 0 END) > 0 THEN 
        CAST(SUM(CASE WHEN MonthNum = 11 THEN rms_occ ELSE 0 END)*1.0 /
             SUM(CASE WHEN MonthNum = 11 THEN rms_ttl ELSE 0 END) AS DECIMAL(10,4))
    ELSE 0 END AS Nov_OccRate,
    CASE WHEN SUM(CASE WHEN MonthNum = 11 THEN rms_occ ELSE 0 END) > 0 THEN 
        CAST(SUM(CASE WHEN MonthNum = 11 THEN rev_rm ELSE 0 END)*1.0 /
             SUM(CASE WHEN MonthNum = 11 THEN rms_occ ELSE 0 END) AS DECIMAL(10,2))
    ELSE 0 END AS Nov_ADR,
    CASE WHEN SUM(CASE WHEN MonthNum = 11 THEN rms_ttl ELSE 0 END) > 0 THEN 
        CAST(SUM(CASE WHEN MonthNum = 11 THEN rev_rm ELSE 0 END)*1.0 /
             SUM(CASE WHEN MonthNum = 11 THEN rms_ttl ELSE 0 END) AS DECIMAL(10,2))
    ELSE 0 END AS Nov_RevPAR,

    /* -------------------- 12 月 -------------------- */
    SUM(CASE WHEN MonthNum = 12 THEN rev_rm + rev_fb + rev_ot ELSE 0 END) AS Dec_Total,
    SUM(CASE WHEN MonthNum = 12 THEN rev_rm ELSE 0 END) AS Dec_Room,
    SUM(CASE WHEN MonthNum = 12 THEN rev_fb ELSE 0 END) AS Dec_FB,
    SUM(CASE WHEN MonthNum = 12 THEN rev_ot ELSE 0 END) AS Dec_Others,
    CASE WHEN SUM(CASE WHEN MonthNum = 12 THEN rms_ttl ELSE 0 END) > 0 THEN 
        CAST(SUM(CASE WHEN MonthNum = 12 THEN rms_occ ELSE 0 END)*1.0 /
             SUM(CASE WHEN MonthNum = 12 THEN rms_ttl ELSE 0 END) AS DECIMAL(10,4))
    ELSE 0 END AS Dec_OccRate,
    CASE WHEN SUM(CASE WHEN MonthNum = 12 THEN rms_occ ELSE 0 END) > 0 THEN 
        CAST(SUM(CASE WHEN MonthNum = 12 THEN rev_rm ELSE 0 END)*1.0 /
             SUM(CASE WHEN MonthNum = 12 THEN rms_occ ELSE 0 END) AS DECIMAL(10,2))
    ELSE 0 END AS Dec_ADR,
    CASE WHEN SUM(CASE WHEN MonthNum = 12 THEN rms_ttl ELSE 0 END) > 0 THEN 
        CAST(SUM(CASE WHEN MonthNum = 12 THEN rev_rm ELSE 0 END)*1.0 /
             SUM(CASE WHEN MonthNum = 12 THEN rms_ttl ELSE 0 END) AS DECIMAL(10,2))
    ELSE 0 END AS Dec_RevPAR,

    /* -------------------- 全年合计 -------------------- */
    SUM(rev_rm + rev_fb + rev_ot) AS Year_Total,
    SUM(rev_rm) AS Year_Room,
    SUM(rev_fb) AS Year_FB,
    SUM(rev_ot) AS Year_Others,

    CASE WHEN SUM(rms_ttl) > 0 THEN 
        CAST(SUM(rms_occ)*1.0 / SUM(rms_ttl) AS DECIMAL(10,4))
    ELSE 0 END AS Year_OccRate,

    CASE WHEN SUM(rms_occ) > 0 THEN 
        CAST(SUM(rev_rm)*1.0 / SUM(rms_occ) AS DECIMAL(10,2))
    ELSE 0 END AS Year_ADR,

    CASE WHEN SUM(rms_ttl) > 0 THEN 
        CAST(SUM(rev_rm)*1.0 / SUM(rms_ttl) AS DECIMAL(10,2))
    ELSE 0 END AS Year_RevPAR

FROM MonthlyData
GROUP BY 
    HotelName,
    GroupCode,
    PMSType,
    PropertyType,
    MDMCity;
    `;

    console.log('[经营数据自然月报] 查询SQL:', sql);

    // 初始化数据库连接
    let currentPool;
    try {
      getPool();
      currentPool = getPool();
    } catch {
      await initDatabase();
      currentPool = getPool();
    }

    // 执行主查询
    let results: any[] = [];
    try {
      const request = currentPool.request();
      const startTime = Date.now();
      const result = await request.query(sql);
      const endTime = Date.now();
      console.log(`✅ [经营数据自然月报] SQL 执行成功，耗时: ${endTime - startTime}ms，返回 ${result.recordset.length} 条记录`);
      results = result.recordset;
    } catch (error) {
      console.error('❌ [经营数据自然月报] SQL 执行失败:', error);
      console.error('🔍 [Failed SQL]', sql);
      return NextResponse.json({
        success: false,
        data: null,
        error: error instanceof Error ? error.message : '查询失败',
        message: '查询失败',
      });
    }

    // 计算汇总行（所有符合查询条件的酒店，不分页范围）
    let totalRow: any | null = null;
    if (results.length > 0) {
      totalRow = {};
      const sample = results[0];
      for (const key of Object.keys(sample)) {
        const value = sample[key];
        if (typeof value === 'number') {
          // 对于率类字段（xxOccRate、xxADR、xxRevPAR），不做简单求和，统一置空，避免误导
          if (key.endsWith('OccRate') || key.endsWith('ADR') || key.endsWith('RevPAR')) {
            totalRow[key] = null;
          } else {
            let sum = 0;
            for (const row of results) {
              const v = row[key];
              if (typeof v === 'number' && !isNaN(v)) {
                sum += v;
              }
            }
            // 保留一定精度，方便前端格式化
            totalRow[key] = Number(sum.toFixed(4));
          }
        } else {
          // 文本字段按“合计”或空处理
          if (key === 'HotelName') {
            totalRow[key] = '合计';
          } else if (key === 'GroupCode') {
            totalRow[key] = '合计';
          } else if (key === 'PMSType') {
            totalRow[key] = '合计';
          } else if (key === 'PropertyType') {
            totalRow[key] = '合计';
          } else if (key === 'MDMCity') {
            totalRow[key] = '合计';
          } else {
            totalRow[key] = '';
          }
        }
      }
      totalRow.__type = 'total';
    }

    // 合并汇总行和数据行
    const allRows = totalRow ? [totalRow, ...results] : results;
    const total = allRows.length;

    // 分页（汇总行计入总条数，出现在第一页的第一行）
    const startIndex = (page - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, total);
    const items = allRows.slice(startIndex, endIndex);

    const responseData = {
      message: '经营数据自然月报数据',
      params,
      timestamp: new Date().toISOString(),
      total,
      items,
    };

    return NextResponse.json({
      success: true,
      data: responseData,
      message: '查询成功',
    });
  } catch (error) {
    console.error('[经营数据自然月报] 查询失败:', error);
    return NextResponse.json({
      success: false,
      data: null,
      error: error instanceof Error ? error.message : '查询失败',
      message: '查询失败',
    });
  }
}


