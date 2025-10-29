
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Category } from '@/types/blog';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string | null) => void;
}

export function CategoryFilter({ categories, selectedCategory, onCategorySelect }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <Badge
        variant={selectedCategory === null ? "default" : "outline"}
        className="cursor-pointer hover:bg-blue-50 transition-colors px-4 py-2"
        onClick={() => onCategorySelect(null)}
      >
        All Categories
      </Badge>
      {categories.map((category) => (
        <Badge
          key={category.id}
          variant={selectedCategory === category.id ? "default" : "outline"}
          className="cursor-pointer hover:bg-blue-50 transition-colors px-4 py-2"
          onClick={() => onCategorySelect(category.id)}
        >
          {category.name} ({category.post_count})
        </Badge>
      ))}
    </div>
  );
}
