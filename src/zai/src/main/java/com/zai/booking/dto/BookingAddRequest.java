package com.zai.booking.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.Date;
import java.math.BigDecimal;
import java.util.List;

/**
 * 预订添加请求DTO
 */
public class BookingAddRequest {
    
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
     * 酒店代码
     */
    @JsonProperty("hotelCode")
    private String hotelCode;
    
    /**
     * 房型代码
     */
    @JsonProperty("roomTypeCode")
    private String roomTypeCode;
    
    /**
     * 房型名称
     */
    @JsonProperty("roomTypeName")
    private String roomTypeName;
    
    /**
     * 房价码
     */
    @JsonProperty("rateCode")
    private String rateCode;
    
    /**
     * 房价码名称
     */
    @JsonProperty("rateCodeName")
    private String rateCodeName;
    
    /**
     * 套餐代码
     */
    @JsonProperty("packageCode")
    private String packageCode;
    
    /**
     * 套餐名称
     */
    @JsonProperty("packageName")
    private String packageName;
    
    /**
     * 套餐数量
     */
    @JsonProperty("packageQuantity")
    private Integer packageQuantity;
    
    /**
     * 套餐单价
     */
    @JsonProperty("packageUnitPrice")
    private BigDecimal packageUnitPrice;
    
    /**
     * 渠道代码
     */
    @JsonProperty("channelCode")
    private String channelCode;
    
    /**
     * 入住日期
     */
    @JsonProperty("checkInDate")
    private Date checkInDate;
    
    /**
     * 离店日期
     */
    @JsonProperty("checkOutDate")
    private Date checkOutDate;
    
    /**
     * 每日房间数
     */
    @JsonProperty("roomsPerDay")
    private Integer roomsPerDay;
    
    /**
     * 每间房客人数
     */
    @JsonProperty("guestsPerRoom")
    private Integer guestsPerRoom;
    
    /**
     * 客人信息
     */
    @JsonProperty("guest")
    private GuestInfo guest;
    
    /**
     * 预订人信息
     */
    @JsonProperty("booker")
    private BookerInfo booker;
    
    /**
     * 公司信息
     */
    @JsonProperty("company")
    private CompanyInfo company;
    
    /**
     * 每日价格信息
     */
    @JsonProperty("dailyPrices")
    private List<DailyPriceInfo> dailyPrices;
    
    /**
     * 酒店备注
     */
    @JsonProperty("remarkHotel")
    private String remarkHotel;
    
    /**
     * 渠道备注
     */
    @JsonProperty("remarkChannel")
    private String remarkChannel;
    
    /**
     * 代理商备注
     */
    @JsonProperty("remarkAgent")
    private String remarkAgent;
    
    /**
     * 客人备注
     */
    @JsonProperty("remarkGuest")
    private String remarkGuest;
    
    /**
     * 特殊备注
     */
    @JsonProperty("remarkSpecial")
    private String remarkSpecial;
    
    /**
     * 发票备注
     */
    @JsonProperty("remarkInvoice")
    private String remarkInvoice;
    
    /**
     * 取消备注
     */
    @JsonProperty("remarkCancel")
    private String remarkCancel;
    
    /**
     * 特殊要求
     */
    @JsonProperty("specialRequests")
    private String specialRequests;
    
    /**
     * 用户ID
     */
    @JsonProperty("userId")
    private String userId;
    
   
    /**
     * 渠道预订号
     */
    @JsonProperty("channelResvNo")
    private String channelResvNo;
    
    /**
     * 渠道预订子号
     */
    @JsonProperty("channelResvSno")
    private String channelResvSno;
    
    /**
     * 渠道预订父号
     */
    @JsonProperty("channelResvPno")
    private String channelResvPno;
    
    /**
     * CRS预订号
     */
    @JsonProperty("crsResvNo")
    private String crsResvNo;
    
    /**
     * CRS预订父号
     */
    @JsonProperty("crsResvPno")
    private String crsResvPno;
    
    /**
     * CRS入住号
     */
    @JsonProperty("crsResvCheckinNo")
    private String crsResvCheckinNo;
    
    /**
     * 代理商预订号
     */
    @JsonProperty("agentResvNo")
    private String agentResvNo;
    
    /**
     * 代理商预订父号
     */
    @JsonProperty("agentResvPno")
    private String agentResvPno;
    
