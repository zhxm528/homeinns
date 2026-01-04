package com.zai.rateinventorystatus.controller;

import com.google.gson.Gson;
import com.zai.common.BaseResponse;
import com.zai.rateinventorystatus.dto.RateInventoryStatusAddRequest;
import com.zai.rateinventorystatus.dto.RateInventoryStatusListRequest;
import com.zai.rateinventorystatus.dto.RateInventoryStatusUpdateRequest;
import com.zai.rateinventorystatus.dto.AvailInventoryRequest;
import com.zai.rateinventorystatus.entity.RateInventoryStatus;
import com.zai.rateinventorystatus.service.RateInventoryStatusService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 房价库存状态API
 */
@RestController
@RequestMapping("/api/rateinventorystatus")
public class RateInventoryStatusController {
    private static final Logger logger = LoggerFactory.getLogger(RateInventoryStatusController.class);
    private static final Gson gson = new Gson();

    @Autowired
    private RateInventoryStatusService rateInventoryStatusService;

    /**
     * 新增房价库存状态
     */
    @PostMapping("/add")
    @ResponseBody
    public ResponseEntity<BaseResponse> rateInventoryStatusAdd(@RequestBody RateInventoryStatusAddRequest request) {
        logger.debug("请求体: {}", gson.toJson(request));
        BaseResponse response = rateInventoryStatusService.addRateInventoryStatus(request);
        logger.debug("响应体: {}", gson.toJson(response));
        return ResponseEntity.ok(response);
    }

    /**
     * 更新房价库存状态
     */
    @PutMapping("/update")
    @ResponseBody
    public ResponseEntity<BaseResponse> rateInventoryStatusUpdate(@RequestBody RateInventoryStatusUpdateRequest request) {
        logger.debug("请求体: {}", gson.toJson(request));
        BaseResponse response = rateInventoryStatusService.updateRateInventoryStatus(request);
        logger.debug("响应体: {}", gson.toJson(response));
        return ResponseEntity.ok(response);
    }

    /**
     * 删除房价库存状态
     */
    @DeleteMapping("/delete")
    @ResponseBody
    public ResponseEntity<BaseResponse> rateInventoryStatusDelete(@RequestParam String chainId,
                                                                 @RequestParam String hotelId,
                                                                 @RequestParam String rateCode,
                                                                 @RequestParam String roomTypeCode,
                                                                 @RequestParam String stayDate) {
        logger.debug("删除参数: chainId={}, hotelId={}, rateCode={}, roomTypeCode={}, stayDate={}", 
                    chainId, hotelId, rateCode, roomTypeCode, stayDate);
        BaseResponse response = rateInventoryStatusService.deleteRateInventoryStatus(chainId, hotelId, rateCode, roomTypeCode, stayDate);
        logger.debug("响应体: {}", gson.toJson(response));
        return ResponseEntity.ok(response);
    }

    /**
     * 查询房价库存状态列表
     */
    @PostMapping("/list")
    @ResponseBody
    public ResponseEntity<BaseResponse> rateInventoryStatusList(@RequestBody RateInventoryStatusListRequest request) {
        logger.debug("请求体: {}", gson.toJson(request));
        BaseResponse response = rateInventoryStatusService.getRateInventoryStatusList(request);
        logger.debug("响应体: {}", gson.toJson(response));
        return ResponseEntity.ok(response);
    }

    /**
     * 查询单条房价库存状态
     */
    @GetMapping("/get")
    @ResponseBody
    public ResponseEntity<BaseResponse> rateInventoryStatusGet(@RequestParam String chainId,
                                                              @RequestParam String hotelId,
                                                              @RequestParam String rateCode,
                                                              @RequestParam String roomTypeCode,
                                                              @RequestParam String stayDate) {
        logger.debug("查询参数: chainId={}, hotelId={}, rateCode={}, roomTypeCode={}, stayDate={}", 
                    chainId, hotelId, rateCode, roomTypeCode, stayDate);
        BaseResponse response = rateInventoryStatusService.getRateInventoryStatus(chainId, hotelId, rateCode, roomTypeCode, stayDate);
        logger.debug("响应体: {}", gson.toJson(response));
        return ResponseEntity.ok(response);
    }

    /**
     * 批量新增房价库存状态
     */
    @PostMapping("/batch/add")
    @ResponseBody
    public ResponseEntity<BaseResponse> rateInventoryStatusBatchAdd(@RequestBody List<RateInventoryStatusAddRequest> requestList) {
        logger.debug("批量新增请求体: {}", gson.toJson(requestList));
        BaseResponse response = rateInventoryStatusService.batchAddRateInventoryStatus(requestList);
        logger.debug("响应体: {}", gson.toJson(response));
        return ResponseEntity.ok(response);
    }

    /**
     * 批量更新房价库存状态
     */
    @PutMapping("/batch/update")
    @ResponseBody
    public ResponseEntity<BaseResponse> rateInventoryStatusBatchUpdate(@RequestBody List<RateInventoryStatusUpdateRequest> requestList) {
        logger.debug("批量更新请求体: {}", gson.toJson(requestList));
        BaseResponse response = rateInventoryStatusService.batchUpdateRateInventoryStatus(requestList);
        logger.debug("响应体: {}", gson.toJson(response));
        return ResponseEntity.ok(response);
    }

    /**
     * 根据日期范围删除房价库存状态
     */
    @DeleteMapping("/delete-by-date-range")
    @ResponseBody
    public ResponseEntity<BaseResponse> rateInventoryStatusDeleteByDateRange(@RequestParam String chainId,
                                                                             @RequestParam String hotelId,
                                                                             @RequestParam String startDate,
                                                                             @RequestParam String endDate) {
        logger.debug("根据日期范围删除参数: chainId={}, hotelId={}, startDate={}, endDate={}", 
                    chainId, hotelId, startDate, endDate);
        BaseResponse response = rateInventoryStatusService.deleteRateInventoryStatusByDateRange(chainId, hotelId, startDate, endDate);
        logger.debug("响应体: {}", gson.toJson(response));
        return ResponseEntity.ok(response);
    }

    @PostMapping("/avail/inventory")
    @ResponseBody
    public ResponseEntity<BaseResponse> availInventory(
        @RequestBody AvailInventoryRequest request) {
        logger.debug("availInventory请求体: {}", gson.toJson(request));
        BaseResponse response = rateInventoryStatusService.availInventory(request);
        logger.debug("availInventory响应体: {}", gson.toJson(response));
        return ResponseEntity.ok(response);
    }
} 