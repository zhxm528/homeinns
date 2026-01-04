package com.zai.user.service;

import com.zai.user.entity.User;
import java.util.List;
import org.apache.ibatis.annotations.Param;

public interface UserService {
    /**
     * 根据条件查询用户
     */
    List<User> findUsers(
        @Param("loginName") String loginName,
        @Param("username") String username,
        @Param("email") String email,
        @Param("phone") String phone,
        @Param("status") String status,
        @Param("type") String type
    );

    /**
     * 根据UserID删除用户
     */
    int deleteByUserId(String userId);

    /**
     * 添加用户
     */
    int insert(User user);

    /**
     * 更新用户
     */
    int update(User user);

    /**
     * 根据UserID查询用户
     */
    List<User> selectByUserId(String userId);

    /**
     * 查询所有用户
     */
    List<User> selectAll();

    /**
     * 根据条件查询用户
     */
    List<User> selectByCondition(
        String chainId,
        String loginName, 
        String username, 
        String email, 
        String phone, 
        String status, 
        String type
    );

    /**
     * 根据条件查询用户（支持多个集团ID）
     */
    List<User> selectByConditionWithChainIds(
        List<String> chainIds,
        String loginName, 
        String username, 
        String email, 
        String phone, 
        String status, 
        String type
    );
  

    List<User> selectByLoginName(String loginName);
}