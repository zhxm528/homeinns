package com.zai.api.homeinns.inithotels.mapper;

import com.zai.api.homeinns.inithotels.entity.Hotel;
import com.zai.api.hotelbeds.controller.HotelBedsHotelApiController;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Update;
import org.springframework.stereotype.Repository;
import java.util.*;
import java.math.BigDecimal;

/**
 * 酒店数据访问接口
 */

@Mapper
@Repository
public interface HomeinnsHotelMapper {

    /**
     * 根据酒店编号查询酒店
     *
     * @param hotelCode 酒店编号
     * @return 酒店信息
     */
    @Select("SELECT * FROM hotels WHERE chain_id = #{chainId} AND hotel_code = #{hotelCode}")
    Hotel findByHotelCode(@Param("chainId") String chainId, @Param("hotelCode") String hotelCode);

    /**
     * 保存酒店信息
     *
     * @param hotel 酒店信息
     * @return 影响行数
     */
    @Insert("INSERT INTO hotels (hotel_id, chain_id, hotel_code, hotel_name, address, description, " +
            "city_id, country, contact_email, contact_phone, status, ownership_type, management_model, " +
            "management_company, brand, region, city_area, pms_version, opening_date, last_renovation_date, " +
            "closure_date, total_physical_rooms, base_price, threshold_price, breakfast_price, parking_price, " +
            "created_at, updated_at) " +
            "VALUES (#{hotelId}, #{chainId}, #{hotelCode}, #{hotelName}, #{address}, #{description}, " +
            "#{cityId}, #{country}, #{contactEmail}, #{contactPhone}, #{status}, #{ownershipType}, " +
            "#{managementModel}, #{managementCompany}, #{brand}, #{region}, #{cityArea}, #{pmsVersion}, " +
            "#{openingDate}, #{lastRenovationDate}, #{closureDate}, #{totalPhysicalRooms}, #{basePrice}, " +
            "#{thresholdPrice}, #{breakfastPrice}, #{parkingPrice}, NOW(), NOW())")
    int insert(Hotel hotel);

    /**
     * 更新酒店信息
     *
     * @param hotel 酒店信息
     * @return 影响行数
     */
    @Update("UPDATE hotels SET  " +
            "hotel_name = #{hotelName}, address = #{address}, description = #{description}, " +
            "contact_email = #{contactEmail}, " +
            "contact_phone = #{contactPhone}, " +
            "opening_date = #{openingDate}, " +
            "city_id = #{cityId}, " +
            "updated_at = NOW() " +
            "WHERE hotel_id = #{hotelId}")
    int update(Hotel hotel);

    /**
     * 保存或更新酒店信息
     *
     * @param hotel 酒店信息
     * @return 影响行数
     */
    default int save(Hotel hotel) {
        String hotelCode = hotel.getHotelCode();
        String chainId = hotel.getChainId();
        Hotel existingHotel = findByHotelCode(chainId,hotelCode);
        if (existingHotel != null) {
            // 更新酒店信息
            existingHotel.setHotelName(hotel.getHotelName());
            existingHotel.setAddress(hotel.getAddress());
            existingHotel.setDescription(hotel.getDescription());
            existingHotel.setCityId(hotel.getCityId());
            existingHotel.setContactEmail(hotel.getContactEmail());
            existingHotel.setContactPhone(hotel.getContactPhone());
            existingHotel.setOpeningDate(hotel.getOpeningDate());
            hotel.setHotelId(existingHotel.getHotelId());
            int result = update(existingHotel);
            System.out.println("Update result: " + result);
            return result;
        } else {
            // 新增酒店信息          
            hotel.setPmsVersion("");
            hotel.setStatus(1);
            hotel.setBasePrice(parseDecimal("0"));
            hotel.setThresholdPrice(parseDecimal("0"));
            hotel.setBreakfastPrice(parseDecimal("0"));
            hotel.setParkingPrice(parseDecimal("0"));
            return insert(hotel);
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