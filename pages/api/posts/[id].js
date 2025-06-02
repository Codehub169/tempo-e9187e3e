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
      const post = await prisma.post.findFirst({
        where: {
          id: id,
          userId: userId,
        },
        include: {
          categories: true,
          tags: true,
        },
      });
      if (!post) {
        return res.status(404).json({ error: 'Post not found or not owned by user' });
      }
      res.status(200).json(post);
    } catch (error) {
      console.error('Failed to fetch post:', error);
      res.status(500).json({ error: 'Failed to fetch post', details: error.message });
    }
  } else if (req.method === 'PUT') {
    const { title, content, categoryIds, tagIds } = req.body;

    if (!title || title.trim() === '') {
        return res.status(400).json({ error: 'Title is required.' });
    }

    try {
      const existingPost = await prisma.post.findFirst({
        where: {
          id: id,
          userId: userId,
        },
      });

      if (!existingPost) {
        return res.status(404).json({ error: 'Post not found or not owned by user' });
      }

      const updatedPost = await prisma.post.update({
        where: { id: id }, // No need to check userId here again as we've verified ownership
        data: {
          title,
          content,
          categories: {
            set: categoryIds ? categoryIds.map(catId => ({ id: catId })) : [],
          },
          tags: {
            set: tagIds ? tagIds.map(tagId => ({ id: tagId })) : [],
          },
        },
        include: {
          categories: true,
          tags: true,
        },
      });
      res.status(200).json(updatedPost);
    } catch (error) {
      console.error('Failed to update post:', error);
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Post not found or related category/tag not found.' });
      }
      res.status(500).json({ error: 'Failed to update post', details: error.message });
    }
  } else if (req.method === 'DELETE') {
    try {
      const post = await prisma.post.findFirst({
        where: {
          id: id,
          userId: userId,
        },
      });

      if (!post) {
        return res.status(404).json({ error: 'Post not found or not owned by user' });
      }
      
      await prisma.post.delete({
        where: { id: id }, // No need to check userId here again
      });
      res.status(204).end(); // No content
    } catch (error) {
      console.error('Failed to delete post:', error);
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Post not found.' });
      }
      res.status(500).json({ error: 'Failed to delete post', details: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
