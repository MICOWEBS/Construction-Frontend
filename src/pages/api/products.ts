import { NextApiRequest, NextApiResponse } from 'next';
import { getUserFromToken } from '@/utils/auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = getUserFromToken();
    if (!user || user.role !== 'vendor') {
      return res.status(403).json({ message: 'Only vendors can create product listings' });
    }

    const { name, description, price } = req.body;

    if (!name || !description || price === undefined) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // In a real application, you would save this to your database
    // For now, we'll just return a success response
    return res.status(201).json({
      message: 'Product created successfully',
      product: {
        id: Math.random().toString(36).substr(2, 9),
        name,
        description,
        price,
        vendorId: user.id,
        createdAt: new Date().toISOString(),
      }
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 