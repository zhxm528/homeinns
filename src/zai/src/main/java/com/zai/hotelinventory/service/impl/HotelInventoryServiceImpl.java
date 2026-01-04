package com.zai.hotelinventory.service.impl;

import com.zai.hotelinventory.entity.HotelInventoryStatus;
import com.zai.hotelinventory.mapper.HotelInventoryStatusMapper;
import com.zai.hotelinventory.service.HotelInventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class HotelInventoryServiceImpl implements HotelInventoryService {

    @Autowired
    private HotelInventoryStatusMapper hotelInventoryStatusMapper;

    @Override
    public List<HotelInventoryStatus> getInventoryByHotelId(String hotelId) {
        return hotelInventoryStatusMapper.selectByHotelId(hotelId);
    }

    @Override
    @Transactional
    public void addInventory(HotelInventoryStatus hotelInventoryStatus) {
        hotelInventoryStatusMapper.insert(hotelInventoryStatus);
    }

    @Override
    @Transactional
    public void updateInventory(HotelInventoryStatus hotelInventoryStatus) {
        hotelInventoryStatusMapper.update(hotelInventoryStatus);
    }

    @Override
    @Transactional
    public void deleteInventory(String hotelStatusId) {
        hotelInventoryStatusMapper.deleteById(hotelStatusId);
    }
} 