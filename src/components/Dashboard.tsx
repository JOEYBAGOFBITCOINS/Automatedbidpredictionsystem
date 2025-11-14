import { TrendingUp, DollarSign, Clock, Target } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { mockDashboardData } from '../data/mockData';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface DashboardProps {
  data?: any;
}

export function Dashboard({ data }: DashboardProps) {
  const dashboardData = data?.dashboard || mockDashboardData;

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Avg Prediction Accuracy</CardTitle>
            <Target className="h-4 w-4 text-slate-600" />
          </CardHeader>
          <CardContent>
            <div className="text-slate-900">{dashboardData.avgAccuracy}%</div>
            <p className="text-xs text-slate-600">
              ±{dashboardData.accuracyStdDev}% std dev
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Auctions Analyzed</CardTitle>
            <TrendingUp className="h-4 w-4 text-slate-600" />
          </CardHeader>
          <CardContent>
            <div className="text-slate-900">{dashboardData.totalAuctions.toLocaleString()}</div>
            <p className="text-xs text-slate-600">
              +{dashboardData.recentAuctions} this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Median Sale Price</CardTitle>
            <DollarSign className="h-4 w-4 text-slate-600" />
          </CardHeader>
          <CardContent>
            <div className="text-slate-900">${dashboardData.medianPrice.toLocaleString()}</div>
            <p className="text-xs text-slate-600">
              Range: ${dashboardData.priceRange.min.toLocaleString()} - ${dashboardData.priceRange.max.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Avg Time to Close</CardTitle>
            <Clock className="h-4 w-4 text-slate-600" />
          </CardHeader>
          <CardContent>
            <div className="text-slate-900">{dashboardData.avgTimeToClose} days</div>
            <p className="text-xs text-slate-600">
              Typical auction duration
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Price Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Price Trends Over Time</CardTitle>
            <CardDescription>Monthly average sale prices</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dashboardData.priceTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{ background: '#fff', border: '1px solid #e2e8f0' }}
                  formatter={(value: any) => [`$${value.toLocaleString()}`, 'Price']}
                />
                <Line type="monotone" dataKey="avgPrice" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
            <CardDescription>Distribution across vehicle types</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dashboardData.categoryDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="category" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{ background: '#fff', border: '1px solid #e2e8f0' }}
                  formatter={(value: any) => [value, 'Sales']}
                />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Model Performance */}
      <Card>
        <CardHeader>
          <CardTitle>ML Model Performance</CardTitle>
          <CardDescription>Prediction accuracy metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="text-sm text-slate-600">Mean Absolute Error</p>
              <p className="text-slate-900 mt-1">${dashboardData.modelMetrics.mae.toLocaleString()}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="text-sm text-slate-600">R² Score</p>
              <p className="text-slate-900 mt-1">{dashboardData.modelMetrics.r2}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="text-sm text-slate-600">RMSE</p>
              <p className="text-slate-900 mt-1">${dashboardData.modelMetrics.rmse.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Predictions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Predictions</CardTitle>
          <CardDescription>Latest auction price predictions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dashboardData.recentPredictions.map((prediction: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div className="flex-1">
                  <p className="text-slate-900">{prediction.title}</p>
                  <p className="text-sm text-slate-600 mt-1">{prediction.year} • {prediction.mileage.toLocaleString()} miles</p>
                </div>
                <div className="text-right">
                  <p className="text-slate-900">${prediction.predicted.toLocaleString()}</p>
                  <p className="text-xs text-slate-600">±${prediction.confidence.toLocaleString()}</p>
                </div>
                {prediction.actual && (
                  <div className="ml-4 text-right">
                    <p className="text-sm text-slate-600">Actual</p>
                    <p className={`${Math.abs(prediction.actual - prediction.predicted) < prediction.confidence ? 'text-green-600' : 'text-amber-600'}`}>
                      ${prediction.actual.toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
