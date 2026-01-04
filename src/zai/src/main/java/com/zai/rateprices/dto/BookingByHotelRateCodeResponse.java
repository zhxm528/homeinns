package com.zai.rateprices.dto;

import lombok.Data;
import java.util.List;
import com.zai.roomtype.entity.RoomType;

/**
 * 根据酒店ID和价格代码查询预订信息响应DTO
 */
@Data
public class BookingByHotelRateCodeResponse {
    
    /**
     * 酒店ID
     */
    private String hotelId;

    /**
     * 集团ID
     */
    private String chainId;

    /**
     * 入离店日期
     */
    private String checkIn;

    /**
     * 离店日期
     */
    private String checkOut;

    /**
     * 渠道代码
     */
    private String channelCode;

    /**
     * 房价码
     */
    private String rateCode;
    
    /**
     * 房型列表
     */
    private List<BookingRoomType> bookingRoomTypes;
} 