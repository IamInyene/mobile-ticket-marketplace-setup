
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Filter, X, Calendar as CalendarIcon, MapPin, DollarSign } from 'lucide-react';
import { EVENT_CATEGORIES, TicketSearchParams } from '@/types/database';
import { format } from 'date-fns';

interface SearchFiltersProps {
  filters: TicketSearchParams;
  onFiltersChange: (filters: Partial<TicketSearchParams>) => void;
  totalCount: number;
}

export const SearchFilters = ({ filters, onFiltersChange, totalCount }: SearchFiltersProps) => {
  const [priceRange, setPriceRange] = useState<[number, number]>([
    filters.min_price || 0,
    filters.max_price || 1000
  ]);
  const [startDate, setStartDate] = useState<Date | undefined>(
    filters.start_date ? new Date(filters.start_date) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    filters.end_date ? new Date(filters.end_date) : undefined
  );

  const activeFiltersCount = [
    filters.event_category,
    filters.min_price,
    filters.max_price,
    filters.event_city,
    filters.event_state,
    filters.start_date,
    filters.end_date
  ].filter(Boolean).length;

  const clearAllFilters = () => {
    onFiltersChange({
      event_category: undefined,
      min_price: undefined,
      max_price: undefined,
      event_city: undefined,
      event_state: undefined,
      start_date: undefined,
      end_date: undefined
    });
    setPriceRange([0, 1000]);
    setStartDate(undefined);
    setEndDate(undefined);
  };

  const applyPriceFilter = () => {
    onFiltersChange({
      min_price: priceRange[0] > 0 ? priceRange[0] : undefined,
      max_price: priceRange[1] < 1000 ? priceRange[1] : undefined
    });
  };

  const applyDateFilter = () => {
    onFiltersChange({
      start_date: startDate?.toISOString(),
      end_date: endDate?.toISOString()
    });
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Category</Label>
        <Select
          value={filters.event_category || ''}
          onValueChange={(value) => onFiltersChange({ event_category: value || undefined })}
        >
          <SelectTrigger>
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All categories</SelectItem>
            {EVENT_CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price Range Filter */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Price Range</Label>
        <div className="px-2">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={1000}
            min={0}
            step={10}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={applyPriceFilter}>
          Apply Price Filter
        </Button>
      </div>

      {/* Location Filter */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Location</Label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            placeholder="City"
            value={filters.event_city || ''}
            onChange={(e) => onFiltersChange({ event_city: e.target.value || undefined })}
          />
          <Input
            placeholder="State"
            value={filters.event_state || ''}
            onChange={(e) => onFiltersChange({ event_state: e.target.value || undefined })}
          />
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Date Range</Label>
        <div className="grid grid-cols-2 gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, 'MMM dd') : 'Start date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, 'MMM dd') : 'End date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <Button variant="outline" size="sm" onClick={applyDateFilter}>
          Apply Date Filter
        </Button>
      </div>

      {/* Sort Options */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Sort By</Label>
        <Select
          value={`${filters.sort_by}-${filters.sort_order}`}
          onValueChange={(value) => {
            const [sort_by, sort_order] = value.split('-');
            onFiltersChange({ sort_by: sort_by as any, sort_order: sort_order as any });
          }}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="price-ASC">Price: Low to High</SelectItem>
            <SelectItem value="price-DESC">Price: High to Low</SelectItem>
            <SelectItem value="date-ASC">Date: Earliest First</SelectItem>
            <SelectItem value="date-DESC">Date: Latest First</SelectItem>
            <SelectItem value="created_at-DESC">Newest Listings</SelectItem>
            <SelectItem value="created_at-ASC">Oldest Listings</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Clear Filters */}
      {activeFiltersCount > 0 && (
        <Button variant="outline" onClick={clearAllFilters} className="w-full">
          Clear All Filters ({activeFiltersCount})
        </Button>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile Filter Sheet */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="relative">
              <Filter className="w-4 h-4 mr-2" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge variant="destructive" className="absolute -top-2 -right-2 w-5 h-5 p-0 text-xs">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh]">
            <SheetHeader>
              <SheetTitle>Filter Results ({totalCount} tickets)</SheetTitle>
            </SheetHeader>
            <div className="mt-6 overflow-y-auto">
              <FilterContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Filter Card */}
      <div className="hidden md:block">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <Badge variant="secondary">{activeFiltersCount} active</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FilterContent />
          </CardContent>
        </Card>
      </div>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.event_category && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {filters.event_category}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => onFiltersChange({ event_category: undefined })}
              />
            </Badge>
          )}
          {(filters.min_price || filters.max_price) && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <DollarSign className="w-3 h-3" />
              ${filters.min_price || 0} - ${filters.max_price || '∞'}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => onFiltersChange({ min_price: undefined, max_price: undefined })}
              />
            </Badge>
          )}
          {(filters.event_city || filters.event_state) && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <MapPin className="w-3 