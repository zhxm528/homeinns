package com.zai.rateprices.controller;

import com.google.gson.Gson;
import com.zai.common.BaseResponse;
import com.zai.rateprices.dto.RatePriceAddRequest;
import com.zai.rateprices.dto.RatePriceByHotelRequest;
import com.zai.rateprices.dto.RatePriceByRoomTypeRequest;
import com.zai.rateprices.dto.RatePriceListRequest;
import com.zai.rateprices.dto.RatePriceMaintenanceRequest;
import com.zai.rateprices.dto.RatePriceUpdateRequest;
import com.zai.rateprices.dto.BookingByHotelRateCodeRequest;
import com.zai.rateprices.service.RatePriceService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.zai.rateprices.model.AvailabilityRequestModel;
import com.zai.rateprices.model.AvailabilityResponseModel;
import com.zai.rateprices.model.AvailabilityResponseModel.AvailabilityDataModel;
import com.zai.rateprices.model.AvailabilityResponseModel.AvailabilityHotelModel;
import com.zai.rateprices.model.AvailabilityResponseModel.DailyDataModel;
import com.zai.rateprices.model.AvailabilityResponseModel.AvailabilityRoomTypeModel;
import com.zai.rateprices.dto.RatePriceByRateCodeRequest;

/**
 * 房价价格控制器
 */
@RestController
@RequestMapping("/api/rateprices")
public class RatePriceController {
    
    private static final Logger log = LoggerFactory.getLogger(RatePriceController.class);
    private static final Gson gson = new Gson();
    
    @Autowired
    private RatePriceService ratePriceService;
    
    /**
     * 添加房价价格
     */
    @PostMapping("/add")
    @ResponseBody
    public ResponseEntity<BaseResponse> ratePriceAdd(@RequestBody RatePriceAddRequest request) {
        log.debug("请求体: {}", gson.toJson(request));
        BaseResponse response = ratePriceService.add(request);
        log.debug("响应: success={}, message={}", response.isSuccess(), response.getMessage());
        return ResponseEntity.ok(response);
    }
    
    /**
     * 更新房价价格
     */
    @PutMapping("/update")
    @ResponseBody
    public ResponseEntity<BaseResponse> ratePriceUpdate(@RequestBody RatePriceUpdateRequest request) {
        log.debug("请求体: {}", gson.toJson(request));
        BaseResponse response = ratePriceService.update(request);
        log.debug("响应: success={}, message={}", response.isSuccess(), response.getMessage());
        return ResponseEntity.ok(response);
    }
    
    /**
     * 删除房价价格
     */
    @DeleteMapping("/{priceId}")
    public ResponseEntity<BaseResponse> ratePriceDelete(@PathVariable String priceId) {
        log.debug("删除ID: {}", priceId);
        BaseResponse response = ratePriceService.delete(priceId);
        log.debug("响应: success={}, message={}", response.isSuccess(), response.getMessage());
        return ResponseEntity.ok(response);
    }
    
    /**
     * 查询房价价格列表
     */
    @PostMapping("/list")
    @ResponseBody
    public ResponseEntity<BaseResponse> ratePriceList(@RequestBody RatePriceListRequest request) {
        log.debug("请求体: {}", gson.toJson(request));
        BaseResponse response = ratePriceService.list(request);
        log.debug("响应: success={}, message={}", response.isSuccess(), response.getMessage());
        return ResponseEntity.ok(response);
    }
    
    /**
     * 根据ID查询房价价格
     */
    @GetMapping("/{priceId}")
    public ResponseEntity<BaseResponse> getRatePriceById(@PathVariable String priceId) {
        log.debug("查询ID: {}", priceId);
        BaseResponse response = ratePriceService.getById(priceId);
        log.debug("响应: success={}, message={}", response.isSuccess(), response.getMessage());
        return ResponseEntity.ok(response);
    }
    
