package com.zai.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.apache.poi.openxml4j.util.ZipSecureFile;

/**
 * POI 启动配置类
 * 在应用启动时设置 POI 安全参数
 */
@Component
public class PoiStartupConfig implements CommandLineRunner {
    
    private static final Logger logger = LoggerFactory.getLogger(PoiStartupConfig.class);
    
    @Value("${poi.security.min-inflate-ratio:0.0001}")
    private String minInflateRatio;
    
    @Override
    public void run(String... args) throws Exception {
        try {
            // 设置 POI 安全参数
            double ratio = Double.parseDouble(minInflateRatio);
            ZipSecureFile.setMinInflateRatio(ratio);
            System.setProperty("org.apache.poi.openxml4j.util.ZipArchiveThresholdInputStream.MIN_INFLATE_RATIO", minInflateRatio);
            
            logger.info("POI 安全参数已在应用启动时设置 - 最小压缩比: {}", minInflateRatio);
        } catch (Exception e) {
            logger.error("设置 POI 安全参数失败", e);
        }
    }
} 