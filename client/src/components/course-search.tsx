import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Search, Filter, X, SlidersHorizontal } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription,
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';

export interface SearchFilters {
  query: string;
  category: string;
  level: string;
  priceRange: [number, number];
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface CourseSearchProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onSearch: (filters: SearchFilters) => void;
  categories: string[];
  totalResults?: number;
}

const LEVELS = ['All Levels', 'Beginner', 'Intermediate', 'Advanced'];
const SORT_OPTIONS = [
  { value: 'title', label: 'Title' },
  { value: 'createdAt', label: 'Date Created' },
  { value: 'price', label: 'Price' },
  { value: 'level', label: 'Level' },
  { value: 'duration', label: 'Duration' }
];

export default function CourseSearch({
  filters,
  onFiltersChange,
  onSearch,
  categories,
  totalResults
}: CourseSearchProps) {
  const [localFilters, setLocalFilters] = useState(filters);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(localFilters);
  };

  const updateFilter = <K extends keyof SearchFilters>(
    key: K,
    value: SearchFilters[K]
  ) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const defaultFilters: SearchFilters = {
      query: '',
      category: '',
      level: '',
      priceRange: [0, 1000],
      sortBy: 'createdAt',
      sortOrder: 'desc'
    };
    setLocalFilters(defaultFilters);
    onFiltersChange(defaultFilters);
    onSearch(defaultFilters);
  };

  const hasActiveFilters = 
    localFilters.query || 
    localFilters.category || 
    localFilters.level || 
    localFilters.priceRange[0] > 0 || 
    localFilters.priceRange[1] < 1000;

  const getActiveFilterCount = () => {
    let count = 0;
    if (localFilters.query) count++;
    if (localFilters.category) count++;
    if (localFilters.level) count++;
    if (localFilters.priceRange[0] > 0 || localFilters.priceRange[1] < 1000) count++;
    return count;
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        {/* Main Search Bar */}
        <form onSubmit={handleSearchSubmit} className="space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                data-testid="input-course-search"
                placeholder="Search courses by title, description, or instructor..."
                value={localFilters.query}
                onChange={(e) => updateFilter('query', e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Quick Filters */}
            <Select 
              value={localFilters.category} 
              onValueChange={(value) => updateFilter('category', value)}
            >
              <SelectTrigger data-testid="select-category" className="w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select 
              value={localFilters.level} 
              onValueChange={(value) => updateFilter('level', value)}
            >
              <SelectTrigger data-testid="select-level" className="w-40">
                <SelectValue placeholder="All Levels" />
              </SelectTrigger>
              <SelectContent>
                {LEVELS.map((level) => (
                  <SelectItem key={level} value={level === 'All Levels' ? '' : level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Dialog open={showAdvanced} onOpenChange={setShowAdvanced}>
              <DialogTrigger asChild>
                <Button 
                  type="button" 
                  variant="outline" 
                  data-testid="button-advanced-filters"
                  className="relative"
                >
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Filters
                  {getActiveFilterCount() > 0 && (
                    <Badge 
                      className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                      variant="default"
                    >
                      {getActiveFilterCount()}
                    </Badge>
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Advanced Filters</DialogTitle>
                  <DialogDescription>
                    Refine your course search with additional filters
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6">
                  {/* Price Range */}
                  <div>
                    <label className="text-sm font-medium mb-3 block">
                      Price Range: ${localFilters.priceRange[0]} - ${localFilters.priceRange[1]}
                    </label>
                    <Slider
                      data-testid="slider-price-range"
                      value={localFilters.priceRange}
                      onValueChange={(value) => updateFilter('priceRange', value as [number, number])}
                      max={1000}
                      min={0}
                      step={10}
                      className="w-full"
                    />
                  </div>

                  {/* Sort Options */}
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="text-sm font-medium mb-2 block">Sort By</label>
                      <Select 
                        value={localFilters.sortBy} 
                        onValueChange={(value) => updateFilter('sortBy', value)}
                      >
                        <SelectTrigger data-testid="select-sort-by">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {SORT_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex-1">
                      <label className="text-sm font-medium mb-2 block">Order</label>
                      <Select 
                        value={localFilters.sortOrder} 
                        onValueChange={(value) => updateFilter('sortOrder', value as 'asc' | 'desc')}
                      >
                        <SelectTrigger data-testid="select-sort-order">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="asc">Ascending</SelectItem>
                          <SelectItem value="desc">Descending</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => setShowAdvanced(false)}
                      className="flex-1"
                      data-testid="button-apply-filters"
                    >
                      Apply Filters
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={clearFilters}
                      data-testid="button-clear-filters"
                    >
                      Clear All
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button type="submit" data-testid="button-search">
              Search
            </Button>
          </div>
        </form>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mt-4">
            {localFilters.query && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <span>Search: "{localFilters.query}"</span>
                <X 
                  className="w-3 h-3 cursor-pointer hover:text-red-500" 
                  onClick={() => updateFilter('query', '')}
                />
              </Badge>
            )}
            
            {localFilters.category && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <span>Category: {localFilters.category}</span>
                <X 
                  className="w-3 h-3 cursor-pointer hover:text-red-500" 
                  onClick={() => updateFilter('category', '')}
                />
              </Badge>
            )}
            
            {localFilters.level && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <span>Level: {localFilters.level}</span>
                <X 
                  className="w-3 h-3 cursor-pointer hover:text-red-500" 
                  onClick={() => updateFilter('level', '')}
                />
              </Badge>
            )}
            
            {(localFilters.priceRange[0] > 0 || localFilters.priceRange[1] < 1000) && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <span>Price: ${localFilters.priceRange[0]} - ${localFilters.priceRange[1]}</span>
                <X 
                  className="w-3 h-3 cursor-pointer hover:text-red-500" 
                  onClick={() => updateFilter('priceRange', [0, 1000])}
                />
              </Badge>
            )}
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearFilters}
              className="text-gray-500 hover:text-red-500"
              data-testid="button-clear-all-filters"
            >
              Clear All
            </Button>
          </div>
        )}

        {/* Results Count */}
        {typeof totalResults !== 'undefined' && (
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400" data-testid="text-results-count">
            {totalResults === 0 ? 'No courses found' : `Found ${totalResults} course${totalResults !== 1 ? 's' : ''}`}
            {hasActiveFilters && ' matching your criteria'}
          </div>
        )}
      </CardContent>
    </Card>
  );
}