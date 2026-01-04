package com.zai.rateinventorystatus.service.impl;

import com.zai.common.BaseResponse;
import com.zai.rateinventorystatus.dto.RateInventoryStatusAddRequest;
import com.zai.rateinventorystatus.dto.RateInventoryStatusListRequest;
import com.zai.rateinventorystatus.dto.RateInventoryStatusUpdateRequest;
import com.zai.rateinventorystatus.dto.AvailInventoryRequest;
import com.zai.rateinventorystatus.entity.RateInventoryStatus;
import com.zai.rateinventorystatus.mapper.RateInventoryStatusMapper;
import com.zai.rateinventorystatus.service.RateInventoryStatusService;
import com.zai.util.IdGenerator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import com.zai.hotelinventory.mapper.HotelInventoryStatusMapper;
import com.zai.hotelinventory.entity.HotelInventoryStatus;
import com.zai.hotel.mapper.HotelMapper;
import com.zai.roomtype.entity.RoomType;
import com.zai.roomtype.mapper.RoomTypeMapper;
import com.zai.roomtypestatus.mapper.RoomTypeStatusMapper;
import com.zai.rateplan.mapper.RatePlanMapper;
import com.zai.ratecode.mapper.RateCodeMapper;
import com.zai.rateplan.entity.RatePlan;
import com.zai.ratecode.entity.RateCode;

import javax.annotation.Resource;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.HashSet;
import java.util.Set;
import java.util.ArrayList;
import java.time.LocalDate;
import com.zai.hotel.entity.Hotel;
import com.zai.roomtypestatus.entity.RoomTypeStatus;
import java.math.BigDecimal;

/**
 * 房价库存状态Service实现类
 */
@Service
public class RateInventoryStatusServiceImpl implements RateInventoryStatusService {
    
    private static final Logger logger = LoggerFactory.getLogger(RateInventoryStatusServiceImpl.class);
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    
    @Resource
    private RateInventoryStatusMapper rateInventoryStatusMapper;
    
    @Resource
    private HotelInventoryStatusMapper hotelInventoryStatusMapper;
    
    @Resource
    private HotelMapper hotelMapper;
    
    @Resource
    private RoomTypeMapper roomTypeMapper;
    
    @Resource
    private RoomTypeStatusMapper roomTypeStatusMapper;
    
    @Resource
    private RatePlanMapper ratePlanMapper;
    
    @Resource
    private RateCodeMapper rateCodeMapper;

    
    @Override
    @Transactional
    public BaseResponse<String> addRateInventoryStatus(RateInventoryStatusAddRequest request) {
        try {
            logger.debug("开始添加房价库存状态记录");
            
            // 参数验证
            BaseResponse<String> validationResult = validateAddRequest(request);
            if (!validationResult.isSuccess()) {
                return validationResult;
            }
            
            // 检查记录是否已存在
            if (isRecordExists(request)) {
                return BaseResponse.error("该房价库存状态记录已存在");
            }
            
            // 创建并保存实体
            RateInventoryStatus entity = createEntityFromRequest(request);
            int result = rateInventoryStatusMapper.insert(entity);
            
            if (result > 0) {
                logger.debug("房价库存状态记录添加成功，ID：{}", entity.getStatusId());
                return BaseResponse.success("房价库存状态记录添加成功");
            } else {
                return BaseResponse.error("房价库存状态记录添加失败");
            }
            
        } catch (Exception e) {
            logger.error("添加房价库存状态记录时发生异常", e);
            return BaseResponse.error("系统异常：" + e.getMessage());
        }
    }
    
    @Override
    @Transactional
    public BaseResponse<String> updateRateInventoryStatus(RateInventoryStatusUpdateRequest request) {
        try {
            logger.debug("开始更新房价库存状态记录");
            
            // 参数验证
            BaseResponse<String> validationResult = validateUpdateRequest(request);
            if (!validationResult.isSuccess()) {
                return validationResult;
            }
            
            // 检查记录是否存在
            if (!isRecordExists(request)) {
                return BaseResponse.error("房价库存状态记录不存在");
            }
            
            // 更新实体
            RateInventoryStatus entity = createEntityFromUpdateRequest(request);
            int result = rateInventoryStatusMapper.updateByPrimaryKey(entity);
            
            if (result > 0) {
                logger.debug("房价库存状态记录更新成功，ID：{}", request.getStatusId());
                return BaseResponse.success("房价库存状态记录更新成功");
            } else {
                return BaseResponse.error("房价库存状态记录更新失败");
            }
            
        } catch (Exception e) {
            logger.error("更新房价库存状态记录时发生异常", e);
            return BaseResponse.error("系统异常：" + e.getMessage());
        }
    }
    
    @Override
    @Transactional
    public BaseResponse<String> deleteRateInventoryStatus(String chainId, String hotelId, 
                                                         String rateCode, String roomTypeCode, String stayDate) {
        try {
            logger.debug("开始删除房价库存状态记录");
            
            // 参数验证
            BaseResponse<String> validationResult = validateDeleteParams(chainId, hotelId, rateCode, roomTypeCode, stayDate);
            if (!validationResult.isSuccess()) {
                return validationResult;
            }
            
            // 删除记录
            int result = rateInventoryStatusMapper.deleteByPrimaryKey(chainId, hotelId, rateCode, roomTypeCode, stayDate);
            
            if (result > 0) {
                logger.debug("房价库存状态记录删除成功");
                return BaseResponse.success("房价库存状态记录删除成功");
            } else {
                return BaseResponse.error("房价库存状态记录不存在");
            }
            
        } catch (Exception e) {
            logger.error("删除房价库存状态记录时发生异常", e);
            return BaseResponse.error("系统异常：" + e.getMessage());
        }
    }
    
    @Override
    public BaseResponse<RateInventoryStatus> getRateInventoryStatus(String chainId, String hotelId, 
                                                                   String rateCode, String roomTypeCode, String stayDate) {
        try {
            logger.debug("开始查询房价库存状态记录");
            
            // 参数验证
            BaseResponse<String> validationResult = validateDeleteParams(chainId, hotelId, rateCode, roomTypeCode, stayDate);
            if (!validationResult.isSuccess()) {
                return BaseResponse.error(validationResult.getMessage());
            }
            
            // 查询记录
            RateInventoryStatus entity = rateInventoryStatusMapper.selectByPrimaryKey(
                chainId, hotelId, rateCode, roomTypeCode, stayDate);
            
            if (entity != null) {
                logger.debug("房价库存状态记录查询成功");
                return BaseResponse.success(entity);
            } else {
                return BaseResponse.error("房价库存状态记录不存在");
            }
            
        } catch (Exception e) {
            logger.error("查询房价库存状态记录时发生异常", e);
            return BaseResponse.error("系统异常：" + e.getMessage());
        }
    }
    
    @Override
    public BaseResponse<Object> getRateInventoryStatusList(RateInventoryStatusListRequest request) {
        try {
            logger.debug("开始分页查询房价库存状态记录列表");
            
            // 参数验证
            BaseResponse<String> validationResult = validateListRequest(request);
            if (!validationResult.isSuccess()) {
                return BaseResponse.error(validationResult.getMessage());
            }
            
            // 执行分页查询
            Map<String, Object> result = executePagedQuery(request);
            
            logger.debug("房价库存状态记录列表查询成功，总记录数：{}", result.get("total"));
            return BaseResponse.success(result);
            
        } catch (Exception e) {
            logger.error("查询房价库存状态记录列表时发生异常", e);
            return BaseResponse.error("系统异常：" + e.getMessage());
        }
    }
    
    @Override
    @Transactional
    public BaseResponse<String> batchAddRateInventoryStatus(List<RateInventoryStatusAddRequest> requestList) {
        try {
            logger.debug("开始批量添加房价库存状态记录，记录数：{}", requestList.size());
            
            if (requestList == null || requestList.isEmpty()) {
                return BaseResponse.error("请求参数不能为空");
            }
            
            // 转换为实体对象列表
            List<RateInventoryStatus> entityList = convertToEntityList(requestList);
            
            // 批量插入
            int result = rateInventoryStatusMapper.batchInsert(entityList);
            
            if (result > 0) {
                logger.debug("批量添加房价库存状态记录成功，插入记录数：{}", result);
                return BaseResponse.success("批量添加房价库存状态记录成功，插入记录数：" + result);
            } else {
                return BaseResponse.error("批量添加房价库存状态记录失败");
            }
            
        } catch (Exception e) {
            logger.error("批量添加房价库存状态记录时发生异常", e);
            return BaseResponse.error("系统异常：" + e.getMessage());
        }
    }
    
