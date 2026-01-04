package com.zai.booking.mapper;

import com.zai.booking.entity.Booking;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Date;

@Mapper
@Repository
public interface BookingMapper {
    
    /**
     * 插入预订记录
     */
    void insert(Booking booking);
    
    /**
     * 根据预订ID删除
     */
    void deleteByBookingId(String bookingId);
    
    /**
     * 更新预订信息
     */
    void update(Booking booking);
    
    /**
     * 根据预订ID查询
     */
    Booking selectByBookingId(String bookingId);
    
    /**
     * 查询所有预订
     */
    List<Booking> selectAll();
    
    /**
     * 根据条件查询预订列表
     */
    List<Booking> selectByCondition(@Param("chainId") String chainId,
                                   @Param("hotelId") String hotelId,
                                   @Param("bookingId") String bookingId,
                                   @Param("crsResvNo") String crsResvNo,
                                   @Param("channelResvNo") String channelResvNo,
                                   @Param("hotelResvNo") String hotelResvNo,
                                   @Param("guestName") String guestName,
                                   @Param("bookerName") String bookerName,
                                   @Param("channelCodes") List<String> channelCodes,
                                   @Param("rateCode") String rateCode,
                                   @Param("roomTypeCode") String roomTypeCode,
                                   @Param("checkInDateStart") Date checkInDateStart,
                                   @Param("checkInDateEnd") Date checkInDateEnd,
                                   @Param("checkOutDateStart") Date checkOutDateStart,
                                   @Param("checkOutDateEnd") Date checkOutDateEnd,
                                   @Param("bookingStatus") List<String> bookingStatus,
                                   @Param("page") int page,
                                   @Param("size") int size,
                                   @Param("offset") int offset);
    
    /**
     * 根据连锁ID查询预订
     */
    List<Booking> selectByChainId(String chainId);
    
    /**
     * 根据酒店ID查询预订
     */
    List<Booking> selectByHotelId(String hotelId);
    
    /**
     * 根据入住日期范围查询预订
     */
    List<Booking> selectByCheckInDateRange(@Param("checkInDateStart") Date checkInDateStart,
                                          @Param("checkInDateEnd") Date checkInDateEnd);
    
    /**
     * 根据离店日期范围查询预订
     */
    List<Booking> selectByCheckOutDateRange(@Param("checkOutDateStart") Date checkOutDateStart,
                                           @Param("checkOutDateEnd") Date checkOutDateEnd);
    
    /**
     * 根据客人姓名查询预订
     */
    List<Booking> selectByGuestName(String guestName);
    
    /**
     * 根据预订人姓名查询预订
     */
    List<Booking> selectByBookerName(String bookerName);
    
    /**
     * 根据渠道代码查询预订
     */
    List<Booking> selectByChannelCode(String channelCode);
    
    /**
     * 根据预订状态查询预订
     */
    List<Booking> selectByBookingStatus(String bookingStatus);
    
    /**
     * 统计预订数量
     */
    int countByCondition(@Param("chainId") String chainId,
                        @Param("hotelId") String hotelId,
                        @Param("bookingId") String bookingId,
                        @Param("crsResvNo") String crsResvNo,
                        @Param("channelResvNo") String channelResvNo,
                        @Param("hotelResvNo") String hotelResvNo,
                        @Param("guestName") String guestName,
                        @Param("bookerName") String bookerName,
                        @Param("channelCodes") List<String> channelCodes,
                        @Param("rateCode") String rateCode,
                        @Param("roomTypeCode") String roomTypeCode,
                        @Param("checkInDateStart") Date checkInDateStart,
                        @Param("checkInDateEnd") Date checkInDateEnd,
                        @Param("checkOutDateStart") Date checkOutDateStart,
                        @Param("checkOutDateEnd") Date checkOutDateEnd,
                        @Param("bookingStatus") List<String> bookingStatus);

    /**
     * 更新确认号
     */
    void updateConfirmNumber(@Param("bookingId") String bookingId, @Param("confirmNumber") String confirmNumber, @Param("bookingStatus") String bookingStatus);
} 