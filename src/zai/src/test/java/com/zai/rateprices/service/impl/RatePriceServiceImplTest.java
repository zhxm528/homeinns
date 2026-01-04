package com.zai.rateprices.service.impl;

import com.google.gson.Gson;
import com.zai.common.BaseResponse;
import com.zai.hotel.entity.Hotel;
import com.zai.hotel.mapper.HotelMapper;
import com.zai.rateprices.dto.RatePriceAddRequest;
import com.zai.rateprices.dto.RatePriceListRequest;
import com.zai.rateprices.dto.RatePriceUpdateRequest;
import com.zai.rateprices.entity.RatePrice;
import com.zai.rateprices.mapper.RatePriceMapper;
import com.zai.rateprices.model.AvailabilityRequestModel;
import com.zai.rateprices.model.AvailabilityResponseModel;
import com.zai.rateprices.model.PriceModel;
import com.zai.roomtype.entity.RoomType;
import com.zai.roomtype.mapper.RoomTypeMapper;
import com.zai.roomtypestatus.entity.RoomTypeStatus;
import com.zai.roomtypestatus.mapper.RoomTypeStatusMapper;
import com.zai.rateinventorystatus.entity.RateInventoryStatus;
import com.zai.rateinventorystatus.mapper.RateInventoryStatusMapper;
import com.zai.rateplan.entity.RatePlan;
import com.zai.rateplan.mapper.RatePlanMapper;
import com.zai.hotelinventory.entity.HotelInventoryStatus;
import com.zai.hotelinventory.mapper.HotelInventoryStatusMapper;
import com.zai.ratecode.entity.RateCode;
import com.zai.ratecode.mapper.RateCodeMapper;
import com.zai.additionalservice.entity.AdditionalService;
import com.zai.additionalservice.mapper.AdditionalServiceMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * RatePriceServiceImpl 测试类
 */
@ExtendWith(MockitoExtension.class)
class RatePriceServiceImplTest {

    @Mock
    private Gson gson;

    @Mock
    private RatePriceMapper ratePriceMapper;

    @Mock
    private HotelMapper hotelMapper;

    @Mock
    private RoomTypeMapper roomTypeMapper;

    @Mock
    private RoomTypeStatusMapper roomTypeStatusMapper;

    @Mock
    private RateInventoryStatusMapper rateInventoryStatusMapper;

    @Mock
    private RatePlanMapper ratePlanMapper;

    @Mock
    private HotelInventoryStatusMapper hotelInventoryStatusMapper;

    @Mock
    private RateCodeMapper rateCodeMapper;

    @Mock
    private AdditionalServiceMapper additionalServiceMapper;

    @InjectMocks
    private RatePriceServiceImpl ratePriceService;

    private RatePriceAddRequest validAddRequest;
    private RatePriceUpdateRequest validUpdateRequest;
    private RatePriceListRequest validListRequest;
    private AvailabilityRequestModel validCalendarRequest;

    @BeforeEach
    void setUp() {
        // 初始化测试数据
        validAddRequest = new RatePriceAddRequest();
        validAddRequest.setChainId("hotelbeds");
        validAddRequest.setHotelId("1b6847a3-a26f-4d7a-9bd6-f74da210c0f5");
        validAddRequest.setRateCode("RATE001");
        validAddRequest.setRoomTypeCode("ROOM001");
        validAddRequest.setStayDate("2024-01-01");
        validAddRequest.setChannelSingleOccupancy(BigDecimal.valueOf(100.0));
        validAddRequest.setChannelDoubleOccupancy(BigDecimal.valueOf(150.0));
        validAddRequest.setHotelSingleOccupancy(BigDecimal.valueOf(80.0));
        validAddRequest.setHotelDoubleOccupancy(BigDecimal.valueOf(120.0));
        validAddRequest.setAgentSingleOccupancy(BigDecimal.valueOf(90.0));
        validAddRequest.setAgentDoubleOccupancy(BigDecimal.valueOf(130.0));

        validUpdateRequest = new RatePriceUpdateRequest();
        validUpdateRequest.setPriceId("price001");
        validUpdateRequest.setChainId("hotelbeds");
        validUpdateRequest.setHotelId("1b6847a3-a26f-4d7a-9bd6-f74da210c0f5");
        validUpdateRequest.setRateCode("RATE001");
        validUpdateRequest.setRoomTypeCode("ROOM001");
        validUpdateRequest.setStayDate("2024-01-01");
        validUpdateRequest.setChannelSingleOccupancy(BigDecimal.valueOf(110.0));
        validUpdateRequest.setChannelDoubleOccupancy(BigDecimal.valueOf(160.0));

        validListRequest = new RatePriceListRequest();
        validListRequest.setChainId("hotelbeds");
        validListRequest.setHotelId("1b6847a3-a26f-4d7a-9bd6-f74da210c0f5");
        validListRequest.setStartDate("2024-01-01");
        validListRequest.setEndDate("2024-01-07");

        validCalendarRequest = new AvailabilityRequestModel();
        validCalendarRequest.setHotelId("1b6847a3-a26f-4d7a-9bd6-f74da210c0f5");
        validCalendarRequest.setStartDate("2024-01-01");
        validCalendarRequest.setEndDate("2024-01-07");
    }

