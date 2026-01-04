package com.zai.api.homeinns.inithotels.entity;

import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 房型实体类
 */
@Data
@Entity
@Table(name = "room_types")
public class RoomType {
    @Id
    private String roomTypeId;
    private String chainId;
    private String hotelId;
    private String roomTypeCode;
    private String roomTypeName;
    private String description;
    private BigDecimal standardPrice;
    private Integer maxOccupancy;
    private Integer physicalInventory;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
} 