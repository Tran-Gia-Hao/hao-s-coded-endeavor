
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Order, OrderItem, OrderStatus, ItemStatus } from '@/models/types';
import { ArrowLeft, Clock, PlusCircle, Receipt, ChefHat, UserIcon } from 'lucide-react';
import MenuItemCard from './MenuItemCard';

interface OrderDetailProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateItemStatus?: (orderId: string, itemId: string, newStatus: ItemStatus) => void;
  onUpdateOrderStatus?: (orderId: string, newStatus: OrderStatus) => void;
  userRole: 'customer' | 'waiter' | 'kitchen' | 'manager';
}

const OrderDetail: React.FC<OrderDetailProps> = ({
  order,
  isOpen,
  onClose,
  onUpdateItemStatus,
  onUpdateOrderStatus,
  userRole
}) => {
  const [activeTab, setActiveTab] = useState<'items' | 'billing'>('items');

  if (!order) return null;

  const getItemStatusColor = (status: ItemStatus) => {
    switch(status) {
      case 'pending': return 'bg-amber-500';
      case 'cooking': return 'bg-orange-500';
      case 'ready': return 'bg-green-500';
      case 'served': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getNextItemStatus = (currentStatus: ItemStatus): ItemStatus | null => {
    if (userRole === 'kitchen') {
      switch(currentStatus) {
        case 'pending': return 'cooking';
        case 'cooking': return 'ready';
        default: return null;
      }
    } else if (userRole === 'waiter') {
      switch(currentStatus) {
        case 'ready': return 'served';
        default: return null;
      }
    }
    return null;
  };

  const canModifyOrder = userRole === 'waiter' || userRole === 'kitchen' || userRole === 'manager';

  const statusActions = {
    'pending': {
      next: 'cooking',
      actionLabel: 'Bắt đầu nấu',
      role: 'kitchen'
    },
    'cooking': {
      next: 'ready',
      actionLabel: 'Đã nấu xong',
      role: 'kitchen'
    },
    'ready': {
      next: 'served',
      actionLabel: 'Đã phục vụ',
      role: 'waiter'
    },
    'served': {
      next: 'paid',
      actionLabel: 'Thanh toán',
      role: 'waiter'
    }
  };

  const currentAction = statusActions[order.status as keyof typeof statusActions];
  const canModifyOrderStatus = currentAction && (userRole === currentAction.role || userRole === 'manager');

  const renderActionButton = () => {
    if (!canModifyOrderStatus || !onUpdateOrderStatus) return null;
    
    if (userRole === 'waiter' && order.status === 'served') {
      return (
        <Button 
          className="button-primary"
          onClick={() => onUpdateOrderStatus(order.id, 'paid' as OrderStatus)}
        >
          Thanh toán
        </Button>
      );
    }
    
    return (
      <Button 
        className="button-primary"
        onClick={() => onUpdateOrderStatus(order.id, currentAction.next as OrderStatus)}
      >
        {currentAction.actionLabel}
      </Button>
    );
  };

  const getViewTitle = () => {
    if (userRole === 'kitchen') return 'Chi tiết đơn hàng - Bếp';
    if (userRole === 'waiter') return 'Chi tiết đơn hàng - Phục vụ';
    return 'Chi tiết đơn hàng';
  };

  const getRoleIcon = () => {
    if (userRole === 'kitchen') return <ChefHat className="mr-2 h-5 w-5" />;
    if (userRole === 'waiter') return <UserIcon className="mr-2 h-5 w-5" />;
    return null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center">
              {getRoleIcon()}
              <span>{getViewTitle()} - Bàn {order.tableNumber}</span>
            </div>
            <Badge className={`badge-${order.status}`}>
              {order.status === 'pending' && 'Chờ xử lý'}
              {order.status === 'cooking' && 'Đang nấu'}
              {order.status === 'ready' && 'Sẵn sàng'}
              {order.status === 'served' && 'Đã phục vụ'}
              {order.status === 'paid' && 'Đã thanh toán'}
            </Badge>
          </DialogTitle>
          <DialogDescription className="flex items-center">
            <Clock className="mr-1 h-4 w-4" />
            {new Date(order.createdAt).toLocaleString()}
          </DialogDescription>
        </DialogHeader>

        <div className="flex space-x-2 mb-4">
          <Button 
            variant={activeTab === 'items' ? 'default' : 'outline'} 
            onClick={() => setActiveTab('items')}
            className={activeTab === 'items' ? 'button-primary' : ''}
          >
            Các món
          </Button>
          <Button 
            variant={activeTab === 'billing' ? 'default' : 'outline'} 
            onClick={() => setActiveTab('billing')}
            className={activeTab === 'billing' ? 'button-primary' : ''}
          >
            <Receipt className="mr-1 h-4 w-4" />
            Hóa đơn
          </Button>
        </div>

        {activeTab === 'items' && (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {order.items.map((item: OrderItem) => (
              <div key={item.id} className="border rounded-lg p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold">{item.menuItem.name}</div>
                    <div className="text-sm text-gray-500">Số lượng: {item.quantity}</div>
                    {item.notes && (
                      <div className="text-sm italic mt-1">Ghi chú: {item.notes}</div>
                    )}
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <Badge className={`${getItemStatusColor(item.status)}`}>
                      {item.status === 'pending' && 'Chờ xử lý'}
                      {item.status === 'cooking' && 'Đang nấu'}
                      {item.status === 'ready' && 'Sẵn sàng'}
                      {item.status === 'served' && 'Đã phục vụ'}
                    </Badge>
                    <div className="font-semibold">
                      {(item.menuItem.price * item.quantity).toLocaleString('vi-VN')}₫
                    </div>
                  </div>
                </div>
                
                {canModifyOrder && onUpdateItemStatus && getNextItemStatus(item.status) && (
                  <div className="mt-2">
                    <Button 
                      size="sm" 
                      className="w-full button-primary"
                      onClick={() => onUpdateItemStatus(order.id, item.id, getNextItemStatus(item.status)!)}
                    >
                      {userRole === 'kitchen' && item.status === 'pending' && 'Bắt đầu nấu'}
                      {userRole === 'kitchen' && item.status === 'cooking' && 'Đã nấu xong'}
                      {userRole === 'waiter' && item.status === 'ready' && 'Đã phục vụ'}
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'billing' && (
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Tổng hợp đơn hàng</h3>
              <div className="space-y-2">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{item.quantity}x {item.menuItem.name}</span>
                    <span>{(item.menuItem.price * item.quantity).toLocaleString('vi-VN')}₫</span>
                  </div>
                ))}
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-bold">
                <span>Tổng cộng</span>
                <span>{order.totalPrice.toLocaleString('vi-VN')}₫</span>
              </div>
            </div>
            
            {userRole === 'waiter' && order.status === 'served' && (
              <div className="flex space-x-2">
                <Button variant="outline" className="flex-1">
                  In hóa đơn
                </Button>
                <Button className="flex-1 button-primary" onClick={() => onUpdateOrderStatus && onUpdateOrderStatus(order.id, 'paid')}>
                  Xử lý thanh toán
                </Button>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-between mt-4">
          <Button variant="outline" onClick={onClose}>
            <ArrowLeft className="mr-1 h-4 w-4" /> Quay lại
          </Button>
          
          {renderActionButton()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetail;
