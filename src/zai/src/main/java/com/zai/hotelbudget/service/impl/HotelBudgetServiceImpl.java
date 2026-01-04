package com.zai.hotelbudget.service.impl;

import com.zai.common.BaseResponse;
import com.zai.hotelbudget.dto.HotelBudgetListRequest;
import com.zai.hotelbudget.dto.BudgetExportRequest;
import com.zai.hotelbudget.entity.HotelBudget;
import com.zai.hotelbudget.mapper.HotelBudgetMapper;
import com.zai.hotelbudget.service.HotelBudgetService;
import com.zai.util.IdGenerator;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Resource;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import com.zai.chain.entity.Chain;
import com.zai.chain.mapper.ChainMapper;
import com.zai.hotel.entity.Hotel;
import com.zai.hotel.mapper.HotelMapper;
import java.math.RoundingMode;


/**
 * 酒店预算Service实现类
 */
@Service
public class HotelBudgetServiceImpl implements HotelBudgetService {
    
    private static final Logger logger = LoggerFactory.getLogger(HotelBudgetServiceImpl.class);
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    
    @Resource
    private HotelBudgetMapper hotelBudgetMapper;
    @Resource
    private ChainMapper chainMapper;
    @Resource
    private HotelMapper hotelMapper;
    
    @Override
    @Transactional
    public BaseResponse<String> addHotelBudget(HotelBudget hotelBudget) {
        try {
            logger.debug("开始添加酒店预算记录");
            
            // 参数验证
            BaseResponse<String> validationResult = validateHotelBudget(hotelBudget);
            if (!validationResult.isSuccess()) {
                return validationResult;
            }
            
            // 检查记录是否已存在
            if (isRecordExists(hotelBudget)) {
                return BaseResponse.error("该酒店预算记录已存在");
            }
            
            // 设置创建时间和更新时间
            String currentTime = LocalDateTime.now().format(DATE_FORMATTER);
            hotelBudget.setCreatedAt(LocalDateTime.parse(currentTime, DATE_FORMATTER));
            hotelBudget.setUpdatedAt(LocalDateTime.parse(currentTime, DATE_FORMATTER));
            
            // 插入记录
            int result = hotelBudgetMapper.insert(hotelBudget);
            
            if (result > 0) {
                logger.debug("酒店预算记录添加成功");
                return BaseResponse.success("酒店预算记录添加成功");
            } else {
                return BaseResponse.error("酒店预算记录添加失败");
            }
            
        } catch (Exception e) {
            logger.error("添加酒店预算记录时发生异常", e);
            return BaseResponse.error("系统异常：" + e.getMessage());
        }
    }
    
    @Override
    @Transactional
    public BaseResponse<String> updateHotelBudget(HotelBudget hotelBudget) {
        try {
            logger.debug("开始更新酒店预算记录");
            
            // 参数验证
            BaseResponse<String> validationResult = validateHotelBudget(hotelBudget);
            if (!validationResult.isSuccess()) {
                return validationResult;
            }
            
            // 检查记录是否存在
            if (!isRecordExists(hotelBudget)) {
                return BaseResponse.error("酒店预算记录不存在");
            }
            
            // 设置更新时间
            String currentTime = LocalDateTime.now().format(DATE_FORMATTER);
            hotelBudget.setUpdatedAt(LocalDateTime.parse(currentTime, DATE_FORMATTER));
            
            // 更新记录
            int result = hotelBudgetMapper.update(hotelBudget);
            
            if (result > 0) {
                logger.debug("酒店预算记录更新成功");
                return BaseResponse.success("酒店预算记录更新成功");
            } else {
                return BaseResponse.error("酒店预算记录更新失败");
            }
            
        } catch (Exception e) {
            logger.error("更新酒店预算记录时发生异常", e);
            return BaseResponse.error("系统异常：" + e.getMessage());
        }
    }
    
    @Override
    @Transactional
    public BaseResponse<String> deleteHotelBudget(String hotelId, Integer budgetYear, String subjectCode, String budgetVersion) {
        try {
            logger.debug("开始删除酒店预算记录");
            
            // 参数验证
            if (!StringUtils.hasText(hotelId)) {
                return BaseResponse.error("酒店ID不能为空");
            }
            if (budgetYear == null) {
                return BaseResponse.error("预算年份不能为空");
            }
            if (!StringUtils.hasText(subjectCode)) {
                return BaseResponse.error("科目编号不能为空");
            }
            if (!StringUtils.hasText(budgetVersion)) {
                return BaseResponse.error("预算版本不能为空");
            }
            
            // 删除记录
            int result = hotelBudgetMapper.deleteByPrimaryKey(hotelId, budgetYear, subjectCode, budgetVersion);
            
            if (result > 0) {
                logger.debug("酒店预算记录删除成功");
                return BaseResponse.success("酒店预算记录删除成功");
            } else {
                return BaseResponse.error("酒店预算记录不存在");
            }
            
        } catch (Exception e) {
            logger.error("删除酒店预算记录时发生异常", e);
            return BaseResponse.error("系统异常：" + e.getMessage());
        }
    }
    
    @Override
    public BaseResponse<HotelBudget> getHotelBudget(String hotelId, Integer budgetYear, String subjectCode, String budgetVersion) {
        try {
            logger.debug("开始查询酒店预算记录");
            
            // 参数验证
            if (!StringUtils.hasText(hotelId)) {
                return BaseResponse.error("酒店ID不能为空");
            }
            if (budgetYear == null) {
                return BaseResponse.error("预算年份不能为空");
            }
            if (!StringUtils.hasText(subjectCode)) {
                return BaseResponse.error("科目编号不能为空");
            }
            if (!StringUtils.hasText(budgetVersion)) {
                return BaseResponse.error("预算版本不能为空");
            }
            
            // 查询记录
            HotelBudget hotelBudget = hotelBudgetMapper.selectByPrimaryKey(hotelId, budgetYear, subjectCode, budgetVersion);
            
            if (hotelBudget != null) {
                logger.debug("酒店预算记录查询成功");
                return BaseResponse.success(hotelBudget);
            } else {
                return BaseResponse.error("酒店预算记录不存在");
            }
            
        } catch (Exception e) {
            logger.error("查询酒店预算记录时发生异常", e);
            return BaseResponse.error("系统异常：" + e.getMessage());
        }
    }
    
