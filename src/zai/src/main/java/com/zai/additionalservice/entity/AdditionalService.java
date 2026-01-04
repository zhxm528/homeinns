package com.zai.additionalservice.entity;

import lombok.Data;
import java.math.BigDecimal;
import java.util.Date;

@Data
public class AdditionalService {
    private String serviceId;
    private String chainId;
    private String hotelId;  
    private String rateCodeId;
    private String roomTypeId;
    private String rateCode;
    private String roomType;
    private String serviceCode;
    private String serviceName;
    private String description;
    private BigDecimal unitPrice;
    private BigDecimal unitNum;
    private String limitStartTime;
    private String limitEndTime;
    private String availWeeks;
    private Date createdAt;
} 