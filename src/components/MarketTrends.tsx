import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ScatterChart, Scatter } from 'recharts';
import { mockMarketTrends } from '../data/mockData';

interface MarketTrendsProps {
  data?: any;
}

export function MarketTrends({ data }: MarketTrendsProps) {
  const [selectedMake, setSelectedMake] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const trendsData = data?.trends || mockMarketTrends;

  const filteredData = selectedMake === 'all' 
    ? trendsData.priceByMake 
    : trendsData.priceByMake.filter((item: any) => item.make === selectedMake);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Market Filters</CardTitle>
          <CardDescription>Filter trends by vehicle characteristics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-slate-600">Make</label>
              <Select value={selectedMake} onValueChange={setSelectedMake}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Makes</SelectItem>
                  <SelectItem value="Porsche">Porsche</SelectItem>
                  <SelectItem value="Ferrari">Ferrari</SelectItem>
                  <SelectItem value="BMW">BMW</SelectItem>
                  <SelectItem value="Mercedes">Mercedes</SelectItem>
                  <SelectItem value="Audi">Audi</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-600">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="sports">Sports Car</SelectItem>
                  <SelectItem value="classic">Classic</SelectItem>
                  <SelectItem value="luxury">Luxury</SelectItem>
                  <SelectItem value="exotic">Exotic</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Price Trends by Year */}
      <Card>
        <CardHeader>
          <CardTitle>Historical Price Trends</CardTitle>
          <CardDescription>Average sale prices over the last 12 months</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={trendsData.historicalPrices}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" tickFormatter={(value) => `$${value / 1000}k`} />
              <Tooltip
                contentStyle={{ background: '#fff', border: '1px solid #e2e8f0' }}
                formatter={(value: any) => [`$${value.toLocaleString()}`, 'Avg Price']}
              />
              <Legend />
              <Line type="monotone" dataKey="avgPrice" stroke="#3b82f6" strokeWidth={2} name="Average Price" />
              <Line type="monotone" dataKey="medianPrice" stroke="#8b5cf6" strokeWidth={2} name="Median Price" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Price by Make */}
      <Card>
        <CardHeader>
          <CardTitle>Average Price by Make</CardTitle>
          <CardDescription>Comparison across different manufacturers</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="make" stroke="#64748b" />
              <YAxis stroke="#64748b" tickFormatter={(value) => `$${value / 1000}k`} />
              <Tooltip
                contentStyle={{ background: '#fff', border: '1px solid #e2e8f0' }}
                formatter={(value: any) => [`$${value.toLocaleString()}`, 'Avg Price']}
              />
              <Bar dataKey="avgPrice" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Price vs Mileage Correlation */}
      <Card>
        <CardHeader>
          <CardTitle>Price vs Mileage Analysis</CardTitle>
          <CardDescription>Relationship between mileage and sale price</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="mileage" 
                name="Mileage" 
                stroke="#64748b"
                tickFormatter={(value) => `${value / 1000}k`}
              />
              <YAxis 
                dataKey="price" 
                name="Price" 
                stroke="#64748b"
                tickFormatter={(value) => `$${value / 1000}k`}
              />
              <Tooltip
                contentStyle={{ background: '#fff', border: '1px solid #e2e8f0' }}
                cursor={{ strokeDasharray: '3 3' }}
                formatter={(value: any, name: string) => {
                  if (name === 'Mileage') return [`${value.toLocaleString()} miles`, 'Mileage'];
                  return [`$${value.toLocaleString()}`, 'Price'];
                }}
              />
              <Scatter name="Vehicles" data={trendsData.priceVsMileage} fill="#3b82f6" />
            </ScatterChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Market Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top Appreciating Make</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-900">{trendsData.insights.topAppreciating}</p>
            <p className="text-sm text-green-600 mt-1">+{trendsData.insights.appreciationRate}% YoY</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Most Active Category</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-900">{trendsData.insights.mostActive}</p>
            <p className="text-sm text-slate-600 mt-1">{trendsData.insights.activeCount} sales this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Avg Days on Market</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-900">{trendsData.insights.avgDaysOnMarket} days</p>
            <p className="text-sm text-slate-600 mt-1">Median auction duration</p>
          </CardContent>
        </Card>
      </div>

      {/* Year Range Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Price Distribution by Vehicle Year</CardTitle>
          <CardDescription>Average prices across different model years</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={trendsData.priceByYear}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="yearRange" stroke="#64748b" />
              <YAxis stroke="#64748b" tickFormatter={(value) => `$${value / 1000}k`} />
              <Tooltip
                contentStyle={{ background: '#fff', border: '1px solid #e2e8f0' }}
                formatter={(value: any) => [`$${value.toLocaleString()}`, 'Avg Price']}
              />
              <Bar dataKey="avgPrice" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
