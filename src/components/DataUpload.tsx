import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Upload, FileJson, Check, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

interface DataUploadProps {
  onDataUploaded: (data: any) => void;
}

export function DataUpload({ onDataUploaded }: DataUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<{
    parsed?: boolean;
    comps?: boolean;
    prediction?: boolean;
  }>({});
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (fileType: 'parsed' | 'comps' | 'prediction', event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);

    try {
      const text = await file.text();
      const jsonData = JSON.parse(text);

      setUploadedFiles((prev) => ({ ...prev, [fileType]: true }));
      onDataUploaded({ [fileType]: jsonData });
    } catch (err) {
      setError(`Failed to parse ${fileType} file. Please ensure it's valid JSON.`);
    }
  };

  const handleSampleData = () => {
    setUploadedFiles({
      parsed: true,
      comps: true,
      prediction: true,
    });
    onDataUploaded({
      sample: true,
      message: 'Using sample data from Bring a Trailer analysis',
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload Analysis Data</CardTitle>
          <CardDescription>
            Upload JSON files generated from the Python pipeline (auto_bidder.py)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* File Upload Sections */}
          <div className="space-y-4">
            {/* Parsed Data */}
            <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 hover:border-slate-300 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <FileJson className="w-5 h-5 text-slate-600" />
                  <h4 className="text-slate-900">parsed_data.json</h4>
                </div>
                {uploadedFiles.parsed && (
                  <Check className="w-5 h-5 text-green-600" />
                )}
              </div>
              <p className="text-sm text-slate-600 mb-3">
                Scraped auction data including titles, descriptions, prices, and metadata
              </p>
              <label htmlFor="parsed-upload">
                <Button variant="outline" size="sm" asChild>
                  <span>
                    <Upload className="w-4 h-4 mr-2" />
                    {uploadedFiles.parsed ? 'Re-upload' : 'Upload File'}
                  </span>
                </Button>
              </label>
              <input
                id="parsed-upload"
                type="file"
                accept=".json"
                onChange={(e) => handleFileUpload('parsed', e)}
                className="hidden"
              />
            </div>

            {/* Comparables Data */}
            <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 hover:border-slate-300 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <FileJson className="w-5 h-5 text-slate-600" />
                  <h4 className="text-slate-900">comps.json</h4>
                </div>
                {uploadedFiles.comps && (
                  <Check className="w-5 h-5 text-green-600" />
                )}
              </div>
              <p className="text-sm text-slate-600 mb-3">
                Historical and live market data from comparable auctions
              </p>
              <label htmlFor="comps-upload">
                <Button variant="outline" size="sm" asChild>
                  <span>
                    <Upload className="w-4 h-4 mr-2" />
                    {uploadedFiles.comps ? 'Re-upload' : 'Upload File'}
                  </span>
                </Button>
              </label>
              <input
                id="comps-upload"
                type="file"
                accept=".json"
                onChange={(e) => handleFileUpload('comps', e)}
                className="hidden"
              />
            </div>

            {/* Prediction Data */}
            <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 hover:border-slate-300 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <FileJson className="w-5 h-5 text-slate-600" />
                  <h4 className="text-slate-900">prediction.json</h4>
                </div>
                {uploadedFiles.prediction && (
                  <Check className="w-5 h-5 text-green-600" />
                )}
              </div>
              <p className="text-sm text-slate-600 mb-3">
                ML model predictions with confidence intervals and recommendations
              </p>
              <label htmlFor="prediction-upload">
                <Button variant="outline" size="sm" asChild>
                  <span>
                    <Upload className="w-4 h-4 mr-2" />
                    {uploadedFiles.prediction ? 'Re-upload' : 'Upload File'}
                  </span>
                </Button>
              </label>
              <input
                id="prediction-upload"
                type="file"
                accept=".json"
                onChange={(e) => handleFileUpload('prediction', e)}
                className="hidden"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-slate-200">
            <div className="flex-1">
              <p className="text-sm text-slate-600">
                Don't have data files yet? Load sample data to explore the dashboard.
              </p>
            </div>
            <Button onClick={handleSampleData} variant="default">
              Load Sample Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Python Pipeline Instructions</CardTitle>
          <CardDescription>How to generate the JSON files</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-slate-900 mb-2">1. Run the automated bid prediction script:</p>
            <div className="bg-slate-900 text-slate-100 p-3 rounded font-mono text-sm">
              python auto_bidder.py https://bringatrailer.com/listing/xxxxx
            </div>
          </div>

          <div>
            <p className="text-sm text-slate-900 mb-2">2. The script will generate three JSON files:</p>
            <ul className="text-sm text-slate-600 space-y-1 ml-4">
              <li>• <code className="bg-slate-100 px-1 py-0.5 rounded text-xs">parsed_data.json</code> - Scraped auction data</li>
              <li>• <code className="bg-slate-100 px-1 py-0.5 rounded text-xs">comps.json</code> - Market comparables</li>
              <li>• <code className="bg-slate-100 px-1 py-0.5 rounded text-xs">prediction.json</code> - Price predictions</li>
            </ul>
          </div>

          <div>
            <p className="text-sm text-slate-900 mb-2">3. Upload each file to this dashboard for visualization</p>
            <p className="text-sm text-slate-600">
              The dashboard will automatically parse and display the data in charts, tables, and prediction interfaces.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Expected JSON Format */}
      <Card>
        <CardHeader>
          <CardTitle>Expected JSON Format</CardTitle>
          <CardDescription>Sample structure for each file type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-slate-900 mb-2">parsed_data.json:</p>
              <pre className="bg-slate-900 text-slate-100 p-3 rounded text-xs overflow-x-auto">
{`{
  "title": "1967 Porsche 911S",
  "year": 1967,
  "make": "Porsche",
  "model": "911S",
  "mileage": 45000,
  "condition": "Excellent",
  "description": "...",
  "sellerRating": 98,
  "currentBid": 85000,
  "bidHistory": [...],
  "timeToClose": "2024-11-20T18:00:00Z"
}`}
              </pre>
            </div>

            <div>
              <p className="text-sm text-slate-900 mb-2">prediction.json:</p>
              <pre className="bg-slate-900 text-slate-100 p-3 rounded text-xs overflow-x-auto">
{`{
  "expectedFinalPrice": 92500,
  "minimumWinningBid": 88000,
  "maximumRationalBid": 95000,
  "confidenceInterval": {
    "lower": 85000,
    "upper": 100000
  }
}`}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
