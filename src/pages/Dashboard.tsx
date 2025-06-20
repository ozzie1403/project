import React, { useEffect, useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  ShoppingBag,
  Home,
  Utensils,
  Car,
  Tv,
  Shield,
  BookOpen,
  Calendar
} from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import SpendingOverviewCard from '../components/dashboard/SpendingOverviewCard';
import ExpenseSummaryCard from '../components/dashboard/ExpenseSummaryCard';
import RecentExpensesCard from '../components/dashboard/RecentExpensesCard';
import BudgetStatusCard from '../components/dashboard/BudgetStatusCard';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const Dashboard: React.FC = () => {
  const { state } = useExpenses();
  const { expenses } = state;

  // Analytics state
  const [analytics, setAnalytics] = useState<{ breakdown: any, topCategories: any[], suggestion: string } | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setAnalyticsLoading(true);
      try {
        const res = await fetch('http://localhost:3001/api/analytics');
        const data = await res.json();
        setAnalytics(data);
      } catch {
        setAnalytics(null);
      } finally {
        setAnalyticsLoading(false);
      }
    };
    fetchAnalytics();
  }, [expenses]);

  // Calculate total spent
  const totalSpent = expenses.reduce((acc, expense) => acc + expense.amount, 0);
  
  // Calculate spending by category
  const spendingByCategory = expenses.reduce((acc: Record<string, number>, expense) => {
    if (!acc[expense.category]) {
      acc[expense.category] = 0;
    }
    acc[expense.category] += expense.amount;
    return acc;
  }, {});

  // Prepare data for doughnut chart
  const doughnutData = {
    labels: Object.keys(spendingByCategory).map(category => 
      category.charAt(0).toUpperCase() + category.slice(1)
    ),
    datasets: [
      {
        data: Object.values(spendingByCategory),
        backgroundColor: [
          '#0d9488', // primary-600
          '#1e40af', // secondary-800
          '#f59e0b', // accent-500
          '#22c55e', // success-500
          '#f97316', // warning-500
          '#ef4444', // error-500
          '#6366f1', // indigo-500
          '#8b5cf6', // violet-500
          '#ec4899', // pink-500
          '#94a3b8', // slate-400
        ],
        borderColor: [
          '#ffffff',
        ],
        borderWidth: 2,
      },
    ],
  };

  // Get month names for the bar chart
  const getLastSixMonths = () => {
    const months = [];
    const today = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
      months.push(month.toLocaleString('default', { month: 'short' }));
    }
    
    return months;
  };

  // Prepare data for bar chart
  const barData = {
    labels: getLastSixMonths(),
    datasets: [
      {
        label: 'Monthly Spending',
        data: [1240, 1580, 1350, 1420, 1680, totalSpent],
        backgroundColor: '#0d9488',
      },
    ],
  };

  // Chart options
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  // Download PDF report
  const handleDownloadReport = async () => {
    const res = await fetch('http://localhost:3001/api/reports/monthly');
    if (!res.ok) return;
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'SmartSpend_Monthly_Report.pdf';
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <header>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-800">Financial Dashboard</h1>
        <p className="text-gray-500 mt-1">Track, analyze, and improve your spending habits</p>
      </header>

      <div className="flex justify-end mb-2">
        <button
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors"
          onClick={handleDownloadReport}
        >
          Download PDF Report
        </button>
      </div>

      {/* Analytics & Suggestions Card */}
      <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
        <h2 className="text-lg font-semibold mb-2">Advanced Analytics</h2>
        {analyticsLoading ? (
          <p className="text-gray-500">Loading analytics...</p>
        ) : analytics ? (
          <>
            <div className="mb-3">
              <h3 className="font-medium text-gray-700 mb-1">Spending Breakdown (This Month)</h3>
              <ul className="list-disc ml-6 text-gray-700 text-sm">
                {Object.entries(analytics.breakdown).map(([cat, amt]) => (
                  <li key={cat}><span className="capitalize font-semibold">{cat}:</span> £{(amt as number).toFixed(2)}</li>
                ))}
              </ul>
            </div>
            <div className="mb-3">
              <h3 className="font-medium text-gray-700 mb-1">Top 3 Categories</h3>
              <ol className="list-decimal ml-6 text-gray-700 text-sm">
                {analytics.topCategories.map((c, i) => (
                  <li key={c.category}><span className="capitalize font-semibold">{c.category}</span>: £{c.amount.toFixed(2)}</li>
                ))}
              </ol>
            </div>
            <div className="mb-1">
              <h3 className="font-medium text-gray-700 mb-1">Automated Savings Suggestion</h3>
              <p className="text-green-700 text-sm">{analytics.suggestion}</p>
            </div>
          </>
        ) : (
          <p className="text-error-600">Failed to load analytics.</p>
        )}
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <SpendingOverviewCard
          title="Monthly Spending"
          amount={totalSpent}
          icon={<DollarSign className="h-5 w-5" />}
          iconBg="bg-primary-500"
          comparison={{ type: 'up', value: 12.5 }}
        />
        <SpendingOverviewCard
          title="Average Daily"
          amount={totalSpent > 0 ? totalSpent / 30 : 0}
          icon={<Calendar className="h-5 w-5" />}
          iconBg="bg-secondary-700"
          comparison={{ type: 'down', value: 3.2 }}
        />
        <SpendingOverviewCard
          title="Top Category"
          amount={Object.values(spendingByCategory).length > 0 
            ? Math.max(...Object.values(spendingByCategory))
            : 0}
          text={Object.keys(spendingByCategory).length > 0 
            ? Object.keys(spendingByCategory).reduce((a, b) => 
                spendingByCategory[a] > spendingByCategory[b] ? a : b
              )
            : 'None'}
          icon={<ShoppingBag className="h-5 w-5" />}
          iconBg="bg-accent-500"
        />
        <SpendingOverviewCard
          title="Saved This Month"
          amount={480}
          icon={<Shield className="h-5 w-5" />}
          iconBg="bg-success-500"
          comparison={{ type: 'up', value: 8.1 }}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
          <h2 className="text-xl font-display font-semibold text-gray-800 mb-4">Spending by Category</h2>
          <div className="h-64">
            <Doughnut data={doughnutData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
          <h2 className="text-xl font-display font-semibold text-gray-800 mb-4">Monthly Spending Trends</h2>
          <div className="h-64">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>
      </div>

      {/* Additional Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <BudgetStatusCard />
        <ExpenseSummaryCard expenses={expenses} />
        <RecentExpensesCard expenses={expenses} />
      </div>
    </div>
  );
};

export default Dashboard;