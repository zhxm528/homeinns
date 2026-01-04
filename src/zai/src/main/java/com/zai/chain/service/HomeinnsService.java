package com.zai.chain.service;

import com.zai.common.BaseResponse;
import com.zai.chain.dto.HomeinnsChannelRmTypeRequest;

/**
 * 如家API服务接口
 */
public interface HomeinnsService {
    
    /**
     * 查询渠道合作酒店房型
     * @param request 请求参数
     * @return 渠道房型信息
     */
    BaseResponse getChannelRmTypeStar(HomeinnsChannelRmTypeRequest request);
} 