package com.zai.rateprices.dto;

import lombok.Data;

/**
 * 根据酒店ID、房型代码、房价码和入住日期设置房价码库存状态请求DTO
 */
@Data
public class RatePriceByRateCodeRequest {
    
    /**
     * 酒店ID
     */
    private String hotelId;
    
    /**
     * 房型代码
     */
    private String roomTypeCode;
    
    /**
     * 房价码
     */
    private String rateCode;
    
    /**
     * 入住日期 (格式: yyyy-MM-dd)
     */
    private String stayDate;
    
    /**
     * 是否可用 (O: 可用, C: 不可用)
     */
    private String isAvailable;
} 