    @Override
    @Transactional
    public BaseResponse<String> batchUpdateRateInventoryStatus(List<RateInventoryStatusUpdateRequest> requestList) {
        try {
            logger.debug("开始批量更新房价库存状态记录，记录数：{}", requestList.size());
            
            if (requestList == null || requestList.isEmpty()) {
                return BaseResponse.error("请求参数不能为空");
            }
            
            // 转换为实体对象列表
            List<RateInventoryStatus> entityList = convertToUpdateEntityList(requestList);
            
            // 批量更新
            int result = rateInventoryStatusMapper.batchUpdate(entityList);
            
            if (result > 0) {
                logger.debug("批量更新房价库存状态记录成功，更新记录数：{}", result);
                return BaseResponse.success("批量更新房价库存状态记录成功，更新记录数：" + result);
            } else {
                return BaseResponse.error("批量更新房价库存状态记录失败");
            }
            
        } catch (Exception e) {
            logger.error("批量更新房价库存状态记录时发生异常", e);
            return BaseResponse.error("系统异常：" + e.getMessage());
        }
    }
    
    @Override
    @Transactional
    public BaseResponse<String> deleteRateInventoryStatusByDateRange(String chainId, String hotelId, 
                                                                    String startDate, String endDate) {
        try {
            logger.debug("开始根据日期范围删除房价库存状态记录");
            
            // 参数验证
            BaseResponse<String> validationResult = validateDateRangeParams(chainId, hotelId, startDate, endDate);
            if (!validationResult.isSuccess()) {
                return validationResult;
            }
            
            // 删除记录
            int result = rateInventoryStatusMapper.deleteByDateRange(chainId, hotelId, startDate, endDate);
            
            logger.debug("根据日期范围删除房价库存状态记录成功，删除记录数：{}", result);
            return BaseResponse.success("删除成功，删除记录数：" + result);
            
        } catch (Exception e) {
            logger.error("根据日期范围删除房价库存状态记录时发生异常", e);
            return BaseResponse.error("系统异常：" + e.getMessage());
        }
    }
    
    // 私有辅助方法
    
