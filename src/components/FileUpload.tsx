import { useCallback } from 'react';
import { Upload, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { parseCSVFile } from '@/utils/csvUtils';
import { CSVRow } from '@/types/csv';

interface FileUploadProps {
  onDataLoaded: (data: CSVRow[]) => void;
  onError: (error: string) => void;
  isLoading: boolean;
}

export const FileUpload = ({ onDataLoaded, onError, isLoading }: FileUploadProps) => {
  const handleFileSelect = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    if (!file.name.toLowerCase().endsWith('.csv')) {
      onError('Please select a CSV file');
      return;
    }
    
    try {
      const data = await parseCSVFile(file);
      onDataLoaded(data);
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Failed to load CSV file');
    }
  }, [onDataLoaded, onError]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className="upload-zone"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className="flex flex-col items-center space-y-4">
          <div className="p-4 rounded-full bg-primary/10">
            {isLoading ? (
              <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
            ) : (
              <FileSpreadsheet className="w-8 h-8 text-primary" />
            )}
          </div>
          
          <div className="text-center">
            <h3 className="text-lg font-medium text-foreground mb-2">
              {isLoading ? 'Processing CSV file...' : 'Upload CSV File'}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Drag and drop your CSV file here, or click to browse
            </p>
          </div>
          
          <Button
            variant="outline"
            disabled={isLoading}
            onClick={() => document.getElementById('file-input')?.click()}
            className="flex items-center space-x-2"
          >
            <Upload className="w-4 h-4" />
            <span>Choose File</span>
          </Button>
          
          <input
            id="file-input"
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files)}
            disabled={isLoading}
          />
        </div>
      </div>
    </div>
  );
};