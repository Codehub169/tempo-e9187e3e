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
      const tags = await prisma.tag.findMany({
        where: {
          userId: userId,
        },
        orderBy: {
          name: 'asc',
        },
      });
      res.status(200).json(tags);
    } catch (error) {
      console.error('Failed to fetch tags:', error);
      res.status(500).json({ error: 'Failed to fetch tags', details: error.message });
    }
  } else if (req.method === 'POST') {
    const { name } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Tag name is required.' });
    }

    try {
      // Check if tag with the same name already exists for this user
      const existingTag = await prisma.tag.findFirst({
        where: {
          name: name,
          userId: userId,
        }
      });

      if (existingTag) {
        return res.status(409).json({ error: 'A tag with this name already exists.' });
      }

      const newTag = await prisma.tag.create({
        data: {
          name,
          userId: userId,
        },
      });
      res.status(201).json(newTag);
    } catch (error) {
      console.error('Failed to create tag:', error);
      res.status(500).json({ error: 'Failed to create tag', details: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
