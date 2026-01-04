package com.zai.hotelbudget.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * 酒店预算列表查询请求DTO
 */
public class HotelBudgetListRequest {
    
    /**
     * 预算年份
     */
    @JsonProperty("year")
    private Integer year;
    
    /**
     * 酒店ID
     */
    @JsonProperty("hotelId")
    private String hotelId;
    
    /**
     * 连锁ID
     */
    @JsonProperty("chainId")
    private String chainId;
    
    /**
     * 城市ID
     */
    @JsonProperty("cityId")
    private String cityId;
    
    /**
     * 酒店管理模式
     */
    @JsonProperty("hotelManagementModel")
    private String hotelManagementModel;
    
    // 构造函数
    public HotelBudgetListRequest() {}
    
    public HotelBudgetListRequest(Integer year, String hotelId, String chainId, String cityId, String hotelManagementModel) {
        this.year = year;
        this.hotelId = hotelId;
        this.chainId = chainId;
        this.cityId = cityId;
        this.hotelManagementModel = hotelManagementModel;
    }
    
    // Getter和Setter方法
    public Integer getYear() {
        return year;
    }
    
    public void setYear(Integer year) {
        this.year = year;
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
    
    public String getCityId() {
        return cityId;
    }
    
    public void setCityId(String cityId) {
        this.cityId = cityId;
    }
    
    public String getHotelManagementModel() {
        return hotelManagementModel;
    }
    
    public void setHotelManagementModel(String hotelManagementModel) {
        this.hotelManagementModel = hotelManagementModel;
    }
    
    @Override
    public String toString() {
        return "HotelBudgetListRequest{" +
                "year=" + year +
                ", hotelId='" + hotelId + '\'' +
                ", chainId='" + chainId + '\'' +
                ", cityId='" + cityId + '\'' +
                ", hotelManagementModel='" + hotelManagementModel + '\'' +
                '}';
    }
} 