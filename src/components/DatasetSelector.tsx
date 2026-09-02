import React, { useRef, useState } from 'react';
import { UploadCloud, CheckCircle2, Sliders, FileSpreadsheet } from 'lucide-react';
import type { Dataset } from '../types/dataset';
import { SAMPLE_DATASETS } from '../data/sampleDatasets';
import { parseCSVFile, parseJSONFile } from '../services/csvParser';

interface DatasetSelectorProps {
  currentDataset: Dataset;
  onSelectDataset: (dataset: Dataset) => void;
}

export const DatasetSelector: React.FC<DatasetSelectorProps> = ({
  currentDataset,
  onSelectDataset,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setErrorMsg(null);
    setLoading(true);
    try {
      let dataset: Dataset;
      if (file.name.endsWith('.csv')) {
        dataset = await parseCSVFile(file);
      } else if (file.name.endsWith('.json')) {
        dataset = await parseJSONFile(file);
      } else {
        throw new Error('Unsupported format. Please upload a CSV or JSON file.');
      }
      onSelectDataset(dataset);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to parse file.');
    } finally {
      setLoading(false);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => setIsDragging(false);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="glass-panel-light" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '1.2rem', color: 'var(--gold-light)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sliders size={20} color="var(--gold-primary)" /> Select Telemetry Dataset or Import Data
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Choose a high-performance preset dataset or drop custom CSV / JSON telemetry files
          </p>
        </div>
        <span className="badge-telemetry badge-ocean">
          <FileSpreadsheet size={12} /> {SAMPLE_DATASETS.length} Active Presets
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '18px' }}>
        {/* Sample Datasets Cards */}
        {SAMPLE_DATASETS.map((ds) => {
          const isSelected = ds.id === currentDataset.id;
          return (
            <div
              key={ds.id}
              onClick={() => onSelectDataset(ds)}
              className="racing-card-interactive"
              style={{
                padding: '18px',
                borderRadius: 'var(--radius-md)',
                background: isSelected ? '#120b08' : '#23150e',
                color: isSelected ? 'var(--gold-light)' : 'var(--text-gold-bright)',
                border: isSelected ? '2px solid var(--gold-light)' : '1px solid var(--border-gold)',
                boxShadow: isSelected ? 'var(--shadow-glow)' : 'var(--shadow-ocean)',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div style={{ fontWeight: 800, fontSize: '1rem', fontFamily: 'Syne', textTransform: 'uppercase', color: isSelected ? 'var(--gold-light)' : '#fff' }}>
                  {ds.name}
                </div>
                {isSelected && <CheckCircle2 size={20} color="var(--gold-light)" />}
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '8px 0 12px 0', lineHeight: '1.4' }}>
                {ds.description}
              </p>
              <div style={{ display: 'flex', gap: '10px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--gold-primary)' }}>
                <span>📁 {ds.category}</span>
                <span>• {ds.rowCount} Rows</span>
                <span>• {ds.columnCount} Cols</span>
              </div>
            </div>
          );
        })}

        {/* Drag & Drop Upload Zone */}
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{
            padding: '20px',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            background: isDragging ? 'rgba(245, 208, 97, 0.12)' : 'rgba(212, 175, 55, 0.04)',
            border: isDragging ? '2px dashed var(--gold-light)' : '2px dashed var(--gold-primary)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            transition: 'all 0.25s ease',
          }}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            accept=".csv,.json"
            style={{ display: 'none' }}
          />
          <UploadCloud size={32} color="var(--gold-primary)" style={{ marginBottom: 8 }} />
          <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--gold-light)', textTransform: 'uppercase', fontFamily: 'Syne' }}>
            {loading ? 'Processing File...' : 'Drop Custom CSV or JSON'}
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4 }}>
            Instant parsing & auto schema detection
          </p>
          {errorMsg && (
            <span style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: 6, fontWeight: 600 }}>
              {errorMsg}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
