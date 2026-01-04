package com.zai.booking.dto;

import java.util.List;

/**
 * 预订列表响应DTO
 */
public class BookingListResponse {
    private String status;
    private Data data;

    public static class Data {
        private List<BookingSimple> bookings;
        private Integer totalElements;
        private Integer totalPages;
        private Integer size;
        private Integer number;
        private Boolean first;
        private Boolean last;
        private Integer numberOfElements;
        
        // Getters and Setters
        public List<BookingSimple> getBookings() { return bookings; }
        public void setBookings(List<BookingSimple> bookings) { this.bookings = bookings; }
        
        public Integer getTotalElements() { return totalElements; }
        public void setTotalElements(Integer totalElements) { this.totalElements = totalElements; }
        
        public Integer getTotalPages() { return totalPages; }
        public void setTotalPages(Integer totalPages) { this.totalPages = totalPages; }
        
        public Integer getSize() { return size; }
        public void setSize(Integer size) { this.size = size; }
        
        public Integer getNumber() { return number; }
        public void setNumber(Integer number) { this.number = number; }
        
        public Boolean getFirst() { return first; }
        public void setFirst(Boolean first) { this.first = first; }
        
        public Boolean getLast() { return last; }
        public void setLast(Boolean last) { this.last = last; }
        
        public Integer getNumberOfElements() { return numberOfElements; }
        public void setNumberOfElements(Integer numberOfElements) { this.numberOfElements = numberOfElements; }
    }

    public static class BookingSimple {
        private String bookingId;
        private String chainId;
        private String hotelId;
        private String chainCode;
        private String chainName;
        private String hotelCode;
        private String hotelName;
        private String roomTypeCode;
        private String roomTypeName;
        private String rateCode;
        private String rateCodeName;
        private String packageCode;
        private String packageName;
        private String channelCode;
        private String channelSubcode;
        private String bookerCode;
        private String agentCode;
        private String sourceCode;
        private String marketCode;
        private String bookerType;
        private String channelResvNo;
        private String channelResvSno;
        private String channelResvPno;
        private String crsResvNo;
        private String crsResvPno;
        private String crsResvCheckinNo;
        private String agentResvNo;
        private String agentResvPno;
        private String hotelResvNo;
        private String hotelResvKey;
        private String hotelResvConfirm;
        private String hotelRoomNo;
        private String paymentType;
        private String reservationType;
        private String cancellationType;
        private Integer latestCancellationDays;
        private String latestCancellationTime;
        private Boolean cancellableAfterBooking;
        private String orderRetentionTime;
        private String arrivalTime;
        private String remarkHotel;
        private String remarkChannel;
        private String remarkAgent;
        private String remarkGuest;
        private String remarkSpecial;
        private String remarkInvoice;
        private String remarkCancel;
        private String companyId;
        private String companyNo;
        private String companyName;
        private String companyTmcId;
        private String companyTmcNo;
        private String companyTmcName;
        private String memberNoGuest;
        private String memberTypeGuest;
        private String memberNoBooker;
        private String memberTypeBooker;
        private String guestId;
        private String guestName;
        private String guestEname;
        private String bookerId;
        private String bookerName;
        private String bookingDate;
        private Double advanceBookingDays;
        private String checkInDate;
        private String checkOutDate;
        private Integer stayDays;
        private String checkInDateActual;
        private String checkOutDateActual;
        private Integer stayDaysActual;
        private Integer totalRooms;
        private Integer totalRoomsActual;
        private Integer totalRoomNights;
        private Integer totalRoomNightsActual;
        private Integer totalGuests;
        private Integer totalGuestsActual;
        private String bookingType;
        private String bookingStatusChannel;
        private String bookingStatusHotel;
        private String bookingStatusAgent;
        private Double depositAmountChannel;
        private Double depositAmountAgent;
        private Double depositAmountHotel;
        private Double penaltyAmountChannel;
        private Double penaltyAmountHotel;
        private Double penaltyAmountAgent;
        private Double totalPriceChannel;
        private Double totalPriceHotel;
        private Double totalPriceAgent;
        private Double totalPriceChannelActual;
        private Double totalPriceHotelActual;
        private Double totalPriceAgentActual;
        private String paymentDate;
        private String paymentNo;
        private String billDate;
        private String billNo;
        private Double cateringFeeHotel;
        private Double banquetFeeHotel;
        private Double otherFeeHotel;
        private Double totalRevenueFeeHotel;
        private Integer sign;
        private SalesLevel salesLevelA;
        private SalesLevel salesLevelB;
        private SalesLevel salesLevelC;
        private String createdAt;
        private String updatedAt;
        private GuestInfo guestInfo;
        private GuestInfo bookerInfo;
        private CompanyInfo companyInfo;
        
