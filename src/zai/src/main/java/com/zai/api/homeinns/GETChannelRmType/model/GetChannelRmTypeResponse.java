package com.zai.api.homeinns.GETChannelRmType.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class GetChannelRmTypeResponse {
    @JsonProperty("ResCode")
    private String resCode;
    
    @JsonProperty("ResDesc")
    private String resDesc;
    
    @JsonProperty("ChannelRmtypes")
    private List<ChannelRmType> channelRmtypes;

    public String getResCode() {
        return resCode;
    }

    public void setResCode(String resCode) {
        this.resCode = resCode;
    }

    public String getResDesc() {
        return resDesc;
    }

    public void setResDesc(String resDesc) {
        this.resDesc = resDesc;
    }

    public List<ChannelRmType> getChannelRmtypes() {
        return channelRmtypes;
    }

    public void setChannelRmtypes(List<ChannelRmType> channelRmtypes) {
        this.channelRmtypes = channelRmtypes;
    }

    public static class ChannelRmType {
        @JsonProperty("HotelCd")
        private String hotelCd;
        
        @JsonProperty("RmTypeCd")
        private String rmTypeCd;

        public String getHotelCd() {
            return hotelCd;
        }

        public void setHotelCd(String hotelCd) {
            this.hotelCd = hotelCd;
        }

        public String getRmTypeCd() {
            return rmTypeCd;
        }

        public void setRmTypeCd(String rmTypeCd) {
            this.rmTypeCd = rmTypeCd;
        }
    }
} 