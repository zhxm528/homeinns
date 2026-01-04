import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Tabs } from 'antd';
import Sidebar from '@/components/Sidebar';
import Home from '@/pages/Home';
import UserList from '@/pages/user/UserList';
import UserAdd from '@/pages/user/UserAdd';
import ChainList from '@/pages/chain/ChainList';
import ChainAdd from '@/pages/chain/ChainAdd';
import HotelList from '@/pages/hotel/HotelList';
import HotelAdd from '@/pages/hotel/HotelAdd';
import HotelEdit from '@/pages/hotel/HotelEdit';
import RoomTypeList from '@/pages/roomtype/RoomTypeList';
import RoomTypeAdd from '@/pages/roomtype/RoomTypeAdd';
import CityList from '@/pages/city/CityList';
import CityAdd from '@/pages/city/CityAdd';
import ChannelList from '@/pages/channel/ChannelList';
import ChannelAdd from '@/pages/channel/ChannelAdd';
import RateCodeList from '@/pages/ratecode/RateCodeList';
import RateCodeAdd from '@/pages/ratecode/RateCodeAdd';
import RateCodeEdit from '@/pages/ratecode/RateCodeEdit';
import RateCodePriceSettings from '@/pages/ratecode/RateCodePriceSettings';
import RateCodeGroupList from '@/pages/ratecode/GroupList';
import RateCodeGroupAdd from '@/pages/ratecode/GroupAdd';
import RatePlanList from '@/pages/rateplan/RatePlanList';
import ReservationList from '@/pages/reservation/ReservationList';
import ReservationAudit from '@/pages/reservation/ReservationAudit';
import ReservationAdd from '@/pages/reservation/ReservationAdd';
import BookingGroupList from '@/pages/reservation/BookingGroupList';
import BookingGroupAdd from '@/pages/reservation/BookingGroupAdd';
import Availcalendar from '@/pages/avail/AvailCalendar';
import AvailPrice from '@/pages/avail/AvailPrice';
import AvailInventory from '@/pages/avail/AvailInventory';
import HotelBedsHotels from '@/pages/hotelbeds/HotelBedsHotels';
import HotelBedsPriceCheck from '@/pages/hotelbeds/HotelBedsPriceCheck';
import HomeinnsHotels from '@/pages/homeinns/HomeinnsHotels';
import HomeinnsPriceCheck from '@/pages/homeinns/HomeinnsPriceCheck';
import HotelsDailyReport from '@/pages/report/HotelsDailyReport';
import HotelDailyReport from '@/pages/report/HotelDailyReport';
import HotelMonthlyReport from '@/pages/report/HotelMonthlyReport';
import HotelsMonthlyReport from '@/pages/report/HotelsMonthlyReport';
import HotelForecastCompareReport from '@/pages/report/HotelForecastCompareReport';
import HotelForecastAccuracyReport from '@/pages/report/HotelForecastAccuracyReport';
import OverallOperationReport from '@/pages/report/OverallOperationReport';
import RoomDataReport from '@/pages/report/RoomDataReport';
import FoodDataReport from '@/pages/report/FoodDataReport';
import MarketSegmentReport from '@/pages/report/MarketSegmentReport';
import ChannelSegmentReport from '@/pages/report/ChannelSegmentReport';
import HotelPerformanceReport from '@/pages/report/HotelPerformanceReport';
import BudgetEntryReport from '@/pages/report/BudgetEntryReport';
import ForecastEntryReport from '@/pages/report/ForecastEntryReport';
import BudgetEntryReportUC from '@/pages/report/BudgetEntryReportUC';
import ForecastEntryReportUC from '@/pages/report/ForecastEntryReportUC';
import SessionSet from '@/pages/systemconfig/SessionSet';
import HotelChecking from '@/pages/reconcile/HotelChecking';
import Login from '@/pages/login/Login';
import CompanyList from '@/pages/company/CompanyList';
import CompanyAdd from '@/pages/company/CompanyAdd';
import RevenueAnalysis from '@/pages/revenueanalysis/RevenueAnalysis';
import ProductionReport from '@/pages/revenueanalysis/ProductionReport';
import DataReport from '@/pages/revenueanalysis/DataReport';
import RatecodeReport from '@/pages/revenueanalysis/RatecodeReport';
import HotelRatecodeReport from '@/pages/revenueanalysis/HotelRatecodeReport';
import request from '@/utils/request';
import BudgetDataImport from '@/pages/report/BudgetDataImport';
import BusinessMTDReport from '@/pages/report/nj/BusinessMTDReport';
import FunctionList from '@/pages/function/FunctionList';
import FunctionAdd from '@/pages/function/FunctionAdd';
import FunctionEdit from '@/pages/function/FunctionEdit';
import HotelImport from '@/pages/hotel/HotelImport';
import RoomTypeImport from '@/pages/roomtype/RoomTypeImport';
import RateCodeImport from '@/pages/ratecode/RateCodeImport';

