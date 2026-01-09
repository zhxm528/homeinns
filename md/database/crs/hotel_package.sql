-- =====================================================================
-- 酒店包价表 (PostgreSQL)
-- 表名：public.hotel_package
-- 说明（酒店行业 DBA 经验）：
-- 1) 包价/套餐（Package）通常不是“只有一个价格”，还需要：币种、税费口径、适用日期/可入住日期、
--    适用房型/价码、库存/配额、取消/担保/支付规则、是否可叠加、以及渠道可见性等字段。
-- 2) 你给的字段全部包含，并加注释；另外补充“必备字段”在下方。
-- =====================================================================

DROP TABLE IF EXISTS public.hotel_package CASCADE;

CREATE TABLE public.hotel_package (
  -- -------------------------
  -- 你给的字段
  -- -------------------------
  package_code        varchar(10)  NOT NULL,                 -- PackageCode
  hotel_code          varchar(50)  NULL,                     -- HotelCode（可空：表示集团通用包？建议业务确认）
  package_name        varchar(500) NOT NULL,                 -- PackageName
  package_class       varchar(100) NOT NULL,                 -- PackageClass（分类：亲子/餐饮/会议/度假等）
  package_type        varchar(40)  NOT NULL,                 -- PackageType（类型：固定价/加购/权益包等）

  nums                integer      NULL,                     -- Nums（份数/次数/数量，含义随包类型）
  throw_way           varchar(40)  NULL,                     -- ThrowWay（投放方式：全渠道/定向/私域等）
  calculation         varchar(40)  NULL,                     -- Calculation（计价方式：按晚/按次/按人/按间等）
  separate            integer      NULL,                     -- Separate（是否可拆分/拆分规则；历史口径）
  sort                integer      NULL,                     -- Sort（排序）

  short_info          varchar(500)  NULL,                    -- ShortInfo（短说明）
  long_info           varchar(5000) NULL,                    -- LongInfo（长说明/权益/使用说明）

  create_time         timestamptz(3) NULL,                   -- CreateTime（来源系统创建时间）
  user_id             varchar(100) NULL,                     -- UserId（创建/维护人或系统账号）

  is_valid            integer      NULL,                     -- IsValid（有效标记：建议 1=有效 2=无效）
  is_delete           integer      NULL,                     -- IsDelete（删除标记：建议 1=删除 0=正常）

  package_price       numeric(18,2) NOT NULL DEFAULT 0,      -- PackagePrice（包价金额）

  -- -------------------------
  -- DBA 经验补充：包价/套餐“必须字段”
  -- -------------------------

  id                  bigserial PRIMARY KEY,                -- 系统主键（DBA补充：便于内部引用/外键）
  package_status      varchar(50) NOT NULL DEFAULT 'active', -- 套餐状态：active/hidden/inactive（上下架）
  display_name        varchar(500) NULL,                     -- 对客展示名（可与package_name区分：渠道展示/营销名）
  package_name_en     varchar(500) NULL,                     -- 英文名（海外渠道）
  description_en      text NULL,                             -- 英文说明

  currency_code       char(3) NULL,                          -- 币种（ISO 4217：CNY/USD…）
  tax_included        boolean NULL,                          -- 是否含税（强口径字段）
  service_fee_included boolean NULL,                         -- 是否含服务费

  sale_begin_at       timestamptz(3) NULL,                   -- 售卖开始时间（何时可下单）
  sale_end_at         timestamptz(3) NULL,                   -- 售卖结束时间（何时停止售卖）
  stay_begin_date     date NULL,                             -- 可入住开始日期（限制入住日期范围）
  stay_end_date       date NULL,                             -- 可入住结束日期

  min_los             integer NULL,                          -- 最少连住晚数（包价常有限制）
  max_los             integer NULL,                          -- 最多连住晚数
  min_adv_booking_days integer NULL,                         -- 最少提前预订天数
  max_adv_booking_days integer NULL,                         -- 最多提前预订天数

  week_control        varchar(20) NULL,                      -- 周几可用（如1111100：口径需定义）
  blackout_dates_json jsonb NULL,                            -- 不可用日期（黑名单：节假日/满房日等）

  is_stackable        boolean NULL,                          -- 是否可叠加其他优惠/券（强运营字段）
  is_refundable       boolean NULL,                          -- 是否可退（强业务字段）
  cancel_policy_code  varchar(50) NULL,                      -- 取消政策码（建议关联取消政策表）
  guarantee_type      varchar(50) NULL,                      -- 担保类型：none/credit_card/prepay
  payment_type        varchar(50) NULL,                      -- 支付类型：pay_at_hotel/prepay/partial

  inventory_mode      varchar(50) NULL,                      -- 库存模式：shared/allocated/unlimited
  allotment_qty       integer NULL,                          -- 配额数量（allocated时必填）
  per_day_limit       integer NULL,                          -- 每日限量（营销包常用）
  per_order_limit     integer NULL,                          -- 每单限购数量
  per_guest_limit     integer NULL,                          -- 每人限购数量

  applicable_channels jsonb NULL,                            -- 适用渠道（直销/OTA/企业/会员等）
  applicable_markets  jsonb NULL,                            -- 适用市场（市场细分：散客/团队/协议等）
  rate_code_bind_mode varchar(50) NULL,                      -- 与房价码绑定模式：none/bind_required/optional
  bound_rate_codes    jsonb NULL,                            -- 绑定价码列表（若套餐必须走某些rate code）
  bound_room_types    jsonb NULL,                            -- 绑定房型列表（套餐适用房型）

  package_items_json  jsonb NULL,                            -- 套餐明细（权益项列表：早餐/晚餐/门票/接送等）
  terms_json          jsonb NULL,                            -- 使用条款/规则结构化（便于前端展示与校验）

  created_at          timestamptz NOT NULL DEFAULT now(),    -- DBA审计
  updated_at          timestamptz NOT NULL DEFAULT now()     -- DBA审计
);

