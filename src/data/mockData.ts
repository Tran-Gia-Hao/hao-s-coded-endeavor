import { MenuItem, Order, OrderItem, Staff, DailySummary, OrderStatus, ItemStatus } from '../models/types';
import { v4 as uuidv4 } from 'uuid';

// Menu Items
export const menuItems: MenuItem[] = [
  {
    id: uuidv4(),
    name: 'Sushi Cá Hồi',
    description: 'Sushi được phủ lớp cá hồi tươi ngon trên nền cơm trắng mịn, cuốn rong biển',
    price: 35000,
    category: 'Sushi & Sashimi',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    available: true
  },
  {
    id: uuidv4(),
    name: 'Bò Mỹ Nướng BBQ',
    description: 'Bò Mỹ thượng hạng được tẩm ướp và nướng trên than hồng, thơm ngọt đặc trưng',
    price: 95000,
    category: 'BBQ',
    image: 'https://images.unsplash.com/photo-1558030006-450675393462?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80',
    available: true
  },
  {
    id: uuidv4(),
    name: 'Lẩu Thái Chua Cay',
    description: 'Nước lẩu Thái chua cay đặc trưng với hương vị đậm đà, hấp dẫn',
    price: 120000,
    category: 'Lẩu',
    image: '/images/lt.jpg',
    available: true
  },
  {
    id: uuidv4(),
    name: 'Sashimi Cá Hồi',
    description: 'Cá hồi tươi ngon được thái lát mỏng, phục vụ với gừng và wasabi',
    price: 85000,
    category: 'Sushi & Sashimi',
    image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1125&q=80',
    available: true
  },
  {
    id: uuidv4(),
    name: 'Tôm Sú Nướng Muối Ớt',
    description: 'Tôm sú tươi nướng với muối ớt đặc biệt của nhà hàng',
    price: 95000,
    category: 'Hải Sản',
    image: '/images/tsnmo.jpg',
    available: true
  },
  {
    id: uuidv4(),
    name: 'Lẩu Kimchi',
    description: 'Lẩu kimchi cay nồng đặc trưng ẩm thực Hàn Quốc tại Manwah',
    price: 150000,
    category: 'Lẩu',
    image: '/images/lkc.jpg',
    available: true
  },
  {
    id: uuidv4(),
    name: 'Cánh Gà Nướng BBQ',
    description: 'Cánh gà tẩm ướp gia vị đặc biệt, nướng trên bếp than hoa thơm nức',
    price: 65000,
    category: 'BBQ',
    image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1035&q=80',
    available: true
  },
  {
    id: uuidv4(),
    name: 'Sườn Nướng BBQ',
    description: 'Sườn heo tươi ngon được tẩm ướp và nướng trên bếp than hồng',
    price: 85000,
    category: 'BBQ',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80',
    available: true
  }
];

// Staff
export const staff: Staff[] = [
  { id: uuidv4(), name: 'Nguyễn Văn A', role: 'waiter' },
  { id: uuidv4(), name: 'Trần Thị B', role: 'kitchen' },
  { id: uuidv4(), name: 'Phạm Văn C', role: 'manager' },
];

// Generate mock orders
export const generateMockOrders = (count: number = 5): Order[] => {
  const orders: Order[] = [];

  for (let i = 0; i < count; i++) {
    const orderItems: OrderItem[] = [];
    const itemCount = Math.floor(Math.random() * 4) + 1;

    let totalPrice = 0;

    for (let j = 0; j < itemCount; j++) {
      const menuItem = menuItems[Math.floor(Math.random() * menuItems.length)];
      const quantity = Math.floor(Math.random() * 3) + 1;
      const statusOptions: ItemStatus[] = ['pending', 'cooking', 'ready', 'served'];
      const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];

      totalPrice += menuItem.price * quantity;

      orderItems.push({
        id: uuidv4(),
        menuItemId: menuItem.id,
        menuItem: menuItem,
        quantity: quantity,
        status: status,
        createdAt: new Date(Date.now() - Math.random() * 10000000),
        updatedAt: new Date()
      });
    }

    const statusOptions: OrderStatus[] = ['pending', 'cooking', 'ready', 'served', 'paid'];
    const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];

    orders.push({
      id: uuidv4(),
      tableNumber: Math.floor(Math.random() * 20) + 1, // Tables 1-20
      items: orderItems,
      status: status,
      totalPrice: Math.round(totalPrice * 100) / 100,
      createdAt: new Date(Date.now() - Math.random() * 10000000),
      updatedAt: new Date()
    });
  }

  return orders;
};

export const mockOrders = generateMockOrders(10);

// Mock daily summary
export const mockDailySummary: DailySummary = {
  date: new Date().toISOString().slice(0, 10),
  totalOrders: 42,
  totalRevenue: 3750000,
  averageOrderValue: 89200,
  popularItems: [
    { itemId: menuItems[0].id, name: menuItems[0].name, count: 18 },
    { itemId: menuItems[2].id, name: menuItems[2].name, count: 15 },
    { itemId: menuItems[4].id, name: menuItems[4].name, count: 12 },
  ]
};

// Mock weekly data for charts
export const mockWeeklyData = {
  labels: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'],
  revenue: [2500000, 3200000, 2700000, 3000000, 3800000, 4200000, 3600000],
  orders: [32, 38, 30, 35, 46, 52, 42]
};
