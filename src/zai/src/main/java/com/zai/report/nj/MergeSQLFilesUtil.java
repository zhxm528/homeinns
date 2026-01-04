package com.zai.report.nj;
import java.io.*;
import java.nio.file.*;
import java.nio.charset.StandardCharsets;
import java.nio.charset.Charset;
import java.util.List;
import java.util.ArrayList;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.regex.Pattern;
import java.util.regex.Matcher;

public class MergeSQLFilesUtil {
    private static final int BATCH_SIZE = 1000; // 每批次最大行数
    private static final String INSERT_PATTERN = "INSERT INTO \\[Report\\]\\.\\[dbo\\]\\.bi_htlrev \\(bdate,cdate,hotelid,dept,deptname,class,descript,class1,descript1,amount,rebate,createtime\\) VALUES";
    
    public static void main(String[] args) throws IOException {
        String directory = "C:/sqlin";  // SQL文件夹路径
        String outputFile = "C:/sqlout/merged.sql";

        System.out.println("开始合并SQL文件...");
        System.out.println("源目录: " + directory);
        System.out.println("输出文件: " + outputFile);
        System.out.println("输出编码: UTF-8");

        AtomicInteger processedFiles = new AtomicInteger(0); // 统计处理的文件数量
        AtomicInteger totalFiles = new AtomicInteger(0); // 统计总文件数量

        try (BufferedWriter writer = Files.newBufferedWriter(Paths.get(outputFile), Charset.forName("UTF-8"))) {
            // 先统计总文件数量
            totalFiles.set((int) Files.list(Paths.get(directory))
                                   .filter(path -> path.toString().endsWith(".sql"))
                                   .count());
            
            System.out.println("找到 " + totalFiles.get() + " 个SQL文件");
            
            Files.list(Paths.get(directory))
                 .filter(path -> path.toString().endsWith(".sql"))
                 .sorted()
                 .forEach(path -> {
                     try {
                         int currentFile = processedFiles.incrementAndGet();
                         System.out.println("正在处理文件 [" + currentFile + "/" + totalFiles.get() + "]: " + path.getFileName());
                         
                         // 尝试检测文件编码
                         Charset charset = detectCharset(path);
                         System.out.println("检测到文件编码: " + charset.name());
                         
                         // 读取整个文件内容进行预处理
                         List<String> fileLines = Files.readAllLines(path, charset);
                         String fileContent = String.join("\n", fileLines);
                         
                         // 预处理SQL内容，拆分大的INSERT语句
                         List<String> processedLines = preprocessSQL(fileContent);
                         System.out.println("预处理完成，原始行数: " + fileLines.size() + "，处理后行数: " + processedLines.size());
                         
                         // 将预处理后的内容写入输出文件
                         for (String line : processedLines) {
                             try {
                                 // 将读取的内容转换为UTF-8编码写入
                                 String utf8Line = new String(line.getBytes(charset), StandardCharsets.UTF_8);
                                 writer.write(utf8Line);
                                 writer.newLine();
                             } catch (IOException e) { 
                                 System.err.println("写入行时出错: " + e.getMessage());
                                 e.printStackTrace(); 
                             }
                         }
                         
                     } catch (IOException e) { 
                         System.err.println("读取文件 " + path + " 时出错: " + e.getMessage());
                         e.printStackTrace(); 
                     }
                 });
        }

        System.out.println("合并完成：" + outputFile);
        System.out.println("输出文件编码: UTF-8");
        System.out.println("统计信息：");
        System.out.println("  - 总文件数: " + totalFiles.get());
        System.out.println("  - 成功处理: " + processedFiles.get());
        System.out.println("  - 失败文件: " + (totalFiles.get() - processedFiles.get()));
    }
    
    /**
     * 预处理SQL内容，将大的INSERT语句拆分成多个小批次
     * @param sqlContent 原始SQL内容
     * @return 处理后的SQL行列表
     */
    private static List<String> preprocessSQL(String sqlContent) {
        List<String> result = new ArrayList<>();
        
        // 使用正则表达式查找INSERT语句
        Pattern pattern = Pattern.compile(
            INSERT_PATTERN + "\\s*\\n([\\s\\S]*?);", 
            Pattern.CASE_INSENSITIVE | Pattern.MULTILINE
        );
        
        Matcher matcher = pattern.matcher(sqlContent);
        int lastEnd = 0;
        
        while (matcher.find()) {
            // 添加INSERT语句之前的内容（如注释等）
            if (matcher.start() > lastEnd) {
                String beforeInsert = sqlContent.substring(lastEnd, matcher.start()).trim();
                if (!beforeInsert.isEmpty()) {
                    result.add(beforeInsert);
                }
            }
            
            // 获取VALUES部分的内容
            String valuesContent = matcher.group(1).trim();
            
            // 分割VALUES行
            List<String> valueRows = splitValueRows(valuesContent);
            
            // 按批次处理
            processBatches(valueRows, result);
            
            lastEnd = matcher.end();
        }
        
        // 添加最后剩余的内容
        if (lastEnd < sqlContent.length()) {
            String remaining = sqlContent.substring(lastEnd).trim();
            if (!remaining.isEmpty()) {
                result.add(remaining);
            }
        }
        
        // 如果没有找到INSERT语句，返回原始内容
        if (result.isEmpty()) {
            return List.of(sqlContent);
        }
        
        return result;
    }
    