    /**
     * 批量添加房价价格
     */
    @PostMapping("/batch/add")
    @ResponseBody
    public ResponseEntity<BaseResponse> ratePriceBatchAdd(@RequestBody RatePriceAddRequest request) {
        log.debug("请求体: {}", gson.toJson(request));
        BaseResponse response = ratePriceService.batchAdd(request);
        log.debug("响应: success={}, message={}", response.isSuccess(), response.getMessage());
        return ResponseEntity.ok(response);
    }
    
    /**
     * 日历查询
     */
    @PostMapping("/calendar")
    @ResponseBody
    public ResponseEntity<BaseResponse> calendar(@RequestBody AvailabilityRequestModel request) {
        log.debug("日历查询请求体: {}", gson.toJson(request));
        BaseResponse response = ratePriceService.calendar(request);
        log.debug("日历查询响应: success={}, message={}", response.isSuccess(), response.getMessage());
        return ResponseEntity.ok(response);
    }

    /**
     * 根据酒店ID和入住日期设置酒店库存状态
     */
    @PostMapping("/dailyhotelstatus")
    @ResponseBody
    public ResponseEntity<BaseResponse> setRatePricesByHotel(@RequestBody RatePriceByHotelRequest request) {
        log.debug("根据酒店ID和入住日期设置酒店库存状态请求体: {}", gson.toJson(request));
        BaseResponse response = ratePriceService.setRatePricesByHotel(request);
        log.debug("根据酒店ID和入住日期设置酒店库存状态响应: success={}, message={}", 
            response.isSuccess(), response.getMessage());
        return ResponseEntity.ok(response);
    }
    /**
     * 根据酒店ID和入住日期设置酒店库存状态
     */
    @PostMapping("/dailyroomtypestatus")
    @ResponseBody
    public ResponseEntity<BaseResponse> setDailyRoomTypeStatus(@RequestBody RatePriceByRoomTypeRequest request) {
        log.debug("根据酒店ID和入住日期设置酒店库存状态请求体: {}", gson.toJson(request));
        BaseResponse response = ratePriceService.setDailyRoomTypeStatus(request);
        log.debug("根据酒店ID和入住日期设置酒店库存状态响应: success={}, message={}", 
            response.isSuccess(), response.getMessage());
        return ResponseEntity.ok(response);
    }

    
    /**
     * 根据酒店ID和入住日期设置酒店库存状态
     */
    @PostMapping("/dailyratecodestatus")
    @ResponseBody
    public ResponseEntity<BaseResponse> setDailyRateCodeStatus(@RequestBody RatePriceByRateCodeRequest request) {
        log.debug("根据酒店ID和入住日期设置酒店库存状态请求体: {}", gson.toJson(request));
        BaseResponse response = ratePriceService.setDailyRateCodeStatus(request);
        log.debug("根据酒店ID和入住日期设置酒店库存状态响应: success={}, message={}", 
            response.isSuccess(), response.getMessage());
        return ResponseEntity.ok(response);
    }
    /**
     * 维护房价
     */
    @PostMapping("/maintain")
    @ResponseBody
    public ResponseEntity<BaseResponse> maintainRatePrice(@RequestBody RatePriceMaintenanceRequest request) {
        log.debug("维护房价请求体: {}", gson.toJson(request));
        BaseResponse response = ratePriceService.maintainRatePrice(request);
        log.debug("维护房价响应: success={}, message={}", response.isSuccess(), response.getMessage());
        return ResponseEntity.ok(response);
    }


    /**
     * 根据酒店ID和价格代码查询预订信息
     */
    @PostMapping("/booking/byHotelRateCode")
    @ResponseBody
    public ResponseEntity<BaseResponse> bookingByHotelRateCode(@RequestBody BookingByHotelRateCodeRequest request) {
        log.debug("根据酒店ID和价格代码查询预订信息请求体: {}", gson.toJson(request));
        BaseResponse response = ratePriceService.bookingByHotelRateCodeService(request);
        log.debug("根据酒店ID和价格代码查询预订信息响应: success={}, message={}", response.isSuccess(), response.getMessage());
        return ResponseEntity.ok(response);
    }
    
    
} 