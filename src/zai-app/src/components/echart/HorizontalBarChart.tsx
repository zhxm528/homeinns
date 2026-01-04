import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import type { EChartOption } from 'echarts'; // ✅ 使用 EChartOption

interface HorizontalBarChartProps {
  id: string;
  option: EChartOption; // ✅ 使用 EChartOption 而不是 EChartsOption
}

const HorizontalBarChart: React.FC<HorizontalBarChartProps> = ({ id, option }) => {
  const chartRef = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    const dom = document.getElementById(id);
    if (dom) {
      chartRef.current = echarts.init(dom);
      chartRef.current.setOption(option);
    }

    const resizeHandler = () => chartRef.current?.resize();
    window.addEventListener('resize', resizeHandler);

    return () => {
      window.removeEventListener('resize', resizeHandler);
      chartRef.current?.dispose();
    };
  }, [id, option]);

  return <div id={id} style={{ width: '100%', height: '180px' }} />;
};

export default HorizontalBarChart;