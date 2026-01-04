package com.zai.api.homeinns.inithotels.entity;

import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 酒店实体类
 */
@Data
@Entity
@Table(name = "hotels")
public class Hotel {
    @Id
    private String hotelId;
    private String chainId;
    private String hotelCode;
    private String hotelName;
    private String address;
    private String description;
    private String cityId;
    private String country;
    private String contactEmail;
    private String contactPhone;
    private Integer status;
    private String ownershipType;
    private String managementModel;
    private String managementCompany;
    private String brand;
    private String region;
    private String cityArea;
    private String pmsVersion;
    private LocalDate openingDate;
    private LocalDate lastRenovationDate;
    private LocalDate closureDate;
    private Integer totalPhysicalRooms;
    private BigDecimal basePrice;
    private BigDecimal thresholdPrice;
    private BigDecimal breakfastPrice;
    private BigDecimal parkingPrice;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
} 