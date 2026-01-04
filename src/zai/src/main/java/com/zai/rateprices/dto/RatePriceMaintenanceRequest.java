package com.zai.rateprices.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

/**
 * 维护房价请求DTO
 */
@Data
public class RatePriceMaintenanceRequest {
    
    /**
     * 酒店连锁ID
     */
    private String chainId;
    
    /**
     * 酒店ID
     */
    private String hotelId;
    
    /**
     * 可用性级别
     */
    private String availLevel;
    
    /**
     * 房型列表
     */
    private List<RoomTypeInfo> roomTypes;
    
    /**
     * 日期模型
     */
    private String dateModel;
    
    /**
     * 日期范围列表
     */
    private List<DateRange> dateRanges;
    
    /**
     * 适用工作日（7位数字，1表示适用，0表示不适用）
     */
    private String applicableWeekdays;
    
    /**
     * 选中的日期列表
     */
    private List<String> selectedDates;
    
    /**
     * 价格模式
     */
    private String priceMode;
    
    /**
     * 分离价格
     */
    private SeparatePrice separatePrice;
    
    /**
     * 统一价格
     */
    private UnifiedPrice unifiedPrice;
    
    /**
     * 房型信息
     */
    @Data
    public static class RoomTypeInfo {
        /**
         * 房型ID
         */
        private String id;
        
        /**
         * 房型代码
         */
        private String code;
        
        /**
         * 房价码列表
         */
        private List<RateCodeInfo> rateCodes;
    }
    
    /**
     * 房价码信息
     */
    @Data
    public static class RateCodeInfo {
        /**
         * 房价码ID
         */
        private String id;
        
        /**
         * 房价码代码
         */
        private String code;
    }
    
    /**
     * 日期范围
     */
    @Data
    public static class DateRange {
        /**
         * 开始日期
         */
        private String startDate;
        
        /**
         * 结束日期
         */
        private String endDate;
    }
    
    /**
     * 分离价格
     */
    @Data
    public static class SeparatePrice {
        /**
         * 酒店价格
         */
        private BigDecimal hotelPrice;
        
        /**
         * 渠道价格
         */
        private BigDecimal channelPrice;
    }
    
    /**
     * 统一价格
     */
    @Data
    public static class UnifiedPrice {
        /**
         * 公式（add/subtract/multiply/divide）
         */
        private String formula;
        
        /**
         * 酒店价格偏移量
         */
        private BigDecimal hotelOffset;
        
        /**
         * 渠道价格偏移量
         */
        private BigDecimal channelOffset;
    }
} 