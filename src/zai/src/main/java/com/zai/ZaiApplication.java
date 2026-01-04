package com.zai;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.web.bind.annotation.GetMapping;

@SpringBootApplication
@ComponentScan(basePackages = {"com.zai"})
@MapperScan(basePackages = {
    "com.zai.additionalservice.mapper", 
    "com.zai.chain.mapper", 
    "com.zai.channel.mapper", 
    "com.zai.city.mapper", 
    "com.zai.hotel.mapper", 
    "com.zai.ratecode.mapper",
    "com.zai.rateplan.mapper", 
    "com.zai.roomtype.mapper",
    "com.zai.user.mapper",
    "com.zai.api.homeinns.inithotels.mapper",
    "com.zai.availability.mapper",
    "com.zai.rateprices.mapper",
    "com.zai.rateinventorystatus.mapper",
    "com.zai.roomtypestatus.mapper",
    "com.zai.hotelinventory.mapper",
    "com.zai.hotelbudget.mapper",
    "com.zai.booking.mapper",
    "com.zai.bookingdaily.mapper",
    "com.zai.bookinglog.mapper",
    "com.zai.function.mapper"
})
@EnableTransactionManagement
public class ZaiApplication {

    public static void main(String[] args) {
        SpringApplication.run(ZaiApplication.class, args);
    }

    @GetMapping({"", "/"})
    public String root() {
        return "redirect:/home";
    }

}
