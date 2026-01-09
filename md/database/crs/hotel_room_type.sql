-- =====================================================================
-- 酒店房型表 (PostgreSQL)
-- 表名：public.hotel_room_type
-- 说明：
-- 1) 按你给的字段规格建表（SQL Server 类型映射到 PG）
--    - bigint identity -> bigserial
--    - varchar(n) -> varchar(n)
--    - decimal(18,2) -> numeric(18,2)
--    - datetime(3) -> timestamptz(3)
--    - bit -> boolean
--    - “Chinese_PRC_CI_AS”排序规则：PG无法直接等价列级 collation，此处使用库默认
-- 2) DBA经验补充“必备字段”：见表尾（床型/可住人数/早餐/取消政策/图片/上下架等常用维度）
-- =====================================================================

DROP TABLE IF EXISTS public.hotel_room_type CASCADE;

CREATE TABLE public.hotel_room_type (
  -- -------------------------
  -- 原字段（按你提供）
  -- -------------------------
  id                 bigserial PRIMARY KEY,           -- ID (identity)

  hotel_code         varchar(10)  NOT NULL,           -- HotelCode
  room_type_class    varchar(10)  NOT NULL,           -- RoomTypeClass
  room_type_code     varchar(10)  NOT NULL,           -- RoomTypeCode
  room_type_name     varchar(200) NOT NULL,           -- RoomTypeName

  number             integer      NOT NULL,           -- Number（该房型房间数/配置数）
  max_number         integer      NOT NULL,           -- MaxNumber（最大可售/最大配置数）

  area               numeric(18,2) NOT NULL,          -- Area（面积，㎡）
  sort               integer      NOT NULL,           -- Sort（排序）

  facilities         varchar(2000) NULL,              -- Facilities（设施文本/标签串）
  "describe"         varchar(2000) NULL,              -- Describe（中文描述）

  is_valid           smallint     NULL,               -- IsValid（1=是；2=否）
  is_delete          smallint     NULL,               -- IsDelete（1=删除/下线等，口径需统一）

  is_have_windows    integer      NOT NULL DEFAULT 0, -- IsHaveWindows（0/1或0/2等历史口径）
  is_have_smoke      integer      NOT NULL DEFAULT 0, -- IsHaveSmoke（是否可吸烟）
  is_add_bed         integer      NOT NULL DEFAULT 0, -- IsAddBed（是否可加床）

  remarks            varchar(500) NULL,               -- Remarks
  modify_by          varchar(50)  NULL,               -- ModifyBy
  modify_time        timestamptz(3) NULL,             -- ModifyTime（datetime(3)）

  is_main_room       boolean      NULL,               -- IsMainRoom（bit）

  room_type_name_en  varchar(200) NULL,               -- RoomTypeNameEn
  describe_en        varchar(2000) NULL,              -- DescribeEn

  -- -------------------------
  -- DBA经验补充：酒店房型主数据常用必备字段
  -- -------------------------
  room_type_status   varchar(50)  NULL,               -- 房型状态：active/inactive/hidden等（用于上下架/售卖控制）
  max_adults         smallint     NULL,               -- 最大成人数（搜索与规则引擎核心字段）
  max_children       smallint     NULL,               -- 最大儿童数（搜索与规则引擎核心字段）
  standard_occupancy smallint     NULL,               -- 标准入住人数（默认住几人，用于报价/早餐/加人价）
  bed_type           varchar(100) NULL,               -- 床型：大床/双床/榻榻米/上下铺等（建议字典化）
  bed_count          smallint     NULL,               -- 床数量（例如双床=2）
  extra_bed_allowed  boolean      NULL,               -- 是否允许加床（比 is_add_bed 更规范的布尔口径）
  extra_bed_fee      numeric(18,2) NULL,              -- 加床费用（如按晚）
  smoking_policy     varchar(50)  NULL,               -- 吸烟政策：smoking/non_smoking/mixed
  window_policy      varchar(50)  NULL,               -- 窗户政策：window/no_window/partial/unknown（比0/1更可解释）

  breakfast_included boolean      NULL,               -- 是否含早餐（房型层默认；最终以rate plan为准）
  cancellation_policy_code varchar(50) NULL,           -- 默认取消政策码（最终以rate plan为准，但房型常存默认）
  photo_cover_url    text         NULL,               -- 房型封面图URL（对客展示常用）
  photo_gallery_json jsonb        NULL,               -- 图片列表/媒体信息（可选）

  amenities_json     jsonb        NULL,               -- 结构化设施（比 facilities 文本更易用）
  view_type          varchar(100) NULL,               -- 景观：海景/城景/园景等（搜索筛选常用）
  floor_range        varchar(50)  NULL,               -- 楼层范围：如 3-8F
  room_size_unit     varchar(10)  NOT NULL DEFAULT 'sqm', -- 面积单位（sqm/ft2，跨境时很有用）

  pms_room_type_code varchar(50)  NULL,               -- PMS侧房型码（对接关键：PMS/CRS/渠道可能不同码）
  channel_mapping_json jsonb      NULL,               -- 渠道房型映射（携程/美团/Booking等映射，常见需求）

  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now()
);

