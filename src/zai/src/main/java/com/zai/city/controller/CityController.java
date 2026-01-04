package com.zai.city.controller;

import com.zai.city.entity.City;
import com.zai.city.service.CityService;
import com.zai.util.IdGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Controller
@RequestMapping("/city")
public class CityController {
    private static final Logger logger = LoggerFactory.getLogger(CityController.class);
    
    @Autowired
    private CityService cityService;
    
    @GetMapping({"", "/"})
    public String root() {
        return "redirect:/city/index";
    }
    
    @GetMapping("/index")
    public String index() {
        return "city/index";
    }
    
    // 根据城市名和省份查询城市列表
    @GetMapping("/list")
    @ResponseBody
    public List<City> list(@RequestParam(required = false) String cityName,
                          @RequestParam(required = false) String province) {
        // 如果城市名或省份不为空，则根据城市名和省份查询城市列表
        if (cityName != null || province != null) {
            return cityService.searchCities(cityName, province);
        }
        // 否则查询所有城市列表
        return cityService.getAllCities();
    }
    
    @GetMapping("/{cityId}")
    @ResponseBody
    public City getCity(@PathVariable String cityId) {
        return cityService.getCity(cityId);
    }
    
    @PostMapping("/save")
    @ResponseBody
    public void save(@RequestBody City city) {
        cityService.saveCity(city);
    }
    
    
    @PutMapping("/{cityId}")
    @ResponseBody
    public void update(@PathVariable String cityId, @RequestBody City city) {
        city.setCityId(cityId);
        cityService.saveCity(city);
    }
    
    @DeleteMapping("/{cityId}")
    @ResponseBody
    public void delete(@PathVariable String cityId) {
        cityService.deleteCity(cityId);
    }
    
    @PostMapping("/sync")
    @ResponseBody
    public void sync(@RequestBody List<Map<String, String>> cities) {
        logger.info("开始同步城市数据，共 {} 条记录", cities.size());
        
        for (Map<String, String> cityMap : cities) {
            City city = new City();
            city.setCityCode(cityMap.get("zipcode"));
            city.setCityName(cityMap.get("city"));
            city.setProvince(cityMap.get("province"));
            city.setCityId(cityMap.get("pinyin_key"));
            
            logger.info("处理城市数据：cityCode={}, cityName={}, province={}, cityId={}", 
                city.getCityCode(), city.getCityName(), city.getProvince(), city.getCityId());
                
            cityService.syncCity(city);
        }
        
        logger.info("城市数据同步完成");
    }
} 