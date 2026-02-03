export type SidebarItem = {
  id: string;
  title: string;
  url: string;
  children?: SidebarItem[];
};

export type HeaderMenu = {
  id: string;
  title: string;
  url: string;
  order: number;
  sidebar?: SidebarItem[];
};

export const headerMenus: HeaderMenu[] = [
  {
    id: "home",
    title: "首页",
    url: "/",
    order: 1,
    sidebar: [],
  },
  {
    id: "promotion40",
    title: "促销4.0",
    url: "/c2",
    order: 1,
    sidebar: [
      {
        id: "promo_home",
        title: "促销首页",
        url: "/c2",
      },
      {
        id: "promo_overview",
        title: "促销总览",
        url: "/c2/dashboard",
        children: [
          { id: "promo_dashboard_group", title: "集团总览", url: "/c2/dashboard" },
          { id: "promo_dashboard_region", title: "区域总览", url: "/c2/region/dashboard" },
          { id: "promo_dashboard_hotel", title: "门店总览", url: "/c2/hotel/dashboard" },
        ],
      },
      {
        id: "promo_campaign",
        title: "活动管理",
        url: "/c2/campaigns",
        children: [
          { id: "promo_campaign_list", title: "活动列表", url: "/c2/campaigns" },
          { id: "promo_campaign_create", title: "创建活动", url: "/c2/campaigns/create" },
        ],
      },
      {
        id: "promo_execution",
        title: "报名与执行",
        url: "/c2/region/calendar",
        children: [
          { id: "promo_region_calendar", title: "区域日历", url: "/c2/region/calendar" },
          { id: "promo_region_control", title: "区域管控", url: "/c2/region/control" },
          { id: "promo_region_enroll", title: "区域报名明细", url: "/c2/region/enroll-status" },
          { id: "promo_hotel_calendar", title: "门店日历", url: "/c2/hotel/calendar" },
          { id: "promo_hotel_enroll", title: "门店报名", url: "/c2/hotel/enroll/demo" },
        ],
      },
      {
        id: "promo_floor",
        title: "价格与底限",
        url: "/c2/floors",
        children: [
          { id: "promo_price_forecast", title: "底限策略", url: "/c2/floors/price-forecast" },
          { id: "promo_system_config", title: "底限配置", url: "/c2/floors/system-config" },
        ],
      },
      {
        id: "promo_channel",
        title: "渠道管理",
        url: "/c2/channel",
        children: [
          { id: "promo_channel_subsidy", title: "补贴管理", url: "/c2/channel/subsidy" },
          { id: "promo_channel_throttle", title: "限流管理", url: "/c2/channel/throttle" },
          { id: "promo_channel_idle_house", title: "闲置房配置", url: "/c2/channel/idle-house" },
        ],
      },
      {
        id: "promo_analytics",
        title: "数据分析",
        url: "/c2/analytics",
        children: [
          { id: "promo_analytics_overview", title: "效果看板", url: "/c2/analytics" },
          { id: "promo_analytics_hotel", title: "门店看板", url: "/c2/analytics/hotel" },
        ],
      },
    ],
  },
  {
    id: "crs",
    title: "中央预订CRS",
    url: "/crs",
    order: 2,
    sidebar: [
      {
        id: "hotel_info",
        title: "酒店信息",
        url: "/crs/hotel-info",
        children: [
          { id: "hotel_detail", title: "酒店详情", url: "/crs/hotel-info/detail" },
        ],
      },
      {
        id: "hotel_room",
        title: "酒店房型",
        url: "/crs/room",
        children: [
          { id: "room_list", title: "房型列表", url: "/crs/room/list" },
          { id: "room_publish", title: "发布房型", url: "/crs/room/publish" },
        ],
      },
      {
        id: "hotel_rate",
        title: "酒店房价",
        url: "/crs/rate",
        children: [
          { id: "rate_code", title: "房价码", url: "/crs/rate/code" },
          { id: "rate_publish", title: "发布房价", url: "/crs/rate/publish" },
          { id: "availability", title: "可用性检查", url: "/crs/rate/availability" },
          { id: "best_rate_group", title: "最优价组", url: "/crs/rate/best-group" },
          { id: "best_rate_price", title: "最优价价格设置", url: "/crs/rate/best-price" },
          { id: "threshold_rate", title: "酒店门槛价", url: "/crs/rate/threshold" },
        ],
      },
      {
        id: "hotel_channel",
        title: "酒店渠道",
        url: "/crs/channel",
        children: [
          { id: "channel_list", title: "渠道列表", url: "/crs/channel/list" },
          { id: "channel_params", title: "渠道参数", url: "/crs/channel/params" },
          { id: "channel_publish", title: "发布渠道", url: "/crs/channel/publish" },
        ],
      },
      {
        id: "order_management",
        title: "订单管理",
        url: "/crs/order",
        children: [{ id: "order_query", title: "订单查询", url: "/crs/order/query" }],
      },
      {
        id: "hotel_finance",
        title: "酒店财务",
        url: "/crs/finance",
        children: [
          { id: "hotel_accounts", title: "酒店账项", url: "/crs/finance/accounts" },
          { id: "account_config_check", title: "科目配置", url: "/product/dataconf/account-config-check" },
          { id: "bi_guest_history_diff_check", title: "BI和客史差异检查", url: "/product/dataconf/bi-guest-history-diff-check" },
          { id: "bi_guest_history_market_diff_check", title: "BI和客史市场差异检查", url: "/product/dataconf/bi-guest-history-market-diff-check" },
        ],
      },
    ],
  },
  {
    id: "cdp",
    title: "数据CDP",
    url: "/cdp",
    order: 3,
    sidebar: [
      {
        id: "data_assets",
        title: "数据资产",
        url: "/cdp/assets",
        children: [
          { id: "asset_overview", title: "资产概览", url: "/cdp/assets/overview" },
          { id: "customer_assets", title: "客户资产", url: "/cdp/assets/customer" },
          { id: "entity_assets", title: "实体资产", url: "/cdp/assets/entity" },
          { id: "attribution_board", title: "归因看板", url: "/cdp/assets/attribution-board" },
          { id: "all_domain_customer", title: "全域客户", url: "/cdp/assets/all-domain-customer" },
          { id: "leads_management", title: "线索管理", url: "/cdp/assets/leads" },
        ],
      },
      {
        id: "business_board",
        title: "业务看板",
        url: "/cdp/boards",
        children: [
          { id: "overall_analysis", title: "总体分析", url: "/cdp/boards/overall" },
          { id: "realtime_analysis", title: "实时分析", url: "/cdp/boards/realtime" },
          { id: "new_user_analysis", title: "新用户分析", url: "/cdp/boards/new-users" },
          { id: "activity_analysis", title: "活跃度分析", url: "/cdp/boards/activity" },
          { id: "retention_rate", title: "留存率分析", url: "/cdp/boards/retention-rate" },
          { id: "page_analysis", title: "页面分析", url: "/cdp/boards/page" },
          { id: "channel_analysis", title: "渠道分析", url: "/cdp/boards/channel" },
          { id: "device_analysis", title: "设备分析", url: "/cdp/boards/device" },
          { id: "event_analysis", title: "事件分析", url: "/cdp/boards/event" },
          { id: "retention_analysis", title: "留存分析", url: "/cdp/boards/retention" },
          { id: "funnel_analysis", title: "漏斗分析", url: "/cdp/boards/funnel" },
          { id: "distribution_analysis", title: "分布分析", url: "/cdp/boards/distribution" },
          { id: "rfm_analysis", title: "RFM分析", url: "/cdp/boards/rfm" },
          { id: "attribution_analysis", title: "归因分析", url: "/cdp/boards/attribution" },
          { id: "lifecycle_analysis", title: "生命周期分析", url: "/cdp/boards/lifecycle" },
          { id: "path_analysis", title: "路径分析", url: "/cdp/boards/path" },
          { id: "hot_product_analysis", title: "热门商品分析", url: "/cdp/boards/hot-products" },
          { id: "search_analysis", title: "搜索功能分析", url: "/cdp/boards/search" },
          { id: "product_conversion", title: "商品转化分析", url: "/cdp/boards/product-conversion" },
          { id: "store_operation", title: "门店运营分析", url: "/cdp/boards/store-operation" },
        ],
      },
      {
        id: "data_management",
        title: "数据管理",
        url: "/cdp/data",
        children: [
          { id: "metric_management", title: "指标管理", url: "/cdp/data/metrics" },
          { id: "behavior_log", title: "行为日志", url: "/cdp/data/behavior-log" },
          { id: "data_validation", title: "数据校验", url: "/cdp/data/validation" },
          { id: "data_threshold", title: "数据阈值", url: "/cdp/data/threshold" },
          { id: "data_export", title: "数据导出", url: "/cdp/data/export" },
        ],
      },
      {
        id: "private_domain_metrics",
        title: "私域指标",
        url: "/cdp/private-domain-metrics",
        children: [
          { id: "private_domain_overview", title: "私域指标总览", url: "/cdp/private-domain-metrics/overview" },
          { id: "private_domain_metric_one", title: "企微每百人成功拉新", url: "/cdp/private-domain-metrics/metric-one" },
          { id: "private_domain_metric_two", title: "逸粉每百人成功拉新", url: "/cdp/private-domain-metrics/metric-two" },
          { id: "private_domain_metric_three", title: "小程序渠道间夜占比", url: "/cdp/private-domain-metrics/metric-three" },
          { id: "private_domain_metric_four", title: "金牛及以上逸粉本人预订且入住占比", url: "/cdp/private-domain-metrics/metric-four" },
        ],
      },
    ],
  },
  {
    id: "ma",
    title: "营销MA",
    url: "/ma",
    order: 4,
    sidebar: [
      {
        id: "marketing_plan",
        title: "营销计划",
        url: "/ma/plan",
        children: [
          { id: "campaign_management", title: "活动管理", url: "/ma/plan/campaigns" },
          { id: "campaign_calendar", title: "活动日历", url: "/ma/plan/calendar" },
          { id: "marketing_board", title: "营销看板", url: "/ma/plan/board" },
          { id: "hot_events", title: "热点事件", url: "/ma/plan/hot-events" },
        ],
      },
      {
        id: "marketing_touch",
        title: "营销触达",
        url: "/ma/touch",
        children: [
          { id: "task_overview", title: "任务概览", url: "/ma/touch/tasks" },
          { id: "auto_flow_task", title: "自动流任务", url: "/ma/touch/auto-flow" },
          { id: "auto_flow_template", title: "自动流模版", url: "/ma/touch/auto-flow-template" },
          { id: "sms_template", title: "短信模版", url: "/ma/touch/sms-template" },
          { id: "mini_program_subscription", title: "小程序订阅消息", url: "/ma/touch/mini-program-subscription" },
          { id: "email_template", title: "邮件模版", url: "/ma/touch/email-template" },
          { id: "short_link", title: "短链接", url: "/ma/touch/short-link" },
        ],
      },
      {
        id: "coupon_management",
        title: "优惠券管理",
        url: "/ma/coupon",
        children: [
          { id: "coupon", title: "优惠券", url: "/ma/coupon/list" },
          { id: "coupon_detail", title: "券明细", url: "/ma/coupon/detail" },
        ],
      },
    ],
  },
  {
    id: "pa",
    title: "画像PA",
    url: "/pa",
    order: 5,
    sidebar: [
      { id: "tag_management", title: "标签管理", url: "/pa/tags" },
      { id: "customer_segment", title: "客户分群", url: "/pa/segments" },
      { id: "common_audience", title: "常用人群", url: "/pa/audience" },
      { id: "customer_profile", title: "客户画像", url: "/pa/profile" },
    ],
  },
  {
    id: "scrm",
    title: "企微SCRM",
    url: "/scrm",
    order: 5,
    sidebar: [
      {
        id: "data_board",
        title: "数据看板",
        url: "/scrm/boards",
        children: [
          { id: "data_overview", title: "数据总览", url: "/scrm/boards/overview" },
          { id: "qy_need_increment", title: "企微需求增量报表", url: "/scrm/boards/qy-need-increment" },
          { id: "qy_friend_data", title: "企微好友数据报表", url: "/scrm/boards/qy-friend-data" },
          { id: "qy_room_distribution", title: "企微客房分销数据报表", url: "/scrm/boards/qy-room-distribution" },
          {
            id: "qy_new_retail_distribution",
            title: "企微新零售分销数据报表",
            url: "/scrm/boards/qy-new-retail-distribution",
          },
          { id: "qy_commission_withdraw", title: "企微佣金提现数据报表", url: "/scrm/boards/qy-commission-withdraw" },
          { id: "qy_withdraw_signing", title: "企微提现签约明细报表", url: "/scrm/boards/qy-withdraw-signing" },
          { id: "qy_material_template", title: "企微素材&模板报表", url: "/scrm/boards/qy-material-template" },
          { id: "qy_process_push", title: "企微全流程推送报表", url: "/scrm/boards/qy-process-push" },
          { id: "single_store_vip_summary", title: "单店VIP满意度汇总报表", url: "/scrm/boards/single-store-vip-summary" },
          { id: "qy_poster_material", title: "企微海报素材报表", url: "/scrm/boards/qy-poster-material" },
          { id: "new_retail_poster_material", title: "新零售海报素材报表", url: "/scrm/boards/new-retail-poster-material" },
          { id: "single_store_vip_data", title: "单店VIP数据报表", url: "/scrm/boards/single-store-vip-data" },
          { id: "task_execution_rate", title: "任务执行率看板", url: "/scrm/boards/task-execution-rate" },
          { id: "qy_task_detail", title: "企微任务明细报表", url: "/scrm/boards/qy-task-detail" },
          { id: "single_store_material_ai", title: "单店素材智选看板", url: "/scrm/boards/single-store-material-ai" },
          { id: "brand_campaign", title: "品牌宣传活动报表", url: "/scrm/boards/brand-campaign" },
        ],
      },
      {
        id: "customer_management",
        title: "客户管理",
        url: "/scrm/customers",
        children: [
          { id: "qy_customer_management", title: "企微客户管理", url: "/scrm/customers/qy-management" },
          { id: "qy_lost_customer", title: "企微流失客户", url: "/scrm/customers/qy-lost" },
          { id: "all_domain_customer", title: "全域客户管理", url: "/scrm/customers/all-domain" },
          { id: "qy_customer_group", title: "企微客户群", url: "/scrm/customers/qy-groups" },
          { id: "qy_customer_tag", title: "企微标签", url: "/scrm/customers/qy-tags" },
          { id: "customer_tag", title: "客户标签", url: "/scrm/customers/tags" },
          { id: "customer_group_tag", title: "客户群标签", url: "/scrm/customers/group-tags" },
          { id: "job_inheritance", title: "在职继承", url: "/scrm/customers/in-service-inheritance" },
          { id: "resign_inheritance", title: "离职继承", url: "/scrm/customers/resign-inheritance" },
        ],
      },
      {
        id: "acquire_customers",
        title: "获客拉新",
        url: "/scrm/acquisition",
        children: [
          { id: "staff_qr", title: "员工活码", url: "/scrm/acquisition/staff-qr" },
          { id: "group_qr", title: "客户群活码", url: "/scrm/acquisition/group-qr" },
          { id: "identify_qr", title: "识客活码", url: "/scrm/acquisition/identify-qr" },
          { id: "store_qr", title: "门店活码", url: "/scrm/acquisition/store-qr" },
          { id: "qr_link", title: "活码链接", url: "/scrm/acquisition/qr-link" },
        ],
      },
      {
        id: "marketing_conversion",
        title: "营销转化",
        url: "/scrm/marketing",
        children: [
          { id: "mass_customers", title: "群发客户", url: "/scrm/marketing/mass-customers" },
          { id: "mass_groups", title: "群发客户群", url: "/scrm/marketing/mass-groups" },
          { id: "mass_moments", title: "群发朋友圈", url: "/scrm/marketing/mass-moments" },
          { id: "follow_task", title: "跟进任务", url: "/scrm/marketing/follow-task" },
          { id: "marketing_auto_flow", title: "自动流任务", url: "/scrm/marketing/auto-flow" },
        ],
      },
      {
        id: "task_center",
        title: "任务中心",
        url: "/scrm/tasks",
        children: [
          { id: "task_center_list", title: "任务中心列表", url: "/scrm/tasks/list" },
          { id: "task_center_report", title: "任务中心数据报表", url: "/scrm/tasks/report" },
        ],
      },
      {
        id: "content_center",
        title: "内容中心",
        url: "/scrm/content",
        children: [
          { id: "material_library", title: "素材库", url: "/scrm/content/materials" },
          { id: "material_combine", title: "素材组合", url: "/scrm/content/combine" },
          { id: "material_tags", title: "素材标签", url: "/scrm/content/tags" },
          { id: "poster_management", title: "海报管理", url: "/scrm/content/posters" },
        ],
      },
      {
        id: "scrm_coupon",
        title: "优惠券",
        url: "/scrm/coupons",
        children: [
          { id: "single_store_coupon", title: "单店券活动", url: "/scrm/coupons/single-store" },
          { id: "single_store_audience", title: "单店人群活动", url: "/scrm/coupons/single-store-audience" },
          { id: "city_coupon", title: "城市券活动", url: "/scrm/coupons/city" },
          { id: "new_retail_coupon", title: "新零售优惠券活动", url: "/scrm/coupons/new-retail" },
          { id: "single_store_coupon_report", title: "单店券报表", url: "/scrm/coupons/single-store-report" },
          { id: "single_store_audience_report", title: "单店人群管理报表", url: "/scrm/coupons/single-store-audience-report" },
          { id: "city_coupon_report", title: "城市券报表", url: "/scrm/coupons/city-report" },
        ],
      },
      {
        id: "single_store_activity",
        title: "单店活动",
        url: "/scrm/activities",
        children: [
          { id: "coupon_activity", title: "领券活动", url: "/scrm/activities/coupon" },
          { id: "poster_activity", title: "海报活动", url: "/scrm/activities/poster" },
          { id: "hotel_template", title: "酒店模板", url: "/scrm/activities/hotel-template" },
          { id: "activity_management", title: "活动管理", url: "/scrm/activities/management" },
        ],
      },
      {
        id: "statistics",
        title: "统计分析",
        url: "/scrm/statistics",
        children: [
          { id: "customer_acquisition_stats", title: "客户拉新统计", url: "/scrm/statistics/customer-acquisition" },
          { id: "group_acquisition_stats", title: "客户群拉新统计", url: "/scrm/statistics/group-acquisition" },
          { id: "group_stats", title: "客户群统计", url: "/scrm/statistics/group" },
          { id: "mass_task_stats", title: "群发任务统计", url: "/scrm/statistics/mass-task" },
          { id: "material_stats", title: "素材统计", url: "/scrm/statistics/material" },
        ],
      },
      {
        id: "marketing_config",
        title: "营销配置",
        url: "/scrm/config",
        children: [
          { id: "friend_welcome", title: "好友欢迎语", url: "/scrm/config/friend-welcome" },
          { id: "group_welcome", title: "入群欢迎语", url: "/scrm/config/group-welcome" },
          { id: "qy_sidebar", title: "企微侧边栏", url: "/scrm/config/qy-sidebar" },
          { id: "friend_relation", title: "好友关系设置", url: "/scrm/config/friend-relation" },
          { id: "mobile_detail", title: "移动客户端详情", url: "/scrm/config/mobile-detail" },
        ],
      },
    ],
  },
  {
    id: "tools",
    title: "工具",
    url: "/tools",
    order: 6,
    sidebar: [
      {
        id: "c3",
        title: "C3",
        url: "/tools/c3",
        children: [
          { id: "c3_hotel_list", title: "高星酒店列表", url: "/tools/c3/high-star-hotels" },
        ],
      },
      {
        id: "c2",
        title: "C2",
        url: "/tools/c2",
        children: [
          { id: "c2_hotel_list", title: "经济型酒店列表", url: "/tools/c2/economy-hotels" },
        ],
      },
    ],
  },
];

export const headerMenuList = headerMenus
  .slice()
  .sort((a, b) => a.order - b.order);

export const headerMenuById = (id: string) =>
  headerMenus.find((menu) => menu.id === id);