-- =====================================================================
-- 注释
-- =====================================================================

COMMENT ON TABLE public.hotel_room_type IS
'酒店房型主数据表（Room Type Master）：用于统一管理酒店维度下的房型定义、面积、可住人数、床型、景观、设施与对外展示信息，并支持PMS/CRS/渠道映射与上下架控制。';

-- 原字段注释
COMMENT ON COLUMN public.hotel_room_type.id IS '主键ID（自增）';
COMMENT ON COLUMN public.hotel_room_type.hotel_code IS '酒店代码（HotelCode，建议关联酒店基础信息表 hotel_code）';
COMMENT ON COLUMN public.hotel_room_type.room_type_class IS '房型分类（RoomTypeClass：如标准/豪华/套房等；建议字典化）';
COMMENT ON COLUMN public.hotel_room_type.room_type_code IS '房型代码（RoomTypeCode：酒店内唯一或集团内约定码）';
COMMENT ON COLUMN public.hotel_room_type.room_type_name IS '房型名称（中文，对客展示）';

COMMENT ON COLUMN public.hotel_room_type.number IS '房型数量（配置房间数/统计口径，需与PMS口径一致）';
COMMENT ON COLUMN public.hotel_room_type.max_number IS '最大数量（最大可售/最大配置数；用于容量或可售上限控制）';

COMMENT ON COLUMN public.hotel_room_type.area IS '面积（㎡，通常是建筑面积或可用面积，需统一口径）';
COMMENT ON COLUMN public.hotel_room_type.sort IS '排序（列表展示/运营推荐排序）';

COMMENT ON COLUMN public.hotel_room_type.facilities IS '设施（文本/标签串；建议未来逐步迁移到 amenities_json 结构化）';
COMMENT ON COLUMN public.hotel_room_type."describe" IS '房型中文描述（卖点、布局、设施、适用人群等）';

COMMENT ON COLUMN public.hotel_room_type.is_valid IS '是否有效（1=是；2=否；建议改为boolean并加CHECK约束）';
COMMENT ON COLUMN public.hotel_room_type.is_delete IS '逻辑删除/下线标记（历史字段；建议改为boolean并统一口径）';

COMMENT ON COLUMN public.hotel_room_type.is_have_windows IS '是否有窗（历史整型口径；0/1/2等需与上游系统对齐）';
COMMENT ON COLUMN public.hotel_room_type.is_have_smoke IS '是否可吸烟（历史整型口径；建议用smoking_policy标准化）';
COMMENT ON COLUMN public.hotel_room_type.is_add_bed IS '是否可加床（历史整型口径；建议用extra_bed_allowed标准化）';

COMMENT ON COLUMN public.hotel_room_type.remarks IS '内部备注（运营/主数据维护说明）';
COMMENT ON COLUMN public.hotel_room_type.modify_by IS '修改人（来源系统字段）';
COMMENT ON COLUMN public.hotel_room_type.modify_time IS '修改时间（来源系统字段，datetime(3)）';

COMMENT ON COLUMN public.hotel_room_type.is_main_room IS '是否主推房型/默认房型（用于默认展示或推荐）';

COMMENT ON COLUMN public.hotel_room_type.room_type_name_en IS '房型英文名称（海外渠道/英文站点）';
COMMENT ON COLUMN public.hotel_room_type.describe_en IS '房型英文描述（海外渠道/英文站点）';

