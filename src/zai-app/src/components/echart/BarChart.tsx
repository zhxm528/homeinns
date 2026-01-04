import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';

interface BarChartProps {
  id: string;
  option: EChartsOption;
}

const BarChart: React.FC<BarChartProps> = ({ id, option }) => {
  const chartRef = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    const initChart = () => {
      const dom = document.getElementById(id);
      if (dom) {
        chartRef.current = echarts.init(dom);
        chartRef.current.setOption(option);
      }
    };

    initChart();

    const resizeHandler = () => chartRef.current?.resize();
    window.addEventListener('resize', resizeHandler);

    return () => {
      window.removeEventListener('resize', resizeHandler);
      chartRef.current?.dispose();
    };
  }, [id, option]);

  return <div id={id} style={{ width: '100%', height: '300px' }} />;
};

export default BarChart;