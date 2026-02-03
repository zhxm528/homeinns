export type PrivateDomainMetricCard = {
  id: string;
  name: string;
  currentValue: string;
  target: string;
  trendLabel: string;
  trendValue: string;
  status: "good" | "warn" | "bad";
  detailUrl: string;
};

export type PrivateDomainOverview = {
  updatedAt: string;
  filters: {
    times: string[];
    dimensions: string[];
  };
  metrics: PrivateDomainMetricCard[];
  chain: {
    title: string;
    nodes: {
      id: string;
      label: string;
      value: string;
      target?: string;
      status?: "good" | "warn" | "bad";
    }[];
  };
};

export type PrivateDomainMetricDetail = {
  id: string;
  name: string;
  definition: string;
  formula: string;
  numerator: string;
  denominator: string;
  exclusions: string[];
  period: string;
  target: string;
  currentValue: string;
  yoy: string;
  mom: string;
  ranking: string;
  updatedAt: string;
  breakdown: {
    denominator: number;
    completed: number;
    pending: number;
    byStore: { name: string; value: number; target: number }[];
    byTime: { label: string; value: number }[];
    byGroup: { name: string; value: number }[];
  };
  trend: {
    dates: string[];
    values: number[];
    keyPoints: { date: string; label: string; note: string }[];
  };
  actionGuide: {
    actions: string[];
    scripts: string[];
    references: string[];
  };
};

export const privateDomainMetricsOverview: PrivateDomainOverview = {
  updatedAt: "2026-03-31 10:00",
  filters: {
    times: ["日", "周", "月", "Q1"],
    dimensions: ["集团", "区域", "门店"],
  },
  metrics: [
    {
      id: "metric-one",
      name: "企微每百人成功拉新",
      currentValue: "32.4",
      target: "35",
      trendLabel: "同比",
      trendValue: "+1.8%",
      status: "warn",
      detailUrl: "/cdp/private-domain-metrics/metric-one",
    },
    {
      id: "metric-two",
      name: "逸粉每百人成功拉新",
      currentValue: "26.2",
      target: "28",
      trendLabel: "同比",
      trendValue: "-0.6%",
      status: "warn",
      detailUrl: "/cdp/private-domain-metrics/metric-two",
    },
    {
      id: "metric-three",
      name: "逸扉小程序渠道间夜占比",
      currentValue: "15.8%",
      target: "17%",
      trendLabel: "排名",
      trendValue: "12/36",
      status: "warn",
      detailUrl: "/cdp/private-domain-metrics/metric-three",
    },
    {
      id: "metric-four",
      name: "金牛及以上逸粉本人预订且入住占比",
      currentValue: "9.1%",
      target: "10%",
      trendLabel: "排名",
      trendValue: "14/36",
      status: "warn",
      detailUrl: "/cdp/private-domain-metrics/metric-four",
    },
  ],
  chain: {
    title: "私域转化链路",
    nodes: [
      { id: "checkin", label: "入住人数", value: "52,460" },
      { id: "qy_add", label: "企微拉新率", value: "32%", target: "35%", status: "warn" },
      { id: "vip_add", label: "逸粉拉新率", value: "26%", target: "28%", status: "warn" },
      { id: "mini_app", label: "小程序预订占比", value: "15.8%", target: "17%", status: "warn" },
      { id: "gold_vip", label: "金牛及以上本人入住占比", value: "9.1%", target: "10%", status: "warn" },
    ],
  },
};

