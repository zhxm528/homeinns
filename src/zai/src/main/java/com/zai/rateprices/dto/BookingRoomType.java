package com.zai.rateprices.dto;

import lombok.Data;
import java.util.List;

/**
 * 预订房型信息DTO
 */
@Data
public class BookingRoomType {
    
    /**
     * 房型ID
     */
    private String roomTypeId;
    
    /**
     * 房型代码
     */
    private String roomTypeCode;
    
    /**
     * 房型名称
     */
    private String roomTypeName;
    
    /**
     * 房型描述
     */
    private String description;
    
    /**
     * 标准价格
     */
    private Double standardPrice;
    
    /**
     * 最大入住人数
     */
    private Integer maxOccupancy;
    
    /**
     * 物理库存
     */
    private Integer physicalInventory;

    /**
     * 预订每日价格信息列表
     */
    private List<BookingDailyRate> bookingDailyRate;
} 