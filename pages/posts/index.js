import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import Button from '@/components/ui/Button';
import PostListItem from '@/components/posts/PostListItem';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
// import { useSession } from 'next-auth/react'; // Example for session handling

export default function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Example: const { data: session, status } = useSession();
  // const isAuthenticated = status === 'authenticated'; // Example check

  const fetchPosts = useCallback(async () => {
    // if (!isAuthenticated && status !== 'loading') { // Example: Don't fetch if not auth and not loading session
    //   router.push('/login');
    //   return;
    // }
    // if (!isAuthenticated) return; // Example: Wait for auth

    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/posts');
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to parse error response.' }));
        throw new Error(errorData.message || `Failed to fetch posts. Status: ${response.status}`);
      }
      const data = await response.json();
      setPosts(data);
    } catch (err) {
      console.error('Fetch posts error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [/* router, isAuthenticated, status */]); // Add dependencies like router, session status if they affect fetching

  useEffect(() => {
    // For now, fetch posts unconditionally. Add session checks when auth is integrated.
    // if (status === 'authenticated') { // Using next-auth example
    fetchPosts();
    // } else if (status === 'unauthenticated') {
    //   router.push('/login');
    // }
  }, [fetchPosts /*, status, router */]); // Dependency: fetchPosts (and session status if used)

  const handleDeletePost = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        const response = await fetch(`/api/posts/${postId}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Failed to parse error response.' }));
          throw new Error(errorData.message || 'Failed to delete post');
        }
        setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
      } catch (err) {
        console.error('Delete post error:', err);
        // TODO: Replace alert with a more user-friendly notification system
        alert(`Error: ${err.message}`); 
      }
    }
  };

  // if (status === 'loading') { // Example with next-auth
  //   return <Layout><div className="flex justify-center items-center h-screen-minus-header"><LoadingSpinner /></div></Layout>;
  // }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold font-display text-neutral-800">Your Posts</h1>
          <Link href="/posts/new" passHref>
            <Button variant="primary" size="lg">Create New Post</Button>
          </Link>
        </div>

        {loading && (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner />
          </div>
        )}
        {error && !loading && (
          <p className="text-center text-error-600 bg-error-100 p-4 rounded-md">
            Error: {error}
          </p>
        )}
        
        {!loading && !error && posts.length === 0 && (
          <div className="text-center py-12 bg-white shadow-md rounded-lg">
            <svg className="mx-auto h-16 w-16 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            <h3 className="mt-4 text-xl font-semibold font-display text-neutral-900">No Posts Yet</h3>
            <p className="mt-2 text-sm text-neutral-600">Ready to share your thoughts? Get started by creating your first blog post.</p>
            <div className="mt-6">
              <Link href="/posts/new" passHref>
                <Button variant="primary" size="md">
                  Create Your First Post
                </Button>
              </Link>
            </div>
          </div>
        )}

        {!loading && !error && posts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostListItem key={post.id} post={post} onDelete={() => handleDeletePost(post.id)} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
