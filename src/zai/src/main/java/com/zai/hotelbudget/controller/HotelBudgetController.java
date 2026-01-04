package com.zai.hotelbudget.controller;

import com.google.gson.Gson;
import com.zai.common.BaseResponse;
import com.zai.hotelbudget.dto.HotelBudgetListRequest;
import com.zai.hotelbudget.dto.BudgetExportRequest;
import com.zai.hotelbudget.entity.HotelBudget;
import com.zai.hotelbudget.service.HotelBudgetService;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * 酒店预算API
 */
@RestController
@RequestMapping("/api/hotelbudget")
public class HotelBudgetController {
    private static final Logger logger = LoggerFactory.getLogger(HotelBudgetController.class);
    private static final Gson gson = new Gson();

    @Autowired
    private HotelBudgetService hotelBudgetService;

    /**
     * 新增酒店预算记录
     */
    @PostMapping("/add")
    @ResponseBody
    public ResponseEntity<BaseResponse> hotelBudgetAdd(@RequestBody HotelBudget hotelBudget) {
        logger.debug("请求体: {}", gson.toJson(hotelBudget));
        BaseResponse response = hotelBudgetService.addHotelBudget(hotelBudget);
        logger.debug("响应体: {}", gson.toJson(response));
        return ResponseEntity.ok(response);
    }

    /**
     * 更新酒店预算记录
     */
    @PutMapping("/update")
    @ResponseBody
    public ResponseEntity<BaseResponse> hotelBudgetUpdate(@RequestBody HotelBudget hotelBudget) {
        logger.debug("请求体: {}", gson.toJson(hotelBudget));
        BaseResponse response = hotelBudgetService.updateHotelBudget(hotelBudget);
        logger.debug("响应体: {}", gson.toJson(response));
        return ResponseEntity.ok(response);
    }

    /**
     * 删除酒店预算记录
     */
    @DeleteMapping("/delete")
    @ResponseBody
    public ResponseEntity<BaseResponse> hotelBudgetDelete(@RequestParam String hotelId,
                                                         @RequestParam Integer budgetYear,
                                                         @RequestParam String subjectCode,
                                                         @RequestParam String budgetVersion) {
        logger.debug("删除参数: hotelId={}, budgetYear={}, subjectCode={}, budgetVersion={}", 
                    hotelId, budgetYear, subjectCode, budgetVersion);
        BaseResponse response = hotelBudgetService.deleteHotelBudget(hotelId, budgetYear, subjectCode, budgetVersion);
        logger.debug("响应体: {}", gson.toJson(response));
        return ResponseEntity.ok(response);
    }

    /**
     * 查询酒店预算记录列表
     */
    @PostMapping("/hotelBudgetList")
    @ResponseBody
    public ResponseEntity<BaseResponse> hotelBudgetList(@RequestBody HotelBudgetListRequest request) {
        logger.debug("hotelBudgetList查询参数: {}", gson.toJson(request));
        
        // 参数验证
        if (request == null) {
            return ResponseEntity.ok(BaseResponse.error("请求参数不能为空"));
        }
        
        if (request.getChainId() == null || request.getChainId().trim().isEmpty()) {
            return ResponseEntity.ok(BaseResponse.error("连锁ID不能为空"));
        }
        
        BaseResponse response = hotelBudgetService.getHotelBudgetList(request);
        // 避免序列化包含LocalDateTime的对象，只记录基本信息
        logger.debug("hotelBudgetList响应成功，数据条数: {}", 
            response.getData() instanceof List ? ((List<?>) response.getData()).size() : "非列表数据");
        return ResponseEntity.ok(response);
    }

    /**
     * 查询单条酒店预算记录
     */
    @GetMapping("/get")
    @ResponseBody
    public ResponseEntity<BaseResponse> hotelBudgetGet(@RequestParam String hotelId,
                                                      @RequestParam Integer budgetYear,
                                                      @RequestParam String subjectCode,
                                                      @RequestParam String budgetVersion) {
        logger.debug("查询参数: hotelId={}, budgetYear={}, subjectCode={}, budgetVersion={}", 
                    hotelId, budgetYear, subjectCode, budgetVersion);
        BaseResponse response = hotelBudgetService.getHotelBudget(hotelId, budgetYear, subjectCode, budgetVersion);
        logger.debug("响应体: {}", gson.toJson(response));
        return ResponseEntity.ok(response);
    }

