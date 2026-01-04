package com.zai.roomtype.dto;

import lombok.Data;

@Data
public class RoomTypeListRequest {
    private String chainId;
    private String hotelId;
    private String roomTypeCode;
    private String roomTypeName;
    private Pagination pagination;
    private UserInfo user;

    @Data
    public static class Pagination {
        private Integer current;
        private Integer pageSize;
    }

    @Data
    public static class UserInfo {
        private String userId;
        private String loginName;
        private String userName;
        private Integer roleId;
        private String roleName;
        private String chainId;
        private String chainName;
    }
} 