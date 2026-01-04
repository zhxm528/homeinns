package com.zai.rateprices.mapper;

import com.zai.rateprices.entity.RatePrice;
import com.zai.rateprices.dto.RatePriceListRequest.RoomTypeRateCodeMapping;
import com.zai.hotel.entity.Hotel;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

/**
 * 房价价格数据访问层接口
 */
@Mapper
public interface RatePriceMapper {
    
    /**
     * 根据条件查询房价价格列表
     * @param chainId 连锁ID
     * @param hotelId 酒店ID
     * @param roomTypeCode 房型代码列表
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 房价价格列表
     */
    List<RatePrice> selectByCondition(@Param("chainId") String chainId,
                                     @Param("hotelId") String hotelId,
                                     @Param("roomTypeCode") List<String> roomTypeCode,
                                     @Param("startDate") String startDate,
                                     @Param("endDate") String endDate);
    
    /**
     * 根据房型与房价码映射关系查询房价价格列表
     * @param chainId 连锁ID
     * @param hotelId 酒店ID
     * @param roomTypeRateCodeMappings 房型与房价码映射关系
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 房价价格列表
     */
    List<RatePrice> selectByRoomTypeRateCodeMappings(@Param("chainId") String chainId,
                                                     @Param("hotelId") String hotelId,
                                                     @Param("roomTypeRateCodeMappings") List<RoomTypeRateCodeMapping> roomTypeRateCodeMappings,
                                                     @Param("startDate") String startDate,
                                                     @Param("endDate") String endDate);
    
    
    RatePrice selectById(@Param("priceId") String priceId);
    
    /**
     * 根据复合主键查询房价价格
     * @param chainId 连锁ID
     * @param hotelId 酒店ID
     * @param rateCode 房价码
     * @param roomTypeCode 房型代码
     * @param stayDate 入住日期
     * @return 房价价格
     */
    RatePrice selectByPrimaryKey(@Param("chainId") String chainId,
                                @Param("hotelId") String hotelId,
                                @Param("rateCode") String rateCode,
                                @Param("roomTypeCode") String roomTypeCode,
                                @Param("stayDate") String stayDate);
    
    /**
     * 插入房价价格
     * @param ratePrice 房价价格对象
     * @return 影响行数
     */
    int insert(RatePrice ratePrice);
    
    /**
     * 更新房价价格
     * @param ratePrice 房价价格对象
     * @return 影响行数
     */
    int update(RatePrice ratePrice);
    
    /**
     * 根据ID删除房价价格
     * @param priceId 价格ID
     * @return 影响行数
     */
    int deleteById(@Param("priceId") String priceId);
    
    /**
     * 根据复合主键删除房价价格
     * @param chainId 连锁ID
     * @param hotelId 酒店ID
     * @param rateCode 房价码
     * @param roomTypeCode 房型代码
     * @param stayDate 入住日期
     * @return 影响行数
     */
    int deleteByPrimaryKey(@Param("chainId") String chainId,
                          @Param("hotelId") String hotelId,
                          @Param("rateCode") String rateCode,
                          @Param("roomTypeCode") String roomTypeCode,
                          @Param("stayDate") String stayDate);
    
    /**
     * 批量插入房价价格
     * @param ratePrices 房价价格列表
     * @return 影响行数
     */
    int batchInsert(@Param("ratePrices") List<RatePrice> ratePrices);
    
    /**
     * 根据条件统计房价价格数量
     * @param chainId 连锁ID
     * @param hotelId 酒店ID
     * @param roomTypeCode 房型代码列表
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 数量
     */
    int countByCondition(@Param("chainId") String chainId,
                        @Param("hotelId") String hotelId,
                        @Param("roomTypeCode") List<String> roomTypeCode,
                        @Param("startDate") String startDate,
                        @Param("endDate") String endDate);
    
    /**
     * 根据房型与房价码映射关系统计房价价格数量
     * @param chainId 连锁ID
     * @param hotelId 酒店ID
     * @param roomTypeRateCodeMappings 房型与房价码映射关系
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 数量
     */
    int countByRoomTypeRateCodeMappings(@Param("chainId") String chainId,
                                       @Param("hotelId") String hotelId,
                                       @Param("roomTypeRateCodeMappings") List<RoomTypeRateCodeMapping> roomTypeRateCodeMappings,
                                       @Param("startDate") String startDate,
                                       @Param("endDate") String endDate);
    
