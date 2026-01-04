package com.zai.report.nj;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

public class NjBusinessChannelSQL {
    private static final Logger logger = LoggerFactory.getLogger(NjBusinessChannelSQL.class);
    
    // 渠道相关的字段
    private String channelId;
    private String hotelCode;        // A列：酒店编号
    private String hotelName;        // B列：酒店名称（暂不处理）
    private String dailyDate;        // C列：日期
    private String channelCode;      // D列：代码
    private String channelName;      // E列：描述
    private Integer rmsOcc;          // F列：房数
    private Double revRoom;          // G列：房费
    private LocalDateTime createtime;
    
    // Getters and Setters
    public String getChannelId() {
        return channelId;
    }
    
    public void setChannelId(String channelId) {
        this.channelId = channelId;
    }
    
    public String getHotelCode() {
        return hotelCode;
    }
    
    public void setHotelCode(String hotelCode) {
        this.hotelCode = hotelCode;
    }
    
    public String getHotelName() {
        return hotelName;
    }
    
    public void setHotelName(String hotelName) {
        this.hotelName = hotelName;
    }
    
    public String getDailyDate() {
        return dailyDate;
    }
    
    public void setDailyDate(String dailyDate) {
        this.dailyDate = dailyDate;
    }
    
    public String getChannelCode() {
        return channelCode;
    }
    
    public void setChannelCode(String channelCode) {
        this.channelCode = channelCode;
    }
    
    public String getChannelName() {
        return channelName;
    }
    
    public void setChannelName(String channelName) {
        this.channelName = channelName;
    }
    
    public Integer getRmsOcc() {
        return rmsOcc;
    }
    
    public void setRmsOcc(Integer rmsOcc) {
        this.rmsOcc = rmsOcc;
    }
    
    public Double getRevRoom() {
        return revRoom;
    }
    
    public void setRevRoom(Double revRoom) {
        this.revRoom = revRoom;
    }
    
    public LocalDateTime getCreatetime() {
        return createtime;
    }
    
    public void setCreatetime(LocalDateTime createtime) {
        this.createtime = createtime;
    }
    
    /**
     * 解析Excel文件，生成NjBusinessChannelSQL对象列表
     * @param file Excel文件
     * @return NjBusinessChannelSQL对象列表
     */
    public static List<NjBusinessChannelSQL> parseExcelToChannelList(MultipartFile file) throws IOException {
        List<NjBusinessChannelSQL> channelList = new ArrayList<>();
        
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
                    logger.debug("跳过空行（A列无渠道代码），行号：{}", rowIndex + 1);
                    continue;
                }
                
