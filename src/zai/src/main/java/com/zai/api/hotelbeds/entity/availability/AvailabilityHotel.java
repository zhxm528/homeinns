package com.zai.api.hotelbeds.entity.availability;

import java.util.List;
import lombok.Data;

@Data
public class AvailabilityHotel {
    private String checkOut;
    private String checkIn;
    private Integer code;
    private String name;
    private String description;
    private Integer exclusiveDeal;
    private String categoryCode;
    private String categoryName;
    private String destinationCode;
    private String destinationName;
    private Integer zoneCode;
    private String zoneName;
    private String latitude;
    private String longitude;
    private String minRate;
    private String maxRate;
    private Double totalSellingRate;
    private Double totalNet;
    private Double pendingAmount;
    private String currency;
    private AvailabilitySupplier supplier;
    private String clientComments;
    private String cancellationAmount;
    private AvailabilityUpselling upselling;
    private List<AvailabilityRoom> rooms;
    private List<AvailabilityKeyword> keywords;
    private List<AvailabilityReview> reviews;
    private List<AvailabilityCreditCard> creditCards;
}
