package com.zai.roomtype.service.impl;

import com.zai.roomtype.entity.RoomType;
import com.zai.roomtype.mapper.RoomTypeMapper;
import com.zai.roomtype.service.RoomTypeService;
import com.zai.roomtype.dto.RoomTypeWithRateCodesResponse;
import com.zai.ratecode.entity.RateCode;
import com.zai.ratecode.service.RateCodeService;
import com.zai.rateplan.entity.RatePlan;
import com.zai.rateplan.service.RatePlanService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.HashMap;
import java.util.ArrayList;
import java.util.stream.Collectors;

@Service
public class RoomTypeServiceImpl implements RoomTypeService {

    private static final Logger logger = LoggerFactory.getLogger(RoomTypeServiceImpl.class);

    @Autowired
    private RoomTypeMapper roomTypeMapper;
    
    @Autowired
    private RateCodeService rateCodeService;
    
    @Autowired
    @Lazy
    private RatePlanService ratePlanService;

    @Override
    public int addRoomType(RoomType roomType) {
        // 生成UUID作为房型ID
        roomType.setRoomTypeId(UUID.randomUUID().toString());
        roomTypeMapper.insert(roomType);
        return 1;
    }

    @Override
    public int deleteRoomType(String roomTypeId) {
        return roomTypeMapper.deleteByRoomTypeId(roomTypeId);
    }

    @Override
    public int updateRoomType(RoomType roomType) {
        roomTypeMapper.update(roomType);
        return 1;
    }

    @Override
    public RoomType getRoomTypeById(String roomTypeId) {
        return roomTypeMapper.selectByRoomTypeId(roomTypeId);
    }

    @Override
    public List<RoomType> getAllRoomTypes() {
        return roomTypeMapper.selectAll();
    }

    @Override
    public List<RoomType> getRoomTypesByCondition(Map<String, Object> params) {
        return roomTypeMapper.getRoomTypesByCondition(params);
    }

    @Override
    public List<RoomType> getRoomTypesByHotelId(String hotelId) {
        return roomTypeMapper.selectByHotelId(hotelId);
    }

    @Override
    public int getRoomTypeCount(Map<String, Object> params) {
        return roomTypeMapper.countByCondition(params);
    }

    @Override
    public List<RoomType> getRoomTypeComponent(String hotelId) {
        try {
            logger.debug("获取酒店房型组件: hotelId={}", hotelId);
            List<RoomType> roomTypes = roomTypeMapper.selectRoomTypeComponent(hotelId);
            logger.debug("获取到 {} 个房型组件", roomTypes.size());
            return roomTypes;
        } catch (Exception e) {
            logger.error("获取酒店房型组件失败: hotelId={}, error={}", hotelId, e.getMessage(), e);
            throw new RuntimeException("获取酒店房型组件失败: " + e.getMessage());
        }
    }
    