    private BaseResponse<String> validateAddRequest(RateInventoryStatusAddRequest request) {
        if (request == null) {
            return BaseResponse.error("请求参数不能为空");
        }
        if (!StringUtils.hasText(request.getChainId())) {
            return BaseResponse.error("酒店连锁ID不能为空");
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
        if (!StringUtils.hasText(request.getStayDate())) {
            return BaseResponse.error("入住日期不能为空");
        }
        return BaseResponse.success("验证通过");
    }
    
    private BaseResponse<String> validateUpdateRequest(RateInventoryStatusUpdateRequest request) {
        if (request == null) {
            return BaseResponse.error("请求参数不能为空");
        }
        if (!StringUtils.hasText(request.getStatusId())) {
            return BaseResponse.error("状态记录ID不能为空");
        }
        return BaseResponse.success("验证通过");
    }
    
    private BaseResponse<String> validateDeleteParams(String chainId, String hotelId, String rateCode, 
                                                     String roomTypeCode, String stayDate) {
        if (!StringUtils.hasText(chainId)) {
            return BaseResponse.error("酒店连锁ID不能为空");
        }
        if (!StringUtils.hasText(hotelId)) {
            return BaseResponse.error("酒店ID不能为空");
        }
        if (!StringUtils.hasText(rateCode)) {
            return BaseResponse.error("房价码不能为空");
        }
        if (!StringUtils.hasText(roomTypeCode)) {
            return BaseResponse.error("房型代码不能为空");
        }
        if (!StringUtils.hasText(stayDate)) {
            return BaseResponse.error("入住日期不能为空");
        }
        return BaseResponse.success("验证通过");
    }
    
    private BaseResponse<String> validateListRequest(RateInventoryStatusListRequest request) {
        if (request == null) {
            return BaseResponse.error("请求参数不能为空");
        }
        if (!StringUtils.hasText(request.getChainId())) {
            return BaseResponse.error("酒店连锁ID不能为空");
        }
        if (!StringUtils.hasText(request.getHotelId())) {
            return BaseResponse.error("酒店ID不能为空");
        }
        return BaseResponse.success("验证通过");
    }
    
    private BaseResponse<String> validateDateRangeParams(String chainId, String hotelId, String startDate, String endDate) {
        if (!StringUtils.hasText(chainId)) {
            return BaseResponse.error("酒店连锁ID不能为空");
        }
        if (!StringUtils.hasText(hotelId)) {
            return BaseResponse.error("酒店ID不能为空");
        }
        if (!StringUtils.hasText(startDate)) {
            return BaseResponse.error("开始日期不能为空");
        }
        if (!StringUtils.hasText(endDate)) {
            return BaseResponse.error("结束日期不能为空");
        }
        return BaseResponse.success("验证通过");
    }
    
    private boolean isRecordExists(RateInventoryStatusAddRequest request) {
        RateInventoryStatus existingRecord = rateInventoryStatusMapper.selectByPrimaryKey(
            request.getChainId(), request.getHotelId(), request.getRateCode(), 
            request.getRoomTypeCode(), request.getStayDate());
        return existingRecord != null;
    }
    
    private boolean isRecordExists(RateInventoryStatusUpdateRequest request) {
        RateInventoryStatus existingRecord = rateInventoryStatusMapper.selectByPrimaryKey(
            request.getChainId(), request.getHotelId(), request.getRateCode(), 
            request.getRoomTypeCode(), request.getStayDate());
        return existingRecord != null;
    }
    
    private RateInventoryStatus createEntityFromRequest(RateInventoryStatusAddRequest request) {
        RateInventoryStatus entity = new RateInventoryStatus();
        BeanUtils.copyProperties(request, entity);
        entity.setStatusId(IdGenerator.generate64BitId());
        String currentTime = LocalDateTime.now().format(DATE_FORMATTER);
        entity.setCreatedAt(currentTime);
        entity.setUpdatedAt(currentTime);
        return entity;
    }
    
    private RateInventoryStatus createEntityFromUpdateRequest(RateInventoryStatusUpdateRequest request) {
        RateInventoryStatus entity = new RateInventoryStatus();
        BeanUtils.copyProperties(request, entity);
        String currentTime = LocalDateTime.now().format(DATE_FORMATTER);
        entity.setUpdatedAt(currentTime);
        return entity;
    }
    
    private Map<String, Object> executePagedQuery(RateInventoryStatusListRequest request) {
        int offset = (request.getPageNum() - 1) * request.getPageSize();
        int limit = request.getPageSize();
        
        List<RateInventoryStatus> list = rateInventoryStatusMapper.selectByCondition(
            request.getChainId(), request.getHotelId(), request.getRoomTypeCode(), 
            request.getRateCode(), request.getStartDate(), request.getEndDate(),
            request.getIsAvailable(), request.getPaymentType(), offset, limit);
        
        int total = rateInventoryStatusMapper.countByCondition(
            request.getChainId(), request.getHotelId(), request.getRoomTypeCode(), 
            request.getRateCode(), request.getStartDate(), request.getEndDate(),
            request.getIsAvailable(), request.getPaymentType());
        
        Map<String, Object> result = new HashMap<>();
        result.put("list", list);
        result.put("total", total);
        result.put("pageNum", request.getPageNum());
        result.put("pageSize", request.getPageSize());
        result.put("totalPages", (total + request.getPageSize() - 1) / request.getPageSize());
        
        return result;
    }
    
    private List<RateInventoryStatus> convertToEntityList(List<RateInventoryStatusAddRequest> requestList) {
        return requestList.stream().map(request -> {
            RateInventoryStatus entity = new RateInventoryStatus();
            BeanUtils.copyProperties(request, entity);
            entity.setStatusId(IdGenerator.generate64BitId());
            String currentTime = LocalDateTime.now().format(DATE_FORMATTER);
            entity.setCreatedAt(currentTime);
            entity.setUpdatedAt(currentTime);
            return entity;
        }).toList();
    }
    
    private List<RateInventoryStatus> convertToUpdateEntityList(List<RateInventoryStatusUpdateRequest> requestList) {
        return requestList.stream().map(request -> {
            RateInventoryStatus entity = new RateInventoryStatus();
            BeanUtils.copyProperties(request, entity);
            String currentTime = LocalDateTime.now().format(DATE_FORMATTER);
            entity.setUpdatedAt(currentTime);
            return entity;
        }).toList();
    }
    /**
     * 处理availInventory请求 主入口
     * @param request 请求参数
     * @return 处理结果
     */
    @Override
    public BaseResponse<String> availInventory(AvailInventoryRequest request) {
        // 业务逻辑实现准备
        logger.debug("开始处理availInventory请求");
        //获取 availLevel 
        String availLevel = request.getAvailLevel();
        logger.debug("availLevel: {}", availLevel);
        
        // 根据availLevel决定数据插入到哪个表
        switch (availLevel.toLowerCase()) {
            case "hotel":
                // 数据解析后插入 hotel_inventory_status表
                logger.debug("数据将插入到 hotel_inventory_status表");
                return processHotelLevel(request);
            case "roomtype":
                // 数据解析后插入 roomtype_inventory_status表
                logger.debug("数据将插入到 roomtype_inventory_status表");
                return processRoomTypeLevel(request);
            case "rateplan":
                // 数据解析后插入 rate_inventory_status表
                logger.debug("数据将插入到 rate_inventory_status表");
                return processRatePlanLevel(request);
            default:
                logger.error("不支持的availLevel: {}", availLevel);
                return BaseResponse.error("不支持的availLevel: " + availLevel);
        }
    }
    /**
     * 处理hotel级别的数据插入逻辑
     * @param request 请求参数
     * @return 处理结果
     */
    private BaseResponse<String> processHotelLevel(AvailInventoryRequest request) {
        // 实现hotel级别的数据插入逻辑
        logger.debug("开始处理hotel级别的数据");

        
        // 解析dateModel参数
        String dateModel = request.getDateModel();
        logger.debug("dateModel: {}", dateModel);
        // 获取isAvailable
        String isAvailable = request.getIsAvailable();
        logger.debug("isAvailable: {}", isAvailable);
        // 获取remainingInventory
        Integer remainingInventory = request.getRemainingInventory().getValue();
        logger.debug("remainingInventory: {}", remainingInventory);
        // 获取type
        String type = request.getRemainingInventory().getType();
        logger.debug("type: {}", type);
        // 获取request中变量的值
        String chainId = request.getChainId();
        logger.debug("chainId: {}", chainId);
        String hotelId = request.getHotelId();
        logger.debug("hotelId: {}", hotelId);
        // 通过hotelId查询hotels
        Hotel hotel = hotelMapper.selectByPrimaryKey(hotelId);
        logger.debug("hotel: {}", hotel);
        String hotelCode = hotel.getHotelCode();
        logger.debug("hotelCode: {}", hotelCode);

        
        // 获取 applicableWeekdays的值
        String applicableWeekdays = request.getApplicableWeekdays();
        logger.debug("applicableWeekdays: {}", applicableWeekdays);
        // 获取selectedDates的值
        List<String> selectedDates = request.getSelectedDates();
        logger.debug("selectedDates: {}", selectedDates);
        // 获取dateRanges的值
        List<AvailInventoryRequest.DateRange> dateRanges = request.getDateRanges();
        logger.debug("dateRanges: {}", dateRanges);
        // 获取roomTypes的值
        List<AvailInventoryRequest.RoomType> roomTypes = request.getRoomTypes();
        logger.debug("roomTypes: {}", roomTypes);
        // 获取rateCodes的值 - 注释掉不存在的方法调用
        // List<AvailInventoryRequest.RateCode> rateCodes = request.getRateCodes();
        // logger.debug("rateCodes: {}", rateCodes);


        // 初始化一个日期的List
        List<String> dateList = new ArrayList<>();
        
        
        if ("period".equals(dateModel)) {
            // 当dateModel为period时，读取dateRanges
            if (dateRanges != null && !dateRanges.isEmpty()) {
                logger.debug("读取dateRanges，共{}个日期范围", dateRanges.size());
                
                // 使用Set来避免重复日期
                Set<String> uniqueDates = new HashSet<>();
                
                for (AvailInventoryRequest.DateRange dateRange : dateRanges) {
                    logger.debug("日期范围: {} 到 {}", dateRange.getStartDate(), dateRange.getEndDate());
                    
                    // 将日期范围转换为具体日期列表
                    List<String> datesInRange = generateDateList(dateRange.getStartDate(), dateRange.getEndDate());
                    
                    // 添加到唯一日期集合中
                    uniqueDates.addAll(datesInRange);
                }
                
                // 将唯一日期转换为有序列表
                dateList = new ArrayList<>(uniqueDates);
                dateList.sort(String::compareTo); // 按日期排序
                
                logger.debug("处理后的唯一日期数量: {}", dateList.size());
                
                
            } else {
                logger.warn("dateRanges为空");
            }
        } else if ("calendar".equals(dateModel)) {
            // 当dateModel为calendar时，读取selectedDates
            if (selectedDates != null && !selectedDates.isEmpty()) {
                logger.debug("读取selectedDates，共{}个选中日期", selectedDates.size());
                dateList = new ArrayList<>(selectedDates);
                dateList.sort(String::compareTo); // 按日期排序
                
            } else {
                logger.warn("selectedDates为空");
            }
        } else if ("multiple".equals(dateModel)) {
            // 当dateModel为multiple时，同时读取dateRanges和selectedDates
            logger.debug("multiple模式，同时处理dateRanges和selectedDates");
            
            // 使用Set来避免重复日期
            Set<String> uniqueDates = new HashSet<>();
            
            // 处理dateRanges
            if (dateRanges != null && !dateRanges.isEmpty()) {
                logger.debug("处理dateRanges，共{}个日期范围", dateRanges.size());
                
                for (AvailInventoryRequest.DateRange dateRange : dateRanges) {
                    logger.debug("日期范围: {} 到 {}", dateRange.getStartDate(), dateRange.getEndDate());
                    
                    // 将日期范围转换为具体日期列表
                    List<String> datesInRange = generateDateList(dateRange.getStartDate(), dateRange.getEndDate());
                    
                    // 添加到唯一日期集合中
                    uniqueDates.addAll(datesInRange);
                }
            }
            
            // 处理selectedDates
            if (selectedDates != null && !selectedDates.isEmpty()) {
                logger.debug("处理selectedDates，共{}个选中日期", selectedDates.size());
                uniqueDates.addAll(selectedDates);
            }
            
            // 将唯一日期转换为有序列表
            dateList = new ArrayList<>(uniqueDates);
            dateList.sort(String::compareTo); // 按日期排序
            
            logger.debug("multiple模式处理后的唯一日期数量: {}", dateList.size());
            
        } else {
            logger.error("不支持的dateModel: {}", dateModel);
            return BaseResponse.error("不支持的dateModel: " + dateModel);
        }
        // 处理每个唯一日期
        for (String date : dateList) {
            logger.debug("处理日期: {}", date);
            if(isDateInApplicableWeekdays(applicableWeekdays, date)){
                logger.debug("日期: {} 在选中的星期范围内", date);
            processHotelInventoryStatus(
                        chainId,
                        hotelId,
                        hotelCode,
                date,
                        isAvailable,
                        remainingInventory,
                        type
        );
            }else{
                logger.debug("日期: {} 不在选中的星期范围内", date);
                continue;
            }

        }

        return BaseResponse.success("hotel级别数据处理成功");
    }
    
    /**
     * 处理roomtype级别的数据插入逻辑
     * @param request 请求参数
     * @return 处理结果
     */
    private BaseResponse<String> processRoomTypeLevel(AvailInventoryRequest request) {
        // 实现roomtype级别的数据插入逻辑
        logger.debug("开始处理roomtype级别的数据");

        
        // 解析dateModel参数
        String dateModel = request.getDateModel();
        logger.debug("dateModel: {}", dateModel);
        // 获取isAvailable
        String isAvailable = request.getIsAvailable();
        logger.debug("isAvailable: {}", isAvailable);
        // 获取remainingInventory
        Integer remainingInventory = request.getRemainingInventory().getValue();
        logger.debug("remainingInventory: {}", remainingInventory);
        // 获取type
        String type = request.getRemainingInventory().getType();
        logger.debug("type: {}", type);
        // 获取request中变量的值
        String chainId = request.getChainId();
        logger.debug("chainId: {}", chainId);
        String hotelId = request.getHotelId();
        logger.debug("hotelId: {}", hotelId);
        // 通过hotelId查询hotels
        Hotel hotel = hotelMapper.selectByPrimaryKey(hotelId);
        logger.debug("hotel: {}", hotel);
        String hotelCode = hotel.getHotelCode();
        logger.debug("hotelCode: {}", hotelCode);

        
        // 获取 applicableWeekdays的值
        String applicableWeekdays = request.getApplicableWeekdays();
        logger.debug("applicableWeekdays: {}", applicableWeekdays);
        // 获取selectedDates的值
        List<String> selectedDates = request.getSelectedDates();
        logger.debug("selectedDates: {}", selectedDates);
        // 获取dateRanges的值
        List<AvailInventoryRequest.DateRange> dateRanges = request.getDateRanges();
        logger.debug("dateRanges: {}", dateRanges);
        // 获取roomTypes的值
        List<AvailInventoryRequest.RoomType> roomTypes = request.getRoomTypes();
        logger.debug("roomTypes: {}", roomTypes);
        // 获取rateCodes的值 - 注释掉不存在的方法调用
        // List<AvailInventoryRequest.RateCode> rateCodes = request.getRateCodes();
        // logger.debug("rateCodes: {}", rateCodes);


        // 初始化一个日期的List
        List<String> dateList = new ArrayList<>();
        
        
        if ("period".equals(dateModel)) {
            // 当dateModel为period时，读取dateRanges
            if (dateRanges != null && !dateRanges.isEmpty()) {
                logger.debug("读取dateRanges，共{}个日期范围", dateRanges.size());
                
                // 使用Set来避免重复日期
                Set<String> uniqueDates = new HashSet<>();
                
                for (AvailInventoryRequest.DateRange dateRange : dateRanges) {
                    logger.debug("日期范围: {} 到 {}", dateRange.getStartDate(), dateRange.getEndDate());
                    
                    // 将日期范围转换为具体日期列表
                    List<String> datesInRange = generateDateList(dateRange.getStartDate(), dateRange.getEndDate());
                    
                    // 添加到唯一日期集合中
                    uniqueDates.addAll(datesInRange);
                }
                
                // 将唯一日期转换为有序列表
                dateList = new ArrayList<>(uniqueDates);
                dateList.sort(String::compareTo); // 按日期排序
                
                logger.debug("处理后的唯一日期数量: {}", dateList.size());
                
                
            } else {
                logger.warn("dateRanges为空");
            }
        } else if ("calendar".equals(dateModel)) {
            // 当dateModel为calendar时，读取selectedDates
            if (selectedDates != null && !selectedDates.isEmpty()) {
                logger.debug("读取selectedDates，共{}个选中日期", selectedDates.size());
                dateList = new ArrayList<>(selectedDates);
                dateList.sort(String::compareTo); // 按日期排序
                
            } else {
                logger.warn("selectedDates为空");
            }
        } else if ("multiple".equals(dateModel)) {
            // 当dateModel为multiple时，同时读取dateRanges和selectedDates
            logger.debug("multiple模式，同时处理dateRanges和selectedDates");
            
            // 使用Set来避免重复日期
            Set<String> uniqueDates = new HashSet<>();
            
            // 处理dateRanges
            if (dateRanges != null && !dateRanges.isEmpty()) {
                logger.debug("处理dateRanges，共{}个日期范围", dateRanges.size());
                
                for (AvailInventoryRequest.DateRange dateRange : dateRanges) {
                    logger.debug("日期范围: {} 到 {}", dateRange.getStartDate(), dateRange.getEndDate());
                    
                    // 将日期范围转换为具体日期列表
                    List<String> datesInRange = generateDateList(dateRange.getStartDate(), dateRange.getEndDate());
                    
                    // 添加到唯一日期集合中
                    uniqueDates.addAll(datesInRange);
                }
            }
            
            // 处理selectedDates
            if (selectedDates != null && !selectedDates.isEmpty()) {
                logger.debug("处理selectedDates，共{}个选中日期", selectedDates.size());
                uniqueDates.addAll(selectedDates);
            }
            
            // 将唯一日期转换为有序列表
            dateList = new ArrayList<>(uniqueDates);
            dateList.sort(String::compareTo); // 按日期排序
            
            logger.debug("multiple模式处理后的唯一日期数量: {}", dateList.size());
            
        } else {
            logger.error("不支持的dateModel: {}", dateModel);
            return BaseResponse.error("不支持的dateModel: " + dateModel);
        }
        
        // 处理每个房型和每个唯一日期
        if (roomTypes != null && !roomTypes.isEmpty()) {
            for (AvailInventoryRequest.RoomType roomType : roomTypes) {
                // TODO: 需要确认 RoomType 类的结构
                // String roomTypeCode = roomType.getRoomTypeCode();
                String roomTypeCode = roomType.getCode(); // 临时占位符
                logger.debug("处理房型: {}", roomTypeCode);
                // 通过roomTypeCode和hotelId查询roomType
                RoomType roomTypeObj = roomTypeMapper.selectByChainIdAndHotelIdAndRoomTypeCode(chainId, hotelId, roomTypeCode);
                logger.debug("roomTypeObj: {}", roomTypeObj);
                
                for (String date : dateList) {
                    logger.debug("处理房型: {}, 日期: {}", roomTypeCode, date);
                    if(isDateInApplicableWeekdays(applicableWeekdays, date)){
                        logger.debug("房型: {}, 日期: {} 在选中的星期范围内", roomTypeCode, date);
                        processRoomTypeInventoryStatus(
                                chainId,
                                hotelId,
                                hotelCode,
                                roomTypeCode,
                                roomTypeObj.getRoomTypeId(),
                                date,
                                isAvailable,
                                remainingInventory,
                                type
                        );
                    } else {
                        logger.debug("房型: {}, 日期: {} 不在选中的星期范围内", roomTypeCode, date);
                        continue;
                    }
                }
            }
        } else {
            logger.warn("roomTypes为空");
        }

        return BaseResponse.success("roomtype级别数据处理成功");
    }
    
    private BaseResponse<String> processRatePlanLevel(AvailInventoryRequest request) {
        // 实现rateplan级别的数据插入逻辑
        logger.debug("开始处理rateplan级别的数据");

        
        // 解析dateModel参数
        String dateModel = request.getDateModel();
        logger.debug("dateModel: {}", dateModel);
        // 获取isAvailable
        String isAvailable = request.getIsAvailable();
        logger.debug("isAvailable: {}", isAvailable);
        // 获取remainingInventory
        Integer remainingInventory = request.getRemainingInventory().getValue();
        logger.debug("remainingInventory: {}", remainingInventory);
        // 获取type
        String type = request.getRemainingInventory().getType();
        logger.debug("type: {}", type);
        // 获取request中变量的值
        String chainId = request.getChainId();
        logger.debug("chainId: {}", chainId);
        String hotelId = request.getHotelId();
        logger.debug("hotelId: {}", hotelId);
        // 通过hotelId查询hotels
        Hotel hotel = hotelMapper.selectByPrimaryKey(hotelId);
        logger.debug("hotel: {}", hotel);
        String hotelCode = hotel.getHotelCode();
        logger.debug("hotelCode: {}", hotelCode);

        
        // 获取 applicableWeekdays的值
        String applicableWeekdays = request.getApplicableWeekdays();
        logger.debug("applicableWeekdays: {}", applicableWeekdays);
        // 获取selectedDates的值
        List<String> selectedDates = request.getSelectedDates();
        logger.debug("selectedDates: {}", selectedDates);
        // 获取dateRanges的值
        List<AvailInventoryRequest.DateRange> dateRanges = request.getDateRanges();
        logger.debug("dateRanges: {}", dateRanges);
        // 获取roomTypes的值
        List<AvailInventoryRequest.RoomType> roomTypes = request.getRoomTypes();
        logger.debug("roomTypes: {}", roomTypes);

        // 初始化一个日期的List
        List<String> dateList = new ArrayList<>();
        
        
        if ("period".equals(dateModel)) {
            // 当dateModel为period时，读取dateRanges
            if (dateRanges != null && !dateRanges.isEmpty()) {
                logger.debug("读取dateRanges，共{}个日期范围", dateRanges.size());
                
                // 使用Set来避免重复日期
                Set<String> uniqueDates = new HashSet<>();
                
                for (AvailInventoryRequest.DateRange dateRange : dateRanges) {
                    logger.debug("日期范围: {} 到 {}", dateRange.getStartDate(), dateRange.getEndDate());
                    
                    // 将日期范围转换为具体日期列表
                    List<String> datesInRange = generateDateList(dateRange.getStartDate(), dateRange.getEndDate());
                    
                    // 添加到唯一日期集合中
                    uniqueDates.addAll(datesInRange);
                }
                
                // 将唯一日期转换为有序列表
                dateList = new ArrayList<>(uniqueDates);
                dateList.sort(String::compareTo); // 按日期排序
                
                logger.debug("处理后的唯一日期数量: {}", dateList.size());
                
                
            } else {
                logger.warn("dateRanges为空");
            }
        } else if ("calendar".equals(dateModel)) {
            // 当dateModel为calendar时，读取selectedDates
            if (selectedDates != null && !selectedDates.isEmpty()) {
                logger.debug("读取selectedDates，共{}个选中日期", selectedDates.size());
                dateList = new ArrayList<>(selectedDates);
                dateList.sort(String::compareTo); // 按日期排序
                
            } else {
                logger.warn("selectedDates为空");
            }
        } else if ("multiple".equals(dateModel)) {
            // 当dateModel为multiple时，同时读取dateRanges和selectedDates
            logger.debug("multiple模式，同时处理dateRanges和selectedDates");
            
            // 使用Set来避免重复日期
            Set<String> uniqueDates = new HashSet<>();
            
            // 处理dateRanges
            if (dateRanges != null && !dateRanges.isEmpty()) {
                logger.debug("处理dateRanges，共{}个日期范围", dateRanges.size());
                
                for (AvailInventoryRequest.DateRange dateRange : dateRanges) {
                    logger.debug("日期范围: {} 到 {}", dateRange.getStartDate(), dateRange.getEndDate());
                    
                    // 将日期范围转换为具体日期列表
                    List<String> datesInRange = generateDateList(dateRange.getStartDate(), dateRange.getEndDate());
                    
                    // 添加到唯一日期集合中
                    uniqueDates.addAll(datesInRange);
                }
            }
            
            // 处理selectedDates
            if (selectedDates != null && !selectedDates.isEmpty()) {
                logger.debug("处理selectedDates，共{}个选中日期", selectedDates.size());
                uniqueDates.addAll(selectedDates);
            }
            
            // 将唯一日期转换为有序列表
            dateList = new ArrayList<>(uniqueDates);
            dateList.sort(String::compareTo); // 按日期排序
            
            logger.debug("multiple模式处理后的唯一日期数量: {}", dateList.size());
            
        } else {
            logger.error("不支持的dateModel: {}", dateModel);
            return BaseResponse.error("不支持的dateModel: " + dateModel);
        }
        
        // 处理每个房型和每个房价码的每个唯一日期
        if (roomTypes != null && !roomTypes.isEmpty()) {
            for (AvailInventoryRequest.RoomType roomType : roomTypes) {
                String roomTypeCode = roomType.getCode();
                logger.debug("处理房型: {}", roomTypeCode);
                
                // 通过roomTypeCode和hotelId查询roomType
                RoomType roomTypeObj = roomTypeMapper.selectByChainIdAndHotelIdAndRoomTypeCode(chainId, hotelId, roomTypeCode);
                logger.debug("roomTypeObj: {}", roomTypeObj);
                
                // 获取该房型下的房价码列表
                List<AvailInventoryRequest.RateCode> rateCodes = roomType.getRateCodes();
                if (rateCodes != null && !rateCodes.isEmpty()) {
                    for (AvailInventoryRequest.RateCode rateCode : rateCodes) {
                        String rateCodeCode = rateCode.getCode();
                        logger.debug("处理房价码: {}", rateCodeCode);
                        
                        // 通过rateCodeCode和hotelId查询rateCode
                        List<RateCode> existingRateCodes = rateCodeMapper.selectByChainIdAndHotelIdAndRateCode(
                            chainId, hotelId, rateCodeCode);
                        logger.debug("existingRateCodes: {}", existingRateCodes);
                        RateCode rateCodeObj = existingRateCodes.get(0);
                        logger.debug("rateCodeObj: {}", rateCodeObj);
                        
                        // 查询对应的ratePlan
                        List<RatePlan> ratePlans = ratePlanMapper.selectByHotelAndRateCodeAndRoomType(
                            hotelId, rateCodeObj.getRateCodeId(), roomTypeObj.getRoomTypeId());
                        logger.debug("ratePlans: {}", ratePlans);
                        
                        for (RatePlan ratePlan : ratePlans) {
                            logger.debug("处理ratePlan: {}", ratePlan.getRatePlanId());
                            
                            for (String date : dateList) {
                                logger.debug("处理房型: {}, 房价码: {}, 日期: {}", roomTypeCode, rateCodeCode, date);
                                if(isDateInApplicableWeekdays(applicableWeekdays, date)){
                                    logger.debug("房型: {}, 房价码: {}, 日期: {} 在选中的星期范围内", roomTypeCode, rateCodeCode, date);
                                    processRatePlanInventoryStatus(
                                            chainId,
                                            hotelId,
                                            hotelCode,
                                            roomTypeCode,
                                            roomTypeObj.getRoomTypeId(),
                                            rateCodeCode,
                                            rateCodeObj.getRateCodeId(),
                                            ratePlan.getRatePlanId(),
                                            date,
                                            isAvailable,
                                            remainingInventory,
                                            type
                                    );
                                } else {
                                    logger.debug("房型: {}, 房价码: {}, 日期: {} 不在选中的星期范围内", roomTypeCode, rateCodeCode, date);
                                    continue;
                                }
                            }
                        }
                    }
                } else {
                    logger.warn("房型: {} 下没有房价码", roomTypeCode);
                }
            }
        } else {
            logger.warn("roomTypes为空");
        }

        return BaseResponse.success("rateplan级别数据处理成功");
    }

    /**
     * 处理酒店库存状态
     * @param chainId 酒店连锁ID
     * @param hotelId 酒店ID
     * @param stayDate 入住日期
     * @param isAvailable 是否可用
     * @param remainingInventory 剩余库存
     * @param type 类型
     * @return 处理结果
     */
    public BaseResponse<String> processHotelInventoryStatus(
        String chainId, 
        String hotelId, 
        String hotelCode,
        String stayDate,
        String isAvailable, 
        Integer remainingInventory,
        String type) {
        logger.debug("开始处理酒店库存状态 - chainId: {}, hotelId: {}, stayDate: {}, isAvailable: {}, remainingInventory: {}, type: {}", 
                   chainId, hotelId, stayDate, isAvailable, remainingInventory, type);
        
        try {
            // 先查询是否存在记录
            HotelInventoryStatus existingRecord = hotelInventoryStatusMapper.selectByPrimaryKey(chainId, hotelId, stayDate);
            
            // 处理isAvailable字段
            String finalIsAvailable = null;
            if (!"nochange".equalsIgnoreCase(isAvailable)) {
                finalIsAvailable = determineFinalIsAvailable(isAvailable, existingRecord);
                logger.debug("isAvailable不为nochange，设置值为: {}", finalIsAvailable);
            } else {
                logger.debug("isAvailable为nochange，不修改is_available字段");
            }
            
            // 处理remainingInventory字段
            Integer finalRemainingInventory = null;
            if (!"nochange".equalsIgnoreCase(type)) {
                finalRemainingInventory = determineFinalRemainingInventory(type, remainingInventory, existingRecord);
                logger.debug("type不为nochange，设置remainingInventory值为: {}", finalRemainingInventory);
            } else {
                logger.debug("type为nochange，不修改remaining_inventory字段");
            }
            
            if (existingRecord != null) {
                // 记录存在，执行更新操作
                logger.debug("酒店库存状态记录已存在，执行更新操作");
                
                // 如果字段为null，则不更新该字段
                String updateIsAvailable = finalIsAvailable != null ? finalIsAvailable : existingRecord.getIsAvailable();
                Integer updateRemainingInventory = finalRemainingInventory != null ? finalRemainingInventory : existingRecord.getRemainingInventory();
                
                int updateResult = hotelInventoryStatusMapper.updateByPrimaryKey(
                    chainId, hotelId, stayDate, updateIsAvailable, updateRemainingInventory, 0, 0);
                
                if (updateResult > 0) {
                    logger.debug("酒店库存状态更新成功");
                    return BaseResponse.success("酒店库存状态更新成功");
                } else {
                    logger.error("酒店库存状态更新失败");
                    return BaseResponse.error("酒店库存状态更新失败");
                }
            } else {
                // 记录不存在，执行插入操作
                logger.debug("酒店库存状态记录不存在，执行插入操作");
                
                // 新记录时，如果字段为null，使用默认值
                String insertIsAvailable = finalIsAvailable != null ? finalIsAvailable : "O";
                Integer insertRemainingInventory = finalRemainingInventory != null ? finalRemainingInventory : 0;
                
                int insertResult = hotelInventoryStatusMapper.insertHotelInventoryStatus(
                    IdGenerator.generate64BitId(), chainId, hotelId, hotelCode,
                    stayDate, insertIsAvailable, insertRemainingInventory, 0, 0);
                
                if (insertResult > 0) {
                    logger.debug("酒店库存状态插入成功");
                    return BaseResponse.success("酒店库存状态插入成功");
                } else {
                    logger.error("酒店库存状态插入失败");
                    return BaseResponse.error("酒店库存状态插入失败");
                }
            }
            
        } catch (Exception e) {
            logger.error("处理酒店库存状态时发生异常", e);
            return BaseResponse.error("系统异常：" + e.getMessage());
        }
    }
    
    /**
     * 根据isAvailable的值和现有记录确定最终的isAvailable值
     * @param isAvailable 请求中的isAvailable值
     * @param existingRecord 现有记录
     * @return 最终的isAvailable值
     */
    private String determineFinalIsAvailable(String isAvailable, HotelInventoryStatus existingRecord) {
        if ("onchange".equals(isAvailable) || "nochange".equals(isAvailable)) {
            // 如果是"onchange"或"nochange"，保持原值不变或新插入"O"值
            if (existingRecord != null) {
                // 从现有记录中获取当前的isAvailable值
                String currentValue = existingRecord.getIsAvailable();
                logger.debug("onchange/nochange模式，保持原值: {}", currentValue);
                return currentValue != null ? currentValue : "O";
            } else {
                // 新记录，使用默认值"O"
                logger.debug("onchange/nochange模式，新记录使用默认值O");
                return "O";
            }
        } else if ("O".equals(isAvailable)) {
            // 设置为"O"
            logger.debug("设置isAvailable为O");
            return "O";
        } else if ("C".equals(isAvailable)) {
            // 设置为"C"
            logger.debug("设置isAvailable为C");
            return "C";
        } else {
            // 其他情况，使用默认值"O"
            logger.warn("未知的isAvailable值: {}，使用默认值O", isAvailable);
            return "O";
        }
    }
    
    /**
     * 根据type的值和现有记录确定最终的remainingInventory值
     * @param type 操作类型
     * @param remainingInventory 请求中的remainingInventory值
     * @param existingRecord 现有记录
     * @return 最终的remainingInventory值
     */
    private Integer determineFinalRemainingInventory(String type, 
    Integer remainingInventory, 
    HotelInventoryStatus existingRecord) {
        // 将type转换为小写，实现不区分大小写
        String typeLower = type != null ? type.toLowerCase() : "";
        
        // 获取当前库存值
        Integer currentValue = existingRecord != null ? existingRecord.getRemainingInventory() : 0;
        if (currentValue == null) {
            currentValue = 0;
        }
        
        // 获取请求的库存值
        Integer requestValue = remainingInventory != null ? remainingInventory : 0;
        
        Integer result = 0;
        
        switch (typeLower) {
            case "onchange":
                // onchange模式，返回-1
                result = -1;
                logger.debug("onchange模式，返回-1");
                break;
                
            case "increase":
                // increase模式，返回currentValue + requestValue，最小为0，最大为999
                result = currentValue + requestValue;
                result = Math.max(0, Math.min(999, result));
                logger.debug("increase模式，原值: {} + 增加值: {} = 新值: {}", currentValue, requestValue, result);
                break;
                
            case "decrease":
                // decrease模式，返回currentValue - requestValue，最小为0，最大为999
                result = currentValue - requestValue;
                result = Math.max(0, Math.min(999, result));
                logger.debug("decrease模式，原值: {} - 减少值: {} = 新值: {}", currentValue, requestValue, result);
                break;
                
            case "set":
                // set模式，返回requestValue，最小为0，最大为999
                result = requestValue;
                result = Math.max(0, Math.min(999, result));
                logger.debug("set模式，直接设置新值: {}", result);
                break;
                
            default:
                // 其他情况，返回-1
                logger.warn("未知的type值: {}，返回-1", type);
                result = -1;
                break;
        }
        
        return result;
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
            logger.error("生成日期列表失败: startDate={}, endDate={}", startDate, endDate, e);
        }
        return dateList;
    }
    
