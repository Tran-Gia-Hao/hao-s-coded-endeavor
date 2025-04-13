import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Link } from 'react-router-dom';
import { HomeIcon, MenuIcon, History, ArrowLeft, Minus, Plus } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import MenuItemCard from '@/components/MenuItemCard';
import OrderCart from '@/components/OrderCart';
import OrderDetail from '@/components/OrderDetail';
import { menuItems } from '@/data/mockData';
import { MenuItem, Order, OrderItem } from '@/models/types';
import { v4 as uuidv4 } from 'uuid';
import { useRestaurantContext } from '@/context/RestaurantContext';

const buffetPackages: MenuItem[] = [
  {
    id: 'buffet-1',
    name: 'Buffet Linh Vân Các',
    description: 'Buffet lẩu-nướng cơ bản với các nguyên liệu tươi ngon, phù hợp với những người mới trải nghiệm lẩu-nướng.',
    price: 229000,
    category: 'Buffet Package',
    available: true,
    image: '/images/bfhvc.jpg'
  },
  {
    id: 'buffet-2',
    name: 'Buffet Phúc Khả Vương',
    description: 'Buffet lẩu-nướng với nhiều loại thịt, hải sản và rau củ hơn. Phù hợp với các nhóm bạn và gia đình.',
    price: 329000,
    category: 'Buffet Package',
    available: true,
    image: '/images/bfpkv.jpg'
  },
  {
    id: 'buffet-3',
    name: 'Buffet Bách Giai Vị',
    description: 'Buffet cao cấp với các loại thịt bò Mỹ, hải sản tươi sống và nước lẩu đặc biệt.',
    price: 419000,
    category: 'Buffet Package',
    available: true,
    image: '/images/bfbgv.jpg'
  },
  {
    id: 'buffet-4',
    name: 'Buffet Vạn Giai Kỳ',
    description: 'Buffet thượng hạng với thịt bò Wagyu, hải sản cao cấp và nhiều món đặc biệt của nhà hàng.',
    price: 499000,
    category: 'Buffet Package',
    available: true,
    image: '/images/bfvgk.jpg'
  },
  {
    id: 'buffet-5',
    name: 'Buffet Phúc Mãn Đường',
    description: 'Buffet đẳng cấp với thịt bò A5 Wagyu, hải sản nhập khẩu và phục vụ VIP với không gian sang trọng.',
    price: 619000,
    category: 'Buffet Package',
    available: true,
    image: '/images/bfpmd.jpg'
  }
];

