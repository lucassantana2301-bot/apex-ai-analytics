import Papa from 'papaparse';
import type { Dataset, DataRow } from '../types/dataset';
import { calculateColumnMeta } from '../data/sampleDatasets';

export function parseCSVFile(file: File): Promise<Dataset> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rawData = results.data as DataRow[];
        if (!rawData || rawData.length === 0) {
          reject(new Error('CSV file is empty or invalid.'));
          return;
        }

        // Clean keys
        const cleanedData = rawData.map((row) => {
          const newRow: DataRow = {};
          Object.keys(row).forEach((key) => {
            const cleanKey = key.trim().replace(/^"|"$/g, '');
            newRow[cleanKey] = row[key];
          });
          return newRow;
        });

        const columns = calculateColumnMeta(cleanedData);

        const dataset: Dataset = {
          id: `custom-${Date.now()}`,
          name: file.name.replace(/\.[^/.]+$/, ''),
          description: `Custom dataset uploaded from ${file.name}`,
          category: 'Uploaded Dataset',
          rowCount: cleanedData.length,
          columnCount: columns.length,
          columns,
          data: cleanedData,
          createdAt: new Date().toISOString().split('T')[0],
        };

        resolve(dataset);
      },
      error: (error) => {
        reject(error);
      },
    });
  });
}

export function parseJSONFile(file: File): Promise<Dataset> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        const dataArr = Array.isArray(parsed) ? parsed : [parsed];

        if (dataArr.length === 0 || typeof dataArr[0] !== 'object') {
          throw new Error('Invalid JSON structure. Expected an array of objects.');
        }

        const columns = calculateColumnMeta(dataArr);

        const dataset: Dataset = {
          id: `custom-json-${Date.now()}`,
          name: file.name.replace(/\.[^/.]+$/, ''),
          description: `Uploaded JSON file: ${file.name}`,
          category: 'Uploaded Dataset',
          rowCount: dataArr.length,
          columnCount: columns.length,
          columns,
          data: dataArr,
          createdAt: new Date().toISOString().split('T')[0],
        };

        resolve(dataset);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsText(file);
  });
}
