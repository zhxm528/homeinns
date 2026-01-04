package com.zai.report.nj;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.mock.web.MockMultipartFile;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.boot.test.context.SpringBootTest;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class NjBusinessTemplateControllerTest {

    private NjBusinessTemplateController controller;

    @BeforeEach
    void setUp() {
        controller = new NjBusinessTemplateController();
    }

    @Test
    void testParseExcelToSqlList() throws Exception {
        // 创建测试Excel文件
        MockMultipartFile file = createTestExcelFile();
        
        // 使用反射调用私有方法进行测试
        java.lang.reflect.Method method = NjBusinessTemplateController.class
            .getDeclaredMethod("parseExcelToSqlList", org.springframework.web.multipart.MultipartFile.class, String.class);
        method.setAccessible(true);
        
        @SuppressWarnings("unchecked")
        List<NjBusinessTemplateSQL> result = (List<NjBusinessTemplateSQL>) method.invoke(controller, file, "TEST001");
        
        // 验证结果
        assertNotNull(result);
        assertFalse(result.isEmpty());
        assertEquals(2, result.size()); // 应该有2行数据
        
        // 验证第一行数据
        NjBusinessTemplateSQL firstRow = result.get(0);
        assertEquals("2024-01-01", firstRow.getBdate());
        assertEquals("2024-01-01", firstRow.getCdate());
        assertEquals("TEST001", firstRow.getHotelid());
        assertEquals(1000.0, firstRow.getRev_rm());
        assertEquals(500.0, firstRow.getRev_fb());
        assertEquals(100, firstRow.getRms_ttl());
        assertEquals(80, firstRow.getRms_occ());
        
        // 验证第二行数据
        NjBusinessTemplateSQL secondRow = result.get(1);
        assertEquals("2024-01-02", secondRow.getBdate());
        assertEquals("2024-01-02", secondRow.getCdate());
        assertEquals("TEST001", secondRow.getHotelid());
        assertEquals(1200.0, secondRow.getRev_rm());
        assertEquals(600.0, secondRow.getRev_fb());
        assertEquals(100, secondRow.getRms_ttl());
        assertEquals(85, secondRow.getRms_occ());
    }

    /**
     * 创建测试用的Excel文件
     */
    private MockMultipartFile createTestExcelFile() throws IOException {
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("经营日报");
            
            // 创建表头
            Row headerRow = sheet.createRow(0);
            headerRow.createCell(0).setCellValue("日期");
            headerRow.createCell(1).setCellValue("列B");
            headerRow.createCell(2).setCellValue("客房收入");
            headerRow.createCell(3).setCellValue("列D");
            headerRow.createCell(4).setCellValue("列E");
            headerRow.createCell(5).setCellValue("餐饮收入");
            headerRow.createCell(6).setCellValue("总房间数");
            headerRow.createCell(7).setCellValue("入住房间数");
            
            // 创建第一行数据
            Row dataRow1 = sheet.createRow(1);
            dataRow1.createCell(0).setCellValue("2024-01-01");
            dataRow1.createCell(1).setCellValue("B1");
            dataRow1.createCell(2).setCellValue(1000.0);
            dataRow1.createCell(3).setCellValue("D1");
            dataRow1.createCell(4).setCellValue("E1");
            dataRow1.createCell(5).setCellValue(500.0);
            dataRow1.createCell(6).setCellValue(100);
            dataRow1.createCell(7).setCellValue(80);
            
            // 创建第二行数据
            Row dataRow2 = sheet.createRow(2);
            dataRow2.createCell(0).setCellValue("2024-01-02");
            dataRow2.createCell(1).setCellValue("B2");
            dataRow2.createCell(2).setCellValue(1200.0);
            dataRow2.createCell(3).setCellValue("D2");
            dataRow2.createCell(4).setCellValue("E2");
            dataRow2.createCell(5).setCellValue(600.0);
            dataRow2.createCell(6).setCellValue(100);
            dataRow2.createCell(7).setCellValue(85);
            
            // 将工作簿写入字节数组
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);
            
            return new MockMultipartFile(
                "file",
                "test_business_template.xlsx",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                outputStream.toByteArray()
            );
        }
    }
} 