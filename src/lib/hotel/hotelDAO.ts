import { executeQuery, executeProcedure } from './database';
import { TABLE_NAMES, HotelBaseInfo } from './config';

// 酒店数据访问对象
export class HotelDAO {
  
  // 获取所有酒店列表
  static async getAllHotels(): Promise<HotelBaseInfo[]> {
    console.log('🏨 [HotelDAO] 开始获取所有酒店列表');
    const query = `
      SELECT 
        ID,
        HotelCode,
        HotelName,
        HotelENName,
        HotelLangName,
        HotelType,
        HotelStar,
        GroupCode,
        HotelAddress,
        ShortHotelAddress,
        HotelEnAddress,
        PostCode,
        MobilePhone,
        Phone,
        Email,
        Fax,
        LandMark,
        Catering,
        Banquet,
        Prompt,
        HotelFeatures,
        BusinessArea,
        HotelArea,
        MeetingRoomArea,
        TheBanquetArea,
        AllRoomNums,
        UseMoney,
        Status,
        NearbyHotel,
        HotelKeyword,
        Describe,
        Remarks,
        CreateDate,
        Sort,
        IsDelete,
        OpenDate,
        PMSType,
        RestaurantResvEmail,
        BanquetResvEmail,
        ResvClass,
        ContractNo,
        DisplayStatus,
        AdminCode,
        PresaleDate,
        OpeningDate,
        OverBookStatus,
        SalesId,
        RateCodeSwitch,
        RoomTypeSwitch,
        BestPriceExclusion,
        Area,
        UrbanArea,
        HotelBrand,
        HotelStatusStartDate,
        ClosingDate,
        MDMProvince,
        MDMCity,
        HotelMinPrice,
        DefaultOpenSale,
        DefaultRollPriceStock,
        DescribeEn,
        GuaranteedPrice,
        BestPriceVocChannelMode,
        PropertyType
      FROM ${TABLE_NAMES.HOTEL_BASE_INFO}
      WHERE Status = 1 AND IsDelete = 0
      ORDER BY GroupCode ASC, HotelCode ASC
    `;
    
    const result = await executeQuery<HotelBaseInfo>(query);
    console.log(`🏨 [HotelDAO] 获取所有酒店列表完成，共 ${result.length} 条记录`);
    return result;
  }

  // 根据ID获取酒店信息
  static async getHotelById(id: number): Promise<HotelBaseInfo | null> {
    console.log(`🏨 [HotelDAO] 开始根据ID获取酒店信息，ID: ${id}`);
    const query = `
      SELECT 
        ID,
        HotelCode,
        HotelName,
        HotelENName,
        HotelLangName,
        HotelType,
        HotelStar,
        GroupCode,
        HotelAddress,
        ShortHotelAddress,
        HotelEnAddress,
        PostCode,
        MobilePhone,
        Phone,
        Email,
        Fax,
        LandMark,
        Catering,
        Banquet,
        Prompt,
        HotelFeatures,
        BusinessArea,
        HotelArea,
        MeetingRoomArea,
        TheBanquetArea,
        AllRoomNums,
        UseMoney,
        Status,
        NearbyHotel,
        HotelKeyword,
        Describe,
        Remarks,
        CreateDate,
        Sort,
        IsDelete,
        OpenDate,
        PMSType,
        RestaurantResvEmail,
        BanquetResvEmail,
        ResvClass,
        ContractNo,
        DisplayStatus,
        AdminCode,
        PresaleDate,
        OpeningDate,
        OverBookStatus,
        SalesId,
        RateCodeSwitch,
        RoomTypeSwitch,
        BestPriceExclusion,
        Area,
        UrbanArea,
        HotelBrand,
        HotelStatusStartDate,
        ClosingDate,
        MDMProvince,
        MDMCity,
        HotelMinPrice,
        DefaultOpenSale,
        DefaultRollPriceStock,
        DescribeEn,
        GuaranteedPrice,
        BestPriceVocChannelMode,
        PropertyType
      FROM ${TABLE_NAMES.HOTEL_BASE_INFO}
      WHERE ID = @id AND Status = 1 AND IsDelete = 0
    `;
    
    const result = await executeQuery<HotelBaseInfo>(query, [id]);
    const hotel = result.length > 0 ? result[0] : null;
    console.log(`🏨 [HotelDAO] 根据ID获取酒店信息完成，${hotel ? '找到酒店' : '未找到酒店'}`);
    return hotel;
  }

