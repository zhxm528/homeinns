package com.zai.report.nj;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.beans.factory.annotation.Autowired;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.web.multipart.MultipartFile;
import com.zai.config.PoiSecurityConfig;
import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.Map;
import java.util.HashMap;
import java.util.Set;

@RestController
@RequestMapping("/api/nj/budget/bulk")
public class NjBudgetBulkTemplateController {
    private static final Logger logger = LoggerFactory.getLogger(NjBudgetBulkTemplateController.class);

    @Autowired
    private PoiSecurityConfig poiSecurityConfig;

    /**
     * 接收前端api调用，处理预算年度模板数据
     * @param file 前端上传的Excel文件
     * @return 处理结果
     */
    @PostMapping("/makesql")
    public ResponseEntity<byte[]> processBudgetTemplate(
        @RequestParam("year") String year,
        @RequestParam("file") MultipartFile file
    ) {
        try {
            // 打印文件信息
            if (file != null && !file.isEmpty()) {
                logger.debug("接收到的文件信息 - 文件名: {}, 文件大小: {} bytes", file.getOriginalFilename(), file.getSize());
            } else {
                logger.warn("未接收到文件或文件为空");
                String errorMessage = "未接收到文件";
                return ResponseEntity.badRequest().body(errorMessage.getBytes(StandardCharsets.UTF_8));
            }
            
            // 解析Excel文件，生成NjBudgetYearTemplateSQL对象列表
            List<NjBudgetYearTemplateSQL> sqlList = parseExcelToSqlList(file, year);
            
            // 打印解析结果
            logger.debug("解析Excel成功，共生成 {} 条数据", sqlList.size());
            
            // 转换为批量插入SQL语句
            String sqlContent = buildBatchInsertSQL(sqlList);
            
            // 生成文件名（使用上传的文件名，但扩展名改为.sql）
            String originalFileName = file.getOriginalFilename();
            String fileName = originalFileName != null ? 
                originalFileName.substring(0, originalFileName.lastIndexOf('.')) + ".sql" :
                "全量预算年度模板.sql";

            // 保存SQL文件到下载目录
            String downloadPath = System.getProperty("user.home") + "/Downloads/" + fileName;
            saveSQLToFile(sqlContent, downloadPath);

            String encodedFileName = URLEncoder.encode(fileName, "UTF-8").replaceAll("\\+", "%20");
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", encodedFileName);
            
            return ResponseEntity.ok().headers(headers).body(sqlContent.getBytes(StandardCharsets.UTF_8));

        } catch (Exception e) {
            logger.error("处理预算年度模板失败", e);
            String errorMessage = "处理失败: " + e.getMessage();
            return ResponseEntity.status(500).body(errorMessage.getBytes(StandardCharsets.UTF_8));
        }
    }

    /**
     * 将SQL内容保存到文件
     * @param sqlContent SQL内容
     * @param filePath 保存路径
     */
    private void saveSQLToFile(String sqlContent, String filePath) {
        try {
            java.nio.file.Files.write(java.nio.file.Paths.get(filePath), sqlContent.getBytes(StandardCharsets.UTF_8));
            logger.debug("SQL文件已保存到: {}", filePath);
        } catch (IOException e) {
            logger.error("保存SQL文件失败", e);
        }
    }
    
