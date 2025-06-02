import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '@/components/Layout';
import PostForm from '@/components/posts/PostForm';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Button from '@/components/ui/Button';
// import { useSession } from 'next-auth/react'; // Example for session handling

export default function EditPostPage() {
  const router = useRouter();
  const { id } = router.query;
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true); // True initially as we expect to fetch if id is present
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [fetchError, setFetchError] = useState(null);

  // Example: const { data: session, status } = useSession();
  // const isAuthenticated = status === 'authenticated';

  const fetchPostCallback = useCallback(async (postId) => {
    // if (!isAuthenticated && status !== 'loading') {
    //   router.push('/login');
    //   return;
    // }
    // if (!isAuthenticated) return;

    setLoading(true);
    setFetchError(null);
    try {
      const response = await fetch(`/api/posts/${postId}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to parse error response.' }));
        if (response.status === 404) throw new Error('Post not found. It might have been deleted or the link is incorrect.');
        throw new Error(errorData.message || `Failed to fetch post data. Status: ${response.status}`);
      }
      const data = await response.json();
      setPost(data);
    } catch (err) {
      console.error('Fetch post error:', err);
      setFetchError(err.message);
    } finally {
      setLoading(false);
    }
  }, [/* router, isAuthenticated, status */]); // Dependencies for auth if used

  useEffect(() => {
    if (router.isReady && id) {
      // if (status === 'authenticated') { // Example with next-auth
      fetchPostCallback(id);
      // } else if (status === 'unauthenticated') {
      //   router.push('/login');
      // }
    } else if (router.isReady && !id) {
      // Router is ready, but no ID in query (e.g. navigating to /posts/edit directly)
      setLoading(false);
      setFetchError('No post ID provided.');
    }
    // If !router.isReady, initial loading state (true) handles spinner via render logic.
  }, [id, router.isReady, fetchPostCallback /*, status, router */]);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to parse error response.' }));
        throw new Error(errorData.message || `Failed to update post. Status: ${response.status}`);
      }
      router.push('/posts'); 
    } catch (err) {
      console.error('Failed to update post:', err);
      setSubmitError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Initial loading: waiting for router and then for data fetch
  if (!router.isReady || loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 flex justify-center items-center h-screen-minus-header">
          <LoadingSpinner />
        </div>
      </Layout>
    );
  }

  // After loading, check for fetch error
  if (fetchError) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center bg-white p-8 rounded-lg shadow-lg">
            <svg className="mx-auto h-12 w-12 text-error-500" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z" />
            </svg>
            <h1 className="mt-4 text-2xl font-bold font-display text-error-700 mb-3">Error Loading Post</h1>
            <p className="text-neutral-600 mb-6">{fetchError}</p>
            <Link href="/posts" passHref>
                <Button variant="primary">Back to Posts</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  // After loading and no fetch error, check if post data exists
  if (!post) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-neutral-700 text-lg">Post data is not available.</p>
          <p className="text-neutral-500">It might have been deleted or the link is incorrect.</p>
           <Link href="/posts" passHref>
                <Button variant="secondary" className="mt-4">Go to Posts</Button>
            </Link>
        </div>
      </Layout>
    );
  }

  // If all checks pass, render the form
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-neutral-800 mb-6 sm:mb-8 text-center sm:text-left">Edit Post</h1>
          {submitError && (
            <div className="mb-6 p-4 bg-error-100 text-error-700 border border-error-300 rounded-md">
              <p><strong className="font-semibold">Error:</strong> {submitError}</p>
            </div>
          )}
          <PostForm 
            initialData={post} 
            onSubmit={handleSubmit} 
            isSubmitting={isSubmitting} 
            submitButtonText="Save Changes"
          />
        </div>
      </div>
    </Layout>
  );
}
