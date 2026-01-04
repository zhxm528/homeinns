package com.zai.hotel.controller;

import com.zai.hotel.entity.Hotel;
import com.zai.hotel.service.HotelService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.Objects;

@Controller
@RequestMapping("/api/hotel")
public class HotelController {
    private static final Logger logger = LoggerFactory.getLogger(HotelController.class);

    @Autowired
    private HotelService hotelService;

    @GetMapping({"", "/", "/index"})
    public String index() {
        logger.debug("访问酒店管理页面");
        return "hotel/index";
    }

    @PostMapping("/list")
    @ResponseBody
    public ResponseEntity<?> searchHotel(@RequestBody Map<String, Object> request) {
        try {
            // 从request中提取参数
            String chainId = (String) request.get("chainId");
            String hotelName = (String) request.get("hotelName");
            String cityId = (String) request.get("cityId");
            String hotelCode = (String) request.get("hotelCode");
            String address = (String) request.get("address");
            String description = (String) request.get("description");
            String managementModel = (String) request.get("managementModel");
            String ownershipType = (String) request.get("ownershipType");
            String managementCompany = (String) request.get("managementCompany");
            String brand = (String) request.get("brand");
            String region = (String) request.get("region");
            String cityArea = (String) request.get("cityArea");
            String pmsVersion = (String) request.get("pmsVersion");
            
            // 处理数字类型参数
            int status = -1;
            int page = 1;
            int pageSize = 10;
            
            if (request.get("status") != null) {
                status = ((Number) request.get("status")).intValue();
            }
            if (request.get("page") != null) {
                page = ((Number) request.get("page")).intValue();
            }
            if (request.get("pageSize") != null) {
                pageSize = ((Number) request.get("pageSize")).intValue();
            }
            
            logger.debug("查询酒店列表: chainId={}, hotelName={}, cityId={}, hotelCode={}, status={}, page={}, pageSize={}", 
                chainId, hotelName, cityId, hotelCode, status, page, pageSize);
            
            // 参数验证
            if (page < 1) {
                page = 1;
            }
            if (pageSize < 1) {
                pageSize = 10;
            }
            
            // 修复分页逻辑：如果page从1开始，需要减1；如果page从0开始，则不需要
            // 这里假设前端传入的page是从1开始的，所以需要减1
            int actualPage = page - 1;
            int offset = actualPage * pageSize;
            
            logger.debug("分页参数: page={}, actualPage={}, pageSize={}, offset={}", page, actualPage, pageSize, offset);
            
            // 查询酒店列表
            List<Hotel> hotels = hotelService.selectByConditionWithPaging(chainId, hotelCode, hotelName, cityId, 
                null, status, address, description, 
                managementModel, ownershipType, managementCompany, 
                brand, region, cityArea, pmsVersion, 
                actualPage, pageSize, offset);  // 使用actualPage，因为Service期望的是从0开始的page
            
            logger.debug("查询结果: 返回{}个酒店", hotels.size());
            
            // 统计总条数
            int total = hotelService.countByCondition(chainId, hotelCode, hotelName, cityId,
                null, status, address, description,
                managementModel, ownershipType, managementCompany,
                brand, region, cityArea, pmsVersion);
            
            // 计算总页数
            int totalPages = (int) Math.ceil((double) total / pageSize);
            
            logger.debug("查询到{}个酒店，总条数: {}, 总页数: {}", hotels.size(), total, totalPages);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", hotels,
                "total", total,
                "totalPages", totalPages,
                "page", page,  // 返回原始页码，不是actualPage
                "pageSize", pageSize
            ));
            
        } catch (Exception e) {
            logger.error("查询酒店列表失败: {}", e.getMessage(), e);
            return ResponseEntity.status(500)
                .body(Map.of("success", false, "message", "系统错误：" + e.getMessage()));
        }
    }

    @PostMapping("/add")
    @ResponseBody
    public ResponseEntity<?> addHotel(@RequestBody Hotel hotel) {
        logger.debug("添加酒店: {}", hotel);
        int result = hotelService.insert(hotel);
        if (result == 0) {
            return ResponseEntity.badRequest()
                .body(Map.of(
                    "success", false,
                    "message", "该集团下已存在相同酒店代码的酒店"
                ));
        }
        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "添加酒店成功",
            "data", Map.of(
                "hotelId", hotel.getHotelId(),
                "hotelCode", hotel.getHotelCode(),
                "hotelName", hotel.getHotelName()
            )
        ));
    }

    @DeleteMapping("/{hotelId}")
    @ResponseBody
    public void deleteHotel(@PathVariable String hotelId) {
        logger.debug("删除酒店: {}", hotelId);
        hotelService.deleteByHotelId(hotelId);
    }

    @PutMapping("/{hotelId}")
    @ResponseBody
    public ResponseEntity<?> updateHotel(@PathVariable String hotelId, @RequestBody Hotel hotel) {
        try {
            logger.debug("updateHotel更新酒店请求参数: hotelId={}, hotel={}", hotelId, hotel);
            
            // 验证参数
            if (hotelId == null || hotelId.trim().isEmpty()) {
                ResponseEntity<?> response = ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "酒店ID不能为空"));
                logger.debug("更新酒店响应: {}", response.getBody());
                return response;
            }
            
            // 查询酒店信息
            Hotel oldHotel = hotelService.selectByHotelId(hotelId);
            if (oldHotel == null) {
                ResponseEntity<?> response = ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "酒店不存在"));
                logger.debug("更新酒店响应: {}", response.getBody());
                return response;
            }

            //判断hotel中的brand是否为空，不为空则更新brand
            if (hotel.getBrand() != null && !hotel.getBrand().trim().isEmpty()) {
                oldHotel.setBrand(hotel.getBrand());
            }
            //判断hotel中的region是否为空，不为空则更新region
            if (hotel.getRegion() != null && !hotel.getRegion().trim().isEmpty()) {
                oldHotel.setRegion(hotel.getRegion());
            }
            //判断hotel中的cityArea是否为空，不为空则更新cityArea
            if (hotel.getCityArea() != null && !hotel.getCityArea().trim().isEmpty()) {
                oldHotel.setCityArea(hotel.getCityArea());
            }
            //判断hotel中的cityId是否为空，不为空则更新cityId
            if (hotel.getCityId() != null && !hotel.getCityId().trim().isEmpty()) {
                oldHotel.setCityId(hotel.getCityId());
            }
            //判断hotel中的managementModel是否为空，不为空则更新managementModel
            if (hotel.getManagementModel() != null && !hotel.getManagementModel().trim().isEmpty()) {
                oldHotel.setManagementModel(hotel.getManagementModel());
            }
            //判断hotel中的ownershipType是否为空，不为空则更新ownershipType
            if (hotel.getOwnershipType() != null && !hotel.getOwnershipType().trim().isEmpty()) {
                oldHotel.setOwnershipType(hotel.getOwnershipType());
            }
            //判断hotel中的pmsVersion是否为空，不为空则更新pmsVersion
            if (hotel.getPmsVersion() != null && !hotel.getPmsVersion().trim().isEmpty()) {
                oldHotel.setPmsVersion(hotel.getPmsVersion());
            }
            
            
            // 更新酒店信息
            hotelService.update(oldHotel);
            
            // 返回成功响应
            ResponseEntity<?> response = ResponseEntity.ok(Map.of(
                "success", true,
                "message", "更新成功",
                "data", oldHotel
            ));
            logger.debug("updateHotel更新酒店响应: {}", response.getBody());
            return response;
            
        } catch (Exception e) {
            logger.error("updateHotel更新酒店失败: {}", e.getMessage(), e);
            ResponseEntity<?> response = ResponseEntity.status(500)
                .body(Map.of("success", false, "message", "系统错误：" + e.getMessage()));
            logger.debug("updateHotel更新酒店响应: {}", response.getBody());
            return response;
        }
    }

    @GetMapping("/{hotelId}")
    @ResponseBody
    public ResponseEntity<?> editHotel(@PathVariable String hotelId) {
        try {
            logger.debug("编辑回显酒店: {}", hotelId);
            
            // 验证参数
            if (hotelId == null || hotelId.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "酒店ID不能为空"));
            }
            
            // 查询酒店信息
            Hotel hotel = hotelService.selectByHotelId(hotelId);
            if (hotel == null) {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "酒店不存在"));
            }
            
            // 返回成功响应
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "获取成功",
                "data", hotel
            ));
            
        } catch (Exception e) {
            logger.error("查询酒店详情失败: {}", e.getMessage(), e);
            return ResponseEntity.status(500)
                .body(Map.of("success", false, "message", "系统错误：" + e.getMessage()));
        }
    }

    @PostMapping("/select")
    @ResponseBody
    public ResponseEntity<?> selectHotel(@RequestBody Map<String, Object> request) {
        try {
            logger.debug("下拉框选择酒店: {}", request);
            
            // 验证请求参数
            String chainId = (String) request.get("chainId");
            if (chainId == null || chainId.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "集团ID不能为空"));
            }
            
            // 获取查询关键字
            String keyword = (String) request.get("keyword");
            
            // 获取分页信息
            Map<String, Object> pagination = (Map<String, Object>) request.get("pagination");
            int current = 1;
            int pageSize = 50;
            if (pagination != null) {
                current = ((Number) pagination.getOrDefault("current", 1)).intValue();
                pageSize = ((Number) pagination.getOrDefault("pageSize", 50)).intValue();
            }
            
            // 计算offset
            int offset = (current - 1) * pageSize;
            
            logger.debug("查询条件: chainId={}, keyword={}, current={}, pageSize={}, offset={}", 
                chainId, keyword, current, pageSize, offset);
            
            // 查询酒店列表
            List<Hotel> hotels = hotelService.selectByComponentWithPaging(
                chainId, 
                keyword,    // 同时用于hotelCode和hotelName的模糊查询
                keyword,
                current - 1,   // page: 转换为从0开始
                pageSize,  // size
                offset     // offset
            );
            
            // 提取需要的字段
            List<Map<String, String>> result = hotels.stream()
                .map(hotel -> Map.of(
                    "hotelId", hotel.getHotelId(),
                    "hotelCode", hotel.getHotelCode(),
                    "hotelName", hotel.getHotelName()
                ))
                .collect(Collectors.toList());
            
            logger.debug("查询到{}个酒店", result.size());
            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", result,
                "pagination", Map.of(
                    "current", current,
                    "pageSize", pageSize,
                    "total", result.size()
                )
            ));
        } catch (Exception e) {
            logger.error("查询酒店列表失败", e);
            return ResponseEntity.status(500)
                .body(Map.of("success", false, "message", "系统错误：" + e.getMessage()));
        }
    }

    @GetMapping("/setLocalStorageHotel")
    @ResponseBody
    public ResponseEntity<?> setLocalStorageHotel(
        @RequestParam(required = true) String hotelId,
        @RequestParam(required = false) String userId) {
        try {
            logger.debug("设置localStorage酒店: hotelId={}, userId={}", hotelId, userId);
            
            // 验证参数
            if (hotelId == null || hotelId.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "酒店ID不能为空"));
            }
            
            // 查询酒店信息
            Hotel hotel = hotelService.setLocalStorageHotelByHotelId(hotelId,userId);
            if (hotel == null) {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "酒店不存在"));
            }
            
            // 返回成功响应
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "设置成功",
                "data", hotel
            ));
            
        } catch (Exception e) {
            logger.error("设置localStorage酒店失败: {}", e.getMessage(), e);
            return ResponseEntity.status(500)
                .body(Map.of("success", false, "message", "系统错误：" + e.getMessage()));
        }
    }
} 