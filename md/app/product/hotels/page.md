# 核心功能
- 前台页面： /src/app/product/hotels/page.tsx
- 后台程序： /src/app/api/product/hotels/route.ts
- 每次执行任务后，需要检查前台页面，避免出现“Warning: [antd: Table] `index` parameter of `rowKey` function is deprecated. There is no guarantee that it will work as expected.”的错误。
- 每次执行完毕该md文件后，把"需要执行的内容"至"不需要执行的内容，忽略以下内容"之间区域的内容追加到文档最下面。

## 需要执行的内容
（暂无待执行任务）

## 不需要执行的内容，忽略以下内容
- 查询条件，页面加载时，“状态”默认选择“启用”，“是否删除”默认选择“正常”，“管理公司”默认选择“建国、南苑、云荟、京伦、诺金、诺岚、凯宾斯基”
- 在"产权类型分布"旁边增加一个echart的饼状图，按照 pmsType 分组统计酒店数量
- 饼状图显示在表格下方
- 增加一个echart的饼状图，按照 propertyType分组统计酒店数量
- 读取 /md/枚举值/城市.md 根据字段 ZipCode 转换显示 CityName 字段的内容
