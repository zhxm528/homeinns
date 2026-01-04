package com.zai.booking.entity;

import lombok.Data;
import java.util.Date;
import java.math.BigDecimal;

@Data
public class BookingDaily {
    private String bookingDailyId;
    private String bookingId;
    private String hotelId;
    private String chainId;
    private String chainCode;
    private String hotelCode;
    private String roomTypeCode;
    private String roomTypeName;
    private String rateCode;
    private String rateCodeName;
    private String packageCode;
    private String packageName;
    private Integer packageQuantity;
    private BigDecimal packageUnitPrice;
    private String hotelRoomNo;
    private Date stayDate;
    private Integer rooms;
    private Integer roomsActual;
    private BigDecimal priceChannel;
    private BigDecimal priceHotel;
    private BigDecimal priceAgent;
    private BigDecimal priceChannelActual;
    private BigDecimal priceHotelActual;
    private BigDecimal priceAgentActual;
    private BigDecimal cateringFeeHotel;
    private BigDecimal banquetFeeHotel;
    private BigDecimal otherFeeHotel;
    private BigDecimal totalRevenueFeeHotel;
} 