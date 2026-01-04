package com.zai.api.homeinns.GETChannelRmType.entity;

import lombok.Data;

@Data
public class RoomType {
    private Long id;
    private String chainId;
    private String hotelCode;
    private String roomTypeCode;
    private String roomTypeName;
    private String status;
    private String createTime;
    private String updateTime;
} 