package com.zai.booking.service.impl;

import com.zai.booking.entity.Booking;
import com.zai.booking.entity.BookingDaily;
import com.zai.booking.entity.Guest;
import com.zai.booking.entity.Company;
import com.zai.booking.dto.BookingListRequest;
import com.zai.booking.dto.BookingAddRequest;
import com.zai.booking.dto.BookingDetailResponse;
import com.zai.booking.dto.BookingConfirmRequest;
import com.zai.booking.dto.BookingUpdatePriceRequest;
import com.zai.booking.dto.BookingUpdatePriceBatchRequest;
import com.zai.booking.dto.BookingUpdatePriceResponse;
import com.zai.booking.mapper.BookingMapper;
import com.zai.booking.mapper.BookingDailyMapper;
import com.zai.booking.mapper.GuestMapper;
import com.zai.booking.mapper.CompanyMapper;
import com.zai.booking.service.BookingService;
import com.zai.util.IdGenerator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Date;
import java.util.Calendar;
import java.math.BigDecimal;

import com.zai.hotel.entity.Hotel;
import com.zai.chain.entity.Chain;
import com.zai.hotel.mapper.HotelMapper;
import com.zai.chain.mapper.ChainMapper;
import com.zai.roomtype.entity.RoomType;
import com.zai.roomtype.mapper.RoomTypeMapper;
import com.zai.ratecode.entity.RateCode;
import com.zai.ratecode.mapper.RateCodeMapper;
import com.zai.additionalservice.entity.AdditionalService;
import com.zai.additionalservice.mapper.AdditionalServiceMapper;
import java.util.stream.Collectors;
import com.zai.user.entity.User;
import com.zai.user.mapper.UserMapper;
import com.zai.booking.entity.BookingLog;
import com.zai.booking.mapper.BookingLogMapper;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import java.text.SimpleDateFormat;
import java.util.Map;

@Service
public class BookingServiceImpl implements BookingService {
    
    private static final Logger logger = LoggerFactory.getLogger(BookingServiceImpl.class);
    
    @Autowired
    private BookingMapper bookingMapper;

    @Autowired
    private HotelMapper hotelMapper;

    @Autowired
    private ChainMapper chainMapper;    
    
    @Autowired
    private BookingDailyMapper bookingDailyMapper;
    
    @Autowired
    private GuestMapper guestMapper;
    
    @Autowired
    private CompanyMapper companyMapper;

    @Autowired
    private RoomTypeMapper roomTypeMapper;

    @Autowired
    private RateCodeMapper rateCodeMapper;

    @Autowired
    private AdditionalServiceMapper additionalServiceMapper;

    @Autowired
    private UserMapper userMapper;
    
    @Autowired
    private BookingLogMapper bookingLogMapper;
    
    private static final ObjectMapper objectMapper = new ObjectMapper();
    private static final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
    private static final SimpleDateFormat dateTimeFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss");
    
    @Override
    @Transactional
    public int addBooking(BookingAddRequest request) {
        try {
            logger.debug("开始添加预订: {}", request);
            
            // 1. 生成预订ID
            String bookingId = IdGenerator.generate64BitId();
            
            // 2. 处理客人信息
            String guestId = null;
            if (request.getGuest() != null) {
                guestId = processGuestInfo(request.getGuest());
            }
            
            // 3. 处理公司信息
            String companyId = null;
            if (request.getCompany() != null) {
                companyId = processCompanyInfo(request.getCompany());
            }

            // 计算入住天数
            int stayDays = 1;
            if (request.getCheckInDate() != null && request.getCheckOutDate() != null) {
                long diffInMillies = request.getCheckOutDate().getTime() - request.getCheckInDate().getTime();
                stayDays = (int) (diffInMillies / (24 * 60 * 60 * 1000));
            }

            //查询数据库
            //查询酒店表数据
            Hotel hotel = hotelMapper.selectByHotelId(request.getHotelId());
            if (hotel == null) {
                throw new RuntimeException("酒店不存在: " + request.getHotelId());
            }
            //查询集团表数据
            Chain chain = chainMapper.selectByChainId(hotel.getChainId());
            if (chain == null) {
                throw new RuntimeException("集团不存在: " + request.getChainId());
            }
            //查询房型表数据
            RoomType roomType = roomTypeMapper.bookingSelectByHotelRoomTypeCode(
                hotel.getHotelId(), request.getRoomTypeCode());
            if (roomType == null) {
                throw new RuntimeException("房型不存在: " + request.getRoomTypeCode());
            }
            //查询房价码表数据
            RateCode rateCode = rateCodeMapper.bookingSelectByHotelRateCode(
                hotel.getHotelId(), request.getRateCode());
            if (rateCode == null) {
                throw new RuntimeException("房价码不存在: " + request.getRateCode());
            }

            //查询套餐相关字段
            List<AdditionalService> additionalServices = additionalServiceMapper.selectByPackageCode(rateCode.getRateCode());
            if (additionalServices == null) {
                throw new RuntimeException("套餐不存在: " + request.getPackageCode());
            }

            //查询user表数据
            User user = userMapper.getUserByUserId(request.getUserId());
            if (user == null) {
                throw new RuntimeException("用户不存在: " + request.getUserId());
            }
            
            // 4. 创建预订记录
            Booking booking = new Booking();
            booking.setBookingId(bookingId);//唯一标识
            booking.setChainId(request.getChainId());
            booking.setChainCode(chain.getChainCode());
            booking.setChainName(chain.getChainName());

            booking.setHotelId(request.getHotelId());
            booking.setHotelCode(hotel.getHotelCode());
            booking.setHotelName(hotel.getHotelName());

            //订单号
            booking.setCrsResvNo(request.getCrsResvNo());
            booking.setChannelResvNo(request.getChannelResvNo());
            booking.setHotelResvNo(request.getHotelResvNo());
            //取request.getCrsResvNo()的后6位
            if (request.getCrsResvNo() != null && request.getCrsResvNo().length() >= 6) {
                String lastSixDigits = request.getCrsResvNo().substring(request.getCrsResvNo().length() - 6);
                booking.setCrsResvCheckinNo(lastSixDigits);
            } else if (request.getCrsResvNo() != null) {
                // 如果长度不足6位，直接使用原值
                booking.setCrsResvCheckinNo(request.getCrsResvNo());
            }
            


            booking.setRoomTypeCode(request.getRoomTypeCode());
            booking.setRoomTypeName(roomType.getRoomTypeName());

            booking.setRateCode(request.getRateCode());
            booking.setRateCodeName(rateCode.getRateCodeName());

            // 套餐相关字段
            if (additionalServices != null && !additionalServices.isEmpty()) {
                // 将套餐代码用逗号分割
                String packageCodes = additionalServices.stream()
                    .map(AdditionalService::getServiceCode)
                    .filter(code -> code != null && !code.trim().isEmpty())
                    .collect(Collectors.joining(","));
                booking.setPackageCode(packageCodes);
                
                // 将套餐名称用逗号分割
                String packageNames = additionalServices.stream()
                    .map(AdditionalService::getServiceName)
                    .filter(name -> name != null && !name.trim().isEmpty())
                    .collect(Collectors.joining(","));
                booking.setPackageName(packageNames);
            } else {
                // 如果没有套餐信息，使用请求中的值
                booking.setPackageCode(request.getPackageCode());
                booking.setPackageName(request.getPackageName());
            }
            
            booking.setChannelCode(request.getChannelCode());
            
            // 预订日期和入住离店日期
            booking.setBookingDate(new Date());
            booking.setCheckInDate(request.getCheckInDate());
            booking.setCheckOutDate(request.getCheckOutDate());
            booking.setCheckInDateActual(request.getCheckInDate());
            booking.setCheckOutDateActual(request.getCheckOutDate());
            booking.setStayDays(stayDays);
            booking.setStayDaysActual(stayDays);
            
            // 房间和客人数量
            booking.setTotalRooms(request.getRoomsPerDay());
            booking.setTotalRoomsActual(request.getRoomsPerDay());
            booking.setTotalRoomNights(stayDays * request.getRoomsPerDay());
            booking.setTotalRoomNightsActual(stayDays * request.getRoomsPerDay());
            booking.setTotalGuests(request.getGuestsPerRoom());
            booking.setTotalGuestsActual(request.getGuestsPerRoom());
            
            // 预订状态            
            booking.setBookingStatusAgent("RESERVED");//订单状态 RESERVED 待确认，CONFIRMED 已确认，CANCELLED 已取消，CHECKEDIN 已入住，CHECKEDOUT 已离店,NOSHOW 未入住
            booking.setBookingStatusChannel("RESERVED");//订单状态
            booking.setBookingStatusHotel("RESERVED");//订单状态
            booking.setBookingType("NEW"); // 默认个人预订
            
            // 客人信息
            booking.setGuestId(guestId);
            if (request.getGuest() != null) {
                booking.setGuestName(request.getGuest().getGuestName());
                booking.setGuestEname(request.getGuest().getGuestEname());
                booking.setMemberNoGuest(request.getGuest().getMemberNumber());
                booking.setMemberTypeGuest(request.getGuest().getMemberType());
            }
            
            // 预订人信息
            if (user != null) {
                booking.setBookerId(user.getUserId());
                booking.setBookerName(user.getUsername());
                booking.setMemberNoBooker(user.getUserId());
                booking.setMemberTypeBooker("CRO");
                booking.setBookerType("CRO");
            }
            
            // 公司信息
            booking.setCompanyId(companyId);
            if (request.getCompany() != null) {
                booking.setCompanyName(request.getCompany().getCompanyName());
                booking.setMemberNoGuest(request.getCompany().getMemberNumber());
                booking.setMemberTypeGuest(request.getCompany().getMemberType());
            }

            //订单统计信息
            booking.setAgentCode("CRO");
            booking.setMarketCode("CRO");
            booking.setSourceCode("CRO");
            
            // 备注信息
            booking.setRemarkHotel(request.getRemarkHotel());
            booking.setRemarkChannel(request.getRemarkChannel());
            booking.setRemarkAgent(request.getRemarkAgent());
            booking.setRemarkGuest(request.getRemarkGuest());
            booking.setRemarkSpecial(request.getRemarkSpecial());
            booking.setRemarkInvoice(request.getRemarkInvoice());
            booking.setRemarkCancel(request.getRemarkCancel());
            
            // 时间戳
            booking.setCreatedAt(new Date());
            booking.setUpdatedAt(new Date());
            
            // 计算总价格
            BigDecimal totalPriceChannel = BigDecimal.ZERO;
            BigDecimal totalPriceHotel = BigDecimal.ZERO;
            BigDecimal totalPriceAgent = BigDecimal.ZERO;
            BigDecimal firstDayChannelPrice = BigDecimal.ZERO; // 首日渠道价格
            
            if (request.getDailyPrices() != null && !request.getDailyPrices().isEmpty()) {
                for (int i = 0; i < request.getDailyPrices().size(); i++) {
                    BookingAddRequest.DailyPriceInfo dailyPriceInfo = request.getDailyPrices().get(i);
                    if (dailyPriceInfo.getPriceChannel() != null) {
                        totalPriceChannel = totalPriceChannel.add(dailyPriceInfo.getPriceChannel());
                        // 获取首日渠道价格
                        if (i == 0) {
                            firstDayChannelPrice = dailyPriceInfo.getPriceChannel();
                        }
                    }
                    if (dailyPriceInfo.getPriceHotel() != null) {
                        totalPriceHotel = totalPriceHotel.add(dailyPriceInfo.getPriceHotel());
                    }
                    if (dailyPriceInfo.getPriceAgent() != null) {
                        totalPriceAgent = totalPriceAgent.add(dailyPriceInfo.getPriceAgent());
                    }
                }
            }
            
            booking.setTotalPriceChannel(totalPriceChannel);
            booking.setTotalPriceHotel(totalPriceHotel);
            booking.setTotalPriceAgent(totalPriceAgent);
            booking.setTotalPriceChannelActual(totalPriceChannel);
            booking.setTotalPriceHotelActual(totalPriceHotel);
            booking.setTotalPriceAgentActual(totalPriceAgent);
            
            // 计算提前预订天数
            if (request.getCheckInDate() != null) {
                long diffInMillies = request.getCheckInDate().getTime() - new Date().getTime();
                int advanceDays = (int) (diffInMillies / (24 * 60 * 60 * 1000));
                booking.setAdvanceBookingDays(BigDecimal.valueOf(advanceDays));
            }
            
            // 设置默认值
            booking.setPaymentType(request.getPaymentType()); // 默认预付
            booking.setReservationType(request.getReservationType()); // 默认普通预订
            booking.setCancellationType(request.getCancellationType()); // 默认标准取消政策
            booking.setCancellableAfterBooking(true); // 默认可取消
            
            // 设置默认金额为0
            booking.setDepositAmountChannel(BigDecimal.ZERO);
            booking.setDepositAmountAgent(BigDecimal.ZERO);
            booking.setDepositAmountHotel(BigDecimal.ZERO);
            booking.setPenaltyAmountChannel(firstDayChannelPrice); // 设置为首日房费
            booking.setPenaltyAmountHotel(firstDayChannelPrice);
            booking.setPenaltyAmountAgent(BigDecimal.ZERO);
            booking.setCateringFeeHotel(BigDecimal.ZERO);
            booking.setBanquetFeeHotel(BigDecimal.ZERO);
            booking.setOtherFeeHotel(BigDecimal.ZERO);
            booking.setTotalRevenueFeeHotel(BigDecimal.ZERO);
            
            // 5. 插入预订记录
            bookingMapper.insert(booking);
            
            // 6. 处理每日价格信息
            if (request.getDailyPrices() != null && !request.getDailyPrices().isEmpty()) {
                processDailyPrices(bookingId, request);
            }
            
            // 6.1. 记录预订日志（在插入每日价格信息之后，确保能获取到完整的每日详情）
            saveBookingLog(booking, "CREATE", request.getUserId());
            
            logger.debug("预订添加成功: bookingId={}", bookingId);
            return 1;
            
        } catch (Exception e) {
            logger.error("添加预订失败", e);
            throw new RuntimeException("添加预订失败: " + e.getMessage());
        }
    }
    
