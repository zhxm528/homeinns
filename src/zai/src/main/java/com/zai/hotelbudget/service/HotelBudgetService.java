package com.zai.hotelbudget.service;

import com.zai.common.BaseResponse;
import com.zai.hotelbudget.dto.HotelBudgetListRequest;
import com.zai.hotelbudget.dto.BudgetExportRequest;
import com.zai.hotelbudget.entity.HotelBudget;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface HotelBudgetService {
    
    /**
     * 添加酒店预算记录
     */
    BaseResponse<String> addHotelBudget(HotelBudget hotelBudget);
    
    /**
     * 更新酒店预算记录
     */
    BaseResponse<String> updateHotelBudget(HotelBudget hotelBudget);
    
    /**
     * 删除酒店预算记录
     */
    BaseResponse<String> deleteHotelBudget(String hotelId, Integer budgetYear, String subjectCode, String budgetVersion);
    
    /**
     * 查询酒店预算记录
     */
    BaseResponse<HotelBudget> getHotelBudget(String hotelId, Integer budgetYear, String subjectCode, String budgetVersion);
    
    /**
     * 查询酒店预算记录列表
     */
    BaseResponse<Object> getHotelBudgetList(HotelBudgetListRequest request);
    
    /**
     * 批量添加酒店预算记录
     */
    BaseResponse<String> batchAddHotelBudget(List<HotelBudget> hotelBudgetList);
    
    /**
     * 批量更新酒店预算记录
     */
    BaseResponse<String> batchUpdateHotelBudget(List<HotelBudget> hotelBudgetList);
    
    /**
     * 上传并解析UC预算Excel文件
     */
    BaseResponse<String> uploadBudgetExcel(MultipartFile file, Integer year, String hotelId, String chainId);
    
    /**
     * 导出预算数据
     */
    BaseResponse<String> exportBudgetData(BudgetExportRequest request);
} 