import { jwtDecode } from 'jwt-decode';

export type UserRole = 'buyer' | 'vendor' | 'rider';

export interface User {
  id: string;
  email: string;
  role: UserRole;
}

export interface DecodedToken {
  id: string;
  email: string;
  role: UserRole;
  exp: number;
}

export const setToken = (token: string) => {
  localStorage.setItem('token', token);
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const removeToken = () => {
  localStorage.removeItem('token');
};

export const getUserFromToken = (): User | null => {
  const token = getToken();
  if (!token) return null;

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };
  } catch (error) {
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  const token = getToken();
  if (!token) return false;

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded.exp * 1000 > Date.now();
  } catch (error) {
    return false;
  }
};

export const hasRole = (requiredRole: UserRole): boolean => {
  const user = getUserFromToken();
  return user?.role === requiredRole;
}; 