export interface MenuItem {
  name: string;
  href?: string;
  children?: MenuItem[];
}

export const menuData: MenuItem[] = [
  {
    name: '酒店基础信息',
    children: [
      { name: '酒店列表', href: '/product/hotels' },
      { name: '酒店房型', href: '/product/hotels/room-types' },
      { name: '酒店包价', href: '/product/hotels/package-price' },
      { name: '酒店渠道', href: '/product/hotels/hotel-channels' },
    ],
  },
  {
    name: '携程接口',
    children: [
      { name: 'hotelInfoSearch 酒店查询', href: '/product/ctrip/hotelInfoSearch' },
      { name: 'masterRoomInfoSearch 母房型查询', href: '/product/ctrip/masterRoomInfoSearch' },
      { name: 'mappingInfoSearch 映射信息查询', href: '/product/ctrip/mappingInfoSearch' },
      { name: 'mappingInfoSet 映射信息设置', href: '/product/ctrip/mappingInfoSet' },
    ],
  },
  {
    name: '如家接口',
    children: [{ name: '产品接口', href: '/product/inns-api/product-api' }],
  },
  {
    name: '收益管理',
    children: [
      { name: '价格管理', href: '/product/revenue-management/price-management' },
      { name: '可用性检查', href: '/product/revenue-management/availability-check' },
    ],
  },
  {
    name: '订单管理',
    children: [
      { name: '酒店客史订单', href: '/product/order-management/hotel-guest-history-order' },
      { name: '渠道订单', href: '/product/order-management/channel-order' },
    ],
  },
  {
    name: '产量报表',
    children: [
      { name: '房价码产量报表', href: '/report/ratecode/productreport' },
      { name: '渠道月产量', href: '/product/business-analysis/channel-monthly-production' },
      { name: '酒店渠道细分', href: '/product/report-analysis/hotel-channel-segmentation' },
      { name: '手工填报月报', href: '/product/report-analysis/manual-monthly-report' },
      { name: '渠道试单下单率报表', href: '/product/report-analysis/channel-trial-order-rate' },
    ],
  },
  {
    name: '数据配置',
    children: [
      { name: '房价码分组', href: '/product/dataconf/ratecodegroup' },
      { name: '检查RateCode是否发布', href: '/report/ratecode/checkpublish' },
      { name: '科目配置检查', href: '/product/dataconf/account-config-check' },
      { name: 'BI和客史差异检查', href: '/product/dataconf/bi-guest-history-diff-check' },
      { name: 'BI和客史市场差异检查', href: '/product/dataconf/bi-guest-history-market-diff-check' },
    ],
  },
  {
    name: '逸扉报表',
    children: [
      { name: '渠道预订周期统计表', href: '/product/yifei/channel-booking-cycle' },
      { name: '国家月统计报表', href: '/product/yifei/country-month-statistics' },
      { name: '销售分析(房型)报表', href: '/product/yifei/sales-analysis-roomtype' },
      { name: '自助机使用统计报表', href: '/product/yifei/selfservice-usage-statistics' },
      { name: '抖音加价差异订单', href: '/product/yifei/douyin-price-diff-order' },
      { name: '渠道订单', href: '/product/yifei/channel-order' },
    ],
  },
  {
    name: '经营分析',
    children: [
      { name: '经营日报', href: '/product/business-analysis/daily-report' },
      { name: '每日消费明细', href: '/product/business-analysis/daily-consumption-detail' },
      { name: '经营数据自然月报', href: '/product/report-analysis/business-data-monthly-report' },
    ],
  },
];
