package com.zai.additionalservice.dto;

import lombok.Data;

/**
 * 附加服务选择列表请求DTO
 */
@Data
public class AdditionalServiceSelectListRequest {
    private String chainId;
    private String hotelId;
    private String rateCodeId;
    private UserInfo user;

    @Data
    public static class UserInfo {
        private String userId;
        private String loginName;
        private String userName;
        private String roleId;
        private String roleName;
        private String chainId;
        private String chainName;
    }
} 