package com.zai.rateinventorystatus.dto;

import lombok.Data;
import java.math.BigDecimal;

/**
 * 房价库存状态更新请求DTO
 */
@Data
public class RateInventoryStatusUpdateRequest {
    
    /**
     * 状态记录唯一ID
     */
    private String statusId;
    
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
     * 最小入住天数
     */
    private Integer minStayDays;
    
    /**
     * 最大入住天数
     */
    private Integer maxStayDays;
    
    /**
     * 最小提前预订天数
     */
    private Integer minAdvanceDays;
    
    /**
     * 最大提前预订天数
     */
    private Integer maxAdvanceDays;
    
    /**
     * 最晚取消天数（入住前X天）
     */
    private Integer latestCancelDays;
    
    /**
     * 当天最晚取消时间，格式HH:MM
     */
    private String latestCancelTimeSameDay;
    
    /**
     * 预订支付类型，例如 prepay, postpay
     */
    private String paymentType;
    
    /**
     * 当天订单最晚保留时间，格式HH:MM
     */
    private String latestReservationTimeSameDay;
    
    /**
     * 订单是否可取消
     */
    private Boolean isCancellable;
    
    /**
     * 订单超时取消的罚金
     */
    private BigDecimal cancelPenalty;
} 