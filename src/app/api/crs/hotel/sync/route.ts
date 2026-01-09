import { NextRequest, NextResponse } from 'next/server';
import { getPool as get38Pool, initDatabase as init38Database } from '@/lib/38/database';
import { getPool as getCRSPool, initDatabase as initCRSDatabase, executeQuery } from '@/lib/crs/database';
import { TABLE_NAMES } from '@/lib/38/config';

// 转换函数：将38数据库的字段转换为CRS数据库的字段
function convertHotelData(source: any): any {
  return {
    hotel_code: source.HotelCode || source.hotel_code,
    hotel_name: source.HotelName || source.hotel_name,
    hotel_en_name: source.HotelENName || source.hotel_en_name || null,
    hotel_lang_name: source.HotelLangName || source.hotel_lang_name || null,
    hotel_type: source.HotelType || source.hotel_type || null,
    hotel_star: source.HotelStar ? parseInt(source.HotelStar) : null,
    group_code: source.GroupCode || source.group_code || null,
    hotel_address: source.HotelAddress || source.hotel_address || null,
    short_hotel_address: source.ShortHotelAddress || source.short_hotel_address || null,
    hotel_en_address: source.HotelEnAddress || source.hotel_en_address || null,
    post_code: source.PostCode || source.post_code || null,
    mobile_phone: source.MobilePhone || source.mobile_phone || null,
    phone: source.Phone || source.phone || null,
    email: source.Email || source.email || null,
    fax: source.Fax || source.fax || null,
    land_mark: source.LandMark || source.land_mark || null,
    catering: source.Catering ? (source.Catering === '1' || source.Catering === true || source.Catering === 'true') : null,
    banquet: source.Banquet ? (source.Banquet === '1' || source.Banquet === true || source.Banquet === 'true') : null,
    prompt: source.Prompt || source.prompt || null,
    hotel_features: source.HotelFeatures || source.hotel_features || null,
    business_area: source.BusinessArea || source.business_area || null,
    hotel_area: source.HotelArea ? parseFloat(source.HotelArea) : null,
    meeting_room_area: source.MeetingRoomArea ? parseFloat(source.MeetingRoomArea) : null,
    the_banquet_area: source.TheBanquetArea ? parseFloat(source.TheBanquetArea) : null,
    all_room_nums: source.AllRoomNums ? parseInt(source.AllRoomNums) : null,
    use_money: source.UseMoney ? parseFloat(source.UseMoney) : null,
    status: source.Status !== undefined ? String(source.Status) : null,
    nearby_hotel: source.NearbyHotel || source.nearby_hotel || null,
    hotel_keyword: source.HotelKeyword || source.hotel_keyword || null,
    describe: source.Describe || source.describe || null,
    remarks: source.Remarks || source.remarks || null,
    create_date: source.CreateDate ? new Date(source.CreateDate) : null,
    sort: source.Sort ? parseInt(source.Sort) : null,
    is_delete: source.IsDelete === 1 || source.IsDelete === true || source.is_delete === true,
    open_date: source.OpenDate ? new Date(source.OpenDate) : null,
    pms_type: source.PMSType || source.pms_type || null,
    restaurant_resv_email: source.RestaurantResvEmail || source.restaurant_resv_email || null,
    banquet_resv_email: source.BanquetResvEmail || source.banquet_resv_email || null,
    resv_class: source.ResvClass || source.resv_class || null,
    contract_no: source.ContractNo || source.contract_no || null,
    display_status: source.DisplayStatus !== undefined ? String(source.DisplayStatus) : null,
    admin_code: source.AdminCode || source.admin_code || null,
    presale_date: source.PresaleDate ? new Date(source.PresaleDate) : null,
    opening_date: source.OpeningDate ? new Date(source.OpeningDate) : null,
    over_book_status: source.OverBookStatus !== undefined ? String(source.OverBookStatus) : null,
    sales_id: source.SalesId || source.sales_id || null,
    rate_code_switch: source.RateCodeSwitch ? (source.RateCodeSwitch === '1' || source.RateCodeSwitch === true || source.RateCodeSwitch === 'true') : null,
    room_type_switch: source.RoomTypeSwitch ? (source.RoomTypeSwitch === '1' || source.RoomTypeSwitch === true || source.RoomTypeSwitch === 'true') : null,
    best_price_exclusion: source.BestPriceExclusion === true || source.BestPriceExclusion === 1 || source.best_price_exclusion === true,
    area: source.Area || source.area || null,
    urban_area: source.UrbanArea || source.urban_area || null,
    hotel_brand: source.HotelBrand || source.hotel_brand || null,
    hotel_status_start_date: source.HotelStatusStartDate ? new Date(source.HotelStatusStartDate) : null,
    closing_date: source.ClosingDate ? new Date(source.ClosingDate) : null,
    mdm_province: source.MDMProvince || source.mdm_province || null,
    mdm_city: source.MDMCity || source.mdm_city || null,
    hotel_min_price: source.HotelMinPrice ? parseFloat(source.HotelMinPrice) : null,
    default_open_sale: source.DefaultOpenSale === true || source.DefaultOpenSale === 1 || source.default_open_sale === true,
    default_roll_price_stock: source.DefaultRollPriceStock === true || source.DefaultRollPriceStock === 1 || source.default_roll_price_stock === true,
    describe_en: source.DescribeEn || source.describe_en || null,
    guaranteed_price: source.GuaranteedPrice ? parseFloat(source.GuaranteedPrice) : null,
    best_price_voc_channel_mode: source.BestPriceVocChannelMode !== undefined ? String(source.BestPriceVocChannelMode) : null,
    property_type: source.PropertyType || source.property_type || null,
    updated_by: 'sync_from_38',
  };
}

