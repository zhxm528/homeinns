package com.zai.rateplan.entity;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import lombok.Data;

@Data
public class RatePlan {
    private String ratePlanId;
    private String chainId;
    private String hotelId;
    private String roomTypeId;
    private String rateCodeId;
    private String roomType;
    private String rateCode;
    private String roomTypeName;
    private String rateCodeName;
    private String ratePlanName;
    private String description;
    private Integer finalStatus;
    private Integer finalInventory;
    private BigDecimal finalPrice;
    private Date createdAt;
    private Date updatedAt;

    
    private String marketCode;
    private String channelId;
    private Integer minlos;
    private Integer maxlos;
    private Integer minadv;
    private Integer maxadv;
    private String validFrom;
    private String validTo;
    private String limitStartTime;
    private String limitEndTime;
    private List<Integer> limitAvailWeeks;
    private String priceModifier;
    private Integer isPercentage;
    private String reservationType;
    private String cancellationType;
    private String latestCancellationDays;
    private String latestCancellationTime;
    private Integer cancellableAfterBooking;
    private String orderRetentionTime;
    private String stayStartDate;
    private String stayEndDate;
    private String bookingStartDate;
    private String bookingEndDate;
    private String priceRuleType;
    private String parentRateCodeId;

    
} 