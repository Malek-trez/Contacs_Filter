export interface CSVRow {
  "First Name": string;
  "Last Name": string;
  "Title": string;
  "Company": string;
  "Company Name for Emails": string;
  "Email": string;
  "Email Status": string;
  "Primary Email Source": string;
}

export type SortField = keyof CSVRow;
export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}