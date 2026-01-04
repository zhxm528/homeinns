package com.zai.user.service.impl;

import com.zai.user.entity.User;
import com.zai.user.mapper.UserMapper;
import com.zai.user.service.UserService;
import com.zai.util.IdGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import javax.annotation.PostConstruct;
import java.util.List;
import java.util.Date;
import java.util.Map;

@Service
@Transactional
public class UserServiceImpl implements UserService {
    private static final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);

    @Qualifier("userMapper")
    @Autowired
    private UserMapper userMapper;

    @Autowired
    private JdbcTemplate jdbcTemplate;

   

    @Override
    public int insert(User user) {
        logger.debug("Adding new user: {}", user);
        String userId = IdGenerator.generate64BitId();
        user.setUserId(userId);
        return userMapper.insert(user);
    }

    @Override
    public int deleteByUserId(String userId) {
        logger.debug("Deleting user with ID: {}", userId);
        return userMapper.deleteByUserId(userId);
    }

    @Override
    public int update(User user) {
        logger.debug("Updating user: {}", user);
        return userMapper.update(user);
    }

    @Override
    public List<User> selectByUserId(String userId) {
        logger.debug("Fetching user by userId: {}", userId);
        try {
            List<User> users = userMapper.selectByUserId(userId);
            logger.debug("Found {} users", users.size());
            return users;
        } catch (Exception e) {
            logger.error("Error fetching user by userId: {}", userId, e);
            throw e;
        }
    }

    @Override
    public List<User> selectAll() {
        logger.debug("Fetching all users");
        try {
            List<User> users = userMapper.selectAll();
            logger.debug("Found {} users", users.size());
            return users;
        } catch (Exception e) {
            logger.error("Error fetching all users", e);
            throw e;
        }
    }

    @Override
    public List<User> selectByCondition(String chainId,String loginName, 
    String username, String email, String phone,
      String status, String type) {
        logger.debug("Searching users with loginName: {}, username: {}, email: {}, phone: {}, department: {}, status: {}, type: {}", 
            loginName, username, email, phone, status, type);
        try {
            List<User> users = userMapper.selectByCondition(chainId,loginName, username, email, phone, status, type);
            logger.debug("Found {} users matching criteria", users.size());
            return users;
        } catch (Exception e) {
            logger.error("Error searching users", e);
            throw e;
        }
    }

    @Override
    public List<User> findUsers(String loginName, String username, String email, String phone, String status, String type) {
        logger.debug("Finding users with loginName: {}, username: {}, email: {}, phone: {}, status: {}, type: {}", 
            loginName, username, email, phone, status, type);
        try {
            List<User> users = userMapper.findUsers(loginName, username, email, phone, status, type);
            logger.debug("Found {} users", users.size());
            return users;
        } catch (Exception e) {
            logger.error("Error finding users", e);
            throw e;
        }
    }

   
    public void checkTableStructure() {
        logger.debug("Checking table structure");
        try {
            String sql = "SHOW COLUMNS FROM zai.users";
            List<Map<String, Object>> columns = jdbcTemplate.queryForList(sql);
            logger.debug("Actual table structure:");
            columns.forEach(column -> {
                String columnName = (String) column.get("Field");
                String columnType = (String) column.get("Type");
                logger.debug("Column: {} - Type: {}", columnName, columnType);
            });
        } catch (Exception e) {
            logger.error("Error checking table structure", e);
            throw e;
        }
    }

    @Override
    public List<User> selectByLoginName(String loginName) {
        return userMapper.selectByLoginName(loginName);
    }

    @Override
    public List<User> selectByConditionWithChainIds(List<String> chainIds, String loginName, 
        String username, String email, String phone, String status, String type) {
        logger.debug("Searching users with chainIds: {}, loginName: {}, username: {}, email: {}, phone: {}, status: {}, type: {}", 
            chainIds, loginName, username, email, phone, status, type);
        try {
            List<User> users = userMapper.selectByConditionWithChainIds(chainIds, loginName, username, email, phone, status, type);
            logger.debug("Found {} users matching criteria", users.size());
            return users;
        } catch (Exception e) {
            logger.error("Error searching users with chainIds", e);
            throw e;
        }
    }
} 