  // 根据城市搜索酒店
  static async getHotelsByCity(city: string): Promise<HotelBaseInfo[]> {
    console.log(`🏨 [HotelDAO] 开始根据城市搜索酒店，城市: ${city}`);
    const query = `
      SELECT 
        ID,
        HotelCode,
        HotelName,
        HotelENName,
        HotelLangName,
        HotelType,
        HotelStar,
        GroupCode,
        HotelAddress,
        ShortHotelAddress,
        HotelEnAddress,
        PostCode,
        MobilePhone,
        Phone,
        Email,
        Fax,
        LandMark,
        Catering,
        Banquet,
        Prompt,
        HotelFeatures,
        BusinessArea,
        HotelArea,
        MeetingRoomArea,
        TheBanquetArea,
        AllRoomNums,
        UseMoney,
        Status,
        NearbyHotel,
        HotelKeyword,
        Describe,
        Remarks,
        CreateDate,
        Sort,
        IsDelete,
        OpenDate,
        PMSType,
        RestaurantResvEmail,
        BanquetResvEmail,
        ResvClass,
        ContractNo,
        DisplayStatus,
        AdminCode,
        PresaleDate,
        OpeningDate,
        OverBookStatus,
        SalesId,
        RateCodeSwitch,
        RoomTypeSwitch,
        BestPriceExclusion,
        Area,
        UrbanArea,
        HotelBrand,
        HotelStatusStartDate,
        ClosingDate,
        MDMProvince,
        MDMCity,
        HotelMinPrice,
        DefaultOpenSale,
        DefaultRollPriceStock,
        DescribeEn,
        GuaranteedPrice,
        BestPriceVocChannelMode,
        PropertyType
      FROM ${TABLE_NAMES.HOTEL_BASE_INFO}
      WHERE (MDMCity LIKE @city OR Area LIKE @city OR UrbanArea LIKE @city) 
        AND Status = 1 AND IsDelete = 0
      ORDER BY GroupCode ASC, HotelCode ASC
    `;
    
    const result = await executeQuery<HotelBaseInfo>(query, [`%${city}%`]);
    console.log(`🏨 [HotelDAO] 根据城市搜索酒店完成，找到 ${result.length} 条记录`);
    return result;
  }

  // 根据酒店名称搜索
  static async searchHotelsByName(name: string): Promise<HotelBaseInfo[]> {
    console.log(`🏨 [HotelDAO] 开始根据酒店名称搜索，名称: ${name}`);
    const query = `
      SELECT 
        ID,
        HotelCode,
        HotelName,
        HotelENName,
        HotelLangName,
        HotelType,
        HotelStar,
        GroupCode,
        HotelAddress,
        ShortHotelAddress,
        HotelEnAddress,
        PostCode,
        MobilePhone,
        Phone,
        Email,
        Fax,
        LandMark,
        Catering,
        Banquet,
        Prompt,
        HotelFeatures,
        BusinessArea,
        HotelArea,
        MeetingRoomArea,
        TheBanquetArea,
        AllRoomNums,
        UseMoney,
        Status,
        NearbyHotel,
        HotelKeyword,
        Describe,
        Remarks,
        CreateDate,
        Sort,
        IsDelete,
        OpenDate,
        PMSType,
        RestaurantResvEmail,
        BanquetResvEmail,
        ResvClass,
        ContractNo,
        DisplayStatus,
        AdminCode,
        PresaleDate,
        OpeningDate,
        OverBookStatus,
        SalesId,
        RateCodeSwitch,
        RoomTypeSwitch,
        BestPriceExclusion,
        Area,
        UrbanArea,
        HotelBrand,
        HotelStatusStartDate,
        ClosingDate,
        MDMProvince,
        MDMCity,
        HotelMinPrice,
        DefaultOpenSale,
        DefaultRollPriceStock,
        DescribeEn,
        GuaranteedPrice,
        BestPriceVocChannelMode,
        PropertyType
      FROM ${TABLE_NAMES.HOTEL_BASE_INFO}
      WHERE (HotelName LIKE @name OR HotelENName LIKE @name OR HotelLangName LIKE @name) 
        AND Status = 1 AND IsDelete = 0
      ORDER BY GroupCode ASC, HotelCode ASC
    `;
    
    const result = await executeQuery<HotelBaseInfo>(query, [`%${name}%`]);
    console.log(`🏨 [HotelDAO] 根据酒店名称搜索完成，找到 ${result.length} 条记录`);
    return result;
  }

