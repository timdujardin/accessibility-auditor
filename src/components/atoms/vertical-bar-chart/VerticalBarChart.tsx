import type { FC, ReactElement } from 'react';
import type { BarShapeProps } from 'recharts';
import type { Props as LabelProps } from 'recharts/types/component/Label';

import {
  Bar,
  BarChart,
  LabelList,
  Rectangle,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import type { VerticalBarChartDataItem, VerticalBarChartProps } from './vertical-bar-chart.types';

function createCenteredLabel(formatter: (value: number) => string): (props: LabelProps) => ReactElement {
  const CenteredLabel = (props: LabelProps): ReactElement => {
    const { viewBox, value } = props;
    const vb = viewBox as { x?: number; y?: number; width?: number; height?: number } | undefined;
    const x = vb?.x ?? 0;
    const y = vb?.y ?? 0;
    const w = vb?.width ?? 0;
    const h = vb?.height ?? 0;

    return (
      <text
        x={x + w / 2}
        y={y + h / 2}
        fill="#fff"
        fontWeight={700}
        fontSize={13}
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {formatter(value as number)}
      </text>
    );
  };

  CenteredLabel.displayName = 'CenteredLabel';

  return CenteredLabel;
}

/**
 * Vertical bar chart component wrapping recharts BarChart.
 * Supports optional reference lines, Y-axis domain/unit, per-bar coloring,
 * centered bar labels, and rotatable X-axis ticks.
 * @param {VerticalBarChartProps} props - Chart data and configuration.
 * @returns {JSX.Element} A responsive vertical bar chart.
 */
const VerticalBarChart: FC<VerticalBarChartProps> = ({
  data,
  height = 250,
  barColor = '#1976d2',
  colorByValue,
  showTooltip = true,
  yDomain,
  yUnit,
  referenceLines,
  barLabelFormatter,
  xAxisAngle = 0,
  xAxisHeight,
}) => {
  const coloredShape = colorByValue
    ? (props: BarShapeProps): ReactElement => {
        const entry = props as unknown as VerticalBarChartDataItem;

        return <Rectangle {...props} fill={colorByValue(entry)} />;
      }
    : undefined;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          angle={xAxisAngle}
          textAnchor={xAxisAngle < 0 ? 'end' : 'middle'}
          height={xAxisHeight}
          interval={0}
          tick={{ fontSize: 12 }}
        />
        <YAxis domain={yDomain} unit={yUnit} />
        {showTooltip ? <Tooltip /> : null}
        {referenceLines?.map((line) => (
          <ReferenceLine
            key={line.y}
            y={line.y}
            label={{ value: line.label, position: 'insideTopRight', fontSize: 12 }}
            stroke={line.color ?? '#f44336'}
            strokeDasharray={line.strokeDasharray ?? '6 4'}
          />
        ))}
        <Bar dataKey="value" fill={barColor} shape={coloredShape}>
          {barLabelFormatter ? <LabelList dataKey="value" content={createCenteredLabel(barLabelFormatter)} /> : null}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default VerticalBarChart;
