import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    summary: {
      totalAssets: 12846,
      totalCustomers: 8240,
      totalEntities: 4606,
      dailyEvents: 21534,
      updatedAt: "2025-01-09 10:20",
    },
    categories: [
      { id: "customer", name: "客户资产", count: 8240, trend: "近7日 +3.4%" },
      { id: "entity", name: "实体资产", count: 4606, trend: "近7日 +1.8%" },
      { id: "behavior", name: "行为资产", count: 1580, trend: "近7日 +4.2%" },
      { id: "product", name: "产品资产", count: 1260, trend: "近7日 +2.1%" },
      { id: "channel", name: "渠道资产", count: 1160, trend: "近7日 +1.2%" },
    ],
    overviewCards: [
      {
        id: "customer",
        title: "客户总数",
        value: 161580,
        subItems: [
          { label: "昨日新增客户", value: 1 },
          { label: "昨日活跃客户", value: 13 },
        ],
      },
      {
        id: "tag",
        title: "启用标签数/标签总数",
        value: "339 / 342",
        subItems: [
          { label: "已用标签", value: 753 },
          { label: "剩余标签", value: 4247 },
          { label: "已用标签值", value: 4476 },
          { label: "剩余标签值", value: 15524 },
        ],
      },
      {
        id: "segment",
        title: "启用分群数/分群总数",
        value: "1,063 / 1,066",
        subItems: [
          { label: "已用分群", value: 1275 },
          { label: "剩余分群", value: 4725 },
        ],
      },
    ],
    trend: {
      summary: [
        { label: "过去7天新增客户", value: 12, change: -88.35 },
        { label: "过去30天新增客户", value: 216, change: 517.14 },
        { label: "过去7天活跃客户", value: 58, change: 163.64 },
        { label: "过去30天活跃客户", value: 107, change: -85.34 },
      ],
      range: { start: "2025-12-16", end: "2026-01-14" },
      dates: [
        "12-16","12-17","12-18","12-19","12-20","12-21","12-22","12-23","12-24","12-25",
        "12-26","12-27","12-28","12-29","12-30","12-31","01-01","01-02","01-03","01-04",
        "01-05","01-06","01-07","01-08","01-09","01-10","01-11","01-12","01-13","01-14",
      ],
      series: [
        {
          name: "每日新增客户数",
          data: [2,5,3,45,6,4,12,6,8,2,26,1,1,4,6,1,3,1,2,2,1,98,2,1,1,1,0,0,12,3],
        },
        {
          name: "每日活跃客户数",
          data: [10,22,25,9,4,5,12,30,8,4,2,1,1,6,8,1,5,2,4,4,14,2,4,2,35,1,0,10,16,14],
        },
      ],
    },
    distribution: {
      title: "客户分布",
      unit: "客户身份",
      items: [
        { name: "手机号（md5加密）", value: 93820 },
        { name: "手机号", value: 51240 },
        { name: "微信unionID", value: 15839 },
        { name: "微信公众号OpenID", value: 14980 },
        { name: "企业微信外部联系人ID", value: 1820 },
        { name: "匿名访客ID", value: 760 },
        { name: "微信小程序OpenID", value: 420 },
        { name: "业务账号", value: 210 },
        { name: "邮箱", value: 80 },
        { name: "会员卡号", value: 36 },
      ],
    },
  });
}
