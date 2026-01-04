package com.zai.api.hotelbeds.entity.availability;

import java.util.List;
import lombok.Data;

@Data
public class AvailabilityResponse {
    private AvailabilityAuditData auditData;
    private AvailabilityHotels hotels;
} 