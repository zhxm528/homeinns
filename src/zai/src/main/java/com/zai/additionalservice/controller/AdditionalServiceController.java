package com.zai.additionalservice.controller;

import com.zai.additionalservice.entity.AdditionalService;
import com.zai.additionalservice.service.AdditionalServiceService;
import com.zai.additionalservice.dto.AdditionalServiceSelectListRequest;
import com.zai.additionalservice.dto.RateCodeBindRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import javax.servlet.http.HttpSession;
import java.math.BigDecimal;

@RestController
@RequestMapping("/api/additionalservice")
public class AdditionalServiceController {
    private static final Logger logger = LoggerFactory.getLogger(AdditionalServiceController.class);
    private static final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    private AdditionalServiceService additionalServiceService;

    @GetMapping("/list")
    public ResponseEntity<Map<String, Object>> getAdditionalServices(
            @RequestParam(required = false) String serviceName,
            HttpSession session) {
        try {
            // 从Session中获取ChainId
            String chainId = (String) session.getAttribute("ChainId");
            
            if (chainId == null || chainId.trim().isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "请先选择集团");
                return ResponseEntity.badRequest().body(response);
            }
            
            List<AdditionalService> services = additionalServiceService.selectByCondition(
                chainId,
                null,  // hotelId
                null,  // rateCodeId
                serviceName
            );
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", services);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getAdditionalServiceById(@PathVariable String id) {
        try {
            List<AdditionalService> services = additionalServiceService.selectByServiceId(id);
            Map<String, Object> response = new HashMap<>();
            
            if (services.isEmpty()) {
                response.put("success", false);
                response.put("message", "未找到附加服务");
            } else {
                response.put("success", true);
                response.put("data", services.get(0));
            }
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createAdditionalService(@RequestBody AdditionalService service, HttpSession session) {
        try {
            // 从Session中获取ChainId
            String chainId = (String) session.getAttribute("ChainId");
            
            if (chainId == null || chainId.trim().isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "保存失败，请先选择集团");
                return ResponseEntity.badRequest().body(response);
            }
            
            // 设置ChainId
            service.setChainId(chainId);
            
            // 生成serviceId
            String serviceId = java.util.UUID.randomUUID().toString().replace("-", "");
            service.setServiceId(serviceId);
            
            int result = additionalServiceService.insert(service);
            Map<String, Object> response = new HashMap<>();
            response.put("success", result > 0);
            response.put("message", result > 0 ? "创建成功" : "创建失败");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PutMapping("/{serviceId}")
    public ResponseEntity<Map<String, Object>> updateAdditionalService(@PathVariable String serviceId, @RequestBody AdditionalService service, HttpSession session) {
        try {
            // 从Session中获取ChainId
            String chainId = (String) session.getAttribute("ChainId");
            
            if (chainId == null || chainId.trim().isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "保存失败，请先选择集团");
                return ResponseEntity.badRequest().body(response);
            }
            
            // 设置ChainId和ServiceId
            service.setChainId(chainId);
            service.setServiceId(serviceId);
            
            int result = additionalServiceService.update(service);
            Map<String, Object> response = new HashMap<>();
            response.put("success", result > 0);
            response.put("message", result > 0 ? "更新成功" : "更新失败");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @DeleteMapping("/{serviceId}")
    public ResponseEntity<Map<String, Object>> deleteAdditionalService(@PathVariable String serviceId) {
        try {
            int result = additionalServiceService.deleteByServiceId(serviceId);
            Map<String, Object> response = new HashMap<>();
            response.put("success", result > 0);
            response.put("message", result > 0 ? "删除成功" : "删除失败");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PostMapping("/select/list")
    public ResponseEntity<Map<String, Object>> selectList(@RequestBody AdditionalServiceSelectListRequest request) {
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
            if (request.getUser() == null) {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "用户信息不能为空"));
            }

            // 获取附加服务列表
            List<AdditionalService> services = additionalServiceService.selectByCondition(
                request.getChainId(),
                request.getHotelId(),
                request.getRateCodeId(),
                null  // 不按服务名称过滤
            );

            logger.debug("获取附加服务列表成功 - chainId: {}, hotelId: {}, 数量: {}",
                request.getChainId(), request.getHotelId(), services.size());

            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", services
            ));
        } catch (Exception e) {
            logger.error("获取附加服务列表失败", e);
            return ResponseEntity.status(500)
                .body(Map.of("success", false, "message", "获取附加服务列表失败: " + e.getMessage()));
        }
    }

    @PostMapping("/ratecode/bind")
    public ResponseEntity<Map<String, Object>> bindRateCode(@RequestBody RateCodeBindRequest request) {
        try {
            logger.debug("开始绑定价格代码和附加服务，接收到的数据：{}", objectMapper.writeValueAsString(request));

            // 验证必填字段
            if (request.getChainId() == null || request.getChainId().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "连锁ID不能为空"));
            }
            if (request.getHotelId() == null || request.getHotelId().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "酒店ID不能为空"));
            }
            if (request.getRateCodeId() == null || request.getRateCodeId().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "价格代码ID不能为空"));
            }
            if (request.getServiceCode() == null || request.getServiceCode().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "服务代码不能为空"));
            }
            if (request.getUser() == null) {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "用户信息不能为空"));
            }

            // 转换为AdditionalService对象
            AdditionalService service = new AdditionalService();
            service.setChainId(request.getChainId());
            service.setHotelId(request.getHotelId());
            service.setRateCodeId(request.getRateCodeId());
            service.setRateCode(request.getRateCode());
            service.setServiceCode(request.getServiceCode());
            service.setServiceName(request.getServiceName());
            service.setUnitPrice(request.getUnitPrice());
            service.setUnitNum(request.getUnitNum());
            service.setLimitStartTime(request.getLimitStartTime());
            service.setLimitEndTime(request.getLimitEndTime());
            service.setAvailWeeks(request.getAvailWeeks());
            
            // 生成serviceId
            String serviceId = java.util.UUID.randomUUID().toString().replace("-", "");
            service.setServiceId(serviceId);
            
            
            // 插入数据
            int result = additionalServiceService.insert(service);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", result > 0);
            response.put("message", result > 0 ? "绑定成功" : "绑定失败");
            response.put("serviceId", serviceId);
            
            logger.debug("绑定价格代码和附加服务成功 - chainId: {}, hotelId: {}, ratecodeId: {}, serviceCode: {}",
                request.getChainId(), request.getHotelId(), request.getRateCodeId(), request.getServiceCode());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("绑定价格代码和附加服务失败", e);
            return ResponseEntity.status(500)
                .body(Map.of("success", false, "message", "绑定失败: " + e.getMessage()));
        }
    }
    
} 