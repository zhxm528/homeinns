package com.zai.booking.service.impl;

import com.zai.booking.entity.Company;
import com.zai.booking.mapper.CompanyMapper;
import com.zai.booking.service.CompanyService;
import com.zai.util.IdGenerator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CompanyServiceImpl implements CompanyService {
    
    private static final Logger logger = LoggerFactory.getLogger(CompanyServiceImpl.class);
    
    @Autowired
    private CompanyMapper companyMapper;
    
    @Override
    public int addCompany(Company company) {
        try {
            logger.debug("开始添加公司信息: {}", company);
            
            // 生成公司ID
            company.setCompanyId(IdGenerator.generate64BitId());
            
            companyMapper.insert(company);
            
            logger.debug("公司信息添加成功: companyId={}", company.getCompanyId());
            return 1;
            
        } catch (Exception e) {
            logger.error("添加公司信息失败", e);
            throw new RuntimeException("添加公司信息失败: " + e.getMessage());
        }
    }
    
    @Override
    public void deleteCompany(String companyId) {
        try {
            logger.debug("开始删除公司信息: {}", companyId);
            companyMapper.deleteByCompanyId(companyId);
            logger.debug("公司信息删除成功: companyId={}", companyId);
        } catch (Exception e) {
            logger.error("删除公司信息失败", e);
            throw new RuntimeException("删除公司信息失败: " + e.getMessage());
        }
    }
    
    @Override
    public int updateCompany(Company company) {
        try {
            logger.debug("开始更新公司信息: {}", company.getCompanyId());
            companyMapper.update(company);
            logger.debug("公司信息更新成功: companyId={}", company.getCompanyId());
            return 1;
        } catch (Exception e) {
            logger.error("更新公司信息失败", e);
            throw new RuntimeException("更新公司信息失败: " + e.getMessage());
        }
    }
    
    @Override
    public Company getCompanyById(String companyId) {
        try {
            return companyMapper.selectByCompanyId(companyId);
        } catch (Exception e) {
            logger.error("查询公司信息失败", e);
            throw new RuntimeException("查询公司信息失败: " + e.getMessage());
        }
    }
    
    @Override
    public Company getCompanyByCode(String companyCode) {
        try {
            return companyMapper.selectByCompanyCode(companyCode);
        } catch (Exception e) {
            logger.error("根据公司代码查询失败", e);
            throw new RuntimeException("根据公司代码查询失败: " + e.getMessage());
        }
    }
    
    @Override
    public List<Company> getCompaniesByName(String companyName) {
        try {
            return companyMapper.selectByCompanyName(companyName);
        } catch (Exception e) {
            logger.error("根据公司名称查询失败", e);
            throw new RuntimeException("根据公司名称查询失败: " + e.getMessage());
        }
    }
    
    @Override
    public List<Company> getCompaniesByContactPerson(String contactPerson) {
        try {
            return companyMapper.selectByContactPerson(contactPerson);
        } catch (Exception e) {
            logger.error("根据联系人查询失败", e);
            throw new RuntimeException("根据联系人查询失败: " + e.getMessage());
        }
    }
    
    @Override
    public Company getCompanyByContactPhone(String contactPhone) {
        try {
            return companyMapper.selectByContactPhone(contactPhone);
        } catch (Exception e) {
            logger.error("根据联系电话查询失败", e);
            throw new RuntimeException("根据联系电话查询失败: " + e.getMessage());
        }
    }
    
    @Override
    public Company getCompanyByContactEmail(String contactEmail) {
        try {
            return companyMapper.selectByContactEmail(contactEmail);
        } catch (Exception e) {
            logger.error("根据联系邮箱查询失败", e);
            throw new RuntimeException("根据联系邮箱查询失败: " + e.getMessage());
        }
    }
    
    @Override
    public List<Company> getCompaniesByMemberCardNo(String memberCardNo) {
        try {
            return companyMapper.selectByMemberCardNo(memberCardNo);
        } catch (Exception e) {
            logger.error("根据会员卡号查询失败", e);
            throw new RuntimeException("根据会员卡号查询失败: " + e.getMessage());
        }
    }
    
    @Override
    public List<Company> getCompaniesByMemberType(String memberType) {
        try {
            return companyMapper.selectByMemberType(memberType);
        } catch (Exception e) {
            logger.error("根据会员类型查询失败", e);
            throw new RuntimeException("根据会员类型查询失败: " + e.getMessage());
        }
    }
    
    @Override
    public List<Company> getAllCompanies() {
        try {
            return companyMapper.selectAll();
        } catch (Exception e) {
            logger.error("查询所有公司失败", e);
            throw new RuntimeException("查询所有公司失败: " + e.getMessage());
        }
    }
    
    @Override
    public List<Company> getCompanyList(String companyName, String companyEname, String contactPerson,
                                      String contactPhone, String contactEmail, String memberType, 
                                      int page, int size) {
        try {
            int offset = page * size;
            return companyMapper.selectByCondition(companyName, companyEname, contactPerson,
                                                 contactPhone, contactEmail, memberType, page, size, offset);
        } catch (Exception e) {
            logger.error("查询公司列表失败", e);
            throw new RuntimeException("查询公司列表失败: " + e.getMessage());
        }
    }
    
    @Override
    public int countCompanies(String companyName, String companyEname, String contactPerson,
                            String contactPhone, String contactEmail, String memberType) {
        try {
            return companyMapper.countByCondition(companyName, companyEname, contactPerson,
                                                contactPhone, contactEmail, memberType);
        } catch (Exception e) {
            logger.error("统计公司数量失败", e);
            throw new RuntimeException("统计公司数量失败: " + e.getMessage());
        }
    }
} 