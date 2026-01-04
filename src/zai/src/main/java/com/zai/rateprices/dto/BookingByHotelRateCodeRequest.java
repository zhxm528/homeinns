package com.zai.rateprices.dto;

import lombok.Data;

/**
 * 根据酒店ID和价格代码查询预订信息请求DTO
 */
@Data
public class BookingByHotelRateCodeRequest {
    /**
     * 集团ID
     */
    private String chainId;
    
    /**
     * 酒店ID
     */
    private String hotelId;
    
    /**
     * 价格代码
     */
    private String rateCode;
    
    /**
     * 入住日期 (格式: yyyy-MM-dd)
     */
    private String checkIn;
    
    /**
     * 退房日期 (格式: yyyy-MM-dd)
     */
    private String checkOut;
    
    /**
     * 渠道代码
     */
    private String channelCode;
} 