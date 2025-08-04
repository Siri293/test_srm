import React from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, Bell } from 'lucide-react';

const Header = ({ onMenuClick }) => {
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    switch (path) {
      case '/dashboard':
        return 'Dashboard';
      case '/subjects':
        return 'Subjects';
      case '/sessions':
        return 'Study Sessions';
      case '/audio':
        return 'Audio Notes';
      case '/profile':
        return 'Profile';
      case '/admin':
        return 'Admin Panel';
      default:
        return 'StudySphere';
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex items-center">
          <button
            onClick={onMenuClick}
            className="lg:hidden text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
          >
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="ml-4 lg:ml-0 text-2xl font-semibold text-gray-900">
            {getPageTitle()}
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <button className="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600">
            <Bell className="h-6 w-6" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;