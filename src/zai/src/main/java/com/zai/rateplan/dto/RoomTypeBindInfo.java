package com.zai.rateplan.dto;

import lombok.Data;

/**
 * 房型绑定信息DTO
 */
@Data
public class RoomTypeBindInfo {
    /**
     * 房型ID
     */
    private String roomTypeId;
    
    /**
     * 房型代码
     */
    private String roomTypeCode;
    
    /**
     * 房型名称
     */
    private String roomTypeName;
    
    /**
     * 是否被选中（已绑定到价格方案）
     */
    private Boolean selected;
} 