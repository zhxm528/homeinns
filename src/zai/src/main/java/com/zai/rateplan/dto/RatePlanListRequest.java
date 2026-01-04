package com.zai.rateplan.dto;

import lombok.Data;

@Data
public class RatePlanListRequest {
    private String hotelId;
    private String ratecodeId;
    private String roomTypeId;
    
}
