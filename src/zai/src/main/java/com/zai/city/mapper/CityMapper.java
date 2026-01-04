package com.zai.city.mapper;

import com.zai.city.entity.City;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Mapper
@Repository
public interface CityMapper {
    // 插入城市
    int insert(City city);
    
    // 根据ID删除城市
    int deleteByCityId(@Param("cityId") String cityId);
    
    // 更新城市信息
    int update(City city);
    
    // 根据ID查询城市
    City selectByCityId(@Param("cityId") String cityId);
    
    // 根据城市代码查询城市
    City selectByCityCode(@Param("cityCode") String cityCode);
    
    // 查询所有城市
    List<City> selectAll();
    
    // 根据条件查询城市
    List<City> selectByCondition(@Param("cityName") String cityName, 
                                @Param("province") String province);
} 