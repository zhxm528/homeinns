package com.zai.api.homeinns.GETChannelRmType.mapper;

import com.zai.api.homeinns.GETChannelRmType.entity.Hotel;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Update;

@Mapper
public interface HotelMapper {
    
    @Select("SELECT * FROM hotel WHERE chain_id = #{chainId} AND hotel_code = #{hotelCode}")
    Hotel findByChainIdAndHotelCode(@Param("chainId") String chainId, @Param("hotelCode") String hotelCode);
    
    @Insert("INSERT INTO hotel (chain_id, hotel_code, hotel_name, status, create_time, update_time) " +
            "VALUES (#{chainId}, #{hotelCode}, #{hotelName}, #{status}, NOW(), NOW())")
    int insert(Hotel hotel);
    
    @Update("UPDATE hotel SET hotel_name = #{hotelName}, status = #{status}, update_time = NOW() " +
            "WHERE chain_id = #{chainId} AND hotel_code = #{hotelCode}")
    int update(Hotel hotel);
} 