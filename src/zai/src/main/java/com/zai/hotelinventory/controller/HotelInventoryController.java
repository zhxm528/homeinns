package com.zai.hotelinventory.controller;

import com.zai.hotelinventory.entity.HotelInventoryStatus;
import com.zai.hotelinventory.service.HotelInventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hotelinventory")
public class HotelInventoryController {

    @Autowired
    private HotelInventoryService hotelInventoryService;

    @GetMapping("/{hotelId}")
    public List<HotelInventoryStatus> getInventoryByHotelId(@PathVariable String hotelId) {
        return hotelInventoryService.getInventoryByHotelId(hotelId);
    }

    @PostMapping("/add")
    public void addInventory(@RequestBody HotelInventoryStatus hotelInventoryStatus) {
        hotelInventoryService.addInventory(hotelInventoryStatus);
    }

    @PutMapping("/update")
    public void updateInventory(@RequestBody HotelInventoryStatus hotelInventoryStatus) {
        hotelInventoryService.updateInventory(hotelInventoryStatus);
    }

    @DeleteMapping("/{hotelStatusId}")
    public void deleteInventory(@PathVariable String hotelStatusId) {
        hotelInventoryService.deleteInventory(hotelStatusId);
    }
} 