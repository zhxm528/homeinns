package com.zai.api.hotelbeds.dto;

import lombok.Data;
import java.util.List;

/**
 * 酒店信息表格返回DTO
 * 用于返回酒店信息的表格数据
 */
@Data
public class CheckHotelInfoResponse {
    
     /**
     * 酒店代码
     */
    private String hotelCode;
    
    /**
     * 酒店名称
     */
    private String hotelName;
    
    /**
     * 酒店地址
     */
    private String address;
    
    /**
     * 房型数量
     */
    private Integer roomTypeNum;
    
    /**
     * 房型代码列表（逗号分隔）
     */
    private String roomTypeCodes;
} 