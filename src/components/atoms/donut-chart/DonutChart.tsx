import type { FC } from 'react';

import { Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

import type { DonutChartProps } from './donut-chart.types';

import ColoredSector from './ColoredSector';

/**
 * Donut chart component wrapping recharts PieChart with inner radius.
 * @param {DonutChartProps} props - Chart data and configuration.
 * @returns {JSX.Element} A responsive donut chart with colored sectors, tooltip, and legend.
 */
const DonutChart: FC<DonutChartProps> = ({
  data,
  height = 220,
  showLegend = true,
  showTooltip = true,
  innerRadius = 40,
  paddingAngle = 2,
  cornerRadius = 4,
}) => (
  <ResponsiveContainer width="100%" height={height}>
    <PieChart>
      <Pie
        data={data}
        dataKey="value"
        nameKey="label"
        innerRadius={innerRadius}
        paddingAngle={paddingAngle}
        cornerRadius={cornerRadius}
        shape={ColoredSector}
      />
      {showTooltip ? <Tooltip /> : null}
      {showLegend ? <Legend /> : null}
    </PieChart>
  </ResponsiveContainer>
);

export default DonutChart;
