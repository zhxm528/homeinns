-- =====================================================================
-- 酒店房价码表 (PostgreSQL)
-- 表名：public.hotel_rate_code
-- 说明：
-- 1) 按你给的字段规格建表（SQL Server -> PG 映射）
--    - bigint identity -> bigserial
--    - varchar(n) -> varchar(n)
--    - datetime(3) -> timestamptz(3)
--    - bit -> boolean
--    - nvarchar -> text（PG 原生 Unicode，无需 nvarchar）
--    - “Chinese_PRC_CI_AS”：PG 无法等价列级 collation，此处使用库默认
-- 2) 你给的 RoomTypeCode 长度500（通常是逗号分隔列表）；DBA建议用 jsonb 结构化存一份（补充字段）
-- 3) 补充一些行业必备字段：早餐/取消/担保/支付/税费口径/是否可售/渠道适用等
-- =====================================================================

DROP TABLE IF EXISTS public.hotel_rate_code CASCADE;

CREATE TABLE public.hotel_rate_code (
  -- -------------------------
  -- 原字段（按你提供）
  -- -------------------------
  id                      bigserial PRIMARY KEY,            -- ID（identity）

  hotel_code              varchar(10)  NOT NULL,            -- HotelCode
  rate_code               varchar(10)  NOT NULL,            -- RateCode
  cate_code               varchar(10)  NOT NULL,            -- CateCode（价格码分类/大类）

  rate_code_name          varchar(500) NOT NULL,            -- RateCodeName（中文名称）

  begin_date              timestamptz(3) NOT NULL,          -- BeginDate（生效开始）
  end_date                timestamptz(3) NOT NULL,          -- EndDate（生效结束）

  min_los                 integer NOT NULL,                 -- MinLos（最少连住晚数）
  max_los                 integer NOT NULL,                 -- MaxLos（最多连住晚数）

  min_adv_bookin          integer NOT NULL,                 -- MinAdvBookin（最少提前预订天数）
  max_adv_bookin          integer NOT NULL,                 -- MaxAdvBookin（最多提前预订天数）

  market                  varchar(200) NULL,                -- Market（市场细分/客源市场）
  sources                 varchar(200) NULL,                -- Sources（来源/渠道来源）

  room_type_code          varchar(500) NOT NULL,            -- RoomTypeCode（适用房型码列表：常见为逗号分隔）

  is_price                integer NULL,                     -- IsPrice（是否有价/是否价格码；历史口径）
  rate_group              integer NULL,                     -- RateGroup（价格组；历史口径）

  short_info              varchar(500) NULL,                -- ShortInfo（短说明）
  long_info               varchar(5000) NULL,               -- LongInfo（长说明/政策说明）

  is_allow_down           integer NULL,                     -- IsAllowDown（是否允许降价/下调；历史口径）
  sort                    integer NULL,                     -- Sort（排序）

  is_delete               integer NULL,                     -- IsDelete（是否删除）

  rate_grouping           varchar(500) NULL,                -- RateGrouping（分组标签/分组规则文本）
  hour_nums               varchar(10)  NULL,                -- HourNums（钟点房小时数/计费小时）

  check_begin_date        timestamptz(3) NULL,              -- CheckBeginDate（可入住/可检索开始）
  check_end_date          timestamptz(3) NULL,              -- CheckEndDate（可入住/可检索结束）

  sl_enable               varchar(50)  NULL,                -- SLEnable（疑似“散客/协议/特殊开关”，建议字典化）
  rate_code_display_name  varchar(500) NULL,                -- RateCodeDisplayName（展示名）

  xms_sync_switch         integer NULL,                     -- XMSSyncSwitch（与外部系统同步开关）

  is_enable_dp            boolean NOT NULL DEFAULT false,   -- IsEnableDP（bit，默认0）
  is_cy_price             boolean NULL,                     -- IsCYPrice（bit，含义依业务）

  type_code               varchar(10)  NULL,                -- TypeCode（类型码）
  rate_code_en_name       varchar(100) NULL,                -- RateCodeEnName（英文名）

  resflag                 varchar(20)  NULL,                -- Resflag（预订标记/限制标记）
  priv                    varchar(10)  NULL,                -- Priv（权限/私有标记：如仅内部/会员等）

  check_in_begin_time     timestamptz(3) NULL,              -- CheckInBeginTime（允许入住开始时间）
  check_in_end_time       timestamptz(3) NULL,              -- CheckInEndTime（允许入住结束时间）

  commission_code         varchar(100) NULL,                -- CommissionCode（佣金码/佣金政策码）

  is_multi_price          boolean NULL,                     -- IsMultiPrice（是否多价格：如多成人价/多梯度）
  rate_check              boolean NULL,                     -- RateCheck（是否需要审核/二次确认）

  rate_note               text NULL,                        -- RateNote（原 nvarchar(100)，PG用text）
  team_note               varchar(500) NULL,                -- TeamNote（团队说明）
  team_note_en            varchar(500) NULL,                -- TeamNoteEn（团队英文说明）

  begin_time              varchar(10)  NULL,                -- BeginTime（每日开始售卖时间，如"08:00"）
  end_time                varchar(10)  NULL,                -- EndTime（每日结束售卖时间，如"23:00"）

  rate_secret             varchar(1)   NULL,                -- RateSecret（保密/私密价标识，如Y/N）

  week_control            varchar(20)  NULL,                -- WeekControl（周几控制：如1111100）
  continuous_week_control varchar(20)  NULL,                -- ContinuousWeekControl（连续周控制：按周段规则）

  -- -------------------------
  -- DBA经验补充：行业必备字段
  -- -------------------------
  rate_status             varchar(50)  NOT NULL DEFAULT 'active',  -- 可售状态：active/hidden/inactive
  currency_code           char(3)      NULL,                       -- 币种（ISO 4217）
  tax_included            boolean      NULL,                       -- 价格是否含税（口径非常关键）
  service_fee_included    boolean      NULL,                       -- 是否含服务费

  breakfast_type          varchar(50)  NULL,                       -- 早餐类型：none/1/2/buffet等（最终以rate plan为准）
  breakfast_qty           smallint     NULL,                       -- 默认含早份数（常见=入住人数或固定）
  is_refundable           boolean      NULL,                       -- 是否可退（强业务字段）
  cancel_policy_code      varchar(50)  NULL,                       -- 取消政策码（结构化规则建议单独表）
  guarantee_type          varchar(50)  NULL,                       -- 担保类型：none/credit_card/prepay
  payment_type            varchar(50)  NULL,                       -- 支付类型：pay_at_hotel/prepay/partial

  min_price               numeric(18,2) NULL,                      -- 价格码最小价（可选：用于列表/校验，实际价格在价表）
  max_price               numeric(18,2) NULL,                      -- 价格码最大价（可选：用于校验/异常检测）

  applicable_channels     jsonb        NULL,                       -- 适用渠道（结构化：channel codes）
  applicable_markets      jsonb        NULL,                       -- 适用市场（结构化：market seg）
  applicable_room_types   jsonb        NULL,                       -- 适用房型（结构化：替代 room_type_code 字符串）

  pms_rate_code           varchar(50)  NULL,                       -- PMS侧价格码（对接关键：PMS/CRS/渠道码常不同）
  channel_mapping_json    jsonb        NULL,                       -- 渠道价码映射（channel->external_rate_code）

  booking_window_tz       varchar(64)  NULL,                       -- 预订窗口时区（跨时区集团/海外渠道很重要）
  created_at              timestamptz NOT NULL DEFAULT now(),
  updated_at              timestamptz NOT NULL DEFAULT now()
);

