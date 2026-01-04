package com.zai.api.hotelbeds.entity.availability;

import java.util.List;
import lombok.Data;

@Data
public class AvailabilityTaxes {
    private Boolean allIncluded;
    private String taxScheme;
    private List<AvailabilityTax> taxes;
} 