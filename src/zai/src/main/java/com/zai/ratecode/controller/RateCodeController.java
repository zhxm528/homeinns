package com.zai.ratecode.controller;

import com.zai.common.BaseResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zai.ratecode.entity.RateCode;
import com.zai.ratecode.service.RateCodeService;
import com.zai.ratecode.dto.RateCodeQueryRequest;
import com.zai.ratecode.dto.RateCodeAddRequest;
import com.zai.ratecode.dto.RateCodeUpdateRequest;
import com.zai.ratecode.dto.RateCodeSelectComponent;
import com.zai.ratecode.dto.PriceSettingsSaveRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("/api/ratecode")
public class RateCodeController {
    private static final Logger logger = LoggerFactory.getLogger(RateCodeController.class);
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final ObjectMapper objectMapper = new ObjectMapper();
    
    @Autowired
    private RateCodeService rateCodeService;

    @PostMapping("/list")
    public ResponseEntity<Map<String, Object>> getRateCodes(@RequestBody RateCodeQueryRequest request) {
        try {
            logger.debug("查询条件: {}", request);
            
            // 处理分页参数
            int page = 1;
            int pageSize = 10;
            if (request.getPagination() != null) {
                page = request.getPagination().getCurrent();
                pageSize = request.getPagination().getPageSize();
            }
            
            // 参数验证
            if (page < 1) {
                page = 1;
            }
            if (pageSize < 1) {
                pageSize = 10;
            }
            
            // 分页逻辑：如果page从1开始，需要减1；如果page从0开始，则不需要
            // 这里假设前端传入的page是从1开始的，所以需要减1
            int actualPage = page - 1;
            int offset = actualPage * pageSize;
            
            logger.debug("分页参数: page={}, actualPage={}, pageSize={}, offset={}", page, actualPage, pageSize, offset);
            
            if (request.getHotelId() == null || request.getHotelId().trim().isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("code", 200);
                response.put("message", "success");
                
                Map<String, Object> data = new HashMap<>();
                data.put("list", new ArrayList<>());
                
                Map<String, Object> pagination = new HashMap<>();
                pagination.put("current", page);
                pagination.put("pageSize", pageSize);
                pagination.put("total", 0);
                
                data.put("pagination", pagination);
                response.put("data", data);
                
                logger.debug("查询结果: {}", response);
                return ResponseEntity.ok(response);
            }

            // 查询价格代码列表（带分页）
            List<RateCode> rateCodes = rateCodeService.selectByConditionWithPaging(
                request.getHotelId(),
                request.getChainId(),
                request.getRateCode(),
                request.getRateCodeName(),
                actualPage,
                pageSize,
                offset
            );
            
            // 统计总条数
            int total = rateCodeService.countByCondition(
                request.getHotelId(),
                request.getChainId(),
                request.getRateCode(),
                request.getRateCodeName()
            );
            
            // 计算总页数
            int totalPages = (int) Math.ceil((double) total / pageSize);
            
            Map<String, Object> response = new HashMap<>();
            response.put("code", 200);
            response.put("message", "success");
            
            Map<String, Object> data = new HashMap<>();
            data.put("list", rateCodes);
            
            Map<String, Object> pagination = new HashMap<>();
            pagination.put("current", page);
            pagination.put("pageSize", pageSize);
            pagination.put("total", total);
            
            data.put("pagination", pagination);
            response.put("data", data);
            
            logger.debug("查询结果: {}", response);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.debug("查询价格代码列表时发生错误", e);
            Map<String, Object> response = new HashMap<>();
            response.put("code", 500);
            response.put("message", e.getMessage());
            response.put("data", null);
            return ResponseEntity.status(500).body(response);
        }
    }

    
    @GetMapping("/edit/{rateCodeId}")
    @ResponseBody
    public ResponseEntity<RateCode> getRateCodeById(@PathVariable String rateCodeId) {
        logger.debug("Getting rateCode by rateCodeId: {}", rateCodeId);
        try {
            RateCode rateCode = rateCodeService.getRateCodeById(rateCodeId);
            if (rateCode != null) {
                logger.debug("Retrieved rateCode: {}", rateCode);
                logger.debug("响应体: {}", rateCode);
                return ResponseEntity.ok(rateCode);
            } else {
                logger.debug("No rateCode found with rateCodeId: {}", rateCodeId);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            logger.debug("Error getting rateCode by rateCodeId: {}", rateCodeId, e);
            return ResponseEntity.status(500).build();
        }
    }

    @PostMapping("/add")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> addRateCode(@RequestBody RateCodeAddRequest request) {
        try {
            logger.debug("开始添加价格代码，接收到的数据：{}", request);
            
            // 验证必填字段
            if (request.getHotel_id() == null || request.getHotel_id().trim().isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "酒店ID不能为空");
                logger.debug("添加价格代码失败：酒店ID为空");
                return ResponseEntity.badRequest().body(response);
            }
            
            if (request.getRate_code() == null || request.getRate_code().trim().isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "价格代码不能为空");
                logger.debug("添加价格代码失败：价格代码为空");
                return ResponseEntity.badRequest().body(response);
            }

            
            
            int result = rateCodeService.insert(request);
            Map<String, Object> response = new HashMap<>();
            response.put("success", result > 0);
            response.put("message", result > 0 ? "创建成功" : "创建失败");
            logger.debug("添加价格代码结果：{}", response);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.debug("添加价格代码时发生错误", e);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    

    @PutMapping("/update")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> updateRateCode(@RequestBody RateCodeUpdateRequest request) {
        try {
            logger.debug("更新价格代码，接收到的数据：{}", request);
            
            // 验证必填字段
            if (request.getHotel_id() == null || request.getHotel_id().trim().isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "酒店ID不能为空");
                logger.debug("更新价格代码失败：酒店ID为空");
                return ResponseEntity.badRequest().body(response);
            }
            
            if (request.getRate_code() == null || request.getRate_code().trim().isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "价格代码不能为空");
                logger.debug("更新价格代码失败：价格代码为空");
                return ResponseEntity.badRequest().body(response);
            }

            
            
            int result = rateCodeService.update(request);
            Map<String, Object> response = new HashMap<>();
            response.put("success", result > 0);
            response.put("message", result > 0 ? "更新成功" : "更新失败");
            
            logger.debug("更新价格代码结果：{}", response);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.debug("更新价格代码时发生错误", e);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @DeleteMapping("/{rateCodeId}")
    public ResponseEntity<Map<String, Object>> deleteRateCode(@PathVariable String rateCodeId) {
        try {
            int result = rateCodeService.deleteByRateCodeId(rateCodeId);
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

    @PostMapping("/select/component")
    @ResponseBody
    public BaseResponse<List<RateCode>> selectRateCodeComponent(@RequestBody RateCodeSelectComponent request) {
        try {
            logger.debug("房价码组件请求体: {}", objectMapper.writeValueAsString(request));

            // 验证请求对象
            if (request == null) {
                return BaseResponse.error("请求体不能为空");
            }

            // 验证必填字段
            if (request.getHotelId() == null || request.getHotelId().trim().isEmpty()) {
                return BaseResponse.error("酒店ID不能为空");
            }
            
           

            List<RateCode> rateCodes = rateCodeService.selectRateCodeComponent(request.getHotelId());            
            
            
            return BaseResponse.success(rateCodes);
        } catch (Exception e) {
            logger.debug("查询价格代码组件时发生错误", e);
            return BaseResponse.error("获取房价码选择列表失败: " + e.getMessage());
        }
    }
    @GetMapping("/{rateCodeId}/roomtypes")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> getRoomTypesByRateCode(@PathVariable String rateCodeId) {
        try {
            //logger.debug("查询价格代码关联房型，接收到的数据：{}", rateCodeId);
            
           
            
            // 验证必填字段
            if (rateCodeId == null || rateCodeId.trim().isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "价格代码ID不能为空");
                logger.debug("查询失败：价格代码ID为空");
                return ResponseEntity.badRequest().body(response);
            }
            
            List<Map<String, Object>> roomTypes = rateCodeService.getRoomTypesByRateCodeId(rateCodeId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "查询成功");
            response.put("data", roomTypes);
            
            //logger.debug("查询价格代码关联房型结果：{}", response);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            //logger.error("查询价格代码关联房型时发生错误", e);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "查询失败: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * 根据价格代码ID查询price_rule_type=1的价格代码列表
     * 
     * @param request 包含rateCodeId的请求对象
     * @return 价格代码列表
     */
    @PostMapping("/parent-rate-code")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> getRateCodesByHotelIdAndPriceRuleType(
        @RequestBody Map<String, String> request) {
        try {
            logger.debug("查询price_rule_type=1的价格代码，接收到的数据：{}", request);
            
            // 获取参数
            String rateCodeId = request.get("rateCodeId");
            
            // 验证必填字段
            if (rateCodeId == null || rateCodeId.trim().isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "价格代码ID不能为空");
                logger.debug("查询失败：价格代码ID为空");
                return ResponseEntity.badRequest().body(response);
            }
            
            // 根据rateCodeId获取价格代码信息，从中获取hotelId
            RateCode rateCode = rateCodeService.getRateCodeById(rateCodeId);
            if (rateCode == null) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "价格代码不存在");
                logger.debug("查询失败：价格代码不存在");
                return ResponseEntity.badRequest().body(response);
            }
            
            String hotelId = rateCode.getHotelId();
            List<RateCode> rateCodes = rateCodeService.selectRateCodesByHotelIdAndPriceRuleType(hotelId, rateCodeId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "查询成功");
            response.put("data", rateCodes);
            
            logger.debug("查询price_rule_type=1的价格代码结果：{}", response);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("查询price_rule_type=1的价格代码时发生错误", e);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "查询失败: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * 根据价格代码ID查询price_rule_type=2的价格代码列表
     * 
     * @param request 包含rateCodeId的请求对象
     * @return 价格代码列表
     */
    @PostMapping("/discount-rate-code")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> getRateCodesByPriceRuleType2(
        @RequestBody Map<String, String> request) {
        try {
            logger.debug("查询price_rule_type=2的价格代码，接收到的数据：{}", request);
            
            // 获取参数
            String rateCodeId = request.get("rateCodeId");
            
            // 验证必填字段
            if (rateCodeId == null || rateCodeId.trim().isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "价格代码ID不能为空");
                logger.debug("查询失败：价格代码ID为空");
                return ResponseEntity.badRequest().body(response);
            }
            
            // 根据rateCodeId获取价格代码信息，从中获取hotelId
            RateCode rateCode = rateCodeService.getRateCodeById(rateCodeId);
            if (rateCode == null) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "价格代码不存在");
                logger.debug("查询失败：价格代码不存在");
                return ResponseEntity.badRequest().body(response);
            }
            
            String hotelId = rateCode.getHotelId();
            List<RateCode> rateCodes = rateCodeService.selectRateCodesByHotelIdAndPriceRuleType2(hotelId, rateCodeId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "查询成功");
            response.put("data", rateCodes);
            
            logger.debug("查询price_rule_type=2的价格代码结果：{}", response);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("查询price_rule_type=2的价格代码时发生错误", e);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "查询失败: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * 保存价格设置
     * 
     * @param request 价格设置保存请求
     * @return 保存结果
     */
    @PostMapping("/PriceSettingsSave")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> priceSettingsSave(
        @RequestBody PriceSettingsSaveRequest request) {
        try {
            logger.debug("保存价格设置，接收到的数据：{}", request);
            
            // 验证必填字段
            if (request.getRateCodeId() == null || request.getRateCodeId().trim().isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "价格代码ID不能为空");
                logger.debug("保存失败：价格代码ID为空");
                return ResponseEntity.badRequest().body(response);
            }
            
            if (request.getPriceRuleType() == null || request.getPriceRuleType().trim().isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "价格规则类型不能为空");
                logger.debug("保存失败：价格规则类型为空");
                return ResponseEntity.badRequest().body(response);
            }
            
            // 根据priceRuleType验证相应的价格设置
            if ("1".equals(request.getPriceRuleType())) {
                if (request.getFixedPrice() == null) {
                    Map<String, Object> response = new HashMap<>();
                    response.put("success", false);
                    response.put("message", "固定价格设置不能为空");
                    logger.debug("保存失败：固定价格设置为空");
                    return ResponseEntity.badRequest().body(response);
                }
                
                if (request.getFixedPrice().getRoomTypePrices() == null || request.getFixedPrice().getRoomTypePrices().isEmpty()) {
                    Map<String, Object> response = new HashMap<>();
                    response.put("success", false);
                    response.put("message", "房型价格设置不能为空");
                    logger.debug("保存失败：房型价格设置为空");
                    return ResponseEntity.badRequest().body(response);
                }
            } else if ("2".equals(request.getPriceRuleType())) {
                if (request.getBasePrice() == null) {
                    Map<String, Object> response = new HashMap<>();
                    response.put("success", false);
                    response.put("message", "基础价格设置不能为空");
                    logger.debug("保存失败：基础价格设置为空");
                    return ResponseEntity.badRequest().body(response);
                }
                
                if (request.getBasePrice().getRoomTypeBasePrices() == null || request.getBasePrice().getRoomTypeBasePrices().isEmpty()) {
                    Map<String, Object> response = new HashMap<>();
                    response.put("success", false);
                    response.put("message", "房型基础价格设置不能为空");
                    logger.debug("保存失败：房型基础价格设置为空");
                    return ResponseEntity.badRequest().body(response);
                }
            }
            
            // 调用service层保存价格设置
            boolean result = rateCodeService.savePriceSettings(request);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", result);
            response.put("message", result ? "保存成功" : "保存失败");
            
            logger.debug("保存价格设置结果：{}", response);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("保存价格设置时发生错误", e);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "保存失败: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    
} 