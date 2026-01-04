package com.zai.booking.mapper;

import com.zai.booking.entity.BookingDaily;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Date;

@Mapper
@Repository
public interface BookingDailyMapper {
    
    /**
     * 插入预订每日价格记录
     */
    void insert(BookingDaily bookingDaily);
    
    /**
     * 根据预订每日价格ID删除
     */
    void deleteByBookingDailyId(String bookingDailyId);
    
    /**
     * 根据预订ID删除所有每日价格记录
     */
    void deleteByBookingId(String bookingId);
    
    /**
     * 更新预订每日价格信息
     */
    void update(BookingDaily bookingDaily);
    
    /**
     * 根据预订每日价格ID查询
     */
    BookingDaily selectByBookingDailyId(String bookingDailyId);
    
    /**
     * 根据预订ID查询所有每日价格记录
     */
    List<BookingDaily> selectByBookingId(String bookingId);
    
    /**
     * 根据酒店ID查询每日价格记录
     */
    List<BookingDaily> selectByHotelId(String hotelId);
    
    /**
     * 根据连锁ID查询每日价格记录
     */
    List<BookingDaily> selectByChainId(String chainId);
    
    /**
     * 根据入住日期查询每日价格记录
     */
    List<BookingDaily> selectByStayDate(Date stayDate);
    
    /**
     * 根据入住日期范围查询每日价格记录
     */
    List<BookingDaily> selectByStayDateRange(@Param("stayDateStart") Date stayDateStart,
                                            @Param("stayDateEnd") Date stayDateEnd);
    
    /**
     * 根据酒店ID和入住日期范围查询每日价格记录
     */
    List<BookingDaily> selectByHotelIdAndStayDateRange(@Param("hotelId") String hotelId,
                                                       @Param("stayDateStart") Date stayDateStart,
                                                       @Param("stayDateEnd") Date stayDateEnd);
    
    /**
     * 根据房型代码查询每日价格记录
     */
    List<BookingDaily> selectByRoomTypeCode(String roomTypeCode);
    
    /**
     * 根据房价码查询每日价格记录
     */
    List<BookingDaily> selectByRateCode(String rateCode);
    
    /**
     * 查询所有每日价格记录
     */
    List<BookingDaily> selectAll();
    
    /**
     * 更新预订每日价格信息
     */
    int updatePrice(BookingDaily bookingDaily);
} 