export interface DonutChartDataItem {
  id: string;
  value: number;
  label: string;
  color: string;
}

export interface DonutChartProps {
  data: DonutChartDataItem[];
  height?: number;
  showLegend?: boolean;
  showTooltip?: boolean;
  innerRadius?: number;
  paddingAngle?: number;
  cornerRadius?: number;
}
