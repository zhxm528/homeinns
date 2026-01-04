package com.zai.function.service;

import com.zai.common.BaseResponse;
import com.zai.function.dto.FunctionAddRequest;
import com.zai.function.dto.FunctionUpdateRequest;
import com.zai.function.dto.FunctionListRequest;
import com.zai.function.dto.FunctionCheckCodeRequest;
import com.zai.function.entity.Function;
import java.util.List;

public interface FunctionService {
    /**
     * 新增功能
     */
    BaseResponse add(FunctionAddRequest request);

    /**
     * 更新功能
     */
    BaseResponse update(FunctionUpdateRequest request);

    /**
     * 删除功能
     */
    BaseResponse delete(String functionId);

    /**
     * 获取功能详情
     */
    BaseResponse getById(String functionId);

    /**
     * 获取功能列表
     */
    BaseResponse list(FunctionListRequest request);

    /**
     * 验证功能代码唯一性
     */
    BaseResponse checkCode(FunctionCheckCodeRequest request);

    /**
     * 获取上级功能列表
     */
    BaseResponse getParentList();
} 