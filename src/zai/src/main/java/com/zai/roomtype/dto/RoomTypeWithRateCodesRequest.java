package com.zai.roomtype.dto;

import lombok.Data;

/**
 * 房型信息及价格代码查询请求DTO
 */
@Data
public class RoomTypeWithRateCodesRequest {
    /**
     * 连锁ID
     */
    private String chainId;
    
    /**
     * 酒店ID
     */
    private String hotelId;
} 