import { useState } from 'react';
import { AlertCircle, FileSpreadsheet, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileUpload } from './FileUpload';
import { DataTable } from './DataTable';
import { TitleFilter } from './TitleFilter';
import { CSVRow } from '@/types/csv';

export const CSVViewer = () => {
  const [data, setData] = useState<CSVRow[]>([]);
  const [titleFilter, setTitleFilter] = useState<string[]>([]);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleDataLoaded = (newData: CSVRow[]) => {
    setData(newData);
    setTitleFilter([]);
    setError('');
    setIsLoading(false);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setIsLoading(false);
  };

  const handleFileUploadStart = () => {
    setIsLoading(true);
    setError('');
  };

  const handleReset = () => {
    setData([]);
    setTitleFilter([]);
    setError('');
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <FileSpreadsheet className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">CSV Data Viewer</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Upload, filter, and export your CSV data with ease
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 max-w-2xl mx-auto" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {data.length === 0 ? (
          /* File Upload Section */
          <div className="mb-8">
            <FileUpload 
              onDataLoaded={handleDataLoaded}
              onError={handleError}
              isLoading={isLoading}
            />
          </div>
        ) : (
          /* Data Display Section */
          <div className="space-y-6">
            {/* Controls */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <span>Data Controls</span>
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleReset}
                    className="flex items-center space-x-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Load New File</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <TitleFilter
                  data={data}
                  value={titleFilter}
                  onChange={setTitleFilter}
                />
              </CardContent>
            </Card>

            {/* Data Table */}
            <Card>
              <CardHeader>
                <CardTitle>CSV Data</CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable data={data} titleFilter={titleFilter} />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};