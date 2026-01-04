package com.zai.booking.controller;

import com.zai.booking.entity.Booking;
import com.zai.booking.dto.BookingListRequest;
import com.zai.booking.dto.BookingAddRequest;
import com.zai.booking.dto.BookingListResponse;
import com.zai.booking.dto.BookingDetailResponse;
import com.zai.booking.dto.BookingConfirmRequest;
import com.zai.booking.dto.BookingUpdatePriceRequest;
import com.zai.booking.dto.BookingUpdatePriceBatchRequest;
import com.zai.booking.dto.BookingUpdatePriceResponse;
import com.zai.booking.service.BookingService;
import com.zai.common.BaseResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/api/booking")
public class BookingController {
    
    private static final Logger logger = LoggerFactory.getLogger(BookingController.class);
    
    @Autowired
    private BookingService bookingService;
    
    
    @PostMapping("/add")
    @ResponseBody
    public ResponseEntity<?> addBooking(@RequestBody BookingAddRequest request) {
        try {
            logger.debug("添加预订请求: {}", request);
            
            int result = bookingService.addBooking(request);
            
            if (result > 0) {
                return ResponseEntity.ok(new BaseResponse(true, "预订添加成功", null));
            } else {
                return ResponseEntity.badRequest().body(new BaseResponse(false, "预订添加失败", null));
            }
            
        } catch (Exception e) {
            logger.error("添加预订失败", e);
            return ResponseEntity.badRequest().body(new BaseResponse(false, "预订添加失败: " + e.getMessage(), null));
        }
    }
    
    @DeleteMapping("/{bookingId}")
    @ResponseBody
    public ResponseEntity<?> deleteBooking(@PathVariable String bookingId) {
        try {
            logger.debug("删除预订: {}", bookingId);
            
            bookingService.deleteBooking(bookingId);
            
            return ResponseEntity.ok(new BaseResponse(true, "预订删除成功", null));
            
        } catch (Exception e) {
            logger.error("删除预订失败", e);
            return ResponseEntity.badRequest().body(new BaseResponse(false, "预订删除失败: " + e.getMessage(), null));
        }
    }
    
    @PutMapping("/{bookingId}")
    @ResponseBody
    public ResponseEntity<?> updateBooking(@PathVariable String bookingId, @RequestBody Booking booking) {
        try {
            logger.debug("更新预订: bookingId={}, booking={}", bookingId, booking);
            
            booking.setBookingId(bookingId);
            int result = bookingService.updateBooking(booking);
            
            if (result > 0) {
                return ResponseEntity.ok(new BaseResponse(true, "预订更新成功", null));
            } else {
                return ResponseEntity.badRequest().body(new BaseResponse(false, "预订更新失败", null));
            }
            
        } catch (Exception e) {
            logger.error("更新预订失败", e);
            return ResponseEntity.badRequest().body(new BaseResponse(false, "预订更新失败: " + e.getMessage(), null));
        }
    }
    
