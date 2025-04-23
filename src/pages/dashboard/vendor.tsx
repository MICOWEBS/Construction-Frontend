import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Layout from '../../components/Layout';
import { PageLoadingSpinner } from '../../components/LoadingSpinner';
import ProductListingForm from '../../components/ProductListingForm';
import { BuildingStorefrontIcon, PlusIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  vendorId: string;
  createdAt: string;
}

export default function VendorDashboard() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

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
              vendorId: user?.id || '',
              createdAt: new Date().toISOString(),
            },
            {
              id: '2',
              name: 'Steel Rebar',
              description: 'Grade 60 steel rebar for structural reinforcement',
              price: 89.99,
              vendorId: user?.id || '',
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
  }, [user?.id]);

  const handleAddProduct = (newProduct: Omit<Product, 'id' | 'vendorId' | 'createdAt'>) => {
    const product: Product = {
      ...newProduct,
      id: Math.random().toString(36).substr(2, 9),
      vendorId: user?.id || '',
      createdAt: new Date().toISOString(),
    };
    
    setProducts([...products, product]);
    setShowAddForm(false);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowAddForm(true);
  };

  const handleUpdateProduct = (updatedProduct: Omit<Product, 'id' | 'vendorId' | 'createdAt'>) => {
    if (!editingProduct) return;
    
    const updatedProducts = products.map(p => 
      p.id === editingProduct.id 
        ? { ...p, ...updatedProduct } 
        : p
    );
    
    setProducts(updatedProducts);
    setEditingProduct(null);
    setShowAddForm(false);
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  if (loading) {
    return <PageLoadingSpinner />;
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="bg-white shadow-sm rounded-lg p-6">
          <div className="flex items-center">
            <div className="bg-sky-100 p-3 rounded-full">
              <BuildingStorefrontIcon className="h-8 w-8 text-sky-600" />
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-gray-900">Vendor Dashboard</h1>
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
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Your Products</h2>
            <button
              type="button"
              onClick={() => {
                setEditingProduct(null);
                setShowAddForm(true);
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Product
            </button>
          </div>

          {showAddForm && (
            <div className="px-6 py-4 border-b border-gray-200">
              <ProductListingForm 
                onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}
                initialValues={editingProduct || undefined}
                onCancel={() => {
                  setShowAddForm(false);
                  setEditingProduct(null);
                }}
              />
            </div>
          )}

          <div className="divide-y divide-gray-200">
            {products.length === 0 ? (
              <div className="px-6 py-8 text-center">
                <BuildingStorefrontIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No products yet</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by adding your first product.</p>
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProduct(null);
                      setShowAddForm(true);
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors"
                  >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Add Product
                  </button>
                </div>
              </div>
            ) : (
              products.map((product) => (
                <div key={product.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-gray-900 truncate">{product.name}</h3>
                      <p className="mt-1 text-sm text-gray-500">{product.description}</p>
                      <div className="mt-2 text-sm text-gray-500">
                        Added on {new Date(product.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 md:ml-6 flex flex-col md:flex-row md:items-center">
                      <div className="text-lg font-semibold text-gray-900">
                        ${product.price.toFixed(2)}
                      </div>
                      <div className="mt-2 md:mt-0 md:ml-4 flex space-x-2">
                        <button
                          type="button"
                          onClick={() => handleEditProduct(product)}
                          className="inline-flex items-center p-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(product.id)}
                          className="inline-flex items-center p-2 border border-gray-300 rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
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