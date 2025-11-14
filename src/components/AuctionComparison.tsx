import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Search, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { mockComparables } from '../data/mockData';

interface AuctionComparisonProps {
  data?: any;
}

export function AuctionComparison({ data }: AuctionComparisonProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAuctions, setSelectedAuctions] = useState<number[]>([]);
  
  const comparables = data?.comparables || mockComparables;

  const filteredAuctions = comparables.filter((auction: any) =>
    auction.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    auction.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
    auction.model.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSelection = (id: number) => {
    setSelectedAuctions((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id].slice(0, 3)
    );
  };

  const selectedData = comparables.filter((a: any) => selectedAuctions.includes(a.id));

  const calculatePriceChange = (predicted: number, actual: number) => {
    const change = ((actual - predicted) / predicted) * 100;
    return change.toFixed(1);
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Search Auctions</CardTitle>
          <CardDescription>Find and compare similar vehicles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search by make, model, or title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          {selectedAuctions.length > 0 && (
            <p className="text-sm text-slate-600 mt-2">
              {selectedAuctions.length} of 3 auctions selected for comparison
            </p>
          )}
        </CardContent>
      </Card>

      {/* Comparison Table */}
      {selectedData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Side-by-Side Comparison</CardTitle>
            <CardDescription>Compare selected auctions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-sm text-slate-600">Attribute</th>
                    {selectedData.map((auction: any) => (
                      <th key={auction.id} className="text-left py-3 px-4 text-sm text-slate-600">
                        Vehicle {selectedAuctions.indexOf(auction.id) + 1}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="py-3 px-4 text-sm text-slate-600">Title</td>
                    {selectedData.map((auction: any) => (
                      <td key={auction.id} className="py-3 px-4 text-sm text-slate-900">
                        {auction.title}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-3 px-4 text-sm text-slate-600">Year</td>
                    {selectedData.map((auction: any) => (
                      <td key={auction.id} className="py-3 px-4 text-sm text-slate-900">
                        {auction.year}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-3 px-4 text-sm text-slate-600">Mileage</td>
                    {selectedData.map((auction: any) => (
                      <td key={auction.id} className="py-3 px-4 text-sm text-slate-900">
                        {auction.mileage.toLocaleString()} mi
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-3 px-4 text-sm text-slate-600">Condition</td>
                    {selectedData.map((auction: any) => (
                      <td key={auction.id} className="py-3 px-4">
                        <Badge variant={auction.condition === 'Excellent' ? 'default' : 'secondary'}>
                          {auction.condition}
                        </Badge>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-3 px-4 text-sm text-slate-600">Predicted Price</td>
                    {selectedData.map((auction: any) => (
                      <td key={auction.id} className="py-3 px-4 text-sm text-slate-900">
                        ${auction.predictedPrice.toLocaleString()}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-3 px-4 text-sm text-slate-600">Actual Price</td>
                    {selectedData.map((auction: any) => (
                      <td key={auction.id} className="py-3 px-4 text-slate-900">
                        ${auction.actualPrice.toLocaleString()}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-3 px-4 text-sm text-slate-600">Accuracy</td>
                    {selectedData.map((auction: any) => {
                      const change = parseFloat(calculatePriceChange(auction.predictedPrice, auction.actualPrice));
                      return (
                        <td key={auction.id} className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            {change > 2 ? (
                              <TrendingUp className="w-4 h-4 text-red-600" />
                            ) : change < -2 ? (
                              <TrendingDown className="w-4 h-4 text-green-600" />
                            ) : (
                              <Minus className="w-4 h-4 text-slate-400" />
                            )}
                            <span className={`text-sm ${
                              Math.abs(change) < 5 ? 'text-green-600' : 'text-amber-600'
                            }`}>
                              {change > 0 ? '+' : ''}{change}%
                            </span>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-sm text-slate-600">Seller Rating</td>
                    {selectedData.map((auction: any) => (
                      <td key={auction.id} className="py-3 px-4 text-sm text-slate-900">
                        {auction.sellerRating}/100
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Auction List */}
      <Card>
        <CardHeader>
          <CardTitle>Available Auctions</CardTitle>
          <CardDescription>Click to select auctions for comparison (max 3)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredAuctions.map((auction: any) => {
              const isSelected = selectedAuctions.includes(auction.id);
              const priceChange = calculatePriceChange(auction.predictedPrice, auction.actualPrice);
              const changeNum = parseFloat(priceChange);
              
              return (
                <div
                  key={auction.id}
                  onClick={() => toggleSelection(auction.id)}
                  className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-slate-900">{auction.title}</h4>
                        {isSelected && (
                          <Badge variant="default" className="text-xs">Selected</Badge>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 mt-1">
                        {auction.year} • {auction.mileage.toLocaleString()} miles • {auction.condition}
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        <div>
                          <p className="text-xs text-slate-600">Predicted</p>
                          <p className="text-sm text-slate-900">${auction.predictedPrice.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-600">Actual</p>
                          <p className="text-sm text-slate-900">${auction.actualPrice.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-600">Difference</p>
                          <p className={`text-sm ${Math.abs(changeNum) < 5 ? 'text-green-600' : 'text-amber-600'}`}>
                            {changeNum > 0 ? '+' : ''}{priceChange}%
                          </p>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant={isSelected ? 'default' : 'outline'}
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSelection(auction.id);
                      }}
                    >
                      {isSelected ? 'Selected' : 'Compare'}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
