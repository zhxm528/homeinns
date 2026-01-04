package com.zai.booking.controller;

import com.zai.booking.entity.Company;
import com.zai.booking.service.CompanyService;
import com.zai.common.BaseResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/company")
public class CompanyController {
    
    private static final Logger logger = LoggerFactory.getLogger(CompanyController.class);
    
    @Autowired
    private CompanyService companyService;
    
    @GetMapping({"", "/", "/index"})
    public String index() {
        logger.debug("访问公司管理页面");
        return "company/index";
    }
    
    @PostMapping("/add")
    @ResponseBody
    public ResponseEntity<?> addCompany(@RequestBody Company company) {
        try {
            logger.debug("添加公司请求: {}", company);
            
            int result = companyService.addCompany(company);
            
            if (result > 0) {
                return ResponseEntity.ok(new BaseResponse(true, "公司添加成功", null));
            } else {
                return ResponseEntity.badRequest().body(new BaseResponse(false, "公司添加失败", null));
            }
            
        } catch (Exception e) {
            logger.error("添加公司失败", e);
            return ResponseEntity.badRequest().body(new BaseResponse(false, "公司添加失败: " + e.getMessage(), null));
        }
    }
    
    @DeleteMapping("/{companyId}")
    @ResponseBody
    public ResponseEntity<?> deleteCompany(@PathVariable String companyId) {
        try {
            logger.debug("删除公司: {}", companyId);
            
            companyService.deleteCompany(companyId);
            
            return ResponseEntity.ok(new BaseResponse(true, "公司删除成功", null));
            
        } catch (Exception e) {
            logger.error("删除公司失败", e);
            return ResponseEntity.badRequest().body(new BaseResponse(false, "公司删除失败: " + e.getMessage(), null));
        }
    }
    
    @PutMapping("/{companyId}")
    @ResponseBody
    public ResponseEntity<?> updateCompany(@PathVariable String companyId, @RequestBody Company company) {
        try {
            logger.debug("更新公司: companyId={}, company={}", companyId, company);
            
            company.setCompanyId(companyId);
            int result = companyService.updateCompany(company);
            
            if (result > 0) {
                return ResponseEntity.ok(new BaseResponse(true, "公司更新成功", null));
            } else {
                return ResponseEntity.badRequest().body(new BaseResponse(false, "公司更新失败", null));
            }
            
        } catch (Exception e) {
            logger.error("更新公司失败", e);
            return ResponseEntity.badRequest().body(new BaseResponse(false, "公司更新失败: " + e.getMessage(), null));
        }
    }
    
    @GetMapping("/{companyId}")
    @ResponseBody
    public ResponseEntity<?> getCompanyById(@PathVariable String companyId) {
        try {
            logger.debug("查询公司: {}", companyId);
            
            Company company = companyService.getCompanyById(companyId);
            
            if (company != null) {
                return ResponseEntity.ok(new BaseResponse(true, "查询成功", company));
            } else {
                return ResponseEntity.badRequest().body(new BaseResponse(false, "公司不存在", null));
            }
            
        } catch (Exception e) {
            logger.error("查询公司失败", e);
            return ResponseEntity.badRequest().body(new BaseResponse(false, "查询公司失败: " + e.getMessage(), null));
        }
    }
    
    @GetMapping("/list")
    @ResponseBody
    public ResponseEntity<?> getCompanyList(
            @RequestParam(required = false) String companyName,
            @RequestParam(required = false) String companyEname,
            @RequestParam(required = false) String contactPerson,
            @RequestParam(required = false) String contactPhone,
            @RequestParam(required = false) String contactEmail,
            @RequestParam(required = false) String memberType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        try {
            logger.debug("查询公司列表: companyName={}, contactPerson={}, page={}, size={}", companyName, contactPerson, page, size);
            
            List<Company> companies = companyService.getCompanyList(companyName, companyEname, contactPerson, 
                                                                  contactPhone, contactEmail, memberType, page, size);
            int total = companyService.countCompanies(companyName, companyEname, contactPerson, 
                                                    contactPhone, contactEmail, memberType);
            
            Map<String, Object> result = Map.of(
                "list", companies,
                "total", total,
                "page", page,
                "size", size
            );
            
            return ResponseEntity.ok(new BaseResponse(true, "查询成功", result));
            
        } catch (Exception e) {
            logger.error("查询公司列表失败", e);
            return ResponseEntity.badRequest().body(new BaseResponse(false, "查询公司列表失败: " + e.getMessage(), null));
        }
    }
    
    @GetMapping("/name/{companyName}")
    @ResponseBody
    public ResponseEntity<?> getCompaniesByName(@PathVariable String companyName) {
        try {
            logger.debug("根据名称查询公司: {}", companyName);
            
            List<Company> companies = companyService.getCompaniesByName(companyName);
            
            return ResponseEntity.ok(new BaseResponse(true, "查询成功", companies));
            
        } catch (Exception e) {
            logger.error("根据名称查询公司失败", e);
            return ResponseEntity.badRequest().body(new BaseResponse(false, "查询失败: " + e.getMessage(), null));
        }
    }
    
    @GetMapping("/code/{companyCode}")
    @ResponseBody
    public ResponseEntity<?> getCompanyByCode(@PathVariable String companyCode) {
        try {
            logger.debug("根据代码查询公司: {}", companyCode);
            
            Company company = companyService.getCompanyByCode(companyCode);
            
            if (company != null) {
                return ResponseEntity.ok(new BaseResponse(true, "查询成功", company));
            } else {
                return ResponseEntity.badRequest().body(new BaseResponse(false, "公司不存在", null));
            }
            
        } catch (Exception e) {
            logger.error("根据代码查询公司失败", e);
            return ResponseEntity.badRequest().body(new BaseResponse(false, "查询失败: " + e.getMessage(), null));
        }
    }
    
    @GetMapping("/phone/{contactPhone}")
    @ResponseBody
    public ResponseEntity<?> getCompanyByContactPhone(@PathVariable String contactPhone) {
        try {
            logger.debug("根据联系电话查询公司: {}", contactPhone);
            
            Company company = companyService.getCompanyByContactPhone(contactPhone);
            
            if (company != null) {
                return ResponseEntity.ok(new BaseResponse(true, "查询成功", company));
            } else {
                return ResponseEntity.badRequest().body(new BaseResponse(false, "公司不存在", null));
            }
            
        } catch (Exception e) {
            logger.error("根据联系电话查询公司失败", e);
            return ResponseEntity.badRequest().body(new BaseResponse(false, "查询失败: " + e.getMessage(), null));
        }
    }
    
    @GetMapping("/email/{contactEmail}")
    @ResponseBody
    public ResponseEntity<?> getCompanyByContactEmail(@PathVariable String contactEmail) {
        try {
            logger.debug("根据联系邮箱查询公司: {}", contactEmail);
            
            Company company = companyService.getCompanyByContactEmail(contactEmail);
            
            if (company != null) {
                return ResponseEntity.ok(new BaseResponse(true, "查询成功", company));
            } else {
                return ResponseEntity.badRequest().body(new BaseResponse(false, "公司不存在", null));
            }
            
        } catch (Exception e) {
            logger.error("根据联系邮箱查询公司失败", e);
            return ResponseEntity.badRequest().body(new BaseResponse(false, "查询失败: " + e.getMessage(), null));
        }
    }
} 