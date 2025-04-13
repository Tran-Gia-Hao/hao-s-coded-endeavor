
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Link } from 'react-router-dom';
import { ArrowLeft, ChefHat, Clock } from 'lucide-react';
import FilterBar from '@/components/FilterBar';
import OrderCard from '@/components/OrderCard';
import OrderDetail from '@/components/OrderDetail';
import { mockOrders } from '@/data/mockData';
import { Order, OrderStatus, ItemStatus } from '@/models/types';

const KitchenPage = () => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('pending');
  const [tableFilter, setTableFilter] = useState<number | null>(null);
  const { toast } = useToast();

  // Only show pending and cooking orders for kitchen staff
  const filteredOrders = orders
    .filter(order => {
      // Kitchen only cares about pending and cooking orders
      const relevantStatus = order.status === 'pending' || order.status === 'cooking';
      
      // Search term filter
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        order.id.toLowerCase().includes(searchLower) || 
        order.tableNumber.toString().includes(searchLower);

      // Status filter
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

      // Table filter
      const matchesTable = tableFilter === null || order.tableNumber === tableFilter;

      return relevantStatus && matchesSearch && matchesStatus && matchesTable;
    })
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

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
        
        // If all items are at least 'ready', update the order status to 'ready'
        let newOrderStatus = order.status;
        if (newStatus === 'ready' && updatedItems.every(item => item.status === 'ready')) {
          newOrderStatus = 'ready';
        } else if (newStatus === 'cooking' && order.status === 'pending') {
          newOrderStatus = 'cooking';
        }
        
        return {
          ...order,
          items: updatedItems,
          status: newOrderStatus,
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
    setOrders(orders.map(order => {
      if (order.id === orderId) {
        // Update all pending items to cooking, or all cooking items to ready
        const updatedItems = order.items.map(item => {
          if ((order.status === 'pending' && item.status === 'pending' && newStatus === 'cooking') ||
              (order.status === 'cooking' && item.status === 'cooking' && newStatus === 'ready')) {
            return { ...item, status: newStatus as ItemStatus, updatedAt: new Date() };
          }
          return item;
        });
        
        return {
          ...order,
          items: updatedItems,
          status: newStatus,
          updatedAt: new Date()
        };
      }
      return order;
    }));
    
    toast({
      title: "Order Updated",
      description: `Order status changed to ${newStatus}`,
      duration: 2000
    });

    // Close the detail modal if the order is now ready
    if (newStatus === 'ready') {
      setIsDetailOpen(false);
    }
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
            <h1 className="text-xl font-bold text-restaurant-secondary flex items-center">
              <ChefHat className="mr-2 h-5 w-5" />
              Kitchen Dashboard
            </h1>
            <div className="w-9"></div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6">
        <FilterBar
          onSearch={setSearchTerm}
          onStatusFilter={setStatusFilter}
          onTableFilter={setTableFilter}
          searchTerm={searchTerm}
          selectedStatus={statusFilter}
          selectedTable={tableFilter}
        />
        
        <div className="flex items-center mb-4">
          <h2 className="text-xl font-semibold">Orders Queue</h2>
          <Badge className="ml-2 bg-restaurant-primary">{filteredOrders.length}</Badge>
        </div>
        
        {filteredOrders.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No orders in the queue. Time for a break! ☕
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredOrders.map(order => (
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
      </main>
      
      <OrderDetail
        order={selectedOrder}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onUpdateItemStatus={handleUpdateItemStatus}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        userRole="kitchen"
      />
    </div>
  );
};

export default KitchenPage;
