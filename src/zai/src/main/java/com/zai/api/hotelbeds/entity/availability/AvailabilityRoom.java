package com.zai.api.hotelbeds.entity.availability;

import java.util.List;
import lombok.Data;

@Data
public class AvailabilityRoom {
    private String status;
    private Integer id;
    private String code;
    private String name;
    private String supplierReference;
    private List<AvailabilityPax> paxes;
    private List<AvailabilityRate> rates;
}
