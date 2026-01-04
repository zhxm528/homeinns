package com.zai.rateprices.model;

import java.util.List;

/**
 * 可用性查询响应模型
 */
public class AvailabilityResponseModel {
    private String status;
    private AvailabilityDataModel data;

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public AvailabilityDataModel getData() {
        return data;
    }

    public void setData(AvailabilityDataModel data) {
        this.data = data;
    }

    /**
     * 响应数据模型
     */
    public static class AvailabilityDataModel {
        private List<AvailabilityHotelModel> hotels;
        private PaginationModel pagination;

        public List<AvailabilityHotelModel> getHotels() {
            return hotels;
        }

        public void setHotels(List<AvailabilityHotelModel> hotels) {
            this.hotels = hotels;
        }

        public PaginationModel getPagination() {
            return pagination;
        }

        public void setPagination(PaginationModel pagination) {
            this.pagination = pagination;
        }
    }

    /**
     * 酒店模型
     */
    public static class AvailabilityHotelModel {
        private String hotelCode;
        private String hotelName;
        private List<DailyDataModel> dailyData;
        private List<AvailabilityRoomTypeModel> roomTypes;

        public String getHotelCode() {
            return hotelCode;
        }

        public void setHotelCode(String hotelCode) {
            this.hotelCode = hotelCode;
        }

        public String getHotelName() {
            return hotelName;
        }

        public void setHotelName(String hotelName) {
            this.hotelName = hotelName;
        }

        public List<DailyDataModel> getDailyData() {
            return dailyData;
        }

        public void setDailyData(List<DailyDataModel> dailyData) {
            this.dailyData = dailyData;
        }

        public List<AvailabilityRoomTypeModel> getRoomTypes() {
            return roomTypes;
        }

        public void setRoomTypes(List<AvailabilityRoomTypeModel> roomTypes) {
            this.roomTypes = roomTypes;
        }
    }

    /**
     * 房型模型
     */
    public static class AvailabilityRoomTypeModel {
        private String roomTypeCode;
        private String roomTypeName;
        private String roomTypeDescription;
        private List<DailyDataModel> dailyData;
        private List<AvailabilityRateCodeModel> rateCodes;

        public String getRoomTypeCode() {
            return roomTypeCode;
        }

        public void setRoomTypeCode(String roomTypeCode) {
            this.roomTypeCode = roomTypeCode;
        }

        public String getRoomTypeName() {
            return roomTypeName;
        }

        public void setRoomTypeName(String roomTypeName) {
            this.roomTypeName = roomTypeName;
        }

        public String getRoomTypeDescription() {
            return roomTypeDescription;
        }

        public void setRoomTypeDescription(String roomTypeDescription) {
            this.roomTypeDescription = roomTypeDescription;
        }

        public List<DailyDataModel> getDailyData() {
            return dailyData;
        }

        public void setDailyData(List<DailyDataModel> dailyData) {
            this.dailyData = dailyData;
        }

        public List<AvailabilityRateCodeModel> getRateCodes() {
            return rateCodes;
        }

        public void setRateCodes(List<AvailabilityRateCodeModel> rateCodes) {
            this.rateCodes = rateCodes;
        }
    }

    /**
     * 房价码模型
     */
    public static class AvailabilityRateCodeModel {
        private String rateCode;
        private String rateCodeName;
        private List<RateCodeDailyDataModel> dailyData;
        private List<PackageModel> packages;

        public String getRateCode() {
            return rateCode;
        }

        public void setRateCode(String rateCode) {
            this.rateCode = rateCode;
        }

        public String getRateCodeName() {
            return rateCodeName;
        }

        public void setRateCodeName(String rateCodeName) {
            this.rateCodeName = rateCodeName;
        }

        public List<RateCodeDailyDataModel> getDailyData() {
            return dailyData;
        }

        public void setDailyData(List<RateCodeDailyDataModel> dailyData) {
            this.dailyData = dailyData;
        }

        public List<PackageModel> getPackages() {
            return packages;
        }

        public void setPackages(List<PackageModel> packages) {
            this.packages = packages;
        }
    }

    /**
     * 每日数据模型
     */
    public static class DailyDataModel {
        private String date;
        private Integer sold;
        private Integer remaining;
        private String isAvailable;

        public String getDate() {
            return date;
        }

        public void setDate(String date) {
            this.date = date;
        }

        public Integer getSold() {
            return sold;
        }

        public void setSold(Integer sold) {
            this.sold = sold;
        }

        public Integer getRemaining() {
            return remaining;
        }

        public void setRemaining(Integer remaining) {
            this.remaining = remaining;
        }

