package com.zai.api.homeinns.GETChannelRmType.controller;

import com.zai.api.homeinns.GETChannelRmType.model.GetChannelRmTypeRequest;
import com.zai.api.homeinns.GETChannelRmType.model.GetChannelRmTypeResponse;
import com.zai.api.homeinns.GETChannelRmType.service.GetChannelRmTypeService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/homeinns")
public class GetChannelRmTypeController {

    private final GetChannelRmTypeService getChannelRmTypeService;

    public GetChannelRmTypeController(GetChannelRmTypeService getChannelRmTypeService) {
        this.getChannelRmTypeService = getChannelRmTypeService;
    }

    @PostMapping("/getChannelRmType")
    public GetChannelRmTypeResponse getChannelRmType(@RequestBody GetChannelRmTypeRequest request) {
        return getChannelRmTypeService.getChannelRmType(request);
    }

    
} 