    @Override
    public BaseResponse<Object> getHotelBudgetList(HotelBudgetListRequest request) {
        try {
            logger.debug("开始查询酒店预算记录列表，请求参数：{}", request);
            
            // 参数验证
            if (request == null) {
                return BaseResponse.error("请求参数不能为空");
            }
            
            String chainId = request.getChainId();
            String hotelId = request.getHotelId();
            Integer budgetYear = request.getYear();
            String hotelManagementModel = request.getHotelManagementModel();
            String cityId = request.getCityId();
            
            // 1. 根据chainId、hotelId、cityId、hotelManagementModel查询出符合条件的酒店
            List<Hotel> hotels = hotelMapper.getBudgetHotelList(hotelId, chainId, cityId, hotelManagementModel);
            
            if (hotels == null || hotels.isEmpty()) {
                logger.debug("未找到符合条件的酒店");
                return BaseResponse.success(new ArrayList<>());
            }
            
            // 2. 根据查询酒店的结果和budgetYear查询hotel_budget的记录
            List<HotelBudget> hotelBudgetList = new ArrayList<>();
            for (Hotel hotel : hotels) {
                List<HotelBudget> budgets = hotelBudgetMapper.selectByChainHotelYear(
                    hotel.getChainId(), hotel.getHotelId(), budgetYear);
                if (budgets != null && !budgets.isEmpty()) {
                    // 按照sort字段从小到大排序
                    budgets.sort((b1, b2) -> {
                        Integer sort1 = b1.getSort() != null ? b1.getSort() : Integer.MAX_VALUE;
                        Integer sort2 = b2.getSort() != null ? b2.getSort() : Integer.MAX_VALUE;
                        return sort1.compareTo(sort2);
                    });
                    hotelBudgetList.addAll(budgets);
                }
            }
            
            // 3. 按科目代码分组并进行汇总处理
            if (!hotelBudgetList.isEmpty()) {
                // 按科目代码分组
                Map<String, List<HotelBudget>> groupedBySubject = hotelBudgetList.stream()
                    .collect(Collectors.groupingBy(HotelBudget::getSubjectCode));
                
                List<HotelBudget> finalList = new ArrayList<>();
                
                // 对每个科目代码进行汇总处理
                for (Map.Entry<String, List<HotelBudget>> entry : groupedBySubject.entrySet()) {
                    String subjectCode = entry.getKey();
                    List<HotelBudget> budgetsForSubject = entry.getValue();
                    
                    // 如果该科目有多个酒店的预算数据，先添加汇总数据
                    if (budgetsForSubject.size() > 1) {
                        HotelBudget consolidatedBudget = consolidateHotelBudgets(budgetsForSubject);
                        if (consolidatedBudget != null) {
                            finalList.add(consolidatedBudget);
                        }
                    }
                    
                    // 然后添加每个酒店的原始数据
                    finalList.addAll(budgetsForSubject);
                }
                
                // 对finalList按照sort字段从小到大排序
                finalList.sort((b1, b2) -> {
                    Integer sort1 = b1.getSort() != null ? b1.getSort() : Integer.MAX_VALUE;
                    Integer sort2 = b2.getSort() != null ? b2.getSort() : Integer.MAX_VALUE;
                    return sort1.compareTo(sort2);
                });
                
                // 计算需要比例计算的科目的比例字段
                calculateRatiosForSpecificSubjects(finalList);
                
                hotelBudgetList = finalList;
            }
            
            // 4. 查询结果返回给controller，返回json格式的响应体
            logger.debug("查询酒店预算记录成功，总记录数：{}", hotelBudgetList.size());
            return BaseResponse.success(hotelBudgetList);
            
        } catch (Exception e) {
            logger.error("查询酒店预算记录列表时发生异常", e);
            return BaseResponse.error("系统异常：" + e.getMessage());
        }
    }
    
    @Override
    @Transactional
    public BaseResponse<String> batchAddHotelBudget(List<HotelBudget> hotelBudgetList) {
        try {
            logger.debug("开始批量添加酒店预算记录，记录数：{}", hotelBudgetList.size());
            
            if (hotelBudgetList == null || hotelBudgetList.isEmpty()) {
                return BaseResponse.error("请求参数不能为空");
            }
            
            // 设置创建时间和更新时间
            String currentTime = LocalDateTime.now().format(DATE_FORMATTER);
            for (HotelBudget hotelBudget : hotelBudgetList) {
                hotelBudget.setCreatedAt(LocalDateTime.parse(currentTime, DATE_FORMATTER));
                hotelBudget.setUpdatedAt(LocalDateTime.parse(currentTime, DATE_FORMATTER));
            }
            
            // 批量插入
            int result = hotelBudgetMapper.batchInsert(hotelBudgetList);
            
            if (result > 0) {
                logger.debug("批量添加酒店预算记录成功，插入记录数：{}", result);
                return BaseResponse.success("批量添加酒店预算记录成功，插入记录数：" + result);
            } else {
                return BaseResponse.error("批量添加酒店预算记录失败");
            }
            
        } catch (Exception e) {
            logger.error("批量添加酒店预算记录时发生异常", e);
            return BaseResponse.error("系统异常：" + e.getMessage());
        }
    }
    
    @Override
    @Transactional
    public BaseResponse<String> batchUpdateHotelBudget(List<HotelBudget> hotelBudgetList) {
        try {
            logger.debug("开始批量更新酒店预算记录，记录数：{}", hotelBudgetList.size());
            
            if (hotelBudgetList == null || hotelBudgetList.isEmpty()) {
                return BaseResponse.error("请求参数不能为空");
            }
            
            // 设置更新时间
            String currentTime = LocalDateTime.now().format(DATE_FORMATTER);
            for (HotelBudget hotelBudget : hotelBudgetList) {
                hotelBudget.setUpdatedAt(LocalDateTime.parse(currentTime, DATE_FORMATTER));
            }
            
            // 批量更新
            int result = hotelBudgetMapper.batchUpdate(hotelBudgetList);
            
            if (result > 0) {
                logger.debug("批量更新酒店预算记录成功，更新记录数：{}", result);
                return BaseResponse.success("批量更新酒店预算记录成功，更新记录数：" + result);
            } else {
                return BaseResponse.error("批量更新酒店预算记录失败");
            }
            
        } catch (Exception e) {
            logger.error("批量更新酒店预算记录时发生异常", e);
            return BaseResponse.error("系统异常：" + e.getMessage());
        }
    }
    
    @Override
    @Transactional
    public BaseResponse<String> uploadBudgetExcel(MultipartFile file, 
    Integer year, String hotelId, String chainId) {
        try {
            logger.debug("开始解析UC预算Excel文件，年份：{}，酒店ID：{}，集团ID：{}", year, hotelId, chainId);
            
            if (file == null || file.isEmpty()) {
                return BaseResponse.error("上传的文件不能为空");
            }
            // 通过chainId查询chains表
            Chain chain = chainMapper.selectByPrimaryKey(chainId);
            if (chain == null) {
                return null;
            }
        
            // 通过hotelId查询hotels表
            Hotel hotel = hotelMapper.selectByPrimaryKey(hotelId);
            if (hotel == null) {
                return null;
            }
            //根据 chainId+hotelId+year 查询hotel_budgets表，如果存在，则删除
            List<HotelBudget> existHotelBudgetList = hotelBudgetMapper.selectByChainHotelYear(chainId, hotelId, year);
            if (existHotelBudgetList != null&&existHotelBudgetList.size()>0) {
                hotelBudgetMapper.deleteByChainHotelYear(chainId, hotelId, year);
            }

            // 解析Excel文件
            List<HotelBudget> hotelBudgetList = parseExcelFile(file, 
            year, hotel, chain);

        
            
            if (hotelBudgetList.isEmpty()) {
                return BaseResponse.error("Excel文件中没有有效数据");
            }
            
            logger.debug("Excel文件解析完成，共解析出{}条记录", hotelBudgetList.size());
            
            // 批量插入数据库
            BaseResponse<String> result = batchAddHotelBudget(hotelBudgetList);
            
            if (result.isSuccess()) {
                logger.debug("UC预算Excel文件上传处理成功");
                return BaseResponse.success("UC预算Excel文件上传处理成功，共处理" + hotelBudgetList.size() + "条记录");
            } else {
                return result;
            }
            
        } catch (Exception e) {
            logger.error("处理UC预算Excel文件时发生异常", e);
            return BaseResponse.error("系统异常：" + e.getMessage());
        }
    }
    
    // 私有辅助方法
    
