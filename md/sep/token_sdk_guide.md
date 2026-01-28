# Shiji Enterprise Platform 获取 Token SDK 创建说明

本文用大白话 + 结构化方式说明：如何基于 Shiji Platform 的 Auth API（OAuth2 + JWT 风格）设计并实现“获取 token 的 SDK”。内容已合并认证规则与接口细节。

## 1. 你要做的 SDK 解决什么问题

目标：让业务方只提供账号和配置，就能稳定拿到 `access_token`，并自动处理缓存、过期刷新、失效重登。

核心能力应包括：

- 第一次登录换 token（密码模式）
- 缓存 token 和过期时间
- token 过期后使用 refresh_token 刷新
- refresh 失败时自动回退到重新登录
- 调用 API 时自动拼接 Authorization Bearer
- 支持设置并透传 `AC-Property-Id`

## 2. 接入前准备（注册应用 + 用户）

在 SDK 工作前，需要人工准备好这些配置（由客户或你拿到后配置到 SDK）：

- `client_id`（由 Shiji Platform 分配）
- `client_secret`（你注册 API client 时提交/配置）
- 一个有权限的用户账号 `username` / `password`
- 基础地址（如 `https://<host>`）

如何拿到：需给 `ac.api-support@shijigroup.com` 发邮件申请注册应用，或找客户经理协助。

用户类型有两种：

- system user：系统级用户，通常权限更大
- client user：客户端用户，属于某个 tenant

注意：client user 的 token 会绑定 `tenant_id`，只能访问该租户的数据。

## 3. Auth API 在讲什么（一句话版）

这是基于 OAuth2 的登录与发 Token 机制说明：客户端用“用户名 + 密码”或“刷新令牌”向 `/connect/token` 换取 `access_token`（JWT），用这个 token 才能调用后续 API。

## 4. 核心接口：`POST /connect/token`

这是唯一一个“换 token”的接口，可用于：

1. 用户名 + 密码登录
2. refresh_token 刷新 access_token

### 4.1 请求 Header

```
Content-Type: application/x-www-form-urlencoded
```

请求体为表单格式（`key=value&key=value`），不是 JSON。

### 4.2 用户名密码登录（Password Grant）

请求体示例：

```
username=<uname>@<tenant_name>
&password=<user_pwd>
&grant_type=password
&client_id=<client_id>
&client_secret=<client_secret>
```

字段说明：

- `username`：用户名，格式强制为 `用户名@租户名`
- `password`：用户密码
- `grant_type=password`：密码登录
- `client_id`：API 客户端 ID（Shiji 给你的）
- `client_secret`：API 客户端密钥

默认密码规则：

- 若用户未设置密码，系统默认密码为 `noP@sw0rd`

### 4.3 Refresh Token 刷新

请求体示例：

```
grant_type=refresh_token
&client_id=<client_id>
&client_secret=<client_secret>
&refresh_token=<refreshToken>
```

重要提醒：

- refresh 可能不稳定，若刷新失败或无效，直接回退到“用户名 + 密码”重新登录。

## 5. Token 响应与过期判断

响应示例：

```json
{
  "access_token": "jwt_token",
  "refresh_token": "refresh_token",
  "expires_in": "secs"
}
```

字段说明：

- `access_token`：JWT 格式访问令牌
- `refresh_token`：用来刷新 access_token
- `expires_in`：access_token 有效期（秒）

过期判断两种方式：

- 使用 `expires_in` + 生成时间戳
- 解析 JWT 的 `exp` 字段

## 6. SDK 的 Token 缓存与刷新流程

### 6.1 第一次登录换 token

调用 `POST /connect/token` 获取 `access_token`、`refresh_token`、`expires_in`。

### 6.2 本地缓存

缓存以下内容：

- `access_token`
- `refresh_token`
- `expires_in`
- 生成 token 的时间戳

### 6.3 调用 API 前检查过期

- 当前时间 < 生成时间 + `expires_in` → 直接复用
- 过期 → 走 refresh

### 6.4 refresh 失败时回退

若 refresh 不成功或无效，回退到“用户名 + 密码”重新登录。

## 7. 请求时怎么带上身份

API 请求需带 Bearer Token：

```
Authorization: Bearer <access_token>
```

同时支持多物业场景，透传 `AC-Property-Id`：

```
AC-Property-Id: <property_id>
```

## 8. 如何获取可操作物业（Property）列表

SDK 可提供方法调用：

```
GET /permission-management/users/me/units
```

用于获取当前用户可操作的物业列表，供业务层选择 `AC-Property-Id`。

## 9. 枚举值（Enum）兼容建议

API 里很多字段是枚举值，官方会新增但不删旧值。

SDK 设计建议：

- 不要写死枚举列表
- 遇到未知值时保持兼容，允许透传

## 10. SDK 设计建议（模块划分）

可拆成几个模块：

- `AuthClient`：登录、刷新、缓存 token
- `TokenStore`：本地存储与过期判断
- `ApiClient`：统一封装请求，自动拼接 header
- `PropertyService`：查询可用物业列表

## 11. 生成后端相关程序的指令

当你要基于本规则生成后端程序（服务或 SDK）时，按以下指令执行：

0. 语言与运行环境：使用 Node.js；新建 `sdk` 目录，所有生成的代码与配置文件放在该目录下。
1. 生成配置模块：提供 `client_id`、`client_secret`、`username`、`password`、`base_url`、`tenant_id`（system user 可选）、`timeout` 等配置项。
2. 生成认证模块：实现 `POST /connect/token` 的密码登录与 refresh 流程，并内置过期判断与回退逻辑。
3. 生成缓存模块：实现 token 的存储、过期判断、并发安全（避免并发重复刷新）。
4. 生成请求模块：统一注入 `Authorization: Bearer <token>`，并支持按需注入 `AC-Property-Id`。
5. 生成错误处理：对 401/403/429 等状态码做分类处理，401 触发刷新或重登。
6. 生成可选接口：提供 `GET /permission-management/users/me/units` 作为物业列表查询能力。
7. 生成日志与链路：支持可选的 `AC-Correlation-ID` 透传与日志记录。
8. 生成测试用例：覆盖首次登录、刷新成功、刷新失败回退、过期复用、并发刷新等场景。

## 12. 一句话总结

这个 SDK 的核心就是：

- 用用户名@租户 + 密码 + client 凭证换 token
- 缓存并复用，过期再刷新
- refresh 失败则重新登录
- API 请求统一带 Bearer + AC-Property-Id

只要把这套流程封装好，就可以稳定对接 Shiji Enterprise Platform 的所有后续接口。