  // 根据星级筛选酒店
  static async getHotelsByStarLevel(starLevel: string): Promise<HotelBaseInfo[]> {
    console.log(`🏨 [HotelDAO] 开始根据星级筛选酒店，星级: ${starLevel}`);
    const query = `
      SELECT 
        ID,
        HotelCode,
        HotelName,
        HotelENName,
        HotelLangName,
        HotelType,
        HotelStar,
        GroupCode,
        HotelAddress,
        ShortHotelAddress,
        HotelEnAddress,
        PostCode,
        MobilePhone,
        Phone,
        Email,
        Fax,
        LandMark,
        Catering,
        Banquet,
        Prompt,
        HotelFeatures,
        BusinessArea,
        HotelArea,
        MeetingRoomArea,
        TheBanquetArea,
        AllRoomNums,
        UseMoney,
        Status,
        NearbyHotel,
        HotelKeyword,
        Describe,
        Remarks,
        CreateDate,
        Sort,
        IsDelete,
        OpenDate,
        PMSType,
        RestaurantResvEmail,
        BanquetResvEmail,
        ResvClass,
        ContractNo,
        DisplayStatus,
        AdminCode,
        PresaleDate,
        OpeningDate,
        OverBookStatus,
        SalesId,
        RateCodeSwitch,
        RoomTypeSwitch,
        BestPriceExclusion,
        Area,
        UrbanArea,
        HotelBrand,
        HotelStatusStartDate,
        ClosingDate,
        MDMProvince,
        MDMCity,
        HotelMinPrice,
        DefaultOpenSale,
        DefaultRollPriceStock,
        DescribeEn,
        GuaranteedPrice,
        BestPriceVocChannelMode,
        PropertyType
      FROM ${TABLE_NAMES.HOTEL_BASE_INFO}
      WHERE HotelStar = @starLevel AND Status = 1 AND IsDelete = 0
      ORDER BY GroupCode ASC, HotelCode ASC
    `;
    
    const result = await executeQuery<HotelBaseInfo>(query, [starLevel]);
    console.log(`🏨 [HotelDAO] 根据星级筛选酒店完成，找到 ${result.length} 条记录`);
    return result;
  }

