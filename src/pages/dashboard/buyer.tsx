import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Layout from '../../components/Layout';
import { PageLoadingSpinner } from '../../components/LoadingSpinner';
import { ShoppingCartIcon, TruckIcon, BuildingStorefrontIcon } from '@heroicons/react/24/outline';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  vendorId: string;
  vendorName: string;
  createdAt: string;
}

export default function BuyerDashboard() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // In a real app, this would fetch from your API
    const fetchProducts = async () => {
      try {
        // Simulated API call
        setTimeout(() => {
          setProducts([
            {
              id: '1',
              name: 'Concrete Mix',
              description: 'High-quality concrete mix for construction projects',
              price: 45.99,
              vendorId: 'v1',
              vendorName: 'BuildRight Materials',
              createdAt: new Date().toISOString(),
            },
            {
              id: '2',
              name: 'Steel Rebar',
              description: 'Grade 60 steel rebar for structural reinforcement',
              price: 89.99,
              vendorId: 'v2',
              vendorName: 'Steel Solutions',
              createdAt: new Date().toISOString(),
            },
            {
              id: '3',
              name: 'Lumber Bundle',
              description: 'Premium treated lumber for outdoor construction',
              price: 129.99,
              vendorId: 'v1',
              vendorName: 'BuildRight Materials',
              createdAt: new Date().toISOString(),
            },
          ]);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError('Failed to load products. Please try again later.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <PageLoadingSpinner />;
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="bg-white shadow-sm rounded-lg p-6">
          <div className="flex items-center">
            <div className="bg-sky-100 p-3 rounded-full">
              <ShoppingCartIcon className="h-8 w-8 text-sky-600" />
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-gray-900">Buyer Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.name}</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Available Products</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {products.length === 0 ? (
              <div className="px-6 py-8 text-center">
                <BuildingStorefrontIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No products available</h3>
                <p className="mt-1 text-sm text-gray-500">Check back later for new products.</p>
              </div>
            ) : (
              products.map((product) => (
                <div key={product.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-gray-900 truncate">{product.name}</h3>
                      <p className="mt-1 text-sm text-gray-500">{product.description}</p>
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <BuildingStorefrontIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                        <span>{product.vendorName}</span>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 md:ml-6 flex flex-col md:flex-row md:items-center">
                      <div className="text-lg font-semibold text-gray-900">
                        ${product.price.toFixed(2)}
                      </div>
                      <button
                        type="button"
                        className="mt-2 md:mt-0 md:ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors"
                      >
                        <TruckIcon className="h-5 w-5 mr-2" />
                        Order Delivery
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
} 