import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Link from 'next/link';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { validateRegisterForm } from '../utils/validation';
import { 
  UserIcon, 
  EnvelopeIcon, 
  LockClosedIcon, 
  UserGroupIcon 
} from '@heroicons/react/24/outline';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'buyer' | 'vendor' | 'rider'>('buyer');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const validation = validateRegisterForm({ name, email, password, role });
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    try {
      setIsSubmitting(true);
      setFormErrors({});
      await register(name, email, password, role);
    } catch (err) {
      // Error is handled by the AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link href="/login" className="font-medium text-sky-600 hover:text-sky-500 transition-colors">
              sign in to your account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className={`appearance-none block w-full pl-10 pr-3 py-2 border ${
                    formErrors.name ? 'border-red-300' : 'border-gray-300'
                  } rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm transition-colors`}
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setFormErrors({ ...formErrors, name: '' });
                  }}
                />
              </div>
              {formErrors.name && (
                <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
              )}
            </div>
            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={`appearance-none block w-full pl-10 pr-3 py-2 border ${
                    formErrors.email ? 'border-red-300' : 'border-gray-300'
                  } rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm transition-colors`}
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setFormErrors({ ...formErrors, email: '' });
                  }}
                />
              </div>
              {formErrors.email && (
                <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className={`appearance-none block w-full pl-10 pr-3 py-2 border ${
                    formErrors.password ? 'border-red-300' : 'border-gray-300'
                  } rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm transition-colors`}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setFormErrors({ ...formErrors, password: '' });
                  }}
                />
              </div>
              {formErrors.password && (
                <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
              )}
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserGroupIcon className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  id="role"
                  name="role"
                  required
                  className={`appearance-none block w-full pl-10 pr-3 py-2 border ${
                    formErrors.role ? 'border-red-300' : 'border-gray-300'
                  } rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm transition-colors`}
                  value={role}
                  onChange={(e) => {
                    setRole(e.target.value as 'buyer' | 'vendor' | 'rider');
                    setFormErrors({ ...formErrors, role: '' });
                  }}
                >
                  <option value="buyer">Buyer</option>
                  <option value="vendor">Vendor</option>
                  <option value="rider">Rider</option>
                </select>
              </div>
              {formErrors.role && (
                <p className="mt-1 text-sm text-red-600">{formErrors.role}</p>
              )}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? (
                <LoadingSpinner />
              ) : (
                'Register'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 