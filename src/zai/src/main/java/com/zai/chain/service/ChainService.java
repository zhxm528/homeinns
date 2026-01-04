package com.zai.chain.service;

import com.zai.chain.entity.Chain;
import java.util.List;

public interface ChainService {
    /**
     * 添加集团
     */
    int addChain(Chain chain);

    /**
     * 根据ChainID删除集团
     */
    boolean deleteChain(String chainId);

    /**
     * 更新集团
     */
    int updateChain(Chain chain);

    /**
     * 根据ChainID查询集团
     */
    Chain getChainById(String chainId);

    /**
     * 查询所有集团
     */
    List<Chain> getAllChains();

    /**
     * 根据条件查询集团
     */
    List<Chain> getChainsByCondition(String chainName, 
    String contactEmail, String contactPhone, String chainCode, String status);

    List<Chain> selectAll();

    /**
     * 根据集团代码查询集团
     */
    Chain getChainByCode(String chainCode);
    
    /**
     * 根据关键字模糊查询集团列表
     * @param keyword 关键字，用于匹配集团名称和集团代码
     * @return 匹配的集团列表
     */
    List<Chain> getChainsByKeyword(String keyword);

    List<Chain> getComponentsSelectChainList(String chainId, String keyword, String status);
} 