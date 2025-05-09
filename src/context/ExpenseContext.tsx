import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Types
export type ExpenseCategory = 
  | 'food' 
  | 'transportation' 
  | 'housing' 
  | 'utilities' 
  | 'entertainment' 
  | 'healthcare' 
  | 'education' 
  | 'shopping' 
  | 'personal' 
  | 'other';

export interface Expense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  description: string;
  date: string;
}

interface ExpenseState {
  expenses: Expense[];
  isLoading: boolean;
  error: string | null;
}

type ExpenseAction = 
  | { type: 'ADD_EXPENSE'; payload: Expense }
  | { type: 'SET_EXPENSES'; payload: Expense[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string };

// Initial state
const initialState: ExpenseState = {
  expenses: [],
  isLoading: false,
  error: null,
};

// Reducer
const expenseReducer = (state: ExpenseState, action: ExpenseAction): ExpenseState => {
  switch (action.type) {
    case 'ADD_EXPENSE':
      return {
        ...state,
        expenses: [...state.expenses, action.payload],
        isLoading: false,
      };
    case 'SET_EXPENSES':
      return {
        ...state,
        expenses: action.payload,
        isLoading: false,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    default:
      return state;
  }
};

// Create context
interface ExpenseContextType {
  state: ExpenseState;
  addExpense: (expense: Omit<Expense, 'id'>) => Promise<void>;
  fetchExpenses: () => Promise<void>;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

// Provider component
export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(expenseReducer, initialState);

  // Fetch expenses from API
  const fetchExpenses = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await fetch('http://localhost:3001/api/expenses');
      const data = await response.json();
      dispatch({ type: 'SET_EXPENSES', payload: data });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch expenses' });
      console.error('Error fetching expenses:', error);
    }
  };

  // Add new expense
  const addExpense = async (expense: Omit<Expense, 'id'>) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await fetch('http://localhost:3001/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(expense),
      });
      const data = await response.json();
      dispatch({ type: 'ADD_EXPENSE', payload: data });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add expense' });
      console.error('Error adding expense:', error);
    }
  };

  // Load expenses when the component mounts
  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <ExpenseContext.Provider value={{ state, addExpense, fetchExpenses }}>
      {children}
    </ExpenseContext.Provider>
  );
};

// Custom hook to use the expense context
export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
};