import type { DataRow } from '../types/dataset';

export interface ForecastPoint {
  label: string;
  historicalValue?: number;
  forecastValue?: number;
  lowerBound?: number;
  upperBound?: number;
}

export function generatePredictiveForecast(
  data: DataRow[],
  xAxisCol: string,
  yAxisCol: string,
  periodsToForecast: number = 4
): ForecastPoint[] {
  if (!data || data.length === 0 || !xAxisCol || !yAxisCol) return [];

  const points: { x: string; y: number }[] = [];
  data.forEach((row) => {
    const xVal = String(row[xAxisCol] || '');
    const yVal = Number(row[yAxisCol]);
    if (xVal && !isNaN(yVal)) {
      points.push({ x: xVal, y: yVal });
    }
  });

  if (points.length < 2) return [];

  // Simple Linear Regression calculation
  const n = points.length;
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumX2 = 0;

  points.forEach((p, idx) => {
    sumX += idx;
    sumY += p.y;
    sumXY += idx * p.y;
    sumX2 += idx * idx;
  });

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX || 1);
  const intercept = (sumY - slope * sumX) / n;

  // Calculate residual variance for confidence bounds
  const variance =
    points.reduce((acc, p, idx) => {
      const pred = slope * idx + intercept;
      return acc + Math.pow(p.y - pred, 2);
    }, 0) / (n || 1);
  const stdError = Math.sqrt(variance);

  const result: ForecastPoint[] = [];

  // Historical Points
  points.forEach((p) => {
    result.push({
      label: p.x,
      historicalValue: p.y,
    });
  });

  // Forecast Points
  const lastIndex = points.length - 1;
  for (let i = 1; i <= periodsToForecast; i++) {
    const nextIdx = lastIndex + i;
    const projected = Number((slope * nextIdx + intercept).toFixed(2));
    const boundMargin = Number((stdError * 1.5 * Math.sqrt(i)).toFixed(2));

    result.push({
      label: `Forecast +${i}`,
      forecastValue: projected,
      lowerBound: Number(Math.max(0, projected - boundMargin).toFixed(2)),
      upperBound: Number((projected + boundMargin).toFixed(2)),
    });
  }

  return result;
}