                try {
                    NjBusinessChannelSQL channel = parseRowToChannel(row);
                    if (channel != null) {
                        channelList.add(channel);
                        logger.debug("成功解析行数据，行号：{}，渠道代码：{}", rowIndex + 1, channel.getChannelCode());
                    } else {
                        logger.debug("解析行数据返回null，行号：{}", rowIndex + 1);
                    }
                } catch (Exception e) {
                    logger.error("解析行数据时发生异常，行号：{}", rowIndex + 1, e);
                }
            }
        }
        
        return channelList;
    }
    
    /**
     * 解析Excel行数据为NjBusinessChannelSQL对象
     * @param row Excel行
     * @return NjBusinessChannelSQL对象
     */
    private static NjBusinessChannelSQL parseRowToChannel(Row row) {
        try {
            // 获取A列数据（酒店编号）
            String hotelCode = getCellValueAsString(row.getCell(0)); // A列
            if (hotelCode == null || hotelCode.trim().isEmpty()) {
                logger.debug("A列酒店编号为空，跳过行：{}", row.getRowNum() + 1);
                return null;
            }
            logger.debug("读取A列酒店编号：{}，行号：{}", hotelCode, row.getRowNum() + 1);
            
            // 获取B列数据（酒店名称）- 暂不处理
            String hotelName = getCellValueAsString(row.getCell(1)); // B列
            logger.debug("B列酒店名称：{}，行号：{}", hotelName, row.getRowNum() + 1);
            
            // 获取C列数据（日期）
            String dailyDate = getCellValueAsString(row.getCell(2)); // C列
            if (dailyDate == null || dailyDate.trim().isEmpty()) {
                logger.debug("C列日期为空，跳过行：{}", row.getRowNum() + 1);
                return null;
            }
            logger.debug("读取C列日期：{}，行号：{}", dailyDate, row.getRowNum() + 1);
            
            // 获取D列数据（代码）
            String channelCode = getCellValueAsString(row.getCell(3)); // D列
            if (channelCode == null || channelCode.trim().isEmpty()) {
                logger.debug("D列代码为空，跳过行：{}", row.getRowNum() + 1);
                return null;
            }
            logger.debug("读取D列代码：{}，行号：{}", channelCode, row.getRowNum() + 1);
            
            // 获取E列数据（描述）
            String channelName = getCellValueAsString(row.getCell(4)); // E列
            logger.debug("E列描述：{}，行号：{}", channelName, row.getRowNum() + 1);
            
            // 获取F列数据（房数）
            Integer rmsOcc = getCellValueAsInteger(row.getCell(5)); // F列
            logger.debug("F列房数：{}，行号：{}", rmsOcc, row.getRowNum() + 1);
            
            // 获取G列数据（房费）
            Double revRoom = getCellValueAsDouble(row.getCell(6)); // G列
            logger.debug("G列房费：{}，行号：{}", revRoom, row.getRowNum() + 1);
            
            // 创建NjBusinessChannelSQL对象
            NjBusinessChannelSQL channel = new NjBusinessChannelSQL();
            channel.setHotelCode(hotelCode != null ? hotelCode.trim() : "");
            channel.setHotelName(hotelName != null ? hotelName.trim() : "");
            channel.setDailyDate(dailyDate != null ? dailyDate.trim() : "");
            channel.setChannelCode(channelCode != null ? channelCode.trim() : "");
            channel.setChannelName(channelName != null ? channelName.trim() : "");
            channel.setRmsOcc(rmsOcc != null ? rmsOcc : 0);
            channel.setRevRoom(revRoom != null ? revRoom : 0.0);
            channel.setCreatetime(LocalDateTime.now());
            
            return channel;
            
        } catch (Exception e) {
            logger.error("解析Excel行数据时发生异常，行号：{}，错误：{}", row.getRowNum() + 1, e.getMessage(), e);
            return null;
        }
    }
    
    /**
     * 检查行是否为空
     * @param row Excel行
     * @return 是否为空
     */
    private static boolean isEmptyRow(Row row) {
        if (row == null) {
            return true;
        }
        
        // 检查A列是否有值（酒店编号）
        Cell cell = row.getCell(0);
        String value = getCellValueAsString(cell);
        return value == null || value.trim().isEmpty();
    }
    
    /**
     * 获取单元格的字符串值
     * @param cell Excel单元格
     * @return 字符串值
     */
    private static String getCellValueAsString(Cell cell) {
        if (cell == null) {
            return null;
        }
        
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue();
            case NUMERIC:
                if (DateUtil.isCellDateFormatted(cell)) {
                    return cell.getLocalDateTimeCellValue().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
                } else {
                    return String.valueOf((int) cell.getNumericCellValue());
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
     * 获取单元格的整数值
     * @param cell Excel单元格
     * @return 整数值
     */
    private static Integer getCellValueAsInteger(Cell cell) {
        if (cell == null) {
            return null;
        }
        
        switch (cell.getCellType()) {
            case NUMERIC:
                return (int) cell.getNumericCellValue();
            case STRING:
                try {
                    return Integer.parseInt(cell.getStringCellValue().trim());
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
     * 获取单元格的双精度值
     * @param cell Excel单元格
     * @return 双精度值
     */
    private static Double getCellValueAsDouble(Cell cell) {
        if (cell == null) {
            return null;
        }
        
        switch (cell.getCellType()) {
            case NUMERIC:
                return cell.getNumericCellValue();
            case STRING:
                try {
                    return Double.parseDouble(cell.getStringCellValue().trim());
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
     * 构建批量插入SQL语句
     * @param channelList 渠道列表
     * @return SQL语句字符串
     */
    public static String buildBatchInsertSQL(List<NjBusinessChannelSQL> channelList) {
        if (channelList == null || channelList.isEmpty()) {
            return "";
        }
        
        StringBuilder sql = new StringBuilder();
        sql.append("INSERT INTO channel_daily (hotel_code, daily_date, channel_code, channel_name, rms_occ, rev_room, created_at) VALUES\n");
        
        for (int i = 0; i < channelList.size(); i++) {
            NjBusinessChannelSQL channel = channelList.get(i);
            
            sql.append("('");
            sql.append(escapeSqlString(channel.getHotelCode()));
            sql.append("', '");
            sql.append(escapeSqlString(channel.getDailyDate()));
            sql.append("', '");
            sql.append(escapeSqlString(channel.getChannelCode()));
            sql.append("', '");
            sql.append(escapeSqlString(channel.getChannelName()));
            sql.append("', ");
            sql.append(channel.getRmsOcc() != null ? channel.getRmsOcc() : 0);
            sql.append(", ");
            sql.append(formatDouble(channel.getRevRoom()));
            sql.append(", '");
            sql.append(channel.getCreatetime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
            sql.append("')");
            
            if (i < channelList.size() - 1) {
                sql.append(",\n");
            }
        }
        
        sql.append(";");
        
        return sql.toString();
    }
    
    /**
     * 转义SQL字符串中的特殊字符
     * @param str 原始字符串
     * @return 转义后的字符串
     */
    private static String escapeSqlString(String str) {
        if (str == null) {
            return "";
        }
        return str.replace("'", "''");
    }
    
    /**
     * 格式化数值，避免科学计数法
     * @param value 数值
     * @return 格式化后的字符串
     */
    private static String formatDouble(Double value) {
        if (value == null) return "0";
        java.math.BigDecimal bd = new java.math.BigDecimal(value.toString());
        if (bd.scale() <= 0) return bd.toPlainString();
        return bd.setScale(2, java.math.RoundingMode.HALF_UP).toPlainString();
    }
}
