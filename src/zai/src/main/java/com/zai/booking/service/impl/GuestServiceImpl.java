package com.zai.booking.service.impl;

import com.zai.booking.entity.Guest;
import com.zai.booking.mapper.GuestMapper;
import com.zai.booking.service.GuestService;
import com.zai.util.IdGenerator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GuestServiceImpl implements GuestService {
    
    private static final Logger logger = LoggerFactory.getLogger(GuestServiceImpl.class);
    
    @Autowired
    private GuestMapper guestMapper;
    
    @Override
    public int addGuest(Guest guest) {
        try {
            logger.debug("开始添加客人信息: {}", guest);
            
            // 生成客人ID
            guest.setGuestId(IdGenerator.generate64BitId());
            
            guestMapper.insert(guest);
            
            logger.debug("客人信息添加成功: guestId={}", guest.getGuestId());
            return 1;
            
        } catch (Exception e) {
            logger.error("添加客人信息失败", e);
            throw new RuntimeException("添加客人信息失败: " + e.getMessage());
        }
    }
    
    @Override
    public void deleteGuest(String guestId) {
        try {
            logger.debug("开始删除客人信息: {}", guestId);
            guestMapper.deleteByGuestId(guestId);
            logger.debug("客人信息删除成功: guestId={}", guestId);
        } catch (Exception e) {
            logger.error("删除客人信息失败", e);
            throw new RuntimeException("删除客人信息失败: " + e.getMessage());
        }
    }
    
    @Override
    public int updateGuest(Guest guest) {
        try {
            logger.debug("开始更新客人信息: {}", guest.getGuestId());
            guestMapper.update(guest);
            logger.debug("客人信息更新成功: guestId={}", guest.getGuestId());
            return 1;
        } catch (Exception e) {
            logger.error("更新客人信息失败", e);
            throw new RuntimeException("更新客人信息失败: " + e.getMessage());
        }
    }
    
    @Override
    public Guest getGuestById(String guestId) {
        try {
            return guestMapper.selectByGuestId(guestId);
        } catch (Exception e) {
            logger.error("查询客人信息失败", e);
            throw new RuntimeException("查询客人信息失败: " + e.getMessage());
        }
    }
    
    @Override
    public List<Guest> getGuestsByName(String guestName) {
        try {
            return guestMapper.selectByGuestName(guestName);
        } catch (Exception e) {
            logger.error("根据姓名查询客人失败", e);
            throw new RuntimeException("根据姓名查询客人失败: " + e.getMessage());
        }
    }
    
    @Override
    public Guest getGuestByPhone(String phone) {
        try {
            return guestMapper.selectByPhone(phone);
        } catch (Exception e) {
            logger.error("根据手机号查询客人失败", e);
            throw new RuntimeException("根据手机号查询客人失败: " + e.getMessage());
        }
    }
    
    @Override
    public Guest getGuestByEmail(String email) {
        try {
            return guestMapper.selectByEmail(email);
        } catch (Exception e) {
            logger.error("根据邮箱查询客人失败", e);
            throw new RuntimeException("根据邮箱查询客人失败: " + e.getMessage());
        }
    }
    
    @Override
    public Guest getGuestByIdNumber(String idNumber) {
        try {
            return guestMapper.selectByIdNumber(idNumber);
        } catch (Exception e) {
            logger.error("根据证件号码查询客人失败", e);
            throw new RuntimeException("根据证件号码查询客人失败: " + e.getMessage());
        }
    }
    
    @Override
    public List<Guest> getGuestsByMemberCardNo(String memberCardNo) {
        try {
            return guestMapper.selectByMemberCardNo(memberCardNo);
        } catch (Exception e) {
            logger.error("根据会员卡号查询客人失败", e);
            throw new RuntimeException("根据会员卡号查询客人失败: " + e.getMessage());
        }
    }
    
    @Override
    public List<Guest> getGuestsByMemberType(String memberType) {
        try {
            return guestMapper.selectByMemberType(memberType);
        } catch (Exception e) {
            logger.error("根据会员类型查询客人失败", e);
            throw new RuntimeException("根据会员类型查询客人失败: " + e.getMessage());
        }
    }
    
    @Override
    public List<Guest> getAllGuests() {
        try {
            return guestMapper.selectAll();
        } catch (Exception e) {
            logger.error("查询所有客人失败", e);
            throw new RuntimeException("查询所有客人失败: " + e.getMessage());
        }
    }
    
    @Override
    public List<Guest> getGuestList(String guestName, String guestEname, String phone, 
                                  String email, String memberType, int page, int size) {
        try {
            int offset = page * size;
            return guestMapper.selectByCondition(guestName, guestEname, phone, email, 
                                               memberType, page, size, offset);
        } catch (Exception e) {
            logger.error("查询客人列表失败", e);
            throw new RuntimeException("查询客人列表失败: " + e.getMessage());
        }
    }
    
    @Override
    public int countGuests(String guestName, String guestEname, String phone, 
                          String email, String memberType) {
        try {
            return guestMapper.countByCondition(guestName, guestEname, phone, email, memberType);
        } catch (Exception e) {
            logger.error("统计客人数量失败", e);
            throw new RuntimeException("统计客人数量失败: " + e.getMessage());
        }
    }
} 