-- =====================================================================
-- 注释
-- =====================================================================

COMMENT ON TABLE public.hotel_rate_code IS
'酒店房价码/价格计划主数据（Rate Code / Rate Plan Master）：定义价格码名称、适用日期、连住与提前预订限制、适用房型、渠道/市场限制，以及取消/担保/支付等关键政策。实际每日价格通常在“价格日历/库存价表”中维护。';

-- 原字段注释
COMMENT ON COLUMN public.hotel_rate_code.id IS '主键ID（自增）';
COMMENT ON COLUMN public.hotel_rate_code.hotel_code IS '酒店代码（HotelCode；建议关联酒店基础信息表 hotel_code）';
COMMENT ON COLUMN public.hotel_rate_code.rate_code IS '房价码（RateCode；同酒店内应唯一）';
COMMENT ON COLUMN public.hotel_rate_code.cate_code IS '价格码分类（CateCode：如散客/协议/会员/团队/钟点等）';
COMMENT ON COLUMN public.hotel_rate_code.rate_code_name IS '价格码名称（中文展示名）';

COMMENT ON COLUMN public.hotel_rate_code.begin_date IS '生效开始时间（BeginDate；含时区，精确到毫秒）';
COMMENT ON COLUMN public.hotel_rate_code.end_date IS '生效结束时间（EndDate；含时区，精确到毫秒）';

