import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Calculator, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

interface PredictionInterfaceProps {
  data?: any;
}

interface PredictionResult {
  expectedFinalPrice: number;
  minimumWinningBid: number;
  maximumRationalBid: number;
  confidenceInterval: {
    lower: number;
    upper: number;
  };
  comparables: Array<{
    title: string;
    soldPrice: number;
    similarity: number;
  }>;
}

export function PredictionInterface({ data }: PredictionInterfaceProps) {
  const [formData, setFormData] = useState({
    title: '',
    year: '',
    make: '',
    model: '',
    mileage: '',
    condition: 'good',
    category: 'sports',
    description: '',
    sellerRating: '',
    daysToClose: '7',
  });

  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const calculatePrediction = () => {
    setIsCalculating(true);

    // Simulate calculation delay
    setTimeout(() => {
      // Mock prediction algorithm
      const basePrice = parseInt(formData.year) > 2015 ? 80000 : 45000;
      const mileageAdjustment = Math.max(0, 20000 - (parseInt(formData.mileage) / 1000) * 100);
      const conditionMultiplier = formData.condition === 'excellent' ? 1.2 : formData.condition === 'good' ? 1.0 : 0.8;
      
      const expectedPrice = Math.round((basePrice + mileageAdjustment) * conditionMultiplier);
      const confidence = Math.round(expectedPrice * 0.15);

      const result: PredictionResult = {
        expectedFinalPrice: expectedPrice,
        minimumWinningBid: Math.round(expectedPrice * 0.92),
        maximumRationalBid: Math.round(expectedPrice * 1.08),
        confidenceInterval: {
          lower: expectedPrice - confidence,
          upper: expectedPrice + confidence,
        },
        comparables: [
          { title: `${formData.year} ${formData.make} ${formData.model} - Similar`, soldPrice: expectedPrice - 3500, similarity: 0.94 },
          { title: `${parseInt(formData.year) - 1} ${formData.make} ${formData.model} - Previous Year`, soldPrice: expectedPrice - 8000, similarity: 0.89 },
          { title: `${formData.year} ${formData.make} Alternative Model`, soldPrice: expectedPrice + 2000, similarity: 0.87 },
        ],
      };

      setPrediction(result);
      setIsCalculating(false);
    }, 1500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Input Form */}
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Details</CardTitle>
          <CardDescription>Enter auction item information for price prediction</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Auction Title</Label>
            <Input
              id="title"
              placeholder="e.g., 1967 Porsche 911S"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                type="number"
                placeholder="2020"
                value={formData.year}
                onChange={(e) => handleInputChange('year', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mileage">Mileage</Label>
              <Input
                id="mileage"
                type="number"
                placeholder="25000"
                value={formData.mileage}
                onChange={(e) => handleInputChange('mileage', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="make">Make</Label>
              <Input
                id="make"
                placeholder="Porsche"
                value={formData.make}
                onChange={(e) => handleInputChange('make', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                placeholder="911"
                value={formData.model}
                onChange={(e) => handleInputChange('model', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="condition">Condition</Label>
            <Select value={formData.condition} onValueChange={(value) => handleInputChange('condition', value)}>
              <SelectTrigger id="condition">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="excellent">Excellent</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="fair">Fair</SelectItem>
                <SelectItem value="poor">Poor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
              <SelectTrigger id="category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sports">Sports Car</SelectItem>
                <SelectItem value="classic">Classic</SelectItem>
                <SelectItem value="luxury">Luxury</SelectItem>
                <SelectItem value="exotic">Exotic</SelectItem>
                <SelectItem value="muscle">Muscle Car</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sellerRating">Seller Rating (0-100)</Label>
              <Input
                id="sellerRating"
                type="number"
                placeholder="95"
                value={formData.sellerRating}
                onChange={(e) => handleInputChange('sellerRating', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="daysToClose">Days to Close</Label>
              <Input
                id="daysToClose"
                type="number"
                placeholder="7"
                value={formData.daysToClose}
                onChange={(e) => handleInputChange('daysToClose', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Enter any additional details about condition, modifications, service history..."
              rows={3}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
            />
          </div>

          <Button 
            onClick={calculatePrediction}
            disabled={!formData.year || !formData.make || !formData.mileage || isCalculating}
            className="w-full"
          >
            <Calculator className="w-4 h-4 mr-2" />
            {isCalculating ? 'Calculating...' : 'Generate Prediction'}
          </Button>
        </CardContent>
      </Card>

      {/* Prediction Results */}
      <div className="space-y-6">
        {prediction ? (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Price Prediction</CardTitle>
                <CardDescription>Expected auction results with confidence intervals</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-900 mb-2">Expected Final Price</p>
                  <p className="text-blue-900">${prediction.expectedFinalPrice.toLocaleString()}</p>
                  <p className="text-xs text-blue-700 mt-2">
                    95% CI: ${prediction.confidenceInterval.lower.toLocaleString()} - ${prediction.confidenceInterval.upper.toLocaleString()}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-sm text-slate-600 mb-2">Minimum Winning Bid</p>
                    <p className="text-slate-900">${prediction.minimumWinningBid.toLocaleString()}</p>
                    <p className="text-xs text-slate-600 mt-1">Likely to win</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-sm text-slate-600 mb-2">Maximum Rational Bid</p>
                    <p className="text-slate-900">${prediction.maximumRationalBid.toLocaleString()}</p>
                    <p className="text-xs text-slate-600 mt-1">Avoid overpaying</p>
                  </div>
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    This prediction is based on historical data and market trends. Actual results may vary based on bidding competition and market conditions.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Comparable Sales</CardTitle>
                <CardDescription>Similar vehicles from recent auctions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {prediction.comparables.map((comp, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm text-slate-900">{comp.title}</p>
                        <p className="text-xs text-slate-600 mt-1">
                          {Math.round(comp.similarity * 100)}% similar
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-900">${comp.soldPrice.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Calculator className="w-12 h-12 text-slate-400 mb-4" />
              <p className="text-slate-600 text-center">
                Enter vehicle details and click "Generate Prediction" to see results
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
