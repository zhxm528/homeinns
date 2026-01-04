package com.zai.ratecode.entity;

import lombok.Data;
import java.util.List;

@Data
public class RateCode {
    private String rateCodeId;
    private String chainId;
    private String hotelId;
    private String rateCode;
    private String rateCodeName;
    private String description;
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
    private String limitAvailWeeks;
    private String priceModifier;
    private Integer isPercentage;
    private String reservationType;
    private String cancellationType;
    private Integer latestCancellationDays;
    private String latestCancellationTime;
    private Integer cancellableAfterBooking;
    private String orderRetentionTime;
    private String stayStartDate;
    private String stayEndDate;
    private String bookingStartDate;
    private String bookingEndDate;
    private String priceRuleType;
    private String parentRateCodeId;
    private String createdAt;
    private String updatedAt;
    private String hotelName;
    private Integer status;
} 