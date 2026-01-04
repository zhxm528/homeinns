package com.zai.additionalservice.service;

import com.zai.additionalservice.entity.AdditionalService;
import java.util.List;

public interface AdditionalServiceService {
    List<AdditionalService> selectByCondition(String chainId, String hotelId, String rateCodeId, String serviceName);

    List<AdditionalService> selectByServiceId(String serviceId);

    int insert(AdditionalService additionalService);

    int update(AdditionalService additionalService);

    int deleteByServiceId(String serviceId);
} 