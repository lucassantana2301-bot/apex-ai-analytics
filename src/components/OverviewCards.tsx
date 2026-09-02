import React from 'react';
import { TrendingUp, TrendingDown, Gauge, DollarSign, Activity, Star, Award } from 'lucide-react';
import type { MetricCardData } from '../types/dataset';

interface OverviewCardsProps {
  metrics: MetricCardData[];
  healthScore: number;
}

export const OverviewCards: React.FC<OverviewCardsProps> = ({ metrics, healthScore }) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '20px' }}>
      {/* Data Health Telemetry Gauge Card */}
      <div className="glass-panel-light racing-card-interactive" style={{ padding: '22px 24px', borderTop: '4px solid var(--gold-primary)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--gold-light)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              SAÚDE DOS DADOS
            </span>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(229, 193, 88, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Gauge size={16} color="var(--gold-primary)" />
            </div>
          </div>

          <div style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--gold-light)', fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.02em', margin: '4px 0 12px 0' }}>
            {healthScore}%
          </div>
        </div>

        <div>
          <span className={`badge-telemetry ${healthScore >= 80 ? 'badge-cyan' : 'badge-ocean'}`}>
            <Activity size={12} /> {healthScore >= 80 ? 'Integridade Ideal' : 'Revisão Necessária'}
          </span>
        </div>
      </div>

      {/* Dynamic Key Numerical Metrics */}
      {metrics.map((metric) => {
        const isFinancial = /receita|cost|profit|custo|lucro|spend|revenue/i.test(metric.label);
        const isRating = /rating|avaliação|score|nps/i.test(metric.label);

        return (
          <div key={metric.id} className="glass-panel-light racing-card-interactive" style={{ padding: '22px 24px', borderTop: '4px solid var(--gold-light)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {metric.label}
                </span>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(229, 193, 88, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {isFinancial ? (
                    <DollarSign size={16} color="var(--gold-primary)" />
                  ) : isRating ? (
                    <Star size={16} color="var(--gold-primary)" />
                  ) : (
                    <Award size={16} color="var(--gold-primary)" />
                  )}
                </div>
              </div>

              {/* High precision single-line value typography */}
              <div style={{ fontSize: '2.1rem', fontWeight: 900, color: '#fffef5', fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.02em', margin: '4px 0 10px 0', whiteSpace: 'nowrap' }}>
                {metric.value}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', fontWeight: 600 }}>
              {metric.changePercent !== undefined && (
                <span style={{ color: 'var(--gold-light)', display: 'inline-flex', alignItems: 'center', gap: 3, fontWeight: 800 }}>
                  {metric.trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  {metric.changePercent > 0 ? `+${metric.changePercent}%` : `${metric.changePercent}%`}
                </span>
              )}
              <span style={{ color: 'var(--text-muted)' }}>{metric.subtitle}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
