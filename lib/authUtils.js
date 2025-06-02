import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

export async function hashPassword(password) {
  if (!password) {
    throw new Error('Password cannot be empty');
  }
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  return hashedPassword;
}

export async function comparePassword(password, hashedPassword) {
  if (!password || !hashedPassword) {
    return false; // Or throw an error, depending on desired handling
  }
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
}

// Placeholder for session management logic.
// The user has indicated not to use iron-session at this time.
// Actual session creation, retrieval, and destruction will need to be implemented
// based on the chosen session management strategy.

export function createSession(res, user) {
  // This function would typically set a cookie with session data.
  // Example: using a library like 'cookie' and 'jsonwebtoken'
  // For now, it's a placeholder.
  console.warn('Session creation not implemented. User:', user);
  // const token = jwt.sign({ userId: user.id, email: user.email }, 'YOUR_JWT_SECRET', { expiresIn: '1h' });
  // res.setHeader('Set-Cookie', cookie.serialize('auth_token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 3600 }));
  return Promise.resolve();
}

export function getSession(req) {
  // This function would typically retrieve session data from a cookie.
  // Example: using 'cookie' and 'jsonwebtoken' to verify and decode the token.
  // For now, it's a placeholder.
  console.warn('Session retrieval not implemented.');
  // const cookies = cookie.parse(req.headers.cookie || '');
  // const token = cookies.auth_token;
  // if (token) {
  //   try {
  //     const decoded = jwt.verify(token, 'YOUR_JWT_SECRET');
  //     return decoded; // Contains { userId, email, iat, exp }
  //   } catch (error) {
  //     return null;
  //   }
  // }
  return Promise.resolve(null);
}

export function destroySession(res) {
  // This function would typically clear the session cookie.
  // For now, it's a placeholder.
  console.warn('Session destruction not implemented.');
  // res.setHeader('Set-Cookie', cookie.serialize('auth_token', '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: -1 }));
  return Promise.resolve();
}
