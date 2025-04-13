
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { UserRole } from "@/models/types";
import { ChefHat, ClipboardList, UserCircle, BarChart3 } from "lucide-react";

interface RoleSelectorProps {
  onSelectRole?: (role: UserRole) => void;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ onSelectRole }) => {
  const roles = [
    { 
      id: 'customer', 
      name: 'Customer', 
      description: 'Browse menu and place orders',
      icon: <UserCircle className="h-12 w-12 mb-2 text-restaurant-primary" />,
      path: '/customer'
    },
    { 
      id: 'waiter', 
      name: 'Waiter', 
      description: 'Manage tables and orders',
      icon: <ClipboardList className="h-12 w-12 mb-2 text-restaurant-primary" />,
      path: '/waiter'
    },
    { 
      id: 'kitchen', 
      name: 'Kitchen Staff', 
      description: 'View and process food orders',
      icon: <ChefHat className="h-12 w-12 mb-2 text-restaurant-primary" />,
      path: '/kitchen'
    },
    { 
      id: 'manager', 
      name: 'Manager', 
      description: 'View reports and analytics',
      icon: <BarChart3 className="h-12 w-12 mb-2 text-restaurant-primary" />,
      path: '/manager'
    },
  ];

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-restaurant-secondary">Restaurant Order Management System</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
        {roles.map((role) => (
          <Card key={role.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="flex justify-center">{role.icon}</div>
              <CardTitle>{role.name}</CardTitle>
              <CardDescription>{role.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Link to={role.path}>
                <Button 
                  className="bg-restaurant-primary hover:bg-restaurant-primary/90"
                  onClick={() => onSelectRole?.(role.id as UserRole)}
                >
                  Enter as {role.name}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RoleSelector;
