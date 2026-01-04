package com.zai.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Value;
import javax.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.apache.poi.openxml4j.util.ZipSecureFile;

/**
 * POI Excel 安全配置类
 * 用于配置 Apache POI 的安全参数，防止 Zip Bomb 攻击
 */
@Configuration
@ConfigurationProperties(prefix = "poi.security")
public class PoiSecurityConfig {
    
    private static final Logger logger = LoggerFactory.getLogger(PoiSecurityConfig.class);
    
    @Value("${poi.security.min-inflate-ratio:0.001}")
    private String minInflateRatio;
    
    @Value("${poi.security.max-file-size:10485760}")
    private long maxFileSize;
    
    @Value("${poi.security.allowed-file-types:xlsx,xls}")
    private String allowedFileTypes;
    
    // 静态代码块，在类加载时就设置POI安全参数
    static {
        try {
            // 设置POI安全参数，使用更小的压缩比阈值
            ZipSecureFile.setMinInflateRatio(0.001);
            System.setProperty("org.apache.poi.openxml4j.util.ZipArchiveThresholdInputStream.MIN_INFLATE_RATIO", "0.001");
            logger.info("POI 安全配置已静态初始化 - 最小压缩比: 0.001");
        } catch (Exception e) {
            logger.error("POI 安全配置静态初始化失败", e);
        }
    }
    
    @PostConstruct
    public void init() {
        try {
            // 再次设置 POI 安全参数，确保配置生效
            ZipSecureFile.setMinInflateRatio(Double.parseDouble(minInflateRatio));
            System.setProperty("org.apache.poi.openxml4j.util.ZipArchiveThresholdInputStream.MIN_INFLATE_RATIO", minInflateRatio);
            logger.info("POI 安全配置已初始化 - 最小压缩比: {}, 最大文件大小: {} bytes, 允许文件类型: {}", 
                       minInflateRatio, maxFileSize, allowedFileTypes);
        } catch (Exception e) {
            logger.error("POI 安全配置初始化失败", e);
        }
    }
    
    // Getter 方法
    public String getMinInflateRatio() {
        return minInflateRatio;
    }
    
    public long getMaxFileSize() {
        return maxFileSize;
    }
    
    public String getAllowedFileTypes() {
        return allowedFileTypes;
    }
    
    /**
     * 验证文件类型是否允许
     * @param fileName 文件名
     * @return 是否允许
     */
    public boolean isAllowedFileType(String fileName) {
        if (fileName == null) return false;
        
        String[] allowedTypes = allowedFileTypes.split(",");
        for (String type : allowedTypes) {
            if (fileName.toLowerCase().endsWith("." + type.trim())) {
                return true;
            }
        }
        return false;
    }
    
    /**
     * 验证文件大小是否在允许范围内
     * @param fileSize 文件大小
     * @return 是否允许
     */
    public boolean isAllowedFileSize(long fileSize) {
        return fileSize <= maxFileSize;
    }
} 