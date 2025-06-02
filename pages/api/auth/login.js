import prisma from '../../../lib/prisma';
import { comparePassword, createSession } from '../../../lib/authUtils'; // Using placeholder createSession
import cookie from 'cookie';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValidPassword = await comparePassword(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Placeholder session creation (e.g., JWT or basic token)
    // In a real app, ensure this is secure and properly managed.
    const sessionToken = await createSession({ userId: user.id, email: user.email }); 

    // Set a cookie with the session token (placeholder)
    // In a real app, use secure, httpOnly cookies and manage expiration properly.
    res.setHeader('Set-Cookie', cookie.serialize('auth_token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    }));

    // Omit password from the response
    const { password: _, ...userWithoutPassword } = user;

    return res.status(200).json({ user: userWithoutPassword, token: sessionToken });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
