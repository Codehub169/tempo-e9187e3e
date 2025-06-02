import prisma from '../../../lib/prisma';
import { getSession } from '../../../lib/authUtils'; // Assuming getSession is a placeholder

export default async function handler(req, res) {
  const sessionToken = req.cookies['app-session'];
  let session;
  try {
    session = await getSession(sessionToken);
  } catch (error) {
    console.error('Session retrieval error:', error);
    return res.status(500).json({ message: 'Session retrieval failed' });
  }

  if (!session || !session.userId) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  const userId = session.userId;

  if (req.method === 'GET') {
    try {
      const posts = await prisma.post.findMany({
        where: { userId },
        include: {
          categories: true,
          tags: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      return res.status(200).json(posts);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      return res.status(500).json({ message: 'Failed to fetch posts' });
    }
  } else if (req.method === 'POST') {
    const { title, content, categoryIds, tagIds } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    try {
      const postData = {
        title,
        content,
        userId,
      };

      if (categoryIds && Array.isArray(categoryIds) && categoryIds.length > 0) {
        postData.categories = {
          connect: categoryIds.map(id => ({ id })),
        };
      }

      if (tagIds && Array.isArray(tagIds) && tagIds.length > 0) {
        postData.tags = {
          connect: tagIds.map(id => ({ id })),
        };
      }

      const newPost = await prisma.post.create({
        data: postData,
        include: {
            categories: true,
            tags: true,
        }
      });
      return res.status(201).json(newPost);
    } catch (error) {
      console.error('Failed to create post:', error);
      // Check for specific Prisma errors, e.g., foreign key constraint for categories/tags if needed
      if (error.code === 'P2025' && error.meta && error.meta.cause && error.meta.cause.includes('foreign key constraint')) {
        return res.status(400).json({ message: 'Invalid category or tag ID provided.' });
      }
      return res.status(500).json({ message: 'Failed to create post' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}
