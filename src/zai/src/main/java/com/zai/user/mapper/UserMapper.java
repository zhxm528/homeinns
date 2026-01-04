package com.zai.user.mapper;

import com.zai.user.entity.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Mapper
@Repository("userMapper")
public interface UserMapper {
    /**
     * 插入用户
     */
    int insert(User user);

    /**
     * 根据UserID删除用户
     */
    int deleteByUserId(@Param("userId") String userId);

    /**
     * 更新用户
     */
    int update(User user);

    /**
     * 根据UserID查询用户
     */
    List<User> selectByUserId(@Param("userId") String userId);

    /**
     * 查询所有用户
     */
    List<User> selectAll();

    /**
     * 根据条件查询用户
     */
    List<User> selectByCondition(
        @Param("chainId") String chainId,
        @Param("loginName") String loginName,
        @Param("username") String username,
        @Param("email") String email,
        @Param("phone") String phone,
        @Param("status") String status,
        @Param("type") String type
    );

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
    int deleteUser(@Param("id") String id);

    /**
     * 测试数据库连接
     */
    int testConnection();

    /**
     * 根据登录名查询用户
     */
    List<User> selectByLoginName(@Param("loginName") String loginName);

    /**
     * 根据UserID查询用户
     */
    User getUserByUserId(@Param("userId") String userId);

    /**
     * 根据UserID更新用户
     */
    int updateHotelIdByUserId(@Param("userId") String userId, @Param("hotelId") String hotelId);

   
    /**
     * 根据条件查询用户（支持多个集团ID）
     */
    List<User> selectByConditionWithChainIds(
        @Param("chainIds") List<String> chainIds,
        @Param("loginName") String loginName,
        @Param("username") String username,
        @Param("email") String email,
        @Param("phone") String phone,
        @Param("status") String status,
        @Param("type") String type
    );
    
} 