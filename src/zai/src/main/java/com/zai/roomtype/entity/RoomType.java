package com.zai.roomtype.entity;

import java.math.BigDecimal;
import java.util.Date;

public class RoomType {
    private String roomTypeId;
    private String chainId;
    private String hotelId;
    private String hotelName;
    private String roomTypeCode;
    private String roomTypeName;
    private String description;
    private BigDecimal standardPrice;
    private Integer maxOccupancy;
    private Integer physicalInventory;
    private Integer status;
    private Date createdAt;
    private Date updatedAt;

    // Getters and Setters
    public Integer getPhysicalInventory() {
        return physicalInventory;
    }

    public void setPhysicalInventory(Integer physicalInventory) {
        this.physicalInventory = physicalInventory;
    }

    public String getRoomTypeId() {
        return roomTypeId;
    }

    public void setRoomTypeId(String roomTypeId) {
        this.roomTypeId = roomTypeId;
    }

    public String getChainId() {
        return chainId;
    }

    public void setChainId(String chainId) {
        this.chainId = chainId;
    }

    public String getHotelId() {
        return hotelId;
    }

    public void setHotelId(String hotelId) {
        this.hotelId = hotelId;
    }

    public String getHotelName() {
        return hotelName;
    }

    public void setHotelName(String hotelName) {
        this.hotelName = hotelName;
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

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }
} 