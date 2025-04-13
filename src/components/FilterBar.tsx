
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OrderStatus } from '@/models/types';
import { Search, Filter } from 'lucide-react';

interface FilterBarProps {
  onSearch: (term: string) => void;
  onStatusFilter: (status: OrderStatus | 'all') => void;
  onTableFilter: (table: number | null) => void;
  searchTerm: string;
  selectedStatus: OrderStatus | 'all';
  selectedTable: number | null;
}

const FilterBar: React.FC<FilterBarProps> = ({
  onSearch,
  onStatusFilter,
  onTableFilter,
  searchTerm,
  selectedStatus,
  selectedTable
}) => {
  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'cooking', label: 'Cooking' },
    { value: 'ready', label: 'Ready' },
    { value: 'served', label: 'Served' },
    { value: 'paid', label: 'Paid' }
  ];

  // Generate 1-20 table numbers
  const tableOptions = Array.from({ length: 20 }, (_, i) => ({ value: i + 1, label: `Table ${i + 1}` }));

  return (
    <div className="flex flex-col sm:flex-row gap-2 mb-4 p-2 bg-white rounded-lg shadow-sm">
      <div className="relative flex-grow">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search orders..."
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
          className="pl-8"
        />
      </div>
      
      <Select
        value={selectedStatus}
        onValueChange={(value) => onStatusFilter(value as OrderStatus | 'all')}
      >
        <SelectTrigger className="w-full sm:w-[180px]">
          <Filter className="h-4 w-4 mr-2" />
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Select
        value={selectedTable?.toString() || 'all'}
        onValueChange={(value) => onTableFilter(value === 'all' ? null : parseInt(value))}
      >
        <SelectTrigger className="w-full sm:w-[150px]">
          <SelectValue placeholder="Filter by table" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Tables</SelectItem>
          {tableOptions.map((option) => (
            <SelectItem key={option.value} value={option.value.toString()}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Button 
        variant="outline" 
        onClick={() => {
          onSearch('');
          onStatusFilter('all');
          onTableFilter(null);
        }}
        className="whitespace-nowrap"
      >
        Clear Filters
      </Button>
    </div>
  );
};

export default FilterBar;
