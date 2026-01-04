package com.zai.ratecode.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.Data;

/**
 * 价格代码更新请求DTO
 */
@Data
public class RateCodeUpdateRequest {
    private String rate_code_id;
    private String chain_id;
    private String hotel_id;
    private String hotel_name;
    private String chain_name;
    private String chain_code;
    private String hotel_code;
    private String rate_code;
    private String rate_code_name;
    private String description;
    private String market_code;
    private String channel_id;
    private Integer minlos;
    private Integer maxlos;
    private Integer minadv;
    private Integer maxadv;
    private String valid_from;
    private String valid_to;
    private String limit_start_time;
    private String limit_end_time;
    private String limitAvailWeeks;
    private BigDecimal price_modifier;
    private Integer is_percentage;
    private String reservation_type;
    private String cancellation_type;
    private Integer latest_cancellation_days;
    private String latest_cancellation_time;
    private Integer cancellable_after_booking;
    private String order_retention_time;
    private String stay_start_date;
    private String stay_end_date;
    private String booking_start_date;
    private String booking_end_date;
    private String price_rule_type;
    private String parent_rate_code_id;

    
} 