    @Override
    public List<RoomTypeWithRateCodesResponse> getRoomTypesWithRateCodes(String chainId, String hotelId) {
        try {
            logger.debug("获取房型信息及价格代码: chainId={}, hotelId={}", chainId, hotelId);
            
            // 1. 获取房型列表
            Map<String, Object> params = new HashMap<>();
            params.put("chainId", chainId);
            params.put("hotelId", hotelId);
            List<RoomType> roomTypes = roomTypeMapper.getRoomTypesByCondition(params);
            
            // 2. 获取价格代码列表
            List<RateCode> rateCodes = rateCodeService.selectRateCodeComponent(hotelId);
            
            // 3. 查询rateplans，查询条件为chainId和hotelId
            List<RatePlan> ratePlans = ratePlanService.getRatePlans(chainId, hotelId);
            
            // 4. 构建响应数据
            List<RoomTypeWithRateCodesResponse> result = new ArrayList<>();
            
            for (RoomType roomType : roomTypes) {
                RoomTypeWithRateCodesResponse response = new RoomTypeWithRateCodesResponse();
                response.setRoomTypeId(roomType.getRoomTypeId());
                response.setRoomTypeCode(roomType.getRoomTypeCode());
                response.setRoomTypeName(roomType.getRoomTypeName());
                
                // 为每个房型创建价格代码信息
                List<RoomTypeWithRateCodesResponse.RateCodeInfo> rateCodeInfos = new ArrayList<>();
                
                for (RateCode rateCode : rateCodes) {
                    // 检查rateplans中是否包含该房型和价格代码的组合
                    boolean isRatePlanExists = ratePlans.stream()
                        .anyMatch(ratePlan -> ratePlan.getRoomTypeId().equals(roomType.getRoomTypeId()) 
                                           && ratePlan.getRateCodeId().equals(rateCode.getRateCodeId()));
                    
                    // 只有当rateplans中包含该房型和价格代码组合时，才添加到返回列表中
                    if (isRatePlanExists) {
                        RoomTypeWithRateCodesResponse.RateCodeInfo rateCodeInfo = new RoomTypeWithRateCodesResponse.RateCodeInfo();
                        rateCodeInfo.setId(roomType.getRoomTypeId() + "_" + rateCode.getRateCode());
                        rateCodeInfo.setCode(rateCode.getRateCode());
                        rateCodeInfo.setName(rateCode.getRateCodeName());
                        
                        // 设置预订类型（根据reservationType字段）
                        if ("PREPAID".equalsIgnoreCase(rateCode.getReservationType())) {
                            rateCodeInfo.setBookingType("预付");
                        } else if ("POSTPAID".equalsIgnoreCase(rateCode.getReservationType())) {
                            rateCodeInfo.setBookingType("到付");
                        } else {
                            rateCodeInfo.setBookingType(rateCode.getReservationType() != null ? rateCode.getReservationType() : "未知");
                        }
                        
                        // 设置取消规则（根据cancellationType和latestCancellationDays字段）
                        if ("NON_REFUNDABLE".equalsIgnoreCase(rateCode.getCancellationType())) {
                            rateCodeInfo.setCancellationRule("不可取消");
                        } else if ("FREE_CANCELLATION".equalsIgnoreCase(rateCode.getCancellationType())) {
                            rateCodeInfo.setCancellationRule("免费取消");
                        } else if (rateCode.getLatestCancellationDays() != null) {
                            rateCodeInfo.setCancellationRule(rateCode.getLatestCancellationDays() + "小时前可取消");
                        } else {
                            rateCodeInfo.setCancellationRule("按酒店政策");
                        }
                        
                        // 设置价格规则（根据priceRuleType字段）
                        if ("STANDARD".equalsIgnoreCase(rateCode.getPriceRuleType())) {
                            rateCodeInfo.setPriceRule("标准价");
                        } else if ("MEMBER".equalsIgnoreCase(rateCode.getPriceRuleType())) {
                            rateCodeInfo.setPriceRule("会员价");
                        } else {
                            rateCodeInfo.setPriceRule(rateCode.getPriceRuleType() != null ? rateCode.getPriceRuleType() : "标准价");
                        }
                        
                        // 设置价格折扣（根据priceModifier和isPercentage字段）
                        if (rateCode.getPriceModifier() != null && !rateCode.getPriceModifier().isEmpty()) {
                            if (rateCode.getIsPercentage() != null && rateCode.getIsPercentage() == 1) {
                                rateCodeInfo.setPriceDiscount(rateCode.getPriceModifier() + "%折扣");
                            } else {
                                rateCodeInfo.setPriceDiscount(rateCode.getPriceModifier() + "元折扣");
                            }
                        } else {
                            rateCodeInfo.setPriceDiscount("无折扣");
                        }
                        
                        rateCodeInfos.add(rateCodeInfo);
                    }
                }
                
                response.setRateCodes(rateCodeInfos);
                result.add(response);
            }
            
            logger.debug("返回房型信息及价格代码数量: {}", result.size());
            return result;
            
        } catch (Exception e) {
            logger.error("获取房型信息及价格代码失败: chainId={}, hotelId={}, error={}", chainId, hotelId, e.getMessage(), e);
            throw new RuntimeException("获取房型信息及价格代码失败: " + e.getMessage());
        }
    }
} 