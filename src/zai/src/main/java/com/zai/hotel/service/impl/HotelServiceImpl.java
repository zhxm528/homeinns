package com.zai.hotel.service.impl;

import com.zai.hotel.entity.Hotel;
import com.zai.hotel.mapper.HotelMapper;
import com.zai.hotel.service.HotelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.zai.user.entity.User;
import com.zai.user.mapper.UserMapper;

@Service
public class HotelServiceImpl implements HotelService {
    private static final Logger logger = LoggerFactory.getLogger(HotelServiceImpl.class);
    
    @Autowired
    private HotelMapper hotelMapper;

    
    @Autowired
    private UserMapper userMapper;

    @Override
    public int insert(Hotel hotel) {
        try {
            // 1. 生成UUID作为hotelId
            String hotelId = UUID.randomUUID().toString();
            hotel.setHotelId(hotelId);
            
            // 2. 检查chainId+hotelCode是否重复
            List<Hotel> existingHotels = hotelMapper.selectHotelCodeByChainId(hotel.getChainId());
            
            boolean isDuplicate = existingHotels.stream()
                .anyMatch(h -> h.getHotelCode().equals(hotel.getHotelCode()));
                
            if (isDuplicate) {
                return 0;
            }
            
            // 3. 保存酒店信息
            hotelMapper.insert(hotel);
            logger.debug("新增酒店成功: hotelId={}, hotelCode={}, chainId={}", 
                hotelId, hotel.getHotelCode(), hotel.getChainId());
            return 1;
                
        } catch (Exception e) {
            logger.error("新增酒店失败: {}", e.getMessage(), e);
            return 0;
        }
        
    }

    @Override
    public void deleteByHotelId(String hotelId) {
        hotelMapper.deleteByHotelId(hotelId);
    }

    @Override
    public int update(Hotel hotel) {
        try {
            // 1. 检查chainId+hotelCode是否重复（排除当前酒店）
            List<Hotel> existingHotels = hotelMapper.selectByChainIdExcludeHotelCode(hotel.getChainId(),hotel.getHotelCode());
            
            boolean isDuplicate = existingHotels.stream()
                .filter(h -> !h.getHotelId().equals(hotel.getHotelId())) // 排除当前酒店
                .anyMatch(h -> h.getHotelCode().equals(hotel.getHotelCode()));
                
            if (isDuplicate) {
                logger.debug("更新酒店失败: chainId={}, hotelCode={} 已存在", 
                    hotel.getChainId(), hotel.getHotelCode());
                return 0;
            }
            
            // 2. 更新酒店信息
            hotelMapper.update(hotel);
            logger.debug("更新酒店成功: hotelId={}, chainId={}, hotelCode={}", 
                hotel.getHotelId(), hotel.getChainId(), hotel.getHotelCode());
            return 1;
            
        } catch (Exception e) {
            logger.error("更新酒店失败: {}", e.getMessage(), e);
            return 0;
        }
    }

    @Override
    public Hotel selectByHotelId(String hotelId) {
        Hotel hotel = hotelMapper.selectByHotelId(hotelId);
        if (hotel != null) {
            logger.debug("查询酒店详情: hotelId={}, chainId={}, hotelCode={}, hotelName={}, address={}, description={}, cityId={}, status={}, contactEmail={}, contactPhone={}", 
                hotel.getHotelId(),
                hotel.getChainId(),
                hotel.getHotelCode(),
                hotel.getHotelName(),
                hotel.getAddress(),
                hotel.getDescription(),
                hotel.getCityId(),
                hotel.getStatus(),
                hotel.getContactEmail(),
                hotel.getContactPhone()
            );
        } else {
            logger.debug("未找到酒店信息: hotelId={}", hotelId);
        }
        return hotel;
    }

    @Override
    public List<Hotel> selectAll() {
        return hotelMapper.selectAll();
    }

    @Override
    public List<Hotel> selectByCondition(String hotelName, String cityId, String country, String chainId) {
        return hotelMapper.selectByCondition(hotelName, cityId, country, chainId);
    }

    @Override
    public List<Hotel> selectByChainId(String chainId) {
        return hotelMapper.selectByChainId(chainId);
    }

    @Override
    public List<Hotel> selectByConditionWithPaging(String chainId,String hotelCode,String hotelName, String cityId,
     String country, int status, String address, String description, String managementModel, String ownershipType, String managementCompany, String brand, String region, String cityArea, String pmsVersion, int page, int size, int offset) {
        return hotelMapper.selectByConditionWithPaging(chainId,hotelCode,hotelName, cityId, country, 
          status, address, description, managementModel, ownershipType, managementCompany, brand, region, cityArea, pmsVersion, page, size, offset);
    }

    @Override
    public Hotel setLocalStorageHotelByHotelId(String hotelId,String userId) {
        //根据userId查询出的User表的hotelId字段
        userMapper.updateHotelIdByUserId(userId,hotelId);
        return hotelMapper.setLocalStorageHotelByHotelId(hotelId);
    }
    
    @Override
    public Hotel getHotelByChainIdAndHotelCode(String chainId, String hotelCode) {
        try {
            Hotel hotel = hotelMapper.selectByChainIdAndHotelCode(chainId, hotelCode);
            if (hotel != null) {
                logger.debug("查询酒店信息: chainId={}, hotelCode={}, hotelName={}", 
                    chainId, hotelCode, hotel.getHotelName());
            } else {
                logger.debug("未找到酒店信息: chainId={}, hotelCode={}", chainId, hotelCode);
            }
            return hotel;
        } catch (Exception e) {
            logger.error("查询酒店信息失败: chainId={}, hotelCode={}", chainId, hotelCode, e);
            return null;
        }
    }


    @Override
    public List<Hotel> selectByComponentWithPaging(String chainId,String hotelCode,String hotelName, int page, int size, int offset) {
        return hotelMapper.selectByComponentWithPaging(chainId,hotelCode,hotelName, page, size, offset);
    }
    
    @Override
    public int countByCondition(String chainId, String hotelCode, String hotelName, String cityId,
                              String country, int status, String address, String description,
                              String managementModel, String ownershipType, String managementCompany,
                              String brand, String region, String cityArea, String pmsVersion) {
        return hotelMapper.countByCondition(chainId, hotelCode, hotelName, cityId, country, status,
                address, description, managementModel, ownershipType, managementCompany,
                brand, region, cityArea, pmsVersion);
    }
} 