import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ExpenseTracker from './pages/ExpenseTracker';
import Resources from './pages/Resources';
import LoginPage from './pages/LoginPage';
import { ExpenseProvider } from './context/ExpenseContext';
import { BudgetProvider } from './context/BudgetContext';
import { AuthProvider, useAuth } from './context/AuthContext';

function App() {
  // PrivateRoute defined inside App to ensure it is within AuthProvider
  function PrivateRoute({ children }: { children: JSX.Element }) {
    const { user } = useAuth();
    return user ? children : <Navigate to="/login" replace />;
  }

  return (
    <AuthProvider>
      <BudgetProvider>
        <ExpenseProvider>
          <Layout>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/expenses" element={<PrivateRoute><ExpenseTracker /></PrivateRoute>} />
              <Route path="/resources" element={<PrivateRoute><Resources /></PrivateRoute>} />
            </Routes>
          </Layout>
        </ExpenseProvider>
      </BudgetProvider>
    </AuthProvider>
  );
}

export default App;