import React from 'react';
import { 
  ShoppingBag, 
  Info,
  RefreshCw,
  Calendar, 
  Tag
} from 'lucide-react';
import { Expense } from '../../context/ExpenseContext';

interface ExpensesListProps {
  expenses: Expense[];
  isLoading: boolean;
  error: string | null;
}

const ExpensesList: React.FC<ExpensesListProps> = ({ expenses, isLoading, error }) => {
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Get category icon color
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

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-100 text-center">
        <RefreshCw className="h-10 w-10 mx-auto text-primary-500 animate-spin mb-4" />
        <p className="text-gray-600">Loading expenses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-100 text-center">
        <Info className="h-10 w-10 mx-auto text-error-500 mb-4" />
        <p className="text-error-600 font-medium mb-2">Error loading expenses</p>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-100 text-center">
        <ShoppingBag className="h-16 w-16 mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-700 mb-2">No expenses found</h3>
        <p className="text-gray-500 mb-6">Start tracking your spending by adding your first expense</p>
        <button className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200">
          Add Your First Expense
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      {/* Table Header - Visible on md screens and larger */}
      <div className="hidden md:grid md:grid-cols-5 bg-gray-50 p-4 border-b border-gray-200">
        <div className="text-sm font-medium text-gray-500">Date</div>
        <div className="text-sm font-medium text-gray-500">Category</div>
        <div className="text-sm font-medium text-gray-500 col-span-2">Description</div>
        <div className="text-sm font-medium text-gray-500 text-right">Amount</div>
      </div>
      
      {/* Expenses */}
      <div className="divide-y divide-gray-100">
        {expenses.map((expense) => (
          <div 
            key={expense.id}
            className="p-4 hover:bg-gray-50 transition-colors duration-150"
          >
            {/* Mobile View */}
            <div className="md:hidden space-y-2">
              <div className="flex justify-between items-start">
                <span className="capitalize font-medium text-gray-800">
                  {expense.description || expense.category}
                </span>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(expense.amount)}
                </span>
              </div>
              
              <div className="flex items-center text-sm text-gray-500 space-x-4">
                <div className="flex items-center">
                  <Calendar className="h-3.5 w-3.5 mr-1" />
                  <span>{formatDate(expense.date)}</span>
                </div>
                <div className="flex items-center">
                  <Tag className="h-3.5 w-3.5 mr-1" />
                  <span className="capitalize">{expense.category}</span>
                </div>
              </div>
            </div>
            
            {/* Desktop View */}
            <div className="hidden md:grid md:grid-cols-5 md:items-center">
              <div className="text-sm text-gray-600">
                {formatDate(expense.date)}
              </div>
              <div className="text-sm text-gray-600">
                <div className="flex items-center">
                  <div className={`${getCategoryColor(expense.category)} h-2 w-2 rounded-full mr-2`}></div>
                  <span className="capitalize">{expense.category}</span>
                </div>
              </div>
              <div className="text-sm text-gray-800 font-medium col-span-2">
                {expense.description || <span className="text-gray-400 italic">No description</span>}
              </div>
              <div className="text-right font-semibold">
                {formatCurrency(expense.amount)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpensesList;