package com.zai.chain.controller;

import com.zai.chain.service.HomeinnsService;
import com.zai.chain.dto.HomeinnsChannelRmTypeRequest;
import com.zai.common.BaseResponse;
import com.google.gson.Gson;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/homeinns")
public class HomeinnsController {
    
    private static final Logger logger = LoggerFactory.getLogger(HomeinnsController.class);
    private static final Gson gson = new Gson();
    
    @Autowired
    private HomeinnsService homeinnsService;
    
    /**
     * 查询渠道合作酒店房型 (POST方式)
     * @param request 请求参数
     * @return 渠道房型信息
     */
    @PostMapping("/channel-rmtype")
    @ResponseBody
    public ResponseEntity<BaseResponse> getChannelRmType(@RequestBody HomeinnsChannelRmTypeRequest request) {
        logger.debug("请求体: {}", gson.toJson(request));
        
        BaseResponse response = homeinnsService.getChannelRmTypeStar(request);
        
        logger.debug("响应体: {}", gson.toJson(response));
        return ResponseEntity.ok(response);
    }
    
    /**
     * 查询渠道合作酒店房型 (GET方式，用于测试)
     * @return 渠道房型信息
     */
    @GetMapping("/channel-rmtype")
    @ResponseBody
    public ResponseEntity<BaseResponse> getChannelRmTypeGet() {
        logger.debug("GET请求 - 使用配置文件中的终端许可证号");
        
        HomeinnsChannelRmTypeRequest request = new HomeinnsChannelRmTypeRequest();
        BaseResponse response = homeinnsService.getChannelRmTypeStar(request);
        
        logger.debug("响应体: {}", gson.toJson(response));
        return ResponseEntity.ok(response);
    }
}
