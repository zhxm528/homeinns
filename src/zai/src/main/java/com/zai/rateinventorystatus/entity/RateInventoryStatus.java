package com.zai.rateinventorystatus.entity;

import lombok.Data;
import javax.persistence.*;
import java.math.BigDecimal;

/**
 * 房价库存状态表实体类
 */
@Data
@Table(name = "rate_inventory_status")
public class RateInventoryStatus {
    
    /**
     * 状态记录唯一ID
     */
    @Id
    @Column(name = "status_id")
    private String statusId;
    
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
     * 最小入住天数
     */
    @Column(name = "min_stay_days")
    private Integer minStayDays;
    
    /**
     * 最大入住天数
     */
    @Column(name = "max_stay_days")
    private Integer maxStayDays;
    
    /**
     * 最小提前预订天数
     */
    @Column(name = "min_advance_days")
    private Integer minAdvanceDays;
    
    /**
     * 最大提前预订天数
     */
    @Column(name = "max_advance_days")
    private Integer maxAdvanceDays;
    
    /**
     * 最晚取消天数（入住前X天）
     */
    @Column(name = "latest_cancel_days")
    private Integer latestCancelDays;
    
    /**
     * 当天最晚取消时间，格式HH:MM
     */
    @Column(name = "latest_cancel_time_same_day")
    private String latestCancelTimeSameDay;
    
    /**
     * 预订支付类型，例如 prepay, postpay
     */
    @Column(name = "payment_type")
    private String paymentType;
    
    /**
     * 当天订单最晚保留时间，格式HH:MM
     */
    @Column(name = "latest_reservation_time_same_day")
    private String latestReservationTimeSameDay;
    
    /**
     * 订单是否可取消
     */
    @Column(name = "is_cancellable")
    private Boolean isCancellable;
    
    /**
     * 订单超时取消的罚金
     */
    @Column(name = "cancel_penalty")
    private BigDecimal cancelPenalty;
    
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