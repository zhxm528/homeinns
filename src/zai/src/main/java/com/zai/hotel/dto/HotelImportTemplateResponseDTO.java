package com.zai.hotel.dto;

import lombok.Data;

/**
 * 酒店导入模板响应DTO
 */
@Data
public class HotelImportTemplateResponseDTO {
    /**
     * 文件内容（Base64编码）
     */
    private String fileContent;
    
    /**
     * 文件名
     */
    private String fileName;
    
    /**
     * 下载链接
     */
    private String downloadUrl;
} 