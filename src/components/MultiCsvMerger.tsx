import React, { useState } from 'react';
import { GitMerge, Plus, Check } from 'lucide-react';
import type { Dataset } from '../types/dataset';
import { parseCSVFile } from '../services/csvParser';
import { mergeDatasets } from '../services/csvMerger';

interface MultiCsvMergerProps {
  onDatasetMerged: (merged: Dataset) => void;
}

export const MultiCsvMerger: React.FC<MultiCsvMergerProps> = ({ onDatasetMerged }) => {
  const [fileA, setFileA] = useState<Dataset | null>(null);
  const [fileB, setFileB] = useState<Dataset | null>(null);
  const [joinKey, setJoinKey] = useState<string>('');
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const handleUploadFileA = async (file: File) => {
    try {
      const ds = await parseCSVFile(file);
      setFileA(ds);
    } catch (e: any) {
      setStatusMsg(`Error parsing File A: ${e.message}`);
    }
  };

  const handleUploadFileB = async (file: File) => {
    try {
      const ds = await parseCSVFile(file);
      setFileB(ds);
    } catch (e: any) {
      setStatusMsg(`Error parsing File B: ${e.message}`);
    }
  };

  const handleMerge = () => {
    if (!fileA || !fileB || !joinKey) {
      setStatusMsg('Please select File A, File B, and a valid Join Key.');
      return;
    }

    try {
      const merged = mergeDatasets(fileA, fileB, joinKey);
      onDatasetMerged(merged);
      setStatusMsg(`Successfully merged into "${merged.name}"!`);
    } catch (err: any) {
      setStatusMsg(`Merge failed: ${err.message}`);
    }
  };

  const commonKeys = fileA && fileB
    ? fileA.columns.map((c) => c.name).filter((name) => fileB.columns.some((cb) => cb.name === name))
    : [];

  return (
    <div className="glass-panel-light" style={{ padding: '24px' }}>
      <h2 style={{ fontSize: '1.2rem', color: 'var(--gold-light)', display: 'flex', alignItems: 'center', gap: 8, marginBottom: '12px', fontFamily: 'Syne' }}>
        <GitMerge size={20} color="var(--gold-primary)" /> Multi-CSV Join & Merge Studio
      </h2>
      <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
        Upload two CSV files, select a matching join key, and combine telemetry channels automatically
      </p>

      {statusMsg && (
        <div style={{ padding: '12px', borderRadius: 'var(--radius-md)', background: 'rgba(212, 175, 55, 0.15)', color: 'var(--gold-light)', fontSize: '0.85rem', fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Check size={16} /> {statusMsg}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px', marginBottom: '20px' }}>
        {/* Upload File A */}
        <div style={{ background: '#23150e', padding: '16px', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--border-gold)' }}>
          <div style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--gold-light)', marginBottom: 8 }}>
            Table A (Primary Dataset)
          </div>
          {fileA ? (
            <div style={{ fontSize: '0.82rem', color: 'var(--gold-light)', fontWeight: 700 }}>
              ✓ {fileA.name} ({fileA.rowCount} rows)
            </div>
          ) : (
            <input type="file" accept=".csv" onChange={(e) => e.target.files?.[0] && handleUploadFileA(e.target.files[0])} className="form-control" />
          )}
        </div>

        {/* Upload File B */}
        <div style={{ background: '#23150e', padding: '16px', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--border-gold)' }}>
          <div style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--gold-light)', marginBottom: 8 }}>
            Table B (Secondary Dataset)
          </div>
          {fileB ? (
            <div style={{ fontSize: '0.82rem', color: 'var(--gold-light)', fontWeight: 700 }}>
              ✓ {fileB.name} ({fileB.rowCount} rows)
            </div>
          ) : (
            <input type="file" accept=".csv" onChange={(e) => e.target.files?.[0] && handleUploadFileB(e.target.files[0])} className="form-control" />
          )}
        </div>
      </div>

      {/* Join Key Selection */}
      {fileA && fileB && (
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--gold-light)', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
            Select Common Join Column
          </label>
          <select className="form-control" value={joinKey} onChange={(e) => setJoinKey(e.target.value)}>
            <option value="">-- Choose Join Key --</option>
            {commonKeys.length > 0 ? (
              commonKeys.map((k) => <option key={k} value={k}>{k}</option>)
            ) : (
              fileA.columns.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)
            )}
          </select>
        </div>
      )}

      <button className="btn btn-ocean" disabled={!fileA || !fileB || !joinKey} onClick={handleMerge}>
        <Plus size={16} /> Execute Telemetry Join
      </button>
    </div>
  );
};
