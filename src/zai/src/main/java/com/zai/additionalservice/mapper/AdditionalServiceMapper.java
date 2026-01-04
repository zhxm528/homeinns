package com.zai.additionalservice.mapper;

import com.zai.additionalservice.entity.AdditionalService;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface AdditionalServiceMapper {
    List<AdditionalService> selectByCondition(@Param("chainId") String chainId,
                                            @Param("hotelId") String hotelId,
                                            @Param("rateCodeId") String rateCodeId,
                                            @Param("serviceName") String serviceName);

    List<AdditionalService> selectByServiceId(@Param("serviceId") String serviceId);

    int insert(AdditionalService additionalService);

    int update(AdditionalService additionalService);

    int deleteByServiceId(@Param("serviceId") String serviceId);

    /**
     * 日历查询条件查询附加服务
     * 
     * @param hotelId 酒店ID
     * @param rateCodeIds 价格代码ID列表
     * @return 附加服务列表
     */
    List<AdditionalService> calendarByConditions(@Param("hotelId") String hotelId,
                                                @Param("rateCodeIds") List<String> rateCodeIds);

    List<AdditionalService> selectByPackageCode(@Param("packageCode") String packageCode);
} 