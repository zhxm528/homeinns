package com.zai.roomtype.service;

import com.zai.roomtype.entity.RoomType;
import com.zai.roomtype.dto.RoomTypeWithRateCodesResponse;
import java.util.List;
import java.util.Map;

public interface RoomTypeService {
    // 添加房型
    int addRoomType(RoomType roomType);

    // 删除房型
    int deleteRoomType(String roomTypeId);

    // 更新房型
    int updateRoomType(RoomType roomType);

    // 根据ID获取房型
    RoomType getRoomTypeById(String roomTypeId);

    // 获取所有房型
    List<RoomType> getAllRoomTypes();

    // 根据条件查询房型
    List<RoomType> getRoomTypesByCondition(Map<String, Object> params);

    // 根据酒店ID获取房型
    List<RoomType> getRoomTypesByHotelId(String hotelId);

    // 获取符合条件的房型总数
    int getRoomTypeCount(Map<String, Object> params);

    /**
     * 获取酒店房型组件列表
     * 
     * @param hotelId 酒店ID
     * @return 房型列表
     */
    List<RoomType> getRoomTypeComponent(String hotelId);
    
    /**
     * 根据连锁ID和酒店ID获取房型信息及关联的价格代码
     * 
     * @param chainId 连锁ID
     * @param hotelId 酒店ID
     * @return 房型信息及价格代码列表
     */
    List<RoomTypeWithRateCodesResponse> getRoomTypesWithRateCodes(String chainId, String hotelId);
} 