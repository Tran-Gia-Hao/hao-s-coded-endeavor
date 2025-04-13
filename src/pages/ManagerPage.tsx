
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Users, DollarSign, UtensilsCrossed, BarChart3, FileText } from 'lucide-react';
import StatisticsCard from '@/components/StatisticsCard';
import FilterBar from '@/components/FilterBar';
import OrderCard from '@/components/OrderCard';
import OrderDetail from '@/components/OrderDetail';
import { mockOrders, mockDailySummary, mockWeeklyData } from '@/data/mockData';
import { Order, OrderStatus } from '@/models/types';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area 
} from 'recharts';

const ManagerPage = () => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [tableFilter, setTableFilter] = useState<number | null>(null);
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('day');

  const filteredOrders = orders
    .filter(order => {
      // Search term filter
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        order.id.toLowerCase().includes(searchLower) || 
        order.tableNumber.toString().includes(searchLower);

      // Status filter
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

      // Table filter
      const matchesTable = tableFilter === null || order.tableNumber === tableFilter;

      return matchesSearch && matchesStatus && matchesTable;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
  };

  // Mock statistics based on time range
  const getStatistics = () => {
    let multiplier = 1;
    if (timeRange === 'week') multiplier = 7;
    if (timeRange === 'month') multiplier = 30;
    
    return {
      totalOrders: mockDailySummary.totalOrders * multiplier,
      totalRevenue: mockDailySummary.totalRevenue * multiplier,
      averageOrderValue: mockDailySummary.averageOrderValue,
      customerCount: Math.round(mockDailySummary.totalOrders * 0.8 * multiplier)
    };
  };

  const statistics = getStatistics();

  // Chart configurations
  const COLORS = ['#FF9F43', '#1E3A8A', '#FFBC80', '#36B37E'];

  // Order status distribution
  const statusDistribution = [
    { name: 'Pending', value: orders.filter(o => o.status === 'pending').length },
    { name: 'Cooking', value: orders.filter(o => o.status === 'cooking').length },
    { name: 'Ready', value: orders.filter(o => o.status === 'ready').length },
    { name: 'Served', value: orders.filter(o => o.status === 'served').length },
    { name: 'Paid', value: orders.filter(o => o.status === 'paid').length }
  ];

  // Popular items chart
  const popularItems = mockDailySummary.popularItems.map(item => ({
    name: item.name,
    value: item.count
  }));

  const chartData = mockWeeklyData;

  return (
    <div className="min-h-screen bg-restaurant-light">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-restaurant-secondary flex items-center">
              <BarChart3 className="mr-2 h-5 w-5" />
              Manager Dashboard
            </h1>
            <Button variant="outline" size="sm">
              <FileText className="mr-1 h-4 w-4" /> Export
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-wrap items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Dashboard Overview</h2>
          <div className="flex space-x-2 mt-2 sm:mt-0">
            <Button 
              variant={timeRange === 'day' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setTimeRange('day')}
              className={timeRange === 'day' ? 'button-primary' : ''}
            >
              Today
            </Button>
            <Button 
              variant={timeRange === 'week' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setTimeRange('week')}
              className={timeRange === 'week' ? 'button-primary' : ''}
            >
              This Week
            </Button>
            <Button 
              variant={timeRange === 'month' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setTimeRange('month')}
              className={timeRange === 'month' ? 'button-primary' : ''}
            >
              This Month
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatisticsCard
            title="Total Orders"
            value={statistics.totalOrders}
            change="+5.2%"
            icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
            chartData={chartData.labels.map((label, i) => ({ name: label, value: chartData.orders[i] }))}
          />
          <StatisticsCard
            title="Total Revenue"
            value={`$${statistics.totalRevenue.toFixed(2)}`}
            change="+8.4%"
            icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
            chartData={chartData.labels.map((label, i) => ({ name: label, value: chartData.revenue[i] }))}
            chartColor="#1E3A8A"
          />
          <StatisticsCard
            title="Avg. Order Value"
            value={`$${statistics.averageOrderValue.toFixed(2)}`}
            change="+2.1%"
            icon={<UtensilsCrossed className="h-4 w-4 text-muted-foreground" />}
            chartType="bar"
            chartData={chartData.labels.map((label, i) => ({ 
              name: label, 
              value: chartData.revenue[i] / chartData.orders[i] 
            }))}
            chartColor="#FF9F43"
          />
          <StatisticsCard
            title="Customers Served"
            value={statistics.customerCount}
            change="+3.8%"
            icon={<Users className="h-4 w-4 text-muted-foreground" />}
            chartType="bar"
            chartData={chartData.labels.map((label, i) => ({ 
              name: label, 
              value: Math.round(chartData.orders[i] * 0.8) 
            }))}
            chartColor="#36B37E"
          />
        </div>
        
        <Tabs defaultValue="charts" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="charts">
              <BarChart3 className="mr-2 h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="orders">
              <FileText className="mr-2 h-4 w-4" />
              Recent Orders
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="charts" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Revenue Trend</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={chartData.labels.map((label, i) => ({ 
                          name: label, 
                          revenue: chartData.revenue[i],
                        }))}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Area 
                          type="monotone" 
                          dataKey="revenue" 
                          name="Revenue ($)" 
                          stroke="#FF9F43" 
                          fill="#FFE5CF" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Order Status Distribution</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-80 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {statusDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Orders vs Sales</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={chartData.labels.map((label, i) => ({ 
                          name: label, 
                          orders: chartData.orders[i],
                          sales: chartData.revenue[i]
                        }))}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis yAxisId="left" orientation="left" stroke="#1E3A8A" />
                        <YAxis yAxisId="right" orientation="right" stroke="#FF9F43" />
                        <Tooltip />
                        <Legend />
                        <Line
                          yAxisId="left"
                          type="monotone"
                          dataKey="orders"
                          name="Orders"
                          stroke="#1E3A8A"
                          activeDot={{ r: 8 }}
                        />
                        <Line 
                          yAxisId="right" 
                          type="monotone" 
                          dataKey="sales" 
                          name="Sales ($)" 
                          stroke="#FF9F43" 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Most Popular Items</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={popularItems}
                        layout="vertical"
                        margin={{ top: 20, right: 30, left: 50, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="name" />
                        <Tooltip />
                        <Legend />
                        <Bar 
                          dataKey="value" 
                          name="Orders" 
                          fill="#FF9F43" 
                          radius={[0, 4, 4, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="orders">
            <FilterBar
              onSearch={setSearchTerm}
              onStatusFilter={setStatusFilter}
              onTableFilter={setTableFilter}
              searchTerm={searchTerm}
              selectedStatus={statusFilter}
              selectedTable={tableFilter}
            />
            
            {filteredOrders.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                No orders match your search criteria.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredOrders.map(order => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onViewDetails={handleViewDetails}
                    showActions={false}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
      
      <OrderDetail
        order={selectedOrder}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        userRole="manager"
      />
    </div>
  );
};

export default ManagerPage;
