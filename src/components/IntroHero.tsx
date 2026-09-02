import React, { useState, useEffect } from 'react';
import { Play, Zap, Activity, ChevronRight } from 'lucide-react';

interface IntroHeroProps {
  onEngage: () => void;
  datasetName: string;
  rowCount: number;
}

export const IntroHero: React.FC<IntroHeroProps> = ({ onEngage, datasetName, rowCount }) => {
  const [speedProgress, setSpeedProgress] = useState(0);
  const [telemetryState, setTelemetryState] = useState<'STANDBY' | 'WARMING' | 'READY'>('STANDBY');
  const [lights, setLights] = useState<[boolean, boolean, boolean, boolean]>([false, false, false, false]);

  useEffect(() => {
    const timer1 = setTimeout(() => setLights([true, false, false, false]), 300);
    const timer2 = setTimeout(() => setLights([true, true, false, false]), 600);
    const timer3 = setTimeout(() => setLights([true, true, true, false]), 900);
    const timer4 = setTimeout(() => {
      setLights([true, true, true, true]);
      setTelemetryState('WARMING');
    }, 1200);

    let current = 0;
    const interval = setInterval(() => {
      current += 4;
      if (current >= 100) {
        current = 100;
        setTelemetryState('READY');
        clearInterval(interval);
      }
      setSpeedProgress(current);
    }, 30);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="intro-hero-container">
      {/* Netflix Cinematic Background Shimmer */}
      <div className="netflix-shimmer-overlay" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', alignItems: 'center', position: 'relative', zIndex: 2 }}>
        
        {/* Left Side: Apple Style Keynote Presentation + Lando Norris F1 Racing Intro */}
        <div>
          {/* F1 Racing Start Lights */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', gap: '6px', background: 'rgba(0,0,0,0.6)', padding: '6px 12px', borderRadius: '20px', border: '1px solid var(--border-gold)' }}>
              {lights.map((active, idx) => (
                <div
                  key={idx}
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    background: active ? (idx === 3 ? '#f5d061' : '#d4af37') : '#261912',
                    boxShadow: active ? `0 0 12px ${idx === 3 ? '#f5d061' : '#d4af37'}` : 'none',
                    transition: 'all 0.2s ease',
                  }}
                />
              ))}
            </div>
            <span className="badge-telemetry badge-glow" style={{ fontSize: '0.72rem' }}>
              <Zap size={12} /> IMPERIAL GOLD {telemetryState}
            </span>
          </div>

          <h1
            style={{
              fontSize: '2.5rem',
              fontWeight: 900,
              letterSpacing: '-0.02em',
              lineHeight: '1.15',
              marginBottom: '14px',
              fontFamily: 'Syne, sans-serif',
              background: 'linear-gradient(135deg, #fffdfa 0%, #f5d061 50%, #d4af37 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            NEXT-GEN AI DATA ENGINE
          </h1>

          <p style={{ fontSize: '1rem', color: '#e2c992', lineHeight: '1.6', marginBottom: '24px', fontWeight: 500 }}>
            Prestige analytics for <strong>{datasetName}</strong>. Instant executive summaries, real-time telemetry QA & natural language AI querying.
          </p>

          {/* RPM Telemetry Gauge Progress Bar */}
          <div style={{ marginBottom: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: '#f5d061', marginBottom: '6px', fontFamily: 'Outfit' }}>
              <span>SYSTEM CALIBRATION</span>
              <span>{speedProgress}% SPEED</span>
            </div>
            <div style={{ height: 10, background: '#120b08', borderRadius: 5, overflow: 'hidden', border: '1.5px solid var(--border-gold)' }}>
              <div
                style={{
                  height: '100%',
                  width: `${speedProgress}%`,
                  background: 'linear-gradient(90deg, #d4af37, #f5d061, #fffdfa)',
                  boxShadow: '0 0 15px #f5d061',
                  transition: 'width 0.1s linear',
                }}
              />
            </div>
          </div>

          {/* Netflix Launch CTA Button */}
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <button
              className="btn btn-ocean animate-race-pulse"
              onClick={onEngage}
              style={{ padding: '16px 32px', fontSize: '1rem', borderRadius: 'var(--radius-md)' }}
            >
              <Play size={20} fill="#120b08" /> LAUNCH TELEMETRY ENGINE <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Right Side: Orbital Space Station Quantum Atom (Imperial Gold) */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', height: 300 }}>
          <div className="quantum-atom-wrapper">
            {/* Outer Ring 1 */}
            <div className="orbital-ring ring-1" />
            {/* Outer Ring 2 */}
            <div className="orbital-ring ring-2" />
            {/* Outer Ring 3 */}
            <div className="orbital-ring ring-3" />

            {/* Core Orb */}
            <div className="atom-core">
              <Activity size={32} color="#120b08" />
            </div>

            {/* Orbiting Space Nodes */}
            <div className="space-node node-1">📁 {rowCount} ROWS</div>
            <div className="space-node node-2">⚡ 100% ACCURACY</div>
            <div className="space-node node-3">🤖 AI ACTIVE</div>
          </div>
        </div>
      </div>
    </div>
  );
};
