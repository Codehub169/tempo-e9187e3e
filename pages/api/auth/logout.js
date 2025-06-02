import cookie from 'cookie';
import { destroySession } from '../../../lib/authUtils'; // Assuming destroySession is a placeholder

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const sessionToken = req.cookies['app-session'];

  if (sessionToken) {
    // Placeholder for actual session destruction logic
    await destroySession(sessionToken); 
  }

  // Clear the cookie by setting its Max-Age to -1
  res.setHeader('Set-Cookie', cookie.serialize('app-session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    expires: new Date(0),
    path: '/',
    sameSite: 'lax',
  }));

  return res.status(200).json({ message: 'Logged out successfully' });
}
