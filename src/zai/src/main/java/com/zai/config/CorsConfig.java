package com.zai.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import java.util.Arrays;

@Configuration
public class CorsConfig {
    
    @Value("${spring.mvc.cors.allowed-origins}")
    private String allowedOrigins;
    
    @Value("${spring.mvc.cors.allowed-methods}")
    private String allowedMethods;
    
    @Value("${spring.mvc.cors.allowed-headers}")
    private String allowedHeaders;
    
    @Value("${spring.mvc.cors.allow-credentials}")
    private boolean allowCredentials;
    
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.addAllowedOrigin(allowedOrigins);
        Arrays.stream(allowedMethods.split(",")).forEach(config::addAllowedMethod);
        Arrays.stream(allowedHeaders.split(",")).forEach(config::addAllowedHeader);
        config.setAllowCredentials(allowCredentials);
        config.setMaxAge(3600L); // 预检请求结果缓存1小时
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
    
    @Bean
    public CorsFilter corsFilter() {
        return new CorsFilter(corsConfigurationSource());
    }
} 