package com.zai.availability.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;
import java.util.Map;

@Mapper
public interface AvailabilityMapper {
    /**
     * 批量插入价格数据
     * @param priceList 价格数据列表
     * @return 影响行数
     */
    int batchInsertRatePrices(@Param("list") List<Map<String, Object>> priceList);

    /**
     * 批量插入库存状态数据
     * @param statusList 库存状态数据列表
     * @return 影响行数
     */
    int batchInsertRateInventoryStatus(@Param("list") List<Map<String, Object>> statusList);
}
