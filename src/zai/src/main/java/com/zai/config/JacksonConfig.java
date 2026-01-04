package com.zai.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * Jackson配置类
 * 用于配置JSON序列化和反序列化，支持Java 8时间类型
 */
@Configuration
public class JacksonConfig {
    
    private static final String DATE_TIME_FORMAT = "yyyy-MM-dd HH:mm:ss";
    
    /**
     * 配置ObjectMapper，支持LocalDateTime序列化和反序列化
     */
    @Bean
    @Primary
    public ObjectMapper objectMapper() {
        ObjectMapper objectMapper = new ObjectMapper();
        
        // 创建JavaTimeModule
        JavaTimeModule javaTimeModule = new JavaTimeModule();
        
        // 注册LocalDateTime序列化器和反序列化器
        javaTimeModule.addSerializer(LocalDateTime.class, 
            new LocalDateTimeSerializer(DateTimeFormatter.ofPattern(DATE_TIME_FORMAT)));
        javaTimeModule.addDeserializer(LocalDateTime.class, 
            new LocalDateTimeDeserializer(DateTimeFormatter.ofPattern(DATE_TIME_FORMAT)));
        
        // 注册模块
        objectMapper.registerModule(javaTimeModule);
        
        return objectMapper;
    }
} 