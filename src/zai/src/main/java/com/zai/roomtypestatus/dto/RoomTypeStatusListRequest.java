package com.zai.roomtypestatus.dto;

import lombok.Data;
import java.util.List;

/**
 * 房型库存状态查询请求DTO
 */
@Data
public class RoomTypeStatusListRequest {
    
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
     * 页码
     */
    private Integer pageNum = 1;
    
    /**
     * 每页大小
     */
    private Integer pageSize = 10;
} 