  // 分页获取酒店列表
  static async getHotelsWithPagination(
    page: number = 1, 
    pageSize: number = 10,
    city?: string,
    starLevel?: string
  ): Promise<{ hotels: HotelBaseInfo[], total: number }> {
    
    console.log(`🏨 [HotelDAO] 开始分页获取酒店列表，页码: ${page}, 页大小: ${pageSize}, 城市: ${city || '全部'}, 星级: ${starLevel || '全部'}`);
    
    let whereClause = 'WHERE Status = 1 AND IsDelete = 0';
    const params: any[] = [];
    let paramIndex = 0;

    if (city) {
      whereClause += ` AND (MDMCity LIKE @param${paramIndex} OR Area LIKE @param${paramIndex} OR UrbanArea LIKE @param${paramIndex})`;
      params.push(`%${city}%`);
      paramIndex++;
    }

    if (starLevel) {
      whereClause += ` AND HotelStar = @param${paramIndex}`;
      params.push(starLevel);
      paramIndex++;
    }

    // 获取总数
    const countQuery = `
      SELECT COUNT(*) as total
      FROM ${TABLE_NAMES.HOTEL_BASE_INFO}
      ${whereClause}
    `;
    
    const countResult = await executeQuery<{ total: number }>(countQuery, params);
    const total = countResult[0]?.total || 0;

    // 获取分页数据
    const offset = (page - 1) * pageSize;
    const dataQuery = `
      SELECT 
        ID,
        HotelCode,
        HotelName,
        HotelENName,
        HotelLangName,
        HotelType,
        HotelStar,
        GroupCode,
        HotelAddress,
        ShortHotelAddress,
        HotelEnAddress,
        PostCode,
        MobilePhone,
        Phone,
        Email,
        Fax,
        LandMark,
        Catering,
        Banquet,
        Prompt,
        HotelFeatures,
        BusinessArea,
        HotelArea,
        MeetingRoomArea,
        TheBanquetArea,
        AllRoomNums,
        UseMoney,
        Status,
        NearbyHotel,
        HotelKeyword,
        Describe,
        Remarks,
        CreateDate,
        Sort,
        IsDelete,
        OpenDate,
        PMSType,
        RestaurantResvEmail,
        BanquetResvEmail,
        ResvClass,
        ContractNo,
        DisplayStatus,
        AdminCode,
        PresaleDate,
        OpeningDate,
        OverBookStatus,
        SalesId,
        RateCodeSwitch,
        RoomTypeSwitch,
        BestPriceExclusion,
        Area,
        UrbanArea,
        HotelBrand,
        HotelStatusStartDate,
        ClosingDate,
        MDMProvince,
        MDMCity,
        HotelMinPrice,
        DefaultOpenSale,
        DefaultRollPriceStock,
        DescribeEn,
        GuaranteedPrice,
        BestPriceVocChannelMode,
        PropertyType
      FROM ${TABLE_NAMES.HOTEL_BASE_INFO}
      ${whereClause}
      ORDER BY GroupCode ASC, HotelCode ASC
      OFFSET ${offset} ROWS
      FETCH NEXT ${pageSize} ROWS ONLY
    `;
    
    const hotels = await executeQuery<HotelBaseInfo>(dataQuery, params);
    
    console.log(`🏨 [HotelDAO] 分页获取酒店列表完成，总数: ${total}, 当前页: ${hotels.length} 条记录`);
    return { hotels, total };
  }

  // 根据条件查询酒店
  static async queryHotels(conditions: {
    hotelCode?: string;
    hotelName?: string;
    groupCodes?: string[];
    hotelTypes?: string[];
    propertyTypes?: string[];
    pmsTypes?: string[];
    status?: number;
    isDelete?: number;
  }): Promise<HotelBaseInfo[]> {
    console.log('🏨 [HotelDAO] 开始根据条件查询酒店', conditions);
    
    let whereClause = 'WHERE 1=1';
    const params: any[] = [];
    let paramIndex = 0;

    // 基础查询条件 - GroupCode IN ('JG','JL','NY','NH','NI','KP')
    if (conditions.groupCodes && conditions.groupCodes.length > 0) {
      const placeholders = conditions.groupCodes.map(() => `@param${paramIndex++}`).join(',');
      whereClause += ` AND GroupCode IN (${placeholders})`;
      params.push(...conditions.groupCodes);
    }

    // 酒店编码模糊查询
    if (conditions.hotelCode) {
      whereClause += ` AND HotelCode LIKE @param${paramIndex}`;
      params.push(`%${conditions.hotelCode}%`);
      paramIndex++;
    }

    // 酒店名称模糊查询
    if (conditions.hotelName) {
      whereClause += ` AND HotelName LIKE @param${paramIndex}`;
      params.push(`%${conditions.hotelName}%`);
      paramIndex++;
    }

    // 酒店类型多选
    if (conditions.hotelTypes && conditions.hotelTypes.length > 0) {
      const placeholders = conditions.hotelTypes.map(() => `@param${paramIndex++}`).join(',');
      whereClause += ` AND HotelType IN (${placeholders})`;
      params.push(...conditions.hotelTypes);
    }

    // 物业类型多选
    if (conditions.propertyTypes && conditions.propertyTypes.length > 0) {
      const placeholders = conditions.propertyTypes.map(() => `@param${paramIndex++}`).join(',');
      whereClause += ` AND PropertyType IN (${placeholders})`;
      params.push(...conditions.propertyTypes);
    }

    // PMS类型多选
    if (conditions.pmsTypes && conditions.pmsTypes.length > 0) {
      const placeholders = conditions.pmsTypes.map(() => `@param${paramIndex++}`).join(',');
      whereClause += ` AND PMSType IN (${placeholders})`;
      params.push(...conditions.pmsTypes);
    }

    // 状态筛选
    if (conditions.status !== undefined) {
      whereClause += ` AND Status = @param${paramIndex}`;
      params.push(conditions.status);
      paramIndex++;
    }

    // 删除状态筛选
    if (conditions.isDelete !== undefined) {
      whereClause += ` AND IsDelete = @param${paramIndex}`;
      params.push(conditions.isDelete);
      paramIndex++;
    }

    const query = `
      SELECT 
        ID,
        HotelCode,
        HotelName,
        HotelENName,
        HotelLangName,
        HotelType,
        HotelStar,
        GroupCode,
        HotelAddress,
        ShortHotelAddress,
        HotelEnAddress,
        PostCode,
        MobilePhone,
        Phone,
        Email,
        Fax,
        LandMark,
        Catering,
        Banquet,
        Prompt,
        HotelFeatures,
        BusinessArea,
        HotelArea,
        MeetingRoomArea,
        TheBanquetArea,
        AllRoomNums,
        UseMoney,
        Status,
        NearbyHotel,
        HotelKeyword,
        Describe,
        Remarks,
        CreateDate,
        Sort,
        IsDelete,
        OpenDate,
        PMSType,
        RestaurantResvEmail,
        BanquetResvEmail,
        ResvClass,
        ContractNo,
        DisplayStatus,
        AdminCode,
        PresaleDate,
        OpeningDate,
        OverBookStatus,
        SalesId,
        RateCodeSwitch,
        RoomTypeSwitch,
        BestPriceExclusion,
        Area,
        UrbanArea,
        HotelBrand,
        HotelStatusStartDate,
        ClosingDate,
        MDMProvince,
        MDMCity,
        HotelMinPrice,
        DefaultOpenSale,
        DefaultRollPriceStock,
        DescribeEn,
        GuaranteedPrice,
        BestPriceVocChannelMode,
        PropertyType
      FROM ${TABLE_NAMES.HOTEL_BASE_INFO}
      ${whereClause}
      ORDER BY GroupCode ASC, HotelCode ASC
    `;
    
    const result = await executeQuery<HotelBaseInfo>(query, params);
    console.log(`🏨 [HotelDAO] 根据条件查询酒店完成，找到 ${result.length} 条记录`);
    return result;
  }