COMMENT ON COLUMN public.hotel_rate_code.min_los IS '最少连住晚数（MinLos）';
COMMENT ON COLUMN public.hotel_rate_code.max_los IS '最多连住晚数（MaxLos）';

COMMENT ON COLUMN public.hotel_rate_code.min_adv_bookin IS '最少提前预订天数（MinAdvBookin：如至少提前3天）';
COMMENT ON COLUMN public.hotel_rate_code.max_adv_bookin IS '最多提前预订天数（MaxAdvBookin：如最多提前365天）';

COMMENT ON COLUMN public.hotel_rate_code.market IS '市场（Market：客源市场/市场细分，建议字典化或结构化）';
COMMENT ON COLUMN public.hotel_rate_code.sources IS '来源（Sources：来源渠道/客源来源，建议字典化或结构化）';

COMMENT ON COLUMN public.hotel_rate_code.room_type_code IS '适用房型码列表（RoomTypeCode：常见为逗号分隔；推荐使用 applicable_room_types 结构化字段）';

COMMENT ON COLUMN public.hotel_rate_code.is_price IS '是否价格相关标记（历史口径字段；建议梳理后改boolean/字典）';
COMMENT ON COLUMN public.hotel_rate_code.rate_group IS '价格组（历史字段：用于归组/批量管理）';

COMMENT ON COLUMN public.hotel_rate_code.short_info IS '短说明（用于列表/弹窗简述）';
COMMENT ON COLUMN public.hotel_rate_code.long_info IS '长说明（价格政策/权益/限制说明）';

COMMENT ON COLUMN public.hotel_rate_code.is_allow_down IS '是否允许降价/下调（历史口径；收益管理规则字段）';
COMMENT ON COLUMN public.hotel_rate_code.sort IS '排序（展示/运营排序）';
COMMENT ON COLUMN public.hotel_rate_code.is_delete IS '是否删除（历史整型口径；建议改boolean并统一：true=下线/删除）';

COMMENT ON COLUMN public.hotel_rate_code.rate_grouping IS '分组标签/分组规则文本（用于运营或批量配置）';
COMMENT ON COLUMN public.hotel_rate_code.hour_nums IS '钟点房小时数（如4小时；为空表示非钟点房）';

COMMENT ON COLUMN public.hotel_rate_code.check_begin_date IS '可入住/可检索开始时间（限制入住日期范围，非预订时间）';
COMMENT ON COLUMN public.hotel_rate_code.check_end_date IS '可入住/可检索结束时间（限制入住日期范围）';

COMMENT ON COLUMN public.hotel_rate_code.sl_enable IS '开关字段（SLEnable：上游系统字段，建议梳理含义后字典化）';
COMMENT ON COLUMN public.hotel_rate_code.rate_code_display_name IS '展示名（对客/对渠道显示的别名）';

