package com.zai.rateprices.dto;

import lombok.Data;

/**
 * 根据酒店ID和入住日期查询房价价格请求DTO
 */
@Data
public class RatePriceByHotelRequest {
    
    /**
     * 酒店ID
     */
    private String hotelId;
    
    /**
     * 入住日期 (格式: yyyy-MM-dd)
     */
    private String stayDate;
    
    /**
     * 是否可用 (O: 可用, C: 不可用)
     */
    private String isAvailable;
} 