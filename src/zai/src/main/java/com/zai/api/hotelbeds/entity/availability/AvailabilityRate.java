package com.zai.api.hotelbeds.entity.availability;

import java.util.List;
import lombok.Data;

@Data
public class AvailabilityRate {
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
    private String rateCommentsId;
    private String rateComments;
    private Boolean packaging;
    private String boardCode;
    private String boardName;
    private Integer rooms;
    private Integer adults;
    private Integer children;
    private String childrenAges;
    private String rateup;
    private String brand;
    private Boolean resident;
    private List<AvailabilityCancellationPolicy> cancellationPolicies;
    private AvailabilityTaxes taxes;
    private List<AvailabilityPromotion> promotions;
    private List<AvailabilityOffer> offers;
    private List<AvailabilityShiftRate> shiftRates;
    private List<AvailabilityDailyRate> dailyRates;
}
