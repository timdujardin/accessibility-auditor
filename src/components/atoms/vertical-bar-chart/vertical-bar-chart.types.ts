export interface VerticalBarChartDataItem {
  name: string;
  value: number;
}

export interface VerticalBarChartReferenceLine {
  y: number;
  label: string;
  color?: string;
  strokeDasharray?: string;
}

export interface VerticalBarChartProps {
  data: VerticalBarChartDataItem[];
  height?: number;
  barColor?: string;
  /** Returns a fill color per data item, overriding barColor when provided. */
  colorByValue?: (item: VerticalBarChartDataItem) => string;
  showTooltip?: boolean;
  yDomain?: [number, number];
  yUnit?: string;
  referenceLines?: VerticalBarChartReferenceLine[];
  /** Formats the label rendered centered inside each bar. When omitted, no bar labels are shown. */
  barLabelFormatter?: (value: number) => string;
  /** Rotation angle for X-axis tick labels (default 0). Use -45 for diagonal labels. */
  xAxisAngle?: number;
  /** Reserved height in px for the X-axis area (default auto). Increase for rotated/long labels. */
  xAxisHeight?: number;
}
