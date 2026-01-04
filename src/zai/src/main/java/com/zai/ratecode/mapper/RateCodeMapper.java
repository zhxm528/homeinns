package com.zai.ratecode.mapper;

import com.zai.ratecode.entity.RateCode;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface RateCodeMapper {
    List<RateCode> selectByCondition(@Param("hotelId") String hotelId,
                                   @Param("chainId") String chainId,
                                   @Param("rateCode") String rateCode,
                                   @Param("rateCodeName") String rateCodeName);

    /**
     * 根据条件查询价格代码列表（带分页）
     * 
     * @param hotelId 酒店ID
     * @param chainId 连锁ID
     * @param rateCode 价格代码
     * @param rateCodeName 价格代码名称
     * @param page 页码（从0开始）
     * @param size 每页大小
     * @param offset 偏移量
     * @return 价格代码列表
     */
    List<RateCode> selectByConditionWithPaging(@Param("hotelId") String hotelId,
                                              @Param("chainId") String chainId,
                                              @Param("rateCode") String rateCode,
                                              @Param("rateCodeName") String rateCodeName,
                                              @Param("page") int page,
                                              @Param("size") int size,
                                              @Param("offset") int offset);

    /**
     * 根据条件统计价格代码总数
     * 
     * @param hotelId 酒店ID
     * @param chainId 连锁ID
     * @param rateCode 价格代码
     * @param rateCodeName 价格代码名称
     * @return 总数
     */
    int countByCondition(@Param("hotelId") String hotelId,
                        @Param("chainId") String chainId,
                        @Param("rateCode") String rateCode,
                        @Param("rateCodeName") String rateCodeName);

    

    /**
     * 根据价格代码ID查询单个价格代码信息
     *
     * @param rateCodeId 价格代码ID
     * @return 价格代码对象，如果不存在则返回null
     */
    RateCode selectByRateCodeId(@Param("rateCodeId") String rateCodeId);

    int insert(RateCode rateCode);

    int update(RateCode rateCode);

    int deleteByRateCodeId(@Param("rateCodeId") String rateCodeId);

    RateCode selectByChainAndHotel(@Param("chainId") String chainId, @Param("hotelId") String hotelId);

    List<RateCode> selectByChainIdAndHotelIdAndRateCode(@Param("chainId") String chainId, 
                                                 @Param("hotelId") String hotelId, 
                                                 @Param("rateCode") String rateCode);

    /**
     * 根据酒店ID查询价格代码组件列表
     * 
     * @param hotelId 酒店ID
     * @return 价格代码列表
     */
    List<RateCode> selectRateCodeComponent(@Param("hotelId") String hotelId);

    /**
     * 日历查询条件查询价格代码
     * 
     * @param hotelId 酒店ID
     * @return 价格代码列表
     */
    List<RateCode> calendarByConditions(@Param("hotelId") String hotelId);

    /**
     * 日历查询条件查询价格代码
     * 
     * @param hotelId 酒店ID
     * @return 价格代码列表
     */
    List<RateCode> selectCalendarByHotelIdAndRateCode(
        @Param("hotelId") String hotelId, 
        @Param("rateCode") String rateCode);

    /**
     * 根据酒店ID和价格代码查询价格代码
     * 
     * @param hotelId 酒店ID
     * @param rateCode 价格代码
     * @return 价格代码信息
     */
    RateCode bookingSelectByHotelRateCode(
        @Param("hotelId") String hotelId, 
        @Param("rateCode") String rateCode);

    /**
     * 根据价格代码ID查询关联的房型列表
     * 
     * @param rateCodeId 价格代码ID
     * @return 房型列表，包含房型ID、房型代码、房型名称等信息
     */
    List<Map<String, Object>> selectRoomTypesByRateCodeId(@Param("rateCodeId") String rateCodeId);

    /**
     * 根据酒店ID查询price_rule_type=1的价格代码列表
     * 
     * @param hotelId 酒店ID
     * @return 价格代码列表
     */
    List<RateCode> selectRateCodesByHotelIdAndPriceRuleType(@Param("hotelId") String hotelId);

    /**
     * 根据酒店ID和价格代码ID查询price_rule_type=1的价格代码列表
     * 
     * @param hotelId 酒店ID
     * @param rateCodeId 价格代码ID（可选）
     * @return 价格代码列表
     */
    List<RateCode> selectRateCodesByHotelIdAndPriceRuleType(@Param("hotelId") String hotelId, @Param("rateCodeId") String rateCodeId);

    /**
     * 根据价格代码ID查询price_rule_type=1的价格代码列表
     * 
     * @param rateCodeId 价格代码ID
     * @return 价格代码列表
     */
    List<RateCode> selectRateCodesByPriceRuleType(@Param("rateCodeId") String rateCodeId);

    /**
     * 根据酒店ID和价格代码ID查询price_rule_type=2的价格代码列表
     * 
     * @param hotelId 酒店ID
     * @param rateCodeId 价格代码ID（用于排除当前价格代码）
     * @return 价格代码列表
     */
    List<RateCode> selectRateCodesByHotelIdAndPriceRuleType2(@Param("hotelId") String hotelId, @Param("rateCodeId") String rateCodeId);

    /**
     * 保存价格设置
     * 
     * @param request 价格设置保存请求
     * @return 影响的行数
     */
    int savePriceSettings(@Param("request") Object request);
    
    /**
     * 插入价格记录到rate_prices表
     */
    int insertRatePrice(@Param("priceData") Map<String, Object> priceData);
    
    /**
     * 批量插入价格记录
     */
    int insertRatePricesBatch(@Param("priceDataList") List<Map<String, Object>> priceDataList);
    
    /**
     * 根据日期范围删除价格记录
     */
    int deleteRatePricesByDateRange(@Param("deleteParams") Map<String, Object> deleteParams);
} 