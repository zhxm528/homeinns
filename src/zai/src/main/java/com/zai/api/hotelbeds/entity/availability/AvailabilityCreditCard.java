package com.zai.api.hotelbeds.entity.availability;

import lombok.Data;

@Data
public class AvailabilityCreditCard {
    private String code;
    private String name;
    private Boolean paymentDataRequired;
} 