    @Override
    @Transactional
    public void deleteBooking(String bookingId) {
        try {
            logger.debug("开始删除预订: {}", bookingId);
            
            // 1. 删除每日价格记录
            bookingDailyMapper.deleteByBookingId(bookingId);
            
            // 2. 删除预订记录
            bookingMapper.deleteByBookingId(bookingId);
            
            logger.debug("预订删除成功: bookingId={}", bookingId);
            
        } catch (Exception e) {
            logger.error("删除预订失败", e);
            throw new RuntimeException("删除预订失败: " + e.getMessage());
        }
    }
    
    @Override
    public int updateBooking(Booking booking) {
        try {
            logger.debug("开始更新预订: {}", booking.getBookingId());
            
            // 获取更新前的预订信息
            Booking oldBooking = getCompleteBooking(booking.getBookingId());
            
            bookingMapper.update(booking);
            
            // 记录更新日志
            saveBookingLog(booking, "UPDATE", null);
            
            logger.debug("预订更新成功: bookingId={}", booking.getBookingId());
            return 1;
        } catch (Exception e) {
            logger.error("更新预订失败", e);
            throw new RuntimeException("更新预订失败: " + e.getMessage());
        }
    }
    
    @Override
    public Booking getBookingById(String bookingId) {
        try {
            return getCompleteBooking(bookingId);
        } catch (Exception e) {
            logger.error("查询预订失败", e);
            throw new RuntimeException("查询预订失败: " + e.getMessage());
        }
    }
    
