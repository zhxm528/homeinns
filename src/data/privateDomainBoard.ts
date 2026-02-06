export type PrivateDomainBoardDrill = {
  slug: string;
  title: string;
  module: string;
  summary: string;
};

export const privateDomainBoardDrills = [
  {
    slug: "member-acquisition",
    title: "会员拉新专题",
    module: "用户增长模块",
    summary: "聚焦会员拉新的起点，观察触达、转化与渠道贡献。",
  },
  {
    slug: "member-scale-growth-structure",
    title: "会员规模与增长结构",
    module: "用户增长模块",
    summary: "剖析会员存量与新增的结构性变化。",
  },
  {
    slug: "acquisition-efficiency-cost",
    title: "拉新效率与成本结构",
    module: "拉新效率模块",
    summary: "还原拉新投入产出，找到烧钱与性价比的边界。",
  },
  {
    slug: "qiyi-conversion-funnel",
    title: "企微拉新转化漏斗",
    module: "渠道结构模块",
    summary: "追踪企微渠道从触达到转化的关键节点。",
  },
  {
    slug: "web-mini-conversion",
    title: "官网 & 小程序转化专题",
    module: "渠道结构模块",
    summary: "对比官网与小程序的转化链路与趋势。",
  },
  {
    slug: "member-conversion-funnel",
    title: "会员转化漏斗",
    module: "交易转化模块",
    summary: "检视新会员是否能进入活跃交易阶段。",
  },
  {
    slug: "order-structure-member-contribution",
    title: "订单结构与会员贡献",
    module: "交易转化模块",
    summary: "评估会员订单在整体收入中的占比与趋势。",
  },
  {
    slug: "member-value-segmentation",
    title: "会员价值分层分析",
    module: "收入质量模块",
    summary: "识别高价值会员与潜力人群，构建分层策略。",
  },
  {
    slug: "channel-value-comparison",
    title: "渠道价值对比分析",
    module: "收入质量模块",
    summary: "比较官网与小程序的 ARPU 与投产表现。",
  },
] as const;

export type PrivateDomainBoardDrillSlug = (typeof privateDomainBoardDrills)[number]["slug"];

export type PrivateDomainInsightMetric = {
  id: string;
  title: string;
  dimension: string;
  indicatorName: string;
  representation: string;
  display: string;
  arrow?: string;
  bossFocus: string;
  formula: string;
  scope: string;
  drillSlug: PrivateDomainBoardDrillSlug;
  displayValue: string;
  trendLabel: string;
  trendDirection: "up" | "down" | "flat";
  periodComparison: string;
};

export type PrivateDomainInsightModule = {
  id: string;
  title: string;
  metrics: PrivateDomainInsightMetric[];
};

