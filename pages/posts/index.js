import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router'; // Added for potential redirection
import Layout from '@/components/Layout';
import Button from '@/components/ui/Button';
import PostListItem from '@/components/posts/PostListItem';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
// import { useSession, getSession } from 'next-auth/react'; // Example for session handling

export default function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter(); // Added for potential redirection

  // Example: const { data: session, status } = useSession();
  // useEffect(() => {
  //   const checkSession = async () => {
  //     const session = await getSession(); // Or use useSession hook
  //     if (!session) {
  //       router.push('/login');
  //     }
  //   };
  //   checkSession();
  // }, [router]);

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/posts');
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({})); // Try to parse error, default to empty obj
          throw new Error(errorData.message || `Failed to fetch posts. Status: ${response.status}`);
        }
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    // if (status === 'authenticated') { // Only fetch if authenticated (using next-auth example)
    fetchPosts();
    // } else if (status === 'unauthenticated') {
    //   router.push('/login');
    // }
  }, [router]); // Add dependencies like router or session status if needed

  const handleDeletePost = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        const response = await fetch(`/api/posts/${postId}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || 'Failed to delete post');
        }
        setPosts(posts.filter(post => post.id !== postId));
      } catch (err) {
        console.error('Delete error:', err);
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

        {loading && <div className="flex justify-center items-center h-64"><LoadingSpinner /></div>}
        {error && <p className="text-center text-error-600 bg-error-100 p-4 rounded-md">Error: {error}</p>}
        
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
