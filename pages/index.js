import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
// import { getSession } from '../lib/authUtils'; // Placeholder: Session check will be implemented later

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null); // Placeholder for user session

  useEffect(() => {
    // Placeholder for session checking logic
    // const session = await getSession(); // This will be an async call
    // For now, simulate a logged-in user for development
    const mockSession = { user: { name: 'Test User' } }; 
    if (!mockSession) { // Replace with !session once getSession is implemented
      // router.push('/login');
      // Temporarily disable redirect to allow viewing the page during development
      console.log('User not logged in, redirect to /login (temporarily disabled)');
      setLoading(false);
    } else {
      setUser(mockSession.user);
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return <p className="text-center text-gray-500">Loading dashboard...</p>;
  }

  // Temporarily allow access even if not "logged in" for dev
  // if (!user) {
  //   return null; // Or a message indicating redirection
  // }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold font-display mb-8 text-gray-800">
        Welcome {user ? `, ${user.name}` : 'to your Dashboard'}
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/posts/new" legacyBehavior>
          <a className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold font-display text-primary-600 mb-2">Create New Post</h2>
            <p className="text-gray-600">Start writing your next masterpiece.</p>
          </a>
        </Link>
        <Link href="/posts" legacyBehavior>
          <a className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold font-display text-primary-600 mb-2">Manage Posts</h2>
            <p className="text-gray-600">View, edit, or delete your existing posts.</p>
          </a>
        </Link>
        <Link href="/categories" legacyBehavior>
          <a className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold font-display text-primary-600 mb-2">Manage Categories</h2>
            <p className="text-gray-600">Organize your posts with categories.</p>
          </a>
        </Link>
        <Link href="/tags" legacyBehavior>
          <a className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold font-display text-primary-600 mb-2">Manage Tags</h2>
            <p className="text-gray-600">Add tags for more granular organization.</p>
          </a>
        </Link>
      </div>
    </div>
  );
}
