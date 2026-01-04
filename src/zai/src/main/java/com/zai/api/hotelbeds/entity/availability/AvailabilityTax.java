package com.zai.api.hotelbeds.entity.availability;

import lombok.Data;

@Data
public class AvailabilityTax {
    private Boolean included;
    private String percent;
    private String amount;
    private String currency;
    private String type;
    private String subType;
    private String clientAmount;
    private String clientCurrency;
} 