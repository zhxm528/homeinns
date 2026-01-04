package com.zai.rateprices.entity;

import lombok.Data;
import javax.persistence.*;
import java.math.BigDecimal;

/**
 * 酒店售卖房型房价码的价格表实体类
 */
@Data
@Table(name = "rate_prices")
public class RatePrice {
    
    /**
     * 价格记录唯一ID
     */
    @Id
    @Column(name = "price_id")
    private String priceId;
    
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
     * 入住日期，价格对应的日期
     */
    @Column(name = "stay_date")
    private String stayDate;
    
    /**
     * 渠道单人价
     */
    @Column(name = "channel_single_occupancy")
    private BigDecimal channelSingleOccupancy;
    
    /**
     * 渠道双人价
     */
    @Column(name = "channel_double_occupancy")
    private BigDecimal channelDoubleOccupancy;
    
    /**
     * 酒店单人价
     */
    @Column(name = "hotel_single_occupancy")
    private BigDecimal hotelSingleOccupancy;
    
    /**
     * 酒店双人价
     */
    @Column(name = "hotel_double_occupancy")
    private BigDecimal hotelDoubleOccupancy;
    
    /**
     * 中间商单人价
     */
    @Column(name = "agent_single_occupancy")
    private BigDecimal agentSingleOccupancy;
    
    /**
     * 中间商双人价
     */
    @Column(name = "agent_double_occupancy")
    private BigDecimal agentDoubleOccupancy;
    
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