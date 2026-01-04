package com.zai.additionalservice.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import java.math.BigDecimal;
import java.util.Date;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class RateCodeBindRequest {
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
    private UserInfo user;
    

    @Data
    public static class UserInfo {
        private String userId;
        private String loginName;
        private String userName;
        private String roleId;
        private String roleName;
        private String chainId;
        private String chainName;
    }
} 