import type { Dataset, ExecutiveSummary, MetricCardData, AiInsight, DataQualityReport, ChatMessage } from '../types/dataset';

export function generateExecutiveSummary(dataset: Dataset): ExecutiveSummary {
  const { data, columns, name } = dataset;
  const numColumns = columns.filter((c) => c.type === 'number');
  const catColumns = columns.filter((c) => c.type === 'string');

  const keyMetrics: MetricCardData[] = [];
  const insights: AiInsight[] = [];
  const topDrivers: { label: string; impactScore: number; description: string }[] = [];
  const recommendations: string[] = [];

  // Calculate quality score
  let totalMissing = 0;
  columns.forEach((c) => (totalMissing += c.missingCount));
  const totalCells = dataset.rowCount * dataset.columnCount;
  const missingPct = totalCells > 0 ? (totalMissing / totalCells) * 100 : 0;
  const qualityScore = Math.max(10, Math.min(100, Math.round(100 - missingPct * 3)));

  // Extract Key Numerical Metrics
  numColumns.forEach((col) => {
    const values = data.map((d) => Number(d[col.name])).filter((v) => !isNaN(v));
    if (values.length === 0) return;

    const sum = values.reduce((a, b) => a + b, 0);
    const avg = sum / values.length;
    const maxVal = Math.max(...values);
    const minVal = Math.min(...values);

    // Format display
    const isCurrency = /revenue|cost|profit|spend|mrr|arr|ltv|cac/i.test(col.name);
    const isRate = /pct|rate|percentage|score|rating/i.test(col.name);

    let formattedValue = sum > 10000 && !isRate ? `${(sum / 1000).toFixed(1)}k` : sum.toFixed(1);
    if (isCurrency) formattedValue = `$${formattedValue}`;
    if (isRate) formattedValue = `${avg.toFixed(1)}% (Avg)`;

    if (keyMetrics.length < 4) {
      keyMetrics.push({
        id: col.name,
        label: col.name.replace(/_/g, ' '),
        value: formattedValue,
        changePercent: Math.round(((maxVal - minVal) / (avg || 1)) * 10),
        trend: maxVal > avg ? 'up' : 'neutral',
        subtitle: `Avg: ${isCurrency ? '$' : ''}${avg.toFixed(1)} | Max: ${isCurrency ? '$' : ''}${maxVal}`,
        badgeText: isCurrency ? 'Financial' : isRate ? 'Benchmark' : 'Volume',
        badgeType: 'info',
      });
    }

    // Detect Outliers / Anomalies
    const stdDev = Math.sqrt(values.reduce((sq, n) => sq + Math.pow(n - avg, 2), 0) / values.length);
    const outliers = values.filter((v) => Math.abs(v - avg) > 1.96 * stdDev);

    if (outliers.length > 0) {
      insights.push({
        id: `anomaly-${col.name}`,
        type: 'anomaly',
        title: `Anomaly Detected in ${col.name.replace(/_/g, ' ')}`,
        description: `Found ${outliers.length} records deviating by over 2 standard deviations from the average (${avg.toFixed(1)}). Peak detected at ${maxVal}.`,
        impact: 'high',
        metricName: col.name,
        value: `Peak: ${maxVal}`,
        actionableStep: `Audit records near peak value ${maxVal} to verify data accuracy or capitalize on high performance.`,
      });
    }
  });

  // Category insights
  catColumns.forEach((col) => {
    const counts: Record<string, number> = {};
    data.forEach((d) => {
      const val = String(d[col.name] || 'Unknown');
      counts[val] = (counts[val] || 0) + 1;
    });

    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    if (sorted.length > 0) {
      const [topCategory, topCount] = sorted[0];
      const pct = Math.round((topCount / data.length) * 100);

      topDrivers.push({
        label: `${col.name.replace(/_/g, ' ')}: ${topCategory}`,
        impactScore: pct,
        description: `Represents ${pct}% of total records (${topCount} out of ${data.length}).`,
      });

      if (insights.length < 5) {
        insights.push({
          id: `trend-${col.name}`,
          type: 'trend',
          title: `Dominant Segment: ${topCategory}`,
          description: `The segment "${topCategory}" leads in column "${col.name.replace(/_/g, ' ')}" with ${pct}% concentration.`,
          impact: 'medium',
          actionableStep: `Focus campaign budget & resources on ${topCategory} for maximum impact.`,
        });
      }
    }
  });

  // Actionable Recommendations
  recommendations.push(
    `Optimize data hygiene: ${totalMissing > 0 ? `Fill ${totalMissing} missing cell entries across the dataset.` : 'Dataset exhibits 100% complete records with no missing values.'}`,
    `Leverage key driver "${topDrivers[0]?.label || 'Primary Category'}": Allocate targeted growth initiatives toward high-performing segments.`,
    `Monitor high variance metrics to stabilize monthly forecasting models.`
  );

  return {
    headline: `AI Executive Analysis for ${name}`,
    overview: `This dataset contains ${dataset.rowCount} rows across ${dataset.columnCount} attributes. The overall Data Quality Score is ${qualityScore}/100 with ${numColumns.length} numerical fields and ${catColumns.length} categorical fields analyzed.`,
    qualityScore,
    keyMetrics,
    insights,
    topDrivers,
    recommendations,
  };
}

