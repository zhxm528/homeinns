package com.zai.user.service;

import com.zai.user.entity.User;
import com.zai.user.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
public class UserServiceTest {

    @Autowired
    private UserService userService;

    @Test
    public void testSelectByConditionWithChainIds() {
        // 测试使用多个集团ID查询用户
        List<String> chainIds = Arrays.asList("chain1", "chain2", "chain3");
        String loginName = "test";
        String username = "测试用户";
        String email = "test@example.com";
        String phone = "13800138000";
        String status = "1";
        String type = "1";

        List<User> users = userService.selectByConditionWithChainIds(
            chainIds, loginName, username, email, phone, status, type
        );
        
        assertNotNull(users);
        // 这里可以根据实际业务逻辑添加更多断言
    }

    @Test
    public void testSelectByConditionWithEmptyChainIds() {
        // 测试空集团ID列表
        List<String> chainIds = Arrays.asList();
        
        List<User> users = userService.selectByConditionWithChainIds(
            chainIds, null, null, null, null, null, null
        );
        
        assertNotNull(users);
    }

    @Test
    public void testSelectByConditionWithNullChainIds() {
        // 测试null集团ID列表
        List<String> chainIds = null;
        
        List<User> users = userService.selectByConditionWithChainIds(
            chainIds, null, null, null, null, null, null
        );
        
        assertNotNull(users);
    }
} 