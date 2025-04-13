
import React, { useEffect } from 'react';
import RoleSelector from '@/components/RoleSelector';
import { useRestaurantContext } from '@/context/RestaurantContext';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const { getActiveOrders } = useRestaurantContext();

  useEffect(() => {
    // Kiểm tra đơn đang hoạt động khi tải trang
    const activeOrders = getActiveOrders();
    
    if (activeOrders.length > 0) {
      const pendingOrders = activeOrders.filter(order => order.status === 'pending').length;
      const cookingOrders = activeOrders.filter(order => order.status === 'cooking').length;
      const readyOrders = activeOrders.filter(order => order.status === 'ready').length;
      
      if (pendingOrders > 0 || cookingOrders > 0 || readyOrders > 0) {
        toast({
          title: "Thông báo đơn hàng",
          description: `Có ${pendingOrders} đơn chờ xử lý, ${cookingOrders} đơn đang nấu và ${readyOrders} đơn sẵn sàng phục vụ.`,
          duration: 5000,
        });
      }
    }
  }, [getActiveOrders]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-restaurant-light">
      <RoleSelector />
    </div>
  );
};

export default Index;
