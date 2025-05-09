import React from 'react';
import { DollarSign } from 'lucide-react';

const BudgetStatusCard: React.FC = () => {
  // Mockup budget data
  const budget = 2500;
  const spent = 1680;
  const remaining = budget - spent;
  const percentUsed = (spent / budget) * 100;
  
  // Determine progress bar color based on percentage
  const getProgressColor = (percent: number) => {
    if (percent < 50) return 'bg-success-500';
    if (percent < 75) return 'bg-accent-500';
    return 'bg-error-500';
  };

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
      <div className="flex items-center space-x-3 mb-4">
        <div className="bg-primary-100 p-2 rounded-full">
          <DollarSign className="h-6 w-6 text-primary-600" />
        </div>
        <h2 className="text-xl font-display font-semibold text-gray-800">
          Monthly Budget
        </h2>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-gray-500 text-sm">Used</span>
          <span className="text-gray-700 text-sm font-medium">{percentUsed.toFixed(0)}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3">
          <div
            className={`${getProgressColor(percentUsed)} h-3 rounded-full transition-all duration-500`}
            style={{ width: `${percentUsed}%` }}
          ></div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-sm">Total Budget</p>
          <p className="text-xl font-display font-semibold text-gray-800">
            {formatCurrency(budget)}
          </p>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-sm">Remaining</p>
          <p className={`text-xl font-display font-semibold ${
            remaining < budget * 0.2 ? 'text-error-600' : 'text-success-600'
          }`}>
            {formatCurrency(remaining)}
          </p>
        </div>
      </div>
      
      <button className="w-full mt-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200 font-medium text-sm flex items-center justify-center">
        <span>Adjust Budget</span>
      </button>
    </div>
  );
};

export default BudgetStatusCard;