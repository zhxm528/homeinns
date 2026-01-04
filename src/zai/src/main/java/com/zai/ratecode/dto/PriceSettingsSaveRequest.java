package com.zai.ratecode.dto;

import java.util.List;

/**
 * 价格设置保存请求DTO
 */
public class PriceSettingsSaveRequest {
    
    private String rateCodeId;
    private String priceRuleType;
    private FixedPrice fixedPrice;
    private BasePrice basePrice;
    private DiscountPrice discountPrice;
    private DoubleDiscount doubleDiscount;
    
    // 固定价格
    public static class FixedPrice {
        private List<RoomTypePrice> roomTypePrices;
        
        public List<RoomTypePrice> getRoomTypePrices() {
            return roomTypePrices;
        }
        
        public void setRoomTypePrices(List<RoomTypePrice> roomTypePrices) {
            this.roomTypePrices = roomTypePrices;
        }
    }
    
    // 基础价格
    public static class BasePrice {
        private List<RoomTypeBasePrice> roomTypeBasePrices;
        
        public List<RoomTypeBasePrice> getRoomTypeBasePrices() {
            return roomTypeBasePrices;
        }
        
        public void setRoomTypeBasePrices(List<RoomTypeBasePrice> roomTypeBasePrices) {
            this.roomTypeBasePrices = roomTypeBasePrices;
        }
    }
    
    // 折扣价格
    public static class DiscountPrice {
        private String parentRateCodeId;
        private String priceFormula;
        private Double priceOffset;
        
        public String getParentRateCodeId() {
            return parentRateCodeId;
        }
        
        public void setParentRateCodeId(String parentRateCodeId) {
            this.parentRateCodeId = parentRateCodeId;
        }
        
        public String getPriceFormula() {
            return priceFormula;
        }
        
        public void setPriceFormula(String priceFormula) {
            this.priceFormula = priceFormula;
        }
        
        public Double getPriceOffset() {
            return priceOffset;
        }
        
        public void setPriceOffset(Double priceOffset) {
            this.priceOffset = priceOffset;
        }
    }
    
    // 双重折扣
    public static class DoubleDiscount {
        private String parentDiscountRateCodeId;
        private String discountPriceFormula;
        private Double discountPriceOffset;
        
        public String getParentDiscountRateCodeId() {
            return parentDiscountRateCodeId;
        }
        
        public void setParentDiscountRateCodeId(String parentDiscountRateCodeId) {
            this.parentDiscountRateCodeId = parentDiscountRateCodeId;
        }
        
        public String getDiscountPriceFormula() {
            return discountPriceFormula;
        }
        
        public void setDiscountPriceFormula(String discountPriceFormula) {
            this.discountPriceFormula = discountPriceFormula;
        }
        
        public Double getDiscountPriceOffset() {
            return discountPriceOffset;
        }
        
        public void setDiscountPriceOffset(Double discountPriceOffset) {
            this.discountPriceOffset = discountPriceOffset;
        }
    }
    
    // 房型价格
    public static class RoomTypePrice {
        private String roomTypeId;
        private List<PricePeriod> pricePeriods;
        
        public String getRoomTypeId() {
            return roomTypeId;
        }
        
        public void setRoomTypeId(String roomTypeId) {
            this.roomTypeId = roomTypeId;
        }
        
        public List<PricePeriod> getPricePeriods() {
            return pricePeriods;
        }
        
        public void setPricePeriods(List<PricePeriod> pricePeriods) {
            this.pricePeriods = pricePeriods;
        }
    }
    
    // 房型基础价格
    public static class RoomTypeBasePrice {
        private String roomTypeId;
        private List<BasePricePeriod> basePricePeriods;
        
        public String getRoomTypeId() {
            return roomTypeId;
        }
        
        public void setRoomTypeId(String roomTypeId) {
            this.roomTypeId = roomTypeId;
        }
        
        public List<BasePricePeriod> getBasePricePeriods() {
            return basePricePeriods;
        }
        