-- =====================================================================
-- 表注释
-- =====================================================================
COMMENT ON TABLE public.hotel_package IS
'酒店包价/套餐表（Hotel Package）：用于管理“含权益/组合产品”的售卖规则与价格。除基础价格外，行业上通常还需要：售卖期、可入住期、库存配额、取消/担保/支付、渠道可见性、适用房型/价码绑定及套餐明细项等。';

-- =====================================================================
-- 字段注释（你给的字段）
-- =====================================================================
COMMENT ON COLUMN public.hotel_package.package_code  IS 'PackageCode：套餐编码（建议在同酒店内唯一；若集团通用需加唯一策略）';
COMMENT ON COLUMN public.hotel_package.hotel_code    IS 'HotelCode：酒店编码（可空表示集团通用/模板套餐；建议业务确认并统一口径）';
COMMENT ON COLUMN public.hotel_package.package_name  IS 'PackageName：套餐名称（中文）';
COMMENT ON COLUMN public.hotel_package.package_class IS 'PackageClass：套餐分类（亲子/度假/餐饮/会议/门票等，建议字典化）';
COMMENT ON COLUMN public.hotel_package.package_type  IS 'PackageType：套餐类型（固定包价/加购/权益包/房+餐等，建议字典化）';

COMMENT ON COLUMN public.hotel_package.nums          IS 'Nums：数量/份数/次数（含义依套餐类型而定，如“含2份早餐/2张门票/1次接送”）';
COMMENT ON COLUMN public.hotel_package.throw_way     IS 'ThrowWay：投放方式（全渠道/指定渠道/私域/企业等，建议字典化）';
COMMENT ON COLUMN public.hotel_package.calculation   IS 'Calculation：计价方式（按晚/按次/按人/按间等，建议字典化）';
COMMENT ON COLUMN public.hotel_package.separate      IS 'Separate：是否可拆分/拆分规则（历史整型口径，建议未来改boolean+规则表）';
COMMENT ON COLUMN public.hotel_package.sort          IS 'Sort：排序（对客展示/运营排序）';

COMMENT ON COLUMN public.hotel_package.short_info    IS 'ShortInfo：短说明（列表/卡片展示）';
COMMENT ON COLUMN public.hotel_package.long_info     IS 'LongInfo：长说明（权益、使用说明、限制条款等）';

COMMENT ON COLUMN public.hotel_package.create_time   IS 'CreateTime：来源系统创建时间（datetime(3)映射）';
COMMENT ON COLUMN public.hotel_package.user_id       IS 'UserId：创建/维护人或系统账号（来源系统字段）';

