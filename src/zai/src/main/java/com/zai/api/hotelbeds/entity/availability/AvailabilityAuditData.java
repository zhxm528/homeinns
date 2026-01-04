package com.zai.api.hotelbeds.entity.availability;

import lombok.Data;

@Data
public class AvailabilityAuditData {
    private String processTime;
    private String timestamp;
    private String requestHost;
    private String serverId;
    private String environment;
    private String release;
    private String token;
}
