package com.zai.roomtypestatus.controller;

import com.zai.common.BaseResponse;
import com.zai.roomtypestatus.dto.RoomTypeStatusAddRequest;
import com.zai.roomtypestatus.dto.RoomTypeStatusListRequest;
import com.zai.roomtypestatus.dto.RoomTypeStatusUpdateRequest;
import com.zai.roomtypestatus.service.RoomTypeStatusService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * 房型库存状态控制器
 */
@RestController
@RequestMapping("/api/roomtypestatus")
public class RoomTypeStatusController {
    
    private static final Logger log = LoggerFactory.getLogger(RoomTypeStatusController.class);
    
    @Autowired
    private RoomTypeStatusService roomTypeStatusService;
    
    /**
     * 添加房型库存状态
     * @param request 添加请求
     * @return 响应结果
     */
    @PostMapping("/add")
    public BaseResponse add(@RequestBody RoomTypeStatusAddRequest request) {
        log.info("添加房型库存状态请求: chainId={}, hotelId={}, roomTypeCode={}, rateCode={}, stayDate={}", 
                request.getChainId(), request.getHotelId(), request.getRoomTypeCode(), 
                request.getRateCode(), request.getStayDate());
        
        BaseResponse response = roomTypeStatusService.add(request);
        
        log.info("添加房型库存状态响应: success={}, message={}", 
                response.isSuccess(), response.getMessage());
        
        return response;
    }
    
    /**
     * 更新房型库存状态
     * @param request 更新请求
     * @return 响应结果
     */
    @PostMapping("/update")
    public BaseResponse update(@RequestBody RoomTypeStatusUpdateRequest request) {
        log.info("更新房型库存状态请求: roomtypeStatusId={}", request.getRoomtypeStatusId());
        
        BaseResponse response = roomTypeStatusService.update(request);
        
        log.info("更新房型库存状态响应: success={}, message={}", 
                response.isSuccess(), response.getMessage());
        
        return response;
    }
    
    /**
     * 删除房型库存状态
     * @param roomtypeStatusId 状态记录ID
     * @return 响应结果
     */
    @DeleteMapping("/delete/{roomtypeStatusId}")
    public BaseResponse delete(@PathVariable String roomtypeStatusId) {
        log.info("删除房型库存状态请求: roomtypeStatusId={}", roomtypeStatusId);
        
        BaseResponse response = roomTypeStatusService.delete(roomtypeStatusId);
        
        log.info("删除房型库存状态响应: success={}, message={}", 
                response.isSuccess(), response.getMessage());
        
        return response;
    }
    
    /**
     * 查询房型库存状态列表
     * @param request 查询请求
     * @return 响应结果
     */
    @PostMapping("/list")
    public BaseResponse list(@RequestBody RoomTypeStatusListRequest request) {
        log.info("查询房型库存状态列表请求: chainId={}, hotelId={}, startDate={}, endDate={}", 
                request.getChainId(), request.getHotelId(), request.getStartDate(), request.getEndDate());
        
        BaseResponse response = roomTypeStatusService.list(request);
        
        log.info("查询房型库存状态列表响应: success={}, dataSize={}", 
                response.isSuccess(), response.getData() != null ? "有数据" : "无数据");
        
        return response;
    }
    
    /**
     * 根据ID查询房型库存状态
     * @param roomtypeStatusId 状态记录ID
     * @return 响应结果
     */
    @GetMapping("/get/{roomtypeStatusId}")
    public BaseResponse getById(@PathVariable String roomtypeStatusId) {
        log.info("根据ID查询房型库存状态请求: roomtypeStatusId={}", roomtypeStatusId);
        
        BaseResponse response = roomTypeStatusService.getById(roomtypeStatusId);
        
        log.info("根据ID查询房型库存状态响应: success={}, message={}", 
                response.isSuccess(), response.getMessage());
        
        return response;
    }
    
    /**
     * 批量添加房型库存状态
     * @param request 添加请求
     * @return 响应结果
     */
    @PostMapping("/batch-add")
    public BaseResponse batchAdd(@RequestBody RoomTypeStatusAddRequest request) {
        log.info("批量添加房型库存状态请求: chainId={}, hotelId={}", 
                request.getChainId(), request.getHotelId());
        
        BaseResponse response = roomTypeStatusService.batchAdd(request);
        
        log.info("批量添加房型库存状态响应: success={}, message={}", 
                response.isSuccess(), response.getMessage());
        
        return response;
    }

    
} 