        // Getters and Setters for BookingSimple
        public String getBookingId() { return bookingId; }
        public void setBookingId(String bookingId) { this.bookingId = bookingId; }
        public String getChainId() { return chainId; }
        public void setChainId(String chainId) { this.chainId = chainId; }
        public String getHotelId() { return hotelId; }
        public void setHotelId(String hotelId) { this.hotelId = hotelId; }
        public String getChainCode() { return chainCode; }
        public void setChainCode(String chainCode) { this.chainCode = chainCode; }
        public String getChainName() { return chainName; }
        public void setChainName(String chainName) { this.chainName = chainName; }
        public String getHotelCode() { return hotelCode; }
        public void setHotelCode(String hotelCode) { this.hotelCode = hotelCode; }
        public String getHotelName() { return hotelName; }
        public void setHotelName(String hotelName) { this.hotelName = hotelName; }
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
        public String getChannelCode() { return channelCode; }
        public void setChannelCode(String channelCode) { this.channelCode = channelCode; }
        public String getChannelSubcode() { return channelSubcode; }
        public void setChannelSubcode(String channelSubcode) { this.channelSubcode = channelSubcode; }
        public String getBookerCode() { return bookerCode; }
        public void setBookerCode(String bookerCode) { this.bookerCode = bookerCode; }
        public String getAgentCode() { return agentCode; }
        public void setAgentCode(String agentCode) { this.agentCode = agentCode; }
        public String getSourceCode() { return sourceCode; }
        public void setSourceCode(String sourceCode) { this.sourceCode = sourceCode; }
        public String getMarketCode() { return marketCode; }
        public void setMarketCode(String marketCode) { this.marketCode = marketCode; }
        public String getBookerType() { return bookerType; }
        public void setBookerType(String bookerType) { this.bookerType = bookerType; }
        public String getChannelResvNo() { return channelResvNo; }
        public void setChannelResvNo(String channelResvNo) { this.channelResvNo = channelResvNo; }
        public String getChannelResvSno() { return channelResvSno; }
        public void setChannelResvSno(String channelResvSno) { this.channelResvSno = channelResvSno; }
        public String getChannelResvPno() { return channelResvPno; }
        public void setChannelResvPno(String channelResvPno) { this.channelResvPno = channelResvPno; }
        public String getCrsResvNo() { return crsResvNo; }
        public void setCrsResvNo(String crsResvNo) { this.crsResvNo = crsResvNo; }
        public String getCrsResvPno() { return crsResvPno; }
        public void setCrsResvPno(String crsResvPno) { this.crsResvPno = crsResvPno; }
        public String getCrsResvCheckinNo() { return crsResvCheckinNo; }
        public void setCrsResvCheckinNo(String crsResvCheckinNo) { this.crsResvCheckinNo = crsResvCheckinNo; }
        public String getAgentResvNo() { return agentResvNo; }
        public void setAgentResvNo(String agentResvNo) { this.agentResvNo = agentResvNo; }
        public String getAgentResvPno() { return agentResvPno; }
        public void setAgentResvPno(String agentResvPno) { this.agentResvPno = agentResvPno; }
        public String getHotelResvNo() { return hotelResvNo; }
        public void setHotelResvNo(String hotelResvNo) { this.hotelResvNo = hotelResvNo; }
        public String getHotelResvKey() { return hotelResvKey; }
        public void setHotelResvKey(String hotelResvKey) { this.hotelResvKey = hotelResvKey; }
        public String getHotelResvConfirm() { return hotelResvConfirm; }
        public void setHotelResvConfirm(String hotelResvConfirm) { this.hotelResvConfirm = hotelResvConfirm; }
        public String getHotelRoomNo() { return hotelRoomNo; }
        public void setHotelRoomNo(String hotelRoomNo) { this.hotelRoomNo = hotelRoomNo; }
        public String getPaymentType() { return paymentType; }
        public void setPaymentType(String paymentType) { this.paymentType = paymentType; }
        public String getReservationType() { return reservationType; }
        public void setReservationType(String reservationType) { this.reservationType = reservationType; }
        public String getCancellationType() { return cancellationType; }
        public void setCancellationType(String cancellationType) { this.cancellationType = cancellationType; }
        public Integer getLatestCancellationDays() { return latestCancellationDays; }
        public void setLatestCancellationDays(Integer latestCancellationDays) { this.latestCancellationDays = latestCancellationDays; }
        public String getLatestCancellationTime() { return latestCancellationTime; }
        public void setLatestCancellationTime(String latestCancellationTime) { this.latestCancellationTime = latestCancellationTime; }
        public Boolean getCancellableAfterBooking() { return cancellableAfterBooking; }
        public void setCancellableAfterBooking(Boolean cancellableAfterBooking) { this.cancellableAfterBooking = cancellableAfterBooking; }
        public String getOrderRetentionTime() { return orderRetentionTime; }
        public void setOrderRetentionTime(String orderRetentionTime) { this.orderRetentionTime = orderRetentionTime; }
        public String getArrivalTime() { return arrivalTime; }
        public void setArrivalTime(String arrivalTime) { this.arrivalTime = arrivalTime; }
        public String getRemarkHotel() { return remarkHotel; }
        public void setRemarkHotel(String remarkHotel) { this.remarkHotel = remarkHotel; }
        public String getRemarkChannel() { return remarkChannel; }
        public void setRemarkChannel(String remarkChannel) { this.remarkChannel = remarkChannel; }
        public String getRemarkAgent() { return remarkAgent; }
        public void setRemarkAgent(String remarkAgent) { this.remarkAgent = remarkAgent; }
        public String getRemarkGuest() { return remarkGuest; }
        public void setRemarkGuest(String remarkGuest) { this.remarkGuest = remarkGuest; }
        public String getRemarkSpecial() { return remarkSpecial; }
        public void setRemarkSpecial(String remarkSpecial) { this.remarkSpecial = remarkSpecial; }
        public String getRemarkInvoice() { return remarkInvoice; }
        public void setRemarkInvoice(String remarkInvoice) { this.remarkInvoice = remarkInvoice; }
        public String getRemarkCancel() { return remarkCancel; }
        public void setRemarkCancel(String remarkCancel) { this.remarkCancel = remarkCancel; }
        public String getCompanyId() { return companyId; }
        public void setCompanyId(String companyId) { this.companyId = companyId; }
        public String getCompanyNo() { return companyNo; }
        public void setCompanyNo(String companyNo) { this.companyNo = companyNo; }
        public String getCompanyName() { return companyName; }
        public void setCompanyName(String companyName) { this.companyName = companyName; }
        public String getCompanyTmcId() { return companyTmcId; }
        public void setCompanyTmcId(String companyTmcId) { this.companyTmcId = companyTmcId; }
        public String getCompanyTmcNo() { return companyTmcNo; }
        public void setCompanyTmcNo(String companyTmcNo) { this.companyTmcNo = companyTmcNo; }
        public String getCompanyTmcName() { return companyTmcName; }
        public void setCompanyTmcName(String companyTmcName) { this.companyTmcName = companyTmcName; }
        public String getMemberNoGuest() { return memberNoGuest; }
        public void setMemberNoGuest(String memberNoGuest) { this.memberNoGuest = memberNoGuest; }
        public String getMemberTypeGuest() { return memberTypeGuest; }
        public void setMemberTypeGuest(String memberTypeGuest) { this.memberTypeGuest = memberTypeGuest; }
        public String getMemberNoBooker() { return memberNoBooker; }
        public void setMemberNoBooker(String memberNoBooker) { this.memberNoBooker = memberNoBooker; }
        public String getMemberTypeBooker() { return memberTypeBooker; }
        public void setMemberTypeBooker(String memberTypeBooker) { this.memberTypeBooker = memberTypeBooker; }
        public String getGuestId() { return guestId; }
        public void setGuestId(String guestId) { this.guestId = guestId; }
        public String getGuestName() { return guestName; }
        public void setGuestName(String guestName) { this.guestName = guestName; }
        public String getGuestEname() { return guestEname; }
        public void setGuestEname(String guestEname) { this.guestEname = guestEname; }
        public String getBookerId() { return bookerId; }
        public void setBookerId(String bookerId) { this.bookerId = bookerId; }
        public String getBookerName() { return bookerName; }
        public void setBookerName(String bookerName) { this.bookerName = bookerName; }
        public String getBookingDate() { return bookingDate; }
        public void setBookingDate(String bookingDate) { this.bookingDate = bookingDate; }
        public Double getAdvanceBookingDays() { return advanceBookingDays; }
        public void setAdvanceBookingDays(Double advanceBookingDays) { this.advanceBookingDays = advanceBookingDays; }
        public String getCheckInDate() { return checkInDate; }
        public void setCheckInDate(String checkInDate) { this.checkInDate = checkInDate; }
        public String getCheckOutDate() { return checkOutDate; }
        public void setCheckOutDate(String checkOutDate) { this.checkOutDate = checkOutDate; }
        public Integer getStayDays() { return stayDays; }
        public void setStayDays(Integer stayDays) { this.stayDays = stayDays; }
        public String getCheckInDateActual() { return checkInDateActual; }
        public void setCheckInDateActual(String checkInDateActual) { this.checkInDateActual = checkInDateActual; }
        public String getCheckOutDateActual() { return checkOutDateActual; }
        public void setCheckOutDateActual(String checkOutDateActual) { this.checkOutDateActual = checkOutDateActual; }
        public Integer getStayDaysActual() { return stayDaysActual; }
        public void setStayDaysActual(Integer stayDaysActual) { this.stayDaysActual = stayDaysActual; }
        public Integer getTotalRooms() { return totalRooms; }
        public void setTotalRooms(Integer totalRooms) { this.totalRooms = totalRooms; }
        public Integer getTotalRoomsActual() { return totalRoomsActual; }
        public void setTotalRoomsActual(Integer totalRoomsActual) { this.totalRoomsActual = totalRoomsActual; }
        public Integer getTotalRoomNights() { return totalRoomNights; }
        public void setTotalRoomNights(Integer totalRoomNights) { this.totalRoomNights = totalRoomNights; }
        public Integer getTotalRoomNightsActual() { return totalRoomNightsActual; }
        public void setTotalRoomNightsActual(Integer totalRoomNightsActual) { this.totalRoomNightsActual = totalRoomNightsActual; }
        public Integer getTotalGuests() { return totalGuests; }
        public void setTotalGuests(Integer totalGuests) { this.totalGuests = totalGuests; }
        public Integer getTotalGuestsActual() { return totalGuestsActual; }
        public void setTotalGuestsActual(Integer totalGuestsActual) { this.totalGuestsActual = totalGuestsActual; }
        public String getBookingType() { return bookingType; }
        public void setBookingType(String bookingType) { this.bookingType = bookingType; }
        public String getBookingStatusChannel() { return bookingStatusChannel; }
        public void setBookingStatusChannel(String bookingStatusChannel) { this.bookingStatusChannel = bookingStatusChannel; }
        public String getBookingStatusHotel() { return bookingStatusHotel; }
        public void setBookingStatusHotel(String bookingStatusHotel) { this.bookingStatusHotel = bookingStatusHotel; }
        public String getBookingStatusAgent() { return bookingStatusAgent; }
        public void setBookingStatusAgent(String bookingStatusAgent) { this.bookingStatusAgent = bookingStatusAgent; }
        public Double getDepositAmountChannel() { return depositAmountChannel; }
        public void setDepositAmountChannel(Double depositAmountChannel) { this.depositAmountChannel = depositAmountChannel; }
        public Double getDepositAmountAgent() { return depositAmountAgent; }
        public void setDepositAmountAgent(Double depositAmountAgent) { this.depositAmountAgent = depositAmountAgent; }
        public Double getDepositAmountHotel() { return depositAmountHotel; }
        public void setDepositAmountHotel(Double depositAmountHotel) { this.depositAmountHotel = depositAmountHotel; }
        public Double getPenaltyAmountChannel() { return penaltyAmountChannel; }
        public void setPenaltyAmountChannel(Double penaltyAmountChannel) { this.penaltyAmountChannel = penaltyAmountChannel; }
        public Double getPenaltyAmountHotel() { return penaltyAmountHotel; }
        public void setPenaltyAmountHotel(Double penaltyAmountHotel) { this.penaltyAmountHotel = penaltyAmountHotel; }
        public Double getPenaltyAmountAgent() { return penaltyAmountAgent; }
        public void setPenaltyAmountAgent(Double penaltyAmountAgent) { this.penaltyAmountAgent = penaltyAmountAgent; }
        public Double getTotalPriceChannel() { return totalPriceChannel; }
        public void setTotalPriceChannel(Double totalPriceChannel) { this.totalPriceChannel = totalPriceChannel; }
        public Double getTotalPriceHotel() { return totalPriceHotel; }
        public void setTotalPriceHotel(Double totalPriceHotel) { this.totalPriceHotel = totalPriceHotel; }
        public Double getTotalPriceAgent() { return totalPriceAgent; }
        public void setTotalPriceAgent(Double totalPriceAgent) { this.totalPriceAgent = totalPriceAgent; }
        public Double getTotalPriceChannelActual() { return totalPriceChannelActual; }
        public void setTotalPriceChannelActual(Double totalPriceChannelActual) { this.totalPriceChannelActual = totalPriceChannelActual; }
        public Double getTotalPriceHotelActual() { return totalPriceHotelActual; }
        public void setTotalPriceHotelActual(Double totalPriceHotelActual) { this.totalPriceHotelActual = totalPriceHotelActual; }
        public Double getTotalPriceAgentActual() { return totalPriceAgentActual; }
        public void setTotalPriceAgentActual(Double totalPriceAgentActual) { this.totalPriceAgentActual = totalPriceAgentActual; }
        public String getPaymentDate() { return paymentDate; }
        public void setPaymentDate(String paymentDate) { this.paymentDate = paymentDate; }
        public String getPaymentNo() { return paymentNo; }
        public void setPaymentNo(String paymentNo) { this.paymentNo = paymentNo; }
        public String getBillDate() { return billDate; }
        public void setBillDate(String billDate) { this.billDate = billDate; }
        public String getBillNo() { return billNo; }
        public void setBillNo(String billNo) { this.billNo = billNo; }
        public Double getCateringFeeHotel() { return cateringFeeHotel; }
        public void setCateringFeeHotel(Double cateringFeeHotel) { this.cateringFeeHotel = cateringFeeHotel; }
        public Double getBanquetFeeHotel() { return banquetFeeHotel; }
        public void setBanquetFeeHotel(Double banquetFeeHotel) { this.banquetFeeHotel = banquetFeeHotel; }
        public Double getOtherFeeHotel() { return otherFeeHotel; }
        public void setOtherFeeHotel(Double otherFeeHotel) { this.otherFeeHotel = otherFeeHotel; }
        public Double getTotalRevenueFeeHotel() { return totalRevenueFeeHotel; }
        public void setTotalRevenueFeeHotel(Double totalRevenueFeeHotel) { this.totalRevenueFeeHotel = totalRevenueFeeHotel; }
        public Integer getSign() { return sign; }
        public void setSign(Integer sign) { this.sign = sign; }
        public SalesLevel getSalesLevelA() { return salesLevelA; }
        public void setSalesLevelA(SalesLevel salesLevelA) { this.salesLevelA = salesLevelA; }
        public SalesLevel getSalesLevelB() { return salesLevelB; }
        public void setSalesLevelB(SalesLevel salesLevelB) { this.salesLevelB = salesLevelB; }
        public SalesLevel getSalesLevelC() { return salesLevelC; }
        public void setSalesLevelC(SalesLevel salesLevelC) { this.salesLevelC = salesLevelC; }
        public String getCreatedAt() { return createdAt; }
        public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
        public String getUpdatedAt() { return updatedAt; }
        public void setUpdatedAt(String updatedAt) { this.updatedAt = updatedAt; }
        public GuestInfo getGuestInfo() { return guestInfo; }
        public void setGuestInfo(GuestInfo guestInfo) { this.guestInfo = guestInfo; }
        public GuestInfo getBookerInfo() { return bookerInfo; }
        public void setBookerInfo(GuestInfo bookerInfo) { this.bookerInfo = bookerInfo; }
        public CompanyInfo getCompanyInfo() { return companyInfo; }
        public void setCompanyInfo(CompanyInfo companyInfo) { this.companyInfo = companyInfo; }
    }
    public static class SalesLevel {
        private String id;
        private String name;
        private String phone;
        private String email;
        
