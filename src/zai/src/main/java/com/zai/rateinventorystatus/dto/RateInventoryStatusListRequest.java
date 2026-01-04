package com.zai.rateinventorystatus.dto;

import lombok.Data;
import java.util.List;

/**
 * 房价库存状态查询请求DTO
 */
@Data
public class RateInventoryStatusListRequest {
    
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
     * 房价码列表
     */
    private List<String> rateCode;
    
    /**
     * 开始日期
     */
    private String startDate;
    
    /**
     * 结束日期
     */
    private String endDate;
    
    /**
     * 房价码开关状态，O表示开启，C表示关闭
     */
    private String isAvailable;
    
    /**
     * 预订支付类型
     */
    private String paymentType;
    
    /**
     * 页码
     */
    private Integer pageNum = 1;
    
    /**
     * 每页大小
     */
    private Integer pageSize = 10;
} 