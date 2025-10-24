#酒店列表查询数据
##查询条件
- 基础查询条件
```
GroupCode IN ('JG','JL','NY','NH','NI','KP')
```
- 其他查询条件
```
HotelCode 模糊查询
HotelName 模糊查询
GroupCode 下拉框多选
HotelType 下拉框多选
PropertyType 下拉框多选
PMSType 下拉框多选
Status checkbox
IsDelete checkbox
```


##查询列
```
HotelCode 酒店编号
HotelName 酒店名称
GroupCode 管理公司 需要用枚举转换显示
HotelType 酒店类型 需要用枚举转换显示
PropertyType 产权类型 需要用枚举转换显示
PMSType PMS类型 需要用枚举转换显示
Status 状态
IsDelete 是否删除
```

##HotelType 酒店类型的枚举
```
H002 托管
H003 加盟
H004 直营/全委
```

##PropertyType 产权类型的枚举
```
BZ 北展
FCQD 非产权店
SJJT 首酒集团
SLJT 首旅集团
SLZY 首旅置业
SFT 首副通
```

##PMSType PMS类型的枚举
```
Cambridge 康桥
Opera 手工填报
P3 如家P3
Soft 软连接
X6 西软X6
XMS 西软XMS
```


##GroupCode 管理公司的枚举
```
JG 建国
JL 京伦
NY 南苑
NH 云荟
NI 诺金
NU 诺岚
KP 凯宾斯基
YF 逸扉
WX 万信
```

##Status 状态的枚举
```
1 启用
0 停用
空或者null 全部
```
##IsDelete 是否删除标记的枚举
```
1 已删除
0 正常
空或者null 全部
```


##列表显示排序
- 第一排序： GroupCode 按字母顺序从小到大
- 第二排序： hotelCode 按字母顺序从小到大

##页面右上角和右下角添加 返回 按钮 支持返回到 app/product/page.tsx 页面