    @Override
    public BookingDetailResponse getBookingDetailById(String bookingId) {
        try {
            logger.debug("查询预订详情: {}", bookingId);
            
            // 1. 查询预订基本信息
            Booking booking = getCompleteBooking(bookingId);
            if (booking == null) {
                return null;
            }
            
            // 2. 获取每日详情（从booking对象中获取）
            List<BookingDaily> dailyDetails = booking.getBookingDailys();
            
            // 3. 查询预订日志
            List<BookingLog> bookingLogs = bookingLogMapper.selectByBookingId(bookingId);
            
            // 4. 查询客人信息
            Guest guest = null;
            if (booking.getGuestId() != null) {
                guest = guestMapper.selectByGuestId(booking.getGuestId());
            }
            
            // 5. 查询公司信息
            Company company = null;
            if (booking.getCompanyId() != null) {
                company = companyMapper.selectByCompanyId(booking.getCompanyId());
            }
            
            // 6. 查询预订人信息（用户信息）
            User booker = null;
            if (booking.getBookerId() != null) {
                booker = userMapper.getUserByUserId(booking.getBookerId());
            }
            
            // 7. 组装响应对象
            BookingDetailResponse response = new BookingDetailResponse();
            
            // 基本信息
            response.setBookingId(booking.getBookingId());
            response.setChainId(booking.getChainId());
            response.setHotelId(booking.getHotelId());
            response.setChainCode(booking.getChainCode());
            response.setChainName(booking.getChainName());
            response.setHotelCode(booking.getHotelCode());
            response.setHotelName(booking.getHotelName());
            response.setRoomTypeCode(booking.getRoomTypeCode());
            response.setRoomTypeName(booking.getRoomTypeName());
            response.setRateCode(booking.getRateCode());
            response.setRateCodeName(booking.getRateCodeName());
            response.setPackageCode(booking.getPackageCode());
            response.setPackageName(booking.getPackageName());
            response.setChannelCode(booking.getChannelCode());
            response.setChannelSubcode(booking.getChannelSubcode());
            response.setBookerCode(booking.getBookerCode());
            response.setAgentCode(booking.getAgentCode());
            response.setSourceCode(booking.getSourceCode());
            response.setMarketCode(booking.getMarketCode());
            response.setBookerType(booking.getBookerType());
            
            // 预订号信息
            response.setChannelResvNo(booking.getChannelResvNo());
            response.setChannelResvSno(booking.getChannelResvSno());
            response.setChannelResvPno(booking.getChannelResvPno());
            response.setCrsResvNo(booking.getCrsResvNo());
            response.setCrsResvPno(booking.getCrsResvPno());
            response.setCrsResvCheckinNo(booking.getCrsResvCheckinNo());
            response.setAgentResvNo(booking.getAgentResvNo());
            response.setAgentResvPno(booking.getAgentResvPno());
            response.setHotelResvNo(booking.getHotelResvNo());
            response.setHotelResvKey(booking.getHotelResvKey());
            response.setHotelResvConfirm(booking.getHotelResvConfirm());
            response.setHotelRoomNo(booking.getHotelRoomNo());
            
            // 预订类型和状态
            response.setPaymentType(booking.getPaymentType());
            response.setReservationType(booking.getReservationType());
            response.setCancellationType(booking.getCancellationType());
            response.setLatestCancellationDays(booking.getLatestCancellationDays());
            response.setLatestCancellationTime(booking.getLatestCancellationTime() != null ? 
                booking.getLatestCancellationTime().toString() : null);
            
            response.setCancellableAfterBooking(booking.getCancellableAfterBooking());
            response.setOrderRetentionTime(booking.getOrderRetentionTime() != null ? 
                booking.getOrderRetentionTime().toString() : null);
            response.setArrivalTime(booking.getArrivalTime() != null ? 
                booking.getArrivalTime().toString() : null);
            
            // 备注信息
            response.setRemarkHotel(booking.getRemarkHotel());
            response.setRemarkChannel(booking.getRemarkChannel());
            response.setRemarkAgent(booking.getRemarkAgent());
            response.setRemarkGuest(booking.getRemarkGuest());
            response.setRemarkSpecial(booking.getRemarkSpecial());
            response.setRemarkInvoice(booking.getRemarkInvoice());
            response.setRemarkCancel(booking.getRemarkCancel());
            
            // 公司信息
            response.setCompanyId(booking.getCompanyId());
            response.setCompanyNo(booking.getCompanyNo());
            response.setCompanyName(booking.getCompanyName());
            response.setCompanyTmcId(booking.getCompanyTmcId());
            response.setCompanyTmcNo(booking.getCompanyTmcNo());
            response.setCompanyTmcName(booking.getCompanyTmcName());
            
            // 会员信息
            response.setMemberNoGuest(booking.getMemberNoGuest());
            response.setMemberTypeGuest(booking.getMemberTypeGuest());
            response.setMemberNoBooker(booking.getMemberNoBooker());
            response.setMemberTypeBooker(booking.getMemberTypeBooker());
            
            // 客人和预订人信息
            response.setGuestId(booking.getGuestId());
            response.setGuestName(booking.getGuestName());
            response.setGuestEname(booking.getGuestEname());
            response.setBookerId(booking.getBookerId());
            response.setBookerName(booking.getBookerName());
            
            // 日期信息
            response.setBookingDate(booking.getBookingDate() != null ? 
                dateFormat.format(booking.getBookingDate()) : null);
            response.setAdvanceBookingDays(booking.getAdvanceBookingDays() != null ? 
                booking.getAdvanceBookingDays().doubleValue() : null);
            response.setCheckInDate(booking.getCheckInDate() != null ? 
                dateFormat.format(booking.getCheckInDate()) : null);
            response.setCheckOutDate(booking.getCheckOutDate() != null ? 
                dateFormat.format(booking.getCheckOutDate()) : null);
            response.setStayDays(booking.getStayDays());
            response.setCheckInDateActual(booking.getCheckInDateActual() != null ? 
                dateFormat.format(booking.getCheckInDateActual()) : null);
            response.setCheckOutDateActual(booking.getCheckOutDateActual() != null ? 
                dateFormat.format(booking.getCheckOutDateActual()) : null);
            response.setStayDaysActual(booking.getStayDaysActual());
            
            // 房间和客人数量
            response.setTotalRooms(booking.getTotalRooms());
            response.setTotalRoomsActual(booking.getTotalRoomsActual());
            response.setTotalRoomNights(booking.getTotalRoomNights());
            response.setTotalRoomNightsActual(booking.getTotalRoomNightsActual());
            response.setTotalGuests(booking.getTotalGuests());
            response.setTotalGuestsActual(booking.getTotalGuestsActual());
            
            // 预订类型和状态
            response.setBookingType(booking.getBookingType());
            response.setBookingStatusChannel(booking.getBookingStatusChannel());
            response.setBookingStatusHotel(booking.getBookingStatusHotel());
            response.setBookingStatusAgent(booking.getBookingStatusAgent());
            
            // 金额信息
            response.setDepositAmountChannel(booking.getDepositAmountChannel() != null ? 
                booking.getDepositAmountChannel().doubleValue() : null);
            response.setDepositAmountAgent(booking.getDepositAmountAgent() != null ? 
                booking.getDepositAmountAgent().doubleValue() : null);
            response.setDepositAmountHotel(booking.getDepositAmountHotel() != null ? 
                booking.getDepositAmountHotel().doubleValue() : null);
            response.setPenaltyAmountChannel(booking.getPenaltyAmountChannel() != null ? 
                booking.getPenaltyAmountChannel().doubleValue() : null);
            response.setPenaltyAmountHotel(booking.getPenaltyAmountHotel() != null ? 
                booking.getPenaltyAmountHotel().doubleValue() : null);
            response.setPenaltyAmountAgent(booking.getPenaltyAmountAgent() != null ? 
                booking.getPenaltyAmountAgent().doubleValue() : null);
            response.setTotalPriceChannel(booking.getTotalPriceChannel() != null ? 
                booking.getTotalPriceChannel().doubleValue() : null);
            response.setTotalPriceHotel(booking.getTotalPriceHotel() != null ? 
                booking.getTotalPriceHotel().doubleValue() : null);
            response.setTotalPriceAgent(booking.getTotalPriceAgent() != null ? 
                booking.getTotalPriceAgent().doubleValue() : null);
            response.setTotalPriceChannelActual(booking.getTotalPriceChannelActual() != null ? 
                booking.getTotalPriceChannelActual().doubleValue() : null);
            response.setTotalPriceHotelActual(booking.getTotalPriceHotelActual() != null ? 
                booking.getTotalPriceHotelActual().doubleValue() : null);
            response.setTotalPriceAgentActual(booking.getTotalPriceAgentActual() != null ? 
                booking.getTotalPriceAgentActual().doubleValue() : null);
            
            // 支付和账单信息
            response.setPaymentDate(booking.getPaymentDate() != null ? 
                dateFormat.format(booking.getPaymentDate()) : null);
            response.setPaymentNo(booking.getPaymentNo());
            response.setBillDate(booking.getBillDate() != null ? 
                dateFormat.format(booking.getBillDate()) : null);
            response.setBillNo(booking.getBillNo());
            
            // 酒店费用
            response.setCateringFeeHotel(booking.getCateringFeeHotel() != null ? 
                booking.getCateringFeeHotel().doubleValue() : null);
            response.setBanquetFeeHotel(booking.getBanquetFeeHotel() != null ? 
                booking.getBanquetFeeHotel().doubleValue() : null);
            response.setOtherFeeHotel(booking.getOtherFeeHotel() != null ? 
                booking.getOtherFeeHotel().doubleValue() : null);
            response.setTotalRevenueFeeHotel(booking.getTotalRevenueFeeHotel() != null ? 
                booking.getTotalRevenueFeeHotel().doubleValue() : null);
            
            // 其他字段
            response.setSign(booking.getSign());
            
            // 销售层级信息
            BookingDetailResponse.SalesLevel salesLevelA = new BookingDetailResponse.SalesLevel();
            salesLevelA.setId(booking.getSalesLevelAId() != null ? booking.getSalesLevelAId() : "");
            salesLevelA.setName(booking.getSalesLevelAName() != null ? booking.getSalesLevelAName() : "");
            salesLevelA.setPhone(booking.getSalesLevelAPhone() != null ? booking.getSalesLevelAPhone() : "");
            salesLevelA.setEmail(booking.getSalesLevelAEmail() != null ? booking.getSalesLevelAEmail() : "");
            response.setSalesLevelA(salesLevelA);
            
            BookingDetailResponse.SalesLevel salesLevelB = new BookingDetailResponse.SalesLevel();
            salesLevelB.setId(booking.getSalesLevelBId() != null ? booking.getSalesLevelBId() : "");
            salesLevelB.setName(booking.getSalesLevelBName() != null ? booking.getSalesLevelBName() : "");
            salesLevelB.setPhone(booking.getSalesLevelBPhone() != null ? booking.getSalesLevelBPhone() : "");
            salesLevelB.setEmail(booking.getSalesLevelBEmail() != null ? booking.getSalesLevelBEmail() : "");
            response.setSalesLevelB(salesLevelB);
            
            BookingDetailResponse.SalesLevel salesLevelC = new BookingDetailResponse.SalesLevel();
            salesLevelC.setId(booking.getSalesLevelCId() != null ? booking.getSalesLevelCId() : "");
            salesLevelC.setName(booking.getSalesLevelCName() != null ? booking.getSalesLevelCName() : "");
            salesLevelC.setPhone(booking.getSalesLevelCPhone() != null ? booking.getSalesLevelCPhone() : "");
            salesLevelC.setEmail(booking.getSalesLevelCEmail() != null ? booking.getSalesLevelCEmail() : "");
            response.setSalesLevelC(salesLevelC);
            
            // 时间戳
            response.setCreatedAt(booking.getCreatedAt() != null ? 
                dateTimeFormat.format(booking.getCreatedAt()) : null);
            response.setUpdatedAt(booking.getUpdatedAt() != null ? 
                dateTimeFormat.format(booking.getUpdatedAt()) : null);
            
            // 客人详细信息
            if (guest != null) {
                BookingDetailResponse.GuestInfo guestInfo = new BookingDetailResponse.GuestInfo();
                guestInfo.setGuestId(guest.getGuestId());
                guestInfo.setGuestName(guest.getGuestName());
                guestInfo.setGuestEname(guest.getGuestEname());
                guestInfo.setFirstName(guest.getFirstName());
                guestInfo.setLastName(guest.getLastName());
                guestInfo.setIdType(guest.getIdType());
                guestInfo.setIdNumber(guest.getIdNumber());
                guestInfo.setPhone(guest.getPhone());
                guestInfo.setEmail(guest.getEmail());
                guestInfo.setAddress(guest.getAddress());
                guestInfo.setSpecialRequests(guest.getSpecialRequests());
                guestInfo.setMemberLevel(guest.getMemberLevel());
                guestInfo.setMemberCardNo(guest.getMemberCardNo());
                guestInfo.setMemberType(guest.getMemberType());
                response.setGuestInfo(guestInfo);
            }
            
            // 预订人详细信息
            if (booker != null) {
                BookingDetailResponse.GuestInfo bookerInfo = new BookingDetailResponse.GuestInfo();
                bookerInfo.setGuestId(booker.getUserId());
                bookerInfo.setGuestName(booker.getFullName());
                bookerInfo.setGuestEname(booker.getUsername());
                bookerInfo.setFirstName(booker.getUsername());
                bookerInfo.setLastName(booker.getFullName());
                bookerInfo.setIdType("用户ID");
                bookerInfo.setIdNumber(booker.getUserId());
                bookerInfo.setPhone(booker.getPhone());
                bookerInfo.setEmail(booker.getEmail());
                bookerInfo.setAddress(booker.getAddress());
                bookerInfo.setSpecialRequests("");
                bookerInfo.setMemberLevel("用户");
                bookerInfo.setMemberCardNo(booker.getUserId());
                bookerInfo.setMemberType("系统用户");
                response.setBookerInfo(bookerInfo);
            }
            
            // 公司详细信息
            if (company != null) {
                BookingDetailResponse.CompanyInfo companyInfo = new BookingDetailResponse.CompanyInfo();
                companyInfo.setCompanyId(company.getCompanyId());
                companyInfo.setCompanyCode(company.getCompanyCode());
                companyInfo.setCompanyName(company.getCompanyName());
                companyInfo.setCompanyEname(company.getCompanyEname());
                companyInfo.setContactPerson(company.getContactPerson());
                companyInfo.setContactEmail(company.getContactEmail());
                companyInfo.setContactPhone(company.getContactPhone());
                companyInfo.setAddress(company.getAddress());
                companyInfo.setMemberLevel(company.getMemberLevel());
                companyInfo.setMemberCardNo(company.getMemberCardNo());
                companyInfo.setMemberType(company.getMemberType());
                response.setCompanyInfo(companyInfo);
            }
            
            // 每日详情
            List<BookingDetailResponse.DailyDetail> dailyDetailList = dailyDetails.stream()
                .map(this::convertToDailyDetail)
                .collect(Collectors.toList());
            response.setDailyDetails(dailyDetailList);
            
            // 预订日志
            List<BookingDetailResponse.BookingLog> logList = bookingLogs.stream()
                .map(this::convertToBookingLog)
                .collect(Collectors.toList());
            response.setLogs(logList);
            
            logger.debug("查询预订详情成功: bookingId={}", bookingId);
            return response;
            
        } catch (Exception e) {
            logger.error("查询预订详情失败", e);
            throw new RuntimeException("查询预订详情失败: " + e.getMessage());
        }
    }
    
    /**
     * 将BookingDaily转换为DailyDetail
     */
    private BookingDetailResponse.DailyDetail convertToDailyDetail(BookingDaily daily) {
        BookingDetailResponse.DailyDetail detail = new BookingDetailResponse.DailyDetail();
        
        // 设置ID字段
        detail.setBookingId(daily.getBookingId());
        detail.setBookingDailyId(daily.getBookingDailyId());
        
        // 设置其他字段
        detail.setStayDate(daily.getStayDate() != null ? 
            dateFormat.format(daily.getStayDate()) : null);
        detail.setRooms(daily.getRooms());
        detail.setRoomsActual(daily.getRoomsActual());
        detail.setPriceChannel(daily.getPriceChannel() != null ? 
            daily.getPriceChannel().doubleValue() : null);
        detail.setPriceHotel(daily.getPriceHotel() != null ? 
            daily.getPriceHotel().doubleValue() : null);
        detail.setPriceAgent(daily.getPriceAgent() != null ? 
            daily.getPriceAgent().doubleValue() : null);
        detail.setPriceChannelActual(daily.getPriceChannelActual() != null ? 
            daily.getPriceChannelActual().doubleValue() : null);
        detail.setPriceHotelActual(daily.getPriceHotelActual() != null ? 
            daily.getPriceHotelActual().doubleValue() : null);
        detail.setPriceAgentActual(daily.getPriceAgentActual() != null ? 
            daily.getPriceAgentActual().doubleValue() : null);
        detail.setCateringFeeHotel(daily.getCateringFeeHotel() != null ? 
            daily.getCateringFeeHotel().doubleValue() : null);
        detail.setBanquetFeeHotel(daily.getBanquetFeeHotel() != null ? 
            daily.getBanquetFeeHotel().doubleValue() : null);
        detail.setOtherFeeHotel(daily.getOtherFeeHotel() != null ? 
            daily.getOtherFeeHotel().doubleValue() : null);
        detail.setTotalRevenueFeeHotel(daily.getTotalRevenueFeeHotel() != null ? 
            daily.getTotalRevenueFeeHotel().doubleValue() : null);
        return detail;
    }
    
    /**
     * 将BookingLog转换为BookingDetailResponse.BookingLog
     */
    private BookingDetailResponse.BookingLog convertToBookingLog(BookingLog log) {
        BookingDetailResponse.BookingLog bookingLog = new BookingDetailResponse.BookingLog();
        bookingLog.setBookingLogId(log.getBookingLogId());
        bookingLog.setBookingId(log.getBookingId());
        bookingLog.setVersion(log.getVersion());
        bookingLog.setOperation(log.getOperation());
        bookingLog.setOperator(log.getOperator());
        bookingLog.setOperateTime(log.getOperateTime() != null ? 
            dateTimeFormat.format(log.getOperateTime()) : null);
        
        // 处理JSON字段
        try {
            if (log.getBookingSnapshot() != null) {
                bookingLog.setBookingSnapshot(objectMapper.readTree(log.getBookingSnapshot()));
            }
            if (log.getChangeSummary() != null) {
                bookingLog.setChangeSummary(objectMapper.readTree(log.getChangeSummary()));
            }
        } catch (Exception e) {
            logger.warn("解析日志JSON字段失败", e);
            bookingLog.setBookingSnapshot(null);
            bookingLog.setChangeSummary(null);
        }
        
        return bookingLog;
    }
    
