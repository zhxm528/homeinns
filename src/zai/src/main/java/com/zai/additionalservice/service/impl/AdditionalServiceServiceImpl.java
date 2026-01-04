package com.zai.additionalservice.service.impl;

import com.zai.additionalservice.entity.AdditionalService;
import com.zai.additionalservice.mapper.AdditionalServiceMapper;
import com.zai.additionalservice.service.AdditionalServiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdditionalServiceServiceImpl implements AdditionalServiceService {
    @Autowired
    private AdditionalServiceMapper additionalServiceMapper;

    @Override
    public List<AdditionalService> selectByCondition(String chainId, String hotelId, String rateCodeId, String serviceName) {
        return additionalServiceMapper.selectByCondition(chainId, hotelId, rateCodeId, serviceName);
    }

    @Override
    public List<AdditionalService> selectByServiceId(String serviceId) {
        return additionalServiceMapper.selectByServiceId(serviceId);
    }

    @Override
    public int insert(AdditionalService additionalService) {
        return additionalServiceMapper.insert(additionalService);
    }

    @Override
    public int update(AdditionalService additionalService) {
        return additionalServiceMapper.update(additionalService);
    }

    @Override
    public int deleteByServiceId(String serviceId) {
        return additionalServiceMapper.deleteByServiceId(serviceId);
    }
} 