  // 获取酒店统计信息
  static async getHotelStatistics(): Promise<{
    totalHotels: number;
    hotelsByCity: Array<{ city: string; count: number }>;
    hotelsByStarLevel: Array<{ starLevel: string; count: number }>;
  }> {
    console.log('🏨 [HotelDAO] 开始获取酒店统计信息');
    
    // 总酒店数
    const totalQuery = `
      SELECT COUNT(*) as totalHotels
      FROM ${TABLE_NAMES.HOTEL_BASE_INFO}
      WHERE Status = 1 AND IsDelete = 0
    `;
    
    // 按城市统计
    const cityQuery = `
      SELECT MDMCity as city, COUNT(*) as count
      FROM ${TABLE_NAMES.HOTEL_BASE_INFO}
      WHERE Status = 1 AND IsDelete = 0 AND MDMCity IS NOT NULL
      GROUP BY MDMCity
      ORDER BY count DESC
    `;
    
    // 按星级统计
    const starQuery = `
      SELECT HotelStar as starLevel, COUNT(*) as count
      FROM ${TABLE_NAMES.HOTEL_BASE_INFO}
      WHERE Status = 1 AND IsDelete = 0 AND HotelStar IS NOT NULL
      GROUP BY HotelStar
      ORDER BY HotelStar DESC
    `;
    
    const [totalResult, cityResult, starResult] = await Promise.all([
      executeQuery<{ totalHotels: number }>(totalQuery),
      executeQuery<{ city: string; count: number }>(cityQuery),
      executeQuery<{ starLevel: string; count: number }>(starQuery)
    ]);
    
    const result = {
      totalHotels: totalResult[0]?.totalHotels || 0,
      hotelsByCity: cityResult,
      hotelsByStarLevel: starResult
    };
    
    console.log(`🏨 [HotelDAO] 获取酒店统计信息完成，总酒店数: ${result.totalHotels}, 城市数: ${result.hotelsByCity.length}, 星级数: ${result.hotelsByStarLevel.length}`);
    return result;
  }
}
