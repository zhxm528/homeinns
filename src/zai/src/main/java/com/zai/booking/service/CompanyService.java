package com.zai.booking.service;

import com.zai.booking.entity.Company;
import java.util.List;

public interface CompanyService {
    
    /**
     * 添加公司信息
     */
    int addCompany(Company company);
    
    /**
     * 删除公司信息
     */
    void deleteCompany(String companyId);
    
    /**
     * 更新公司信息
     */
    int updateCompany(Company company);
    
    /**
     * 根据公司ID查询
     */
    Company getCompanyById(String companyId);
    
    /**
     * 根据公司代码查询
     */
    Company getCompanyByCode(String companyCode);
    
    /**
     * 根据公司名称查询
     */
    List<Company> getCompaniesByName(String companyName);
    
    /**
     * 根据联系人查询
     */
    List<Company> getCompaniesByContactPerson(String contactPerson);
    
    /**
     * 根据联系电话查询
     */
    Company getCompanyByContactPhone(String contactPhone);
    
    /**
     * 根据联系邮箱查询
     */
    Company getCompanyByContactEmail(String contactEmail);
    
    /**
     * 根据会员卡号查询
     */
    List<Company> getCompaniesByMemberCardNo(String memberCardNo);
    
    /**
     * 根据会员类型查询
     */
    List<Company> getCompaniesByMemberType(String memberType);
    
    /**
     * 查询所有公司
     */
    List<Company> getAllCompanies();
    
    /**
     * 根据条件查询公司列表
     */
    List<Company> getCompanyList(String companyName, String companyEname, String contactPerson,
                                String contactPhone, String contactEmail, String memberType, 
                                int page, int size);
    
    /**
     * 统计公司数量
     */
    int countCompanies(String companyName, String companyEname, String contactPerson,
                      String contactPhone, String contactEmail, String memberType);
} 