    /**
     * 酒店预订号
     */
    @JsonProperty("hotelResvNo")
    private String hotelResvNo;
    
    /**
     * 酒店预订键
     */
    @JsonProperty("hotelResvKey")
    private String hotelResvKey;
    
    /**
     * 酒店预订确认号
     */
    @JsonProperty("hotelResvConfirm")
    private String hotelResvConfirm;
    
    /**
     * 酒店房间号
     */
    @JsonProperty("hotelRoomNo")
    private String hotelRoomNo;
    
    /**
     * 支付类型
     */
    @JsonProperty("paymentType")
    private String paymentType;
    
    /**
     * 预订类型
     */
    @JsonProperty("reservationType")
    private String reservationType;
    
    /**
     * 取消类型
     */
    @JsonProperty("cancellationType")
    private String cancellationType;
    
    /**
     * 最晚取消天数
     */
    @JsonProperty("latestCancellationDays")
    private Integer latestCancellationDays;
    
    /**
     * 最晚取消时间
     */
    @JsonProperty("latestCancellationTime")
    private Date latestCancellationTime;
    
    /**
     * 预订后是否可取消
     */
    @JsonProperty("cancellableAfterBooking")
    private Boolean cancellableAfterBooking;
    
    /**
     * 订单保留时间
     */
    @JsonProperty("orderRetentionTime")
    private Date orderRetentionTime;
    
    /**
     * 到达时间
     */
    @JsonProperty("arrivalTime")
    private Date arrivalTime;
    
    /**
     * 渠道子代码
     */
    @JsonProperty("channelSubcode")
    private String channelSubcode;
    
    /**
     * 预订人代码
     */
    @JsonProperty("bookerCode")
    private String bookerCode;
    
    /**
     * 代理商代码
     */
    @JsonProperty("agentCode")
    private String agentCode;
    
    /**
     * 来源代码
     */
    @JsonProperty("sourceCode")
    private String sourceCode;
    
    /**
     * 市场代码
     */
    @JsonProperty("marketCode")
    private String marketCode;
    
    /**
     * 预订人类型
     */
    @JsonProperty("bookerType")
    private String bookerType;
    
    /**
     * 预订类型
     */
    @JsonProperty("bookingType")
    private String bookingType;
    
    /**
     * 押金金额-渠道
     */
    @JsonProperty("depositAmountChannel")
    private BigDecimal depositAmountChannel;
    
    /**
     * 押金金额-代理商
     */
    @JsonProperty("depositAmountAgent")
    private BigDecimal depositAmountAgent;
    
    /**
     * 押金金额-酒店
     */
    @JsonProperty("depositAmountHotel")
    private BigDecimal depositAmountHotel;
    
    /**
     * 罚金金额-渠道
     */
    @JsonProperty("penaltyAmountChannel")
    private BigDecimal penaltyAmountChannel;
    
    /**
     * 罚金金额-酒店
     */
    @JsonProperty("penaltyAmountHotel")
    private BigDecimal penaltyAmountHotel;
    
    /**
     * 罚金金额-代理商
     */
    @JsonProperty("penaltyAmountAgent")
    private BigDecimal penaltyAmountAgent;
    
    /**
     * 餐饮费用-酒店
     */
    @JsonProperty("cateringFeeHotel")
    private BigDecimal cateringFeeHotel;
    
    /**
     * 宴会费用-酒店
     */
    @JsonProperty("banquetFeeHotel")
    private BigDecimal banquetFeeHotel;
    
    /**
     * 其他费用-酒店
     */
    @JsonProperty("otherFeeHotel")
    private BigDecimal otherFeeHotel;
    
    /**
     * 总收入费用-酒店
     */
    @JsonProperty("totalRevenueFeeHotel")
    private BigDecimal totalRevenueFeeHotel;
    
    // 内部类：客人信息
    public static class GuestInfo {
        private String guestName;
        private String guestEname;
        private String phone;
        private String email;
        private String memberNumber;
        private String memberType;
        
        // Getter和Setter
        public String getGuestName() { return guestName; }
        public void setGuestName(String guestName) { this.guestName = guestName; }
        
        public String getGuestEname() { return guestEname; }
        public void setGuestEname(String guestEname) { this.guestEname = guestEname; }
        
        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
        
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        
        public String getMemberNumber() { return memberNumber; }
        public void setMemberNumber(String memberNumber) { this.memberNumber = memberNumber; }
        
