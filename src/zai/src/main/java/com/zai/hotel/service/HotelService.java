package com.zai.hotel.service;

import com.zai.hotel.entity.Hotel;
import java.util.List;

public interface HotelService {
    int insert(Hotel hotel);
    void deleteByHotelId(String hotelId);
    int update(Hotel hotel);
    Hotel selectByHotelId(String hotelId);
    List<Hotel> selectAll();
    List<Hotel> selectByCondition(String hotelName, String cityId, String country, String chainId);
    List<Hotel> selectByChainId(String chainId);
    List<Hotel> selectByConditionWithPaging(String chainId,String hotelCode,String hotelName, String cityId,
     String country, int status, String address, String description, String managementModel, String ownershipType, String managementCompany, String brand, String region, String cityArea, String pmsVersion, int page, int size, int offset);
    Hotel setLocalStorageHotelByHotelId(String hotelId,String userId);
    
    /**
     * 根据连锁ID和酒店代码查询酒店
     * @param chainId 连锁ID
     * @param hotelCode 酒店代码
     * @return 酒店信息
     */
    Hotel getHotelByChainIdAndHotelCode(String chainId, String hotelCode);
    List<Hotel> selectByComponentWithPaging(String chainId,String hotelCode,String hotelName, int page, int size, int offset);
    
    /**
     * 根据条件统计酒店总数
     * @param chainId 连锁ID
     * @param hotelCode 酒店代码
     * @param hotelName 酒店名称
     * @param cityId 城市ID
     * @param country 国家
     * @param status 状态
     * @param address 地址
     * @param description 描述
     * @param managementModel 管理模式
     * @param ownershipType 所有权类型
     * @param managementCompany 管理公司
     * @param brand 品牌
     * @param region 区域
     * @param cityArea 城市区域
     * @param pmsVersion PMS版本
     * @return 总条数
     */
    int countByCondition(String chainId, String hotelCode, String hotelName, String cityId,
                        String country, int status, String address, String description,
                        String managementModel, String ownershipType, String managementCompany,
                        String brand, String region, String cityArea, String pmsVersion);
} 