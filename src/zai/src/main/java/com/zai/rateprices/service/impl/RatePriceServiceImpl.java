package com.zai.rateprices.service.impl;

import com.google.gson.Gson;
import com.zai.common.BaseResponse;
import com.zai.hotel.entity.Hotel;
import com.zai.rateprices.dto.BookingByHotelRateCodeRequest;
import com.zai.rateprices.dto.RatePriceAddRequest;
import com.zai.rateprices.dto.RatePriceByHotelRequest;
import com.zai.rateprices.dto.RatePriceByRoomTypeRequest;
import com.zai.rateprices.dto.RatePriceListRequest;
import com.zai.rateprices.dto.RatePriceMaintenanceRequest;
import com.zai.rateprices.dto.RatePriceUpdateRequest;
import com.zai.rateprices.entity.RatePrice;
import com.zai.rateprices.mapper.RatePriceMapper;
import com.zai.rateprices.service.RatePriceService;
import com.zai.rateprices.model.AvailabilityRequestModel;
import com.zai.rateprices.model.AvailabilityResponseModel;
import com.zai.rateprices.model.AvailabilityResponseModel.AvailabilityDataModel;
import com.zai.rateprices.model.AvailabilityResponseModel.AvailabilityHotelModel;
import com.zai.rateprices.model.AvailabilityResponseModel.DailyDataModel;
import com.zai.rateprices.model.AvailabilityResponseModel.AvailabilityRoomTypeModel;
import com.zai.rateprices.model.PriceModel;
import com.zai.rateprices.model.PaginationModel;
import com.zai.util.IdGenerator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import com.zai.hotel.mapper.HotelMapper;
import com.zai.roomtype.entity.RoomType;
import com.zai.roomtype.mapper.RoomTypeMapper;
import com.zai.rateprices.model.AvailabilityResponseModel.AvailabilityRateCodeModel;
import com.zai.roomtypestatus.mapper.RoomTypeStatusMapper;
import java.util.stream.Collectors;
import com.zai.roomtypestatus.entity.RoomTypeStatus;
import com.zai.rateinventorystatus.mapper.RateInventoryStatusMapper;
import com.zai.rateinventorystatus.entity.RateInventoryStatus;
import com.zai.rateplan.entity.RatePlan;
import com.zai.rateplan.mapper.RatePlanMapper;
import com.zai.hotelinventory.entity.HotelInventoryStatus;
import com.zai.hotelinventory.mapper.HotelInventoryStatusMapper;
import com.zai.rateprices.model.AvailabilityResponseModel.RateCodeDailyDataModel;
import com.zai.ratecode.entity.RateCode;
import com.zai.ratecode.mapper.RateCodeMapper;
import com.zai.additionalservice.entity.AdditionalService;
import com.zai.additionalservice.mapper.AdditionalServiceMapper;
import com.zai.rateprices.model.AvailabilityResponseModel.PackageModel;
import com.zai.rateprices.dto.BookingByHotelRateCodeResponse;
import com.zai.rateprices.dto.BookingDailyRate;
import com.zai.rateprices.dto.BookingRoomType;
import com.zai.rateprices.dto.RatePriceByRateCodeRequest;





/**
 * 房价价格服务实现类
 */
@Service
public class RatePriceServiceImpl implements RatePriceService {
    
    private static final Logger log = LoggerFactory.getLogger(RatePriceServiceImpl.class);
    
    @Autowired
    private Gson gson;
    
    @Autowired
    private RatePriceMapper ratePriceMapper;

    @Autowired
    private HotelMapper hotelMapper;

    @Autowired
    private RoomTypeMapper roomTypeMapper;

    @Autowired
    private RoomTypeStatusMapper roomTypeStatusMapper;

    @Autowired
    private RateInventoryStatusMapper rateInventoryStatusMapper;

    @Autowired
    private RatePlanMapper ratePlanMapper;

    @Autowired
    private HotelInventoryStatusMapper hotelInventoryStatusMapper;

    @Autowired
    private RateCodeMapper rateCodeMapper;

    @Autowired
    private AdditionalServiceMapper additionalServiceMapper;