        // Getters and Setters
        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
    }
    public static class GuestInfo {
        private String guestId;
        private String guestName;
        private String guestEname;
        private String firstName;
        private String lastName;
        private String idType;
        private String idNumber;
        private String phone;
        private String email;
        private String address;
        private String specialRequests;
        private String memberLevel;
        private String memberCardNo;
        private String memberType;
        
        // Getters and Setters
        public String getGuestId() { return guestId; }
        public void setGuestId(String guestId) { this.guestId = guestId; }
        public String getGuestName() { return guestName; }
        public void setGuestName(String guestName) { this.guestName = guestName; }
        public String getGuestEname() { return guestEname; }
        public void setGuestEname(String guestEname) { this.guestEname = guestEname; }
        public String getFirstName() { return firstName; }
        public void setFirstName(String firstName) { this.firstName = firstName; }
        public String getLastName() { return lastName; }
        public void setLastName(String lastName) { this.lastName = lastName; }
        public String getIdType() { return idType; }
        public void setIdType(String idType) { this.idType = idType; }
        public String getIdNumber() { return idNumber; }
        public void setIdNumber(String idNumber) { this.idNumber = idNumber; }
        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getAddress() { return address; }
        public void setAddress(String address) { this.address = address; }
        public String getSpecialRequests() { return specialRequests; }
        public void setSpecialRequests(String specialRequests) { this.specialRequests = specialRequests; }
        public String getMemberLevel() { return memberLevel; }
        public void setMemberLevel(String memberLevel) { this.memberLevel = memberLevel; }
        public String getMemberCardNo() { return memberCardNo; }
        public void setMemberCardNo(String memberCardNo) { this.memberCardNo = memberCardNo; }
        public String getMemberType() { return memberType; }
        public void setMemberType(String memberType) { this.memberType = memberType; }
    }
    public static class CompanyInfo {
        private String companyId;
        private String companyCode;
        private String companyName;
        private String companyEname;
        private String contactPerson;
        private String contactEmail;
        private String contactPhone;
        private String address;
        private String memberLevel;
        private String memberCardNo;
        private String memberType;
        
