
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Order, OrderStatus, ItemStatus } from '@/models/types';
import { mockOrders } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

interface RestaurantContextType {
  orders: Order[];
  updateOrder: (orderId: string, updates: Partial<Order>) => void;
  updateItemStatus: (orderId: string, itemId: string, newStatus: ItemStatus) => void;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => void;
  getActiveOrders: () => Order[];
  lastUpdate: Date | null;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

export const useRestaurantContext = () => {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurantContext must be used within a RestaurantProvider');
  }
  return context;
};

interface RestaurantProviderProps {
  children: ReactNode;
}

export const RestaurantProvider: React.FC<RestaurantProviderProps> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(new Date());
  const { toast } = useToast();
  
  // Simulate real-time updates across the system
  useEffect(() => {
    const interval = setInterval(() => {
      // In a real app, this would be replaced with WebSockets or Server-Sent Events
      console.log("Checking for updates...", lastUpdate);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [lastUpdate]);

  const updateOrder = (orderId: string, updates: Partial<Order>) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId 
          ? { ...order, ...updates, updatedAt: new Date() } 
          : order
      )
    );
    
    // Update the lastUpdate time to trigger reactive updates
    setLastUpdate(new Date());
    
    toast({
      title: "Đơn hàng đã được cập nhật",
      description: `Đơn hàng ${orderId} đã được cập nhật thành công`,
      duration: 2000,
    });
  };

  const updateItemStatus = (orderId: string, itemId: string, newStatus: ItemStatus) => {
    setOrders(prevOrders => 
      prevOrders.map(order => {
        if (order.id === orderId) {
          const updatedItems = order.items.map(item => 
            item.id === itemId 
              ? { ...item, status: newStatus, updatedAt: new Date() } 
              : item
          );
          
          // Nếu tất cả các món đều đã sẵn sàng, cập nhật trạng thái đơn hàng
          let newOrderStatus = order.status;
          if (newStatus === 'ready' && updatedItems.every(item => item.status === 'ready')) {
            newOrderStatus = 'ready';
          } else if (newStatus === 'cooking' && order.status === 'pending') {
            newOrderStatus = 'cooking';
          } else if (newStatus === 'served' && updatedItems.every(item => item.status === 'served')) {
            newOrderStatus = 'served';
          }
          
          return {
            ...order,
            items: updatedItems,
            status: newOrderStatus,
            updatedAt: new Date()
          };
        }
        return order;
      })
    );
    
    // Update the lastUpdate time to trigger reactive updates
    setLastUpdate(new Date());
    
    toast({
      title: "Món ăn đã được cập nhật",
      description: `Trạng thái món ăn đã thay đổi thành ${newStatus}`,
      duration: 2000,
    });
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prevOrders => 
      prevOrders.map(order => {
        if (order.id === orderId) {
          // Cập nhật trạng thái tất cả các món tương ứng
          const updatedItems = order.items.map(item => {
            if ((order.status === 'pending' && item.status === 'pending' && newStatus === 'cooking') ||
                (order.status === 'cooking' && item.status === 'cooking' && newStatus === 'ready') ||
                (order.status === 'ready' && item.status === 'ready' && newStatus === 'served')) {
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
      })
    );
    
    // Update the lastUpdate time to trigger reactive updates
    setLastUpdate(new Date());
    
    toast({
      title: "Trạng thái đơn hàng đã được cập nhật",
      description: `Đơn hàng chuyển sang trạng thái ${newStatus}`,
      duration: 2000,
    });
  };

  const addOrder = (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newOrder: Order = {
      ...order,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setOrders(prevOrders => [...prevOrders, newOrder]);
    
    // Update the lastUpdate time to trigger reactive updates
    setLastUpdate(new Date());
    
    toast({
      title: "Đơn hàng mới đã được tạo",
      description: `Đơn hàng cho bàn ${order.tableNumber} đã được tạo thành công`,
      duration: 2000,
    });
  };

  const getActiveOrders = () => {
    return orders.filter(order => 
      order.status !== 'paid' && order.status !== 'served'
    );
  };

  const value = {
    orders,
    updateOrder,
    updateItemStatus,
    updateOrderStatus,
    addOrder,
    getActiveOrders,
    lastUpdate
  };

  return (
    <RestaurantContext.Provider value={value}>
      {children}
    </RestaurantContext.Provider>
  );
};
