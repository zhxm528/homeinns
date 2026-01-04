package com.zai.api.hotelbeds.entity.checkrate;

import java.util.List;

public class Hotel {
    public String checkOut;
    public String checkIn;
    public String code;
    public String name;
    public String categoryCode;
    public String categoryName;
    public String destinationCode;
    public String destinationName;
    public String zoneCode;
    public String zoneName;
    public String latitude;
    public String longitude;
    public List<Room> rooms;
    public String totalNet;
    public String currency;
    public boolean paymentDataRequired;
    public ModificationPolicies modificationPolicies;
}
