package com.zai.roomtype.mapper;

import com.zai.roomtype.entity.RoomType;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Mapper
@Repository
public interface RoomTypeMapper {
    // 插入房型
    void insert(RoomType roomType);

    // 根据ID删除房型
    int deleteByRoomTypeId(@Param("roomTypeId") String roomTypeId);

    // 更新房型信息
    void update(RoomType roomType);

    // 根据ID查询房型
    RoomType selectByRoomTypeId(@Param("roomTypeId") String roomTypeId);

    // 根据房型代码查询房型
    RoomType selectByRoomCode(@Param("roomTypeCode") String roomTypeCode);

    // 查询所有房型
    List<RoomType> selectAll();

    // 根据条件查询房型
    List<RoomType> getRoomTypesByCondition(Map<String, Object> params);

    // 根据酒店ID查询房型
    List<RoomType> selectByHotelId(@Param("hotelId") String hotelId);

    // 根据房型代码、酒店ID和连锁ID查询房型
    RoomType selectByRoomCodeAndHotelAndChain(
        @Param("roomTypeCode") String roomTypeCode,
        @Param("hotelId") String hotelId,
        @Param("chainId") String chainId
    );

    // 根据条件统计房型总数
    int countByCondition(Map<String, Object> params);

    /**
     * 根据连锁ID、酒店ID和房型代码查询房型
     * @param chainId 连锁ID
     * @param hotelId 酒店ID
     * @param roomTypeCode 房型代码
     * @return 房型信息
     */
    RoomType selectByChainIdAndHotelIdAndRoomTypeCode(
        @Param("chainId") String chainId, 
        @Param("hotelId") String hotelId, 
        @Param("roomTypeCode") String roomTypeCode
    );
    
    /**
     * 根据ID更新房型信息
     * @param roomType 房型信息
     * @return 影响行数
     */
    int updateById(RoomType roomType);

    /**
     * 根据酒店ID查询房型组件列表
     * 
     * @param hotelId 酒店ID
     * @return 房型列表
     */
    List<RoomType> selectRoomTypeComponent(@Param("hotelId") String hotelId);

    /**
     * 根据酒店ID和房型代码查询房型
     * @param hotelId 酒店ID
     * @param roomTypeCode 房型代码
     * @return 房型信息
     */
    RoomType selectCalendarByHotelIdAndRoomTypeCode(@Param("hotelId") String hotelId, @Param("roomTypeCode") String roomTypeCode);
    
    /**
     * 根据酒店ID和房型代码查询房型
     * @param hotelId 酒店ID
     * @param roomTypeCode 房型代码
     * @return 房型信息
     */
    RoomType bookingSelectByHotelRoomTypeCode(@Param("hotelId") String hotelId, @Param("roomTypeCode") String roomTypeCode);
} 