        public String getMemberType() { return memberType; }
        public void setMemberType(String memberType) { this.memberType = memberType; }
    }
    
    // 内部类：预订人信息
    public static class BookerInfo {
        private String bookerName;
        private String phone;
        private String email;
        private String memberNumber;
        private String memberType;
        
        // Getter和Setter
        public String getBookerName() { return bookerName; }
        public void setBookerName(String bookerName) { this.bookerName = bookerName; }
        
        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
        
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        
        public String getMemberNumber() { return memberNumber; }
        public void setMemberNumber(String memberNumber) { this.memberNumber = memberNumber; }
        
        public String getMemberType() { return memberType; }
        public void setMemberType(String memberType) { this.memberType = memberType; }
    }
    
    // 内部类：公司信息
    public static class CompanyInfo {
        private String companyName;
        private String contactPerson;
        private String contactPhone;
        private String contactEmail;
        private String memberNumber;
        private String memberType;
        
        // Getter和Setter
        public String getCompanyName() { return companyName; }
        public void setCompanyName(String companyName) { this.companyName = companyName; }
        
        public String getContactPerson() { return contactPerson; }
        public void setContactPerson(String contactPerson) { this.contactPerson = contactPerson; }
        
        public String getContactPhone() { return contactPhone; }
        public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }
        
        public String getContactEmail() { return contactEmail; }
        public void setContactEmail(String contactEmail) { this.contactEmail = contactEmail; }
        
        public String getMemberNumber() { return memberNumber; }
        public void setMemberNumber(String memberNumber) { this.memberNumber = memberNumber; }
        
