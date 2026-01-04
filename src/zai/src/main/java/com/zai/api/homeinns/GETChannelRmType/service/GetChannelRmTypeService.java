package com.zai.api.homeinns.GETChannelRmType.service;

import com.zai.api.homeinns.GETChannelRmType.model.GetChannelRmTypeRequest;
import com.zai.api.homeinns.GETChannelRmType.model.GetChannelRmTypeResponse;

public interface GetChannelRmTypeService {
    /**
     * 获取渠道房型信息（默认保存数据）
     * @param request 请求参数
     * @return 响应结果
     */
    GetChannelRmTypeResponse getChannelRmType(GetChannelRmTypeRequest request);

    /**
     * 获取渠道房型信息
     * @param request 请求参数
     * @param saveToDb 是否保存数据到数据库
     * @return 响应结果
     */
    GetChannelRmTypeResponse getChannelRmType(GetChannelRmTypeRequest request, boolean saveToDb);
} 