import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { DollarSign, BarChart2, BookOpen, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const { logout, user } = useAuth();

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: <BarChart2 className="w-5 h-5" /> },
    { path: '/expenses', label: 'Expenses', icon: <DollarSign className="w-5 h-5" /> },
    { path: '/resources', label: 'Resources', icon: <BookOpen className="w-5 h-5" /> },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-primary-600 text-white shadow-md z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2" onClick={() => navigate('/')} role="button">
            <DollarSign className="h-8 w-8" />
            <h1 className="text-xl font-display font-bold">SmartSpend</h1>
          </div>
          
          {/* Mobile menu button */}
          <button className="md:hidden" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          
          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {menuItems.map((item) => (
              <button
                key={item.path}
                className={`flex items-center space-x-1 py-2 px-3 rounded-md transition-colors ${
                  location.pathname === item.path
                    ? 'bg-primary-700 text-white'
                    : 'hover:bg-primary-700/20'
                }`}
                onClick={() => navigate(item.path)}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
            {user && (
              <button
                className="ml-4 bg-white text-primary-700 px-3 py-2 rounded-md font-semibold hover:bg-primary-100 transition-colors"
                onClick={handleLogout}
              >
                Logout
              </button>
            )}
          </nav>
        </div>
      </header>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg animate-fade-in">
          <nav className="flex flex-col py-2">
            {menuItems.map((item) => (
              <button
                key={item.path}
                className={`flex items-center space-x-3 py-3 px-4 ${
                  location.pathname === item.path
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => {
                  navigate(item.path);
                  setIsMobileMenuOpen(false);
                }}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
            {user && (
              <button
                className="mt-2 mx-4 mb-3 bg-primary-600 text-white px-3 py-2 rounded-md font-semibold hover:bg-primary-700 transition-colors"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogout();
                }}
              >
                Logout
              </button>
            )}
          </nav>
        </div>
      )}
      
      {/* Main content */}
      <main className="flex-grow container mx-auto px-4 py-6">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-100 py-4 border-t border-gray-200">
        <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
          <p>© 2025 SmartSpend. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;