    private BaseResponse<String> validateHotelBudget(HotelBudget hotelBudget) {
        if (hotelBudget == null) {
            return BaseResponse.error("请求参数不能为空");
        }
        if (!StringUtils.hasText(hotelBudget.getChainId())) {
            return BaseResponse.error("连锁ID不能为空");
        }
        if (!StringUtils.hasText(hotelBudget.getHotelId())) {
            return BaseResponse.error("酒店ID不能为空");
        }
        if (hotelBudget.getBudgetYear() == null) {
            return BaseResponse.error("预算年份不能为空");
        }
        if (!StringUtils.hasText(hotelBudget.getSubjectCode())) {
            return BaseResponse.error("科目编号不能为空");
        }
        if (!StringUtils.hasText(hotelBudget.getBudgetVersion())) {
            return BaseResponse.error("预算版本不能为空");
        }
        return BaseResponse.success("验证通过");
    }
    
    private boolean isRecordExists(HotelBudget hotelBudget) {
        HotelBudget existingRecord = hotelBudgetMapper.selectByPrimaryKey(
            hotelBudget.getHotelId(), hotelBudget.getBudgetYear(), 
            hotelBudget.getSubjectCode(), hotelBudget.getBudgetVersion());
        return existingRecord != null;
    }
    
    /**
     * 解析Excel文件
     */
    private List<HotelBudget> parseExcelFile(MultipartFile file, 
    Integer year, Hotel hotel, Chain chain) throws IOException {
        List<HotelBudget> hotelBudgetList = new ArrayList<>();
    
        //打印酒店名称
        logger.debug("parseExcelFile酒店名称：{}", hotel.getHotelName());
        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {

            // 获取sheet
            Sheet sheet = workbook.getSheetAt(0); // 获取第一个工作表
            
            // 跳过表头行，从第二行开始读取数据
            for (int rowIndex = 1; rowIndex <= sheet.getLastRowNum(); rowIndex++) {
                Row row = sheet.getRow(rowIndex);
                if (row == null) {
                    continue;
                }
                
                HotelBudget hotelBudget = parseRowToHotelBudget(row, hotel, chain,year);
                if (hotelBudget != null) {
                    hotelBudgetList.add(hotelBudget);
                }
            }
        }
        
        return hotelBudgetList;
    }
    
    /**
     * 解析Excel行数据为HotelBudget对象
     */
    private HotelBudget parseRowToHotelBudget(Row row, Hotel hotel, Chain chain,Integer year) {
        try {
            // 检查行是否为空
            if (isEmptyRow(row)) {
                return null;
            }
            //获取字符串格式的当前时间，到毫秒颗粒度 yyyyMMddHHmmss
            String currentTimeVersion = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS"));
            HotelBudget hotelBudget = new HotelBudget();
            
            // 根据Excel模板的列顺序解析数据
            // Excel列顺序：集团代码、集团名称、酒店代码、酒店名称、酒店管理类型、科目编号、科目名称、预算版本、1月预算、1月比例...
            // 注意：chainId、hotelId、year从参数传入，不在Excel中读取
            // 从第F列（索引5）开始，需要处理公式和百分比格式的数据
            hotelBudget.setSort(row.getRowNum()); 
            hotelBudget.setChainId(chain.getChainId());
            hotelBudget.setChainCode(chain.getChainCode()); // 集团代码
            hotelBudget.setChainName(chain.getChainName()); // 集团名称
            hotelBudget.setHotelId(hotel.getHotelId());
            hotelBudget.setHotelCode(hotel.getHotelCode()); // 酒店代码
            hotelBudget.setHotelName(hotel.getHotelName()); // 酒店名称
            hotelBudget.setHotelManagementModel(hotel.getManagementModel()); // 酒店管理类型
            hotelBudget.setSubjectCode(getCellValueAsString(row.getCell(3))); // 科目编号
            hotelBudget.setSubjectName(getCellValueAsString(row.getCell(3))); // 科目名称
            hotelBudget.setBudgetVersion(currentTimeVersion); // 预算版本
            hotelBudget.setBudgetYear(year);
            
            // 解析各月份预算和比例
            hotelBudget.setJanBudget(getCellValueAsBigDecimal(row.getCell(5))); // 1月预算
            hotelBudget.setJanRatio(getCellValueAsBigDecimal(row.getCell(6))); // 1月比例
            hotelBudget.setFebBudget(getCellValueAsBigDecimal(row.getCell(7))); // 2月预算
            hotelBudget.setFebRatio(getCellValueAsBigDecimal(row.getCell(8))); // 2月比例
            hotelBudget.setMarBudget(getCellValueAsBigDecimal(row.getCell(9))); // 3月预算
            hotelBudget.setMarRatio(getCellValueAsBigDecimal(row.getCell(10))); // 3月比例
            hotelBudget.setAprBudget(getCellValueAsBigDecimal(row.getCell(11))); // 4月预算
            hotelBudget.setAprRatio(getCellValueAsBigDecimal(row.getCell(12))); // 4月比例
            hotelBudget.setMayBudget(getCellValueAsBigDecimal(row.getCell(13))); // 5月预算
            hotelBudget.setMayRatio(getCellValueAsBigDecimal(row.getCell(14))); // 5月比例
            hotelBudget.setJunBudget(getCellValueAsBigDecimal(row.getCell(15))); // 6月预算
            hotelBudget.setJunRatio(getCellValueAsBigDecimal(row.getCell(16))); // 6月比例
            hotelBudget.setJulBudget(getCellValueAsBigDecimal(row.getCell(17))); // 7月预算
            hotelBudget.setJulRatio(getCellValueAsBigDecimal(row.getCell(18))); // 7月比例
            hotelBudget.setAugBudget(getCellValueAsBigDecimal(row.getCell(19))); // 8月预算
            hotelBudget.setAugRatio(getCellValueAsBigDecimal(row.getCell(20))); // 8月比例
            hotelBudget.setSepBudget(getCellValueAsBigDecimal(row.getCell(21))); // 9月预算
            hotelBudget.setSepRatio(getCellValueAsBigDecimal(row.getCell(22))); // 9月比例
            hotelBudget.setOctBudget(getCellValueAsBigDecimal(row.getCell(23))); // 10月预算
            hotelBudget.setOctRatio(getCellValueAsBigDecimal(row.getCell(24))); // 10月比例
            hotelBudget.setNovBudget(getCellValueAsBigDecimal(row.getCell(25))); // 11月预算
            hotelBudget.setNovRatio(getCellValueAsBigDecimal(row.getCell(26))); // 11月比例
            hotelBudget.setDecBudget(getCellValueAsBigDecimal(row.getCell(27))); // 12月预算
            hotelBudget.setDecRatio(getCellValueAsBigDecimal(row.getCell(28))); // 12月比例
            hotelBudget.setAnnualBudget(getCellValueAsBigDecimal(row.getCell(29))); // 年合计预算
            hotelBudget.setAnnualRatio(getCellValueAsBigDecimal(row.getCell(30))); // 年合计比例
            // 计算公式：Q1合计比例=Q1合计预算/年合计预算
            BigDecimal annualBudget = getCellValueAsBigDecimal(row.getCell(29));
            BigDecimal q1Budget = getCellValueAsBigDecimal(row.getCell(31));
            BigDecimal q2Budget = getCellValueAsBigDecimal(row.getCell(32));
            BigDecimal q3Budget = getCellValueAsBigDecimal(row.getCell(33));
            BigDecimal q4Budget = getCellValueAsBigDecimal(row.getCell(34));
            hotelBudget.setQ1Budget(q1Budget); // Q1合计预算
            hotelBudget.setQ2Budget(q2Budget); // Q2合计预算
            hotelBudget.setQ3Budget(q3Budget); // Q3合计预算
            hotelBudget.setQ4Budget(q4Budget); // Q4合计预算
            // 设置精度为2（保留两位小数）
            int scale = 2;
            RoundingMode roundingMode = RoundingMode.HALF_UP;

            // 执行除法运算q
            BigDecimal q1Ratio = annualBudget.compareTo(BigDecimal.ZERO) > 0 ? 
                q1Budget.divide(annualBudget, scale, roundingMode) : BigDecimal.ZERO;
            BigDecimal q2Ratio = annualBudget.compareTo(BigDecimal.ZERO) > 0 ? 
                q2Budget.divide(annualBudget, scale, roundingMode) : BigDecimal.ZERO;
            BigDecimal q3Ratio = annualBudget.compareTo(BigDecimal.ZERO) > 0 ? 
                q3Budget.divide(annualBudget, scale, roundingMode) : BigDecimal.ZERO;
            BigDecimal q4Ratio = annualBudget.compareTo(BigDecimal.ZERO) > 0 ? 
                q4Budget.divide(annualBudget, scale, roundingMode) : BigDecimal.ZERO;

            hotelBudget.setQ1Ratio(q1Ratio); 
            hotelBudget.setQ2Ratio(q2Ratio); // Q2合计比例
            hotelBudget.setQ3Ratio(q3Ratio); // Q3合计比例
            hotelBudget.setQ4Ratio(q4Ratio); // Q4合计比例
            // 验证必要字段
            if (!StringUtils.hasText(hotelBudget.getHotelId()) || 
                !StringUtils.hasText(hotelBudget.getSubjectCode()) || 
                !StringUtils.hasText(hotelBudget.getBudgetVersion()) || 
                hotelBudget.getBudgetYear() == null) {
                logger.warn("跳过无效行数据：酒店ID={}, 科目编号={}, 预算版本={}, 预算年份={}", 
                           hotelBudget.getHotelId(), hotelBudget.getSubjectCode(), 
                           hotelBudget.getBudgetVersion(), hotelBudget.getBudgetYear());
                return null;
            }
            
            return hotelBudget;
            
        } catch (Exception e) {
            logger.error("解析Excel行数据时发生异常，行号：{}", row.getRowNum() + 1, e);
            return null;
        }
    }
    
