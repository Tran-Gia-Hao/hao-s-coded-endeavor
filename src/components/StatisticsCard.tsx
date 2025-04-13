
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface StatisticsCardProps {
  title: string;
  value: string | number;
  change?: string;
  chartData?: any[];
  chartType?: 'area' | 'bar';
  chartColor?: string;
  icon?: React.ReactNode;
}

const StatisticsCard: React.FC<StatisticsCardProps> = ({
  title,
  value,
  change,
  chartData,
  chartType = 'area',
  chartColor = '#FF9F43',
  icon
}) => {
  const isPositiveChange = change && change.startsWith('+');
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <p className={`text-xs ${isPositiveChange ? 'text-green-500' : 'text-red-500'}`}>
            {change} from previous period
          </p>
        )}
        
        {chartData && chartData.length > 0 && (
          <div className="h-24 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'area' ? (
                <AreaChart
                  data={chartData}
                  margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id={`color${title}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={chartColor} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={chartColor} stopOpacity={0.2}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis hide={true} />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke={chartColor} 
                    fillOpacity={1} 
                    fill={`url(#color${title})`} 
                  />
                </AreaChart>
              ) : (
                <BarChart
                  data={chartData}
                  margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis hide={true} />
                  <Tooltip />
                  <Bar dataKey="value" fill={chartColor} radius={[4, 4, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatisticsCard;
