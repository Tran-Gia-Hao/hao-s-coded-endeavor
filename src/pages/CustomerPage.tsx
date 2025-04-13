import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Plus, Minus, Trash2, Search, Filter, User } from 'lucide-react';
import { MenuItem, OrderItem, Order } from '@/models/types';
import { menuItems } from '@/data/mockData';
import { useRestaurantContext } from '@/context/RestaurantContext';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';

const CustomerPage = () => {
  const [cartItems, setCartItems] = useState<OrderItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrderConfirmOpen, setIsOrderConfirmOpen] = useState(false);
  const [tableNumber, setTableNumber] = useState<number>(1);
  const [editingItem, setEditingItem] = useState<OrderItem | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [itemNote, setItemNote] = useState('');
  const { addOrder } = useRestaurantContext();
  const { toast } = useToast();

  const categories = Array.from(new Set(menuItems.map(item => item.category)));

  const filteredMenuItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === null || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  const handleAddToCart = (menuItem: MenuItem) => {
    const existingItemIndex = cartItems.findIndex(item => item.menuItem.id === menuItem.id);
    
    if (existingItemIndex > -1) {
      const updatedCartItems = [...cartItems];
      updatedCartItems[existingItemIndex] = {
        ...updatedCartItems[existingItemIndex],
        quantity: updatedCartItems[existingItemIndex].quantity + 1
      };
      setCartItems(updatedCartItems);
    } else {
      const newCartItem: OrderItem = {
        id: uuidv4(),
        menuItem,
        quantity: 1,
        status: 'pending',
        notes: '',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setCartItems([...cartItems, newCartItem]);
    }
  };

  const handleRemoveFromCart = (itemId: string) => {
    const existingItemIndex = cartItems.findIndex(item => item.id === itemId);
    
    if (existingItemIndex > -1) {
      const item = cartItems[existingItemIndex];
      
      if (item.quantity > 1) {
        // Decrease quantity
        const updatedCartItems = [...cartItems];
        updatedCartItems[existingItemIndex] = {
          ...updatedCartItems[existingItemIndex],
          quantity: updatedCartItems[existingItemIndex].quantity - 1
        };
        setCartItems(updatedCartItems);
      } else {
        // Remove item
        setCartItems(cartItems.filter(item => item.id !== itemId));
      }
    }
  };

  const handleDeleteFromCart = (itemId: string) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
  };

  const handleEditItem = (item: OrderItem) => {
    setEditingItem(item);
    setItemNote(item.notes || '');
    setIsEditDialogOpen(true);
  };

  const handleSaveItemNote = () => {
    if (editingItem) {
      const updatedCartItems = cartItems.map(item => 
        item.id === editingItem.id 
          ? { ...item, notes: itemNote } 
          : item
      );
      setCartItems(updatedCartItems);
      setIsEditDialogOpen(false);
      setEditingItem(null);
    }
  };

  const handlePlaceOrder = () => {
    if (cartItems.length === 0) return;
    
    const newOrder: Omit<Order, 'id' | 'createdAt' | 'updatedAt'> = {
      tableNumber,
      items: cartItems,
      status: 'pending',
      totalPrice: total
    };
    
    addOrder(newOrder);
    
    toast({
      title: "Đặt hàng thành công!",
      description: `Đơn hàng của bạn đã được gửi đến nhà bếp. Vui lòng đợi trong giây lát.`,
    });
    
    // Reset cart
    setCartItems([]);
    setIsOrderConfirmOpen(false);
    setIsCartOpen(false);
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
            <h1 className="text-xl font-bold text-restaurant-secondary">Thực đơn</h1>
            <Button 
              variant="outline" 
              size="icon"
              className="relative"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-restaurant-primary">
                  {totalItems}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6">
        <Card className="mb-6 bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <h2 className="text-lg font-medium text-blue-800 mb-2 flex items-center">
              <User className="h-5 w-5 mr-2" /> Chào mừng quý khách
            </h2>
            <p className="text-blue-700">
              Quý khách có thể duyệt thực đơn và đặt món trực tiếp từ thiết bị này.
              Nhân viên của chúng tôi sẽ phục vụ món ăn đến bàn của quý khách trong thời gian sớm nhất.
            </p>
          </CardContent>
        </Card>
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              className="pl-10"
              placeholder="Tìm kiếm món ăn..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            <Button
              variant={categoryFilter === null ? "default" : "outline"}
              size="sm"
              onClick={() => setCategoryFilter(null)}
              className="whitespace-nowrap"
            >
              <Filter className="h-4 w-4 mr-1" /> Tất cả
            </Button>
            {categories.map(category => (
              <Button
                key={category}
                variant={categoryFilter === category ? "default" : "outline"}
                size="sm"
                onClick={() => setCategoryFilter(category)}
                className="whitespace-nowrap"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMenuItems.map(item => (
            <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-video w-full overflow-hidden bg-gray-100">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <Badge variant="outline" className="bg-restaurant-secondary/10">
                    {item.category}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">{item.description}</p>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-restaurant-primary">
                    {item.price.toLocaleString('vi-VN')}đ
                  </span>
                  <Button 
                    size="sm" 
                    className="bg-restaurant-primary hover:bg-restaurant-primary/90"
                    onClick={() => handleAddToCart(item)}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Thêm vào giỏ
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      
      {/* Cart Sidebar */}
      <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Giỏ hàng của bạn</DialogTitle>
          </DialogHeader>
          
          {cartItems.length === 0 ? (
            <div className="py-6 text-center text-gray-500">
              Giỏ hàng của bạn đang trống
            </div>
          ) : (
            <>
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                {cartItems.map(item => (
                  <div key={item.id} className="flex justify-between items-start border-b pb-3">
                    <div className="flex-1">
                      <h4 className="font-medium">{item.menuItem.name}</h4>
                      <p className="text-sm text-gray-500">
                        {item.menuItem.price.toLocaleString('vi-VN')}đ
                      </p>
                      {item.notes && (
                        <p className="text-xs italic mt-1 text-gray-500">
                          Ghi chú: {item.notes}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-7 w-7"
                        onClick={() => handleRemoveFromCart(item.id)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      
                      <span className="w-5 text-center">{item.quantity}</span>
                      
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-7 w-7"
                        onClick={() => handleAddToCart(item.menuItem)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 text-gray-400 hover:text-red-500"
                        onClick={() => handleDeleteFromCart(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => handleEditItem(item)}
                      >
                        Ghi chú
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Tạm tính:</span>
                  <span>{subtotal.toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Thuế (10%):</span>
                  <span>{tax.toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Tổng cộng:</span>
                  <span>{total.toLocaleString('vi-VN')}đ</span>
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  className="w-full bg-restaurant-primary hover:bg-restaurant-primary/90"
                  onClick={() => setIsOrderConfirmOpen(true)}
                >
                  Đặt món
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Edit Item Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Thêm ghi chú cho món ăn</DialogTitle>
          </DialogHeader>
          
          {editingItem && (
            <>
              <div className="mb-4">
                <h4 className="font-medium">{editingItem.menuItem.name}</h4>
                <p className="text-sm text-gray-500">
                  Số lượng: {editingItem.quantity}
                </p>
              </div>
              
              <Textarea
                placeholder="Ví dụ: Không hành, ít cay, v.v."
                value={itemNote}
                onChange={(e) => setItemNote(e.target.value)}
                rows={3}
              />
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Hủy
                </Button>
                <Button onClick={handleSaveItemNote}>
                  Lưu ghi chú
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Order Confirmation Dialog */}
      <AlertDialog open={isOrderConfirmOpen} onOpenChange={setIsOrderConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận đặt món</AlertDialogTitle>
            <AlertDialogDescription>
              Vui lòng xác nhận số bàn của bạn để hoàn tất đặt món.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="py-4">
            <label className="text-sm font-medium">Số bàn</label>
            <Input
              type="number"
              min="1"
              value={tableNumber}
              onChange={(e) => setTableNumber(parseInt(e.target.value) || 1)}
              className="mt-1"
            />
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handlePlaceOrder}>
              Xác nhận đặt món
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CustomerPage;
