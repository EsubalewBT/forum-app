import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { clearTokens, getAccessToken } from '../Utils/tokenStore';


const Header = () => {
    const location= useLocation();
    const navigate = useNavigate();
    const isLoginPage = location.pathname === '/login' || location.pathname === '/';
    const hasToken = Boolean(getAccessToken());

    const handleLogout = () => {
      clearTokens();
      navigate('/login');
    };
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Menu className="w-6 h-6 text-gray-700 mr-2" />
            <span className="text-2xl font-bold">
              <span className="text-gray-800">THINK</span>
              <span className="text-orange-500">THANK</span>
            </span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to={hasToken ? '/home' : '/'}
              className="text-gray-700 hover:text-gray-900 font-medium"
            >
              Home
            </Link>
            <Link to="/how" className="text-gray-700 hover:text-gray-900 font-medium">
              How it Works
            </Link>
            {hasToken ? (
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
              >
                LOG OUT
              </button>
            ) : (
              <Link
                to={isLoginPage ? '/signup' : '/login'}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
              >
                {isLoginPage ? 'SIGN UP' : 'SIGN IN'}
              </Link>
            )}

          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Menu className="w-6 h-6 text-gray-700" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;