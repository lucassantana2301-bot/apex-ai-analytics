export type ColumnType = 'number' | 'string' | 'boolean' | 'date';

export interface ColumnMeta {
  name: string;
  type: ColumnType;
  missingCount: number;
  uniqueCount: number;
  min?: number;
  max?: number;
  mean?: number;
  sampleValues: (string | number | boolean)[];
}

export type DataRow = Record<string, string | number | boolean | null>;

export interface Dataset {
  id: string;
  name: string;
  description: string;
  category: string;
  rowCount: number;
  columnCount: number;
  columns: ColumnMeta[];
  data: DataRow[];
  createdAt: string;
}

export interface MetricCardData {
  id: string;
  label: string;
  value: string | number;
  changePercent?: number;
  trend: 'up' | 'down' | 'neutral';
  subtitle?: string;
  badgeText?: string;
  badgeType?: 'success' | 'warning' | 'danger' | 'info';
}

export interface AiInsight {
  id: string;
  type: 'anomaly' | 'trend' | 'recommendation' | 'correlation';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  metricName?: string;
  value?: string;
  actionableStep?: string;
}

export interface ExecutiveSummary {
  headline: string;
  overview: string;
  qualityScore: number; // 0 - 100
  keyMetrics: MetricCardData[];
  insights: AiInsight[];
  topDrivers: { label: string; impactScore: number; description: string }[];
  recommendations: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  chartSuggestion?: {
    type: 'bar' | 'line' | 'pie' | 'doughnut';
    xAxis: string;
    yAxis: string;
    title: string;
  };
}

export interface DataQualityReport {
  healthScore: number;
  totalRows: number;
  totalColumns: number;
  duplicateRowsCount: number;
  totalMissingCells: number;
  missingPercentage: number;
  columnHealth: {
    columnName: string;
    type: ColumnType;
    missingCount: number;
    missingPercent: number;
    outlierCount: number;
    issueDescription?: string;
  }[];
}