        public void setBasePricePeriods(List<BasePricePeriod> basePricePeriods) {
            this.basePricePeriods = basePricePeriods;
        }
    }
    
    // 价格周期
    public static class PricePeriod {
        private String startDate;
        private String endDate;
        private Double channelPrice;
        private Double hotelPrice;
        
        public String getStartDate() {
            return startDate;
        }
        
        public void setStartDate(String startDate) {
            this.startDate = startDate;
        }
        
        public String getEndDate() {
            return endDate;
        }
        
        public void setEndDate(String endDate) {
            this.endDate = endDate;
        }
        
        public Double getChannelPrice() {
            return channelPrice;
        }
        
        public void setChannelPrice(Double channelPrice) {
            this.channelPrice = channelPrice;
        }
        
        public Double getHotelPrice() {
            return hotelPrice;
        }
        
        public void setHotelPrice(Double hotelPrice) {
            this.hotelPrice = hotelPrice;
        }
    }
    
    // 基础价格周期
    public static class BasePricePeriod {
        private String startDate;
        private String endDate;
        private String priceMode;
        private Double channelPrice;
        private Double hotelPrice;
        private String formula;
        private Double channelOffset;
        private Double hotelOffset;
        private String weekDays;
        
        public String getStartDate() {
            return startDate;
        }
        
        public void setStartDate(String startDate) {
            this.startDate = startDate;
        }
        
        public String getEndDate() {
            return endDate;
        }
        
        public void setEndDate(String endDate) {
            this.endDate = endDate;
        }
        
        public String getPriceMode() {
            return priceMode;
        }
        
        public void setPriceMode(String priceMode) {
            this.priceMode = priceMode;
        }
        
        public Double getChannelPrice() {
            return channelPrice;
        }
        
        public void setChannelPrice(Double channelPrice) {
            this.channelPrice = channelPrice;
        }
        
        public Double getHotelPrice() {
            return hotelPrice;
        }
        
        public void setHotelPrice(Double hotelPrice) {
            this.hotelPrice = hotelPrice;
        }
        
        public String getFormula() {
            return formula;
        }
        
        public void setFormula(String formula) {
            this.formula = formula;
        }
        
        public Double getChannelOffset() {
            return channelOffset;
        }
        
        public void setChannelOffset(Double channelOffset) {
            this.channelOffset = channelOffset;
        }
        
        public Double getHotelOffset() {
            return hotelOffset;
        }
        
        public void setHotelOffset(Double hotelOffset) {
            this.hotelOffset = hotelOffset;
        }
        
        public String getWeekDays() {
            return weekDays;
        }
        
        public void setWeekDays(String weekDays) {
            this.weekDays = weekDays;
        }
    }
    
    // Getters and Setters
    public String getRateCodeId() {
        return rateCodeId;
    }
    
    public void setRateCodeId(String rateCodeId) {
        this.rateCodeId = rateCodeId;
    }
    
    public String getPriceRuleType() {
        return priceRuleType;
    }
    
    public void setPriceRuleType(String priceRuleType) {
        this.priceRuleType = priceRuleType;
    }
    
    public FixedPrice getFixedPrice() {
        return fixedPrice;
    }
    
    public void setFixedPrice(FixedPrice fixedPrice) {
        this.fixedPrice = fixedPrice;
    }
    
    public BasePrice getBasePrice() {
        return basePrice;
    }
    
    public void setBasePrice(BasePrice basePrice) {
        this.basePrice = basePrice;
    }
    
    public DiscountPrice getDiscountPrice() {
        return discountPrice;
    }
    
    public void setDiscountPrice(DiscountPrice discountPrice) {
        this.discountPrice = discountPrice;
    }
    
    public DoubleDiscount getDoubleDiscount() {
        return doubleDiscount;
    }
    
    public void setDoubleDiscount(DoubleDiscount doubleDiscount) {
        this.doubleDiscount = doubleDiscount;
    }
}
