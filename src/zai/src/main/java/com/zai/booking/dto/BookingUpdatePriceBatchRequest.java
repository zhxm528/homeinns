package com.zai.booking.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

/**
 * 批量预订价格更新请求DTO
 */
public class BookingUpdatePriceBatchRequest {
    
    /**
     * 价格更新项列表
     */
    @JsonProperty("items")
    private List<BookingUpdatePriceRequest> items;
    
    // 构造函数
    public BookingUpdatePriceBatchRequest() {}
    
    // Getter和Setter方法
    public List<BookingUpdatePriceRequest> getItems() {
        return items;
    }
    
    public void setItems(List<BookingUpdatePriceRequest> items) {
        this.items = items;
    }
    
    @Override
    public String toString() {
        return "BookingUpdatePriceBatchRequest{" +
                "items=" + items +
                '}';
    }
} 