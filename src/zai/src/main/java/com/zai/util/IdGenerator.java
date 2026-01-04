package com.zai.util;

import java.util.UUID;

/**
 * ID生成器工具类
 */
public class IdGenerator {
    
    /**
     * 生成64位唯一ID
     * @return 64位唯一ID字符串
     */
    public static String generate64BitId() {
        // 生成UUID并移除连字符
        String uuid = UUID.randomUUID().toString().replace("-", "");
        // 取前32位
        String part1 = uuid.substring(0, 32);
        // 再生成一个UUID并取前32位
        String part2 = UUID.randomUUID().toString().replace("-", "").substring(0, 32);
        // 组合成64位
        return part1 + part2;
    }
} 