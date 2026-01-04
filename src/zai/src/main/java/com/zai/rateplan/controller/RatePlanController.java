package com.zai.rateplan.controller;

import com.zai.common.BaseResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zai.rateplan.entity.RatePlan;
import com.zai.rateplan.service.RatePlanService;
import com.zai.rateplan.dto.RatePlanBindRequest;
import com.zai.rateplan.dto.RatePlanBindListRequest;
import com.zai.rateplan.dto.RatePlanListRequest;
import com.zai.rateplan.dto.RoomTypeBindInfo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/rateplan")
public class RatePlanController {
    private static final Logger logger = LoggerFactory.getLogger(RatePlanController.class);
    private static final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    private RatePlanService ratePlanService;

    @PostMapping("/list")
    @ResponseBody
    public BaseResponse<List<RatePlan>> ratePlanList(@RequestBody RatePlanListRequest request) {
        try {
            // 打印请求体
            logger.debug("RatePlan请求体: {}", objectMapper.writeValueAsString(request));

            // 验证请求对象
            if (request == null) {
                return BaseResponse.error("请求体不能为空");
            }

            // 验证必填字段
            if (request.getHotelId() == null || request.getHotelId().trim().isEmpty()) {
                return BaseResponse.error("酒店ID不能为空");
            }

            // 调用服务层获取房型组件列表
            List<RatePlan> ratePlans = ratePlanService.getRatePlansByHotelAndRateCodeAndRoomType(
            request.getHotelId(), 
            request.getRoomTypeId(), 
            request.getRatecodeId());
            
            // 记录返回结果
            logger.debug("返回RatePlan列表数量: {}", ratePlans.size());
            
            return BaseResponse.success(ratePlans);
        } catch (Exception e) {
            logger.error("获取RatePlan选择列表失败", e);
            return BaseResponse.error("获取RatePlan选择列表失败: " + e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createRatePlan(
            @RequestBody Map<String, String> payload,
            HttpSession session) {
        String rateCodeId = payload.get("rateCodeId");
        String roomTypeId = payload.get("roomTypeId");
        String chainId = (String) session.getAttribute("ChainId");
        String hotelId = (String) session.getAttribute("HotelId");
        Map<String, Object> response = new HashMap<>();
        if (chainId == null || hotelId == null) {
            response.put("success", false);
            response.put("message", "请先选择集团和酒店");
            return ResponseEntity.badRequest().body(response);
        }
        ratePlanService.createRatePlan(chainId, hotelId, roomTypeId, rateCodeId);
        response.put("success", true);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping
    public ResponseEntity<Map<String, Object>> deleteRatePlan(
            @RequestParam String rateCodeId,
            @RequestParam String roomTypeId,
            HttpSession session) {
        String chainId = (String) session.getAttribute("ChainId");
        String hotelId = (String) session.getAttribute("HotelId");
        Map<String, Object> response = new HashMap<>();
        if (chainId == null || hotelId == null) {
            response.put("success", false);
            response.put("message", "请先选择集团和酒店");
            return ResponseEntity.badRequest().body(response);
        }
        ratePlanService.deleteRatePlan(chainId, hotelId, roomTypeId, rateCodeId);
        response.put("success", true);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/bind")
    public ResponseEntity<Map<String, Object>> bindRatePlan(
        @RequestBody RatePlanBindRequest request) {
        try {
            // 打印请求体
            logger.debug("接收到的请求体: {}", objectMapper.writeValueAsString(request));

            // 验证请求对象
            if (request == null) {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "请求体不能为空"));
            }

            // 验证必填字段
            if (request.getChainId() == null || request.getChainId().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "连锁ID不能为空"));
            }
            if (request.getHotelId() == null || request.getHotelId().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "酒店ID不能为空"));
            }
            if (request.getRatecodeId() == null || request.getRatecodeId().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "价格方案ID不能为空"));
            }
            if (request.getRoomtypeId() == null || request.getRoomtypeId().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "房型ID列表不能为空"));
            }
            
            // 清除现有的价格方案绑定
            ratePlanService.deleteRatePlansByChainAndHotel(request.getChainId(), request.getHotelId(), request.getRatecodeId());

            // 创建新的价格方案绑定
            for (String roomTypeId : request.getRoomtypeId()) {
                ratePlanService.createRatePlan(
                    request.getChainId(),
                    request.getHotelId(),
                    roomTypeId,
                    request.getRatecodeId()
                );
            }

            logger.debug("价格方案绑定成功 - chainId: {}, hotelId: {}, ratecodeId: {}, roomtypeIds: {}",
                request.getChainId(), request.getHotelId(), request.getRatecodeId(), request.getRoomtypeId());

            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "价格方案绑定成功"
            ));
        } catch (Exception e) {
            logger.error("价格方案绑定失败", e);
            return ResponseEntity.status(500)
                .body(Map.of("success", false, "message", "价格方案绑定失败: " + e.getMessage()));
        }
    }

    @PostMapping("/bind/list")
    public ResponseEntity<Map<String, Object>> bindList(@RequestBody RatePlanBindListRequest request) {
        try {
            // 打印请求体
            logger.debug("接收到的请求体: {}", objectMapper.writeValueAsString(request));

            // 验证请求对象
            if (request == null) {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "请求体不能为空"));
            }

            // 验证必填字段
            if (request.getChainId() == null || request.getChainId().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "连锁ID不能为空"));
            }
            if (request.getHotelId() == null || request.getHotelId().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "酒店ID不能为空"));
            }
            if (request.getRatecodeId() == null || request.getRatecodeId().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "价格方案ID不能为空"));
            }

            // 获取房型绑定信息列表
            List<RoomTypeBindInfo> roomTypeBindInfos = ratePlanService.getRoomTypeBindInfo(
                request.getChainId(),
                request.getHotelId(),
                request.getRatecodeId()
            );

            logger.debug("获取房型绑定信息成功 - chainId: {}, hotelId: {}, ratecodeId: {}, 数量: {}",
                request.getChainId(), request.getHotelId(), request.getRatecodeId(), roomTypeBindInfos.size());

            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "获取房型信息成功",
                "data", roomTypeBindInfos
            ));
        } catch (Exception e) {
            logger.error("获取房型绑定信息失败", e);
            return ResponseEntity.status(500)
                .body(Map.of("success", false, "message", "获取房型绑定信息失败: " + e.getMessage()));
        }
    }

    /**
     * 通过酒店ID查询所有房型和房价码
     * 
     * @param hotelId 酒店ID
     * @return 价格方案列表
     */
    @GetMapping("/selectRatePlanByHotelId")
    public ResponseEntity<Map<String, Object>> selectRatePlanByHotelId(
        @RequestParam String hotelId) {
        try {
            logger.debug("查询酒店价格方案: hotelId={}", hotelId);
            
            // 验证参数
            if (hotelId == null || hotelId.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "酒店ID不能为空"));
            }

            // 获取价格方案列表
            List<RatePlan> ratePlans = ratePlanService.selectRatePlansByHotelId(hotelId);
            
            // 按房型分组重组数据
            Map<String, Map<String, Object>> roomTypeMap = new HashMap<>();
            
            for (RatePlan plan : ratePlans) {
                String roomTypeId = plan.getRoomTypeId();
                
                // 如果房型不存在，创建新的房型记录
                if (!roomTypeMap.containsKey(roomTypeId)) {
                    Map<String, Object> roomType = new HashMap<>();
                    roomType.put("roomTypeId", roomTypeId);
                    roomType.put("roomTypeCode", plan.getRoomType());
                    roomType.put("roomTypeName", plan.getRoomTypeName());
                    roomType.put("rateCodes", new ArrayList<>());
                    roomTypeMap.put(roomTypeId, roomType);
                }
                
                // 添加价格方案到对应房型
                Map<String, Object> rateCode = new HashMap<>();
                rateCode.put("rateCodeId", plan.getRateCodeId());
                rateCode.put("rateCodeCode", plan.getRateCode());
                rateCode.put("rateCodeName", plan.getRateCodeName());
                
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> rateCodes = (List<Map<String, Object>>) roomTypeMap.get(roomTypeId).get("rateCodes");
                rateCodes.add(rateCode);
            }
            
            // 构建最终响应
            Map<String, Object> response = new HashMap<>();
            response.put("roomTypes", new ArrayList<>(roomTypeMap.values()));
            
            logger.debug("查询酒店价格方案成功 - hotelId: {}, 房型数量: {}", hotelId, roomTypeMap.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("查询酒店价格方案失败: hotelId={}, error={}", hotelId, e.getMessage(), e);
            return ResponseEntity.status(500)
                .body(Map.of("success", false, "message", "查询酒店价格方案失败: " + e.getMessage()));
        }
    }
    
} 