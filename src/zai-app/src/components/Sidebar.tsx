import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHotel, FaHome, FaUsers, FaBed, FaTags, FaBoxOpen, FaShoppingCart, FaUserCog, FaProjectDiagram, FaExchangeAlt, FaCity, FaCogs, FaHistory, FaUser, FaKey, FaSignOutAlt, FaBuilding, FaClipboardList, FaChartLine, FaGlobe, FaUpload } from 'react-icons/fa';
import { CaretRightOutlined } from '@ant-design/icons';
import request from '../utils/request';
import { message } from 'antd';

interface MenuItem {
  id: string;
  title: string;
  path?: string;
  icon?: React.ReactNode;
  children?: MenuItem[];
  group?: boolean; // 是否为分组标题
  checkToken?: boolean; // 是否检查token
}

const menuItems: MenuItem[] = [
  {
    id: 'logo',
    title: '酒店管理系统',
    icon: <FaHotel className="mr-2 text-xl" />, // LOGO
    group: true,
  },
  {
    id: 'home',
    title: '首页',
    path: '/home',
    icon: <FaHome className="mr-2" />,
  },
  {
    id: 'reservation-management',
    title: '订单管理',
    icon: <FaClipboardList className="mr-2" />,
    children: [
      {
        id: 'reservation-list',
        title: '订单处理',
        path: '/reservation/list',
        icon: <FaClipboardList className="mr-2" />,
      },
      {
        id: 'reservation-entry',
        title: '录入订单',
        path: '/reservation/add',
        icon: <FaClipboardList className="mr-2" />,
      },
      {
        id: 'stay-review',
        title: '住店审核',
        path: '/reservation/audit',
        icon: <FaClipboardList className="mr-2" />,
      },
      {
        id: 'group-list',
        title: '团队订单',
        path: '/reservation/booking/group/list',
        icon: <FaClipboardList className="mr-2" />,
        checkToken: false,
      },
      {
        id: 'reservation-entry',
        title: '团队预订',
        path: '/reservation/booking/group/add',
        icon: <FaClipboardList className="mr-2" />,
        checkToken: false,
      },
    ],
  },
  {
    id: 'rate-room-status',
    title: '房价房态',
    icon: <FaChartLine className="mr-2" />,
    children: [
      {
        id: 'calendar',
        title: '日历',
        path: '/avail/calendar',
        icon: <FaChartLine className="mr-2" />,
      },
      {
        id: 'rate-maintenance',
        title: '房价维护',
        path: '/avail/price',
        icon: <FaChartLine className="mr-2" />,
      },
      {
        id: 'room-status',
        title: '房态房量',
        path: '/avail/inventory',
        icon: <FaChartLine className="mr-2" />,
      },
    ],
  },
  {
    id: 'group',
    title: '集团管理',
    icon: <FaBuilding className="mr-2" />,
    children: [
      {
        id: 'company-list',
        title: '协议公司',
        path: '/company/list',
        icon: <FaBuilding className="mr-2" />,
      },
    ],
  },
  {
    id: 'hotel',
    title: '酒店管理',
    icon: <FaHotel className="mr-2" />,
    children: [
      {
        id: 'price-list',
        title: '促销管理',
        path: '/api/ratecode/list',
        icon: <FaTags className="mr-2" />,
      },
      {
        id: 'room-list',
        title: '房型列表',
        path: '/api/roomtype/list',
        icon: <FaBed className="mr-2" />,
      },
      {
        id: 'product-list',
        title: '商品列表',
        path: '/rateplan/list',
        icon: <FaShoppingCart className="mr-2" />,
      },
      {
        id: 'group-list',
        title: '团队房',
        path: '/api/ratecode/group/list',
        icon: <FaTags className="mr-2" />,
        checkToken: false,
      },
    ],
  },  
  {
    id: 'finance',
    title: '财务',
    icon: <FaHotel className="mr-2" />,
    children: [
      {
        id: 'hotel-checking',
        title: '酒店对账',
        path: '/reconcile/hotel-checking',
        icon: <FaGlobe className="mr-2" />,
        checkToken: false,
      },
    ],
  }, 
  {
    id: 'report-data-import',
    title: '数据导入',
    icon: <FaHotel className="mr-2" />,
    children: [
      {
        id: 'budget-data-import',
        title: '诺金数据导入',
        path: '/report/budget-data-import',
        icon: <FaGlobe className="mr-2" />,
        checkToken: false,
      },
      {
        id: 'hotel-import',
        title: '酒店导入',
        path: '/hotel/import',
        icon: <FaUpload className="mr-2" />,
      },
      {
        id: 'roomtype-import',
        title: '房型导入',
        path: '/roomtype/import',
        icon: <FaUpload className="mr-2" />,
      },
      {
        id: 'ratecode-import',
        title: '房价码导入',
        path: '/ratecode/import',
        icon: <FaUpload className="mr-2" />,
      },
    ],
  },
  {
    id: 'report',
    title: '报表',
    icon: <FaUserCog className="mr-2" />,
    children: [
      {
        id: 'report-overall-operation',
        title: '整体经营',
        path: '/report/overall-operation',
        icon: <FaProjectDiagram className="mr-2" />,
        checkToken: false,
      },
      {
        id: 'report-room-data',
        title: '客房经营',
        path: '/report/room-data',
        icon: <FaProjectDiagram className="mr-2" />,
        checkToken: false,
      },
      {
        id: 'report-food-data',
        title: '餐饮经营',
        path: '/report/food-data',
        icon: <FaProjectDiagram className="mr-2" />,
        checkToken: false,
      },
      {
        id: 'report-hotel-daily',
        title: '酒店日报',
        path: '/report/hotel-daily',
        icon: <FaProjectDiagram className="mr-2" />,
        checkToken: false,
      },
      {
        id: 'report-hotels-daily',
        title: '集团日报',
        path: '/report/hotels-daily',
        icon: <FaProjectDiagram className="mr-2" />,
        checkToken: false,
      },
      {
        id: 'report-hotel-monthly',
        title: '酒店月报',
        path: '/report/hotel-monthly',
        icon: <FaProjectDiagram className="mr-2" />,
        checkToken: false,
      },
      {
        id: 'report-hotels-monthly',
        title: '集团月报',
        path: '/report/hotels-monthly',
        icon: <FaProjectDiagram className="mr-2" />,
        checkToken: false,
      },
      {
        id: 'report-hotel-forecast-compare',
        title: '酒店预测环比',
        path: '/report/hotel-forecast-compare',
        icon: <FaProjectDiagram className="mr-2" />,
        checkToken: false,
      },
      {
        id: 'report-hotel-forecast-accuracy',
        title: '酒店预测准确率',
        path: '/report/hotel-forecast-accuracy',
        icon: <FaProjectDiagram className="mr-2" />,
        checkToken: false,
      },
      {
        id: 'report-market-segment',
        title: '市场细分',
        path: '/report/market-segment',
        icon: <FaProjectDiagram className="mr-2" />,
        checkToken: false,
      },
      {
        id: 'report-channel-segment',
        title: '渠道细分',
        path: '/report/channel-segment',
        icon: <FaProjectDiagram className="mr-2" />,
        checkToken: false,
      },
      {
        id: 'report-hotel-performance',
        title: '酒店业绩',
        path: '/report/hotel-performance',
        icon: <FaProjectDiagram className="mr-2" />,
        checkToken: false,
      },
      {
        id: 'report-indicator-trend',
        title: '指标趋势',
        path: '/report/indicator-trend',
        icon: <FaProjectDiagram className="mr-2" />,
        checkToken: false,
      },
    ],
  },
  {
    id: 'budget-forecast',
    title: '预算预测',
    icon: <FaChartLine className="mr-2" />,
    children: [  
      {
        id: 'report-budget-entry',
        title: '诺金预算填报',
        path: '/report/budget-entry',
        icon: <FaProjectDiagram className="mr-2" />,
        checkToken: false,
      },
      {
        id: 'report-forecast-entry',
        title: '诺金预测填报',
        path: '/report/forecast-entry',
        icon: <FaProjectDiagram className="mr-2" />,
        checkToken: false,
      },    
      {
        id: 'report-budget-entry',
        title: '逸扉预算填报',
        path: '/report/budget-entry-uc',
        icon: <FaProjectDiagram className="mr-2" />,
        checkToken: false,
      },
      {
        id: 'report-forecast-entry',
        title: '逸扉预测填报',
        path: '/report/forecast-entry-uc',
        icon: <FaProjectDiagram className="mr-2" />,
        checkToken: false,
      },
    ],
  },
  {
    id: 'revenue-analysis',
    title: '收益分析',
    icon: <FaChartLine className="mr-2" />,
    children: [
      {
        id: 'production-report',
        title: '产量报表',
        path: '/revenue-analysis/production-report',
        icon: <FaProjectDiagram className="mr-2" />,
        checkToken: false,
      },
      {
        id: 'data-report',
        title: '数据报表',
        path: '/revenue-analysis/data-report',
        icon: <FaProjectDiagram className="mr-2" />,
        checkToken: false,
      },
      {
        id: 'ratecode-report',
        title: '房价码报表',
        path: '/revenue-analysis/ratecode-report',
        icon: <FaProjectDiagram className="mr-2" />,
        checkToken: false,
      },
      {
        id: 'hotel-ratecode-report',
        title: '酒店房价码报表',
        path: '/revenue-analysis/hotel-ratecode-report',
        icon: <FaProjectDiagram className="mr-2" />,
        checkToken: false,
      },
    ],
  },
  {
    id: 'admin',
    title: '管理员',
    icon: <FaUserCog className="mr-2" />,
    children: [
      {
        id: 'admin-group-list',
        title: '集团列表',
        path: '/chain/list',
        icon: <FaProjectDiagram className="mr-2" />,
      },
      {
        id: 'hotel-list',
        title: '酒店列表',
        path: '/hotel/list',
        icon: <FaHotel className="mr-2" />,
      },
      {
        id: 'channel-list',
        title: '渠道列表',
        path: '/channel/list',
        icon: <FaExchangeAlt className="mr-2" />,
      },
      {
        id: 'city-list',
        title: '城市列表',
        path: '/city/list',
        icon: <FaCity className="mr-2" />,
      },
      {
        id: 'group-user-list',
        title: '用户列表',
        path: '/user/list',
        icon: <FaUsers className="mr-2" />,
      },
      {
        id: 'function-management',
        title: '功能管理',
        path: '/function/list',
        icon: <FaCogs className="mr-2" />,
      },
      {
        id: 'system-settings',
        title: '系统设置',
        path: '/systemconfig/SessionSet',
        icon: <FaCogs className="mr-2" />,
      },
      {
        id: 'log',
        title: '操作日志',
        path: '/log/LogList',
        icon: <FaHistory className="mr-2" />,
      },
    ],
  }, 
  {
    id: 'interface',
    title: '接口',
    icon: <FaHotel className="mr-2" />,
    children: [
      {
        id: 'hotelbeds-hotels',
        title: 'HB酒店同步',
        path: '/hotelbeds/hotels',
        icon: <FaGlobe className="mr-2" />,
        checkToken: false,
      },
      {
        id: 'hotelbeds-price-check',
        title: 'HB价格检查',
        path: '/hotelbeds/price-check',
        icon: <FaGlobe className="mr-2" />,
        checkToken: false,
      },
      {
        id: 'homeinns-hotels',
        title: '如家酒店同步',
        path: '/homeinns/hotels',
        icon: <FaGlobe className="mr-2" />,
        checkToken: false,
      },
      {
        id: 'homeinns-price-check',
        title: '如家价格检查',
        path: '/homeinns/price-check',
        icon: <FaGlobe className="mr-2" />,
        checkToken: false,
      },
    ],
  },
  {
    id: 'user-info',
    title: '用户信息',
    path: '/user/info',
    icon: <FaUser className="mr-2" />,
    children: [
      {
        id: 'change-password',
        title: '修改密码',
        path: '/user/password',
        icon: <FaKey className="mr-2" />,
      },
    ],
  },
  {
    id: 'logout',
    title: '退出系统',
    path: '/login/logout',
    icon: <FaSignOutAlt className="mr-2" />,
    checkToken: false,
  },
];

