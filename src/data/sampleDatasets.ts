import type { Dataset, ColumnMeta, DataRow } from '../types/dataset';

// Helper to compute column meta automatically
export function calculateColumnMeta(data: DataRow[]): ColumnMeta[] {
  if (!data || data.length === 0) return [];
  const keys = Object.keys(data[0]);

  return keys.map((key) => {
    const values = data.map((d) => d[key]);
    const nonNullValues = values.filter((v) => v !== null && v !== undefined && v !== '');
    const missingCount = data.length - nonNullValues.length;
    const uniqueCount = new Set(nonNullValues).size;

    // Detect type
    const sample = nonNullValues[0];
    let type: ColumnMeta['type'] = 'string';

    if (typeof sample === 'number' || (!isNaN(Number(sample)) && sample !== '')) {
      const isAllNumeric = nonNullValues.every((v) => !isNaN(Number(v)));
      if (isAllNumeric) type = 'number';
    } else if (typeof sample === 'boolean' || sample === 'true' || sample === 'false') {
      type = 'boolean';
    } else if (typeof sample === 'string' && !isNaN(Date.parse(sample)) && sample.length > 5) {
      type = 'date';
    }

    let min: number | undefined;
    let max: number | undefined;
    let mean: number | undefined;

    if (type === 'number') {
      const numValues = nonNullValues.map((v) => Number(v));
      if (numValues.length > 0) {
        min = Math.min(...numValues);
        max = Math.max(...numValues);
        const sum = numValues.reduce((a, b) => a + b, 0);
        mean = Number((sum / numValues.length).toFixed(2));
      }
    }

    return {
      name: key,
      type,
      missingCount,
      uniqueCount,
      min,
      max,
      mean,
      sampleValues: nonNullValues.slice(0, 5) as (string | number | boolean)[],
    };
  });
}

const ecommerceData: DataRow[] = [
  { Order_ID: 'ORD-9012', Date: '2026-01-15', Region: 'North America', Category: 'Electronics', Revenue: 1450, Cost: 900, Profit: 550, Customer_Segment: 'Enterprise', Rating: 4.8, Units_Sold: 12, Discount_Pct: 5 },
  { Order_ID: 'ORD-9013', Date: '2026-01-18', Region: 'Europe', Category: 'Fashion', Revenue: 620, Cost: 310, Profit: 310, Customer_Segment: 'Consumer', Rating: 4.2, Units_Sold: 4, Discount_Pct: 10 },
  { Order_ID: 'ORD-9014', Date: '2026-01-22', Region: 'Asia Pacific', Category: 'Electronics', Revenue: 2890, Cost: 1800, Profit: 1090, Customer_Segment: 'Enterprise', Rating: 4.9, Units_Sold: 25, Discount_Pct: 0 },
  { Order_ID: 'ORD-9015', Date: '2026-01-29', Region: 'Latin America', Category: 'Home & Kitchen', Revenue: 410, Cost: 250, Profit: 160, Customer_Segment: 'SMB', Rating: 3.9, Units_Sold: 6, Discount_Pct: 15 },
  { Order_ID: 'ORD-9016', Date: '2026-02-03', Region: 'North America', Category: 'Software', Revenue: 5200, Cost: 1200, Profit: 4000, Customer_Segment: 'Enterprise', Rating: 5.0, Units_Sold: 1, Discount_Pct: 0 },
  { Order_ID: 'ORD-9017', Date: '2026-02-10', Region: 'Europe', Category: 'Electronics', Revenue: 1890, Cost: 1200, Profit: 690, Customer_Segment: 'Consumer', Rating: 4.5, Units_Sold: 10, Discount_Pct: 5 },
  { Order_ID: 'ORD-9018', Date: '2026-02-14', Region: 'North America', Category: 'Fashion', Revenue: 950, Cost: 400, Profit: 550, Customer_Segment: 'Consumer', Rating: 4.1, Units_Sold: 8, Discount_Pct: 20 },
  { Order_ID: 'ORD-9019', Date: '2026-02-21', Region: 'Asia Pacific', Category: 'Software', Revenue: 3400, Cost: 800, Profit: 2600, Customer_Segment: 'SMB', Rating: 4.7, Units_Sold: 3, Discount_Pct: 10 },
  { Order_ID: 'ORD-9020', Date: '2026-02-28', Region: 'Europe', Category: 'Home & Kitchen', Revenue: 780, Cost: 480, Profit: 300, Customer_Segment: 'Consumer', Rating: 4.3, Units_Sold: 9, Discount_Pct: 0 },
  { Order_ID: 'ORD-9021', Date: '2026-03-05', Region: 'North America', Category: 'Electronics', Revenue: 4200, Cost: 2600, Profit: 1600, Customer_Segment: 'Enterprise', Rating: 4.8, Units_Sold: 30, Discount_Pct: 8 },
  { Order_ID: 'ORD-9022', Date: '2026-03-12', Region: 'Latin America', Category: 'Fashion', Revenue: 530, Cost: 290, Profit: 240, Customer_Segment: 'Consumer', Rating: 3.8, Units_Sold: 5, Discount_Pct: 12 },
  { Order_ID: 'ORD-9023', Date: '2026-03-19', Region: 'Asia Pacific', Category: 'Electronics', Revenue: 3100, Cost: 1900, Profit: 1200, Customer_Segment: 'SMB', Rating: 4.6, Units_Sold: 20, Discount_Pct: 5 },
];

