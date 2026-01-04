package com.zai.api.hotelbeds.entity.checkrate;

import com.zai.api.hotelbeds.entity.bookingdetail.AuditData;
import com.zai.api.hotelbeds.entity.bookingdetail.Booking;

public class ApiResponse {
    public static ApiResponse instance;
    public void ApiResponse() {
    }
    public static ApiResponse getInstance() {
        if (instance == null) {
            return new ApiResponse();
        }
        return instance;
    }
    public AuditData auditData;
    public Hotel hotel;
}