COMMENT ON COLUMN public.hotel_rate_code.xms_sync_switch IS '外部系统同步开关（XMSSyncSwitch）';

COMMENT ON COLUMN public.hotel_rate_code.is_enable_dp IS '是否启用DP（上游bit字段；默认false）';
COMMENT ON COLUMN public.hotel_rate_code.is_cy_price IS '是否CY价格（上游bit字段；按业务定义）';

COMMENT ON COLUMN public.hotel_rate_code.type_code IS '类型码（TypeCode：上游分类码）';
COMMENT ON COLUMN public.hotel_rate_code.rate_code_en_name IS '英文名称（海外渠道/英文站点）';

COMMENT ON COLUMN public.hotel_rate_code.resflag IS '预订标记/限制标记（Resflag：上游控制字段）';
COMMENT ON COLUMN public.hotel_rate_code.priv IS '权限/私密标识（Priv：如仅内部/仅会员/协议客户可见）';

COMMENT ON COLUMN public.hotel_rate_code.check_in_begin_time IS '允许入住开始时间（如仅允许18:00后入住的晚到价）';
COMMENT ON COLUMN public.hotel_rate_code.check_in_end_time IS '允许入住结束时间（如必须在23:00前入住）';

COMMENT ON COLUMN public.hotel_rate_code.commission_code IS '佣金码/佣金政策码（用于分销渠道佣金结算）';

COMMENT ON COLUMN public.hotel_rate_code.is_multi_price IS '是否多价格（如按人数/梯度/不同权益多档价）';
COMMENT ON COLUMN public.hotel_rate_code.rate_check IS '是否需要审核/二次确认（如团队/协议价需确认）';

COMMENT ON COLUMN public.hotel_rate_code.rate_note IS '价格码备注（原nvachar；对内说明）';
COMMENT ON COLUMN public.hotel_rate_code.team_note IS '团队说明（团队价/团队政策备注）';
COMMENT ON COLUMN public.hotel_rate_code.team_note_en IS '团队英文说明';

COMMENT ON COLUMN public.hotel_rate_code.begin_time IS '每日开始售卖时间（字符串；建议后续标准化为 time）';
COMMENT ON COLUMN public.hotel_rate_code.end_time IS '每日结束售卖时间（字符串；建议后续标准化为 time）';

COMMENT ON COLUMN public.hotel_rate_code.rate_secret IS '保密/私密价标识（如Y/N；用于不对外展示的价码）';

COMMENT ON COLUMN public.hotel_rate_code.week_control IS '周几控制（如1111100表示周一到周五可用；口径需定义）';
COMMENT ON COLUMN public.hotel_rate_code.continuous_week_control IS '连续周控制（更复杂的周段规则；口径需定义）';

-- DBA补充字段注释
COMMENT ON COLUMN public.hotel_rate_code.rate_status IS '价格码状态（active/hidden/inactive；用于上架/下架与售卖控制）';
COMMENT ON COLUMN public.hotel_rate_code.currency_code IS '币种（ISO 4217，如CNY/USD；跨境渠道与财务对账关键）';
COMMENT ON COLUMN public.hotel_rate_code.tax_included IS '价格是否含税（口径关键：展示价/结算价）';
COMMENT ON COLUMN public.hotel_rate_code.service_fee_included IS '是否含服务费（部分目的地/品牌需要）';

COMMENT ON COLUMN public.hotel_rate_code.breakfast_type IS '早餐类型（none/1/2/buffet等；最终以订单权益为准）';
COMMENT ON COLUMN public.hotel_rate_code.breakfast_qty IS '默认含早份数（若固定；否则可空由规则引擎计算）';
COMMENT ON COLUMN public.hotel_rate_code.is_refundable IS '是否可退（强业务字段：影响搜索过滤与展示）';
COMMENT ON COLUMN public.hotel_rate_code.cancel_policy_code IS '取消政策码（建议建立取消政策表并外键关联）';
COMMENT ON COLUMN public.hotel_rate_code.guarantee_type IS '担保类型（none/credit_card/prepay等）';
COMMENT ON COLUMN public.hotel_rate_code.payment_type IS '支付类型（pay_at_hotel/prepay/partial等）';

