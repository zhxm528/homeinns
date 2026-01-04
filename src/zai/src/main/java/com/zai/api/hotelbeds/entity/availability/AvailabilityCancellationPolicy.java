package com.zai.api.hotelbeds.entity.availability;

import lombok.Data;

@Data
public class AvailabilityCancellationPolicy {
    private String amount;
    private String from;
    private String percent;
    private String numberOfNights;
} 