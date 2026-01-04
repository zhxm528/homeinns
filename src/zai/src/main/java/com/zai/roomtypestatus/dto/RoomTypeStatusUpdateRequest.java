package com.zai.roomtypestatus.dto;

import lombok.Data;

/**
 * 房型库存状态更新请求DTO
 */
@Data
public class RoomTypeStatusUpdateRequest {
    
    /**
     * 状态记录唯一ID
     */
    private String roomtypeStatusId;
    
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
     * 房价码开关状态，O表示开启，C表示关闭
     */
    private String isAvailable;
    
    /**
     * 剩余库存
     */
    private Integer remainingInventory;
    
    /**
     * 已售库存
     */
    private Integer soldInventory;
    
    /**
     * 物理库存
     */
    private Integer physicalInventory;
} 