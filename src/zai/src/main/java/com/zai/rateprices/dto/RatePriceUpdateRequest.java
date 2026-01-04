package com.zai.rateprices.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * 房价价格更新请求DTO
 */
@Data
public class RatePriceUpdateRequest {
    
    /**
     * 价格记录唯一ID
     */
    private String priceId;
    
    /**
     * 酒店连锁ID
     */
    private String chainId;
    
    /**
     * 酒店ID
     */
    private String hotelId;
    
    /**
     * 酒店Code
     */
    private String hotelCode;
    
    /**
     * 房型与房价码组合ID
     */
    private String ratePlanId;
    
    /**
     * 房型ID
     */
    private String roomTypeId;
    
    /**
     * 房型代码
     */
    private String roomTypeCode;
    
    /**
     * 房价码ID
     */
    private String rateCodeId;
    
    /**
     * 房价码代码
     */
    private String rateCode;
    
    /**
     * 入住日期
     */
    private String stayDate;
    
    /**
     * 渠道单人价
     */
    private BigDecimal channelSingleOccupancy;
    
    /**
     * 渠道双人价
     */
    private BigDecimal channelDoubleOccupancy;
    
    /**
     * 酒店单人价
     */
    private BigDecimal hotelSingleOccupancy;
    
    /**
     * 酒店双人价
     */
    private BigDecimal hotelDoubleOccupancy;
    
    /**
     * 中间商单人价
     */
    private BigDecimal agentSingleOccupancy;
    
    /**
     * 中间商双人价
     */
    private BigDecimal agentDoubleOccupancy;
} 