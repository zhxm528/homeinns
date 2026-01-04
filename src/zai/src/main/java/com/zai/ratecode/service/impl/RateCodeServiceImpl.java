package com.zai.ratecode.service.impl;

import com.zai.ratecode.entity.RateCode;
import com.zai.ratecode.mapper.RateCodeMapper;
import com.zai.ratecode.service.RateCodeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.zai.ratecode.dto.RateCodeAddRequest;
import com.zai.ratecode.dto.RateCodeUpdateRequest;
import com.zai.ratecode.dto.PriceSettingsSaveRequest;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter; 
import com.zai.roomtype.entity.RoomType;
import com.zai.roomtype.mapper.RoomTypeMapper;

@Service
public class RateCodeServiceImpl implements RateCodeService {
    private static final Logger logger = LoggerFactory.getLogger(RateCodeServiceImpl.class);
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    @Autowired
    private RateCodeMapper rateCodeMapper;
    @Autowired
    private RoomTypeMapper roomTypeMapper;
    @Override
    public List<RateCode> selectByCondition(String hotelId, String chainId, String rateCode, String rateCodeName) {
        return rateCodeMapper.selectByCondition(hotelId, chainId, rateCode, rateCodeName);
    }

    @Override
    public List<RateCode> selectByConditionWithPaging(String hotelId, String chainId, String rateCode, String rateCodeName, 
                                                      int page, int size, int offset) {
        logger.debug("分页查询价格代码: hotelId={}, chainId={}, rateCode={}, rateCodeName={}, page={}, size={}, offset={}", 
                    hotelId, chainId, rateCode, rateCodeName, page, size, offset);
        return rateCodeMapper.selectByConditionWithPaging(hotelId, chainId, rateCode, rateCodeName, page, size, offset);
    }

    @Override
    public int countByCondition(String hotelId, String chainId, String rateCode, String rateCodeName) {
        logger.debug("统计价格代码总数: hotelId={}, chainId={}, rateCode={}, rateCodeName={}", 
                    hotelId, chainId, rateCode, rateCodeName);
        return rateCodeMapper.countByCondition(hotelId, chainId, rateCode, rateCodeName);
    }

    

    @Override
    public int insert(RateCodeAddRequest request) {
        // 转换为实体对象
        RateCode rateCode = new RateCode();
        rateCode.setChainId(request.getChain_id());
        rateCode.setHotelId(request.getHotel_id());
        rateCode.setRateCode(request.getRate_code());
        rateCode.setRateCodeName(request.getRate_code_name());
        rateCode.setDescription(request.getDescription());
        rateCode.setMarketCode(request.getMarket_code());
        rateCode.setChannelId(request.getChannel_id());
        rateCode.setMinlos(request.getMinlos());
        rateCode.setMaxlos(request.getMaxlos());
        rateCode.setMinadv(request.getMinadv());
        rateCode.setMaxadv(request.getMaxadv());
        
        // 转换日期格式
        rateCode.setValidFrom(convertToDateFormat(request.getValid_from()));
        rateCode.setValidTo(convertToDateFormat(request.getValid_to()));
        rateCode.setStayStartDate(convertToDateFormat(request.getStay_start_date()));
        rateCode.setStayEndDate(convertToDateFormat(request.getStay_end_date()));
        rateCode.setBookingStartDate(convertToDateFormat(request.getBooking_start_date()));
        rateCode.setBookingEndDate(convertToDateFormat(request.getBooking_end_date()));
        
        rateCode.setLimitStartTime(request.getLimit_start_time());
        rateCode.setLimitEndTime(request.getLimit_end_time());
        rateCode.setLimitAvailWeeks(request.getLimitAvailWeeks());
        rateCode.setPriceModifier(request.getPrice_modifier());
        rateCode.setIsPercentage(request.getIs_percentage());
        rateCode.setReservationType(request.getReservation_type());
        rateCode.setCancellationType(request.getCancellation_type());
        rateCode.setLatestCancellationDays(request.getLatest_cancellation_days());
        rateCode.setLatestCancellationTime(request.getLatest_cancellation_time());
        rateCode.setCancellableAfterBooking(request.getCancellable_after_booking());
        rateCode.setOrderRetentionTime(request.getOrder_retention_time());
        rateCode.setPriceRuleType(request.getPrice_rule_type());
        rateCode.setParentRateCodeId(request.getParent_rate_code_id());
        
        // 生成rateCodeId
        String rateCodeId = java.util.UUID.randomUUID().toString().replace("-", "");
        rateCode.setRateCodeId(rateCodeId);
        
        int result = insert(rateCode);
        return result;
    }

