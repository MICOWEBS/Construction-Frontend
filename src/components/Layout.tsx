'use client';

import { ReactNode } from 'react';
import Navbar from './Navbar';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-600 text-sm">
              © {new Date().getFullYear()} Construction App. All rights reserved.
            </div>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <a href="#" className="text-gray-500 hover:text-sky-600 transition-colors duration-200">
                Terms
              </a>
              <a href="#" className="text-gray-500 hover:text-sky-600 transition-colors duration-200">
                Privacy
              </a>
              <a href="#" className="text-gray-500 hover:text-sky-600 transition-colors duration-200">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 