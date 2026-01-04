package com.zai.api.hotelbeds.entity.availability;

import lombok.Data;

@Data
public class AvailabilityDailyRate {
    private Integer offset;
    private String dailyNet;
    private String dailySellingRate;
} 