import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface ComparisonType {
  type: 'up' | 'down';
  value: number;
}

interface SpendingOverviewCardProps {
  title: string;
  amount: number;
  text?: string;
  icon: React.ReactNode;
  iconBg: string;
  comparison?: ComparisonType;
}

const SpendingOverviewCard: React.FC<SpendingOverviewCardProps> = ({
  title,
  amount,
  text,
  icon,
  iconBg,
  comparison,
}) => {
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
    <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100 transform transition-all duration-200 hover:shadow-md hover:-translate-y-1">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
          <div className="mt-2 flex items-baseline">
            <p className="text-2xl font-display font-semibold text-gray-800">
              {formatCurrency(amount)}
            </p>
            {text && (
              <span className="ml-2 text-sm text-gray-500 capitalize">{text}</span>
            )}
          </div>
        </div>
        <div className={`${iconBg} p-3 rounded-full text-white`}>
          {icon}
        </div>
      </div>
      
      {comparison && (
        <div className="mt-4 flex items-center">
          <span
            className={`flex items-center text-sm ${
              comparison.type === 'up' ? 'text-success-600' : 'text-error-600'
            }`}
          >
            {comparison.type === 'up' ? (
              <TrendingUp className="w-4 h-4 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 mr-1" />
            )}
            {comparison.value}%
          </span>
          <span className="text-gray-500 text-sm ml-1">vs last month</span>
        </div>
      )}
    </div>
  );
};

export default SpendingOverviewCard;