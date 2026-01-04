package com.zai.api.homeinns.GETChannelRmType.controller;

import com.zai.api.homeinns.GETChannelRmType.model.GetHotelInfoRequest;
import com.zai.api.homeinns.GETChannelRmType.model.GetHotelInfoResponse;
import com.zai.api.homeinns.GETChannelRmType.service.GetHotelInfoService;
import com.zai.hotel.entity.Hotel;
import com.zai.hotel.mapper.HotelMapper;
import com.zai.user.entity.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.ArrayList;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.UUID;
import java.util.Map;

@RestController
@RequestMapping("/api/homeinns")
public class GetHotelInfoController {
    
    private static final Logger logger = LoggerFactory.getLogger(GetHotelInfoController.class);
    
    @Autowired
    private GetHotelInfoService getHotelInfoService;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    @Autowired
    private HotelMapper hotelMapper;
    
    @Value("${homeinns.api.terminal.license}")
    private String terminalLicense;
    
    @Value("${homeinns.api.terminal.seq}")
    private String terminalSeq;
    
    @Value("${homeinns.api.terminal.oprid}")
    private String terminalOprId;
    
    @PostMapping("/hotel/details")
    public List<GetHotelInfoResponse> getHotelInfo(@RequestBody List<GetHotelInfoRequest> requests) {
        try {
            // 打印前端提交的原始请求参数
            logger.debug("请求体: {}", requests);
            String requestJson = objectMapper.writeValueAsString(requests);
            logger.debug("前端提交的请求参数: {}", requestJson);
            
            List<GetHotelInfoResponse> responses = new ArrayList<>();
            
            for (GetHotelInfoRequest request : requests) {
                // 设置终端参数
                request.setTerminal_License(terminalLicense);
                request.setTerminal_Seq(terminalSeq);
                request.setTerminal_OprId(terminalOprId);
                
                // 打印每个请求的完整参数（包含终端参数）
                String fullRequestJson = objectMapper.writeValueAsString(request);
                logger.debug("处理请求，完整参数: {}", fullRequestJson);
                
                GetHotelInfoResponse response = getHotelInfoService.getHotelInfo(request);
                
                // 打印每个请求的响应结果
                String responseJson = objectMapper.writeValueAsString(response);
                logger.debug("请求响应结果: {}", responseJson);
                
                responses.add(response);
            }
            
            // 打印最终的响应结果
            String finalResponseJson = objectMapper.writeValueAsString(responses);
            logger.debug("最终返回的响应结果: {}", finalResponseJson);
            
            return responses;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("处理请求失败: " + e.getMessage());
        }
    }

