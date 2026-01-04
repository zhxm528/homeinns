package com.zai.hotelinventory.service;

import com.zai.hotelinventory.entity.HotelInventoryStatus;
import java.util.List;

public interface HotelInventoryService {
    List<HotelInventoryStatus> getInventoryByHotelId(String hotelId);
    void addInventory(HotelInventoryStatus hotelInventoryStatus);
    void updateInventory(HotelInventoryStatus hotelInventoryStatus);
    void deleteInventory(String hotelStatusId);
} 