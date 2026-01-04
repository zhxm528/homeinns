package com.zai.api.hotelbeds.dto;

import lombok.Data;
import java.util.List;

/**
 * 酒店可用性查询请求DTO
 {
  "hotels": ["HOTEL001", "HOTEL002", "HOTEL003"],
  "checkDate": "2024-01-15"
 }
 */
@Data
public class HotelAvailabilityRequest {
    
    /**
     * 酒店ID数组
     */
    private List<String> hotels;
    
    /**
     * 查询日期 (格式: yyyy-MM-dd)
     */
    private String checkDate;
} 