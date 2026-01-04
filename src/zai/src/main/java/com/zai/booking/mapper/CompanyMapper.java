package com.zai.booking.mapper;

import com.zai.booking.entity.Company;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Mapper
@Repository
public interface CompanyMapper {
    
    /**
     * 插入公司信息
     */
    void insert(Company company);
    
    /**
     * 根据公司ID删除
     */
    void deleteByCompanyId(String companyId);
    
    /**
     * 更新公司信息
     */
    void update(Company company);
    
    /**
     * 根据公司ID查询
     */
    Company selectByCompanyId(String companyId);
    
    /**
     * 根据公司代码查询
     */
    Company selectByCompanyCode(String companyCode);
    
    /**
     * 根据公司名称查询
     */
    List<Company> selectByCompanyName(String companyName);
    
    /**
     * 根据公司英文名称查询
     */
    List<Company> selectByCompanyEname(String companyEname);
    
    /**
     * 根据联系人查询
     */
    List<Company> selectByContactPerson(String contactPerson);
    
    /**
     * 根据联系电话查询
     */
    Company selectByContactPhone(String contactPhone);
    
    /**
     * 根据联系邮箱查询
     */
    Company selectByContactEmail(String contactEmail);
    
    /**
     * 根据会员卡号查询
     */
    List<Company> selectByMemberCardNo(String memberCardNo);
    
    /**
     * 根据会员类型查询
     */
    List<Company> selectByMemberType(String memberType);
    
    /**
     * 根据条件查询公司列表
     */
    List<Company> selectByCondition(@Param("companyName") String companyName,
                                   @Param("companyEname") String companyEname,
                                   @Param("contactPerson") String contactPerson,
                                   @Param("contactPhone") String contactPhone,
                                   @Param("contactEmail") String contactEmail,
                                   @Param("memberType") String memberType,
                                   @Param("page") int page,
                                   @Param("size") int size,
                                   @Param("offset") int offset);
    
    /**
     * 查询所有公司
     */
    List<Company> selectAll();
    
    /**
     * 统计公司数量
     */
    int countByCondition(@Param("companyName") String companyName,
                        @Param("companyEname") String companyEname,
                        @Param("contactPerson") String contactPerson,
                        @Param("contactPhone") String contactPhone,
                        @Param("contactEmail") String contactEmail,
                        @Param("memberType") String memberType);
} 