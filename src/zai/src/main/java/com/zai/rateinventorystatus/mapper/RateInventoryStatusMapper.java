package com.zai.rateinventorystatus.mapper;

import com.zai.rateinventorystatus.entity.RateInventoryStatus;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

/**
 * 房价库存状态Mapper接口
 */
@Mapper
public interface RateInventoryStatusMapper {
    
    /**
     * 插入房价库存状态记录
     */
    int insert(RateInventoryStatus rateInventoryStatus);
    
    /**
     * 根据主键更新房价库存状态记录
     */
    int updateByPrimaryKey(RateInventoryStatus rateInventoryStatus);
    
    /**
     * 根据主键删除房价库存状态记录
     */
    int deleteByPrimaryKey(@Param("chainId") String chainId, 
                          @Param("hotelId") String hotelId,
                          @Param("rateCode") String rateCode,
                          @Param("roomTypeCode") String roomTypeCode,
                          @Param("stayDate") String stayDate);
    
    /**
     * 根据主键查询房价库存状态记录
     */
    RateInventoryStatus selectByPrimaryKey(@Param("chainId") String chainId, 
                                          @Param("hotelId") String hotelId,
                                          @Param("rateCode") String rateCode,
                                          @Param("roomTypeCode") String roomTypeCode,
                                          @Param("stayDate") String stayDate);
    
    /**
     * 根据条件查询房价库存状态记录列表
     */
    List<RateInventoryStatus> selectByCondition(@Param("chainId") String chainId,
                                               @Param("hotelId") String hotelId,
                                               @Param("roomTypeCodeList") List<String> roomTypeCodeList,
                                               @Param("rateCodeList") List<String> rateCodeList,
                                               @Param("startDate") String startDate,
                                               @Param("endDate") String endDate,
                                               @Param("isAvailable") String isAvailable,
                                               @Param("paymentType") String paymentType,
                                               @Param("offset") Integer offset,
                                               @Param("limit") Integer limit);
    
    /**
     * 根据条件统计房价库存状态记录数量
     */
    int countByCondition(@Param("chainId") String chainId,
                        @Param("hotelId") String hotelId,
                        @Param("roomTypeCodeList") List<String> roomTypeCodeList,
                        @Param("rateCodeList") List<String> rateCodeList,
                        @Param("startDate") String startDate,
                        @Param("endDate") String endDate,
                        @Param("isAvailable") String isAvailable,
                        @Param("paymentType") String paymentType);
    
    /**
     * 批量插入房价库存状态记录
     */
    int batchInsert(@Param("list") List<RateInventoryStatus> list);
    
    /**
     * 批量更新房价库存状态记录
     */
    int batchUpdate(@Param("list") List<RateInventoryStatus> list);
    
    /**
     * 根据日期范围删除房价库存状态记录
     */
    int deleteByDateRange(@Param("chainId") String chainId,
                         @Param("hotelId") String hotelId,
                         @Param("startDate") String startDate,
                         @Param("endDate") String endDate);
    
    /**
     * 日历查询条件查询房价库存状态记录
     */
    List<RateInventoryStatus> calendarByConditions(@Param("hotelId") String hotelId,
                                                  @Param("roomTypeCode") List<String> roomTypeCode,
                                                  @Param("startDate") String startDate,
                                                  @Param("endDate") String endDate);

    int updateInventoryStatusByHotelRoomTypeRateCode(
        @Param("chainId") String chainId,
        @Param("hotelId") String hotelId,
        @Param("roomTypeCode") String roomTypeCode,
        @Param("rateCode") String rateCode,
        @Param("stayDate") String stayDate,
        @Param("isAvailable") String isAvailable,
        @Param("remainingInventory") Integer remainingInventory,
        @Param("updatedAt") String updatedAt);

    /**
     * 日历查询条件查询房价库存状态记录
     */
    List<RateInventoryStatus> selectCalendarByHotelIdAndRoomTypeCodeAndRateCodeAndRatePlan(
        @Param("hotelId") String hotelId,
        @Param("roomTypeCode") String roomTypeCode,
        @Param("rateCode") String rateCode,
        @Param("stayDate") String stayDate);    

    /**
     * 根据hotelId、roomTypeCode、rateCode和stayDate更新房价库存状态记录
     */
    int updateByHotelIdAndRoomTypeAndRateCodeAndStayDate(
        @Param("hotelId") String hotelId,
        @Param("roomTypeCode") String roomTypeCode,
        @Param("rateCode") String rateCode,
        @Param("stayDate") String stayDate,
        @Param("isAvailable") String isAvailable);

    /**
     * 根据hotelId、roomTypeCode、rateCode和stayDate查询房价库存状态记录
     */
    RateInventoryStatus selectByHotelIdAndRoomTypeAndRateCodeAndStayDate(
        @Param("hotelId") String hotelId,
        @Param("roomTypeCode") String roomTypeCode,
        @Param("rateCode") String rateCode,
        @Param("stayDate") String stayDate);
    
} 