    @Override
    @Transactional
    public BaseResponse add(RatePriceAddRequest request) {
        log.debug("添加房价价格请求: {}", gson.toJson(request));
        
        try {
            // 参数验证
            if (request == null) {
                return BaseResponse.error("请求参数不能为空");
            }
            
            if (!StringUtils.hasText(request.getChainId())) {
                return BaseResponse.error("连锁ID不能为空");
            }
            
            if (!StringUtils.hasText(request.getHotelId())) {
                return BaseResponse.error("酒店ID不能为空");
            }
            
            if (!StringUtils.hasText(request.getRateCode())) {
                return BaseResponse.error("房价码不能为空");
            }
            
            if (!StringUtils.hasText(request.getRoomTypeCode())) {
                return BaseResponse.error("房型代码不能为空");
            }
            
            if (request.getStayDate() == null) {
                return BaseResponse.error("入住日期不能为空");
            }
            
            // 验证日期格式
            try {
                LocalDate.parse(request.getStayDate(), DateTimeFormatter.ofPattern("yyyy-MM-dd"));
            } catch (Exception e) {
                return BaseResponse.error("入住日期格式错误，请使用yyyy-MM-dd格式");
            }
            
            // 检查是否已存在
            RatePrice existing = ratePriceMapper.selectByPrimaryKey(
                request.getChainId(), 
                request.getHotelId(), 
                request.getRateCode(), 
                request.getRoomTypeCode(), 
                request.getStayDate()
            );
            
            if (existing != null) {
                return BaseResponse.error("该日期已存在房价价格记录");
            }
            
            // 创建实体对象
            RatePrice ratePrice = new RatePrice();
            ratePrice.setPriceId(IdGenerator.generate64BitId());
            ratePrice.setChainId(request.getChainId());
            ratePrice.setHotelId(request.getHotelId());
            ratePrice.setHotelCode(request.getHotelCode());
            ratePrice.setRatePlanId(request.getRatePlanId());
            ratePrice.setRoomTypeId(request.getRoomTypeId());
            ratePrice.setRoomTypeCode(request.getRoomTypeCode());
            ratePrice.setRateCodeId(request.getRateCodeId());
            ratePrice.setRateCode(request.getRateCode());
            ratePrice.setStayDate(request.getStayDate());
            ratePrice.setChannelSingleOccupancy(request.getChannelSingleOccupancy());
            ratePrice.setChannelDoubleOccupancy(request.getChannelDoubleOccupancy());
            ratePrice.setHotelSingleOccupancy(request.getHotelSingleOccupancy());
            ratePrice.setHotelDoubleOccupancy(request.getHotelDoubleOccupancy());
            ratePrice.setAgentSingleOccupancy(request.getAgentSingleOccupancy());
            ratePrice.setAgentDoubleOccupancy(request.getAgentDoubleOccupancy());
            ratePrice.setCreatedAt(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
            ratePrice.setUpdatedAt(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
            
            // 保存到数据库
            int result = ratePriceMapper.insert(ratePrice);
            
            if (result > 0) {
                BaseResponse response = BaseResponse.success("房价价格添加成功");
                log.debug("添加房价价格响应: {}", gson.toJson(response));
                return response;
            } else {
                return BaseResponse.error("房价价格添加失败");
            }
            
        } catch (Exception e) {
            log.error("添加房价价格异常", e);
            return BaseResponse.error("添加房价价格异常: " + e.getMessage());
        }
    }
    
    @Override
    @Transactional
    public BaseResponse update(RatePriceUpdateRequest request) {
        log.debug("更新房价价格请求: {}", gson.toJson(request));
        
        try {
            // 参数验证
            if (request == null) {
                return BaseResponse.error("请求参数不能为空");
            }
            
            if (!StringUtils.hasText(request.getPriceId())) {
                return BaseResponse.error("价格ID不能为空");
            }
            
            // 验证日期格式（如果提供了日期）
            if (StringUtils.hasText(request.getStayDate())) {
                try {
                    LocalDate.parse(request.getStayDate(), DateTimeFormatter.ofPattern("yyyy-MM-dd"));
                } catch (Exception e) {
                    return BaseResponse.error("入住日期格式错误，请使用yyyy-MM-dd格式");
                }
            }
            
            // 检查记录是否存在
            RatePrice existing = ratePriceMapper.selectById(request.getPriceId());
            if (existing == null) {
                return BaseResponse.error("房价价格记录不存在");
            }
            
            // 更新实体对象
            RatePrice ratePrice = new RatePrice();
            ratePrice.setPriceId(request.getPriceId());
            ratePrice.setChainId(request.getChainId());
            ratePrice.setHotelId(request.getHotelId());
            ratePrice.setHotelCode(request.getHotelCode());
            ratePrice.setRatePlanId(request.getRatePlanId());
            ratePrice.setRoomTypeId(request.getRoomTypeId());
            ratePrice.setRoomTypeCode(request.getRoomTypeCode());
            ratePrice.setRateCodeId(request.getRateCodeId());
            ratePrice.setRateCode(request.getRateCode());
            ratePrice.setStayDate(request.getStayDate());
            ratePrice.setChannelSingleOccupancy(request.getChannelSingleOccupancy());
            ratePrice.setChannelDoubleOccupancy(request.getChannelDoubleOccupancy());
            ratePrice.setHotelSingleOccupancy(request.getHotelSingleOccupancy());
            ratePrice.setHotelDoubleOccupancy(request.getHotelDoubleOccupancy());
            ratePrice.setAgentSingleOccupancy(request.getAgentSingleOccupancy());
            ratePrice.setAgentDoubleOccupancy(request.getAgentDoubleOccupancy());
            ratePrice.setUpdatedAt(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
            
            // 更新数据库
            int result = ratePriceMapper.update(ratePrice);
            
            if (result > 0) {
                BaseResponse response = BaseResponse.success("房价价格更新成功");
                log.debug("更新房价价格响应: {}", gson.toJson(response));
                return response;
            } else {
                return BaseResponse.error("房价价格更新失败");
            }
            
        } catch (Exception e) {
            log.error("更新房价价格异常", e);
            return BaseResponse.error("更新房价价格异常: " + e.getMessage());
        }
    }
    
    @Override
    @Transactional
    public BaseResponse delete(String priceId) {
        log.debug("删除房价价格请求: priceId={}", priceId);
        
        try {
            if (!StringUtils.hasText(priceId)) {
                return BaseResponse.error("价格ID不能为空");
            }
            
            // 检查记录是否存在
            RatePrice existing = ratePriceMapper.selectById(priceId);
            if (existing == null) {
                return BaseResponse.error("房价价格记录不存在");
            }
            
            // 删除记录
            int result = ratePriceMapper.deleteById(priceId);
            
            if (result > 0) {
                BaseResponse response = BaseResponse.success("房价价格删除成功");
                log.debug("删除房价价格响应: {}", gson.toJson(response));
                return response;
            } else {
                return BaseResponse.error("房价价格删除失败");
            }
            
        } catch (Exception e) {
            log.error("删除房价价格异常", e);
            return BaseResponse.error("删除房价价格异常: " + e.getMessage());
        }
    }
    
    @Override
    public BaseResponse list(RatePriceListRequest request) {
        log.debug("查询房价价格列表请求: {}", gson.toJson(request));
        
        try {
            // 参数验证
            if (request == null) {
                return BaseResponse.error("请求参数不能为空");
            }
            
            if (!StringUtils.hasText(request.getChainId())) {
                return BaseResponse.error("连锁ID不能为空");
            }
            
            if (!StringUtils.hasText(request.getHotelId())) {
                return BaseResponse.error("酒店ID不能为空");
            }
            
            // 验证日期格式（如果提供了日期）
            if (StringUtils.hasText(request.getStartDate())) {
                try {
                    LocalDate.parse(request.getStartDate(), DateTimeFormatter.ofPattern("yyyy-MM-dd"));
                } catch (Exception e) {
                    return BaseResponse.error("开始日期格式错误，请使用yyyy-MM-dd格式");
                }
            }
            
            if (StringUtils.hasText(request.getEndDate())) {
                try {
                    LocalDate.parse(request.getEndDate(), DateTimeFormatter.ofPattern("yyyy-MM-dd"));
                } catch (Exception e) {
                    return BaseResponse.error("结束日期格式错误，请使用yyyy-MM-dd格式");
                }
            }
            
            List<RatePrice> ratePrices;
            int total;
            
            // 判断使用哪种查询方式
            if (request.getRoomTypeRateCodeMappings() != null && !request.getRoomTypeRateCodeMappings().isEmpty()) {
                // 使用房型与房价码映射关系查询
                ratePrices = ratePriceMapper.selectByRoomTypeRateCodeMappings(
                    request.getChainId(),
                    request.getHotelId(),
                    request.getRoomTypeRateCodeMappings(),
                    request.getStartDate(),
                    request.getEndDate()
                );
                
                total = ratePriceMapper.countByRoomTypeRateCodeMappings(
                    request.getChainId(),
                    request.getHotelId(),
                    request.getRoomTypeRateCodeMappings(),
                    request.getStartDate(),
                    request.getEndDate()
                );
            } else {
                // 使用简单的房型代码列表查询
                ratePrices = ratePriceMapper.selectByCondition(
                    request.getChainId(),
                    request.getHotelId(),
                    request.getRoomTypeCode(),
                    request.getStartDate(),
                    request.getEndDate()
                );
                
                total = ratePriceMapper.countByCondition(
                    request.getChainId(),
                    request.getHotelId(),
                    request.getRoomTypeCode(),
                    request.getStartDate(),
                    request.getEndDate()
                );
            }
            
            BaseResponse response = BaseResponse.success(ratePrices);
            log.debug("查询房价价格列表响应: {}", gson.toJson(response));
            return response;
            
        } catch (Exception e) {
            log.error("查询房价价格列表异常", e);
            return BaseResponse.error("查询房价价格列表异常: " + e.getMessage());
        }
    }
    
    @Override
    public BaseResponse getById(String priceId) {
        log.debug("根据ID查询房价价格请求: priceId={}", priceId);
        
        try {
            if (!StringUtils.hasText(priceId)) {
                return BaseResponse.error("价格ID不能为空");
            }
            
            RatePrice ratePrice = ratePriceMapper.selectById(priceId);
            
            if (ratePrice == null) {
                return BaseResponse.error("房价价格记录不存在");
            }
            
            BaseResponse response = BaseResponse.success(ratePrice);
            log.debug("根据ID查询房价价格响应: {}", gson.toJson(response));
            return response;
            
        } catch (Exception e) {
            log.error("根据ID查询房价价格异常", e);
            return BaseResponse.error("根据ID查询房价价格异常: " + e.getMessage());
        }
    }
    
    @Override
    @Transactional
    public BaseResponse batchAdd(RatePriceAddRequest request) {
        log.debug("批量添加房价价格请求: {}", gson.toJson(request));
        
        try {
            // 参数验证
            if (request == null) {
                return BaseResponse.error("请求参数不能为空");
            }
            
            if (!StringUtils.hasText(request.getChainId())) {
                return BaseResponse.error("连锁ID不能为空");
            }
            
            if (!StringUtils.hasText(request.getHotelId())) {
                return BaseResponse.error("酒店ID不能为空");
            }
            
            // 这里可以实现批量添加逻辑
            // 暂时调用单个添加方法
            return add(request);
            
        } catch (Exception e) {
            log.error("批量添加房价价格异常", e);
            return BaseResponse.error("批量添加房价价格异常: " + e.getMessage());
        }
    }
    
    /**
     * 根据房型库存状态数据生成每日数据模型
     * @param roomTypeInventoryStatus 房型库存状态列表
     * @param roomTypeCode 房型代码
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 每日数据模型列表
     */
    private List<DailyDataModel> generateRoomTypeDailyDataModel(
        List<RoomTypeStatus> roomTypeInventoryStatus, 
        String roomTypeCode,
        String startDate, String endDate) {
        List<DailyDataModel> dailyDataList = new ArrayList<>();
        
        try {
            LocalDate start = LocalDate.parse(startDate, DateTimeFormatter.ofPattern("yyyy-MM-dd"));
            LocalDate end = LocalDate.parse(endDate, DateTimeFormatter.ofPattern("yyyy-MM-dd"));
            
            // 创建房型代码+日期到库存数据的映射
            Map<String, RoomTypeStatus> roomTypeDateToInventoryMap = new HashMap<>();
            for (RoomTypeStatus inventory : roomTypeInventoryStatus) {
                String inventoryRoomTypeCode = inventory.getRoomTypeCode();
                String stayDate = inventory.getStayDate();
                if (inventoryRoomTypeCode != null && stayDate != null) {
                    String key = inventoryRoomTypeCode + "_" + stayDate;
                    roomTypeDateToInventoryMap.put(key, inventory);
                }
            }
            
            // 遍历从开始日期到结束日期的每一天
            LocalDate currentDate = start;
            while (!currentDate.isAfter(end)) {
                String currentDateStr = currentDate.format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
                
                DailyDataModel dailyData = new DailyDataModel();
                dailyData.setDate(currentDateStr);
                
                // 使用房型代码+日期作为key查找库存数据
                String key = roomTypeCode + "_" + currentDateStr;
                RoomTypeStatus inventoryData = roomTypeDateToInventoryMap.get(key);
                if (inventoryData != null) {
                    // 有库存数据，使用实际数据
                    String isAvailable = inventoryData.getIsAvailable();
                    Integer remaining = inventoryData.getRemainingInventory();
                    Integer sold = inventoryData.getSoldInventory();
                    
                    dailyData.setIsAvailable(isAvailable != null ? isAvailable : "O");
                    dailyData.setRemaining(remaining != null ? remaining : 0);
                    dailyData.setSold(sold != null ? sold : 0);
                } else {
                    // 没有库存数据，使用默认值
                    dailyData.setIsAvailable("O");
                    dailyData.setRemaining(10);
                    dailyData.setSold(0);
                }
                
                dailyDataList.add(dailyData);
                currentDate = currentDate.plusDays(1);
            }
            
        } catch (Exception e) {
            log.error("生成每日数据模型异常", e);
            // 发生异常时返回默认数据
            DailyDataModel defaultData = new DailyDataModel();
            defaultData.setDate(startDate);
            defaultData.setIsAvailable("O");
            defaultData.setRemaining(10);
            defaultData.setSold(0);
            dailyDataList.add(defaultData);
        }
        
        return dailyDataList;
    }

    private List<DailyDataModel> generateHotelDailyDataModel(
        List<HotelInventoryStatus> hotelInventoryStatus, 
        String hotelId,
        String startDate, String endDate) {
        List<DailyDataModel> dailyDataList = new ArrayList<>();
        try {
            LocalDate start = LocalDate.parse(startDate, DateTimeFormatter.ofPattern("yyyy-MM-dd"));
            LocalDate end = LocalDate.parse(endDate, DateTimeFormatter.ofPattern("yyyy-MM-dd"));

            // 创建酒店ID+日期到库存数据的映射
            Map<String, HotelInventoryStatus> hotelDateToInventoryMap = new HashMap<>();
            for (HotelInventoryStatus inventory : hotelInventoryStatus) {
                String inventoryHotelId = inventory.getHotelId();
                String stayDate = inventory.getStayDate().toString();
                if (inventoryHotelId != null && stayDate != null) {
                    String key = inventoryHotelId + "_" + stayDate;
                    hotelDateToInventoryMap.put(key, inventory);
                }
            }

            // 遍历从开始日期到结束日期的每一天
            LocalDate currentDate = start;
            while (!currentDate.isAfter(end)) {
                String currentDateStr = currentDate.format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));

                DailyDataModel dailyData = new DailyDataModel();
                dailyData.setDate(currentDateStr);

                // 使用酒店ID+日期作为key查找库存数据
                String key = hotelId + "_" + currentDateStr;
                HotelInventoryStatus inventoryData = hotelDateToInventoryMap.get(key);
                if (inventoryData != null) {
                    // 有库存数据，使用实际数据
                    String isAvailable = inventoryData.getIsAvailable();
                    Integer remaining = inventoryData.getRemainingInventory();
                    Integer sold = inventoryData.getSoldInventory();

                    dailyData.setIsAvailable(isAvailable != null ? isAvailable : "O");
                    dailyData.setRemaining(remaining != null ? remaining : 0);
                    dailyData.setSold(sold != null ? sold : 0);
                } else {
                    // 没有库存数据，使用默认值
                    dailyData.setIsAvailable("O");
                    dailyData.setRemaining(10);
                    dailyData.setSold(0);
                }

                dailyDataList.add(dailyData);
                currentDate = currentDate.plusDays(1);
            }

        } catch (Exception e) {
            log.error("生成酒店每日数据模型异常", e);
            // 发生异常时返回默认数据
            DailyDataModel defaultData = new DailyDataModel();
            defaultData.setDate(startDate);
            defaultData.setIsAvailable("O");
            defaultData.setRemaining(10);
            defaultData.setSold(0);
            dailyDataList.add(defaultData);
        }

        return dailyDataList;
    }

    
    /**
     * 日历查询（主入口）
     * @param request 请求参数
     * @return 响应结果
     */
    @Override
    public BaseResponse calendar(AvailabilityRequestModel request) {
        log.debug("日历查询请求: {}", gson.toJson(request));
        //校验 request 参数
        if (request == null) {
            return BaseResponse.error("请求参数不能为空");
        }
        if (!StringUtils.hasText(request.getHotelId())) {
            return BaseResponse.error("酒店ID不能为空");
        }   
        if (!StringUtils.hasText(request.getStartDate())) {
            return BaseResponse.error("开始日期不能为空");
        }
        if (!StringUtils.hasText(request.getEndDate())) {
            return BaseResponse.error("结束日期不能为空");
        }
        
        String hotelId = request.getHotelId();
        LocalDate startDate = LocalDate.parse(request.getStartDate(), DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        LocalDate endDate = LocalDate.parse(request.getEndDate(), DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        
        // Generate date range
        List<LocalDate> dateList = generateDateRange(startDate, endDate);
        // 根据 hotelId 查询酒店
        Hotel hotel = getHotelById(hotelId);
        // 初始化 AvailabilityResponseModel
        AvailabilityResponseModel availabilityResponseModel = new AvailabilityResponseModel();
        availabilityResponseModel.setStatus("success");
        
        // 用 hotel 初始化 AvailabilityHotelModel
        AvailabilityHotelModel availabilityHotelModel = new AvailabilityHotelModel();
        availabilityHotelModel.setHotelCode(hotel.getHotelCode());
        availabilityHotelModel.setHotelName(hotel.getHotelName());
        // 用 dateList 初始化 dailyData
        initializeHotelDailyData(hotelId, dateList, availabilityHotelModel);
        // 日志打印 json格式的 availabilityHotelModel
        //log.debug("availabilityHotelModel: {}", gson.toJson(availabilityHotelModel));
        // 查询 hotelId下的所有房型
        List<RoomType> roomTypes = getRoomTypesByHotelId(hotelId);
        // 查询 rate_plans 表
        List<RatePlan> ratePlans = ratePlanMapper.calendarByConditions(
            hotelId);
        // 查询 rate_codes 表
        List<RateCode> rateCodes = rateCodeMapper.calendarByConditions(
            hotelId);
        // 用 roomTypes 初始化 roomTypes
        List<AvailabilityRoomTypeModel> roomTypesList = initializeRoomTypes(hotelId, roomTypes, rateCodes, ratePlans, dateList);
        availabilityHotelModel.setRoomTypes(roomTypesList);

        List<AvailabilityHotelModel> availabilityHotelModels = new ArrayList<>();
        availabilityHotelModels.add(availabilityHotelModel);

        // 用 roomTypesList 初始化 availabilityDataModel
        AvailabilityDataModel availabilityDataModel = new AvailabilityDataModel();
        availabilityDataModel.setHotels(availabilityHotelModels);
        // 用 availabilityDataModel 初始化 availabilityResponseModel
        availabilityResponseModel.setData(availabilityDataModel);
        // 返回 AvailabilityResponseModel
        return BaseResponse.success(availabilityResponseModel);
    }
    
    /**
     * 初始化房型与房价码映射关系
     * @param dateList 日期列表
     * @param availabilityRoomTypeModel 房型模型
     */
    public List<AvailabilityRoomTypeModel> initializeRoomTypes(String hotelId, 
                    List<RoomType> roomTypes, 
                    List<RateCode> rateCodes, 
                    List<RatePlan> ratePlans,
                    List<LocalDate> dateList) {

        // 获取 startDate 和 endDate
        String startDate = dateList.get(0).format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        String endDate = dateList.get(dateList.size() - 1).format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        // 将 roomTypes 转换为 roomTypeCode 的 List
        List<String> roomTypeCodes = roomTypes.stream()
        .map(RoomType::getRoomTypeCode)
        .collect(Collectors.toList());

        // 查询 roomtype_inventory_status 表
        List<RoomTypeStatus> roomTypeInventoryStatus = roomTypeStatusMapper.calendarByConditions(
            hotelId, roomTypeCodes, startDate, endDate);

        //查询 rate_inventory_status 表
        List<RateInventoryStatus> rateInventoryStatus = rateInventoryStatusMapper.calendarByConditions(
            hotelId, roomTypeCodes, startDate, endDate);

        //查询 rate_price 表
        List<RatePrice> ratePrice = ratePriceMapper.calendarByConditions(
            hotelId, roomTypeCodes, startDate, endDate);

        
        // 从 rateCodes 中提取 rateCodeId 列表
        List<String> rateCodeIds = rateCodes.stream()
            .map(RateCode::getRateCodeId)
            .collect(Collectors.toList());
        // 查询 additional_services 表
        List<AdditionalService> additionalServices = additionalServiceMapper.calendarByConditions(
            hotelId, rateCodeIds);

        // 初始化 roomTypesList
        List<AvailabilityRoomTypeModel> roomTypesList = new ArrayList<>();
        for (RoomType roomType : roomTypes) {
            AvailabilityRoomTypeModel availabilityRoomTypeModel = new AvailabilityRoomTypeModel();
            availabilityRoomTypeModel.setRoomTypeCode(roomType.getRoomTypeCode());
            availabilityRoomTypeModel.setRoomTypeName(roomType.getRoomTypeName());
            availabilityRoomTypeModel.setRoomTypeDescription(roomType.getDescription());

            // 用查询结果初始化 dailyData
            List<DailyDataModel> dailyDataList = generateRoomTypeDailyDataModel(
                roomTypeInventoryStatus, 
                roomType.getRoomTypeCode(), startDate, endDate);
            
            availabilityRoomTypeModel.setDailyData(dailyDataList);

            // 日志打印 json格式的 availabilityRoomTypeModel
            //log.debug("availabilityRoomTypeModel: {}", gson.toJson(availabilityRoomTypeModel));
            

            // 用 dateList 初始化 rateCodes
            List<AvailabilityRateCodeModel> rateCodesList = initializeRoomTypesRateCodes(dateList, 
                ratePlans,
                rateCodes,
                additionalServices,
                rateInventoryStatus, 
                ratePrice,
                roomType.getRoomTypeCode(), 
                startDate, endDate);

            // 将 rateCodesList 加入到 availabilityRoomTypeModel 中
            availabilityRoomTypeModel.setRateCodes(rateCodesList);

            // 日志打印 json格式的 availabilityRoomTypeModel
            //log.debug("availabilityRoomTypeModel: {}", gson.toJson(availabilityRoomTypeModel));

            roomTypesList.add(availabilityRoomTypeModel);

            
        }
        return roomTypesList;
    }

    
    

    /**
     * 初始化房型与房价码映射关系
     * @param dateList 日期列表
     * @param availabilityRoomTypeModel 房型模型
     */
    public List<AvailabilityRateCodeModel> initializeRoomTypesRateCodes(List<LocalDate> dateList, 
                                                List<RatePlan> ratePlans,
                                                List<RateCode> rateCodes,
                                                List<AdditionalService> additionalServices,
                                                List<RateInventoryStatus> rateInventoryStatus,
                                                List<RatePrice> ratePrice,
                                                String roomTypeCode,
                                                String startDate,
                                                String endDate) {

        List<AvailabilityRateCodeModel> rateCodesList = new ArrayList<>();

        // 先遍历 ratePlans
        for (RatePlan ratePlan : ratePlans) {
            // 获取房型对应的 ratecode 对象
            if (!ratePlan.getRoomType().equals(roomTypeCode)) {
                continue;
            }
            //通过 ratePlan.getRateCode() 获取 rateCodes 中的 RateCode 对象
            RateCode rateCode = rateCodes.stream()
            .filter(rc -> rc.getRateCode().equals(ratePlan.getRateCode()))
            .findFirst()
            .orElse(null);
            if (rateCode == null) {
                continue;
            }
            // 初始化 availabilityRateCodeModel
            AvailabilityRateCodeModel availabilityRateCodeModel = new AvailabilityRateCodeModel();
            availabilityRateCodeModel.setRateCode(rateCode.getRateCode());
            availabilityRateCodeModel.setRateCodeName(rateCode.getRateCodeName());
            // 日志打印 rateCode.getRateCode() 
            log.debug("rateCode: {}", rateCode.getRateCode()+"_"+roomTypeCode);
            // 用查询结果初始化 dailyData
            List<RateCodeDailyDataModel> rateCodeDailyDataModel = generateRateCodeDailyDataModel(
                                                                    rateInventoryStatus, 
                                                                    ratePrice,
                                                                    roomTypeCode,
                                                                    rateCode.getRateCode(), 
                                                                    startDate, 
                                                                    endDate);
            
            availabilityRateCodeModel.setDailyData(rateCodeDailyDataModel);
            // 用 additionalServices 初始化 availabilityRateCodeModel 中的 packages
            List<PackageModel> packages = new ArrayList<>();
            for (AdditionalService additionalService : additionalServices) {
                if (!additionalService.getRateCode().equals(rateCode.getRateCode())) {
                    continue;
                }
                PackageModel packageModel = new PackageModel();
                packageModel.setPackageCode(additionalService.getServiceCode());
                packageModel.setPackageDescription(additionalService.getServiceName());
                packages.add(packageModel);
            }
            availabilityRateCodeModel.setPackages(packages);
            rateCodesList.add(availabilityRateCodeModel);
        }

        return rateCodesList;
    }
    /**
     * 生成房价码每日数据模型
     * @param rateInventoryStatus 库存数据
     * @param ratePrice 价格数据
     * @param roomTypeCodeInput 房型代码
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 房价码每日数据模型
     */
    private List<RateCodeDailyDataModel> generateRateCodeDailyDataModel(
        List<RateInventoryStatus> rateInventoryStatus, 
        List<RatePrice> ratePrice, 
        String roomTypeCodeStd,
        String rateCodeStd,
        String startDate, String endDate) {
        List<RateCodeDailyDataModel> dailyDataList = new ArrayList<>();
        try {
            LocalDate start = LocalDate.parse(startDate, DateTimeFormatter.ofPattern("yyyy-MM-dd"));
            LocalDate end = LocalDate.parse(endDate, DateTimeFormatter.ofPattern("yyyy-MM-dd"));

            // 创建roomTypeCode+rateCode+日期到库存数据的映射
            Map<String, RateInventoryStatus> rateCodeDateToInventoryMap = new HashMap<>();
            for (RateInventoryStatus inventory : rateInventoryStatus) {
                String roomTypeCode = inventory.getRoomTypeCode();
                String rateCode = inventory.getRateCode();
                String stayDate = inventory.getStayDate().toString();
                if (roomTypeCode != null && rateCode != null && stayDate != null) {
                    String key = roomTypeCode + "_" + rateCode + "_" + stayDate;
                    rateCodeDateToInventoryMap.put(key, inventory);
                }
            }

            // 创建roomTypeCode+rateCode+日期到库存数据的映射 ratePrice
            Map<String, RatePrice> ratePriceDateToPriceMap = new HashMap<>();
            for (RatePrice price : ratePrice) {
                String roomTypeCode = price.getRoomTypeCode();
                String rateCode = price.getRateCode();
                String stayDate = price.getStayDate().toString();
                if (roomTypeCode != null && rateCode != null && stayDate != null) {
                    String key = roomTypeCode + "_" + rateCode + "_" + stayDate;
                    ratePriceDateToPriceMap.put(key, price);
                }
            }
            // 日志打印 rateCodeStd
            //log.debug("rateCodeStd: {}", rateCodeStd);
            // 遍历从开始日期到结束日期的每一天
            LocalDate currentDate = start;
            while (!currentDate.isAfter(end)) {
                String currentDateStr = currentDate.format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
                RateCodeDailyDataModel dailyData = new RateCodeDailyDataModel();
                dailyData.setDate(currentDateStr);
                // 使用roomTypeCode+rateCode+日期作为key查找库存数据
                String key = roomTypeCodeStd + "_" + rateCodeStd + "_" + currentDateStr;
                RateInventoryStatus inventoryData = rateCodeDateToInventoryMap.get(key);
                // 如果 RateInventoryStatus 存在数据则补全 dailyData
                if (inventoryData != null) {
                    dailyData.setIsAvailable(inventoryData.getIsAvailable());
                    dailyData.setRemainingInventory(inventoryData.getRemainingInventory());
                    dailyData.setSoldInventory(inventoryData.getSoldInventory());
                    dailyData.setMinStayDays(inventoryData.getMinStayDays()!=null?inventoryData.getMinStayDays():1);
                    dailyData.setMaxStayDays(inventoryData.getMaxStayDays()!=null?inventoryData.getMaxStayDays():99);
                    dailyData.setMinAdvanceDays(inventoryData.getMinAdvanceDays()!=null?inventoryData.getMinAdvanceDays():0);
                    dailyData.setMaxAdvanceDays(inventoryData.getMaxAdvanceDays()!=null?inventoryData.getMaxAdvanceDays():99); 
                    dailyData.setLatestCancelDays(inventoryData.getLatestCancelDays()!=null?inventoryData.getLatestCancelDays():0);
                    dailyData.setLatestCancelTimeSameDay(inventoryData.getLatestCancelTimeSameDay()!=null?inventoryData.getLatestCancelTimeSameDay():"23:59");
                    dailyData.setPaymentType(inventoryData.getPaymentType()!=null?inventoryData.getPaymentType():"prepay");
                    dailyData.setLatestReservationTimeSameDay(inventoryData.getLatestReservationTimeSameDay()!=null?inventoryData.getLatestReservationTimeSameDay():"23:59");
                    dailyData.setIsCancellable(inventoryData.getIsCancellable()!=null?inventoryData.getIsCancellable():true);
                    dailyData.setCancelPenalty(inventoryData.getCancelPenalty()!=null?inventoryData.getCancelPenalty():BigDecimal.ZERO );
                } else {
                    dailyData.setIsAvailable("O");
                    dailyData.setRemainingInventory(10);
                    dailyData.setSoldInventory(0);
                    dailyData.setMinStayDays(1);
                    dailyData.setMaxStayDays(99);
                    dailyData.setMinAdvanceDays(0);
                    dailyData.setMaxAdvanceDays(99);
                    dailyData.setLatestCancelDays(0);
                    dailyData.setLatestCancelTimeSameDay("23:59");
                    dailyData.setPaymentType("prepay");
                    dailyData.setLatestReservationTimeSameDay("23:59");
                    dailyData.setIsCancellable(true);
                    dailyData.setCancelPenalty(BigDecimal.ZERO);
                }
                RatePrice priceData = ratePriceDateToPriceMap.get(key);
                // 如果 RatePrice 存在数据则补全 dailyData
                if (priceData != null) {
                    PriceModel channelPrice = new PriceModel();
                    channelPrice.setSingleOccupancy(priceData.getChannelSingleOccupancy());
                    channelPrice.setDoubleOccupancy(priceData.getChannelDoubleOccupancy());
                    PriceModel hotelPrice = new PriceModel();
                    hotelPrice.setSingleOccupancy(priceData.getHotelSingleOccupancy());
                    hotelPrice.setDoubleOccupancy(priceData.getHotelDoubleOccupancy());
                    PriceModel agentPrice = new PriceModel();
                    agentPrice.setSingleOccupancy(priceData.getAgentSingleOccupancy());
                    agentPrice.setDoubleOccupancy(priceData.getAgentDoubleOccupancy());
                    dailyData.setChannelPrice(channelPrice);
                    dailyData.setHotelPrice(hotelPrice);
                    dailyData.setAgentPrice(agentPrice);
                }else{
                    PriceModel channelPrice = new PriceModel();
                    channelPrice.setSingleOccupancy(BigDecimal.valueOf(0.0));
                    channelPrice.setDoubleOccupancy(BigDecimal.valueOf(0.0));
                    PriceModel hotelPrice = new PriceModel();
                    hotelPrice.setSingleOccupancy(BigDecimal.valueOf(0.0));
                    hotelPrice.setDoubleOccupancy(BigDecimal.valueOf(0.0));
                    PriceModel agentPrice = new PriceModel();  
                    agentPrice.setSingleOccupancy(BigDecimal.valueOf(0.0));
                    agentPrice.setDoubleOccupancy(BigDecimal.valueOf(0.0));
                    dailyData.setChannelPrice(channelPrice);
                    dailyData.setHotelPrice(hotelPrice);
                    dailyData.setAgentPrice(agentPrice);
                }
                dailyDataList.add(dailyData);                 
                currentDate = currentDate.plusDays(1);
            }
            // 日志打印 dailyDataList
            //log.debug("dailyDataList: {}", gson.toJson(dailyDataList));

        } catch (Exception e) {
            log.error("生成房价码每日数据模型异常", e);
            // 发生异常时返回默认数据
            RateCodeDailyDataModel defaultData = new RateCodeDailyDataModel();
            defaultData.setDate(startDate);
            defaultData.setIsAvailable("O");
            defaultData.setRemainingInventory(10);
            defaultData.setSoldInventory(0);
            dailyDataList.add(defaultData);
        }

        return dailyDataList;
    }


    public void initializeHotelDailyData(String hotelId, 
    List<LocalDate> dateList, 
    AvailabilityHotelModel availabilityHotelModel) {
        // 获取 startDate 和 endDate
        String startDate = dateList.get(0).format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        String endDate = dateList.get(dateList.size() - 1).format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        // 查询 hotel_inventory_status 表
        List<HotelInventoryStatus> hotelInventoryStatus = hotelInventoryStatusMapper.calendarByConditions(
            hotelId, startDate, endDate);

        // 用查询结果初始化 dailyData
        List<DailyDataModel> dailyDataList = generateHotelDailyDataModel(
            hotelInventoryStatus, 
            hotelId,
            startDate,  endDate);
        
        availabilityHotelModel.setDailyData(dailyDataList);
    }
    

    /**
     * 根据酒店ID查询房型
     * @param hotelId 酒店ID
     * @return 房型列表
     */
    private List<RoomType> getRoomTypesByHotelId(String hotelId) {
        return roomTypeMapper.selectByHotelId(hotelId);
    }

    /**
     * 根据酒店ID查询酒店
     * @param hotelId 酒店ID
     * @return 酒店信息
     */
    private Hotel getHotelById(String hotelId) {
        return hotelMapper.selectByPrimaryKey(hotelId);
    }
    /**
     * 生成日期范围
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 日期范围
     */
    private List<LocalDate> generateDateRange(LocalDate startDate, LocalDate endDate) {
        List<LocalDate> dates = new ArrayList<>();
        for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
            dates.add(date);
        }
        return dates;
    }
    
    /**
     * 日历中,酒店一行的每天的格子,开关
     * 根据酒店ID和入住日期设置酒店库存状态
     * @param request 请求参数
     * @return 响应结果
     */
    @Override
    public BaseResponse setRatePricesByHotel(RatePriceByHotelRequest request) {
        log.debug("根据酒店ID和入住日期设置酒店库存状态请求: {}", gson.toJson(request));
        
        try {
            // 参数验证
            if (request == null) {
                return BaseResponse.error("请求参数不能为空");
            }
            
            if (!StringUtils.hasText(request.getHotelId())) {
                return BaseResponse.error("酒店ID不能为空");
            }
            
            if (!StringUtils.hasText(request.getStayDate())) {
                return BaseResponse.error("入住日期不能为空");
            }
            
            // 验证日期格式
            try {
                LocalDate.parse(request.getStayDate(), DateTimeFormatter.ofPattern("yyyy-MM-dd"));
            } catch (Exception e) {
                return BaseResponse.error("入住日期格式错误，请使用yyyy-MM-dd格式");
            }
            
            // 验证isAvailable参数（如果提供）
            if (StringUtils.hasText(request.getIsAvailable())) {
                String isAvailable = request.getIsAvailable();
                if (!"O".equals(isAvailable) && !"C".equals(isAvailable)) {
                    return BaseResponse.error("isAvailable参数值错误，只能为O(可用)或C(不可用)");
                }
            }
            
            // 1. 查询酒店信息获取chainId
            Hotel hotel = hotelMapper.selectByPrimaryKey(request.getHotelId());
            if (hotel == null) {
                return BaseResponse.error("酒店不存在");
            }
            
            // 2. 查询 hotel_inventory_status 表，条件为hotel_id，stay_date
            HotelInventoryStatus existingStatus = hotelInventoryStatusMapper.selectByHotelIdAndStayDate(
                request.getHotelId(), 
                request.getStayDate()
            );
            
            if (existingStatus != null) {
                // 3. 查询结果如果存在记录，则修改 is_available 和 updated_at（当前时间）
                String newIsAvailable = request.getIsAvailable();
                if (StringUtils.hasText(newIsAvailable)) {
                    // 更新现有记录
                    existingStatus.setIsAvailable(newIsAvailable);
                    // 注意：HotelInventoryStatus实体中没有updated_at字段，如果需要可以添加
                    int updateResult = hotelInventoryStatusMapper.updateCalendarHotelStatusByStayDate(
                        existingStatus.getHotelId(),
                        existingStatus.getStayDate().toString(),
                        newIsAvailable
                    );
                    
                    if (updateResult > 0) {
                        BaseResponse response = new BaseResponse<>(true, "酒店库存状态更新成功", existingStatus);
                        log.debug("酒店库存状态更新成功，hotelId: {}, stayDate: {}, isAvailable: {}", 
                            existingStatus.getHotelId(), existingStatus.getStayDate(), existingStatus.getIsAvailable());
                        return response;
                    } else {
                        return BaseResponse.error("酒店库存状态更新失败");
                    }
                } else {
                    // 如果没有提供isAvailable参数，直接返回现有记录
                    BaseResponse response = new BaseResponse<>(true, "查询成功", existingStatus);
                    log.debug("查询现有酒店库存状态成功，hotelId: {}, stayDate: {}, isAvailable: {}", 
                        existingStatus.getHotelId(), existingStatus.getStayDate(), existingStatus.getIsAvailable());
                    return response;
                }
            } else {
                // 4. 查询结果如果不存在记录，则新增一条 hotel_inventory_status 记录
                HotelInventoryStatus newStatus = new HotelInventoryStatus();
                newStatus.setHotelStatusId(IdGenerator.generate64BitId());
                newStatus.setChainId(hotel.getChainId());
                newStatus.setHotelId(request.getHotelId());
                newStatus.setHotelCode(hotel.getHotelCode());
                newStatus.setStayDate(LocalDate.parse(request.getStayDate(), DateTimeFormatter.ofPattern("yyyy-MM-dd")));
                
                // 设置isAvailable，如果请求中没有提供则默认为"O"
                String isAvailable = StringUtils.hasText(request.getIsAvailable()) ? 
                    request.getIsAvailable() : "O";
                newStatus.setIsAvailable(isAvailable);
                
                // 设置默认库存值
                newStatus.setRemainingInventory(10);
                newStatus.setSoldInventory(0);
                newStatus.setPhysicalInventory(10);
                
                int insertResult = hotelInventoryStatusMapper.insert(newStatus);
                
                if (insertResult > 0) {
                    BaseResponse response = new BaseResponse<>(true, "酒店库存状态新增成功", newStatus);
                    log.debug("酒店库存状态新增成功，hotelId: {}, stayDate: {}, isAvailable: {}", 
                        newStatus.getHotelId(), newStatus.getStayDate(), newStatus.getIsAvailable());
                    return response;
                } else {
                    return BaseResponse.error("酒店库存状态新增失败");
                }
            }
            
        } catch (Exception e) {
            log.error("根据酒店ID和入住日期设置酒店库存状态异常", e);
            return BaseResponse.error("设置酒店库存状态异常: " + e.getMessage());
        }
    }
    
    /**
     * 日历中,房型一行的每天的格子,开关
     * 根据酒店ID、房型代码和入住日期设置房型库存状态
     * @param request 请求参数
     * @return 响应结果
     */
    @Override
    public BaseResponse setDailyRoomTypeStatus(RatePriceByRoomTypeRequest request) {
        log.debug("根据酒店ID、房型代码和入住日期设置房型库存状态请求: {}", gson.toJson(request));
        
        try {
            // 参数验证
            if (request == null) {
                return BaseResponse.error("请求参数不能为空");
            }
            
            if (!StringUtils.hasText(request.getHotelId())) {
                return BaseResponse.error("酒店ID不能为空");
            }
            
            if (!StringUtils.hasText(request.getRoomTypeCode())) {
                return BaseResponse.error("房型代码不能为空");
            }
            
            if (!StringUtils.hasText(request.getStayDate())) {
                return BaseResponse.error("入住日期不能为空");
            }
            
            // 验证日期格式
            try {
                LocalDate.parse(request.getStayDate(), DateTimeFormatter.ofPattern("yyyy-MM-dd"));
            } catch (Exception e) {
                return BaseResponse.error("入住日期格式错误，请使用yyyy-MM-dd格式");
            }
            
            // 验证isAvailable参数（如果提供）
            if (StringUtils.hasText(request.getIsAvailable())) {
                String isAvailable = request.getIsAvailable();
                if (!"O".equals(isAvailable) && !"C".equals(isAvailable)) {
                    return BaseResponse.error("isAvailable参数值错误，只能为O(可用)或C(不可用)");
                }
            }
            
            // 1. 查询酒店信息获取chainId
            Hotel hotel = hotelMapper.selectByPrimaryKey(request.getHotelId());
            if (hotel == null) {
                return BaseResponse.error("酒店不存在");
            }
            // 查询房型信息获取 hotelId 和  roomTypeCode
            RoomType roomType = roomTypeMapper.selectCalendarByHotelIdAndRoomTypeCode(request.getHotelId(),request.getRoomTypeCode());
            if (roomType == null) {
                return BaseResponse.error("房型不存在");
            }
            

            
            // 2. 查询 roomtype_inventory_status 表，条件为hotel_id，room_type_code，stay_date
            RoomTypeStatus existingStatus = roomTypeStatusMapper.selectByHotelIdAndRoomTypeAndStayDate(
                request.getHotelId(), 
                request.getRoomTypeCode(),
                request.getStayDate()
            );
            
            if (existingStatus != null) {
                // 3. 查询结果如果存在记录，则修改 is_available 和 updated_at（当前时间）
                String newIsAvailable = request.getIsAvailable();
                if (StringUtils.hasText(newIsAvailable)) {
                    // 更新现有记录
                    int updateResult = roomTypeStatusMapper.updateByHotelIdAndRoomTypeAndStayDate(
                        request.getHotelId(),
                        request.getRoomTypeCode(),
                        request.getStayDate(),
                        newIsAvailable
                    );
                    
                    if (updateResult > 0) {
                        // 重新查询更新后的记录
                        RoomTypeStatus updatedStatus = roomTypeStatusMapper.selectByHotelIdAndRoomTypeAndStayDate(
                            request.getHotelId(), 
                            request.getRoomTypeCode(),
                            request.getStayDate()
                        );
                        BaseResponse response = new BaseResponse<>(true, "房型库存状态更新成功", updatedStatus);
                        log.debug("房型库存状态更新成功，hotelId: {}, roomTypeCode: {}, stayDate: {}, isAvailable: {}", 
                            request.getHotelId(), request.getRoomTypeCode(), request.getStayDate(), newIsAvailable);
                        return response;
                    } else {
                        return BaseResponse.error("房型库存状态更新失败");
                    }
                } else {
                    // 如果没有提供isAvailable参数，直接返回现有记录
                    BaseResponse response = new BaseResponse<>(true, "查询成功", existingStatus);
                    log.debug("查询现有房型库存状态成功，hotelId: {}, roomTypeCode: {}, stayDate: {}, isAvailable: {}", 
                        request.getHotelId(), request.getRoomTypeCode(), request.getStayDate(), existingStatus.getIsAvailable());
                    return response;
                }
            } else {
                // 4. 查询结果如果不存在记录，则新增一条 roomtype_inventory_status 记录
                RoomTypeStatus newStatus = new RoomTypeStatus();
                newStatus.setRoomtypeStatusId(IdGenerator.generate64BitId());
                newStatus.setChainId(hotel.getChainId());
                newStatus.setHotelId(request.getHotelId());
                newStatus.setHotelCode(hotel.getHotelCode());
                newStatus.setRoomTypeId(roomType.getRoomTypeId());
                newStatus.setStayDate(request.getStayDate());
                newStatus.setRoomTypeCode(request.getRoomTypeCode());
                newStatus.setRateCode("*");
                newStatus.setRatePlanId("*");
                newStatus.setRateCodeId("*");
                // 设置isAvailable，如果请求中没有提供则默认为"O"
                String isAvailable = StringUtils.hasText(request.getIsAvailable()) ? 
                    request.getIsAvailable() : "O";
                newStatus.setIsAvailable(isAvailable);
                
                // 设置默认库存值
                newStatus.setRemainingInventory(10);
                newStatus.setSoldInventory(0);
                newStatus.setPhysicalInventory(10);
                
                // 设置时间戳
                String currentTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
                newStatus.setCreatedAt(currentTime);
                newStatus.setUpdatedAt(currentTime);
                
                int insertResult = roomTypeStatusMapper.insert(newStatus);
                
                if (insertResult > 0) {
                    BaseResponse response = new BaseResponse<>(true, "房型库存状态新增成功", newStatus);
                    log.debug("房型库存状态新增成功，hotelId: {}, roomTypeCode: {}, stayDate: {}, isAvailable: {}", 
                        request.getHotelId(), request.getRoomTypeCode(), request.getStayDate(), isAvailable);
                    return response;
                } else {
                    return BaseResponse.error("房型库存状态新增失败");
                }
            }
            
        } catch (Exception e) {
            log.error("根据酒店ID、房型代码和入住日期设置房型库存状态异常", e);
            return BaseResponse.error("设置房型库存状态异常: " + e.getMessage());
        }
    }
    
    @Override
    @Transactional
    public BaseResponse maintainRatePrice(RatePriceMaintenanceRequest request) {
        log.debug("维护房价请求: {}", gson.toJson(request));
        
        try {
            // 参数验证
            if (request == null) {
                return BaseResponse.error("请求参数不能为空");
            }
            
            if (!StringUtils.hasText(request.getChainId())) {
                return BaseResponse.error("连锁ID不能为空");
            }
            
            if (!StringUtils.hasText(request.getHotelId())) {
                return BaseResponse.error("酒店ID不能为空");
            }
            
            if (!StringUtils.hasText(request.getAvailLevel())) {
                return BaseResponse.error("可用性级别不能为空");
            }
            
            if (request.getRoomTypes() == null || request.getRoomTypes().isEmpty()) {
                return BaseResponse.error("房型列表不能为空");
            }
            
            if (!StringUtils.hasText(request.getDateModel())) {
                return BaseResponse.error("日期模型不能为空");
            }
            
            // 根据日期模型类型进行不同的验证
            if ("multiple".equals(request.getDateModel())) {
                // multiple模式：验证dateRanges
                if (request.getDateRanges() == null || request.getDateRanges().isEmpty()) {
                    return BaseResponse.error("日期范围不能为空");
                }
            } else if ("calendar".equals(request.getDateModel())) {
                // calendar模式：验证selectedDates
                if (request.getSelectedDates() == null || request.getSelectedDates().isEmpty()) {
                    return BaseResponse.error("选中日期不能为空");
                }
            } else {
                return BaseResponse.error("日期模型只能是multiple或calendar");
            }
            
            if (!StringUtils.hasText(request.getPriceMode())) {
                return BaseResponse.error("价格模式不能为空");
            }
            
            // 验证价格模式
            if ("separate".equals(request.getPriceMode())) {
                if (request.getSeparatePrice() == null) {
                    return BaseResponse.error("分离价格模式下，分离价格不能为空");
                }
            } else if ("unified".equals(request.getPriceMode())) {
                if (request.getUnifiedPrice() == null) {
                    return BaseResponse.error("统一价格模式下，统一价格不能为空");
                }
            } else {
                return BaseResponse.error("价格模式只能是separate或unified");
            }

            // 获取 applicableWeekdays的值
            String applicableWeekdays = request.getApplicableWeekdays();
            log.debug("applicableWeekdays: {}", applicableWeekdays);
            // 获取selectedDates的值
            List<String> selectedDates = request.getSelectedDates();
            log.debug("selectedDates: {}", selectedDates);
            // 获取dateRanges的值
            List<RatePriceMaintenanceRequest.DateRange> dateRanges = request.getDateRanges();
            // 解析dateModel参数
            String dateModel = request.getDateModel();
            log.debug("dateModel: {}", dateModel);

            // 初始化一个日期的List
            List<String> dateList = new ArrayList<>();
            
            // 根据日期模型类型验证日期格式
            if ("period".equals(dateModel)) {
                // 当dateModel为period时，读取dateRanges
                if (dateRanges != null && !dateRanges.isEmpty()) {
                    log.debug("读取dateRanges，共{}个日期范围", dateRanges.size());
                    
                    // 使用Set来避免重复日期
                    Set<String> uniqueDates = new HashSet<>();
                    
                    for (RatePriceMaintenanceRequest.DateRange dateRange : dateRanges) {
                        log.debug("日期范围: {} 到 {}", dateRange.getStartDate(), dateRange.getEndDate());
                        
                        // 将日期范围转换为具体日期列表
                        List<String> datesInRange = generateDateList(dateRange.getStartDate(), dateRange.getEndDate());
                        
                        // 添加到唯一日期集合中
                        uniqueDates.addAll(datesInRange);
                    }
                    
                    // 将唯一日期转换为有序列表
                    dateList = new ArrayList<>(uniqueDates);
                    dateList.sort(String::compareTo); // 按日期排序
                    
                    log.debug("处理后的唯一日期数量: {}", dateList.size());
                    
                    
                } else {
                    log.warn("dateRanges为空");
                }
            } else if ("calendar".equals(dateModel)) {
                // 当dateModel为calendar时，读取selectedDates
                if (selectedDates != null && !selectedDates.isEmpty()) {
                    log.debug("读取selectedDates，共{}个选中日期", selectedDates.size());
                    dateList = new ArrayList<>(selectedDates);
                    dateList.sort(String::compareTo); // 按日期排序
                    
                } else {
                    log.warn("selectedDates为空");
                }
            } else if ("multiple".equals(dateModel)) {
                // 当dateModel为multiple时，同时读取dateRanges和selectedDates
                log.debug("multiple模式，同时处理dateRanges和selectedDates");
                
                // 使用Set来避免重复日期
                Set<String> uniqueDates = new HashSet<>();
                
                // 处理dateRanges
                if (dateRanges != null && !dateRanges.isEmpty()) {
                    log.debug("处理dateRanges，共{}个日期范围", dateRanges.size());
                    
                    for (RatePriceMaintenanceRequest.DateRange dateRange : dateRanges) {
                        log.debug("日期范围: {} 到 {}", dateRange.getStartDate(), dateRange.getEndDate());
                        
                        // 将日期范围转换为具体日期列表
                        List<String> datesInRange = generateDateList(dateRange.getStartDate(), dateRange.getEndDate());
                        
                        // 添加到唯一日期集合中
                        uniqueDates.addAll(datesInRange);
                    }
                }
                
                // 处理selectedDates
                if (selectedDates != null && !selectedDates.isEmpty()) {
                    log.debug("处理selectedDates，共{}个选中日期", selectedDates.size());
                    uniqueDates.addAll(selectedDates);
                }
                
                // 将唯一日期转换为有序列表
                dateList = new ArrayList<>(uniqueDates);
                dateList.sort(String::compareTo); // 按日期排序
                
                log.debug("multiple模式处理后的唯一日期数量: {}", dateList.size());
                
            } else {
                log.error("不支持的dateModel: {}", dateModel);
                return BaseResponse.error("不支持的dateModel: " + dateModel);
            }
            
            // 查询酒店信息
            Hotel hotel = hotelMapper.selectByPrimaryKey(request.getHotelId());
            if (hotel == null) {
                return BaseResponse.error("酒店不存在");
            }
            // 打印日志
            log.debug("酒店信息: {}", gson.toJson(hotel));

            // 查询房型信息 打印日志
            log.debug("房型信息: {}", gson.toJson(request.getRoomTypes()));

            //打印日志 日期信息
            log.debug("日期信息: {}", gson.toJson(dateList));
            
            // 处理每个房型和房价码组合
            for (RatePriceMaintenanceRequest.RoomTypeInfo roomTypeInfo : request.getRoomTypes()) {
                for (RatePriceMaintenanceRequest.RateCodeInfo rateCodeInfo : roomTypeInfo.getRateCodes()) {
                    // 处理每个选中日期
                    for (String selectedDate : dateList) {
                        // 检查是否已存在房价记录
                        if(isDateInApplicableWeekdays(applicableWeekdays, selectedDate)){
                            // 打印参数
                            log.debug("检查是否已存在房价记录，chainId: {}, hotelId: {}, rateCode: {}, roomTypeCode: {}, stayDate: {}", 
                            request.getChainId(), request.getHotelId(), 
                            rateCodeInfo.getCode(), 
                            roomTypeInfo.getCode(), 
                            selectedDate);

                            RatePrice existingPrice = ratePriceMapper.maintainRatePriceByHotelRoomTypeRateCode(
                                request.getChainId(),
                                request.getHotelId(),
                                rateCodeInfo.getCode(),
                                roomTypeInfo.getCode(),
                                selectedDate
                            );
                            
                            if (existingPrice != null) {
                                // 更新现有记录
                                updateExistingRatePrice(existingPrice, request);
                            } else {
                                // 创建新记录
                                createNewRatePrice(request, roomTypeInfo, rateCodeInfo, selectedDate, hotel);
                            }
                        }
                        
                    }
                }
            }
            
            BaseResponse response = BaseResponse.success("房价维护成功");
            log.debug("维护房价响应: {}", gson.toJson(response));
            return response;
            
        } catch (Exception e) {
            log.error("维护房价异常", e);
            return BaseResponse.error("维护房价异常: " + e.getMessage());
        }
    }
    
    /**
     * 更新现有房价记录
     */
    private void updateExistingRatePrice(RatePrice existingPrice, RatePriceMaintenanceRequest request) {
        if ("separate".equals(request.getPriceMode())) {
            // 分离价格模式
            RatePriceMaintenanceRequest.SeparatePrice separatePrice = request.getSeparatePrice();
            
            // 判断hotelPrice是否为空或小于等于0，如果不满足条件则更新
            if (separatePrice.getHotelPrice() != null && separatePrice.getHotelPrice().compareTo(BigDecimal.ZERO) > 0) {
                existingPrice.setHotelSingleOccupancy(separatePrice.getHotelPrice());
                existingPrice.setHotelDoubleOccupancy(separatePrice.getHotelPrice());
            }
            
            // 判断channelPrice是否为空或小于等于0，如果不满足条件则更新
            if (separatePrice.getChannelPrice() != null && separatePrice.getChannelPrice().compareTo(BigDecimal.ZERO) > 0) {
                existingPrice.setChannelSingleOccupancy(separatePrice.getChannelPrice());
                existingPrice.setChannelDoubleOccupancy(separatePrice.getChannelPrice());
            }
        } else {
            // 统一价格模式
            RatePriceMaintenanceRequest.UnifiedPrice unifiedPrice = request.getUnifiedPrice();
            BigDecimal hotelOffset = unifiedPrice.getHotelOffset();
            BigDecimal channelOffset = unifiedPrice.getChannelOffset();
            String formula = unifiedPrice.getFormula();
            
            // 获取原价格
            BigDecimal originalHotelPrice = existingPrice.getHotelSingleOccupancy();
            BigDecimal originalChannelPrice = existingPrice.getChannelSingleOccupancy();
            
            // 判断原价格是否大于等于0
            if (originalHotelPrice != null && originalHotelPrice.compareTo(BigDecimal.ZERO) >= 0) {
                // 根据公式调整酒店价格
                BigDecimal adjustedHotelPrice = calculateAdjustedPrice(originalHotelPrice, hotelOffset, formula);
                if (adjustedHotelPrice != null && adjustedHotelPrice.compareTo(BigDecimal.ZERO) >= 0) {
                    existingPrice.setHotelSingleOccupancy(adjustedHotelPrice);
                    existingPrice.setHotelDoubleOccupancy(adjustedHotelPrice);
                }
            }
            
            if (originalChannelPrice != null && originalChannelPrice.compareTo(BigDecimal.ZERO) >= 0) {
                // 根据公式调整渠道价格
                BigDecimal adjustedChannelPrice = calculateAdjustedPrice(originalChannelPrice, channelOffset, formula);
                if (adjustedChannelPrice != null && adjustedChannelPrice.compareTo(BigDecimal.ZERO) >= 0) {
                    existingPrice.setChannelSingleOccupancy(adjustedChannelPrice);
                    existingPrice.setChannelDoubleOccupancy(adjustedChannelPrice);
                }
            }
        }
        
        existingPrice.setUpdatedAt(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        ratePriceMapper.update(existingPrice);
    }
    
    /**
     * 创建新的房价记录
     */
    private void createNewRatePrice(RatePriceMaintenanceRequest request, 
                                   RatePriceMaintenanceRequest.RoomTypeInfo roomTypeInfo,
                                   RatePriceMaintenanceRequest.RateCodeInfo rateCodeInfo,
                                   String selectedDate, Hotel hotel) {
        RatePrice newPrice = new RatePrice();
        newPrice.setPriceId(IdGenerator.generate64BitId());
        newPrice.setChainId(request.getChainId());
        newPrice.setHotelId(request.getHotelId());
        newPrice.setHotelCode(hotel.getHotelCode());
        newPrice.setRoomTypeId(roomTypeInfo.getId());
        newPrice.setRoomTypeCode(roomTypeInfo.getCode());
        newPrice.setRateCodeId(rateCodeInfo.getId());
        newPrice.setRateCode(rateCodeInfo.getCode());
        newPrice.setStayDate(selectedDate);
        newPrice.setRatePlanId("*");;
        
        if ("separate".equals(request.getPriceMode())) {
            // 分离价格模式
            RatePriceMaintenanceRequest.SeparatePrice separatePrice = request.getSeparatePrice();
            newPrice.setHotelSingleOccupancy(separatePrice.getHotelPrice());
            newPrice.setHotelDoubleOccupancy(separatePrice.getHotelPrice());
            newPrice.setChannelSingleOccupancy(separatePrice.getChannelPrice());
            newPrice.setChannelDoubleOccupancy(separatePrice.getChannelPrice());
        } else if ("unified".equals(request.getPriceMode())) {
            // 统一价格模式 - 设置默认价格
            RatePriceMaintenanceRequest.UnifiedPrice unifiedPrice = request.getUnifiedPrice();
            newPrice.setHotelSingleOccupancy(unifiedPrice.getHotelOffset());
            newPrice.setHotelDoubleOccupancy(unifiedPrice.getHotelOffset());
            newPrice.setChannelSingleOccupancy(unifiedPrice.getChannelOffset());
            newPrice.setChannelDoubleOccupancy(unifiedPrice.getChannelOffset());
        } else {
            log.error("不支持的价格模式: {}", request.getPriceMode());
            return;
        }
        
        newPrice.setAgentSingleOccupancy(new BigDecimal("0"));
        newPrice.setAgentDoubleOccupancy(new BigDecimal("0"));
        newPrice.setCreatedAt(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        newPrice.setUpdatedAt(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        
        ratePriceMapper.insert(newPrice);
    }
    
    /**
     * 根据公式计算调整后的价格
     */
    private BigDecimal calculateAdjustedPrice(BigDecimal originalPrice, BigDecimal adjustmentValue, String formula) {
        if (originalPrice == null) {
            originalPrice = BigDecimal.ZERO;
        }
        
        if (adjustmentValue == null) {
            return originalPrice;
        }
        
        switch (formula.toLowerCase()) {
            case "add":
                return originalPrice.add(adjustmentValue);
            case "subtract":
                return originalPrice.subtract(adjustmentValue);
            case "multiply":
                return originalPrice.multiply(adjustmentValue);
            case "divide":
                if (adjustmentValue.compareTo(BigDecimal.ZERO) == 0) {
                    return originalPrice;
                }
                return originalPrice.divide(adjustmentValue, 2, BigDecimal.ROUND_HALF_UP);
            default:
                return originalPrice;
        }
    }


    /**
     * 生成指定日期范围内的所有日期
     * @param startDate 开始日期 (yyyy-MM-dd格式)
     * @param endDate 结束日期 (yyyy-MM-dd格式)
     * @return 日期列表
     */
    private List<String> generateDateList(String startDate, String endDate) {
        List<String> dateList = new ArrayList<>();
        try {
            LocalDate start = LocalDate.parse(startDate);
            LocalDate end = LocalDate.parse(endDate);
            
            LocalDate current = start;
            while (!current.isAfter(end)) {
                dateList.add(current.format(DateTimeFormatter.ISO_DATE));
                current = current.plusDays(1);
            }
        } catch (Exception e) {
            log.error("生成日期列表失败: startDate={}, endDate={}", startDate, endDate, e);
        }
        return dateList;
    }

     /**
     * 判断指定日期是否在选中的星期范围内
     * @param applicableWeekdays 星期选择字符串，格式为"1111111"，分别表示星期一至星期日，0是未选中，1是选中
     * @param date 日期字符串，格式为yyyy-MM-dd
     * @return 如果日期在选中的星期范围内返回true，否则返回false
     */
    public boolean isDateInApplicableWeekdays(String applicableWeekdays, String date) {
        try {
            // 参数验证
            if (!StringUtils.hasText(applicableWeekdays) || !StringUtils.hasText(date)) {
                log.warn("参数不能为空: applicableWeekdays={}, date={}", applicableWeekdays, date);
                return false;
            }
            
            // 验证applicableWeekdays格式
            if (applicableWeekdays.length() != 7) {
                log.warn("applicableWeekdays格式错误，长度必须为7: {}", applicableWeekdays);
                return false;
            }
            
            // 验证applicableWeekdays只包含0和1
            if (!applicableWeekdays.matches("[01]{7}")) {
                log.warn("applicableWeekdays格式错误，只能包含0和1: {}", applicableWeekdays);
                return false;
            }
            
            // 解析日期
            LocalDate localDate = LocalDate.parse(date);
            
            // 获取星期几（1=星期一，7=星期日）
            int dayOfWeek = localDate.getDayOfWeek().getValue();
            
            // 获取对应位置的字符（注意：数组索引从0开始，所以需要减1）
            char weekDayChar = applicableWeekdays.charAt(dayOfWeek - 1);
            
            // 判断是否选中
            boolean isSelected = weekDayChar == '1';
            
            log.debug("日期: {}, 星期: {}, 选中状态: {}, 结果: {}", 
                        date, dayOfWeek, weekDayChar, isSelected);
            
            return isSelected;
            
        } catch (Exception e) {
            log.error("判断日期是否在选中星期范围内时发生异常: applicableWeekdays={}, date={}", 
                        applicableWeekdays, date, e);
            return false;
        }
    }


    /**
     * 指定一个酒店，酒店下的一个房价码，入离店日期，渠道代码，查询符合条件的房型每日价格
     * @param request 请求参数
     * @return 响应结果
     */
    @Override
    public BaseResponse bookingByHotelRateCodeService(BookingByHotelRateCodeRequest request) {
        log.debug("预订查询请求: {}", gson.toJson(request));
        //校验 request 参数
        if (request == null) {
            return BaseResponse.error("请求参数不能为空");
        }
        if (!StringUtils.hasText(request.getHotelId())) {
            return BaseResponse.error("酒店ID不能为空");
        }   
        if (!StringUtils.hasText(request.getChannelCode())) {
            return BaseResponse.error("渠道代码不能为空");
        }
        if (!StringUtils.hasText(request.getCheckIn())) {
            return BaseResponse.error("开始日期不能为空");
        }
        if (!StringUtils.hasText(request.getCheckOut())) {
            return BaseResponse.error("结束日期不能为空");
        }
        if (!StringUtils.hasText(request.getRateCode())) {
            return BaseResponse.error("房价码不能为空");
        }
        
        try {
            // 根据查询条件联合查询相关数据
            List<Map<String, Object>> bookingData = ratePriceMapper.selectBookingByHotelRateCode(
                request.getHotelId(),
                request.getRateCode(),
                request.getCheckIn(),
                request.getCheckOut()
            );
            
            if (bookingData == null || bookingData.isEmpty()) {
                return BaseResponse.error("未找到符合条件的预订信息");
            }
            
            // 初始化响应对象
            BookingByHotelRateCodeResponse bookingByHotelRateCodeResponse = new BookingByHotelRateCodeResponse();
            
            // 从查询结果中获取基本信息（假设所有记录都是同一个酒店和房价码）
            Map<String, Object> firstRecord = bookingData.get(0);
            bookingByHotelRateCodeResponse.setHotelId((String) firstRecord.get("hotel_id"));
            bookingByHotelRateCodeResponse.setChainId((String) firstRecord.get("chain_id"));
            bookingByHotelRateCodeResponse.setCheckIn(request.getCheckIn());
            bookingByHotelRateCodeResponse.setCheckOut(request.getCheckOut());
            bookingByHotelRateCodeResponse.setChannelCode(request.getChannelCode());
            bookingByHotelRateCodeResponse.setRateCode(request.getRateCode());
            
            // 按房型分组处理数据
            Map<String, List<Map<String, Object>>> roomTypeGroups = new HashMap<>();
            for (Map<String, Object> record : bookingData) {
                String roomTypeCode = (String) record.get("room_type_code");
                if (roomTypeCode != null) {
                    roomTypeGroups.computeIfAbsent(roomTypeCode, k -> new ArrayList<>()).add(record);
                }
            }
            
            // 构建房型列表
            List<BookingRoomType> bookingRoomTypes = new ArrayList<>();
            for (Map.Entry<String, List<Map<String, Object>>> entry : roomTypeGroups.entrySet()) {
                String roomTypeCode = entry.getKey();
                List<Map<String, Object>> roomTypeData = entry.getValue();
                
                // 创建房型对象
                BookingRoomType bookingRoomType = new BookingRoomType();
                
                // 从第一条记录获取房型基本信息
                Map<String, Object> firstRoomTypeRecord = roomTypeData.get(0);
                bookingRoomType.setRoomTypeId((String) firstRoomTypeRecord.get("room_type_id"));
                bookingRoomType.setRoomTypeCode(roomTypeCode);
                bookingRoomType.setRoomTypeName((String) firstRoomTypeRecord.get("room_type_name"));
                bookingRoomType.setDescription((String) firstRoomTypeRecord.get("description"));
                
                // 设置标准价格（取第一条记录的价格作为标准价格）
                Object standardPrice = firstRoomTypeRecord.get("channel_single_occupancy");
                if (standardPrice instanceof BigDecimal) {
                    bookingRoomType.setStandardPrice(((BigDecimal) standardPrice).doubleValue());
                } else if (standardPrice instanceof Double) {
                    bookingRoomType.setStandardPrice((Double) standardPrice);
                }
                
                // 设置最大入住人数和物理库存
                Object maxOccupancy = firstRoomTypeRecord.get("max_occupancy");
                if (maxOccupancy instanceof Integer) {
                    bookingRoomType.setMaxOccupancy((Integer) maxOccupancy);
                }
                
                Object physicalInventory = firstRoomTypeRecord.get("physical_inventory");
                if (physicalInventory instanceof Integer) {
                    bookingRoomType.setPhysicalInventory((Integer) physicalInventory);
                }
                
                // 构建该房型的每日价格列表
                List<BookingDailyRate> bookingDailyRateList = new ArrayList<>();
                for (Map<String, Object> record : roomTypeData) {
                    BookingDailyRate dailyRate = new BookingDailyRate();
                    dailyRate.setStayDate(record.get("stay_date").toString());
                    //为null时，默认值为"O"
                    dailyRate.setIsAvailable(record.get("is_available") == null ? "O" : (String) record.get("is_available"));
                    
                    // 设置剩余库存 为null时，默认值为"10"
                    Object remainingInventory = record.get("remaining_inventory")==null?10:record.get("remaining_inventory");
                    if (remainingInventory instanceof Integer) {
                        dailyRate.setRemainingInventory(remainingInventory == null ? 10 : (Integer) remainingInventory);
                    }
                    
                    // 将 BigDecimal 转换为 Double , 
                    Object channelPrice = record.get("channel_single_occupancy");
                    Object hotelPrice = record.get("hotel_single_occupancy");
                    Object agentPrice = record.get("agent_single_occupancy");
                    
                    //为null时，默认值为 "0"
                    dailyRate.setChannelSingleOccupancy(channelPrice instanceof BigDecimal ? 
                        (channelPrice == null ? 0 : ((BigDecimal) channelPrice).doubleValue()) : 
                        (channelPrice == null ? 0 : (Double) channelPrice));
                    dailyRate.setHotelSingleOccupancy(hotelPrice instanceof BigDecimal ? 
                        (hotelPrice == null ? 0 : ((BigDecimal) hotelPrice).doubleValue()) : 
                        (Double) hotelPrice);
                    dailyRate.setAgentSingleOccupancy(agentPrice instanceof BigDecimal ? 
                        (agentPrice == null ? 0 : ((BigDecimal) agentPrice).doubleValue()) : 
                        (agentPrice == null ? 0 : (Double) agentPrice));
                    
                    bookingDailyRateList.add(dailyRate);
                }
                
                // 将每日价格列表设置到房型对象中
                bookingRoomType.setBookingDailyRate(bookingDailyRateList);
                
                // 将房型对象添加到房型列表中
                bookingRoomTypes.add(bookingRoomType);
            }
            
            // 将房型列表设置到响应对象中
            bookingByHotelRateCodeResponse.setBookingRoomTypes(bookingRoomTypes);

            // 打印响应的json格式字符串
            log.debug("预订查询响应: {}", gson.toJson(bookingByHotelRateCodeResponse));
            
            // 返回响应结果
            return BaseResponse.success(bookingByHotelRateCodeResponse);
            
        } catch (Exception e) {
            log.error("查询预订信息异常", e);
            return BaseResponse.error("查询预订信息异常: " + e.getMessage());
        }
    }


    /**
     * 日历中,房型一行的每天的格子,开关
     * 根据酒店ID、房型代码和入住日期设置房型库存状态
     * @param request 请求参数
     * @return 响应结果
     */
    @Override
    public BaseResponse setDailyRateCodeStatus(RatePriceByRateCodeRequest request) {
        log.debug("根据酒店ID、房型代码、房价码代码和入住日期设置房型库存状态请求: {}", gson.toJson(request));
        
        try {
            // 参数验证
            if (request == null) {
                return BaseResponse.error("请求参数不能为空");
            }
            
            if (!StringUtils.hasText(request.getHotelId())) {
                return BaseResponse.error("酒店ID不能为空");
            }
            
            if (!StringUtils.hasText(request.getRoomTypeCode())) {
                return BaseResponse.error("房型代码不能为空");
            }
            
            if (!StringUtils.hasText(request.getStayDate())) {
                return BaseResponse.error("入住日期不能为空");
            }
            
            // 验证日期格式
            try {
                LocalDate.parse(request.getStayDate(), DateTimeFormatter.ofPattern("yyyy-MM-dd"));
            } catch (Exception e) {
                return BaseResponse.error("入住日期格式错误，请使用yyyy-MM-dd格式");
            }
            
            // 验证isAvailable参数（如果提供）
            if (StringUtils.hasText(request.getIsAvailable())) {
                String isAvailable = request.getIsAvailable();
                if (!"O".equals(isAvailable) && !"C".equals(isAvailable)) {
                    return BaseResponse.error("isAvailable参数值错误，只能为O(可用)或C(不可用)");
                }
            }
            
            // 1. 查询酒店信息获取chainId
            Hotel hotel = hotelMapper.selectByPrimaryKey(request.getHotelId());
            if (hotel == null) {
                return BaseResponse.error("酒店不存在");
            }
            // 查询房型信息获取 hotelId 和  roomTypeCode
            RoomType roomType = roomTypeMapper.selectCalendarByHotelIdAndRoomTypeCode(request.getHotelId(),request.getRoomTypeCode());
            if (roomType == null) {
                return BaseResponse.error("房型不存在");
            }
            // 查询房价码 hotelId 和 rateCode
            List<RateCode> rateCodes = rateCodeMapper.selectCalendarByHotelIdAndRateCode(
                request.getHotelId(),request.getRateCode());
            if (rateCodes == null) {
                return BaseResponse.error("房价码不存在");
            }   
            // 查询rateplans 根据hotelId roomTypeCode rateCode
            List<RatePlan> ratePlans = ratePlanMapper.selectCalendarByHotelIdAndRoomTypeCodeAndRateCode(
                request.getHotelId(),request.getRoomTypeCode(),request.getRateCode());
            if (ratePlans == null) {
                return BaseResponse.error("房价码不存在");
            }
            // 取rateCodes 和 ratePlans 的第一个元素
            RateCode rateCode = rateCodes.get(0);
            RatePlan ratePlan = ratePlans.get(0);
            // 根据hotelId、roomTypeCode、rateCode和stayDate查询rate_inventory_status表
            RateInventoryStatus existingStatus = rateInventoryStatusMapper.selectByHotelIdAndRoomTypeAndRateCodeAndStayDate(
                request.getHotelId(), 
                request.getRoomTypeCode(),
                request.getRateCode(),
                request.getStayDate()
            );
            
            if (existingStatus != null) {
                // 查询结果如果存在记录，则修改 is_available 和 updated_at（当前时间）
                String newIsAvailable = request.getIsAvailable();
                if (StringUtils.hasText(newIsAvailable)) {
                    // 更新现有记录
                    int updateResult = rateInventoryStatusMapper.updateByHotelIdAndRoomTypeAndRateCodeAndStayDate(
                        request.getHotelId(),
                        request.getRoomTypeCode(),
                        request.getRateCode(),
                        request.getStayDate(),
                        newIsAvailable
                    );
                    
                    if (updateResult > 0) {
                        // 重新查询更新后的记录
                        RateInventoryStatus updatedStatus = rateInventoryStatusMapper.selectByHotelIdAndRoomTypeAndRateCodeAndStayDate(
                            request.getHotelId(), 
                            request.getRoomTypeCode(),
                            request.getRateCode(),
                            request.getStayDate()
                        );
                        BaseResponse response = new BaseResponse<>(true, "房价码库存状态更新成功", updatedStatus);
                        log.debug("房价码库存状态更新成功，hotelId: {}, roomTypeCode: {}, rateCode: {}, stayDate: {}, isAvailable: {}", 
                            request.getHotelId(), request.getRoomTypeCode(), request.getRateCode(), request.getStayDate(), newIsAvailable);
                        return response;
                    } else {
                        return BaseResponse.error("房价码库存状态更新失败");
                    }
                } else {
                    // 如果没有提供isAvailable参数，直接返回现有记录
                    BaseResponse response = new BaseResponse<>(true, "查询成功", existingStatus);
                    log.debug("查询现有房价码库存状态成功，hotelId: {}, roomTypeCode: {}, rateCode: {}, stayDate: {}, isAvailable: {}", 
                        request.getHotelId(), request.getRoomTypeCode(), request.getRateCode(), request.getStayDate(), existingStatus.getIsAvailable());
                    return response;
                }
            } else {
                // 查询结果如果不存在记录，则新增一条 rate_inventory_status 记录
                RateInventoryStatus newStatus = new RateInventoryStatus();
                newStatus.setStatusId(IdGenerator.generate64BitId());
                newStatus.setChainId(hotel.getChainId());
                newStatus.setHotelId(request.getHotelId());
                newStatus.setHotelCode(hotel.getHotelCode());
                newStatus.setRoomTypeId(roomType.getRoomTypeId());
                newStatus.setRoomTypeCode(request.getRoomTypeCode());
                newStatus.setRateCodeId(rateCode.getRateCodeId());
                newStatus.setRateCode(request.getRateCode());
                newStatus.setRatePlanId(ratePlan.getRatePlanId());
                newStatus.setStayDate(request.getStayDate());
                
                // 设置isAvailable，如果请求中没有提供则默认为"O"
                String isAvailable = StringUtils.hasText(request.getIsAvailable()) ? 
                    request.getIsAvailable() : "O";
                newStatus.setIsAvailable(isAvailable);
                
                // 设置默认库存值
                newStatus.setRemainingInventory(10);
                newStatus.setSoldInventory(0);
                
                
                // 设置默认的预订限制
                newStatus.setMinStayDays(1);
                newStatus.setMaxStayDays(99);
                newStatus.setMinAdvanceDays(0);
                newStatus.setMaxAdvanceDays(99);
                newStatus.setLatestCancelDays(0);
                newStatus.setLatestCancelTimeSameDay("23:59");
                newStatus.setPaymentType("prepay");
                newStatus.setLatestReservationTimeSameDay("23:59");
                newStatus.setIsCancellable(true);
                newStatus.setCancelPenalty(BigDecimal.ZERO);
                
                // 设置时间戳
                String currentTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
                newStatus.setCreatedAt(currentTime);
                newStatus.setUpdatedAt(currentTime);
                
                int insertResult = rateInventoryStatusMapper.insert(newStatus);
                
                if (insertResult > 0) {
                    BaseResponse response = new BaseResponse<>(true, "房价码库存状态新增成功", newStatus);
                    log.debug("房价码库存状态新增成功，hotelId: {}, roomTypeCode: {}, rateCode: {}, stayDate: {}, isAvailable: {}", 
                        request.getHotelId(), request.getRoomTypeCode(), request.getRateCode(), request.getStayDate(), isAvailable);
                    return response;
                } else {
                    return BaseResponse.error("房价码库存状态新增失败");
                }
            }
            
        } catch (Exception e) {
            log.error("根据酒店ID、房型代码、房价码和入住日期设置房价码库存状态异常", e);
            return BaseResponse.error("设置房价码库存状态异常: " + e.getMessage());
        }
    }
    
} 