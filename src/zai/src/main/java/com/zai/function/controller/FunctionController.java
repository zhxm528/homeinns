package com.zai.function.controller;

import com.zai.common.BaseResponse;
import com.zai.function.dto.FunctionAddRequest;
import com.zai.function.dto.FunctionUpdateRequest;
import com.zai.function.dto.FunctionListRequest;
import com.zai.function.dto.FunctionCheckCodeRequest;
import com.zai.function.service.FunctionService;
import com.google.gson.Gson;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/function")
public class FunctionController {
    
    private static final Logger log = LoggerFactory.getLogger(FunctionController.class);
    private static final Gson gson = new Gson();
    
    @Autowired
    private FunctionService functionService;
    
    /**
     * 获取功能列表
     */
    @PostMapping("/list")
    @ResponseBody
    public ResponseEntity<BaseResponse> functionList(@RequestBody FunctionListRequest request) {
        log.debug("请求体: {}", gson.toJson(request));
        BaseResponse response = functionService.list(request);
        log.debug("响应体: {}", gson.toJson(response));
        return ResponseEntity.ok(response);
    }
    
    /**
     * 新增功能
     */
    @PostMapping("/add")
    @ResponseBody
    public ResponseEntity<BaseResponse> functionAdd(@RequestBody FunctionAddRequest request) {
        log.debug("请求体: {}", gson.toJson(request));
        BaseResponse response = functionService.add(request);
        log.debug("响应体: {}", gson.toJson(response));
        return ResponseEntity.ok(response);
    }
    
    /**
     * 更新功能
     */
    @PutMapping("/update")
    @ResponseBody
    public ResponseEntity<BaseResponse> functionUpdate(@RequestBody FunctionUpdateRequest request) {
        log.debug("请求体: {}", gson.toJson(request));
        BaseResponse response = functionService.update(request);
        log.debug("响应体: {}", gson.toJson(response));
        return ResponseEntity.ok(response);
    }
    
    /**
     * 获取功能详情
     */
    @GetMapping("/{id}")
    public ResponseEntity<BaseResponse> functionGetById(@PathVariable String id) {
        log.debug("获取功能详情ID: {}", id);
        BaseResponse response = functionService.getById(id);
        log.debug("响应体: {}", gson.toJson(response));
        return ResponseEntity.ok(response);
    }
    
    /**
     * 删除功能
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<BaseResponse> functionDelete(@PathVariable String id) {
        log.debug("删除功能ID: {}", id);
        BaseResponse response = functionService.delete(id);
        log.debug("响应体: {}", gson.toJson(response));
        return ResponseEntity.ok(response);
    }
    
    /**
     * 验证功能代码唯一性
     */
    @PostMapping("/check-code")
    @ResponseBody
    public ResponseEntity<BaseResponse> functionCheckCode(@RequestBody FunctionCheckCodeRequest request) {
        log.debug("请求体: {}", gson.toJson(request));
        BaseResponse response = functionService.checkCode(request);
        log.debug("响应体: {}", gson.toJson(response));
        return ResponseEntity.ok(response);
    }
    
    /**
     * 获取上级功能列表
     */
    @GetMapping("/parent/list")
    public ResponseEntity<BaseResponse> functionParentList() {
        log.debug("获取上级功能列表");
        BaseResponse response = functionService.getParentList();
        log.debug("响应体: {}", gson.toJson(response));
        return ResponseEntity.ok(response);
    }
} 