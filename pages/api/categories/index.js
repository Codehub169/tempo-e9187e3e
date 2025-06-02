import prisma from '../../../lib/prisma';
import { getSession } from '../../../lib/authUtils'; // Placeholder

export default async function handle(req, res) {
  const session = await getSession(req); // Placeholder session check
  if (!session || !session.userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  const userId = session.userId;

  if (req.method === 'GET') {
    try {
      const categories = await prisma.category.findMany({
        where: {
          userId: userId,
        },
        orderBy: {
          name: 'asc',
        },
      });
      res.status(200).json(categories);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      res.status(500).json({ error: 'Failed to fetch categories', details: error.message });
    }
  } else if (req.method === 'POST') {
    const { name } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Category name is required.' });
    }

    try {
      // Check if category with the same name already exists for this user
      const existingCategory = await prisma.category.findFirst({
        where: {
          name: name,
          userId: userId,
        }
      });

      if (existingCategory) {
        return res.status(409).json({ error: 'A category with this name already exists.' });
      }

      const newCategory = await prisma.category.create({
        data: {
          name,
          userId: userId,
        },
      });
      res.status(201).json(newCategory);
    } catch (error) {
      console.error('Failed to create category:', error);
      res.status(500).json({ error: 'Failed to create category', details: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