    @Override
    public List<Booking> getBookingList(BookingListRequest request) {
        try {
            int offset = request.getPage() * request.getSize();
            return bookingMapper.selectByCondition(
                request.getChainId(),
                request.getHotelId(),
                request.getBookingId(),
                request.getCrsResvNo(),
                request.getChannelResvNo(),
                request.getHotelResvNo(),
                request.getGuestName(),
                request.getBookerName(),
                request.getChannelCodes(),
                request.getRateCode(),
                request.getRoomTypeCode(),
                request.getCheckInDateStart(),
                request.getCheckInDateEnd(),
                request.getCheckOutDateStart(),
                request.getCheckOutDateEnd(),
                request.getBookingStatus(),
                request.getPage(),
                request.getSize(),
                offset
            );
        } catch (Exception e) {
            logger.error("查询预订列表失败", e);
            throw new RuntimeException("查询预订列表失败: " + e.getMessage());
        }
    }
    
    @Override
    public List<Booking> getBookingsByChainId(String chainId) {
        try {
            return bookingMapper.selectByChainId(chainId);
        } catch (Exception e) {
            logger.error("根据连锁ID查询预订失败", e);
            throw new RuntimeException("根据连锁ID查询预订失败: " + e.getMessage());
        }
    }
    
    @Override
    public List<Booking> getBookingsByHotelId(String hotelId) {
        try {
            return bookingMapper.selectByHotelId(hotelId);
        } catch (Exception e) {
            logger.error("根据酒店ID查询预订失败", e);
            throw new RuntimeException("根据酒店ID查询预订失败: " + e.getMessage());
        }
    }
    
    @Override
    public List<Booking> getBookingsByCheckInDateRange(Date checkInDateStart, Date checkInDateEnd) {
        try {
            return bookingMapper.selectByCheckInDateRange(checkInDateStart, checkInDateEnd);
        } catch (Exception e) {
            logger.error("根据入住日期范围查询预订失败", e);
            throw new RuntimeException("根据入住日期范围查询预订失败: " + e.getMessage());
        }
    }
    
    @Override
    public List<Booking> getBookingsByCheckOutDateRange(Date checkOutDateStart, Date checkOutDateEnd) {
        try {
            return bookingMapper.selectByCheckOutDateRange(checkOutDateStart, checkOutDateEnd);
        } catch (Exception e) {
            logger.error("根据离店日期范围查询预订失败", e);
            throw new RuntimeException("根据离店日期范围查询预订失败: " + e.getMessage());
        }
    }
    
    @Override
    public List<Booking> getBookingsByGuestName(String guestName) {
        try {
            return bookingMapper.selectByGuestName(guestName);
        } catch (Exception e) {
            logger.error("根据客人姓名查询预订失败", e);
            throw new RuntimeException("根据客人姓名查询预订失败: " + e.getMessage());
        }
    }
    
    @Override
    public List<Booking> getBookingsByBookerName(String bookerName) {
        try {
            return bookingMapper.selectByBookerName(bookerName);
        } catch (Exception e) {
            logger.error("根据预订人姓名查询预订失败", e);
            throw new RuntimeException("根据预订人姓名查询预订失败: " + e.getMessage());
        }
    }
    
    @Override
    public List<Booking> getBookingsByChannelCode(String channelCode) {
        try {
            return bookingMapper.selectByChannelCode(channelCode);
        } catch (Exception e) {
            logger.error("根据渠道代码查询预订失败", e);
            throw new RuntimeException("根据渠道代码查询预订失败: " + e.getMessage());
        }
    }
    
    @Override
    public List<Booking> getBookingsByStatus(String bookingStatus) {
        try {
            return bookingMapper.selectByBookingStatus(bookingStatus);
        } catch (Exception e) {
            logger.error("根据预订状态查询预订失败", e);
            throw new RuntimeException("根据预订状态查询预订失败: " + e.getMessage());
        }
    }
    
    @Override
    public int countBookings(BookingListRequest request) {
        try {
            return bookingMapper.countByCondition(
                request.getChainId(),
                request.getHotelId(),
                request.getBookingId(),
                request.getCrsResvNo(),
                request.getChannelResvNo(),
                request.getHotelResvNo(),
                request.getGuestName(),
                request.getBookerName(),
                request.getChannelCodes(),
                request.getRateCode(),
                request.getRoomTypeCode(),
                request.getCheckInDateStart(),
                request.getCheckInDateEnd(),
                request.getCheckOutDateStart(),
                request.getCheckOutDateEnd(),
                request.getBookingStatus()
            );
        } catch (Exception e) {
            logger.error("统计预订数量失败", e);
            throw new RuntimeException("统计预订数量失败: " + e.getMessage());
        }
    }
    
    @Override
    @Transactional
    public int cancelBooking(String bookingId, String cancelReason) {
        try {
            logger.debug("开始取消预订: bookingId={}, reason={}", bookingId, cancelReason);
            
            Booking booking = getCompleteBooking(bookingId);
            if (booking == null) {
                throw new RuntimeException("预订不存在: " + bookingId);
            }
            
            booking.setBookingStatusHotel("CANCELLED");
            booking.setRemarkCancel(cancelReason);
            booking.setUpdatedAt(new Date());
            
            bookingMapper.update(booking);
            
            // 记录取消日志
            saveBookingLog(booking, "CANCEL", null);
            
            logger.debug("预订取消成功: bookingId={}", bookingId);
            return 1;
            
        } catch (Exception e) {
            logger.error("取消预订失败", e);
            throw new RuntimeException("取消预订失败: " + e.getMessage());
        }
    }
    
    @Override
    @Transactional
    public int confirmBooking(String bookingId, BookingConfirmRequest request) {
        try {
            logger.debug("开始确认预订: bookingId={}, confirmNumber={}, userId={}", bookingId, 
                request != null ? request.getConfirmNumber() : null,
                request != null ? request.getUserId() : null);
            
            Booking booking = getCompleteBooking(bookingId);
            if (booking == null) {
                throw new RuntimeException("预订不存在: " + bookingId);
            }
            
           
            
            bookingMapper.updateConfirmNumber(booking.getBookingId(), request.getConfirmNumber(),"CONFIRMED");
            
            // 记录确认日志
            saveBookingLog(booking, "CONFIRM", request != null ? request.getUserId() : null);
            
            logger.debug("预订确认成功: bookingId={}", bookingId);
            return 1;
            
        } catch (Exception e) {
            logger.error("确认预订失败", e);
            throw new RuntimeException("确认预订失败: " + e.getMessage());
        }
    }
    
    @Override
    @Transactional
    public int modifyBooking(String bookingId, BookingAddRequest request) {
        try {
            logger.debug("开始修改预订: bookingId={}", bookingId);
            
            // 1. 删除原有预订
            deleteBooking(bookingId);
            
            // 2. 重新添加预订
            return addBooking(request);
            
        } catch (Exception e) {
            logger.error("修改预订失败", e);
            throw new RuntimeException("修改预订失败: " + e.getMessage());
        }
    }
    
    /**
     * 处理客人信息
     */
    private String processGuestInfo(BookingAddRequest.GuestInfo guestInfo) {
        // 检查是否已存在相同手机号的客人
        Guest existingGuest = guestMapper.selectByPhone(guestInfo.getPhone());
        if (existingGuest != null) {
            return existingGuest.getGuestId();
        }
        
        // 创建新客人
        Guest guest = new Guest();
        guest.setGuestId(IdGenerator.generate64BitId());
        guest.setGuestName(guestInfo.getGuestName());
        guest.setGuestEname(guestInfo.getGuestEname());
        guest.setPhone(guestInfo.getPhone());
        guest.setEmail(guestInfo.getEmail());
        guest.setMemberCardNo(guestInfo.getMemberNumber());
        guest.setMemberType(guestInfo.getMemberType());
        
        guestMapper.insert(guest);
        return guest.getGuestId();
    }
    
    /**
     * 处理公司信息
     */
    private String processCompanyInfo(BookingAddRequest.CompanyInfo companyInfo) {
        // 检查是否已存在相同名称的公司
        List<Company> existingCompanies = companyMapper.selectByCompanyName(companyInfo.getCompanyName());
        if (!existingCompanies.isEmpty()) {
            return existingCompanies.get(0).getCompanyId();
        }
        
        // 创建新公司
        Company company = new Company();
        company.setCompanyId(IdGenerator.generate64BitId());
        company.setCompanyName(companyInfo.getCompanyName());
        company.setContactPerson(companyInfo.getContactPerson());
        company.setContactPhone(companyInfo.getContactPhone());
        company.setContactEmail(companyInfo.getContactEmail());
        
        companyMapper.insert(company);
        return company.getCompanyId();
    }
    
    /**
     * 处理每日价格信息
     */
    private void processDailyPrices(String bookingId, BookingAddRequest request) {
        for (BookingAddRequest.DailyPriceInfo dailyPriceInfo : request.getDailyPrices()) {
            BookingDaily bookingDaily = new BookingDaily();
            bookingDaily.setBookingDailyId(IdGenerator.generate64BitId());
            bookingDaily.setBookingId(bookingId);
            bookingDaily.setHotelId(request.getHotelId());
            bookingDaily.setChainId(request.getChainId());
            bookingDaily.setChainCode(chainMapper.selectByChainId(request.getChainId()).getChainCode());
            bookingDaily.setHotelCode(hotelMapper.selectByHotelId(request.getHotelId()).getHotelCode());
            
            // 房型信息
            bookingDaily.setRoomTypeCode(dailyPriceInfo.getRoomTypeCode() != null ? 
                dailyPriceInfo.getRoomTypeCode() : request.getRoomTypeCode());
            bookingDaily.setRoomTypeName(dailyPriceInfo.getRoomTypeName() != null ? 
                dailyPriceInfo.getRoomTypeName() : request.getRoomTypeName());
            
            // 房价码信息
            bookingDaily.setRateCode(dailyPriceInfo.getRateCode() != null ? 
                dailyPriceInfo.getRateCode() : request.getRateCode());
            bookingDaily.setRateCodeName(dailyPriceInfo.getRateCodeName() != null ? 
                dailyPriceInfo.getRateCodeName() : request.getRateCodeName());
            
            // 套餐信息
            bookingDaily.setPackageCode(dailyPriceInfo.getPackageCode() != null ? 
                dailyPriceInfo.getPackageCode() : request.getPackageCode());
            bookingDaily.setPackageName(dailyPriceInfo.getPackageName() != null ? 
                dailyPriceInfo.getPackageName() : request.getPackageName());
            bookingDaily.setPackageQuantity(dailyPriceInfo.getPackageQuantity() != null ? 
                dailyPriceInfo.getPackageQuantity() : request.getPackageQuantity());
            bookingDaily.setPackageUnitPrice(dailyPriceInfo.getPackageUnitPrice() != null ? 
                dailyPriceInfo.getPackageUnitPrice() : request.getPackageUnitPrice());
            
            // 房间号
            bookingDaily.setHotelRoomNo(dailyPriceInfo.getHotelRoomNo());
            
            // 入住日期
            bookingDaily.setStayDate(dailyPriceInfo.getStayDate());
            
            // 房间数量
            bookingDaily.setRooms(dailyPriceInfo.getRooms() != null ? 
                dailyPriceInfo.getRooms() : request.getRoomsPerDay());
            bookingDaily.setRoomsActual(dailyPriceInfo.getRooms() != null ? 
                dailyPriceInfo.getRooms() : request.getRoomsPerDay());
            
            // 价格信息
            bookingDaily.setPriceChannel(dailyPriceInfo.getPriceChannel());
            bookingDaily.setPriceHotel(dailyPriceInfo.getPriceHotel());
            bookingDaily.setPriceAgent(dailyPriceInfo.getPriceAgent());
            
            // 实际价格（初始时与计划价格相同）
            bookingDaily.setPriceChannelActual(dailyPriceInfo.getPriceChannel());
            bookingDaily.setPriceHotelActual(dailyPriceInfo.getPriceHotel());
            bookingDaily.setPriceAgentActual(dailyPriceInfo.getPriceAgent());
            
            // 酒店费用（初始为0）
            bookingDaily.setCateringFeeHotel(BigDecimal.ZERO);
            bookingDaily.setBanquetFeeHotel(BigDecimal.ZERO);
            bookingDaily.setOtherFeeHotel(BigDecimal.ZERO);
            bookingDaily.setTotalRevenueFeeHotel(BigDecimal.ZERO);
            
            bookingDailyMapper.insert(bookingDaily);
        }
    }
    
