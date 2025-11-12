# 前后台程序的执行规则说明
##核心功能
- 在前端页面上增加一个新的“生成科目配置SQL”按钮，点击按钮调用后台程序。
- 后台程序实现生成sql语句，并实现下载功能。
- 下载成功后，在页面上提示下载成功。
##补充说明
- 前端页面 src/app/product/dataconf/account-config-check/page.tsx 
- 后台程序 src/app/product/dataconf/account-config-check-makesql/route.ts 
- SQL语句示例：
sql
```
INSERT INTO [Report].[dbo].TransCodeConfig (hotelid, dept, deptname, class, descript, class1, descript1, sort) VALUES ('NY0023', 'fb', '餐饮收入', 'fb001', '餐厅一收入', '020010', '环翠咖啡厅', 10),
('NY0023', 'fb', '餐饮收入', 'fb001', '餐厅一收入', '020010', '环翠咖啡厅', 10);
```
- 前端页面传入表格数据和sql语句中属性的对应关系：
hotelid 酒店代码
dept 部门代码
deptname 部门名称
class 科目代码
descript 科目名称
class1 科目代码
descript1 科目名称
sort 自增数字
- 前端页面传入表格数据多行对应的sql语句中插入多行数据；