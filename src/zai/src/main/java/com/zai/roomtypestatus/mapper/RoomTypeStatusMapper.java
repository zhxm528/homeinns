package com.zai.roomtypestatus.mapper;

import com.zai.roomtypestatus.entity.RoomTypeStatus;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 房型库存状态数据访问层接口
 */
@Mapper
public interface RoomTypeStatusMapper {
    
    /**
     * 根据条件查询房型库存状态列表
     * @param chainId 连锁ID
     * @param hotelId 酒店ID
     * @param roomTypeCode 房型代码列表
     * @param rateCode 房价码列表
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @param isAvailable 开关状态
     * @return 房型库存状态列表
     */
    List<RoomTypeStatus> selectByCondition(@Param("chainId") String chainId,
                                          @Param("hotelId") String hotelId,
                                          @Param("roomTypeCode") List<String> roomTypeCode,
                                          @Param("rateCode") List<String> rateCode,
                                          @Param("startDate") String startDate,
                                          @Param("endDate") String endDate,
                                          @Param("isAvailable") String isAvailable);
    
    /**
     * 根据ID查询房型库存状态
     * @param roomtypeStatusId 状态记录ID
     * @return 房型库存状态
     */
    RoomTypeStatus selectById(@Param("roomtypeStatusId") String roomtypeStatusId);
    
    /**
     * 根据复合主键查询房型库存状态
     * @param chainId 连锁ID
     * @param hotelId 酒店ID
     * @param rateCode 房价码
     * @param roomTypeCode 房型代码
     * @param stayDate 入住日期
     * @return 房型库存状态
     */
    RoomTypeStatus selectByPrimaryKey(@Param("chainId") String chainId,
                                     @Param("hotelId") String hotelId,
                                     @Param("rateCode") String rateCode,
                                     @Param("roomTypeCode") String roomTypeCode,
                                     @Param("stayDate") String stayDate);
    
    /**
     * 插入房型库存状态
     * @param roomTypeStatus 房型库存状态对象
     * @return 影响行数
     */
    int insert(RoomTypeStatus roomTypeStatus);
    
    /**
     * 更新房型库存状态
     * @param roomTypeStatus 房型库存状态对象
     * @return 影响行数
     */
    int update(RoomTypeStatus roomTypeStatus);
    
    /**
     * 根据ID删除房型库存状态
     * @param roomtypeStatusId 状态记录ID
     * @return 影响行数
     */
    int deleteById(@Param("roomtypeStatusId") String roomtypeStatusId);
    
    /**
     * 根据复合主键删除房型库存状态
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
     * 批量插入房型库存状态
     * @param roomTypeStatusList 房型库存状态列表
     * @return 影响行数
     */
    int batchInsert(@Param("roomTypeStatusList") List<RoomTypeStatus> roomTypeStatusList);
    
    /**
     * 根据条件统计房型库存状态数量
     * @param chainId 连锁ID
     * @param hotelId 酒店ID
     * @param roomTypeCode 房型代码列表
     * @param rateCode 房价码列表
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @param isAvailable 开关状态
     * @return 数量
     */
    int countByCondition(@Param("chainId") String chainId,
                        @Param("hotelId") String hotelId,
                        @Param("roomTypeCode") List<String> roomTypeCode,
                        @Param("rateCode") List<String> rateCode,
                        @Param("startDate") String startDate,
                        @Param("endDate") String endDate,
                        @Param("isAvailable") String isAvailable);


    List<RoomTypeStatus> calendarByConditions(@Param("hotelId") String hotelId,
                        @Param("roomTypeCode") List<String> roomTypeCode,
                        @Param("startDate") String startDate,
                        @Param("endDate") String endDate);

    RoomTypeStatus roomtypeInventoryStatusByConditions(@Param("chainId") String chainId,
                    @Param("hotelId") String hotelId,
                    @Param("roomTypeCode") String roomTypeCode,
                    @Param("stayDate") String stayDate);
    
    /**
     * 根据酒店ID、房型代码和入住日期查询房型库存状态记录
     * @param hotelId 酒店ID
     * @param roomTypeCode 房型代码
     * @param stayDate 入住日期
     * @return 房型库存状态记录
     */
    RoomTypeStatus selectByHotelIdAndRoomTypeAndStayDate(
        @Param("hotelId") String hotelId,
        @Param("roomTypeCode") String roomTypeCode,
        @Param("stayDate") String stayDate
    );
    
    /**
     * 根据酒店ID、房型代码和入住日期更新房型库存状态记录
     * @param hotelId 酒店ID
     * @param roomTypeCode 房型代码
     * @param stayDate 入住日期
     * @param isAvailable 是否可用
     * @return 更新结果
     */
    int updateByHotelIdAndRoomTypeAndStayDate(
        @Param("hotelId") String hotelId,
        @Param("roomTypeCode") String roomTypeCode,
        @Param("stayDate") String stayDate,
        @Param("isAvailable") String isAvailable
    );
} 