    /**
     * 保存预订日志
     * @param booking 预订对象
     * @param operation 操作类型
     * @param operator 操作人
     */
    private void saveBookingLog(Booking booking, String operation, String operator) {
        saveBookingLog(booking, operation, operator, null, null);
    }
    
    /**
     * 保存预订日志（带变化摘要）
     * @param booking 预订对象
     * @param operation 操作类型
     * @param operator 操作人
     * @param bookingDailyId 预订每日记录ID（可选）
     * @param changeSummary 变化摘要（可选）
     */
    private void saveBookingLog(Booking booking, String operation, String operator, String bookingDailyId, String changeSummary) {
        try {
            // 生成日志ID
            String bookingLogId = IdGenerator.generate64BitId();
            
            // 生成版本号（使用时间戳）
            String version = String.valueOf(System.currentTimeMillis());
            
            // 将booking对象转换为JSON格式
            String bookingSnapshot = convertBookingToJson(booking);
            
            // 如果没有提供变化摘要，则尝试生成
            if (changeSummary == null ) {
                changeSummary = generateChangeSummary(booking);
            }
            //打印changeSummary
            logger.info("changeSummary: {}", changeSummary);
            
            // 创建日志记录
            BookingLog bookingLog = new BookingLog();
            bookingLog.setBookingLogId(bookingLogId);
            bookingLog.setBookingId(booking.getBookingId());
            bookingLog.setVersion(version);
            bookingLog.setOperation(operation);
            bookingLog.setOperator(operator);
            bookingLog.setOperateTime(new Date());
            bookingLog.setBookingSnapshot(bookingSnapshot);
            bookingLog.setChangeSummary(changeSummary);
            
            // 插入日志记录
            bookingLogMapper.insert(bookingLog);
            
            logger.debug("预订日志记录成功: bookingId={}, operation={}", booking.getBookingId(), operation);
            
        } catch (Exception e) {
            logger.error("保存预订日志失败", e);
            // 日志记录失败不影响主业务流程，只记录错误
        }
    }
    
    /**
     * 将Booking对象转换为符合订单详情格式的JSON字符串
     * @param booking 预订对象
     * @return JSON字符串
     */
    private String convertBookingToJson(Booking booking) {
        try {
            ObjectNode rootNode = objectMapper.createObjectNode();
            
            // 基本信息
            rootNode.put("bookingId", booking.getBookingId());
            rootNode.put("chainId", booking.getChainId());
            rootNode.put("hotelId", booking.getHotelId());
            rootNode.put("chainCode", booking.getChainCode());
            rootNode.put("chainName", booking.getChainName());
            rootNode.put("hotelCode", booking.getHotelCode());
            rootNode.put("hotelName", booking.getHotelName());
            rootNode.put("roomTypeCode", booking.getRoomTypeCode());
            rootNode.put("roomTypeName", booking.getRoomTypeName());
            rootNode.put("rateCode", booking.getRateCode());
            rootNode.put("rateCodeName", booking.getRateCodeName());
            rootNode.put("packageCode", booking.getPackageCode());
            rootNode.put("packageName", booking.getPackageName());
            rootNode.put("channelCode", booking.getChannelCode());
            rootNode.put("channelSubcode", booking.getChannelSubcode());
            rootNode.put("bookerCode", booking.getBookerCode());
            rootNode.put("agentCode", booking.getAgentCode());
            rootNode.put("sourceCode", booking.getSourceCode());
            rootNode.put("marketCode", booking.getMarketCode());
            rootNode.put("bookerType", booking.getBookerType());
            
            // 预订号信息
            rootNode.put("channelResvNo", booking.getChannelResvNo());
            rootNode.put("channelResvSno", booking.getChannelResvSno());
            rootNode.put("channelResvPno", booking.getChannelResvPno());
            rootNode.put("crsResvNo", booking.getCrsResvNo());
            rootNode.put("crsResvPno", booking.getCrsResvPno());
            rootNode.put("crsResvCheckinNo", booking.getCrsResvCheckinNo());
            rootNode.put("agentResvNo", booking.getAgentResvNo());
            rootNode.put("agentResvPno", booking.getAgentResvPno());
            rootNode.put("hotelResvNo", booking.getHotelResvNo());
            rootNode.put("hotelResvKey", booking.getHotelResvKey());
            rootNode.put("hotelResvConfirm", booking.getHotelResvConfirm());
            rootNode.put("hotelRoomNo", booking.getHotelRoomNo());
            
            // 预订类型和状态
            rootNode.put("paymentType", booking.getPaymentType());
            rootNode.put("reservationType", booking.getReservationType());
            rootNode.put("cancellationType", booking.getCancellationType());
            rootNode.put("latestCancellationDays", booking.getLatestCancellationDays());
            rootNode.put("latestCancellationTime", booking.getLatestCancellationTime() != null ? 
                booking.getLatestCancellationTime().toString() : null);
            rootNode.put("cancellableAfterBooking", booking.getCancellableAfterBooking());
            rootNode.put("orderRetentionTime", booking.getOrderRetentionTime() != null ? 
                booking.getOrderRetentionTime().toString() : null);
            rootNode.put("arrivalTime", booking.getArrivalTime() != null ? 
                booking.getArrivalTime().toString() : null);
            
            // 备注信息
            rootNode.put("remarkHotel", booking.getRemarkHotel());
            rootNode.put("remarkChannel", booking.getRemarkChannel());
            rootNode.put("remarkAgent", booking.getRemarkAgent());
            rootNode.put("remarkGuest", booking.getRemarkGuest());
            rootNode.put("remarkSpecial", booking.getRemarkSpecial());
            rootNode.put("remarkInvoice", booking.getRemarkInvoice());
            rootNode.put("remarkCancel", booking.getRemarkCancel());
            
            // 公司信息
            rootNode.put("companyId", booking.getCompanyId());
            rootNode.put("companyNo", booking.getCompanyNo());
            rootNode.put("companyName", booking.getCompanyName());
            rootNode.put("companyTmcId", booking.getCompanyTmcId());
            rootNode.put("companyTmcNo", booking.getCompanyTmcNo());
            rootNode.put("companyTmcName", booking.getCompanyTmcName());
            
            // 会员信息
            rootNode.put("memberNoGuest", booking.getMemberNoGuest());
            rootNode.put("memberTypeGuest", booking.getMemberTypeGuest());
            rootNode.put("memberNoBooker", booking.getMemberNoBooker());
            rootNode.put("memberTypeBooker", booking.getMemberTypeBooker());
            
            // 客人和预订人信息
            rootNode.put("guestId", booking.getGuestId());
            rootNode.put("guestName", booking.getGuestName());
            rootNode.put("guestEname", booking.getGuestEname());
            rootNode.put("bookerId", booking.getBookerId());
            rootNode.put("bookerName", booking.getBookerName());
            
            // 日期信息
            rootNode.put("bookingDate", booking.getBookingDate() != null ? 
                dateFormat.format(booking.getBookingDate()) : null);
            rootNode.put("advanceBookingDays", booking.getAdvanceBookingDays() != null ? 
                booking.getAdvanceBookingDays().doubleValue() : null);
            rootNode.put("checkInDate", booking.getCheckInDate() != null ? 
                dateFormat.format(booking.getCheckInDate()) : null);
            rootNode.put("checkOutDate", booking.getCheckOutDate() != null ? 
                dateFormat.format(booking.getCheckOutDate()) : null);
            rootNode.put("stayDays", booking.getStayDays());
            rootNode.put("checkInDateActual", booking.getCheckInDateActual() != null ? 
                dateFormat.format(booking.getCheckInDateActual()) : null);
            rootNode.put("checkOutDateActual", booking.getCheckOutDateActual() != null ? 
                dateFormat.format(booking.getCheckOutDateActual()) : null);
            rootNode.put("stayDaysActual", booking.getStayDaysActual());
            
            // 房间和客人数量
            rootNode.put("totalRooms", booking.getTotalRooms());
            rootNode.put("totalRoomsActual", booking.getTotalRoomsActual());
            rootNode.put("totalRoomNights", booking.getTotalRoomNights());
            rootNode.put("totalRoomNightsActual", booking.getTotalRoomNightsActual());
            rootNode.put("totalGuests", booking.getTotalGuests());
            rootNode.put("totalGuestsActual", booking.getTotalGuestsActual());
            
            // 预订类型和状态
            rootNode.put("bookingType", booking.getBookingType());
            rootNode.put("bookingStatusChannel", booking.getBookingStatusChannel());
            rootNode.put("bookingStatusHotel", booking.getBookingStatusHotel());
            rootNode.put("bookingStatusAgent", booking.getBookingStatusAgent());
            
            // 金额信息
            rootNode.put("depositAmountChannel", booking.getDepositAmountChannel() != null ? 
                booking.getDepositAmountChannel().doubleValue() : null);
            rootNode.put("depositAmountAgent", booking.getDepositAmountAgent() != null ? 
                booking.getDepositAmountAgent().doubleValue() : null);
            rootNode.put("depositAmountHotel", booking.getDepositAmountHotel() != null ? 
                booking.getDepositAmountHotel().doubleValue() : null);
            rootNode.put("penaltyAmountChannel", booking.getPenaltyAmountChannel() != null ? 
                booking.getPenaltyAmountChannel().doubleValue() : null);
            rootNode.put("penaltyAmountHotel", booking.getPenaltyAmountHotel() != null ? 
                booking.getPenaltyAmountHotel().doubleValue() : null);
            rootNode.put("penaltyAmountAgent", booking.getPenaltyAmountAgent() != null ? 
                booking.getPenaltyAmountAgent().doubleValue() : null);
            rootNode.put("totalPriceChannel", booking.getTotalPriceChannel() != null ? 
                booking.getTotalPriceChannel().doubleValue() : null);
            rootNode.put("totalPriceHotel", booking.getTotalPriceHotel() != null ? 
                booking.getTotalPriceHotel().doubleValue() : null);
            rootNode.put("totalPriceAgent", booking.getTotalPriceAgent() != null ? 
                booking.getTotalPriceAgent().doubleValue() : null);
            rootNode.put("totalPriceChannelActual", booking.getTotalPriceChannelActual() != null ? 
                booking.getTotalPriceChannelActual().doubleValue() : null);
            rootNode.put("totalPriceHotelActual", booking.getTotalPriceHotelActual() != null ? 
                booking.getTotalPriceHotelActual().doubleValue() : null);
            rootNode.put("totalPriceAgentActual", booking.getTotalPriceAgentActual() != null ? 
                booking.getTotalPriceAgentActual().doubleValue() : null);
            
            // 支付和账单信息
            rootNode.put("paymentDate", booking.getPaymentDate() != null ? 
                dateFormat.format(booking.getPaymentDate()) : null);
            rootNode.put("paymentNo", booking.getPaymentNo());
            rootNode.put("billDate", booking.getBillDate() != null ? 
                dateFormat.format(booking.getBillDate()) : null);
            rootNode.put("billNo", booking.getBillNo());
            
            // 酒店费用
            rootNode.put("cateringFeeHotel", booking.getCateringFeeHotel() != null ? 
                booking.getCateringFeeHotel().doubleValue() : null);
            rootNode.put("banquetFeeHotel", booking.getBanquetFeeHotel() != null ? 
                booking.getBanquetFeeHotel().doubleValue() : null);
            rootNode.put("otherFeeHotel", booking.getOtherFeeHotel() != null ? 
                booking.getOtherFeeHotel().doubleValue() : null);
            rootNode.put("totalRevenueFeeHotel", booking.getTotalRevenueFeeHotel() != null ? 
                booking.getTotalRevenueFeeHotel().doubleValue() : null);
            
            // 其他字段
            rootNode.put("sign", booking.getSign());
            
            // 销售层级信息（如果字段为空则设置为null）
            ObjectNode salesLevelA = objectMapper.createObjectNode();
            salesLevelA.put("id", booking.getSalesLevelAId() != null ? booking.getSalesLevelAId() : "");
            salesLevelA.put("name", booking.getSalesLevelAName() != null ? booking.getSalesLevelAName() : "");
            salesLevelA.put("phone", booking.getSalesLevelAPhone() != null ? booking.getSalesLevelAPhone() : "");
            salesLevelA.put("email", booking.getSalesLevelAEmail() != null ? booking.getSalesLevelAEmail() : "");
            rootNode.set("salesLevelA", salesLevelA);
            
            ObjectNode salesLevelB = objectMapper.createObjectNode();
            salesLevelB.put("id", booking.getSalesLevelBId() != null ? booking.getSalesLevelBId() : "");
            salesLevelB.put("name", booking.getSalesLevelBName() != null ? booking.getSalesLevelBName() : "");
            salesLevelB.put("phone", booking.getSalesLevelBPhone() != null ? booking.getSalesLevelBPhone() : "");
            salesLevelB.put("email", booking.getSalesLevelBEmail() != null ? booking.getSalesLevelBEmail() : "");
            rootNode.set("salesLevelB", salesLevelB);
            
            ObjectNode salesLevelC = objectMapper.createObjectNode();
            salesLevelC.put("id", booking.getSalesLevelCId() != null ? booking.getSalesLevelCId() : "");
            salesLevelC.put("name", booking.getSalesLevelCName() != null ? booking.getSalesLevelCName() : "");
            salesLevelC.put("phone", booking.getSalesLevelCPhone() != null ? booking.getSalesLevelCPhone() : "");
            salesLevelC.put("email", booking.getSalesLevelCEmail() != null ? booking.getSalesLevelCEmail() : "");
            rootNode.set("salesLevelC", salesLevelC);
            
            // 时间戳
            rootNode.put("createdAt", booking.getCreatedAt() != null ? 
                dateTimeFormat.format(booking.getCreatedAt()) : null);
            rootNode.put("updatedAt", booking.getUpdatedAt() != null ? 
                dateTimeFormat.format(booking.getUpdatedAt()) : null);
            
            // 添加每日详情
            ArrayNode dailyDetailsArray = objectMapper.createArrayNode();
            if (booking.getBookingDailys() != null) {
                for (BookingDaily daily : booking.getBookingDailys()) {
                ObjectNode dailyNode = objectMapper.createObjectNode();
                dailyNode.put("stayDate", daily.getStayDate() != null ? 
                    dateFormat.format(daily.getStayDate()) : null);
                dailyNode.put("rooms", daily.getRooms());
                dailyNode.put("roomsActual", daily.getRoomsActual());
                dailyNode.put("priceChannel", daily.getPriceChannel() != null ? 
                    daily.getPriceChannel().doubleValue() : null);
                dailyNode.put("priceHotel", daily.getPriceHotel() != null ? 
                    daily.getPriceHotel().doubleValue() : null);
                dailyNode.put("priceAgent", daily.getPriceAgent() != null ? 
                    daily.getPriceAgent().doubleValue() : null);
                dailyNode.put("priceChannelActual", daily.getPriceChannelActual() != null ? 
                    daily.getPriceChannelActual().doubleValue() : null);
                dailyNode.put("priceHotelActual", daily.getPriceHotelActual() != null ? 
                    daily.getPriceHotelActual().doubleValue() : null);
                dailyNode.put("priceAgentActual", daily.getPriceAgentActual() != null ? 
                    daily.getPriceAgentActual().doubleValue() : null);
                dailyNode.put("cateringFeeHotel", daily.getCateringFeeHotel() != null ? 
                    daily.getCateringFeeHotel().doubleValue() : null);
                dailyNode.put("banquetFeeHotel", daily.getBanquetFeeHotel() != null ? 
                    daily.getBanquetFeeHotel().doubleValue() : null);
                dailyNode.put("otherFeeHotel", daily.getOtherFeeHotel() != null ? 
                    daily.getOtherFeeHotel().doubleValue() : null);
                dailyNode.put("totalRevenueFeeHotel", daily.getTotalRevenueFeeHotel() != null ? 
                    daily.getTotalRevenueFeeHotel().doubleValue() : null);
                dailyDetailsArray.add(dailyNode);
                }
            }
            rootNode.set("dailyDetails", dailyDetailsArray);
            
            return objectMapper.writeValueAsString(rootNode);
            
        } catch (Exception e) {
            logger.error("转换预订对象为JSON失败", e);
            throw new RuntimeException("转换预订对象为JSON失败: " + e.getMessage());
        }
    }
    
