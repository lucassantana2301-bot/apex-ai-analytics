import type { Dataset, DataRow } from '../types/dataset';
import { calculateColumnMeta } from '../data/sampleDatasets';

export function mergeDatasets(
  datasetA: Dataset,
  datasetB: Dataset,
  joinKey: string
): Dataset {
  const mergedData: DataRow[] = [];

  const mapB = new Map<string, DataRow>();
  datasetB.data.forEach((row) => {
    const keyVal = String(row[joinKey] ?? '');
    if (keyVal) {
      mapB.set(keyVal, row);
    }
  });

  datasetA.data.forEach((rowA) => {
    const keyVal = String(rowA[joinKey] ?? '');
    const rowB = mapB.get(keyVal) || {};

    const mergedRow: DataRow = { ...rowA };
    Object.keys(rowB).forEach((k) => {
      if (k !== joinKey) {
        mergedRow[`${k}_B`] = rowB[k];
      }
    });

    mergedData.push(mergedRow);
  });

  const columns = calculateColumnMeta(mergedData);

  return {
    id: `merged-${Date.now()}`,
    name: `Merged: ${datasetA.name} + ${datasetB.name}`,
    description: `Multi-dataset join on key "${joinKey}" containing ${mergedData.length} records.`,
    category: 'Merged Telemetry',
    rowCount: mergedData.length,
    columnCount: columns.length,
    columns,
    data: mergedData,
    createdAt: new Date().toISOString().split('T')[0],
  };
}
