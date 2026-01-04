package com.zai.ratecode.dto;

import lombok.Data;
import java.util.List;

@Data
public class RateCodeAddRequest {
    private String chain_id;
    private String hotel_id;
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
    private String price_modifier;
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