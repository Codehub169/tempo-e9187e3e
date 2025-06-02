import prisma from '../../../lib/prisma';
import { getSession } from '../../../lib/authUtils'; // Placeholder

export default async function handle(req, res) {
  const { id } = req.query;

  const session = await getSession(req); // Placeholder session check
  if (!session || !session.userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  const userId = session.userId;

  if (req.method === 'GET') {
    try {
      const category = await prisma.category.findFirst({
        where: {
          id: id,
          userId: userId,
        },
      });
      if (!category) {
        return res.status(404).json({ error: 'Category not found or not owned by user' });
      }
      res.status(200).json(category);
    } catch (error) {
      console.error('Failed to fetch category:', error);
      res.status(500).json({ error: 'Failed to fetch category', details: error.message });
    }
  } else if (req.method === 'PUT') {
    const { name } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Category name is required.' });
    }

    try {
      const categoryToUpdate = await prisma.category.findFirst({
        where: {
          id: id,
          userId: userId,
        },
      });

      if (!categoryToUpdate) {
        return res.status(404).json({ error: 'Category not found or not owned by user' });
      }
      
      // Check if another category with the same name already exists for this user (excluding the current one)
      const existingCategoryWithName = await prisma.category.findFirst({
        where: {
          name: name,
          userId: userId,
          NOT: {
            id: id,
          },
        }
      });

      if (existingCategoryWithName) {
        return res.status(409).json({ error: 'Another category with this name already exists.' });
      }

      const updatedCategory = await prisma.category.update({
        where: { id: id }, // Ownership already checked
        data: {
          name,
        },
      });
      res.status(200).json(updatedCategory);
    } catch (error) {
      console.error('Failed to update category:', error);
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Category not found.' });
      }
      res.status(500).json({ error: 'Failed to update category', details: error.message });
    }
  } else if (req.method === 'DELETE') {
    try {
      const categoryToDelete = await prisma.category.findFirst({
        where: {
          id: id,
          userId: userId,
        },
      });

      if (!categoryToDelete) {
        return res.status(404).json({ error: 'Category not found or not owned by user' });
      }

      // Prisma handles disconnecting relations automatically for many-to-many if using `delete` on the model.
      // No need to manually disconnect from posts here for SQLite with default relation mode.
      await prisma.category.delete({
        where: { id: id }, // Ownership already checked
      });
      res.status(204).end(); // No content
    } catch (error) {
      console.error('Failed to delete category:', error);
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Category not found.' });
      }
      res.status(500).json({ error: 'Failed to delete category', details: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