    @Override
    public int insert(RateCode rateCode) {
        // 检查同一个 chainId+hotelId 下 rateCode 是否重复（不区分大小写）
        List<RateCode> existingRateCodes = rateCodeMapper.selectByChainIdAndHotelIdAndRateCode(
            rateCode.getChainId(), 
            rateCode.getHotelId(), 
            rateCode.getRateCode()
        );
        
        if (existingRateCodes != null && !existingRateCodes.isEmpty()) {
            logger.warn("价格代码已存在: chainId={}, hotelId={}, rateCode={}, 找到 {} 条重复记录", 
                       rateCode.getChainId(), rateCode.getHotelId(), rateCode.getRateCode(), existingRateCodes.size());
            throw new RuntimeException("房价码"+rateCode.getRateCode()+"已存在");
        }
         
        int result = rateCodeMapper.insert(rateCode);
        return result;
    }

    @Override
    public int update(RateCodeUpdateRequest request) {
        // 根据rateCodeId查询价格代码
        RateCode rateCode = rateCodeMapper.selectByRateCodeId(request.getRate_code_id());
        if (rateCode == null) {
            throw new RuntimeException("价格代码不存在");
        }
        rateCode.setRateCodeName(request.getRate_code_name());
        rateCode.setDescription(request.getDescription());
        rateCode.setMarketCode(request.getMarket_code());
        rateCode.setChannelId(request.getChannel_id());
        rateCode.setMinlos(request.getMinlos());
        rateCode.setMaxlos(request.getMaxlos());
        rateCode.setMinadv(request.getMinadv());
        rateCode.setMaxadv(request.getMaxadv());
        rateCode.setValidFrom(convertToDateFormat(request.getValid_from()));
        rateCode.setValidTo(convertToDateFormat(request.getValid_to()));
        rateCode.setStayStartDate(convertToDateFormat(request.getStay_start_date()));
        rateCode.setStayEndDate(convertToDateFormat(request.getStay_end_date()));
        rateCode.setBookingStartDate(convertToDateFormat(request.getBooking_start_date()));
        rateCode.setBookingEndDate(convertToDateFormat(request.getBooking_end_date()));
        rateCode.setLimitStartTime(request.getLimit_start_time());
        rateCode.setLimitEndTime(request.getLimit_end_time());
        rateCode.setLimitAvailWeeks(request.getLimitAvailWeeks());
        rateCode.setReservationType(request.getReservation_type());
        rateCode.setCancellationType(request.getCancellation_type());
        rateCode.setLatestCancellationDays(request.getLatest_cancellation_days());
        rateCode.setLatestCancellationTime(request.getLatest_cancellation_time());
        rateCode.setCancellableAfterBooking(request.getCancellable_after_booking());
        rateCode.setOrderRetentionTime(request.getOrder_retention_time());
        
        int result = rateCodeMapper.update(rateCode);
        return result;
    }

    

    @Override
    public int deleteByRateCodeId(String rateCodeId) {
        return rateCodeMapper.deleteByRateCodeId(rateCodeId);
    }

    @Override
    public RateCode getRateCodeById(String rateCodeId) {
        logger.info("根据ID查询价格代码: {}", rateCodeId);
        RateCode rateCode = rateCodeMapper.selectByRateCodeId(rateCodeId);
        if (rateCode == null) {
            logger.info("未找到ID为 {} 的价格代码", rateCodeId);
        }
        return rateCode;
    }

    @Override
    public List<RateCode> selectRateCodeComponent(String hotelId) {
        try {
            logger.debug("获取酒店价格代码组件: hotelId={}", hotelId);
            List<RateCode> rateCodes = rateCodeMapper.selectRateCodeComponent(hotelId);
            logger.debug("获取到 {} 个价格代码组件", rateCodes.size());
            return rateCodes;
        } catch (Exception e) {
            logger.error("获取酒店价格代码组件失败: hotelId={}, error={}", hotelId, e.getMessage(), e);
            throw new RuntimeException("获取酒店价格代码组件失败: " + e.getMessage());
        }
    }