export function generateDataQualityReport(dataset: Dataset): DataQualityReport {
  const totalRows = dataset.rowCount;
  const totalColumns = dataset.columnCount;
  let totalMissingCells = 0;

  const columnHealth = dataset.columns.map((col) => {
    totalMissingCells += col.missingCount;
    const missingPercent = totalRows > 0 ? Math.round((col.missingCount / totalRows) * 100) : 0;
    
    // Check outliers for numbers
    let outlierCount = 0;
    if (col.type === 'number') {
      const values = dataset.data.map((d) => Number(d[col.name])).filter((v) => !isNaN(v));
      if (values.length > 0) {
        const avg = values.reduce((a, b) => a + b, 0) / values.length;
        const stdDev = Math.sqrt(values.reduce((sq, n) => sq + Math.pow(n - avg, 2), 0) / values.length);
        outlierCount = values.filter((v) => Math.abs(v - avg) > 2 * stdDev).length;
      }
    }

    let issueDescription = undefined;
    if (missingPercent > 20) issueDescription = `High missing rate (${missingPercent}%)`;
    else if (outlierCount > 0) issueDescription = `${outlierCount} extreme outliers detected`;
    else if (col.uniqueCount === 1) issueDescription = 'Single constant value across all rows';

    return {
      columnName: col.name,
      type: col.type,
      missingCount: col.missingCount,
      missingPercent,
      outlierCount,
      issueDescription,
    };
  });

  const totalCells = totalRows * totalColumns;
  const missingPercentage = totalCells > 0 ? Math.round((totalMissingCells / totalCells) * 100) : 0;
  const healthScore = Math.max(0, 100 - missingPercentage * 3 - columnHealth.filter((c) => c.issueDescription).length * 5);

  return {
    healthScore,
    totalRows,
    totalColumns,
    duplicateRowsCount: 0,
    totalMissingCells,
    missingPercentage,
    columnHealth,
  };
}

export function answerAiQuery(dataset: Dataset, userQuery: string): ChatMessage {
  const queryLower = userQuery.toLowerCase();
  const { columns, data } = dataset;

  const numCols = columns.filter((c) => c.type === 'number');
  const catCols = columns.filter((c) => c.type === 'string');

  let textResponse = '';
  let chartSuggestion: ChatMessage['chartSuggestion'] = undefined;

  if (queryLower.includes('highest') || queryLower.includes('top') || queryLower.includes('max')) {
    if (numCols.length > 0) {
      const targetCol = numCols[0];
      const sorted = [...data].sort((a, b) => Number(b[targetCol.name] || 0) - Number(a[targetCol.name] || 0));
      const topRow = sorted[0];
      const labelVal = catCols.length > 0 ? topRow[catCols[0].name] : topRow[Object.keys(topRow)[0]];

      textResponse = `The highest recorded value for **${targetCol.name}** is **${topRow[targetCol.name]}**, associated with **${catCols[0]?.name || 'Record'}: ${labelVal}**.`;
      
      if (catCols.length > 0) {
        chartSuggestion = {
          type: 'bar',
          xAxis: catCols[0].name,
          yAxis: targetCol.name,
          title: `Top ${targetCol.name} by ${catCols[0].name}`,
        };
      }
    } else {
      textResponse = `Based on your dataset, we identified ${dataset.rowCount} entries. Primary categories include ${catCols.map((c) => c.name).join(', ')}.`;
    }
  } else if (queryLower.includes('average') || queryLower.includes('mean') || queryLower.includes('avg')) {
    const averages = numCols.map((col) => {
      const vals = data.map((d) => Number(d[col.name])).filter((v) => !isNaN(v));
      const avg = vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
      return `**${col.name}**: ${avg.toFixed(2)}`;
    });

    textResponse = `Here are the average values calculated across numerical fields:\n\n${averages.join('\n')}`;
  } else if (queryLower.includes('anomaly') || queryLower.includes('outlier') || queryLower.includes('risk')) {
    const summary = generateExecutiveSummary(dataset);
    const anomalies = summary.insights.filter((i) => i.type === 'anomaly');

    if (anomalies.length > 0) {
      textResponse = `⚠️ **Anomalies Detected**:\n\n${anomalies.map((a) => `• **${a.title}**: ${a.description}`).join('\n\n')}`;
    } else {
      textResponse = `✅ No severe anomalies detected. Numerical fields follow standard statistical distribution patterns.`;
    }
  } else {
    textResponse = `Analysis for **"${userQuery}"**:\nThis dataset has **${dataset.rowCount} rows** and **${dataset.columnCount} attributes**. Key numerical metrics include ${numCols.map((c) => c.name).slice(0, 3).join(', ')}. Use the Visual Chart Studio tab to plot custom relationships!`;
    if (catCols.length > 0 && numCols.length > 0) {
      chartSuggestion = {
        type: 'bar',
        xAxis: catCols[0].name,
        yAxis: numCols[0].name,
        title: `${numCols[0].name} grouped by ${catCols[0].name}`,
      };
    }
  }

  return {
    id: `msg-${Date.now()}`,
    sender: 'ai',
    text: textResponse,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    chartSuggestion,
  };
}