        // Getters and Setters
        public String getCompanyId() { return companyId; }
        public void setCompanyId(String companyId) { this.companyId = companyId; }
        public String getCompanyCode() { return companyCode; }
        public void setCompanyCode(String companyCode) { this.companyCode = companyCode; }
        public String getCompanyName() { return companyName; }
        public void setCompanyName(String companyName) { this.companyName = companyName; }
        public String getCompanyEname() { return companyEname; }
        public void setCompanyEname(String companyEname) { this.companyEname = companyEname; }
        public String getContactPerson() { return contactPerson; }
        public void setContactPerson(String contactPerson) { this.contactPerson = contactPerson; }
        public String getContactEmail() { return contactEmail; }
        public void setContactEmail(String contactEmail) { this.contactEmail = contactEmail; }
        public String getContactPhone() { return contactPhone; }
        public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }
        public String getAddress() { return address; }
        public void setAddress(String address) { this.address = address; }
        public String getMemberLevel() { return memberLevel; }
        public void setMemberLevel(String memberLevel) { this.memberLevel = memberLevel; }
        public String getMemberCardNo() { return memberCardNo; }
        public void setMemberCardNo(String memberCardNo) { this.memberCardNo = memberCardNo; }
        public String getMemberType() { return memberType; }
        public void setMemberType(String memberType) { this.memberType = memberType; }
    }
    
    // Getters and Setters
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    public Data getData() {
        return data;
    }
    
    public void setData(Data data) {
        this.data = data;
    }
} 