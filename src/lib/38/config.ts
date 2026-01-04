// 数据库配置 - 根据170database文档
export const dbConfig = {
  server: '192.168.210.38',
  port: 1433,
  database: 'master',
  user: 'CRS_admin',
  password: 'Ruji@2019Ber10funf',
  options: {
    encrypt: false, // 如果使用Azure SQL，设置为true
    trustServerCertificate: true, // 信任服务器证书
    enableArithAbort: true,
    requestTimeout: 90000, // 查询超时时间设置为90秒（90000毫秒）
  },
  pool: {
    max: 100,
    min: 10,
    idleTimeoutMillis: 10000,
    acquireTimeoutMillis: 10000,
  }
};

// 数据库表名常量
export const TABLE_NAMES = {
  HOTEL_BASE_INFO: '[CrsStar].dbo.StarHotelBaseInfo',
} as const;

// 酒店基础信息接口 - 根据StarHotelBaseInfo表结构定义
export interface HotelBaseInfo {
  ID: number;
  HotelCode: string;
  HotelName: string;
  HotelENName?: string;
  HotelLangName?: string;
  HotelType?: string;
  HotelStar?: string;
  GroupCode?: string;
  HotelAddress?: string;
  ShortHotelAddress?: string;
  HotelEnAddress?: string;
  PostCode?: string;
  MobilePhone?: string;
  Phone?: string;
  Email?: string;
  Fax?: string;
  LandMark?: string;
  Catering?: string;
  Banquet?: string;
  Prompt?: string;
  HotelFeatures?: string;
  BusinessArea?: string;
  HotelArea?: number;
  MeetingRoomArea?: number;
  TheBanquetArea?: number;
  AllRoomNums?: number;
  UseMoney?: number;
  Status: number;
  NearbyHotel?: string;
  HotelKeyword?: string;
  Describe?: string;
  Remarks?: string;
  CreateDate: Date;
  Sort?: number;
  IsDelete: number;
  OpenDate?: Date;
  PMSType?: string;
  RestaurantResvEmail?: string;
  BanquetResvEmail?: string;
  ResvClass?: string;
  ContractNo?: string;
  DisplayStatus?: number;
  AdminCode?: string;
  PresaleDate?: Date;
  OpeningDate?: Date;
  OverBookStatus?: number;
  SalesId?: string;
  RateCodeSwitch?: string;
  RoomTypeSwitch?: string;
  BestPriceExclusion?: boolean;
  Area?: string;
  UrbanArea?: string;
  HotelBrand?: string;
  HotelStatusStartDate?: Date;
  ClosingDate?: Date;
  MDMProvince?: string;
  MDMCity?: string;
  HotelMinPrice?: number;
  DefaultOpenSale?: boolean;
  DefaultRollPriceStock?: boolean;
  DescribeEn?: string;
  GuaranteedPrice?: number;
  BestPriceVocChannelMode?: boolean;
  PropertyType?: string;
}

// 如家接口配置
export const INNS_API_CONFIG = {
  getProduct: 'https://zyota.homeinns.com/HomeinnsAgentApi/api/HotelAvailableRM/GetProducts',
  terminal: {
    license: process.env.INNS_TERMINAL_LICENSE || 'CTRIP1233',
    seq: process.env.INNS_TERMINAL_SEQ || '1',
    oprId: process.env.INNS_TERMINAL_OPR_ID || '1',
  },
};