COMMENT ON COLUMN public.hotel_package.is_valid      IS 'IsValid：是否有效（建议1=有效，2=无效；未来可改boolean）';
COMMENT ON COLUMN public.hotel_package.is_delete     IS 'IsDelete：是否删除/下线（历史字段；建议未来改boolean并统一口径）';

COMMENT ON COLUMN public.hotel_package.package_price IS 'PackagePrice：套餐价格（numeric(18,2)，默认0；需结合币种与含税口径）';

-- =====================================================================
-- 字段注释（DBA补充字段）
-- =====================================================================
COMMENT ON COLUMN public.hotel_package.id IS '系统主键ID（DBA补充：便于外键引用/内部统一标识）';
COMMENT ON COLUMN public.hotel_package.package_status IS '套餐状态（active/hidden/inactive；用于上下架与售卖控制）';
COMMENT ON COLUMN public.hotel_package.display_name IS '对客展示名（营销名/渠道展示名，可区别于内部维护名）';
COMMENT ON COLUMN public.hotel_package.package_name_en IS '英文名称（海外渠道/英文站点）';
COMMENT ON COLUMN public.hotel_package.description_en IS '英文说明（海外渠道）';

COMMENT ON COLUMN public.hotel_package.currency_code IS '币种（ISO 4217，如CNY/USD；跨境与财务对账关键）';
COMMENT ON COLUMN public.hotel_package.tax_included IS '价格是否含税（强口径字段：展示价/结算价/含税与否）';
COMMENT ON COLUMN public.hotel_package.service_fee_included IS '是否含服务费（部分目的地/品牌需要明确口径）';

COMMENT ON COLUMN public.hotel_package.sale_begin_at IS '售卖开始时间（从何时起允许下单）';
COMMENT ON COLUMN public.hotel_package.sale_end_at IS '售卖结束时间（何时停止下单）';
COMMENT ON COLUMN public.hotel_package.stay_begin_date IS '可入住开始日期（限制入住日期范围，非下单时间）';
COMMENT ON COLUMN public.hotel_package.stay_end_date IS '可入住结束日期（限制入住日期范围）';

COMMENT ON COLUMN public.hotel_package.min_los IS '最少连住晚数（套餐常有限制：如至少2晚）';
COMMENT ON COLUMN public.hotel_package.max_los IS '最多连住晚数（防止超长住）';
COMMENT ON COLUMN public.hotel_package.min_adv_booking_days IS '最少提前预订天数（例如至少提前3天）';
COMMENT ON COLUMN public.hotel_package.max_adv_booking_days IS '最多提前预订天数（例如最多提前365天）';

COMMENT ON COLUMN public.hotel_package.week_control IS '周几可用控制（如1111100表示周一到周五可用；口径需定义）';
COMMENT ON COLUMN public.hotel_package.blackout_dates_json IS '不可用日期集合（黑名单：节假日/满房日等，jsonb数组）';

COMMENT ON COLUMN public.hotel_package.is_stackable IS '是否可叠加其他优惠（券/会员折扣/活动；关键运营字段）';
COMMENT ON COLUMN public.hotel_package.is_refundable IS '是否可退（影响展示与规则引擎）';
COMMENT ON COLUMN public.hotel_package.cancel_policy_code IS '取消政策码（建议单独建取消政策表；此处存码）';
COMMENT ON COLUMN public.hotel_package.guarantee_type IS '担保类型（none/credit_card/prepay；关系到下单与担保规则）';
COMMENT ON COLUMN public.hotel_package.payment_type IS '支付类型（pay_at_hotel/prepay/partial；关系到支付链路）';

COMMENT ON COLUMN public.hotel_package.inventory_mode IS '库存模式（shared=共享库存；allocated=分配配额；unlimited=不控量）';
COMMENT ON COLUMN public.hotel_package.allotment_qty IS '配额数量（allocated时使用；套餐限量销售常见）';
COMMENT ON COLUMN public.hotel_package.per_day_limit IS '每日限量（营销包常用）';
COMMENT ON COLUMN public.hotel_package.per_order_limit IS '每单限购（防止刷单/超量）';
COMMENT ON COLUMN public.hotel_package.per_guest_limit IS '每客限购（会员/活动常用）';

