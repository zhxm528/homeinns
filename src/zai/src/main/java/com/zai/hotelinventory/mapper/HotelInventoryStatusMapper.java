package com.zai.hotelinventory.mapper;

import com.zai.hotelinventory.entity.HotelInventoryStatus;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface HotelInventoryStatusMapper {
    List<HotelInventoryStatus> selectByHotelId(String hotelId);
    int insert(HotelInventoryStatus hotelInventoryStatus);
    int update(HotelInventoryStatus hotelInventoryStatus);
    int deleteById(String hotelStatusId);
    List<HotelInventoryStatus> calendarByConditions(
        @Param("hotelId") String hotelId,
        @Param("startDate") String startDate,
        @Param("endDate") String endDate
    );

    /**
     * 插入酒店库存状态记录
     * @param hotelStatusId 酒店状态ID
     * @param chainId 连锁ID
     * @param hotelId 酒店ID
     * @param hotelCode 酒店编码
     * @param stayDate 入住日期
     * @param isAvailable 是否可用
     * @param remainingInventory 剩余库存
     * @param soldInventory 已售库存
     * @param physicalInventory 物理库存
     * @return 插入结果
     */
    int insertHotelInventoryStatus(
        @Param("hotelStatusId") String hotelStatusId,
        @Param("chainId") String chainId,
        @Param("hotelId") String hotelId,
        @Param("hotelCode") String hotelCode,
        @Param("stayDate") String stayDate,
        @Param("isAvailable") String isAvailable,
        @Param("remainingInventory") Integer remainingInventory,
        @Param("soldInventory") Integer soldInventory,
        @Param("physicalInventory") Integer physicalInventory
    );
    
    /**
     * 根据主键查询酒店库存状态记录
     * @param chainId 连锁ID
     * @param hotelId 酒店ID
     * @param stayDate 入住日期
     * @return 酒店库存状态记录
     */
    HotelInventoryStatus selectByPrimaryKey(
        @Param("chainId") String chainId,
        @Param("hotelId") String hotelId,
        @Param("stayDate") String stayDate
    );
    
    /**
     * 根据主键更新酒店库存状态记录
     * @param chainId 连锁ID
     * @param hotelId 酒店ID
     * @param stayDate 入住日期
     * @param isAvailable 是否可用
     * @param remainingInventory 剩余库存
     * @param soldInventory 已售库存
     * @param physicalInventory 物理库存
     * @return 更新结果
     */
    int updateByPrimaryKey(
        @Param("chainId") String chainId,
        @Param("hotelId") String hotelId,
        @Param("stayDate") String stayDate,
        @Param("isAvailable") String isAvailable,
        @Param("remainingInventory") Integer remainingInventory,
        @Param("soldInventory") Integer soldInventory,
        @Param("physicalInventory") Integer physicalInventory
    );
    
    /**
     * 根据酒店ID和入住日期查询酒店库存状态记录
     * @param hotelId 酒店ID
     * @param stayDate 入住日期
     * @return 酒店库存状态记录
     */
    HotelInventoryStatus selectByHotelIdAndStayDate(
        @Param("hotelId") String hotelId,
        @Param("stayDate") String stayDate
    );

    int updateCalendarHotelStatusByStayDate(
        @Param("hotelId") String hotelId,
        @Param("stayDate") String stayDate,
        @Param("isAvailable") String isAvailable
    );
} 