import { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { PredictionInterface } from './components/PredictionInterface';
import { MarketTrends } from './components/MarketTrends';
import { AuctionComparison } from './components/AuctionComparison';
import { DataUpload } from './components/DataUpload';
import { BarChart3, TrendingUp, GitCompare, Upload, Home } from 'lucide-react';

type View = 'dashboard' | 'predict' | 'trends' | 'compare' | 'upload';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [uploadedData, setUploadedData] = useState<any>(null);

  const navItems = [
    { id: 'dashboard' as View, label: 'Dashboard', icon: Home },
    { id: 'predict' as View, label: 'Price Prediction', icon: BarChart3 },
    { id: 'trends' as View, label: 'Market Trends', icon: TrendingUp },
    { id: 'compare' as View, label: 'Comparisons', icon: GitCompare },
    { id: 'upload' as View, label: 'Upload Data', icon: Upload },
  ];

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard data={uploadedData} />;
      case 'predict':
        return <PredictionInterface data={uploadedData} />;
      case 'trends':
        return <MarketTrends data={uploadedData} />;
      case 'compare':
        return <AuctionComparison data={uploadedData} />;
      case 'upload':
        return <DataUpload onDataUploaded={setUploadedData} />;
      default:
        return <Dashboard data={uploadedData} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-slate-900">Bring a Trailer Auction Analysis</h1>
              <p className="text-slate-600 text-sm mt-1">
                Automated Bid Prediction Research Platform
              </p>
            </div>
            <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
              <p className="text-blue-900 text-sm">Research Mode</p>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-colors ${
                    isActive
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderView()}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-slate-600 text-sm text-center">
            Academic Research Tool • Not for commercial use • Data processed locally
          </p>
        </div>
      </footer>
    </div>
  );
}
