package com.zai.ratecode.service;

import com.zai.ratecode.entity.RateCode;
import java.util.List;
import java.util.Map;
import com.zai.ratecode.dto.RateCodeAddRequest;
import com.zai.ratecode.dto.RateCodeUpdateRequest;
import com.zai.ratecode.dto.PriceSettingsSaveRequest;

public interface RateCodeService {
    List<RateCode> selectByCondition(String hotelId, String chainId, String rateCode, String rateCodeName);

    /**
     * 根据条件查询价格代码列表（带分页）
     * 
     * @param hotelId 酒店ID
     * @param chainId 连锁ID
     * @param rateCode 价格代码
     * @param rateCodeName 价格代码名称
     * @param page 页码（从0开始）
     * @param size 每页大小
     * @param offset 偏移量
     * @return 价格代码列表
     */
    List<RateCode> selectByConditionWithPaging(String hotelId, String chainId, String rateCode, String rateCodeName, 
                                              int page, int size, int offset);

    /**
     * 根据条件统计价格代码总数
     * 
     * @param hotelId 酒店ID
     * @param chainId 连锁ID
     * @param rateCode 价格代码
     * @param rateCodeName 价格代码名称
     * @return 总数
     */
    int countByCondition(String hotelId, String chainId, String rateCode, String rateCodeName);
    
    int insert(RateCodeAddRequest request);
    int insert(RateCode rateCode);

    int update(RateCodeUpdateRequest request);

    int deleteByRateCodeId(String rateCodeId);

    /**
     * 根据价格代码ID查询价格代码信息
     *
     * @param rateCodeId 价格代码ID
     * @return 价格代码对象，如果不存在则返回null
     */
    RateCode getRateCodeById(String rateCodeId);

    /**
     * 根据酒店ID查询价格代码组件列表
     * 
     * @param hotelId 酒店ID
     * @return 价格代码列表
     */
    List<RateCode> selectRateCodeComponent(String hotelId);

    /**
     * 根据价格代码ID查询关联的房型列表
     * 
     * @param rateCodeId 价格代码ID
     * @return 房型列表，包含房型ID、房型代码、房型名称等信息
     */
    List<Map<String, Object>> getRoomTypesByRateCodeId(String rateCodeId);

   
    /**
     * 根据酒店ID和价格代码ID查询price_rule_type=1的价格代码列表
     * 
     * @param hotelId 酒店ID
     * @param rateCodeId 价格代码ID（可选）
     * @return 价格代码列表
     */
    List<RateCode> selectRateCodesByHotelIdAndPriceRuleType(String hotelId, String rateCodeId);

    /**
     * 根据价格代码ID查询price_rule_type=1的价格代码列表
     * 
     * @param rateCodeId 价格代码ID
     * @return 价格代码列表
     */
    List<RateCode> selectRateCodesByPriceRuleType(String rateCodeId);

    /**
     * 根据酒店ID和价格代码ID查询price_rule_type=2的价格代码列表
     * 
     * @param hotelId 酒店ID
     * @param rateCodeId 价格代码ID（用于排除当前价格代码）
     * @return 价格代码列表
     */
    List<RateCode> selectRateCodesByHotelIdAndPriceRuleType2(String hotelId, String rateCodeId);

    /**
     * 保存价格设置
     * 
     * @param request 价格设置保存请求
     * @return 保存是否成功
     */
    boolean savePriceSettings(PriceSettingsSaveRequest request);
} 