// Centralized route paths
export const ROUTES = {
  LOGIN: '/login',
  HOME: '/home',
  USER_LIST: '/user/list',
  USER_ADD: '/user/add',
  USER_EDIT: '/user/edit/:userId',
  CHAIN_LIST: '/chain/list',
  CHAIN_ADD: '/chain/add',
  CHAIN_EDIT: '/chain/edit/:chainId',
  HOTEL_LIST: '/hotel/list',
  HOTEL_ADD: '/hotel/add',
  HOTEL_EDIT: '/hotel/edit/:hotelId',
  HOTEL_IMPORT: '/hotel/import',
  ROOM_TYPE_LIST: '/api/roomtype/list',
  ROOM_TYPE_ADD: '/api/roomtype/add',
  ROOM_TYPE_EDIT: '/api/roomtype/edit/:roomTypeId',
  ROOM_TYPE_IMPORT: '/roomtype/import',
  CITY_LIST: '/city/list',
  CITY_ADD: '/city/add',
  CHANNEL_LIST: '/channel/list',
  CHANNEL_ADD: '/channel/add',
  RATE_CODE_LIST: '/api/ratecode/list',
  RATE_CODE_ADD: '/api/ratecode/add',
  RATE_CODE_EDIT: '/api/ratecode/edit/:rateCodeId',
  RATE_CODE_PRICE_SETTINGS: '/api/ratecode/price-settings/:rateCodeId',
  RATE_CODE_GROUP_LIST: '/api/ratecode/group/list',
  RATE_CODE_GROUP_ADD: '/api/ratecode/group/add',
  RATE_CODE_GROUP_EDIT: '/api/ratecode/group/edit/:groupId',
  RATE_CODE_GROUP_BOOKING: '/api/ratecode/group/booking/:groupId',
  RATE_CODE_IMPORT: '/ratecode/import',
  RATE_PLAN_LIST: '/rateplan/list',
  RESERVATION_LIST: '/reservation/list',
  RESERVATION_AUDIT: '/reservation/audit',
  RESERVATION_ADD: '/reservation/add',
  BOOKING_GROUP_LIST: '/reservation/booking/group/list',
  BOOKING_GROUP_ADD: '/reservation/booking/group/add',
  AVAIL_CALENDAR: '/avail/calendar',
  AVAIL_PRICE: '/avail/price',
  AVAIL_INVENTORY: '/avail/inventory',
  HOTELBEDS_HOTELS: '/hotelbeds/hotels',
  HOTELBEDS_PRICE_CHECK: '/hotelbeds/price-check',
  HOMEINNS_HOTELS: '/homeinns/hotels',
  HOMEINNS_PRICE_CHECK: '/homeinns/price-check',
  REPORT_HOTELS_DAILY: '/report/hotels-daily',
  REPORT_HOTEL_DAILY: '/report/hotel-daily',
  REPORT_HOTELS_MONTHLY: '/report/hotels-monthly',
  REPORT_HOTEL_MONTHLY: '/report/hotel-monthly',
  REPORT_HOTEL_FORECAST_COMPARE: '/report/hotel-forecast-compare',
  REPORT_HOTEL_FORECAST_ACCURACY: '/report/hotel-forecast-accuracy',
  REPORT_OVERALL_OPERATION: '/report/overall-operation',
  REPORT_ROOM_DATA: '/report/room-data',
  REPORT_FOOD_DATA: '/report/food-data',
  REPORT_MARKET_SEGMENT: '/report/market-segment',
  REPORT_CHANNEL_SEGMENT: '/report/channel-segment',
  REPORT_HOTEL_PERFORMANCE: '/report/hotel-performance',
  REPORT_INDICATOR_TREND: '/report/indicator-trend',
  REPORT_BUDGET_ENTRY: '/report/budget-entry',
  REPORT_FORECAST_ENTRY: '/report/forecast-entry',
  REPORT_BUDGET_ENTRY_UC: '/report/budget-entry-uc',
  REPORT_FORECAST_ENTRY_UC: '/report/forecast-entry-uc',
  SESSION_SET: '/systemconfig/SessionSet',
  HOTEL_CHECKING: '/reconcile/hotel-checking',
  COMPANY_LIST: '/company/list',
  COMPANY_ADD: '/company/add',
  COMPANY_EDIT: '/company/edit/:companyId',
  REVENUE_ANALYSIS: '/revenue-analysis',
  PRODUCTION_REPORT: '/revenue-analysis/production-report',
  DATA_REPORT: '/revenue-analysis/data-report',
  RATECODE_REPORT: '/revenue-analysis/ratecode-report',
  HOTEL_RATECODE_REPORT: '/revenue-analysis/hotel-ratecode-report',
  REPORT_BUDGET_DATA_IMPORT: '/report/budget-data-import',
  FUNCTION_LIST: '/function/list',
  FUNCTION_ADD: '/function/add',
  FUNCTION_EDIT: '/function/edit/:functionId',
};

