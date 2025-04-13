
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Order, OrderStatus } from '@/models/types';
import { Clock, Check } from 'lucide-react';

interface OrderCardProps {
  order: Order;
  onViewDetails: (order: Order) => void;
  onStatusChange?: (order: Order, newStatus: OrderStatus) => void;
  showActions?: boolean;
  compact?: boolean;
}

const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onViewDetails,
  onStatusChange,
  showActions = true,
  compact = false
}) => {
  const getStatusColor = (status: OrderStatus) => {
    switch(status) {
      case 'pending': return 'bg-amber-500';
      case 'cooking': return 'bg-orange-500';
      case 'ready': return 'bg-green-500';
      case 'served': return 'bg-blue-500';
      case 'paid': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    switch(currentStatus) {
      case 'pending': return 'cooking';
      case 'cooking': return 'ready';
      case 'ready': return 'served';
      case 'served': return 'paid';
      default: return null;
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const timeElapsed = () => {
    const now = new Date();
    const created = new Date(order.createdAt);
    const diffMs = now.getTime() - created.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    return diffMins < 60 
      ? `${diffMins}m ago` 
      : `${Math.floor(diffMins / 60)}h ${diffMins % 60}m ago`;
  };

  return (
    <Card className={`${compact ? 'p-2' : ''}`}>
      <CardHeader className={`${compact ? 'p-3' : ''}`}>
        <div className="flex justify-between items-center">
          <CardTitle className={`${compact ? 'text-lg' : 'text-xl'}`}>
            Table {order.tableNumber}
          </CardTitle>
          <Badge className={`${getStatusColor(order.status)} text-white`}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Badge>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <Clock className="mr-1 h-4 w-4" />
          {formatTime(order.createdAt)} ({timeElapsed()})
        </div>
      </CardHeader>
      <CardContent className={`${compact ? 'p-3 pt-0' : ''}`}>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Items:</span>
            <span>{order.items.length}</span>
          </div>
          {!compact && (
            <div>
              <ul className="text-sm">
                {order.items.slice(0, 3).map((item, index) => (
                  <li key={index} className="flex justify-between">
                    <span>{item.quantity}x {item.menuItem.name}</span>
                    <Badge variant="outline" className={`${getStatusColor(item.status as OrderStatus)}`}>
                      {item.status}
                    </Badge>
                  </li>
                ))}
                {order.items.length > 3 && <li className="text-center text-gray-500">+ {order.items.length - 3} more items</li>}
              </ul>
            </div>
          )}
          <div className="flex justify-between font-bold">
            <span>Total:</span>
            <span>${order.totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className={`flex gap-2 ${compact ? 'p-3 pt-0' : ''}`}>
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => onViewDetails(order)}
        >
          {compact ? 'View' : 'View Details'}
        </Button>
        {showActions && onStatusChange && getNextStatus(order.status) && (
          <Button
            className="flex-1 button-primary"
            onClick={() => onStatusChange(order, getNextStatus(order.status)!)}
          >
            <Check className="mr-1 h-4 w-4" /> 
            Mark {getNextStatus(order.status)}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default OrderCard;