    /**
     * 分割VALUES行
     * @param valuesContent VALUES部分的内容
     * @return 值行列表
     */
    private static List<String> splitValueRows(String valuesContent) {
        List<String> rows = new ArrayList<>();
        StringBuilder currentRow = new StringBuilder();
        boolean inQuotes = false;
        int parenthesesLevel = 0;
        
        for (int i = 0; i < valuesContent.length(); i++) {
            char ch = valuesContent.charAt(i);
            
            if (ch == '\'' && (i == 0 || valuesContent.charAt(i - 1) != '\\')) {
                inQuotes = !inQuotes;
            }
            
            if (!inQuotes) {
                if (ch == '(') {
                    parenthesesLevel++;
                } else if (ch == ')') {
                    parenthesesLevel--;
                }
                
                if (ch == ',' && parenthesesLevel == 0) {
                    // 这是一行的结束
                    String row = currentRow.toString().trim();
                    if (!row.isEmpty()) {
                        rows.add(row);
                    }
                    currentRow = new StringBuilder();
                    continue;
                }
            }
            
            currentRow.append(ch);
        }
        
        // 添加最后一行
        String lastRow = currentRow.toString().trim();
        if (!lastRow.isEmpty()) {
            rows.add(lastRow);
        }
        
        return rows;
    }
    
    /**
     * 按批次处理VALUES行
     * @param valueRows 所有的值行
     * @param result 结果列表
     */
    private static void processBatches(List<String> valueRows, List<String> result) {
        for (int i = 0; i < valueRows.size(); i += BATCH_SIZE) {
            int endIndex = Math.min(i + BATCH_SIZE, valueRows.size());
            List<String> batch = valueRows.subList(i, endIndex);
            
            // 生成批次注释
            int batchNumber = (i / BATCH_SIZE) + 1;
            result.add("-- 批次 " + batchNumber);
            
            // 生成INSERT语句头部
            result.add("INSERT INTO [Report].[dbo].bi_htlrev");
            result.add("(bdate,cdate,hotelid,dept,deptname,class,descript,class1,descript1,amount,rebate,createtime)");
            result.add("VALUES");
            
            // 添加VALUES行
            for (int j = 0; j < batch.size(); j++) {
                String row = batch.get(j);
                if (j == batch.size() - 1) {
                    // 最后一行，添加分号
                    result.add(row + ";");
                } else {
                    // 非最后一行，添加逗号
                    result.add(row + ",");
                }
            }
            
            // 添加空行分隔不同批次
            result.add("");
        }
    }
    
    /**
     * 检测文件编码
     * @param filePath 文件路径
     * @return 检测到的字符编码
     */
    private static Charset detectCharset(Path filePath) {
        try {
            // 读取文件的前几个字节来检测编码
            byte[] bytes = Files.readAllBytes(filePath);
            
            // 检查是否有BOM标记
            if (bytes.length >= 3 && bytes[0] == (byte) 0xEF && bytes[1] == (byte) 0xBB && bytes[2] == (byte) 0xBF) {
                return StandardCharsets.UTF_8;
            }
            
            // 检查是否为UTF-16
            if (bytes.length >= 2) {
                if (bytes[0] == (byte) 0xFE && bytes[1] == (byte) 0xFF) {
                    return StandardCharsets.UTF_16BE;
                }
                if (bytes[0] == (byte) 0xFF && bytes[1] == (byte) 0xFE) {
                    return StandardCharsets.UTF_16LE;
                }
            }
            
            // 默认使用UTF-8
            return StandardCharsets.UTF_8;
            
        } catch (IOException e) {
            System.err.println("检测文件编码时出错: " + e.getMessage());
            return StandardCharsets.UTF_8; // 默认返回UTF-8
        }
    }
}
