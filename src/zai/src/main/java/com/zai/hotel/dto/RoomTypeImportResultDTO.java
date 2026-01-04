package com.zai.hotel.dto;

import com.zai.roomtype.entity.RoomType;
import lombok.Data;
import java.util.List;

/**
 * 房型导入结果DTO
 */
@Data
public class RoomTypeImportResultDTO {
    /**
     * 成功导入的房型列表
     */
    private List<RoomType> importedRoomTypes;
    
    /**
     * 重复的房型列表（已存在）
     */
    private List<RoomType> duplicateRoomTypes;
    
    /**
     * 导入失败的房型列表
     */
    private List<RoomType> errorRoomTypes;
    
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