    @Test
    void testAdd_Success() {
        // Given
        when(ratePriceMapper.selectByPrimaryKey(anyString(), anyString(), anyString(), anyString(), anyString()))
                .thenReturn(null);
        when(ratePriceMapper.insert(any(RatePrice.class))).thenReturn(1);

        // When
        BaseResponse response = ratePriceService.add(validAddRequest);

        // Then
        assertNotNull(response);
        assertTrue(response.isSuccess());
        assertEquals("房价价格添加成功", response.getMessage());
        verify(ratePriceMapper).insert(any(RatePrice.class));
    }

    @Test
    void testAdd_AlreadyExists() {
        // Given
        RatePrice existingPrice = new RatePrice();
        when(ratePriceMapper.selectByPrimaryKey(anyString(), anyString(), anyString(), anyString(), anyString()))
                .thenReturn(existingPrice);

        // When
        BaseResponse response = ratePriceService.add(validAddRequest);

        // Then
        assertNotNull(response);
        assertFalse(response.isSuccess());
        assertEquals("该日期已存在房价价格记录", response.getMessage());
        verify(ratePriceMapper, never()).insert(any(RatePrice.class));
    }

    @Test
    void testAdd_NullRequest() {
        // When
        BaseResponse response = ratePriceService.add(null);

        // Then
        assertNotNull(response);
        assertFalse(response.isSuccess());
        assertEquals("请求参数不能为空", response.getMessage());
    }

    @Test
    void testAdd_MissingChainId() {
        // Given
        validAddRequest.setChainId(null);

        // When
        BaseResponse response = ratePriceService.add(validAddRequest);

        // Then
        assertNotNull(response);
        assertFalse(response.isSuccess());
        assertEquals("连锁ID不能为空", response.getMessage());
    }

    @Test
    void testUpdate_Success() {
        // Given
        RatePrice existingPrice = new RatePrice();
        when(ratePriceMapper.selectById(anyString())).thenReturn(existingPrice);
        when(ratePriceMapper.update(any(RatePrice.class))).thenReturn(1);

        // When
        BaseResponse response = ratePriceService.update(validUpdateRequest);

        // Then
        assertNotNull(response);
        assertTrue(response.isSuccess());
        assertEquals("房价价格更新成功", response.getMessage());
        verify(ratePriceMapper).update(any(RatePrice.class));
    }

    @Test
    void testUpdate_NotFound() {
        // Given
        when(ratePriceMapper.selectById(anyString())).thenReturn(null);

        // When
        BaseResponse response = ratePriceService.update(validUpdateRequest);

        // Then
        assertNotNull(response);
        assertFalse(response.isSuccess());
        assertEquals("房价价格记录不存在", response.getMessage());
        verify(ratePriceMapper, never()).update(any(RatePrice.class));
    }

