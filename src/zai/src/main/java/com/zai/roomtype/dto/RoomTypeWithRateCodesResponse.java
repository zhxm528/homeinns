package com.zai.roomtype.dto;

import lombok.Data;
import java.util.List;

/**
 * 房型信息及价格代码响应DTO
 */
@Data
public class RoomTypeWithRateCodesResponse {
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
     * 关联的价格代码列表
     */
    private List<RateCodeInfo> rateCodes;
    
    /**
     * 价格代码信息
     */
    @Data
    public static class RateCodeInfo {
        /**
         * 价格代码ID（格式：roomTypeId_rateCode）
         */
        private String id;
        
        /**
         * 价格代码
         */
        private String code;
        
        /**
         * 价格代码名称
         */
        private String name;
        
        /**
         * 预订类型
         */
        private String bookingType;
        
        /**
         * 取消规则
         */
        private String cancellationRule;
        
        /**
         * 价格规则
         */
        private String priceRule;
        
        /**
         * 价格折扣
         */
        private String priceDiscount;
    }
} 