        public String getIsAvailable() {
            return isAvailable;
        }

        public void setIsAvailable(String isAvailable) {
            this.isAvailable = isAvailable;
        }
    }

    /**
     * 房价码每日数据模型
     */
    public static class RateCodeDailyDataModel {
        private String date;
        private String isAvailable;
        private Integer remainingInventory;
        private Integer soldInventory;
        private PriceModel channelPrice;
        private PriceModel hotelPrice;
        private PriceModel agentPrice;
        private Integer minStayDays;
        private Integer maxStayDays;
        private Integer minAdvanceDays;
        private Integer maxAdvanceDays;
        private Integer latestCancelDays;
        private String latestCancelTimeSameDay;
        private String paymentType;
        private String latestReservationTimeSameDay;
        private Boolean isCancellable;
        private java.math.BigDecimal cancelPenalty;

        public String getDate() {
            return date;
        }

        public void setDate(String date) {
            this.date = date;
        }

        public String getIsAvailable() {
            return isAvailable;
        }

        public void setIsAvailable(String isAvailable) {
            this.isAvailable = isAvailable;
        }

        public Integer getRemainingInventory() {
            return remainingInventory;
        }

        public void setRemainingInventory(Integer remainingInventory) {
            this.remainingInventory = remainingInventory;
        }

        public Integer getSoldInventory() {
            return soldInventory;
        }

        public void setSoldInventory(Integer soldInventory) {
            this.soldInventory = soldInventory;
        }

        public PriceModel getChannelPrice() {
            return channelPrice;
        }

        public void setChannelPrice(PriceModel channelPrice) {
            this.channelPrice = channelPrice;
        }

        public PriceModel getHotelPrice() {
            return hotelPrice;
        }

        public void setHotelPrice(PriceModel hotelPrice) {
            this.hotelPrice = hotelPrice;
        }

        public PriceModel getAgentPrice() {
            return agentPrice;
        }

        public void setAgentPrice(PriceModel agentPrice) {
            this.agentPrice = agentPrice;
        }

        public Integer getMinStayDays() {
            return minStayDays;
        }

        public void setMinStayDays(Integer minStayDays) {
            this.minStayDays = minStayDays;
        }

        public Integer getMaxStayDays() {
            return maxStayDays;
        }

        public void setMaxStayDays(Integer maxStayDays) {
            this.maxStayDays = maxStayDays;
        }

        public Integer getMinAdvanceDays() {
            return minAdvanceDays;
        }

        public void setMinAdvanceDays(Integer minAdvanceDays) {
            this.minAdvanceDays = minAdvanceDays;
        }

        public Integer getMaxAdvanceDays() {
            return maxAdvanceDays;
        }

        public void setMaxAdvanceDays(Integer maxAdvanceDays) {
            this.maxAdvanceDays = maxAdvanceDays;
        }

        public Integer getLatestCancelDays() {
            return latestCancelDays;
        }

        public void setLatestCancelDays(Integer latestCancelDays) {
            this.latestCancelDays = latestCancelDays;
        }

        public String getLatestCancelTimeSameDay() {
            return latestCancelTimeSameDay;
        }

        public void setLatestCancelTimeSameDay(String latestCancelTimeSameDay) {
            this.latestCancelTimeSameDay = latestCancelTimeSameDay;
        }

        public String getPaymentType() {
            return paymentType;
        }

        public void setPaymentType(String paymentType) {
            this.paymentType = paymentType;
        }

        public String getLatestReservationTimeSameDay() {
            return latestReservationTimeSameDay;
        }

        public void setLatestReservationTimeSameDay(String latestReservationTimeSameDay) {
            this.latestReservationTimeSameDay = latestReservationTimeSameDay;
        }

        public Boolean getIsCancellable() {
            return isCancellable;
        }

        public void setIsCancellable(Boolean isCancellable) {
            this.isCancellable = isCancellable;
        }

        public java.math.BigDecimal getCancelPenalty() {
            return cancelPenalty;
        }

        public void setCancelPenalty(java.math.BigDecimal cancelPenalty) {
            this.cancelPenalty = cancelPenalty;
        }
    }

    /**
     * 套餐模型
     */
    public static class PackageModel {
        private String packageCode;
        private String packageDescription;

        public String getPackageCode() {
            return packageCode;
        }

        public void setPackageCode(String packageCode) {
            this.packageCode = packageCode;
        }

        public String getPackageDescription() {
            return packageDescription;
        }

        public void setPackageDescription(String packageDescription) {
            this.packageDescription = packageDescription;
        }
    }
} 