package com.zai.roomtypestatus.entity;

import lombok.Data;
import javax.persistence.*;

/**
 * 房型库存状态表实体类
 */
@Data
@Table(name = "roomtype_status")
public class RoomTypeStatus {
    
    /**
     * 状态记录唯一ID
     */
    @Id
    @Column(name = "roomtype_status_id")
    private String roomtypeStatusId;
    
    /**
     * 酒店连锁ID
     */
    @Column(name = "chain_id")
    private String chainId;
    
    /**
     * 酒店ID，关联hotels表
     */
    @Column(name = "hotel_id")
    private String hotelId;
    
    /**
     * 酒店Code
     */
    @Column(name = "hotel_code")
    private String hotelCode;
    
    /**
     * 房型与房价码组合ID，关联rate_plans表
     */
    @Column(name = "rate_plan_id")
    private String ratePlanId;
    
    /**
     * 房型ID，关联room_types表
     */
    @Column(name = "room_type_id")
    private String roomTypeId;
    
    /**
     * 房型代码
     */
    @Column(name = "room_type_code")
    private String roomTypeCode;
    
    /**
     * 房价码ID，关联rate_codes表
     */
    @Column(name = "rate_code_id")
    private String rateCodeId;
    
    /**
     * 房价码代码
     */
    @Column(name = "rate_code")
    private String rateCode;
    
    /**
     * 入住日期，库存和状态对应的日期
     */
    @Column(name = "stay_date")
    private String stayDate;
    
    /**
     * 房价码开关状态，O表示开启，C表示关闭
     */
    @Column(name = "is_available")
    private String isAvailable;
    
    /**
     * 剩余库存
     */
    @Column(name = "remaining_inventory")
    private Integer remainingInventory;
    
    /**
     * 已售库存
     */
    @Column(name = "sold_inventory")
    private Integer soldInventory;
    
    /**
     * 物理库存
     */
    @Column(name = "physical_inventory")
    private Integer physicalInventory;
    
    /**
     * 创建时间
     */
    @Column(name = "created_at")
    private String createdAt;
    
    /**
     * 更新时间
     */
    @Column(name = "updated_at")
    private String updatedAt;
} 