    /**
     * 查询房型库存状态，关联酒店和房型表获取酒店名称和房型名称
     * @param chainId 连锁ID
     * @param hotelId 酒店ID
     * @param roomTypeCode 房型代码列表
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @param offset 偏移量
     * @param limit 限制数量
     * @return 房型库存状态列表
     */
    List<Map<String, Object>> selectRoomTypeStatusWithHotel(@Param("hotelId") String hotelId,
                                                            @Param("startDate") String startDate,
                                                            @Param("endDate") String endDate);
    
    /**
     * 统计房型库存状态数量
     * @param chainId 连锁ID
     * @param hotelId 酒店ID
     * @param roomTypeCode 房型代码列表
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 数量
     */
    int countRoomTypeStatusWithHotel(@Param("hotelId") String hotelId,
                                     @Param("startDate") String startDate,
                                     @Param("endDate") String endDate);
    
    /**
     * 根据条件查询房价价格信息
     * @param chainId 连锁ID
     * @param hotelId 酒店ID
     * @param roomTypeCode 房型代码
     * @param rateCode 房价码
     * @param stayDate 入住日期
     * @return 房价价格列表
     */
    List<Map<String, Object>> selectRatePricesByCondition(@Param("chainId") String chainId,
                                                          @Param("hotelId") String hotelId,
                                                          @Param("roomTypeCode") String roomTypeCode,
                                                          @Param("rateCode") String rateCode,
                                                          @Param("stayDate") String stayDate);
    
    /**
     * 根据酒店ID查询所有房型信息
     * @param hotelId 酒店ID
     * @return 房型信息列表
     */
    List<Map<String, Object>> selectAllRoomTypesByHotelId(@Param("hotelId") String hotelId);
    
    /**
     * 根据酒店ID和房型代码查询库存状态
     * @param hotelId 酒店ID
     * @param roomTypeCode 房型代码
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 库存状态列表
     */
    List<Map<String, Object>> selectInventoryStatusByHotelAndRoomType(@Param("hotelId") String hotelId,
                                                                      @Param("roomTypeCode") String roomTypeCode,
                                                                      @Param("startDate") String startDate,
                                                                      @Param("endDate") String endDate);
    
    /**
     * 根据酒店ID查询酒店信息
     * @param hotelId 酒店ID
     * @return 酒店信息
     */
    Hotel selectHotelById(@Param("hotelId") String hotelId);

    /**
     * 根据条件查询房价价格列表
     * @param hotelId 酒店ID
     * @param roomTypeCodes 房型代码列表
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 房价价格列表
     */
    List<RatePrice> calendarByConditions(@Param("hotelId") String hotelId,
                                        @Param("roomTypeCodes") List<String> roomTypeCodes,
                                        @Param("startDate") String startDate,
                                        @Param("endDate") String endDate);


                                        /**
     * 根据复合主键查询房价价格
     * @param chainId 连锁ID
     * @param hotelId 酒店ID
     * @param rateCode 房价码
     * @param roomTypeCode 房型代码
     * @param stayDate 入住日期
     * @return 房价价格
     */
    RatePrice maintainRatePriceByHotelRoomTypeRateCode(@Param("chainId") String chainId,
                                                        @Param("hotelId") String hotelId,
                                                        @Param("rateCode") String rateCode,
                                                        @Param("roomTypeCode") String roomTypeCode,
                                                        @Param("stayDate") String stayDate);
    
    /**
     * 根据酒店ID、房价码、入住日期范围查询预订信息
     * @param hotelId 酒店ID
     * @param rateCode 房价码
     * @param checkIn 入住日期
     * @param checkOut 退房日期
     * @return 预订信息列表
     */
    List<Map<String, Object>> selectBookingByHotelRateCode(@Param("hotelId") String hotelId,
                                                           @Param("rateCode") String rateCode,
                                                           @Param("checkIn") String checkIn,
                                                           @Param("checkOut") String checkOut);
} 