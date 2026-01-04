package com.zai.booking.entity;

import lombok.Data;

@Data
public class Guest {
    private String guestId;
    private String guestName;
    private String guestEname;
    private String firstName;
    private String lastName;
    private String idType;
    private String idNumber;
    private String phone;
    private String email;
    private String address;
    private String specialRequests;
    private String memberLevel;
    private String memberCardNo;
    private String memberType;
} 