package com.zai.roomtype.dto;

import com.zai.roomtype.entity.RoomType;
import java.math.BigDecimal;

public class RoomTypeAddRequest {
    
    private Userdebug user;
    private String hotelId;
    private String chainId;
    private String roomTypeCode;
    private String roomTypeName;
    private String description;
    private BigDecimal standardPrice;
    private Integer maxOccupancy;
    private Integer physicalInventory;
    private Integer status;

    

    public Userdebug getUser() {
        return user;
    }

    public void setUser(Userdebug user) {
        this.user = user;
    }

    public String getHotelId() {
        return hotelId;
    }

    public void setHotelId(String hotelId) {
        this.hotelId = hotelId;
    }

    public String getChainId() {
        return chainId;
    }

    public void setChainId(String chainId) {
        this.chainId = chainId;
    }

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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getStandardPrice() {
        return standardPrice;
    }

    public void setStandardPrice(BigDecimal standardPrice) {
        this.standardPrice = standardPrice;
    }

    public Integer getMaxOccupancy() {
        return maxOccupancy;
    }

    public void setMaxOccupancy(Integer maxOccupancy) {
        this.maxOccupancy = maxOccupancy;
    }

    public Integer getPhysicalInventory() {
        return physicalInventory;
    }

    public void setPhysicalInventory(Integer physicalInventory) {
        this.physicalInventory = physicalInventory;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public static class Userdebug {
        private String userId;
        private String username;

        public String getUserId() {
            return userId;
        }

        public void setUserId(String userId) {
            this.userId = userId;
        }

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }
    }
} 