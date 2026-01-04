package com.zai.rateplan.service.impl;

import com.zai.rateplan.entity.RatePlan;
import com.zai.rateplan.mapper.RatePlanMapper;
import com.zai.rateplan.service.RatePlanService;
import com.zai.rateplan.dto.RoomTypeBindInfo;
import com.zai.ratecode.entity.RateCode;
import com.zai.ratecode.service.RateCodeService;
import com.zai.roomtype.entity.RoomType;
import com.zai.roomtype.service.RoomTypeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpSession;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.ArrayList;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;
import java.util.Set;

@Service
public class RatePlanServiceImpl implements RatePlanService {
    private static final Logger logger = LoggerFactory.getLogger(RatePlanServiceImpl.class);
    
    @Autowired
    private RatePlanMapper ratePlanMapper;
    
    @Autowired
    private RoomTypeService roomTypeService;
    
    @Autowired
    private RateCodeService rateCodeService;

    @Override
    public List<RatePlan> getRatePlans(String chainId, String hotelId) {
        return ratePlanMapper.selectByChainAndHotel(chainId, hotelId);
    }

    @Override
    public void createRatePlan(String chainId, String hotelId, String roomTypeId, String rateCodeId) {
        try {
            
            // 获取房型和价格代码信息
            RoomType roomType = roomTypeService.getRoomTypeById(roomTypeId);
            if (roomType == null) {
                throw new RuntimeException("房型不存在：" + roomTypeId);
            }
            
            RateCode rateCode = rateCodeService.getRateCodeById(rateCodeId);
            if (rateCode == null) {
                throw new RuntimeException("价格代码不存在：" + rateCodeId);
            }
            
            // 生成新的套餐记录
            RatePlan rp = new RatePlan();
            String ratePlanId = UUID.randomUUID().toString().replace("-", "");
            rp.setRatePlanId(ratePlanId);
            rp.setChainId(chainId);
            rp.setHotelId(hotelId);
            rp.setRoomTypeId(roomTypeId);
            rp.setRateCodeId(rateCodeId);
            
            // 设置房型代码和房价码代码
            rp.setRoomType(roomType.getRoomTypeCode());
            rp.setRateCode(rateCode.getRateCode());
            
            // 设置房型名称和房价码名称
            rp.setRoomTypeName(roomType.getRoomTypeName());
            rp.setRateCodeName(rateCode.getRateCodeName());
            
            // 生成 ratePlanName
            String rtCode = roomType.getRoomTypeCode();
            String rcCode = rateCode.getRateCode();
            String rtName = roomType.getRoomTypeName();
            String rcName = rateCode.getRateCodeName();
            rp.setRatePlanName(rtCode + "-" + rcCode);
            
            // 设置其他字段
            rp.setDescription(rtName + "-" + rcName);
            rp.setFinalStatus(0);
            rp.setFinalInventory(0);
            rp.setFinalPrice(BigDecimal.ZERO);
            
            // 插入记录
            int result = ratePlanMapper.insert(rp);
            if (result != 1) {
                throw new RuntimeException("插入套餐记录失败");
            }
        } catch (Exception e) {
            logger.debug("创建套餐失败", e);
            throw new RuntimeException("创建套餐失败：" + e.getMessage());
        }
    }

    @Override
    public void deleteRatePlan(String chainId, String hotelId, String roomTypeId, String rateCodeId) {
        ratePlanMapper.deleteByUnique(chainId, hotelId, roomTypeId, rateCodeId);
    }

    @Override
    public void deleteRatePlansByChainAndHotel(String chainId, String hotelId, String rateCodeId) {
        try {
            int deletedCount = ratePlanMapper.deleteByChainAndHotel(chainId, hotelId, rateCodeId);
            logger.debug("成功删除 {} 条价格方案记录", deletedCount);
        } catch (Exception e) {
            logger.debug("删除价格方案失败: chainId={}, hotelId={}, debug={}", chainId, hotelId, e.getMessage(), e);
            throw new RuntimeException("删除价格方案失败: " + e.getMessage());
        }
    }