    /**
     * 生成变化摘要
     * @param booking 预订对象
     * @return 变化摘要JSON字符串
     */
    private String generateChangeSummary(Booking booking) {
        try {
            ObjectNode changeSummary = objectMapper.createObjectNode();
            
            // 比较预订主表的变化
            compareBookingChanges(booking, changeSummary);
            compareBookingDailyChanges(booking, changeSummary);
            logger.info("generateChangeSummary - changeSummary: {}", changeSummary);
            
            // 如果没有变化，返回null
            if (changeSummary.size() == 0) {
                return null;
            }
            
            return objectMapper.writeValueAsString(changeSummary);
            
        } catch (Exception e) {
            logger.error("生成变化摘要失败", e);
            return null;
        }
    }
    
    /**
     * 比较预订主表的变化
     * @param booking 输入的预订对象
     * @param changeSummary 变化摘要对象
     */
    private void compareBookingChanges(Booking booking, ObjectNode changeSummary) {
        try {
            String bookingId = booking.getBookingId();
            // 获取当前预订记录
            Booking currentBooking = getCompleteBooking(bookingId);
            if (currentBooking == null) {
                return;
            }
            
            // 比较关键字段的变化
            ObjectNode bookingChanges = objectMapper.createObjectNode();
            
            // 比较预订状态
            compareField(currentBooking.getBookingStatusAgent(), booking.getBookingStatusAgent(), 
                "bookingStatusAgent", bookingChanges);
            compareField(currentBooking.getBookingStatusChannel(), booking.getBookingStatusChannel(), 
                "bookingStatusChannel", bookingChanges);
            compareField(currentBooking.getBookingStatusHotel(), booking.getBookingStatusHotel(), 
                "bookingStatusHotel", bookingChanges);
            
            // 比较价格字段
            compareField(currentBooking.getTotalPriceChannel(), booking.getTotalPriceChannel(), 
                "totalPriceChannel", bookingChanges);
            compareField(currentBooking.getTotalPriceHotel(), booking.getTotalPriceHotel(), 
                "totalPriceHotel", bookingChanges);
            compareField(currentBooking.getTotalPriceAgent(), booking.getTotalPriceAgent(), 
                "totalPriceAgent", bookingChanges);
            compareField(currentBooking.getTotalPriceChannelActual(), booking.getTotalPriceChannelActual(), 
                "totalPriceChannelActual", bookingChanges);
            compareField(currentBooking.getTotalPriceHotelActual(), booking.getTotalPriceHotelActual(), 
                "totalPriceHotelActual", bookingChanges);
            compareField(currentBooking.getTotalPriceAgentActual(), booking.getTotalPriceAgentActual(), 
                "totalPriceAgentActual", bookingChanges);
            
            // 比较房间和客人数量
            compareField(currentBooking.getTotalRooms(), booking.getTotalRooms(), 
                "totalRooms", bookingChanges);
            compareField(currentBooking.getTotalRoomsActual(), booking.getTotalRoomsActual(), 
                "totalRoomsActual", bookingChanges);
            compareField(currentBooking.getTotalGuests(), booking.getTotalGuests(), 
                "totalGuests", bookingChanges);
            compareField(currentBooking.getTotalGuestsActual(), booking.getTotalGuestsActual(), 
                "totalGuestsActual", bookingChanges);
            
            // 比较日期字段
            compareDateField(currentBooking.getCheckInDate(), booking.getCheckInDate(), 
                "checkInDate", bookingChanges);
            compareDateField(currentBooking.getCheckOutDate(), booking.getCheckOutDate(), 
                "checkOutDate", bookingChanges);
            compareDateField(currentBooking.getCheckInDateActual(), booking.getCheckInDateActual(), 
                "checkInDateActual", bookingChanges);
            compareDateField(currentBooking.getCheckOutDateActual(), booking.getCheckOutDateActual(), 
                "checkOutDateActual", bookingChanges);
            
            // 比较备注字段
            compareField(currentBooking.getRemarkHotel(), booking.getRemarkHotel(), 
                "remarkHotel", bookingChanges);
            compareField(currentBooking.getRemarkChannel(), booking.getRemarkChannel(), 
                "remarkChannel", bookingChanges);
            compareField(currentBooking.getRemarkAgent(), booking.getRemarkAgent(), 
                "remarkAgent", bookingChanges);
            compareField(currentBooking.getRemarkGuest(), booking.getRemarkGuest(), 
                "remarkGuest", bookingChanges);
            compareField(currentBooking.getRemarkCancel(), booking.getRemarkCancel(), 
                "remarkCancel", bookingChanges);
            
            // 比较取消政策
            compareField(currentBooking.getCancellableAfterBooking(), booking.getCancellableAfterBooking(), 
                "cancellableAfterBooking", bookingChanges);
            compareField(currentBooking.getLatestCancellationDays(), booking.getLatestCancellationDays(), 
                "latestCancellationDays", bookingChanges);
            compareField(currentBooking.getLatestCancellationTime(), booking.getLatestCancellationTime(), 
                "latestCancellationTime", bookingChanges);
            
            // 如果有变化，添加到变化摘要中
            if (bookingChanges.size() > 0) {
                changeSummary.set("booking", bookingChanges);
            }
            
        } catch (Exception e) {
            logger.error("比较预订变化失败", e);
        }
    }
    
