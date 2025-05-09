import React, { createContext, useContext, useState, useCallback } from 'react';
import { ExpenseCategory } from './ExpenseContext';

export interface BudgetSummary {
  [category: string]: {
    spent: number;
    budget: number;
    overBudget: boolean;
  };
}

interface BudgetContextType {
  budgets: { [key in ExpenseCategory]?: number };
  summary: BudgetSummary;
  fetchBudgets: () => Promise<void>;
  setBudget: (category: ExpenseCategory, amount: number) => Promise<void>;
  fetchSummary: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export const BudgetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [budgets, setBudgets] = useState<{ [key in ExpenseCategory]?: number }>({});
  const [summary, setSummary] = useState<BudgetSummary>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBudgets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:3001/api/budgets');
      const data = await res.json();
      setBudgets(data);
    } catch (err) {
      setError('Failed to fetch budgets');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSummary = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:3001/api/summary');
      const data = await res.json();
      setSummary(data);
    } catch (err) {
      setError('Failed to fetch summary');
    } finally {
      setLoading(false);
    }
  }, []);

  const setBudget = useCallback(async (category: ExpenseCategory, amount: number) => {
    setLoading(true);
    setError(null);
    try {
      await fetch('http://localhost:3001/api/budgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, amount }),
      });
      await fetchBudgets();
      await fetchSummary();
    } catch (err) {
      setError('Failed to set budget');
    } finally {
      setLoading(false);
    }
  }, [fetchBudgets, fetchSummary]);

  return (
    <BudgetContext.Provider value={{ budgets, summary, fetchBudgets, setBudget, fetchSummary, loading, error }}>
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudget = () => {
  const context = useContext(BudgetContext);
  if (!context) throw new Error('useBudget must be used within a BudgetProvider');
  return context;
}; 