export const privateDomainInsightModules: PrivateDomainInsightModule[] = [
  {
    id: "user_growth",
    title: "用户增长模块",
        metrics: [
          {
            id: "new_members",
            title: "新增会员数",
            dimension: "定义",
            indicatorName: "新增会员数",
            representation: "数字 + 趋势箭头",
            display: "当前周期值 + 环比 / 同比 %",
            arrow: "↑ ↓ →",
            bossFocus: "增长有没有在发生？规模有没有扩大？",
            formula: "统计周期内新注册会员数（去重 user_id）",
            scope: "以会员注册时间为准",
            drillSlug: "member-acquisition",
            displayValue: "15,280",
            periodComparison: "环比 +4.8% · 同比 +12.2%",
            trendLabel: "+4.8%",
            trendDirection: "up",
          },
          {
            id: "member_growth_rate",
            title: "会员增长率",
            dimension: "定义",
            indicatorName: "会员增长率",
            representation: "百分比 + 趋势箭头",
            display: "当前值 + 同比 / 环比",
            arrow: "↑ ↓ →",
            bossFocus: "增长是在加速、放缓还是停滞？",
            formula: "(本期会员总数 − 上期会员总数) ÷ 上期会员总数",
            scope: "期末会员存量",
            drillSlug: "member-scale-growth-structure",
            displayValue: "18.4%",
            periodComparison: "同比 +3.2% · 环比 +0.7%",
            trendLabel: "+3.2%",
            trendDirection: "up",
          },
        ],
      },
  {
    id: "acquisition_efficiency",
    title: "拉新效率模块",
        metrics: [
          {
            id: "cac",
            title: "单客拉新成本（CAC）",
            dimension: "定义",
            indicatorName: "单客拉新成本（CAC）",
            representation: "金额 + 趋势箭头",
            display: "当前值 + 环比 / 同比",
            arrow: "↑ ↓ →",
            bossFocus: "这波增长是不是靠烧钱？值不值？",
            formula: "拉新相关营销费用 ÷ 新增会员数",
            scope: "仅包含可归因拉新费用（广告、企微人力等）",
            drillSlug: "acquisition-efficiency-cost",
            displayValue: "¥128",
            periodComparison: "环比 -1.8% · 同比 -5.4%",
            trendLabel: "-1.8%",
            trendDirection: "down",
          },
        ],
      },
  {
    id: "channel_structure",
    title: "渠道结构模块",
        metrics: [
          {
            id: "qiyi_share",
            title: "企微新增占比",
            dimension: "定义",
            indicatorName: "企微新增占比",
            representation: "百分比 + 趋势箭头",
            display: "当前值 + 环比 / 同比",
            arrow: "↑ ↓ →",
            bossFocus: "私域能力有没有变强？",
            formula: "企微渠道新增会员数 ÷ 新增会员总数",
            scope: "按会员首次来源渠道",
            drillSlug: "qiyi-conversion-funnel",
            displayValue: "36.8%",
            periodComparison: "环比 +2.1% · 同比 +5.7%",
            trendLabel: "+2.1%",
            trendDirection: "up",
          },
          {
            id: "web_mini_booking",
            title: "官网 & 小程序订房占比",
            dimension: "定义",
            indicatorName: "官网 & 小程序订房占比",
            representation: "百分比 + 趋势箭头",
            display: "当前值 + 环比 / 同比",
            arrow: "↑ ↓ →",
            bossFocus: "自有渠道有没有替代平台渠道？",
            formula: "官网 + 小程序订单量 ÷ 总订单量",
            scope: "订单创建渠道",
            drillSlug: "web-mini-conversion",
            displayValue: "41.2%",
            periodComparison: "环比 +1.4% · 同比 +8.3%",
            trendLabel: "+1.4%",
            trendDirection: "up",
          },
        ],
      },
  {
    id: "transaction_conversion",
    title: "交易转化模块",
        metrics: [
          {
            id: "member_conversion_rate",
            title: "会员转化率",
            dimension: "定义",
            indicatorName: "会员转化率",
            representation: "百分比 + 趋势箭头",
            display: "当前值 + 环比 / 同比",
            arrow: "↑ ↓ →",
            bossFocus: "新增会员是不是“真用户”？",
            formula: "产生过订单的会员数 ÷ 会员总数",
            scope: "历史累计口径",
            drillSlug: "member-conversion-funnel",
            displayValue: "24.6%",
            periodComparison: "环比 +0.3% · 同比 +1.7%",
            trendLabel: "+0.3%",
            trendDirection: "up",
          },
          {
            id: "member_order_share",
            title: "会员订单占比",
            dimension: "定义",
            indicatorName: "会员订单占比",
            representation: "百分比 + 趋势箭头",
            display: "当前值 + 环比 / 同比",
            arrow: "↑ ↓ →",
            bossFocus: "收入结构是否越来越健康？",
            formula: "会员订单量 ÷ 总订单量",
            scope: "订单归属会员身份",
            drillSlug: "order-structure-member-contribution",
            displayValue: "53.4%",
            periodComparison: "环比 +2.2% · 同比 +6.1%",
            trendLabel: "+2.2%",
            trendDirection: "up",
          },
        ],
      },
  {
    id: "revenue_quality",
    title: "收入质量模块",
        metrics: [
          {
            id: "member_arpu",
            title: "会员 ARPU",
            dimension: "定义",
            indicatorName: "会员 ARPU",
            representation: "金额 + 趋势箭头",
            display: "当前值 + 环比 / 同比",
            arrow: "↑ ↓ →",
            bossFocus: "会员是不是高价值人群？",
            formula: "会员交易金额 ÷ 有交易会员数",
            scope: "统计周期内",
            drillSlug: "member-value-segmentation",
            displayValue: "¥432",
            periodComparison: "环比 +3.1% · 同比 +9.2%",
            trendLabel: "+3.1%",
            trendDirection: "up",
          },
          {
            id: "web_mini_arpu",
            title: "官网 & 小程序 ARPU",
            dimension: "定义",
            indicatorName: "官网 & 小程序 ARPU",
            representation: "金额 + 趋势箭头",
            display: "当前值 + 环比 / 同比",
            arrow: "↑ ↓ →",
            bossFocus: "自有渠道赚不赚钱？",
            formula: "官网 + 小程序交易金额 ÷ 对应渠道下单用户数",
            scope: "按订单渠道",
            drillSlug: "channel-value-comparison",
            displayValue: "¥389",
            periodComparison: "环比 +1.6% · 同比 +4.8%",
            trendLabel: "+1.6%",
            trendDirection: "up",
          },
        ],
      },
];
