import { useState, useMemo, useEffect } from 'react';
import { Sparkles, BarChart2, Table as TableIcon, ShieldCheck, GitMerge, ChevronDown, ChevronUp, Database } from 'lucide-react';
import type { Dataset } from './types/dataset';
import { SAMPLE_DATASETS, calculateColumnMeta } from './data/sampleDatasets';
import { generateExecutiveSummary } from './services/aiEngine';
import { Header } from './components/Header';
import { IntroHero } from './components/IntroHero';
import { DatasetSelector } from './components/DatasetSelector';
import { OverviewCards } from './components/OverviewCards';
import { AiExecutiveSummary } from './components/AiExecutiveSummary';
import { ChartStudio } from './components/ChartStudio';
import { DataGridTable } from './components/DataGridTable';
import { DataQualityStudio } from './components/DataQualityStudio';
import { MultiCsvMerger } from './components/MultiCsvMerger';
import { AiChatDrawer } from './components/AiChatDrawer';

export function App() {
  const [dataset, setDataset] = useState<Dataset>(SAMPLE_DATASETS[0]);
  const [activeTab, setActiveTab] = useState<'executive' | 'charts' | 'grid' | 'quality' | 'merge'>('executive');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isLiveStreaming, setIsLiveStreaming] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [showDatasetSelector, setShowDatasetSelector] = useState(false);

  const [chartParams, setChartParams] = useState<{
    type?: 'bar' | 'line' | 'pie' | 'doughnut';
    xAxis?: string;
    yAxis?: string;
  }>({});

  const summary = useMemo(() => generateExecutiveSummary(dataset), [dataset]);

  // Live Telemetry Streaming Simulator
  useEffect(() => {
    if (!isLiveStreaming) return;

    const interval = setInterval(() => {
      setDataset((prev) => {
        if (!prev.data || prev.data.length === 0) return prev;
        const lastRow = prev.data[prev.data.length - 1];
        const newRow = { ...lastRow };

        Object.keys(newRow).forEach((k) => {
          if (typeof newRow[k] === 'number') {
            const variance = (Math.random() - 0.45) * 0.2;
            newRow[k] = Math.round(Number(newRow[k]) * (1 + variance));
          }
        });

        const newIdCol = Object.keys(newRow)[0];
        if (newIdCol) {
          newRow[newIdCol] = `LIVE-${Date.now().toString().slice(-4)}`;
        }

        const newData = [...prev.data, newRow];
        const newCols = calculateColumnMeta(newData);

        return {
          ...prev,
          rowCount: newData.length,
          data: newData,
          columns: newCols,
        };
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isLiveStreaming]);

  // CSV Export Handler
  const handleExportCSV = () => {
    if (!dataset.data || dataset.data.length === 0) return;
    const keys = Object.keys(dataset.data[0]);
    const csvLines: string[] = [keys.join(',')];

    dataset.data.forEach((row) => {
      const line = keys.map((k) => `"${row[k] ?? ''}"`).join(',');
      csvLines.push(line);
    });

    const blob = new Blob([csvLines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${dataset.name.toLowerCase().replace(/\s+/g, '_')}_export.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Report Export Handler
  const handleExportReport = () => {
    const reportHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Relatório Executivo IA - ${dataset.name}</title>
        <style>
          body { font-family: 'Outfit', sans-serif; background: #120b08; color: #fffdfa; padding: 40px; }
          h1 { color: #f5d061; border-bottom: 2px solid #d4af37; padding-bottom: 10px; }
          .card { background: #1c120d; padding: 20px; border-radius: 16px; margin-bottom: 20px; border: 1px solid #d4af37; }
          .metric { display: inline-block; background: #120b08; padding: 12px 20px; border-radius: 8px; margin-right: 12px; margin-bottom: 12px; color: #f5d061; }
          .badge { background: #d4af37; color: #120b08; padding: 4px 8px; border-radius: 4px; font-weight: bold; font-size: 0.8rem; }
        </style>
      </head>
      <body>
        <h1>Relatório Executivo: ${dataset.name}</h1>
        <p><strong>Gerado em:</strong> ${new Date().toLocaleString('pt-BR')}</p>
        
        <div class="card">
          <h2>Visão Geral & Saúde dos Dados</h2>
          <p>${summary.overview}</p>
          <p><span class="badge">Índice de Qualidade: ${summary.qualityScore}/100</span></p>
        </div>

        <div class="card">
          <h2>Métricas Principais</h2>
          ${summary.keyMetrics
            .map(
              (m) => `<div class="metric"><strong>${m.label}:</strong> ${m.value}</div>`
            )
            .join('')}
        </div>

        <div class="card">
          <h2>Recomendações Estratégicas</h2>
          <ul>
            ${summary.recommendations.map((r) => `<li>${r}</li>`).join('')}
          </ul>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([reportHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${dataset.name.toLowerCase().replace(/\s+/g, '_')}_relatorio_executivo.html`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="app-container">
      {/* HEADER PRINCIPAL */}
      <Header
        currentDataset={dataset}
        summary={summary}
        onOpenChat={() => setIsChatOpen(true)}
        onExportCSV={handleExportCSV}
        onExportReport={handleExportReport}
        isLiveStreaming={isLiveStreaming}
        onToggleLiveStream={() => setIsLiveStreaming(!isLiveStreaming)}
      />

      {/* CONTROLES SANFONADOS */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <button
          className="btn btn-dark btn-sm"
          onClick={() => setShowIntro(!showIntro)}
          style={{ fontSize: '0.8rem', gap: 6 }}
        >
          <Sparkles size={14} color="var(--gold-primary)" />
          {showIntro ? 'OCULTAR INTRODUÇÃO' : 'EXIBIR INTRODUÇÃO CINEMATOGRÁFICA'}
          {showIntro ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        <button
          className="btn btn-dark btn-sm"
          onClick={() => setShowDatasetSelector(!showDatasetSelector)}
          style={{ fontSize: '0.8rem', gap: 6 }}
        >
          <Database size={14} color="var(--gold-primary)" />
          {showDatasetSelector ? 'FECHAR SELETOR' : 'ALTERAR DATASET / FAZER UPLOAD CSV'}
          {showDatasetSelector ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {/* INTRODUÇÃO OPCIONAL */}
      {showIntro && (
        <IntroHero
          onEngage={() => setIsChatOpen(true)}
          datasetName={dataset.name}
          rowCount={dataset.rowCount}
        />
      )}

      {/* SELETOR OPCIONAL DE DATASET */}
      {showDatasetSelector && (
        <DatasetSelector
          currentDataset={dataset}
          onSelectDataset={(ds) => {
            setDataset(ds);
            setChartParams({});
            setShowDatasetSelector(false);
          }}
        />
      )}

      {/* SEÇÃO 01: VISÃO GERAL DE MÉTRICAS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--gold-light)', letterSpacing: '0.08em', fontFamily: 'Outfit, sans-serif' }}>
          SEÇÃO 01 • MÉTRICAS DE TELEMETRIA EM RESUMO
        </div>
        <OverviewCards metrics={summary.keyMetrics} healthScore={summary.qualityScore} />
      </div>

      {/* SEÇÃO 02: ESPAÇO DE TRABALHO ANALÍTICO */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--gold-light)', letterSpacing: '0.08em', fontFamily: 'Outfit, sans-serif' }}>
            SEÇÃO 02 • ESPAÇO DE TRABALHO & ANÁLISE IA
          </div>

          {/* Abas Navegáveis */}
          <div className="glass-panel-light" style={{ padding: '6px 12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              className={`racing-nav-tab ${activeTab === 'executive' ? 'active' : ''}`}
              onClick={() => setActiveTab('executive')}
            >
              <Sparkles size={16} /> Resumo Executivo IA
            </button>

            <button
              className={`racing-nav-tab ${activeTab === 'charts' ? 'active' : ''}`}
              onClick={() => setActiveTab('charts')}
            >
              <BarChart2 size={16} /> Estúdio Visual & Previsão
            </button>

            <button
              className={`racing-nav-tab ${activeTab === 'grid' ? 'active' : ''}`}
              onClick={() => setActiveTab('grid')}
            >
              <TableIcon size={16} /> Registros & Tabela
            </button>

            <button
              className={`racing-nav-tab ${activeTab === 'quality' ? 'active' : ''}`}
              onClick={() => setActiveTab('quality')}
            >
              <ShieldCheck size={16} /> Saúde & Limpeza de Dados
            </button>

            <button
              className={`racing-nav-tab ${activeTab === 'merge' ? 'active' : ''}`}
              onClick={() => setActiveTab('merge')}
            >
              <GitMerge size={16} /> Mesclar CSVs
            </button>
          </div>
        </div>

        {/* Exibição do Conteúdo da Aba */}
        <div style={{ borderRadius: 'var(--radius-lg)', minHeight: '450px' }}>
          {activeTab === 'executive' && (
            <AiExecutiveSummary
              summary={summary}
              onAskAboutInsight={() => {
                setIsChatOpen(true);
              }}
            />
          )}

          {activeTab === 'charts' && (
            <ChartStudio
              dataset={dataset}
              initialChartType={chartParams.type}
              initialXAxis={chartParams.xAxis}
              initialYAxis={chartParams.yAxis}
            />
          )}

          {activeTab === 'grid' && <DataGridTable dataset={dataset} />}

          {activeTab === 'quality' && (
            <DataQualityStudio dataset={dataset} onUpdateDataset={(updated) => setDataset(updated)} />
          )}

          {activeTab === 'merge' && (
            <MultiCsvMerger
              onDatasetMerged={(merged) => {
                setDataset(merged);
                setActiveTab('executive');
              }}
            />
          )}
        </div>
      </div>

      {/* Assistente de Chat Flutuante */}
      <AiChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        dataset={dataset}
        onSelectChartSuggestion={(sug) => {
          if (sug) {
            setChartParams({ type: sug.type, xAxis: sug.xAxis, yAxis: sug.yAxis });
            setActiveTab('charts');
          }
        }}
      />
    </div>
  );
}

export default App;
