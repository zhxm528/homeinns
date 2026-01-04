package com.zai.api.homeinns.GETChannelRmType.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public class GetHotelInfoRequest {
    @JsonProperty("HotelCd")
    private String hotelCd;
    
    @JsonProperty("Terminal_License")
    private String terminal_License;
    
    @JsonProperty("Terminal_Seq")
    private String terminal_Seq;
    
    @JsonProperty("Terminal_OprId")
    private String terminal_OprId;
    
    @JsonProperty("chainId")
    private String chainId;

    @JsonProperty("description")
    private String description;

    public String getHotelCd() {
        return hotelCd;
    }

    public void setHotelCd(String hotelCd) {
        this.hotelCd = hotelCd;
    }

    public String getTerminal_License() {
        return terminal_License;
    }

    public void setTerminal_License(String terminal_License) {
        this.terminal_License = terminal_License;
    }

    public String getTerminal_Seq() {
        return terminal_Seq;
    }

    public void setTerminal_Seq(String terminal_Seq) {
        this.terminal_Seq = terminal_Seq;
    }

    public String getTerminal_OprId() {
        return terminal_OprId;
    }

    public void setTerminal_OprId(String terminal_OprId) {
        this.terminal_OprId = terminal_OprId;
    }
    
    public String getChainId() {
        return chainId;
    }
    
    public void setChainId(String chainId) {
        this.chainId = chainId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
} 