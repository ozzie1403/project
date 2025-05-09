import React from 'react';
import { Expense } from '../../context/ExpenseContext';
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

interface ExpenseSummaryCardProps {
  expenses: Expense[];
}

const ExpenseSummaryCard: React.FC<ExpenseSummaryCardProps> = ({ expenses }) => {
  // Map categories to icons
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'food':
        return <Utensils className="h-4 w-4" />;
      case 'housing':
        return <Home className="h-4 w-4" />;
      case 'transportation':
        return <Car className="h-4 w-4" />;
      case 'entertainment':
        return <Tv className="h-4 w-4" />;
      case 'healthcare':
        return <Heart className="h-4 w-4" />;
      case 'education':
        return <GraduationCap className="h-4 w-4" />;
      case 'shopping':
        return <ShoppingCart className="h-4 w-4" />;
      case 'personal':
        return <User className="h-4 w-4" />;
      default:
        return <CircleDashed className="h-4 w-4" />;
    }
  };

  // Map categories to colors
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'food':
        return 'bg-accent-400';
      case 'housing':
        return 'bg-primary-600';
      case 'transportation':
        return 'bg-secondary-700';
      case 'entertainment':
        return 'bg-success-500';
      case 'healthcare':
        return 'bg-error-500';
      case 'education':
        return 'bg-secondary-500';
      case 'shopping':
        return 'bg-primary-400';
      case 'personal':
        return 'bg-accent-600';
      default:
        return 'bg-gray-400';
    }
  };

  // Calculate total spent for each category
  const spendingByCategory = expenses.reduce((acc: Record<string, number>, expense) => {
    if (!acc[expense.category]) {
      acc[expense.category] = 0;
    }
    acc[expense.category] += expense.amount;
    return acc;
  }, {});

  // Calculate total spent
  const totalSpent = expenses.reduce((acc, expense) => acc + expense.amount, 0);

  // Sort categories by amount
  const sortedCategories = Object.keys(spendingByCategory).sort(
    (a, b) => spendingByCategory[b] - spendingByCategory[a]
  );

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow duration-300">
      <h2 className="text-xl font-display font-semibold text-gray-800 mb-4">
        Expense Summary
      </h2>
      
      <div className="space-y-4">
        {sortedCategories.length > 0 ? (
          sortedCategories.map((category) => {
            const amount = spendingByCategory[category];
            const percentage = totalSpent > 0 ? (amount / totalSpent) * 100 : 0;
            
            return (
              <div key={category} className="space-y-1">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className={`${getCategoryColor(category)} p-1.5 rounded-md text-white mr-2`}>
                      {getCategoryIcon(category)}
                    </div>
                    <span className="capitalize text-gray-700">{category}</span>
                  </div>
                  <span className="font-medium text-gray-900">{formatCurrency(amount)}</span>
                </div>
                
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className={`${getCategoryColor(category)} h-2 rounded-full`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                
                <p className="text-xs text-gray-500 text-right">{percentage.toFixed(1)}% of total</p>
              </div>
            );
          })
        ) : (
          <div className="text-center py-6 text-gray-500">
            <ShoppingBag className="h-10 w-10 mx-auto text-gray-300 mb-2" />
            <p>No expenses recorded yet</p>
            <p className="text-sm">Add expenses to see your spending breakdown</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseSummaryCard;