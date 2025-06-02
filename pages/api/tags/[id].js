import prisma from '../../../../lib/prisma';
import { getSession } from '../../../../lib/authUtils'; // Placeholder

export default async function handle(req, res) {
  const { id: tagId } = req.query;

  // Simulate session for development until authUtils.js is fully implemented
  // const session = { userId: "clxya1qbu0000o4xpe3z805c8" }; // Replace with actual session logic
  const session = await getSession(req, res); // Placeholder: Implement actual session validation
  if (!session || !session.userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  const userId = session.userId;

  try {
    if (req.method === 'GET') {
      const tag = await prisma.tag.findFirst({
        where: {
          id: tagId,
          userId: userId,
        },
      });

      if (!tag) {
        return res.status(404).json({ error: 'Tag not found or access denied' });
      }
      res.status(200).json(tag);
    } else if (req.method === 'PUT') {
      const { name } = req.body;

      if (!name || name.trim() === '') {
        return res.status(400).json({ error: 'Tag name cannot be empty' });
      }

      // Check if tag exists and belongs to the user
      const existingTag = await prisma.tag.findFirst({
        where: {
          id: tagId,
          userId: userId,
        },
      });

      if (!existingTag) {
        return res.status(404).json({ error: 'Tag not found or access denied' });
      }

      // Check for duplicate tag name for the same user, excluding the current tag
      const duplicateTag = await prisma.tag.findFirst({
        where: {
          name: name.trim(),
          userId: userId,
          id: { not: tagId }, // Exclude the current tag being updated
        },
      });

      if (duplicateTag) {
        return res.status(409).json({ error: 'A tag with this name already exists for this user' });
      }

      const updatedTag = await prisma.tag.update({
        where: {
          id: tagId,
          // userId: userId, // Not strictly needed here as existingTag check covers ownership for update
        },
        data: {
          name: name.trim(),
        },
      });
      res.status(200).json(updatedTag);
    } else if (req.method === 'DELETE') {
      // Check if tag exists and belongs to the user before attempting delete
      const tagToDelete = await prisma.tag.findFirst({
        where: {
          id: tagId,
          userId: userId,
        },
      });

      if (!tagToDelete) {
        return res.status(404).json({ error: 'Tag not found or access denied for deletion' });
      }

      // Prisma will automatically handle disconnecting the tag from posts
      // due to the many-to-many relationship defined in schema.prisma (_PostToTag table)
      await prisma.tag.delete({
        where: {
          id: tagId,
          // userId: userId, // Not strictly needed here as findFirst check covers ownership
        },
      });
      res.status(200).json({ message: 'Tag deleted successfully' });
    } else {
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error(`API Error in /api/tags/${tagId}:`, error);
    // Generic error for unexpected issues
    let errorMessage = 'An unexpected error occurred.';
    let statusCode = 500;

    // Prisma specific errors
    if (error.code === 'P2025') { // Record to update/delete not found
        errorMessage = 'Tag not found or already deleted.';
        statusCode = 404;
    } else if (error.code === 'P2002') { // Unique constraint failed (should be caught by duplicate check earlier for PUT)
        errorMessage = 'A tag with this name already exists.'; // This might occur if the earlier check fails
        statusCode = 409;
    }

    res.status(statusCode).json({ error: errorMessage, details: process.env.NODE_ENV === 'development' ? error.message : undefined });
  }
}
