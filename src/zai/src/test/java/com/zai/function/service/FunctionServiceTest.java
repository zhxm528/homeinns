package com.zai.function.service;

import com.zai.common.BaseResponse;
import com.zai.function.dto.FunctionAddRequest;
import com.zai.function.dto.FunctionListRequest;
import com.zai.function.service.FunctionService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
public class FunctionServiceTest {

    @Autowired
    private FunctionService functionService;

    @Test
    public void testAddFunction() {
        FunctionAddRequest request = new FunctionAddRequest();
        request.setFunctionCode("TEST_FUNCTION");
        request.setFunctionName("测试功能");
        request.setFunctionStatus("ACTIVE");
        request.setFunctionType("MENU");
        request.setFunctionDescription("这是一个测试功能");

        BaseResponse response = functionService.add(request);
        
        assertTrue(response.isSuccess());
        assertNotNull(response.getData());
    }

    @Test
    public void testListFunctions() {
        FunctionListRequest request = new FunctionListRequest();
        request.setPageNum(1);
        request.setPageSize(10);

        BaseResponse response = functionService.list(request);
        
        assertTrue(response.isSuccess());
        assertNotNull(response.getData());
    }

    @Test
    public void testGetParentList() {
        BaseResponse response = functionService.getParentList();
        
        assertTrue(response.isSuccess());
        assertNotNull(response.getData());
    }
} 