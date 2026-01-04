package com.zai.rateprices.model;

import java.util.List;

/**
 * 可用性查询请求模型
 */
public class AvailabilityRequestModel {
    private String chainId;
    private String hotelId;
    private List<String> roomTypeCode;
    private List<RoomTypeRateCodeMapping> roomTypeRateCodeMappings;
    private String startDate;
    private String endDate;
    private Integer pageNum;
    private Integer pageSize;

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

    public List<String> getRoomTypeCode() {
        return roomTypeCode;
    }

    public void setRoomTypeCode(List<String> roomTypeCode) {
        this.roomTypeCode = roomTypeCode;
    }

    public List<RoomTypeRateCodeMapping> getRoomTypeRateCodeMappings() {
        return roomTypeRateCodeMappings;
    }

    public void setRoomTypeRateCodeMappings(List<RoomTypeRateCodeMapping> roomTypeRateCodeMappings) {
        this.roomTypeRateCodeMappings = roomTypeRateCodeMappings;
    }

    public String getStartDate() {
        return startDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public String getEndDate() {
        return endDate;
    }

    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }

    public Integer getPageNum() {
        return pageNum;
    }

    public void setPageNum(Integer pageNum) {
        this.pageNum = pageNum;
    }

    public Integer getPageSize() {
        return pageSize;
    }

    public void setPageSize(Integer pageSize) {
        this.pageSize = pageSize;
    }

    /**
     * 房型与房价码映射关系
     */
    public static class RoomTypeRateCodeMapping {
        private String roomTypeCode;
        private List<String> rateCodes;

        public String getRoomTypeCode() {
            return roomTypeCode;
        }

        public void setRoomTypeCode(String roomTypeCode) {
            this.roomTypeCode = roomTypeCode;
        }

        public List<String> getRateCodes() {
            return rateCodes;
        }

        public void setRateCodes(List<String> rateCodes) {
            this.rateCodes = rateCodes;
        }
    }
} 