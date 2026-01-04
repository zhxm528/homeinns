package com.zai.user.controller;

import com.zai.user.entity.User;
import com.zai.user.service.UserService;
import com.zai.user.dto.UserUpdateRequest;
import com.zai.user.dto.UserListRequest;
import com.zai.chain.entity.Chain;
import com.zai.chain.service.ChainService;
import com.zai.util.PasswordUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import javax.servlet.http.HttpSession;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/user")
public class UserController {
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);
    private static final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    private UserService userService;

    @Autowired
    private ChainService chainService;

    @Autowired
    private HttpSession session;

    @GetMapping("/index")
    public String index(Model model) {
        try {
            List<Chain> chains = chainService.selectAll();
            logger.debug("Loaded {} chains", chains.size());
            for (Chain chain : chains) {
                logger.debug("Chain: id={}, name={}", chain.getChainId(), chain.getChainName());
            }
            model.addAttribute("chains", chains);
            return "user/index";
        } catch (Exception e) {
            logger.error("Failed to load chains", e);
            model.addAttribute("error", "加载集团数据失败");
            return "user/index";
        }
    }

    @PostMapping("/list")
    @ResponseBody
    public ResponseEntity<List<User>> getUsers(@RequestBody UserListRequest request) {
        try {
            logger.debug("请求体: {}", objectMapper.writeValueAsString(request));
            List<User> users = userService.selectByConditionWithChainIds(
                request.getChainIds(),
                request.getLoginName(), 
                request.getUsername(), 
                request.getEmail(), 
                request.getPhone(), 
                request.getStatus(), 
                request.getType()
            );
            
            logger.debug("响应体: {}", objectMapper.writeValueAsString(users));
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            logger.error("获取用户列表失败", e);
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable String id) {
        try {
            logger.debug("Getting user by ID: {}", id);
            List<User> users = userService.selectByUserId(id);
            if (!users.isEmpty()) {
                User user = users.get(0);
                
                // 设置响应头，确保正确的字符编码
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                headers.set("Content-Type", "application/json;charset=UTF-8");
                
                return new ResponseEntity<>(user, headers, HttpStatus.OK);
            } else {
                logger.warn("User not found with ID: {}", id);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            logger.error("Error getting user by ID: {}", id, e);
            return ResponseEntity.status(500).build();
        }
    }

    @PostMapping("/add")
    public ResponseEntity<Map<String, Object>> addUser(@RequestBody User user) {
        try {
            // 打印JSON格式的请求体
            String requestJson = objectMapper.writeValueAsString(user);
            logger.debug("新增用户请求体：{}", requestJson);
            
            // 参数校验
            if (user.getLoginName() == null || user.getLoginName().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "登录名不能为空"));
            }
            if (user.getUsername() == null || user.getUsername().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "显示名不能为空"));
            }
            if (user.getPassword() == null || user.getPassword().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "密码不能为空"));
            }
            if (user.getChainId() == null || user.getChainId().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "集团ID不能为空"));
            }
            
            // 检查登录名、邮箱、手机号是否已存在
            List<User> existingUsers = userService.findUsers(user.getLoginName(), null, user.getEmail(), user.getPhone(), null, null);
            for (User existingUser : existingUsers) {
                if (existingUser.getLoginName() != null && 
                    existingUser.getLoginName().equals(user.getLoginName())) {
                    return ResponseEntity.badRequest()
                        .body(Map.of("success", false, "message", "登录名已存在"));
                }
                
                if (user.getEmail() != null && !user.getEmail().trim().isEmpty() && 
                    existingUser.getEmail() != null && 
                    existingUser.getEmail().equals(user.getEmail())) {
                    return ResponseEntity.badRequest()
                        .body(Map.of("success", false, "message", "邮箱已存在"));
                }
                
                if (user.getPhone() != null && !user.getPhone().trim().isEmpty() && 
                    existingUser.getPhone() != null && 
                    existingUser.getPhone().equals(user.getPhone())) {
                    return ResponseEntity.badRequest()
                        .body(Map.of("success", false, "message", "手机号已存在"));
                }
            }
            
            // 设置默认值
            if (user.getStatus() == null) {
                user.setStatus(1); // 默认启用
            }
            
            // 加密密码
            String encryptedPassword = PasswordUtil.encryptPassword(user.getPassword());
            user.setPasswordHash(encryptedPassword);
            
            // 新增用户
            int result = userService.insert(user);
            logger.debug("新增用户结果：{}", result);
            
            if (result > 0) {
                return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "用户新增成功",
                    "data", Map.of("userId", user.getUserId())
                ));
            } else {
                return ResponseEntity.status(500)
                    .body(Map.of("success", false, "message", "用户新增失败"));
            }
        } catch (Exception e) {
            logger.error("保存用户失败", e);
            return ResponseEntity.status(500)
                .body(Map.of("success", false, "message", "系统错误：" + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateUser(@PathVariable String id, @RequestBody UserUpdateRequest request) {
        try {
            // 打印JSON格式的请求体
            String requestJson = objectMapper.writeValueAsString(request);
            logger.debug("更新用户请求体：{}", requestJson);
            
            // 验证路径参数和请求体中的userId是否一致
            if (!id.equals(request.getUserId())) {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "路径参数ID与请求体中的userId不匹配"));
            }
            
            // 验证必填字段
            if (request.getLoginName() == null || request.getLoginName().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "登录名不能为空"));
            }
            if (request.getUsername() == null || request.getUsername().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "显示名不能为空"));
            }
            
            // 检查登录名、邮箱、手机号是否已被其他用户使用
            List<User> existingUsers = userService.findUsers(request.getLoginName(), null, request.getEmail(), request.getPhone(), null, null);
            for (User existingUser : existingUsers) {
                if (!existingUser.getUserId().equals(request.getUserId())) {
                    if (existingUser.getLoginName() != null && 
                        existingUser.getLoginName().equals(request.getLoginName())) {
                        return ResponseEntity.badRequest()
                            .body(Map.of("success", false, "message", "登录名已被其他用户使用"));
                    }
                    
                    if (request.getEmail() != null && !request.getEmail().trim().isEmpty() && 
                        existingUser.getEmail() != null && 
                        existingUser.getEmail().equals(request.getEmail())) {
                        return ResponseEntity.badRequest()
                            .body(Map.of("success", false, "message", "邮箱已被其他用户使用"));
                    }
                    
                    if (request.getPhone() != null && !request.getPhone().trim().isEmpty() && 
                        existingUser.getPhone() != null && 
                        existingUser.getPhone().equals(request.getPhone())) {
                        return ResponseEntity.badRequest()
                            .body(Map.of("success", false, "message", "手机号已被其他用户使用"));
                    }
                }
            }
            
            // 查询现有用户
            List<User> users = userService.selectByUserId(request.getUserId());
            if (users.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "用户不存在"));
            }
            
            // 更新用户信息
            User user = users.get(0);
            user.setLoginName(request.getLoginName());
            user.setUsername(request.getUsername());
            user.setEmail(request.getEmail());
            user.setPhone(request.getPhone());
            user.setType(request.getType() != null ? Integer.parseInt(request.getType()) : null);
            user.setStatus(request.getStatus() != null ? Integer.parseInt(request.getStatus()) : null);
            user.setHotelId(request.getHotelId());
            
            int result = userService.update(user);
            
            if (result > 0) {
                return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "用户更新成功"
                ));
            } else {
                return ResponseEntity.status(500)
                    .body(Map.of("success", false, "message", "用户更新失败"));
            }
        } catch (Exception e) {
            logger.error("更新用户失败", e);
            return ResponseEntity.status(500)
                .body(Map.of("success", false, "message", "系统错误：" + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        try {
            int result = userService.deleteByUserId(id);
            if (result > 0) {
                return ResponseEntity.ok().build();
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/current")
    public ResponseEntity<Map<String, Object>> getCurrentUser(HttpSession session) {
        try {
            String userId = (String) session.getAttribute("UserId");
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("success", false, "message", "用户未登录"));
            }

            List<User> users = userService.selectByUserId(userId);
            if (users.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("success", false, "message", "用户不存在"));
            }

            User user = users.get(0);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", Map.of(
                "loginName", user.getLoginName(),
                "username", user.getUsername()
            ));

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("获取当前用户信息失败", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "message", "系统错误"));
        }
    }

    @PostMapping("/{userId}/reset-password")
    public ResponseEntity<Map<String, Object>> resetPassword(
            @PathVariable String userId,
            @RequestBody Map<String, String> request) {
        try {
            logger.debug("开始重置密码，用户ID: {}", userId);
            
            // 验证请求参数
            if (!userId.equals(request.get("userId"))) {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "用户ID不匹配"));
            }
            
            String newPassword = request.get("userLogin");
            if (newPassword == null || newPassword.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "新密码不能为空"));
            }
            
            // 查询用户是否存在
            List<User> users = userService.selectByUserId(userId);
            if (users.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "用户不存在"));
            }
            
            // 加密新密码
            String encryptedPassword = PasswordUtil.encryptPassword(newPassword);
            
            // 更新用户密码
            User user = users.get(0);
            user.setPasswordHash(encryptedPassword);
            int result = userService.update(user);
            
            if (result > 0) {
                logger.debug("密码重置成功，用户ID: {}", userId);
                return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "密码重置成功"
                ));
            } else {
                logger.error("密码重置失败，用户ID: {}", userId);
                return ResponseEntity.status(500)
                    .body(Map.of("success", false, "message", "密码重置失败"));
            }
        } catch (Exception e) {
            logger.error("重置密码时发生错误", e);
            return ResponseEntity.status(500)
                .body(Map.of("success", false, "message", "系统错误：" + e.getMessage()));
        }
    }
} 