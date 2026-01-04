package com.zai.booking.mapper;

import com.zai.booking.entity.Guest;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Mapper
@Repository
public interface GuestMapper {
    
    /**
     * 插入客人信息
     */
    void insert(Guest guest);
    
    /**
     * 根据客人ID删除
     */
    void deleteByGuestId(String guestId);
    
    /**
     * 更新客人信息
     */
    void update(Guest guest);
    
    /**
     * 根据客人ID查询
     */
    Guest selectByGuestId(String guestId);
    
    /**
     * 根据客人姓名查询
     */
    List<Guest> selectByGuestName(String guestName);
    
    /**
     * 根据客人英文姓名查询
     */
    List<Guest> selectByGuestEname(String guestEname);
    
    /**
     * 根据手机号查询
     */
    Guest selectByPhone(String phone);
    
    /**
     * 根据邮箱查询
     */
    Guest selectByEmail(String email);
    
    /**
     * 根据证件号码查询
     */
    Guest selectByIdNumber(String idNumber);
    
    /**
     * 根据会员卡号查询
     */
    List<Guest> selectByMemberCardNo(String memberCardNo);
    
    /**
     * 根据会员类型查询
     */
    List<Guest> selectByMemberType(String memberType);
    
    /**
     * 根据条件查询客人列表
     */
    List<Guest> selectByCondition(@Param("guestName") String guestName,
                                 @Param("guestEname") String guestEname,
                                 @Param("phone") String phone,
                                 @Param("email") String email,
                                 @Param("memberType") String memberType,
                                 @Param("page") int page,
                                 @Param("size") int size,
                                 @Param("offset") int offset);
    
    /**
     * 查询所有客人
     */
    List<Guest> selectAll();
    
    /**
     * 统计客人数量
     */
    int countByCondition(@Param("guestName") String guestName,
                        @Param("guestEname") String guestEname,
                        @Param("phone") String phone,
                        @Param("email") String email,
                        @Param("memberType") String memberType);
} 