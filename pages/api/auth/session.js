import prisma from '../../../lib/prisma';
import { getSession } from '../../../lib/authUtils'; // Assuming getSession is a placeholder

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const sessionToken = req.cookies['app-session'];

  if (!sessionToken) {
    return res.status(401).json({ message: 'Not authenticated', user: null });
  }

  try {
    // Placeholder for actual session retrieval logic
    const session = await getSession(sessionToken);

    if (!session || !session.userId) {
      return res.status(401).json({ message: 'Invalid session', user: null });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { id: true, name: true, email: true, createdAt: true, updatedAt: true }, // Explicitly select fields, exclude password
    });

    if (!user) {
      return res.status(401).json({ message: 'User not found for session', user: null });
    }

    return res.status(200).json({ user });

  } catch (error) {
    console.error('Session check error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
