import React, { useState } from 'react';
import { ShieldCheck, AlertCircle, Wrench, Check } from 'lucide-react';
import type { Dataset, DataQualityReport } from '../types/dataset';
import { generateDataQualityReport } from '../services/aiEngine';

interface DataQualityStudioProps {
  dataset: Dataset;
  onUpdateDataset: (updatedDataset: Dataset) => void;
}

export const DataQualityStudio: React.FC<DataQualityStudioProps> = ({ dataset, onUpdateDataset }) => {
  const [report, setReport] = useState<DataQualityReport>(() => generateDataQualityReport(dataset));
  const [cleanedSuccess, setCleanedSuccess] = useState<string | null>(null);

  const handleAutoCleanMissing = () => {
    const cleanedData = dataset.data.map((row) => {
      const newRow = { ...row };
      dataset.columns.forEach((col) => {
        if (newRow[col.name] === null || newRow[col.name] === undefined || newRow[col.name] === '') {
          if (col.type === 'number') {
            newRow[col.name] = col.mean || 0;
          } else {
            newRow[col.name] = 'N/A';
          }
        }
      });
      return newRow;
    });

    const updatedDataset: Dataset = {
      ...dataset,
      data: cleanedData,
      columns: dataset.columns.map((c) => ({ ...c, missingCount: 0 })),
    };

    onUpdateDataset(updatedDataset);
    setReport(generateDataQualityReport(updatedDataset));
    setCleanedSuccess('Replaced missing numeric values with column mean and text values with N/A!');
    setTimeout(() => setCleanedSuccess(null), 4000);
  };

  return (
    <div className="glass-panel-light" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.2rem', color: 'var(--gold-light)', display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'Syne' }}>
            <ShieldCheck size={20} color="var(--gold-primary)" /> Telemetry Quality & Health Control
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Schema integrity audit, missing value detection, and 1-click data transformation
          </p>
        </div>

        <button className="btn btn-ocean btn-sm" onClick={handleAutoCleanMissing}>
          <Wrench size={16} /> Auto-Clean Missing Data
        </button>
      </div>

      {cleanedSuccess && (
        <div style={{ padding: '12px 18px', borderRadius: 'var(--radius-md)', background: 'rgba(212, 175, 55, 0.15)', border: '1px solid var(--gold-light)', color: 'var(--gold-light)', fontSize: '0.88rem', fontWeight: 600, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
          <Check size={18} /> {cleanedSuccess}
        </div>
      )}

      {/* Summary Score Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px', marginBottom: '24px' }}>
        <div style={{ background: '#23150e', padding: '18px', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--border-gold)', boxShadow: 'var(--shadow-ocean)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--gold-light)', fontWeight: 800, textTransform: 'uppercase' }}>Overall Health Score</div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--gold-light)', fontFamily: 'Syne' }}>
            {report.healthScore}%
          </div>
        </div>

        <div style={{ background: '#23150e', padding: '18px', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--border-gold)', boxShadow: 'var(--shadow-ocean)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--gold-light)', fontWeight: 800, textTransform: 'uppercase' }}>Total Missing Cells</div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: report.totalMissingCells > 0 ? '#ef4444' : '#fffdfa', fontFamily: 'Syne' }}>
            {report.totalMissingCells} ({report.missingPercentage}%)
          </div>
        </div>

        <div style={{ background: '#23150e', padding: '18px', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--border-gold)', boxShadow: 'var(--shadow-ocean)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--gold-light)', fontWeight: 800, textTransform: 'uppercase' }}>Audited Channels</div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#fffdfa', fontFamily: 'Syne' }}>
            {report.totalColumns}
          </div>
        </div>
      </div>

      {/* Column Health Detail Table */}
      <div style={{ overflowX: 'auto', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--border-gold)', background: '#1c120d' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#120b08', color: 'var(--gold-light)' }}>
              <th style={{ padding: '14px 16px', fontFamily: 'Outfit', textTransform: 'uppercase', fontSize: '0.78rem' }}>Column Name</th>
              <th style={{ padding: '14px 16px', fontFamily: 'Outfit', textTransform: 'uppercase', fontSize: '0.78rem' }}>Type</th>
              <th style={{ padding: '14px 16px', fontFamily: 'Outfit', textTransform: 'uppercase', fontSize: '0.78rem' }}>Missing Count</th>
              <th style={{ padding: '14px 16px', fontFamily: 'Outfit', textTransform: 'uppercase', fontSize: '0.78rem' }}>Outliers</th>
              <th style={{ padding: '14px 16px', fontFamily: 'Outfit', textTransform: 'uppercase', fontSize: '0.78rem' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {report.columnHealth.map((col) => (
              <tr key={col.columnName} style={{ borderBottom: '1px solid rgba(212, 175, 55, 0.1)' }}>
                <td style={{ padding: '12px 16px', color: '#fffdfa', fontWeight: 700 }}>{col.columnName}</td>
                <td style={{ padding: '12px 16px', color: 'var(--gold-primary)', fontWeight: 600 }}>{col.type}</td>
                <td style={{ padding: '12px 16px', color: col.missingCount > 0 ? '#ef4444' : '#fffdfa', fontWeight: 700 }}>
                  {col.missingCount} ({col.missingPercent}%)
                </td>
                <td style={{ padding: '12px 16px', color: col.outlierCount > 0 ? '#ef4444' : '#fffdfa', fontWeight: 700 }}>
                  {col.outlierCount}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  {col.issueDescription ? (
                    <span className="badge-telemetry badge-ocean" style={{ fontSize: '0.7rem' }}>
                      <AlertCircle size={12} /> {col.issueDescription}
                    </span>
                  ) : (
                    <span className="badge-telemetry badge-cyan" style={{ fontSize: '0.7rem' }}>
                      Optimal
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
