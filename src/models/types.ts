// Types for the restaurant order management system

export type OrderStatus = 'pending' | 'cooking' | 'ready' | 'served' | 'paid';
export type ItemStatus = 'pending' | 'cooking' | 'ready' | 'served';
export type UserRole = 'customer' | 'waiter' | 'kitchen' | 'manager';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  available: boolean;
  status?: ItemStatus; // for kitchen view
  notes?: string;     // Added notes property to MenuItem interface
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  menuItem: MenuItem;
  quantity: number;
  notes?: string;
  status: ItemStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  tableNumber: number;
  items: OrderItem[];
  status: OrderStatus;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Staff {
  id: string;
  name: string;
  role: UserRole;
}

export interface DailySummary {
  date: string;
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  popularItems: {
    itemId: string;
    name: string;
    count: number;
  }[];
}

// Kitchen-specific types
export interface KitchenOrder extends Order {
  priority?: 'normal' | 'high' | 'urgent';
}
