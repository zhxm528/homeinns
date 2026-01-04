package com.zai.function.service.impl;

import com.zai.common.BaseResponse;
import com.zai.function.dto.FunctionAddRequest;
import com.zai.function.dto.FunctionUpdateRequest;
import com.zai.function.dto.FunctionListRequest;
import com.zai.function.dto.FunctionCheckCodeRequest;
import com.zai.function.entity.Function;
import com.zai.function.mapper.FunctionMapper;
import com.zai.function.service.FunctionService;
import com.zai.util.IdGenerator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class FunctionServiceImpl implements FunctionService {
    
    private static final Logger log = LoggerFactory.getLogger(FunctionServiceImpl.class);
    
    @Autowired
    private FunctionMapper functionMapper;
    
    @Override
    @Transactional
    public BaseResponse add(FunctionAddRequest request) {
        try {
            // 参数校验
            if (request.getFunctionCode() == null || request.getFunctionCode().trim().isEmpty()) {
                return BaseResponse.error("功能代码不能为空");
            }
            if (request.getFunctionName() == null || request.getFunctionName().trim().isEmpty()) {
                return BaseResponse.error("功能名称不能为空");
            }
            
            // 检查功能代码是否已存在
            Function existingFunction = functionMapper.selectByFunctionCode(request.getFunctionCode());
            if (existingFunction != null) {
                return BaseResponse.error("功能代码已存在");
            }
            
            // 创建功能实体
            Function function = new Function();
            function.setFunctionId(IdGenerator.generate64BitId());
            function.setFunctionCode(request.getFunctionCode());
            function.setFunctionName(request.getFunctionName());
            function.setParentFunctionId(request.getParentFunctionId());
            function.setFunctionIcon(request.getFunctionIcon());
            function.setFunctionSort(request.getFunctionSort());
            function.setFunctionPath(request.getFunctionPath());
            function.setFunctionStatus(request.getFunctionStatus());
            function.setFunctionType(request.getFunctionType());
            function.setFunctionDescription(request.getFunctionDescription());
            
            // 插入数据库
            int result = functionMapper.insert(function);
            if (result > 0) {
                Map<String, Object> data = new HashMap<>();
                data.put("functionId", function.getFunctionId());
                return BaseResponse.success(data);
            } else {
                return BaseResponse.error("新增功能失败");
            }
        } catch (Exception e) {
            log.error("新增功能失败", e);
            return BaseResponse.error("系统错误：" + e.getMessage());
        }
    }
    
    @Override
    @Transactional
    public BaseResponse update(FunctionUpdateRequest request) {
        try {
            // 参数校验
            if (request.getFunctionId() == null || request.getFunctionId().trim().isEmpty()) {
                return BaseResponse.error("功能ID不能为空");
            }
            if (request.getFunctionCode() == null || request.getFunctionCode().trim().isEmpty()) {
                return BaseResponse.error("功能代码不能为空");
            }
            if (request.getFunctionName() == null || request.getFunctionName().trim().isEmpty()) {
                return BaseResponse.error("功能名称不能为空");
            }
            
            // 检查功能是否存在
            Function existingFunction = functionMapper.selectByFunctionId(request.getFunctionId());
            if (existingFunction == null) {
                return BaseResponse.error("功能不存在");
            }
            
            // 检查功能代码是否被其他功能使用
            Function codeExists = functionMapper.selectByFunctionCodeExcludeId(request.getFunctionCode(), request.getFunctionId());
            if (codeExists != null) {
                return BaseResponse.error("功能代码已被其他功能使用");
            }
            
            // 更新功能信息
            existingFunction.setFunctionCode(request.getFunctionCode());
            existingFunction.setFunctionName(request.getFunctionName());
            existingFunction.setParentFunctionId(request.getParentFunctionId());
            existingFunction.setFunctionIcon(request.getFunctionIcon());
            existingFunction.setFunctionSort(request.getFunctionSort());
            existingFunction.setFunctionPath(request.getFunctionPath());
            existingFunction.setFunctionStatus(request.getFunctionStatus());
            existingFunction.setFunctionType(request.getFunctionType());
            existingFunction.setFunctionDescription(request.getFunctionDescription());
            
            // 更新数据库
            int result = functionMapper.update(existingFunction);
            if (result > 0) {
                return BaseResponse.success("功能更新成功");
            } else {
                return BaseResponse.error("功能更新失败");
            }
        } catch (Exception e) {
            log.error("更新功能失败", e);
            return BaseResponse.error("系统错误：" + e.getMessage());
        }
    }
    
    @Override
    @Transactional
    public BaseResponse delete(String functionId) {
        try {
            if (functionId == null || functionId.trim().isEmpty()) {
                return BaseResponse.error("功能ID不能为空");
            }
            
            // 检查功能是否存在
            Function function = functionMapper.selectByFunctionId(functionId);
            if (function == null) {
                return BaseResponse.error("功能不存在");
            }
            
            // 检查是否有子功能
            List<Function> childFunctions = functionMapper.selectByCondition(null, null, functionId, null, null);
            if (!childFunctions.isEmpty()) {
                return BaseResponse.error("该功能下有子功能，无法删除");
            }
            
            // 删除功能
            int result = functionMapper.deleteByFunctionId(functionId);
            if (result > 0) {
                return BaseResponse.success("功能删除成功");
            } else {
                return BaseResponse.error("功能删除失败");
            }
        } catch (Exception e) {
            log.error("删除功能失败", e);
            return BaseResponse.error("系统错误：" + e.getMessage());
        }
    }
    
    @Override
    public BaseResponse getById(String functionId) {
        try {
            if (functionId == null || functionId.trim().isEmpty()) {
                return BaseResponse.error("功能ID不能为空");
            }
            
            Function function = functionMapper.selectByFunctionId(functionId);
            if (function == null) {
                return BaseResponse.error("功能不存在");
            }
            
            return BaseResponse.success(function);
        } catch (Exception e) {
            log.error("获取功能详情失败", e);
            return BaseResponse.error("系统错误：" + e.getMessage());
        }
    }
    
    @Override
    public BaseResponse list(FunctionListRequest request) {
        try {
            // 查询功能列表
            List<Function> functions = functionMapper.selectByCondition(
                request.getFunctionCode(),
                request.getFunctionName(),
                request.getParentFunctionId(),
                request.getFunctionStatus(),
                request.getFunctionType()
            );
            
            // 统计总数
            int total = functionMapper.countByCondition(
                request.getFunctionCode(),
                request.getFunctionName(),
                request.getParentFunctionId(),
                request.getFunctionStatus(),
                request.getFunctionType()
            );
            
            Map<String, Object> data = new HashMap<>();
            data.put("list", functions);
            data.put("total", total);
            data.put("pageNum", request.getPageNum());
            data.put("pageSize", request.getPageSize());
            
            return BaseResponse.success(data);
        } catch (Exception e) {
            log.error("获取功能列表失败", e);
            return BaseResponse.error("系统错误：" + e.getMessage());
        }
    }
    
    @Override
    public BaseResponse checkCode(FunctionCheckCodeRequest request) {
        try {
            if (request.getFunctionCode() == null || request.getFunctionCode().trim().isEmpty()) {
                return BaseResponse.error("功能代码不能为空");
            }
            
            Function function;
            if (request.getFunctionId() != null && !request.getFunctionId().trim().isEmpty()) {
                // 更新时检查，排除当前功能
                function = functionMapper.selectByFunctionCodeExcludeId(request.getFunctionCode(), request.getFunctionId());
            } else {
                // 新增时检查
                function = functionMapper.selectByFunctionCode(request.getFunctionCode());
            }
            
            Map<String, Object> data = new HashMap<>();
            data.put("available", function == null);
            
            return BaseResponse.success(data);
        } catch (Exception e) {
            log.error("验证功能代码失败", e);
            return BaseResponse.error("系统错误：" + e.getMessage());
        }
    }
    
    @Override
    public BaseResponse getParentList() {
        try {
            List<Function> parentFunctions = functionMapper.selectParentFunctions();
            return BaseResponse.success(parentFunctions);
        } catch (Exception e) {
            log.error("获取上级功能列表失败", e);
            return BaseResponse.error("系统错误：" + e.getMessage());
        }
    }
} 