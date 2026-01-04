package com.zai.api.hotelbeds.entity.bookinglist;

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
    public BookingsContainer bookings;
}
