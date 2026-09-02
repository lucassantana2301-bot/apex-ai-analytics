import React, { useState, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';
import { BarChart3, LineChart as LineIcon, PieChart as PieIcon, Sliders, TrendingUp } from 'lucide-react';
import type { Dataset } from '../types/dataset';
import { generatePredictiveForecast } from '../services/forecastEngine';

// Register Chart.js modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface ChartStudioProps {
  dataset: Dataset;
  initialChartType?: 'bar' | 'line' | 'pie' | 'doughnut';
  initialXAxis?: string;
  initialYAxis?: string;
}

export const ChartStudio: React.FC<ChartStudioProps> = ({
  dataset,
  initialChartType,
  initialXAxis,
  initialYAxis,
}) => {
  const { columns, data } = dataset;

  const stringCols = useMemo(() => columns.filter((c) => c.type === 'string' || c.type === 'date'), [columns]);
  const numCols = useMemo(() => columns.filter((c) => c.type === 'number'), [columns]);

  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie' | 'doughnut'>(
    initialChartType || 'bar'
  );
  const [xAxisCol, setXAxisCol] = useState<string>(
    initialXAxis || (stringCols[0]?.name || columns[0]?.name || '')
  );
  const [yAxisCol, setYAxisCol] = useState<string>(
    initialYAxis || (numCols[0]?.name || columns[1]?.name || '')
  );
  const [aggregation, setAggregation] = useState<'sum' | 'mean' | 'count' | 'max'>('sum');
  const [enableForecast, setEnableForecast] = useState<boolean>(false);

  // Predictive Forecast computation
  const forecastData = useMemo(() => {
    if (!enableForecast) return [];
    return generatePredictiveForecast(data, xAxisCol, yAxisCol, 4);
  }, [data, xAxisCol, yAxisCol, enableForecast]);

  // Standard processed data for Chart.js
  const processedData = useMemo(() => {
    if (enableForecast && forecastData.length > 0) {
      const labels = forecastData.map((f) => f.label);
      const histValues = forecastData.map((f) => f.historicalValue ?? null);
      const forecastValues = forecastData.map((f) => f.forecastValue ?? null);
      const lowerBounds = forecastData.map((f) => f.lowerBound ?? null);
      const upperBounds = forecastData.map((f) => f.upperBound ?? null);
      return { labels, histValues, forecastValues, lowerBounds, upperBounds };
    }

    if (!xAxisCol || !data.length) return { labels: [], values: [] };

    const grouped: Record<string, number[]> = {};

    data.forEach((row) => {
      const key = String(row[xAxisCol] || 'Unknown');
      const val = Number(row[yAxisCol] || 0);

      if (!grouped[key]) grouped[key] = [];
      if (!isNaN(val)) grouped[key].push(val);
    });

    const labels = Object.keys(grouped);
    const values = labels.map((key) => {
      const arr = grouped[key];
      if (arr.length === 0) return 0;
      if (aggregation === 'sum') return arr.reduce((a, b) => a + b, 0);
      if (aggregation === 'mean') return arr.reduce((a, b) => a + b, 0) / arr.length;
      if (aggregation === 'max') return Math.max(...arr);
      if (aggregation === 'count') return arr.length;
      return 0;
    });

    return { labels, values };
  }, [data, xAxisCol, yAxisCol, aggregation, enableForecast, forecastData]);

  // Imperial Gold Palette
  const chartColors = [
    'rgba(212, 175, 55, 0.85)',
    'rgba(245, 208, 97, 0.85)',
    'rgba(197, 160, 89, 0.85)',
    'rgba(251, 191, 36, 0.85)',
    'rgba(217, 119, 6, 0.85)',
  ];

  const chartData = enableForecast
    ? {
        labels: processedData.labels,
        datasets: [
          {
            label: `Historical ${yAxisCol}`,
            data: (processedData as any).histValues,
            backgroundColor: 'rgba(212, 175, 55, 0.85)',
            borderColor: 'rgba(212, 175, 55, 1)',
            borderWidth: 3,
            tension: 0.35,
          },
          {
            label: `AI Forecast Trend`,
            data: (processedData as any).forecastValues,
            backgroundColor: 'rgba(245, 208, 97, 0.85)',
            borderColor: 'rgba(245, 208, 97, 1)',
            borderWidth: 3,
            borderDash: [6, 6],
            tension: 0.35,
          },
          {
            label: `Upper Confidence Band`,
            data: (processedData as any).upperBounds,
            backgroundColor: 'rgba(245, 208, 97, 0.1)',
            borderColor: 'rgba(245, 208, 97, 0.4)',
            borderWidth: 1,
            fill: '+1',
          },
          {
            label: `Lower Confidence Band`,
            data: (processedData as any).lowerBounds,
            backgroundColor: 'rgba(245, 208, 97, 0.1)',
            borderColor: 'rgba(245, 208, 97, 0.4)',
            borderWidth: 1,
          },
        ],
      }
    : {
        labels: (processedData as any).labels,
        datasets: [
          {
            label: `${aggregation.toUpperCase()} of ${yAxisCol}`,
            data: (processedData as any).values,
            backgroundColor: chartType === 'pie' || chartType === 'doughnut' ? chartColors : chartColors[0],
            borderColor: chartType === 'line' ? 'rgba(212, 175, 55, 1)' : 'rgba(212, 175, 55, 0.3)',
            borderWidth: 3,
            tension: 0.35,
            fill: chartType === 'line',
          },
        ],
      };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: { color: '#f5d061', font: { family: 'Outfit', size: 12, weight: 'bold' as const } },
      },
      tooltip: {
        backgroundColor: '#120b08',
        titleColor: '#fffdfa',
        bodyColor: '#f5d061',
        borderColor: 'rgba(212, 175, 55, 0.6)',
        borderWidth: 1.5,
        padding: 14,
        boxPadding: 8,
      },
    },
    scales:
      chartType === 'pie' || chartType === 'doughnut'
        ? {}
        : {
            x: {
              ticks: { color: '#e2c992', font: { family: 'Inter', size: 11, weight: 'bold' as const } },
              grid: { color: 'rgba(212, 175, 55, 0.1)' },
            },
            y: {
              ticks: { color: '#e2c992', font: { family: 'Inter', size: 11, weight: 'bold' as const } },
              grid: { color: 'rgba(212, 175, 55, 0.1)' },
            },
          },
  };

  return (
    <div className="glass-panel-light" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.2rem', color: 'var(--gold-light)', display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'Syne' }}>
            <Sliders size={20} color="var(--gold-primary)" /> Kinetic Visual Telemetry Studio
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Configure dimensions, metrics, chart types, and predictive AI trend forecasts
          </p>
        </div>

        {/* Forecast Toggle & Chart Type Selector */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            className={`btn ${enableForecast ? 'btn-ocean animate-race-pulse' : 'btn-outline-ocean'}`}
            onClick={() => setEnableForecast(!enableForecast)}
            style={{ fontSize: '0.8rem' }}
          >
            <TrendingUp size={16} /> {enableForecast ? '✓ FORECAST ENABLED' : '+ AI FORECAST'}
          </button>

          <div style={{ display: 'flex', background: '#120b08', padding: 4, borderRadius: 'var(--radius-md)', border: '1.5px solid var(--border-gold)' }}>
            <button className={`racing-nav-tab ${chartType === 'bar' ? 'active' : ''}`} onClick={() => setChartType('bar')} title="Bar Chart">
              <BarChart3 size={16} /> Bar
            </button>
            <button className={`racing-nav-tab ${chartType === 'line' ? 'active' : ''}`} onClick={() => setChartType('line')} title="Line Chart">
              <LineIcon size={16} /> Line
            </button>
            <button className={`racing-nav-tab ${chartType === 'pie' ? 'active' : ''}`} onClick={() => setChartType('pie')} title="Pie Chart">
              <PieIcon size={16} /> Pie
            </button>
            <button className={`racing-nav-tab ${chartType === 'doughnut' ? 'active' : ''}`} onClick={() => setChartType('doughnut')} title="Doughnut Chart">
              <PieIcon size={16} /> Doughnut
            </button>
          </div>
        </div>
      </div>

      {/* Control Toolbar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px', background: '#23150e', padding: '18px', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--border-gold)' }}>
        <div>
          <label style={{ fontSize: '0.78rem', color: 'var(--gold-light)', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
            X-Axis (Category Dimension)
          </label>
          <select className="form-control" value={xAxisCol} onChange={(e) => setXAxisCol(e.target.value)}>
            {columns.map((c) => (
              <option key={c.name} value={c.name}>{c.name} ({c.type})</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ fontSize: '0.78rem', color: 'var(--gold-light)', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
            Y-Axis (Numerical Telemetry)
          </label>
          <select className="form-control" value={yAxisCol} onChange={(e) => setYAxisCol(e.target.value)}>
            {numCols.length > 0
              ? numCols.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)
              : columns.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
          </select>
        </div>

        <div>
          <label style={{ fontSize: '0.78rem', color: 'var(--gold-light)', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
            Aggregation Method
          </label>
          <select className="form-control" value={aggregation} onChange={(e) => setAggregation(e.target.value as any)}>
            <option value="sum">Sum (Total)</option>
            <option value="mean">Average (Mean)</option>
            <option value="max">Maximum</option>
            <option value="count">Record Count</option>
          </select>
        </div>
      </div>

      {/* Chart Display Box */}
      <div style={{ height: 420, width: '100%', position: 'relative' }}>
        {processedData.labels.length === 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
            No chart data available for selected parameters.
          </div>
        ) : chartType === 'bar' ? (
          <Bar data={chartData} options={chartOptions} />
        ) : chartType === 'line' || enableForecast ? (
          <Line data={chartData} options={chartOptions} />
        ) : chartType === 'pie' ? (
          <Pie data={chartData} options={chartOptions} />
        ) : (
          <Doughnut data={chartData} options={chartOptions} />
        )}
      </div>
    </div>
  );
};
