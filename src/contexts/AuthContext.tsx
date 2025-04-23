import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { login as apiLogin, register as apiRegister } from '../utils/api';
import axios from 'axios';

interface AuthContextType {
  user: any;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check for token and validate it
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    
    if (token && userRole) {
      // Set initial user state
      setUser({ role: userRole });
      
      // Validate token with backend
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      
      const validateToken = async () => {
        try {
          const response = await axios.get(`${apiUrl}/auth/validate`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          const responseData = response.data as { data?: { user?: any } };
          if (responseData && responseData.data && responseData.data.user) {
            setUser(responseData.data.user);
          }
        } catch (error) {
          // Clear invalid token
          localStorage.removeItem('token');
          localStorage.removeItem('userRole');
          setUser(null);
        } finally {
          setLoading(false);
        }
      };
      
      validateToken();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      const response = await apiLogin(email, password);
      setUser(response.user);
      localStorage.setItem('token', response.token);
      localStorage.setItem('userRole', response.user.role);
      router.push(`/dashboard/${response.user.role}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during login');
      throw err;
    }
  };

  const register = async (name: string, email: string, password: string, role: string) => {
    try {
      setError(null);
      const response = await apiRegister(name, email, password, role);
      setUser(response.user);
      localStorage.setItem('token', response.token);
      localStorage.setItem('userRole', response.user.role);
      router.push(`/dashboard/${response.user.role}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during registration');
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 