    @Test
    void testDelete_Success() {
        // Given
        RatePrice existingPrice = new RatePrice();
        when(ratePriceMapper.selectById(anyString())).thenReturn(existingPrice);
        when(ratePriceMapper.deleteById(anyString())).thenReturn(1);

        // When
        BaseResponse response = ratePriceService.delete("price001");

        // Then
        assertNotNull(response);
        assertTrue(response.isSuccess());
        assertEquals("房价价格删除成功", response.getMessage());
        verify(ratePriceMapper).deleteById("price001");
    }

    @Test
    void testDelete_NotFound() {
        // Given
        when(ratePriceMapper.selectById(anyString())).thenReturn(null);

        // When
        BaseResponse response = ratePriceService.delete("price001");

        // Then
        assertNotNull(response);
        assertFalse(response.isSuccess());
        assertEquals("房价价格记录不存在", response.getMessage());
        verify(ratePriceMapper, never()).deleteById(anyString());
    }

    @Test
    void testList_Success() {
        // Given
        List<RatePrice> mockPrices = new ArrayList<>();
        RatePrice price = new RatePrice();
        price.setPriceId("price001");
        mockPrices.add(price);

        when(ratePriceMapper.selectByCondition(anyString(), anyString(), anyList(), anyString(), anyString()))
                .thenReturn(mockPrices);
        when(ratePriceMapper.countByCondition(anyString(), anyString(), anyList(), anyString(), anyString()))
                .thenReturn(1);

        // When
        BaseResponse response = ratePriceService.list(validListRequest);

        // Then
        assertNotNull(response);
        assertTrue(response.isSuccess());
        assertNotNull(response.getData());
        verify(ratePriceMapper).selectByCondition(anyString(), anyString(), anyList(), anyString(), anyString());
    }

    @Test
    void testGetById_Success() {
        // Given
        RatePrice mockPrice = new RatePrice();
        mockPrice.setPriceId("price001");
        when(ratePriceMapper.selectById(anyString())).thenReturn(mockPrice);

        // When
        BaseResponse response = ratePriceService.getById("price001");

        // Then
        assertNotNull(response);
        assertTrue(response.isSuccess());
        assertNotNull(response.getData());
        verify(ratePriceMapper).selectById("price001");
    }

    @Test
    void testGetById_NotFound() {
        // Given
        when(ratePriceMapper.selectById(anyString())).thenReturn(null);

        // When
        BaseResponse response = ratePriceService.getById("price001");

        // Then
        assertNotNull(response);
        assertFalse(response.isSuccess());
        assertEquals("房价价格记录不存在", response.getMessage());
    }