const CustomerPage = () => {
  const { addOrder, orders, lastUpdate } = useRestaurantContext();
  const [cartItems, setCartItems] = useState<OrderItem[]>([]);
  const [tableNumber, setTableNumber] = useState(1);
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderHistory, setOrderHistory] = useState<Order[]>([]);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [menuType, setMenuType] = useState<'a-la-carte' | 'buffet'>('a-la-carte');
  const [selectedBuffet, setSelectedBuffet] = useState<string>('');
  const [peopleCount, setPeopleCount] = useState(1);
  const { toast } = useToast();

  useEffect(() => {
    setOrderHistory(orders.filter(order => order.tableNumber === tableNumber));
    
    if (selectedOrder) {
      const updatedOrder = orders.find(o => o.id === selectedOrder.id);
      if (updatedOrder) {
        setSelectedOrder(updatedOrder);
      }
    }
  }, [orders, lastUpdate, tableNumber, selectedOrder]);

  const regularMenuItems = menuItems.filter(item => item.category !== 'Buffet Package');

  const categories = ['All', ...Array.from(new Set(regularMenuItems.map(item => item.category)))];

  const addToOrder = (item: MenuItem) => {
    if (item.category === 'Buffet Package') {
      setSelectedBuffet(item.name);
      setMenuType('buffet');
      setCartItems([]);
      const buffetItem: OrderItem = {
        id: uuidv4(),
        menuItemId: item.id,
        menuItem: {
          ...item,
          notes: `Buffet Package: ${peopleCount} người`
        },
        quantity: 1,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setCartItems([buffetItem]);
      toast({
        title: "Gói buffet đã chọn",
        description: `Bạn đã chọn ${item.name} với giá ${item.price.toLocaleString('vi-VN')}₫/người.`,
        duration: 3000
      });
      return;
    }

    if (menuType === 'buffet' && item.category !== 'Buffet Package') {
      const existingItem = cartItems.find(cartItem =>
        cartItem.menuItemId === item.id &&
        cartItem.menuItem.category !== 'Buffet Package'
      );

      if (existingItem) {
        setCartItems(cartItems.map(cartItem =>
          cartItem.menuItemId === item.id && cartItem.menuItem.category !== 'Buffet Package'
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        ));
      } else {
        const newItem: OrderItem = {
          id: uuidv4(),
          menuItemId: item.id,
          menuItem: item,
          quantity: 1,
          status: 'pending',
          createdAt: new Date(),
          updatedAt: new Date()
        };

        const buffetItem = cartItems.find(item => item.menuItem.category === 'Buffet Package');

        if (buffetItem) {
          setCartItems([buffetItem, ...cartItems.filter(item => item.menuItem.category !== 'Buffet Package'), newItem]);
        } else {
          setCartItems([...cartItems, newItem]);
        }
      }
    } else {
      const existingItem = cartItems.find(cartItem => cartItem.menuItemId === item.id);

      if (existingItem) {
        setCartItems(cartItems.map(cartItem =>
          cartItem.menuItemId === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        ));
      } else {
        const newItem: OrderItem = {
          id: uuidv4(),
          menuItemId: item.id,
          menuItem: item,
          quantity: 1,
          status: 'pending',
          createdAt: new Date(),
          updatedAt: new Date()
        };
        setCartItems([...cartItems, newItem]);
      }
    }

    const message = menuType === 'buffet'
      ? `${item.name} đã được chọn.`
      : `${item.name} đã thêm vào giỏ hàng.`;

    toast({
      title: menuType === 'buffet' ? "Đã chọn món" : "Đã thêm vào giỏ hàng",
      description: message,
      duration: 2000
    });
  };

  const removeFromOrder = (itemId: string) => {
    const item = cartItems.find(item => item.id === itemId);
    if (menuType === 'buffet' && item?.menuItem.category === 'Buffet Package') {
      toast({
        title: "Không thể xóa gói buffet",
        description: "Bạn cần chọn một gói buffet để đặt món",
        variant: "destructive"
      });
      return;
    }

    setCartItems(cartItems.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    const item = cartItems.find(item => item.id === itemId);
    if (menuType === 'buffet' && item?.menuItem.category === 'Buffet Package') {
      return;
    }

    setCartItems(cartItems.map(item =>
      item.id === itemId ? { ...item, quantity } : item
    ));
  };

  const addNote = (itemId: string, note: string) => {
    setCartItems(cartItems.map(item =>
      item.id === itemId ? { ...item, notes: note } : item
    ));
  };

  const submitOrder = () => {
    const hasBuffetPackage = menuType === 'buffet' && cartItems.some(item => item.menuItem.category === 'Buffet Package');

    if (menuType === 'buffet' && !hasBuffetPackage) {
      toast({
        title: "Chưa chọn gói buffet",
        description: "Vui lòng chọn một gói buffet trước khi đặt món",
        variant: "destructive"
      });
      return;
    }

    if (menuType === 'a-la-carte' && cartItems.length === 0) {
      toast({
        title: "Giỏ hàng trống",
        description: "Vui lòng thêm món vào giỏ hàng trước khi đặt",
        variant: "destructive"
      });
      return;
    }

    let totalPrice = 0;

    if (menuType === 'buffet') {
      const selectedPackage = buffetPackages.find(pkg => pkg.name === selectedBuffet);
      if (selectedPackage) {
        totalPrice = selectedPackage.price * peopleCount;
      }

      setCartItems(items => items.map(item =>
        item.menuItem.category === 'Buffet Package'
          ? { ...item, menuItem: { ...item.menuItem, notes: `${peopleCount} người` }}
          : item
      ));
    } else {
      totalPrice = cartItems.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0);
    }

    addOrder({
      tableNumber,
      items: cartItems,
      status: 'pending',
      totalPrice
    });

    if (menuType === 'buffet') {
      const buffetItem = cartItems.find(item => item.menuItem.category === 'Buffet Package');
      if (buffetItem) {
        setCartItems([buffetItem]);
      } else {
        setCartItems([]);
      }
    } else {
      setCartItems([]);
    }

    toast({
      title: "Đã đặt món!",
      description: `Đơn hàng #${newOrder.id.slice(0, 8)} đã được đặt thành công.`,
      variant: "default"
    });
  };

  const viewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
  };

  const closeOrderDetails = () => {
    setIsDetailOpen(false);
    setSelectedOrder(null);
  };

  const handleMenuTypeChange = (value: 'a-la-carte' | 'buffet') => {
    setMenuType(value);
    if (value === 'a-la-carte') {
      setSelectedBuffet('');
      setCartItems([]);
      setActiveCategory('All');
    }
    else if (value === 'buffet' && !selectedBuffet) {
      setSelectedBuffet(buffetPackages[0].name);

      const buffetItem: OrderItem = {
        id: uuidv4(),
        menuItemId: buffetPackages[0].id,
        menuItem: {
          ...buffetPackages[0],
          notes: `${peopleCount} người`
        },
        quantity: 1,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      setCartItems([buffetItem]);
    }
  };

  const handlePeopleCountChange = (count: number) => {
    setPeopleCount(Math.max(1, count));

    const buffetItem = cartItems.find(item => item.menuItem.category === 'Buffet Package');
    if (buffetItem) {
      setCartItems(items => items.map(item =>
        item.menuItem.category === 'Buffet Package'
          ? {
              ...item,
              menuItem: {
                ...item.menuItem,
                notes: `${count} người`
              }
            }
          : item
      ));
    }
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
            <h1 className="text-xl font-bold text-restaurant-secondary">Cook & Serve</h1>
            <div className="w-9"></div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="menu" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="menu" className="flex items-center">
              <MenuIcon className="mr-2 h-4 w-4" />
              Menu
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center">
              <History className="mr-2 h-4 w-4" />
              Orders
            </TabsTrigger>
          </TabsList>

          <TabsContent value="menu">
            <Card className="mb-4">
              <CardContent className="pt-6">
                <div className="text-lg font-medium mb-2">Lựa chọn kiểu gọi món:</div>
                <RadioGroup
                  value={menuType}
                  onValueChange={(value) => handleMenuTypeChange(value as 'a-la-carte' | 'buffet')}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="a-la-carte" id="a-la-carte" />
                    <label htmlFor="a-la-carte" className="cursor-pointer">
                      Gọi món (À la carte)
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="buffet" id="buffet" />
                    <label htmlFor="buffet" className="cursor-pointer">
                      Buffet
                    </label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
            {menuType === 'buffet' ? (
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-3">Chọn gói Buffet:</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {buffetPackages.map(pkg => (
                    <MenuItemCard
                      key={pkg.id}
                      item={pkg}
                      onAddToOrder={addToOrder}
                      menuType={menuType}
                      buffetOption={selectedBuffet}
                    />
                  ))}
                </div>
                <Separator className="my-6" />
              </div>
            ) : (
              <div className="mb-6">
                <ScrollArea className="h-12 whitespace-nowrap pb-2 mb-6">
                  <div className="flex space-x-2">
                    {categories.map(category => (
                      <Button
                        key={category}
                        variant={activeCategory === category ? "default" : "outline"}
                        onClick={() => setActiveCategory(category)}
                        className={activeCategory === category ? "button-primary" : ""}
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </ScrollArea>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pb-20">
                  {regularMenuItems
                    .filter(item => activeCategory === 'All' || item.category === activeCategory)
                    .map(item => (
                      <MenuItemCard
                        key={item.id}
                        item={item}
                        onAddToOrder={addToOrder}
                        menuType={menuType}
                      />
                    ))
                  }
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="orders">
            {orderHistory.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="mb-4 text-gray-500">You haven't placed any orders yet.</p>
                  <Button
                    onClick={() => document.querySelector('[data-value="menu"]')?.dispatchEvent(new Event('click'))}
                    className="button-primary"
                  >
                    Browse Menu
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4 pb-20">
                {orderHistory.map(order => (
                  <Card key={order.id} className="animate-fade-in">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <span className="text-gray-500 text-sm">Order #{order.id.slice(0, 8)}</span>
                          <div className="font-semibold">Table {order.tableNumber}</div>
                        </div>
                        <Badge className={`badge-${order.status}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </div>

                      <div className="text-sm text-gray-500 mb-2">
                        {new Date(order.createdAt).toLocaleString()}
                      </div>

                      <Separator className="my-2" />

                      <div className="space-y-1 mb-2">
                        <div className="text-sm font-medium">Order Summary</div>
                        <ul className="text-sm">
                          {order.items.slice(0, 3).map((item, index) => (
                            <li key={index}>
                              {item.menuItem.category === 'Buffet Package'
                                ? `${item.menuItem.name} - ${item.menuItem.notes}`
                                : `${item.quantity}x ${item.menuItem.name}`}
                            </li>
                          ))}
                          {order.items.length > 3 && (
                            <li className="text-gray-500">+{order.items.length - 3} more items</li>
                          )}
                        </ul>
                      </div>

                      <div className="flex justify-between">
                        <div className="font-semibold">Total</div>
                        <div className="font-semibold">{order.totalPrice.toLocaleString('vi-VN')} ₫</div>
                      </div>

                      <Button
                        className="w-full mt-3 button-primary"
                        onClick={() => viewOrderDetails(order)}
                      >
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <OrderCart
        items={cartItems}
        onRemoveItem={removeFromOrder}
        onUpdateQuantity={updateQuantity}
        onAddNote={addNote}
        onSubmitOrder={submitOrder}
        tableNumber={tableNumber}
        onTableNumberChange={setTableNumber}
        menuType={menuType}
        peopleCount={peopleCount}
        onPeopleCountChange={handlePeopleCountChange}
      />

      <OrderDetail
        order={selectedOrder}
        isOpen={isDetailOpen}
        onClose={closeOrderDetails}
        userRole="customer"
      />
    </div>
  );
};

export default CustomerPage;
