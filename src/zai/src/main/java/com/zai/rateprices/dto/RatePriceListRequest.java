package com.zai.rateprices.dto;

import lombok.Data;
import java.time.LocalDate;
import java.util.List;

/**
 * 房价价格查询请求DTO
 */
@Data
public class RatePriceListRequest {
    
    /**
     * 酒店连锁ID
     */
    private String chainId;
    
    /**
     * 酒店ID
     */
    private String hotelId;
    
    /**
     * 房型代码列表
     */
    private List<String> roomTypeCode;
    
    /**
     * 房型与房价码映射关系
     */
    private List<RoomTypeRateCodeMapping> roomTypeRateCodeMappings;
    
    /**
     * 开始日期
     */
    private String startDate;
    
    /**
     * 结束日期
     */
    private String endDate;
    
    /**
     * 页码
     */
    private Integer pageNum = 1;
    
    /**
     * 每页大小
     */
    private Integer pageSize = 10;
    
    /**
     * 房型与房价码映射关系内部类
     */
    @Data
    public static class RoomTypeRateCodeMapping {
        /**
         * 房型代码
         */
        private String roomTypeCode;
        
        /**
         * 该房型对应的房价码列表
         */
        private List<String> rateCodes;
    }
} 