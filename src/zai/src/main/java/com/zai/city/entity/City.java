package com.zai.city.entity;

import java.util.Date;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

@Data
public class City {
    private String cityId;
    private String cityCode;
    private String cityName;
    private String province;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date createdAt;
} 