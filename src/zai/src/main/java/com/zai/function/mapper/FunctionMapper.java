package com.zai.function.mapper;

import com.zai.function.entity.Function;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Mapper
@Repository("functionMapper")
public interface FunctionMapper {
    /**
     * 插入功能
     */
    int insert(Function function);

    /**
     * 根据功能ID删除功能
     */
    int deleteByFunctionId(@Param("functionId") String functionId);

    /**
     * 更新功能
     */
    int update(Function function);

    /**
     * 根据功能ID查询功能
     */
    Function selectByFunctionId(@Param("functionId") String functionId);

    /**
     * 查询所有功能
     */
    List<Function> selectAll();

    /**
     * 根据条件查询功能
     */
    List<Function> selectByCondition(
        @Param("functionCode") String functionCode,
        @Param("functionName") String functionName,
        @Param("parentFunctionId") String parentFunctionId,
        @Param("functionStatus") String functionStatus,
        @Param("functionType") String functionType
    );

    /**
     * 根据功能代码查询功能
     */
    Function selectByFunctionCode(@Param("functionCode") String functionCode);

    /**
     * 根据功能代码查询功能（排除指定ID）
     */
    Function selectByFunctionCodeExcludeId(@Param("functionCode") String functionCode, @Param("functionId") String functionId);

    /**
     * 查询上级功能列表
     */
    List<Function> selectParentFunctions();

    /**
     * 根据条件统计功能数量
     */
    int countByCondition(
        @Param("functionCode") String functionCode,
        @Param("functionName") String functionName,
        @Param("parentFunctionId") String parentFunctionId,
        @Param("functionStatus") String functionStatus,
        @Param("functionType") String functionType
    );
} 