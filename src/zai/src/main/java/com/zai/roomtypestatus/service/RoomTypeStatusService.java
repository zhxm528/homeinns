package com.zai.roomtypestatus.service;

import com.zai.common.BaseResponse;
import com.zai.roomtypestatus.dto.RoomTypeStatusAddRequest;
import com.zai.roomtypestatus.dto.RoomTypeStatusListRequest;
import com.zai.roomtypestatus.dto.RoomTypeStatusUpdateRequest;

/**
 * 房型库存状态服务接口
 */
public interface RoomTypeStatusService {
    
    /**
     * 添加房型库存状态
     * @param request 添加请求
     * @return 响应结果
     */
    BaseResponse add(RoomTypeStatusAddRequest request);
    
    /**
     * 更新房型库存状态
     * @param request 更新请求
     * @return 响应结果
     */
    BaseResponse update(RoomTypeStatusUpdateRequest request);
    
    /**
     * 删除房型库存状态
     * @param roomtypeStatusId 状态记录ID
     * @return 响应结果
     */
    BaseResponse delete(String roomtypeStatusId);
    
    /**
     * 查询房型库存状态列表
     * @param request 查询请求
     * @return 响应结果
     */
    BaseResponse list(RoomTypeStatusListRequest request);
    
    /**
     * 根据ID查询房型库存状态
     * @param roomtypeStatusId 状态记录ID
     * @return 响应结果
     */
    BaseResponse getById(String roomtypeStatusId);
    
    /**
     * 批量添加房型库存状态
     * @param request 添加请求
     * @return 响应结果
     */
    BaseResponse batchAdd(RoomTypeStatusAddRequest request);
} 