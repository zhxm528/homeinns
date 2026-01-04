package com.zai.rateinventorystatus.service;

import com.zai.common.BaseResponse;
import com.zai.rateinventorystatus.dto.RateInventoryStatusAddRequest;
import com.zai.rateinventorystatus.dto.RateInventoryStatusListRequest;
import com.zai.rateinventorystatus.dto.RateInventoryStatusUpdateRequest;
import com.zai.rateinventorystatus.entity.RateInventoryStatus;
import com.zai.rateinventorystatus.dto.AvailInventoryRequest;

/**
 * 房价库存状态Service接口
 */
public interface RateInventoryStatusService {
    
    /**
     * 添加房价库存状态记录
     */
    BaseResponse<String> addRateInventoryStatus(RateInventoryStatusAddRequest request);
    
    /**
     * 更新房价库存状态记录
     */
    BaseResponse<String> updateRateInventoryStatus(RateInventoryStatusUpdateRequest request);
    
    /**
     * 删除房价库存状态记录
     */
    BaseResponse<String> deleteRateInventoryStatus(String chainId, String hotelId, 
                                                  String rateCode, String roomTypeCode, String stayDate);
    
    /**
     * 根据主键查询房价库存状态记录
     */
    BaseResponse<RateInventoryStatus> getRateInventoryStatus(String chainId, String hotelId, 
                                                            String rateCode, String roomTypeCode, String stayDate);
    
    /**
     * 分页查询房价库存状态记录列表
     */
    BaseResponse<Object> getRateInventoryStatusList(RateInventoryStatusListRequest request);
    
    /**
     * 批量添加房价库存状态记录
     */
    BaseResponse<String> batchAddRateInventoryStatus(java.util.List<RateInventoryStatusAddRequest> requestList);
    
    /**
     * 批量更新房价库存状态记录
     */
    BaseResponse<String> batchUpdateRateInventoryStatus(java.util.List<RateInventoryStatusUpdateRequest> requestList);
    
    /**
     * 根据日期范围删除房价库存状态记录
     */
    BaseResponse<String> deleteRateInventoryStatusByDateRange(String chainId, String hotelId, 
                                                             String startDate, String endDate);

    /**
     * 可用库存
     */
    BaseResponse<String> availInventory(AvailInventoryRequest request);
} 