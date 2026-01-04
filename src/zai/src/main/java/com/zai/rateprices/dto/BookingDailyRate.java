package com.zai.rateprices.dto;

import lombok.Data;

/**
 * 预订每日价格信息DTO
 */
@Data
public class BookingDailyRate {
    
    /**
     * 入住日期 (格式: yyyy-MM-dd)
     */
    private String stayDate;
    
    /**
     * 是否可用 (O: 可用, C: 不可用)
     */
    private String isAvailable;
    
    /**
     * 剩余库存
     */
    private Integer remainingInventory;
    
    /**
     * 渠道单人间价格
     */
    private Double channelSingleOccupancy;
    
    /**
     * 酒店单人间价格
     */
    private Double hotelSingleOccupancy;
    
    /**
     * 代理商单人间价格
     */
    private Double agentSingleOccupancy;
} 