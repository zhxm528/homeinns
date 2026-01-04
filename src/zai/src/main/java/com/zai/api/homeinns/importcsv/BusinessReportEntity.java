package com.zai.api.homeinns.importcsv;

import lombok.Data;
import java.math.BigDecimal;
import java.util.Date;

@Data
public class BusinessReportEntity {
    private Date businessDate;
    private Date collectionDate;
    private String hotelId;
    private String chainId;
    private String categoryCode;
    private String categoryName;
    private BigDecimal totalRooms;
    private BigDecimal occupiedRooms;
    private BigDecimal occupancyRate;
    private BigDecimal maintenanceRooms;
    private BigDecimal outOfOrderRooms;
    private BigDecimal selfUseRooms;
    private BigDecimal availableRooms;
    private BigDecimal freeRooms;
    private BigDecimal roomRevenue;
    private BigDecimal roomGroupRevenue = BigDecimal.ZERO;
    private BigDecimal roomFitRevenue;
    private BigDecimal foodBeverageRevenue;
    private BigDecimal fbRestaurantRevenue;
    private BigDecimal fbMicRevenue = BigDecimal.ZERO;
    private BigDecimal otherRevenue;
    private BigDecimal totalRevenue;
    private BigDecimal averageRate;
    private BigDecimal revparRate;
    private BigDecimal adultOccupants;
    private BigDecimal foodBeverageGuests;
    private Date createTime;
    private String hotelDailyBusinessId;

}