const Sidebar = () => {
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev =>
      prev.includes(menuId)
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  const handleMenuClick = async (path: string, checkToken: boolean = true) => {
    // 检查token是否存在
    const token = localStorage.getItem('token');
    if (checkToken && !token) {
      message.error('未登录或登录已过期，请重新登录');
      navigate('/login');
      return;
    }

    // 如果是退出系统，调用退出接口
    if (path === '/login/logout') {
      try {
        await request.post('/login/logout', {}, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        // 清除本地存储
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        // 跳转到登录页
        navigate('/login', { replace: true });
      } catch (error) {
        console.error('退出失败:', error);
        // 即使API调用失败，也清除token并跳转到登录页
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        navigate('/login', { replace: true });
      }
      return;
    }

    // 其他菜单项直接跳转
    navigate(path);
  };

  const renderMenuItem = (item: MenuItem) => {
    if (item.group) {
      return (
        <div key={item.id} className="flex items-center px-4 py-5 mb-2 text-gray-100 text-lg font-bold tracking-wide bg-[#232a36] border-b border-[#232a36]">
          {item.icon}
          <span className={collapsed ? 'hidden' : 'inline ml-2'}>{item.title}</span>
        </div>
      );
    }
    const hasChildren = Boolean(item.children?.length);
    const isExpanded = expandedMenus.includes(item.id);
    const isLogout = item.id === 'logout';
    return (
      <div key={item.id} className="mb-1">
        {item.path && !hasChildren ? (
          <div
            onClick={() => handleMenuClick(item.path!, item.checkToken)}
            className={`flex items-center px-4 py-3 rounded text-gray-200 hover:bg-[#2d3643] cursor-pointer ${isLogout ? 'mt-auto' : ''}`}
          >
            {item.icon}
            <span className={collapsed ? 'hidden' : 'inline ml-2'}>{item.title}</span>
          </div>
        ) : (
          <div
            className={`flex items-center px-4 py-3 rounded cursor-pointer text-gray-200 hover:bg-[#2d3643] ${hasChildren ? 'justify-between' : ''}`}
            onClick={() => hasChildren && toggleMenu(item.id)}
          >
            <div className="flex items-center">
              {item.icon}
              <span className={collapsed ? 'hidden' : 'inline ml-2'}>{item.title}</span>
            </div>
            {hasChildren && !collapsed && (
              <CaretRightOutlined 
                className={`text-xs ml-2 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
              />
            )}
          </div>
        )}
        {hasChildren && isExpanded && item.children && !collapsed && (
          <div className="ml-8 mt-1 space-y-1">
            {item.children.map(child => (
              <div
                key={child.id}
                onClick={() => handleMenuClick(child.path!, child.checkToken)}
                className="flex items-center px-3 py-2 text-sm text-gray-300 hover:bg-[#232a36] rounded cursor-pointer"
              >
                {child.icon}
                <span>{child.title}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className={`h-full bg-[#232a36] shadow-md transition-all duration-200 flex flex-col`}>
      {/* Collapse/Expand Button */}
      <div className="flex items-center justify-end px-2 pt-2 pb-1">
        <button
          className="text-gray-300 hover:text-white focus:outline-none"
          onClick={() => setCollapsed(c => !c)}
          aria-label={collapsed ? '展开菜单' : '收起菜单'}
        >
          <span className="text-lg">{collapsed ? '»' : '«'}</span>
        </button>
      </div>
      <nav className="flex flex-col pt-2 flex-grow overflow-y-auto">
        {menuItems.map(renderMenuItem)}
      </nav>
    </aside>
  );
};

export default Sidebar;