    @GetMapping("/{bookingId}")
    @ResponseBody
    public ResponseEntity<BookingDetailResponse> getBookingById(@PathVariable String bookingId) {
        try {
            logger.debug("查询预订: {}", bookingId);
            
            BookingDetailResponse bookingDetail = bookingService.getBookingDetailById(bookingId);
            
            if (bookingDetail != null) {
                return ResponseEntity.ok(bookingDetail);
            } else {
                return ResponseEntity.notFound().build();
            }
            
        } catch (Exception e) {
            logger.error("查询预订失败", e);
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/list")
    @ResponseBody
    public ResponseEntity<BookingListResponse> getBookingList(@RequestBody BookingListRequest request) {
        try {
            logger.debug("查询预订列表: {}", request);
            
            List<Booking> bookings = bookingService.getBookingList(request);
            int total = bookingService.countBookings(request);
            
            // 计算分页信息
            int size = request.getSize() != null ? request.getSize() : 20;
            int page = request.getPage() != null ? request.getPage() : 0;
            int totalPages = (int) Math.ceil((double) total / size);
            boolean isFirst = page == 0;
            boolean isLast = page >= totalPages - 1;
            int numberOfElements = bookings.size();
            
            // 构建响应数据
            BookingListResponse response = new BookingListResponse();
            response.setStatus("success");
            
            BookingListResponse.Data data = new BookingListResponse.Data();
            data.setBookings(convertToBookingSimpleList(bookings));
            data.setTotalElements(total);
            data.setTotalPages(totalPages);
            data.setSize(size);
            data.setNumber(page);
            data.setFirst(isFirst);
            data.setLast(isLast);
            data.setNumberOfElements(numberOfElements);
            
            response.setData(data);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("查询预订列表失败", e);
            BookingListResponse errorResponse = new BookingListResponse();
            errorResponse.setStatus("error");
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    @GetMapping("/chain/{chainId}")
    @ResponseBody
    public ResponseEntity<?> getBookingsByChainId(@PathVariable String chainId) {
        try {
            logger.debug("根据连锁ID查询预订: {}", chainId);
            
            List<Booking> bookings = bookingService.getBookingsByChainId(chainId);
            
            return ResponseEntity.ok(new BaseResponse(true, "查询成功", bookings));
            
        } catch (Exception e) {
            logger.error("根据连锁ID查询预订失败", e);
            return ResponseEntity.badRequest().body(new BaseResponse(false, "查询失败: " + e.getMessage(), null));
        }
    }
    
    @GetMapping("/hotel/{hotelId}")
    @ResponseBody
    public ResponseEntity<?> getBookingsByHotelId(@PathVariable String hotelId) {
        try {
            logger.debug("根据酒店ID查询预订: {}", hotelId);
            
            List<Booking> bookings = bookingService.getBookingsByHotelId(hotelId);
            
            return ResponseEntity.ok(new BaseResponse(true, "查询成功", bookings));
            
        } catch (Exception e) {
            logger.error("根据酒店ID查询预订失败", e);
            return ResponseEntity.badRequest().body(new BaseResponse(false, "查询失败: " + e.getMessage(), null));
        }
    }
    
    @PostMapping("/{bookingId}/cancel")
    @ResponseBody
    public ResponseEntity<?> cancelBooking(@PathVariable String bookingId, @RequestBody Map<String, String> request) {
        try {
            logger.debug("取消预订: bookingId={}, reason={}", bookingId, request.get("reason"));
            
            String cancelReason = request.get("reason");
            int result = bookingService.cancelBooking(bookingId, cancelReason);
            
            if (result > 0) {
                return ResponseEntity.ok(new BaseResponse(true, "预订取消成功", null));
            } else {
                return ResponseEntity.badRequest().body(new BaseResponse(false, "预订取消失败", null));
            }
            
        } catch (Exception e) {
            logger.error("取消预订失败", e);
            return ResponseEntity.badRequest().body(new BaseResponse(false, "取消预订失败: " + e.getMessage(), null));
        }
    }
    
    @PostMapping("/{bookingId}/confirm")
    @ResponseBody
    public ResponseEntity<?> confirmBooking(@PathVariable String bookingId, @RequestBody BookingConfirmRequest request) {
        try {
            logger.debug("确认预订: bookingId={}, confirmNumber={}, userId={}", bookingId, request.getConfirmNumber(), request.getUserId());
            
            int result = bookingService.confirmBooking(bookingId, request);
            
            if (result > 0) {
                return ResponseEntity.ok(new BaseResponse(true, "预订确认成功", null));
            } else {
                return ResponseEntity.badRequest().body(new BaseResponse(false, "预订确认失败", null));
            }
            
        } catch (Exception e) {
            logger.error("确认预订失败", e);
            return ResponseEntity.badRequest().body(new BaseResponse(false, "确认预订失败: " + e.getMessage(), null));
        }
    }
    
    @PutMapping("/{bookingId}/modify")
    @ResponseBody
    public ResponseEntity<?> modifyBooking(@PathVariable String bookingId, @RequestBody BookingAddRequest request) {
        try {
            logger.debug("修改预订: bookingId={}, request={}", bookingId, request);
            
            int result = bookingService.modifyBooking(bookingId, request);
            
            if (result > 0) {
                return ResponseEntity.ok(new BaseResponse(true, "预订修改成功", null));
            } else {
                return ResponseEntity.badRequest().body(new BaseResponse(false, "预订修改失败", null));
            }
            
        } catch (Exception e) {
            logger.error("修改预订失败", e);
            return ResponseEntity.badRequest().body(new BaseResponse(false, "修改预订失败: " + e.getMessage(), null));
        }
    }
    
    @PostMapping("/updateprice")
    @ResponseBody
    public ResponseEntity<BookingUpdatePriceResponse> updatePrice(@RequestBody BookingUpdatePriceBatchRequest request) {
        try {
            logger.debug("更新预订价格请求: {}", request);
            
            // 验证请求对象
            if (request == null) {
                BookingUpdatePriceResponse errorResponse = new BookingUpdatePriceResponse();
                errorResponse.setSuccess(false);
                errorResponse.setMessage("请求体不能为空");
                errorResponse.setTotalCount(0);
                errorResponse.setSuccessCount(0);
                errorResponse.setFailCount(0);
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            // 调用服务层更新价格
            BookingUpdatePriceResponse response = bookingService.updateBookingPrice(request);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("更新预订价格失败", e);
            BookingUpdatePriceResponse errorResponse = new BookingUpdatePriceResponse();
            errorResponse.setSuccess(false);
            errorResponse.setMessage("价格更新失败: " + e.getMessage());
            errorResponse.setTotalCount(0);
            errorResponse.setSuccessCount(0);
            errorResponse.setFailCount(0);
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    @PostMapping("/updateprice/batch")
    @ResponseBody
    public ResponseEntity<BookingUpdatePriceResponse> updatePriceBatch(@RequestBody List<BookingUpdatePriceRequest> requests) {
        try {
            logger.debug("批量更新预订价格请求: {}", requests);
            
            // 验证请求参数
            if (requests == null || requests.isEmpty()) {
                BookingUpdatePriceResponse errorResponse = new BookingUpdatePriceResponse();
                errorResponse.setSuccess(false);
                errorResponse.setMessage("请求体不能为空");
                errorResponse.setTotalCount(0);
                errorResponse.setSuccessCount(0);
                errorResponse.setFailCount(0);
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            // 创建批量请求对象
            BookingUpdatePriceBatchRequest batchRequest = new BookingUpdatePriceBatchRequest();
            batchRequest.setItems(requests);
            
            // 调用服务层批量更新价格
            BookingUpdatePriceResponse response = bookingService.updateBookingPrice(batchRequest);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("批量更新预订价格失败", e);
            BookingUpdatePriceResponse errorResponse = new BookingUpdatePriceResponse();
            errorResponse.setSuccess(false);
            errorResponse.setMessage("批量更新失败: " + e.getMessage());
            errorResponse.setTotalCount(0);
            errorResponse.setSuccessCount(0);
            errorResponse.setFailCount(0);
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    /**
     * 将Booking实体列表转换为BookingSimple列表
     */
    private List<BookingListResponse.BookingSimple> convertToBookingSimpleList(List<Booking> bookings) {
        return bookings.stream().map(this::convertToBookingSimple).collect(java.util.stream.Collectors.toList());
    }
    
    /**
     * 将Booking实体转换为BookingSimple
     */
    private BookingListResponse.BookingSimple convertToBookingSimple(Booking booking) {
        BookingListResponse.BookingSimple simple = new BookingListResponse.BookingSimple();
        
        // 基本信息
        simple.setBookingId(booking.getBookingId());
        simple.setChainId(booking.getChainId());
        simple.setHotelId(booking.getHotelId());
        simple.setChainCode(booking.getChainCode());
        simple.setChainName(booking.getChainName());
        simple.setHotelCode(booking.getHotelCode());
        simple.setHotelName(booking.getHotelName());
        simple.setRoomTypeCode(booking.getRoomTypeCode());
        simple.setRoomTypeName(booking.getRoomTypeName());
        simple.setRateCode(booking.getRateCode());
        simple.setRateCodeName(booking.getRateCodeName());
        simple.setPackageCode(booking.getPackageCode());
        simple.setPackageName(booking.getPackageName());
        simple.setChannelCode(booking.getChannelCode());
        simple.setChannelSubcode(booking.getChannelSubcode());
        simple.setBookerCode(booking.getBookerCode());
        simple.setAgentCode(booking.getAgentCode());
        simple.setSourceCode(booking.getSourceCode());
        simple.setMarketCode(booking.getMarketCode());
        simple.setBookerType(booking.getBookerType());
        
        // 预订号信息
        simple.setChannelResvNo(booking.getChannelResvNo());
        simple.setChannelResvSno(booking.getChannelResvSno());
        simple.setChannelResvPno(booking.getChannelResvPno());
        simple.setCrsResvNo(booking.getCrsResvNo());
        simple.setCrsResvPno(booking.getCrsResvPno());
        simple.setCrsResvCheckinNo(booking.getCrsResvCheckinNo());
        simple.setAgentResvNo(booking.getAgentResvNo());
        simple.setAgentResvPno(booking.getAgentResvPno());
        simple.setHotelResvNo(booking.getHotelResvNo());
        simple.setHotelResvKey(booking.getHotelResvKey());
        simple.setHotelResvConfirm(booking.getHotelResvConfirm());
        simple.setHotelRoomNo(booking.getHotelRoomNo());
        
        // 预订类型和状态
        simple.setPaymentType(booking.getPaymentType());
        simple.setReservationType(booking.getReservationType());
        simple.setCancellationType(booking.getCancellationType());
        simple.setLatestCancellationDays(booking.getLatestCancellationDays());
        simple.setLatestCancellationTime(booking.getLatestCancellationTime() != null ? 
            booking.getLatestCancellationTime().toString() : null);
        simple.setCancellableAfterBooking(booking.getCancellableAfterBooking());
        simple.setOrderRetentionTime(booking.getOrderRetentionTime() != null ? 
            booking.getOrderRetentionTime().toString() : null);
        simple.setArrivalTime(booking.getArrivalTime() != null ? 
            booking.getArrivalTime().toString() : null);
        
        // 备注信息
        simple.setRemarkHotel(booking.getRemarkHotel());
        simple.setRemarkChannel(booking.getRemarkChannel());
        simple.setRemarkAgent(booking.getRemarkAgent());
        simple.setRemarkGuest(booking.getRemarkGuest());
        simple.setRemarkSpecial(booking.getRemarkSpecial());
        simple.setRemarkInvoice(booking.getRemarkInvoice());
        simple.setRemarkCancel(booking.getRemarkCancel());
        
        // 公司信息
        simple.setCompanyId(booking.getCompanyId());
        simple.setCompanyNo(booking.getCompanyNo());
        simple.setCompanyName(booking.getCompanyName());
        simple.setCompanyTmcId(booking.getCompanyTmcId());
        simple.setCompanyTmcNo(booking.getCompanyTmcNo());
        simple.setCompanyTmcName(booking.getCompanyTmcName());
        
        // 会员信息
        simple.setMemberNoGuest(booking.getMemberNoGuest());
        simple.setMemberTypeGuest(booking.getMemberTypeGuest());
        simple.setMemberNoBooker(booking.getMemberNoBooker());
        simple.setMemberTypeBooker(booking.getMemberTypeBooker());
        
        // 客人和预订人信息
        simple.setGuestId(booking.getGuestId());
        simple.setGuestName(booking.getGuestName());
        simple.setGuestEname(booking.getGuestEname());
        simple.setBookerId(booking.getBookerId());
        simple.setBookerName(booking.getBookerName());
        
        // 日期信息
        simple.setBookingDate(booking.getBookingDate() != null ? 
            new java.text.SimpleDateFormat("yyyy-MM-dd").format(booking.getBookingDate()) : null);
        simple.setAdvanceBookingDays(booking.getAdvanceBookingDays() != null ? 
            booking.getAdvanceBookingDays().doubleValue() : null);
        simple.setCheckInDate(booking.getCheckInDate() != null ? 
            new java.text.SimpleDateFormat("yyyy-MM-dd").format(booking.getCheckInDate()) : null);
        simple.setCheckOutDate(booking.getCheckOutDate() != null ? 
            new java.text.SimpleDateFormat("yyyy-MM-dd").format(booking.getCheckOutDate()) : null);
        simple.setStayDays(booking.getStayDays());
        simple.setCheckInDateActual(booking.getCheckInDateActual() != null ? 
            new java.text.SimpleDateFormat("yyyy-MM-dd").format(booking.getCheckInDateActual()) : null);
        simple.setCheckOutDateActual(booking.getCheckOutDateActual() != null ? 
            new java.text.SimpleDateFormat("yyyy-MM-dd").format(booking.getCheckOutDateActual()) : null);
        simple.setStayDaysActual(booking.getStayDaysActual());
        
        // 房间和客人数量
        simple.setTotalRooms(booking.getTotalRooms());
        simple.setTotalRoomsActual(booking.getTotalRoomsActual());
        simple.setTotalRoomNights(booking.getTotalRoomNights());
        simple.setTotalRoomNightsActual(booking.getTotalRoomNightsActual());
        simple.setTotalGuests(booking.getTotalGuests());
        simple.setTotalGuestsActual(booking.getTotalGuestsActual());
        
        // 预订类型和状态
        simple.setBookingType(booking.getBookingType());
        simple.setBookingStatusChannel(booking.getBookingStatusChannel());
        simple.setBookingStatusHotel(booking.getBookingStatusHotel());
        simple.setBookingStatusAgent(booking.getBookingStatusAgent());
        
        // 金额信息
        simple.setDepositAmountChannel(booking.getDepositAmountChannel() != null ? 
            booking.getDepositAmountChannel().doubleValue() : null);
        simple.setDepositAmountAgent(booking.getDepositAmountAgent() != null ? 
            booking.getDepositAmountAgent().doubleValue() : null);
        simple.setDepositAmountHotel(booking.getDepositAmountHotel() != null ? 
            booking.getDepositAmountHotel().doubleValue() : null);
        simple.setPenaltyAmountChannel(booking.getPenaltyAmountChannel() != null ? 
            booking.getPenaltyAmountChannel().doubleValue() : null);
        simple.setPenaltyAmountHotel(booking.getPenaltyAmountHotel() != null ? 
            booking.getPenaltyAmountHotel().doubleValue() : null);
        simple.setPenaltyAmountAgent(booking.getPenaltyAmountAgent() != null ? 
            booking.getPenaltyAmountAgent().doubleValue() : null);
        simple.setTotalPriceChannel(booking.getTotalPriceChannel() != null ? 
            booking.getTotalPriceChannel().doubleValue() : null);
        simple.setTotalPriceHotel(booking.getTotalPriceHotel() != null ? 
            booking.getTotalPriceHotel().doubleValue() : null);
        simple.setTotalPriceAgent(booking.getTotalPriceAgent() != null ? 
            booking.getTotalPriceAgent().doubleValue() : null);
        simple.setTotalPriceChannelActual(booking.getTotalPriceChannelActual() != null ? 
            booking.getTotalPriceChannelActual().doubleValue() : null);
        simple.setTotalPriceHotelActual(booking.getTotalPriceHotelActual() != null ? 
            booking.getTotalPriceHotelActual().doubleValue() : null);
        simple.setTotalPriceAgentActual(booking.getTotalPriceAgentActual() != null ? 
            booking.getTotalPriceAgentActual().doubleValue() : null);
        
        // 支付和账单信息
        simple.setPaymentDate(booking.getPaymentDate() != null ? 
            new java.text.SimpleDateFormat("yyyy-MM-dd").format(booking.getPaymentDate()) : null);
        simple.setPaymentNo(booking.getPaymentNo());
        simple.setBillDate(booking.getBillDate() != null ? 
            new java.text.SimpleDateFormat("yyyy-MM-dd").format(booking.getBillDate()) : null);
        simple.setBillNo(booking.getBillNo());
        
        // 酒店费用
        simple.setCateringFeeHotel(booking.getCateringFeeHotel() != null ? 
            booking.getCateringFeeHotel().doubleValue() : null);
        simple.setBanquetFeeHotel(booking.getBanquetFeeHotel() != null ? 
            booking.getBanquetFeeHotel().doubleValue() : null);
        simple.setOtherFeeHotel(booking.getOtherFeeHotel() != null ? 
            booking.getOtherFeeHotel().doubleValue() : null);
        simple.setTotalRevenueFeeHotel(booking.getTotalRevenueFeeHotel() != null ? 
            booking.getTotalRevenueFeeHotel().doubleValue() : null);
        
        // 其他字段
        simple.setSign(booking.getSign());
        
        // 销售层级信息
        simple.setSalesLevelA(createSalesLevel(booking.getSalesLevelAId(), booking.getSalesLevelAName(), 
            booking.getSalesLevelAPhone(), booking.getSalesLevelAEmail()));
        simple.setSalesLevelB(createSalesLevel(booking.getSalesLevelBId(), booking.getSalesLevelBName(), 
            booking.getSalesLevelBPhone(), booking.getSalesLevelBEmail()));
        simple.setSalesLevelC(createSalesLevel(booking.getSalesLevelCId(), booking.getSalesLevelCName(), 
            booking.getSalesLevelCPhone(), booking.getSalesLevelCEmail()));
        
        // 时间戳
        simple.setCreatedAt(booking.getCreatedAt() != null ? 
            new java.text.SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss").format(booking.getCreatedAt()) : null);
        simple.setUpdatedAt(booking.getUpdatedAt() != null ? 
            new java.text.SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss").format(booking.getUpdatedAt()) : null);
        
        return simple;
    }
    
    /**
     * 创建销售层级信息
     */
    private BookingListResponse.SalesLevel createSalesLevel(String id, String name, String phone, String email) {
        BookingListResponse.SalesLevel salesLevel = new BookingListResponse.SalesLevel();
        salesLevel.setId(id != null ? id : "");
        salesLevel.setName(name != null ? name : "");
        salesLevel.setPhone(phone != null ? phone : "");
        salesLevel.setEmail(email != null ? email : "");
        return salesLevel;
    }


    
} 