import { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { CSVRow, SortField, SortDirection, SortConfig } from '@/types/csv';
import { exportToCSV } from '@/utils/csvUtils';

interface DataTableProps {
  data: CSVRow[];
  titleFilter: string[];
}

export const DataTable = ({ data, titleFilter }: DataTableProps) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ field: 'First Name', direction: 'asc' });
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  const columns: { key: SortField; label: string }[] = [
    { key: 'First Name', label: 'First Name' },
    { key: 'Last Name', label: 'Last Name' },
    { key: 'Title', label: 'Title' },
    { key: 'Company', label: 'Company' },
    { key: 'Company Name for Emails', label: 'Company Name for Emails' },
    { key: 'Email', label: 'Email' },
    { key: 'Email Status', label: 'Email Status' },
    { key: 'Primary Email Source', label: 'Primary Email Source' },
  ];

  const filteredAndSortedData = useMemo(() => {
    let filtered = data;
    
    // Apply title filter
    if (titleFilter.length > 0) {
      filtered = data.filter(row => titleFilter.includes(row.Title));
    }
    
    // Apply sorting
    return [...filtered].sort((a, b) => {
      const aVal = a[sortConfig.field]?.toString() || '';
      const bVal = b[sortConfig.field]?.toString() || '';
      
      const comparison = aVal.localeCompare(bVal);
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }, [data, titleFilter, sortConfig]);

  const handleSort = (field: SortField) => {
    setSortConfig(current => ({
      field,
      direction: current.field === field && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSelectRow = (index: number) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedRows(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedRows.size === filteredAndSortedData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(filteredAndSortedData.map((_, index) => index)));
    }
  };

  const handleExportSelected = () => {
    const selectedData = filteredAndSortedData.filter((_, index) => selectedRows.has(index));
    if (selectedData.length === 0) {
      alert('Please select rows to export');
      return;
    }
    exportToCSV(selectedData, `export_${new Date().toISOString().slice(0, 10)}.csv`);
  };

  const getSortIcon = (field: SortField) => {
    if (sortConfig.field !== field) {
      return <div className="w-4 h-4" />;
    }
    return sortConfig.direction === 'asc' ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

  return (
    <div className="space-y-4">
      {/* Header with controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSelectAll}
            className="flex items-center space-x-2"
          >
            <Checkbox 
              checked={selectedRows.size === filteredAndSortedData.length && filteredAndSortedData.length > 0}
              onCheckedChange={handleSelectAll}
            />
            <span>Select All ({selectedRows.size})</span>
          </Button>
          
          <span className="text-sm text-muted-foreground">
            Showing {filteredAndSortedData.length} of {data.length} rows
          </span>
        </div>

        <Button
          onClick={handleExportSelected}
          disabled={selectedRows.size === 0}
          className="flex items-center space-x-2"
        >
          <Download className="w-4 h-4" />
          <span>Export Selected</span>
        </Button>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="w-full">
          <thead>
            <tr className="table-header">
              <th className="w-12 px-4 py-3 text-left">
                <span className="sr-only">Select</span>
              </th>
              {columns.map(({ key, label }) => (
                <th key={key} className="px-4 py-3 text-left">
                  <button
                    className="flex items-center space-x-1 hover:text-primary transition-colors"
                    onClick={() => handleSort(key)}
                  >
                    <span className="truncate">{label}</span>
                    {getSortIcon(key)}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedData.map((row, index) => (
              <tr
                key={index}
                className={`table-row ${selectedRows.has(index) ? 'selected' : ''}`}
              >
                <td className="px-4 py-3">
                  <Checkbox
                    checked={selectedRows.has(index)}
                    onCheckedChange={() => handleSelectRow(index)}
                  />
                </td>
                {columns.map(({ key }) => (
                  <td key={key} className="px-4 py-3 text-sm">
                    <div className="truncate max-w-xs" title={row[key]}>
                      {row[key] || '-'}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredAndSortedData.length === 0 && (
        <div className="text-center py-12">
          {titleFilter.length > 0 ? (
            <p className="text-muted-foreground">No rows match the selected filters</p>
          ) : (
            <p className="text-muted-foreground">No data available</p>
          )}
        </div>
      )}
    </div>
  );
};