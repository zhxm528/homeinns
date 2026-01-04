package com.zai.chain.dto;

import java.util.List;

/**
 * 如家渠道房型查询响应DTO
 */
public class HomeinnsChannelRmTypeResponse {
    
    private List<ChannelRmType> ChannelRmtypes;
    private Integer ResCode;
    private String ResDesc;
    
    public static class ChannelRmType {
        private String HotelCd;
        private String RmTypeCd;
        
        public ChannelRmType() {}
        
        public ChannelRmType(String HotelCd, String RmTypeCd) {
            this.HotelCd = HotelCd;
            this.RmTypeCd = RmTypeCd;
        }
        
        public String getHotelCd() {
            return HotelCd;
        }
        
        public void setHotelCd(String hotelCd) {
            this.HotelCd = hotelCd;
        }
        
        public String getRmTypeCd() {
            return RmTypeCd;
        }
        
        public void setRmTypeCd(String rmTypeCd) {
            this.RmTypeCd = rmTypeCd;
        }
    }
    
    public HomeinnsChannelRmTypeResponse() {}
    
    public List<ChannelRmType> getChannelRmtypes() {
        return ChannelRmtypes;
    }
    
    public void setChannelRmtypes(List<ChannelRmType> channelRmtypes) {
        this.ChannelRmtypes = channelRmtypes;
    }
    
    public Integer getResCode() {
        return ResCode;
    }
    
    public void setResCode(Integer resCode) {
        this.ResCode = resCode;
    }
    
    public String getResDesc() {
        return ResDesc;
    }
    
    public void setResDesc(String resDesc) {
        this.ResDesc = resDesc;
    }
} 