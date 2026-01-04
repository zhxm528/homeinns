package com.zai.rateplan.service;

import com.zai.rateplan.entity.RatePlan;
import com.zai.rateplan.dto.RoomTypeBindInfo;
import java.util.List;

public interface RatePlanService {
    // 查询套餐列表
    List<RatePlan> getRatePlans(String chainId, String hotelId);

    // 创建套餐
    void createRatePlan(String chainId, String hotelId, String roomTypeId, String rateCodeId);

    // 删除套餐
    void deleteRatePlan(String chainId, String hotelId, String roomTypeId, String rateCodeId);

    // 删除所有套餐
    void deleteRatePlansByChainAndHotel(String chainId, String hotelId, String rateCodeId);

    // 根据价格代码查询套餐列表
    List<RatePlan> getRatePlansByRateCode(String chainId, String hotelId, String rateCodeId);

    /**
     * 通过酒店ID查询所有房型和房价码
     * 
     * @param hotelId 酒店ID
     * @return 价格方案列表
     */
    List<RatePlan> selectRatePlansByHotelId(String hotelId);

    /**
     * 根据酒店ID、价格代码ID和房型ID查询价格方案
     * 
     * @param hotelId 酒店ID
     * @param rateCodeId 价格代码ID
     * @param roomTypeId 房型ID
     * @return 价格方案列表
     */
    List<RatePlan> getRatePlansByHotelAndRateCodeAndRoomType(String hotelId, String rateCodeId, String roomTypeId);
    
    /**
     * 根据连锁ID、酒店ID和价格代码ID获取房型绑定信息
     * 
     * @param chainId 连锁ID
     * @param hotelId 酒店ID
     * @param rateCodeId 价格代码ID
     * @return 房型绑定信息列表
     */
    List<RoomTypeBindInfo> getRoomTypeBindInfo(String chainId, String hotelId, String rateCodeId);
} 