    /**
     * 批量新增酒店预算记录
     */
    @PostMapping("/batch/add")
    @ResponseBody
    public ResponseEntity<BaseResponse> hotelBudgetBatchAdd(@RequestBody List<HotelBudget> hotelBudgetList) {
        logger.debug("批量新增请求体: {}", gson.toJson(hotelBudgetList));
        BaseResponse response = hotelBudgetService.batchAddHotelBudget(hotelBudgetList);
        logger.debug("响应体: {}", gson.toJson(response));
        return ResponseEntity.ok(response);
    }

    /**
     * 批量更新酒店预算记录
     */
    @PutMapping("/batch/update")
    @ResponseBody
    public ResponseEntity<BaseResponse> hotelBudgetBatchUpdate(@RequestBody List<HotelBudget> hotelBudgetList) {
        logger.debug("批量更新请求体: {}", gson.toJson(hotelBudgetList));
        BaseResponse response = hotelBudgetService.batchUpdateHotelBudget(hotelBudgetList);
        logger.debug("响应体: {}", gson.toJson(response));
        return ResponseEntity.ok(response);
    }

    /**
     * UC预算Excel文件上传接口
     */
    @PostMapping("/ucUploadbudget")
    @ResponseBody
    public ResponseEntity<BaseResponse> uploadBudgetExcel(@RequestParam("file") MultipartFile file,
                                                         @RequestParam("year") Integer year,
                                                         @RequestParam("hotelId") String hotelId,
                                                         @RequestParam("chainId") String chainId) {
        logger.debug("开始处理UC预算Excel文件上传，文件名：{}，年份：{}，酒店ID：{}，集团ID：{}", 
                   file.getOriginalFilename(), year, hotelId, chainId);
        
        if (file.isEmpty()) {
            return ResponseEntity.ok(BaseResponse.error("上传的文件不能为空"));
        }
        
        String fileName = file.getOriginalFilename();
        if (fileName == null || !fileName.toLowerCase().endsWith(".xlsx")) {
            return ResponseEntity.ok(BaseResponse.error("请上传Excel文件(.xlsx格式)"));
        }
        
        if (year == null) {
            return ResponseEntity.ok(BaseResponse.error("年份参数不能为空"));
        }
        
        if (!StringUtils.hasText(hotelId)) {
            return ResponseEntity.ok(BaseResponse.error("酒店ID参数不能为空"));
        }
        
        if (!StringUtils.hasText(chainId)) {
            return ResponseEntity.ok(BaseResponse.error("集团ID参数不能为空"));
        }
        
        BaseResponse response = hotelBudgetService.uploadBudgetExcel(file, year, hotelId, chainId);
        logger.debug("UC预算Excel文件处理完成，响应：{}", gson.toJson(response));
        return ResponseEntity.ok(response);
    }

    /**
     * 导出预算数据
     */
    @PostMapping("/hotelBudgetExport")
    @ResponseBody
    public ResponseEntity<BaseResponse> exportBudgetData(@RequestBody BudgetExportRequest request) {
        logger.debug("收到导出预算数据请求: {}", gson.toJson(request));
        
        // 参数验证
        if (request == null) {
            return ResponseEntity.ok(BaseResponse.error("请求参数不能为空"));
        }
        
        if (request.getYear() == null) {
            return ResponseEntity.ok(BaseResponse.error("预算年份不能为空"));
        }
        
        if (request.getExportData() == null || request.getExportData().isEmpty()) {
            return ResponseEntity.ok(BaseResponse.error("导出数据不能为空"));
        }
        
        BaseResponse response = hotelBudgetService.exportBudgetData(request);
        logger.debug("预算数据导出完成，响应：{}", gson.toJson(response));
        return ResponseEntity.ok(response);
    }

    
} 