COMMENT ON COLUMN public.hotel_package.applicable_channels IS '适用渠道（jsonb：直销/OTA/企业/会员等；替代ThrowWay/Sources的弱结构字段）';
COMMENT ON COLUMN public.hotel_package.applicable_markets IS '适用市场（jsonb：市场细分/客群；如散客/团队/协议等）';
COMMENT ON COLUMN public.hotel_package.rate_code_bind_mode IS '与房价码绑定模式（none=不绑定；bind_required=必须走指定RateCode；optional=可选）';
COMMENT ON COLUMN public.hotel_package.bound_rate_codes IS '绑定房价码列表（jsonb：rate_code数组；用于套餐必须配某些价格码）';
COMMENT ON COLUMN public.hotel_package.bound_room_types IS '绑定房型列表（jsonb：room_type_code数组；用于限定套餐适用房型）';

COMMENT ON COLUMN public.hotel_package.package_items_json IS '套餐权益明细（jsonb：早餐/晚餐/门票/接送/SPA等项目清单，含数量与规则）';
COMMENT ON COLUMN public.hotel_package.terms_json IS '使用条款结构化（jsonb：例如不可转让/不兑现/使用时间段/预约要求等）';

COMMENT ON COLUMN public.hotel_package.created_at IS '记录创建时间（DBA审计字段）';
COMMENT ON COLUMN public.hotel_package.updated_at IS '记录更新时间（DBA审计字段）';

-- =====================================================================
-- 约束与索引（DBA建议）
-- =====================================================================

-- 价格非负
ALTER TABLE public.hotel_package
  ADD CONSTRAINT ck_hotel_package_price_nonneg CHECK (package_price >= 0);

-- 日期范围合理（可为空则不校验；有值才校验）
ALTER TABLE public.hotel_package
  ADD CONSTRAINT ck_hotel_package_sale_range
  CHECK (sale_begin_at IS NULL OR sale_end_at IS NULL OR sale_begin_at <= sale_end_at);

ALTER TABLE public.hotel_package
  ADD CONSTRAINT ck_hotel_package_stay_range
  CHECK (stay_begin_date IS NULL OR stay_end_date IS NULL OR stay_begin_date <= stay_end_date);

-- LOS/提前预订合理性（为空不校验；有值则校验）
ALTER TABLE public.hotel_package
  ADD CONSTRAINT ck_hotel_package_los
  CHECK (
    (min_los IS NULL OR min_los >= 0) AND
    (max_los IS NULL OR max_los >= 0) AND
    (min_los IS NULL OR max_los IS NULL OR min_los <= max_los)
  );

ALTER TABLE public.hotel_package
  ADD CONSTRAINT ck_hotel_package_adv
  CHECK (
    (min_adv_booking_days IS NULL OR min_adv_booking_days >= 0) AND
    (max_adv_booking_days IS NULL OR max_adv_booking_days >= 0) AND
    (min_adv_booking_days IS NULL OR max_adv_booking_days IS NULL OR min_adv_booking_days <= max_adv_booking_days)
  );

-- 唯一性建议：
-- 1) 若 hotel_code 非空：同酒店 package_code 唯一
CREATE UNIQUE INDEX IF NOT EXISTS uq_hotel_package_hotel_pkg
  ON public.hotel_package (hotel_code, package_code)
  WHERE hotel_code IS NOT NULL;

-- 2) 若 hotel_code 为空（集团通用）：package_code 全局唯一（可选）
CREATE UNIQUE INDEX IF NOT EXISTS uq_hotel_package_global_pkg
  ON public.hotel_package (package_code)
  WHERE hotel_code IS NULL;

-- 常用查询：酒店 + 状态 + 售卖期/入住期
CREATE INDEX IF NOT EXISTS idx_hotel_package_hotel_status_sale
  ON public.hotel_package (hotel_code, package_status, sale_begin_at, sale_end_at);

CREATE INDEX IF NOT EXISTS idx_hotel_package_hotel_stay
  ON public.hotel_package (hotel_code, stay_begin_date, stay_end_date);

-- （可选）如果你有 public.hotel_base_info(hotel_code)，可以加外键：
-- ALTER TABLE public.hotel_package
--   ADD CONSTRAINT fk_hotel_package_hotel
--   FOREIGN KEY (hotel_code) REFERENCES public.hotel_base_info(hotel_code);
