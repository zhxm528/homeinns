package com.zai.hotel.mapper;

import com.zai.hotel.entity.Hotel;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Mapper
@Repository
public interface HotelMapper {
    void insert(Hotel hotel);
    void deleteByHotelId(String hotelId);
    void update(Hotel hotel);
    Hotel selectByHotelId(String hotelId);
    Hotel selectByHotelCode(String hotelCode);
    Hotel selectByHotelCodeAndChain(@Param("hotelCode") String hotelCode, @Param("chainId") String chainId);
    List<Hotel> selectAll();
    List<Hotel> selectByCondition(@Param("hotelName") String hotelName, 
                                @Param("cityId") String cityId, 
                                @Param("country") String country, 
                                @Param("chainId") String chainId);
    List<Hotel> selectByChainId(String chainId);
    List<Hotel> selectByConditionWithPaging(@Param("chainId") String chainId,
                                          @Param("hotelCode") String hotelCode,
                                          @Param("hotelName") String hotelName,
                                          @Param("cityId") String cityId,
                                          @Param("country") String country,
                                          @Param("status") int status,
                                          @Param("address") String address,
                                          @Param("description") String description,
                                          @Param("managementModel") String managementModel,
                                          @Param("ownershipType") String ownershipType,
                                          @Param("managementCompany") String managementCompany,
                                          @Param("brand") String brand,
                                          @Param("region") String region,
                                          @Param("cityArea") String cityArea,
                                          @Param("pmsVersion") String pmsVersion,
                                          @Param("page") int page,
                                          @Param("size") int size,
                                          @Param("offset") int offset);
    
    /**
     * 根据ID更新酒店信息
     * @param hotel 酒店信息
     * @return 影响行数
     */
    int updateById(Hotel hotel);
    
    /**
     * 根据连锁ID和酒店代码查询酒店
     * @param chainId 连锁ID
     * @param hotelCode 酒店代码
     * @return 酒店信息
     */
    Hotel selectByChainIdAndHotelCode(@Param("chainId") String chainId, @Param("hotelCode") String hotelCode);

    
    List<Hotel> selectHotelCodeByChainId(@Param("chainId") String chainId);
    
    /**
     * 根据连锁ID查询除指定酒店代码外的所有酒店
     * @param chainId 连锁ID
     * @param hotelCode 要排除的酒店代码
     * @return 酒店列表
     */
    List<Hotel> selectByChainIdExcludeHotelCode(
        @Param("chainId") String chainId, 
        @Param("hotelCode") String hotelCode);

    /**
     * 根据酒店ID设置localStorage酒店
     * @param hotelId 酒店ID
     * @return 酒店信息
     */
    Hotel setLocalStorageHotelByHotelId(@Param("hotelId") String hotelId);

    /**
     * 根据酒店ID查询酒店
     * @param hotelId 酒店ID
     * @return 酒店信息
     */
    Hotel selectByPrimaryKey(@Param("hotelId") String hotelId);

    /**
     * 根据预算查询条件获取酒店列表
     * @param hotelId 酒店ID（可选）
     * @param chainId 连锁ID（可选）
     * @param cityId 城市ID（可选）
     * @param hotelManagementModel 酒店管理模式（可选）
     * @return 酒店列表
     */
    List<Hotel> getBudgetHotelList(@Param("hotelId") String hotelId,
                                  @Param("chainId") String chainId,
                                  @Param("cityId") String cityId,
                                  @Param("hotelManagementModel") String hotelManagementModel);

    /**
     * 批量查询已存在的酒店代码
     * @param hotelCodes 酒店代码列表
     * @return 已存在的酒店代码列表
     */
    List<String> selectExistingHotelCodes(@Param("hotelCodes") List<String> hotelCodes);

    List<Hotel> selectByComponentWithPaging(@Param("chainId") String chainId,
                                          @Param("hotelCode") String hotelCode,
                                          @Param("hotelName") String hotelName,
                                          @Param("page") int page,
                                          @Param("size") int size,
                                          @Param("offset") int offset);

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
    int countByCondition(@Param("chainId") String chainId,
                        @Param("hotelCode") String hotelCode,
                        @Param("hotelName") String hotelName,
                        @Param("cityId") String cityId,
                        @Param("country") String country,
                        @Param("status") int status,
                        @Param("address") String address,
                        @Param("description") String description,
                        @Param("managementModel") String managementModel,
                        @Param("ownershipType") String ownershipType,
                        @Param("managementCompany") String managementCompany,
                        @Param("brand") String brand,
                        @Param("region") String region,
                        @Param("cityArea") String cityArea,
                        @Param("pmsVersion") String pmsVersion);
    
} 