    private String convertToDateFormat(String isoDate) {
        if (isoDate == null || isoDate.trim().isEmpty()) {
            return null;
        }
        try {
            Instant instant = Instant.parse(isoDate);
            LocalDateTime dateTime = LocalDateTime.ofInstant(instant, ZoneId.systemDefault());
            return dateTime.format(DATE_FORMATTER);
        } catch (Exception e) {
            logger.debug("日期格式转换错误: {}", isoDate, e);
            return null;
        }
    }

    @Override
    public List<Map<String, Object>> getRoomTypesByRateCodeId(String rateCodeId) {
        logger.debug("查询价格代码关联房型: rateCodeId={}", rateCodeId);
        try {
            return rateCodeMapper.selectRoomTypesByRateCodeId(rateCodeId);
        } catch (Exception e) {
            logger.error("查询价格代码关联房型失败: rateCodeId={}, 错误: {}", rateCodeId, e.getMessage(), e);
            throw new RuntimeException("查询价格代码关联房型失败: " + e.getMessage());
        }
    }



    @Override
    public List<RateCode> selectRateCodesByHotelIdAndPriceRuleType(String hotelId, String rateCodeId) {
        logger.debug("查询酒店price_rule_type=1的价格代码: hotelId={}, rateCodeId={}", hotelId, rateCodeId);
        try {
            List<RateCode> rateCodes = rateCodeMapper.selectRateCodesByHotelIdAndPriceRuleType(hotelId, rateCodeId);
            logger.debug("获取到 {} 个price_rule_type=1的价格代码", rateCodes.size());
            return rateCodes;
        } catch (Exception e) {
            logger.error("查询酒店price_rule_type=1的价格代码失败: hotelId={}, rateCodeId={}, 错误: {}", hotelId, rateCodeId, e.getMessage(), e);
            throw new RuntimeException("查询酒店price_rule_type=1的价格代码失败: " + e.getMessage());
        }
    }

    @Override
    public List<RateCode> selectRateCodesByPriceRuleType(String rateCodeId) {
        logger.debug("根据价格代码ID查询price_rule_type=1的价格代码: rateCodeId={}", rateCodeId);
        try {
            // 先根据rateCodeId获取价格代码信息
            RateCode rateCode = rateCodeMapper.selectByRateCodeId(rateCodeId);
            if (rateCode == null) {
                logger.warn("价格代码不存在: rateCodeId={}", rateCodeId);
                return new ArrayList<>();
            }
            
            String hotelId = rateCode.getHotelId();
            List<RateCode> rateCodes = rateCodeMapper.selectRateCodesByHotelIdAndPriceRuleType(hotelId, rateCodeId);
            logger.debug("获取到 {} 个price_rule_type=1的价格代码", rateCodes.size());
            return rateCodes;
        } catch (Exception e) {
            logger.error("根据价格代码ID查询price_rule_type=1的价格代码失败: rateCodeId={}, 错误: {}", rateCodeId, e.getMessage(), e);
            throw new RuntimeException("根据价格代码ID查询price_rule_type=1的价格代码失败: " + e.getMessage());
        }
    }