// 路由路径到标题的映射
const PATH_TO_TITLE: { [key: string]: string } = {
  [ROUTES.HOME]: '首页',
  [ROUTES.USER_LIST]: '用户列表',
  [ROUTES.USER_ADD]: '添加用户',
  [ROUTES.USER_EDIT]: '编辑用户',
  [ROUTES.CHAIN_LIST]: '集团列表',
  [ROUTES.CHAIN_ADD]: '添加集团',
  [ROUTES.CHAIN_EDIT]: '编辑集团',
  [ROUTES.HOTEL_LIST]: '酒店列表',
  [ROUTES.HOTEL_ADD]: '添加酒店',
  [ROUTES.HOTEL_EDIT]: '编辑酒店',
  [ROUTES.HOTEL_IMPORT]: '酒店导入',
  [ROUTES.ROOM_TYPE_LIST]: '房型列表',
  [ROUTES.ROOM_TYPE_ADD]: '添加房型',
  [ROUTES.ROOM_TYPE_EDIT]: '编辑房型',
  [ROUTES.ROOM_TYPE_IMPORT]: '房型导入',
  [ROUTES.CITY_LIST]: '城市列表',
  [ROUTES.CITY_ADD]: '添加城市',
  [ROUTES.CHANNEL_LIST]: '渠道列表',
  [ROUTES.CHANNEL_ADD]: '添加渠道',
  [ROUTES.RATE_CODE_LIST]: '促销管理',
  [ROUTES.RATE_CODE_ADD]: '添加房价码',
  [ROUTES.RATE_CODE_EDIT]: '编辑房价码',
  [ROUTES.RATE_CODE_PRICE_SETTINGS]: '房价码价格设置',
  [ROUTES.RATE_CODE_GROUP_LIST]: '团队房',
  [ROUTES.RATE_CODE_GROUP_ADD]: '添加团队',
  [ROUTES.RATE_CODE_GROUP_EDIT]: '编辑团队',
  [ROUTES.RATE_CODE_GROUP_BOOKING]: '团队预订',
  [ROUTES.RATE_CODE_IMPORT]: '房价码导入',
  [ROUTES.RATE_PLAN_LIST]: '房价计划列表',
  [ROUTES.RESERVATION_LIST]: '订单列表',
  [ROUTES.RESERVATION_AUDIT]: '订单审核',
  [ROUTES.RESERVATION_ADD]: '订单录入',
  [ROUTES.BOOKING_GROUP_LIST]: '团队订单',
  [ROUTES.BOOKING_GROUP_ADD]: '团队预订',
  [ROUTES.AVAIL_CALENDAR]: '可用性日历',
  [ROUTES.AVAIL_PRICE]: '房价维护',
  [ROUTES.AVAIL_INVENTORY]: '房态房量',
  [ROUTES.HOTELBEDS_HOTELS]: 'HB酒店同步',
  [ROUTES.HOTELBEDS_PRICE_CHECK]: 'HB价格检查',
  [ROUTES.HOMEINNS_HOTELS]: '如家酒店同步',
  [ROUTES.HOMEINNS_PRICE_CHECK]: '如家价格检查',
  [ROUTES.REPORT_HOTELS_DAILY]: '集团日报',
  [ROUTES.REPORT_HOTEL_DAILY]: '酒店日报',
  [ROUTES.REPORT_HOTELS_MONTHLY]: '集团月报',
  [ROUTES.REPORT_HOTEL_MONTHLY]: '酒店月报',
  [ROUTES.REPORT_HOTEL_FORECAST_COMPARE]: '酒店预测环比',
  [ROUTES.REPORT_HOTEL_FORECAST_ACCURACY]: '酒店预测准确率',
  [ROUTES.REPORT_OVERALL_OPERATION]: '整体经营',
  [ROUTES.REPORT_ROOM_DATA]: '客房经营',
  [ROUTES.REPORT_FOOD_DATA]: '餐饮经营',
  [ROUTES.REPORT_MARKET_SEGMENT]: '市场细分',
  [ROUTES.REPORT_CHANNEL_SEGMENT]: '渠道细分',
  [ROUTES.REPORT_HOTEL_PERFORMANCE]: '酒店业绩',
  [ROUTES.REPORT_INDICATOR_TREND]: '指标趋势',
  [ROUTES.REPORT_BUDGET_ENTRY]: '诺金预算填报',
  [ROUTES.REPORT_FORECAST_ENTRY]: '诺金预测填报',
  [ROUTES.REPORT_BUDGET_ENTRY_UC]: '逸扉预算填报',
  [ROUTES.REPORT_FORECAST_ENTRY_UC]: '逸扉预测填报',
  [ROUTES.SESSION_SET]: '系统设置',
  [ROUTES.HOTEL_CHECKING]: '酒店对账',
  [ROUTES.COMPANY_LIST]: '协议公司列表',
  [ROUTES.COMPANY_ADD]: '新增协议公司',
  [ROUTES.COMPANY_EDIT]: '编辑协议公司',
  [ROUTES.REVENUE_ANALYSIS]: '收益分析',
  [ROUTES.PRODUCTION_REPORT]: '产量报表',
  [ROUTES.DATA_REPORT]: '数据报表',
  [ROUTES.RATECODE_REPORT]: '房价码报表',
  [ROUTES.HOTEL_RATECODE_REPORT]: '酒店房价码报表',
  [ROUTES.REPORT_BUDGET_DATA_IMPORT]: '财务数据导入',
  [ROUTES.FUNCTION_LIST]: '功能管理',
  [ROUTES.FUNCTION_ADD]: '新增功能',
  [ROUTES.FUNCTION_EDIT]: '编辑功能',
};

