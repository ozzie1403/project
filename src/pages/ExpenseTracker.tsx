import React, { useState } from 'react';
import { PlusCircle, Filter, ArrowDownUp } from 'lucide-react';
import { useExpenses, ExpenseCategory } from '../context/ExpenseContext';
import ExpenseForm from '../components/expenses/ExpenseForm';
import ExpensesList from '../components/expenses/ExpensesList';
import ExpenseFilters from '../components/expenses/ExpenseFilters';
import { useBudget } from '../context/BudgetContext';

const ExpenseTracker: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const { state } = useExpenses();
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | 'all'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const { budgets, summary, fetchBudgets, setBudget, fetchSummary, loading: budgetLoading, error: budgetError } = useBudget();
  const [editCategory, setEditCategory] = useState<ExpenseCategory | null>(null);
  const [budgetInput, setBudgetInput] = useState<number>(0);

  React.useEffect(() => {
    fetchBudgets();
    fetchSummary();
  }, [fetchBudgets, fetchSummary]);

  const handleBudgetSave = async (category: ExpenseCategory) => {
    await setBudget(category, budgetInput);
    setEditCategory(null);
  };

  // Get filtered and sorted expenses
  const getFilteredExpenses = () => {
    let filtered = [...state.expenses];
    
    // Filter by category if not 'all'
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(expense => expense.category === selectedCategory);
    }
    
    // Sort expenses
    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      } else {
        return sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount;
      }
    });
    
    return filtered;
  };

  const handleSortToggle = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleSortByChange = (sortType: 'date' | 'amount') => {
    setSortBy(sortType);
  };

  const filteredExpenses = getFilteredExpenses();
  
  return (
    <div className="space-y-6 animate-fade-in">
      <header>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-800">Expense Tracker</h1>
        <p className="text-gray-500 mt-1">Record and manage your daily expenses</p>
      </header>

      {/* Budget & Summary Section */}
      <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100 mb-4">
        <h2 className="text-lg font-semibold mb-2">Budgets & Monthly Summary</h2>
        {budgetError && <div className="text-red-500 mb-2">{budgetError}</div>}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr>
                <th className="text-left p-2">Category</th>
                <th className="text-left p-2">Budget</th>
                <th className="text-left p-2">Spent</th>
                <th className="text-left p-2">Status</th>
                <th className="text-left p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(budgets).map((cat) => (
                <tr key={cat}>
                  <td className="p-2 font-medium">{cat}</td>
                  <td className="p-2">
                    {editCategory === cat ? (
                      <input
                        type="number"
                        value={budgetInput}
                        min={0}
                        onChange={e => setBudgetInput(Number(e.target.value))}
                        className="border rounded px-2 py-1 w-20"
                      />
                    ) : (
                      budgets[cat as ExpenseCategory] || 0
                    )}
                  </td>
                  <td className="p-2">{summary[cat]?.spent ?? 0}</td>
                  <td className="p-2">
                    {summary[cat]?.overBudget ? (
                      <span className="text-red-600 font-bold">Over Budget!</span>
                    ) : (
                      <span className="text-green-700">OK</span>
                    )}
                  </td>
                  <td className="p-2">
                    {editCategory === cat ? (
                      <button
                        className="bg-primary-600 text-white px-2 py-1 rounded mr-2"
                        onClick={() => handleBudgetSave(cat as ExpenseCategory)}
                        disabled={budgetLoading}
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        className="bg-gray-200 px-2 py-1 rounded"
                        onClick={() => {
                          setEditCategory(cat as ExpenseCategory);
                          setBudgetInput(budgets[cat as ExpenseCategory] || 0);
                        }}
                      >
                        Set/Update
                      </button>
                    )}
                    {editCategory === cat && (
                      <button
                        className="ml-2 text-gray-500 hover:text-gray-700"
                        onClick={() => setEditCategory(null)}
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 justify-between items-center">
        <div className="flex gap-2">
          <button 
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Add Expense</span>
          </button>
          
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
              showFilters ? 'bg-gray-200 text-gray-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Filter className="w-5 h-5" />
            <span className="hidden sm:inline">Filter</span>
          </button>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex text-sm bg-gray-100 rounded-lg overflow-hidden">
            <button 
              onClick={() => handleSortByChange('date')}
              className={`px-3 py-1.5 ${sortBy === 'date' ? 'bg-gray-200 font-medium' : 'hover:bg-gray-200'}`}
            >
              Date
            </button>
            <button 
              onClick={() => handleSortByChange('amount')}
              className={`px-3 py-1.5 ${sortBy === 'amount' ? 'bg-gray-200 font-medium' : 'hover:bg-gray-200'}`}
            >
              Amount
            </button>
          </div>
          
          <button 
            onClick={handleSortToggle}
            className="p-1.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            title={`Sort ${sortOrder === 'asc' ? 'ascending' : 'descending'}`}
          >
            <ArrowDownUp className="w-5 h-5" style={{ 
              transform: sortOrder === 'asc' ? 'rotate(0deg)' : 'rotate(180deg)',
              transition: 'transform 0.2s ease' 
            }} />
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <ExpenseFilters 
          selectedCategory={selectedCategory} 
          setSelectedCategory={setSelectedCategory} 
        />
      )}

      {/* Add Expense Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100 animate-slide-up">
          <ExpenseForm onFormClose={() => setShowForm(false)} />
        </div>
      )}

      {/* Expenses List */}
      <ExpensesList 
        expenses={filteredExpenses} 
        isLoading={state.isLoading} 
        error={state.error} 
      />
    </div>
  );
};

export default ExpenseTracker;