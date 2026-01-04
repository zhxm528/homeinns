# Function 功能管理模块

## 模块概述

Function模块是Spring Boot项目中的功能管理模块，提供了完整的CRUD操作，包括功能的增删改查、代码唯一性验证和上级功能查询等功能。

## 目录结构

```
com.zai.function/
├── controller/          # 控制器层
│   └── FunctionController.java
├── entity/             # 实体层
│   └── Function.java
├── mapper/             # 数据访问层
│   └── FunctionMapper.java
├── service/            # 业务逻辑层
│   ├── FunctionService.java
│   └── impl/
│       └── FunctionServiceImpl.java
├── dto/                # 数据传输对象层
│   ├── FunctionAddRequest.java
│   ├── FunctionUpdateRequest.java
│   ├── FunctionListRequest.java
│   └── FunctionCheckCodeRequest.java
└── README.md           # 模块说明文档
```

## 核心功能

### 1. 功能管理
- 新增功能
- 更新功能
- 删除功能
- 查询功能详情
- 功能列表查询

### 2. 业务规则
- 功能代码唯一性验证
- 删除时检查子功能
- 上级功能查询
- 分页查询支持

### 3. API接口

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 获取功能列表 | POST | `/api/function/list` | 支持条件查询和分页 |
| 新增功能 | POST | `/api/function/add` | 创建新功能 |
| 更新功能 | PUT | `/api/function/update` | 更新功能信息 |
| 获取功能详情 | GET | `/api/function/{id}` | 根据ID获取详情 |
| 删除功能 | DELETE | `/api/function/{id}` | 删除指定功能 |
| 验证功能代码 | POST | `/api/function/check-code` | 验证代码唯一性 |
| 获取上级功能 | GET | `/api/function/parent/list` | 获取所有上级功能 |

## 数据库表结构

```sql
CREATE TABLE functions (
    function_id VARCHAR(64) PRIMARY KEY,
    function_code VARCHAR(100) NOT NULL,
    function_name VARCHAR(100) NOT NULL,
    parent_function_id VARCHAR(64),
    function_icon VARCHAR(100),
    function_sort INT,
    function_path VARCHAR(1000),
    function_status VARCHAR(100),
    function_type VARCHAR(100),
    function_description VARCHAR(1024),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

## 技术特点

### 1. 分层架构
- **Controller层**: 处理HTTP请求和响应
- **Service层**: 实现业务逻辑
- **Mapper层**: 数据访问接口
- **Entity层**: 数据库实体映射
- **DTO层**: 数据传输对象

### 2. 设计模式
- 接口设计模式
- 依赖注入
- 事务管理
- 统一响应格式

### 3. 代码规范
- 遵循Java代码规范
- 完整的日志记录
- 统一的异常处理
- 参数验证

## 使用示例

### 1. 新增功能
```java
FunctionAddRequest request = new FunctionAddRequest();
request.setFunctionCode("USER_MANAGE");
request.setFunctionName("用户管理");
request.setFunctionStatus("ACTIVE");
request.setFunctionType("MENU");

BaseResponse response = functionService.add(request);
```

### 2. 查询功能列表
```java
FunctionListRequest request = new FunctionListRequest();
request.setFunctionCode("USER");
request.setPageNum(1);
request.setPageSize(10);

BaseResponse response = functionService.list(request);
```

### 3. 验证功能代码
```java
FunctionCheckCodeRequest request = new FunctionCheckCodeRequest();
request.setFunctionCode("NEW_FUNCTION");

BaseResponse response = functionService.checkCode(request);
```

## 配置说明

### 1. MyBatis配置
确保在`application.yml`中配置了MyBatis的mapper扫描路径：
```yaml
mybatis:
  mapper-locations: classpath:mapper/*.xml
  type-aliases-package: com.zai.function.entity
```

### 2. 数据库连接
确保数据库连接配置正确，并且functions表已创建。

## 测试

模块包含完整的单元测试，位于`src/test/java/com/zai/function/service/FunctionServiceTest.java`。

运行测试：
```bash
mvn test -Dtest=FunctionServiceTest
```

## 注意事项

1. **功能代码唯一性**: 系统会验证功能代码的唯一性，不允许重复
2. **删除限制**: 有子功能的功能不允许删除
3. **事务管理**: 所有写操作都有事务保护
4. **日志记录**: 所有操作都有详细的日志记录
5. **参数验证**: 所有输入参数都会进行验证

## 扩展说明

如需扩展功能，可以：
1. 在Entity中添加新字段
2. 在DTO中添加对应的请求/响应字段
3. 在Mapper中添加新的查询方法
4. 在Service中实现新的业务逻辑
5. 在Controller中添加新的API接口

## 相关文档

- [API接口文档](../doc/api/function-api.md)
- [数据库设计文档](../doc/database/表结构.txt)
- [Spring Boot项目结构规范](../.cursor/rules/spring_boot_structure.mdc) 