    @Override
    public List<RatePlan> getRatePlansByRateCode(String chainId, String hotelId, String rateCodeId) {

        


        return ratePlanMapper.selectByChainAndHotelAndRateCode(chainId, hotelId, rateCodeId);
    }

    /**
     * 通过酒店ID查询所有房型和房价码
     * 
     * @param hotelId 酒店ID
     * @return 价格方案列表
     */
    @Override
    public List<RatePlan> selectRatePlansByHotelId(String hotelId) {
        try {
            logger.debug("查询酒店价格方案: hotelId={}", hotelId);
            List<RatePlan> ratePlans = ratePlanMapper.selectByHotelId(hotelId);
            logger.debug("查询到 {} 条价格方案", ratePlans.size());
            return ratePlans;
        } catch (Exception e) {
            logger.debug("查询酒店价格方案失败: hotelId={}, debug={}", hotelId, e.getMessage(), e);
            throw new RuntimeException("查询酒店价格方案失败: " + e.getMessage());
        }
    }
    
    @Override
    public List<RatePlan> getRatePlansByHotelAndRateCodeAndRoomType(String hotelId, 
    String rateCodeId, String roomTypeId) {
        try {
            logger.debug("查询价格方案: hotelId={}, rateCodeId={}, roomTypeId={}", hotelId, rateCodeId, roomTypeId);
            List<RatePlan> ratePlans = ratePlanMapper.selectByHotelAndRateCodeAndRoomType(hotelId, rateCodeId, roomTypeId);
            logger.debug("查询到 {} 条价格方案", ratePlans.size());
            return ratePlans;
        } catch (Exception e) {
            logger.error("查询价格方案失败: hotelId={}, rateCodeId={}, roomTypeId={}, error={}", 
                hotelId, rateCodeId, roomTypeId, e.getMessage(), e);
            throw new RuntimeException("查询价格方案失败: " + e.getMessage());
        }
    }
    
    @Override
    public List<RoomTypeBindInfo> getRoomTypeBindInfo(String chainId, String hotelId, String rateCodeId) {
        try {
            logger.debug("获取房型绑定信息: chainId={}, hotelId={}, rateCodeId={}", chainId, hotelId, rateCodeId);
            
            // 1. 查出符合条件的房型，查询条件为：chainId, hotelId
            Map<String, Object> params = new HashMap<>();
            params.put("chainId", chainId);
            params.put("hotelId", hotelId);
            List<RoomType> roomTypes = roomTypeService.getRoomTypesByCondition(params);
            
            // 2. 查出符合条件的价格方案，查询条件为：chainId, hotelId, rateCodeId
            List<RatePlan> ratePlans = ratePlanMapper.selectByChainAndHotelAndRateCode(chainId, hotelId, rateCodeId);
            
            // 3. 构建房型绑定信息列表
            List<RoomTypeBindInfo> result = new ArrayList<>();
            
            // 获取已绑定的房型ID集合
            Set<String> boundRoomTypeIds = ratePlans.stream()
                .map(RatePlan::getRoomTypeId)
                .collect(Collectors.toSet());
            
            // 为每个房型创建绑定信息
            for (RoomType roomType : roomTypes) {
                RoomTypeBindInfo bindInfo = new RoomTypeBindInfo();
                bindInfo.setRoomTypeId(roomType.getRoomTypeId());
                bindInfo.setRoomTypeCode(roomType.getRoomTypeCode());
                bindInfo.setRoomTypeName(roomType.getRoomTypeName());
                
                // 根据价格方案查询结果过滤，如果房型ID包含在价格方案中，则设置为true
                bindInfo.setSelected(boundRoomTypeIds.contains(roomType.getRoomTypeId()));
                
                result.add(bindInfo);
            }
            
            logger.debug("返回房型绑定信息数量: {}", result.size());
            return result;
            
        } catch (Exception e) {
            logger.error("获取房型绑定信息失败: chainId={}, hotelId={}, rateCodeId={}, error={}", 
                chainId, hotelId, rateCodeId, e.getMessage(), e);
            throw new RuntimeException("获取房型绑定信息失败: " + e.getMessage());
        }
    }
} 