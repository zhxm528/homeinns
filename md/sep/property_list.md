# Property 列表 SDK 规则说明

本文是对 “Get list of properties” 接口的规则解读与 SDK 调用规范梳理，便于直接用于前后端或 SDK 封装。

## 1. 接口基本信息

- 路径：`/api-gateway/configuration/v1/properties`
- 方法：`GET`
- 功能：获取 Property（物业/酒店/门店）列表
- 权限要求：`View Organization Unit`

## 2. 查询参数规则（Query Parameters）

### 2.1 statusCode（可选）

- 类型：string
- 作用：按 Property 状态筛选
- 可选值：`Draft` / `Published` / `Archived`

规则：

- 不传：返回所有状态
- 传值：只返回指定状态

### 2.2 subsidiaryId（可选）

- 类型：UUID
- 作用：指定某个子公司/组织节点

示例：

```
00000000-0000-0000-0000-000000000000
```

### 2.3 recursive（可选）

- 类型：boolean
- 默认：false
- 作用：是否递归返回子组织下的所有 properties

规则：

- `recursive=true`：返回 `subsidiaryId` 及其所有子层级
- `recursive=false`：只返回当前 subsidiary 下的 properties

说明：通常与 `subsidiaryId` 搭配使用才有意义。

### 2.4 sort（可选）

- 类型：string
- 作用：排序字段

规则：

- 多字段用英文逗号分隔
- 默认升序
- 前加 `-` 表示降序

示例：

```
sort=name
sort=-createdAt
sort=name,-createdAt
```

### 2.5 pageNumber（可选）

- 类型：int
- 最小值：1
- 默认值：1
- 作用：页码

### 2.6 pageSize（可选）

- 类型：int
- 最小值：1
- 最大值：200
- 默认值：50
- 作用：每页返回条数

### 2.7 filter（可选）

- 类型：string
- 作用：模糊过滤

说明：

- 用于按某种模式筛选结果
- 具体支持字段与语法由后台实现决定（常见为 name/code 搜索）

## 3. 请求头规则（Headers）

### 3.1 Accept-Language（可选）

- 作用：返回内容的语言偏好

示例：

```
Accept-Language: en-US
Accept-Language: zh-CN
```

### 3.2 AC-Tenant-ID（条件必填）

- 作用：租户唯一 ID（UUID）

规则：

- system user 调用时必填
- client user 调用时不需要（token 内已包含 tenant）

### 3.3 AC-Correlation-ID（可选，建议）

- 作用：客户端自定义 UUID，用于链路追踪

规则：

- 便于多个 API 调用关联与 webhook 追踪
- 不传时系统会自动生成一个

示例：

```
550e8400-e29b-41d4-a716-446655440000
```

## 4. 权限与调用约束

- 必须具备权限：`View Organization Unit`
- 返回结果受 tenant + 权限 + subsidiary 约束
- system user 可跨 tenant（需 `AC-Tenant-ID`）
- client user 只能访问自己 tenant 下的数据

## 5. 典型调用示例

请求：

```
GET /api-gateway/configuration/v1/properties
    ?statusCode=Published
    &subsidiaryId=00000000-0000-0000-0000-000000000000
    &recursive=true
    &sort=-createdAt
    &pageNumber=1
    &pageSize=50
    &filter=hotel
```

Headers：

```
Authorization: Bearer <access_token>
Accept-Language: en-US
AC-Correlation-ID: 550e8400-e29b-41d4-a716-446655440000
```

## 6. SDK 封装要点

- 参数全部可选，但要做基本校验（pageNumber >= 1, pageSize <= 200）
- system user 调用需强制提供 `AC-Tenant-ID`
- `subsidiaryId` 与 `recursive` 搭配时需提示可能的数据量影响
- 封装分页、排序、筛选为可配置选项
- 统一返回结构中保留分页元信息（如果有）

## 7. 一句话总结

这是一个支持分页、排序、状态筛选、组织树递归查询的 Property 列表接口；权限受 tenant 与组织结构控制，system user 需显式指定 `AC-Tenant-ID`。

