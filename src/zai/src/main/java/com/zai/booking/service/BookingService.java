package com.zai.booking.service;

import com.zai.booking.entity.Booking;
import com.zai.booking.dto.BookingListRequest;
import com.zai.booking.dto.BookingAddRequest;
import com.zai.booking.dto.BookingDetailResponse;
import com.zai.booking.dto.BookingConfirmRequest;
import com.zai.booking.dto.BookingUpdatePriceRequest;
import java.util.List;
import java.util.Date;
import com.zai.booking.dto.BookingUpdatePriceBatchRequest;
import com.zai.booking.dto.BookingUpdatePriceResponse;

public interface BookingService {
    
    /**
     * 添加预订
     */
    int addBooking(BookingAddRequest request);
    
    /**
     * 删除预订
     */
    void deleteBooking(String bookingId);
    
    /**
     * 更新预订
     */
    int updateBooking(Booking booking);
    
    /**
     * 根据预订ID查询
     */
    Booking getBookingById(String bookingId);
    
    /**
     * 根据预订ID查询详细信息（包含每日详情和日志）
     */
    BookingDetailResponse getBookingDetailById(String bookingId);
    
    /**
     * 查询预订列表
     */
    List<Booking> getBookingList(BookingListRequest request);
    
    /**
     * 根据连锁ID查询预订
     */
    List<Booking> getBookingsByChainId(String chainId);
    
    /**
     * 根据酒店ID查询预订
     */
    List<Booking> getBookingsByHotelId(String hotelId);
    
    /**
     * 根据入住日期范围查询预订
     */
    List<Booking> getBookingsByCheckInDateRange(Date checkInDateStart, Date checkInDateEnd);
    
    /**
     * 根据离店日期范围查询预订
     */
    List<Booking> getBookingsByCheckOutDateRange(Date checkOutDateStart, Date checkOutDateEnd);
    
    /**
     * 根据客人姓名查询预订
     */
    List<Booking> getBookingsByGuestName(String guestName);
    
    /**
     * 根据预订人姓名查询预订
     */
    List<Booking> getBookingsByBookerName(String bookerName);
    
    /**
     * 根据渠道代码查询预订
     */
    List<Booking> getBookingsByChannelCode(String channelCode);
    
    /**
     * 根据预订状态查询预订
     */
    List<Booking> getBookingsByStatus(String bookingStatus);
    
    /**
     * 统计预订数量
     */
    int countBookings(BookingListRequest request);
    
    /**
     * 取消预订
     */
    int cancelBooking(String bookingId, String cancelReason);
    
    /**
     * 确认预订
     */
    int confirmBooking(String bookingId, BookingConfirmRequest request);
    
    /**
     * 修改预订
     */
    int modifyBooking(String bookingId, BookingAddRequest request);
    
    /**
     * 更新预订价格（批量）
     */
    BookingUpdatePriceResponse updateBookingPrice(BookingUpdatePriceBatchRequest request);
} 