    @Test
    void testCalendar_Success() {
        System.out.println("=== 开始执行 testCalendar_Success 测试 ===");
        
        // Given
        Hotel mockHotel = new Hotel();
        mockHotel.setHotelId("1b6847a3-a26f-4d7a-9bd6-f74da210c0f5");
        mockHotel.setHotelCode("681977");
        mockHotel.setHotelName("杭州西湖湖滨银泰CitiGO欢阁酒店");

        List<RoomType> mockRoomTypes = new ArrayList<>();
        RoomType roomType = new RoomType();
        roomType.setHotelId("1b6847a3-a26f-4d7a-9bd6-f74da210c0f5");
        roomType.setRoomTypeCode("DBL.ST-1");
        roomType.setRoomTypeName("欢享大床房");
        mockRoomTypes.add(roomType);

        List<RoomTypeStatus> mockRoomTypeStatus = new ArrayList<>();
        List<RateInventoryStatus> mockRateInventoryStatus = new ArrayList<>();
        List<RatePrice> mockRatePrices = new ArrayList<>();
        List<RatePlan> mockRatePlans = new ArrayList<>();
        List<RateCode> mockRateCodes = new ArrayList<>();
        List<AdditionalService> mockAdditionalServices = new ArrayList<>();
        List<HotelInventoryStatus> mockHotelInventoryStatus = new ArrayList<>();

        System.out.println("=== 设置 Mock 行为 ===");
        when(hotelMapper.selectByPrimaryKey(anyString())).thenReturn(mockHotel);
        when(roomTypeMapper.selectByHotelId(anyString())).thenReturn(mockRoomTypes);
        when(roomTypeStatusMapper.calendarByConditions(anyString(), anyList(), anyString(), anyString()))
                .thenReturn(mockRoomTypeStatus);
        when(rateInventoryStatusMapper.calendarByConditions(anyString(), anyList(), anyString(), anyString()))
                .thenReturn(mockRateInventoryStatus);
        when(ratePriceMapper.calendarByConditions(anyString(), anyList(), anyString(), anyString()))
                .thenReturn(mockRatePrices);
        when(ratePlanMapper.calendarByConditions(anyString())).thenReturn(mockRatePlans);
        when(rateCodeMapper.calendarByConditions(anyString())).thenReturn(mockRateCodes);
        when(additionalServiceMapper.calendarByConditions(anyString(), anyList()))
                .thenReturn(mockAdditionalServices);
        when(hotelInventoryStatusMapper.calendarByConditions(anyString(), anyString(), anyString()))
                .thenReturn(mockHotelInventoryStatus);

        // 打印输入参数
        System.out.println("=== testCalendar_Success 输入参数 ===");
        System.out.println("Hotel ID: " + validCalendarRequest.getHotelId());
        System.out.println("Start Date: " + validCalendarRequest.getStartDate());
        System.out.println("End Date: " + validCalendarRequest.getEndDate());
        System.out.println("Mock Hotel: " + mockHotel.getHotelId() + " - " + mockHotel.getHotelName());
        System.out.println("Mock Room Types Count: " + mockRoomTypes.size());
        System.out.println("Mock Room Type: " + roomType.getRoomTypeCode() + " - " + roomType.getRoomTypeName());

        System.out.println("=== 开始调用 calendar 方法 ===");
        // When
        BaseResponse response = ratePriceService.calendar(validCalendarRequest);
        System.out.println("=== calendar 方法调用完成 ===");

        // 打印输出参数
        System.out.println("=== testCalendar_Success 输出参数 ===");
        System.out.println("Response Success: " + response.isSuccess());
        System.out.println("Response Message: " + response.getMessage());
        System.out.println("Response Data: " + response.getData());

        // 将 response.getData() 转换为 JSON 字符串并打印
        if (response.getData() != null) {
            String jsonData = gson.toJson(response.getData());
            System.out.println("Response Data as JSON: " + jsonData);
        }

        if (response.getData() != null) {
            AvailabilityResponseModel responseModel = (AvailabilityResponseModel) response.getData();
            System.out.println("Response Status: " + responseModel.getStatus());
            if (responseModel.getData() != null) {
                System.out.println("Hotels Count: " + (responseModel.getData().getHotels() != null ? responseModel.getData().getHotels().size() : 0));
            }
        }

        System.out.println("=== 开始验证结果 ===");
        // Then
        assertNotNull(response);
        assertTrue(response.isSuccess());
        assertNotNull(response.getData());
        verify(hotelMapper).selectByPrimaryKey("1b6847a3-a26f-4d7a-9bd6-f74da210c0f5");
        verify(roomTypeMapper).selectByHotelId("1b6847a3-a26f-4d7a-9bd6-f74da210c0f5");
        System.out.println("=== testCalendar_Success 测试完成 ===");
    }

    @Test
    void testCalendar_NullRequest() {
        // When
        BaseResponse response = ratePriceService.calendar(null);

        // Then
        assertNotNull(response);
        assertFalse(response.isSuccess());
        assertEquals("请求参数不能为空", response.getMessage());
    }

    @Test
    void testCalendar_MissingHotelId() {
        // Given
        validCalendarRequest.setHotelId(null);

        // When
        BaseResponse response = ratePriceService.calendar(validCalendarRequest);

        // Then
        assertNotNull(response);
        assertFalse(response.isSuccess());
        assertEquals("酒店ID不能为空", response.getMessage());
    }

    @Test
    void testCalendar_MissingStartDate() {
        // Given
        validCalendarRequest.setStartDate(null);

        // When
        BaseResponse response = ratePriceService.calendar(validCalendarRequest);

        // Then
        assertNotNull(response);
        assertFalse(response.isSuccess());
        assertEquals("开始日期不能为空", response.getMessage());
    }