    @Override
    public List<RateCode> selectRateCodesByHotelIdAndPriceRuleType2(String hotelId, String rateCodeId) {
        logger.debug("查询酒店price_rule_type=2的价格代码: hotelId={}, rateCodeId={}", hotelId, rateCodeId);
        try {
            List<RateCode> rateCodes = rateCodeMapper.selectRateCodesByHotelIdAndPriceRuleType2(hotelId, rateCodeId);
            logger.debug("获取到 {} 个price_rule_type=2的价格代码", rateCodes.size());
            return rateCodes;
        } catch (Exception e) {
            logger.error("查询酒店price_rule_type=2的价格代码失败: hotelId={}, rateCodeId={}, 错误: {}", hotelId, rateCodeId, e.getMessage(), e);
            throw new RuntimeException("查询酒店price_rule_type=2的价格代码失败: " + e.getMessage());
        }
    }
    /**
     * 主入口
     * 根据priceRuleType处理不同的价格设置
     */
    @Override
    public boolean savePriceSettings(PriceSettingsSaveRequest request) {
        logger.debug("保存价格设置: rateCodeId={}, priceRuleType={}, 房型数量={}", 
                   request.getRateCodeId(), request.getPriceRuleType(),
                   request.getFixedPrice() != null && request.getFixedPrice().getRoomTypePrices() != null ? 
                   request.getFixedPrice().getRoomTypePrices().size() : 0);
        try {
            // 1. 验证价格代码是否存在
            RateCode rateCode = rateCodeMapper.selectByRateCodeId(request.getRateCodeId());
            if (rateCode == null) {
                logger.error("价格代码不存在: rateCodeId={}", request.getRateCodeId());
                throw new RuntimeException("价格代码不存在: " + request.getRateCodeId());
            }
            
            
            // 2. 根据priceRuleType处理不同的价格设置
            if ("1".equals(request.getPriceRuleType())) {
                // 固定价格设置
                if (request.getFixedPrice() != null 
                && request.getFixedPrice().getRoomTypePrices() != null) {
                    saveFixedPrices(request.getFixedPrice().getRoomTypePrices(), rateCode);
                }
            } else if ("2".equals(request.getPriceRuleType())) {
                // 基础价格设置
                if (request.getBasePrice() != null 
                && request.getBasePrice().getRoomTypeBasePrices() != null) {
                    saveBasePrices(request.getBasePrice().getRoomTypeBasePrices(), rateCode);
                }
            } else if ("3".equals(request.getPriceRuleType())) {
                // 3. 保存折扣价格设置（如果有）
                if (request.getDiscountPrice() != null) {
                    saveDiscountPrice(request.getDiscountPrice(), rateCode);
                }
            } else if ("4".equals(request.getPriceRuleType())) {
                // 4. 保存双重折扣设置（如果有）
                if (request.getDoubleDiscount() != null) {
                    saveDoubleDiscount(request.getDoubleDiscount(), rateCode);
                }
            }
            
            
            
            
            
            logger.debug("价格设置保存成功");
            return true;
        } catch (Exception e) {
            logger.error("保存价格设置失败: rateCodeId={}, 错误: {}", request.getRateCodeId(), e.getMessage(), e);
            throw new RuntimeException("保存价格设置失败: " + e.getMessage());
        }
    }
    
