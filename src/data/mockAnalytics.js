export const digitizationProgressData = [
  { month: "Apr 2026", processed: 7200, validated: 6100, accuracy: 91.2 },
  { month: "May 2026", processed: 8450, validated: 7300, accuracy: 92.4 },
  { month: "Jun 2026", processed: 9600, validated: 8400, accuracy: 93.1 },
  { month: "Jul 2026", processed: 10800, validated: 9350, accuracy: 93.8 },
  { month: "Aug 2026", processed: 11650, validated: 10100, accuracy: 94.2 },
  { month: "Sep 2026", processed: 12480, validated: 10842, accuracy: 94.8 },
];

export const validationDistributionData = [
  { name: "Validated", value: 10842, color: "#10b981", percentage: 86.9 },
  { name: "Needs Review", value: 1024, color: "var(--color-warning)", percentage: 8.2 },
  { name: "Issue Detected", value: 312, color: "#f43f5e", percentage: 2.5 },
  { name: "Processing", value: 302, color: "#0ea5e9", percentage: 2.4 }
];

export const extractionConfidenceData = [
  { range: "High (90-100%)", count: 9235, percentage: 74, fill: "#10b981" },
  { range: "Medium (70-89%)", count: 2371, percentage: 19, fill: "var(--color-warning)" },
  { range: "Low (<70%)", count: 874, percentage: 7, fill: "#f43f5e" }
];

export const stateProgressData = [
  { state: "Karnataka", completion: 84, totalRecords: "482K", parcelsMapped: "405K", leadAgency: "Bhoomi / KSRSAC" },
  { state: "West Bengal", completion: 72, totalRecords: "612K", parcelsMapped: "440K", leadAgency: "Banglarbhumi / WBLR" },
  { state: "Maharashtra", completion: 67, totalRecords: "730K", parcelsMapped: "489K", leadAgency: "Mahabhulekh" },
  { state: "Odisha", completion: 61, totalRecords: "340K", parcelsMapped: "207K", leadAgency: "Bhulekh Odisha" },
  { state: "Uttar Pradesh", completion: 54, totalRecords: "1.2M", parcelsMapped: "648K", leadAgency: "Bhulekh UP" },
  { state: "Rajasthan", completion: 48, totalRecords: "510K", parcelsMapped: "244K", leadAgency: "Apna Khata" }
];

export const errorCategoriesData = [
  { category: "Area Mismatch (Doc vs GIS)", count: 98, severity: "High" },
  { category: "Faded Handwritten Porcha", count: 64, severity: "Medium" },
  { category: "Suspected Duplicate Mutation", count: 32, severity: "High" },
  { category: "Missing Registrar Seal", count: 12, severity: "Low" },
  { category: "Torn or Folded Sheet Margin", count: 8, severity: "High" }
];

export const officerPerformanceData = [
  { officer: "Officer A. Pradhan", reviewed: 142, approved: 136, avgTime: "2.4 min" },
  { officer: "Officer R. Tamang", reviewed: 98, approved: 88, avgTime: "3.1 min" },
  { officer: "Officer K. Mangar", reviewed: 88, approved: 79, avgTime: "2.8 min" }
];