interface Tab {
  id: string;
  title: string;
  path: string;
  isHome?: boolean;
}

interface TabContextType {
  tabs: Tab[];
  activeTab: string;
  addTab: (tab: Tab) => void;
  removeTab: (tabId: string) => void;
  setActiveTab: (tabId: string) => void;
  isClosingTab: boolean;
  updateTab: (tabId: string, updates: Partial<Tab>) => void;
}

const TabContext = createContext<TabContextType | undefined>(undefined);

// 生成唯一页签 ID
const generateTabId = (path: string, params: any = {}): string => {
  if (Object.keys(params).length === 0) {
    return path;
  }
  return `${path}_${JSON.stringify(params)}`;
};

const TabProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tabs, setTabs] = useState<Tab[]>(() => {
    const savedTabs = localStorage.getItem('tabs');
    if (savedTabs) {
      try {
        const parsedTabs = JSON.parse(savedTabs);
        if (!parsedTabs.find((tab: Tab) => tab.id === ROUTES.HOME)) {
          return [{ id: ROUTES.HOME, title: '首页', path: ROUTES.HOME, isHome: true }, ...parsedTabs];
        }
        return parsedTabs;
      } catch (e) {
        console.error('Failed to parse saved tabs:', e);
      }
    }
    return [{ id: ROUTES.HOME, title: '首页', path: ROUTES.HOME, isHome: true }];
  });

  const [activeTab, setActiveTab] = useState<string>(() => {
    const savedActiveTab = localStorage.getItem('activeTab');
    return savedActiveTab || ROUTES.HOME;
  });

  const [shouldNavigateHome, setShouldNavigateHome] = useState(false);
  const [isClosingTab, setIsClosingTab] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem('tabs', JSON.stringify(tabs));
    localStorage.setItem('activeTab', activeTab);
  }, [tabs, activeTab]);

  useEffect(() => {
    if (shouldNavigateHome) {
      setIsClosingTab(true);
      navigate(ROUTES.HOME, { replace: true });
      setShouldNavigateHome(false);
      setTimeout(() => {
        setIsClosingTab(false);
      }, 100);
    }
  }, [shouldNavigateHome, navigate]);

  useEffect(() => {
    const currentPath = location.pathname;
    const currentTab = tabs.find(tab => tab.path === currentPath);
    if (currentTab && activeTab !== currentTab.id) {
      setActiveTab(currentTab.id);
    } else if (currentPath === ROUTES.HOME && activeTab !== ROUTES.HOME) {
      setActiveTab(ROUTES.HOME);
    }
  }, [location.pathname, tabs, activeTab]);

  const addTab = useCallback(
    (tab: Tab) => {
      console.log('addTab called with:', { tab, currentTabs: tabs });
      setTabs(prev => {
        if (!prev.find(t => t.id === tab.id)) {
          console.log('Adding new tab:', tab);
          return [...prev, tab];
        }
        console.log('Tab already exists:', tab);
        return prev;
      });
      setActiveTab(tab.id);
      navigate(tab.path);
    },
    [navigate, tabs]
  );

  const removeTab = useCallback(
    (tabId: string) => {
      console.log('removeTab called with:', { tabId, activeTab, tabs });
      const tabToRemove = tabs.find(tab => tab.id === tabId);
      if (!tabToRemove || tabToRemove.isHome) {
        console.log('Tab cannot be removed:', { tabToRemove, isHome: tabToRemove?.isHome });
        return;
      }

      // 先设置关闭状态
      setIsClosingTab(true);

      // 如果是激活的页签，先导航到首页
      if (activeTab === tabId) {
        console.log('Removing active tab, switching to home');
        setActiveTab(ROUTES.HOME);
        navigate(ROUTES.HOME, { replace: true });
      }

      // 延迟移除页签，确保导航完成
      setTimeout(() => {
        setTabs(prev => {
          console.log('Removing tab from tabs array:', { tabId, prevTabs: prev });
          return prev.filter(tab => tab.id !== tabId);
        });
        
        // 延迟重置关闭状态
        setTimeout(() => {
          console.log('Resetting isClosingTab flag');
          setIsClosingTab(false);
        }, 100);
      }, 100);
    },
    [tabs, activeTab, navigate]
  );

  const updateTab = useCallback(
    (tabId: string, updates: Partial<Tab>) => {
      console.log('updateTab called with:', { tabId, updates, currentTabs: tabs });
      setTabs(prev => prev.map(tab => {
        if (tab.id === tabId) {
          console.log('Updating tab:', { oldTab: tab, updates });
          return { ...tab, ...updates };
        }
        return tab;
      }));
    },
    []
  );

  const contextValue = useMemo(
    () => ({
      tabs,
      activeTab,
      addTab,
      removeTab,
      setActiveTab,
      isClosingTab,
      updateTab,
    }),
    [tabs, activeTab, addTab, removeTab, isClosingTab, updateTab]
  );

  return <TabContext.Provider value={contextValue}>{children}</TabContext.Provider>;
};

