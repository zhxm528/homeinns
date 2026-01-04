package com.zai.booking.service;

import com.zai.booking.entity.Guest;
import java.util.List;

public interface GuestService {
    
    /**
     * 添加客人信息
     */
    int addGuest(Guest guest);
    
    /**
     * 删除客人信息
     */
    void deleteGuest(String guestId);
    
    /**
     * 更新客人信息
     */
    int updateGuest(Guest guest);
    
    /**
     * 根据客人ID查询
     */
    Guest getGuestById(String guestId);
    
    /**
     * 根据客人姓名查询
     */
    List<Guest> getGuestsByName(String guestName);
    
    /**
     * 根据手机号查询
     */
    Guest getGuestByPhone(String phone);
    
    /**
     * 根据邮箱查询
     */
    Guest getGuestByEmail(String email);
    
    /**
     * 根据证件号码查询
     */
    Guest getGuestByIdNumber(String idNumber);
    
    /**
     * 根据会员卡号查询
     */
    List<Guest> getGuestsByMemberCardNo(String memberCardNo);
    
    /**
     * 根据会员类型查询
     */
    List<Guest> getGuestsByMemberType(String memberType);
    
    /**
     * 查询所有客人
     */
    List<Guest> getAllGuests();
    
    /**
     * 根据条件查询客人列表
     */
    List<Guest> getGuestList(String guestName, String guestEname, String phone, 
                           String email, String memberType, int page, int size);
    
    /**
     * 统计客人数量
     */
    int countGuests(String guestName, String guestEname, String phone, 
                   String email, String memberType);
} 