-- DBA补充字段注释
COMMENT ON COLUMN public.hotel_room_type.room_type_status IS '房型状态（用于上架/下架/隐藏；建议字典：active/hidden/inactive）';
COMMENT ON COLUMN public.hotel_room_type.max_adults IS '最大成人数（报价与搜索强依赖）';
COMMENT ON COLUMN public.hotel_room_type.max_children IS '最大儿童数（亲子/加人规则常用）';
COMMENT ON COLUMN public.hotel_room_type.standard_occupancy IS '标准入住人数（默认包含人数；与加人价/早餐份数相关）';
COMMENT ON COLUMN public.hotel_room_type.bed_type IS '床型（大床/双床等；建议字典化以便搜索筛选）';
COMMENT ON COLUMN public.hotel_room_type.bed_count IS '床数量（如双床=2）';
COMMENT ON COLUMN public.hotel_room_type.extra_bed_allowed IS '是否允许加床（规范布尔口径）';
COMMENT ON COLUMN public.hotel_room_type.extra_bed_fee IS '加床费用（如按晚；最终可能由rate plan覆盖）';
COMMENT ON COLUMN public.hotel_room_type.smoking_policy IS '吸烟政策（smoking/non_smoking/mixed/unknown）';
COMMENT ON COLUMN public.hotel_room_type.window_policy IS '窗户政策（window/no_window/partial/unknown，替代历史整型口径）';

COMMENT ON COLUMN public.hotel_room_type.breakfast_included IS '是否含早餐（房型层默认；最终以价格计划/订单为准）';
COMMENT ON COLUMN public.hotel_room_type.cancellation_policy_code IS '默认取消政策码（房型默认；最终以价格计划为准）';
COMMENT ON COLUMN public.hotel_room_type.photo_cover_url IS '房型封面图URL（对客展示）';
COMMENT ON COLUMN public.hotel_room_type.photo_gallery_json IS '房型图片列表（json数组：url/排序/类型等）';

COMMENT ON COLUMN public.hotel_room_type.amenities_json IS '结构化设施（jsonb；如 wifi=true, bathtub=true 等，便于筛选/统计）';
COMMENT ON COLUMN public.hotel_room_type.view_type IS '景观类型（海景/城景/园景等，强搜索维度）';
COMMENT ON COLUMN public.hotel_room_type.floor_range IS '楼层范围（例如 3-8F，对客展示/偏好）';
COMMENT ON COLUMN public.hotel_room_type.room_size_unit IS '面积单位（sqm/ft2）';

COMMENT ON COLUMN public.hotel_room_type.pms_room_type_code IS 'PMS房型码（对接关键字段：同一房型在PMS/CRS/渠道可能不同编码）';
COMMENT ON COLUMN public.hotel_room_type.channel_mapping_json IS '渠道房型映射（jsonb：channel->external_roomtype_code/name 等）';

COMMENT ON COLUMN public.hotel_room_type.created_at IS '记录创建时间（DBA审计字段）';
COMMENT ON COLUMN public.hotel_room_type.updated_at IS '记录更新时间（DBA审计字段）';

-- =====================================================================
-- 约束与索引（DBA建议）
-- =====================================================================

-- 房型数量非负
ALTER TABLE public.hotel_room_type
  ADD CONSTRAINT ck_hotel_room_type_number_nonneg CHECK (number >= 0),
  ADD CONSTRAINT ck_hotel_room_type_max_number_nonneg CHECK (max_number >= 0),
  ADD CONSTRAINT ck_hotel_room_type_area_nonneg CHECK (area >= 0);

-- hotel_code + room_type_code 一般要求唯一（同酒店内房型码不能重复）
CREATE UNIQUE INDEX IF NOT EXISTS uq_hotel_room_type_hotel_roomcode
  ON public.hotel_room_type (hotel_code, room_type_code);

-- 常用查询：酒店+状态+排序
CREATE INDEX IF NOT EXISTS idx_hotel_room_type_hotel_status_sort
  ON public.hotel_room_type (hotel_code, room_type_status, sort);

-- 常用查询：酒店+分类
CREATE INDEX IF NOT EXISTS idx_hotel_room_type_hotel_class
  ON public.hotel_room_type (hotel_code, room_type_class);

-- （可选）如果你已有 public.hotel_base_info(hotel_code)，可加外键：
-- ALTER TABLE public.hotel_room_type
--   ADD CONSTRAINT fk_hotel_room_type_hotel
--   FOREIGN KEY (hotel_code) REFERENCES public.hotel_base_info(hotel_code);