        public String getMemberType() { return memberType; }
        public void setMemberType(String memberType) { this.memberType = memberType; }
    }
    
    // 内部类：每日价格信息
    public static class DailyPriceInfo {
        private Date stayDate;
        private Integer rooms;
        private String roomTypeCode;
        private String roomTypeName;
        private String rateCode;
        private String rateCodeName;
        private String packageCode;
        private String packageName;
        private Integer packageQuantity;
        private BigDecimal packageUnitPrice;
        private String hotelRoomNo;
        private BigDecimal priceChannel;
        private BigDecimal priceHotel;
        private BigDecimal priceAgent;
        
        // Getter和Setter
        public Date getStayDate() { return stayDate; }
        public void setStayDate(Date stayDate) { this.stayDate = stayDate; }
        
        public Integer getRooms() { return rooms; }
        public void setRooms(Integer rooms) { this.rooms = rooms; }
        
        public String getRoomTypeCode() { return roomTypeCode; }
        public void setRoomTypeCode(String roomTypeCode) { this.roomTypeCode = roomTypeCode; }
        
        public String getRoomTypeName() { return roomTypeName; }
        public void setRoomTypeName(String roomTypeName) { this.roomTypeName = roomTypeName; }
        
        public String getRateCode() { return rateCode; }
        public void setRateCode(String rateCode) { this.rateCode = rateCode; }
        
        public String getRateCodeName() { return rateCodeName; }
        public void setRateCodeName(String rateCodeName) { this.rateCodeName = rateCodeName; }
        
        public String getPackageCode() { return packageCode; }
        public void setPackageCode(String packageCode) { this.packageCode = packageCode; }
        
        public String getPackageName() { return packageName; }
        public void setPackageName(String packageName) { this.packageName = packageName; }
        
        public Integer getPackageQuantity() { return packageQuantity; }
        public void setPackageQuantity(Integer packageQuantity) { this.packageQuantity = packageQuantity; }
        
        public BigDecimal getPackageUnitPrice() { return packageUnitPrice; }
        public void setPackageUnitPrice(BigDecimal packageUnitPrice) { this.packageUnitPrice = packageUnitPrice; }
        
        public String getHotelRoomNo() { return hotelRoomNo; }
        public void setHotelRoomNo(String hotelRoomNo) { this.hotelRoomNo = hotelRoomNo; }
        
        public BigDecimal getPriceChannel() { return priceChannel; }
        public void setPriceChannel(BigDecimal priceChannel) { this.priceChannel = priceChannel; }
        
        public BigDecimal getPriceHotel() { return priceHotel; }
        public void setPriceHotel(BigDecimal priceHotel) { this.priceHotel = priceHotel; }
        
        public BigDecimal getPriceAgent() { return priceAgent; }
        public void setPriceAgent(BigDecimal priceAgent) { this.priceAgent = priceAgent; }
    }
    
    // 构造函数
    public BookingAddRequest() {}
    
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
    
    public String getRoomTypeCode() {
        return roomTypeCode;
    }
    
    public void setRoomTypeCode(String roomTypeCode) {
        this.roomTypeCode = roomTypeCode;
    }
    
    public String getRateCode() {
        return rateCode;
    }
    
    public void setRateCode(String rateCode) {
        this.rateCode = rateCode;
    }
    
    public String getChannelCode() {
        return channelCode;
    }
    
    public void setChannelCode(String channelCode) {
        this.channelCode = channelCode;
    }
    
    public Date getCheckInDate() {
        return checkInDate;
    }
    
    public void setCheckInDate(Date checkInDate) {
        this.checkInDate = checkInDate;
    }
    
    public Date getCheckOutDate() {
        return checkOutDate;
    }
    
    public void setCheckOutDate(Date checkOutDate) {
        this.checkOutDate = checkOutDate;
    }
    
    public String getHotelCode() {
        return hotelCode;
    }
    
    public void setHotelCode(String hotelCode) {
        this.hotelCode = hotelCode;
    }
    
    public String getRoomTypeName() {
        return roomTypeName;
    }
    
    public void setRoomTypeName(String roomTypeName) {
        this.roomTypeName = roomTypeName;
    }
    
    public String getRateCodeName() {
        return rateCodeName;
    }
    
    public void setRateCodeName(String rateCodeName) {
        this.rateCodeName = rateCodeName;
    }
    
    public String getPackageCode() {
        return packageCode;
    }
    
    public void setPackageCode(String packageCode) {
        this.packageCode = packageCode;
    }
    
    public String getPackageName() {
        return packageName;
    }
    
    public void setPackageName(String packageName) {
        this.packageName = packageName;
    }
    
    public Integer getPackageQuantity() {
        return packageQuantity;
    }
    
    public void setPackageQuantity(Integer packageQuantity) {
        this.packageQuantity = packageQuantity;
    }
    
    public BigDecimal getPackageUnitPrice() {
        return packageUnitPrice;
    }
    
    public void setPackageUnitPrice(BigDecimal packageUnitPrice) {
        this.packageUnitPrice = packageUnitPrice;
    }
    
    public Integer getRoomsPerDay() {
        return roomsPerDay;
    }
    
    public void setRoomsPerDay(Integer roomsPerDay) {
        this.roomsPerDay = roomsPerDay;
    }
    
    public Integer getGuestsPerRoom() {
        return guestsPerRoom;
    }
    
    public void setGuestsPerRoom(Integer guestsPerRoom) {
        this.guestsPerRoom = guestsPerRoom;
    }
    
    public GuestInfo getGuest() {
        return guest;
    }
    
    public void setGuest(GuestInfo guest) {
        this.guest = guest;
    }
    
    public BookerInfo getBooker() {
        return booker;
    }
    
    public void setBooker(BookerInfo booker) {
        this.booker = booker;
    }
    
    public CompanyInfo getCompany() {
        return company;
    }
    
    public void setCompany(CompanyInfo company) {
        this.company = company;
    }
    
    public List<DailyPriceInfo> getDailyPrices() {
        return dailyPrices;
    }
    
    public void setDailyPrices(List<DailyPriceInfo> dailyPrices) {
        this.dailyPrices = dailyPrices;
    }
    
    public String getRemarkHotel() {
        return remarkHotel;
    }
    
    public void setRemarkHotel(String remarkHotel) {
        this.remarkHotel = remarkHotel;
    }
    
    public String getRemarkChannel() {
        return remarkChannel;
    }
    
    public void setRemarkChannel(String remarkChannel) {
        this.remarkChannel = remarkChannel;
    }
    
    public String getRemarkAgent() {
        return remarkAgent;
    }
    
    public void setRemarkAgent(String remarkAgent) {
        this.remarkAgent = remarkAgent;
    }
    
    public String getRemarkGuest() {
        return remarkGuest;
    }
    
    public void setRemarkGuest(String remarkGuest) {
        this.remarkGuest = remarkGuest;
    }
    
    public String getRemarkSpecial() {
        return remarkSpecial;
    }
    
    public void setRemarkSpecial(String remarkSpecial) {
        this.remarkSpecial = remarkSpecial;
    }
    
    public String getRemarkInvoice() {
        return remarkInvoice;
    }
    
    public void setRemarkInvoice(String remarkInvoice) {
        this.remarkInvoice = remarkInvoice;
    }
    
    public String getRemarkCancel() {
        return remarkCancel;
    }
    
    public void setRemarkCancel(String remarkCancel) {
        this.remarkCancel = remarkCancel;
    }
    
    public String getSpecialRequests() {
        return specialRequests;
    }
    
    public void setSpecialRequests(String specialRequests) {
        this.specialRequests = specialRequests;
    }
    
    public String getUserId() {
        return userId;
    }
    
    public void setUserId(String userId) {
        this.userId = userId;
    }
    
    public String getChannelResvNo() {
        return channelResvNo;
    }
    
    public void setChannelResvNo(String channelResvNo) {
        this.channelResvNo = channelResvNo;
    }
    
    public String getChannelResvSno() {
        return channelResvSno;
    }
    
    public void setChannelResvSno(String channelResvSno) {
        this.channelResvSno = channelResvSno;
    }
    
    public String getChannelResvPno() {
        return channelResvPno;
    }
    
    public void setChannelResvPno(String channelResvPno) {
        this.channelResvPno = channelResvPno;
    }
    
    public String getCrsResvNo() {
        return crsResvNo;
    }
    
    public void setCrsResvNo(String crsResvNo) {
        this.crsResvNo = crsResvNo;
    }
    
    public String getCrsResvPno() {
        return crsResvPno;
    }
    
    public void setCrsResvPno(String crsResvPno) {
        this.crsResvPno = crsResvPno;
    }
    
    public String getCrsResvCheckinNo() {
        return crsResvCheckinNo;
    }
    
    public void setCrsResvCheckinNo(String crsResvCheckinNo) {
        this.crsResvCheckinNo = crsResvCheckinNo;
    }
    
    public String getAgentResvNo() {
        return agentResvNo;
    }
    
    public void setAgentResvNo(String agentResvNo) {
        this.agentResvNo = agentResvNo;
    }
    
    public String getAgentResvPno() {
        return agentResvPno;
    }
    
    public void setAgentResvPno(String agentResvPno) {
        this.agentResvPno = agentResvPno;
    }
    
    public String getHotelResvNo() {
        return hotelResvNo;
    }
    
    public void setHotelResvNo(String hotelResvNo) {
        this.hotelResvNo = hotelResvNo;
    }
    
    public String getHotelResvKey() {
        return hotelResvKey;
    }
    
    public void setHotelResvKey(String hotelResvKey) {
        this.hotelResvKey = hotelResvKey;
    }
    
    public String getHotelResvConfirm() {
        return hotelResvConfirm;
    }
    
    public void setHotelResvConfirm(String hotelResvConfirm) {
        this.hotelResvConfirm = hotelResvConfirm;
    }
    
    public String getHotelRoomNo() {
        return hotelRoomNo;
    }
    
    public void setHotelRoomNo(String hotelRoomNo) {
        this.hotelRoomNo = hotelRoomNo;
    }
    
    public String getPaymentType() {
        return paymentType;
    }
    
    public void setPaymentType(String paymentType) {
        this.paymentType = paymentType;
    }
    
    public String getReservationType() {
        return reservationType;
    }
    
    public void setReservationType(String reservationType) {
        this.reservationType = reservationType;
    }
    
    public String getCancellationType() {
        return cancellationType;
    }
    
    public void setCancellationType(String cancellationType) {
        this.cancellationType = cancellationType;
    }
    
    public Integer getLatestCancellationDays() {
        return latestCancellationDays;
    }
    
    public void setLatestCancellationDays(Integer latestCancellationDays) {
        this.latestCancellationDays = latestCancellationDays;
    }
    
    public Date getLatestCancellationTime() {
        return latestCancellationTime;
    }
    
    public void setLatestCancellationTime(Date latestCancellationTime) {
        this.latestCancellationTime = latestCancellationTime;
    }
    
    public Boolean getCancellableAfterBooking() {
        return cancellableAfterBooking;
    }
    
    public void setCancellableAfterBooking(Boolean cancellableAfterBooking) {
        this.cancellableAfterBooking = cancellableAfterBooking;
    }
    
    public Date getOrderRetentionTime() {
        return orderRetentionTime;
    }
    
    public void setOrderRetentionTime(Date orderRetentionTime) {
        this.orderRetentionTime = orderRetentionTime;
    }
    
    public Date getArrivalTime() {
        return arrivalTime;
    }
    
    public void setArrivalTime(Date arrivalTime) {
        this.arrivalTime = arrivalTime;
    }
    
    public String getChannelSubcode() {
        return channelSubcode;
    }
    
    public void setChannelSubcode(String channelSubcode) {
        this.channelSubcode = channelSubcode;
    }
    
    public String getBookerCode() {
        return bookerCode;
    }
    
    public void setBookerCode(String bookerCode) {
        this.bookerCode = bookerCode;
    }
    
    public String getAgentCode() {
        return agentCode;
    }
    
    public void setAgentCode(String agentCode) {
        this.agentCode = agentCode;
    }
    
    public String getSourceCode() {
        return sourceCode;
    }
    
    public void setSourceCode(String sourceCode) {
        this.sourceCode = sourceCode;
    }
    
    public String getMarketCode() {
        return marketCode;
    }
    
    public void setMarketCode(String marketCode) {
        this.marketCode = marketCode;
    }
    
    public String getBookerType() {
        return bookerType;
    }
    
    public void setBookerType(String bookerType) {
        this.bookerType = bookerType;
    }
    
    public String getBookingType() {
        return bookingType;
    }
    
    public void setBookingType(String bookingType) {
        this.bookingType = bookingType;
    }
    
    public BigDecimal getDepositAmountChannel() {
        return depositAmountChannel;
    }
    
    public void setDepositAmountChannel(BigDecimal depositAmountChannel) {
        this.depositAmountChannel = depositAmountChannel;
    }
    
    public BigDecimal getDepositAmountAgent() {
        return depositAmountAgent;
    }
    
    public void setDepositAmountAgent(BigDecimal depositAmountAgent) {
        this.depositAmountAgent = depositAmountAgent;
    }
    
    public BigDecimal getDepositAmountHotel() {
        return depositAmountHotel;
    }
    
    public void setDepositAmountHotel(BigDecimal depositAmountHotel) {
        this.depositAmountHotel = depositAmountHotel;
    }
    
    public BigDecimal getPenaltyAmountChannel() {
        return penaltyAmountChannel;
    }
    
    public void setPenaltyAmountChannel(BigDecimal penaltyAmountChannel) {
        this.penaltyAmountChannel = penaltyAmountChannel;
    }
    
    public BigDecimal getPenaltyAmountHotel() {
        return penaltyAmountHotel;
    }
    
    public void setPenaltyAmountHotel(BigDecimal penaltyAmountHotel) {
        this.penaltyAmountHotel = penaltyAmountHotel;
    }
    
    public BigDecimal getPenaltyAmountAgent() {
        return penaltyAmountAgent;
    }
    
    public void setPenaltyAmountAgent(BigDecimal penaltyAmountAgent) {
        this.penaltyAmountAgent = penaltyAmountAgent;
    }
    
    public BigDecimal getCateringFeeHotel() {
        return cateringFeeHotel;
    }
    
    public void setCateringFeeHotel(BigDecimal cateringFeeHotel) {
        this.cateringFeeHotel = cateringFeeHotel;
    }
    
    public BigDecimal getBanquetFeeHotel() {
        return banquetFeeHotel;
    }
    
    public void setBanquetFeeHotel(BigDecimal banquetFeeHotel) {
        this.banquetFeeHotel = banquetFeeHotel;
    }
    
    public BigDecimal getOtherFeeHotel() {
        return otherFeeHotel;
    }
    
    public void setOtherFeeHotel(BigDecimal otherFeeHotel) {
        this.otherFeeHotel = otherFeeHotel;
    }
    
    public BigDecimal getTotalRevenueFeeHotel() {
        return totalRevenueFeeHotel;
    }
    
    public void setTotalRevenueFeeHotel(BigDecimal totalRevenueFeeHotel) {
        this.totalRevenueFeeHotel = totalRevenueFeeHotel;
    }
    
} 