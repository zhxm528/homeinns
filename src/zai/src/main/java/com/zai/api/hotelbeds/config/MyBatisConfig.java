package com.zai.api.hotelbeds.config;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@Configuration
@MapperScan("com.zai.hotel.mapper")
@EnableTransactionManagement
public class MyBatisConfig {
} 