package com.zai.booking.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.Date;
import java.util.List;

/**
 * 预订列表查询请求DTO
 */
public class BookingListRequest {
    
    /**
     * 连锁ID
     */
    @JsonProperty("chainId")
    private String chainId;
    
    /**
     * 酒店ID
     */
    @JsonProperty("hotelId")
    private String hotelId;
    
    /**
     * 预订ID
     */
    @JsonProperty("bookingId")
    private String bookingId;
    
    /**
     * 客人姓名
     */
    @JsonProperty("guestName")
    private String guestName;
    
    /**
     * 预订人姓名
     */
    @JsonProperty("bookerName")
    private String bookerName;
    
    /**
     * 渠道代码
     */
    @JsonProperty("channelCode")
    private String channelCode;
    
    /**
     * 房价码
     */
    @JsonProperty("rateCode")
    private String rateCode;
    
    /**
     * 房型代码
     */
    @JsonProperty("roomTypeCode")
    private String roomTypeCode;
    
    /**
     * 入住日期开始
     */
    @JsonProperty("checkInDateStart")
    private Date checkInDateStart;
    
    /**
     * 入住日期结束
     */
    @JsonProperty("checkInDateEnd")
    private Date checkInDateEnd;
    
    /**
     * 离店日期开始
     */
    @JsonProperty("checkOutDateStart")
    private Date checkOutDateStart;
    
    /**
     * 离店日期结束
     */
    @JsonProperty("checkOutDateEnd")
    private Date checkOutDateEnd;
    
    /**
     * 预订状态
     */
    @JsonProperty("bookingStatus")
    private List<String> bookingStatus;
    
    /**
     * CRS预订号
     */
    @JsonProperty("crsResvNo")
    private String crsResvNo;
    
    /**
     * 渠道预订号
     */
    @JsonProperty("channelResvNo")
    private String channelResvNo;
    
    /**
     * 酒店预订号
     */
    @JsonProperty("hotelResvNo")
    private String hotelResvNo;
    
    /**
     * 渠道代码列表
     */
    @JsonProperty("channelCodes")
    private List<String> channelCodes;
    
    /**
     * 页码
     */
    @JsonProperty("page")
    private Integer page = 0;
    
    /**
     * 每页大小
     */
    @JsonProperty("size")
    private Integer size = 20;
    
    // 构造函数
    public BookingListRequest() {}
    
    // Getter和Setter方法
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
    
    public String getBookingId() {
        return bookingId;
    }
    
    public void setBookingId(String bookingId) {
        this.bookingId = bookingId;
    }
    
    public String getGuestName() {
        return guestName;
    }
    
    public void setGuestName(String guestName) {
        this.guestName = guestName;
    }
    
    public String getBookerName() {
        return bookerName;
    }
    
    public void setBookerName(String bookerName) {
        this.bookerName = bookerName;
    }
    
    public String getChannelCode() {
        return channelCode;
    }
    
    public void setChannelCode(String channelCode) {
        this.channelCode = channelCode;
    }
    
    public String getRateCode() {
        return rateCode;
    }
    
    public void setRateCode(String rateCode) {
        this.rateCode = rateCode;
    }
    
    public String getRoomTypeCode() {
        return roomTypeCode;
    }
    
    public void setRoomTypeCode(String roomTypeCode) {
        this.roomTypeCode = roomTypeCode;
    }
    
    public Date getCheckInDateStart() {
        return checkInDateStart;
    }
    
    public void setCheckInDateStart(Date checkInDateStart) {
        this.checkInDateStart = checkInDateStart;
    }
    
    public Date getCheckInDateEnd() {
        return checkInDateEnd;
    }
    
    public void setCheckInDateEnd(Date checkInDateEnd) {
        this.checkInDateEnd = checkInDateEnd;
    }
    
    public Date getCheckOutDateStart() {
        return checkOutDateStart;
    }
    
    public void setCheckOutDateStart(Date checkOutDateStart) {
        this.checkOutDateStart = checkOutDateStart;
    }
    
    public Date getCheckOutDateEnd() {
        return checkOutDateEnd;
    }
    
    public void setCheckOutDateEnd(Date checkOutDateEnd) {
        this.checkOutDateEnd = checkOutDateEnd;
    }
    
    public List<String> getBookingStatus() {
        return bookingStatus;
    }
    
    public void setBookingStatus(List<String> bookingStatus) {
        this.bookingStatus = bookingStatus;
    }
    
    public String getCrsResvNo() {
        return crsResvNo;
    }
    
    public void setCrsResvNo(String crsResvNo) {
        this.crsResvNo = crsResvNo;
    }
    
    public String getChannelResvNo() {
        return channelResvNo;
    }
    
    public void setChannelResvNo(String channelResvNo) {
        this.channelResvNo = channelResvNo;
    }
    
    public String getHotelResvNo() {
        return hotelResvNo;
    }
    
    public void setHotelResvNo(String hotelResvNo) {
        this.hotelResvNo = hotelResvNo;
    }
    
    public List<String> getChannelCodes() {
        return channelCodes;
    }
    
    public void setChannelCodes(List<String> channelCodes) {
        this.channelCodes = channelCodes;
    }
    
    public Integer getPage() {
        return page;
    }
    
    public void setPage(Integer page) {
        this.page = page;
    }
    
    public Integer getSize() {
        return size;
    }
    
    public void setSize(Integer size) {
        this.size = size;
    }
    
    @Override
    public String toString() {
        return "BookingListRequest{" +
                "chainId='" + chainId + '\'' +
                ", hotelId='" + hotelId + '\'' +
                ", bookingId='" + bookingId + '\'' +
                ", guestName='" + guestName + '\'' +
                ", bookerName='" + bookerName + '\'' +
                ", channelCode='" + channelCode + '\'' +
                ", rateCode='" + rateCode + '\'' +
                ", roomTypeCode='" + roomTypeCode + '\'' +
                ", checkInDateStart=" + checkInDateStart +
                ", checkInDateEnd=" + checkInDateEnd +
                ", checkOutDateStart=" + checkOutDateStart +
                ", checkOutDateEnd=" + checkOutDateEnd +
                ", bookingStatus=" + bookingStatus +
                ", crsResvNo='" + crsResvNo + '\'' +
                ", channelResvNo='" + channelResvNo + '\'' +
                ", hotelResvNo='" + hotelResvNo + '\'' +
                ", channelCodes=" + channelCodes +
                ", page=" + page +
                ", size=" + size +
                '}';
    }
} 