    /**
     * 保存固定价格设置
     */
    private void saveFixedPrices(
        List<PriceSettingsSaveRequest.RoomTypePrice> roomTypePrices, 
        RateCode rateCode) {
        logger.debug("保存固定价格设置: 房型数量={}", roomTypePrices.size());
        String chainId = rateCode.getChainId();
        String hotelId = rateCode.getHotelId();
        String rateCodeValue = rateCode.getRateCode();
        String rateCodeId = rateCode.getRateCodeId();
        String limitAvailWeeks = rateCode.getLimitAvailWeeks(); // 例如 "1111100"
        
        for (PriceSettingsSaveRequest.RoomTypePrice roomTypePrice : roomTypePrices) {
            String roomTypeId = roomTypePrice.getRoomTypeId();
            
            RoomType roomType = roomTypeMapper.selectByRoomTypeId(roomTypeId);
            if (roomType == null) {
                throw new RuntimeException("房型不存在: " + roomTypeId);
            }
            String roomTypeCode = roomType.getRoomTypeCode();
            
            for (PriceSettingsSaveRequest.PricePeriod pricePeriod : roomTypePrice.getPricePeriods()) {
                LocalDate startDate = LocalDate.parse(pricePeriod.getStartDate());
                LocalDate endDate = LocalDate.parse(pricePeriod.getEndDate());
                
                logger.debug("处理固定价格周期: roomTypeId={}, startDate={}, endDate={}", 
                           roomTypeId, startDate, endDate);
                
                Map<String, Object> deleteParams = new HashMap<>();
                deleteParams.put("chainId", chainId);
                deleteParams.put("hotelId", hotelId);
                deleteParams.put("roomTypeCode", roomTypeCode);
                deleteParams.put("rateCode", rateCodeValue);
                deleteParams.put("startDate", startDate.toString());
                deleteParams.put("endDate", endDate.toString());
                int deletedCount = rateCodeMapper.deleteRatePricesByDateRange(deleteParams);
                logger.debug("删除旧固定价格记录: 删除了{}条记录", deletedCount);
                
                List<Map<String, Object>> batch = new ArrayList<>();
                LocalDate currentDate = startDate;
                while (!currentDate.isAfter(endDate)) {
                    // 周控判断：limitAvailWeeks 为7位字符串，对应周一到周日；为null或长度不为7则默认放行
                    if (!isWeekAllowed(limitAvailWeeks, currentDate)) {
                        currentDate = currentDate.plusDays(1);
                        continue;
                    }
                    
                    // 当天价格均为0则跳过
                    Double channelPrice = pricePeriod.getChannelPrice();
                    Double hotelPrice = pricePeriod.getHotelPrice();
                    if ((channelPrice == null ? 0.0 : channelPrice) == 0.0
                        && (hotelPrice == null ? 0.0 : hotelPrice) == 0.0) {
                        currentDate = currentDate.plusDays(1);
                        continue;
                    }
                    
                    String priceId = java.util.UUID.randomUUID().toString().replace("-", "");
                    String ratePlanId = roomTypeCode + "_" + rateCodeValue;
                    
                    Map<String, Object> priceData = new HashMap<>();
                    priceData.put("priceId", priceId);
                    priceData.put("chainId", chainId);
                    priceData.put("hotelId", hotelId);
                    priceData.put("hotelCode", hotelId);
                    priceData.put("ratePlanId", ratePlanId);
                    priceData.put("roomTypeId", roomTypeId);
                    priceData.put("roomTypeCode", roomTypeCode);
                    priceData.put("rateCodeId", rateCodeId);
                    priceData.put("rateCode", rateCodeValue);
                    priceData.put("stayDate", currentDate.toString());
                    priceData.put("channelSingleOccupancy", channelPrice);
                    priceData.put("channelDoubleOccupancy", channelPrice);
                    priceData.put("hotelSingleOccupancy", hotelPrice);
                    priceData.put("hotelDoubleOccupancy", hotelPrice);
                    priceData.put("agentSingleOccupancy", channelPrice);
                    priceData.put("agentDoubleOccupancy", channelPrice);
                    batch.add(priceData);
                    
                    if (batch.size() >= 1000) {
                        rateCodeMapper.insertRatePricesBatch(batch);
                        logger.debug("批量插入固定价格记录: 本次插入{}条，最后日期={}", batch.size(), currentDate);
                        batch.clear();
                    }
                    
                    currentDate = currentDate.plusDays(1);
                }
                if (!batch.isEmpty()) {
                    rateCodeMapper.insertRatePricesBatch(batch);
                    logger.debug("批量插入固定价格记录: 剩余插入{}条", batch.size());
                    batch.clear();
                }
            }
        }
    }

    private boolean isWeekAllowed(String limitAvailWeeks, LocalDate date) {
        if (limitAvailWeeks == null || limitAvailWeeks.length() != 7) {
            return true;
        }
        int idx = date.getDayOfWeek().getValue() - 1; // 1..7 -> 0..6 （周一到周日）
        char flag = limitAvailWeeks.charAt(idx);
        return flag == '1';
    }
    
