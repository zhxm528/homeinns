package com.zai.user.dto;

import java.util.List;

/**
 * 用户列表查询请求DTO
 */
public class UserListRequest {
    private List<String> chainIds;
    private String loginName;
    private String username;
    private String email;
    private String phone;
    private String status;
    private String type;
    private Integer pageNum;
    private Integer pageSize;

    // Getters and Setters
    public List<String> getChainIds() {
        return chainIds;
    }

    public void setChainIds(List<String> chainIds) {
        this.chainIds = chainIds;
    }

    public String getLoginName() {
        return loginName;
    }

    public void setLoginName(String loginName) {
        this.loginName = loginName;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Integer getPageNum() {
        return pageNum;
    }

    public void setPageNum(Integer pageNum) {
        this.pageNum = pageNum;
    }

    public Integer getPageSize() {
        return pageSize;
    }

    public void setPageSize(Integer pageSize) {
        this.pageSize = pageSize;
    }
} 