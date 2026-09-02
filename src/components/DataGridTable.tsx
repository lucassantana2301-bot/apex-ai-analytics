import React, { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, ArrowUpDown, Table as TableIcon } from 'lucide-react';
import type { Dataset } from '../types/dataset';

interface DataGridTableProps {
  dataset: Dataset;
}

export const DataGridTable: React.FC<DataGridTableProps> = ({ dataset }) => {
  const { columns, data } = dataset;
  const [searchTerm, setSearchTerm] = useState('');
  const [sortCol, setSortCol] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const filteredData = useMemo(() => {
    let result = [...data];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter((row) =>
        Object.values(row).some((val) => String(val ?? '').toLowerCase().includes(term))
      );
    }

    if (sortCol) {
      result.sort((a, b) => {
        const valA = a[sortCol];
        const valB = b[sortCol];
        if (valA === valB) return 0;
        if (valA === null || valA === undefined) return 1;
        if (valB === null || valB === undefined) return -1;

        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortDir === 'asc' ? valA - valB : valB - valA;
        }

        return sortDir === 'asc'
          ? String(valA).localeCompare(String(valB))
          : String(valB).localeCompare(String(valA));
      });
    }

    return result;
  }, [data, searchTerm, sortCol, sortDir]);

  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const handleSort = (colName: string) => {
    if (sortCol === colName) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortCol(colName);
      setSortDir('asc');
    }
  };

  return (
    <div className="glass-panel-light" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '1.2rem', color: 'var(--gold-light)', display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'Syne' }}>
            <TableIcon size={20} color="var(--gold-primary)" /> Raw Telemetry Grid & Data Explorer
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Inspecting {filteredData.length} active records
          </p>
        </div>

        {/* Search Bar */}
        <div style={{ position: 'relative', width: '300px' }}>
          <Search size={18} color="var(--gold-primary)" style={{ position: 'absolute', left: 14, top: 12 }} />
          <input
            type="text"
            className="form-control"
            placeholder="Search records..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            style={{ paddingLeft: 42 }}
          />
        </div>
      </div>

      {/* Table Container */}
      <div style={{ overflowX: 'auto', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--border-gold)', background: '#1c120d' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#120b08', color: 'var(--gold-light)' }}>
              {columns.map((col) => (
                <th
                  key={col.name}
                  onClick={() => handleSort(col.name)}
                  style={{
                    padding: '14px 16px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    userSelect: 'none',
                    fontFamily: 'Outfit',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    fontSize: '0.78rem',
                    borderBottom: '2px solid var(--border-gold)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>{col.name}</span>
                    <ArrowUpDown size={14} color="var(--gold-light)" />
                    <span className="badge-telemetry badge-cyan" style={{ fontSize: '0.65rem', padding: '2px 6px' }}>
                      {col.type}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No matching telemetry records found.
                </td>
              </tr>
            ) : (
              paginatedData.map((row, idx) => (
                <tr
                  key={idx}
                  style={{
                    borderBottom: '1px solid rgba(212, 175, 55, 0.1)',
                    background: idx % 2 === 0 ? 'transparent' : 'rgba(212, 175, 55, 0.03)',
                  }}
                >
                  {columns.map((col) => {
                    const val = row[col.name];
                    const isNum = col.type === 'number';
                    return (
                      <td key={col.name} style={{ padding: '12px 16px', color: '#fffdfa', whiteSpace: 'nowrap' }}>
                        {val === null || val === undefined ? (
                          <span style={{ color: '#ef4444', fontStyle: 'italic', fontWeight: 600 }}>null</span>
                        ) : isNum ? (
                          <span style={{ fontFamily: 'Syne', fontWeight: 700, color: 'var(--gold-light)' }}>{val.toLocaleString()}</span>
                        ) : (
                          String(val)
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px', fontSize: '0.84rem', color: 'var(--text-muted)', fontWeight: 600 }}>
        <div>
          Page {currentPage} of {totalPages} ({filteredData.length} total records)
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            className="btn btn-outline-ocean btn-sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          >
            <ChevronLeft size={16} /> Previous
          </button>
          <button
            className="btn btn-outline-ocean btn-sm"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
