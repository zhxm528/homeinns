import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface GroupedBarChartProps {
  id: string;
  title: string;
  current: number[];
  last: number[];
}

const MarketSegmentGroupedBarChart: React.FC<GroupedBarChartProps> = ({ id, title, current, last }) => {
  const chartRef = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    const buildDataset = () => {
      return [
        { type: '散客', label: '当月数据', value: current[0] },
        { type: '散客', label: '去年同期', value: last[0] },
        { type: '团队', label: '当月数据', value: current[1] },
        { type: '团队', label: '去年同期', value: last[1] },
      ];
    };

    const dom = document.getElementById(id);
    if (!dom) return;

    const chart = echarts.init(dom);
    chartRef.current = chart;

    const option = {
      grid: { left: 60, right: 20, top: 40, bottom: 30 },
      xAxis: {
        type: 'category' as const,
        data: ['散客', '团队'],
        axisTick: { show: false },
        axisLine: { show: false },
        axisLabel: { fontSize: 14 },
      },
      yAxis: { show: false },
      legend: {
        data: ['当月数据', '去年同期'],
        top: 0,
        right: 0,
      },
      dataset: {
        source: buildDataset()
      },
      series: [
        {
          name: '当月数据',
          type: 'bar' as const,
          barWidth: 32,
          itemStyle: {
            color: '#6C4CD6',
            borderRadius: [8, 8, 0, 0],
          },
          label: {
            show: true,
            position: 'top' as const,
            formatter: (params: any) => params.data?.value + '%',
            color: '#888',
            fontSize: 14,
          },
          encode: { x: 'type', y: 'value', itemName: 'label' },
          data: buildDataset().filter(d => d.label === '当月数据'),
        },
        {
          name: '去年同期',
          type: 'bar' as const,
          barWidth: 32,
          itemStyle: {
            color: '#FFA940',
            borderRadius: [8, 8, 0, 0],
          },
          label: {
            show: true,
            position: 'top' as const,
            formatter: (params: any) => params.data?.value + '%',
            color: '#888',
            fontSize: 14,
          },
          encode: { x: 'type', y: 'value', itemName: 'label' },
          data: buildDataset().filter(d => d.label === '去年同期'),
        },
      ],
      barCategoryGap: '40%',
      barGap: '0%',
      tooltip: {
        trigger: 'axis' as const,
        axisPointer: {
          type: 'shadow' as const,
        },
        formatter: (params: any) => {
          if (!Array.isArray(params)) return '';
          return params.map((p: any) => `${p.seriesName}: ${p.value[2]}%`).join('<br>');
        },
      }
    };

    chart.setOption(option);

    const resizeHandler = () => chart.resize();
    window.addEventListener('resize', resizeHandler);

    return () => {
      window.removeEventListener('resize', resizeHandler);
      chart.dispose();
    };
  }, [id, current, last]);

  return <div id={id} style={{ width: '100%', height: '220px' }} />;
};

export default MarketSegmentGroupedBarChart;