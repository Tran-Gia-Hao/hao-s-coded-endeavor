
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Link } from 'react-router-dom';
import { HomeIcon, TableIcon, ClipboardList, Plus, ArrowLeft, UserIcon } from 'lucide-react';
import FilterBar from '@/components/FilterBar';
import OrderCard from '@/components/OrderCard';
import OrderDetail from '@/components/OrderDetail';
import { mockOrders, generateMockOrders } from '@/data/mockData';
import { Order, OrderStatus, ItemStatus } from '@/models/types';
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const WaiterPage = () => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [tableFilter, setTableFilter] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'orders' | 'tasks'>('orders');
  const { toast } = useToast();

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

  const activeOrders = filteredOrders.filter(order => 
    order.status !== 'paid'
  );
  
  const completedOrders = filteredOrders.filter(order => 
    order.status === 'paid'
  );

  // Orders with ready items that need to be served
  const ordersWithReadyItems = orders.filter(order => 
    order.items.some(item => item.status === 'ready')
  );

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
  };

  const handleUpdateItemStatus = (orderId: string, itemId: string, newStatus: ItemStatus) => {
    setOrders(orders.map(order => {
      if (order.id === orderId) {
        const updatedItems = order.items.map(item => 
          item.id === itemId ? { ...item, status: newStatus, updatedAt: new Date() } : item
        );
        
        return {
          ...order,
          items: updatedItems,
          updatedAt: new Date()
        };
      }
      return order;
    }));
    
    toast({
      title: "Item Updated",
      description: `Item status changed to ${newStatus}`,
      duration: 2000
    });
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: newStatus, updatedAt: new Date() } 
        : order
    ));
    
    toast({
      title: "Order Updated",
      description: `Order status changed to ${newStatus}`,
      duration: 2000
    });

    // Close the detail modal if the order is now paid
    if (newStatus === 'paid') {
      setIsDetailOpen(false);
    }
  };

  const handleCreateNewOrder = () => {
    const newOrder = generateMockOrders(1)[0];
    setOrders([newOrder, ...orders]);
    
    toast({
      title: "New Order Created",
      description: `Table ${newOrder.tableNumber} has placed a new order`,
      duration: 2000
    });
  };

  // Adapter function to make handleUpdateOrderStatus compatible with OrderCard
  const handleOrderCardStatusChange = (order: Order, newStatus: OrderStatus) => {
    handleUpdateOrderStatus(order.id, newStatus);
  };

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
            <h1 className="text-xl font-bold text-restaurant-secondary">Nhân viên phục vụ</h1>
            <Button 
              size="sm" 
              className="button-primary"
              onClick={handleCreateNewOrder}
            >
              <Plus className="h-4 w-4 mr-1" /> Mở bàn mới
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6">
        <Card className="mb-6 bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <h2 className="text-lg font-medium text-blue-800 mb-2 flex items-center">
              <UserIcon className="h-5 w-5 mr-2" /> Công việc chính
            </h2>
            <ul className="list-disc list-inside text-blue-700 space-y-2 pl-5">
              <li>Tạo mới một đơn hàng (mở bàn) khi đón tiếp thực khách vào nhà hàng</li>
              <li>Hỗ trợ thực khách ghi nhận các món ăn vào đơn hàng</li>
              <li>Kết thúc đơn hàng khi thực khách có yêu cầu thanh toán</li>
            </ul>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="orders" className="w-full" onValueChange={(value) => setActiveTab(value as 'orders' | 'tasks')}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="orders" className="flex items-center">
              <ClipboardList className="mr-2 h-4 w-4" />
              Quản lý đơn hàng
              {activeOrders.length > 0 && (
                <Badge className="ml-2 bg-restaurant-primary">{activeOrders.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex items-center">
              <TableIcon className="mr-2 h-4 w-4" />
              Món cần phục vụ
              {ordersWithReadyItems.length > 0 && (
                <Badge className="ml-2 bg-green-500">{ordersWithReadyItems.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>
          
          {activeTab === 'orders' && (
            <>
              <FilterBar
                onSearch={setSearchTerm}
                onStatusFilter={setStatusFilter}
                onTableFilter={setTableFilter}
                searchTerm={searchTerm}
                selectedStatus={statusFilter}
                selectedTable={tableFilter}
              />
              
              <TabsContent value="orders" className="mt-4">
                <Tabs defaultValue="active" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="active" className="flex items-center">
                      Đang phục vụ
                      {activeOrders.length > 0 && (
                        <Badge className="ml-2 bg-restaurant-primary">{activeOrders.length}</Badge>
                      )}
                    </TabsTrigger>
                    <TabsTrigger value="completed" className="flex items-center">
                      Đã thanh toán
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="active">
                    {activeOrders.length === 0 ? (
                      <div className="text-center py-10 text-gray-500">
                        Không có đơn hàng đang hoạt động.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {activeOrders.map(order => (
                          <OrderCard
                            key={order.id}
                            order={order}
                            onViewDetails={handleViewDetails}
                            onStatusChange={handleOrderCardStatusChange}
                            showActions={true}
                          />
                        ))}
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="completed">
                    {completedOrders.length === 0 ? (
                      <div className="text-center py-10 text-gray-500">
                        Không có đơn hàng đã hoàn thành.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {completedOrders.map(order => (
                          <OrderCard
                            key={order.id}
                            order={order}
                            onViewDetails={handleViewDetails}
                            showActions={false}
                            compact={true}
                          />
                        ))}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </TabsContent>
            </>
          )}
          
          <TabsContent value="tasks">
            <h3 className="font-semibold text-lg mb-4">Các món cần phục vụ</h3>
            {ordersWithReadyItems.length === 0 ? (
              <div className="text-center py-10 text-gray-500 border rounded-lg">
                Không có món ăn nào cần phục vụ.
              </div>
            ) : (
              <div className="space-y-4">
                {ordersWithReadyItems.map(order => (
                  <Card key={order.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold">Bàn {order.tableNumber}</h4>
                        <Button size="sm" onClick={() => handleViewDetails(order)}>
                          Xem chi tiết
                        </Button>
                      </div>
                      <Separator className="my-2" />
                      <div className="space-y-2">
                        {order.items
                          .filter(item => item.status === 'ready')
                          .map(item => (
                            <div key={item.id} className="flex justify-between items-center p-2 bg-green-50 rounded-md border border-green-200">
                              <div>
                                <span className="font-medium">{item.quantity}x {item.menuItem.name}</span>
                                {item.notes && (
                                  <p className="text-xs italic text-gray-500">{item.notes}</p>
                                )}
                              </div>
                              <Button 
                                size="sm" 
                                onClick={() => handleUpdateItemStatus(order.id, item.id, 'served')}
                                className="bg-green-500 hover:bg-green-600"
                              >
                                Đã phục vụ
                              </Button>
                            </div>
                          ))
                        }
                      </div>
                    </CardContent>
                  </Card>
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
        onUpdateItemStatus={handleUpdateItemStatus}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        userRole="waiter"
      />
    </div>
  );
};

export default WaiterPage;
