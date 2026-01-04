package com.zai.rateplan.dto;

import java.util.List;

/**
 * 价格方案绑定请求DTO
 */
public class RatePlanBindRequest {
    private String chainId;
    private String hotelId;
    private String ratecodeId;
    private String ratecode;
    private List<String> roomtypeId;
    private List<String> roomtypecode;
    private UserInfo user;

    public static class UserInfo {
        private String userId;
        private String loginName;
        private String userName;
        private String roleId;
        private String roleName;
        private String chainId;
        private String chainName;

        // Getters and Setters
        public String getUserId() {
            return userId;
        }

        public void setUserId(String userId) {
            this.userId = userId;
        }

        public String getLoginName() {
            return loginName;
        }

        public void setLoginName(String loginName) {
            this.loginName = loginName;
        }

        public String getUserName() {
            return userName;
        }

        public void setUserName(String userName) {
            this.userName = userName;
        }

        public String getRoleId() {
            return roleId;
        }

        public void setRoleId(String roleId) {
            this.roleId = roleId;
        }

        public String getRoleName() {
            return roleName;
        }

        public void setRoleName(String roleName) {
            this.roleName = roleName;
        }

        public String getChainId() {
            return chainId;
        }

        public void setChainId(String chainId) {
            this.chainId = chainId;
        }

        public String getChainName() {
            return chainName;
        }

        public void setChainName(String chainName) {
            this.chainName = chainName;
        }
    }

    // Getters and Setters
    public String getChainId() {
        return chainId;
    }

    public void setChainId(String chainId) {
        this.chainId = chainId;
    }

    public String getHotelId() {
        return hotelId;
    }

    public void setHotelId(String hotelId) {
        this.hotelId = hotelId;
    }

    public String getRatecodeId() {
        return ratecodeId;
    }

    public void setRatecodeId(String ratecodeId) {
        this.ratecodeId = ratecodeId;
    }

    public String getRatecode() {
        return ratecode;
    }

    public void setRatecode(String ratecode) {
        this.ratecode = ratecode;
    }

    public List<String> getRoomtypeId() {
        return roomtypeId;
    }

    public void setRoomtypeId(List<String> roomtypeId) {
        this.roomtypeId = roomtypeId;
    }

    public List<String> getRoomtypecode() {
        return roomtypecode;
    }

    public void setRoomtypecode(List<String> roomtypecode) {
        this.roomtypecode = roomtypecode;
    }

    public UserInfo getUser() {
        return user;
    }

    public void setUser(UserInfo user) {
        this.user = user;
    }
} 