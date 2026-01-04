package com.zai.config;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonSerializer;
import com.google.gson.JsonDeserializer;
import com.google.gson.JsonElement;
import com.google.gson.JsonPrimitive;
import com.google.gson.JsonSerializationContext;
import com.google.gson.JsonDeserializationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import java.lang.reflect.Type;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * Gson配置类
 * 用于配置JSON序列化和反序列化
 */
@Configuration
public class GsonConfig {
    
    /**
     * LocalDateTime序列化器
     */
    private static final JsonSerializer<LocalDateTime> LOCAL_DATE_TIME_SERIALIZER = 
        (src, typeOfSrc, context) -> {
            if (src == null) {
                return null;
            }
            return new JsonPrimitive(src.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        };
    
    /**
     * LocalDateTime反序列化器
     */
    private static final JsonDeserializer<LocalDateTime> LOCAL_DATE_TIME_DESERIALIZER = 
        (json, typeOfT, context) -> {
            if (json == null || json.isJsonNull()) {
                return null;
            }
            String dateStr = json.getAsString();
            if (dateStr == null || dateStr.trim().isEmpty()) {
                return null;
            }
            return LocalDateTime.parse(dateStr, DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        };
    
    /**
     * 配置Gson，支持LocalDateTime序列化和反序列化
     */
    @Bean
    @Primary
    public Gson gson() {
        return new GsonBuilder()
                .setDateFormat("yyyy-MM-dd HH:mm:ss")
                .registerTypeAdapter(LocalDateTime.class, LOCAL_DATE_TIME_SERIALIZER)
                .registerTypeAdapter(LocalDateTime.class, LOCAL_DATE_TIME_DESERIALIZER)
                .create();
    }
} 