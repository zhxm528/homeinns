package com.zai.booking.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.math.BigDecimal;
import java.util.Date;

/**
 * 预订价格更新请求DTO
 */
public class BookingUpdatePriceRequest {
    
    /**
     * 预订ID
     */
    @JsonProperty("bookingId")
    private String bookingId;
    
    /**
     * 预订日ID
     */
    @JsonProperty("bookingDailyId")
    private String bookingDailyId;
    
    /**
     * 入住日期
     */
    @JsonProperty("stayDate")
    private Date stayDate;
    
    /**
     * 渠道实际价格
     */
    @JsonProperty("priceChannelActual")
    private BigDecimal priceChannelActual;
    
    /**
     * 酒店实际价格
     */
    @JsonProperty("priceHotelActual")
    private BigDecimal priceHotelActual;
    
    /**
     * 是否新增行
     */
    @JsonProperty("isNew")
    private Boolean isNew;
    
    /**
     * 操作类型
     */
    @JsonProperty("action")
    private String action;
    
    // 构造函数
    public BookingUpdatePriceRequest() {}
    
    // Getter和Setter方法
    public String getBookingId() {
        return bookingId;
    }
    
    public void setBookingId(String bookingId) {
        this.bookingId = bookingId;
    }
    
    public String getBookingDailyId() {
        return bookingDailyId;
    }
    
    public void setBookingDailyId(String bookingDailyId) {
        this.bookingDailyId = bookingDailyId;
    }
    
    public Date getStayDate() {
        return stayDate;
    }
    
    public void setStayDate(Date stayDate) {
        this.stayDate = stayDate;
    }
    
    public BigDecimal getPriceChannelActual() {
        return priceChannelActual;
    }
    
    public void setPriceChannelActual(BigDecimal priceChannelActual) {
        this.priceChannelActual = priceChannelActual;
    }
    
    public BigDecimal getPriceHotelActual() {
        return priceHotelActual;
    }
    
    public void setPriceHotelActual(BigDecimal priceHotelActual) {
        this.priceHotelActual = priceHotelActual;
    }
    
    public Boolean getIsNew() {
        return isNew;
    }
    
    public void setIsNew(Boolean isNew) {
        this.isNew = isNew;
    }
    
    public String getAction() {
        return action;
    }
    
    public void setAction(String action) {
        this.action = action;
    }
    
    @Override
    public String toString() {
        return "BookingUpdatePriceRequest{" +
                "bookingId='" + bookingId + '\'' +
                ", bookingDailyId='" + bookingDailyId + '\'' +
                ", stayDate=" + stayDate +
                ", priceChannelActual=" + priceChannelActual +
                ", priceHotelActual=" + priceHotelActual +
                ", isNew=" + isNew +
                ", action='" + action + '\'' +
                '}';
    }
} 