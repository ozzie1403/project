import React, { useState } from 'react';
import { PlusCircle, Filter, ArrowDownUp } from 'lucide-react';
import { useExpenses, ExpenseCategory } from '../context/ExpenseContext';
import ExpenseForm from '../components/expenses/ExpenseForm';
import ExpensesList from '../components/expenses/ExpensesList';
import ExpenseFilters from '../components/expenses/ExpenseFilters';

const ExpenseTracker: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const { state } = useExpenses();
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | 'all'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

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