const saasMetricsData: DataRow[] = [
  { Month: '2025-09', MRR: 42500, New_ARR: 8200, Churn_Rate_Pct: 2.1, Active_Users: 1420, LTV: 3800, CAC: 420, NPS_Score: 54 },
  { Month: '2025-10', MRR: 45800, New_ARR: 9500, Churn_Rate_Pct: 1.9, Active_Users: 1580, LTV: 3950, CAC: 410, NPS_Score: 56 },
  { Month: '2025-11', MRR: 49200, New_ARR: 10400, Churn_Rate_Pct: 1.8, Active_Users: 1740, LTV: 4100, CAC: 395, NPS_Score: 58 },
  { Month: '2025-12', MRR: 54100, New_ARR: 12800, Churn_Rate_Pct: 1.6, Active_Users: 1950, LTV: 4300, CAC: 380, NPS_Score: 61 },
  { Month: '2026-01', MRR: 59800, New_ARR: 14200, Churn_Rate_Pct: 1.4, Active_Users: 2210, LTV: 4550, CAC: 370, NPS_Score: 64 },
  { Month: '2026-02', MRR: 64900, New_ARR: 13900, Churn_Rate_Pct: 1.5, Active_Users: 2450, LTV: 4700, CAC: 365, NPS_Score: 65 },
  { Month: '2026-03', MRR: 71200, New_ARR: 16500, Churn_Rate_Pct: 1.3, Active_Users: 2780, LTV: 4900, CAC: 350, NPS_Score: 68 },
];

const customerChurnData: DataRow[] = [
  { Customer_ID: 'CUST-101', Plan: 'Pro', Tenure_Months: 24, Support_Tickets: 1, Monthly_Spend: 199, Health_Score: 92, Churn_Risk: 'Low' },
  { Customer_ID: 'CUST-102', Plan: 'Starter', Tenure_Months: 3, Support_Tickets: 8, Monthly_Spend: 49, Health_Score: 35, Churn_Risk: 'High' },
  { Customer_ID: 'CUST-103', Plan: 'Enterprise', Tenure_Months: 36, Support_Tickets: 2, Monthly_Spend: 899, Health_Score: 95, Churn_Risk: 'Low' },
  { Customer_ID: 'CUST-104', Plan: 'Pro', Tenure_Months: 8, Support_Tickets: 5, Monthly_Spend: 199, Health_Score: 58, Churn_Risk: 'Medium' },
  { Customer_ID: 'CUST-105', Plan: 'Starter', Tenure_Months: 1, Support_Tickets: 12, Monthly_Spend: 49, Health_Score: 22, Churn_Risk: 'Critical' },
  { Customer_ID: 'CUST-106', Plan: 'Enterprise', Tenure_Months: 18, Support_Tickets: 0, Monthly_Spend: 1200, Health_Score: 98, Churn_Risk: 'Low' },
  { Customer_ID: 'CUST-107', Plan: 'Pro', Tenure_Months: 14, Support_Tickets: 4, Monthly_Spend: 249, Health_Score: 64, Churn_Risk: 'Medium' },
  { Customer_ID: 'CUST-108', Plan: 'Starter', Tenure_Months: 6, Support_Tickets: 7, Monthly_Spend: 49, Health_Score: 41, Churn_Risk: 'High' },
];

export const SAMPLE_DATASETS: Dataset[] = [
  {
    id: 'ecommerce-global',
    name: 'E-Commerce Global Sales & Revenue',
    description: 'Order revenues, profit margins, categories, and customer segments across global regions.',
    category: 'E-Commerce & Retail',
    rowCount: ecommerceData.length,
    columnCount: Object.keys(ecommerceData[0]).length,
    columns: calculateColumnMeta(ecommerceData),
    data: ecommerceData,
    createdAt: '2026-03-01',
  },
  {
    id: 'saas-recurring',
    name: 'SaaS Monthly Growth & Unit Economics',
    description: 'MRR expansion, churn rates, LTV/CAC ratios, active user growth, and NPS benchmarks.',
    category: 'SaaS & Financials',
    rowCount: saasMetricsData.length,
    columnCount: Object.keys(saasMetricsData[0]).length,
    columns: calculateColumnMeta(saasMetricsData),
    data: saasMetricsData,
    createdAt: '2026-03-01',
  },
  {
    id: 'customer-churn',
    name: 'Customer Health & Churn Risk Analysis',
    description: 'Account tenure, support ticket volume, monthly spend, health scores, and predicted churn risk.',
    category: 'Customer Success',
    rowCount: customerChurnData.length,
    columnCount: Object.keys(customerChurnData[0]).length,
    columns: calculateColumnMeta(customerChurnData),
    data: customerChurnData,
    createdAt: '2026-03-01',
  },
];