    @PostMapping("/hotel/save")
    public ResponseEntity<?> saveHotelInfo(@RequestBody SaveHotelRequest request) {
        try {
            logger.debug("收到保存酒店信息请求");
            
            // 参数校验
            if (request == null) {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "请求参数不能为空"));
            }
            logger.debug("ChainId: {}", request.getChainId());
            // 验证必填字段
            if (request.getChainId() == null || request.getChainId().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "集团不能为空"));
            }
            if (request.getHotelCode() == null || request.getHotelCode().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "酒店代码不能为空"));
            }
            if (request.getHotelName() == null || request.getHotelName().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "酒店名称不能为空"));
            }
            
            FrontendUser frontendUser = request.getUser();
            if (frontendUser == null) {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "用户信息不能为空"));
            }
            
            logger.debug("开始保存酒店信息: {}", objectMapper.writeValueAsString(request));
            
            // 将FrontendUser转换为User对象
            User user = new User();
            if (frontendUser != null) {
                user.setUserId(frontendUser.getUserId());
                user.setUsername(frontendUser.getUserName());
                user.setLoginName(frontendUser.getLoginName());
                // 将roleId转换为Integer类型
                try {
                    if (frontendUser.getRoleId() != null && !frontendUser.getRoleId().isEmpty()) {
                        user.setType(Integer.parseInt(frontendUser.getRoleId()));
                    }
                } catch (NumberFormatException e) {
                    logger.warn("无法将roleId转换为Integer类型: {}", frontendUser.getRoleId());
                    return ResponseEntity.badRequest()
                        .body(Map.of("success", false, "message", "角色ID格式不正确"));
                }
                user.setPosition(frontendUser.getRoleName());
                user.setChainId(frontendUser.getChainId());
                user.setChainName(frontendUser.getChainName());
            }
            
            logger.debug("酒店信息: {}", objectMapper.writeValueAsString(request));
            logger.debug("用户信息: {}", objectMapper.writeValueAsString(user));
            
            // 检查酒店是否已存在
            Hotel existingHotel = hotelMapper.selectByHotelCodeAndChain(
                request.getHotelCode(),
                request.getChainId() != null ? request.getChainId() : "homeinns"
            );
            
            logger.debug("查询到的已存在酒店信息: {}", existingHotel != null ? objectMapper.writeValueAsString(existingHotel) : "null");
            
            Hotel hotel = new Hotel();
            hotel.setHotelCode(request.getHotelCode());
            hotel.setHotelName(request.getHotelName());
            hotel.setAddress(request.getAddress());
            hotel.setDescription(request.getDescription());
            hotel.setContactPhone(request.getTel());
            hotel.setContactEmail(request.getEmail());
            hotel.setCityId(request.getCityCode());
            
            try {
                if (existingHotel != null) {
                    // 如果酒店已存在，更新信息
                    existingHotel.setHotelCode(hotel.getHotelCode());
                    existingHotel.setHotelName(hotel.getHotelName());
                    existingHotel.setAddress(hotel.getAddress());
                    existingHotel.setContactPhone(hotel.getContactPhone());
                    existingHotel.setContactEmail(hotel.getContactEmail());
                    existingHotel.setCityId(hotel.getCityId());
                    existingHotel.setDescription(hotel.getDescription());
                    existingHotel.setUpdatedAt(new java.util.Date());
                    hotelMapper.update(existingHotel);
                    logger.debug("更新酒店信息成功: {}", existingHotel.getHotelCode());
                } else {
                    // 如果酒店不存在，新增信息
                    hotel.setHotelId(UUID.randomUUID().toString().replace("-", ""));
                    hotel.setChainId(request.getChainId() != null ? request.getChainId() : "homeinns");//读取当前用户的集团ID
                    hotel.setCountry("中国");
                    hotel.setStatus(1);
                    hotel.setCreatedAt(new java.util.Date());
                    hotel.setUpdatedAt(new java.util.Date());
                    hotelMapper.insert(hotel);
                    logger.debug("新增酒店信息成功: {}", hotel.getHotelCode());
                }
                
                // 返回保存后的酒店信息
                return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", existingHotel != null ? "更新酒店信息成功" : "新增酒店信息成功",
                    "data", hotel
                ));
            } catch (Exception e) {
                logger.error("保存酒店信息失败", e);
                return ResponseEntity.status(500)
                    .body(Map.of("success", false, "message", "保存酒店信息失败: " + e.getMessage()));
            }
        } catch (Exception e) {
            logger.error("处理请求时发生错误", e);
            return ResponseEntity.status(500)
                .body(Map.of("success", false, "message", "系统错误: " + e.getMessage()));
        }
    }
    
    public static class SaveHotelRequest {
        private String hotelCode;
        private String hotelName;
        private String hotelNameEn;
        private String hotelType;
        private String hotelNature;
        private String contractNo;
        private String address;
        private String tel;
        private String fax;
        private String zip;
        private String email;
        private String cityCode;
        private String landMarkCode;
        private String chainId;
        private String description;
        private FrontendUser user;
        
        // Getters and Setters
        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }
        public String getHotelCode() {
            return hotelCode;
        }
        
        public void setHotelCode(String hotelCode) {
            this.hotelCode = hotelCode;
        }
        
        public String getHotelName() {
            return hotelName;
        }
        
        public void setHotelName(String hotelName) {
            this.hotelName = hotelName;
        }
        
        public String getHotelNameEn() {
            return hotelNameEn;
        }
        
        public void setHotelNameEn(String hotelNameEn) {
            this.hotelNameEn = hotelNameEn;
        }
        
        public String getHotelType() {
            return hotelType;
        }
        
        public void setHotelType(String hotelType) {
            this.hotelType = hotelType;
        }
        
        public String getHotelNature() {
            return hotelNature;
        }
        
        public void setHotelNature(String hotelNature) {
            this.hotelNature = hotelNature;
        }
        
        public String getContractNo() {
            return contractNo;
        }
        
        public void setContractNo(String contractNo) {
            this.contractNo = contractNo;
        }
        
        public String getAddress() {
            return address;
        }
        
        public void setAddress(String address) {
            this.address = address;
        }
        
        public String getTel() {
            return tel;
        }
        
        public void setTel(String tel) {
            this.tel = tel;
        }
        
        public String getFax() {
            return fax;
        }
        
        public void setFax(String fax) {
            this.fax = fax;
        }
        
        public String getZip() {
            return zip;
        }
        
        public void setZip(String zip) {
            this.zip = zip;
        }
        
        public String getEmail() {
            return email;
        }
        
        public void setEmail(String email) {
            this.email = email;
        }
        
        public String getCityCode() {
            return cityCode;
        }
        
        public void setCityCode(String cityCode) {
            this.cityCode = cityCode;
        }
        
        public String getLandMarkCode() {
            return landMarkCode;
        }
        
        public void setLandMarkCode(String landMarkCode) {
            this.landMarkCode = landMarkCode;
        }
        
        public String getChainId() {
            return chainId;
        }
        
        public void setChainId(String chainId) {
            this.chainId = chainId;
        }
        
        public FrontendUser getUser() {
            return user;
        }
        
        public void setUser(FrontendUser user) {
            this.user = user;
        }
    }
    
    // 添加一个内部类来处理前端传递的User对象
    public static class FrontendUser {
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
} 