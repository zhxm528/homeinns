package com.zai.rateplan.mapper;

import com.zai.rateplan.entity.RatePlan;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

@Mapper
public interface RatePlanMapper {
    List<RatePlan> selectByChainAndHotel(@Param("chainId") String chainId,
                                         @Param("hotelId") String hotelId);

    List<RatePlan> selectByChainAndHotelAndRateCode(
        @Param("chainId") String chainId, 
        @Param("hotelId") String hotelId, 
        @Param("rateCodeId") String rateCodeId
    );

    int insert(RatePlan ratePlan);

    int deleteByRatePlanId(@Param("ratePlanId") String ratePlanId);

    // 根据chainId,hotelId,roomTypeId,rateCodeId删除套餐记录
    int deleteByUnique(@Param("chainId") String chainId,
                       @Param("hotelId") String hotelId,
                       @Param("roomTypeId") String roomTypeId,
                       @Param("rateCodeId") String rateCodeId);

    /**
     * 通过酒店ID查询所有价格方案
     * 
     * @param hotelId 酒店ID
     * @return 价格方案列表
     */
    List<RatePlan> selectByHotelId(@Param("hotelId") String hotelId);

    /**
     * 根据连锁ID和酒店ID批量删除价格方案
     * 
     * @param chainId 连锁ID
     * @param hotelId 酒店ID
     * @return 删除的记录数
     */
    int deleteByChainAndHotel(@Param("chainId") String chainId,
                             @Param("hotelId") String hotelId,
                             @Param("rateCodeId") String rateCodeId);

    /**
     * 根据酒店ID、价格代码ID和房型ID查询价格方案
     * 
     * @param hotelId 酒店ID
     * @param rateCodeId 价格代码ID
     * @param roomTypeId 房型ID
     * @return 价格方案列表
     */
    List<RatePlan> selectByHotelAndRateCodeAndRoomType(
        @Param("hotelId") String hotelId,
        @Param("rateCodeId") String rateCodeId,
        @Param("roomTypeId") String roomTypeId
    );

    /**
     * 日历查询条件查询价格方案
     * 
     * @param hotelId 酒店ID
     * @return 价格方案列表
     */
    List<RatePlan> calendarByConditions(@Param("hotelId") String hotelId);

    /**
     * 日历查询条件查询价格方案
     * 
     * @param hotelId 酒店ID
     * @return 价格方案列表
     */
    List<RatePlan> selectCalendarByHotelIdAndRoomTypeCodeAndRateCode(
        @Param("hotelId") String hotelId, 
        @Param("roomTypeCode") String roomTypeCode,
        @Param("rateCode") String rateCode);
} 