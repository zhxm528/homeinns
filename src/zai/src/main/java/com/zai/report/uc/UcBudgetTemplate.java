package com.zai.report.uc;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/api/uc/budget")
public class UcBudgetTemplate {
    
    private static final Logger logger = LoggerFactory.getLogger(UcBudgetTemplate.class);
    
    @Autowired
    private com.zai.hotel.service.HotelService hotelService;
    
    /**
     * 下载UC预算模板Excel文件
     * @param hotelId 酒店ID
     * @return Excel文件响应
     */
    @GetMapping("/download-template")
    public ResponseEntity<byte[]> downloadTemplate(@RequestParam String hotelId) {
        logger.debug("开始下载UC预算模板 - hotelId: {}", hotelId);
        
        try {
            // 读取模板文件
            ClassPathResource resource = new ClassPathResource("static/download/template/UcBudgetTemplate.xlsx");
            InputStream inputStream = resource.getInputStream();
            
            // 创建工作簿
            Workbook workbook = new XSSFWorkbook(inputStream);
            
            // TODO: 根据hotelId处理Excel内容
            // 可以在这里添加根据hotelId填充数据的逻辑
            
            // 将工作簿写入字节数组
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);
            workbook.close();
            inputStream.close();
            
            // 准备响应头
            String filename = URLEncoder.encode("UC预算模板_" + hotelId + ".xlsx", StandardCharsets.UTF_8.toString());
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", filename);
            
            logger.debug("UC预算模板下载成功 - hotelId: {}, 文件大小: {} bytes", hotelId, outputStream.size());
            
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(outputStream.toByteArray());
                    
        } catch (IOException e) {
            logger.error("下载UC预算模板失败 - hotelId: {}, 错误信息: {}", hotelId, e.getMessage(), e);
            return ResponseEntity.status(500).build();
        }
    }
    
    /**
     * 下载修改后的UC预算模板Excel文件
     * @param hotelId 酒店ID
     * @return 修改后的Excel文件响应
     */
    @GetMapping("/download-modified-template")
    public ResponseEntity<byte[]> downloadModifiedTemplate(
        @RequestParam String hotelId,
        @RequestParam String year) {
        logger.debug("开始下载修改后的UC预算模板 - hotelId: {}", hotelId);
        
        try {
            // 读取模板文件
            ClassPathResource resource = new ClassPathResource("static/download/template/UcBudgetTemplate.xlsx");
            InputStream inputStream = resource.getInputStream();
            
            // 创建工作簿
            Workbook workbook = new XSSFWorkbook(inputStream);
            
            // 解析并修改Excel内容
            modifyExcelContent(workbook, hotelId, year);
            
            // 将修改后的工作簿写入字节数组
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);
            workbook.close();
            inputStream.close();
            
            // 准备响应头
            String filename = URLEncoder.encode("UC预算模板_修改版_" + hotelId + ".xlsx", StandardCharsets.UTF_8.toString());
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", filename);
            
            logger.debug("修改后的UC预算模板下载成功 - hotelId: {}, 文件大小: {} bytes", hotelId, outputStream.size());
            
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(outputStream.toByteArray());
                    
        } catch (IOException e) {
            logger.error("下载修改后的UC预算模板失败 - hotelId: {}, 错误信息: {}", hotelId, e.getMessage(), e);
            return ResponseEntity.status(500).build();
        }
    }
    
    /**
     * 修改Excel内容
     * @param workbook 工作簿
     * @param hotelId 酒店ID
     */
    private void modifyExcelContent(Workbook workbook, String hotelId, String year) {
        logger.debug("开始修改Excel内容 - hotelId: {}", hotelId);
        
        // 通过hotelId查询酒店信息
        com.zai.hotel.entity.Hotel hotel = hotelService.selectByHotelId(hotelId);
        if (hotel == null) {
            logger.warn("未找到酒店信息 - hotelId: {}", hotelId);
            return;
        }
        
        // 识别酒店管理类型
        HotelManagementType managementType = identifyHotelManagementType(hotel);
        logger.debug("酒店管理类型识别结果: {} - hotelId: {}", managementType.getDisplayName(), hotelId);
        
        logger.debug("查询到酒店信息 - hotelId: {}, hotelCode: {}, hotelName: {}, managementModel: {}", 
                   hotelId, hotel.getHotelCode(), hotel.getHotelName(), hotel.getManagementModel());
        
        // 获取第一个工作表
        Sheet sheet = workbook.getSheetAt(0);
        
        // 设置工作表保护 密码为酒店的代码
        sheet.protectSheet(year+"AOP");
        
        // 设置工作簿保护，防止添加新sheet
        workbook.setSheetHidden(0, false); // 确保第一个sheet可见
        
        // 检查并隐藏其他sheet（如果存在）
        int numberOfSheets = workbook.getNumberOfSheets();
        for (int i = 1; i < numberOfSheets; i++) {
            workbook.setSheetHidden(i, true);
        }
        
        // 创建单元格样式
        CellStyle headerStyle = workbook.createCellStyle();
        Font headerFont = workbook.createFont();
        headerFont.setBold(true);
        headerStyle.setFont(headerFont);
        
        // 获取工作表的行数
        int lastRowNum = sheet.getLastRowNum();
        logger.debug("工作表共有{}行数据", lastRowNum + 1);
        
        // 锁定指定行的单元格
        lockSpecificRows(sheet);
        
        // 锁定指定列的单元格
        lockSpecificColumns(sheet);
        
        
        
        // 解锁指定的行和列
        unlockSpecificCells(sheet);

        

        // 如果是加盟酒店，锁定特定的行
        if (managementType == HotelManagementType.FRANCHISE) {
            logger.debug("检测到加盟酒店，执行特定行锁定 - hotelId: {}", hotelId);
            lockFranchiseRows(sheet);
        }
        
        // 设置第一、二、三列的内容
        setFirstThreeColumns(sheet, hotel, managementType);
        
        // 设置第2行的月份天数
        setMonthDaysInRow2(sheet, year);
        
        // 设置第5行的百分比格式
        setPercentageFormatForRow5(sheet);
    }
    
    /**
     * 锁定指定行的单元格
     * @param sheet 工作表
     */
    private void lockSpecificRows(Sheet sheet) {
        logger.debug("开始锁定指定行的单元格");
        
        // 定义需要锁定的行号（从0开始，所以实际行号减1）
        int[] lockedRows = {
            0,    // 第1行
            1,    // 第2行
            5, 6, 7, 8, 9, 10, 11, 12,  // 第6-13行
            23, 24, 25,  // 第24-26行
            34,   // 第35行
            49,   // 第50行
            57,   // 第58行
            62,   // 第63行
            68,   // 第69行
            81,   // 第82行
            84,   // 第85行
            107,  // 第108行
            111,  // 第112行
            112,  // 第113行
            121   // 第122行
        };
        
        // 遍历需要锁定的行
        for (int rowIndex : lockedRows) {
            Row row = sheet.getRow(rowIndex);
            if (row != null) {
                logger.debug("锁定第{}行", rowIndex + 1);
                
                // 遍历该行的所有单元格
                for (int cellIndex = 0; cellIndex < row.getLastCellNum(); cellIndex++) {
                    Cell cell = row.getCell(cellIndex);
                    if (cell != null) {
                        // 创建锁定样式，保持原有的文字和背景
                        CellStyle lockedStyle = sheet.getWorkbook().createCellStyle();
                        lockedStyle.setLocked(true);
                        
                        // 复制原有样式
                        CellStyle originalStyle = cell.getCellStyle();
                        lockedStyle.cloneStyleFrom(originalStyle);
                        lockedStyle.setLocked(true);
                        
                        // 应用锁定样式
                        cell.setCellStyle(lockedStyle);
                    }
                }
            } else {
                logger.debug("第{}行不存在，跳过", rowIndex + 1);
            }
        }
        
        logger.debug("指定行单元格锁定完成");
    }
    
    /**
     * 锁定指定列的单元格
     * @param sheet 工作表
     */
    private void lockSpecificColumns(Sheet sheet) {
        logger.debug("开始锁定指定列的单元格");
        
        // 定义需要锁定的列号（从0开始，所以实际列号减1）
        int[] lockedColumns = {
            0,   // 第1列
            1,   // 第2列
            2,   // 第3列
            3,   // 第4列
            4,   // 第5列
            // 5,   // 第6列（F列）- 已移除，避免锁定第F列
            6,   // 第7列
            8,   // 第9列
            10,  // 第11列
            12,  // 第13列
            14,  // 第15列
            16,  // 第17列
            18,  // 第19列
            20,  // 第21列
            22,  // 第23列
            24,  // 第25列
            26,  // 第27列
            28,  // 第29列
            29,  // 第30列
            30,  // 第31列
            31,  // 第32列
            32,  // 第33列
            33,  // 第34列
            34,  // 第35列
            35   // 第36列
        };
        
        // 获取工作表的行数
        int lastRowNum = sheet.getLastRowNum();
        
        // 遍历需要锁定的列
        for (int columnIndex : lockedColumns) {
            logger.debug("锁定第{}列", columnIndex + 1);
            
            // 遍历该列的所有行
            for (int rowIndex = 0; rowIndex <= lastRowNum; rowIndex++) {
                Row row = sheet.getRow(rowIndex);
                if (row != null) {
                    Cell cell = row.getCell(columnIndex);
                    if (cell != null) {
                        // 创建锁定样式，保持原有的文字和背景
                        CellStyle lockedStyle = sheet.getWorkbook().createCellStyle();
                        lockedStyle.setLocked(true);
                        
                        // 复制原有样式
                        CellStyle originalStyle = cell.getCellStyle();
                        lockedStyle.cloneStyleFrom(originalStyle);
                        lockedStyle.setLocked(true);
                        
                        // 应用锁定样式
                        cell.setCellStyle(lockedStyle);
                    }
                }
            }
        }
        
        logger.debug("指定列单元格锁定完成");
    }
    
    /**
     * 锁定加盟酒店特定的行（第17-22行）
     * @param sheet 工作表
     */
    private void lockFranchiseRows(Sheet sheet) {
        logger.debug("开始锁定加盟酒店特定行（第17-22行）");
        
        // 定义需要锁定的行号（从0开始，所以实际行号减1）
        int[] franchiseLockedRows = {
            16, 17, 18, 19, 20, 21  // 第17-22行
        };
        
        // 遍历需要锁定的行
        for (int rowIndex : franchiseLockedRows) {
            Row row = sheet.getRow(rowIndex);
            if (row != null) {
                logger.debug("锁定加盟酒店特定行第{}行", rowIndex + 1);
                
                // 遍历该行的所有单元格
                for (int cellIndex = 0; cellIndex < row.getLastCellNum(); cellIndex++) {
                    Cell cell = row.getCell(cellIndex);
                    if (cell != null) {
                        // 创建锁定样式，保持原有的文字和背景
                        CellStyle lockedStyle = sheet.getWorkbook().createCellStyle();
                        lockedStyle.setLocked(true);
                        
                        // 复制原有样式
                        CellStyle originalStyle = cell.getCellStyle();
                        lockedStyle.cloneStyleFrom(originalStyle);
                        lockedStyle.setLocked(true);
                        
                        // 应用锁定样式
                        cell.setCellStyle(lockedStyle);
                    }
                }
            } else {
                logger.debug("第{}行不存在，跳过", rowIndex + 1);
            }
        }
        
        logger.debug("加盟酒店特定行锁定完成");
    }
    
    /**
     * 解锁指定的单元格
     * @param sheet 工作表
     */
    private void unlockSpecificCells(Sheet sheet) {
        logger.debug("开始解锁指定的单元格");
        
        // 定义需要解锁的列（F、H、J、L、N、P、R、T、V、X、Z、AB）
        int[] unlockColumns = {5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27};
        
        // 定义需要解锁的行范围
        int[][] unlockRowRanges = {
            {2, 2},   // 第3行
            {3, 3},   // 第4行
            {4, 4},   // 第5行
            {13, 22}, // 第14-23行
            {26, 33}, // 第27-34行
            {35, 48}, // 第36-49行
            {50, 56}, // 第51-57行
            {58, 61}, // 第59-62行
            {63, 67}, // 第64-68行
            {69, 80}, // 第70-81行
            {82, 83}, // 第83-84行
            {85, 106}, // 第86-107行
            {108, 110}, // 第109-111行
            {113, 120}  // 第114-121行
        };
        
        // 遍历需要解锁的行范围
        for (int[] rowRange : unlockRowRanges) {
            int startRow = rowRange[0];
            int endRow = rowRange[1];
            
            for (int rowIndex = startRow; rowIndex <= endRow; rowIndex++) {
                Row row = sheet.getRow(rowIndex);
                if (row != null) {
                    // 遍历需要解锁的列
                    for (int columnIndex : unlockColumns) {
                        Cell cell = row.getCell(columnIndex);
                        if (cell != null) {
                            // 创建解锁样式，保持原有的文字和背景
                            CellStyle unlockedStyle = sheet.getWorkbook().createCellStyle();
                            unlockedStyle.setLocked(false);
                            
                            // 复制原有样式
                            CellStyle originalStyle = cell.getCellStyle();
                            unlockedStyle.cloneStyleFrom(originalStyle);
                            unlockedStyle.setLocked(false);
                            
                            // 应用解锁样式
                            cell.setCellStyle(unlockedStyle);
                            
                            logger.debug("解锁单元格 - 行: {}, 列: {} ({}列)", 
                                       rowIndex + 1, columnIndex + 1, getColumnName(columnIndex));
                        }
                    }
                } else {
                    logger.debug("行不存在，跳过解锁 - 行: {}", rowIndex + 1);
                }
            }
        }
        
        logger.debug("指定单元格解锁完成");
    }
    
    /**
     * 根据列索引获取列名
     * @param columnIndex 列索引
     * @return 列名（如A, B, C, ..., Z, AA, AB等）
     */
    private String getColumnName(int columnIndex) {
        StringBuilder columnName = new StringBuilder();
        while (columnIndex >= 0) {
            columnName.insert(0, (char) ('A' + columnIndex % 26));
            columnIndex = columnIndex / 26 - 1;
        }
        return columnName.toString();
    }
    
    /**
     * 设置第一、二、三列的内容
     * @param sheet 工作表
     * @param hotel 酒店实体
     * @param managementType 酒店管理类型
     */
    private void setFirstThreeColumns(Sheet sheet, com.zai.hotel.entity.Hotel hotel, HotelManagementType managementType) {
        logger.debug("开始设置第一、二、三列内容 - hotelId: {}, hotelCode: {}, hotelName: {}", 
                   hotel.getHotelId(), hotel.getHotelCode(), hotel.getHotelName());
        
        try {
            // 获取工作表的行数
            int lastRowNum = sheet.getLastRowNum();
            logger.debug("工作表共有{}行数据", lastRowNum + 1);
            
            // 准备数据值
            String hotelCode = hotel.getHotelCode() != null ? hotel.getHotelCode() : "";
            String hotelName = hotel.getHotelName() != null ? hotel.getHotelName() : "";
            String managementTypeName = managementType.getDisplayName();
            
            // 遍历除了第一行的所有行（从第2行开始，索引为1）
            for (int rowIndex = 1; rowIndex <= lastRowNum; rowIndex++) {
                Row row = sheet.getRow(rowIndex);
                if (row == null) {
                    // 如果行不存在，创建新行
                    row = sheet.createRow(rowIndex);
                    logger.debug("创建新行 - 行号: {}", rowIndex + 1);
                }
                
                // 设置第一列数据：hotelCode
                Cell cell0 = row.getCell(0);
                if (cell0 == null) {
                    cell0 = row.createCell(0);
                }
                cell0.setCellValue(hotelCode);
                
                // 设置第二列数据：hotelName
                Cell cell1 = row.getCell(1);
                if (cell1 == null) {
                    cell1 = row.createCell(1);
                }
                cell1.setCellValue(hotelName);
                
                // 设置第三列数据：酒店管理类型
                Cell cell2 = row.getCell(2);
                if (cell2 == null) {
                    cell2 = row.createCell(2);
                }
                cell2.setCellValue(managementTypeName);
                
                logger.debug("设置第{}行前三列数据完成", rowIndex + 1);
            }
            
            // 设置A、B、C列宽度自适应
            adjustColumnWidth(sheet, 0, hotelCode);
            adjustColumnWidth(sheet, 1, hotelName);
            adjustColumnWidth(sheet, 2, managementTypeName);
            
            logger.debug("第一、二、三列内容设置完成 - 共处理{}行数据, hotelCode: {}, hotelName: {}, 管理类型: {}", 
                       lastRowNum, hotelCode, hotelName, managementTypeName);
            
        } catch (Exception e) {
            logger.error("设置第一、二、三列内容失败 - hotelId: {}, 错误信息: {}", 
                        hotel.getHotelId(), e.getMessage(), e);
        }
    }
    
    /**
     * 调整列宽度以适应文字长度
     * @param sheet 工作表
     * @param columnIndex 列索引
     * @param content 内容文字
     */
    private void adjustColumnWidth(Sheet sheet, int columnIndex, String content) {
        try {
            if (content == null || content.trim().isEmpty()) {
                logger.debug("内容为空，跳过列宽度调整 - 列: {} ({}列)", columnIndex + 1, getColumnName(columnIndex));
                return;
            }
            
            // 计算文字长度（中文字符按2个字符计算）
            int textLength = calculateTextLength(content);
            
            // 设置最小宽度和最大宽度
            int minWidth = 10;  // 最小宽度
            int maxWidth = 50;  // 最大宽度
            
            // 计算合适的列宽度
            int columnWidth = Math.max(minWidth, Math.min(maxWidth, textLength + 2));
            
            // 设置列宽度（Excel中1个字符宽度约为256个字符单位）
            sheet.setColumnWidth(columnIndex, columnWidth * 256);
            
            logger.debug("调整列宽度完成 - 列: {} ({}列), 内容长度: {}, 设置宽度: {}", 
                       columnIndex + 1, getColumnName(columnIndex), textLength, columnWidth);
            
        } catch (Exception e) {
            logger.error("调整列宽度失败 - 列: {} ({}列), 错误信息: {}", 
                        columnIndex + 1, getColumnName(columnIndex), e.getMessage(), e);
        }
    }
    
    /**
     * 计算文字长度（中文字符按2个字符计算）
     * @param text 文字内容
     * @return 计算后的长度
     */
    private int calculateTextLength(String text) {
        if (text == null) {
            return 0;
        }
        
        int length = 0;
        for (char c : text.toCharArray()) {
            // 判断是否为中文字符
            if (Character.UnicodeScript.of(c) == Character.UnicodeScript.HAN) {
                length += 2;  // 中文字符按2个字符计算
            } else {
                length += 1;  // 英文字符按1个字符计算
            }
        }
        return length;
    }
    
    /**
     * 设置第2行的月份天数
     * @param sheet 工作表
     * @param year 年份
     */
    private void setMonthDaysInRow2(Sheet sheet, String year) {
        logger.debug("开始设置第2行的月份天数 - 年份: {}", year);
        
        try {
            // 解析年份
            int yearInt = Integer.parseInt(year);
            
            // 获取第2行（索引为1）
            Row row2 = sheet.getRow(1);
            if (row2 == null) {
                row2 = sheet.createRow(1);
                logger.debug("创建第2行");
            }
            
            // 定义12个月对应的列索引（F、H、J、L、N、P、R、T、V、X、Z、AB）
            int[] monthColumns = {5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27};
            
            // 设置每个月的天数
            for (int month = 1; month <= 12; month++) {
                int columnIndex = monthColumns[month - 1];
                int daysInMonth = getDaysInMonth(yearInt, month);
                
                // 获取或创建单元格
                Cell cell = row2.getCell(columnIndex);
                if (cell == null) {
                    cell = row2.createCell(columnIndex);
                }
                
                // 设置天数为整数
                cell.setCellValue(daysInMonth);
                
                // 创建整数格式样式
                CellStyle integerStyle = sheet.getWorkbook().createCellStyle();
                DataFormat dataFormat = sheet.getWorkbook().createDataFormat();
                integerStyle.setDataFormat(dataFormat.getFormat("0")); // 设置为整数格式
                
                // 复制原有样式并应用整数格式
                CellStyle originalStyle = cell.getCellStyle();
                integerStyle.cloneStyleFrom(originalStyle);
                integerStyle.setDataFormat(dataFormat.getFormat("0"));
                
                // 应用整数样式
                cell.setCellStyle(integerStyle);
                
                logger.debug("设置第{}月天数: {} - 列: {} ({}列)", 
                           month, daysInMonth, columnIndex + 1, getColumnName(columnIndex));
            }
            
            logger.debug("第2行月份天数设置完成 - 年份: {}", year);
            
        } catch (NumberFormatException e) {
            logger.error("年份格式错误 - year: {}, 错误信息: {}", year, e.getMessage(), e);
        } catch (Exception e) {
            logger.error("设置第2行月份天数失败 - year: {}, 错误信息: {}", year, e.getMessage(), e);
        }
    }
    
    /**
     * 获取指定年月的天数
     * @param year 年份
     * @param month 月份（1-12）
     * @return 该月的天数
     */
    private int getDaysInMonth(int year, int month) {
        // 使用Calendar类计算每月的天数
        java.util.Calendar calendar = java.util.Calendar.getInstance();
        calendar.set(year, month - 1, 1); // 设置为该月第一天
        calendar.set(java.util.Calendar.DATE, calendar.getActualMaximum(java.util.Calendar.DATE)); // 设置为该月最后一天
        return calendar.get(java.util.Calendar.DATE);
    }
    
    /**
     * 识别酒店的管理类型
     * @param hotel 酒店实体
     * @return 管理类型枚举
     */
    private HotelManagementType identifyHotelManagementType(com.zai.hotel.entity.Hotel hotel) {
        logger.debug("开始识别酒店管理类型 - hotelId: {}, hotelName: {}", 
                   hotel.getHotelId(), hotel.getHotelName());
        
        String managementModel = hotel.getManagementModel();
        if (managementModel == null || managementModel.trim().isEmpty()) {
            logger.warn("酒店管理类型为空，使用默认类型 - hotelId: {}", hotel.getHotelId());
            return HotelManagementType.UNKNOWN;
        }
        
        // 转换为小写并去除空格，便于比较
        String normalizedModel = managementModel.toLowerCase().trim();
        
        logger.debug("原始管理类型: '{}', 标准化后: '{}'", managementModel, normalizedModel);
        
        // 根据管理类型进行识别
        if (normalizedModel.contains("直营") || normalizedModel.contains("direct")) {
            logger.debug("识别为直营酒店 - hotelId: {}", hotel.getHotelId());
            return HotelManagementType.DIRECT;
        } else if (normalizedModel.contains("加盟") || normalizedModel.contains("franchise")) {
            logger.debug("识别为加盟酒店 - hotelId: {}", hotel.getHotelId());
            return HotelManagementType.FRANCHISE;
        } else if (normalizedModel.contains("委托") || normalizedModel.contains("commission")) {
            logger.debug("识别为委托管理酒店 - hotelId: {}", hotel.getHotelId());
            return HotelManagementType.COMMISSION;
        } else if (normalizedModel.contains("特许") || normalizedModel.contains("license")) {
            logger.debug("识别为特许经营酒店 - hotelId: {}", hotel.getHotelId());
            return HotelManagementType.LICENSE;
        } else {
            logger.warn("无法识别的管理类型: '{}', 使用未知类型 - hotelId: {}", 
                       managementModel, hotel.getHotelId());
            return HotelManagementType.UNKNOWN;
        }
    }
    
    /**
     * 设置第5行的百分比格式
     * @param sheet 工作表
     */
    private void setPercentageFormatForRow5(Sheet sheet) {
        logger.debug("开始设置第5行的百分比格式");
        
        try {
            // 获取第5行（索引为4）
            Row row5 = sheet.getRow(4);
            if (row5 == null) {
                row5 = sheet.createRow(4);
                logger.debug("创建第5行");
            }
            
            // 定义需要设置百分比格式的列索引（F、H、J、L、N、P、R、T、V、X、Z、AB）
            int[] percentageColumns = {5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27};
            
            // 创建百分比格式样式
            CellStyle percentageStyle = sheet.getWorkbook().createCellStyle();
            DataFormat dataFormat = sheet.getWorkbook().createDataFormat();
            percentageStyle.setDataFormat(dataFormat.getFormat("0.00%")); // 设置为百分比格式，保留两位小数
            
            // 设置每个指定列的百分比格式
            for (int columnIndex : percentageColumns) {
                Cell cell = row5.getCell(columnIndex);
                if (cell == null) {
                    cell = row5.createCell(columnIndex);
                    logger.debug("创建第5行第{}列单元格", columnIndex + 1);
                }
                
                // 复制原有样式并应用百分比格式
                CellStyle originalStyle = cell.getCellStyle();
                percentageStyle.cloneStyleFrom(originalStyle);
                percentageStyle.setDataFormat(dataFormat.getFormat("0.00%"));
                
                // 应用百分比样式
                cell.setCellStyle(percentageStyle);
                
                logger.debug("设置第5行第{}列 ({}列) 为百分比格式", 
                           columnIndex + 1, getColumnName(columnIndex));
            }
            
            logger.debug("第5行百分比格式设置完成");
            
        } catch (Exception e) {
            logger.error("设置第5行百分比格式失败 - 错误信息: {}", e.getMessage(), e);
        }
    }
    
    /**
     * 酒店管理类型枚举
     */
    public enum HotelManagementType {
        DIRECT("直营"),
        FRANCHISE("加盟"),
        COMMISSION("委托管理"),
        LICENSE("特许经营"),
        UNKNOWN("未知");
        
        private final String displayName;
        
        HotelManagementType(String displayName) {
            this.displayName = displayName;
        }
        
        public String getDisplayName() {
            return displayName;
        }
        
        @Override
        public String toString() {
            return displayName;
        }
    }
}
