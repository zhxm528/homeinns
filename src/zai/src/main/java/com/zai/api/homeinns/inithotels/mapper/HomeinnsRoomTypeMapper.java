package com.zai.api.homeinns.inithotels.mapper;

import com.zai.api.homeinns.inithotels.entity.RoomType;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Update;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.*;
import java.math.BigDecimal;

/**
 * 房型数据访问接口
 */
@Mapper
@Repository
public interface HomeinnsRoomTypeMapper {
    /**
     * 根据酒店编号和房型编号查询房型
     *
     * @param hotelCode 酒店编号
     * @param roomTypeCode 房型编号
     * @return 房型信息
     */
    @Select("SELECT * FROM room_types WHERE hotel_id = #{hotelId} AND room_type_code = #{roomTypeCode}")
    RoomType findByHotelCodeAndRoomTypeCode(@Param("hotelId") String hotelId, @Param("roomTypeCode") String roomTypeCode);

    /**
     * 根据酒店编号查询所有房型
     *
     * @param hotelId 酒店编号
     * @return 房型列表
     */
    @Select("SELECT * FROM room_types WHERE hotel_id = #{hotelId}")
    List<RoomType> findByHotelId(@Param("hotelId") String hotelId);

    /**
     * 保存房型信息
     *
     * @param roomType 房型信息
     * @return 影响行数
     */
    @Insert("INSERT INTO room_types (room_type_id, chain_id, hotel_id, room_type_code, room_type_name, " +
            "description, standard_price, max_occupancy, physical_inventory, created_at, updated_at) " +
            "VALUES (#{roomTypeId}, #{chainId}, #{hotelId}, #{roomTypeCode}, #{roomTypeName}, " +
            "#{description}, #{standardPrice}, #{maxOccupancy}, #{physicalInventory}, NOW(), NOW())")
    int insert(RoomType roomType);

    /**
     * 更新房型信息
     *
     * @param roomType 房型信息
     * @return 影响行数
     */
    @Update("UPDATE room_types SET " +
            "room_type_name = #{roomTypeName}, " +
            "description = #{description}, " +
            "updated_at = NOW() " +
            "WHERE room_type_id = #{roomTypeId}")
    int update(RoomType roomType);

    /**
     * 保存或更新房型信息
     *
     * @param roomType 房型信息
     * @return 影响行数
     */
    default int save(RoomType roomType) {
        RoomType existingRoomType = findByHotelCodeAndRoomTypeCode(roomType.getHotelId(), 
        roomType.getRoomTypeCode());
        if (existingRoomType != null) {
            //更新
            existingRoomType.setRoomTypeName(roomType.getRoomTypeName());
            existingRoomType.setDescription(roomType.getDescription());
            roomType.setRoomTypeId(existingRoomType.getRoomTypeId());
            return update(existingRoomType);
        } else {
            //新增
            
            roomType.setStandardPrice(parseDecimal("0"));
            roomType.setMaxOccupancy(parseInteger("0"));
            roomType.setPhysicalInventory(parseInteger("0"));
            return insert(roomType);
        }
    }
    /**
     * 解析整数
     */
    private Integer parseInteger(String str) {
        if (str == null || str.isEmpty()) {
            return null;
        }
        try {
            return Integer.parseInt(str);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
     /**
     * 解析小数
     */
    private BigDecimal parseDecimal(String str) {
        if (str == null || str.isEmpty()) {
            return null;
        }
        try {
            return new BigDecimal(str);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
} 