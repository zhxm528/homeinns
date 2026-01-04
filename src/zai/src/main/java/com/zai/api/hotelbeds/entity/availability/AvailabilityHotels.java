package com.zai.api.hotelbeds.entity.availability;

import java.util.List;
import lombok.Data;

@Data
public class AvailabilityHotels {
    private String checkIn;
    private String checkOut;
    private Integer total;
    private List<AvailabilityHotel> hotels;
}
