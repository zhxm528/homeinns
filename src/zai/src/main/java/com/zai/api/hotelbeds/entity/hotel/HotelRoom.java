package com.zai.api.hotelbeds.entity.hotel;

import java.util.List;
import com.zai.api.hotelbeds.entity.hotel.HotelRoomFacility;
import com.zai.api.hotelbeds.entity.hotel.HotelRoomStay;

public class HotelRoom {
    public String roomCode;
    public boolean isParentRoom;
    public int minPax;
    public int maxPax;
    public int maxAdults;
    public int maxChildren;
    public int minAdults;
    public String roomType;
    public String characteristicCode;
    public List<HotelRoomFacility> roomFacilities;
    public List<HotelRoomStay> roomStays;
    public String PMSRoomCode;
}