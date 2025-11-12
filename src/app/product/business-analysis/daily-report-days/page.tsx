'use client';
import '@ant-design/v5-patch-for-react-19';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
// @ts-ignore: antd may not have types installed in this environment
import 'antd/dist/reset.css';
// @ts-ignore: antd types might be missing
import { ConfigProvider, Table } from 'antd';
// @ts-ignore: antd types might be missing
import type { ColumnsType } from 'antd/es/table';
// @ts-ignore: antd locale types might be missing
import zhCN from 'antd/locale/zh_CN';
// @ts-ignore: echarts types might be missing
import ReactECharts from 'echarts-for-react';

export default function DailyReportDaysPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [hotelInfo, setHotelInfo] = useState<any>({});

  // 从URL参数中获取查询条件
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const params = new URLSearchParams(window.location.search);
        const hotelCode = params.get('hotelCode') || '';
        const startDate = params.get('startDate') || '';
        const endDate = params.get('endDate') || '';

        if (!hotelCode || !startDate || !endDate) {
          setError('缺少必要的查询参数');
          return;
        }

        const queryParams = new URLSearchParams();
        queryParams.append('hotelCode', hotelCode);
        queryParams.append('startDate', startDate);
        queryParams.append('endDate', endDate);

        const response = await fetch(`/api/product/business-analysis/daily-report-days?${queryParams.toString()}`);
        const json = await response.json();
        if (json.success) {
          setData(json.data.data || []);
          setHotelInfo(json.data.hotelInfo || {});
        } else {
          setError(json.error || '加载数据失败');
        }
      } catch (e) {
        console.error('加载数据失败:', e);
        setError('网络请求失败，请检查网络连接');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatNumber = (value: number) => {
    if (value === null || value === undefined || isNaN(value)) return '';
    const fixed = value.toFixed(2);
    const trimmed = fixed.replace(/\.00$/, '').replace(/(\.\d*[1-9])0+$/, '$1');
    return trimmed.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const formatPercentage = (value: number) => {
    if (value === null || value === undefined || isNaN(value)) return '';
    const fixed = value.toFixed(4);
    const trimmed = fixed.replace(/\.0000$/, '').replace(/(\.\d*[1-9])0+$/, '$1');
    return trimmed;
  };

  // 准备图表数据
  const chartOption = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        title: {
          text: '经营日报-每日趋势',
          left: 'center',
        },
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          data: ['客房收入', '餐饮收入', '其他收入', '实际售卖间夜数', '出租率', '平均房价'],
          top: 30,
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: [],
        },
        yAxis: [
          {
            type: 'value',
            name: '金额/间夜数',
            position: 'left',
          },
          {
            type: 'value',
            name: '出租率/平均房价',
            position: 'right',
          },
        ],
        series: [],
      };
    }

    // 按日期排序
    const sortedData = [...data].sort((a, b) => {
      const dateA = new Date(a.日期).getTime();
      const dateB = new Date(b.日期).getTime();
      return dateA - dateB;
    });

    const dates = sortedData.map((row) => row.日期);
    const 客房收入 = sortedData.map((row) => Number(row.客房收入) || 0);
    const 餐饮收入 = sortedData.map((row) => Number(row.餐饮收入) || 0);
    const 其他收入 = sortedData.map((row) => Number(row.其他收入) || 0);
    const 实际售卖间夜数 = sortedData.map((row) => Number(row.实际售卖间夜数) || 0);
    const 出租率 = sortedData.map((row) => Number(row.出租率) || 0);
    const 平均房价 = sortedData.map((row) => Number(row.平均房价) || 0);

    return {
      title: {
        text: '经营日报-每日趋势',
        left: 'center',
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          let result = `${params[0].axisValue}<br/>`;
          params.forEach((param: any) => {
            if (param.seriesName === '出租率') {
              // 出租率数据已经转换为百分比（在series data中已乘以100）
              result += `${param.marker}${param.seriesName}: ${Number(param.value).toFixed(2)}%<br/>`;
            } else {
              result += `${param.marker}${param.seriesName}: ${formatNumber(Number(param.value))}<br/>`;
            }
          });
          return result;
        },
      },
      legend: {
        data: ['客房收入', '餐饮收入', '其他收入', '实际售卖间夜数', '出租率', '平均房价'],
        top: 30,
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: dates,
        axisLabel: {
          rotate: 45,
        },
      },
      yAxis: [
        {
          type: 'value',
          name: '金额/间夜数',
          position: 'left',
          axisLabel: {
            formatter: (value: number) => formatNumber(value),
          },
        },
        {
          type: 'value',
          name: '出租率(%)/平均房价',
          position: 'right',
          axisLabel: {
            formatter: (value: number) => {
              // 出租率显示为百分比，平均房价显示为数字
              return formatNumber(value);
            },
          },
        },
      ],
      series: [
        {
          name: '客房收入',
          type: 'line',
          data: 客房收入,
          smooth: true,
          itemStyle: {
            color: '#1890ff',
          },
          yAxisIndex: 0,
        },
        {
          name: '餐饮收入',
          type: 'line',
          data: 餐饮收入,
          smooth: true,
          itemStyle: {
            color: '#52c41a',
          },
          yAxisIndex: 0,
        },
        {
          name: '其他收入',
          type: 'line',
          data: 其他收入,
          smooth: true,
          itemStyle: {
            color: '#faad14',
          },
          yAxisIndex: 0,
        },
        {
          name: '实际售卖间夜数',
          type: 'line',
          data: 实际售卖间夜数,
          smooth: true,
          itemStyle: {
            color: '#722ed1',
          },
          yAxisIndex: 0,
        },
        {
          name: '出租率',
          type: 'line',
          data: 出租率.map(v => v * 100), // 转换为百分比显示
          smooth: true,
          itemStyle: {
            color: '#eb2f96',
          },
          yAxisIndex: 1,
        },
        {
          name: '平均房价',
          type: 'line',
          data: 平均房价,
          smooth: true,
          itemStyle: {
            color: '#13c2c2',
          },
          yAxisIndex: 1,
        },
      ],
    };
  }, [data]);

  // 准备表格数据 - 行是指标，列是日期
  const tableData = useMemo(() => {
    if (!data || data.length === 0) return [];

    // 按日期排序
    const sortedData = [...data].sort((a, b) => {
      const dateA = new Date(a.日期).getTime();
      const dateB = new Date(b.日期).getTime();
      return dateA - dateB;
    });

    const dates = sortedData.map((row) => row.日期);

    // 定义指标
    const indicators = [
      { key: '客房收入', label: '客房收入' },
      { key: '餐饮收入', label: '餐饮收入' },
      { key: '其他收入', label: '其他收入' },
      { key: '实际售卖间夜数', label: '实际售卖间夜数' },
      { key: '出租率', label: '出租率' },
      { key: '平均房价', label: '平均房价' },
    ];

    // 构建表格数据
    return indicators.map((indicator) => {
      const row: any = {
        key: indicator.key,
        指标: indicator.label,
      };
      dates.forEach((date) => {
        const dayData = sortedData.find((d) => d.日期 === date);
        if (dayData) {
          if (indicator.key === '出租率') {
            // 出租率转换为百分比显示（如0.85显示为85%）
            const rate = (Number(dayData[indicator.key]) || 0) * 100;
            row[date] = `${rate.toFixed(2)}%`;
          } else {
            row[date] = formatNumber(dayData[indicator.key] || 0);
          }
        } else {
          row[date] = '';
        }
      });
      return row;
    });
  }, [data]);

  // 表格列定义
  const tableColumns: ColumnsType<any> = useMemo(() => {
    if (!data || data.length === 0) {
      return [
        {
          title: '指标',
          dataIndex: '指标',
          key: '指标',
          fixed: 'left',
          width: 150,
        },
      ];
    }

    // 按日期排序
    const sortedData = [...data].sort((a, b) => {
      const dateA = new Date(a.日期).getTime();
      const dateB = new Date(b.日期).getTime();
      return dateA - dateB;
    });

    const dates = sortedData.map((row) => row.日期);

    const columns: ColumnsType<any> = [
      {
        title: '指标',
        dataIndex: '指标',
        key: '指标',
        fixed: 'left',
        width: 150,
      },
    ];

    // 为每个日期创建一列
    dates.forEach((date) => {
      columns.push({
        title: date,
        dataIndex: date,
        key: date,
        width: 120,
        align: 'right',
      });
    });

    return columns;
  }, [data]);

  // 获取URL参数
  const urlParams = useMemo(() => {
    if (typeof window === 'undefined') return {};
    const params = new URLSearchParams(window.location.search);
    return {
      hotelCode: params.get('hotelCode') || '',
      startDate: params.get('startDate') || '',
      endDate: params.get('endDate') || '',
    };
  }, []);

  return (
    <ConfigProvider locale={zhCN}>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 页面标题和返回按钮 */}
          <div className="mb-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">经营日报-每日明细</h1>
                <p className="text-gray-600">
                  {hotelInfo.HotelName && `酒店: ${hotelInfo.HotelName} (${hotelInfo.HotelCode})`}
                  {urlParams.startDate && urlParams.endDate && ` | 日期范围: ${urlParams.startDate} 至 ${urlParams.endDate}`}
                </p>
              </div>
              {/* 右上角返回按钮 */}
              <Link
                href="/product/business-analysis/daily-report"
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

          {/* 图表 */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <ReactECharts
              option={chartOption}
              style={{ height: '500px', width: '100%' }}
              opts={{ renderer: 'canvas' }}
            />
          </div>

          {/* 表格 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <Table
              columns={tableColumns}
              dataSource={tableData}
              loading={loading}
              rowKey="key"
              scroll={{ x: 'max-content', y: 400 }}
              pagination={false}
              bordered
            />
          </div>

          {/* 右下角返回按钮 */}
          <div className="mt-8 flex justify-end">
            <Link
              href="/product/business-analysis/daily-report"
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              返回经营日报
            </Link>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
}

