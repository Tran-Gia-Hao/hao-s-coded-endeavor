
import React from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OrderItem } from '@/models/types';
import { ShoppingCart, Trash2, Send, ChevronUp, ChevronDown, Plus, Minus } from 'lucide-react';

interface OrderCartProps {
  items: OrderItem[];
  onRemoveItem: (itemId: string) => void;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onAddNote: (itemId: string, note: string) => void;
  onSubmitOrder: () => void;
  tableNumber: number;
  onTableNumberChange: (tableNumber: number) => void;
  menuType?: 'a-la-carte' | 'buffet';
  peopleCount?: number;
  onPeopleCountChange?: (count: number) => void;
}

const OrderCart: React.FC<OrderCartProps> = ({
  items,
  onRemoveItem,
  onUpdateQuantity,
  onAddNote,
  onSubmitOrder,
  tableNumber,
  onTableNumberChange,
  menuType = 'a-la-carte',
  peopleCount = 1,
  onPeopleCountChange
}) => {
  const totalItems = items.reduce((sum, item) => {
    if (item.menuItem.category === 'Buffet Package') return sum;
    return sum + item.quantity;
  }, 0);
  
  const buffetItem = items.find(item => item.menuItem.category === 'Buffet Package');
  
  let totalPrice = 0;
  if (menuType === 'buffet' && buffetItem) {
    totalPrice = buffetItem.menuItem.price * (peopleCount || 1);
  } else {
    totalPrice = items.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0);
  }

  const isOrderButtonDisabled = () => {
    if (menuType === 'buffet') {
      return !tableNumber || tableNumber <= 0 || !peopleCount || peopleCount <= 0 || !buffetItem;
    } else {
      return !tableNumber || tableNumber <= 0 || items.length === 0;
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg" variant="primary">
          <ShoppingCart className="h-6 w-6" />
          {(totalItems > 0 || buffetItem) && (
            <Badge className="absolute -top-2 -right-2 bg-restaurant-secondary">
              {buffetItem ? (totalItems > 0 ? totalItems : '1') : totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-md w-[90vw] bg-[#fefaf3] p-0 flex flex-col">
        <div className="flex flex-col h-full max-h-screen">
          {/* Header section - fixed */}
          <div className="flex-none p-6 pb-2">
            <SheetHeader className="text-left">
              <SheetTitle className="text-xl font-bold">Your Order</SheetTitle>
              <SheetDescription>
                {menuType === 'buffet' 
                  ? "Chọn món buffet của bạn" 
                  : "Review your items before placing the order"}
              </SheetDescription>
            </SheetHeader>
            
            <div className="mt-4 mb-2">
              <Label htmlFor="tableNumber" className="text-base font-semibold">Table Number</Label>
              <div className="relative mt-2">
                <Input
                  id="tableNumber"
                  type="number"
                  value={tableNumber}
                  onChange={(e) => onTableNumberChange(parseInt(e.target.value) || 1)}
                  min={1}
                  className="pr-12 py-5 text-lg border-amber-300 rounded-lg"
                />
                <div className="absolute right-0 top-0 h-full flex flex-col border-l border-amber-300">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    className="h-1/2 px-3 text-gray-500 hover:text-gray-700"
                    onClick={() => onTableNumberChange(tableNumber + 1)}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    className="h-1/2 px-3 text-gray-500 hover:text-gray-700 border-t border-amber-300"
                    onClick={() => onTableNumberChange(Math.max(1, tableNumber - 1))}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            {menuType === 'buffet' && buffetItem && onPeopleCountChange && (
              <div className="mt-2 mb-2">
                <Label htmlFor="peopleCount" className="text-base font-semibold">Số người</Label>
                <div className="relative mt-2">
                  <Input
                    id="peopleCount"
                    type="number"
                    value={peopleCount}
                    onChange={(e) => onPeopleCountChange(parseInt(e.target.value) || 1)}
                    min={1}
                    className="pr-12 py-5 text-lg border-amber-300 rounded-lg"
                  />
                  <div className="absolute right-0 top-0 h-full flex flex-col border-l border-amber-300">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      className="h-1/2 px-3 text-gray-500 hover:text-gray-700"
                      onClick={() => onPeopleCountChange(peopleCount + 1)}
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      className="h-1/2 px-3 text-gray-500 hover:text-gray-700 border-t border-amber-300"
                      onClick={() => onPeopleCountChange(Math.max(1, peopleCount - 1))}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <Separator className="mx-6" />
          
          {/* Scrollable content area */}
          <div className="flex-grow overflow-auto px-6 py-4">
            {menuType === 'buffet' && buffetItem ? (
              <>
                <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-md">
                  <div className="font-semibold text-lg">{buffetItem.menuItem.name}</div>
                  <div className="text-sm text-gray-700 mt-1">{buffetItem.menuItem.description}</div>
                  <div className="mt-2 flex justify-between text-amber-800">
                    <span>{peopleCount} người x {buffetItem.menuItem.price.toLocaleString('vi-VN')}₫</span>
                    <span className="font-bold">{(buffetItem.menuItem.price * peopleCount).toLocaleString('vi-VN')}₫</span>
                  </div>
                </div>
                
                <div className="text-base font-semibold mb-2">Món đã chọn:</div>
                
                <div className="space-y-4">
                  {items
                    .filter(item => item.menuItem.category !== 'Buffet Package')
                    .length > 0 ? (
                    items
                      .filter(item => item.menuItem.category !== 'Buffet Package')
                      .map((item) => (
                        <div key={item.id} className="border border-amber-200 rounded-lg p-4 bg-white">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-semibold text-lg">{item.menuItem.name}</div>
                              <div className="text-sm text-gray-500">
                                Số lượng: {item.quantity}
                              </div>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => onRemoveItem(item.id)}
                            >
                              <Trash2 className="h-5 w-5" />
                            </Button>
                          </div>
                          
                          <div className="mt-3 flex items-center">
                            <div className="flex items-center border border-gray-300 rounded-md">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="h-8 px-3 text-gray-700 hover:bg-gray-100 rounded-none rounded-l-md"
                                onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="px-3 h-8 flex items-center justify-center border-x border-gray-300 min-w-[40px]">
                                {item.quantity}
                              </span>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="h-8 px-3 text-gray-700 hover:bg-gray-100 rounded-none rounded-r-md"
                                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="mt-3">
                            <Input
                              placeholder="Ghi chú đặc biệt..."
                              value={item.notes || ''}
                              onChange={(e) => onAddNote(item.id, e.target.value)}
                              className="text-sm border-amber-200 bg-amber-50/50 text-gray-600 py-5"
                            />
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="py-6 text-center text-gray-500">
                      <p>Chưa có món nào được chọn.</p>
                      <p>Chọn món từ menu để thêm vào đơn hàng.</p>
                    </div>
                  )}
                </div>
              </>
            ) : menuType === 'a-la-carte' ? (
              items.length === 0 ? (
                <div className="py-8 text-center text-gray-500">
                  Your cart is empty. Add some items to get started.
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="border border-amber-200 rounded-lg p-4 bg-white">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-semibold text-lg">{item.menuItem.name}</div>
                          <div className="text-sm text-gray-500">
                            {item.menuItem.price.toLocaleString('vi-VN')}₫ x {item.quantity}
                          </div>
                        </div>
                        <div className="font-semibold text-lg">
                          {(item.menuItem.price * item.quantity).toLocaleString('vi-VN')}₫
                        </div>
                      </div>
                      
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center border border-gray-300 rounded-md">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="h-8 px-3 text-gray-700 hover:bg-gray-100 rounded-none rounded-l-md"
                            onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="px-3 h-8 flex items-center justify-center border-x border-gray-300 min-w-[40px]">
                            {item.quantity}
                          </span>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="h-8 px-3 text-gray-700 hover:bg-gray-100 rounded-none rounded-r-md"
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => onRemoveItem(item.id)}
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                      
                      <div className="mt-3">
                        <Input
                          placeholder="Add special instructions..."
                          value={item.notes || ''}
                          onChange={(e) => onAddNote(item.id, e.target.value)}
                          className="text-sm border-amber-200 bg-amber-50/50 text-gray-600 py-5"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              <div className="py-8 text-center text-gray-500">
                <p>Please select a buffet package first.</p>
              </div>
            )}
          </div>
          
          {/* Footer with total and submit button - fixed */}
          <div className="flex-none px-6 py-4 bg-[#fefaf3] border-t border-amber-100">
            <div className="flex justify-between font-semibold text-lg mb-2">
              <span>{menuType === 'buffet' ? `Tổng tiền (${peopleCount} người)` : 'Subtotal'}</span>
              <span>{totalPrice.toLocaleString('vi-VN')}₫</span>
            </div>
            <div className="flex justify-between text-gray-600 mb-2">
              <span>{menuType === 'buffet' ? 'Thuế (10%)' : 'Tax'}</span>
              <span>{(totalPrice * 0.1).toLocaleString('vi-VN')}₫</span>
            </div>
            <Separator className="my-4" />
            <div className="flex justify-between font-bold text-xl mb-4">
              <span>{menuType === 'buffet' ? 'Thành tiền' : 'Total'}</span>
              <span>{(totalPrice * 1.1).toLocaleString('vi-VN')}₫</span>
            </div>
            
            <Button 
              variant="primary" 
              className="w-full py-6 text-base"
              onClick={onSubmitOrder}
              disabled={isOrderButtonDisabled()}
            >
              <Send className="mr-2 h-5 w-5" />
              {menuType === 'buffet' ? 'Đặt món' : 'Place Order'}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default OrderCart;
