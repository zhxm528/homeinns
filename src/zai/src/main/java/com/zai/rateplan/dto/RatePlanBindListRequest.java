package com.zai.rateplan.dto;

/**
 * 价格方案绑定列表请求DTO
 */
public class RatePlanBindListRequest {
    private String chainId;
    private String hotelId;
    private String ratecodeId;
    

    // Getters and Setters
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

    public String getRatecodeId() {
        return ratecodeId;
    }

    public void setRatecodeId(String ratecodeId) {
        this.ratecodeId = ratecodeId;
    }

   
} 