'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import { 
  HomeIcon, 
  UserCircleIcon, 
  ShoppingCartIcon, 
  TruckIcon, 
  BuildingStorefrontIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const getRoleIcon = () => {
    if (!user) return null;
    
    switch (user.role) {
      case 'buyer':
        return <ShoppingCartIcon className="h-5 w-5" />;
      case 'vendor':
        return <BuildingStorefrontIcon className="h-5 w-5" />;
      case 'rider':
        return <TruckIcon className="h-5 w-5" />;
      default:
        return <UserCircleIcon className="h-5 w-5" />;
    }
  };

  const getRoleText = () => {
    if (!user) return '';
    
    switch (user.role) {
      case 'buyer':
        return 'Buyer Dashboard';
      case 'vendor':
        return 'Vendor Dashboard';
      case 'rider':
        return 'Rider Dashboard';
      default:
        return 'Dashboard';
    }
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center">
                <HomeIcon className="h-8 w-8 text-sky-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">Construction App</span>
              </Link>
            </div>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-8">
            {user ? (
              <>
                <Link 
                  href={`/dashboard/${user.role}`}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-sky-600 transition-colors"
                >
                  {getRoleIcon()}
                  <span className="ml-2">{getRoleText()}</span>
                </Link>
                <div className="flex items-center">
                  <span className="text-sm text-gray-700 mr-4">Welcome, {user.name}</span>
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors"
                  >
                    <ArrowRightOnRectangleIcon className="h-5 w-5 mr-1" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link 
                  href="/login"
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-sky-600 transition-colors"
                >
                  Login
                </Link>
                <Link 
                  href="/register"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky-500"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <XMarkIcon className="block h-6 w-6" />
              ) : (
                <Bars3Icon className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {user ? (
              <>
                <Link
                  href={`/dashboard/${user.role}`}
                  className="flex items-center px-4 py-2 text-base font-medium text-gray-700 hover:text-sky-600 hover:bg-gray-50 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {getRoleIcon()}
                  <span className="ml-2">{getRoleText()}</span>
                </Link>
                <div className="px-4 py-2 text-base text-gray-700">
                  Welcome, {user.name}
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex w-full items-center px-4 py-2 text-base font-medium text-gray-700 hover:text-sky-600 hover:bg-gray-50 transition-colors"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-sky-600 hover:bg-gray-50 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-sky-600 hover:bg-gray-50 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
} 