COMMENT ON COLUMN public.hotel_rate_code.min_price IS '最小价（可选：用于快速筛选/异常校验；实际价格在价表）';
COMMENT ON COLUMN public.hotel_rate_code.max_price IS '最大价（可选：用于快速筛选/异常校验）';

COMMENT ON COLUMN public.hotel_rate_code.applicable_channels IS '适用渠道（jsonb数组/对象：channel codes；替代sources文本）';
COMMENT ON COLUMN public.hotel_rate_code.applicable_markets IS '适用市场（jsonb：market segments；替代market文本）';
COMMENT ON COLUMN public.hotel_rate_code.applicable_room_types IS '适用房型（jsonb：room_type_codes；替代room_type_code字符串列表）';

COMMENT ON COLUMN public.hotel_rate_code.pms_rate_code IS 'PMS侧价格码（对接关键字段：PMS/CRS/渠道可能不同码）';
COMMENT ON COLUMN public.hotel_rate_code.channel_mapping_json IS '渠道价码映射（jsonb：channel->external_rate_code/name）';

COMMENT ON COLUMN public.hotel_rate_code.booking_window_tz IS '预订窗口时区（用于提前预订/日切规则；跨时区集团关键）';
COMMENT ON COLUMN public.hotel_rate_code.created_at IS '记录创建时间（DBA审计字段）';
COMMENT ON COLUMN public.hotel_rate_code.updated_at IS '记录更新时间（DBA审计字段）';

-- =====================================================================
-- 约束与索引（DBA建议）
-- =====================================================================

-- 生效时间合理性
ALTER TABLE public.hotel_rate_code
  ADD CONSTRAINT ck_hotel_rate_code_date_range CHECK (begin_date <= end_date);

-- LOS 合理性（允许0代表不限制也行；这里按 >=0）
ALTER TABLE public.hotel_rate_code
  ADD CONSTRAINT ck_hotel_rate_code_los CHECK (min_los >= 0 AND max_los >= 0 AND min_los <= max_los);

-- 提前预订天数合理性
ALTER TABLE public.hotel_rate_code
  ADD CONSTRAINT ck_hotel_rate_code_adv CHECK (min_adv_bookin >= 0 AND max_adv_bookin >= 0 AND min_adv_bookin <= max_adv_bookin);

-- 同酒店内 rate_code 唯一（主数据强烈建议）
CREATE UNIQUE INDEX IF NOT EXISTS uq_hotel_rate_code_hotel_rate
  ON public.hotel_rate_code (hotel_code, rate_code);

-- 常用查询：酒店 + 生效期
CREATE INDEX IF NOT EXISTS idx_hotel_rate_code_hotel_dates
  ON public.hotel_rate_code (hotel_code, begin_date, end_date);

-- 常用查询：酒店 + 分类
CREATE INDEX IF NOT EXISTS idx_hotel_rate_code_hotel_cate
  ON public.hotel_rate_code (hotel_code, cate_code);

-- 常用查询：状态 + 排序
CREATE INDEX IF NOT EXISTS idx_hotel_rate_code_status_sort
  ON public.hotel_rate_code (hotel_code, rate_status, sort);

-- （可选）如你已有 public.hotel_base_info(hotel_code) 与 public.hotel_room_type(room_type_code)，可考虑外键：
-- 1) hotel_code 外键
-- ALTER TABLE public.hotel_rate_code
--   ADD CONSTRAINT fk_hotel_rate_code_hotel
--   FOREIGN KEY (hotel_code) REFERENCES public.hotel_base_info(hotel_code);
--
-- 2) room_type_code 是列表字段，不适合外键；建议用“关联表”或 applicable_room_types(jsonb) 来做映射。