export const privateDomainMetricDetails: Record<string, PrivateDomainMetricDetail> = {
  "metric-one": {
    id: "metric-one",
    name: "指标一：企微每百人成功拉新",
    definition: "衡量门店在住店期间或离店当日，将可转化住客成功添加为门店企业微信的能力。",
    formula: "（成功拉新企微人数 ÷ 可拉新企微总人数）× 100",
    numerator: "考核有效期内成功添加门店企微的入住客人",
    denominator: "门店所有入住客人（剔除非身份证入住、已添加任意门店企微的客人）",
    exclusions: ["非身份证入住客人", "已添加任意门店企微的入住客人"],
    period: "入住期间或离店当天",
    target: "35",
    currentValue: "32.4",
    yoy: "+1.8%",
    mom: "-0.6%",
    ranking: "12 / 62",
    updatedAt: "2026-03-31 10:00",
    breakdown: {
      denominator: 12480,
      completed: 4046,
      pending: 8434,
      byStore: [
        { name: "华南二区-广州天河店", value: 41, target: 35 },
        { name: "华南二区-深圳福田店", value: 39, target: 35 },
        { name: "华北一区-北京朝阳店", value: 36, target: 35 },
        { name: "华北一区-天津和平店", value: 33, target: 35 },
        { name: "上海一区-虹桥店", value: 31, target: 35 },
      ],
      byTime: [
        { label: "入住办理", value: 54 },
        { label: "住中服务", value: 28 },
        { label: "离店当天", value: 18 },
      ],
      byGroup: [
        { name: "新客", value: 62 },
        { name: "回头客", value: 28 },
        { name: "协议客", value: 10 },
      ],
    },
    trend: {
      dates: ["03-18", "03-19", "03-20", "03-21", "03-22", "03-23", "03-24", "03-25", "03-26", "03-27", "03-28", "03-29", "03-30", "03-31"],
      values: [28, 30, 31, 33, 32, 34, 31, 35, 33, 32, 31, 34, 33, 32],
      keyPoints: [
        { date: "03-21", label: "峰值", note: "门店集中推送企微专属服务" },
        { date: "03-25", label: "回落", note: "前台排班减少导致引导下降" },
      ],
    },
    actionGuide: {
      actions: ["入住办理引导添加企微", "离店当天二次引导", "前台话术统一与抽检"],
      scripts: ["添加逸扉小助手，享专属服务与权益", "添加企微，快速开票"],
      references: ["入住办理", "离店引导"],
    },
  },
  "metric-two": {
    id: "metric-two",
    name: "指标二：逸粉每百人成功拉新",
    definition: "门店逸粉拉新（匹配P3入住人，考核店内住客在入住期间或离店当天是否注册逸粉）。",
    formula: "成功拉新逸粉人数 / 可拉新逸粉总人数 * 100",
    numerator: "成功拉新逸粉人数：可拉新逸粉总人数中，成功添加门店企微的入住客人",
    denominator: "可拉新逸粉总人数：门店所有客源入住客人（不含非身份证入住客人、入住客人中已注册逸粉的客人）",
    exclusions: ["非身份证入住客人", "入住客人中已注册逸粉的客人"],
    period: "入住期间或离店当天",
    target: "28",
    currentValue: "26.2",
    yoy: "-0.6%",
    mom: "+0.4%",
    ranking: "18 / 62",
    updatedAt: "2026-03-31 10:00",
    breakdown: {
      denominator: 11240,
      completed: 2944,
      pending: 8296,
      byStore: [
        { name: "华南二区-广州天河店", value: 33, target: 28 },
        { name: "华北一区-北京朝阳店", value: 30, target: 28 },
        { name: "上海一区-虹桥店", value: 27, target: 28 },
        { name: "华北一区-天津和平店", value: 26, target: 28 },
        { name: "华南一区-厦门思明店", value: 25, target: 28 },
      ],
      byTime: [
        { label: "入住办理", value: 48 },
        { label: "住中服务", value: 34 },
        { label: "离店当天", value: 18 },
      ],
      byGroup: [
        { name: "新客", value: 58 },
        { name: "回头客", value: 32 },
        { name: "协议客", value: 10 },
      ],
    },
    trend: {
      dates: ["03-18", "03-19", "03-20", "03-21", "03-22", "03-23", "03-24", "03-25", "03-26", "03-27", "03-28", "03-29", "03-30", "03-31"],
      values: [22, 24, 25, 26, 27, 26, 25, 28, 27, 26, 25, 26, 27, 26],
      keyPoints: [
        { date: "03-22", label: "提升", note: "入住办理集中引导注册" },
        { date: "03-28", label: "回稳", note: "住中服务触达保持稳定" },
      ],
    },
    actionGuide: {
      actions: ["引导注册逸粉并完成实名认证", "住中服务二次引导注册", "引导会员价权益说明"],
      scripts: ["注册即享会员价，离店可升级金牛", "小程序享智能服务、积分权益"],
      references: ["入住办理", "住中服务"],
    },
  },
  "metric-three": {
    id: "metric-three",
    name: "指标三：逸扉小程序渠道间夜占比",
    definition: "提高逸扉小程序渠道占比（预订维度）。",
    formula: "P3逸扉小程序渠道预订间夜数 / P3全渠道预订间夜数 * 100%",
    numerator: "P3逸扉小程序渠道预订间夜数：P3系统中，来源于逸扉小程序渠道的预订间夜数（不含退款和取消、不含非身份证预订）",
    denominator: "P3全渠道预订间夜数：P3系统中，门店所有渠道预订间夜总数（不含退款和取消、不含非身份证预订）",
    exclusions: ["非身份证预订", "退款订单", "取消订单"],
    period: "预订维度",
    target: "17%",
    currentValue: "15.8%",
    yoy: "+0.9%",
    mom: "-0.2%",
    ranking: "12 / 36",
    updatedAt: "2026-03-31 10:00",
    breakdown: {
      denominator: 38420,
      completed: 6070,
      pending: 32350,
      byStore: [
        { name: "华南二区-广州天河店", value: 19, target: 17 },
        { name: "华南二区-深圳福田店", value: 18, target: 17 },
        { name: "华北一区-北京朝阳店", value: 16, target: 17 },
        { name: "上海一区-虹桥店", value: 15, target: 17 },
        { name: "华北一区-天津和平店", value: 14, target: 17 },
      ],
      byTime: [
        { label: "新客首住", value: 44 },
        { label: "复购", value: 36 },
        { label: "商务回流", value: 20 },
      ],
      byGroup: [
        { name: "OTA 转化", value: 52 },
        { name: "协议转化", value: 28 },
        { name: "会员复购", value: 20 },
      ],
    },
    trend: {
      dates: ["03-18", "03-19", "03-20", "03-21", "03-22", "03-23", "03-24", "03-25", "03-26", "03-27", "03-28", "03-29", "03-30", "03-31"],
      values: [14, 15, 15, 16, 15, 16, 17, 16, 15, 15, 16, 17, 16, 15],
      keyPoints: [
        { date: "03-24", label: "触达提升", note: "小程序专属优惠推送集中" },
        { date: "03-30", label: "峰值", note: "离店关怀复购活动上线" },
      ],
    },
    actionGuide: {
      actions: ["推送小程序专属优惠", "引导用户完成小程序预订", "离店关怀提醒评价与复购"],
      scripts: ["小程序预订最低价、最高85折", "入住评价有礼，复购优惠"],
      references: ["预订引导", "离店关怀"],
    },
  },
  "metric-four": {
    id: "metric-four",
    name: "指标四：金牛及以上逸粉本人预订且入住占比",
    definition: "1、住店逸粉身份证完成绑定  2、增加逸粉渠道本人入住人数占比",
    formula: "P3金牛及以上本人预订且入住的逸粉人数 / P3全渠道预订人数 * 100",
    numerator: "P3金牛及以上本人预订且入住的逸粉人数：P3系统中，金牛及以上包含金牛、黑金和钻石本人本卡预订入住且离店的逸粉人数（不含退款和取消、不含非身份证预订人）",
    denominator: "P3全渠道预订人数：P3系统中，门店统计所有渠道预订人数总数（不含退款和取消、不含非身份证预订人）",
    exclusions: ["非身份证预订人", "退款订单", "取消订单"],
    period: "仅限逸扉小程序渠道",
    target: "10%",
    currentValue: "9.1%",
    yoy: "+0.6%",
    mom: "+0.1%",
    ranking: "14 / 36",
    updatedAt: "2026-03-31 10:00",
    breakdown: {
      denominator: 16240,
      completed: 1480,
      pending: 14760,
      byStore: [
        { name: "华南二区-广州天河店", value: 12, target: 10 },
        { name: "华北一区-北京朝阳店", value: 11, target: 10 },
        { name: "上海一区-虹桥店", value: 10, target: 10 },
        { name: "华南二区-深圳福田店", value: 9, target: 10 },
        { name: "华北一区-天津和平店", value: 8, target: 10 },
      ],
      byTime: [
        { label: "金牛会员", value: 62 },
        { label: "黑金会员", value: 26 },
        { label: "钻石会员", value: 12 },
      ],
      byGroup: [
        { name: "本人预订", value: 74 },
        { name: "代订", value: 26 },
      ],
    },
    trend: {
      dates: ["03-18", "03-19", "03-20", "03-21", "03-22", "03-23", "03-24", "03-25", "03-26", "03-27", "03-28", "03-29", "03-30", "03-31"],
      values: [8, 9, 9, 9, 10, 9, 9, 10, 9, 9, 9, 10, 9, 9],
      keyPoints: [
        { date: "03-22", label: "达标", note: "金牛会员专属权益提示" },
        { date: "03-29", label: "提升", note: "本人预订奖励积分活动" },
      ],
    },
    actionGuide: {
      actions: ["高等级会员权益提示", "引导本人小程序预订", "入住后回访二次转化"],
      scripts: ["本人预订可享专属积分与升级权益", "本人下单更快确认与开票"],
      references: ["会员运营", "预订引导"],
    },
  },
};
