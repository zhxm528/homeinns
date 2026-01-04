package com.zai.api.homeinns.GETChannelRmType.mapper;

import com.zai.api.homeinns.GETChannelRmType.entity.RoomType;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Update;

@Mapper
public interface RoomTypeMapper {
    
    @Select("SELECT * FROM room_type WHERE chain_id = #{chainId} AND hotel_code = #{hotelCode} AND room_type_code = #{roomTypeCode}")
    RoomType findByChainIdAndHotelCodeAndRoomTypeCode(@Param("chainId") String chainId, 
                                                     @Param("hotelCode") String hotelCode,
                                                     @Param("roomTypeCode") String roomTypeCode);
    
    @Insert("INSERT INTO room_type (chain_id, hotel_code, room_type_code, room_type_name, status, create_time, update_time) " +
            "VALUES (#{chainId}, #{hotelCode}, #{roomTypeCode}, #{roomTypeName}, #{status}, NOW(), NOW())")
    int insert(RoomType roomType);
    
    @Update("UPDATE room_type SET room_type_name = #{roomTypeName}, status = #{status}, update_time = NOW() " +
            "WHERE chain_id = #{chainId} AND hotel_code = #{hotelCode} AND room_type_code = #{roomTypeCode}")
    int update(RoomType roomType);
} 