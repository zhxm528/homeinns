import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import type { EChartOption } from 'echarts';

interface EffectScatterChartProps {
  id: string;
  option: EChartOption;
}

const EffectScatterChart: React.FC<EffectScatterChartProps> = ({ id, option }) => {
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

  return <div id={id} style={{ width: '100%', height: '500px' }} />;
};

export default EffectScatterChart;