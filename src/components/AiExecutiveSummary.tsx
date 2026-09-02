import React from 'react';
import { Sparkles, AlertTriangle, TrendingUp, CheckCircle, Lightbulb, Zap, ShieldAlert } from 'lucide-react';
import type { ExecutiveSummary } from '../types/dataset';

interface AiExecutiveSummaryProps {
  summary: ExecutiveSummary;
  onAskAboutInsight: (insightTitle: string) => void;
}

export const AiExecutiveSummary: React.FC<AiExecutiveSummaryProps> = ({ summary, onAskAboutInsight }) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
      {/* Executive Headline & Summary */}
      <div className="glass-panel-light" style={{ padding: '28px', gridColumn: '1 / -1', borderTop: '5px solid var(--gold-primary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: 'var(--gold-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-glow)' }}>
            <Sparkles size={22} color="#120b08" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.3rem', color: 'var(--gold-light)', fontFamily: 'Syne' }}>{summary.headline}</h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--gold-primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>AI Autonomous Intelligence Engine</span>
          </div>
        </div>

        <p style={{ fontSize: '0.95rem', color: '#fffdfa', lineHeight: '1.7', marginBottom: '20px', background: '#23150e', padding: '18px 22px', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--gold-primary)', border: '1px solid var(--border-gold)' }}>
          {summary.overview}
        </p>

        {/* Actionable Recommendations */}
        <h3 style={{ fontSize: '1rem', color: 'var(--gold-light)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'Outfit' }}>
          <Lightbulb size={18} color="var(--gold-primary)" /> Strategic Performance Directives
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {summary.recommendations.map((rec, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.9rem', color: '#fffdfa', background: '#23150e', padding: '12px 18px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-gold)' }}>
              <CheckCircle size={18} color="var(--gold-light)" style={{ marginTop: 2, flexShrink: 0 }} />
              <span style={{ fontWeight: 500 }}>{rec}</span>
            </div>
          ))}
        </div>
      </div>

      {/* AI Insights & Anomalies List */}
      <div className="glass-panel-light" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.05rem', color: 'var(--gold-light)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'Syne' }}>
          <ShieldAlert size={20} color="var(--gold-primary)" /> Telemetry Anomalies & Signal Alerts
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {summary.insights.length === 0 ? (
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>All telemetry parameters operating within expected range.</p>
          ) : (
            summary.insights.map((insight) => (
              <div
                key={insight.id}
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  background: '#23150e',
                  border: '1.5px solid var(--border-gold)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--gold-light)', display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'Outfit' }}>
                    {insight.type === 'anomaly' ? <AlertTriangle size={16} color="var(--gold-primary)" /> : <TrendingUp size={16} color="var(--gold-light)" />}
                    {insight.title}
                  </div>
                  <span className="badge-telemetry badge-ocean">
                    {insight.impact} IMPACT
                  </span>
                </div>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: '1.5', margin: '6px 0 10px 0' }}>
                  {insight.description}
                </p>
                {insight.actionableStep && (
                  <div style={{ fontSize: '0.78rem', color: 'var(--gold-light)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }} onClick={() => onAskAboutInsight(insight.title)}>
                    <Zap size={14} /> {insight.actionableStep}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Top Drivers & Concentration Analysis */}
      <div className="glass-panel-light" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.05rem', color: 'var(--gold-light)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'Syne' }}>
          <TrendingUp size={20} color="var(--gold-primary)" /> Data Concentration & Driver Distribution
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {summary.topDrivers.map((driver, idx) => (
            <div key={idx}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', fontWeight: 700, color: '#fffdfa', marginBottom: '6px' }}>
                <span>{driver.label}</span>
                <span style={{ color: 'var(--gold-light)', fontWeight: 800 }}>{driver.impactScore}% Concentration</span>
              </div>
              <div style={{ height: 8, background: '#120b08', borderRadius: 4, overflow: 'hidden', border: '1px solid var(--border-gold)' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${driver.impactScore}%`,
                    background: 'var(--gold-gradient)',
                    borderRadius: 4,
                  }}
                />
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                {driver.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