    @Test
    void testCalendar_MissingEndDate() {
        // Given
        validCalendarRequest.setEndDate(null);

        // When
        BaseResponse response = ratePriceService.calendar(validCalendarRequest);

        // Then
        assertNotNull(response);
        assertFalse(response.isSuccess());
        assertEquals("结束日期不能为空", response.getMessage());
    }

    @Test
    void testBatchAdd_Success() {
        // Given
        when(ratePriceMapper.selectByPrimaryKey(anyString(), anyString(), anyString(), anyString(), anyString()))
                .thenReturn(null);
        when(ratePriceMapper.insert(any(RatePrice.class))).thenReturn(1);

        // When
        BaseResponse response = ratePriceService.batchAdd(validAddRequest);

        // Then
        assertNotNull(response);
        assertTrue(response.isSuccess());
        assertEquals("房价价格添加成功", response.getMessage());
    }

    @Test
    void testGenerateRoomTypeDailyDataModel() {
        // Given
        List<RoomTypeStatus> roomTypeInventoryStatus = new ArrayList<>();
        String roomTypeCode = "ROOM001";
        String startDate = "2024-01-01";
        String endDate = "2024-01-03";

        // When
        List<AvailabilityResponseModel.DailyDataModel> result = ReflectionTestUtils.invokeMethod(
                ratePriceService, "generateRoomTypeDailyDataModel", 
                roomTypeInventoryStatus, roomTypeCode, startDate, endDate);

        // Then
        assertNotNull(result);
        assertEquals(3, result.size()); // 3天的数据
        assertEquals("2024-01-01", result.get(0).getDate());
        assertEquals("2024-01-02", result.get(1).getDate());
        assertEquals("2024-01-03", result.get(2).getDate());
    }

    @Test
    void testGenerateHotelDailyDataModel() {
        // Given
        List<HotelInventoryStatus> hotelInventoryStatus = new ArrayList<>();
        String hotelId = "1b6847a3-a26f-4d7a-9bd6-f74da210c0f5";
        String startDate = "2024-01-01";
        String endDate = "2024-01-03";

        // When
        List<AvailabilityResponseModel.DailyDataModel> result = ReflectionTestUtils.invokeMethod(
                ratePriceService, "generateHotelDailyDataModel", 
                hotelInventoryStatus, hotelId, startDate, endDate);

        // Then
        assertNotNull(result);
        assertEquals(3, result.size()); // 3天的数据
        assertEquals("2024-01-01", result.get(0).getDate());
        assertEquals("2024-01-02", result.get(1).getDate());
        assertEquals("2024-01-03", result.get(2).getDate());
    }

    @Test
    void testGenerateRateCodeDailyDataModel() {
        // Given
        List<RateInventoryStatus> rateInventoryStatus = new ArrayList<>();
        List<RatePrice> ratePrice = new ArrayList<>();
        String roomTypeCodeInput = "ROOM001";
        String startDate = "2024-01-01";
        String endDate = "2024-01-03";

        // When
        List<AvailabilityResponseModel.RateCodeDailyDataModel> result = ReflectionTestUtils.invokeMethod(
                ratePriceService, "generateRateCodeDailyDataModel", 
                rateInventoryStatus, ratePrice, roomTypeCodeInput, startDate, endDate);

        // Then
        assertNotNull(result);
        // 由于没有匹配的房型代码，结果应该为空
        assertEquals(0, result.size());
    }

    @Test
    void testGenerateDateRange() {
        // Given
        LocalDate startDate = LocalDate.parse("2024-01-01");
        LocalDate endDate = LocalDate.parse("2024-01-03");

        // When
        List<LocalDate> result = ReflectionTestUtils.invokeMethod(
                ratePriceService, "generateDateRange", startDate, endDate);

        // Then
        assertNotNull(result);
        assertEquals(3, result.size());
        assertEquals(LocalDate.parse("2024-01-01"), result.get(0));
        assertEquals(LocalDate.parse("2024-01-02"), result.get(1));
        assertEquals(LocalDate.parse("2024-01-03"), result.get(2));
    }

    @Test
    void testPrintOutput() {
        System.out.println("=== 这是一个简单的打印测试 ===");
        System.out.println("如果你能看到这条消息，说明打印功能正常");
        assertTrue(true);
    }
} 