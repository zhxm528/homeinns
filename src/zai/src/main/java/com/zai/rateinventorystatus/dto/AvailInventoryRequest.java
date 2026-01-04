package com.zai.rateinventorystatus.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class AvailInventoryRequest {
    private String chainId;
    private String hotelId;
    private String availLevel;
    private List<RoomType> roomTypes;
    
    @JsonProperty("DateModel")
    private String dateModel;
    
    private List<DateRange> dateRanges;
    private String applicableWeekdays;
    private List<String> selectedDates;
    private String isAvailable;
    private RemainingInventory remainingInventory;

    // Getters and setters
    public String getChainId() { return chainId; }
    public void setChainId(String chainId) { this.chainId = chainId; }
    
    public String getHotelId() { return hotelId; }
    public void setHotelId(String hotelId) { this.hotelId = hotelId; }
    
    public String getAvailLevel() { return availLevel; }
    public void setAvailLevel(String availLevel) { this.availLevel = availLevel; }
    
    public List<RoomType> getRoomTypes() { return roomTypes; }
    public void setRoomTypes(List<RoomType> roomTypes) { this.roomTypes = roomTypes; }
    
    public String getDateModel() { return dateModel; }
    public void setDateModel(String dateModel) { this.dateModel = dateModel; }
    
    public List<DateRange> getDateRanges() { return dateRanges; }
    public void setDateRanges(List<DateRange> dateRanges) { this.dateRanges = dateRanges; }
    
    public String getApplicableWeekdays() { return applicableWeekdays; }
    public void setApplicableWeekdays(String applicableWeekdays) { this.applicableWeekdays = applicableWeekdays; }
    
    public List<String> getSelectedDates() { return selectedDates; }
    public void setSelectedDates(List<String> selectedDates) { this.selectedDates = selectedDates; }
    
    public String getIsAvailable() { return isAvailable; }
    public void setIsAvailable(String isAvailable) { this.isAvailable = isAvailable; }
    
    public RemainingInventory getRemainingInventory() { return remainingInventory; }
    public void setRemainingInventory(RemainingInventory remainingInventory) { this.remainingInventory = remainingInventory; }

    @Override
    public String toString() {
        return "AvailInventoryRequest{" +
                "chainId='" + chainId + '\'' +
                ", hotelId='" + hotelId + '\'' +
                ", availLevel='" + availLevel + '\'' +
                ", roomTypes=" + roomTypes +
                ", dateModel='" + dateModel + '\'' +
                ", dateRanges=" + dateRanges +
                ", applicableWeekdays='" + applicableWeekdays + '\'' +
                ", selectedDates=" + selectedDates +
                ", isAvailable='" + isAvailable + '\'' +
                ", remainingInventory=" + remainingInventory +
                '}';
    }

    public static class RoomType {
        private String id;
        private String code;
        private List<RateCode> rateCodes;
        
        // Getters and setters
        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        
        public String getCode() { return code; }
        public void setCode(String code) { this.code = code; }
        
        public List<RateCode> getRateCodes() { return rateCodes; }
        public void setRateCodes(List<RateCode> rateCodes) { this.rateCodes = rateCodes; }
        
        @Override
        public String toString() {
            return "RoomType{" +
                    "id='" + id + '\'' +
                    ", code='" + code + '\'' +
                    ", rateCodes=" + rateCodes +
                    '}';
        }
    }

    public static class RateCode {
        private String id;
        private String code;
        
        // Getters and setters
        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        
        public String getCode() { return code; }
        public void setCode(String code) { this.code = code; }
        
        @Override
        public String toString() {
            return "RateCode{" +
                    "id='" + id + '\'' +
                    ", code='" + code + '\'' +
                    '}';
        }
    }

    public static class DateRange {
        private String startDate;
        private String endDate;
        
        // Getters and setters
        public String getStartDate() { return startDate; }
        public void setStartDate(String startDate) { this.startDate = startDate; }
        
        public String getEndDate() { return endDate; }
        public void setEndDate(String endDate) { this.endDate = endDate; }
        
        @Override
        public String toString() {
            return "DateRange{" +
                    "startDate='" + startDate + '\'' +
                    ", endDate='" + endDate + '\'' +
                    '}';
        }
    }

    public static class RemainingInventory {
        private String type;
        private Integer value;
        
        // Getters and setters
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }
        
        public Integer getValue() { return value; }
        public void setValue(Integer value) { this.value = value; }
        
        @Override
        public String toString() {
            return "RemainingInventory{" +
                    "type='" + type + '\'' +
                    ", value=" + value +
                    '}';
        }
    }
} 