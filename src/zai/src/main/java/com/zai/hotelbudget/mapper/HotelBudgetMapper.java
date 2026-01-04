package com.zai.hotelbudget.mapper;

import com.zai.hotelbudget.entity.HotelBudget;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface HotelBudgetMapper {
    
    /**
     * 插入酒店预算记录
     */
    int insert(HotelBudget hotelBudget);
    
    /**
     * 更新酒店预算记录
     */
    int update(HotelBudget hotelBudget);
    
    /**
     * 根据主键删除酒店预算记录
     */
    int deleteByPrimaryKey(@Param("hotelId") String hotelId, 
                          @Param("budgetYear") Integer budgetYear, 
                          @Param("subjectCode") String subjectCode, 
                          @Param("budgetVersion") String budgetVersion);
    
    /**
     * 根据主键查询酒店预算记录
     */
    HotelBudget selectByPrimaryKey(@Param("hotelId") String hotelId, 
                                  @Param("budgetYear") Integer budgetYear, 
                                  @Param("subjectCode") String subjectCode, 
                                  @Param("budgetVersion") String budgetVersion);
    
    /**
     * 根据条件查询酒店预算记录列表
     */
    List<HotelBudget> selectByCondition(@Param("chainId") String chainId,
                                       @Param("hotelId") String hotelId,
                                       @Param("budgetYear") Integer budgetYear,
                                       @Param("subjectCode") String subjectCode,
                                       @Param("budgetVersion") String budgetVersion,
                                       @Param("hotelManagementModel") String hotelManagementModel,
                                       @Param("offset") int offset,
                                       @Param("limit") int limit);
    
    /**
     * 根据条件统计酒店预算记录数量
     */
    int countByCondition(@Param("chainId") String chainId,
                        @Param("hotelId") String hotelId,
                        @Param("budgetYear") Integer budgetYear,
                        @Param("subjectCode") String subjectCode,
                        @Param("budgetVersion") String budgetVersion,
                        @Param("hotelManagementModel") String hotelManagementModel);
    
    /**
     * 批量插入酒店预算记录
     */
    int batchInsert(List<HotelBudget> hotelBudgetList);
    
    /**
     * 批量更新酒店预算记录
     */
    int batchUpdate(List<HotelBudget> hotelBudgetList);

    /**
     * 根据主键删除酒店预算记录
     */
    int deleteByChainHotelYear(@Param("chainId") String chainId,
                          @Param("hotelId") String hotelId,
                          @Param("budgetYear") Integer budgetYear);

                          /**
     * 根据主键查询酒店预算记录
     */
    List<HotelBudget>  selectByChainHotelYear(@Param("chainId") String chainId, 
                                        @Param("hotelId") String budgethotelIdYear, 
                                        @Param("budgetYear") Integer budgetYear);
} 