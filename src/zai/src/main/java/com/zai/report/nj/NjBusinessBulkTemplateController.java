package com.zai.report.nj;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.core.io.ClassPathResource;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@RestController
@RequestMapping("/api/nj/bulk")
public class NjBusinessBulkTemplateController {
    private static final Logger logger = LoggerFactory.getLogger(NjBusinessBulkTemplateController.class);
    private static final ObjectMapper objectMapper = new ObjectMapper();

    

    /**
     * 接收前端api调用，处理经营模板数据
     * @param hotelCode 酒店编码
     * @param hotelName 酒店名称
     * @param file 前端上传的Excel文件
     * @return 处理结果
     */
    @PostMapping("/makesql")
    public ResponseEntity<byte[]> processBusinessTemplate(
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
            
            // 解析Excel文件，生成NjBusinessTemplateSQL对象列表
            List<NjBusinessTemplateSQL> sqlList = parseExcelToSqlList(file);
            
            // 打印解析结果
            logger.debug("解析Excel成功，共生成 {} 条数据", sqlList.size());
            
            // 转换为批量插入SQL语句
            String sqlContent = buildBatchInsertSQL(sqlList);
            
           

            // 生成文件名（使用上传的文件名，但扩展名改为.sql）
            String originalFileName = file.getOriginalFilename();
            String fileName = originalFileName != null ? 
                originalFileName.substring(0, originalFileName.lastIndexOf('.')) + ".sql" :
                "全量经营日报.sql";

            

            // 保存SQL文件到下载目录
            String downloadPath = System.getProperty("user.home") + "/Downloads/" + fileName;
            saveSQLToFile(sqlContent, downloadPath);

            String encodedFileName = URLEncoder.encode(fileName, "UTF-8").replaceAll("\\+", "%20");
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", encodedFileName);
            
            return ResponseEntity.ok().headers(headers).body(sqlContent.getBytes(StandardCharsets.UTF_8));

        } catch (Exception e) {
            logger.error("处理经营模板失败", e);
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
     * 解析Excel文件，生成NjBusinessTemplateSQL对象列表
     * @param file Excel文件
     * @param hotelCode 酒店编码
     * @return NjBusinessTemplateSQL对象列表
     */
    private List<NjBusinessTemplateSQL> parseExcelToSqlList(MultipartFile file) throws IOException {
        List<NjBusinessTemplateSQL> sqlList = new ArrayList<>();
        
        try (InputStream inputStream = file.getInputStream();
             Workbook workbook = new XSSFWorkbook(inputStream)) {
            
            Sheet sheet = workbook.getSheetAt(0);
            int lastRowNum = sheet.getLastRowNum();
            
            // 从第二行开始读取数据（第一行是表头）
            for (int rowIndex = 1; rowIndex <= lastRowNum; rowIndex++) {
                Row row = sheet.getRow(rowIndex);
                if (row == null) {
                    logger.debug("跳过空行，行号：{}", rowIndex + 1);
                    continue;
                }
                
                // 检查行是否为空
                if (isEmptyRow(row)) {
                    logger.debug("跳过空行（A列无日期），行号：{}", rowIndex + 1);
                    continue;
                }
                
                try {
                    NjBusinessTemplateSQL sql = parseRowToSql(row);
                    if (sql != null) {
                        sqlList.add(sql);
                        //logger.debug("成功解析行数据，行号：{}，日期：{}", rowIndex + 1, sql.getBdate());
                    } else {
                        logger.debug("解析行数据返回null，行号：{}", rowIndex + 1);
                    }
                } catch (Exception e) {
                    logger.error("解析行数据时发生异常，行号：{}", rowIndex + 1, e);
                }
            }
        }
        
        return sqlList;
    }
    
    /**
     * 解析Excel行数据为NjBusinessTemplateSQL对象
     * @param row Excel行
     * @param hotelCode 酒店编码
     * @return NjBusinessTemplateSQL对象
     */
    private NjBusinessTemplateSQL parseRowToSql(Row row) {
        try {
            double wy=10000;//万元 10000 和元 1 的切换
            // 获取A列数据（hotelid）
            String hotelid = getCellValueAsString(row.getCell(0)); // A列
            if (hotelid == null || hotelid.trim().isEmpty()) {
                logger.debug("A列日期为空，跳过行：{}", row.getRowNum() + 1);
                return null;
            }
            //logger.debug("读取A列日期：{}，行号：{}", hotelid, row.getRowNum() + 1);
            // 获取C列数据（bdate、cdate）
            String dateValue = getCellValueAsString(row.getCell(2)); // C列
            if (dateValue == null || dateValue.trim().isEmpty()) {
                logger.debug("C列日期为空，跳过行：{}", row.getRowNum() + 1);
                return null;
            }
            // 日期格式需要从“2025年7月1日”转换为“2025-07-01” 不足位需要补0，例如“2025-7-9”应该为“2025-07-09”

            dateValue = convertDateFormat(dateValue);
            
            
            // 获取D列数据（rev_ttl）
            Double revTtl = getCellValueAsDouble(row.getCell(3)); // D列
            if(revTtl!=null){
                //取2位小数
                revTtl = Math.round(revTtl * 100) / 100.0;
            }
            
            // 获取E列数据（rev_rm）
            Double revRm = getCellValueAsDouble(row.getCell(4)); // E列
            if(revRm!=null){
                //取2位小数
                revRm = Math.round(revRm * 100) / 100.0;
            }
             // 获取G列数据（rev_off）
             Double revOff = getCellValueAsDouble(row.getCell(5)); // F列
             if(revOff!=null){
                //取2位小数
                revOff = Math.round(revOff * 100) / 100.0;
             }
             // 获取H列数据（rev_apt）
            Double revApt = getCellValueAsDouble(row.getCell(6)); // G列            
            if(revApt!=null){
                //取2位小数
                revApt = Math.round(revApt * 100) / 100.0;
            }
            // 获取F列数据（rev_fb）
            Double revFb = getCellValueAsDouble(row.getCell(7)); // H列
            if(revFb!=null){
                //取2位小数
                revFb = Math.round(revFb * 100) / 100.0;
            }
            // 获取I列数据（rms_ttl）
            Integer rmsTtl = getCellValueAsInteger(row.getCell(8)); // I列  
            Integer rmsOcc = getCellValueAsInteger(row.getCell(9)); // J列
            // 获取I列数据（rev_ren）
            Double revRen = getCellValueAsDouble(row.getCell(12)); // M列  
            if(revRen!=null){
                //取2位小数
                revRen = Math.round(revRen * 100) / 100.0;
            }
            // 获取I列数据（rev_oth）
            Double revOthFormExcel = getCellValueAsDouble(row.getCell(13)); // M列           
            if(revOthFormExcel!=null){
            //revOthFormExcel取2位小数
                revOthFormExcel = Math.round(revOthFormExcel * 100) / 100.0;
            }
            

            // 安全计算其他收入，避免空指针异常
            Double revOth = 0.0;
            if (revTtl != null) {
                revOth = revTtl - (revFb != null ? revFb : 0.0) 
                - (revRm != null ? revRm : 0.0) ;
            }
            //revOth取2位小数
            revOth = Math.round(revOth * 100) / 100.0;
            

            
            
            // 创建NjBusinessTemplateSQL对象
            NjBusinessTemplateSQL sql = new NjBusinessTemplateSQL();
            sql.setBdate(dateValue);
            sql.setCdate(dateValue);
            sql.setHotelid(hotelid);
            sql.setClass_("total"); // 默认值
            sql.setDescript1("总计"); // 默认值
            sql.setRms_ttl(rmsTtl != null ? rmsTtl : 0);
            sql.setRms_occ(rmsOcc != null ? rmsOcc : 0);
            sql.setRms_oos(0); // 默认值
            sql.setRms_ooo(0); // 默认值
            sql.setRms_htl(0); // 默认值
            sql.setRms_avl(0); // 默认值
            sql.setRms_dus(0); // 默认值
            sql.setRev_rm(revRm != null ? revRm*wy : 0.0);
            sql.setRev_fb(revFb != null ? revFb*wy : 0.0);
            sql.setRev_ot(revOthFormExcel != null ? revOthFormExcel*wy : 0.0); // 默认值
            sql.setRev_off(revOff != null ? revOff*wy : 0.0); // 默认值
            sql.setRev_apt(revApt != null ? revApt*wy : 0.0); // 默认值
            sql.setRev_ren(revRen != null ? revRen*wy : 0.0); // 默认值
            sql.setAvg_rt(0.0); // 默认值
            sql.setUrc_num(0); // 默认值
            sql.setFbd_num(0); // 默认值
            sql.setCreatetime(LocalDateTime.now());
            
            return sql;
            
        } catch (Exception e) {
            logger.error("解析Excel行数据时发生异常，行号：{}，错误：{}", row.getRowNum() + 1, e.getMessage(), e);
            return null;
        }
    }

    /**
     * 将中文日期格式“YYYY年M月D日”转换为“YYYY-MM-DD”格式。
     *
     * @param chineseDateStr 待转换的中文日期字符串
     * @return 转换后的日期字符串
     */
    public static String convertDateFormat(String chineseDateStr) {
        // 定义中文日期字符串的解析格式
        // 'yyyy' 代表年份，'M' 代表月份，'d' 代表日期
        // 'M'和'd' 不带前导零，可以处理"7月"或"12月"这样的情况
        DateTimeFormatter inputFormatter = DateTimeFormatter.ofPattern("yyyy年M月d日", Locale.CHINA);
        
        // 解析输入的中文日期字符串为 LocalDate 对象
        LocalDate date = LocalDate.parse(chineseDateStr, inputFormatter);

        // 定义目标格式 'yyyy-MM-dd'
        // 'MM' 和 'dd' 会自动补零
        DateTimeFormatter outputFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        // 将 LocalDate 对象格式化为目标格式的字符串
        return date.format(outputFormatter);
    }
    
    /**
     * 检查行是否为空
     * @param row Excel行
     * @return 是否为空
     */
    private boolean isEmptyRow(Row row) {
        if (row == null) {
            return true;
        }
        
        // 检查A列（日期列）是否有值，这是关键字段
        Cell dateCell = row.getCell(0);
        if (dateCell == null || getCellValueAsString(dateCell) == null || getCellValueAsString(dateCell).trim().isEmpty()) {
            return true;
        }
        
        return false;
    }
    
    /**
     * 获取单元格字符串值
     * @param cell Excel单元格
     * @return 字符串值
     */
    private String getCellValueAsString(Cell cell) {
        if (cell == null) {
            return null;
        }
        
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue();
            case NUMERIC:
                if (DateUtil.isCellDateFormatted(cell)) {
                    return cell.getLocalDateTimeCellValue().toLocalDate().toString();
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
     * 获取单元格数值
     * @param cell Excel单元格
     * @return 数值
     */
    private Double getCellValueAsDouble(Cell cell) {
        if (cell == null) {
            return null;
        }
        
        switch (cell.getCellType()) {
            case NUMERIC:
                return cell.getNumericCellValue();
            case STRING:
                try {
                    return Double.parseDouble(cell.getStringCellValue());
                } catch (NumberFormatException e) {
                    return null;
                }
            case FORMULA:
                try {
                    return cell.getNumericCellValue();
                } catch (Exception e) {
                    return null;
                }
            default:
                return null;
        }
    }
    
    /**
     * 获取单元格整数值
     * @param cell Excel单元格
     * @return 整数值
     */
    private Integer getCellValueAsInteger(Cell cell) {
        if (cell == null) {
            return null;
        }
        
        switch (cell.getCellType()) {
            case NUMERIC:
                return (int) cell.getNumericCellValue();
            case STRING:
                try {
                    return Integer.parseInt(cell.getStringCellValue());
                } catch (NumberFormatException e) {
                    return null;
                }
            case FORMULA:
                try {
                    return (int) cell.getNumericCellValue();
                } catch (Exception e) {
                    return null;
                }
            default:
                return null;
        }
    }

    /**
     * 将对象列表转换为批量插入SQL语句
     */
    private String buildBatchInsertSQL(List<NjBusinessTemplateSQL> list) {
        StringBuilder sb = new StringBuilder();
        sb.append("INSERT INTO [Report].[dbo].bi_ttl (bdate, cdate, hotelid, class, descript1, rms_ttl, rms_occ, rms_oos, rms_ooo, rms_htl, rms_avl, rms_dus, rev_rm, rev_fb, rev_ot, avg_rt, urc_num, fbd_num, createtime) VALUES\n");
        for (int i = 0; i < list.size(); i++) {
            NjBusinessTemplateSQL o = list.get(i);
            sb.append("('")
                .append(escape(o.getBdate())).append("', '")
                .append(escape(o.getCdate())).append("', '")
                .append(escape(o.getHotelid())).append("', '")
                .append(escape(o.getClass_())).append("', '")
                .append(escape(o.getDescript1())).append("', '")
                .append(o.getRms_ttl()).append("', '")
                .append(o.getRms_occ()).append("', '")
                .append(o.getRms_oos()).append("', '")
                .append(o.getRms_ooo()).append("', '")
                .append(o.getRms_htl()).append("', '")
                .append(o.getRms_avl()).append("', '")
                .append(o.getRms_dus()).append("', '")
                .append(formatDouble(o.getRev_rm() != null ? o.getRev_rm() * 1 : 0.0)).append("', '")
                .append(formatDouble(o.getRev_fb() != null ? o.getRev_fb() * 1 : 0.0)).append("', '")
                .append(formatDouble(o.getRev_ot() != null ? o.getRev_ot() * 1 : 0.0)).append("', '")
                .append(formatDouble(o.getAvg_rt())).append("', '")
                .append(o.getUrc_num()).append("', '")
                .append(o.getFbd_num()).append("', '")
                .append(o.getCreatetime() != null ? o.getCreatetime().toLocalDate().toString() : "").append("')");
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
    private String formatDouble(Double value) {
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
} 