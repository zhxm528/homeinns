package com.zai.api.hotelbeds.entity.bookingdetail;

import java.util.List;

public class Hotel {
    public String checkOut;
    public String checkIn;
    public int code;
    public String name;
    public String categoryCode;
    public String categoryName;
    public String destinationCode;
    public String destinationName;
    public int zoneCode;
    public String zoneName;
    public String latitude;
    public String longitude;
    public List<Rooms> rooms;
    public String totalNet;
    public String currency;
    public Supplier supplier;
}
