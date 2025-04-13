
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, MinusCircle, ImageIcon } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { MenuItem } from '@/models/types';

interface MenuItemCardProps {
  item: MenuItem;
  onAddToOrder: (item: MenuItem) => void;
  quantity?: number;
  onIncrease?: () => void;
  onDecrease?: () => void;
  inOrder?: boolean;
  menuType?: 'a-la-carte' | 'buffet';
  buffetOption?: string;
  compact?: boolean;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ 
  item, 
  onAddToOrder, 
  quantity = 0, 
  onIncrease, 
  onDecrease,
  inOrder = false,
  menuType = 'a-la-carte',
  buffetOption = '',
  compact = false
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Format price in VND format
  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN') + ' ₫';
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  // Different button text and behavior based on menu type
  const getButtonText = () => {
    if (menuType === 'buffet') {
      return "Chọn món";
    }
    return "Thêm vào giỏ";
  };

  // For buffet cards (when the item represents a buffet package)
  const isBuffetPackage = item.category === 'Buffet Package';

  // For compact view (used in kitchen view)
  if (compact) {
    return (
      <Card className="menu-item-compact overflow-hidden shadow-sm border-l-4 border-l-amber-500">
        <CardContent className="p-3 flex justify-between items-center">
          <div>
            <h4 className="font-semibold text-sm">{item.name}</h4>
            {item.notes && (
              <p className="text-xs text-gray-500 italic mt-1">{item.notes}</p>
            )}
          </div>
          <div className="flex items-center">
            <Badge variant="outline" className="mr-2">x{quantity}</Badge>
            <Badge className={`
              ${item.status === 'pending' ? 'bg-amber-500' : ''}
              ${item.status === 'cooking' ? 'bg-orange-500' : ''}
              ${item.status === 'ready' ? 'bg-green-500' : ''}
              ${item.status === 'served' ? 'bg-blue-500' : ''}
            `}>
              {item.status}
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`menu-item overflow-hidden h-full flex flex-col shadow-md hover:shadow-lg transition-shadow ${isBuffetPackage ? 'border-amber-400 border-2' : ''}`}>
      <div className="w-full h-48 overflow-hidden relative">
        {item.image && !imageError ? (
          <>
            {!imageLoaded && <Skeleton className="absolute inset-0" />}
            <img 
              src={item.image} 
              alt={item.name} 
              className={`w-full h-full object-cover transition-transform hover:scale-105 duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              loading="lazy"
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <ImageIcon className="h-16 w-16 text-gray-400" />
          </div>
        )}
        
        {/* Show price badge for à-la-carte items and buffet packages */}
        {(menuType === 'a-la-carte' || isBuffetPackage) && (
          <Badge variant="secondary" className="absolute top-3 right-3 bg-amber-500 text-white font-bold px-3 py-1 rounded-full">
            {formatPrice(item.price)}
          </Badge>
        )}

        {/* Special badge for active buffet option */}
        {isBuffetPackage && buffetOption === item.name && (
          <Badge variant="secondary" className="absolute top-3 left-3 bg-green-600 text-white font-bold px-3 py-1 rounded-full">
            Đã chọn
          </Badge>
        )}
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold text-amber-800">{item.name}</CardTitle>
        <CardDescription className="text-sm text-gray-600 line-clamp-2">
          {item.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="py-0 flex-grow">
        {!item.available && (
          <Badge variant="destructive" className="mt-2">
            Hết hàng
          </Badge>
        )}
        {menuType === 'buffet' && !isBuffetPackage && item.available && (
          <Badge variant="outline" className="mt-2 bg-green-50 text-green-800 border-green-300">
            Buffet
          </Badge>
        )}

        {/* If item is a buffet package, show price per person */}
        {isBuffetPackage && (
          <p className="mt-2 text-sm text-gray-600">{formatPrice(item.price)}/người</p>
        )}
      </CardContent>
      <CardFooter className="pt-2">
        {inOrder ? (
          <div className="flex items-center justify-between w-full">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={onDecrease}
              disabled={!item.available || quantity <= 0}
              className="text-amber-700 border-amber-300 hover:bg-amber-50"
            >
              <MinusCircle className="h-4 w-4" />
            </Button>
            <span className="mx-2 font-medium">{quantity}</span>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={onIncrease}
              disabled={!item.available}
              className="text-amber-700 border-amber-300 hover:bg-amber-50"
            >
              <PlusCircle className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button 
            onClick={() => onAddToOrder(item)} 
            className="w-full bg-amber-500 hover:bg-amber-600 text-white" 
            disabled={!item.available || (isBuffetPackage && buffetOption === item.name)}
          >
            {isBuffetPackage ? (buffetOption === item.name ? "Đã chọn" : "Chọn gói") : getButtonText()}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default MenuItemCard;
