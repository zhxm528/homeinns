package com.zai.api.hotelbeds.entity.availability;

import lombok.Data;

@Data
public class AvailabilityPax {
    private Integer roomId;
    private String type;
    private Integer age;
    private String name;
    private String surname;
} 