import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getDashboard } from '../../utils/api';
import Layout from '../../components/Layout';
import { PageLoadingSpinner } from '../../components/LoadingSpinner';

interface Delivery {
  id: string;
  product: {
    title: string;
    price: number;
  };
  buyer: {
    name: string;
    email: string;
    address: string;
  };
  status: 'pending' | 'in-progress' | 'delivered';
}

export default function RiderDashboard() {
  const { user, logout } = useAuth();
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getDashboard('rider');
        if (response.status === 'success' && response.data) {
          setDeliveries(response.data.deliveries || []);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch deliveries');
        if (err.status === 401) {
          // Token is invalid or expired
          logout();
        }
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDeliveries();
    }
  }, [user, logout]);

  const handleStatusChange = async (deliveryId: string, newStatus: Delivery['status']) => {
    try {
      // TODO: Implement status update API call
      setDeliveries(deliveries.map(delivery => 
        delivery.id === deliveryId ? { ...delivery, status: newStatus } : delivery
      ));
    } catch (err: any) {
      setError(err.message || 'Failed to update delivery status');
    }
  };

  if (!user) {
    return <PageLoadingSpinner />;
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="bg-white shadow-sm rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Rider Dashboard</h1>
              <p className="ml-4 text-gray-600">Welcome back, {user.name}</p>
            </div>
          </div>
        </div>

        {loading ? (
          <PageLoadingSpinner />
        ) : error ? (
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 text-sm font-medium text-red-600 hover:text-red-500"
            >
              Try again
            </button>
          </div>
        ) : (
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Your Deliveries</h2>
            </div>

            {deliveries.length === 0 ? (
              <div className="px-6 py-8 text-center">
                <h3 className="text-gray-500 text-lg">No deliveries available</h3>
                <p className="mt-1 text-sm text-gray-400">
                  New delivery requests will appear here
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {deliveries.map((delivery) => (
                  <div key={delivery.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {delivery.product.title}
                        </h3>
                        <p className="mt-1 text-gray-600">
                          Price: ${delivery.product.price.toFixed(2)}
                        </p>
                        <div className="mt-2">
                          <p className="text-sm text-gray-600">
                            Buyer: {delivery.buyer.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            Address: {delivery.buyer.address}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0 md:ml-6">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          delivery.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          delivery.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {delivery.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
} 