    /**
     * 处理房型库存状态
     * @param chainId 酒店连锁ID
     * @param hotelId 酒店ID
     * @param hotelCode 酒店代码
     * @param roomTypeCode 房型代码
     * @param stayDate 入住日期
     * @param isAvailable 是否可用
     * @param remainingInventory 剩余库存
     * @param type 类型
     * @return 处理结果
     */
    public BaseResponse<String> processRoomTypeInventoryStatus(
        String chainId, 
        String hotelId, 
        String hotelCode,
        String roomTypeCode,
        String roomTypeId,
        String stayDate,
        String isAvailable, 
        Integer remainingInventory,
        String type) {
        logger.debug("开始处理房型库存状态 - chainId: {}, hotelId: {}, roomTypeCode: {}, stayDate: {}, isAvailable: {}, remainingInventory: {}, type: {}", 
                   chainId, hotelId, roomTypeCode, stayDate, isAvailable, remainingInventory, type);
        
        try {
            // 先查询是否存在记录
            com.zai.roomtypestatus.entity.RoomTypeStatus existingRecord = 
                roomTypeStatusMapper.roomtypeInventoryStatusByConditions(chainId, hotelId, roomTypeCode, stayDate);
            
            // 处理isAvailable字段
            String finalIsAvailable = null;
            if (!"nochange".equalsIgnoreCase(isAvailable)) {
                finalIsAvailable = determineFinalIsAvailableForRoomType(isAvailable, existingRecord);
                logger.debug("isAvailable不为nochange，设置值为: {}", finalIsAvailable);
            } else {
                logger.debug("isAvailable为nochange，不修改is_available字段");
            }
            
            // 处理remainingInventory字段
            Integer finalRemainingInventory = null;
            if (!"nochange".equalsIgnoreCase(type)) {
                finalRemainingInventory = determineFinalRemainingInventoryForRoomType(type, remainingInventory, existingRecord);
                logger.debug("type不为nochange，设置remainingInventory值为: {}", finalRemainingInventory);
            } else {
                logger.debug("type为nochange，不修改remaining_inventory字段");
            }
            
            if (existingRecord != null) {
                // 记录存在，执行更新操作
                logger.debug("房型库存状态记录已存在，执行更新操作");
                
                // 如果字段为null，则不更新该字段
                String updateIsAvailable = finalIsAvailable != null ? finalIsAvailable : existingRecord.getIsAvailable();
                Integer updateRemainingInventory = finalRemainingInventory != null ? finalRemainingInventory : existingRecord.getRemainingInventory();
                
                // 创建更新对象
                com.zai.roomtypestatus.entity.RoomTypeStatus updateEntity = new com.zai.roomtypestatus.entity.RoomTypeStatus();
                updateEntity.setRoomtypeStatusId(existingRecord.getRoomtypeStatusId());
                updateEntity.setIsAvailable(updateIsAvailable);
                updateEntity.setRemainingInventory(updateRemainingInventory);
                updateEntity.setUpdatedAt(LocalDateTime.now().format(DATE_FORMATTER));
                
                int updateResult = roomTypeStatusMapper.update(updateEntity);
                
                if (updateResult > 0) {
                    logger.debug("房型库存状态更新成功");
                    return BaseResponse.success("房型库存状态更新成功");
                } else {
                    logger.error("房型库存状态更新失败");
                    return BaseResponse.error("房型库存状态更新失败");
                }
            } else {
                // 记录不存在，执行插入操作
                logger.debug("房型库存状态记录不存在，执行插入操作");
                
                // 新记录时，如果字段为null，使用默认值
                String insertIsAvailable = finalIsAvailable != null ? finalIsAvailable : "O";
                Integer insertRemainingInventory = finalRemainingInventory != null ? finalRemainingInventory : 0;
                
                // 创建插入对象
                com.zai.roomtypestatus.entity.RoomTypeStatus insertEntity = new com.zai.roomtypestatus.entity.RoomTypeStatus();
                insertEntity.setRoomtypeStatusId(IdGenerator.generate64BitId());
                insertEntity.setChainId(chainId);
                insertEntity.setHotelId(hotelId);
                insertEntity.setHotelCode(hotelCode);
                insertEntity.setRoomTypeCode(roomTypeCode);
                insertEntity.setStayDate(stayDate);
                insertEntity.setIsAvailable(insertIsAvailable);
                insertEntity.setRemainingInventory(insertRemainingInventory);
                insertEntity.setSoldInventory(0);
                insertEntity.setPhysicalInventory(0);
                insertEntity.setRoomTypeId(roomTypeId);
                insertEntity.setRateCode("*");
                insertEntity.setRateCodeId("*");
                insertEntity.setRatePlanId("*");
                insertEntity.setCreatedAt(LocalDateTime.now().format(DATE_FORMATTER));
                insertEntity.setUpdatedAt(LocalDateTime.now().format(DATE_FORMATTER));
                
                int insertResult = roomTypeStatusMapper.insert(insertEntity);
                
                if (insertResult > 0) {
                    logger.debug("房型库存状态插入成功");
                    return BaseResponse.success("房型库存状态插入成功");
                } else {
                    logger.error("房型库存状态插入失败");
                    return BaseResponse.error("房型库存状态插入失败");
                }
            }
            
        } catch (Exception e) {
            logger.error("处理房型库存状态时发生异常", e);
            return BaseResponse.error("系统异常：" + e.getMessage());
        }
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
                logger.warn("参数不能为空: applicableWeekdays={}, date={}", applicableWeekdays, date);
                return false;
            }
            
