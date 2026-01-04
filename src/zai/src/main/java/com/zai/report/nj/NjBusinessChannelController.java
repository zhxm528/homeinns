package com.zai.report.nj;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/nj/channel")
public class NjBusinessChannelController {
    private static final Logger logger = LoggerFactory.getLogger(NjBusinessChannelController.class);
    private static final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * 程序入口：处理渠道Excel文件，生成SQL语句
     * POST请求，接收Excel文件并返回SQL文件
     */
    @PostMapping("/process")
    public ResponseEntity<byte[]> processChannelExcel(@RequestParam("file") MultipartFile file) {
        try {
            // 打印文件信息
            if (file != null && !file.isEmpty()) {
                logger.debug("接收到的文件信息 - 文件名: {}, 文件大小: {} bytes", file.getOriginalFilename(), file.getSize());
            } else {
                logger.warn("未接收到文件或文件为空");
                String errorMessage = "未接收到文件";
                return ResponseEntity.badRequest().body(errorMessage.getBytes(StandardCharsets.UTF_8));
            }

            // 解析Excel文件，生成NjBusinessChannelSQL对象列表
            List<NjBusinessChannelSQL> channelList = NjBusinessChannelSQL.parseExcelToChannelList(file);

            // 打印解析结果
            logger.debug("解析Excel成功，共生成 {} 条数据", channelList.size());

            // 转换为批量插入SQL语句
            String sqlContent = NjBusinessChannelSQL.buildBatchInsertSQL(channelList);

            // 生成文件名（使用上传的文件名，但扩展名改为.sql）
            String originalFileName = file.getOriginalFilename();
            String fileName = originalFileName != null ?
                originalFileName.substring(0, originalFileName.lastIndexOf('.')) + ".sql" :
                "渠道日报.sql";

            // 保存SQL文件到下载目录
            String downloadPath = System.getProperty("user.home") + "/Downloads/" + fileName;
            saveSQLToFile(sqlContent, downloadPath);

            String encodedFileName = URLEncoder.encode(fileName, "UTF-8").replaceAll("\\+", "%20");
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", encodedFileName);

            return ResponseEntity.ok().headers(headers).body(sqlContent.getBytes(StandardCharsets.UTF_8));

        } catch (Exception e) {
            logger.error("处理渠道Excel文件失败", e);
            String errorMessage = "处理失败: " + e.getMessage();
            return ResponseEntity.status(500).body(errorMessage.getBytes(StandardCharsets.UTF_8));
        }
    }

    /**
     * 下载渠道导入模板
     */
    @PostMapping("/template")
    public ResponseEntity<byte[]> getChannelTemplate(@RequestBody Map<String, String> request) {
        try {
            // 打印json格式的入参
            String json = objectMapper.writeValueAsString(request);
            logger.debug("/api/nj/channel/template 入参: {}", json);

            // 读取模板
            ClassPathResource resource = new ClassPathResource("static/download/template/ChannelImportTemplate.xlsx");
            InputStream inputStream = resource.getInputStream();
            Workbook workbook = new XSSFWorkbook(inputStream);
            Sheet sheet = workbook.getSheetAt(0);

            // 锁定第一行
            Row firstRow = sheet.getRow(0);
            if (firstRow != null) {
                for (Cell cell : firstRow) {
                    CellStyle style = workbook.createCellStyle();
                    style.cloneStyleFrom(cell.getCellStyle());
                    style.setLocked(true);
                    cell.setCellStyle(style);
                }
            }

            // 设置其他行为可编辑
            for (int rowIndex = 1; rowIndex <= sheet.getLastRowNum(); rowIndex++) {
                Row row = sheet.getRow(rowIndex);
                if (row != null) {
                    for (Cell cell : row) {
                        CellStyle style = workbook.createCellStyle();
                        style.cloneStyleFrom(cell.getCellStyle());
                        style.setLocked(false);
                        cell.setCellStyle(style);
                    }
                }
            }

            // 保护工作表
            sheet.protectSheet("password");

            // 转换为字节数组
            byte[] excelBytes = workbookToByteArray(workbook);
            workbook.close();

            // 设置响应头
            String fileName = "渠道导入模板.xlsx";
            String encodedFileName = URLEncoder.encode(fileName, "UTF-8").replaceAll("\\+", "%20");
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", encodedFileName);

            return ResponseEntity.ok().headers(headers).body(excelBytes);

        } catch (Exception e) {
            logger.error("生成渠道模板失败", e);
            String errorMessage = "生成模板失败: " + e.getMessage();
            return ResponseEntity.status(500).body(errorMessage.getBytes(StandardCharsets.UTF_8));
        }
    }

    /**
     * 处理渠道Excel文件，生成SQL语句（保留原有接口）
     */
    @PostMapping("/makesql")
    public ResponseEntity<byte[]> processChannelTemplate(@RequestParam("file") MultipartFile file) {
        return processChannelExcel(file);
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
     * 将Workbook转换为字节数组
     * @param workbook Excel工作簿
     * @return 字节数组
     */
    private byte[] workbookToByteArray(Workbook workbook) throws IOException {
        try (java.io.ByteArrayOutputStream outputStream = new java.io.ByteArrayOutputStream()) {
            workbook.write(outputStream);
            return outputStream.toByteArray();
        }
    }
} 