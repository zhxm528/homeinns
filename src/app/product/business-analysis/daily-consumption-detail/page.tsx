'use client';
import '@ant-design/v5-patch-for-react-19';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
// @ts-ignore: antd may not have types installed in this environment
import 'antd/dist/reset.css';
// @ts-ignore: antd types might be missing
import { DatePicker, ConfigProvider, Button, Select, Pagination, Table, Input } from 'antd';
// @ts-ignore: antd types might be missing
import type { ColumnsType } from 'antd/es/table';
// @ts-ignore: antd locale types might be missing
import zhCN from 'antd/locale/zh_CN';
// @ts-ignore: dayjs types might be missing
import dayjs from 'dayjs';

export default function DailyConsumptionDetailPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 查询条件
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [hotelIds, setHotelIds] = useState<string[]>([]);
  const [dept, setDept] = useState<string>('');
  const [class1, setClass1] = useState<string>('');

  // 从API获取的选项列表
  const [hotelCodeOptions, setHotelCodeOptions] = useState<Array<{ label: string; value: string }>>([]);
  const [deptOptions, setDeptOptions] = useState<Array<{ label: string; value: string }>>([]);

  // 表格数据与分页
  const [rows, setRows] = useState<any[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // 默认日期范围：最近30天
  // 注意：这个函数只在客户端调用，避免在服务器端渲染时产生不同的日期
  const getDefaultDateRange = () => {
    // 确保只在客户端执行
    if (typeof window === 'undefined') {
      // 服务器端返回固定值，避免 hydration 不匹配
      return {
        startDate: '',
        endDate: '',
      };
    }
    const endDate = dayjs();
    const startDate = dayjs().subtract(29, 'day');
    return {
      startDate: startDate.format('YYYY-MM-DD'),
      endDate: endDate.format('YYYY-MM-DD'),
    };
  };

  const formatNumber = (value: number | null | undefined) => {
    if (value === null || value === undefined || isNaN(Number(value))) return '';
    const num = Number(value);
    const fixed = num.toFixed(2);
    const trimmed = fixed.replace(/\.00$/, '').replace(/(\.\d*[1-9])0+$/, '$1');
    return trimmed.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleStartDateChange = (date: any, dateString: string | string[]) => {
    const dateStr = Array.isArray(dateString) ? dateString[0] || '' : dateString || '';
    setStartDate(dateStr);
  };

  const handleEndDateChange = (date: any, dateString: string | string[]) => {
    const dateStr = Array.isArray(dateString) ? dateString[0] || '' : dateString || '';
    setEndDate(dateStr);
  };

  // 表格列定义
  const tableColumns: ColumnsType<any> = useMemo(() => {
    return [
      {
        title: '业务日期',
        dataIndex: '业务日期',
        key: '业务日期',
        fixed: 'left' as const,
        width: 120,
        render: (text: string | Date) => {
          if (!text) return '-';
          // 如果是 Date 对象，格式化为 YYYY-MM-DD
          if (text instanceof Date) {
            const year = text.getFullYear();
            const month = String(text.getMonth() + 1).padStart(2, '0');
            const day = String(text.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
          }
          // 如果是字符串，尝试解析并格式化
          if (typeof text === 'string') {
            // 如果已经是 YYYY-MM-DD 格式，直接返回
            if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
              return text;
            }
            // 尝试解析日期字符串
            const date = new Date(text);
            if (!isNaN(date.getTime())) {
              const year = date.getFullYear();
              const month = String(date.getMonth() + 1).padStart(2, '0');
              const day = String(date.getDate()).padStart(2, '0');
              return `${year}-${month}-${day}`;
            }
            // 如果无法解析，返回原始字符串
            return text;
          }
          return '-';
        },
      },
      {
        title: '酒店代码',
        dataIndex: '酒店代码',
        key: '酒店代码',
        fixed: 'left' as const,
        width: 120,
        render: (text: string) => text || '-',
      },
      {
        title: '酒店名称',
        dataIndex: '酒店名称',
        key: '酒店名称',
        width: 200,
        render: (text: string) => text || '-',
      },
      {
        title: '管理公司',
        dataIndex: '管理公司',
        key: '管理公司',
        width: 120,
        render: (text: string) => text || '-',
      },
      {
        title: '部门代码',
        dataIndex: '部门代码',
        key: '部门代码',
        width: 120,
        render: (text: string) => text || '-',
      },
      {
        title: '部门名称',
        dataIndex: '部门名称',
        key: '部门名称',
        width: 120,
        render: (text: string) => text || '-',
      },
      {
        title: '大类',
        dataIndex: '大类',
        key: '大类',
        width: 120,
        render: (text: string) => text || '-',
      },
      {
        title: '二级分类代码',
        dataIndex: '二级分类代码',
        key: '二级分类代码',
        width: 150,
        render: (text: string) => text || '-',
      },
      {
        title: '二级分类名称',
        dataIndex: '二级分类名称',
        key: '二级分类名称',
        width: 200,
        render: (text: string) => text || '-',
      },
      {
        title: '一级科目代码',
        dataIndex: '一级科目代码',
        key: '一级科目代码',
        width: 150,
        render: (text: string) => text || '-',
      },
      {
        title: '一级科目名称',
        dataIndex: '一级科目名称',
        key: '一级科目名称',
        width: 200,
        render: (text: string) => text || '-',
      },
      {
        title: '收入金额',
        dataIndex: '收入金额',
        key: '收入金额',
        width: 150,
        align: 'right' as const,
        render: (value: number) => formatNumber(value),
      },
      {
        title: '冲减金额',
        dataIndex: '冲减金额',
        key: '冲减金额',
        width: 150,
        align: 'right' as const,
        render: (value: number) => formatNumber(value),
      },
      {
        title: '净收入金额',
        dataIndex: '净收入金额',
        key: '净收入金额',
        width: 150,
        align: 'right' as const,
        render: (value: number) => formatNumber(value),
      },
    ];
  }, []);

  const handleQuery = async (toPage?: number, toPageSize?: number) => {
    try {
      setLoading(true);
      setError(null);
      const currentPage = toPage ?? page;
      const currentSize = toPageSize ?? pageSize;
      
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      if (hotelIds.length > 0) params.append('hotelIds', hotelIds.join(','));
      if (dept && dept.trim()) params.append('deptname', dept.trim());
      if (class1 && class1.trim()) params.append('descript', class1.trim());
      params.append('page', String(currentPage));
      params.append('pageSize', String(currentSize));

      const res = await fetch(`/api/product/business-analysis/daily-consumption-detail?${params.toString()}`);
      const json = await res.json();
      
      if (json.success) {
        // 为每条记录添加唯一标识符，确保 rowKey 的唯一性
        // 使用数据字段组合生成唯一ID，避免使用 Date.now() 和 Math.random() 导致 hydration 不匹配
        const itemsWithId = (json.data.items || []).map((item: any, idx: number) => {
          // 使用数据字段组合生成唯一标识符
          const dateStr = item.业务日期 != null ? String(item.业务日期) : '';
          const hotelCode = item.酒店代码 != null ? String(item.酒店代码) : '';
          const deptCode = item.部门代码 != null ? String(item.部门代码) : '';
          const class1Code = item.一级科目代码 != null ? String(item.一级科目代码) : '';
          const class2Code = item.二级分类代码 != null ? String(item.二级分类代码) : '';
          const amount = item.收入金额 != null ? String(item.收入金额) : '';
          const rebate = item.冲减金额 != null ? String(item.冲减金额) : '';
          // 组合字段生成唯一ID，如果数据本身有唯一性，这个ID也会是唯一的
          const uniqueId = `${dateStr}-${hotelCode}-${deptCode}-${class1Code}-${class2Code}-${amount}-${rebate}-${idx}`;
          return {
            ...item,
            __uniqueId: uniqueId,
          };
        });
        setRows(itemsWithId);
        setTotal(json.data.total || 0);
        setPage(currentPage);
        setPageSize(currentSize);

        // 更新选项列表
        if (json.data.options) {
          if (json.data.options.hotelCodes) {
            setHotelCodeOptions(json.data.options.hotelCodes);
          }
          if (json.data.options.depts) {
            setDeptOptions(json.data.options.depts);
          }
          // 不再需要 class1Options，因为改为文本输入框
        }
      } else {
        setRows([]);
        setTotal(0);
        setError(json.error || '加载数据失败');
      }
    } catch (e) {
      console.error('加载数据失败:', e);
      setError('网络请求失败，请检查网络连接');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    const defaultDates = getDefaultDateRange();
    setStartDate(defaultDates.startDate);
    setEndDate(defaultDates.endDate);
    setHotelIds([]);
    setDept('');
    setClass1('');
    setPage(1);
    setPageSize(10);
    setRows([]);
    setTotal(0);
    setError(null);
  };

  // 页面加载时设置默认日期并加载选项列表
  useEffect(() => {
    const initialize = async () => {
      const defaultDates = getDefaultDateRange();
      setStartDate(defaultDates.startDate);
      setEndDate(defaultDates.endDate);
      // 调用一次查询以获取选项列表（不显示数据）
      await handleQuery(1, 1);
      setRows([]);
      setTotal(0);
    };
    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 已选择的查询条件
  const selectedConditions = useMemo(() => {
    const conditions: Array<{ key: string; label: string; onRemove: () => void }> = [];
    
    if (startDate) {
      conditions.push({
        key: 'startDate',
        label: `起始日期: ${startDate}`,
        onRemove: () => setStartDate(''),
      });
    }
    if (endDate) {
      conditions.push({
        key: 'endDate',
        label: `结束日期: ${endDate}`,
        onRemove: () => setEndDate(''),
      });
    }
    if (hotelIds.length > 0) {
      conditions.push({
        key: 'hotelIds',
        label: `酒店代码: ${hotelIds.join(', ')}`,
        onRemove: () => setHotelIds([]),
      });
    }
    if (dept && dept.trim()) {
      conditions.push({
        key: 'deptname',
        label: `科目大类名称: ${dept}`,
        onRemove: () => setDept(''),
      });
    }
    if (class1 && class1.trim()) {
      conditions.push({
        key: 'descript',
        label: `科目名称: ${class1}`,
        onRemove: () => setClass1(''),
      });
    }
    
    return conditions;
  }, [startDate, endDate, hotelIds, dept, class1]);

  // 处理分页大小变化（支持"全部"）
  const handlePageSizeChange = (current: number, size: number) => {
    setPageSize(size);
    if (size === 1000) {
      // "全部"选项，使用一个很大的值
      handleQuery(1, 10000);
    } else {
      handleQuery(1, size);
    }
  };

  return (
    <ConfigProvider locale={zhCN}>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 页面标题和返回按钮 */}
          <div className="mb-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">每日消费明细</h1>
                <p className="text-gray-600">查询和管理每日消费明细信息</p>
              </div>
              <Link
                href="/product"
                className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                返回
              </Link>
            </div>
            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 查询条件 */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">起始日期</label>
                <DatePicker
                  className="w-full"
                  value={startDate ? dayjs(startDate) : null}
                  onChange={handleStartDateChange}
                  format="YYYY-MM-DD"
                  placeholder="选择起始日期"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">结束日期</label>
                <DatePicker
                  className="w-full"
                  value={endDate ? dayjs(endDate) : null}
                  onChange={handleEndDateChange}
                  format="YYYY-MM-DD"
                  placeholder="选择结束日期"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">酒店代码</label>
                <Select
                  mode="multiple"
                  allowClear
                  showSearch
                  placeholder="选择或输入酒店代码（支持模糊查询）..."
                  className="w-full"
                  value={hotelIds}
                  onChange={(vals) => setHotelIds(vals as string[])}
                  options={hotelCodeOptions}
                  filterOption={(input, option) =>
                    ((option?.label as string) || '').toLowerCase().includes(input.toLowerCase())
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">科目大类名称</label>
                <Input
                  placeholder="请输入科目大类名称..."
                  className="w-full"
                  value={dept}
                  onChange={(e) => setDept(e.target.value)}
                  allowClear
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">科目名称</label>
                <Input
                  placeholder="请输入科目名称..."
                  className="w-full"
                  value={class1}
                  onChange={(e) => setClass1(e.target.value)}
                  allowClear
                />
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="mt-6 flex gap-4">
              <Button
                type="primary"
                onClick={() => handleQuery(1, pageSize)}
                loading={loading}
              >
                查询
              </Button>
              <Button
                onClick={handleReset}
                style={{ backgroundColor: '#9ca3af', borderColor: '#9ca3af', color: '#ffffff' }}
              >
                重置
              </Button>
            </div>
          </div>

          {/* 已选择的查询条件 */}
          {selectedConditions.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="text-sm font-medium text-blue-900 mb-2">已选择的查询条件：</div>
              <div className="flex flex-wrap gap-2">
                {selectedConditions.map((condition) => (
                  <span
                    key={condition.key}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {condition.label}
                    <button
                      onClick={condition.onRemove}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                      type="button"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 表格 */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <Table
              columns={tableColumns}
              dataSource={rows}
              loading={loading}
              scroll={{ x: 2000, y: 600 }}
              pagination={false}
              rowKey={(record) => {
                // 优先使用唯一标识符（如果存在），这是最可靠的方式
                if (record.__uniqueId) {
                  return record.__uniqueId;
                }
                
                // 如果 __uniqueId 不存在（不应该发生，但作为后备方案）
                // 使用多个字段组合生成唯一key，避免使用已弃用的index参数
                // 确保所有字段都被正确转换为字符串，包括0值
                const dateStr = record.业务日期 != null ? String(record.业务日期) : '';
                const hotelCode = record.酒店代码 != null ? String(record.酒店代码) : '';
                const hotelName = record.酒店名称 != null ? String(record.酒店名称) : '';
                const groupCode = record.管理公司 != null ? String(record.管理公司) : '';
                const deptCode = record.部门代码 != null ? String(record.部门代码) : '';
                const deptName = record.部门名称 != null ? String(record.部门名称) : '';
                const category = record.大类 != null ? String(record.大类) : '';
                const class1Code = record.一级科目代码 != null ? String(record.一级科目代码) : '';
                const class1Name = record.一级科目名称 != null ? String(record.一级科目名称) : '';
                const class2Code = record.二级分类代码 != null ? String(record.二级分类代码) : '';
                const class2Name = record.二级分类名称 != null ? String(record.二级分类名称) : '';
                // 数值字段：确保0值也被包含
                const amount = record.收入金额 != null ? String(record.收入金额) : '';
                const rebate = record.冲减金额 != null ? String(record.冲减金额) : '';
                const netAmount = record.净收入金额 != null ? String(record.净收入金额) : '';
                
                // 组合所有字段生成唯一key，包括所有可用字段以确保唯一性
                const baseKey = `${dateStr}-${hotelCode}-${hotelName}-${groupCode}-${deptCode}-${deptName}-${category}-${class1Code}-${class1Name}-${class2Code}-${class2Name}-${amount}-${rebate}-${netAmount}`;
                
                // 使用 baseKey 作为后备方案（不使用随机数，避免 hydration 不匹配）
                // 这不应该发生，因为每条记录都应该有 __uniqueId
                return baseKey;
              }}
            />
            <div className="p-4 border-t border-gray-200">
              <Pagination
                current={page}
                pageSize={pageSize}
                total={total}
                showSizeChanger
                pageSizeOptions={['10', '100', '1000']}
                showTotal={(total, range) => {
                  if (pageSize === 1000) {
                    return `共 ${total} 条（全部显示）`;
                  }
                  return `第 ${range[0]}-${range[1]} 条，共 ${total} 条`;
                }}
                onChange={(newPage, newPageSize) => {
                  setPageSize(newPageSize);
                  if (newPageSize === 1000) {
                    handleQuery(newPage, 10000);
                  } else {
                    handleQuery(newPage, newPageSize);
                  }
                }}
                onShowSizeChange={handlePageSizeChange}
              />
            </div>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
}
