package com.zai.api.homeinns.inithotels.controller;

import com.zai.api.homeinns.inithotels.service.InitHotelsService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 初始化酒店控制器
 */
@Slf4j
@RestController
@RequestMapping("/api/inithotels")
public class InitHotelsController {

    @Autowired
    private InitHotelsService initHotelsService;

    /**
     * 获取并保存所有酒店房型信息
     *
     * @return 处理结果
     */
    @PostMapping("/getAllHotelRoomType")
    public ResponseEntity<String> getAllHotelRoomType() {
        log.info("开始获取所有酒店房型信息");
        String result = initHotelsService.getAllHotelRoomType();
        log.info("获取所有酒店房型信息完成: {}", result);
        return ResponseEntity.ok(result);
    }
} 