const TabContent: React.FC = () => {
  const context = useContext(TabContext);
  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();

  if (!context) return null;
  const { tabs, addTab, isClosingTab, activeTab, setActiveTab, removeTab } = context;

  useEffect(() => {
    if (isClosingTab) {
      console.log('Tab is closing, skipping tab creation');
      return;
    }

    const currentPath = location.pathname;
    console.log('TabContent effect:', { currentPath, tabs, activeTab });
    
    // 如果是根路径，重定向到首页
    if (currentPath === '/') {
      navigate(ROUTES.HOME, { replace: true });
      return;
    }

    // 处理退出系统
    if (currentPath === '/login/logout') {
      handleLogout();
      return;
    }

    // 检查是否已经存在对应的页签
    const existingTab = tabs.find(tab => tab.id === currentPath);
    if (existingTab) {
      console.log('Tab already exists:', existingTab);
      return;
    }

    // 检查是否是首页
    if (currentPath === ROUTES.HOME) {
      return;
    }

    // 获取页签标题
    let title = PATH_TO_TITLE[currentPath];
    console.log('当前路径:', currentPath);
    console.log('直接匹配标题:', title);
    
    if (!title) {
      console.log('直接匹配失败，尝试匹配带参数的路由');
      console.log('可用的路由模式:', Object.keys(PATH_TO_TITLE));
      
      // 修改匹配逻辑，使用更精确的路由匹配
      const basePath = Object.keys(PATH_TO_TITLE).find(key => {
        // 将路由路径转换为正则表达式
        const pattern = key
          .replace(/:[^/]+/g, '[^/]+') // 修改这里，只匹配到下一个斜杠
          .replace(/\//g, '\\/'); // 转义斜杠
        const regex = new RegExp(`^${pattern}$`);
        const matches = regex.test(currentPath);
        console.log('路由匹配测试:', {
          originalKey: key,
          pattern,
          currentPath,
          matches
        });
        return matches;
      });
      
      console.log('路由匹配结果:', {
        currentPath,
        basePath,
        title: basePath ? PATH_TO_TITLE[basePath] : '未知页面'
      });
      
      title = basePath ? PATH_TO_TITLE[basePath] : '未知页面';
    }

    // 创建新页签
    if (title) {
      console.log('Creating new tab:', { path: currentPath, title });
      addTab({
        id: currentPath,
        title,
        path: currentPath,
      });
    }
  }, [location.pathname, tabs, addTab, isClosingTab, navigate]);

  const handleLogout = async () => {
    try {
      await request.post('/login/logout');
      // 清除本地存储的token
      localStorage.removeItem('token');
      // 跳转到登录页
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('退出失败:', error);
      // 即使API调用失败，也清除token并跳转到登录页
      localStorage.removeItem('token');
      navigate('/login', { replace: true });
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* 添加侧边栏 */}
      <div style={{ flexShrink: 0 }}>
        <Sidebar />
      </div>
      {/* Tab 内容区域 */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Tabs
          type="editable-card"
          hideAdd={true}
          activeKey={activeTab}
          onChange={(key: string) => {
            console.log('Tab changed:', { from: activeTab, to: key });
            setActiveTab(key);
            const tab = tabs.find(t => t.id === key);
            if (tab) navigate(tab.path);
          }}
          onEdit={(targetKey, action) => {
            console.log('Tab edit:', { targetKey, action, activeTab });
            if (action === 'remove') {
              const tabToRemove = tabs.find(tab => tab.id === targetKey);
              if (tabToRemove) {
                removeTab(targetKey as string);
              }
            }
          }}
          items={tabs.map(tab => ({
            label: tab.title,
            key: tab.id,
            closable: !tab.isHome,
            children: activeTab === tab.id ? (
              <div style={{ padding: '16px', height: 'calc(100vh - 40px)', overflow: 'auto' }}>
                <Routes>
                  <Route path="/" element={<Navigate to={ROUTES.HOME} replace />} />
                  <Route path={ROUTES.HOME} element={<Home />} />
                  <Route path={ROUTES.USER_LIST} element={<UserList />} />
                  <Route path={ROUTES.USER_ADD} element={<UserAdd />} />
                  <Route path={ROUTES.USER_EDIT} element={<UserAdd />} />
                  <Route path={ROUTES.CHAIN_LIST} element={<ChainList />} />
                  <Route path={ROUTES.CHAIN_ADD} element={<ChainAdd />} />
                  <Route path={ROUTES.CHAIN_EDIT} element={<ChainAdd />} />
                  <Route path={ROUTES.HOTEL_LIST} element={<HotelList />} />
                  <Route path={ROUTES.HOTEL_ADD} element={<HotelAdd />} />
                  <Route path={ROUTES.HOTEL_EDIT} element={<HotelEdit />} />
                  <Route path={ROUTES.HOTEL_IMPORT} element={<HotelImport />} />
                  <Route path={ROUTES.ROOM_TYPE_LIST} element={<RoomTypeList />} />
                  <Route path={ROUTES.ROOM_TYPE_ADD} element={<RoomTypeAdd />} />
                  <Route path={ROUTES.ROOM_TYPE_EDIT} element={<RoomTypeAdd />} />
                  <Route path={ROUTES.ROOM_TYPE_IMPORT} element={<RoomTypeImport />} />
                  <Route path={ROUTES.CITY_LIST} element={<CityList />} />
                  <Route path={ROUTES.CITY_ADD} element={<CityAdd />} />
                  <Route path={ROUTES.CHANNEL_LIST} element={<ChannelList />} />
                  <Route path={ROUTES.CHANNEL_ADD} element={<ChannelAdd />} />
                  <Route path={ROUTES.RATE_CODE_LIST} element={<RateCodeList />} />
                  <Route path={ROUTES.RATE_CODE_ADD} element={<RateCodeAdd />} />
                  <Route path={ROUTES.RATE_CODE_EDIT} element={<RateCodeEdit />} />
                  <Route path={ROUTES.RATE_CODE_PRICE_SETTINGS} element={<RateCodePriceSettings />} />
                  <Route path={ROUTES.RATE_CODE_GROUP_LIST} element={<RateCodeGroupList />} />
                  <Route path={ROUTES.RATE_CODE_GROUP_ADD} element={<RateCodeGroupAdd />} />
                  <Route path={ROUTES.RATE_CODE_GROUP_EDIT} element={<RateCodeGroupAdd />} />
                  <Route path={ROUTES.RATE_CODE_GROUP_BOOKING} element={<RateCodeGroupAdd />} />
                  <Route path={ROUTES.RATE_CODE_IMPORT} element={<RateCodeImport />} />
                  <Route path={ROUTES.RATE_PLAN_LIST} element={<RatePlanList />} />
                  <Route path={ROUTES.RESERVATION_LIST} element={<ReservationList />} />
                  <Route path={ROUTES.RESERVATION_AUDIT} element={<ReservationAudit />} />
                  <Route path={ROUTES.RESERVATION_ADD} element={<ReservationAdd />} />
                  <Route path={ROUTES.BOOKING_GROUP_LIST} element={<BookingGroupList />} />
                  <Route path={ROUTES.BOOKING_GROUP_ADD} element={<BookingGroupAdd />} />
                  <Route path={ROUTES.AVAIL_CALENDAR} element={<Availcalendar />} />
                  <Route path={ROUTES.AVAIL_PRICE} element={<AvailPrice />} />
                  <Route path={ROUTES.AVAIL_INVENTORY} element={<AvailInventory />} />
                  <Route path={ROUTES.HOTELBEDS_HOTELS} element={<HotelBedsHotels />} />
                  <Route path={ROUTES.HOTELBEDS_PRICE_CHECK} element={<HotelBedsPriceCheck />} />
                  <Route path={ROUTES.HOMEINNS_HOTELS} element={<HomeinnsHotels />} />
                  <Route path={ROUTES.HOMEINNS_PRICE_CHECK} element={<HomeinnsPriceCheck />} />
                  <Route path={ROUTES.REPORT_HOTEL_DAILY} element={<HotelDailyReport />} />
                  <Route path={ROUTES.REPORT_HOTELS_DAILY} element={<HotelsDailyReport />} />
                  <Route path={ROUTES.REPORT_HOTEL_MONTHLY} element={<HotelMonthlyReport />} />
                  <Route path={ROUTES.REPORT_HOTELS_MONTHLY} element={<HotelsMonthlyReport />} />
                  <Route path={ROUTES.REPORT_HOTEL_FORECAST_COMPARE} element={<HotelForecastCompareReport />} />
                  <Route path={ROUTES.REPORT_HOTEL_FORECAST_ACCURACY} element={<HotelForecastAccuracyReport />} />
                  <Route path={ROUTES.REPORT_OVERALL_OPERATION} element={<OverallOperationReport />} />
                  <Route path={ROUTES.REPORT_ROOM_DATA} element={<RoomDataReport />} />
                  <Route path={ROUTES.REPORT_FOOD_DATA} element={<FoodDataReport />} />
                  <Route path={ROUTES.REPORT_MARKET_SEGMENT} element={<MarketSegmentReport />} />
                  <Route path={ROUTES.REPORT_CHANNEL_SEGMENT} element={<ChannelSegmentReport />} />
                  <Route path={ROUTES.REPORT_HOTEL_PERFORMANCE} element={<HotelPerformanceReport />} />
                  <Route path={ROUTES.REPORT_INDICATOR_TREND} element={<BusinessMTDReport />} />
                  <Route path={ROUTES.REPORT_BUDGET_ENTRY} element={<BudgetEntryReport />} />
                  <Route path={ROUTES.REPORT_FORECAST_ENTRY} element={<ForecastEntryReport />} />
                  <Route path={ROUTES.REPORT_BUDGET_ENTRY_UC} element={<BudgetEntryReportUC />} />
                  <Route path={ROUTES.REPORT_FORECAST_ENTRY_UC} element={<ForecastEntryReportUC />} />
                  <Route path={ROUTES.SESSION_SET} element={<SessionSet />} />
                  <Route path={ROUTES.HOTEL_CHECKING} element={<HotelChecking />} />
                  <Route path={ROUTES.COMPANY_LIST} element={<CompanyList />} />
                  <Route path={ROUTES.COMPANY_ADD} element={<CompanyAdd />} />
                  <Route path={ROUTES.COMPANY_EDIT} element={<CompanyAdd />} />
                  <Route path={ROUTES.REVENUE_ANALYSIS} element={<RevenueAnalysis />} />
                  <Route path={ROUTES.PRODUCTION_REPORT} element={<ProductionReport />} />
                  <Route path={ROUTES.DATA_REPORT} element={<DataReport />} />
                  <Route path={ROUTES.RATECODE_REPORT} element={<RatecodeReport />} />
                  <Route path={ROUTES.HOTEL_RATECODE_REPORT} element={<HotelRatecodeReport />} />
                  <Route path={ROUTES.REPORT_BUDGET_DATA_IMPORT} element={<BudgetDataImport />} />
                  <Route path={ROUTES.FUNCTION_LIST} element={<FunctionList />} />
                  <Route path={ROUTES.FUNCTION_ADD} element={<FunctionAdd />} />
                  <Route path={ROUTES.FUNCTION_EDIT} element={<FunctionEdit />} />
                  <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
                </Routes>
              </div>
            ) : null,
          }))}
        />
      </div>
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={
          <TabProvider>
            <TabContent />
          </TabProvider>
        } />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
export { TabContext };