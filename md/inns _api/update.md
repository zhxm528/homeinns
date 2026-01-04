# 核心功能
- 前端页面：`src/app/product/inns-api/product-api/page.tsx`
- 后端接口：`src/app/api/product/inns-api/product-api/route.ts`

## 需要执行的内容
- 接口返回的json数据是有内容的，但是接口返回的数据表格中没有显示数据

## 不需要执行的内容，忽略以下内容
- Terminal_License需要抽离到配置文件中
- 配置文件放在  `/app/lib/38/config.ts` 文件中
- 变量名 `baseUrl` 改名字为 `getProduct` ，以便未来还有多个接口的url
- 把返回的json字符串转换成表格的形式，在json格式上方显示