    /**
     * 解析Excel文件，生成NjBudgetYearTemplateSQL对象列表
     * @param file Excel文件
     * @return NjBudgetYearTemplateSQL对象列表
     */
    private List<NjBudgetYearTemplateSQL> parseExcelToSqlList(MultipartFile file, String year) throws IOException {
        List<NjBudgetYearTemplateSQL> resultList = new ArrayList<>();
        
        try {
            // 直接设置POI安全参数，确保生效
            double ratio = Double.parseDouble(poiSecurityConfig.getMinInflateRatio());
            org.apache.poi.openxml4j.util.ZipSecureFile.setMinInflateRatio(ratio);
            
            // 验证文件类型
            String fileName = file.getOriginalFilename();
            if (!poiSecurityConfig.isAllowedFileType(fileName)) {
                logger.error("不支持的文件类型: {}，允许的类型: {}", fileName, poiSecurityConfig.getAllowedFileTypes());
                throw new IllegalArgumentException("只支持 " + poiSecurityConfig.getAllowedFileTypes() + " 格式的文件");
            }
            
            // 验证文件大小
            if (!poiSecurityConfig.isAllowedFileSize(file.getSize())) {
                logger.error("文件过大: {} bytes，最大允许: {} bytes", file.getSize(), poiSecurityConfig.getMaxFileSize());
                throw new IllegalArgumentException("文件大小不能超过 " + (poiSecurityConfig.getMaxFileSize() / 1024 / 1024) + "MB");
            }
            
            // 使用前端上传的Excel文件
            InputStream inputStream = file.getInputStream();
            Workbook workbook = new XSSFWorkbook(inputStream);
            Sheet sheet = workbook.getSheetAt(0);
            
            // 存储D列去重后的业务类型，使用LinkedHashSet保持插入顺序
            Set<String> businessTypes = new LinkedHashSet<>();
            // 存储每个业务类型在每个月份的数据
            Map<String, Map<Integer, Double>> businessTypeMonthData = new HashMap<>();
            // 存储酒店编码信息
            String hotelCode = "";
            
            // 遍历Excel数据，从第二行开始（第一行是表头）
            int lastRowNum = sheet.getLastRowNum();
            for (int rowIndex = 1; rowIndex <= lastRowNum; rowIndex++) {
                Row row = sheet.getRow(rowIndex);
                if (row != null) {
                    // 获取A列值（HotelCode）
                    Cell cellA = row.getCell(0); // A列索引为0
                    if (cellA != null) {
                        String currentHotelCode = getCellValueAsString(cellA);
                        if (currentHotelCode != null && !currentHotelCode.trim().isEmpty()) {
                            hotelCode = currentHotelCode;
                        }
                    }
                    
                    // 获取D列值（业务类型）
                    Cell cellD = row.getCell(3); // D列索引为3
                    if (cellD != null) {
                        String businessType = getCellValueAsString(cellD);
                        if (businessType != null && !businessType.trim().isEmpty()) {
                            businessTypes.add(businessType);
                            
                            // 获取E列值（月份）
                            Cell cellE = row.getCell(4); // E列索引为4
                            if (cellE != null) {
                                String monthStr = getCellValueAsString(cellE);
                                int month = parseMonth(monthStr);
                                
                                // 获取F列值（数值）
                                Cell cellF = row.getCell(5); // F列索引为5
                                if (cellF != null) {
                                    Double value = getCellValueAsDouble(cellF);
                                    if (value != null && month >= 1 && month <= 12) {
                                        // 累加同一业务类型同一月份的数据
                                        businessTypeMonthData.computeIfAbsent(businessType, k -> new HashMap<>());
                                        businessTypeMonthData.get(businessType).merge(month, value, Double::sum);
                                    }
                                }
                            }
                        }
                    }
                }
            }
            
            // 组装结果对象
            LocalDateTime currentTime = LocalDateTime.now();
            String currentTimeStr = currentTime.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
            for (String businessType : businessTypes) {
                NjBudgetYearTemplateSQL sqlObj = new NjBudgetYearTemplateSQL();
                sqlObj.setHotelCode(hotelCode); // 从Excel中获取的酒店编码
                sqlObj.setBusinessDate(year); // 从Excel中获取或使用默认值
                sqlObj.setBusinessType(businessType);
                sqlObj.setBusinessName(businessType);
                sqlObj.setUpdateTime(currentTimeStr);
                
                // 设置月度数据
                Map<Integer, Double> monthData = businessTypeMonthData.get(businessType);
                if (monthData != null) {
                    sqlObj.setMonth1(monthData.getOrDefault(1, 0.0));
                    sqlObj.setMonth2(monthData.getOrDefault(2, 0.0));
                    sqlObj.setMonth3(monthData.getOrDefault(3, 0.0));
                    sqlObj.setMonth4(monthData.getOrDefault(4, 0.0));
                    sqlObj.setMonth5(monthData.getOrDefault(5, 0.0));
                    sqlObj.setMonth6(monthData.getOrDefault(6, 0.0));
                    sqlObj.setMonth7(monthData.getOrDefault(7, 0.0));
                    sqlObj.setMonth8(monthData.getOrDefault(8, 0.0));
                    sqlObj.setMonth9(monthData.getOrDefault(9, 0.0));
                    sqlObj.setMonth10(monthData.getOrDefault(10, 0.0));
                    sqlObj.setMonth11(monthData.getOrDefault(11, 0.0));
                    sqlObj.setMonth12(monthData.getOrDefault(12, 0.0));
                }
                
                resultList.add(sqlObj);
            }
            
            // 计算并添加"其他收入"对象
            NjBudgetYearTemplateSQL otherIncomeObj = calculateOtherIncome(resultList, currentTimeStr, hotelCode, year);
            if (otherIncomeObj != null) {
                resultList.add(otherIncomeObj);
            }
            
            // 计算并添加"客房利润率"对象
            NjBudgetYearTemplateSQL guestProfitRateObj = calculateGuestProfitRate(resultList, currentTimeStr, hotelCode, year);
            if (guestProfitRateObj != null) {
                resultList.add(guestProfitRateObj);
            }
            
            // 计算并添加"餐饮利润率"对象
            NjBudgetYearTemplateSQL diningProfitRateObj = calculateDiningProfitRate(resultList, currentTimeStr, hotelCode, year);
            if (diningProfitRateObj != null) {
                resultList.add(diningProfitRateObj);
            }
            
            // 添加"宴会收入"对象
            NjBudgetYearTemplateSQL banquetIncomeObj = createEmptyBusinessObject("宴会收入", currentTimeStr, hotelCode, year);
            resultList.add(banquetIncomeObj);
            
            // 添加"餐厅收入"对象
            NjBudgetYearTemplateSQL restaurantIncomeObj = createEmptyBusinessObject("餐厅收入", currentTimeStr, hotelCode, year);
            resultList.add(restaurantIncomeObj);

            // 按getBudgetYearIndicators中的顺序对resultList进行排序
            resultList.sort((obj1, obj2) -> {
                List<String> indicators = getBudgetYearIndicators();
                int index1 = indicators.indexOf(obj1.getBusinessType());
                int index2 = indicators.indexOf(obj2.getBusinessType());
                
                // 如果某个业务类型不在指标列表中，将其排在最后
                if (index1 == -1) index1 = Integer.MAX_VALUE;
                if (index2 == -1) index2 = Integer.MAX_VALUE;
                
                return Integer.compare(index1, index2);
            });
            
            workbook.close();
            inputStream.close();
            
        } catch (Exception e) {
            logger.error("处理Excel数据失败", e);
        }
        
        return resultList;
    }
    