    /**
     * 比较预订每日价格的变化
     * @param bookingId 预订ID
     * @param bookingDailyId 预订每日记录ID
     * @param changeSummary 变化摘要对象
     */
    private void compareBookingDailyChanges(Booking booking, ObjectNode changeSummary) {
        try {
            String bookingId = booking.getBookingId();
            // 数据库当前所有daily
            List<BookingDaily> dbDailyList = bookingDailyMapper.selectByBookingId(bookingId);
            logger.info("dbDailyList: {}", dbDailyList != null ? dbDailyList.size() : 0);
            logger.info("booking.getBookingDailys(): {}", booking.getBookingDailys() != null ? booking.getBookingDailys().size() : 0);
            if (dbDailyList == null || booking.getBookingDailys() == null) return;

            // 以bookingId+stayDate为key便于查找
            Map<String, BookingDaily> dbDailyMap = dbDailyList.stream()
                .collect(Collectors.toMap(
                    d -> d.getBookingId() + "_" + (d.getStayDate() != null ? dateFormat.format(d.getStayDate()) : ""),
                    d -> d
                ));

            ArrayNode dailyChanges = objectMapper.createArrayNode();

            for (BookingDaily inputDaily : booking.getBookingDailys()) {
                String key = inputDaily.getBookingId() + "_" + (inputDaily.getStayDate() != null ? dateFormat.format(inputDaily.getStayDate()) : "");
                BookingDaily dbDaily = dbDailyMap.get(key);
                if (dbDaily == null) continue;

                ObjectNode diff = objectMapper.createObjectNode();
                diff.put("bookingDailyId", inputDaily.getBookingDailyId());
                diff.put("bookingId", inputDaily.getBookingId());
                diff.put("stayDate", inputDaily.getStayDate() != null ? dateFormat.format(inputDaily.getStayDate()) : null);

                // 比较价格字段
                compareField(dbDaily.getPriceChannel(), inputDaily.getPriceChannel(), "priceChannel", diff);
                compareField(dbDaily.getPriceHotel(), inputDaily.getPriceHotel(), "priceHotel", diff);
                compareField(dbDaily.getPriceAgent(), inputDaily.getPriceAgent(), "priceAgent", diff);
                compareField(dbDaily.getPriceChannelActual(), inputDaily.getPriceChannelActual(), "priceChannelActual", diff);
                compareField(dbDaily.getPriceHotelActual(), inputDaily.getPriceHotelActual(), "priceHotelActual", diff);
                compareField(dbDaily.getPriceAgentActual(), inputDaily.getPriceAgentActual(), "priceAgentActual", diff);
                
                // 比较房间数量
                compareField(dbDaily.getRooms(), inputDaily.getRooms(), "rooms", diff);
                compareField(dbDaily.getRoomsActual(), inputDaily.getRoomsActual(), "roomsActual", diff);
                
                // 比较酒店费用
                compareField(dbDaily.getCateringFeeHotel(), inputDaily.getCateringFeeHotel(), "cateringFeeHotel", diff);
                compareField(dbDaily.getBanquetFeeHotel(), inputDaily.getBanquetFeeHotel(), "banquetFeeHotel", diff);
                compareField(dbDaily.getOtherFeeHotel(), inputDaily.getOtherFeeHotel(), "otherFeeHotel", diff);
                compareField(dbDaily.getTotalRevenueFeeHotel(), inputDaily.getTotalRevenueFeeHotel(), "totalRevenueFeeHotel", diff);

                // 有变化才加入
                if (diff.size() > 1) { // 除了bookingDailyId外有变化
                    dailyChanges.add(diff);
                }
            }
            if (dailyChanges.size() > 0) {
                changeSummary.set("bookingDaily", dailyChanges);
            }
        } catch (Exception e) {
            logger.error("比较预订每日价格变化失败", e);
        }
    }
    
    /**
     * 比较每日价格字段的变化
     * @param current 当前记录
     * @param last 上一次记录
     * @param priceChanges 变化记录对象
     */
    private void compareDailyPriceFields(BookingDaily current, BookingDaily last, ObjectNode priceChanges) {
        // 比较渠道价格
        compareField(current.getPriceChannel(), last != null ? last.getPriceChannel() : null, 
            "priceChannel", priceChanges);
        
        // 比较酒店价格
        compareField(current.getPriceHotel(), last != null ? last.getPriceHotel() : null, 
            "priceHotel", priceChanges);
        
        // 比较代理商价格
        compareField(current.getPriceAgent(), last != null ? last.getPriceAgent() : null, 
            "priceAgent", priceChanges);
        
        // 比较实际渠道价格
        compareField(current.getPriceChannelActual(), last != null ? last.getPriceChannelActual() : null, 
            "priceChannelActual", priceChanges);
        
        // 比较实际酒店价格
        compareField(current.getPriceHotelActual(), last != null ? last.getPriceHotelActual() : null, 
            "priceHotelActual", priceChanges);
        
        // 比较实际代理商价格
        compareField(current.getPriceAgentActual(), last != null ? last.getPriceAgentActual() : null, 
            "priceAgentActual", priceChanges);
        
        // 比较房间数量
        compareField(current.getRooms(), last != null ? last.getRooms() : null, 
            "rooms", priceChanges);
        
        // 比较实际房间数量
        compareField(current.getRoomsActual(), last != null ? last.getRoomsActual() : null, 
            "roomsActual", priceChanges);
        
        // 比较入住日期
        compareDateField(current.getStayDate(), last != null ? last.getStayDate() : null, 
            "stayDate", priceChanges);
        
        // 比较酒店费用
        compareField(current.getCateringFeeHotel(), last != null ? last.getCateringFeeHotel() : null, 
            "cateringFeeHotel", priceChanges);
        compareField(current.getBanquetFeeHotel(), last != null ? last.getBanquetFeeHotel() : null, 
            "banquetFeeHotel", priceChanges);
        compareField(current.getOtherFeeHotel(), last != null ? last.getOtherFeeHotel() : null, 
            "otherFeeHotel", priceChanges);
        compareField(current.getTotalRevenueFeeHotel(), last != null ? last.getTotalRevenueFeeHotel() : null, 
            "totalRevenueFeeHotel", priceChanges);
    }
    
    /**
     * 比较字段值并记录变化
     * @param current 当前值
     * @param last 上一次值
     * @param fieldName 字段名
     * @param priceChanges 变化记录对象
     */
    private void compareField(BigDecimal current, BigDecimal last, String fieldName, ObjectNode priceChanges) {
        if (current != null && (last == null || !current.equals(last))) {
            ObjectNode fieldChange = objectMapper.createObjectNode();
            if (last != null) {
                fieldChange.put("before", last.doubleValue());
            }
            fieldChange.put("after", current.doubleValue());
            priceChanges.set(fieldName, fieldChange);
        }
    }
    
    /**
     * 比较整数字段值并记录变化
     * @param current 当前值
     * @param last 上一次值
     * @param fieldName 字段名
     * @param priceChanges 变化记录对象
     */
    private void compareField(Integer current, Integer last, String fieldName, ObjectNode priceChanges) {
        if (current != null && (last == null || !current.equals(last))) {
            ObjectNode fieldChange = objectMapper.createObjectNode();
            if (last != null) {
                fieldChange.put("before", last);
            }
            fieldChange.put("after", current);
            priceChanges.set(fieldName, fieldChange);
        }
    }
    
    /**
     * 比较日期字段值并记录变化
     * @param current 当前值
     * @param last 上一次值
     * @param fieldName 字段名
     * @param priceChanges 变化记录对象
     */
    private void compareDateField(Date current, Date last, String fieldName, ObjectNode priceChanges) {
        if (current != null && (last == null || !current.equals(last))) {
            ObjectNode fieldChange = objectMapper.createObjectNode();
            if (last != null) {
                fieldChange.put("before", dateFormat.format(last));
            }
            fieldChange.put("after", dateFormat.format(current));
            priceChanges.set(fieldName, fieldChange);
        }
    }
    
    /**
     * 记录当前每日价格状态
     * @param current 当前记录
     * @param priceChanges 变化记录对象
     */
    private void recordCurrentDailyState(BookingDaily current, ObjectNode priceChanges) {
        // 记录价格相关字段的当前状态
        if (current.getPriceChannel() != null) {
            ObjectNode channelPrice = objectMapper.createObjectNode();
            channelPrice.put("after", current.getPriceChannel().doubleValue());
            priceChanges.set("priceChannel", channelPrice);
        }
        
        if (current.getPriceHotel() != null) {
            ObjectNode hotelPrice = objectMapper.createObjectNode();
            hotelPrice.put("after", current.getPriceHotel().doubleValue());
            priceChanges.set("priceHotel", hotelPrice);
        }
        
        if (current.getPriceAgent() != null) {
            ObjectNode agentPrice = objectMapper.createObjectNode();
            agentPrice.put("after", current.getPriceAgent().doubleValue());
            priceChanges.set("priceAgent", agentPrice);
        }
        
        if (current.getPriceChannelActual() != null) {
            ObjectNode channelPriceActual = objectMapper.createObjectNode();
            channelPriceActual.put("after", current.getPriceChannelActual().doubleValue());
            priceChanges.set("priceChannelActual", channelPriceActual);
        }
        
        if (current.getPriceHotelActual() != null) {
            ObjectNode hotelPriceActual = objectMapper.createObjectNode();
            hotelPriceActual.put("after", current.getPriceHotelActual().doubleValue());
            priceChanges.set("priceHotelActual", hotelPriceActual);
        }
        
        if (current.getPriceAgentActual() != null) {
            ObjectNode agentPriceActual = objectMapper.createObjectNode();
            agentPriceActual.put("after", current.getPriceAgentActual().doubleValue());
            priceChanges.set("priceAgentActual", agentPriceActual);
        }
        
        if (current.getRooms() != null) {
            ObjectNode rooms = objectMapper.createObjectNode();
            rooms.put("after", current.getRooms());
            priceChanges.set("rooms", rooms);
        }
        
        if (current.getRoomsActual() != null) {
            ObjectNode roomsActual = objectMapper.createObjectNode();
            roomsActual.put("after", current.getRoomsActual());
            priceChanges.set("roomsActual", roomsActual);
        }
        
        if (current.getStayDate() != null) {
            ObjectNode stayDate = objectMapper.createObjectNode();
            stayDate.put("after", dateFormat.format(current.getStayDate()));
            priceChanges.set("stayDate", stayDate);
        }
        
        if (current.getCateringFeeHotel() != null) {
            ObjectNode cateringFee = objectMapper.createObjectNode();
            cateringFee.put("after", current.getCateringFeeHotel().doubleValue());
            priceChanges.set("cateringFeeHotel", cateringFee);
        }
        
        if (current.getBanquetFeeHotel() != null) {
            ObjectNode banquetFee = objectMapper.createObjectNode();
            banquetFee.put("after", current.getBanquetFeeHotel().doubleValue());
            priceChanges.set("banquetFeeHotel", banquetFee);
        }
        
        if (current.getOtherFeeHotel() != null) {
            ObjectNode otherFee = objectMapper.createObjectNode();
            otherFee.put("after", current.getOtherFeeHotel().doubleValue());
            priceChanges.set("otherFeeHotel", otherFee);
        }
        
        if (current.getTotalRevenueFeeHotel() != null) {
            ObjectNode totalRevenueFee = objectMapper.createObjectNode();
            totalRevenueFee.put("after", current.getTotalRevenueFeeHotel().doubleValue());
            priceChanges.set("totalRevenueFeeHotel", totalRevenueFee);
        }
    }
    
