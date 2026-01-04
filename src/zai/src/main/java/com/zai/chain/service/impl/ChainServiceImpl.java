package com.zai.chain.service.impl;

import com.zai.chain.entity.Chain;
import com.zai.chain.mapper.ChainMapper;
import com.zai.chain.service.ChainService;
import com.zai.util.IdGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import javax.annotation.PostConstruct;
import java.util.List;
import java.util.Map;

@Service
public class ChainServiceImpl implements ChainService {
    private static final Logger logger = LoggerFactory.getLogger(ChainServiceImpl.class);

    @Qualifier("chainMapper")
    @Autowired
    private ChainMapper chainMapper;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    

    @Override
    public int addChain(Chain chain) {
        logger.debug("Adding new chain: {}", chain);
        // 生成64位唯一ID
        String chainId = IdGenerator.generate64BitId();
        chain.setChainId(chainId);
        logger.debug("Generated chainID: {}", chainId);
        return chainMapper.insert(chain);
    }

    @Override
    public boolean deleteChain(String chainId) {
        logger.debug("Deleting chain with ID: {}", chainId);
        return chainMapper.deleteByChainId(chainId) > 0;
    }

    @Override
    public int updateChain(Chain chain) {
        logger.debug("Updating chain: {}", chain);
        return chainMapper.update(chain);
    }

    @Override
    public Chain getChainById(String chainId) {
        logger.debug("Fetching chain by chainId: {}", chainId);
        try {
            Chain chain = chainMapper.selectByChainId(chainId);
            if (chain != null) {
                logger.debug("Found chain: {}", chain);
                return chain;
            } else {
                logger.debug("No chain found with chainId: {}", chainId);
                return null;
            }
        } catch (Exception e) {
            logger.error("Error fetching chain by chainId: {}", chainId, e);
            throw e;
        }
    }

    @Override
    public List<Chain> getAllChains() {
        logger.debug("Fetching all chains");
        try {
            List<Chain> chains = chainMapper.selectAll();
            logger.debug("Found {} chains", chains.size());
            return chains;
        } catch (Exception e) {
            logger.error("Error fetching all chains", e);
            throw e;
        }
    }

    @Override
    public List<Chain> getChainsByCondition(String chainName, 
    String contactEmail, String contactPhone, String chainCode, String status) {
        logger.debug("Searching chains with chainName: {}, contactEmail: {}, contactPhone: {}, chainCode: {}, status: {}", 
            chainName, contactEmail, contactPhone, chainCode, status);
        try {
            List<Chain> chains = chainMapper.selectByCondition(chainName, 
            contactEmail, contactPhone, chainCode, status);
            logger.debug("Found {} chains matching criteria", chains.size());
            return chains;
        } catch (Exception e) {
            logger.error("Error searching chains", e);
            throw e;
        }
    }

    @Override
    public List<Chain> selectAll() {
        return chainMapper.selectAll();
    }

    @Override
    public Chain getChainByCode(String chainCode) {
        logger.debug("Fetching chain by chainCode: {}", chainCode);
        try {
            List<Chain> chains = chainMapper.selectByChainCode(chainCode);
            if (chains != null && !chains.isEmpty()) {
                Chain chain = chains.get(0);
                logger.debug("Found chain: {}", chain);
                return chain;
            } else {
                logger.debug("No chain found with chainCode: {}", chainCode);
                return null;
            }
        } catch (Exception e) {
            logger.error("Error fetching chain by chainCode: {}", chainCode, e);
            throw e;
        }
    }

    @Override
    public List<Chain> getChainsByKeyword(String keyword) {
        try {
            logger.debug("根据关键字查询集团列表，关键字：{}", keyword);
            List<Chain> chains = chainMapper.selectByKeyword(keyword);
            logger.debug("查询到{}个集团", chains.size());
            return chains;
        } catch (Exception e) {
            logger.error("根据关键字查询集团列表失败", e);
            throw new RuntimeException("查询集团列表失败", e);
        }
    }



    @Override
    public List<Chain> getComponentsSelectChainList(
        String chainId, String keyword, String status) {
        
        try {
            List<Chain> chains = chainMapper.getComponentsSelectChainList(
                chainId,keyword, status);
            logger.debug("Found {} chains matching criteria", chains.size());
            return chains;
        } catch (Exception e) {
            logger.error("Error searching chains", e);
            throw e;
        }
    }

    
} 