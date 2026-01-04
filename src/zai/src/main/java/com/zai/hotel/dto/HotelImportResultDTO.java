package com.zai.hotel.dto;

import com.zai.hotel.entity.Hotel;
import lombok.Data;
import java.util.List;

/**
 * 酒店导入结果DTO
 */
@Data
public class HotelImportResultDTO {
    /**
     * 成功导入的酒店列表
     */
    private List<Hotel> importedHotels;
    
    /**
     * 重复的酒店列表（已存在）
     */
    private List<Hotel> duplicateHotels;
    
    /**
     * 导入失败的酒店列表
     */
    private List<Hotel> errorHotels;
    
    /**
     * 总数量
     */
    private Integer totalCount;
    
    /**
     * 成功导入数量
     */
    private Integer importedCount;
    
    /**
     * 重复数量
     */
    private Integer duplicateCount;
    
    /**
     * 失败数量
     */
    private Integer errorCount;
} 