    /**
     * 保存基础价格设置
     */
    private void saveBasePrices(
        List<PriceSettingsSaveRequest.RoomTypeBasePrice> roomTypeBasePrices, 
        RateCode rateCode) {
        logger.debug("保存基础价格设置: 房型数量={}", roomTypeBasePrices.size());
        String chainId = rateCode.getChainId();
        String hotelId = rateCode.getHotelId();
        String rateCodeValue = rateCode.getRateCode();
        String rateCodeId = rateCode.getRateCodeId();
        
        for (PriceSettingsSaveRequest.RoomTypeBasePrice roomTypeBasePrice : roomTypeBasePrices) {
            String roomTypeId = roomTypeBasePrice.getRoomTypeId();
            
            // 获取房型信息
            RoomType roomType = roomTypeMapper.selectByRoomTypeId(roomTypeId);
            if (roomType == null) {
                throw new RuntimeException("房型不存在: " + roomTypeId);
            }
            String roomTypeCode = roomType.getRoomTypeCode();
            
            for (PriceSettingsSaveRequest.BasePricePeriod basePricePeriod : roomTypeBasePrice.getBasePricePeriods()) {
                // 解析开始和结束日期
                LocalDate startDate = LocalDate.parse(basePricePeriod.getStartDate());
                LocalDate endDate = LocalDate.parse(basePricePeriod.getEndDate());
                
                logger.debug("处理基础价格周期: roomTypeId={}, startDate={}, endDate={}", 
                           roomTypeId, startDate, endDate);
                
                // 删除该日期范围内的旧记录
                Map<String, Object> deleteParams = new HashMap<>();
                deleteParams.put("chainId", chainId);
                deleteParams.put("hotelId", hotelId);
                deleteParams.put("roomTypeCode", roomTypeCode);
                deleteParams.put("rateCode", rateCodeValue);
                deleteParams.put("startDate", startDate.toString());
                deleteParams.put("endDate", endDate.toString());
                
                int deletedCount = rateCodeMapper.deleteRatePricesByDateRange(deleteParams);
                logger.debug("删除旧基础价格记录: 删除了{}条记录", deletedCount);
                
                // 遍历日期范围，为每一天创建价格记录
                LocalDate currentDate = startDate;
                while (!currentDate.isAfter(endDate)) {
                    // 生成价格记录ID
                    String priceId = java.util.UUID.randomUUID().toString().replace("-", "");
                    
                    // 构建rate_plan_id
                    String ratePlanId = roomTypeCode + "_" + rateCodeValue;
                    
                    // 保存到rate_prices表
                    Map<String, Object> priceData = new HashMap<>();
                    priceData.put("priceId", priceId);
                    priceData.put("chainId", chainId);
                    priceData.put("hotelId", hotelId);
                    priceData.put("hotelCode", hotelId);
                    priceData.put("ratePlanId", ratePlanId);
                    priceData.put("roomTypeId", roomTypeId);
                    priceData.put("roomTypeCode", roomTypeCode);
                    priceData.put("rateCodeId", rateCodeId);
                    priceData.put("rateCode", rateCodeValue);
                    priceData.put("stayDate", currentDate.toString());
                    priceData.put("channelSingleOccupancy", basePricePeriod.getChannelPrice());
                    priceData.put("channelDoubleOccupancy", basePricePeriod.getChannelPrice());
                    priceData.put("hotelSingleOccupancy", basePricePeriod.getHotelPrice());
                    priceData.put("hotelDoubleOccupancy", basePricePeriod.getHotelPrice());
                    priceData.put("agentSingleOccupancy", basePricePeriod.getChannelPrice());
                    priceData.put("agentDoubleOccupancy", basePricePeriod.getChannelPrice());
                    
                    rateCodeMapper.insertRatePrice(priceData);
                    
                    logger.debug("保存基础价格记录: priceId={}, roomTypeId={}, stayDate={}, channelPrice={}, hotelPrice={}", 
                               priceId, roomTypeId, currentDate, 
                               basePricePeriod.getChannelPrice(), basePricePeriod.getHotelPrice());
                    
                    // 移动到下一天
                    currentDate = currentDate.plusDays(1);
                }
            }
        }
    }
    
    /**
     * 保存折扣价格设置
     */
    private void saveDiscountPrice(
        PriceSettingsSaveRequest.DiscountPrice discountPrice, 
        RateCode rateCode) {
        logger.debug("保存折扣价格设置: parentRateCodeId={}, priceFormula={}, priceOffset={}", 
                   discountPrice.getParentRateCodeId(), discountPrice.getPriceFormula(), discountPrice.getPriceOffset());
        
        // TODO: 实现折扣价格保存逻辑
        // 这里可能需要保存到其他表或者更新rate_codes表的相关字段
    }
    
    /**
     * 保存双重折扣设置
     */
    private void saveDoubleDiscount(
        PriceSettingsSaveRequest.DoubleDiscount doubleDiscount, 
        RateCode rateCode) {
        logger.debug("保存双重折扣设置: parentDiscountRateCodeId={}, discountPriceFormula={}, discountPriceOffset={}", 
                   doubleDiscount.getParentDiscountRateCodeId(), 
                   doubleDiscount.getDiscountPriceFormula(), 
                   doubleDiscount.getDiscountPriceOffset());
        
        // TODO: 实现双重折扣保存逻辑
        // 这里可能需要保存到其他表或者更新rate_codes表的相关字段
    }
} 