export async function POST(request: NextRequest) {
  console.log('🚀 [CRS Hotel Sync] ========== 同步请求开始 ==========');
  console.log('[CRS Hotel Sync] 请求时间:', new Date().toISOString());
  
  try {
    // 初始化38数据库连接
    console.log('[CRS Hotel Sync] 步骤1: 初始化38数据库连接...');
    let pool38;
    try {
      pool38 = get38Pool();
      console.log('[CRS Hotel Sync] ✅ 38数据库连接池已存在');
    } catch (error) {
      console.log('[CRS Hotel Sync] ⚠️ 38数据库连接池不存在，开始初始化...');
      await init38Database();
      pool38 = get38Pool();
      console.log('[CRS Hotel Sync] ✅ 38数据库连接池初始化成功');
    }

    // 从38数据库查询所有酒店数据
    console.log('[CRS Hotel Sync] 步骤2: 从38数据库查询酒店数据...');
    const query38 = `
      SELECT 
        ID, HotelCode, HotelName, HotelENName, HotelLangName, HotelType, HotelStar,
        GroupCode, HotelAddress, ShortHotelAddress, HotelEnAddress, PostCode,
        MobilePhone, Phone, Email, Fax, LandMark, Catering, Banquet, Prompt,
        HotelFeatures, BusinessArea, HotelArea, MeetingRoomArea, TheBanquetArea,
        AllRoomNums, UseMoney, Status, NearbyHotel, HotelKeyword, Describe, Remarks,
        CreateDate, Sort, IsDelete, OpenDate, PMSType, RestaurantResvEmail,
        BanquetResvEmail, ResvClass, ContractNo, DisplayStatus, AdminCode,
        PresaleDate, OpeningDate, OverBookStatus, SalesId, RateCodeSwitch,
        RoomTypeSwitch, BestPriceExclusion, Area, UrbanArea, HotelBrand,
        HotelStatusStartDate, ClosingDate, MDMProvince, MDMCity, HotelMinPrice,
        DefaultOpenSale, DefaultRollPriceStock, DescribeEn, GuaranteedPrice,
        BestPriceVocChannelMode, PropertyType
      FROM ${TABLE_NAMES.HOTEL_BASE_INFO}
      WHERE IsDelete = 0
      ORDER BY HotelCode
    `;

    let sourceHotels: any[];
    try {
      const request38 = pool38.request();
      const result38 = await request38.query(query38);
      sourceHotels = result38.recordset;
      console.log(`[CRS Hotel Sync] ✅ 从38数据库查询成功，共 ${sourceHotels.length} 条记录`);
    } catch (error) {
      console.error('[CRS Hotel Sync] ❌ 从38数据库查询失败:', error);
      throw error;
    }

    // 初始化CRS数据库连接
    console.log('[CRS Hotel Sync] 步骤3: 初始化CRS数据库连接...');
    try {
      getCRSPool();
      console.log('[CRS Hotel Sync] ✅ CRS数据库连接池已存在');
    } catch (error) {
      console.log('[CRS Hotel Sync] ⚠️ CRS数据库连接池不存在，开始初始化...');
      await initCRSDatabase();
      console.log('[CRS Hotel Sync] ✅ CRS数据库连接池初始化成功');
    }

    // 转换并插入数据到CRS数据库
    console.log('[CRS Hotel Sync] 步骤4: 开始同步数据到CRS数据库...');
    let successCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    for (const sourceHotel of sourceHotels) {
      try {
        const convertedData = convertHotelData(sourceHotel);
        
        // 构建INSERT ... ON CONFLICT语句
        const insertSql = `
          INSERT INTO public.hotel_base_info (
            hotel_code, hotel_name, hotel_en_name, hotel_lang_name, hotel_type, hotel_star,
            group_code, hotel_address, short_hotel_address, hotel_en_address, post_code,
            mobile_phone, phone, email, fax, land_mark, catering, banquet, prompt,
            hotel_features, business_area, hotel_area, meeting_room_area, the_banquet_area,
            all_room_nums, use_money, status, nearby_hotel, hotel_keyword, describe, remarks,
            create_date, sort, is_delete, open_date, pms_type, restaurant_resv_email,
            banquet_resv_email, resv_class, contract_no, display_status, admin_code,
            presale_date, opening_date, over_book_status, sales_id, rate_code_switch,
            room_type_switch, best_price_exclusion, area, urban_area, hotel_brand,
            hotel_status_start_date, closing_date, mdm_province, mdm_city, hotel_min_price,
            default_open_sale, default_roll_price_stock, describe_en, guaranteed_price,
            best_price_voc_channel_mode, property_type, updated_by, updated_at
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
            $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40,
            $41, $42, $43, $44, $45, $46, $47, $48, $49, $50, $51, $52, $53, $54, $55, $56, $57, $58, $59, $60,
            $61, $62, NOW()
          )
          ON CONFLICT (hotel_code) 
          DO UPDATE SET
            hotel_name = EXCLUDED.hotel_name,
            hotel_en_name = EXCLUDED.hotel_en_name,
            hotel_lang_name = EXCLUDED.hotel_lang_name,
            hotel_type = EXCLUDED.hotel_type,
            hotel_star = EXCLUDED.hotel_star,
            group_code = EXCLUDED.group_code,
            hotel_address = EXCLUDED.hotel_address,
            short_hotel_address = EXCLUDED.short_hotel_address,
            hotel_en_address = EXCLUDED.hotel_en_address,
            post_code = EXCLUDED.post_code,
            mobile_phone = EXCLUDED.mobile_phone,
            phone = EXCLUDED.phone,
            email = EXCLUDED.email,
            fax = EXCLUDED.fax,
            land_mark = EXCLUDED.land_mark,
            catering = EXCLUDED.catering,
            banquet = EXCLUDED.banquet,
            prompt = EXCLUDED.prompt,
            hotel_features = EXCLUDED.hotel_features,
            business_area = EXCLUDED.business_area,
            hotel_area = EXCLUDED.hotel_area,
            meeting_room_area = EXCLUDED.meeting_room_area,
            the_banquet_area = EXCLUDED.the_banquet_area,
            all_room_nums = EXCLUDED.all_room_nums,
            use_money = EXCLUDED.use_money,
            status = EXCLUDED.status,
            nearby_hotel = EXCLUDED.nearby_hotel,
            hotel_keyword = EXCLUDED.hotel_keyword,
            describe = EXCLUDED.describe,
            remarks = EXCLUDED.remarks,
            create_date = EXCLUDED.create_date,
            sort = EXCLUDED.sort,
            is_delete = EXCLUDED.is_delete,
            open_date = EXCLUDED.open_date,
            pms_type = EXCLUDED.pms_type,
            restaurant_resv_email = EXCLUDED.restaurant_resv_email,
            banquet_resv_email = EXCLUDED.banquet_resv_email,
            resv_class = EXCLUDED.resv_class,
            contract_no = EXCLUDED.contract_no,
            display_status = EXCLUDED.display_status,
            admin_code = EXCLUDED.admin_code,
            presale_date = EXCLUDED.presale_date,
            opening_date = EXCLUDED.opening_date,
            over_book_status = EXCLUDED.over_book_status,
            sales_id = EXCLUDED.sales_id,
            rate_code_switch = EXCLUDED.rate_code_switch,
            room_type_switch = EXCLUDED.room_type_switch,
            best_price_exclusion = EXCLUDED.best_price_exclusion,
            area = EXCLUDED.area,
            urban_area = EXCLUDED.urban_area,
            hotel_brand = EXCLUDED.hotel_brand,
            hotel_status_start_date = EXCLUDED.hotel_status_start_date,
            closing_date = EXCLUDED.closing_date,
            mdm_province = EXCLUDED.mdm_province,
            mdm_city = EXCLUDED.mdm_city,
            hotel_min_price = EXCLUDED.hotel_min_price,
            default_open_sale = EXCLUDED.default_open_sale,
            default_roll_price_stock = EXCLUDED.default_roll_price_stock,
            describe_en = EXCLUDED.describe_en,
            guaranteed_price = EXCLUDED.guaranteed_price,
            best_price_voc_channel_mode = EXCLUDED.best_price_voc_channel_mode,
            property_type = EXCLUDED.property_type,
            updated_by = EXCLUDED.updated_by,
            updated_at = NOW()
        `;

        const params = [
          convertedData.hotel_code, convertedData.hotel_name, convertedData.hotel_en_name,
          convertedData.hotel_lang_name, convertedData.hotel_type, convertedData.hotel_star,
          convertedData.group_code, convertedData.hotel_address, convertedData.short_hotel_address,
          convertedData.hotel_en_address, convertedData.post_code, convertedData.mobile_phone,
          convertedData.phone, convertedData.email, convertedData.fax, convertedData.land_mark,
          convertedData.catering, convertedData.banquet, convertedData.prompt, convertedData.hotel_features,
          convertedData.business_area, convertedData.hotel_area, convertedData.meeting_room_area,
          convertedData.the_banquet_area, convertedData.all_room_nums, convertedData.use_money,
          convertedData.status, convertedData.nearby_hotel, convertedData.hotel_keyword, convertedData.describe,
          convertedData.remarks, convertedData.create_date, convertedData.sort, convertedData.is_delete,
          convertedData.open_date, convertedData.pms_type, convertedData.restaurant_resv_email,
          convertedData.banquet_resv_email, convertedData.resv_class, convertedData.contract_no,
          convertedData.display_status, convertedData.admin_code, convertedData.presale_date,
          convertedData.opening_date, convertedData.over_book_status, convertedData.sales_id,
          convertedData.rate_code_switch, convertedData.room_type_switch, convertedData.best_price_exclusion,
          convertedData.area, convertedData.urban_area, convertedData.hotel_brand,
          convertedData.hotel_status_start_date, convertedData.closing_date, convertedData.mdm_province,
          convertedData.mdm_city, convertedData.hotel_min_price, convertedData.default_open_sale,
          convertedData.default_roll_price_stock, convertedData.describe_en, convertedData.guaranteed_price,
          convertedData.best_price_voc_channel_mode, convertedData.property_type
        ];

        await executeQuery(insertSql, params);
        successCount++;
      } catch (error: any) {
        errorCount++;
        const errorMsg = `酒店 ${sourceHotel.HotelCode || 'unknown'}: ${error.message}`;
        errors.push(errorMsg);
        console.error(`[CRS Hotel Sync] ❌ 同步失败:`, errorMsg);
      }
    }

    console.log(`[CRS Hotel Sync] ========== 同步完成 ==========`);
    console.log(`[CRS Hotel Sync] 成功: ${successCount} 条，失败: ${errorCount} 条`);

    return NextResponse.json({
      success: true,
      message: '同步完成',
      data: {
        total: sourceHotels.length,
        success: successCount,
        error: errorCount,
        errors: errors.length > 0 ? errors.slice(0, 10) : [], // 只返回前10个错误
      },
    });
  } catch (error: any) {
    console.error('[CRS Hotel Sync] ❌ 同步过程失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || '同步失败',
        data: {
          total: 0,
          success: 0,
          error: 0,
          errors: [],
        },
      },
      { status: 500 }
    );
  }
}

