'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  vendorId: string;
  createdAt: string;
}

interface ProductListingFormProps {
  onSubmit: (product: Omit<Product, 'id' | 'vendorId' | 'createdAt'>) => void;
  initialValues?: Product;
  onCancel: () => void;
}

export default function ProductListingForm({ onSubmit, initialValues, onCancel }: ProductListingFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState(initialValues?.name || '');
  const [description, setDescription] = useState(initialValues?.description || '');
  const [price, setPrice] = useState(initialValues?.price.toString() || '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialValues) {
      setName(initialValues.name);
      setDescription(initialValues.description);
      setPrice(initialValues.price.toString());
    }
  }, [initialValues]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(Number(price)) || Number(price) <= 0) {
      newErrors.price = 'Price must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          name,
          description,
          price: Number(price),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create product listing');
      }

      toast.success('Product listed successfully!');
      router.refresh();
      onSubmit({
        name,
        description,
        price: Number(price),
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-slate-800 mb-4">Create New Product Listing</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Product Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`mt-1 block w-full rounded-lg border ${
              errors.name ? 'border-red-300' : 'border-gray-300'
            } shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm`}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className={`mt-1 block w-full rounded-lg border ${
              errors.description ? 'border-red-300' : 'border-gray-300'
            } shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm`}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Price ($)
          </label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            min="0"
            step="0.01"
            className={`mt-1 block w-full rounded-lg border ${
              errors.price ? 'border-red-300' : 'border-gray-300'
            } shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm`}
          />
          {errors.price && (
            <p className="mt-1 text-sm text-red-600">{errors.price}</p>
          )}
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors"
          >
            {isLoading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
            ) : (
              'Add Product'
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 