    /**
     * 检查行是否为空
     */
    private boolean isEmptyRow(Row row) {
        if (row == null) {
            return true;
        }
        
        for (int i = 0; i < row.getLastCellNum(); i++) {
            Cell cell = row.getCell(i);
            if (cell != null && StringUtils.hasText(getCellValueAsString(cell))) {
                return false;
            }
        }
        return true;
    }
    
    /**
     * 获取单元格字符串值
     */
    private String getCellValueAsString(Cell cell) {
        if (cell == null) {
            return null;
        }
        
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue().trim();
            case NUMERIC:
                if (DateUtil.isCellDateFormatted(cell)) {
                    return cell.getDateCellValue().toString();
                } else {
                    return String.valueOf(cell.getNumericCellValue());
                }
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            case FORMULA:
                return cell.getCellFormula();
            default:
                return null;
        }
    }
    
    /**
     * 获取单元格整数值
     */
    private Integer getCellValueAsInteger(Cell cell) {
        if (cell == null) {
            return null;
        }
        
        switch (cell.getCellType()) {
            case NUMERIC:
                return (int) cell.getNumericCellValue();
            case STRING:
                String value = cell.getStringCellValue().trim();
                if (StringUtils.hasText(value)) {
                    try {
                        return Integer.parseInt(value);
                    } catch (NumberFormatException e) {
                        return null;
                    }
                }
                return null;
            default:
                return null;
        }
    }
    
    /**
     * 获取单元格BigDecimal值
     */
    private BigDecimal getCellValueAsBigDecimal(Cell cell) {
        if (cell == null) {
            return BigDecimal.ZERO;
        }
        
        switch (cell.getCellType()) {
            case NUMERIC:
                // 检查是否为百分比格式
                if (cell.getCellStyle().getDataFormat() == 9 || cell.getCellStyle().getDataFormat() == 10) {
                    // 百分比格式，直接返回数值（已经是小数形式）
                    return BigDecimal.valueOf(cell.getNumericCellValue());
                }
                return BigDecimal.valueOf(cell.getNumericCellValue());
            case STRING:
                String value = cell.getStringCellValue().trim();
                if (StringUtils.hasText(value)) {
                    // 处理百分比字符串
                    if (value.endsWith("%")) {
                        try {
                            String numStr = value.substring(0, value.length() - 1);
                            return new BigDecimal(numStr).divide(BigDecimal.valueOf(100));
                        } catch (NumberFormatException e) {
                            return BigDecimal.ZERO;
                        }
                    }
                    try {
                        return new BigDecimal(value);
                    } catch (NumberFormatException e) {
                        return BigDecimal.ZERO;
                    }
                }
                return BigDecimal.ZERO;
            case FORMULA:
                // 处理公式，获取公式计算结果
                try {
                    double numericValue = cell.getNumericCellValue();
                    return BigDecimal.valueOf(numericValue);
                } catch (Exception e) {
                    // 如果公式计算结果不是数值，尝试获取字符串结果
                    try {
                        String formulaResult = cell.getStringCellValue().trim();
                        if (StringUtils.hasText(formulaResult)) {
                            // 处理百分比字符串
                            if (formulaResult.endsWith("%")) {
                                String numStr = formulaResult.substring(0, formulaResult.length() - 1);
                                return new BigDecimal(numStr).divide(BigDecimal.valueOf(100));
                            }
                            return new BigDecimal(formulaResult);
                        }
                    } catch (Exception ex) {
                        logger.warn("无法解析公式结果，单元格位置：{}", cell.getAddress(), ex);
                    }
                    return BigDecimal.ZERO;
                }
            default:
                return BigDecimal.ZERO;
        }
    }

    /**
     * 根据科目代码对酒店预算数据进行汇总处理
     * @param hotelBudgetList 酒店预算列表
     * @return 汇总后的酒店预算对象
     */
    private HotelBudget consolidateHotelBudgets(List<HotelBudget> hotelBudgetList) {
        if (hotelBudgetList == null || hotelBudgetList.isEmpty()) {
            return null;
        }
        
        // 使用第一个酒店预算作为基础模板
        HotelBudget baseBudget = hotelBudgetList.get(0);
        HotelBudget consolidatedBudget = new HotelBudget();
        
        // 复制基础信息
        consolidatedBudget.setChainId(baseBudget.getChainId());
        consolidatedBudget.setChainCode(baseBudget.getChainCode());
        consolidatedBudget.setChainName(baseBudget.getChainName());
        consolidatedBudget.setHotelId("Total"); // 汇总标识
        consolidatedBudget.setHotelCode("Total("+hotelBudgetList.size()+")");
        consolidatedBudget.setHotelName("酒店汇总");
        consolidatedBudget.setHotelManagementModel(baseBudget.getHotelManagementModel());
        consolidatedBudget.setSubjectCode(baseBudget.getSubjectCode());
        consolidatedBudget.setSubjectName(baseBudget.getSubjectName());
        consolidatedBudget.setBudgetVersion(baseBudget.getBudgetVersion());
        consolidatedBudget.setBudgetYear(baseBudget.getBudgetYear());
        consolidatedBudget.setSort(baseBudget.getSort());
        
        // 设置创建时间和更新时间
        String currentTime = LocalDateTime.now().format(DATE_FORMATTER);
        consolidatedBudget.setCreatedAt(LocalDateTime.parse(currentTime, DATE_FORMATTER));
        consolidatedBudget.setUpdatedAt(LocalDateTime.parse(currentTime, DATE_FORMATTER));
        
        String subjectCode = baseBudget.getSubjectCode();
        
        // 根据科目代码执行不同的汇总逻辑
        switch (subjectCode) {
            
            case "天数 No of days":
                // 取第一个酒店的数值
                consolidatedBudget.setJanBudget(baseBudget.getJanBudget());
                consolidatedBudget.setFebBudget(baseBudget.getFebBudget());
                consolidatedBudget.setMarBudget(baseBudget.getMarBudget());
                consolidatedBudget.setAprBudget(baseBudget.getAprBudget());
                consolidatedBudget.setMayBudget(baseBudget.getMayBudget());
                consolidatedBudget.setJunBudget(baseBudget.getJunBudget());
                consolidatedBudget.setJulBudget(baseBudget.getJulBudget());
                consolidatedBudget.setAugBudget(baseBudget.getAugBudget());
                consolidatedBudget.setSepBudget(baseBudget.getSepBudget());
                consolidatedBudget.setOctBudget(baseBudget.getOctBudget());
                consolidatedBudget.setNovBudget(baseBudget.getNovBudget());
                consolidatedBudget.setDecBudget(baseBudget.getDecBudget());
                consolidatedBudget.setAnnualBudget(baseBudget.getAnnualBudget());
                consolidatedBudget.setQ1Budget(baseBudget.getQ1Budget());
                consolidatedBudget.setQ2Budget(baseBudget.getQ2Budget());
                consolidatedBudget.setQ3Budget(baseBudget.getQ3Budget());
                consolidatedBudget.setQ4Budget(baseBudget.getQ4Budget());
                break;
                
            case "平均房价 ADR":
            case "出租率 OCC":
                // 所有酒店的平均值
                consolidatedBudget.setJanBudget(calculateAverage(hotelBudgetList, HotelBudget::getJanBudget));
                consolidatedBudget.setFebBudget(calculateAverage(hotelBudgetList, HotelBudget::getFebBudget));
                consolidatedBudget.setMarBudget(calculateAverage(hotelBudgetList, HotelBudget::getMarBudget));
                consolidatedBudget.setAprBudget(calculateAverage(hotelBudgetList, HotelBudget::getAprBudget));
                consolidatedBudget.setMayBudget(calculateAverage(hotelBudgetList, HotelBudget::getMayBudget));
                consolidatedBudget.setJunBudget(calculateAverage(hotelBudgetList, HotelBudget::getJunBudget));
                consolidatedBudget.setJulBudget(calculateAverage(hotelBudgetList, HotelBudget::getJulBudget));
                consolidatedBudget.setAugBudget(calculateAverage(hotelBudgetList, HotelBudget::getAugBudget));
                consolidatedBudget.setSepBudget(calculateAverage(hotelBudgetList, HotelBudget::getSepBudget));
                consolidatedBudget.setOctBudget(calculateAverage(hotelBudgetList, HotelBudget::getOctBudget));
                consolidatedBudget.setNovBudget(calculateAverage(hotelBudgetList, HotelBudget::getNovBudget));
                consolidatedBudget.setDecBudget(calculateAverage(hotelBudgetList, HotelBudget::getDecBudget));
                consolidatedBudget.setAnnualBudget(calculateAverage(hotelBudgetList, HotelBudget::getAnnualBudget));
                consolidatedBudget.setQ1Budget(calculateAverage(hotelBudgetList, HotelBudget::getQ1Budget));
                consolidatedBudget.setQ2Budget(calculateAverage(hotelBudgetList, HotelBudget::getQ2Budget));
                consolidatedBudget.setQ3Budget(calculateAverage(hotelBudgetList, HotelBudget::getQ3Budget));
                consolidatedBudget.setQ4Budget(calculateAverage(hotelBudgetList, HotelBudget::getQ4Budget));
                break;
                
            case "可售房平均房价 RevPar":
                // 汇总的'平均房价 ADR'乘以汇总的'出租率 OCC'
                // 这里需要先获取ADR和OCC的汇总数据，然后计算乘积
                // 由于这是一个复杂的计算，需要特殊处理
                // 注意：这个计算需要先获取ADR和OCC的汇总数据，这里暂时使用默认的合计逻辑
                // 实际使用时可能需要传入ADR和OCC的汇总数据
                consolidatedBudget.setJanBudget(calculateSum(hotelBudgetList, HotelBudget::getJanBudget));
                consolidatedBudget.setFebBudget(calculateSum(hotelBudgetList, HotelBudget::getFebBudget));
                consolidatedBudget.setMarBudget(calculateSum(hotelBudgetList, HotelBudget::getMarBudget));
                consolidatedBudget.setAprBudget(calculateSum(hotelBudgetList, HotelBudget::getAprBudget));
                consolidatedBudget.setMayBudget(calculateSum(hotelBudgetList, HotelBudget::getMayBudget));
                consolidatedBudget.setJunBudget(calculateSum(hotelBudgetList, HotelBudget::getJunBudget));
                consolidatedBudget.setJulBudget(calculateSum(hotelBudgetList, HotelBudget::getJulBudget));
                consolidatedBudget.setAugBudget(calculateSum(hotelBudgetList, HotelBudget::getAugBudget));
                consolidatedBudget.setSepBudget(calculateSum(hotelBudgetList, HotelBudget::getSepBudget));
                consolidatedBudget.setOctBudget(calculateSum(hotelBudgetList, HotelBudget::getOctBudget));
                consolidatedBudget.setNovBudget(calculateSum(hotelBudgetList, HotelBudget::getNovBudget));
                consolidatedBudget.setDecBudget(calculateSum(hotelBudgetList, HotelBudget::getDecBudget));
                consolidatedBudget.setAnnualBudget(calculateSum(hotelBudgetList, HotelBudget::getAnnualBudget));
                consolidatedBudget.setQ1Budget(calculateSum(hotelBudgetList, HotelBudget::getQ1Budget));
                consolidatedBudget.setQ2Budget(calculateSum(hotelBudgetList, HotelBudget::getQ2Budget));
                consolidatedBudget.setQ3Budget(calculateSum(hotelBudgetList, HotelBudget::getQ3Budget));
                consolidatedBudget.setQ4Budget(calculateSum(hotelBudgetList, HotelBudget::getQ4Budget));
                break;
                
            case "直营酒店店经营毛利% GOP% of Lease and Operate Hotel":
                // 所有酒店的'直营酒店经营毛利 GOP of Lease and Operate Hotel' 的合计除以所有酒店的'酒店考核总收入 Total Revenue' 的合计
                // 这个计算需要特殊处理，需要先获取GOP和Total Revenue的数据
                // 暂时使用默认的合计逻辑
                consolidatedBudget.setJanBudget(calculateSum(hotelBudgetList, HotelBudget::getJanBudget));
                consolidatedBudget.setFebBudget(calculateSum(hotelBudgetList, HotelBudget::getFebBudget));
                consolidatedBudget.setMarBudget(calculateSum(hotelBudgetList, HotelBudget::getMarBudget));
                consolidatedBudget.setAprBudget(calculateSum(hotelBudgetList, HotelBudget::getAprBudget));
                consolidatedBudget.setMayBudget(calculateSum(hotelBudgetList, HotelBudget::getMayBudget));
                consolidatedBudget.setJunBudget(calculateSum(hotelBudgetList, HotelBudget::getJunBudget));
                consolidatedBudget.setJulBudget(calculateSum(hotelBudgetList, HotelBudget::getJulBudget));
                consolidatedBudget.setAugBudget(calculateSum(hotelBudgetList, HotelBudget::getAugBudget));
                consolidatedBudget.setSepBudget(calculateSum(hotelBudgetList, HotelBudget::getSepBudget));
                consolidatedBudget.setOctBudget(calculateSum(hotelBudgetList, HotelBudget::getOctBudget));
                consolidatedBudget.setNovBudget(calculateSum(hotelBudgetList, HotelBudget::getNovBudget));
                consolidatedBudget.setDecBudget(calculateSum(hotelBudgetList, HotelBudget::getDecBudget));
                consolidatedBudget.setAnnualBudget(calculateSum(hotelBudgetList, HotelBudget::getAnnualBudget));
                consolidatedBudget.setQ1Budget(calculateSum(hotelBudgetList, HotelBudget::getQ1Budget));
                consolidatedBudget.setQ2Budget(calculateSum(hotelBudgetList, HotelBudget::getQ2Budget));
                consolidatedBudget.setQ3Budget(calculateSum(hotelBudgetList, HotelBudget::getQ3Budget));
                consolidatedBudget.setQ4Budget(calculateSum(hotelBudgetList, HotelBudget::getQ4Budget));
                break;
                
            default:
                // 其他所有字段都使用合计逻辑，包括但不限于：
                // '房间数 No of Rooms',
                // '总房量 Total Available Room', '出租房量Occupied Room', '酒店考核总收入 Total Revenue',
                // '客房收入 Rooms Revenue', '非客房收入 Non-room Revenue', '餐饮酒水收入 F&B Revenue',
                // '—餐饮收入 Food Revenue', 'A. 早餐收入', 'B. 餐饮其他收入', '—酒水收入 Beveragae Revenue',
                // '—会务收入 Meeting Revenue', '—商品收入 Commercial Goods Revenue', '—优选平台收入 E-Commerce Platform Revenue',
                // '—房屋转租收入 Space Rental', '—卡收入 Card Sales Revenue', '—代客洗衣收入 Guest Laundry Revenue',
                // '—其他收入 Other Revenue', '直营店经营费用 Operating Expenses', '营业成本 Hotel Operating Cost',
                // '—餐饮成本 Food cost', 'A. 早餐成本', 'B. 餐饮其他成本', '—酒水成本 Beverage cost',
                // '—其他餐饮成本', '—商品成本 Commercial Goods Cost', '—优选平台成本 E-Commerce Platform cost',
                // '—卡类成本 Card Sales Cost', '—储值卡成本 Deposit Card Cost', '人力成本 Labor Cost',
                // '—应发工资 Salary', '—绩效达标奖计提 Targeted Bonus', '—绩效超额奖预提 Exceeded Target Bonus',
                // '—考核提成 Hotel GM bonus', '—其他奖励 Other Incentive', '—卡奖励 Card Sales Incentive',
                // '—加班费 Overtime', '—社保 Social Benefits Contribution', '—福利费 Benefits',
                // '—工会经费 Union Fee', '—职工教育经费 Education Fee', '—外部服务费 Outsourced Service',
                // '—委派服务费 Secondary Service', '—员工餐（调整） Staff Meal (Adj)', '物料用品 Operation Supplies',
                // '—棉织品 Linen', '—服务用品 Service Supplies', '—清洁用品 Cleaning Supplies',
                // '—低值易耗品 Amenities', '—餐厨具 Kitchen Utensil', '—其他物料用品 Other Supplies',
                // '—工作服 Uniform', '能源费用 Utilities', '—水费 Water', '—电费 Electricity',
                // '—煤、燃气费 Gas', '—热力供暖费 Heating', '维修保养费 Maintenance Fee',
                // '—酒店维修 Hotel Maintenance', '—电梯维保 Elevator Maintenance', '—消防维保 Fire Maintenance',
                // '—空调维保 Air-conditioner Maintenance', '—公司统筹 Group Reserve', '销售佣金 Commission Charge',
                // '—中央自营渠道服务费', '—美团总对总服务费', '—飞猪总对总服务费', '—抖音结算服务费',
                // '—中央合作平台渠道服务费', '—逸粉小程序', '—销售服务费 Sales Commission',
                // '—携程 Ctrip', '—艺龙 Yi Long', '—去哪儿 Qunaer', '—美团 Meituan', '—其他服务费',
                // '洗涤费 Laundry Expenses', '—洗涤费 Laundry', '—清洁费 Cleaning', '其他费用 Other Expenses',
                // '—印刷及文具费 Printing Paper and Stationery', '—差旅费 Travel Expenses', '—免费停车 Free Parking',
                // '—有线电视费 Cable TV', '—电话费 telephone', '—排污费 Sewage charge', '—咨询服务费 Consultant',
                // '—网络费 Internet', '—保险费 Insurance', '—绿植 Plant & Landscaping', '—员工宿舍费用 Dormitory',
                // '—保安服务费用 Security Service fee', '—家宾会员费 Jiabing fee', '—软件维护费 Software',
                // '—会员积分服务费 WOHY Member point service', '—CRS 服务费', '—HOPS系统直营成本 HOPS system cost',
                // '—租赁费 Rent expense', '—商务用品 Business Gift', '—消杀费用 Pest Control', '—其他 Others',
                // '—财务费用 bank fee', '酒店市场营销费用 Sales & Marketing Expenses', '—业务招待费 Entertainment',
                // '—广告费 Advertisement', '—宣传费 Marketing', '直营酒店经营毛利 GOP of Lease and Operate Hotel',
                // '资产处置损益', '其他收益 Other Income', '加计扣除 Additional Deduction', '租金 Lease Charge',
                // '物业管理费 Property Management', '折旧和摊销 Depreciation and Amortization', '税金及附加 Tax Levis',
                // '营业外收入 Non-operating Income', '直营酒店营业利润 Lease and Operate Hotel Profit before tax'
                consolidatedBudget.setJanBudget(calculateSum(hotelBudgetList, HotelBudget::getJanBudget));
                consolidatedBudget.setFebBudget(calculateSum(hotelBudgetList, HotelBudget::getFebBudget));
                consolidatedBudget.setMarBudget(calculateSum(hotelBudgetList, HotelBudget::getMarBudget));
                consolidatedBudget.setAprBudget(calculateSum(hotelBudgetList, HotelBudget::getAprBudget));
                consolidatedBudget.setMayBudget(calculateSum(hotelBudgetList, HotelBudget::getMayBudget));
                consolidatedBudget.setJunBudget(calculateSum(hotelBudgetList, HotelBudget::getJunBudget));
                consolidatedBudget.setJulBudget(calculateSum(hotelBudgetList, HotelBudget::getJulBudget));
                consolidatedBudget.setAugBudget(calculateSum(hotelBudgetList, HotelBudget::getAugBudget));
                consolidatedBudget.setSepBudget(calculateSum(hotelBudgetList, HotelBudget::getSepBudget));
                consolidatedBudget.setOctBudget(calculateSum(hotelBudgetList, HotelBudget::getOctBudget));
                consolidatedBudget.setNovBudget(calculateSum(hotelBudgetList, HotelBudget::getNovBudget));
                consolidatedBudget.setDecBudget(calculateSum(hotelBudgetList, HotelBudget::getDecBudget));
                consolidatedBudget.setAnnualBudget(calculateSum(hotelBudgetList, HotelBudget::getAnnualBudget));
                consolidatedBudget.setQ1Budget(calculateSum(hotelBudgetList, HotelBudget::getQ1Budget));
                consolidatedBudget.setQ2Budget(calculateSum(hotelBudgetList, HotelBudget::getQ2Budget));
                consolidatedBudget.setQ3Budget(calculateSum(hotelBudgetList, HotelBudget::getQ3Budget));
                consolidatedBudget.setQ4Budget(calculateSum(hotelBudgetList, HotelBudget::getQ4Budget));
                break;
        }
        
        // 计算比例字段（如果需要的话）
        calculateRatios(consolidatedBudget);
        
        return consolidatedBudget;
    }
    
    /**
     * 计算平均值
     */
    private BigDecimal calculateAverage(List<HotelBudget> hotelBudgetList, 
                                      java.util.function.Function<HotelBudget, BigDecimal> getter) {
        if (hotelBudgetList == null || hotelBudgetList.isEmpty()) {
            return BigDecimal.ZERO;
        }
        
        BigDecimal sum = hotelBudgetList.stream()
                .map(getter)
                .filter(value -> value != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        return sum.divide(BigDecimal.valueOf(hotelBudgetList.size()), 2, RoundingMode.HALF_UP);
    }
    
    /**
     * 计算合计
     */
    private BigDecimal calculateSum(List<HotelBudget> hotelBudgetList, 
                                  java.util.function.Function<HotelBudget, BigDecimal> getter) {
        if (hotelBudgetList == null || hotelBudgetList.isEmpty()) {
            return BigDecimal.ZERO;
        }
        
        return hotelBudgetList.stream()
                .map(getter)
                .filter(value -> value != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
    
    /**
     * 计算比例字段
     */
    private void calculateRatios(HotelBudget budget) {
        // 只有特定科目需要计算比例
        String subjectCode = budget.getSubjectCode();
        if (!isRatioCalculationRequired(subjectCode)) {
            return;
        }
        
        // 这里需要获取"酒店考核总收入 Total Revenue"科目的数据
        // 由于当前方法无法直接获取其他科目的数据，比例计算将在调用方处理
        // 暂时保持原有的计算逻辑，但只对特定科目生效
        BigDecimal annualBudget = budget.getAnnualBudget();
        if (annualBudget == null || annualBudget.compareTo(BigDecimal.ZERO) == 0) {
            return;
        }
        
        // 计算各月份比例
        budget.setJanRatio(calculateRatio(budget.getJanBudget(), annualBudget));
        budget.setFebRatio(calculateRatio(budget.getFebBudget(), annualBudget));
        budget.setMarRatio(calculateRatio(budget.getMarBudget(), annualBudget));
        budget.setAprRatio(calculateRatio(budget.getAprBudget(), annualBudget));
        budget.setMayRatio(calculateRatio(budget.getMayBudget(), annualBudget));
        budget.setJunRatio(calculateRatio(budget.getJunBudget(), annualBudget));
        budget.setJulRatio(calculateRatio(budget.getJulBudget(), annualBudget));
        budget.setAugRatio(calculateRatio(budget.getAugBudget(), annualBudget));
        budget.setSepRatio(calculateRatio(budget.getSepBudget(), annualBudget));
        budget.setOctRatio(calculateRatio(budget.getOctBudget(), annualBudget));
        budget.setNovRatio(calculateRatio(budget.getNovBudget(), annualBudget));
        budget.setDecRatio(calculateRatio(budget.getDecBudget(), annualBudget));
        
        // 计算季度比例
        budget.setQ1Ratio(calculateRatio(budget.getQ1Budget(), annualBudget));
        budget.setQ2Ratio(calculateRatio(budget.getQ2Budget(), annualBudget));
        budget.setQ3Ratio(calculateRatio(budget.getQ3Budget(), annualBudget));
        budget.setQ4Ratio(calculateRatio(budget.getQ4Budget(), annualBudget));
        
        // 年合计比例
        budget.setAnnualRatio(BigDecimal.ONE);
    }
    
    /**
     * 判断是否需要计算比例
     */
    private boolean isRatioCalculationRequired(String subjectCode) {
        if (subjectCode == null) {
            return false;
        }
        
        return subjectCode.equals("客房收入 Rooms Revenue ") ||
               subjectCode.equals("非客房收入 Non-room Revenue") ||
               subjectCode.equals("餐饮酒水收入 F&B Revenue") ||
               subjectCode.equals("—餐饮收入 Food  Revenue") ||
               subjectCode.equals("营业成本 Hotel Operating Cost") ||
               subjectCode.equals("人力成本 Labor Cost") ||
               subjectCode.equals("物料用品 Operation Supplies") ||
               subjectCode.equals("能源费用 Utilities") ||
               subjectCode.equals("维修保养费 Maintenance Fee") ||
               subjectCode.equals("销售佣金 Commission Charge") ||
               subjectCode.equals("洗涤费 Laundry Expenses") ||
               subjectCode.equals("其他费用 Other Expenses") ||
               subjectCode.equals("酒店市场营销费用 Sales & Marketing Expenses");
    }
    
    /**
     * 为特定科目计算比例字段
     */
    private void calculateRatiosForSpecificSubjects(List<HotelBudget> hotelBudgetList) {
        if (hotelBudgetList == null || hotelBudgetList.isEmpty()) {
            return;
        }
        
        // 查找"酒店考核总收入 Total Revenue"科目
        HotelBudget totalRevenueBudget = null;
        for (HotelBudget budget : hotelBudgetList) {
            if ("酒店考核总收入 Total Revenue".equals(budget.getSubjectCode())) {
                totalRevenueBudget = budget;
                break;
            }
        }
        
        if (totalRevenueBudget == null) {
            logger.warn("未找到'酒店考核总收入 Total Revenue'科目，无法计算比例");
            return;
        }
        
        // 为需要计算比例的科目计算比例
        for (HotelBudget budget : hotelBudgetList) {
            if (isRatioCalculationRequired(budget.getSubjectCode())) {
                calculateRatiosAgainstTotalRevenue(budget, totalRevenueBudget);
            }
        }
    }
    
    /**
     * 根据总营业收入计算比例
     */
    private void calculateRatiosAgainstTotalRevenue(HotelBudget budget, HotelBudget totalRevenueBudget) {
        // 计算各月份比例
        budget.setJanRatio(calculateRatio(budget.getJanBudget(), totalRevenueBudget.getJanBudget()));
        budget.setFebRatio(calculateRatio(budget.getFebBudget(), totalRevenueBudget.getFebBudget()));
        budget.setMarRatio(calculateRatio(budget.getMarBudget(), totalRevenueBudget.getMarBudget()));
        budget.setAprRatio(calculateRatio(budget.getAprBudget(), totalRevenueBudget.getAprBudget()));
        budget.setMayRatio(calculateRatio(budget.getMayBudget(), totalRevenueBudget.getMayBudget()));
        budget.setJunRatio(calculateRatio(budget.getJunBudget(), totalRevenueBudget.getJunBudget()));
        budget.setJulRatio(calculateRatio(budget.getJulBudget(), totalRevenueBudget.getJulBudget()));
        budget.setAugRatio(calculateRatio(budget.getAugBudget(), totalRevenueBudget.getAugBudget()));
        budget.setSepRatio(calculateRatio(budget.getSepBudget(), totalRevenueBudget.getSepBudget()));
        budget.setOctRatio(calculateRatio(budget.getOctBudget(), totalRevenueBudget.getOctBudget()));
        budget.setNovRatio(calculateRatio(budget.getNovBudget(), totalRevenueBudget.getNovBudget()));
        budget.setDecRatio(calculateRatio(budget.getDecBudget(), totalRevenueBudget.getDecBudget()));
        
        // 计算季度比例
        budget.setQ1Ratio(calculateRatio(budget.getQ1Budget(), totalRevenueBudget.getQ1Budget()));
        budget.setQ2Ratio(calculateRatio(budget.getQ2Budget(), totalRevenueBudget.getQ2Budget()));
        budget.setQ3Ratio(calculateRatio(budget.getQ3Budget(), totalRevenueBudget.getQ3Budget()));
        budget.setQ4Ratio(calculateRatio(budget.getQ4Budget(), totalRevenueBudget.getQ4Budget()));
        
        // 计算年合计比例
        budget.setAnnualRatio(calculateRatio(budget.getAnnualBudget(), totalRevenueBudget.getAnnualBudget()));
    }
    
    /**
     * 计算比例
     */
    private BigDecimal calculateRatio(BigDecimal value, BigDecimal total) {
        if (value == null || total == null || total.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }
        return value.divide(total, 2, RoundingMode.HALF_UP);
    }
    
    @Override
    @Transactional
    public BaseResponse<String> exportBudgetData(BudgetExportRequest request) {
        try {
            logger.debug("开始导出预算数据");
            
            // 参数验证
            if (request == null) {
                return BaseResponse.error("请求参数不能为空");
            }
            if (request.getYear() == null) {
                return BaseResponse.error("预算年份不能为空");
            }
            if (request.getExportData() == null || request.getExportData().isEmpty()) {
                return BaseResponse.error("导出数据不能为空");
            }
            
            // 处理每个酒店的预算数据
            for (BudgetExportRequest.ExportData exportData : request.getExportData()) {
                if (exportData.getSubjects() == null || exportData.getSubjects().isEmpty()) {
                    continue;
                }
                
                // 处理每个科目的预算数据
                for (BudgetExportRequest.Subject subject : exportData.getSubjects()) {
                    HotelBudget hotelBudget = convertToHotelBudget(exportData, subject, request.getYear());
                    
                    
                }
            }
            
            logger.debug("预算数据导出成功");
            return BaseResponse.success("预算数据导出成功");
            
        } catch (Exception e) {
            logger.error("导出预算数据时发生异常", e);
            return BaseResponse.error("系统异常：" + e.getMessage());
        }
    }
    
    /**
     * 将导出数据转换为HotelBudget实体
     */
    private HotelBudget convertToHotelBudget(BudgetExportRequest.ExportData exportData, 
                                           BudgetExportRequest.Subject subject, 
                                           Integer year) {
        HotelBudget hotelBudget = new HotelBudget();
        
        // 设置基本信息
        hotelBudget.setChainCode(exportData.getChainCode());
        hotelBudget.setChainName(exportData.getChainName());
        hotelBudget.setHotelId(exportData.getHotelId());
        hotelBudget.setHotelCode(exportData.getHotelCode());
        hotelBudget.setHotelName(exportData.getHotelName());
        hotelBudget.setHotelManagementModel(exportData.getHotelManagementModel());
        hotelBudget.setSubjectCode(subject.getSubjectCode());
        hotelBudget.setSubjectName(subject.getItem());
        hotelBudget.setBudgetYear(year);
        hotelBudget.setBudgetVersion("V1"); // 默认版本
        
        // 设置月度预算
        hotelBudget.setJanBudget(convertToBigDecimal(subject.getM1()));
        hotelBudget.setFebBudget(convertToBigDecimal(subject.getM2()));
        hotelBudget.setMarBudget(convertToBigDecimal(subject.getM3()));
        hotelBudget.setAprBudget(convertToBigDecimal(subject.getM4()));
        hotelBudget.setMayBudget(convertToBigDecimal(subject.getM5()));
        hotelBudget.setJunBudget(convertToBigDecimal(subject.getM6()));
        hotelBudget.setJulBudget(convertToBigDecimal(subject.getM7()));
        hotelBudget.setAugBudget(convertToBigDecimal(subject.getM8()));
        hotelBudget.setSepBudget(convertToBigDecimal(subject.getM9()));
        hotelBudget.setOctBudget(convertToBigDecimal(subject.getM10()));
        hotelBudget.setNovBudget(convertToBigDecimal(subject.getM11()));
        hotelBudget.setDecBudget(convertToBigDecimal(subject.getM12()));
        
        // 设置年度预算
        hotelBudget.setAnnualBudget(convertToBigDecimal(subject.getYearTotal()));
        
        // 设置季度预算
        hotelBudget.setQ1Budget(convertToBigDecimal(subject.getQ1()));
        hotelBudget.setQ2Budget(convertToBigDecimal(subject.getQ2()));
        hotelBudget.setQ3Budget(convertToBigDecimal(subject.getQ3()));
        hotelBudget.setQ4Budget(convertToBigDecimal(subject.getQ4()));
        
        // 设置比率（如果有的话）
        hotelBudget.setJanRatio(convertToBigDecimal(subject.getM1Rate()));
        hotelBudget.setFebRatio(convertToBigDecimal(subject.getM2Rate()));
        hotelBudget.setMarRatio(convertToBigDecimal(subject.getM3Rate()));
        hotelBudget.setAprRatio(convertToBigDecimal(subject.getM4Rate()));
        hotelBudget.setMayRatio(convertToBigDecimal(subject.getM5Rate()));
        hotelBudget.setJunRatio(convertToBigDecimal(subject.getM6Rate()));
        hotelBudget.setJulRatio(convertToBigDecimal(subject.getM7Rate()));
        hotelBudget.setAugRatio(convertToBigDecimal(subject.getM8Rate()));
        hotelBudget.setSepRatio(convertToBigDecimal(subject.getM9Rate()));
        hotelBudget.setOctRatio(convertToBigDecimal(subject.getM10Rate()));
        hotelBudget.setNovRatio(convertToBigDecimal(subject.getM11Rate()));
        hotelBudget.setDecRatio(convertToBigDecimal(subject.getM12Rate()));
        hotelBudget.setAnnualRatio(convertToBigDecimal(subject.getYearTotalRate()));
        
        return hotelBudget;
    }
    
    /**
     * 将Object转换为BigDecimal
     */
    private BigDecimal convertToBigDecimal(Object value) {
        if (value == null) {
            return null;
        }
        
        if (value instanceof Number) {
            return new BigDecimal(value.toString());
        }
        
        if (value instanceof String) {
            String strValue = (String) value;
            if (strValue.trim().isEmpty()) {
                return null;
            }
            try {
                return new BigDecimal(strValue);
            } catch (NumberFormatException e) {
                logger.warn("无法将字符串转换为BigDecimal: {}", strValue);
                return null;
            }
        }
        
        return null;
    }
} 