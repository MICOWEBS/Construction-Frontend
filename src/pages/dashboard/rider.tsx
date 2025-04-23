import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getDashboard } from '../../utils/api';
import Layout from '../../components/Layout';
import { PageLoadingSpinner } from '../../components/LoadingSpinner';

interface Delivery {
  id: string;
  productName: string;
  buyerName: string;
  address: string;
  status: 'pending' | 'in-progress' | 'delivered';
  createdAt: string;
}

interface DashboardResponse {
  status: 'success' | 'error';
  data?: {
    deliveries: Delivery[];
  };
  message?: string;
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
        const response = await getDashboard('rider') as DashboardResponse;
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

  if (loading) {
    return <PageLoadingSpinner />;
  }

  if (error) {
    return (
      <Layout>
        <div className="p-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      </Layout>
    );
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

        <div className="grid gap-4">
          {deliveries.map((delivery) => (
            <div
              key={delivery.id}
              className="bg-white p-4 rounded-lg shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{delivery.productName}</h3>
                  <p className="text-gray-600">Buyer: {delivery.buyerName}</p>
                  <p className="text-gray-600">Address: {delivery.address}</p>
                </div>
                <span className={`px-2 py-1 rounded text-sm ${
                  delivery.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  delivery.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {delivery.status}
                </span>
              </div>
              <div className="mt-2 text-sm text-gray-500">
                Created: {new Date(delivery.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
          
          {deliveries.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No deliveries assigned yet
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
} 