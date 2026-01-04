package com.zai.city.service;

import com.zai.city.entity.City;
import com.zai.city.mapper.CityMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;
import java.util.Date;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class CityService {
    private static final Logger logger = LoggerFactory.getLogger(CityService.class);
    
    @Autowired
    private CityMapper cityMapper;
    
    public void saveCity(City city) {
        if (city.getCityId() == null || city.getCityId().isEmpty()) {
            // 新增
            city.setCityId(UUID.randomUUID().toString());
            city.setCreatedAt(new Date());
            cityMapper.insert(city);
        } else {
            // 更新
            cityMapper.update(city);
        }
    }
    
    public void deleteCity(String cityId) {
        cityMapper.deleteByCityId(cityId);
    }
    
    public City getCity(String cityId) {
        return cityMapper.selectByCityId(cityId);
    }
    
    public List<City> getAllCities() {
        return cityMapper.selectAll();
    }
    
    public List<City> searchCities(String cityName, String province) {
        return cityMapper.selectByCondition(cityName, province);
    }
    
    public void syncCity(City city) {
        // 根据 cityCode 查询是否存在
        City existingCity = cityMapper.selectByCityCode(city.getCityCode());
        
        if (existingCity != null) {
            // 如果存在，更新名称和省份
            logger.info("城市已存在，更新数据：cityCode={}", city.getCityCode());
            existingCity.setCityName(city.getCityName());
            existingCity.setProvince(city.getProvince());
            cityMapper.update(existingCity);
        } else {
            // 如果不存在，插入新记录
            logger.info("城市不存在，新增数据：cityCode={}", city.getCityCode());
            city.setCreatedAt(new Date());
            cityMapper.insert(city);
        }
    }
} 