            // 验证applicableWeekdays格式
            if (applicableWeekdays.length() != 7) {
                logger.warn("applicableWeekdays格式错误，长度必须为7: {}", applicableWeekdays);
                return false;
            }
            
            // 验证applicableWeekdays只包含0和1
            if (!applicableWeekdays.matches("[01]{7}")) {
                logger.warn("applicableWeekdays格式错误，只能包含0和1: {}", applicableWeekdays);
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
            
            logger.debug("日期: {}, 星期: {}, 选中状态: {}, 结果: {}", 
                        date, dayOfWeek, weekDayChar, isSelected);
            
            return isSelected;
            
        } catch (Exception e) {
            logger.error("判断日期是否在选中星期范围内时发生异常: applicableWeekdays={}, date={}", 
                        applicableWeekdays, date, e);
            return false;
        }
    }
    
    /**
     * 根据isAvailable的值和现有记录确定最终的isAvailable值（房型级别）
     * @param isAvailable 请求中的isAvailable值
     * @param existingRecord 现有记录
     * @return 最终的isAvailable值
     */
    private String determineFinalIsAvailableForRoomType(String isAvailable, com.zai.roomtypestatus.entity.RoomTypeStatus existingRecord) {
        if ("onchange".equals(isAvailable) || "nochange".equals(isAvailable)) {
            // 如果是"onchange"或"nochange"，保持原值不变或新插入"O"值
            if (existingRecord != null) {
                // 从现有记录中获取当前的isAvailable值
                String currentValue = existingRecord.getIsAvailable();
                logger.debug("onchange/nochange模式，保持原值: {}", currentValue);
                return currentValue != null ? currentValue : "O";
            } else {
                // 新记录，使用默认值"O"
                logger.debug("onchange/nochange模式，新记录使用默认值O");
                return "O";
            }
        } else if ("O".equals(isAvailable)) {
            // 设置为"O"
            logger.debug("设置isAvailable为O");
            return "O";
        } else if ("C".equals(isAvailable)) {
            // 设置为"C"
            logger.debug("设置isAvailable为C");
            return "C";
        } else {
            // 其他情况，使用默认值"O"
            logger.warn("未知的isAvailable值: {}，使用默认值O", isAvailable);
            return "O";
        }
    }
    
    /**
     * 根据type的值和现有记录确定最终的remainingInventory值（房型级别）
     * @param type 操作类型
     * @param remainingInventory 请求中的remainingInventory值
     * @param existingRecord 现有记录
     * @return 最终的remainingInventory值
     */
    private Integer determineFinalRemainingInventoryForRoomType(String type, 
    Integer remainingInventory, 
    com.zai.roomtypestatus.entity.RoomTypeStatus existingRecord) {
        // 将type转换为小写，实现不区分大小写
        String typeLower = type != null ? type.toLowerCase() : "";
        
        // 获取当前库存值
        Integer currentValue = existingRecord != null ? existingRecord.getRemainingInventory() : 0;
        if (currentValue == null) {
            currentValue = 0;
        }
        
        // 获取请求的库存值
        Integer requestValue = remainingInventory != null ? remainingInventory : 0;
        
        Integer result = 0;
        
        switch (typeLower) {
            case "onchange":
                // onchange模式，返回-1
                result = -1;
                logger.debug("onchange模式，返回-1");
                break;
                
            case "increase":
                // increase模式，返回currentValue + requestValue，最小为0，最大为999
                result = currentValue + requestValue;
                result = Math.max(0, Math.min(999, result));
                logger.debug("increase模式，原值: {} + 增加值: {} = 新值: {}", currentValue, requestValue, result);
                break;
                
            case "decrease":
                // decrease模式，返回currentValue - requestValue，最小为0，最大为999
                result = currentValue - requestValue;
                result = Math.max(0, Math.min(999, result));
                logger.debug("decrease模式，原值: {} - 减少值: {} = 新值: {}", currentValue, requestValue, result);
                break;
                
            case "set":
                // set模式，返回requestValue，最小为0，最大为999
                result = requestValue;
                result = Math.max(0, Math.min(999, result));
                logger.debug("set模式，直接设置新值: {}", result);
                break;
                
            default:
                // 其他情况，返回-1
                logger.warn("未知的type值: {}，返回-1", type);
                result = -1;
                break;
        }
        
        return result;
    }

    /**
     * 处理房价库存状态
     * @param chainId 酒店连锁ID
     * @param hotelId 酒店ID
     * @param hotelCode 酒店代码
     * @param roomTypeCode 房型代码
     * @param roomTypeId 房型ID
     * @param rateCode 房价码代码
     * @param rateCodeId 房价码ID
     * @param ratePlanId 价格方案ID
     * @param stayDate 入住日期
     * @param isAvailable 是否可用
     * @param remainingInventory 剩余库存
     * @param type 类型
     * @return 处理结果
     */
    public BaseResponse<String> processRatePlanInventoryStatus(
        String chainId, 
        String hotelId, 
        String hotelCode,
        String roomTypeCode,
        String roomTypeId,
        String rateCode,
        String rateCodeId,
        String ratePlanId,
        String stayDate,
        String isAvailable, 
        Integer remainingInventory,
        String type) {
        logger.debug("开始处理房价库存状态 - chainId: {}, hotelId: {}, roomTypeCode: {}, rateCode: {}, stayDate: {}, isAvailable: {}, remainingInventory: {}, type: {}", 
                   chainId, hotelId, roomTypeCode, rateCode, stayDate, isAvailable, remainingInventory, type);
        
        try {
            // 先查询是否存在记录
            RateInventoryStatus existingRecord = rateInventoryStatusMapper.selectByPrimaryKey(
                chainId, hotelId, rateCode, roomTypeCode, stayDate);
            
            // 处理isAvailable字段
            String finalIsAvailable = null;
            if (!"nochange".equalsIgnoreCase(isAvailable)) {
                finalIsAvailable = determineFinalIsAvailableForRatePlan(isAvailable, existingRecord);
                logger.debug("isAvailable不为nochange，设置值为: {}", finalIsAvailable);
            } else {
                logger.debug("isAvailable为nochange，不修改is_available字段");
            }
            
            // 处理remainingInventory字段
            Integer finalRemainingInventory = null;
            if (!"nochange".equalsIgnoreCase(type)) {
                finalRemainingInventory = determineFinalRemainingInventoryForRatePlan(type, remainingInventory, existingRecord);
                logger.debug("type不为nochange，设置remainingInventory值为: {}", finalRemainingInventory);
            } else {
                logger.debug("type为nochange，不修改remaining_inventory字段");
            }
            
            if (existingRecord != null) {
                // 记录存在，执行更新操作
                logger.debug("房价库存状态记录已存在，执行更新操作");
                
                // 如果字段为null，则不更新该字段
                String updateIsAvailable = finalIsAvailable != null ? finalIsAvailable : existingRecord.getIsAvailable();
                Integer updateRemainingInventory = finalRemainingInventory != null ? finalRemainingInventory : existingRecord.getRemainingInventory();
                
                // 创建更新对象
                
                existingRecord.setIsAvailable(updateIsAvailable);
                existingRecord.setRemainingInventory(updateRemainingInventory);
                existingRecord.setUpdatedAt(LocalDateTime.now().format(DATE_FORMATTER));
                
                int updateResult = rateInventoryStatusMapper.updateInventoryStatusByHotelRoomTypeRateCode(
                    existingRecord.getChainId(),
                    existingRecord.getHotelId(),
                    existingRecord.getRoomTypeCode(),
                    existingRecord.getRateCode(),
                    existingRecord.getStayDate().toString(),
                    updateIsAvailable,
                    updateRemainingInventory,
                    LocalDateTime.now().format(DATE_FORMATTER)
                );
                
                if (updateResult > 0) {
                    logger.debug("房价库存状态更新成功");
                    return BaseResponse.success("房价库存状态更新成功");
                } else {
                    logger.error("房价库存状态更新失败");
                    return BaseResponse.error("房价库存状态更新失败");
                }
            } else {
                // 记录不存在，执行插入操作
                logger.debug("房价库存状态记录不存在，执行插入操作");
                
                // 新记录时，如果字段为null，使用默认值
                String insertIsAvailable = finalIsAvailable != null ? finalIsAvailable : "O";
                Integer insertRemainingInventory = finalRemainingInventory != null ? finalRemainingInventory : 0;
                
                // 创建插入对象
                RateInventoryStatus insertEntity = new RateInventoryStatus();
                insertEntity.setStatusId(IdGenerator.generate64BitId());
                insertEntity.setChainId(chainId);
                insertEntity.setHotelId(hotelId);
                insertEntity.setHotelCode(hotelCode);
                insertEntity.setRatePlanId(ratePlanId);
                insertEntity.setRoomTypeId(roomTypeId);
                insertEntity.setRoomTypeCode(roomTypeCode);
                insertEntity.setRateCodeId(rateCodeId);
                insertEntity.setRateCode(rateCode);
                insertEntity.setStayDate(stayDate);
                insertEntity.setIsAvailable(insertIsAvailable);
                insertEntity.setRemainingInventory(insertRemainingInventory);
                insertEntity.setSoldInventory(0);
                insertEntity.setMinStayDays(0);
                insertEntity.setMaxStayDays(999);
                insertEntity.setMinAdvanceDays(0);
                insertEntity.setMaxAdvanceDays(999);
                insertEntity.setLatestCancelDays(0);
                insertEntity.setLatestCancelTimeSameDay("18:00");
                insertEntity.setPaymentType("prepay");
                insertEntity.setLatestReservationTimeSameDay("18:00");
                insertEntity.setIsCancellable(true);
                insertEntity.setCancelPenalty(BigDecimal.ZERO);
                insertEntity.setCreatedAt(LocalDateTime.now().format(DATE_FORMATTER));
                insertEntity.setUpdatedAt(LocalDateTime.now().format(DATE_FORMATTER));
                
                int insertResult = rateInventoryStatusMapper.insert(insertEntity);
                
                if (insertResult > 0) {
                    logger.debug("房价库存状态插入成功");
                    return BaseResponse.success("房价库存状态插入成功");
                } else {
                    logger.error("房价库存状态插入失败");
                    return BaseResponse.error("房价库存状态插入失败");
                }
            }
            
        } catch (Exception e) {
            logger.error("处理房价库存状态时发生异常", e);
            return BaseResponse.error("系统异常：" + e.getMessage());
        }
    }
    
    /**
     * 根据isAvailable的值和现有记录确定最终的isAvailable值（房价级别）
     * @param isAvailable 请求中的isAvailable值
     * @param existingRecord 现有记录
     * @return 最终的isAvailable值
     */
    private String determineFinalIsAvailableForRatePlan(String isAvailable, RateInventoryStatus existingRecord) {
        if ("onchange".equals(isAvailable) || "nochange".equals(isAvailable)) {
            // 如果是"onchange"或"nochange"，保持原值不变或新插入"O"值
            if (existingRecord != null) {
                // 从现有记录中获取当前的isAvailable值
                String currentValue = existingRecord.getIsAvailable();
                logger.debug("onchange/nochange模式，保持原值: {}", currentValue);
                return currentValue != null ? currentValue : "O";
            } else {
                // 新记录，使用默认值"O"
                logger.debug("onchange/nochange模式，新记录使用默认值O");
                return "O";
            }
        } else if ("O".equals(isAvailable)) {
            // 设置为"O"
            logger.debug("设置isAvailable为O");
            return "O";
        } else if ("C".equals(isAvailable)) {
            // 设置为"C"
            logger.debug("设置isAvailable为C");
            return "C";
        } else {
            // 其他情况，使用默认值"O"
            logger.warn("未知的isAvailable值: {}，使用默认值O", isAvailable);
            return "O";
        }
    }
    
    /**
     * 根据type的值和现有记录确定最终的remainingInventory值（房价级别）
     * @param type 操作类型
     * @param remainingInventory 请求中的remainingInventory值
     * @param existingRecord 现有记录
     * @return 最终的remainingInventory值
     */
    private Integer determineFinalRemainingInventoryForRatePlan(String type, 
    Integer remainingInventory, 
    RateInventoryStatus existingRecord) {
        // 将type转换为小写，实现不区分大小写
        String typeLower = type != null ? type.toLowerCase() : "";
        
        // 获取当前库存值
        Integer currentValue = existingRecord != null ? existingRecord.getRemainingInventory() : 0;
        if (currentValue == null) {
            currentValue = 0;
        }
        
        // 获取请求的库存值
        Integer requestValue = remainingInventory != null ? remainingInventory : 0;
        
        Integer result = 0;
        
        switch (typeLower) {
            case "onchange":
                // onchange模式，返回-1
                result = -1;
                logger.debug("onchange模式，返回-1");
                break;
                
            case "increase":
                // increase模式，返回currentValue + requestValue，最小为0，最大为999
                result = currentValue + requestValue;
                result = Math.max(0, Math.min(999, result));
                logger.debug("increase模式，原值: {} + 增加值: {} = 新值: {}", currentValue, requestValue, result);
                break;
                
            case "decrease":
                // decrease模式，返回currentValue - requestValue，最小为0，最大为999
                result = currentValue - requestValue;
                result = Math.max(0, Math.min(999, result));
                logger.debug("decrease模式，原值: {} - 减少值: {} = 新值: {}", currentValue, requestValue, result);
                break;
                
            case "set":
                // set模式，返回requestValue，最小为0，最大为999
                result = requestValue;
                result = Math.max(0, Math.min(999, result));
                logger.debug("set模式，直接设置新值: {}", result);
                break;
                
            default:
                // 其他情况，返回-1
                logger.warn("未知的type值: {}，返回-1", type);
                result = -1;
                break;
        }
        
        return result;
    }
} 