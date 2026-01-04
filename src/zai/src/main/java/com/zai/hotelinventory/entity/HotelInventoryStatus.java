package com.zai.hotelinventory.entity;

import javax.persistence.*;
import java.time.LocalDate;
import lombok.Data;

@Data
@Table(name = "hotel_inventory_status")
public class HotelInventoryStatus {

    @Id
    @Column(name = "hotel_status_id")
    private String hotelStatusId;

    @Column(name = "chain_id")
    private String chainId;

    @Column(name = "hotel_id")
    private String hotelId;

    @Column(name = "hotel_code")
    private String hotelCode;

    @Column(name = "stay_date")
    private LocalDate stayDate;

    @Column(name = "is_available")
    private String isAvailable;

    @Column(name = "remaining_inventory")
    private int remainingInventory;

    @Column(name = "sold_inventory")
    private int soldInventory;

    @Column(name = "physical_inventory")
    private int physicalInventory;

    // Getters and Setters
} 