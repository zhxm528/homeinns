package com.zai.chain.mapper;

import com.zai.chain.entity.Chain;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Mapper
@Repository("chainMapper")
public interface ChainMapper {
    /**
     * 插入集团
     */
    int insert(Chain chain);

    /**
     * 根据ChainID删除集团
     */
    int deleteByChainId(@Param("chainId") String chainId);

    /**
     * 更新集团
     */
    int update(Chain chain);

    /**
     * 根据ChainID查询集团
     */
    Chain selectByChainId(@Param("chainId") String chainId);

    /**
     * 查询所有集团
     */
    List<Chain> selectAll();

    /**
     * 根据条件查询集团
     */
    List<Chain> selectByCondition(@Param("chainName") String chainName,
                                @Param("contactEmail") String contactEmail,
                                @Param("contactPhone") String contactPhone,
                                @Param("chainCode") String chainCode,
                                @Param("status") String status);

    /**
     * 根据集团代码查询集团
     */
    List<Chain> selectByChainCode(@Param("chainCode") String chainCode);

    /**
     * 根据关键字模糊查询集团列表
     * @param keyword 关键字，用于匹配集团名称和集团代码
     * @return 匹配的集团列表
     */
    List<Chain> selectByKeyword(@Param("keyword") String keyword);


    /**
     * 根据条件查询集团
     */
    List<Chain> getComponentsSelectChainList(@Param("chainId") String chainId,                               
                                @Param("keyword") String keyword,
                                @Param("status") String status);
    /**
     * 根据ChainID查询集团
     */
    Chain selectByPrimaryKey(@Param("chainId") String chainId);
} 