    /**
     * 获取单元格的字符串值
     */
    private String getCellValueAsString(Cell cell) {
        if (cell == null) return null;
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue();
            case NUMERIC:
                return String.valueOf(cell.getNumericCellValue());
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            default:
                return null;
        }
    }
    
    /**
     * 获取单元格的数值
     */
    private Double getCellValueAsDouble(Cell cell) {
        if (cell == null) return null;
        switch (cell.getCellType()) {
            case NUMERIC:
                return cell.getNumericCellValue();
            case STRING:
                try {
                    return Double.parseDouble(cell.getStringCellValue());
                } catch (NumberFormatException e) {
                    return null;
                }
            default:
                return null;
        }
    }
    
    /**
     * 解析月份字符串为数字
     */
    private int parseMonth(String monthStr) {
        if (monthStr == null) return 0;
        monthStr = monthStr.trim();
        switch (monthStr) {
            case "一月": return 1;
            case "二月": return 2;
            case "三月": return 3;
            case "四月": return 4;
            case "五月": return 5;
            case "六月": return 6;
            case "七月": return 7;
            case "八月": return 8;
            case "九月": return 9;
            case "十月": return 10;
            case "十一月": return 11;
            case "十二月": return 12;
            default: return 0;
        }
    }

    /**
     * 计算"其他收入"并组装NjBudgetYearTemplateSQL对象
     * @param resultList 已组装好的业务类型数据列表
     * @param currentTime 当前时间
     * @param hotelCode 酒店编码
     * @return 其他收入对象
     */
    private NjBudgetYearTemplateSQL calculateOtherIncome(
        List<NjBudgetYearTemplateSQL> resultList, 
        String currentTime,
        String hotelCode,
        String year
    ) {
        // 存储各业务类型按月份的数据
        Map<String, Map<Integer, Double>> businessTypeMonthData = new HashMap<>();
        
        // 从resultList中提取各业务类型的月度数据
        for (NjBudgetYearTemplateSQL sqlObj : resultList) {
            String businessType = sqlObj.getBusinessType();
            if ("总收入".equals(businessType) || "客房收入".equals(businessType) || 
                "餐饮收入".equals(businessType) || "物业收入".equals(businessType) || 
                "租金收入".equals(businessType) || "物业收入（公寓）".equals(businessType) || 
                "物业收入（写字楼）".equals(businessType)) {
                
                Map<Integer, Double> monthData = new HashMap<>();
                monthData.put(1, sqlObj.getMonth1() != null ? sqlObj.getMonth1() : 0.0);
                monthData.put(2, sqlObj.getMonth2() != null ? sqlObj.getMonth2() : 0.0);
                monthData.put(3, sqlObj.getMonth3() != null ? sqlObj.getMonth3() : 0.0);
                monthData.put(4, sqlObj.getMonth4() != null ? sqlObj.getMonth4() : 0.0);
                monthData.put(5, sqlObj.getMonth5() != null ? sqlObj.getMonth5() : 0.0);
                monthData.put(6, sqlObj.getMonth6() != null ? sqlObj.getMonth6() : 0.0);
                monthData.put(7, sqlObj.getMonth7() != null ? sqlObj.getMonth7() : 0.0);
                monthData.put(8, sqlObj.getMonth8() != null ? sqlObj.getMonth8() : 0.0);
                monthData.put(9, sqlObj.getMonth9() != null ? sqlObj.getMonth9() : 0.0);
                monthData.put(10, sqlObj.getMonth10() != null ? sqlObj.getMonth10() : 0.0);
                monthData.put(11, sqlObj.getMonth11() != null ? sqlObj.getMonth11() : 0.0);
                monthData.put(12, sqlObj.getMonth12() != null ? sqlObj.getMonth12() : 0.0);
                
                businessTypeMonthData.put(businessType, monthData);
            }
        }
        
        // 按月份计算其他收入
        Map<Integer, Double> otherIncomeMonthData = new HashMap<>();
        for (int month = 1; month <= 12; month++) {
            double totalIncome = businessTypeMonthData.getOrDefault("总收入", new HashMap<>()).getOrDefault(month, 0.0);
            double guestIncome = businessTypeMonthData.getOrDefault("客房收入", new HashMap<>()).getOrDefault(month, 0.0);
            double diningIncome = businessTypeMonthData.getOrDefault("餐饮收入", new HashMap<>()).getOrDefault(month, 0.0);
            double propertyIncome = businessTypeMonthData.getOrDefault("物业收入", new HashMap<>()).getOrDefault(month, 0.0);
            double apartmentIncome = businessTypeMonthData.getOrDefault("物业收入（公寓）", new HashMap<>()).getOrDefault(month, 0.0);
            double officeIncome = businessTypeMonthData.getOrDefault("物业收入（写字楼）", new HashMap<>()).getOrDefault(month, 0.0);
            double rentIncome = businessTypeMonthData.getOrDefault("租金收入", new HashMap<>()).getOrDefault(month, 0.0);
            
            double otherIncome = totalIncome - guestIncome - diningIncome - propertyIncome - apartmentIncome - officeIncome - rentIncome;
            otherIncomeMonthData.put(month, otherIncome);
        }
        
        // 组装其他收入对象
        NjBudgetYearTemplateSQL otherIncomeObj = new NjBudgetYearTemplateSQL();
        otherIncomeObj.setHotelCode(hotelCode);
        otherIncomeObj.setBusinessDate(year);
        otherIncomeObj.setBusinessType("其他收入");
        otherIncomeObj.setBusinessName("其他收入");
        otherIncomeObj.setUpdateTime(currentTime);
        
        // 设置月度数据
        otherIncomeObj.setMonth1(otherIncomeMonthData.get(1));
        otherIncomeObj.setMonth2(otherIncomeMonthData.get(2));
        otherIncomeObj.setMonth3(otherIncomeMonthData.get(3));
        otherIncomeObj.setMonth4(otherIncomeMonthData.get(4));
        otherIncomeObj.setMonth5(otherIncomeMonthData.get(5));
        otherIncomeObj.setMonth6(otherIncomeMonthData.get(6));
        otherIncomeObj.setMonth7(otherIncomeMonthData.get(7));
        otherIncomeObj.setMonth8(otherIncomeMonthData.get(8));
        otherIncomeObj.setMonth9(otherIncomeMonthData.get(9));
        otherIncomeObj.setMonth10(otherIncomeMonthData.get(10));
        otherIncomeObj.setMonth11(otherIncomeMonthData.get(11));
        otherIncomeObj.setMonth12(otherIncomeMonthData.get(12));
        
        return otherIncomeObj;
    }

    /**
     * 计算"客房利润率"并组装NjBudgetYearTemplateSQL对象
     * @param resultList 已组装好的业务类型数据列表
     * @param currentTime 当前时间
     * @param hotelCode 酒店编码
     * @return 客房利润率对象
     */
    private NjBudgetYearTemplateSQL calculateGuestProfitRate(
        List<NjBudgetYearTemplateSQL> resultList, 
        String currentTime,
        String hotelCode,
        String year
    ) {
        // 存储各业务类型按月份的数据
        Map<String, Map<Integer, Double>> businessTypeMonthData = new HashMap<>();
        
        // 从resultList中提取各业务类型的月度数据
        for (NjBudgetYearTemplateSQL sqlObj : resultList) {
            String businessType = sqlObj.getBusinessType();
            if ("客房收入".equals(businessType) || "客房利润".equals(businessType)) {
                
                Map<Integer, Double> monthData = new HashMap<>();
                monthData.put(1, sqlObj.getMonth1() != null ? sqlObj.getMonth1() : 0.0);
                monthData.put(2, sqlObj.getMonth2() != null ? sqlObj.getMonth2() : 0.0);
                monthData.put(3, sqlObj.getMonth3() != null ? sqlObj.getMonth3() : 0.0);
                monthData.put(4, sqlObj.getMonth4() != null ? sqlObj.getMonth4() : 0.0);
                monthData.put(5, sqlObj.getMonth5() != null ? sqlObj.getMonth5() : 0.0);
                monthData.put(6, sqlObj.getMonth6() != null ? sqlObj.getMonth6() : 0.0);
                monthData.put(7, sqlObj.getMonth7() != null ? sqlObj.getMonth7() : 0.0);
                monthData.put(8, sqlObj.getMonth8() != null ? sqlObj.getMonth8() : 0.0);
                monthData.put(9, sqlObj.getMonth9() != null ? sqlObj.getMonth9() : 0.0);
                monthData.put(10, sqlObj.getMonth10() != null ? sqlObj.getMonth10() : 0.0);
                monthData.put(11, sqlObj.getMonth11() != null ? sqlObj.getMonth11() : 0.0);
                monthData.put(12, sqlObj.getMonth12() != null ? sqlObj.getMonth12() : 0.0);
                
                businessTypeMonthData.put(businessType, monthData);
            }
        }
        
        // 按月份计算客房利润率
        Map<Integer, Double> guestProfitRateMonthData = new HashMap<>();
        for (int month = 1; month <= 12; month++) {
            double guestIncome = businessTypeMonthData.getOrDefault("客房收入", new HashMap<>()).getOrDefault(month, 0.0);
            double guestProfit = businessTypeMonthData.getOrDefault("客房利润", new HashMap<>()).getOrDefault(month, 0.0);
            
            double guestProfitRate = guestIncome > 0 ? guestProfit / guestIncome * 100 : 0.0;
            guestProfitRateMonthData.put(month, guestProfitRate);
        }
        
        // 组装客房利润率对象
        NjBudgetYearTemplateSQL guestProfitRateObj = new NjBudgetYearTemplateSQL();
        guestProfitRateObj.setHotelCode(hotelCode);
        guestProfitRateObj.setBusinessDate(year);
        guestProfitRateObj.setBusinessType("客房利润率");
        guestProfitRateObj.setBusinessName("客房利润率");
        guestProfitRateObj.setUpdateTime(currentTime);
        
        // 设置月度数据
        guestProfitRateObj.setMonth1(guestProfitRateMonthData.get(1));
        guestProfitRateObj.setMonth2(guestProfitRateMonthData.get(2));
        guestProfitRateObj.setMonth3(guestProfitRateMonthData.get(3));
        guestProfitRateObj.setMonth4(guestProfitRateMonthData.get(4));
        guestProfitRateObj.setMonth5(guestProfitRateMonthData.get(5));
        guestProfitRateObj.setMonth6(guestProfitRateMonthData.get(6));
        guestProfitRateObj.setMonth7(guestProfitRateMonthData.get(7));
        guestProfitRateObj.setMonth8(guestProfitRateMonthData.get(8));
        guestProfitRateObj.setMonth9(guestProfitRateMonthData.get(9));
        guestProfitRateObj.setMonth10(guestProfitRateMonthData.get(10));
        guestProfitRateObj.setMonth11(guestProfitRateMonthData.get(11));
        guestProfitRateObj.setMonth12(guestProfitRateMonthData.get(12));
        
        return guestProfitRateObj;
    }

    /**
     * 计算"餐饮利润率"并组装NjBudgetYearTemplateSQL对象
     * @param resultList 已组装好的业务类型数据列表
     * @param currentTime 当前时间
     * @param hotelCode 酒店编码
     * @return 餐饮利润率对象
     */
    private NjBudgetYearTemplateSQL calculateDiningProfitRate(
        List<NjBudgetYearTemplateSQL> resultList, 
        String currentTime,
        String hotelCode,
        String year
    ) {
        // 存储各业务类型按月份的数据
        Map<String, Map<Integer, Double>> businessTypeMonthData = new HashMap<>();
        
        // 从resultList中提取各业务类型的月度数据
        for (NjBudgetYearTemplateSQL sqlObj : resultList) {
            String businessType = sqlObj.getBusinessType();
            if ("餐饮收入".equals(businessType) || "餐饮利润".equals(businessType)) {
                
                Map<Integer, Double> monthData = new HashMap<>();
                monthData.put(1, sqlObj.getMonth1() != null ? sqlObj.getMonth1() : 0.0);
                monthData.put(2, sqlObj.getMonth2() != null ? sqlObj.getMonth2() : 0.0);
                monthData.put(3, sqlObj.getMonth3() != null ? sqlObj.getMonth3() : 0.0);
                monthData.put(4, sqlObj.getMonth4() != null ? sqlObj.getMonth4() : 0.0);
                monthData.put(5, sqlObj.getMonth5() != null ? sqlObj.getMonth5() : 0.0);
                monthData.put(6, sqlObj.getMonth6() != null ? sqlObj.getMonth6() : 0.0);
                monthData.put(7, sqlObj.getMonth7() != null ? sqlObj.getMonth7() : 0.0);
                monthData.put(8, sqlObj.getMonth8() != null ? sqlObj.getMonth8() : 0.0);
                monthData.put(9, sqlObj.getMonth9() != null ? sqlObj.getMonth9() : 0.0);
                monthData.put(10, sqlObj.getMonth10() != null ? sqlObj.getMonth10() : 0.0);
                monthData.put(11, sqlObj.getMonth11() != null ? sqlObj.getMonth11() : 0.0);
                monthData.put(12, sqlObj.getMonth12() != null ? sqlObj.getMonth12() : 0.0);
                
                businessTypeMonthData.put(businessType, monthData);
            }
        }
        
        // 按月份计算餐饮利润率
        Map<Integer, Double> diningProfitRateMonthData = new HashMap<>();
        for (int month = 1; month <= 12; month++) {
            double diningIncome = businessTypeMonthData.getOrDefault("餐饮收入", new HashMap<>()).getOrDefault(month, 0.0);
            double diningProfit = businessTypeMonthData.getOrDefault("餐饮利润", new HashMap<>()).getOrDefault(month, 0.0);
            
            double diningProfitRate = diningIncome > 0 ? diningProfit / diningIncome * 100 : 0.0;
            diningProfitRateMonthData.put(month, diningProfitRate);
        }
        
        // 组装餐饮利润率对象
        NjBudgetYearTemplateSQL diningProfitRateObj = new NjBudgetYearTemplateSQL();
        diningProfitRateObj.setHotelCode(hotelCode);
        diningProfitRateObj.setBusinessDate(year);
        diningProfitRateObj.setBusinessType("餐饮利润率");
        diningProfitRateObj.setBusinessName("餐饮利润率");
        diningProfitRateObj.setUpdateTime(currentTime);
        
        // 设置月度数据
        diningProfitRateObj.setMonth1(diningProfitRateMonthData.get(1));
        diningProfitRateObj.setMonth2(diningProfitRateMonthData.get(2));
        diningProfitRateObj.setMonth3(diningProfitRateMonthData.get(3));
        diningProfitRateObj.setMonth4(diningProfitRateMonthData.get(4));
        diningProfitRateObj.setMonth5(diningProfitRateMonthData.get(5));
        diningProfitRateObj.setMonth6(diningProfitRateMonthData.get(6));
        diningProfitRateObj.setMonth7(diningProfitRateMonthData.get(7));
        diningProfitRateObj.setMonth8(diningProfitRateMonthData.get(8));
        diningProfitRateObj.setMonth9(diningProfitRateMonthData.get(9));
        diningProfitRateObj.setMonth10(diningProfitRateMonthData.get(10));
        diningProfitRateObj.setMonth11(diningProfitRateMonthData.get(11));
        diningProfitRateObj.setMonth12(diningProfitRateMonthData.get(12));
        
        return diningProfitRateObj;
    }

    /**
     * 创建数值为空的业务对象
     * @param businessType 业务类型名称
     * @param currentTime 当前时间
     * @param hotelCode 酒店编码
     * @return 业务对象
     */
    private NjBudgetYearTemplateSQL createEmptyBusinessObject(
            String businessType, 
            String currentTime,
            String hotelCode,
            String year
    ) {
        NjBudgetYearTemplateSQL obj = new NjBudgetYearTemplateSQL();
        obj.setHotelCode(hotelCode);
        obj.setBusinessDate(year);
        obj.setBusinessType(businessType);
        obj.setBusinessName(businessType);
        obj.setUpdateTime(currentTime);
        
        // 设置月度数据为空
        obj.setMonth1(0.0);
        obj.setMonth2(0.0);
        obj.setMonth3(0.0);
        obj.setMonth4(0.0);
        obj.setMonth5(0.0);
        obj.setMonth6(0.0);
        obj.setMonth7(0.0);
        obj.setMonth8(0.0);
        obj.setMonth9(0.0);
        obj.setMonth10(0.0);
        obj.setMonth11(0.0);
        obj.setMonth12(0.0);
        
        return obj;
    }

    /**
     * 将对象列表转换为批量插入SQL语句
     */
    private String buildBatchInsertSQL(List<NjBudgetYearTemplateSQL> list) {
        StringBuilder sb = new StringBuilder();
        sb.append("INSERT INTO [Report].[dbo].StarBudgetFilling (HotelCode, BusinessDate, BusinessType, BusinessName, Month1, Month2, Month3, Month4, Month5, Month6, Month7, Month8, Month9, Month10, Month11, Month12, UpdateTime) VALUES\n");
        
        for (int i = 0; i < list.size(); i++) {
            NjBudgetYearTemplateSQL o = list.get(i);
            sb.append("('")
                .append(escape(o.getHotelCode())).append("', '")
                .append(escape(o.getBusinessDate())).append("', '")
                .append(escape(o.getBusinessType())).append("', '")
                .append(escape(o.getBusinessName())).append("', '")
                .append(formatDoubleForSQL(o.getMonth1())).append("', '")
                .append(formatDoubleForSQL(o.getMonth2())).append("', '")
                .append(formatDoubleForSQL(o.getMonth3())).append("', '")
                .append(formatDoubleForSQL(o.getMonth4())).append("', '")
                .append(formatDoubleForSQL(o.getMonth5())).append("', '")
                .append(formatDoubleForSQL(o.getMonth6())).append("', '")
                .append(formatDoubleForSQL(o.getMonth7())).append("', '")
                .append(formatDoubleForSQL(o.getMonth8())).append("', '")
                .append(formatDoubleForSQL(o.getMonth9())).append("', '")
                .append(formatDoubleForSQL(o.getMonth10())).append("', '")
                .append(formatDoubleForSQL(o.getMonth11())).append("', '")
                .append(formatDoubleForSQL(o.getMonth12())).append("', '")
                .append(escape(o.getUpdateTime())).append("')");
            
            if (i != list.size() - 1) {
                sb.append(",\n");
            }
        }
        sb.append(";");
        return sb.toString();
    }

    /**
     * SQL转义
     */
    private String escape(String s) {
        if (s == null) return "";
        return s.replace("'", "''");
    }

    /**
     * 格式化Double值为SQL字符串，避免科学计数法
     * @param value Double值
     * @return 格式化后的字符串
     */
    private String formatDoubleForSQL(Double value) {
        if (value == null) {
            return "0";
        }
        
        // 使用BigDecimal避免科学计数法
        java.math.BigDecimal bd = new java.math.BigDecimal(value.toString());
        
        // 如果是整数，返回整数格式
        if (bd.scale() <= 0) {
            return bd.toPlainString();
        }
        
        // 如果是小数，保留最多2位小数
        return bd.setScale(2, java.math.RoundingMode.HALF_UP).toPlainString();
    }

    /**
     * 获取预算年度模板的指标列表
     * @return 按顺序排列的指标字符串列表
     */
    public List<String> getBudgetYearIndicators() {
        return Arrays.asList(
            "总收入",
            "客房收入",
            "餐饮收入",
            "宴会收入",
            "餐厅收入",
            "物业收入",
            "物业收入（公寓）",
            "物业收入（写字楼）",
            "租金收入",
            "其他收入",
            "GOP",
            "GOP率",
            "可出租房间数",
            "实际出租间夜数",
            "出租率",
            "平均房价",
            "每间收益",
            "客房利润",
            "客房利润率",
            "餐饮利润",
            "餐饮利润率",
            "餐饮成本率",
            "未分配费用",
            "EBITDA",
            "人工成本",
            "工资总额",
            "劳务费",
            "能源费用",
            "维修费",
            "销售佣金",
            "物料消耗",
            "经营性净现金流",
            "利润总额",
            "员工人数（人）"
        );
    }
}