    /**
     * 比较字符串字段值并记录变化
     * @param current 当前值
     * @param last 上一次值
     * @param fieldName 字段名
     * @param priceChanges 变化记录对象
     */
    private void compareField(String current, String last, String fieldName, ObjectNode priceChanges) {
        if (current != null && (last == null || !current.equals(last))) {
            ObjectNode fieldChange = objectMapper.createObjectNode();
            if (last != null) {
                fieldChange.put("before", last);
            }
            fieldChange.put("after", current);
            priceChanges.set(fieldName, fieldChange);
        }
    }
    
    /**
     * 比较布尔字段值并记录变化
     * @param current 当前值
     * @param last 上一次值
     * @param fieldName 字段名
     * @param priceChanges 变化记录对象
     */
    private void compareField(Boolean current, Boolean last, String fieldName, ObjectNode priceChanges) {
        if (current != null && (last == null || !current.equals(last))) {
            ObjectNode fieldChange = objectMapper.createObjectNode();
            if (last != null) {
                fieldChange.put("before", last);
            }
            fieldChange.put("after", current);
            priceChanges.set(fieldName, fieldChange);
        }
    }
    
    @Override
    @Transactional
    public BookingUpdatePriceResponse updateBookingPrice(BookingUpdatePriceBatchRequest request) {
        try {
            logger.debug("开始批量更新预订价格: {}", request);
            
            // 验证请求参数
            if (request == null || request.getItems() == null || request.getItems().isEmpty()) {
                throw new RuntimeException("批量更新请求不能为空");
            }
            
            BookingUpdatePriceResponse response = new BookingUpdatePriceResponse();
            response.setTotalCount(request.getItems().size());
            response.setSuccessCount(0);
            response.setFailCount(0);
            
            List<BookingUpdatePriceResponse.UpdatePriceResult> results = new java.util.ArrayList<>();
            
            // 逐个处理每个价格更新请求
            for (BookingUpdatePriceRequest item : request.getItems()) {
                BookingUpdatePriceResponse.UpdatePriceResult result = processSingleBookingPrice(item);
                results.add(result);
                
                if (result.isSuccess()) {
                    response.setSuccessCount(response.getSuccessCount() + 1);
                } else {
                    response.setFailCount(response.getFailCount() + 1);
                }
            }
            
            response.setResults(results);
            
            // 设置整体成功状态和消息
            if (response.getFailCount() == 0) {
                response.setSuccess(true);
                response.setMessage(String.format("价格更新成功，共处理 %d 条记录", response.getTotalCount()));
            } else if (response.getSuccessCount() > 0) {
                response.setSuccess(true);
                response.setMessage(String.format("价格更新部分成功，成功 %d 条，失败 %d 条", 
                    response.getSuccessCount(), response.getFailCount()));
            } else {
                response.setSuccess(false);
                response.setMessage("价格更新失败，所有记录处理失败");
            }
            
            logger.debug("批量更新预订价格完成: 成功 {} 条，失败 {} 条", 
                response.getSuccessCount(), response.getFailCount());
            return response;
            
        } catch (Exception e) {
            logger.error("批量更新预订价格失败", e);
            throw new RuntimeException("批量更新预订价格失败: " + e.getMessage());
        }
    }
    
    /**
     * 处理单个预订价格更新请求
     */
    private BookingUpdatePriceResponse.UpdatePriceResult processSingleBookingPrice(BookingUpdatePriceRequest request) {
        BookingUpdatePriceResponse.UpdatePriceResult result = new BookingUpdatePriceResponse.UpdatePriceResult();
        result.setBookingId(request.getBookingId());
        result.setBookingDailyId(request.getBookingDailyId());
        result.setStayDate(request.getStayDate() != null ? dateFormat.format(request.getStayDate()) : null);
        result.setAction(request.getAction());
        result.setIsNew(request.getIsNew());
        
        try {
            logger.debug("开始更新单个预订价格: {}", request);
            
            // 验证预订是否存在
            Booking booking = getCompleteBooking(request.getBookingId());
            if (booking == null) {
                result.setSuccess(false);
                result.setMessage("预订不存在: " + request.getBookingId());
                result.setErrorCode("BOOKING_NOT_FOUND");
                return result;
            }
            
            // 判断操作类型
            String action = request.getAction();
            if ("NOCHANGE".equals(action)) {
                logger.debug("操作类型为NOCHANGE，跳过处理: bookingId={}, bookingDailyId={}", 
                    request.getBookingId(), request.getBookingDailyId());
                result.setSuccess(true);
                result.setMessage("无改变");
                return result;
            }
            
            // 判断是否为新增行
            Boolean isNew = request.getIsNew();
            if (Boolean.TRUE.equals(isNew)) {
                // 新增记录
                logger.debug("新增预订每日价格记录: bookingId={}, bookingDailyId={}", 
                    request.getBookingId(), request.getBookingDailyId());
                
                BookingDaily newDaily = new BookingDaily();
                newDaily.setBookingDailyId(request.getBookingDailyId());
                newDaily.setBookingId(request.getBookingId());
                newDaily.setStayDate(request.getStayDate());
                
                // 设置基本信息（从booking中获取）
                newDaily.setHotelId(booking.getHotelId());
                newDaily.setChainId(booking.getChainId());
                newDaily.setChainCode(booking.getChainCode());
                newDaily.setHotelCode(booking.getHotelCode());
                newDaily.setRoomTypeCode(booking.getRoomTypeCode());
                newDaily.setRoomTypeName(booking.getRoomTypeName());
                newDaily.setRateCode(booking.getRateCode());
                newDaily.setRateCodeName(booking.getRateCodeName());
                newDaily.setPackageCode(booking.getPackageCode());
                newDaily.setPackageName(booking.getPackageName());
                
                // 设置房间数量（默认1间）
                newDaily.setRooms(1);
                newDaily.setRoomsActual(1);
                
                // 根据action设置价格
                if ("CHANGEPRICE".equals(action)) {
                    newDaily.setPriceChannel(request.getPriceChannelActual());
                    newDaily.setPriceChannelActual(request.getPriceChannelActual());
                    newDaily.setPriceHotel(request.getPriceHotelActual());
                    newDaily.setPriceHotelActual(request.getPriceHotelActual());
                    newDaily.setPriceAgent(BigDecimal.ZERO); // 默认值
                    newDaily.setPriceAgentActual(BigDecimal.ZERO);
                } else {
                    // 其他情况设置默认价格
                    newDaily.setPriceChannel(BigDecimal.ZERO);
                    newDaily.setPriceChannelActual(BigDecimal.ZERO);
                    newDaily.setPriceHotel(BigDecimal.ZERO);
                    newDaily.setPriceHotelActual(BigDecimal.ZERO);
                    newDaily.setPriceAgent(BigDecimal.ZERO);
                    newDaily.setPriceAgentActual(BigDecimal.ZERO);
                }
                
                // 设置酒店费用（默认0）
                newDaily.setCateringFeeHotel(BigDecimal.ZERO);
                newDaily.setBanquetFeeHotel(BigDecimal.ZERO);
                newDaily.setOtherFeeHotel(BigDecimal.ZERO);
                newDaily.setTotalRevenueFeeHotel(BigDecimal.ZERO);
                
                // 插入新记录
                bookingDailyMapper.insert(newDaily);
                
                // 记录操作日志
                saveBookingLog(booking, "ADD_DAILY_PRICE", "SYSTEM", request.getBookingDailyId(), null);
                
                logger.debug("新增预订每日价格记录成功: bookingId={}, bookingDailyId={}", 
                    request.getBookingId(), request.getBookingDailyId());
                result.setSuccess(true);
                result.setMessage("新增预订每日价格记录成功");
                return result;
                
            } else {
                // 修改现有记录
                if ("CANCEL".equals(action)) {
                    // 删除记录
                    logger.debug("删除预订每日价格记录: bookingId={}, bookingDailyId={}, action={}", 
                        request.getBookingId(), request.getBookingDailyId(), action);
                    
                    bookingDailyMapper.deleteByBookingDailyId(request.getBookingDailyId());
                    
                    // 记录操作日志
                    saveBookingLog(booking, "DELETE_DAILY_PRICE", "SYSTEM", request.getBookingDailyId(), null);
                    
                    logger.debug("删除预订每日价格记录成功: bookingId={}, bookingDailyId={}", 
                        request.getBookingId(), request.getBookingDailyId());
                    result.setSuccess(true);
                    result.setMessage("删除预订每日价格记录成功");
                    return result;
                    
                } else if ("CHANGEPRICE".equals(action)) {
                    // 修改价格
                    logger.debug("修改预订每日价格: bookingId={}, bookingDailyId={}", 
                        request.getBookingId(), request.getBookingDailyId());
                    
                    BookingDaily daily = new BookingDaily();
                    daily.setBookingDailyId(request.getBookingDailyId());
                    daily.setBookingId(request.getBookingId());
                    daily.setStayDate(request.getStayDate());
                    daily.setPriceChannel(request.getPriceChannelActual());
                    daily.setPriceChannelActual(request.getPriceChannelActual());
                    daily.setPriceHotel(request.getPriceHotelActual());
                    daily.setPriceHotelActual(request.getPriceHotelActual());
                    
                    // 调用Mapper更新价格
                    int updateResult = bookingDailyMapper.updatePrice(daily);
                    
                    if (updateResult > 0) {
                        logger.debug("更新成功: bookingId={}, bookingDailyId={}", 
                            request.getBookingId(), request.getBookingDailyId());
                        
                        // 记录操作日志
                        saveBookingLog(booking, "UPDATE_PRICE", "SYSTEM", request.getBookingDailyId(), null);
                        
                        result.setSuccess(true);
                        result.setMessage("更新成功");
                        return result;
                    } else {
                        logger.warn("更新失败: bookingId={}, bookingDailyId={}", 
                            request.getBookingId(), request.getBookingDailyId());
                        result.setSuccess(false);
                        result.setMessage("更新失败");
                        result.setErrorCode("UPDATE_FAILED");
                        return result;
                    }
                    
                } else {
                    // 未知的action类型
                    logger.warn("未知的操作类型: action={}, bookingId={}, bookingDailyId={}", 
                        action, request.getBookingId(), request.getBookingDailyId());
                    result.setSuccess(false);
                    result.setMessage("未知操作类型: " + action);
                    result.setErrorCode("UNKNOWN_ACTION");
                    return result;
                }
            }
            
        } catch (Exception e) {
            logger.error("更新单个预订价格失败", e);
            result.setSuccess(false);
            result.setMessage("更新单个预订价格失败: " + e.getMessage());
            result.setErrorCode("PROCESS_ERROR");
            return result;
        }
    }
    
    /**
     * 获取完整的预订信息（包含每日价格详情）
     * @param bookingId 预订ID
     * @return 完整的预订对象，包含bookingDaily列表
     */
    private Booking getCompleteBooking(String bookingId) {
        try {
            // 获取预订基本信息
            Booking booking = bookingMapper.selectByBookingId(bookingId);
            if (booking == null) {
                return null;
            }
            
            // 查询并设置每日价格详情
            List<BookingDaily> dailyList = bookingDailyMapper.selectByBookingId(bookingId);
            booking.setBookingDailys(dailyList);
            
            return booking;
        } catch (Exception e) {
            logger.error("获取完整预订信息失败: bookingId={}", bookingId, e);
            return null;
        }
    }
} 