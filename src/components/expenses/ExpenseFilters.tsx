import React from 'react';
import { ExpenseCategory } from '../../context/ExpenseContext';
import { 
  ShoppingBag, 
  Home, 
  Car, 
  Utensils, 
  Tv, 
  Heart,
  GraduationCap,
  ShoppingCart,
  User,
  CircleDashed
} from 'lucide-react';

interface ExpenseFiltersProps {
  selectedCategory: ExpenseCategory | 'all';
  setSelectedCategory: (category: ExpenseCategory | 'all') => void;
}

const ExpenseFilters: React.FC<ExpenseFiltersProps> = ({ 
  selectedCategory, 
  setSelectedCategory 
}) => {
  // Category definitions with icons
  const categories = [
    { value: 'all', label: 'All Categories', icon: <ShoppingBag className="w-4 h-4" /> },
    { value: 'food', label: 'Food', icon: <Utensils className="w-4 h-4" /> },
    { value: 'transportation', label: 'Transportation', icon: <Car className="w-4 h-4" /> },
    { value: 'housing', label: 'Housing', icon: <Home className="w-4 h-4" /> },
    { value: 'utilities', label: 'Utilities', icon: <Home className="w-4 h-4" /> },
    { value: 'entertainment', label: 'Entertainment', icon: <Tv className="w-4 h-4" /> },
    { value: 'healthcare', label: 'Healthcare', icon: <Heart className="w-4 h-4" /> },
    { value: 'education', label: 'Education', icon: <GraduationCap className="w-4 h-4" /> },
    { value: 'shopping', label: 'Shopping', icon: <ShoppingCart className="w-4 h-4" /> },
    { value: 'personal', label: 'Personal', icon: <User className="w-4 h-4" /> },
    { value: 'other', label: 'Other', icon: <CircleDashed className="w-4 h-4" /> },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 animate-slide-up">
      <h3 className="text-sm font-medium text-gray-700 mb-3">Filter by Category</h3>
      
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.value}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-sm transition-colors ${
              selectedCategory === category.value
                ? 'bg-primary-100 text-primary-800 border border-primary-200'
                : 'bg-gray-100 text-gray-700 border border-gray-100 hover:bg-gray-200'
            }`}
            onClick={() => setSelectedCategory(category.value as ExpenseCategory | 'all')}
          >
            {category.icon}
            <span>{category.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ExpenseFilters;