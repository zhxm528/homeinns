package com.zai.ratecode.dto;

import lombok.Data;

@Data
public class RateCodeQueryRequest {
    private String chainId;
    private String hotelId;
    private String rateCode;
    private String rateCodeName;
    private String priceRuleType;
    private String parentRateCodeId;
    private Pagination pagination;

    @Data
    public static class Pagination {
        private int current;
        private int pageSize;
    }
} 