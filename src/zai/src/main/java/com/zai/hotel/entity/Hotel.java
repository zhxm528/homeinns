package com.zai.hotel.entity;

import lombok.Data;
import java.util.Date;
import java.math.BigDecimal;

@Data
public class Hotel {
    private String hotelId;
    private String chainId;
    private String chainCode;
    private String chainName;
    private String hotelCode;
    private String hotelName;
    private String address;
    private String description;
    private String cityId;
    private String cityName;
    private String country;
    private String contactEmail;
    private String contactPhone;
    private Integer status;
    private String ownershipType;
    private String managementModel;
    private String managementCompany;
    private String brand;
    private String region;
    private String cityArea;
    private String pmsVersion;
    private Date openingDate;
    private Date lastRenovationDate;
    private Date closureDate;
    private Integer totalPhysicalRooms;
    private BigDecimal basePrice;
    private BigDecimal thresholdPrice;
    private BigDecimal breakfastPrice;
    private BigDecimal parkingPrice;
    private Date createdAt;
    private Date updatedAt;

    // Getters and Setters
    public String getCityName() {
        return cityName;
    }

    public void setCityName(String cityName) {
        this.cityName = cityName;
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

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCityId() {
        return cityId;
    }

    public void setCityId(String cityId) {
        this.cityId = cityId;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getContactEmail() {
        return contactEmail;
    }

    public void setContactEmail(String contactEmail) {
        this.contactEmail = contactEmail;
    }

    public String getContactPhone() {
        return contactPhone;
    }

    public void setContactPhone(String contactPhone) {
        this.contactPhone = contactPhone;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public String getOwnershipType() {
        return ownershipType;
    }

    public void setOwnershipType(String ownershipType) {
        this.ownershipType = ownershipType;
    }

    public String getManagementModel() {
        return managementModel;
    }

    public void setManagementModel(String managementModel) {
        this.managementModel = managementModel;
    }

    public String getManagementCompany() {
        return managementCompany;
    }

    public void setManagementCompany(String managementCompany) {
        this.managementCompany = managementCompany;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    public String getCityArea() {
        return cityArea;
    }

    public void setCityArea(String cityArea) {
        this.cityArea = cityArea;
    }

    public String getPmsVersion() {
        return pmsVersion;
    }

    public void setPmsVersion(String pmsVersion) {
        this.pmsVersion = pmsVersion;
    }

    public Date getOpeningDate() {
        return openingDate;
    }

    public void setOpeningDate(Date openingDate) {
        this.openingDate = openingDate;
    }

    public Date getLastRenovationDate() {
        return lastRenovationDate;
    }

    public void setLastRenovationDate(Date lastRenovationDate) {
        this.lastRenovationDate = lastRenovationDate;
    }

    public Date getClosureDate() {
        return closureDate;
    }

    public void setClosureDate(Date closureDate) {
        this.closureDate = closureDate;
    }

    public Integer getTotalPhysicalRooms() {
        return totalPhysicalRooms;
    }

    public void setTotalPhysicalRooms(Integer totalPhysicalRooms) {
        this.totalPhysicalRooms = totalPhysicalRooms;
    }

    public BigDecimal getBasePrice() {
        return basePrice;
    }

    public void setBasePrice(BigDecimal basePrice) {
        this.basePrice = basePrice;
    }

    public BigDecimal getThresholdPrice() {
        return thresholdPrice;
    }

    public void setThresholdPrice(BigDecimal thresholdPrice) {
        this.thresholdPrice = thresholdPrice;
    }

    public BigDecimal getBreakfastPrice() {
        return breakfastPrice;
    }

    public void setBreakfastPrice(BigDecimal breakfastPrice) {
        this.breakfastPrice = breakfastPrice;
    }

    public BigDecimal getParkingPrice() {
        return parkingPrice;
    }

    public void setParkingPrice(BigDecimal parkingPrice) {
        this.parkingPrice = parkingPrice;
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

    public String getChainCode() {
        return chainCode;
    }

    public void setChainCode(String chainCode) {
        this.chainCode = chainCode;
    }

    public String getChainName() {
        return chainName;
    }

    public void setChainName(String chainName) {
        this.chainName = chainName;
    }
} 