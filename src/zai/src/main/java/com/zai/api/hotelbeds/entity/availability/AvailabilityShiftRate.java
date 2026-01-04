package com.zai.api.hotelbeds.entity.availability;

import java.util.List;
import lombok.Data;

@Data
public class AvailabilityShiftRate {
    private String rateKey;
    private String rateClass;
    private String rateType;
    private String net;
    private String discount;
    private String discountPCT;
    private String sellingRate;
    private Boolean hotelMandatory;
    private Integer allotment;
    private String commission;
    private String commissionVAT;
    private String commissionPCT;
    private String checkIn;
    private String checkOut;
    private String brand;
    private Boolean resident;
    private List<AvailabilityDailyRate> dailyRates;
} 