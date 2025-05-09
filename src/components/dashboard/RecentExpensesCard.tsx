import React from 'react';
import { MoreVertical } from 'lucide-react';
import { Expense } from '../../context/ExpenseContext';

interface RecentExpensesCardProps {
  expenses: Expense[];
}

const RecentExpensesCard: React.FC<RecentExpensesCardProps> = ({ expenses }) => {
  // Sort expenses by date (latest first)
  const sortedExpenses = [...expenses].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  ).slice(0, 5);

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
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow duration-300">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-display font-semibold text-gray-800">
          Recent Expenses
        </h2>
        <button className="text-gray-400 hover:text-gray-600 transition-colors">
          <MoreVertical className="h-5 w-5" />
        </button>
      </div>
      
      <div className="space-y-4">
        {sortedExpenses.length > 0 ? (
          sortedExpenses.map((expense) => (
            <div 
              key={expense.id}
              className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <div>
                <h3 className="font-medium text-gray-800 capitalize">
                  {expense.description || expense.category}
                </h3>
                <p className="text-xs text-gray-500">{formatDate(expense.date)}</p>
              </div>
              <span className="font-semibold text-gray-900">
                {formatCurrency(expense.amount)}
              </span>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No recent expenses</p>
            <p className="text-sm">Your latest expenses will appear here</p>
          </div>
        )}
        
        {sortedExpenses.length > 0 && (
          <button className="w-full py-2 text-center text-primary-600 hover:text-primary-700 transition-colors font-medium text-sm">
            View All Expenses
          </button>
        )}
      </div>
    </div>
  );
};

export default RecentExpensesCard;