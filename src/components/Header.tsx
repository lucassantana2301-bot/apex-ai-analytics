import React, { useState } from 'react';
import { Sparkles, Database, Download, Bot, Activity, Zap, Volume2, VolumeX, Presentation, Radio } from 'lucide-react';
import type { Dataset, ExecutiveSummary } from '../types/dataset';
import { speakExecutiveSummary, stopExecutiveSummary } from '../services/aiVoice';
import { exportPresentationSlideDeck } from '../services/slideExporter';

interface HeaderProps {
  currentDataset: Dataset;
  summary: ExecutiveSummary;
  onOpenChat: () => void;
  onExportCSV: () => void;
  onExportReport: () => void;
  isLiveStreaming: boolean;
  onToggleLiveStream: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentDataset,
  summary,
  onOpenChat,
  onExportCSV,
  onExportReport,
  isLiveStreaming,
  onToggleLiveStream,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handleToggleAudio = () => {
    if (isPlayingAudio) {
      stopExecutiveSummary();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      const textToSpeak = `${summary.headline}. ${summary.overview}. Key recommendations: ${summary.recommendations.join('. ')}`;
      speakExecutiveSummary(textToSpeak, () => setIsPlayingAudio(false));
    }
  };

  const handleExportSlides = () => {
    exportPresentationSlideDeck(currentDataset, summary);
  };

  return (
    <header className="glass-panel-light" style={{ padding: '20px 28px' }}>
      <div className="racing-stripe" />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            className="animate-race-pulse"
            style={{
              width: 52,
              height: 52,
              borderRadius: '16px',
              background: 'var(--gold-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-glow)',
            }}
          >
            <Activity size={28} color="#120b08" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '1.6rem', color: 'var(--gold-light)', letterSpacing: '-0.02em' }}>
                AI Data Insights
              </h1>
              <span className="badge-telemetry badge-glow">
                <Zap size={12} /> IMPERIAL v6.0
              </span>
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-gold-muted)', fontWeight: 500 }}>
              Royal Espresso & Gold Telemetry • Predictive Forecasts & Executive Intelligence
            </p>
          </div>
        </div>

        {/* Ocean Data Telemetry Indicator */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            background: '#120b08',
            color: '#fff',
            padding: '10px 18px',
            borderRadius: 'var(--radius-md)',
            border: '1.5px solid var(--border-gold)',
            boxShadow: 'var(--shadow-dark)',
          }}
        >
          <Database size={20} color="var(--gold-light)" />
          <div>
            <div style={{ fontSize: '0.88rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--gold-light)' }}>
              {currentDataset.name}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              ⚡ {currentDataset.rowCount} Records • {currentDataset.columnCount} Channels
            </div>
          </div>
        </div>

        {/* Action Controls & Feature Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Live Telemetry Streaming Simulator */}
          <button
            className={`btn ${isLiveStreaming ? 'btn-ocean animate-race-pulse' : 'btn-outline-ocean'}`}
            onClick={onToggleLiveStream}
            style={{ fontSize: '0.8rem' }}
          >
            <Radio size={16} /> {isLiveStreaming ? '🔴 LIVE STREAMING' : 'LIVE STREAM'}
          </button>

          {/* Text-to-Speech Audio Briefing */}
          <button
            className={`btn ${isPlayingAudio ? 'btn-ocean' : 'btn-dark'}`}
            onClick={handleToggleAudio}
            style={{ fontSize: '0.8rem' }}
            title="Narrate Executive Summary with AI Voice"
          >
            {isPlayingAudio ? <VolumeX size={16} /> : <Volume2 size={16} />}
            {isPlayingAudio ? 'STOP VOICE' : 'AUDIO BRIEFING'}
          </button>

          <button className="btn btn-ocean" onClick={onOpenChat}>
            <Bot size={18} /> Ask AI
          </button>

          <div style={{ display: 'flex', gap: '6px' }}>
            <button className="btn btn-dark btn-sm" onClick={handleExportSlides} title="Export Slide Deck Presentation">
              <Presentation size={14} /> Slides
            </button>
            <button className="btn btn-dark btn-sm" onClick={onExportCSV} title="Export CSV Data">
              <Download size={14} /> CSV
            </button>
            <button className="btn btn-dark btn-sm" onClick={onExportReport} title="Export Report">
              <Sparkles size={14} /> Report
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
